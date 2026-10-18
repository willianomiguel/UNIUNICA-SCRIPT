"""Testes do editor/inspetor de .promob com um projeto sintético mínimo
(mesma estrutura observada nos projetos reais, sem dados de cliente)."""
from __future__ import annotations

import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from promob_editar import AMBIENT, PromobProject  # noqa: E402
from promob_inspecionar import inspect  # noqa: E402

MODULE = """<INFORMACOES ID="tod_coz_bui_inf_bal_bal_2p" TYPE="MODULO">
<ASSOCIATIONREGISTRY UNIQUEID="{uid}" REGISTERED="Y" GUID="g{uid}" />
<POSICAOINSERCAO><PONTOBASE X="100" Y="2000" Z="200" /><ROTATION>90</ROTATION></POSICAOINSERCAO>
<INSERTDIMENSION WIDTH="836" HEIGHT="680" DEPTH="640"><MIN WIDTH="600" HEIGHT="357" DEPTH="265" />
<MAX WIDTH="1200" HEIGHT="900" DEPTH="850" /></INSERTDIMENSION>
<LIMITS><MIN Y="-640" /><MAX X="836" Z="680" /></LIMITS>
<NAOPROCESSARAGREGADOSPADROES />
<ATTRIBUTES><ATTRIBUTE ID="BIBLIOTECA_NOME" VALUE="Cozinhas Builder" /></ATTRIBUTES>
<METADATAS><METADATA ID="AGGREGATESINFO"><METADATA.VALUE /></METADATA></METADATAS>
<INFORMACOESCOLECAO>
 <INFORMACOES ID="tod_coz_bui_ocu_cai_bal" TYPE="MODULO">
  <ASSOCIATIONREGISTRY UNIQUEID="{cid}" REGISTERED="Y" GUID="g{cid}" />
  <OBJECTASSOCIATION OBJECTPROPERTY="ParentEntidade" UNIQUEID="{uid}" />
  <INSERTDIMENSION WIDTH="836" HEIGHT="680" DEPTH="640" />
 </INFORMACOES>
</INFORMACOESCOLECAO>
</INFORMACOES>"""

AMB = ('﻿<?xml version="1.0" encoding="utf-8"?><AMBIENT3D ID="0" NAME="Cozinha">'
       '<ASSOCIATIONMANAGER LASTINDEX="50" /><ENTITYCOUNT>4</ENTITYCOUNT>'
       '<INFORMACOES ID="PISOTETO" TYPE="PisoTeto"><ASSOCIATIONREGISTRY UNIQUEID="1" GUID="g1" />'
       '<INFORMACOESCOLECAO><INFORMACOES ID="PAREDE" TYPE="WALL"><ASSOCIATIONREGISTRY UNIQUEID="2" GUID="g2" />'
       '<INSERTDIMENSION WIDTH="3000" HEIGHT="2600" DEPTH="150" />'
       '<GEOMETRY><SHAPE ALIGNMENT="Esquerda"><POINT2DGP X="0" Y="0" E="150" /><POINT2DGP X="3000" Y="0" E="150" />'
       '</SHAPE></GEOMETRY><INFORMACOESCOLECAO>' + MODULE.format(uid=10, cid=11) +
       '</INFORMACOESCOLECAO></INFORMACOES></INFORMACOESCOLECAO></INFORMACOES></AMBIENT3D>')


@pytest.fixture
def model(tmp_path):
    p = tmp_path / "MODELO.promob"
    with zipfile.ZipFile(p, "w") as z:
        z.writestr("promob.info", '<?xml version="1.0"?><PROMOB SYSTEMNAME="Todeschini Concept" SYSTEMID="2099" '
                                  'DISTRIBUTION="Studio"><VERSIONING VERSION="5" REVISION="60" BUILD="47" />'
                                  '<PROJECTHISTORY><HISTORY VERSION="5.60.47.2" SERIALNUMBER="SEGREDO" /></PROJECTHISTORY>'
                                  '</PROMOB>')
        z.writestr("invoker.xml", '<?xml version="1.0"?><INVOKER><PARAMS><METADATAS>'
                                  '<METADATA ID="ProjectId" VALUE="old" /></METADATAS></PARAMS></INVOKER>')
        z.writestr("solucao/solucao.container", '﻿<?xml version="1.0"?><CONTAINER><INFORMACOESADICIONAIS>'
                                                '<PROJECTGUID GUID="old" /></INFORMACOESADICIONAIS></CONTAINER>')
        z.writestr(AMBIENT, AMB.encode("utf-8"))
    return p


def _ambient(path):
    with zipfile.ZipFile(path) as z:
        return ET.fromstring(z.read(AMBIENT).decode("utf-8-sig"))


