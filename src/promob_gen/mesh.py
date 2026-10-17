"""Conversão das peças (caixas) em malhas trianguladas, com transformação de eixos."""
from __future__ import annotations

from dataclasses import dataclass

from .model import DEFAULT_FRAME, Part, Project, frame_point

# 8 vértices de uma caixa unitária e 6 faces (quads, CCW vistos de fora)
_CORNERS = [(0, 0, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)]
_QUADS = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]

# Cores difusas por função da peça (RGB 0–1), usadas nos materiais exportados.
ROLE_COLORS = {
    "side": (0.93, 0.93, 0.91), "bottom": (0.93, 0.93, 0.91), "top": (0.93, 0.93, 0.91),
    "rail": (0.93, 0.93, 0.91), "shelf": (0.90, 0.90, 0.88), "back": (0.85, 0.85, 0.83),
    "door": (0.97, 0.97, 0.97), "drawer_front": (0.97, 0.97, 0.97), "panel": (0.97, 0.97, 0.97),
    "drawer_box": (0.80, 0.78, 0.74), "plinth": (0.30, 0.30, 0.30), "countertop": (0.12, 0.12, 0.13),
    "wall": (0.82, 0.80, 0.76), "floor": (0.62, 0.58, 0.52), "handle": (0.72, 0.73, 0.75),
    "divider": (0.93, 0.93, 0.91), "rod": (0.75, 0.75, 0.77), "upholstery": (0.58, 0.56, 0.53),
    "mattress": (0.95, 0.95, 0.93), "pillow": (0.98, 0.98, 0.97), "throw": (0.42, 0.47, 0.55),
}

# Cor pelo nome do material, quando reconhecido (prevalece sobre a cor por função)
MATERIAL_HINTS = {
    "freijo": (0.66, 0.48, 0.32), "carvalho": (0.72, 0.56, 0.38), "nogueira": (0.45, 0.31, 0.21),
    "grafite": (0.28, 0.29, 0.31), "preto": (0.12, 0.12, 0.13), "cinza": (0.60, 0.61, 0.62),
    "verde": (0.36, 0.45, 0.38), "azul": (0.28, 0.36, 0.48), "inox": (0.72, 0.73, 0.75),
    "canela": (0.62, 0.42, 0.26), "off white": (0.94, 0.92, 0.87), "sevilha": (0.70, 0.52, 0.36),
    "courino branco": (0.96, 0.95, 0.93), "espelh": (0.80, 0.86, 0.90),
}


def part_color(part) -> tuple[float, float, float]:
    name = part.material.lower()
    for key, rgb in MATERIAL_HINTS.items():
        if key in name:
            return rgb
    return ROLE_COLORS.get(part.role, (0.8, 0.8, 0.8))


@dataclass
class Mesh:
    name: str
    material: str
    color: tuple[float, float, float]
    vertices: list[tuple[float, float, float]]
    triangles: list[tuple[int, int, int]]
    quads: list[tuple[int, int, int, int]]


def to_world(p):
    """Layout (mão esquerda, ambiente em +Y) -> arquivo (mão direita, ambiente em -Y)."""
    return (p[0], -p[1], p[2])


def axis_transform(up: str, scale: float):
    """Referencial do arquivo a partir do mundo (Z para cima). up='y' gira para Y-up (OBJ/DAE comum)."""
    if up == "z":
        return lambda p: (p[0] * scale, p[1] * scale, p[2] * scale)
    if up == "y":
        # rotação própria Z-up -> Y-up: (x, y, z) -> (x, z, -y)
        return lambda p: (p[0] * scale, p[2] * scale, -p[1] * scale)
    raise ValueError("up deve ser 'z' ou 'y'")


def _reflects(frame) -> bool:
    (_, u, n) = frame
    return (u[0] * n[1] - u[1] * n[0]) < 0   # (u x n) . Z < 0 -> referencial local de mão esquerda


_QUADS_REV = [tuple(reversed(q)) for q in _QUADS]


def part_mesh(part: Part, offset=(0.0, 0.0, 0.0), name: str | None = None, tf=None, frame=None) -> Mesh:
    """Caixa local (+offset) -> malha no referencial do arquivo, via frame da parede.
    Frames de mão esquerda (todas as paredes) invertem a ordem dos vértices para manter normais para fora."""
    frame = frame or part.frame or DEFAULT_FRAME
    ox, oy, oz = (part.origin[i] + offset[i] for i in range(3))
    sx, sy, sz = part.size
    verts = [frame_point(frame, (ox + cx * sx, oy + cy * sy, oz + cz * sz)) for cx, cy, cz in _CORNERS]
    if tf:
        verts = [tf(v) for v in verts]
    quads = _QUADS_REV if _reflects(frame) else list(_QUADS)
    tris = []
    for a, b, c, d in quads:
        tris += [(a, b, c), (a, c, d)]
    return Mesh(name or part.name, part.material, part_color(part), verts, tris, list(quads))


def project_meshes(project: Project, tf=None, include_environment=True):
    """Gera [(nome_grupo, [Mesh])] — um grupo por módulo (+ ambiente)."""
    groups = []
    if include_environment:
        groups.append(("AMBIENTE", [part_mesh(p, name=p.name, tf=tf) for p in project.environment]))
    for m in project.modules:
        groups.append((m.id, [part_mesh(p, m.position, f"{m.id}_{p.name}", tf, m.frame) for p in m.parts]))
    return groups


def module_meshes(module, tf=None, include_countertop=False):
    """Malhas de um único módulo com canto mínimo em 0,0,0 no arquivo (importar módulo a módulo).
    Usa o frame da parede A (frente para -Y) para todos os módulos, independentemente da parede."""
    parts = [p for p in module.parts if include_countertop or p.role != "countertop"]
    meshes = [part_mesh(p, (0, 0, 0), p.name, tf, DEFAULT_FRAME) for p in parts]
    lo = [min(v[k] for m in meshes for v in m.vertices) for k in range(3)]
    for m in meshes:
        m.vertices = [tuple(v[k] - lo[k] for k in range(3)) for v in m.vertices]
    return [(module.id, meshes)]


def face_count(groups) -> int:
    return sum(len(m.triangles) for _, ms in groups for m in ms)


def safe_name(s: str, maxlen: int | None = None) -> str:
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    out = "".join(c if c.isalnum() or c in "_-" else "_" for c in s)
    return out[:maxlen] if maxlen else out
