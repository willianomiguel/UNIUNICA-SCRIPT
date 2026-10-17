"""Wavefront OBJ + MTL (texto). Um objeto 'o' por módulo, um grupo 'g' por peça."""
from __future__ import annotations

from pathlib import Path

from ..mesh import safe_name


def write_obj(groups, path: Path, title: str) -> list[Path]:
    path = Path(path)
    mtl_path = path.with_suffix(".mtl")
    materials: dict[str, tuple] = {}
    lines = [f"# {safe_name(title)}", "# Gerado por promob_auto_generator - unidades: mm", f"mtllib {mtl_path.name}"]
    base = 1
    for gname, meshes in groups:
        lines.append(f"o {safe_name(gname)}")
        for m in meshes:
            mat = safe_name(m.material)
            materials.setdefault(mat, m.color)
            lines.append(f"g {safe_name(gname)}_{safe_name(m.name)}")
            lines.append(f"usemtl {mat}")
            lines += [f"v {x:.3f} {y:.3f} {z:.3f}" for x, y, z in m.vertices]
            lines += ["f " + " ".join(str(base + i) for i in q) for q in m.quads]
            base += len(m.vertices)
    path.write_text("\n".join(lines) + "\n", encoding="ascii")
    mtl = ["# materiais"]
    for name, (r, g, b) in materials.items():
        mtl += [f"newmtl {name}", f"Kd {r:.3f} {g:.3f} {b:.3f}", "Ka 0.200 0.200 0.200",
                "Ks 0.050 0.050 0.050", "d 1.0", "illum 2", ""]
    mtl_path.write_text("\n".join(mtl), encoding="ascii")
    return [path, mtl_path]
