"""Renderiza imagens (PNG) de um projeto do gerador: perspectiva, frontal e planta.

É um rasterizador próprio (numpy, z-buffer, sombreamento plano + contornos),
para conferência visual FORA do Promob. Não representa o render do Promob.

Uso: PYTHONPATH=src python tools/render_projeto.py samples/mvp_cozinha_teste.json docs/evidencias/mvp
Requer: numpy, matplotlib (só para gravar PNG e desenhar a planta).
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from promob_gen.mesh import part_mesh, to_world  # noqa: E402
from promob_gen.model import build_project  # noqa: E402
from promob_gen.spec import load_spec  # noqa: E402


def scene_triangles(project):
    tris, cols, ids = [], [], []
    pid = 0
    items = [((0, 0, 0), p) for p in project.environment if p.role != "floor"]
    items += [(m.position, p) for m in project.modules for p in m.parts]
    for off, part in items:
        pid += 1
        mesh = part_mesh(part, off)
        v = np.array(mesh.vertices, float)
        for q in mesh.quads:
            for a, b, c in ((q[0], q[1], q[2]), (q[0], q[2], q[3])):
                tris.append(v[[a, b, c]])
                cols.append(mesh.color)
                ids.append(pid * 8 + mesh.quads.index(q))
    return np.array(tris), np.array(cols), np.array(ids)


def floor_tris(project, extra=1800):
    L = project.room["wall_length"]
    T = project.room["wall_thickness"]
    tris, cols, ids = [], [], []
    tile = 600
    for i, x in enumerate(np.arange(0, L, tile)):
        for j, y in enumerate(np.arange(-T, extra, tile)):
            x1, y1 = min(x + tile, L), min(y + tile, extra)
            c = (0.80, 0.77, 0.72) if (i + j) % 2 == 0 else (0.76, 0.73, 0.68)
            quad = np.array([to_world(p) for p in ((x, y, 0), (x1, y, 0), (x1, y1, 0), (x, y1, 0))], float)
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


def render(tris, cols, ids, cam, size=(1600, 1000), fov=50, ortho=None, light=(-0.4, 0.8, 0.9)):
    W, H = size
    eye, r, u, f = cam
    rel = tris - eye
    cx, cy, cz = rel @ r, rel @ u, rel @ f  # coordenadas de câmera
    if ortho:
        sx = W / 2 + cx / ortho * (W / 2)
        sy = H / 2 - cy / ortho * (W / 2)
        depth = cz
    else:
        fpx = (W / 2) / np.tan(np.radians(fov) / 2)
        cz = np.maximum(cz, 1e-3)
        sx = W / 2 + fpx * cx / cz
        sy = H / 2 - fpx * cy / cz
        depth = cz
    n = np.cross(tris[:, 1] - tris[:, 0], tris[:, 2] - tris[:, 0])
    n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-12
    to_cam = (eye - tris.mean(axis=1)) if not ortho else np.tile(-f, (len(tris), 1))
    n = np.where(((n * to_cam).sum(axis=1) < 0)[:, None], -n, n)  # vira para a câmera
    L = np.array(light, float)
    L /= np.linalg.norm(L)
    shade = 0.55 + 0.45 * np.clip(n @ L, 0, 1)
    rgb = np.clip(cols * shade[:, None], 0, 1)

    zbuf = np.full((H, W), np.inf)
    img = np.ones((H, W, 3)) * np.array([0.97, 0.97, 0.96])
    idbuf = np.zeros((H, W), np.int64)
    for k in range(len(tris)):
        xs, ys, zs = sx[k], sy[k], depth[k]
        x0, x1 = int(max(np.floor(xs.min()), 0)), int(min(np.ceil(xs.max()), W - 1))
        y0, y1 = int(max(np.floor(ys.min()), 0)), int(min(np.ceil(ys.max()), H - 1))
        if x0 > x1 or y0 > y1 or (not ortho and (depth[k] <= 1e-2).any()):
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
        if ortho:
            z = w0 * zs[0] + w1 * zs[1] + w2 * zs[2]
        else:  # interpolação correta em perspectiva
            z = 1 / (w0 / zs[0] + w1 / zs[1] + w2 / zs[2])
        sub = zbuf[y0:y1 + 1, x0:x1 + 1]
        m = inside & (z < sub)
        sub[m] = z[m]
        img[y0:y1 + 1, x0:x1 + 1][m] = rgb[k]
        idbuf[y0:y1 + 1, x0:x1 + 1][m] = ids[k]
    # contornos: mudança de face/peça entre pixels vizinhos
    edge = np.zeros((H, W), bool)
    edge[:, 1:] |= idbuf[:, 1:] != idbuf[:, :-1]
    edge[1:, :] |= idbuf[1:, :] != idbuf[:-1, :]
    floor_px = (idbuf < 0)
    edge &= ~(floor_px & np.roll(floor_px, 1, 0) & np.roll(floor_px, 1, 1))
    img[edge] = img[edge] * 0.45
    return img


def plan_png(project, dst):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.patches import Rectangle

    fig, ax = plt.subplots(figsize=(12, 6), dpi=120)
    L, T = project.room["wall_length"], project.room["wall_thickness"]
    for p in project.environment:
        if p.role == "wall":
            ax.add_patch(Rectangle((p.origin[0], p.origin[1]), p.size[0], p.size[1], color="#8a8378"))
    for o in project.room.get("openings", []):
        ax.add_patch(Rectangle((o["x"], -T), o["width"], T, facecolor="#bfe0ff", edgecolor="#3a7bd5"))
    for m in sorted(project.modules, key=lambda m: m.type == "wall_cabinet"):
        x, y = m.position[0], m.position[1]
        aereo = m.type == "wall_cabinet"
        ax.add_patch(Rectangle((x, y), m.width, m.depth + 18, fill=not aereo,
                               facecolor="#efe6da", edgecolor="#555" if not aereo else "#c0392b",
                               linestyle="--" if aereo else "-", linewidth=1.2))
        ax.text(x + m.width / 2, (m.depth + 18) / 2 if not aereo else m.depth + 70,
                f"{m.label}\n{m.width:g}×{m.depth:g}×{m.height:g}", ha="center", va="center", fontsize=8,
                color="#c0392b" if aereo else "#222")
    ax.annotate("", xy=(L, 900), xytext=(0, 900), arrowprops=dict(arrowstyle="<->"))
    ax.text(L / 2, 940, f"{L:g} mm", ha="center")
    ax.set_xlim(-200, L + 200)
    ax.set_ylim(1100, -T - 150)
    ax.set_aspect("equal")
    ax.set_title(f"{project.name} — planta (aéreos tracejados em vermelho)")
    ax.axis("off")
    fig.tight_layout()
    fig.savefig(dst)


def main(spec_path, out_prefix):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    project = build_project(load_spec(spec_path))
    t1, c1, i1 = scene_triangles(project)
    t2, c2, i2 = floor_tris(project)
    tris, cols, ids = np.concatenate([t1, t2]), np.concatenate([c1, c2]), np.concatenate([i1, i2])
    L, H = project.room["wall_length"], project.room["ceiling_height"]
    out = Path(out_prefix)
    out.parent.mkdir(parents=True, exist_ok=True)
    views = {
        "perspectiva": look_at((L * 0.95, -3900, 1700), (L * 0.45, 0, 1050)),
        "perspectiva_esquerda": look_at((L * 0.05, -3500, 1500), (L * 0.6, 0, 1000)),
    }
    for name, cam in views.items():
        plt.imsave(f"{out}_{name}.png", render(tris, cols, ids, cam))
    front = look_at((L / 2, -8000, H / 2), (L / 2, 0, H / 2))
    plt.imsave(f"{out}_frontal.png", render(tris, cols, ids, front, ortho=max(L / 2, H / 2 * 1.6) + 150))
    plan_png(project, f"{out}_planta.png")
    print("ok", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
