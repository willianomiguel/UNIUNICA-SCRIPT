"""Monta um projeto .promob NOVO a partir de um projeto-modelo (casca de paredes)
e de módulos de catálogo copiados de outros projetos .promob.

Estratégia (sem inventar formato):
  1. Abre o modelo (ex.: COZINHA.promob) e mantém só a infraestrutura do ambiente:
     piso/teto, paredes e portas/aberturas; remove todos os móveis.
  2. Copia módulos completos (com todos os agregados) de projetos-fonte
     (ex.: guarda-roupa da SALA, gaveteiros da COZINHA), transladando a
     subárvore inteira para a nova posição, com novos UNIQUEID/GUID, camadas
     casadas pelo nome e acabamentos (MODELS) mesclados.
  3. Grava um .promob novo com novo PROJECTGUID (importa sem sobrescrever).

Uso: python tools/promob_novo.py receita.json saida.promob
     receita = {"modelo": "...promob", "nome_ambiente": "...", "manter": [ids...],
                "modulos": [{"fonte": "...promob", "codigo": "...", "ocorrencia": 0,
                             "parede_face": 0, "x": ..., "y": ..., "z": ...}]}
"""
from __future__ import annotations

import copy
import json
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from promob_editar import PromobProject, translate_subtree  # noqa: E402

KEEP_TYPES = {"WALL", "Teto", "PisoTeto"}
OPENING_LAYER = "Decore Promob-Aberturas"   # portas e janelas (itens online que furam a parede)


def kids(e):
    c = e.find("INFORMACOESCOLECAO")
    return c


def strip_furniture(p: PromobProject, keep_ids=(), keep_layers=(OPENING_LAYER,)):
    """Remove móveis/geometrias do ambiente, mantendo paredes, teto, aberturas e itens listados."""
    floor = p.root.find("INFORMACOES")
    removed = 0

    def clean(container):
        nonlocal removed
        if container is None:
            return
        for e in list(container):
            if e.get("TYPE") in KEEP_TYPES:
                clean(kids(e))
                continue
            layer = e.find("LAYER")
            if e.get("ID") in keep_ids or (layer is not None and layer.get("DESCRIPTION") in keep_layers):
                continue
            removed += sum(1 for _ in e.iter("ASSOCIATIONREGISTRY"))
            container.remove(e)

    clean(kids(floor))
    p._parents = None
    p._bump_entity_count(-removed)
    p.log.append(f"strip_furniture: {removed} entidades removidas")


def _inner_box(p: PromobProject):
    pts = [(float(q.get("X")), float(q.get("Y"))) for q in wall(p).find("GEOMETRY/SHAPE")]
    xs, ys = [a for a, _ in pts], [b for _, b in pts]
    return min(xs), max(xs), min(ys), max(ys)


