"""Edição programática de projetos .promob (ZIP + XML) a partir de um projeto-modelo.

NUNCA altera o arquivo original: lê o modelo, aplica operações e grava um NOVO
.promob com novo PROJECTGUID/ProjectId (para "Arquivo > Importar Projeto" criar
um projeto novo em vez de sobrescrever o existente).

Operações (sobre entidades <INFORMACOES TYPE="MODULO"> do document0.ambient3d):
  set_dimension  muda WIDTH/HEIGHT/DEPTH (respeitando MIN/MAX do catálogo)
  move           desloca PONTOBASE
  duplicate      copia a subárvore com novos UNIQUEID/GUID (e referências internas remapeadas)
  delete         remove a entidade (e seus agregados)
  add_minimal    insere um item da biblioteca só com código + posição + medidas, sem agregados,
                 para testar se o Promob reconstrói os agregados a partir do catálogo

Uso (experimentos de validação):
  python tools/promob_editar.py MODELO.promob pasta_saida
"""
from __future__ import annotations

import copy
import io
import sys
import uuid
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

AMBIENT = "solucao/container1/document0/document0.ambient3d"
XML_DECL = '<?xml version="1.0" encoding="utf-8"?>'


class PromobProject:
    def __init__(self, path: Path):
        self.path = Path(path)
        with zipfile.ZipFile(self.path) as z:
            self.infos = z.infolist()
            self.members = {i.filename: z.read(i) for i in self.infos}
        self.root = ET.parse(io.BytesIO(self.members[AMBIENT])).getroot()
        self._parents = None
        self.log: list[str] = []

    # ------------------------------------------------------------ consulta
    def parents(self):
        if self._parents is None:
            self._parents = {c: p for p in self.root.iter() for c in p}
        return self._parents

    def modules(self, code=None):
        return [e for e in self.root.iter("INFORMACOES")
                if e.get("TYPE") == "MODULO" and (code is None or e.get("ID") == code)]

    def first(self, code):
        mods = self.modules(code)
        if not mods:
            raise KeyError(f"módulo {code!r} não encontrado no modelo")
        return mods[0]

    @staticmethod
    def dims(e):
        d = e.find("INSERTDIMENSION")
        return {k: float(d.get(k, 0) or 0) for k in ("WIDTH", "HEIGHT", "DEPTH")}

    # ------------------------------------------------------------ operações
    def set_dimension(self, e, **dims):
        d = e.find("INSERTDIMENSION")
        mn, mx = d.find("MIN"), d.find("MAX")
        for k, v in dims.items():
            k = k.upper()
            lo = float(mn.get(k, 0) or 0) if mn is not None else None
            hi = float(mx.get(k, 0) or 0) if mx is not None and mx.get(k) else None
            if (lo is not None and v < lo) or (hi is not None and v > hi):
                raise ValueError(f"{e.get('ID')}: {k}={v} fora do limite do catálogo [{lo}, {hi}]")
            d.set(k, _num(v))
        lim = e.find("LIMITS")
        if lim is not None:  # caixa local: X=largura, -Y=profundidade, Z=altura
            dd = self.dims(e)
            mx_ = lim.find("MAX")
            mn_ = lim.find("MIN")
            if mx_ is not None:
                mx_.set("X", _num(dd["WIDTH"]))
                mx_.set("Z", _num(dd["HEIGHT"]))
            if mn_ is not None and mn_.get("Y"):
                mn_.set("Y", _num(-dd["DEPTH"]))
        self.log.append(f"set_dimension {e.get('ID')} {dims}")

    def move(self, e, dx=0.0, dy=0.0, dz=0.0):
        p = e.find("POSICAOINSERCAO/PONTOBASE")
        for k, dv in (("X", dx), ("Y", dy), ("Z", dz)):
            if dv:
                p.set(k, _num(float(p.get(k, 0) or 0) + dv))
        self.log.append(f"move {e.get('ID')} ({dx},{dy},{dz})")

    def _next_ids(self, n):
        am = self.root.find("ASSOCIATIONMANAGER")
        last = int(am.get("LASTINDEX"))
        am.set("LASTINDEX", str(last + n))
        return list(range(last + 1, last + n + 1))

    def duplicate(self, e, dx=0.0, dy=0.0, dz=0.0):
        clone = copy.deepcopy(e)
        regs = list(clone.iter("ASSOCIATIONREGISTRY"))
        new_ids = self._next_ids(len(regs))
        remap = {}
        for r, nid in zip(regs, new_ids):
            remap[r.get("UNIQUEID")] = str(nid)
            r.set("UNIQUEID", str(nid))
            r.set("GUID", str(uuid.uuid4()))
        for oa in clone.iter("OBJECTASSOCIATION"):   # referências internas à cópia
            if oa.get("UNIQUEID") in remap:
                oa.set("UNIQUEID", remap[oa.get("UNIQUEID")])
        parent = self.parents()[e]
        parent.insert(list(parent).index(e) + 1, clone)
        self._parents = None
        self.move(clone, dx, dy, dz)
        self._bump_entity_count(len(regs))
        self.log.append(f"duplicate {e.get('ID')} (+{len(regs)} entidades)")
        return clone

    def delete(self, e):
        n = sum(1 for _ in e.iter("ASSOCIATIONREGISTRY"))
        self.parents()[e].remove(e)
        self._parents = None
        self._bump_entity_count(-n)
        self.log.append(f"delete {e.get('ID')} (-{n} entidades)")

    def add_minimal(self, template, dx=0.0, dy=0.0, dz=0.0):
        """Cópia do módulo SEM agregados (filhos) e sem cache de agregados."""
        clone = self.duplicate(template, dx, dy, dz)
        col = clone.find("INFORMACOESCOLECAO")
        removed = 0
        if col is not None:
            removed = sum(1 for _ in col.iter("ASSOCIATIONREGISTRY"))
            for k in list(col):
                col.remove(k)
        for md in list(clone.findall("METADATAS")):
            for m in list(md):
                if m.get("ID") == "AGGREGATESINFO":
                    md.remove(m)
        for tag in ("NAOPROCESSARAGREGADOSPADROES", "COMPONENTDEFINITIONCOLLECTION"):
            for x in clone.findall(tag):
                clone.remove(x)
        self._bump_entity_count(-removed)
        self.log.append(f"add_minimal {template.get('ID')} (agregados removidos: {removed})")
        return clone

    def _bump_entity_count(self, n):
        ec = self.root.find("ENTITYCOUNT")
        if ec is not None and ec.text:
            ec.text = str(int(ec.text) + n)

    # ------------------------------------------------------------ gravação
    def save(self, out: Path, ambient_name: str | None = None):
        out = Path(out)
        if out.resolve() == self.path.resolve():
            raise ValueError("recusa sobrescrever o arquivo-modelo")
        if out.exists():
            raise FileExistsError(out)
        if ambient_name:
            self.root.set("NAME", ambient_name)
        members = dict(self.members)
        members[AMBIENT] = ("﻿" + XML_DECL + ET.tostring(self.root, encoding="unicode")).encode("utf-8")
        new_guid = str(uuid.uuid4())
        for name in ("solucao/solucao.container", "invoker.xml"):
            if name in members:
                members[name] = _replace_project_ids(members[name], new_guid)
        out.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
            for info in self.infos:
                zi = zipfile.ZipInfo(info.filename, date_time=info.date_time)
                zi.compress_type = zipfile.ZIP_DEFLATED
                z.writestr(zi, members[info.filename])
        return new_guid


