"""Baixa os assets CC0 do Poly Haven usados pelo render fotorrealista.

Uso: python tools/baixar_assets.py [pasta_destino]   (padrão: assets_cache/)
Licença dos assets: CC0 (https://polyhaven.com/license). Não são versionados no git.
"""
from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

API = "https://api.polyhaven.com/files/{}"

HDRIS = {"ceu": "greenwich_park_02"}
TEXTURES = {   # nome lógico -> asset Poly Haven
    "piso": "laminate_floor_02",
    "couro_branco": "leather_white",
    "linho": "rough_linen",
    "algodao": "waffle_pique_cotton",
    "boucle": "wool_boucle",
    "carvalho": "white_oak_veneer",
    "reboco": "white_plaster_02",
    "tapete": "poly_wool_herringbone",
}
MAPS = {"diff": ("Diffuse", "jpg"), "nor": ("nor_gl", "jpg"), "rough": ("Rough", "jpg")}
MODELS = {
    "planta": "potted_plant_04",
    "planta_grande": "potted_plant_02",
    "almofadas": "throw_pillows_01",
    "quadro_parede": "hanging_picture_frame_02",
    "porta_retrato": "standing_picture_frame_01",
    "vaso": "ceramic_vase_02",
    "luminaria_mesa": "desk_lamp_arm_01",
    "cadeira": "dining_chair_02",
    "lustre": "modern_ceiling_lamp_01",
}


def _get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "promob_auto_generator/0.1"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def _save(url: str, dst: Path) -> None:
    if dst.exists() and dst.stat().st_size > 0:
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(_get(url))
    print("baixado", dst)


def main(out="assets_cache"):
    out = Path(out)
    for name, asset in HDRIS.items():
        files = json.loads(_get(API.format(asset)))
        _save(files["hdri"]["2k"]["hdr"]["url"], out / "hdri" / f"{name}.hdr")
    for name, asset in TEXTURES.items():
        files = json.loads(_get(API.format(asset)))
        for key, (ph_key, ext) in MAPS.items():
            if ph_key in files:
                _save(files[ph_key]["2k"][ext]["url"], out / "tex" / name / f"{key}.{ext}")
    for name, asset in MODELS.items():
        files = json.loads(_get(API.format(asset)))
        if "gltf" not in files:
            print("sem glTF, ignorado:", asset)
            continue
        g = files["gltf"]["1k"]["gltf"]
        _save(g["url"], out / "models" / name / f"{asset}.gltf")
        for rel, info in g.get("include", {}).items():
            _save(info["url"], out / "models" / name / rel)
    (out / "LICENCA.txt").write_text("Assets de https://polyhaven.com — licença CC0 (domínio público).\n"
                                     + json.dumps({"hdris": HDRIS, "textures": TEXTURES, "models": MODELS}, indent=1),
                                     encoding="utf-8")


if __name__ == "__main__":
    main(*sys.argv[1:])
