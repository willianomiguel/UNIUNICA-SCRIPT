# encoding: UTF-8
# Gerado por promob_auto_generator — projeto: POC_Cozinha_01
# Uso: no SketchUp (2017 ou superior), Janela > Console Ruby:
#   load "C:/caminho/para/POC_Cozinha_01_sketchup.rb"
# O script cria um modelo novo, monta parede/piso/módulos e salva
#   POC_Cozinha_01.skp (versão SketchUp 2016, exigida pelo "Importar Arquivo 3D" do Promob)
# na mesma pasta deste script, sem sobrescrever arquivos existentes.
require 'json'

module PromobGen
  DATA = JSON.parse(<<'__JSON__')
{
 "skp_name": "POC_Cozinha_01.skp",
 "tags": {
  "walls": "Paredes",
  "floor": "Piso",
  "items": "Itens de Decoracao"
 },
 "colors": {
  "wall": [
   0.82,
   0.8,
   0.76
  ],
  "floor": [
   0.62,
   0.58,
   0.52
  ]
 },
 "walls": [
  {
   "name": "Parede A",
   "origin": [
    0.0,
    0.0,
    0.0
   ],
   "size": [
    3200.0,
    150.0,
    2700.0
   ],
   "thickness": 150.0,
   "openings": []
  }
 ],
 "floor": {
  "origin": [
   0.0,
   -1500.0,
   -20.0
  ],
  "size": [
   3200.0,
   1650.0,
   20.0
  ]
 },
 "modules": [
  {
   "name": "M01_base_cabinet 600x720x560",
   "position": [
    0.0,
    -598.0,
    0.0
   ],
   "parts": [
    {
     "name": "Lateral Esquerda",
     "origin": [
      0.0,
      38.0,
      100.0
     ],
     "size": [
      15.0,
      560.0,
      720.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      585.0,
      38.0,
      100.0
     ],
     "size": [
      15.0,
      560.0,
      720.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Base",
     "origin": [
      15.0,
      38.0,
      100.0
     ],
     "size": [
      570.0,
      554.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Fundo",
     "origin": [
      15.0,
      592.0,
      115.0
     ],
     "size": [
      570.0,
      6.0,
      690.0
     ],
     "material": "HDF Branco 6mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    },
    {
     "name": "Travessa Traseira",
     "origin": [
      15.0,
      512.0,
      805.0
     ],
     "size": [
      570.0,
      80.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Travessa Frontal",
     "origin": [
      15.0,
      38.0,
      805.0
     ],
     "size": [
      570.0,
      80.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Prateleira 1",
     "origin": [
      16.0,
      58.0,
      452.5
     ],
     "size": [
      568.0,
      534.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.9,
      0.9,
      0.88
     ]
    },
    {
     "name": "Porta 1",
     "origin": [
      3.0,
      20.0,
      103.0
     ],
     "size": [
      295.5,
      18.0,
      714.0
     ],
     "material": "MDF Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 1",
     "origin": [
      258.5,
      0.0,
      617.0
     ],
     "size": [
      20.0,
      20.0,
      160.0
     ],
     "material": "Puxador Inox",
     "color": [
      0.72,
      0.73,
      0.75
     ]
    },
    {
     "name": "Porta 2",
     "origin": [
      301.5,
      20.0,
      103.0
     ],
     "size": [
      295.5,
      18.0,
      714.0
     ],
     "material": "MDF Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 2",
     "origin": [
      321.5,
      0.0,
      617.0
     ],
     "size": [
      20.0,
      20.0,
      160.0
     ],
     "material": "Puxador Inox",
     "color": [
      0.72,
      0.73,
      0.75
     ]
    },
    {
     "name": "Rodapé",
     "origin": [
      0.0,
      83.0,
      0.0
     ],
     "size": [
      600.0,
      15.0,
      100.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.3,
      0.3,
      0.3
     ]
    },
    {
     "name": "Tampo",
     "origin": [
      0.0,
      0.0,
      820.0
     ],
     "size": [
      1200.0,
      598.0,
      30.0
     ],
     "material": "Granito Preto 30mm",
     "color": [
      0.12,
      0.12,
      0.13
     ]
    }
   ],
   "attributes": {
    "type": "base_cabinet",
    "label": "base_cabinet 600x720x560",
    "wall": "A",
    "width": 600.0,
    "depth": 560.0,
    "height": 720.0
   }
  },
  {
   "name": "M02_drawer_cabinet 600x720x560",
   "position": [
    600.0,
    -598.0,
    0.0
   ],
   "parts": [
    {
     "name": "Lateral Esquerda",
     "origin": [
      0.0,
      38.0,
      100.0
     ],
     "size": [
      15.0,
      560.0,
      720.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      585.0,
      38.0,
      100.0
     ],
     "size": [
      15.0,
      560.0,
      720.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Base",
     "origin": [
      15.0,
      38.0,
      100.0
     ],
     "size": [
      570.0,
      554.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Fundo",
     "origin": [
      15.0,
      592.0,
      115.0
     ],
     "size": [
      570.0,
      6.0,
      690.0
     ],
     "material": "HDF Branco 6mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    },
    {
     "name": "Travessa Traseira",
     "origin": [
      15.0,
      512.0,
      805.0
     ],
     "size": [
      570.0,
      80.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Travessa Frontal",
     "origin": [
      15.0,
      38.0,
      805.0
     ],
     "size": [
      570.0,
      80.0,
      15.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Frente Gaveta 1",
     "origin": [
      3.0,
      20.0,
      103.0
     ],
     "size": [
      594.0,
      18.0,
      236.0
     ],
     "material": "MDF Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 1",
     "origin": [
      220.0,
      0.0,
      289.0
     ],
     "size": [
      160.0,
      20.0,
      20.0
     ],
     "material": "Puxador Inox",
     "color": [
      0.72,
      0.73,
      0.75
     ]
    },
    {
     "name": "Gaveta 1 Lateral E",
     "origin": [
      28.0,
      38.0,
      128.0
     ],
     "size": [
      12.0,
      524.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Lateral D",
     "origin": [
      560.0,
      38.0,
      128.0
     ],
     "size": [
      12.0,
      524.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Traseira",
     "origin": [
      40.0,
      550.0,
      128.0
     ],
     "size": [
      520.0,
      12.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Contrafrente",
     "origin": [
      40.0,
      38.0,
      128.0
     ],
     "size": [
      520.0,
      12.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Fundo",
     "origin": [
      40.0,
      50.0,
      128.0
     ],
     "size": [
      520.0,
      500.0,
      6.0
     ],
     "material": "HDF Branco 6mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Frente Gaveta 2",
     "origin": [
      3.0,
      20.0,
      342.0
     ],
     "size": [
      594.0,
      18.0,
      236.0
     ],
     "material": "MDF Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 2",
     "origin": [
      220.0,
      0.0,
      528.0
     ],
     "size": [
      160.0,
      20.0,
      20.0
     ],
     "material": "Puxador Inox",
     "color": [
      0.72,
      0.73,
      0.75
     ]
    },
    {
     "name": "Gaveta 2 Lateral E",
     "origin": [
      28.0,
      38.0,
      367.0
     ],
     "size": [
      12.0,
      524.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Lateral D",
     "origin": [
      560.0,
      38.0,
      367.0
     ],
     "size": [
      12.0,
      524.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Traseira",
     "origin": [
      40.0,
      550.0,
      367.0
     ],
     "size": [
      520.0,
      12.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Contrafrente",
     "origin": [
      40.0,
      38.0,
      367.0
     ],
     "size": [
      520.0,
      12.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Fundo",
     "origin": [
      40.0,
      50.0,
      367.0
     ],
     "size": [
      520.0,
      500.0,
      6.0
     ],
     "material": "HDF Branco 6mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Frente Gaveta 3",
     "origin": [
      3.0,
      20.0,
      581.0
     ],
     "size": [
      594.0,
      18.0,
      236.0
     ],
     "material": "MDF Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 3",
     "origin": [
      220.0,
      0.0,
      767.0
     ],
     "size": [
      160.0,
      20.0,
      20.0
     ],
     "material": "Puxador Inox",
     "color": [
      0.72,
      0.73,
      0.75
     ]
    },
    {
     "name": "Gaveta 3 Lateral E",
     "origin": [
      28.0,
      38.0,
      606.0
     ],
     "size": [
      12.0,
      524.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Lateral D",
     "origin": [
      560.0,
      38.0,
      606.0
     ],
     "size": [
      12.0,
      524.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Traseira",
     "origin": [
      40.0,
      550.0,
      606.0
     ],
     "size": [
      520.0,
      12.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Contrafrente",
     "origin": [
      40.0,
      38.0,
      606.0
     ],
     "size": [
      520.0,
      12.0,
      176.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Fundo",
     "origin": [
      40.0,
      50.0,
      606.0
     ],
     "size": [
      520.0,
      500.0,
      6.0
     ],
     "material": "HDF Branco 6mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Rodapé",
     "origin": [
      0.0,
      83.0,
      0.0
     ],
     "size": [
      600.0,
      15.0,
      100.0
     ],
     "material": "MDF Branco TX 15mm",
     "color": [
      0.3,
      0.3,
      0.3
     ]
    }
   ],
   "attributes": {
    "type": "drawer_cabinet",
    "label": "drawer_cabinet 600x720x560",
    "wall": "A",
    "width": 600.0,
    "depth": 560.0,
    "height": 720.0
   }
  }
 ]
}
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
      # cada abertura: 4 cantos na face interna + normal apontando para o ambiente
      w['openings'].each do |op|
        f = g.entities.add_face(op['pts'].map { |p| pt(*p) })
        next unless f
        f.reverse! if f.normal.dot(Geom::Vector3d.new(*op['normal'])) < 0
        f.pushpull(-mm(w['thickness']))
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
