"""CLI: python -m promob_gen samples/cozinha_linear.json [--out output] [--formats obj,3ds]"""
from __future__ import annotations

import argparse
import logging
import sys
from datetime import datetime
from pathlib import Path

from .generator import ALL_FORMATS, generate
from .spec import SpecError, load_spec


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="promob_gen", description="Gera arquivos importáveis no Promob a partir de um JSON.")
    ap.add_argument("spec", nargs="+", help="arquivo(s) JSON de especificação")
    ap.add_argument("--out", default="output", help="pasta de saída (padrão: output)")
    ap.add_argument("--logs", default="logs", help="pasta de logs (padrão: logs)")
    ap.add_argument("--formats", default=",".join(ALL_FORMATS),
                    help=f"lista separada por vírgula entre: {','.join(ALL_FORMATS)}")
    ap.add_argument("--up", choices=("z", "y"), default="z",
                    help="eixo vertical nos arquivos de malha (Promob/SketchUp: z)")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args(argv)

    formats = tuple(f.strip() for f in args.formats.split(",") if f.strip())
    bad = [f for f in formats if f not in ALL_FORMATS]
    if bad:
        ap.error(f"formatos desconhecidos: {bad}")

    Path(args.logs).mkdir(parents=True, exist_ok=True)
    log_file = Path(args.logs) / f"promob_gen_{datetime.now():%Y%m%d_%H%M%S}.log"
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(asctime)s %(levelname)-7s %(message)s",
                        handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler(log_file, encoding="utf-8")])
    log = logging.getLogger("promob_gen")

    status = 0
    for path in args.spec:
        log.info("=== %s", path)
        try:
            spec = load_spec(path)
            result = generate(spec, Path(args.out), formats, args.up)
            log.info("OK: %d módulos, %d avisos -> %s", len(result["modules"]), len(result["warnings"]), result["run_dir"])
        except FileNotFoundError:
            log.error("arquivo não encontrado: %s", path)
            status = 2
        except SpecError as e:
            for err in e.errors:
                log.error("validação: %s", err)
            status = 1
        except ValueError as e:
            log.error("erro de layout: %s", e)
            status = 1
    log.info("log salvo em %s", log_file)
    return status


if __name__ == "__main__":
    sys.exit(main())
