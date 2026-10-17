"""Testes do gerador. Os validadores de formato usam bibliotecas independentes
(ezdxf, trimesh, pycollada, leitor PMob do mooblender) quando instaladas."""
from __future__ import annotations

import copy
import json
import os
import shutil
import struct
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from promob_gen.generator import generate  # noqa: E402
from promob_gen.model import build_project  # noqa: E402
from promob_gen.spec import SpecError, load_spec, parse_spec  # noqa: E402

POC = ROOT / "samples" / "poc_cozinha_01.json"
FULL = ROOT / "samples" / "cozinha_linear_completa.json"


@pytest.fixture(scope="module")
def full_run(tmp_path_factory):
    out = tmp_path_factory.mktemp("out")
    m = generate(load_spec(FULL), out)
    return m, Path(m["run_dir"])


def raw(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


# ------------------------------------------------------------ especificação

def test_poc_sample_valid():
    spec = load_spec(POC)
    assert [m.type for m in spec.cabinet_modules] == ["base_cabinet", "drawer_cabinet"]


@pytest.mark.parametrize("mutate,expected", [
    (lambda d: d["room"].update(wall_length=1000), "excede a parede"),
    (lambda d: d["cabinet_modules"][0].update(width=-1), "deve ser > 0"),
    (lambda d: d["cabinet_modules"][0].update(type="xyz"), "não suportado"),
    (lambda d: d.update(units="cm"), "'units'"),
    (lambda d: (d["room"].update(ceiling_height=2000), d["cabinet_modules"][0].update(height=1950)), "pé-direito"),
    (lambda d: d["room"].update(openings=[{"type": "window", "x": 3000, "width": 900, "height": 500, "sill": 1000}]),
     "abertura"),
])
def test_validation_errors(mutate, expected):
    d = raw(POC)
    mutate(d)
    with pytest.raises(SpecError) as e:
        parse_spec(d)
    assert any(expected in err for err in e.value.errors), e.value.errors


def test_invalid_sample_rejected():
    with pytest.raises(SpecError):
        load_spec(ROOT / "samples" / "invalido_excede_parede.json")


# ------------------------------------------------------------ layout

def test_positions_poc():
    p = build_project(load_spec(POC))
    xs = [m.position for m in p.modules]
    assert xs == [(0, 0, 100), (600, 0, 100)]  # sobre rodapé de 100 mm
    for m in p.modules:
        lo, hi = m.bbox
        assert hi[0] - lo[0] == pytest.approx(m.width)
        assert hi[2] - lo[2] == pytest.approx(m.height + 100)  # módulo + rodapé


def test_wall_cabinets_avoid_tall_and_window():
    p = build_project(load_spec(FULL))
    walls = [m for m in p.modules if m.type == "wall_cabinet"]
    assert [m.position[0] for m in walls] == [600, 2500]
    assert not [w for w in p.warnings if "Colisão" in w]


def test_reorder_dimensions_changes_layout():
    d = raw(POC)
    d["cabinet_modules"][0]["width"] = 450
    p = build_project(parse_spec(d))
    assert p.modules[1].position[0] == 450


def test_cutlist_parts_inside_module():
    p = build_project(load_spec(FULL))
    for m in p.modules:
        for part in m.parts:
            assert all(s > 0 for s in part.size), (m.id, part.name)


# ------------------------------------------------------------ arquivos

def test_manifest_and_files(full_run):
    m, d = full_run
    for kind, files in m["files"].items():
        for f in files:
            assert (d / f).stat().st_size > 0, f
    assert all(n <= m["promob_face_limit"] for n in m["triangles_per_file"].values())
    assert (d / "IMPORTAR_NO_PROMOB.txt").exists()


def test_never_overwrites(tmp_path):
    a = generate(load_spec(POC), tmp_path)["run_dir"]
    b = generate(load_spec(POC), tmp_path)["run_dir"]
    assert a != b


def test_obj_with_trimesh(full_run):
    trimesh = pytest.importorskip("trimesh")
    _, d = full_run
    scene = trimesh.load(d / "Cozinha_Linear_3600_moveis.obj", force="scene", process=False)
    lo, hi = scene.bounds
    assert lo[0] == pytest.approx(0) and hi[0] == pytest.approx(3600)
    assert hi[2] == pytest.approx(100 + 2200)  # torre sobre rodapé
    mod = trimesh.load(d / "modulos" / "M02_drawer_cabinet.obj", force="mesh", process=False)
    assert mod.bounds[0] == pytest.approx([0, 0, 0])  # origem exigida pela Promob
    assert mod.bounds[1][0] == pytest.approx(600)


def _obj_groups(path):
    """Leitor mínimo de OBJ: {grupo: (vértices, faces)} com índices globais."""
    verts, groups, cur = [], {}, None
    for line in Path(path).read_text().splitlines():
        t = line.split()
        if not t:
            continue
        if t[0] == "v":
            verts.append(tuple(map(float, t[1:4])))
        elif t[0] == "g":
            cur = groups.setdefault(t[1], [])
        elif t[0] == "f":
            cur.append([int(i) - 1 for i in t[1:]])
    return verts, groups


def _signed_volume(verts, faces):
    vol = 0.0
    for f in faces:
        for i in range(1, len(f) - 1):
            a, b, c = verts[f[0]], verts[f[i]], verts[f[i + 1]]
            vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0])
                    + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6
    return vol


