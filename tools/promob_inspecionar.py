"""Inspeciona um projeto .promob (ZIP com XML) SEM modificá-lo.

Formato observado (Promob Studio 5.60.45.x, biblioteca Todeschini Concept):
  projeto.promob (ZIP)
   ├─ promob.info                       sistema/biblioteca/versão/histórico (contém nº de série: não publicar)
   ├─ invoker.xml                       metadados do Connect (ProjectId)
   ├─ sugestao.jpg                      miniatura
   └─ solucao/
       ├─ solucao.container             documentos/contêineres (cliente, projeto)
       ├─ document2/document2.dataclient  dados do cliente (pessoais: não publicar)
       ├─ materials/materials.material  materiais do projeto (+ MyTextures/)
       └─ container1/
           ├─ container1.container      lista de documentos (ambiente, impressão, renders)
           ├─ document0/document0.ambient3d   O AMBIENTE: árvore de entidades <INFORMACOES>
           └─ documentN/...             impressões (.print), renders (.image + .jpg), listagens (.listing)

Árvore do ambiente: AMBIENT3D/INFORMACOES[TYPE=PisoTeto]/INFORMACOESCOLECAO/INFORMACOES[...]
  TYPE=WALL       paredes: GEOMETRY/SHAPE/POINT2DGP (X, Y, E=espessura) + INSERTDIMENSION HEIGHT
  TYPE=MODULO     item de biblioteca: ID = código do catálogo (ex.: tod_coz_bui_inf_bal_bal_2p)
                  POSICAOINSERCAO/PONTOBASE (X,Y,Z) + ROTATION (graus)
                  INSERTDIMENSION WIDTH/HEIGHT/DEPTH (+ MIN/MAX = limites editáveis)
                  ATTRIBUTES, LAYER, filhos agregados (caixa, portas, ferragens...) em INFORMACOESCOLECAO
  TYPE=GEOMETRY / onlinemodule / GROUPENTITY / Teto ...

Uso:  python tools/promob_inspecionar.py projeto.promob [--json saida.json]
"""
from __future__ import annotations

import argparse
import collections
import io
import json
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

AMBIENT_SUFFIX = ".ambient3d"


def _f(v, default=0.0):
    try:
        return float(v) if v not in (None, "") else default
    except ValueError:
        return default


def kids(e):
    col = e.find("INFORMACOESCOLECAO")
    return list(col) if col is not None else []


def entity_summary(e):
    pos = e.find("POSICAOINSERCAO/PONTOBASE")
    rot = e.find("POSICAOINSERCAO/ROTATION")
    dim = e.find("INSERTDIMENSION")
    dmin, dmax = (dim.find("MIN"), dim.find("MAX")) if dim is not None else (None, None)
    layer = e.find("LAYER")
    attrs = {a.get("ID"): a.get("VALUE") for a in e.findall("ATTRIBUTES/ATTRIBUTE")}
    return {
        "id": e.get("ID"),
        "type": e.get("TYPE"),
        "position": [_f(pos.get(k)) for k in "XYZ"] if pos is not None else None,
        "rotation": _f(rot.text) if rot is not None and rot.text else 0.0,
        "dimension": {k: _f(dim.get(k)) for k in ("WIDTH", "HEIGHT", "DEPTH")} if dim is not None else None,
        "dim_min": {k: _f(dmin.get(k)) for k in ("WIDTH", "HEIGHT", "DEPTH")} if dmin is not None else None,
        "dim_max": {k: _f(dmax.get(k)) for k in ("WIDTH", "HEIGHT", "DEPTH")} if dmax is not None else None,
        "layer": layer.get("DESCRIPTION") if layer is not None else None,
        "library": attrs.get("BIBLIOTECA_NOME"),
        "n_children": len(kids(e)),
    }


def walls(root):
    out = []
    for w in root.iter("INFORMACOES"):
        if w.get("TYPE") != "WALL":
            continue
        shape = w.find("GEOMETRY/SHAPE")
        dim = w.find("INSERTDIMENSION")
        pts = [(_f(p.get("X")), _f(p.get("Y")), _f(p.get("E"))) for p in shape] if shape is not None else []
        out.append({"height": _f(dim.get("HEIGHT")) if dim is not None else None,
                    "alignment": shape.get("ALIGNMENT") if shape is not None else None,
                    "points_xy_thickness": pts})
    return out