def resize_shell(p: PromobProject, width: float, depth: float):
    """Redimensiona a casca retangular (paredes + piso + teto) para medidas internas width x depth (mm).
    Mantém o canto inferior esquerdo; o lado direito anda dW e o lado de cima anda dD.
    Coordenadas absolutas: translação por lado. Faces (POINTS locais): comprimentos ajustados."""
    x0, x1, y0, y1 = _inner_box(p)
    old_w, old_d = x1 - x0, y1 - y0
    dw, dd = width - old_w, depth - old_d
    xm, ym = (x0 + x1) / 2, (y0 + y1) / 2

    def tx(v):
        return v + dw if v > xm else v

    def ty(v):
        return v + dd if v > ym else v

    def adj(v, band_w, band_d):
        a = abs(v)
        if band_w and abs(a - old_w) <= 400:
            return v + (dw if v > 0 else -dw)
        if band_d and abs(a - old_d) <= 400:
            return v + (dd if v > 0 else -dd)
        return v

    from promob_editar import _num
    targets = [e for e in p.root.iter("INFORMACOES") if e.get("TYPE") in ("WALL", "PisoTeto", "Teto")]
    for ent in targets:
        own = [c for c in ent if c.tag != "INFORMACOESCOLECAO"]   # só a própria entidade, não os filhos
        for top in own:
            for el in top.iter():
                if el.tag in ("PONTOBASE", "POINT2DGP", "POINT2DG", "MIN", "MAX") and el.get("X") is not None:
                    el.set("X", _num(tx(float(el.get("X")))))
                if el.tag in ("PONTOBASE", "POINT2DGP", "POINT2DG", "MIN", "MAX") and el.get("Y") is not None:
                    el.set("Y", _num(ty(float(el.get("Y")))))
            for reg in top.iter():
                pos, pts = reg.find("POSITION"), reg.find("POINTS")
                if pos is None or pts is None:
                    continue
                n = pos.find("NORMAL")
                horizontal = n is not None and n.get("C") not in (None, "", "0")
                for q in pts:
                    if q.get("X"):
                        q.set("X", _num(adj(float(q.get("X")), True, True)))
                    if horizontal and q.get("Y"):
                        q.set("Y", _num(adj(float(q.get("Y")), True, True)))
        d = ent.find("INSERTDIMENSION")
        if d is not None:
            d.set("WIDTH", _num(float(d.get("WIDTH", 0)) + dw))
            d.set("DEPTH", _num(float(d.get("DEPTH", 0)) + dd))
    props = p.root.find("AMBIENTPROPERTIES")
    for el in props if props is not None else []:
        if el.get("X"):
            el.set("X", _num(tx(float(el.get("X")))))
        if el.get("Y"):
            el.set("Y", _num(ty(float(el.get("Y")))))
    # aberturas e itens mantidos acompanham o lado em que estão
    for e in list(kids_list(wall(p))) + list(kids_list(p.root.find("INFORMACOES"))):
        if e.get("TYPE") in KEEP_TYPES:
            continue
        b = e.find("POSICAOINSERCAO/PONTOBASE")
        if b is None:
            continue
        bx, by = float(b.get("X", 0) or 0), float(b.get("Y", 0) or 0)
        translate_subtree(e, tx(bx) - bx, ty(by) - by, 0)
    p.log.append(f"resize_shell: {old_w:.0f}x{old_d:.0f} -> {width:.0f}x{depth:.0f} (dW={dw:.0f}, dD={dd:.0f})")
    return {"x0": x0, "y0": y0, "x1": x0 + width, "y1": y0 + depth}


def kids_list(e):
    c = e.find("INFORMACOESCOLECAO")
    return list(c) if c is not None else []


def _xyz(e):
    b = e.find("POSICAOINSERCAO/PONTOBASE")
    return tuple(float(b.get(k, 0) or 0) for k in "XYZ") if b is not None else None


def opening_groups(p: PromobProject):
    """Agrupa aberturas: cada item que fura a parede (HOLE PRICK) + itens contidos nele (folha, maçaneta)."""
    items = [e for e in kids_list(wall(p)) if e.find("LAYER") is not None
             and e.find("LAYER").get("DESCRIPTION") == OPENING_LAYER and _xyz(e)]
    frames = [e for e in items if e.find("HOLE") is not None and e.find("HOLE").get("PRICK") == "Y"]
    groups = []
    for f in frames:
        fx, fy, fz = _xyz(f)
        fw = float(f.find("INSERTDIMENSION").get("WIDTH"))
        fh = float(f.find("INSERTDIMENSION").get("HEIGHT"))
        g = [f] + [e for e in items if e not in frames and abs(_xyz(e)[1] - fy) < 250
                   and fx - 1 <= _xyz(e)[0] <= fx + fw and fz - 1 <= _xyz(e)[2] <= fz + fh]
        groups.append(g)
    return groups


def move_opening(p: PromobProject, near_xy, dx=0.0, dy=0.0):
    """Move a abertura (batente + folha + maçaneta) cujo batente está mais perto de near_xy."""
    groups = opening_groups(p)
    g = min(groups, key=lambda g: (_xyz(g[0])[0] - near_xy[0]) ** 2 + (_xyz(g[0])[1] - near_xy[1]) ** 2)
    for e in g:
        translate_subtree(e, dx, dy, 0)
    p.log.append(f"move_opening perto de {near_xy}: {len(g)} itens deslocados ({dx},{dy})")
    return g


