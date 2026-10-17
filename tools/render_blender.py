"""Render fotorrealista (Blender/Cycles) de um projeto do gerador.

A geometria dos móveis/paredes é a MESMA dos arquivos de importação
(mesh.project_meshes). Por cima, este script adiciona só "cenografia" para a
imagem: materiais PBR procedurais, teto, porta, caixilho/vidro da janela,
tapete, céu e iluminação. Nada disso vai para os arquivos do Promob.

Uso (Blender 4.2+):
  blender -b --factory-startup -P tools/render_blender.py -- samples/quarto_casal_real.json \
      docs/evidencias/render/Quarto [--samples 128] [--views interior_cama,planta] [--res 1600x1000]
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from promob_gen.mesh import project_meshes  # noqa: E402
from promob_gen.model import build_project, frame_box, frame_point  # noqa: E402
from promob_gen.spec import load_spec  # noqa: E402

MM = 0.001


# ------------------------------------------------------------------ materiais

def _principled(name, color, rough=0.5, metal=0.0, **extra):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    for k, v in extra.items():
        b.inputs[k].default_value = v
    return m


def _noise_bump(m, scale=400.0, strength=0.03):
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = scale
    nz.inputs["Detail"].default_value = 4
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def _wood(name, light, dark, rough=0.42, scale=3.0, axis="X"):
    """Madeira procedural: veios por Wave Texture distorcida por ruído."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = rough
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.0, 8.0, 1.0) if axis == "X" else (8.0, 1.0, 1.0)
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Y" if axis == "X" else "X"
    wave.inputs["Scale"].default_value = scale
    wave.inputs["Distortion"].default_value = 3.5
    wave.inputs["Detail"].default_value = 4.0
    wave.inputs["Detail Scale"].default_value = 1.5
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*dark, 1)
    ramp.color_ramp.elements[1].color = (*light, 1)
    ramp.color_ramp.elements[0].position = 0.25
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.04
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], wave.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def _floor_planks():
    """Piso vinílico/laminado em réguas (Brick Texture) com veio de madeira."""
    m = bpy.data.materials.new("Piso Madeira")
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.38
    tc = nt.nodes.new("ShaderNodeTexCoord")
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.offset = 0.37
    brick.inputs["Color1"].default_value = (0.47, 0.31, 0.19, 1)
    brick.inputs["Color2"].default_value = (0.56, 0.39, 0.25, 1)
    brick.inputs["Mortar"].default_value = (0.20, 0.13, 0.08, 1)
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = 0.0015
    brick.inputs["Brick Width"].default_value = 1.2
    brick.inputs["Row Height"].default_value = 0.19
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.bands_direction = "Y"
    wave.inputs["Scale"].default_value = 3.0
    wave.inputs["Distortion"].default_value = 9.0
    wave.inputs["Detail"].default_value = 3.0
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.0, 10.0, 1.0)
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 0.35
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    nt.links.new(tc.outputs["Object"], brick.inputs["Vector"])
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], wave.inputs["Vector"])
    nt.links.new(brick.outputs["Color"], mix.inputs["A"])
    nt.links.new(wave.outputs["Color"], mix.inputs["B"])
    nt.links.new(mix.outputs["Result"], b.inputs["Base Color"])
    nt.links.new(brick.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m


def _glass():
    """Vidro que não bloqueia raios de sombra (luz do sol entra sem cáusticas)."""
    m = bpy.data.materials.new("Vidro")
    m.use_nodes = True
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    glass = nt.nodes.new("ShaderNodeBsdfGlass")
    glass.inputs["Roughness"].default_value = 0.0
    glass.inputs["IOR"].default_value = 1.45
    transp = nt.nodes.new("ShaderNodeBsdfTransparent")
    lp = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Shadow Ray"], mix.inputs["Fac"])
    nt.links.new(glass.outputs["BSDF"], mix.inputs[1])
    nt.links.new(transp.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return m


class Materials:
    def __init__(self):
        self.cache = {}

    def get(self, key, factory):
        if key not in self.cache:
            self.cache[key] = factory()
        return self.cache[key]

    def for_part(self, mesh_name, material, role, color):
        mat = material.lower()
        if role in ("wall",):
            return self.get("parede", lambda: _noise_bump(_principled("Parede", (0.74, 0.72, 0.68), 0.92), 60, 0.02))
        if role == "floor":
            return self.get("piso", _floor_planks)
        if role == "handle" or "inox" in mat or role == "rod":
            return self.get("inox", lambda: _principled("Inox", (0.85, 0.85, 0.86), 0.22, 1.0))
        if "espelh" in mat and role in ("door", "drawer_front"):
            return self.get("espelho", lambda: _principled("Espelho", (0.92, 0.94, 0.96), 0.03, 1.0))
        for key, light, dark in (("freijo", (0.62, 0.43, 0.27), (0.42, 0.27, 0.15)),
                                 ("sevilha", (0.70, 0.52, 0.34), (0.50, 0.34, 0.20)),
                                 ("canela", (0.58, 0.38, 0.22), (0.38, 0.23, 0.12)),
                                 ("carvalho", (0.74, 0.58, 0.40), (0.55, 0.40, 0.25)),
                                 ("nogueira", (0.42, 0.28, 0.18), (0.24, 0.15, 0.09))):
            if key in mat:
                return self.get(key, lambda: _wood(key.title(), light, dark))
        if role == "upholstery":
            return self.get("tecido_box", lambda: _noise_bump(_principled("Tecido Box", (0.42, 0.41, 0.40), 0.95), 900, 0.08))
        if role in ("mattress", "pillow"):
            return self.get("tecido_branco", lambda: _noise_bump(_principled("Roupa de Cama", (0.88, 0.87, 0.85), 0.9), 700, 0.05))
        if role == "throw":
            return self.get("manta", lambda: _noise_bump(_principled("Manta", (0.20, 0.27, 0.36), 0.95), 300, 0.2))
        if "courino" in mat:
            return self.get("courino", lambda: _noise_bump(_principled("Courino", (0.86, 0.85, 0.82), 0.55), 500, 0.05))
        if role == "plinth":
            return self.get("rodape", lambda: _principled("Rodapé", (0.12, 0.12, 0.12), 0.6))
        if "preto" in mat or "granito" in mat:
            return self.get("preto", lambda: _principled("Preto", (0.04, 0.04, 0.045), 0.25))
        if role == "back":
            return self.get("hdf", lambda: _principled("HDF", (0.80, 0.79, 0.76), 0.6))
        # MDP/MDF branco texturizado (padrão)
        return self.get("mdp_branco", lambda: _noise_bump(_principled("MDP Branco TX", (0.80, 0.80, 0.78), 0.45), 250, 0.03))


BEVEL = {"mattress": (0.035, 4), "pillow": (0.05, 5), "upholstery": (0.012, 3), "throw": (0.004, 2),
         "wall": (0.0, 0), "floor": (0.0, 0)}


# ------------------------------------------------------------------ cena

def box_object(name, verts_mm, quads, material, role="", collection=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(c * MM for c in v) for v in verts_mm], [], [tuple(q) for q in quads])
    me.update()
    ob = bpy.data.objects.new(name, me)
    (collection or bpy.context.scene.collection).objects.link(ob)
    ob.data.materials.append(material)
    w, seg = BEVEL.get(role, (0.0015, 2))
    if w > 0:
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = w
        mod.segments = seg
        mod.limit_method = "NONE"
    return ob


def aabb_box(name, lo, hi, material, role="", collection=None):
    """Caixa alinhada aos eixos a partir de cantos em mm."""
    x0, y0, z0 = lo
    x1, y1, z1 = hi
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    q = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return box_object(name, v, q, material, role, collection)


def new_collection(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def build_scene(project, mats: Materials, wall_cut_mm: float):
    col_furn = new_collection("Moveis")
    col_walls = new_collection("Paredes")
    col_walls_cut = new_collection("Paredes_corte")
    col_env = new_collection("Ambiente")
    col_ceiling = new_collection("Teto")
    col_open = new_collection("Aberturas")   # porta, caixilho, vidro (somem na vista em corte)
    groups = project_meshes(project)
    bed = next((m for m in project.modules if m.type == "bed"), None)
    accent_wall = bed.wall if bed else None   # parede da cabeceira ganha cor de destaque
    for gname, meshes in groups:
        for m in meshes:
            role = "wall" if m.material == "Parede" else ("floor" if m.material == "Piso" else "")
            part = None
            if gname != "AMBIENTE":
                mod = next(x for x in project.modules if x.id == gname)
                part = next(p for p in mod.parts if m.name == f"{mod.id}_{p.name}")
                role = part.role
            mat = mats.for_part(m.name, m.material, role, m.color)
            if role == "wall" and accent_wall and m.name.startswith(f"Parede {accent_wall} "):
                mat = mats.get("parede_destaque", lambda: _noise_bump(
                    _principled("Parede Destaque", (0.30, 0.34, 0.29), 0.9), 60, 0.02))   # verde sálvia
            if role == "wall":
                box_object(m.name, m.vertices, m.quads, mat, role, col_walls)
                zs = [v[2] for v in m.vertices]
                if min(zs) < wall_cut_mm:  # versão cortada para a vista de maquete
                    xs, ys = [v[0] for v in m.vertices], [v[1] for v in m.vertices]
                    aabb_box(m.name + "_corte", (min(xs), min(ys), min(zs)),
                             (max(xs), max(ys), min(max(zs), wall_cut_mm)), mat, role, col_walls_cut)
            else:
                box_object(m.name, m.vertices, m.quads, mat, role, col_env if role == "floor" else col_furn)

    T = project.room["wall_thickness"]
    H = project.room["ceiling_height"]
    wood_door = mats.get("porta", lambda: _wood("Porta Madeira", (0.66, 0.50, 0.34), (0.48, 0.33, 0.20), axis="Z"))
    alu = mats.get("aluminio", lambda: _principled("Alumínio", (0.15, 0.15, 0.16), 0.35, 1.0))
    glass = mats.get("vidro", _glass)
    white = mats.get("batente", lambda: _principled("Batente", (0.85, 0.84, 0.82), 0.5))
    for w in project.room["walls"]:
        fr = w["frame"]
        for i, o in enumerate(w["openings"]):
            x, wd, s, h = o["x"], o["width"], o["sill"], o["height"]
            if o["type"] == "door":
                lo, hi = frame_box(fr, (x + 10, -T * 0.5 - 17, 0), (wd - 20, 35, h - 10))
                aabb_box(f"Porta_{w['wall']}{i}", lo, hi, wood_door, "door", col_open)
                for jx, jw in ((x - 60, 60), (x + wd, 60)):   # guarnições
                    lo, hi = frame_box(fr, (jx, 0, 0), (jw, 12, h + 60))
                    aabb_box(f"Guarnicao_{w['wall']}{i}_{jx}", lo, hi, white, "", col_open)
                lo, hi = frame_box(fr, (x - 60, 0, h), (wd + 120, 12, 60))
                aabb_box(f"Guarnicao_sup_{w['wall']}{i}", lo, hi, white, "", col_open)
                lo, hi = frame_box(fr, (x + wd - 90, 0, 1000), (60, 60, 20))
                aabb_box(f"Macaneta_{w['wall']}{i}", lo, hi, mats.get("inox", lambda: _principled("Inox", (0.85, 0.85, 0.86), 0.22, 1.0)), "handle", col_open)
            else:
                prof = 50
                ymid = -T * 0.5
                for (ox, oz, sx, sz) in ((x, s, prof, h), (x + wd - prof, s, prof, h), (x, s, wd, prof),
                                         (x, s + h - prof, wd, prof), (x + wd / 2 - prof / 2, s, prof, h)):
                    lo, hi = frame_box(fr, (ox, ymid - 25, oz), (sx, 50, sz))
                    aabb_box(f"Caixilho_{w['wall']}{i}_{ox}_{oz}", lo, hi, alu, "", col_open)
                lo, hi = frame_box(fr, (x + prof, ymid - 3, s + prof), (wd - 2 * prof, 6, h - 2 * prof))
                aabb_box(f"Vidro_{w['wall']}{i}", lo, hi, glass, "wall", col_open)
                lo, hi = frame_box(fr, (x - 20, 0, s - 25), (wd + 40, 40, 25))   # peitoril
                aabb_box(f"Peitoril_{w['wall']}{i}", lo, hi, mats.get("granito_claro", lambda: _principled(
                    "Peitoril", (0.82, 0.80, 0.77), 0.3)), "", col_open)

    # tapete sob a cama
    bed = next((m for m in project.modules if m.type == "bed"), None)
    if bed:
        (bx0, by0, _), (bx1, by1, _) = bed.world_bbox
        u, n = Vector(bed.frame[1]), Vector(bed.frame[2])
        cx, cy = (bx0 + bx1) / 2, (by0 + by1) / 2
        along = 2000 if abs(u.x) > 0.5 else 1700
        across = 1700 if abs(u.x) > 0.5 else 2000
        foot = Vector((cx, cy, 0)) + n * 250
        rug = mats.get("tapete", lambda: _noise_bump(_principled("Tapete", (0.66, 0.62, 0.55), 0.98), 120, 0.4))
        aabb_box("Tapete", (foot.x - along / 2, foot.y - across / 2, 0), (foot.x + along / 2, foot.y + across / 2, 12),
                 rug, "throw", col_env)

    floor = next(p for p in project.environment if p.role == "floor")
    lo, hi = frame_box(floor.frame, floor.origin, floor.size)
    aabb_box("Teto", (lo[0] - T, lo[1] - T, H), (hi[0] + T, hi[1] + T, H + 100),
             mats.get("teto", lambda: _principled("Teto", (0.90, 0.90, 0.89), 0.9)), "wall", col_ceiling)
    return col_walls, col_walls_cut, col_ceiling, col_open, (lo, hi)


def setup_world_and_lights(project, bounds):
    sc = bpy.context.scene
    world = bpy.data.worlds.new("Mundo")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "NISHITA"
    sky.sun_elevation = math.radians(28)
    sky.sun_disc = False
    nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 0.35

    # sol entrando pela primeira janela (se houver), senão por cima
    win = next(((w, o) for w in project.room["walls"] for o in w["openings"] if o["type"] == "window"), None)
    if win:
        n = Vector(win[0]["frame"][2])               # normal para dentro do ambiente
        direction = Vector((n.x, n.y, -0.0)).normalized() * math.cos(math.radians(32))
        direction.z = -math.sin(math.radians(32))
        u = Vector(win[0]["frame"][1])
        direction += u * 0.35
    else:
        direction = Vector((0.3, 0.5, -0.8))
    sun_data = bpy.data.lights.new("Sol", "SUN")
    sun_data.energy = 4.0
    sun_data.angle = math.radians(1.5)
    sun_data.color = (1.0, 0.93, 0.84)
    sun = bpy.data.objects.new("Sol", sun_data)
    sun.rotation_euler = direction.normalized().to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(sun)

    (x0, y0, _), (x1, y1, _) = bounds
    H = project.room["ceiling_height"] * MM
    area = bpy.data.lights.new("Plafon", "AREA")
    area.shape = "RECTANGLE"
    area.size, area.size_y = 1.2, 1.2
    area.energy = 140
    area.color = (1.0, 0.90, 0.78)  # luz quente ~3000 K
    lamp = bpy.data.objects.new("Plafon", area)
    lamp.location = ((x0 + x1) / 2 * MM, (y0 + y1) / 2 * MM, H - 0.02)
    sc.collection.objects.link(lamp)
    return lamp


def camera(name, eye_mm, target_mm, lens=18, ortho_scale=None):
    cam_data = bpy.data.cameras.new(name)
    if ortho_scale:
        cam_data.type = "ORTHO"
        cam_data.ortho_scale = ortho_scale
    else:
        cam_data.lens = lens
    cam_data.clip_start = 0.05
    cam = bpy.data.objects.new(name, cam_data)
    eye, tgt = Vector(eye_mm) * MM, Vector(target_mm) * MM
    cam.location = eye
    up = "Y"
    d = (tgt - eye)
    if abs(d.normalized().z) > 0.99:  # olhando reto para baixo
        cam.rotation_euler = (0, 0, 0)
    else:
        cam.rotation_euler = d.to_track_quat("-Z", up).to_euler()
    bpy.context.scene.collection.objects.link(cam)
    return cam


def views_for(project):
    if project.room["type"] != "rectangular_room":
        L = project.room["wall_length"]
        return {
            "perspectiva": dict(eye=(L * 0.85, -3400, 1650), target=(L * 0.45, 0, 1050), lens=22, ceiling=False),
            "frontal": dict(eye=(L / 2, -3800, 1350), target=(L / 2, 0, 1350), lens=20, ceiling=False),
        }
    W, D = project.room["width"], project.room["length"]
    return {
        "interior_cama": dict(eye=(W * 0.21, D * 0.18, 1600), target=(W * 0.58, D, 700), lens=17, ceiling=True),
        "interior_guarda_roupa": dict(eye=(W * 0.25, D * 0.86, 1550), target=(W * 0.62, 0, 1000), lens=17, ceiling=True),
        "interior_janela": dict(eye=(W * 0.18, D * 0.30, 1500), target=(W, D * 0.42, 1050), lens=17, ceiling=True),
        "maquete": dict(eye=(-1300, D + 2500, 4600), target=(W * 0.55, D * 0.42, 300), lens=24, ceiling=False, cut=True),
        "planta": dict(eye=(W / 2, D / 2, 12000), target=(W / 2, D / 2, 0), ortho=max(W, D) * MM + 0.8,
                       ceiling=False, res=(1300, 1400)),
    }


def _over_background(path, bg=(0.95, 0.94, 0.92)):
    """Compõe o PNG com fundo transparente sobre um fundo claro."""
    import numpy as np
    img = bpy.data.images.load(path)
    px = np.array(img.pixels[:], dtype=np.float32).reshape(-1, 4)
    a = px[:, 3:4]
    px[:, :3] = px[:, :3] * a + np.array(bg, dtype=np.float32) * (1 - a)
    px[:, 3] = 1.0
    img.pixels[:] = px.ravel()
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()
    bpy.data.images.remove(img)


def main():
    argv = sys.argv[sys.argv.index("--") + 1:]
    spec_path, out_prefix = argv[0], argv[1]
    opts = dict(a.split("=", 1) if "=" in a else (a, "1") for a in argv[2:])
    samples = int(opts.get("--samples", 128))
    only = set(opts["--views"].split(",")) if "--views" in opts else None
    res = tuple(int(v) for v in opts.get("--res", "1600x1000").split("x"))

    for ob in list(bpy.data.objects):   # limpa a cena padrão (cubo, câmera, luz)
        bpy.data.objects.remove(ob, do_unlink=True)
    project = build_project(load_spec(spec_path))
    mats = Materials()
    col_walls, col_walls_cut, col_ceiling, col_open, bounds = build_scene(project, mats, wall_cut_mm=1100)

    def show(col, visible):
        bpy.context.view_layer.layer_collection.children[col.name].exclude = not visible
    lamp = setup_world_and_lights(project, bounds)

    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 6
    sc.cycles.diffuse_bounces = 4
    sc.cycles.glossy_bounces = 3
    sc.cycles.transmission_bounces = 4
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Medium High Contrast"
    sc.render.image_settings.file_format = "PNG"

    out = Path(out_prefix)
    out.parent.mkdir(parents=True, exist_ok=True)
    for name, v in views_for(project).items():
        if only and name not in only:
            continue
        cut = v.get("cut", False)
        show(col_walls, not cut)
        show(col_open, not cut)
        show(col_walls_cut, cut)
        show(col_ceiling, v["ceiling"])
        lamp.hide_render = not v["ceiling"]
        sc.render.film_transparent = not v["ceiling"]   # fundo claro aplicado depois
        sc.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.45 if v["ceiling"] else 0.9
        sc.view_settings.exposure = float(opts.get("--exposure", -0.6)) if v["ceiling"] else -0.4
        cam = camera(name, v["eye"], v["target"], v.get("lens", 18), v.get("ortho"))
        sc.camera = cam
        sc.render.resolution_x, sc.render.resolution_y = v.get("res", res)
        sc.render.filepath = str(out) + f"_{name}.png"
        bpy.ops.render.render(write_still=True)
        if sc.render.film_transparent:
            _over_background(sc.render.filepath)
        print("RENDER OK", sc.render.filepath, flush=True)


main()
