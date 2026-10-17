"""Gera um script Ruby para o SketchUp que monta o projeto e salva um .skp.

Caminho oficial documentado pela Promob (Novo Promob >= 5.60.39.0):
  Arquivo > Importar Projeto > *.skp  -> conversão na nuvem, relacionando
  etiquetas (tags) do SketchUp às camadas Paredes / Piso / Teto / Geometrias /
  Itens de Decoração.
Regras seguidas (artigos 31112413549073 e 36814568300689 do suporte Promob):
  - cada parede = um grupo retangular independente, sem aninhamento, faces
    criadas uma a uma (não "puxar" do chão), aberturas por perfuração;
  - piso = um único objeto, sem degraus;
  - itens de decoração = componentes/grupos sem faces soltas;
  - origem no ponto mais à esquerda/traseira/inferior; mm.
O .skp não pode ser escrito em Linux sem o SketchUp C SDK, por isso
geramos o script; ele roda no SketchUp do Windows (Janela > Console Ruby).
"""
from __future__ import annotations

import json
from pathlib import Path

from ..mesh import ROLE_COLORS, safe_name
from ..model import Project

TAG_WALLS, TAG_FLOOR, TAG_ITEMS = "Paredes", "Piso", "Itens de Decoracao"

RUBY_TEMPLATE = r'''# encoding: UTF-8
# Gerado por promob_auto_generator — projeto: __TITLE__
# Uso: no SketchUp (2017 ou superior), Janela > Console Ruby:
#   load "C:/caminho/para/__SCRIPT_NAME__"
# O script cria um modelo novo, monta parede/piso/módulos e salva
#   __SKP_NAME__ (versão SketchUp 2016, exigida pelo "Importar Arquivo 3D" do Promob)
# na mesma pasta deste script, sem sobrescrever arquivos existentes.
require 'json'

module PromobGen
  DATA = JSON.parse(<<'__JSON__')
__DATA__
__JSON__

  def self.mm(v) v.to_f.mm end
  def self.pt(x, y, z) Geom::Point3d.new(mm(x), mm(y), mm(z)) end

  # Caixa com 6 faces criadas explicitamente, normais para fora.
  def self.box(ents, o, s)
    x0, y0, z0 = o; x1, y1, z1 = x0 + s[0], y0 + s[1], z0 + s[2]
    quads = [
      [[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[x1,y0,z0], [0,0,-1]],
      [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1], [0,0,1]],
      [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1], [0,-1,0]],
      [[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1], [1,0,0]],
      [[x1,y1,z0],[x0,y1,z0],[x0,y1,z1],[x1,y1,z1], [0,1,0]],
      [[x0,y1,z0],[x0,y0,z0],[x0,y0,z1],[x0,y1,z1], [-1,0,0]],
    ]
    quads.each do |q|
      f = ents.add_face(q[0..3].map { |p| pt(*p) })
      f.reverse! if f.normal.dot(Geom::Vector3d.new(*q[4])) < 0
    end
  end

  def self.material(model, name, rgb)
    m = model.materials[name] || model.materials.add(name)
    m.color = Sketchup::Color.new(*rgb.map { |c| (c * 255).round })
    m
  end

  def self.run
    model = Sketchup.active_model
    model = (Sketchup.file_new; Sketchup.active_model) unless model.entities.length == 0
    model.start_operation('PromobGen', true)
    tags = {}
    [DATA['tags']['walls'], DATA['tags']['floor'], DATA['tags']['items']].each do |t|
      tags[t] = model.layers[t] || model.layers.add(t)
    end
    ents = model.active_entities

    # Paredes: um grupo retangular por parede; aberturas por perfuração (push/pull).
    DATA['walls'].each do |w|
      g = ents.add_group
      g.name = w['name']; g.layer = tags[DATA['tags']['walls']]
      box(g.entities, w['origin'], w['size'])
      w['openings'].each do |op|
        y = w['origin'][1] + w['size'][1]   # face voltada para o ambiente
        rect = [[op['x'], y, op['sill']], [op['x'] + op['width'], y, op['sill']],
                [op['x'] + op['width'], y, op['sill'] + op['height']], [op['x'], y, op['sill'] + op['height']]]
        f = g.entities.add_face(rect.map { |p| pt(*p) })
        next unless f
        f.reverse! if f.normal.y < 0
        f.pushpull(-mm(w['size'][1]))
      end
      g.material = material(model, 'Parede', DATA['colors']['wall'])
    end

    # Piso: um único objeto.
    fl = DATA['floor']
    g = ents.add_group
    g.name = 'Piso'; g.layer = tags[DATA['tags']['floor']]
    box(g.entities, fl['origin'], fl['size'])
    g.material = material(model, 'Piso', DATA['colors']['floor'])

    # Módulos: um componente por módulo (peças como grupos internos).
    DATA['modules'].each do |m|
      defn = model.definitions.add(m['name'])
      m['parts'].each do |p|
        pg = defn.entities.add_group
        pg.name = p['name']
        box(pg.entities, p['origin'], p['size'])
        pg.material = material(model, p['material'], p['color'])
      end
      tr = Geom::Transformation.translation(pt(*m['position']))
      inst = ents.add_instance(defn, tr)
      inst.name = m['name']
      inst.layer = tags[DATA['tags']['items']]
      m['attributes'].each { |k, v| inst.set_attribute('promob_gen', k, v) }
    end
    model.commit_operation

    model.layers.purge_unused if model.layers.respond_to?(:purge_unused)
    model.materials.purge_unused
    dir = File.dirname(__FILE__)
    base = File.join(dir, DATA['skp_name'])
    path = base; i = 1
    while File.exist?(path)
      path = base.sub(/\.skp\z/i, "_#{i}.skp"); i += 1
    end
    ok = begin
      model.save(path, Sketchup::Model::VERSION_2016)
    rescue StandardError => e
      puts "Aviso: não foi possível salvar como versão 2016 (#{e.message}); salvando na versão atual."
      model.save(path)
    end
    puts(ok ? "PromobGen: salvo em #{path}" : "PromobGen: FALHA ao salvar #{path}")
    path
  end
end

PromobGen.run
'''


