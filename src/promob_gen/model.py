"""Representação intermediária (IR) e cálculo de layout/geometria.

Sistema de coordenadas do projeto (mm, mão direita, Z para cima):
  X = ao longo da parede, da esquerda (0) para a direita
  Y = profundidade, 0 na face da parede, positivo para dentro do ambiente
  Z = altura, 0 no piso

Cada módulo é decomposto em peças retangulares (caixas alinhadas aos eixos),
o que serve tanto para gerar geometria 3D quanto lista de corte.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict

from .spec import ModuleSpec, ProjectSpec, module_elevation

DOOR_GAP = 3.0       # folga entre portas/frentes
DRAWER_SIDE = 12.0   # espessura de lateral de gaveta (simplificado)


@dataclass
class Part:
    """Peça retangular: origem = canto mínimo (x, y, z) em coordenadas do MÓDULO."""
    name: str
    role: str            # side, bottom, top, rail, back, shelf, door, drawer_front, drawer_box, plinth, panel
    material: str
    origin: tuple[float, float, float]
    size: tuple[float, float, float]   # extensão em X, Y, Z
    thickness: float                   # espessura nominal (para lista de corte)

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
            lo, hi = m.bbox
            md["bbox"] = {"min": lo, "max": hi}
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


def build_module_parts(m: ModuleSpec, spec: ProjectSpec) -> list[Part]:
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
    cursors = {"floor": room.start_offset, "wall": room.start_offset}
    modules: list[Module] = []
    warnings: list[str] = []
    counters: dict[str, int] = {}

    # Aéreos são posicionados depois, desviando de torres e janelas.
    floor_specs = [(i, ms) for i, ms in enumerate(spec.cabinet_modules) if ms.type != "wall_cabinet"]
    wall_specs = [(i, ms) for i, ms in enumerate(spec.cabinet_modules) if ms.type == "wall_cabinet"]
    for i, ms in floor_specs + wall_specs:
        row = "wall" if ms.type == "wall_cabinet" else "floor"
        z = module_elevation(spec, ms)
        x = cursors[row]
        if row == "wall":
            blocked = [(m.position[0], m.position[0] + m.width) for m in modules if m.type == "tall_cabinet"
                       and m.position[2] + m.height > z]
            blocked += [(o.x, o.x + o.width) for o in room.openings
                        if o.sill < z + ms.height and z < o.sill + o.height]
            moved = True
            while moved:
                moved = False
                for b0, b1 in blocked:
                    if x < b1 and b0 < x + ms.width:
                        x, moved = b1, True
            if x != cursors[row]:
                warnings.append(f"Aéreo #{i + 1} deslocado para x={x:g} para evitar torre/janela")
        if x + ms.width > room.wall_length + 1e-6:
            raise ValueError(f"módulo #{i + 1} ({ms.type}) termina em x={x + ms.width:g} mm, além da parede "
                             f"({room.wall_length:g} mm)")
        counters[ms.type] = counters.get(ms.type, 0) + 1
        mid = f"M{i + 1:02d}_{ms.type}"
        label = ms.label or f"{ms.type} {ms.width:g}x{ms.height:g}x{ms.depth:g}"
        mod = Module(i, mid, ms.type, label, (x, 0.0, z), ms.width, ms.depth, ms.height,
                     build_module_parts(ms, spec))
        modules.append(mod)
        cursors[row] = x + ms.width + spec.gap
    modules.sort(key=lambda m: m.index)

    # Rodapé contínuo e tampo sobre módulos de piso (exceto torres e tapa-vãos)
    floor_types = {"base_cabinet", "drawer_cabinet", "sink_cabinet", "tall_cabinet"}
    for mod in modules:
        if mod.type in floor_types and spec.plinth_height > 0:
            mod.parts.append(Part("Rodapé", "plinth", spec.materials.carcass,
                                  (0, mod.depth - 60, -spec.plinth_height),
                                  (mod.width, spec.materials.carcass_thickness, spec.plinth_height),
                                  spec.materials.carcass_thickness))
    if spec.countertop:
        runs = _contiguous_runs([m for m in modules if m.type in {"base_cabinet", "drawer_cabinet", "sink_cabinet"}])
        for run in runs:
            first, last = run[0], run[-1]
            depth = max(m.depth for m in run) + spec.materials.front_thickness + spec.countertop_overhang
            top_z = max(m.position[2] + m.height for m in run)
            length = last.position[0] + last.width - first.position[0]
            ct = Part("Tampo", "countertop", spec.countertop_material,
                      (0, 0, top_z - first.position[2]), (length, depth, spec.countertop_thickness),
                      spec.countertop_thickness)
            first.parts.append(ct)
            first_top = top_z + spec.countertop_thickness
            if first_top > room.ceiling_height:
                warnings.append("Tampo ultrapassa o pé-direito")

    used_floor = cursors["floor"] - spec.gap - room.start_offset if floor_specs else 0
    free = room.wall_length - room.start_offset - max(used_floor, 0)
    if free > 0:
        warnings.append(f"Sobra de {free:g} mm na linha de piso (considere um tapa-vão)")

    # Colisão aéreo x torre
    for a in modules:
        for b in modules:
            if a.index < b.index and _overlap(a.bbox, b.bbox):
                warnings.append(f"Colisão geométrica entre {a.id} e {b.id}")

    # Portas da parede não podem ficar atrás de módulos de piso
    for o in room.openings:
        for m in modules:
            if o.type == "door" and m.type != "wall_cabinet" and \
                    m.position[0] < o.x + o.width and o.x < m.position[0] + m.width:
                warnings.append(f"Porta em x={o.x:g} fica atrás do módulo {m.id}")
    ops = sorted(room.openings, key=lambda o: o.x)
    for a, b in zip(ops, ops[1:]):
        if b.x < a.x + a.width:
            raise ValueError(f"Aberturas sobrepostas em x={a.x:g} e x={b.x:g}")

    env = wall_parts(room) + [
        Part("Piso", "floor", "Piso", (0, -room.wall_thickness, -20),
             (room.wall_length, room.wall_thickness + 1500, 20), 20),
    ]
    return Project(spec.project_name, "mm", {
        "type": room.type, "wall_length": room.wall_length,
        "ceiling_height": room.ceiling_height, "wall_thickness": room.wall_thickness,
        "openings": [asdict(o) for o in room.openings],
    }, modules, env, warnings)


def wall_parts(room) -> list[Part]:
    """Parede decomposta em caixas ao redor das aberturas (para formatos de malha)."""
    L, H, T = room.wall_length, room.ceiling_height, room.wall_thickness
    parts, x, n = [], 0.0, 0

    def add(x0, z0, w, h):
        nonlocal n
        if w > 0 and h > 0:
            n += 1
            parts.append(Part(f"Parede {n}", "wall", "Parede", (x0, -T, z0), (w, T, h), T))

    for o in sorted(room.openings, key=lambda o: o.x):
        add(x, 0, o.x - x, H)
        add(o.x, 0, o.width, o.sill)
        add(o.x, o.sill + o.height, o.width, H - o.sill - o.height)
        x = o.x + o.width
    add(x, 0, L - x, H)
    return parts


def _contiguous_runs(mods: list[Module]) -> list[list[Module]]:
    runs: list[list[Module]] = []
    for m in sorted(mods, key=lambda m: m.position[0]):
        if runs and abs(runs[-1][-1].position[0] + runs[-1][-1].width - m.position[0]) < 1e-6:
            runs[-1].append(m)
        else:
            runs.append([m])
    return runs


def _overlap(a, b, eps=0.5) -> bool:
    (a0, a1), (b0, b1) = a, b
    return all(a0[k] < b1[k] - eps and b0[k] < a1[k] - eps for k in range(3))