def wall(p: PromobProject):
    return next(e for e in p.root.iter("INFORMACOES") if e.get("TYPE") == "WALL")


def _layer_map(src: PromobProject, dst: PromobProject):
    if src.root.find("LAYERS") is None or dst.root.find("LAYERS") is None:
        return {}
    by_desc = {l.get("DESCRIPTION"): l for l in dst.root.find("LAYERS")}
    mapping = {}
    for l in src.root.find("LAYERS"):
        d = by_desc.get(l.get("DESCRIPTION"))
        if d is None:   # camada inexistente no destino: adiciona
            d = copy.deepcopy(l)
            dst.root.find("LAYERS").append(d)
            by_desc[l.get("DESCRIPTION")] = d
        mapping[l.get("GUID")] = d.get("GUID")
    return mapping


def _merge_models(src: PromobProject, dst: PromobProject):
    dmodels = dst.root.find("MODELMANAGER/MODELS")
    if dmodels is None or src.root.find("MODELMANAGER/MODELS") is None:
        return 0
    have = {m.get("IDMODEL") for m in dmodels}
    added = 0
    for m in src.root.find("MODELMANAGER/MODELS"):
        if m.get("IDMODEL") not in have:
            dmodels.append(copy.deepcopy(m))
            have.add(m.get("IDMODEL"))
            added += 1
    return added


def import_module(dst: PromobProject, src: PromobProject, entity, parent, target_xyz, plane_id=None, remap_acc=None):
    """Copia `entity` (de src) para `parent` (em dst), com a base em target_xyz.
    remap_acc acumula UNIQUEID antigo -> novo de todos os módulos vindos da mesma fonte."""
    clone = copy.deepcopy(entity)
    base = clone.find("POSICAOINSERCAO/PONTOBASE")
    bx, by, bz = (float(base.get(k, 0) or 0) for k in "XYZ")
    tx, ty, tz = target_xyz
    translate_subtree(clone, tx - bx, ty - by, tz - bz)
    # identidades novas
    regs = list(clone.iter("ASSOCIATIONREGISTRY"))
    new_ids = dst._next_ids(len(regs))
    remap = {}
    for r, nid in zip(regs, new_ids):
        remap[r.get("UNIQUEID")] = str(nid)
        r.set("UNIQUEID", str(nid))
        r.set("GUID", str(uuid.uuid4()))
    if remap_acc is not None:
        remap_acc.update(remap)
    parent_uid = parent_entity_uid(dst, parent)
    for oa in clone.iter("OBJECTASSOCIATION"):
        u = oa.get("UNIQUEID")
        if u in remap:
            oa.set("UNIQUEID", remap[u])
        elif oa.get("OBJECTPROPERTY") == "ParentEntidade" and parent_uid:
            oa.set("UNIQUEID", parent_uid)
    # camadas e acabamentos
    lmap = _layer_map(src, dst)
    for l in clone.iter("LAYER"):
        if l.get("GUID") in lmap:
            dst_layer = next(x for x in dst.root.find("LAYERS") if x.get("GUID") == lmap[l.get("GUID")])
            l.set("GUID", dst_layer.get("GUID"))
            l.set("DESCRIPTION", dst_layer.get("DESCRIPTION"))
    added = _merge_models(src, dst)
    if plane_id:
        clone.set("IDPLANOMOVIMENTACAO", plane_id)
    col = parent.find("INFORMACOESCOLECAO")
    if col is None:
        col = parent.makeelement("INFORMACOESCOLECAO", {})
        parent.append(col)
    col.append(clone)
    dst._parents = None
    dst._bump_entity_count(len(regs))
    dst.log.append(f"import {entity.get('ID')} -> {target_xyz} (+{len(regs)} entidades, +{added} modelos)")
    return clone


