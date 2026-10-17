"""COLLADA 1.4.1 (.dae) — aceito por SketchUp (Arquivo > Importar) e outros CAD.

Hierarquia: um <node> por módulo contendo um <node> por peça; Z_UP, unidade mm.
"""
from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape

from ..mesh import safe_name


def write_dae(groups, path: Path, title: str) -> list[Path]:
    mats: dict[str, tuple] = {}
    geoms, nodes = [], []
    gid = 0
    for gname, meshes in groups:
        child_nodes = []
        for m in meshes:
            gid += 1
            mat = safe_name(m.material) or "default"
            mats.setdefault(mat, m.color)
            g = f"geom{gid}"
            pos = " ".join(f"{c:.3f}" for v in m.vertices for c in v)
            idx = " ".join(str(i) for t in m.triangles for i in t)
            geoms.append(
                f'<geometry id="{g}" name="{escape(safe_name(m.name))}"><mesh>'
                f'<source id="{g}-pos"><float_array id="{g}-pos-a" count="{len(m.vertices) * 3}">{pos}</float_array>'
                f'<technique_common><accessor source="#{g}-pos-a" count="{len(m.vertices)}" stride="3">'
                f'<param name="X" type="float"/><param name="Y" type="float"/><param name="Z" type="float"/>'
                f'</accessor></technique_common></source>'
                f'<vertices id="{g}-vtx"><input semantic="POSITION" source="#{g}-pos"/></vertices>'
                f'<triangles material="{mat}" count="{len(m.triangles)}">'
                f'<input semantic="VERTEX" source="#{g}-vtx" offset="0"/><p>{idx}</p></triangles>'
                f'</mesh></geometry>')
            child_nodes.append(
                f'<node id="n{gid}" name="{escape(safe_name(m.name))}"><instance_geometry url="#{g}">'
                f'<bind_material><technique_common><instance_material symbol="{mat}" target="#{mat}-mat"/>'
                f'</technique_common></bind_material></instance_geometry></node>')
        nodes.append(f'<node id="{safe_name(gname)}" name="{safe_name(gname)}">{"".join(child_nodes)}</node>')

    effects = "".join(
        f'<effect id="{n}-fx"><profile_COMMON><technique sid="common"><lambert><diffuse>'
        f'<color>{r:.3f} {g:.3f} {b:.3f} 1</color></diffuse></lambert></technique></profile_COMMON></effect>'
        for n, (r, g, b) in mats.items())
    materials = "".join(f'<material id="{n}-mat" name="{n}"><instance_effect url="#{n}-fx"/></material>'
                        for n in mats)
    xml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">'
        f'<asset><contributor><authoring_tool>promob_auto_generator</authoring_tool><comments>{escape(title)}</comments></contributor>'
        '<created>2026-01-01T00:00:00Z</created><modified>2026-01-01T00:00:00Z</modified>'
        '<unit name="millimeter" meter="0.001"/><up_axis>Z_UP</up_axis></asset>'
        f'<library_effects>{effects}</library_effects><library_materials>{materials}</library_materials>'
        f'<library_geometries>{"".join(geoms)}</library_geometries>'
        f'<library_visual_scenes><visual_scene id="Scene" name="Scene">{"".join(nodes)}</visual_scene></library_visual_scenes>'
        '<scene><instance_visual_scene url="#Scene"/></scene></COLLADA>\n')
    Path(path).write_text(xml, encoding="utf-8")
    return [Path(path)]
