"""Renderiza imagens (PNG) de um projeto do gerador: perspectivas, frontal e planta.

É um rasterizador próprio (numpy, z-buffer, sombreamento plano + contornos),
para conferência visual FORA do Promob. Não representa o render do Promob.
Usa exatamente as malhas que vão para os arquivos (mesh.project_meshes).

Uso: PYTHONPATH=src python tools/render_projeto.py samples/quarto_casal_real.json docs/evidencias/quarto/Quarto
Requer: numpy, matplotlib.
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from promob_gen.mesh import project_meshes  # noqa: E402
from promob_gen.model import build_project, frame_box  # noqa: E402
from promob_gen.spec import load_spec  # noqa: E402

NEAR = 50.0  # mm


def _clip(tri, dist):
    """Recorta triângulo (3x3) mantendo a parte com dist(p) >= 0. Retorna lista de triângulos."""
    d = np.array([dist(p) for p in tri])
    if (d >= 0).all():
        return [tri]
    if (d < 0).all():
        return []
    poly = []
    for k in range(3):
        a, b, da, db = tri[k], tri[(k + 1) % 3], d[k], d[(k + 1) % 3]
        if da >= 0:
            poly.append(a)
        if (da >= 0) != (db >= 0):
            poly.append(a + da / (da - db) * (b - a))
    return [np.array([poly[0], poly[i], poly[i + 1]]) for i in range(1, len(poly) - 1)]


def scene(project, hide_walls=(), cut_z=None):
    """Triângulos, cores e id de face (para contornos).
    hide_walls: paredes omitidas; cut_z: corta tudo acima dessa altura (vista em corte)."""
    tris, cols, ids = [], [], []
    fid = 0
    for _, meshes in project_meshes(project):
        for m in meshes:
            if m.material == "Piso" or any(m.name.startswith(f"Parede {w} ") for w in hide_walls):
                continue
            v = np.array(m.vertices, float)
            if cut_z is not None and v[:, 2].min() >= cut_z:
                continue
            capped = cut_z is not None and v[:, 2].max() > cut_z
            for q in m.quads:
                fid += 1
                for t in ((q[0], q[1], q[2]), (q[0], q[2], q[3])):
                    pieces = _clip(v[list(t)], lambda p: cut_z - p[2]) if capped else [v[list(t)]]
                    for tri in pieces:
                        tris.append(tri)
                        cols.append(m.color)
                        ids.append(fid)
            if capped:  # tampa da seção (face superior no plano de corte), escurecida
                lo, hi = v.min(axis=0), v.max(axis=0)
                cap = np.array([[lo[0], lo[1], cut_z], [hi[0], lo[1], cut_z], [hi[0], hi[1], cut_z],
                                [lo[0], hi[1], cut_z]])
                fid += 1
                for t in ((0, 1, 2), (0, 2, 3)):
                    tris.append(cap[list(t)])
                    cols.append(tuple(c * 0.55 for c in m.color))
                    ids.append(fid)
    floor = next(p for p in project.environment if p.role == "floor")
    lo, hi = frame_box(floor.frame, floor.origin, floor.size)
    tile = 600
    for i, x in enumerate(np.arange(lo[0], hi[0], tile)):
        for j, y in enumerate(np.arange(lo[1], hi[1], tile)):
            x1, y1 = min(x + tile, hi[0]), min(y + tile, hi[1])
            c = (0.80, 0.74, 0.66) if (i + j) % 2 == 0 else (0.77, 0.71, 0.63)
            quad = np.array([[x, y, 0], [x1, y, 0], [x1, y1, 0], [x, y1, 0]], float)
            for t in ((0, 1, 2), (0, 2, 3)):
                tris.append(quad[list(t)])
                cols.append(c)
                ids.append(-(i * 1000 + j + 1))
    return np.array(tris), np.array(cols), np.array(ids)


def look_at(eye, target, up=(0, 0, 1)):
    eye, target, up = map(lambda a: np.array(a, float), (eye, target, up))
    f = target - eye
    f /= np.linalg.norm(f)
    r = np.cross(f, up)
    r /= np.linalg.norm(r)
    u = np.cross(r, f)
    return eye, r, u, f


def render(tris, cols, ids, cam, size=(1600, 1000), fov=60, ortho=None, light=(0.35, 0.25, 0.9)):
    W, H = size
    eye, r, u, f = cam
    # sombreamento por normal (voltada para a câmera)
    n = np.cross(tris[:, 1] - tris[:, 0], tris[:, 2] - tris[:, 0])
    n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-12
    to_cam = (eye - tris.mean(axis=1)) if not ortho else np.tile(-f, (len(tris), 1))
    n = np.where(((n * to_cam).sum(axis=1) < 0)[:, None], -n, n)
    L = np.array(light, float)
    L /= np.linalg.norm(L)
    rgb = np.clip(cols * np.clip(0.74 + 0.26 * (n @ L), 0.55, 1.0)[:, None], 0, 1)

    rel = tris - eye
    cam_pts = np.stack([rel @ r, rel @ u, rel @ f], axis=-1)  # (N,3,3)
    fpx = (W / 2) / np.tan(np.radians(fov) / 2)
    zbuf = np.full((H, W), np.inf)
    img = np.ones((H, W, 3)) * np.array([0.97, 0.97, 0.96])
    idbuf = np.zeros((H, W), np.int64)
    for k in range(len(tris)):
        pieces = [cam_pts[k]] if ortho else _clip(cam_pts[k], lambda p: p[2] - NEAR)
        for cp in pieces:
            if ortho:
                xs = W / 2 + cp[:, 0] / ortho * (W / 2)
                ys = H / 2 - cp[:, 1] / ortho * (W / 2)
            else:
                xs = W / 2 + fpx * cp[:, 0] / cp[:, 2]
                ys = H / 2 - fpx * cp[:, 1] / cp[:, 2]
            zs = cp[:, 2]
            x0, x1 = int(max(np.floor(xs.min()), 0)), int(min(np.ceil(xs.max()), W - 1))
            y0, y1 = int(max(np.floor(ys.min()), 0)), int(min(np.ceil(ys.max()), H - 1))
            if x0 > x1 or y0 > y1:
                continue
            px, py = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
            d = (ys[1] - ys[2]) * (xs[0] - xs[2]) + (xs[2] - xs[1]) * (ys[0] - ys[2])
            if abs(d) < 1e-9:
                continue
            w0 = ((ys[1] - ys[2]) * (px - xs[2]) + (xs[2] - xs[1]) * (py - ys[2])) / d
            w1 = ((ys[2] - ys[0]) * (px - xs[2]) + (xs[0] - xs[2]) * (py - ys[2])) / d
            w2 = 1 - w0 - w1
            inside = (w0 >= 0) & (w1 >= 0) & (w2 >= 0)
            if not inside.any():
                continue
            z = (w0 * zs[0] + w1 * zs[1] + w2 * zs[2]) if ortho else 1 / (w0 / zs[0] + w1 / zs[1] + w2 / zs[2])
            sub = zbuf[y0:y1 + 1, x0:x1 + 1]
            m = inside & (z < sub)
            sub[m] = z[m]
            img[y0:y1 + 1, x0:x1 + 1][m] = rgb[k]
            idbuf[y0:y1 + 1, x0:x1 + 1][m] = ids[k]
    edge = np.zeros((H, W), bool)
    edge[:, 1:] |= idbuf[:, 1:] != idbuf[:, :-1]
    edge[1:, :] |= idbuf[1:, :] != idbuf[:-1, :]
    floor_px = idbuf < 0
    edge &= ~(floor_px & np.roll(floor_px, 1, 0) & np.roll(floor_px, 1, 1))
    img[edge] = img[edge] * 0.5
    return img


def plan_png(project, dst):
    """Planta baixa no referencial do arquivo (vista de cima)."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.patches import Arc, Rectangle

    fig, ax = plt.subplots(figsize=(11, 10), dpi=120)
    T = project.room["wall_thickness"]
    for p in project.environment:
        lo, hi = frame_box(p.frame, p.origin, p.size)
        if p.role == "wall":
            ax.add_patch(Rectangle(lo[:2], hi[0] - lo[0], hi[1] - lo[1], color="#6f685f"))
    for w in project.room["walls"]:
        fr = w["frame"]
        for o in w["openings"]:
            lo, hi = frame_box(fr, (o["x"], -T, 0), (o["width"], T, 1))
            ax.add_patch(Rectangle(lo[:2], hi[0] - lo[0], hi[1] - lo[1],
                                   facecolor="#bfe0ff" if o["type"] == "window" else "#ffffff",
                                   edgecolor="#3a7bd5" if o["type"] == "window" else "#6f685f"))
            if o["type"] == "door":  # folha aberta (90°) e arco de abertura, para dentro do ambiente
                from promob_gen.model import frame_point
                hinge = frame_point(fr, (o["x"], 0, 0))
                a_u = np.degrees(np.arctan2(fr[1][1], fr[1][0]))
                a_n = np.degrees(np.arctan2(fr[2][1], fr[2][0]))
                t1, t2 = (a_n, a_u) if (a_u - a_n) % 360 == 90 else (a_u, a_n)
                ax.add_patch(Arc(hinge[:2], 2 * o["width"], 2 * o["width"], theta1=t1, theta2=t2,
                                 color="#888", linestyle=":", linewidth=0.9))
                leaf = frame_point(fr, (o["x"], o["width"], 0))
                ax.plot([hinge[0], leaf[0]], [hinge[1], leaf[1]], color="#888", linewidth=1.2)
    for m in sorted(project.modules, key=lambda m: m.type == "wall_panel"):
        (x0, y0, _), (x1, y1, _) = m.world_bbox
        aereo = m.type in ("wall_cabinet", "wall_panel")
        ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, fill=not aereo, facecolor="#efe6da",
                               edgecolor="#c0392b" if aereo else "#444", linestyle="--" if aereo else "-",
                               linewidth=1.1))
        if not aereo:
            short = m.label.split("(")[0].strip()
            ax.text((x0 + x1) / 2, (y0 + y1) / 2, f"{short}\n{m.width:g}×{m.depth:g}×{m.height:g}",
                    ha="center", va="center", fontsize=7.5, wrap=True)
    walls = project.room["walls"]
    W = max(w["length"] for w in walls if w["wall"] in ("A",))
    Dlen = next((w["length"] for w in walls if w["wall"] == "B"), 1500)
    for w in walls:  # rótulo da parede
        from promob_gen.model import frame_point
        c = frame_point(w["frame"], (w["length"] / 2, -T - 220, 0))
        ax.text(c[0], c[1], f"Parede {w['wall']}", ha="center", va="center", fontsize=9, color="#6f685f")
    ax.set_xlim(-T - 500, W + T + 500)
    ax.set_ylim(-T - 500, Dlen + T + 500)
    ax.set_aspect("equal")
    ax.set_title(f"{project.name} — planta (mm)")
    ax.set_xlabel("X (mm)")
    ax.set_ylabel("Y (mm)")
    fig.tight_layout()
    fig.savefig(dst)