def fix_cross_references(dst: PromobProject, imported):
    """Referências entre módulos importados da mesma fonte (ex.: uniões de painéis) passam a
    apontar para os novos UNIQUEID; uniões com peças que não vieram são descartadas."""
    valid = {r.get("UNIQUEID") for r in dst.root.iter("ASSOCIATIONREGISTRY")}
    dropped = 0
    for clone, remap in imported:
        for oa in clone.iter("OBJECTASSOCIATION"):
            if oa.get("UNIQUEID") not in valid and oa.get("UNIQUEID") in remap:
                oa.set("UNIQUEID", remap[oa.get("UNIQUEID")])
        parents = {c: p for p in clone.iter() for c in p}
        for jd in list(clone.iter("JOINTDESCRIPTOR")):
            if any(o.get("UNIQUEID") not in valid for o in jd.iter("OBJECTASSOCIATION")):
                parents[jd].remove(jd)
                dropped += 1
    dst.log.append(f"referências cruzadas corrigidas; uniões descartadas: {dropped}")


def parent_entity_uid(p, e):
    r = e.find("ASSOCIATIONREGISTRY")
    return r.get("UNIQUEID") if r is not None else None


def wall_face_plane(index: int) -> str:
    return f"PAREDE_FACE_PERFIL_MOVIMENTACAO_INDICEFORMA_{index}_INDICEFORMAPROCESSADA_{index}"


def build(recipe: dict, out: Path):
    base_dir = Path(recipe.get("pasta", "."))
    dst = PromobProject(base_dir / recipe["modelo"])
    strip_furniture(dst, set(recipe.get("manter", [])))
    for r in recipe.get("remover_aberturas_perto", []):
        for e in move_opening(dst, r):
            for par in dst.root.iter("INFORMACOESCOLECAO"):
                if e in list(par):
                    par.remove(e)
    if "ambiente_mm" in recipe:
        resize_shell(dst, *recipe["ambiente_mm"])
    for mv in recipe.get("mover_aberturas", []):
        move_opening(dst, mv["perto"], *mv["deslocar"])
    sources = {}
    remaps: dict[str, dict] = {}
    imported = []
    for item in recipe["modulos"]:
        src = sources.setdefault(item["fonte"], PromobProject(base_dir / item["fonte"]))
        cands = src.modules(item["codigo"])
        if not cands:
            raise KeyError(f"{item['codigo']} não existe em {item['fonte']}")
        if "perto" in item:   # escolhe a ocorrência mais próxima de um ponto do projeto-fonte
            px, py, pz = item["perto"]
            cands.sort(key=lambda e: sum((float(e.find("POSICAOINSERCAO/PONTOBASE").get(k, 0) or 0) - v) ** 2
                                         for k, v in zip("XYZ", (px, py, pz))))
            ent = cands[0]
        else:
            ent = cands[item.get("ocorrencia", 0)]
        b = ent.find("POSICAOINSERCAO/PONTOBASE")
        bxyz = [float(b.get(k, 0) or 0) for k in "XYZ"]
        if "deslocar" in item:
            target = tuple(bxyz[k] + item["deslocar"][k] for k in range(3))
        else:
            target = (item["x"], item["y"], item.get("z", bxyz[2]))
        if item.get("parede_face") is not None:
            parent, plane = wall(dst), wall_face_plane(item["parede_face"])
        else:
            parent, plane = dst.root.find("INFORMACOES"), "PISOTETO_FACE_SUPERIOR_MOVIMENTACAO"
        clone = import_module(dst, src, ent, parent, target, plane, remaps.setdefault(item["fonte"], {}))
        imported.append((clone, remaps[item["fonte"]]))
    fix_cross_references(dst, imported)
    guid = dst.save(out, ambient_name=recipe.get("nome_ambiente"))
    return dst, guid


if __name__ == "__main__":
    recipe = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    proj, guid = build(recipe, Path(sys.argv[2]))
    print("\n".join(proj.log))
    print("ProjectGUID:", guid)
