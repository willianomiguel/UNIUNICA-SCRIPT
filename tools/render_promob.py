"""Pré-visualização (Blender/Cycles) de um .promob lido diretamente do XML.

Monta cada PEÇA dos módulos (laterais, base, prateleiras, rodapé, portas,
frentes de gaveta) como caixa, a partir de PONTOBASE + ROTATION + INSERTDIMENSION
(caixa local x 0..W, y -D..0, z 0..H girada em Z). Paredes vêm do SHAPE da WALL e
os vãos das aberturas (camada Decore Promob-Aberturas). Cama, roupa de cama,
abajures, tapete, planta e cortina são cenografia só da imagem: não estão no .promob.

Não é o render do Promob: as cores dos acabamentos são aproximadas.

Uso:
  blender -b --factory-startup -P tools/render_promob.py -- projeto.promob saida_prefixo \
      --assets=assets_cache [--samples=128] [--res=1600x1000]
"""
from __future__ import annotations

import math
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
import render_blender as rb  # noqa: E402

AMBIENT = "solucao/container1/document0/document0.ambient3d"
OPENING_LAYER = "Decore Promob-Aberturas"


def _f(e, k):
    return float(e.get(k, 0) or 0)


def _item(e, kind):
    b, d = e.find("POSICAOINSERCAO/PONTOBASE"), e.find("INSERTDIMENSION")
    if b is None or d is None:
        return None
    lay = e.find("LAYER").get("DESCRIPTION") if e.find("LAYER") is not None else ""
    return dict(base=(_f(b, "X"), _f(b, "Y"), _f(b, "Z")), rot=float(e.findtext("POSICAOINSERCAO/ROTATION") or 0),
                size=(_f(d, "WIDTH"), _f(d, "HEIGHT"), _f(d, "DEPTH")), layer=lay, id=e.get("ID"), kind=kind)


def read_project(path):
    """Caixa (corpo) de cada módulo de topo + suas frentes (portas/gavetas, camada *-Frentes).
    As chapas internas não são desenhadas: com as portas fechadas não aparecem."""
    root = ET.fromstring(zipfile.ZipFile(path).read(AMBIENT).decode("utf-8-sig"))
    wall = next(e for e in root.iter("INFORMACOES") if e.get("TYPE") == "WALL")
    pts = [(_f(p, "X"), _f(p, "Y")) for p in wall.find("GEOMETRY/SHAPE")]
    height = _f(wall.find("INSERTDIMENSION"), "HEIGHT")

    def kids(e):
        c = e.find("INFORMACOESCOLECAO")
        return list(c) if c is not None else []

    floor = root.find("INFORMACOES")
    tops = kids(floor) + kids(wall)
    parts, openings, seen = [], [], set()
    for t in tops:
        if t.get("TYPE") == "onlinemodule":
            it = _item(t, "abertura")
            if it and it["layer"] == OPENING_LAYER and it["size"][2] >= 100:   # batente/janela (folha fica de fora)
                openings.append(it)
            continue
        if t.get("TYPE") != "MODULO" or _item(t, "corpo") is None:
            continue
        parts.append(_item(t, "corpo"))
        for e in t.iter("INFORMACOES"):
            it = _item(e, "frente")
            if it is None or "Frentes" not in it["layer"]:
                continue
            key = (it["base"], it["rot"], it["size"])
            if key not in seen:                 # a mesma frente aparece em 2-3 entidades sobrepostas
                seen.add(key)
                parts.append(it)
    return dict(name=root.get("NAME"), wall=pts, height=height, parts=parts, openings=openings)


def world_aabb(p):
    (x, y, z), (w, h, d) = p["base"], p["size"]
    r = math.radians(p["rot"])
    c, s = round(math.cos(r), 6), round(math.sin(r), 6)
    xs, ys = [], []
    for px, py in ((0, 0), (w, 0), (w, -d), (0, -d)):
        xs.append(x + px * c - py * s)
        ys.append(y + px * s + py * c)
    return (min(xs), min(ys), z), (max(xs), max(ys), z + h)