def _replace_project_ids(data: bytes, new_guid: str) -> bytes:
    bom = data.startswith(b"\xef\xbb\xbf")
    text = data.decode("utf-8-sig")
    root = ET.fromstring(text)
    for e in root.iter("PROJECTGUID"):
        e.set("GUID", new_guid)
    for e in root.iter("METADATA"):
        if e.get("ID") == "ProjectId":
            e.set("VALUE", new_guid)
    body = XML_DECL + ET.tostring(root, encoding="unicode")
    return (("﻿" if bom else "") + body).encode("utf-8")


def _num(v: float) -> str:
    return f"{v:.3f}".rstrip("0").rstrip(".") if v != int(v) else str(int(v))


# ---------------------------------------------------------------- experimentos

def experiments(model: Path, outdir: Path):
    outdir = Path(outdir)
    stem = model.stem
    results = []

    def run(tag, desc, fn):
        p = PromobProject(model)
        fn(p)
        out = outdir / f"TESTE_{tag}_{stem}.promob"
        guid = p.save(out, ambient_name=f"TESTE {tag} {p.root.get('NAME')}")
        results.append((out.name, desc, p.log, guid))

    run("E0_IDENTICO", "Reescrito sem nenhuma alteração (controle: o Promob aceita o arquivo regravado?)",
        lambda p: None)
    run("E1_LARGURA", "Balcão 2 portas tod_coz_bui_inf_bal_bal_2p: largura 836 -> 900 mm",
        lambda p: p.set_dimension(p.first("tod_coz_bui_inf_bal_bal_2p"), WIDTH=900))
    run("E2_MOVER", "Aéreo 1 porta tod_coz_bui_sup_arm_1p: sobe 100 mm (Z +100)",
        lambda p: p.move(p.first("tod_coz_bui_sup_arm_1p"), dz=100))
    run("E3_DUPLICAR", "Balcão 2 portas duplicado (cópia completa) 1500 mm para dentro do ambiente",
        lambda p: p.duplicate(p.first("tod_coz_bui_inf_bal_bal_2p"), dx=1500))
    run("E4_REMOVER", "Aéreo basculante/articulado tod_coz_bui_sup_arm_art removido",
        lambda p: p.delete(p.first("tod_coz_bui_sup_arm_art")))
    run("E5_MINIMO", "Balcão 2 portas inserido SÓ com código+posição+medidas (sem agregados) 1500 mm para dentro",
        lambda p: p.add_minimal(p.first("tod_coz_bui_inf_bal_bal_2p"), dx=1500))
    return results


if __name__ == "__main__":
    model, outdir = Path(sys.argv[1]), Path(sys.argv[2])
    for name, desc, log, guid in experiments(model, outdir):
        print(f"{name}\n   {desc}\n   ops: {log}\n   novo ProjectGUID: {guid}")
