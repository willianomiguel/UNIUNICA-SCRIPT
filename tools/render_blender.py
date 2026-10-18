"""Render fotorrealista (Blender 4.2+/Cycles) de um projeto do gerador.

A geometria dos móveis/paredes é a MESMA dos arquivos de importação
(mesh.project_meshes). Por cima, este script adiciona "cenografia" só para a
imagem: texturas PBR reais (Poly Haven, CC0), céu HDRI, roupa de cama, cortinas,
luminárias, plantas, quadros, rodapé, porta e janela. Nada disso vai para os
arquivos do Promob.

Pré-requisito (uma vez): python tools/baixar_assets.py assets_cache
Uso:
  blender -b --factory-startup -P tools/render_blender.py -- samples/quarto_casal_real.json \
      docs/evidencias/render/Quarto --assets=assets_cache [--samples=256] [--res=1920x1200] [--views=a,b]
Sem a pasta de assets, cai em materiais procedurais (resultado mais simples).
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from promob_gen.mesh import project_meshes  # noqa: E402
from promob_gen.model import build_project, frame_box, frame_point  # noqa: E402
from promob_gen.spec import load_spec  # noqa: E402

MM = 0.001
ASSETS: Path | None = None


# ================================================================== materiais

def _new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    return m, m.node_tree, m.node_tree.nodes["Principled BSDF"]


def principled(name, color, rough=0.5, metal=0.0, **extra):
    m, _, b = _new_mat(name)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    for k, v in extra.items():
        b.inputs[k].default_value = v
    return m


def textured(name, tex, size_m=1.0, tint=None, rough_mul=1.0, normal=1.0, rough_override=None, extra=None,
             use_diffuse=True):
    """Material PBR com imagens (difusa/normal/rugosidade) em projeção 'box'
    sobre coordenadas do objeto em metros. size_m = tamanho real de 1 repetição."""
    folder = ASSETS / "tex" / tex if ASSETS else None
    if not folder or not (folder / "diff.jpg").exists():
        return principled(name, tint or (0.7, 0.7, 0.7), rough_override or 0.6)
    m, nt, b = _new_mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1 / size_m,) * 3
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])

    def img(fname, non_color):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(str(folder / fname), check_existing=True)
        n.projection = "BOX"
        n.projection_blend = 0.25
        if non_color:
            n.image.colorspace_settings.name = "Non-Color"
        nt.links.new(mp.outputs["Vector"], n.inputs["Vector"])
        return n

    if not use_diffuse:   # só relevo/rugosidade da textura; cor sólida definida por nós
        b.inputs["Base Color"].default_value = (*(tint or (0.8, 0.8, 0.8)), 1)
        col = None
    else:
        diff = img("diff.jpg", False)
        col = diff.outputs["Color"]
    if tint and col is not None:
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs["Factor"].default_value = 1.0
        mix.inputs["B"].default_value = (*tint, 1)
        nt.links.new(col, mix.inputs["A"])
        col = mix.outputs["Result"]
    if col is not None:
        nt.links.new(col, b.inputs["Base Color"])
    if rough_override is not None:
        b.inputs["Roughness"].default_value = rough_override
    elif (folder / "rough.jpg").exists():
        r = img("rough.jpg", True)
        mathn = nt.nodes.new("ShaderNodeMath")
        mathn.operation = "MULTIPLY"
        mathn.inputs[1].default_value = rough_mul
        nt.links.new(r.outputs["Color"], mathn.inputs[0])
        nt.links.new(mathn.outputs[0], b.inputs["Roughness"])
    if (folder / "nor.jpg").exists() and normal > 0:
        n = img("nor.jpg", True)
        nm = nt.nodes.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal
        nt.links.new(n.outputs["Color"], nm.inputs["Color"])
        nt.links.new(nm.outputs["Normal"], b.inputs["Normal"])
    for k, v in (extra or {}).items():
        b.inputs[k].default_value = v
    return m


def glass():
    """Vidro que não bloqueia raios de sombra (sol entra sem cáusticas)."""
    m = bpy.data.materials.new("Vidro")
    m.use_nodes = True
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    g = nt.nodes.new("ShaderNodeBsdfGlass")
    g.inputs["Roughness"].default_value = 0.0
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    lp = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Shadow Ray"], mix.inputs["Fac"])
    nt.links.new(g.outputs["BSDF"], mix.inputs[1])
    nt.links.new(tr.outputs["BSDF"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return m


def emissive(name, color, strength):
    m, nt, b = _new_mat(name)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Emission Color"].default_value = (*color, 1)
    b.inputs["Emission Strength"].default_value = strength
    return m


def sheer(name="Voil", color=(0.92, 0.90, 0.86)):
    """Tecido voil translúcido para cortina."""
    m, nt, b = _new_mat(name)
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = 0.9
    b.inputs["Transmission Weight"].default_value = 0.45
    b.inputs["Subsurface Weight"].default_value = 0.0
    b.inputs["Alpha"].default_value = 0.85
    return m


class Materials:
    def __init__(self):
        self.cache = {}

    def get(self, key, factory):
        if key not in self.cache:
            self.cache[key] = factory()
        return self.cache[key]

    def for_part(self, material, role):
        mat = material.lower()
        g = self.get
        if role == "wall":
            return g("parede", lambda: textured("Parede", "reboco", 1.5, (0.80, 0.78, 0.74), normal=0.15,
                                                rough_override=0.9, use_diffuse=False))
        if role == "floor":
            return g("piso", lambda: textured("Piso Laminado", "piso", 2.0, (1.0, 0.96, 0.92), rough_mul=0.9))
        if role == "handle" or "inox" in mat or role == "rod":
            return g("inox", lambda: principled("Inox Escovado", (0.80, 0.80, 0.80), 0.28, 1.0))
        if "espelh" in mat and role in ("door", "drawer_front"):
            return g("espelho", lambda: principled("Espelho", (0.90, 0.92, 0.93), 0.02, 1.0))
        if "sevilha" in mat or "freijo" in mat or "canela" in mat or "carvalho" in mat:
            return g("madeira", lambda: textured("Madeira Sevilha", "carvalho", 1.2, (0.93, 0.78, 0.62),
                                                 rough_mul=0.8, normal=0.4))
        if role == "upholstery":
            return g("box", lambda: textured("Linho Box", "linho", 0.6, (0.50, 0.48, 0.45), normal=0.8, use_diffuse=False))
        if role == "mattress":
            return g("lencol", lambda: textured("Lençol Algodão", "algodao", 0.5, (0.86, 0.85, 0.83), normal=0.5, use_diffuse=False))
        if role == "pillow":
            return g("fronha", lambda: textured("Fronha", "algodao", 0.4, (0.88, 0.87, 0.85), normal=0.5, use_diffuse=False))
        if role == "throw":
            return g("manta", lambda: textured("Manta Bouclé", "boucle", 0.4, (0.50, 0.33, 0.24), normal=1.0, use_diffuse=False))
        if "courino" in mat:
            return g("couro", lambda: textured("Courino Branco", "couro_branco", 0.6, (0.97, 0.96, 0.94),
                                               normal=0.6))
        if role == "plinth":
            return g("rodape_movel", lambda: principled("Rodapé Móvel", (0.10, 0.10, 0.10), 0.6))
        if role == "back":
            return g("hdf", lambda: principled("HDF", (0.78, 0.77, 0.74), 0.6))
        # MDP branco TX (padrão de marcenaria): leve textura e brilho acetinado
        return g("mdp", lambda: textured("MDP Branco TX", "reboco", 0.8, (0.82, 0.82, 0.80), normal=0.05,
                                         rough_override=0.38, use_diffuse=False))


BEVEL = {"mattress": (0.04, 5), "pillow": (0.06, 6), "upholstery": (0.015, 3), "throw": (0.02, 4),
         "wall": (0.0, 0), "floor": (0.0, 0), "handle": (0.004, 2)}


# ================================================================== geometria

def link(ob, col):
    col.objects.link(ob)
    return ob


def box_object(name, verts_mm, quads, material, role="", col=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(c * MM for c in v) for v in verts_mm], [], [tuple(q) for q in quads])
    me.update()
    ob = bpy.data.objects.new(name, me)
    link(ob, col or bpy.context.scene.collection)
    ob.data.materials.append(material)
    w, seg = BEVEL.get(role, (0.0018, 3))
    if w > 0:
        mod = ob.modifiers.new("bevel", "BEVEL")
        mod.width = w
        mod.segments = seg
        mod.limit_method = "NONE"
        mod.harden_normals = role not in ("mattress", "pillow", "throw", "upholstery")
        if role in ("mattress", "pillow", "throw", "upholstery"):
            for p in ob.data.polygons:
                p.use_smooth = True
    return ob


def aabb(name, lo, hi, material, role="", col=None):
    x0, y0, z0 = lo
    x1, y1, z1 = hi
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    q = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return box_object(name, v, q, material, role, col)


def cylinder(name, center_m, radius, depth, material, col, verts=48):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=radius, radius2=radius, depth=depth)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.location = center_m
    ob.data.materials.append(material)
    return link(ob, col)


def new_collection(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def import_model(key, location_m, rot_z_deg=0.0, scale=1.0, col=None, fit_height=None):
    """Importa um glTF do cache de assets; devolve a lista de objetos (ou [] se ausente)."""
    if not ASSETS:
        return []
    files = list((ASSETS / "models" / key).glob("*.gltf"))
    if not files:
        return []
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(files[0]))
    new = [o for o in bpy.data.objects if o not in before]
    roots = [o for o in new if o.parent is None]
    meshes = [o for o in new if o.type == "MESH"]
    if fit_height and meshes:
        bpy.context.view_layer.update()
        zs = [(o.matrix_world @ Vector(c)).z for o in meshes for c in o.bound_box]
        scale *= fit_height / (max(zs) - min(zs))
    for r in roots:
        r.location = Vector(location_m)
        r.rotation_euler = (0, 0, math.radians(rot_z_deg))
        r.scale = (scale, scale, scale)
    if col:
        for o in new:
            for c in list(o.users_collection):
                c.objects.unlink(o)
            col.objects.link(o)
    return new


def curtain_panel(name, p0, p1, n, z_top_m, height_m, material, col):
    """Cortina franzida entre os pontos p0 e p1 (metros, horizontais), ondulando na direção n."""
    width = (p1 - p0).length
    nx, nz = max(8, int(width / 0.02)), 40
    bm = bmesh.new()
    grid = []
    for j in range(nz + 1):
        row = []
        for i in range(nx + 1):
            t = i / nx
            wave = 0.045 * math.sin(t * width / 0.11 * 2 * math.pi)
            p = p0 + (p1 - p0) * t + n * wave
            row.append(bm.verts.new((p.x, p.y, z_top_m - j / nz * height_m)))
        grid.append(row)
    for j in range(nz):
        for i in range(nx):
            bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    ob.data.materials.append(material)
    ob.modifiers.new("espessura", "SOLIDIFY").thickness = 0.003
    return link(ob, col)


def wall_local_to_world_m(fr, x, y, z):
    return Vector(frame_point(fr, (x, y, z))) * MM


# ================================================================== cena

def build_scene(project, mats: Materials):
    cols = {k: new_collection(k) for k in ("Moveis", "Paredes", "Ambiente", "Teto", "Decor")}
    T = project.room["wall_thickness"]
    H = project.room["ceiling_height"]
    bed = next((m for m in project.modules if m.type == "bed"), None)
    accent = bed.wall if bed else None
    sage = mats.get("parede_destaque", lambda: textured("Parede Verde Sálvia", "reboco", 1.5, (0.33, 0.40, 0.32),
                                                         normal=0.15, rough_override=0.92, use_diffuse=False))

    # --- geometria do projeto (idêntica aos arquivos)
    for gname, meshes in project_meshes(project):
        for m in meshes:
            if gname == "AMBIENTE":
                role = "wall" if m.material == "Parede" else "floor"
                part = None
            else:
                mod = next(x for x in project.modules if x.id == gname)
                part = next(p for p in mod.parts if m.name == f"{mod.id}_{p.name}")
                role = part.role
            mat = mats.for_part(m.material, role)
            if role == "wall" and accent and m.name.startswith(f"Parede {accent} "):
                mat = sage
            col = cols["Paredes"] if role == "wall" else cols["Ambiente"] if role == "floor" else cols["Moveis"]
            box_object(m.name, m.vertices, m.quads, mat, role, col)

    env, decor = cols["Ambiente"], cols["Decor"]
    white_trim = mats.get("guarnicao", lambda: principled("Guarnição Branca", (0.86, 0.85, 0.83), 0.35))
    oak = mats.get("porta", lambda: textured("Porta Carvalho", "carvalho", 1.0, (0.95, 0.85, 0.72), normal=0.4))
    alu = mats.get("aluminio", lambda: principled("Alumínio Grafite", (0.12, 0.12, 0.13), 0.35, 1.0))
    inox = mats.get("inox", lambda: principled("Inox Escovado", (0.80, 0.80, 0.80), 0.28, 1.0))
    marble = mats.get("marmore", lambda: principled("Mármore Branco", (0.88, 0.87, 0.84), 0.15))
    vid = mats.get("vidro", glass)

    # --- portas, janelas, rodapé e cortinas, por parede
    for w in project.room["walls"]:
        fr = w["frame"]
        ops = sorted(w["openings"], key=lambda o: o["x"])
        # rodapé 7 cm (interrompido nas portas)
        x = w["x0"] if w["x0"] >= 0 else 0
        segs = []
        for o in ops:
            if o["type"] == "door":
                segs.append((x, o["x"] - 60))
                x = o["x"] + o["width"] + 60
        segs.append((x, w["length"]))
        for i, (a, b) in enumerate(segs):
            if b - a > 10:
                lo, hi = frame_box(fr, (a, 0, 0), (b - a, 12, 70))
                aabb(f"Rodape_{w['wall']}{i}", lo, hi, white_trim, "", env)
        for i, o in enumerate(ops):
            x, wd, s, h = o["x"], o["width"], o["sill"], o["height"]
            tag = f"{w['wall']}{i}"
            if o["type"] == "door":
                lo, hi = frame_box(fr, (x + 8, -T * 0.5 - 17, 0), (wd - 16, 35, h - 8))
                aabb(f"Porta_{tag}", lo, hi, oak, "door", env)
                for jx in (x - 70, x + wd):
                    lo, hi = frame_box(fr, (jx, 0, 0), (70, 15, h + 70))
                    aabb(f"Guarnicao_{tag}_{jx}", lo, hi, white_trim, "", env)
                lo, hi = frame_box(fr, (x - 70, 0, h), (wd + 140, 15, 70))
                aabb(f"Guarnicao_sup_{tag}", lo, hi, white_trim, "", env)
                lo, hi = frame_box(fr, (x + wd - 110, -T * 0.5 + 18, 1020), (120, 50, 18))
                aabb(f"Macaneta_{tag}", lo, hi, inox, "handle", env)
            else:
                prof, ymid = 45, -T * 0.5
                for (ox, oz, sx, sz) in ((x, s, prof, h), (x + wd - prof, s, prof, h), (x, s, wd, prof),
                                         (x, s + h - prof, wd, prof), (x + wd / 2 - prof / 2, s, prof, h)):
                    lo, hi = frame_box(fr, (ox, ymid - 22, oz), (sx, 44, sz))
                    aabb(f"Caixilho_{tag}_{ox}_{oz}", lo, hi, alu, "", env)
                lo, hi = frame_box(fr, (x + prof, ymid - 3, s + prof), (wd - 2 * prof, 6, h - 2 * prof))
                aabb(f"Vidro_{tag}", lo, hi, vid, "wall", env)
                lo, hi = frame_box(fr, (x - 30, 0, s - 25), (wd + 60, 45, 25))
                aabb(f"Peitoril_{tag}", lo, hi, marble, "", env)
                # cortina de voil (duas folhas recolhidas) + varão
                cmat = mats.get("voil", sheer)
                fold = 450
                n = Vector(fr[2])
                for a, b in ((x - 380, x - 380 + fold), (x + wd + 380 - fold, x + wd + 380)):
                    curtain_panel(f"Cortina_{tag}_{a}", wall_local_to_world_m(fr, a, 130, 0),
                                  wall_local_to_world_m(fr, b, 130, 0), n, (H - 30) * MM, (H - 50) * MM, cmat, decor)
                lo, hi = frame_box(fr, (x - 450, 120, H - 60), (wd + 900, 22, 22))
                aabb(f"Varao_{tag}", lo, hi, alu, "handle", decor)

    floor = next(p for p in project.environment if p.role == "floor")
    flo, fhi = frame_box(floor.frame, floor.origin, floor.size)
    aabb("Teto", (flo[0] - T, flo[1] - T, H), (fhi[0] + T, fhi[1] + T, H + 100),
         mats.get("teto", lambda: principled("Teto", (0.90, 0.90, 0.89), 0.92)), "wall", cols["Teto"])

    decorate(project, mats, cols, H)
    return cols, (flo, fhi)


def decorate(project, mats, cols, H):
    """Itens de cena (não fazem parte do projeto): roupa de cama, abajures, quadros, plantas, etc."""
    decor, moveis = cols["Decor"], cols["Moveis"]
    W, D = project.room.get("width", 0), project.room.get("length", 0)
    by_type = {}
    for m in project.modules:
        by_type.setdefault(m.type, []).append(m)

    def wb(m):  # bbox do módulo em metros
        lo, hi = m.world_bbox
        return Vector(lo) * MM, Vector(hi) * MM

    # --- cama: edredom caindo nas laterais + manta + almofadas decorativas
    for bed in by_type.get("bed", []):
        lo, hi = wb(bed)
        top = hi.z
        foot_y, head_y = lo.y, hi.y        # cama encostada na parede A (cabeceira em +Y)
        L = head_y - foot_y
        duvet = mats.get("edredom", lambda: textured("Edredom", "algodao", 0.45, (0.85, 0.84, 0.81), normal=0.7,
                                                     use_diffuse=False))
        x0, x1 = lo.x / MM, hi.x / MM
        y0, y1 = foot_y / MM, (foot_y + L * 0.68) / MM
        t = top / MM
        # edredom: manta superior + caimento nas laterais e no pé (peças finas, bordas macias)
        top_ob = aabb("Edredom", (x0 - 45, y0 - 45, t - 5), (x1 + 45, y1, t + 55), duvet, "pillow", decor)
        wrinkles(top_ob, 0.008)
        aabb("Edredom_lat_E", (x0 - 45, y0 - 45, t - 260), (x0 - 15, y1, t + 30), duvet, "throw", decor)
        aabb("Edredom_lat_D", (x1 + 15, y0 - 45, t - 260), (x1 + 45, y1, t + 30), duvet, "throw", decor)
        aabb("Edredom_pe", (x0 - 45, y0 - 45, t - 260), (x1 + 45, y0 - 15, t + 30), duvet, "throw", decor)
        aabb("Dobra_Edredom", (x0 - 40, y1 - 120, t + 30), (x1 + 40, y1 + 60, t + 95), duvet, "pillow", decor)
        # manta dobrada atravessada no pé da cama
        manta = mats.for_part("", "throw")
        mt = aabb("Manta", (x0 - 50, y0 + 60, t + 52), (x1 + 50, y0 + 360, t + 68), manta, "throw", decor)
        wrinkles(mt, 0.006)
        import_model("almofadas", ((lo.x + hi.x) / 2, head_y - 0.42, top + 0.02), 0, 0.95, decor)

    # cabeceira em couro com tachas fumê
    for p in by_type.get("wall_panel", []):
        lo, hi = wb(p)
        stud = mats.get("tacha", lambda: principled("Tacha Fumê", (0.20, 0.19, 0.18), 0.25, 1.0))
        sx, sz = hi.x - lo.x, hi.z - lo.z
        y = lo.y - 0.004
        n_x, n_z = int(sx / 0.035), int(sz / 0.035)
        pts = [(lo.x + 0.025 + i * (sx - 0.05) / n_x, lo.z + 0.025) for i in range(n_x + 1)]
        pts += [(lo.x + 0.025 + i * (sx - 0.05) / n_x, hi.z - 0.025) for i in range(n_x + 1)]
        pts += [(lo.x + 0.025, lo.z + 0.025 + j * (sz - 0.05) / n_z) for j in range(1, n_z)]
        pts += [(hi.x - 0.025, lo.z + 0.025 + j * (sz - 0.05) / n_z) for j in range(1, n_z)]
        bm = bmesh.new()
        for (x, z) in pts:
            bmesh.ops.create_uvsphere(bm, u_segments=10, v_segments=6, radius=0.006,
                                      matrix=Matrix.Translation((x, y, z)))
        me = bpy.data.meshes.new("Tachas")
        bm.to_mesh(me)
        bm.free()
        ob = bpy.data.objects.new("Tachas", me)
        ob.data.materials.append(stud)
        link(ob, decor)

    # guarda-roupa: espelho nas duas portas centrais (o produto real tem espelho)
    for wr in by_type.get("wardrobe", []):
        doors = [p for p in wr.parts if p.role == "door"]
        mid = len(doors) // 2
        for p in doors[mid - 1:mid + 1]:
            lo, hi = frame_box(wr.frame, tuple(wr.position[k] + p.origin[k] for k in range(3)), p.size)
            n = Vector(wr.frame[2])
            pad = 70
            lo2 = [lo[0] + (pad if abs(n.y) > 0.5 else 0), lo[1] + (pad if abs(n.x) > 0.5 else 0), lo[2] + pad]
            hi2 = [hi[0] - (pad if abs(n.y) > 0.5 else 0), hi[1] - (pad if abs(n.x) > 0.5 else 0), hi[2] - pad]
            k = 1 if abs(n.y) > 0.5 else 0
            face = hi[k] if (n.y > 0.5 or n.x > 0.5) else lo[k]
            lo2[k], hi2[k] = (face, face + 3) if (n.y > 0.5 or n.x > 0.5) else (face - 3, face)
            aabb(f"Espelho_{p.name}", lo2, hi2, mats.for_part("espelho", "door"), "handle", decor)

    # abajures nos criados-mudos (base cerâmica + cúpula de tecido + luz quente)
    shade_mat = mats.get("cupula", lambda: principled("Cúpula Linho", (0.93, 0.89, 0.80), 0.9,
                                                      **{"Transmission Weight": 0.35}))
    base_mat = mats.get("ceramica", lambda: principled("Cerâmica Areia", (0.72, 0.62, 0.50), 0.35))
    for ns in by_type.get("nightstand", []):
        lo, hi = wb(ns)
        c = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2 + 0.03, hi.z))
        cylinder("Abajur_base", (c.x, c.y, c.z + 0.16), 0.065, 0.32, base_mat, decor)
        shade = cylinder("Abajur_cupula", (c.x, c.y, c.z + 0.43), 0.15, 0.22, shade_mat, decor, 64)
        shade.modifiers.new("oco", "SOLIDIFY").thickness = 0.002
        ld = bpy.data.lights.new("Abajur", "POINT")
        ld.energy = 22
        ld.color = (1.0, 0.78, 0.52)
        ld.shadow_soft_size = 0.04
        lamp = bpy.data.objects.new("Abajur_luz", ld)
        lamp.location = (c.x, c.y, c.z + 0.42)
        link(lamp, decor)
        import_model("porta_retrato", (c.x - 0.15, c.y + 0.05, c.z), 200, 1.0, decor)

    # cômoda: vaso + planta pequena; quadro na parede da cabeceira
    for dr in by_type.get("dresser", []):
        lo, hi = wb(dr)
        c = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, hi.z))
        import_model("vaso", (c.x, c.y - 0.35, c.z), 0, 1.0, decor)
        import_model("planta", (c.x, c.y + 0.35, c.z), 0, 1.3, decor)
    for bed in by_type.get("bed", []):
        lo, hi = wb(bed)
        art_frames(((lo.x + hi.x) / 2, hi.y + 0.03, 1.55), mats, decor)

    # escrivaninha: luminária + cadeira
    for dk in by_type.get("desk", []):
        lo, hi = wb(dk)
        n = Vector(dk.frame[2])
        c = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, hi.z))
        u = Vector(dk.frame[1])
        rot = math.degrees(math.atan2(n.y, n.x)) + 90
        import_model("luminaria_mesa", c + u * 0.42 * 1 - n * 0.12, rot + 180, 1.0, decor)
        import_model("cadeira", (c.x + n.x * 0.55, c.y + n.y * 0.55, 0), rot + 180, 1.0, decor)

    # planta grande no canto livre entre cômoda e criado-mudo (parede D / A)
    if W and D:
        import_model("planta_grande", (0.32, D * MM - 0.32, 0), 30, 1.0, decor, fit_height=1.25)

    # tapete sob a cama
    for bed in by_type.get("bed", []):
        lo, hi = wb(bed)
        rug = mats.get("tapete", lambda: textured("Tapete", "tapete", 0.8, (0.62, 0.58, 0.52), normal=1.0, use_diffuse=False))
        aabb("Tapete", ((lo.x - 0.45) / MM, (lo.y - 0.65) / MM, 0), ((hi.x + 0.45) / MM, (hi.y - 0.55) / MM, 14),
             rug, "throw", decor)


def wrinkles(ob, strength):
    """Rugas sutis de tecido: subdivisão + deslocamento por ruído."""
    sub = ob.modifiers.new("sub", "SUBSURF")
    sub.subdivision_type = "SIMPLE"
    sub.levels = sub.render_levels = 4
    tex = bpy.data.textures.new(f"rugas_{ob.name}", "CLOUDS")
    tex.noise_scale = 0.18
    disp = ob.modifiers.new("rugas", "DISPLACE")
    disp.texture = tex
    disp.texture_coords = "GLOBAL"
    disp.strength = strength
    disp.mid_level = 0.5
    for p in ob.data.polygons:
        p.use_smooth = True


def art_material(seed, palette):
    """Tela abstrata (pinceladas largas) com paleta terrosa."""
    m, nt, b = _new_mat(f"Arte{seed}")
    b.inputs["Roughness"].default_value = 0.8
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.6
    nz.inputs["Detail"].default_value = 2.0
    nz.inputs["Distortion"].default_value = 1.5
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "CONSTANT"
    el = ramp.color_ramp.elements
    el[0].color = (*palette[0], 1)
    el[1].position = 0.75
    el[1].color = (*palette[-1], 1)
    for i, c in enumerate(palette[1:-1]):
        e = el.new(0.35 + i * 0.15)
        e.color = (*c, 1)
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (seed, seed * 0.7, seed * 1.3)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
    nt.links.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    return m


def art_frames(center_m, mats, col):
    """Dois quadros lado a lado (moldura fina de carvalho + tela abstrata)."""
    frame_mat = mats.get("moldura", lambda: principled("Moldura Preta", (0.03, 0.03, 0.03), 0.4))
    palettes = [[(0.80, 0.74, 0.64), (0.62, 0.35, 0.22), (0.30, 0.36, 0.30), (0.92, 0.88, 0.80)],
                [(0.90, 0.86, 0.78), (0.35, 0.40, 0.33), (0.70, 0.45, 0.30), (0.82, 0.76, 0.66)]]
    cx, wy, cz = center_m
    w, h, gap = 0.50, 0.66, 0.06
    for k, sx in enumerate((-1, 1)):
        x0 = cx + sx * gap / 2 - (w if sx < 0 else 0)
        aabb(f"Moldura{k}", ((x0) / MM, (wy - 0.03) / MM, (cz - h / 2) / MM),
             ((x0 + w) / MM, wy / MM, (cz + h / 2) / MM), frame_mat, "", col)
        aabb(f"Tela{k}", ((x0 + 0.02) / MM, (wy - 0.032) / MM, (cz - h / 2 + 0.02) / MM),
             ((x0 + w - 0.02) / MM, (wy - 0.028) / MM, (cz + h / 2 - 0.02) / MM), art_material(k * 3.7 + 1, palettes[k]),
             "wall", col)


def setup_world_and_lights(project, bounds, cols):
    sc = bpy.context.scene
    world = bpy.data.worlds.new("Mundo")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    hdr = ASSETS / "hdri" / "ceu.hdr" if ASSETS else None
    if hdr and hdr.exists():
        env = nt.nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(str(hdr))
        mp = nt.nodes.new("ShaderNodeMapping")
        tc = nt.nodes.new("ShaderNodeTexCoord")
        mp.inputs["Rotation"].default_value = (0, 0, math.radians(150))
        nt.links.new(tc.outputs["Generated"], mp.inputs["Vector"])
        nt.links.new(mp.outputs["Vector"], env.inputs["Vector"])
        nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    else:
        sky = nt.nodes.new("ShaderNodeTexSky")
        sky.sky_type = "NISHITA"
        sky.sun_disc = False
        nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 1.6

    win = next(((w, o) for w in project.room["walls"] for o in w["openings"] if o["type"] == "window"), None)
    if win:
        n, u = Vector(win[0]["frame"][2]), Vector(win[0]["frame"][1])
        direction = n * math.cos(math.radians(30)) + u * 0.45
        direction.z = -math.sin(math.radians(30))
    else:
        direction = Vector((0.3, 0.5, -0.8))
    sun_data = bpy.data.lights.new("Sol", "SUN")
    sun_data.energy = 4.5
    sun_data.angle = math.radians(1.2)
    sun_data.color = (1.0, 0.92, 0.82)
    sun = bpy.data.objects.new("Sol", sun_data)
    sun.rotation_euler = direction.normalized().to_track_quat("-Z", "Y").to_euler()
    sc.collection.objects.link(sun)

    # spots embutidos no teto (luz quente, cria degradê nas paredes)
    (x0, y0, _), (x1, y1, _) = bounds
    H = project.room["ceiling_height"] * MM
    spot_mat = emissive("Spot", (1.0, 0.85, 0.65), 6)
    spots = []
    for w in project.room["walls"]:
        if w["length"] < 1500:
            continue
        fr = w["frame"]
        for t in (0.25, 0.75):
            p = wall_local_to_world_m(fr, w["length"] * t, 450, 0)
            p.z = H - 0.005
            sd = bpy.data.lights.new("Spot", "SPOT")
            sd.energy = 70
            sd.spot_size = math.radians(70)
            sd.spot_blend = 0.6
            sd.shadow_soft_size = 0.02
            sd.color = (1.0, 0.84, 0.64)
            so = bpy.data.objects.new("Spot", sd)
            so.location = p
            so.rotation_euler = (0, 0, 0)  # aponta para -Z
            link(so, cols["Teto"])
            spots.append(so)
            cylinder("Spot_aro", (p.x, p.y, H - 0.002), 0.04, 0.004, spot_mat, cols["Teto"], 32)
    return spots


def camera(name, eye_mm, target_mm, lens=18, ortho_scale=None, shift_y=0.0, level=True):
    """Câmera com verticais corrigidas (level=True: horizonte nivelado + shift, como foto de interiores)."""
    cd = bpy.data.cameras.new(name)
    cd.sensor_width = 36
    if ortho_scale:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho_scale
    else:
        cd.lens = lens
    cd.shift_y = shift_y
    cd.clip_start = 0.05
    cam = bpy.data.objects.new(name, cd)
    eye, tgt = Vector(eye_mm) * MM, Vector(target_mm) * MM
    cam.location = eye
    d = tgt - eye
    if abs(d.normalized().z) > 0.99:
        cam.rotation_euler = (0, 0, 0)
    else:
        if level:
            d.z = 0
        cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.collection.objects.link(cam)
    return cam


def views_for(project):
    if project.room["type"] != "rectangular_room":
        L = project.room["wall_length"]
        return {
            "perspectiva": dict(eye=(L * 0.85, -3400, 1350), target=(L * 0.45, 0, 1350), lens=20, ceiling=False),
        }
    W, D = project.room["width"], project.room["length"]
    return {
        "interior_cama": dict(eye=(W * 0.20, D * 0.16, 1350), target=(W * 0.62, D, 1350), lens=19, shift_y=-0.06),
        "interior_guarda_roupa": dict(eye=(W * 0.24, D * 0.86, 1350), target=(W * 0.66, 0, 1350), lens=19,
                                      shift_y=-0.04),
        "interior_janela": dict(eye=(W * 0.12, D * 0.40, 1350), target=(W, D * 0.36, 1350), lens=21, shift_y=-0.05),
        "detalhe_cabeceira": dict(eye=(W * 0.36, D * 0.60, 1150), target=(W * 0.27, D, 950), lens=32,
                                  shift_y=-0.02),
        "planta": dict(eye=(W / 2, D / 2, 12000), target=(W / 2, D / 2, 0), ortho=max(W, D) * MM + 0.6,
                       ceiling=False, res=(1500, 1600)),
    }


def _over_background(path, bg=(0.95, 0.94, 0.92)):
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
    global ASSETS
    argv = sys.argv[sys.argv.index("--") + 1:]
    spec_path, out_prefix = argv[0], argv[1]
    opts = dict(a.split("=", 1) if "=" in a else (a, "1") for a in argv[2:])
    samples = int(opts.get("--samples", 256))
    only = set(opts["--views"].split(",")) if "--views" in opts else None
    res = tuple(int(v) for v in opts.get("--res", "1920x1200").split("x"))
    ASSETS = Path(opts.get("--assets", ROOT / "assets_cache"))
    if not ASSETS.exists():
        print("AVISO: pasta de assets ausente; usando materiais simples. Rode tools/baixar_assets.py")
        ASSETS = None

    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    project = build_project(load_spec(spec_path))
    mats = Materials()
    cols, bounds = build_scene(project, mats)
    spots = setup_world_and_lights(project, bounds, cols)

    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.015
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.max_bounces = 8
    sc.cycles.diffuse_bounces = 5
    sc.cycles.glossy_bounces = 4
    sc.cycles.transmission_bounces = 6
    sc.cycles.transparent_max_bounces = 8
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Base Contrast"
    sc.render.image_settings.file_format = "PNG"

    def show(col, visible):
        bpy.context.view_layer.layer_collection.children[col.name].exclude = not visible

    out = Path(out_prefix)
    out.parent.mkdir(parents=True, exist_ok=True)
    for name, v in views_for(project).items():
        if only and name not in only:
            continue
        interior = v.get("ceiling", True)
        show(cols["Teto"], interior)
        sc.render.film_transparent = not interior
        sc.view_settings.exposure = float(opts.get("--exposure", 1.3)) if interior else -0.3
        cam = camera(name, v["eye"], v["target"], v.get("lens", 18), v.get("ortho"), v.get("shift_y", 0.0))
        sc.camera = cam
        sc.render.resolution_x, sc.render.resolution_y = v.get("res", res)
        sc.render.filepath = str(out) + f"_{name}.png"
        bpy.ops.render.render(write_still=True)
        if sc.render.film_transparent:
            _over_background(sc.render.filepath)
        print("RENDER OK", sc.render.filepath, flush=True)


if __name__ == "__main__":
    main()
