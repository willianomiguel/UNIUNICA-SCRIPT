"""Leitura e validação da especificação de entrada (JSON próprio do gerador).

Este JSON NÃO é um formato do Promob: é apenas a entrada do nosso motor.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

SUPPORTED_ROOMS = {"linear_kitchen"}
SUPPORTED_MODULES = {
    "base_cabinet",      # balcão com porta(s) e prateleira
    "drawer_cabinet",    # balcão gaveteiro
    "sink_cabinet",      # balcão de pia (sem tampo superior / sem prateleira)
    "wall_cabinet",      # aéreo
    "tall_cabinet",      # torre / paneleiro
    "filler",            # tapa-vão / complemento
}

# Limites práticos de marcenaria (mm). Ajustáveis.
LIMITS = {
    "width": (100, 1200),
    "depth": (100, 700),
    "height": (100, 2500),
    "wall_length": (500, 20000),
    "ceiling_height": (2000, 4500),
}


class SpecError(ValueError):
    """Erro de validação com lista de mensagens legíveis."""

    def __init__(self, errors: list[str]):
        self.errors = errors
        super().__init__("Especificação inválida:\n- " + "\n- ".join(errors))


@dataclass
class Materials:
    carcass: str = "MDF Branco TX 15mm"
    front: str = "MDF Branco TX 18mm"
    back: str = "HDF Branco 6mm"
    carcass_thickness: float = 15.0
    front_thickness: float = 18.0
    back_thickness: float = 6.0


@dataclass
class ModuleSpec:
    type: str
    width: float
    depth: float
    height: float
    doors: int | None = None
    drawers: int | None = None
    shelves: int | None = None
    elevation: float | None = None  # altura do piso até a base do módulo
    label: str | None = None


@dataclass
class Room:
    type: str
    wall_length: float
    ceiling_height: float
    wall_thickness: float = 150.0
    start_offset: float = 0.0  # distância do canto esquerdo até o 1º módulo
    openings: list["Opening"] = field(default_factory=list)


@dataclass
class Opening:
    """Abertura na parede (porta/janela). x = distância do canto esquerdo."""
    type: str      # door | window
    x: float
    width: float
    height: float
    sill: float = 0.0  # altura do peitoril (0 para portas)


@dataclass
class ProjectSpec:
    project_name: str
    units: str
    room: Room
    cabinet_modules: list[ModuleSpec]
    materials: Materials = field(default_factory=Materials)
    plinth_height: float = 100.0
    gap: float = 0.0  # folga entre módulos
    wall_cabinet_elevation: float = 1500.0
    countertop: bool = True
    countertop_thickness: float = 30.0
    countertop_overhang: float = 20.0
    countertop_material: str = "Granito Preto 30mm"


def _num(d: dict, key: str, errors: list[str], ctx: str, required=True, default=None):
    if key not in d:
        if required:
            errors.append(f"{ctx}: campo obrigatório '{key}' ausente")
        return default
    v = d[key]
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        errors.append(f"{ctx}: '{key}' deve ser numérico (recebido {v!r})")
        return default
    if v < 0 or (v == 0 and key not in ("start_offset", "gap", "elevation", "sill", "x")):
        errors.append(f"{ctx}: '{key}' deve ser > 0 (recebido {v})")
    return float(v)


def _check_limit(value, key, ctx, errors):
    if value is None or key not in LIMITS:
        return
    lo, hi = LIMITS[key]
    if not lo <= value <= hi:
        errors.append(f"{ctx}: '{key}'={value:g} fora do intervalo {lo}–{hi} mm")


def parse_spec(data: dict) -> ProjectSpec:
    errors: list[str] = []
    if not isinstance(data, dict):
        raise SpecError(["raiz do JSON deve ser um objeto"])

    name = data.get("project_name")
    if not isinstance(name, str) or not name.strip():
        errors.append("'project_name' obrigatório (texto)")
        name = "SEM_NOME"
    elif any(c in name for c in '<>:"/\\|?*'):
        errors.append("'project_name' contém caracteres inválidos para nome de arquivo")

    units = data.get("units", "mm")
    if units != "mm":
        errors.append(f"'units' deve ser 'mm' (recebido {units!r})")

    r = data.get("room")
    room = None
    if not isinstance(r, dict):
        errors.append("'room' obrigatório (objeto)")
    else:
        rtype = r.get("type")
        if rtype not in SUPPORTED_ROOMS:
            errors.append(f"room.type {rtype!r} não suportado; use um de {sorted(SUPPORTED_ROOMS)}")
        wl = _num(r, "wall_length", errors, "room")
        ch = _num(r, "ceiling_height", errors, "room")
        wt = _num(r, "wall_thickness", errors, "room", required=False, default=150.0)
        so = _num(r, "start_offset", errors, "room", required=False, default=0.0)
        _check_limit(wl, "wall_length", "room", errors)
        _check_limit(ch, "ceiling_height", "room", errors)
        room = Room(rtype, wl or 0, ch or 0, wt or 150.0, so or 0.0)
        for j, o in enumerate(r.get("openings", []) or []):
            octx = f"room.openings[{j}]"
            if not isinstance(o, dict) or o.get("type") not in ("door", "window"):
                errors.append(f"{octx}: deve ser objeto com type 'door' ou 'window'")
                continue
            ox = _num(o, "x", errors, octx)
            ow = _num(o, "width", errors, octx)
            oh = _num(o, "height", errors, octx)
            osill = _num(o, "sill", errors, octx, required=False, default=0.0) or 0.0
            if None in (ox, ow, oh):
                continue
            if ox + ow > (wl or 0) or osill + oh > (ch or 0):
                errors.append(f"{octx}: abertura sai dos limites da parede")
            room.openings.append(Opening(o["type"], ox, ow, oh, osill))

    m = data.get("materials", {}) or {}
    materials = Materials(**{k: v for k, v in m.items() if k in Materials.__dataclass_fields__})

    mods: list[ModuleSpec] = []
    raw_mods = data.get("cabinet_modules")
    if not isinstance(raw_mods, list) or not raw_mods:
        errors.append("'cabinet_modules' deve ser uma lista não vazia")
        raw_mods = []
    for i, md in enumerate(raw_mods):
        ctx = f"cabinet_modules[{i}]"
        if not isinstance(md, dict):
            errors.append(f"{ctx}: deve ser objeto")
            continue
        t = md.get("type")
        if t not in SUPPORTED_MODULES:
            errors.append(f"{ctx}: type {t!r} não suportado; use um de {sorted(SUPPORTED_MODULES)}")
        w = _num(md, "width", errors, ctx)
        dp = _num(md, "depth", errors, ctx)
        h = _num(md, "height", errors, ctx)
        for k, v in (("width", w), ("depth", dp), ("height", h)):
            _check_limit(v, k, ctx, errors)
        ints = {}
        for k in ("doors", "drawers", "shelves"):
            if k in md:
                v = md[k]
                if not isinstance(v, int) or isinstance(v, bool) or v < 0 or v > 8:
                    errors.append(f"{ctx}: '{k}' deve ser inteiro entre 0 e 8")
                else:
                    ints[k] = v
        elev = _num(md, "elevation", errors, ctx, required=False, default=None)
        if w and dp and h and t in SUPPORTED_MODULES:
            t_c = materials.carcass_thickness
            if w <= 2 * t_c + 10:
                errors.append(f"{ctx}: largura {w:g} pequena demais para laterais de {t_c:g} mm")
        mods.append(ModuleSpec(t, w or 0, dp or 0, h or 0, ints.get("doors"), ints.get("drawers"),
                               ints.get("shelves"), elev, md.get("label")))

    spec = ProjectSpec(
        project_name=name.strip() if isinstance(name, str) else name,
        units="mm",
        room=room,
        cabinet_modules=mods,
        materials=materials,
        plinth_height=float(data.get("plinth_height", 100.0)),
        gap=float(data.get("gap", 0.0)),
        wall_cabinet_elevation=float(data.get("wall_cabinet_elevation", 1500.0)),
        countertop=bool(data.get("countertop", True)),
    )

    if room and not errors:
        _validate_fit(spec, errors)
    if errors:
        raise SpecError(errors)
    return spec


def _validate_fit(spec: ProjectSpec, errors: list[str]) -> None:
    """Verifica se cada linha (piso / aéreo) cabe na parede e no pé-direito."""
    room = spec.room
    rows: dict[str, float] = {"floor": 0.0, "wall": 0.0}
    for i, m in enumerate(spec.cabinet_modules):
        row = "wall" if m.type == "wall_cabinet" else "floor"
        rows[row] += m.width + spec.gap
        if row == "wall" and m.depth > 450:
            errors.append(f"cabinet_modules[{i}]: aéreo com profundidade {m.depth:g} mm (> 450 mm)")
        top = module_elevation(spec, m) + m.height
        if top > room.ceiling_height:
            errors.append(f"cabinet_modules[{i}] ({m.type}) ultrapassa o pé-direito: topo em {top:g} mm > {room.ceiling_height:g} mm")
    for row, total in rows.items():
        total = total - spec.gap if total else 0
        avail = room.wall_length - room.start_offset
        if total > avail:
            errors.append(f"linha '{row}': soma das larguras {total:g} mm excede a parede disponível {avail:g} mm")


def module_elevation(spec: ProjectSpec, m: ModuleSpec) -> float:
    if m.elevation is not None:
        return m.elevation
    if m.type == "wall_cabinet":
        return spec.wall_cabinet_elevation
    if m.type == "filler":
        return 0.0
    return spec.plinth_height  # módulos de piso apoiam-se sobre o rodapé


def load_spec(path: str | Path) -> ProjectSpec:
    with open(path, encoding="utf-8") as fh:
        try:
            data = json.load(fh)
        except json.JSONDecodeError as e:
            raise SpecError([f"JSON inválido: {e}"]) from e
    return parse_spec(data)
