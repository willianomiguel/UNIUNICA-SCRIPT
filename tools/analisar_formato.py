"""Analisa a estrutura de um arquivo (ex.: .promob exportado, .pcontent, .pmob)
SEM modificá-lo: o arquivo é copiado para uma pasta de trabalho antes da análise.

Uso:
  python tools/analisar_formato.py C:\\caminho\\Projeto.promob [--out logs/formatos]

Relata: assinatura (magic), se é ZIP/XML/JSON/texto/UTF-16/binário, entropia,
lista de membros de ZIP (recursivo), raízes XML, chaves JSON, strings legíveis,
e tenta interpretar o arquivo como árvore de registros PMob.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import math
import re
import shutil
import struct
import xml.etree.ElementTree as ET
import zipfile
from collections import Counter
from datetime import datetime
from pathlib import Path

MAGICS = {
    b"PK\x03\x04": "zip", b"\x1f\x8b": "gzip", b"<?xml": "xml", b"\xef\xbb\xbf<": "xml-bom",
    b"\xff\xfe": "utf16-le-bom", b"\xd0\xcf\x11\xe0": "ole2-compound", b"SQLite format 3": "sqlite",
    b"{": "json?", b"7z\xbc\xaf": "7z", b"\xff\xfeS\x00k\x00e\x00t\x00c\x00h\x00U\x00p\x00": "skp",
}


def entropy(b: bytes) -> float:
    if not b:
        return 0.0
    c = Counter(b)
    return -sum(n / len(b) * math.log2(n / len(b)) for n in c.values())


def strings(b: bytes, n=6, limit=40):
    ascii_s = [m.group().decode() for m in re.finditer(rb"[\x20-\x7e]{%d,}" % n, b)][:limit]
    u16 = [m.group().decode("utf-16-le") for m in re.finditer(rb"(?:[\x20-\x7e]\x00){%d,}" % n, b)][:limit]
    return ascii_s, u16


def try_pmob(b: bytes, max_records=20000):
    """Valida a hipótese 'árvore de registros PMob' sem confiar no conteúdo."""
    seen = 0

    def rec(off, depth):
        nonlocal seen
        seen += 1
        if seen > max_records or depth > 64 or off < 0 or off + 8 > len(b):
            raise ValueError("fora dos limites")
        size, count = struct.unpack_from("<ii", b, off)
        if size < 0 or count < 0 or off + 8 + 8 * count + size > len(b):
            raise ValueError("cabeçalho inconsistente")
        types = []
        for i in range(count):
            t, o = struct.unpack_from("<ii", b, off + 8 + 8 * i)
            types.append(t)
            rec(o, depth + 1)
        return types

    try:
        top = rec(0, 0)
        return {"pmob_like": True, "records": seen, "top_level_types": [hex(t) for t in top]}
    except (ValueError, struct.error) as e:
        return {"pmob_like": False, "reason": str(e)}


def analyze_bytes(name: str, b: bytes, depth=0) -> dict:
    info = {"name": name, "size": len(b), "sha256": hashlib.sha256(b).hexdigest(),
            "head_hex": b[:32].hex(" "), "entropy_bits_per_byte": round(entropy(b[:1 << 20]), 3)}
    kind = next((k for m, k in MAGICS.items() if b.startswith(m)), "unknown")
    info["magic"] = kind
    if kind == "zip" and depth < 3:
        with zipfile.ZipFile(io.BytesIO(b)) as z:
            members = []
            for zi in z.infolist()[:500]:
                entry = {"member": zi.filename, "size": zi.file_size, "compressed": zi.compress_size}
                if zi.file_size < 64 << 20 and not zi.is_dir():
                    entry["analysis"] = analyze_bytes(zi.filename, z.read(zi), depth + 1)
                members.append(entry)
            info["zip_members"] = members
        return info
    text = None
    for enc in ("utf-8-sig", "utf-16"):
        try:
            text = b.decode(enc)
            if enc == "utf-16" and not b.startswith(b"\xff\xfe"):
                text = None
                continue
            info["text_encoding"] = enc
            break
        except UnicodeDecodeError:
            pass
    if text is not None:
        s = text.lstrip()
        if s.startswith("<"):
            try:
                root = ET.fromstring(s.encode("utf-8"))
                info["xml_root"] = root.tag
                info["xml_root_attrib"] = dict(list(root.attrib.items())[:30])
                info["xml_children_tags"] = Counter(c.tag for c in root).most_common(30)
                info["xml_all_tags"] = Counter(e.tag for e in root.iter()).most_common(60)
            except ET.ParseError as e:
                info["xml_error"] = str(e)
        elif s.startswith(("{", "[")):
            try:
                obj = json.loads(s)
                info["json_top_keys"] = list(obj)[:60] if isinstance(obj, dict) else f"list[{len(obj)}]"
            except json.JSONDecodeError as e:
                info["json_error"] = str(e)
        info["text_preview"] = s[:400]
    else:
        a, u = strings(b)
        info["ascii_strings"], info["utf16_strings"] = a, u
        info["pmob_probe"] = try_pmob(b)
        # .NET BinaryWriter: comprimento 7-bit + JSON
        if b[:1] and b[1:2] == b"{":
            info["dotnet_length_prefixed_json"] = True
    return info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--out", default="logs/formatos")
    a = ap.parse_args()
    src = Path(a.file)
    work = Path(a.out) / f"{datetime.now():%Y%m%d_%H%M%S}_{src.name.replace('.', '_')}"
    work.mkdir(parents=True, exist_ok=True)
    copy = work / src.name
    shutil.copy2(src, copy)  # análise SEMPRE sobre a cópia
    report = analyze_bytes(src.name, copy.read_bytes())
    out = work / "analise.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"magic={report['magic']} tamanho={report['size']} entropia={report['entropy_bits_per_byte']}")
    print(f"relatório: {out}")


if __name__ == "__main__":
    main()
