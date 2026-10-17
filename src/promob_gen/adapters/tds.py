"""Autodesk 3DS binário (formato de chunks). Um objeto por peça.

Limites do formato: nomes de objeto com até 10 caracteres, materiais até 16,
65535 vértices por objeto. Unidade gravada: mm (MASTER_SCALE = 1).
"""
from __future__ import annotations

import struct
from pathlib import Path

from ..mesh import safe_name


def _chunk(cid: int, payload: bytes = b"", children: list[bytes] = ()) -> bytes:
    body = payload + b"".join(children)
    return struct.pack("<HI", cid, 6 + len(body)) + body


def _cstr(s: str, maxlen: int) -> bytes:
    return s.encode("ascii", "ignore")[:maxlen] + b"\x00"


def write_3ds(groups, path: Path, title: str) -> list[Path]:
    mats: dict[str, tuple] = {}
    objects: list[bytes] = []
    n = 0
    for gname, meshes in groups:
        for m in meshes:
            n += 1
            mat = safe_name(m.material, 16) or "default"
            mats.setdefault(mat, m.color)
            # nome curto: 'O' + contador, mapeamento completo vai no relatório
            name = f"P{n:05d}"
            verts = struct.pack("<H", len(m.vertices)) + b"".join(struct.pack("<3f", *v) for v in m.vertices)
            face_mat = _chunk(0x4130, _cstr(mat, 16) + struct.pack("<H", len(m.triangles))
                              + b"".join(struct.pack("<H", i) for i in range(len(m.triangles))))
            faces = _chunk(0x4120, struct.pack("<H", len(m.triangles))
                           + b"".join(struct.pack("<4H", a, b, c, 0x7) for a, b, c in m.triangles), [face_mat])
            local = _chunk(0x4160, struct.pack("<12f", 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0))
            trimesh = _chunk(0x4100, b"", [_chunk(0x4110, verts), local, faces])
            objects.append(_chunk(0x4000, _cstr(name, 10), [trimesh]))
    mat_chunks = []
    for name, (r, g, b) in mats.items():
        col = _chunk(0x0011, bytes([int(r * 255), int(g * 255), int(b * 255)]))
        mat_chunks.append(_chunk(0xAFFF, b"", [_chunk(0xA000, _cstr(name, 16)), _chunk(0xA020, b"", [col])]))
    edit = _chunk(0x3D3D, b"", [_chunk(0x3D3E, struct.pack("<I", 3)), _chunk(0x0100, struct.pack("<f", 1.0))]
                  + mat_chunks + objects)
    data = _chunk(0x4D4D, b"", [_chunk(0x0002, struct.pack("<I", 3)), edit])
    Path(path).write_bytes(data)
    return [Path(path)]
