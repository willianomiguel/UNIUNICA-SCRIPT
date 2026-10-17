"""Orquestra: especificação -> IR -> arquivos de saída + manifesto + log."""
from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path

from . import __version__
from .adapters.dae import write_dae
from .adapters.dxf import write_dxf
from .adapters.obj import write_obj
from .adapters.pmob import write_pmob
from .adapters.reports import write_cutlist, write_elevation_svg, write_ir
from .adapters.sketchup_rb import write_sketchup_script
from .adapters.tds import write_3ds
from .mesh import axis_transform, face_count, module_meshes, project_meshes, safe_name
from .model import build_project
from .spec import ProjectSpec

log = logging.getLogger("promob_gen")

PROMOB_FACE_LIMIT = 25000  # limite recomendado pela Promob para "Importar Arquivo 3D"
ALL_FORMATS = ("obj", "3ds", "dxf", "dae", "skp-script", "pmob")

INSTRUCTIONS = """\
COMO LEVAR ESTE PROJETO PARA O PROMOB  ({name})
=========================================================

Caminho 1 — Projeto com paredes (Novo Promob >= 5.60.39.0) [recomendado p/ ambiente]
  1. Abra o SketchUp (2017+). Janela > Console Ruby, digite:
       load "{skp_script_abs}"
     (se esta pasta foi copiada para outro lugar, use o caminho atual dela,
      sempre com barras normais "/")
     -> será criado {skp_name} nesta pasta (versão SketchUp 2016).
  2. No Promob: Arquivo > Importar Projeto > Caminho > filtro "Arquivos do SketchUp (*.skp)"
     > selecione {skp_name} > Avançar > escolha/cadastre o cliente.
  3. Na tela de relacionamento de camadas:
       Paredes            <- etiqueta "Paredes"
       Piso               <- etiqueta "Piso"
       Itens de Decoração <- etiqueta "Itens de Decoracao"
  4. Aguarde a notificação de conversão concluída e clique nela para abrir o projeto.
  Resultado esperado: paredes nativas do Promob + módulos como ITENS DE DECORAÇÃO
  (geometria; NÃO são módulos de biblioteca de fabricante, sem orçamento por item).

Caminho 2 — Geometria 3D no projeto aberto (qualquer Promob com "Importar Arquivo 3D")
  Botão "Importar - Arquivo 3D" na barra superior > escolha um arquivo:
     {name_safe}_moveis.obj  (todos os módulos, sem parede/piso, origem 0,0,0)
     modulos/*.obj           (um módulo por arquivo, origem no canto esq./traseiro/inferior)
     {name_safe}.3ds / .dxf  (alternativas; 3DS lê só materiais, DXF não lê polilinhas)
  Escolha "Vincular" (cópia salva no projeto). Posicione cada módulo pela coordenada X
  indicada em manifest.json (campo modules[].position).

Arquivos experimentais (NÃO são importáveis por menu documentado):
  {name_safe}.pmob  — malha no formato binário de conteúdo Promob (engenharia reversa).
"""


def _new_run_dir(out_root: Path, name: str) -> Path:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base = out_root / safe_name(name) / stamp
    d, i = base, 1
    while d.exists():  # nunca sobrescreve uma execução anterior
        d = base.with_name(f"{stamp}_{i}")
        i += 1
    d.mkdir(parents=True)
    return d


def generate(spec: ProjectSpec, out_root: Path, formats=ALL_FORMATS, up: str = "z") -> dict:
    project = build_project(spec)
    for w in project.warnings:
        log.warning(w)
    run_dir = _new_run_dir(Path(out_root), spec.project_name)
    log.info("Saída: %s", run_dir)
    tf = axis_transform(up, 1.0)
    name = safe_name(spec.project_name)
    files: dict[str, list[str]] = {}
    faces: dict[str, int] = {}

    def record(kind, paths, groups=None):
        files.setdefault(kind, []).extend(str(p.relative_to(run_dir)) for p in paths)
        if groups is not None:
            n = face_count(groups)
            for p in paths:
                faces[str(p.relative_to(run_dir))] = n
            if n > PROMOB_FACE_LIMIT:
                log.warning("%s tem %d triângulos (> %d recomendados pela Promob)", paths[0].name, n, PROMOB_FACE_LIMIT)
        for p in paths:
            log.info("gerado %s", p.relative_to(run_dir))

    full = project_meshes(project, tf)
    furniture = project_meshes(project, tf, include_environment=False)
    record("ir", write_ir(project, run_dir / f"{name}_ir.json"))
    record("cutlist", write_cutlist(project, run_dir / f"{name}_lista_corte.csv"))
    record("preview", write_elevation_svg(project, run_dir / f"{name}_vista_frontal.svg"))

    if "obj" in formats:
        record("obj", write_obj(full, run_dir / f"{name}.obj", spec.project_name), full)
        record("obj", write_obj(furniture, run_dir / f"{name}_moveis.obj", spec.project_name), furniture)
    if "3ds" in formats:
        record("3ds", write_3ds(furniture, run_dir / f"{name}.3ds", spec.project_name), furniture)
    if "dxf" in formats:
        record("dxf", write_dxf(full, run_dir / f"{name}.dxf", spec.project_name), full)
    if "dae" in formats:
        record("dae", write_dae(full, run_dir / f"{name}.dae", spec.project_name), full)
    if "pmob" in formats:
        record("pmob_experimental", write_pmob(full, run_dir / f"{name}.pmob", spec.project_name), full)
    if "skp-script" in formats:
        record("skp_script", write_sketchup_script(project, run_dir / f"{name}_sketchup.rb"))

    mod_dir = run_dir / "modulos"
    mod_dir.mkdir()
    for m in project.modules:
        g = module_meshes(m, tf)
        if "obj" in formats:
            record("module_obj", write_obj(g, mod_dir / f"{m.id}.obj", m.label), g)
        if "3ds" in formats:
            record("module_3ds", write_3ds(g, mod_dir / f"{m.id}.3ds", m.label), g)

    manifest = {
        "generator": f"promob_auto_generator {__version__}",
        "project_name": spec.project_name,
        "units": "mm",
        "axes": {"up": up, "x": "ao longo da parede", "y": "profundidade (0 = face da parede)",
                 "z": "altura" if up == "z" else "-profundidade"},
        "room": project.room,
        "modules": [{"id": m.id, "type": m.type, "label": m.label, "position": m.position,
                     "width": m.width, "depth": m.depth, "height": m.height,
                     "parts": len(m.parts)} for m in project.modules],
        "warnings": project.warnings,
        "files": files,
        "triangles_per_file": faces,
        "promob_face_limit": PROMOB_FACE_LIMIT,
    }
    (run_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    skp_script = run_dir / f"{name}_sketchup.rb"
    (run_dir / "IMPORTAR_NO_PROMOB.txt").write_text(INSTRUCTIONS.format(
        name=spec.project_name, name_safe=name, skp_name=f"{name}.skp",
        skp_script_abs=str(skp_script.resolve()).replace("\\", "/")), encoding="utf-8")
    manifest["run_dir"] = str(run_dir)
    return manifest
