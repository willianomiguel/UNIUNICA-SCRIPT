"""Writer EXPERIMENTAL de .pmob (formato de malha binário usado no conteúdo Promob).

Implementação própria a partir da descrição pública do formato documentada pelo
projeto mooblender (docs/formats/pmob.md, engenharia reversa, somente leitura):
árvore de registros little-endian
  [int32 payload_size][int32 child_count][child_count × (int32 type_id, int32 offset_absoluto)][payload]
strings UTF-16LE, floats 32 bits, matriz 4x4 row-major, mm, Z para cima.

ATENÇÃO: o Promob NÃO documenta importação direta de .pmob. Este arquivo é
validado apenas estruturalmente (round-trip com o leitor do mooblender nos
testes). Os valores de VERSION e MESH_SOURCE_TYPE não são conhecidos e
usamos suposições marcadas abaixo.
"""
from __future__ import annotations

import struct
from pathlib import Path

# IDs de registros (iguais aos observados e publicados pelo mooblender)
MESH, MESH_LIST, VERTICES, INDICES, NORMALS = 0x00, 0x01, 0x02, 0x03, 0x04
COLOR, NAME, LAYER, LAYER_LIST, VERSION = 0x08, 0x09, 0x0B, 0x0C, 0x0D
PRIMITIVE, PRIMITIVE_TYPE, LAYER_REF, PRIMITIVES_LIST, MATRIX = 0x0E, 0x12, 0x13, 0x14, 0x15
MATERIAL, MATERIAL_LIST, MATERIAL_ID, OPACITY = 0x1A, 0x1B, 0x1C, 0x21

ASSUMED_VERSION = 1   # SUPOSIÇÃO: versão 0 é "legada" segundo o mooblender; valor real desconhecido
IDENTITY = (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)


class Rec:
    __slots__ = ("type_id", "payload", "children")

    def __init__(self, type_id: int, payload: bytes = b"", children=None):
        self.type_id, self.payload, self.children = type_id, payload, children or []


def _s(text: str) -> bytes:
    return text.encode("utf-16-le")


def _serialize(rec: Rec, base: int) -> bytes:
    header_len = 8 + 8 * len(rec.children)
    body = bytearray()
    entries = []
    cursor = base + header_len + len(rec.payload)
    for child in rec.children:
        blob = _serialize(child, cursor)
        entries.append(struct.pack("<ii", child.type_id, cursor))
        body += blob
        cursor += len(blob)
    return struct.pack("<ii", len(rec.payload), len(rec.children)) + b"".join(entries) + rec.payload + bytes(body)


def _flat_mesh(mesh, material_index: int) -> Rec:
    """Uma malha com vértices duplicados por face (normais planas por face)."""
    verts, normals, idx = [], [], []
    for q in mesh.quads:
        p = [mesh.vertices[i] for i in q]
        ux, uy, uz = (p[1][k] - p[0][k] for k in range(3))
        vx, vy, vz = (p[2][k] - p[0][k] for k in range(3))
        n = (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
        ln = sum(c * c for c in n) ** 0.5 or 1.0
        n = tuple(c / ln for c in n)
        b = len(verts)
        verts += p
        normals += [n] * 4
        idx += [b, b + 1, b + 2, b, b + 2, b + 3]
    return Rec(MESH, children=[
        Rec(VERTICES, b"".join(struct.pack("<3f", *v) for v in verts)),
        Rec(NORMALS, b"".join(struct.pack("<3f", *v) for v in normals)),
        Rec(INDICES, struct.pack(f"<{len(idx)}i", *idx)),
        Rec(MATERIAL_ID, struct.pack("<i", material_index)),
    ])


def build_pmob(groups, title: str) -> bytes:
    materials: dict[str, int] = {}
    mat_recs, layer_recs, prim_recs = [], [], []
    for gname, meshes in groups:
        mesh_recs = []
        for m in meshes:
            if m.material not in materials:
                materials[m.material] = len(materials)
                r, g, b = (int(c * 255) for c in m.color)
                mat_recs.append(Rec(MATERIAL, children=[
                    Rec(NAME, _s(m.material)), Rec(COLOR, bytes([r, g, b, 255])),
                    Rec(OPACITY, struct.pack("<f", 1.0))]))
            mesh_recs.append(_flat_mesh(m, materials[m.material]))
        layer_recs.append(Rec(LAYER, children=[Rec(NAME, _s(gname)), Rec(MESH_LIST, children=mesh_recs)]))
        prim_recs.append(Rec(PRIMITIVE, children=[
            Rec(NAME, _s(gname)), Rec(PRIMITIVE_TYPE, struct.pack("<i", 0)),  # 0 = LAYER
            Rec(LAYER_REF, _s(gname)), Rec(MATRIX, struct.pack("<16f", *IDENTITY))]))
    root_prim = Rec(PRIMITIVE, children=[
        Rec(NAME, _s("root")), Rec(PRIMITIVE_TYPE, struct.pack("<i", 1)),  # 1 = GROUP
        Rec(MATRIX, struct.pack("<16f", *IDENTITY)), Rec(PRIMITIVES_LIST, children=prim_recs)])
    root = Rec(0x0A, children=[
        Rec(NAME, _s(title)), Rec(VERSION, struct.pack("<i", ASSUMED_VERSION)),
        Rec(MATERIAL_LIST, children=mat_recs), Rec(LAYER_LIST, children=layer_recs), root_prim])
    return _serialize(root, 0)


def write_pmob(groups, path: Path, title: str) -> list[Path]:
    Path(path).write_bytes(build_pmob(groups, title))
    return [Path(path)]