def test_not_mirrored_and_outward_normals(full_run):
    """Torre (1º módulo) à esquerda (x 0–600); parede em +Y, móveis em -Y; normais para fora."""
    _, d = full_run
    verts, groups = _obj_groups(d / "Cozinha_Linear_3600.obj")

    def bounds(pred):
        pts = [verts[i] for g, fs in groups.items() if pred(g) for f in fs for i in f]
        return [min(p[k] for p in pts) for k in range(3)], [max(p[k] for p in pts) for k in range(3)]

    lo, hi = bounds(lambda g: g.startswith("M01_tall_cabinet"))
    assert lo[0] == pytest.approx(0) and hi[0] == pytest.approx(600)
    assert hi[1] <= 1e-6                                   # móveis do lado -Y
    wlo, _ = bounds(lambda g: "Parede" in g)
    assert wlo[1] == pytest.approx(0)                      # face da parede em y=0, parede em +Y
    for g, fs in groups.items():
        assert _signed_volume(verts, fs) > 0, g            # cada peça fechada com normais para fora


def test_dxf_with_ezdxf(full_run):
    ezdxf = pytest.importorskip("ezdxf")
    _, d = full_run
    doc = ezdxf.readfile(d / "Cozinha_Linear_3600.dxf")
    assert doc.dxfversion == "AC1009"
    faces = doc.modelspace().query("3DFACE")
    assert len(faces) > 100
    assert {f.dxf.layer for f in faces} >= {"AMBIENTE", "M01_TALL_CABINET"}
    assert len(doc.modelspace().query("POLYLINE LWPOLYLINE")) == 0  # Promob não lê polilinhas


def test_dae_with_pycollada(full_run):
    collada = pytest.importorskip("collada")
    _, d = full_run
    c = collada.Collada(str(d / "Cozinha_Linear_3600.dae"))
    assert c.assetInfo.upaxis == "Z_UP"
    assert len(c.geometries) > 50
    assert len(list(c.scene.objects("geometry"))) == len(c.geometries)


def _walk_3ds(data, start, end, out):
    i = start
    while i < end:
        cid, ln = struct.unpack_from("<HI", data, i)
        assert ln >= 6 and i + ln <= end, f"chunk 0x{cid:04X} inválido em {i}"
        out.append((cid, i, ln))
        if cid in (0x4D4D, 0x3D3D, 0x4100, 0xAFFF, 0xA020):
            _walk_3ds(data, i + 6, i + ln, out)
        elif cid == 0x4000:
            name_end = data.index(b"\0", i + 6) + 1
            _walk_3ds(data, name_end, i + ln, out)
        elif cid == 0x4120:
            n = struct.unpack_from("<H", data, i + 6)[0]
            _walk_3ds(data, i + 8 + 8 * n, i + ln, out)
        i += ln


def test_3ds_chunk_structure(full_run):
    _, d = full_run
    data = (d / "Cozinha_Linear_3600.3ds").read_bytes()
    chunks = []
    _walk_3ds(data, 0, len(data), chunks)
    assert chunks[0][0] == 0x4D4D and chunks[0][2] == len(data)
    assert sum(1 for c in chunks if c[0] == 0x4000) > 50
    assert sum(1 for c in chunks if c[0] == 0xAFFF) >= 3


MOOBLENDER = Path(os.environ.get("MOOBLENDER_PATH", ROOT.parent / "mooblender"))


def test_pmob_roundtrip_with_mooblender(full_run):
    if not (MOOBLENDER / "mooblender" / "formats" / "pmob" / "reader.py").exists():
        pytest.skip("defina MOOBLENDER_PATH com um clone de dantedex/mooblender")
    sys.path.insert(0, str(MOOBLENDER))
    from mooblender.formats.pmob.reader import read_pmob
    _, d = full_run
    doc = read_pmob((d / "Cozinha_Linear_3600.pmob").read_bytes())
    assert doc.name == "Cozinha_Linear_3600"
    assert not doc.unknown_record_types
    assert len(doc.layers) == 8  # ambiente + 7 módulos
    assert doc.primitive.children[1].layer_ref == "M01_tall_cabinet"
    xs = [v[0] for layer in doc.layers for mesh in layer.meshes for v in mesh.vertices]
    assert min(xs) == pytest.approx(0) and max(xs) == pytest.approx(3600)


def test_sketchup_script_with_stub(full_run):
    if not shutil.which("ruby"):
        pytest.skip("ruby não instalado")
    _, d = full_run
    rb = d / "Cozinha_Linear_3600_sketchup.rb"
    res = subprocess.run(["ruby", str(ROOT / "tests" / "sketchup_stub.rb"), str(rb)],
                         capture_output=True, text=True, check=True)
    rep = json.loads(res.stdout.strip().splitlines()[-1])
    assert set(rep["tags"]) == {"Paredes", "Piso", "Itens de Decoracao"}
    top = rep["top_level"]
    assert [e["layer"] for e in top if e["class"] == "Group"] == ["Paredes", "Piso"]
    assert sum(1 for e in top if e["class"] == "Instance" and e["layer"] == "Itens de Decoracao") == 7
    assert rep["stats"]["pushpull"] == 1  # uma janela perfurada
    assert rep["saved"][1] == 16 and rep["saved"][0].endswith("Cozinha_Linear_3600.skp")
