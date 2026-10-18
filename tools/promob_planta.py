"""Desenha a planta (vista de cima) de um .promob lido diretamente do XML:
paredes (polilinha), aberturas (portas/janelas), módulos (contorno pela rotação e medidas).

Uso: python tools/promob_planta.py projeto.promob saida.png
"""
from __future__ import annotations

import math
import sys
import xml.etree.ElementTree as ET
import zipfile

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Polygon  # noqa: E402

AMBIENT = "solucao/container1/document0/document0.ambient3d"


def footprint(e):
    b = e.find("POSICAOINSERCAO/PONTOBASE")
    x, y = float(b.get("X", 0) or 0), float(b.get("Y", 0) or 0)
    rot = math.radians(float(e.findtext("POSICAOINSERCAO/ROTATION") or 0))
    d = e.find("INSERTDIMENSION")
    w, dp = float(d.get("WIDTH")), float(d.get("DEPTH"))
    loc = [(0, 0), (w, 0), (w, -dp), (0, -dp)]
    return [(x + px * math.cos(rot) - py * math.sin(rot), y + px * math.sin(rot) + py * math.cos(rot)) for px, py in loc]


def main(src, dst):
    root = ET.fromstring(zipfile.ZipFile(src).read(AMBIENT).decode("utf-8-sig"))
    fig, ax = plt.subplots(figsize=(10, 10), dpi=110)
    walls = [e for e in root.iter("INFORMACOES") if e.get("TYPE") == "WALL"]
    for w in walls:
        pts = [(float(p.get("X")), float(p.get("Y")), float(p.get("E", 150))) for p in w.find("GEOMETRY/SHAPE")]
        ax.plot([p[0] for p in pts], [p[1] for p in pts], color="#5a5550", lw=7, solid_capstyle="projecting")

    def kids(e):
        c = e.find("INFORMACOESCOLECAO")
        return list(c) if c is not None else []

    floor = root.find("INFORMACOES")
    tops = [k for k in kids(floor) if k.get("TYPE") in ("MODULO", "onlinemodule")]
    for w in walls:
        tops += [k for k in kids(w) if k.get("TYPE") in ("MODULO", "onlinemodule")]
    for m in tops:
        if m.find("INSERTDIMENSION") is None or m.find("POSICAOINSERCAO/PONTOBASE") is None:
            continue
        lay = m.find("LAYER").get("DESCRIPTION") if m.find("LAYER") is not None else ""
        opening = lay == "Decore Promob-Aberturas"
        poly = footprint(m)
        ax.add_patch(Polygon(poly, closed=True, fc="#bfe0ff" if opening else "#e9dcc8",
                             ec="#3a7bd5" if opening else "#333", lw=0.8, alpha=0.95))
        d = m.find("INSERTDIMENSION")
        if float(d.get("WIDTH")) > 300 and not opening:
            cx, cy = sum(p[0] for p in poly) / 4, sum(p[1] for p in poly) / 4
            name = m.get("ID").replace("tod_", "")[:24]
            ax.text(cx, cy, f"{name}\n{float(d.get('WIDTH')):g}×{float(d.get('HEIGHT')):g}×{float(d.get('DEPTH')):g}",
                    ha="center", va="center", fontsize=6.5)
    ax.set_aspect("equal")
    ax.set_title(f"{root.get('NAME')} — planta lida do .promob (mm)")
    fig.tight_layout()
    fig.savefig(dst)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
