"""Saídas auxiliares: IR em JSON, lista de corte CSV e vista frontal SVG."""
from __future__ import annotations

import csv
import json
from pathlib import Path

from ..mesh import part_color
from ..model import Project

PANEL_ROLES = {"side", "bottom", "top", "rail", "back", "shelf", "door", "drawer_front",
               "drawer_box", "plinth", "panel", "countertop", "divider"}


def write_ir(project: Project, path: Path) -> list[Path]:
    Path(path).write_text(json.dumps(project.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")
    return [Path(path)]


def write_cutlist(project: Project, path: Path) -> list[Path]:
    with open(path, "w", newline="", encoding="utf-8-sig") as fh:  # BOM: abre certo no Excel
        w = csv.writer(fh, delimiter=";")
        w.writerow(["modulo", "tipo_modulo", "peca", "funcao", "material", "comprimento_mm", "largura_mm",
                    "espessura_mm", "qtd"])
        for m in project.modules:
            for p in m.parts:
                if p.role not in PANEL_ROLES:
                    continue
                c, l, e = p.cut_dims()
                w.writerow([m.id, m.type, p.name, p.role, p.material, f"{c:.1f}", f"{l:.1f}", f"{e:.1f}", 1])
    return [Path(path)]


def write_elevation_svg(project: Project, path: Path, wall: str = "A") -> list[Path]:
    """Vista frontal de uma parede (plano local x-z), vista de dentro do ambiente."""
    info = next(w for w in project.room["walls"] if w["wall"] == wall)
    L = info["length"]
    H = project.room["ceiling_height"]
    pad, s = 60, 0.25
    W, Hpx = L * s + 2 * pad, H * s + 2 * pad + 40

    def rect(x, z, w, h, fill, stroke="#333", op=1.0):
        return (f'<rect x="{pad + x * s:.1f}" y="{pad + (H - z - h) * s:.1f}" width="{w * s:.1f}" '
                f'height="{h * s:.1f}" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="0.6"/>')

    def hexc(rgb):
        return "#" + "".join(f"{int(c * 255):02x}" for c in rgb)

    out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W:.0f}" height="{Hpx:.0f}" '
           f'viewBox="0 0 {W:.0f} {Hpx:.0f}" font-family="sans-serif" font-size="10">',
           f'<rect width="100%" height="100%" fill="#fff"/>',
           f'<text x="{pad}" y="20" font-size="13">{project.name} — parede {wall} (mm)</text>',
           rect(0, 0, L, H, "#f3efe8")]
    for o in info["openings"]:
        out.append(rect(o["x"], o["sill"], o["width"], o["height"], "#bfe0ff", "#3a7bd5"))
    front_roles = {"door", "drawer_front", "panel", "countertop", "plinth", "handle", "upholstery", "mattress"}
    mods = sorted((m for m in project.modules if m.wall == wall), key=lambda m: -m.position[1])
    for m in mods:
        lo, hi = m.bbox
        for p in m.parts:
            if p.role in front_roles:
                x = m.position[0] + p.origin[0]
                z = m.position[2] + p.origin[2]
                out.append(rect(x, z, p.size[0], p.size[2], hexc(part_color(p))))
        cx = pad + (lo[0] + hi[0]) / 2 * s
        out.append(f'<text x="{cx:.1f}" y="{pad + (H - hi[2]) * s - 4:.1f}" text-anchor="middle">'
                   f'{m.id.split("_")[0]} {m.width:g}</text>')
    out.append(f'<line x1="{pad}" y1="{Hpx - 25}" x2="{pad + L * s}" y2="{Hpx - 25}" stroke="#000"/>')
    out.append(f'<text x="{pad + L * s / 2}" y="{Hpx - 10}" text-anchor="middle">{L:g} mm</text>')
    out.append("</svg>")
    Path(path).write_text("\n".join(out), encoding="utf-8")
    return [Path(path)]