def build_payload(project: Project, skp_name: str) -> dict:
    room = project.room
    walls = []
    T = room["wall_thickness"]
    walls.append({
        "name": "Parede 1",
        "origin": [0, -T, 0], "size": [room["wall_length"], T, room["ceiling_height"]],
        "openings": [{"x": o["x"], "width": o["width"], "height": o["height"], "sill": o["sill"], "type": o["type"]}
                     for o in room.get("openings", [])],
    })
    floor = next(p for p in project.environment if p.role == "floor")
    modules = []
    for m in project.modules:
        parts = [{"name": p.name, "origin": list(p.origin), "size": list(p.size), "material": p.material,
                  "color": list(ROLE_COLORS.get(p.role, (0.8, 0.8, 0.8)))} for p in m.parts]
        modules.append({
            "name": f"{m.id} {m.width:g}x{m.height:g}x{m.depth:g}",
            "position": list(m.position), "parts": parts,
            "attributes": {"type": m.type, "label": m.label, "width": m.width,
                           "depth": m.depth, "height": m.height},
        })
    return {
        "skp_name": skp_name,
        "tags": {"walls": TAG_WALLS, "floor": TAG_FLOOR, "items": TAG_ITEMS},
        "colors": {"wall": ROLE_COLORS["wall"], "floor": ROLE_COLORS["floor"]},
        "walls": walls,
        "floor": {"origin": list(floor.origin), "size": list(floor.size)},
        "modules": modules,
    }


def write_sketchup_script(project: Project, path: Path) -> list[Path]:
    path = Path(path)
    skp_name = safe_name(project.name) + ".skp"
    data = json.dumps(build_payload(project, skp_name), ensure_ascii=False, indent=1)
    rb = (RUBY_TEMPLATE.replace("__DATA__", data).replace("__TITLE__", project.name)
          .replace("__SCRIPT_NAME__", path.name).replace("__SKP_NAME__", skp_name))
    path.write_text(rb, encoding="utf-8")
    return [path]