def build(prj, cols):
    A = rb.ASSETS
    branco = rb.principled("MDF Branco TX", (0.86, 0.85, 0.82), 0.45)
    frente = rb.textured("Freijó/Carvalho", "carvalho", 0.9, (0.95, 0.88, 0.80), rough_override=0.42)
    piso = rb.textured("Piso", "piso", 2.0)
    parede = rb.textured("Parede", "reboco", 2.0, (0.74, 0.69, 0.62), use_diffuse=False, normal=0.3)
    teto_m = rb.principled("Teto", (0.95, 0.95, 0.94), 0.8)
    m = cols["Moveis"]
    for i, p in enumerate(prj["parts"]):
        lo, hi = world_aabb(p)
        mat = frente if p["kind"] == "frente" else branco
        rb.aabb(f"peca_{i}_{p['id'][:30]}", lo, hi, mat, "", m)

    xs, ys = [q[0] for q in prj["wall"]], [q[1] for q in prj["wall"]]
    x0, x1, y0, y1, H, T = min(xs), max(xs), min(ys), max(ys), prj["height"], 150
    s = cols["Sala"]
    rb.aabb("Piso", (x0 - T, y0 - T, -20), (x1 + T, y1 + T, 0), piso, "floor", s)
    rb.aabb("Teto", (x0 - T, y0 - T, H), (x1 + T, y1 + T, H + 20), teto_m, "floor", cols["Teto"])
    rb.aabb("Parede_E", (x0 - T, y0 - T, 0), (x0, y1 + T, H), parede, "wall", s)
    rb.aabb("Parede_D", (x1, y0 - T, 0), (x1 + T, y1 + T, H), parede, "wall", s)
    rb.aabb("Parede_B", (x0, y0 - T, 0), (x1, y0, H), parede, "wall", s)
    # parede de cima com os vãos das aberturas
    holes = []
    for o in prj["openings"]:
        lo, hi = world_aabb(o)
        holes.append((lo[0], hi[0], o["base"][2], o["base"][2] + o["size"][1], "porta" if o["base"][2] < 10 else "janela"))
    holes.sort()
    cx = x0
    for hx0, hx1, hz0, hz1, kind in holes:
        rb.aabb("Parede_C", (cx, y1, 0), (hx0, y1 + T, H), parede, "wall", s)
        rb.aabb("Parede_C_inf", (hx0, y1, 0), (hx1, y1 + T, hz0), parede, "wall", s) if hz0 > 1 else None
        rb.aabb("Parede_C_sup", (hx0, y1, hz1), (hx1, y1 + T, H), parede, "wall", s)
        if kind == "janela":
            alu = rb.principled("Alumínio", (0.85, 0.85, 0.85), 0.3, 0.8)
            for a, b in (((hx0, y1 + 60, hz0), (hx1, y1 + 90, hz0 + 40)), ((hx0, y1 + 60, hz1 - 40), (hx1, y1 + 90, hz1)),
                         ((hx0, y1 + 60, hz0), (hx0 + 40, y1 + 90, hz1)), ((hx1 - 40, y1 + 60, hz0), (hx1, y1 + 90, hz1)),
                         (((hx0 + hx1) / 2 - 20, y1 + 60, hz0), ((hx0 + hx1) / 2 + 20, y1 + 90, hz1))):
                rb.aabb("Caixilho", a, b, alu, "handle", s)
            rb.aabb("Vidro", (hx0, y1 + 74, hz0), (hx1, y1 + 76, hz1), rb.glass(), "wall", s)
            rb.curtain_panel("Cortina", Vector((hx0 - 250, y1 - 90, 0)) * rb.MM, Vector((hx1 + 250, y1 - 90, 0)) * rb.MM,
                             Vector((0, 1, 0)), (H - 40) * rb.MM, (H - 60) * rb.MM, rb.sheer(), cols["Decor"])
        else:
            leaf = rb.principled("Porta Branca", (0.90, 0.89, 0.86), 0.5)
            rb.aabb("Porta", (hx0 + 40, y1 + 40, 0), (hx1 - 40, y1 + 75, hz1 - 40), leaf, "", s)
            for a, b in (((hx0, y1 - 10, 0), (hx0 + 40, y1 + T, hz1)), ((hx1 - 40, y1 - 10, 0), (hx1, y1 + T, hz1)),
                         ((hx0, y1 - 10, hz1 - 40), (hx1, y1 + T, hz1))):
                rb.aabb("Batente", a, b, leaf, "", s)
            rb.aabb("Macaneta", (hx0 + 90, y1 + 5, 1000), (hx0 + 230, y1 + 40, 1025),
                    rb.principled("Inox", (0.8, 0.8, 0.8), 0.25, 1.0), "handle", s)
        cx = hx1
    rb.aabb("Parede_C", (cx, y1, 0), (x1, y1 + T, H), parede, "wall", s)
    return (x0, x1, y0, y1, H)


