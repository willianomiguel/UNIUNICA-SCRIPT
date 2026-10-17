"""Renderiza um OBJ gerado em PNG (isométrica) para conferência visual fora do Promob.

Uso: python tools/render_preview.py arquivo.obj saida.png
Requer: trimesh, matplotlib (apenas ferramenta de desenvolvimento).
"""
import sys

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import trimesh  # noqa: E402
from mpl_toolkits.mplot3d.art3d import Poly3DCollection  # noqa: E402


def main(src, dst):
    scene = trimesh.load(src, force="scene", process=False)
    fig = plt.figure(figsize=(12, 8), dpi=110)
    ax = fig.add_subplot(projection="3d")
    for name, geom in scene.geometry.items():
        tf = scene.graph.get(scene.graph.geometry_nodes[name][0])[0]
        g = geom.copy()
        g.apply_transform(tf)
        color = getattr(g.visual, "material", None)
        rgba = (0.85, 0.85, 0.85, 1)
        if color is not None and getattr(color, "diffuse", None) is not None:
            rgba = tuple(c / 255 for c in color.diffuse)
        ax.add_collection3d(Poly3DCollection(g.triangles, facecolor=rgba, edgecolor=(0, 0, 0, 0.25), linewidths=0.2))
    lo, hi = scene.bounds
    span = (hi - lo).max()
    mid = (hi + lo) / 2
    for setter, c in zip((ax.set_xlim, ax.set_ylim, ax.set_zlim), mid):
        setter(c - span / 2, c + span / 2)
    ax.view_init(elev=20, azim=58)
    ax.set_xlabel("X (mm)"); ax.set_ylabel("Y (mm)"); ax.set_zlabel("Z (mm)")
    ax.set_title(src.split("/")[-1])
    fig.tight_layout()
    fig.savefig(dst)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
