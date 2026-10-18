"""Gera uma cópia de um .promob sem dados pessoais nem de licença, para compartilhar.

O que muda (o resto do arquivo fica byte a byte igual):
  promob.info                 SERIALNUMBER e PRODUCTCODE do histórico de gravações ficam vazios
  solucao/*/*.dataclient      todos os campos do cliente ficam vazios (nome vira "Cliente Teste")
  renders (IDCODON=imagem)    as imagens do projeto de origem são trocadas pelas --imagens dadas
                              (ou por uma imagem neutra); sugestao.jpg idem
  imagens da prancha          logotipos da prancha (document1/*.jpg|png) viram imagem neutra

Nunca sobrescreve: a saída precisa ser um arquivo novo.

Uso:
  python tools/promob_limpar.py ENTRADA.promob SAIDA.promob [--imagens=a.png,b.png]
"""
from __future__ import annotations

import io
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

from PIL import Image

CLIENTE = "Cliente Teste"


def _blank(data: bytes) -> bytes:
    """Imagem branca com o mesmo tamanho e formato real (há .jpg que na verdade é PNG)."""
    im = Image.open(io.BytesIO(data))
    mode = "RGBA" if im.mode == "RGBA" and im.format != "JPEG" else "RGB"
    out = io.BytesIO()
    Image.new(mode, im.size, (255, 255, 255)).save(out, im.format)
    return out.getvalue()


def _replace_image(data: bytes, fmt: str, src: Path | None) -> bytes:
    if src is None:
        return _blank(data)
    size = Image.open(io.BytesIO(data)).size
    im = Image.open(src).convert("RGB")
    im = im.resize((size[0], round(im.height * size[0] / im.width)))
    canvas = Image.new("RGB", size, (245, 243, 240))
    canvas.paste(im, (0, (size[1] - im.height) // 2))
    out = io.BytesIO()
    canvas.save(out, fmt, quality=90)
    return out.getvalue()


def _clear_attrs(text: str, names) -> str:
    for n in names:
        text = re.sub(rf'{n}="[^"]*"', f'{n}=""', text)
    return text


def _clear_client(text: str) -> str:
    def field(m):
        value = CLIENTE if m.group(1) == "nomecliente" else ""
        return f'{m.group(0)[:m.start(2) - m.start(0)]}{value}"'
    return re.sub(r'<FIELD NAME="([^"]*)"[^>]*?VALUE="([^"]*)"', field, text)


def clean(src: Path, dst: Path, images: list[Path] | None = None) -> list[str]:
    src, dst = Path(src), Path(dst)
    if dst.resolve() == src.resolve() or dst.exists():
        raise FileExistsError(f"recusa sobrescrever {dst}")
    images = images or []
    log = []
    with zipfile.ZipFile(src) as z:
        infos = z.infolist()
        members = {i.filename: z.read(i) for i in infos}

    render_folders = set()
    for name, data in members.items():
        if name.endswith(".container"):
            root = ET.fromstring(data.decode("utf-8-sig"))
            base = name.rsplit("/", 1)[0]
            render_folders |= {f"{base}/{d.get('FOLDER')}/" for d in root.iter("DOCUMENT")
                               if d.get("IDCODON") == "imagem"}
    k = 0
    for name in list(members):
        data = members[name]
        if name == "promob.info":
            members[name] = _clear_attrs(data.decode("utf-8"), ("SERIALNUMBER", "PRODUCTCODE")).encode("utf-8")
            log.append("promob.info: nº de série e código de produto removidos")
        elif name.endswith(".dataclient"):
            bom = data.startswith(b"\xef\xbb\xbf")
            text = _clear_client(data.decode("utf-8-sig"))
            members[name] = (b"\xef\xbb\xbf" if bom else b"") + text.encode("utf-8")
            log.append(f"{name}: dados do cliente apagados")
        elif name == "sugestao.jpg" or (any(name.startswith(f) for f in render_folders) and name.endswith(".jpg")):
            img = images[k % len(images)] if images else None
            k += 1
            members[name] = _replace_image(data, "JPEG", img)
            log.append(f"{name}: imagem do projeto de origem substituída")
        elif re.match(r"solucao/container\d+/document1/.+\.(jpg|png)$", name):
            members[name] = _blank(data)
            log.append(f"{name}: imagem da prancha neutralizada")

    dst.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
        for info in infos:
            zi = zipfile.ZipInfo(info.filename, date_time=info.date_time)
            zi.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(zi, members[info.filename])
    return log


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    imgs = [Path(p) for p in opts.get("imagens", "").split(",") if p]
    for line in clean(Path(args[0]), Path(args[1]), imgs):
        print(line)