def load_ambient(path: Path) -> tuple[ET.Element, dict]:
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        amb = [n for n in names if n.endswith(AMBIENT_SUFFIX)]
        info = ET.fromstring(z.read("promob.info").decode("utf-8-sig")) if "promob.info" in names else None
        root = ET.parse(io.BytesIO(z.read(amb[0]))).getroot()
    sysinfo = {}
    if info is not None:
        v = info.find("VERSIONING")
        hist = info.findall("PROJECTHISTORY/HISTORY")
        sysinfo = {
            "system_name": info.get("SYSTEMNAME"), "system_id": info.get("SYSTEMID"),
            "distribution": info.get("DISTRIBUTION"), "library_revision": info.get("SYSTEMREVISION"),
            "versioning": dict(v.attrib) if v is not None else None,
            "last_save_version": hist[-1].get("VERSION") if hist else None,
            "plugins": hist[-1].get("PLUGIN") if hist else None,
            # SERIALNUMBER/PRODUCTCODE omitidos de propósito
        }
    sysinfo["members"] = names
    return root, sysinfo


def inspect(path: Path) -> dict:
    root, sysinfo = load_ambient(path)
    floor = root.find("INFORMACOES")
    top = []

    def walk(e, depth, parent):
        for k in kids(e):
            s = entity_summary(k)
            s["depth"], s["parent"] = depth, parent
            if k.get("TYPE") == "MODULO" and parent in ("PisoTeto", "WALL", "GROUPENTITY"):
                top.append(s)
            if k.get("TYPE") in ("WALL", "GROUPENTITY", "PisoTeto"):
                walk(k, depth + 1, k.get("TYPE"))

    walk(floor, 1, "PisoTeto")
    types = collections.Counter(e.get("TYPE") for e in root.iter("INFORMACOES"))
    catalog = {}
    for e in root.iter("INFORMACOES"):
        if e.get("TYPE") != "MODULO":
            continue
        s = entity_summary(e)
        c = catalog.setdefault(s["id"], {"count": 0, "dim_min": s["dim_min"], "dim_max": s["dim_max"],
                                         "library": s["library"], "examples": []})
        c["count"] += 1
        if len(c["examples"]) < 3 and s["dimension"]:
            c["examples"].append(s["dimension"])
    props = root.find("AMBIENTPROPERTIES")
    return {
        "file": path.name,
        "system": sysinfo,
        "ambient": {"name": root.get("NAME"), "entity_count": root.findtext("ENTITYCOUNT"),
                    "limits": {c.tag: dict(c.attrib) for c in props} if props is not None else None},
        "entity_types": dict(types),
        "walls": walls(root),
        "top_level_modules": top,
        "catalog": catalog,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("promob", nargs="+")
    ap.add_argument("--json", help="grava o relatório completo em JSON")
    a = ap.parse_args()
    reports = [inspect(Path(p)) for p in a.promob]
    for r in reports:
        s = r["system"]
        print(f"== {r['file']}: ambiente '{r['ambient']['name']}', {r['ambient']['entity_count']} entidades; "
              f"{s.get('system_name')} ({s.get('distribution')}) Promob {s.get('last_save_version')}")
        for w in r["walls"]:
            print(f"   parede h={w['height']:g} pontos={len(w['points_xy_thickness'])}")
        for m in r["top_level_modules"]:
            d = m["dimension"] or {}
            p = m["position"] or [0, 0, 0]
            print(f"   {m['id'][:48]:48} L={d.get('WIDTH', 0):6g} A={d.get('HEIGHT', 0):6g} "
                  f"P={d.get('DEPTH', 0):6g}  pos=({p[0]:.0f},{p[1]:.0f},{p[2]:.0f}) rot={m['rotation']:g}")
        print(f"   catálogo: {len(r['catalog'])} códigos distintos")
    if a.json:
        Path(a.json).write_text(json.dumps(reports, ensure_ascii=False, indent=1), encoding="utf-8")
        print("relatório:", a.json)


if __name__ == "__main__":
    sys.exit(main())
