"""Representação intermediária (IR) e cálculo de layout/geometria.

Sistema de coordenadas INTERNO de layout (mm, Z para cima):
  X = ao longo da parede, da esquerda (0) para a direita, vista de dentro do ambiente
  Y = profundidade, 0 na face da parede, positivo para dentro do ambiente
  Z = altura, 0 no piso
Esse referencial é de mão esquerda (olhando a parede, +X fica à direita e +Y
vem para o observador). Os exportadores convertem para o referencial de mão
direita do arquivo com mesh.to_world(): (x, y, z) -> (x, -y, z), ou seja,
ambiente em -Y e parede em +Y. Sem essa conversão o projeto sairia espelhado.

Ambientes com várias paredes: cada parede tem um "frame" (origem, u, n) no
referencial do arquivo (mão direita, Z para cima, interior em [0,W]x[0,D]):
u = direção ao longo da parede (esquerda->direita vista de dentro) e n = normal
para dentro do ambiente. Ponto local (x, y, z) -> origem + x*u + y*n + z*Z.
Para a cozinha linear o frame da parede A é ((0,0,0), (1,0,0), (0,-1,0)), que é
exatamente mesh.to_world.

Cada módulo é decomposto em peças retangulares (caixas alinhadas aos eixos),
o que serve tanto para gerar geometria 3D quanto lista de corte.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict, replace

from .spec import TALL_TYPES, UPPER_TYPES, ModuleSpec, ProjectSpec, module_elevation

DOOR_GAP = 3.0       # folga entre portas/frentes
DRAWER_SIDE = 12.0   # espessura de lateral de gaveta (simplificado)
HANDLE_LEN = 160.0   # comprimento do puxador (fora da lista de corte)

Frame = tuple[tuple[float, float, float], tuple[float, float, float], tuple[float, float, float]]
DEFAULT_FRAME: Frame = ((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), (0.0, -1.0, 0.0))   # parede A da cozinha linear
WORLD_FRAME: Frame = ((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), (0.0, 1.0, 0.0))     # coordenadas do arquivo


def wall_frames(room) -> dict[str, Frame]:
    if room.type == "linear_kitchen":
        return {"A": DEFAULT_FRAME}
    W, D = room.width, room.length
    return {
        "A": ((0.0, D, 0.0), (1.0, 0.0, 0.0), (0.0, -1.0, 0.0)),    # fundo
        "B": ((W, D, 0.0), (0.0, -1.0, 0.0), (-1.0, 0.0, 0.0)),     # direita
        "C": ((W, 0.0, 0.0), (-1.0, 0.0, 0.0), (0.0, 1.0, 0.0)),    # frente
        "D": ((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), (1.0, 0.0, 0.0)),   # esquerda
    }


def frame_point(frame: Frame, p) -> tuple[float, float, float]:
    (ox, oy, oz), (ux, uy, uz), (nx, ny, nz) = frame
    x, y, z = p
    return (ox + x * ux + y * nx, oy + x * uy + y * ny, oz + x * uz + y * nz + z)


def frame_box(frame: Frame, origin, size):
    """Caixa local -> (canto mínimo, canto máximo) no referencial do arquivo."""
    pts = [frame_point(frame, (origin[0] + i * size[0], origin[1] + j * size[1], origin[2] + k * size[2]))
           for i in (0, 1) for j in (0, 1) for k in (0, 1)]
    return tuple(min(p[a] for p in pts) for a in range(3)), tuple(max(p[a] for p in pts) for a in range(3))


@dataclass
class Part:
    """Peça retangular: origem = canto mínimo (x, y, z) em coordenadas do MÓDULO."""
    name: str
    role: str            # side, bottom, top, rail, back, shelf, door, drawer_front, drawer_box, plinth, panel
    material: str
    origin: tuple[float, float, float]
    size: tuple[float, float, float]   # extensão em X, Y, Z
    thickness: float                   # espessura nominal (para lista de corte)
    frame: Frame | None = None         # só peças de ambiente (paredes/piso); módulos usam o frame do módulo

    def cut_dims(self) -> tuple[float, float, float]:
        """(comprimento, largura, espessura) da chapa — maior dimensão primeiro."""
        dims = sorted(self.size, reverse=True)
        return dims[0], dims[1], dims[2]


@dataclass
class Module:
    index: int
    id: str
    type: str
    label: str
    position: tuple[float, float, float]   # canto mínimo do módulo no projeto
    width: float
    depth: float
    height: float
    parts: list[Part] = field(default_factory=list)
    wall: str = "A"
    frame: Frame = DEFAULT_FRAME

    @property
    def world_bbox(self):
        """Caixa envolvente no referencial do arquivo (sem tampo)."""
        lo, hi = self.bbox
        return frame_box(self.frame, lo, tuple(hi[k] - lo[k] for k in range(3)))

    @property
    def bbox(self):
        """Caixa envolvente do módulo (sem o tampo, que pode cobrir vários módulos)."""
        ps = [p for p in self.parts if p.role != "countertop"]
        xs = [p.origin[0] for p in ps] + [p.origin[0] + p.size[0] for p in ps]
        ys = [p.origin[1] for p in ps] + [p.origin[1] + p.size[1] for p in ps]
        zs = [p.origin[2] for p in ps] + [p.origin[2] + p.size[2] for p in ps]
        px, py, pz = self.position
        return (px + min(xs), py + min(ys), pz + min(zs)), (px + max(xs), py + max(ys), pz + max(zs))


@dataclass
class Project:
    name: str
    units: str
    room: dict
    modules: list[Module]
    environment: list[Part]   # paredes / piso, em coordenadas do projeto
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        d = asdict(self)
        for m, md in zip(self.modules, d["modules"]):
            lo, hi = m.world_bbox
            md["bbox_arquivo"] = {"min": lo, "max": hi}
        return d


# ---------------------------------------------------------------- módulos

def _default_doors(width: float) -> int:
    return 1 if width <= 500 else 2


def _carcass(m: ModuleSpec, spec: ProjectSpec, top_kind: str) -> list[Part]:
    mat = spec.materials
    t, bt = mat.carcass_thickness, mat.back_thickness
    w, d, h = m.width, m.depth, m.height
    parts = [
        Part("Lateral Esquerda", "side", mat.carcass, (0, 0, 0), (t, d, h), t),
        Part("Lateral Direita", "side", mat.carcass, (w - t, 0, 0), (t, d, h), t),
        Part("Base", "bottom", mat.carcass, (t, bt, 0), (w - 2 * t, d - bt, t), t),
        Part("Fundo", "back", mat.back, (t, 0, t), (w - 2 * t, bt, h - 2 * t), bt),
    ]
    if top_kind == "full":
        parts.append(Part("Tampo Interno", "top", mat.carcass, (t, bt, h - t), (w - 2 * t, d - bt, t), t))
    elif top_kind == "rails":
        rail = 80.0
        parts.append(Part("Travessa Traseira", "rail", mat.carcass, (t, bt, h - t), (w - 2 * t, rail, t), t))
        parts.append(Part("Travessa Frontal", "rail", mat.carcass, (t, d - rail, h - t), (w - 2 * t, rail, t), t))
    return parts


def _shelves(m: ModuleSpec, spec: ProjectSpec, n: int) -> list[Part]:
    mat = spec.materials
    t, bt = mat.carcass_thickness, mat.back_thickness
    inner_h = m.height - 2 * t
    parts = []
    setback = 20.0
    for i in range(n):
        z = t + inner_h * (i + 1) / (n + 1) - t / 2
        parts.append(Part(f"Prateleira {i + 1}", "shelf", mat.carcass, (t + 1, bt, z),
                          (m.width - 2 * t - 2, m.depth - bt - setback, t), t))
    return parts


def _doors(m: ModuleSpec, spec: ProjectSpec, n: int) -> list[Part]:
    ft = spec.materials.front_thickness
    if n == 0:
        return []
    w_each = (m.width - DOOR_GAP * (n + 1)) / n
    parts = []
    for i in range(n):
        x = DOOR_GAP + i * (w_each + DOOR_GAP)
        parts.append(Part(f"Porta {i + 1}", "door", spec.materials.front, (x, m.depth, DOOR_GAP),
                          (w_each, ft, m.height - 2 * DOOR_GAP), ft))
        # Puxador vertical do lado de abertura (pares de portas abrem pelo centro)
        hx = x + w_each - 40 if i % 2 == 0 else x + 20
        if m.type == "wall_cabinet":
            hz = DOOR_GAP + 40
        elif m.type in TALL_TYPES:
            hz = min(1000.0, m.height / 2)
        else:
            hz = m.height - DOOR_GAP - 40 - HANDLE_LEN
        parts.append(Part(f"Puxador Porta {i + 1}", "handle", "Puxador Inox", (hx, m.depth + ft, hz),
                          (20, 20, HANDLE_LEN), 20))
    return parts


def _drawers(m: ModuleSpec, spec: ProjectSpec, n: int) -> list[Part]:
    mat = spec.materials
    ft, t, bt = mat.front_thickness, mat.carcass_thickness, mat.back_thickness
    h_each = (m.height - DOOR_GAP * (n + 1)) / n
    inner_w = m.width - 2 * t
    slide = 13.0  # folga por lado p/ corrediça telescópica
    box_w = inner_w - 2 * slide
    box_d = max(m.depth - bt - 30, 100)
    parts = []
    for i in range(n):
        z = DOOR_GAP + i * (h_each + DOOR_GAP)
        parts.append(Part(f"Frente Gaveta {i + 1}", "drawer_front", mat.front, (DOOR_GAP, m.depth, z),
                          (m.width - 2 * DOOR_GAP, ft, h_each), ft))
        parts.append(Part(f"Puxador Gaveta {i + 1}", "handle", "Puxador Inox",
                          ((m.width - HANDLE_LEN) / 2, m.depth + ft, z + h_each - 50), (HANDLE_LEN, 20, 20), 20))
        box_h = max(h_each - 60, 60)
        x0, y0, z0 = t + slide, m.depth - box_d, z + 25
        s = DRAWER_SIDE
        parts += [
            Part(f"Gaveta {i + 1} Lateral E", "drawer_box", mat.carcass, (x0, y0, z0), (s, box_d, box_h), s),
            Part(f"Gaveta {i + 1} Lateral D", "drawer_box", mat.carcass, (x0 + box_w - s, y0, z0), (s, box_d, box_h), s),
            Part(f"Gaveta {i + 1} Traseira", "drawer_box", mat.carcass, (x0 + s, y0, z0), (box_w - 2 * s, s, box_h), s),
            Part(f"Gaveta {i + 1} Contrafrente", "drawer_box", mat.carcass, (x0 + s, y0 + box_d - s, z0), (box_w - 2 * s, s, box_h), s),
            Part(f"Gaveta {i + 1} Fundo", "drawer_box", mat.back, (x0 + s, y0 + s, z0), (box_w - 2 * s, box_d - 2 * s, bt), bt),
        ]
    return parts


def _wardrobe(m: ModuleSpec, spec: ProjectSpec) -> list[Part]:
    """Guarda-roupa: caixa, divisórias a cada par de portas, maleiro, cabideiro e gavetas internas."""
    mat = spec.materials
    t, bt = mat.carcass_thickness, mat.back_thickness
    n_doors = m.doors if m.doors is not None else max(2, round(m.width / 450))
    parts = _carcass(m, spec, "full")
    sections = max(1, n_doors // 2)
    inner = m.width - 2 * t
    sec_w = (inner - (sections - 1) * t) / sections
    trunk_z = m.height - t - 400  # maleiro
    for k in range(sections):
        x0 = t + k * (sec_w + t)
        if k:
            parts.append(Part(f"Divisória {k}", "divider", mat.carcass, (x0 - t, bt, t), (t, m.depth - bt, m.height - 2 * t), t))
        parts.append(Part(f"Maleiro {k + 1}", "shelf", mat.carcass, (x0, bt, trunk_z), (sec_w, m.depth - bt - 20, t), t))
        parts.append(Part(f"Cabideiro {k + 1}", "rod", "Tubo Oval Cromado", (x0 + 5, m.depth / 2 - 10, trunk_z - 60),
                          (sec_w - 10, 20, 15), 15))
    # gavetas internas na última seção (opcional)
    if m.drawers:
        x0 = t + (sections - 1) * (sec_w + t)
        dh = 180.0
        for i in range(m.drawers):
            z = t + 80 + i * (dh + 10)
            parts.append(Part(f"Gaveta Interna {i + 1} Frente", "drawer_front", mat.carcass, (x0 + 13, m.depth - 80, z),
                              (sec_w - 26, t, dh), t))
            parts.append(Part(f"Gaveta Interna {i + 1} Caixa", "drawer_box", mat.carcass, (x0 + 13, bt + 20, z),
                              (sec_w - 26, m.depth - bt - 100, dh - 30), DRAWER_SIDE))
    return parts + _doors(ModuleSpec(**{**m.__dict__, "type": "wardrobe"}), spec, n_doors)


def _desk(m: ModuleSpec, spec: ProjectSpec) -> list[Part]:
    mat = spec.materials
    t, top_t = mat.carcass_thickness, 25.0
    return [
        Part("Tampo", "top", mat.front, (0, 0, m.height - top_t), (m.width, m.depth, top_t), top_t),
        Part("Lateral Esquerda", "side", mat.front, (0, 20, 0), (t, m.depth - 20, m.height - top_t), t),
        Part("Lateral Direita", "side", mat.front, (m.width - t, 20, 0), (t, m.depth - 20, m.height - top_t), t),
        Part("Painel Frontal (saia)", "back", mat.carcass, (t, 40, m.height - top_t - 300), (m.width - 2 * t, t, 300), t),
    ]


def _bed(m: ModuleSpec, spec: ProjectSpec) -> list[Part]:
    """Cama box: base estofada + colchão + travesseiros. Item de referência, fora da lista de corte."""
    mattress = min(300.0, m.height * 0.45)
    base_h = m.height - mattress
    parts = [
        Part("Base Box", "upholstery", "Tecido Linho Cinza", (0, 0, 0), (m.width, m.depth, base_h), base_h),
        Part("Colchão", "mattress", "Colchao", (10, 10, base_h), (m.width - 20, m.depth - 20, mattress), mattress),
    ]
    n = 2 if m.width >= 1200 else 1
    pw = min(500.0, (m.width - 120) / n)
    for i in range(n):
        x = (m.width - n * pw - (n - 1) * 40) / 2 + i * (pw + 40)
        parts.append(Part(f"Travesseiro {i + 1}", "pillow", "Travesseiro", (x, 60, m.height), (pw, 350, 120), 120))
    parts.append(Part("Peseira (manta)", "throw", "Manta Tecido", (0, m.depth - 550, m.height - 5), (m.width, 450, 12), 12))
    return parts


def build_module_parts(m: ModuleSpec, spec: ProjectSpec) -> list[Part]:
    if m.front_material or m.carcass_material:
        spec = replace(spec, materials=replace(spec.materials, front=m.front_material or spec.materials.front,
                                               carcass=m.carcass_material or spec.materials.carcass))
    if m.type == "wardrobe":
        return _wardrobe(m, spec)
    if m.type == "nightstand":
        return _carcass(m, spec, "full") + _drawers(m, spec, m.drawers or 2)
    if m.type == "dresser":
        return _carcass(m, spec, "full") + _drawers(m, spec, m.drawers or 4)
    if m.type == "desk":
        return _desk(m, spec)
    if m.type == "bed":
        return _bed(m, spec)
    if m.type == "wall_panel":
        return [Part("Painel", "panel", spec.materials.front, (0, 0, 0), (m.width, m.depth, m.height), m.depth)]
    if m.type == "filler":
        ft = spec.materials.front_thickness
        return [Part("Tapa-vão", "panel", spec.materials.front, (0, m.depth, 0), (m.width, ft, m.height), ft)]
    if m.type == "base_cabinet":
        return (_carcass(m, spec, "rails") + _shelves(m, spec, 1 if m.shelves is None else m.shelves)
                + _doors(m, spec, m.doors if m.doors is not None else _default_doors(m.width)))
    if m.type == "sink_cabinet":
        return (_carcass(m, spec, "rails") + _shelves(m, spec, m.shelves or 0)
                + _doors(m, spec, m.doors if m.doors is not None else _default_doors(m.width)))
    if m.type == "drawer_cabinet":
        return _carcass(m, spec, "rails") + _drawers(m, spec, m.drawers or 3)
    if m.type == "wall_cabinet":
        return (_carcass(m, spec, "full") + _shelves(m, spec, 1 if m.shelves is None else m.shelves)
                + _doors(m, spec, m.doors if m.doors is not None else _default_doors(m.width)))
    if m.type == "tall_cabinet":
        return (_carcass(m, spec, "full") + _shelves(m, spec, 4 if m.shelves is None else m.shelves)
                + _doors(m, spec, m.doors if m.doors is not None else _default_doors(m.width)))
    raise ValueError(f"tipo de módulo desconhecido: {m.type}")


# ---------------------------------------------------------------- layout

def build_project(spec: ProjectSpec) -> Project:
    room = spec.room
    frames = wall_frames(room)
    cursors: dict[tuple[str, str], float] = {}
    modules: list[Module] = []
    warnings: list[str] = []

    def is_upper(ms):
        return ms.type in UPPER_TYPES

    # Ordem: posições explícitas, depois piso, depois aéreos (que desviam de torres e janelas)
    order = sorted(enumerate(spec.cabinet_modules),
                   key=lambda im: (im[1].x is None, is_upper(im[1])))
    for i, ms in order:
        row = "aereo" if is_upper(ms) else "piso"
        key = (ms.wall, row)
        z = module_elevation(spec, ms)
        start = cursors.get(key, room.start_offset)
        x = ms.x if ms.x is not None else start
        if ms.x is None:
            blocked = [(o.x, o.x + o.width) for o in room.openings if o.wall == ms.wall
                       and o.sill < z + ms.height and z < o.sill + o.height
                       and (row == "aereo" or o.type == "door" or ms.type in TALL_TYPES)]
            blocked += [(m.position[0], m.position[0] + m.width) for m in modules if m.wall == ms.wall
                        and (row == "aereo" and m.type in TALL_TYPES and m.position[2] + m.height > z
                             or row == "piso" and m.type != "wall_panel" and ms.type != "wall_panel"
                             and m.position[2] < z + ms.height)]
            moved = True
            while moved:
                moved = False
                for b0, b1 in blocked:
                    if x < b1 and b0 < x + ms.width:
                        x, moved = b1, True
            if x != start:
                warnings.append(f"Módulo #{i + 1} ({ms.type}) deslocado para x={x:g} na parede {ms.wall} "
                                f"para evitar abertura/outro módulo")
        L = room.wall_len(ms.wall)
        if x + ms.width > L + 1e-6:
            raise ValueError(f"módulo #{i + 1} ({ms.type}) termina em x={x + ms.width:g} mm, além da parede "
                             f"{ms.wall} ({L:g} mm)")
        mid = f"M{i + 1:02d}_{ms.type}"
        label = ms.label or f"{ms.type} {ms.width:g}x{ms.height:g}x{ms.depth:g}"
        modules.append(Module(i, mid, ms.type, label, (x, ms.wall_offset, z), ms.width, ms.depth, ms.height,
                              build_module_parts(ms, spec), ms.wall, frames[ms.wall]))
        if ms.x is None and ms.type != "wall_panel":
            cursors[key] = x + ms.width + spec.gap
    modules.sort(key=lambda m: m.index)

    # Rodapé e tampo
    plinth_types = {"base_cabinet", "drawer_cabinet", "sink_cabinet", "tall_cabinet", "wardrobe",
                    "nightstand", "dresser"}
    for mod in modules:
        ms = spec.cabinet_modules[mod.index]
        ph = mod.position[2] if ms.elevation is None else 0.0
        if mod.type in plinth_types and ph > 0:
            mod.parts.append(Part("Rodapé", "plinth", spec.materials.carcass,
                                  (0, mod.depth - 60, -ph), (mod.width, spec.materials.carcass_thickness, ph),
                                  spec.materials.carcass_thickness))
    if spec.countertop:
        for wall in room.walls:
            runs = _contiguous_runs([m for m in modules if m.wall == wall
                                     and m.type in {"base_cabinet", "drawer_cabinet", "sink_cabinet"}])
            for run in runs:
                first, last = run[0], run[-1]
                depth = max(m.depth for m in run) + spec.materials.front_thickness + spec.countertop_overhang
                top_z = max(m.position[2] + m.height for m in run)
                length = last.position[0] + last.width - first.position[0]
                first.parts.append(Part("Tampo", "countertop", spec.countertop_material,
                                        (0, 0, top_z - first.position[2]), (length, depth, spec.countertop_thickness),
                                        spec.countertop_thickness))
                if top_z + spec.countertop_thickness > room.ceiling_height:
                    warnings.append("Tampo ultrapassa o pé-direito")

    if room.type == "linear_kitchen":
        used = max((m.position[0] + m.width for m in modules if not is_upper(spec.cabinet_modules[m.index])),
                   default=room.start_offset)
        free = room.wall_length - used
        if free > 0:
            warnings.append(f"Sobra de {free:g} mm na linha de piso (considere um tapa-vão)")

    # Colisões no referencial do arquivo (vale entre paredes diferentes)
    for a in modules:
        for b in modules:
            if a.index < b.index and _overlap(a.world_bbox, b.world_bbox):
                warnings.append(f"Colisão geométrica entre {a.id} e {b.id}")

    # Aberturas: sobreposição e portas bloqueadas
    for wall in room.walls:
        ops = sorted((o for o in room.openings if o.wall == wall), key=lambda o: o.x)
        for a, b in zip(ops, ops[1:]):
            if b.x < a.x + a.width:
                raise ValueError(f"Aberturas sobrepostas na parede {wall} em x={a.x:g} e x={b.x:g}")
        for o in ops:
            for m in modules:
                if o.type == "door" and m.wall == wall and m.type not in UPPER_TYPES and m.type != "wall_panel" \
                        and m.position[0] < o.x + o.width and o.x < m.position[0] + m.width:
                    warnings.append(f"Porta na parede {wall} em x={o.x:g} fica atrás do módulo {m.id}")

    T = room.wall_thickness
    env: list[Part] = []
    walls_info = []
    for wall in room.walls:
        L = room.wall_len(wall)
        # A e C cobrem os cantos (estendem T de cada lado); B e D ficam entre elas
        x0, x1 = ((-T, L + T) if wall in ("A", "C") and room.type == "rectangular_room" else (0.0, L))
        ops = [o for o in room.openings if o.wall == wall]
        for part in wall_parts(L, room.ceiling_height, T, ops, x0, x1, prefix=f"Parede {wall}"):
            part.frame = frames[wall]
            env.append(part)
        walls_info.append({"wall": wall, "length": L, "x0": x0, "x1": x1, "frame": frames[wall],
                           "openings": [asdict(o) for o in ops]})
    if room.type == "linear_kitchen":
        env.append(Part("Piso", "floor", "Piso", (0, -T, -20), (room.wall_length, T + 1500, 20), 20,
                        frame=DEFAULT_FRAME))
        room_info = {"type": room.type, "wall_length": room.wall_length}
    else:
        env.append(Part("Piso", "floor", "Piso", (0, 0, -20), (room.width, room.length, 20), 20, frame=WORLD_FRAME))
        room_info = {"type": room.type, "width": room.width, "length": room.length}
    room_info.update({"ceiling_height": room.ceiling_height, "wall_thickness": T,
                      "openings": [asdict(o) for o in room.openings], "walls": walls_info})
    return Project(spec.project_name, "mm", room_info, modules, env, warnings)


def wall_parts(L, H, T, openings, x0=0.0, x1=None, prefix="Parede") -> list[Part]:
    """Parede decomposta em caixas ao redor das aberturas (coordenadas locais da parede)."""
    x1 = L if x1 is None else x1
    parts, x, n = [], x0, 0

    def add(xa, z0, w, h):
        nonlocal n
        if w > 0 and h > 0:
            n += 1
            parts.append(Part(f"{prefix} {n}", "wall", "Parede", (xa, -T, z0), (w, T, h), T))

    for o in sorted(openings, key=lambda o: o.x):
        add(x, 0, o.x - x, H)
        add(o.x, 0, o.width, o.sill)
        add(o.x, o.sill + o.height, o.width, H - o.sill - o.height)
        x = o.x + o.width
    add(x, 0, x1 - x, H)
    return parts


def _contiguous_runs(mods: list[Module]) -> list[list[Module]]:
    runs: list[list[Module]] = []
    for m in sorted(mods, key=lambda m: m.position[0]):  # mesma parede
        if runs and abs(runs[-1][-1].position[0] + runs[-1][-1].width - m.position[0]) < 1e-6:
            runs[-1].append(m)
        else:
            runs.append([m])
    return runs


def _overlap(a, b, eps=0.5) -> bool:
    (a0, a1), (b0, b1) = a, b
    return all(a0[k] < b1[k] - eps and b0[k] < a1[k] - eps for k in range(3))