def test_roundtrip_changes_only_project_ids(model, tmp_path):
    out = tmp_path / "E0.promob"
    guid = PromobProject(model).save(out)
    a, b = _ambient(model), _ambient(out)
    assert ET.canonicalize(ET.tostring(a, encoding="unicode")) == ET.canonicalize(ET.tostring(b, encoding="unicode"))
    with zipfile.ZipFile(out) as z:
        assert guid in z.read("solucao/solucao.container").decode("utf-8-sig")
        assert guid in z.read("invoker.xml").decode()
        assert z.read(AMBIENT).startswith(b"\xef\xbb\xbf<?xml")


def test_never_overwrites(model):
    with pytest.raises(ValueError):
        PromobProject(model).save(model)


def test_duplicate_remaps_ids(model, tmp_path):
    p = PromobProject(model)
    clone = p.duplicate(p.first("tod_coz_bui_inf_bal_bal_2p"), dx=1500)
    out = tmp_path / "E3.promob"
    p.save(out)
    root = _ambient(out)
    ids = [r.get("UNIQUEID") for r in root.iter("ASSOCIATIONREGISTRY")]
    assert len(ids) == len(set(ids)) == 6
    assert root.find("ASSOCIATIONMANAGER").get("LASTINDEX") == "52"
    assert root.findtext("ENTITYCOUNT") == "6"
    mods = [e for e in root.iter("INFORMACOES") if e.get("ID") == "tod_coz_bui_inf_bal_bal_2p"]
    assert [m.find("POSICAOINSERCAO/PONTOBASE").get("X") for m in mods] == ["100", "1600"]
    child_ref = mods[1].find(".//OBJECTASSOCIATION").get("UNIQUEID")
    assert child_ref == mods[1].find("ASSOCIATIONREGISTRY").get("UNIQUEID")   # referência interna remapeada


def test_set_dimension_respects_catalog_limits(model):
    p = PromobProject(model)
    m = p.first("tod_coz_bui_inf_bal_bal_2p")
    p.set_dimension(m, WIDTH=900)
    assert m.find("INSERTDIMENSION").get("WIDTH") == "900"
    assert m.find("LIMITS/MAX").get("X") == "900"
    with pytest.raises(ValueError):
        p.set_dimension(m, WIDTH=1500)


def test_add_minimal_strips_aggregates(model):
    p = PromobProject(model)
    m = p.add_minimal(p.first("tod_coz_bui_inf_bal_bal_2p"), dx=1500)
    assert len(m.find("INFORMACOESCOLECAO")) == 0
    assert m.find("NAOPROCESSARAGREGADOSPADROES") is None
    assert not [x for x in m.iter("METADATA") if x.get("ID") == "AGGREGATESINFO"]


def test_delete_and_inspect(model, tmp_path):
    p = PromobProject(model)
    p.delete(p.first("tod_coz_bui_inf_bal_bal_2p"))
    out = tmp_path / "E4.promob"
    p.save(out)
    rep = inspect(out)
    assert rep["top_level_modules"] == []
    assert rep["walls"][0]["height"] == 2600
    assert "SERIALNUMBER" not in str(rep["system"])            # nº de série não vaza no relatório
    rep0 = inspect(model)
    assert rep0["top_level_modules"][0]["dimension"]["WIDTH"] == 836
    assert rep0["catalog"]["tod_coz_bui_inf_bal_bal_2p"]["dim_max"]["WIDTH"] == 1200


def test_move_translates_whole_subtree(model):
    p = PromobProject(model)
    m = p.first("tod_coz_bui_inf_bal_bal_2p")
    p.move(m, dx=100, dz=50)
    xs = [(b.get("X"), b.get("Z")) for b in m.iter("PONTOBASE")]
    assert xs[0] == ("200", "250")


def test_novo_projeto_importa_modulo_de_outra_fonte(model, tmp_path):
    sys.path.insert(0, str(ROOT / "tools"))
    from promob_novo import build
    recipe = {"pasta": str(model.parent), "modelo": model.name, "nome_ambiente": "Novo",
              "modulos": [{"fonte": model.name, "codigo": "tod_coz_bui_inf_bal_bal_2p", "parede_face": 0,
                           "x": 500, "y": 0, "z": 200}]}
    out = tmp_path / "NOVO.promob"
    build(recipe, out)
    root = _ambient(out)
    mods = [e for e in root.iter("INFORMACOES") if e.get("ID") == "tod_coz_bui_inf_bal_bal_2p"]
    assert len(mods) == 1                                    # o original foi removido, só o importado ficou
    assert mods[0].find("POSICAOINSERCAO/PONTOBASE").get("X") == "500"
    ids = {r.get("UNIQUEID") for r in root.iter("ASSOCIATIONREGISTRY")}
    assert all(o.get("UNIQUEID") in ids for o in root.iter("OBJECTASSOCIATION"))
    assert root.get("NAME") == "Novo"