def decorate(prj, box, cols):
    """Cenografia: cama no vão entre os criados da parede direita, abajures, tapete, planta."""
    x0, x1, y0, y1, H = box
    d = cols["Decor"]
    # vão da cama: parede direita, entre os criados (detectados pelas peças encostadas em x1)
    right = sorted({(round(lo[1]), round(hi[1])) for lo, hi in (world_aabb(p) for p in prj["parts"] if p["kind"] == "corpo")
                    if hi[0] > x1 - 5 and lo[0] > x1 - 700 and hi[2] < 1000})
    ys = [v for r in right for v in r]
    gap_lo, gap_hi = max(v for v in ys if v < (y0 + y1) / 2), min(v for v in ys if v > (y0 + y1) / 2)
    yc = (gap_lo + gap_hi) / 2
    bw, bl = 1580, 1980
    hx = x1 - 40
    linho = rb.textured("Linho", "linho", 0.4, (0.74, 0.69, 0.62), use_diffuse=False)
    couro = rb.textured("Couro cabeceira", "couro_branco", 0.5, (0.88, 0.84, 0.78))
    edredom = rb.textured("Edredom", "algodao", 0.45, (0.95, 0.94, 0.91), normal=0.7, use_diffuse=False)
    manta = rb.textured("Manta", "boucle", 0.3, (0.30, 0.24, 0.19), use_diffuse=False)
    rb.aabb("Cabeceira", (x1 - 40, gap_lo + 20, 0), (x1, gap_hi - 20, 1250), couro, "upholstery", d)
    rb.aabb("Base cama", (hx - bl, yc - bw / 2, 0), (hx, yc + bw / 2, 330), linho, "upholstery", d)
    rb.aabb("Colchão", (hx - bl + 10, yc - bw / 2 + 10, 330), (hx - 10, yc + bw / 2 - 10, 560),
            rb.principled("Colchão", (0.93, 0.93, 0.92), 0.8), "mattress", d)
    top = rb.aabb("Edredom", (hx - bl - 30, yc - bw / 2 - 40, 520), (hx - 450, yc + bw / 2 + 40, 600),
                  edredom, "pillow", d)
    rb.wrinkles(top, 0.008)
    rb.aabb("Edredom_lat", (hx - bl - 30, yc - bw / 2 - 40, 300), (hx - 450, yc - bw / 2 - 10, 580), edredom, "throw", d)
    rb.aabb("Edredom_lat", (hx - bl - 30, yc + bw / 2 + 10, 300), (hx - 450, yc + bw / 2 + 40, 580), edredom, "throw", d)
    rb.aabb("Edredom_pe", (hx - bl - 40, yc - bw / 2 - 40, 300), (hx - bl - 10, yc + bw / 2 + 40, 580), edredom, "throw", d)
    mt = rb.aabb("Manta", (hx - bl - 45, yc - bw / 2 - 50, 598), (hx - bl + 330, yc + bw / 2 + 50, 615), manta, "throw", d)
    rb.wrinkles(mt, 0.006)
    rb.import_model("almofadas", (Vector((hx - 600, yc, 600)) * rb.MM), 90, 0.9, d)
    rb.aabb("Tapete", (hx - bl - 650, yc - bw / 2 - 550, 0), (hx - 500, yc + bw / 2 + 550, 12),
            rb.textured("Tapete", "tapete", 1.2), "throw", d)
    for lo_y, hi_y in ((gap_lo - 740, gap_lo), (gap_hi, gap_hi + 740)):
        tops = [world_aabb(p)[1][2] for p in prj["parts"]
                if world_aabb(p)[1][0] > x1 - 5 and lo_y - 5 < world_aabb(p)[0][1] < hi_y and world_aabb(p)[1][2] < 1000]
        if tops:
            rb.import_model("luminaria_mesa", Vector((x1 - 300, (lo_y + hi_y) / 2, max(tops))) * rb.MM, 180, 1.0, d,
                            fit_height=0.45)
    rb.import_model("planta_grande", Vector((x0 + 900, y1 - 380, 0)) * rb.MM, 0, 1.0, d, fit_height=1.3)
    travesseiro = rb.principled("Fronha", (0.96, 0.95, 0.93), 0.85)
    for dy in (-bw / 4, bw / 4):
        rb.aabb("Travesseiro", (hx - 560, yc + dy - 330, 560), (hx - 80, yc + dy + 330, 720), travesseiro, "pillow", d)
    return yc


