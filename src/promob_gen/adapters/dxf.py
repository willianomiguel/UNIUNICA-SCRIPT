"""DXF ASCII R12 (AC1009) com entidades 3DFACE; uma camada (layer) por módulo.

R12 é a variante mais aceita por importadores CAD antigos e não exige handles.
"""
from __future__ import annotations

from pathlib import Path

from ..mesh import safe_name


def _pairs(*items):
    out = []
    for code, value in items:
        out.append(f"{code:>3}")
        out.append(str(value))
    return out


def write_dxf(groups, path: Path, title: str) -> list[Path]:
    layers = ["0"] + [safe_name(g).upper()[:31] for g, _ in groups]
    out = _pairs((999, safe_name(title)), (0, "SECTION"), (2, "HEADER"), (9, "$ACADVER"), (1, "AC1009"),
                 (9, "$INSUNITS"), (70, 4), (0, "ENDSEC"))
    out += _pairs((0, "SECTION"), (2, "TABLES"), (0, "TABLE"), (2, "LAYER"), (70, len(layers)))
    for i, name in enumerate(layers):
        out += _pairs((0, "LAYER"), (2, name), (70, 0), (62, (i % 7) + 1), (6, "CONTINUOUS"))
    out += _pairs((0, "ENDTAB"), (0, "ENDSEC"), (0, "SECTION"), (2, "ENTITIES"))
    for (gname, meshes), layer in zip(groups, layers[1:]):
        for m in meshes:
            for q in m.quads:
                pts = [m.vertices[i] for i in q]
                items = [(0, "3DFACE"), (8, layer)]
                for k, (x, y, z) in enumerate(pts):
                    items += [(10 + k, f"{x:.3f}"), (20 + k, f"{y:.3f}"), (30 + k, f"{z:.3f}")]
                out += _pairs(*items)
    out += _pairs((0, "ENDSEC"), (0, "EOF"))
    Path(path).write_text("\n".join(out) + "\n", encoding="ascii")
    return [Path(path)]