def main(spec_path, out_prefix):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    project = build_project(load_spec(spec_path))
    out = Path(out_prefix)
    out.parent.mkdir(parents=True, exist_ok=True)
    H = project.room["ceiling_height"]
    if project.room["type"] == "linear_kitchen":
        L = project.room["wall_length"]
        tris, cols, ids = scene(project)
        views = {
            "perspectiva": (look_at((L * 0.95, -3900, 1700), (L * 0.45, 0, 1050)), None),
            "perspectiva_esquerda": (look_at((L * 0.05, -3500, 1500), (L * 0.6, 0, 1000)), None),
            "frontal": (look_at((L / 2, -8000, H / 2), (L / 2, 0, H / 2)), max(L / 2, H / 2 * 1.6) + 150),
        }
        for name, (cam, ortho) in views.items():
            plt.imsave(f"{out}_{name}.png", render(tris, cols, ids, cam, ortho=ortho, fov=50))
    else:
        W, D = project.room["width"], project.room["length"]
        full = scene(project)
        cut = scene(project, cut_z=1300)
        views = {
            # câmera dentro do quarto, perto da porta, olhando para a cama
            "interior_cama": (full, look_at((W * 0.22, D * 0.17, 1700), (W * 0.58, D, 650))),
            # câmera dentro do quarto, olhando para o guarda-roupa
            "interior_guarda_roupa": (full, look_at((W * 0.45, D * 0.90, 1650), (W * 0.6, 0, 900))),
            # "maquete": tudo cortado a 1,30 m, vista de cima pelos dois cantos opostos
            "maquete_corte": (cut, look_at((-1800, -2600, 5200), (W * 0.5, D * 0.5, 300))),
            "maquete_corte_2": (cut, look_at((W + 1800, D + 2600, 5200), (W * 0.5, D * 0.5, 300))),
        }
        for name, (sc, cam) in views.items():
            plt.imsave(f"{out}_{name}.png", render(*sc, cam, fov=62 if name.startswith("interior") else 45))
    plan_png(project, f"{out}_planta.png")
    print("ok", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