def lights(box, cols):
    x0, x1, y0, y1, H = box
    sc = bpy.context.scene
    world = bpy.data.worlds.new("Mundo")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    hdr = rb.ASSETS / "hdri" / "ceu.hdr" if rb.ASSETS else None
    if hdr and hdr.exists():
        env = nt.nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(str(hdr))
        nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 1.6
    sun_d = bpy.data.lights.new("Sol", "SUN")
    sun_d.energy = 4.0
    sun_d.angle = math.radians(1.5)
    sun_d.color = (1.0, 0.92, 0.82)
    sun = bpy.data.objects.new("Sol", sun_d)
    sun.rotation_euler = Vector((0.35, -0.75, -0.55)).normalized().to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(sun)
    for fx in (0.3, 0.7):
        for fy in (0.25, 0.75):
            sd = bpy.data.lights.new("Spot", "SPOT")
            sd.energy = 60
            sd.spot_size = math.radians(75)
            sd.spot_blend = 0.6
            sd.shadow_soft_size = 0.02
            sd.color = (1.0, 0.84, 0.64)
            so = bpy.data.objects.new("Spot", sd)
            so.location = Vector((x0 + (x1 - x0) * fx, y0 + (y1 - y0) * fy, H - 5)) * rb.MM
            rb.link(so, cols["Teto"])
    fill = bpy.data.lights.new("Rebatedor", "AREA")
    fill.energy = 120
    fill.size = 1.5
    fill.color = (1.0, 0.95, 0.9)
    fo = bpy.data.objects.new("Rebatedor", fill)
    fo.location = Vector(((x0 + x1) / 2, y1 - 300, 1800)) * rb.MM
    fo.rotation_euler = Vector((0, -1, -0.3)).to_track_quat("-Z", "Y").to_euler()
    rb.link(fo, cols["Teto"])


def main():
    argv = sys.argv[sys.argv.index("--") + 1:]
    src, out_prefix = argv[0], argv[1]
    opts = dict(a.split("=", 1) if "=" in a else (a, "1") for a in argv[2:])
    rb.ASSETS = Path(opts["--assets"]) if "--assets" in opts and Path(opts["--assets"]).exists() else None
    res = tuple(int(v) for v in opts.get("--res", "1600x1000").split("x"))
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    cols = {k: rb.new_collection(k) for k in ("Moveis", "Sala", "Teto", "Decor")}
    prj = read_project(src)
    print(f"{prj['name']}: {len(prj['parts'])} peças, {len(prj['openings'])} aberturas", flush=True)
    box = build(prj, cols)
    decorate(prj, box, cols)
    lights(box, cols)
    x0, x1, y0, y1, H = box
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.samples = int(opts.get("--samples", 128))
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.caustics_reflective = sc.cycles.caustics_refractive = False
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Base Contrast"
    sc.view_settings.exposure = float(opts.get("--exposure", 0.7))
    sc.render.resolution_x, sc.render.resolution_y = res
    views = {
        "guarda_roupa": ((x1 - 1000, y1 - 200, 1600), (x0 + 200, y0 + 1300, 1300), 16),
        "cama": ((x0 + 750, y1 - 230, 1450), (x1 - 200, y0 + 900, 1250), 16),
    }
    only = set(opts["--views"].split(",")) if "--views" in opts else None
    for name, (eye, tgt, lens) in views.items():
        if only and name not in only:
            continue
        sc.camera = rb.camera(name, eye, tgt, lens, shift_y=-0.05)
        sc.render.filepath = f"{out_prefix}_{name}.png"
        bpy.ops.render.render(write_still=True)
        print("RENDER OK", sc.render.filepath, flush=True)


if __name__ == "__main__":
    main()
