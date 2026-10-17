"""Conversão das peças (caixas) em malhas trianguladas, com transformação de eixos."""
from __future__ import annotations

from dataclasses import dataclass

from .model import Part, Project

# 8 vértices de uma caixa unitária e 6 faces (quads, CCW vistos de fora)
_CORNERS = [(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)]
_QUADS = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]

# Cores difusas por função da peça (RGB 0–1), usadas nos materiais exportados.
ROLE_COLORS = {
    "side": (0.93, 0.93, 0.91), "bottom": (0.93, 0.93, 0.91), "top": (0.93, 0.93, 0.91),
    "rail": (0.93, 0.93, 0.91), "shelf": (0.90, 0.90, 0.88), "back": (0.85, 0.85, 0.83),
    "door": (0.97, 0.97, 0.97), "drawer_front": (0.97, 0.97, 0.97), "panel": (0.97, 0.97, 0.97),
    "drawer_box": (0.80, 0.78, 0.74), "plinth": (0.30, 0.30, 0.30), "countertop": (0.12, 0.12, 0.13),
    "wall": (0.82, 0.80, 0.76), "floor": (0.62, 0.58, 0.52),
}


@dataclass
class Mesh:
    name: str
    material: str
    color: tuple[float, float, float]
    vertices: list[tuple[float, float, float]]
    triangles: list[tuple[int, int, int]]
    quads: list[tuple[int, int, int, int]]


def axis_transform(up: str, scale: float):
    """Retorna função (x,y,z)->(x',y',z'). up='z' mantém; up='y' converte para Y-up (OBJ/DAE comum)."""
    if up == "z":
        return lambda p: (p[0] * scale, p[1] * scale, p[2] * scale)
    if up == "y":
        # Z-up (x,y,z) -> Y-up (x, z, -y): preserva mão direita
        return lambda p: (p[0] * scale, p[2] * scale, -p[1] * scale)
    raise ValueError("up deve ser 'z' ou 'y'")


def part_mesh(part: Part, offset=(0.0, 0.0, 0.0), name: str | None = None, tf=None) -> Mesh:
    ox, oy, oz = (part.origin[i] + offset[i] for i in range(3))
    sx, sy, sz = part.size
    verts = [(ox + cx * sx, oy + cy * sy, oz + cz * sz) for cx, cy, cz in _CORNERS]
    if tf:
        verts = [tf(v) for v in verts]
    tris = []
    for a, b, c, d in _QUADS:
        tris += [(a, b, c), (a, c, d)]
    return Mesh(name or part.name, part.material, ROLE_COLORS.get(part.role, (0.8, 0.8, 0.8)),
                verts, tris, list(_QUADS))


def project_meshes(project: Project, tf=None, include_environment=True):
    """Gera [(nome_grupo, [Mesh])] — um grupo por módulo (+ ambiente)."""
    groups = []
    if include_environment:
        groups.append(("AMBIENTE", [part_mesh(p, name=p.name, tf=tf) for p in project.environment]))
    for m in project.modules:
        groups.append((m.id, [part_mesh(p, m.position, f"{m.id}_{p.name}", tf) for p in m.parts]))
    return groups


def module_meshes(module, tf=None, include_countertop=False):
    """Malhas de um único módulo com canto mínimo em 0,0,0 (importar módulo a módulo)."""
    parts = [p for p in module.parts if include_countertop or p.role != "countertop"]
    off = tuple(-min(p.origin[k] for p in parts) for k in range(3))
    return [(module.id, [part_mesh(p, off, p.name, tf) for p in parts])]


def face_count(groups) -> int:
    return sum(len(m.triangles) for _, ms in groups for m in ms)


def safe_name(s: str, maxlen: int | None = None) -> str:
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    out = "".join(c if c.isalnum() or c in "_-" else "_" for c in s)
    return out[:maxlen] if maxlen else out
