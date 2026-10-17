# Simulação mínima da API Ruby do SketchUp para executar o script gerado fora
# do SketchUp. Verifica apenas que o script roda sem erros de Ruby e chama os
# métodos esperados; NÃO prova o comportamento do SketchUp real.
# Uso: ruby tests/sketchup_stub.rb caminho/do/script.rb
require 'json'

class Numeric
  def mm; self / 25.4; end   # SketchUp trabalha internamente em polegadas
end

module Geom
  class Point3d
    attr_reader :x, :y, :z
    def initialize(x, y, z) @x, @y, @z = x, y, z end
  end
  class Vector3d
    attr_reader :x, :y, :z
    def initialize(x, y, z) @x, @y, @z = x.to_f, y.to_f, z.to_f end
    def dot(o) x * o.x + y * o.y + z * o.z end
  end
  class Transformation
    attr_reader :origin
    def self.translation(p) t = new; t.instance_variable_set(:@origin, p); t end
  end
end

STATS = Hash.new(0)

class Face
  attr_reader :normal
  def initialize(pts)
    a, b, c = pts
    u = [b.x - a.x, b.y - a.y, b.z - a.z]; v = [c.x - a.x, c.y - a.y, c.z - a.z]
    @normal = Geom::Vector3d.new(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0])
  end
  def reverse!; @normal = Geom::Vector3d.new(-@normal.x, -@normal.y, -@normal.z); STATS[:reversed] += 1; self end
  def pushpull(d) STATS[:pushpull] += 1; raise 'pushpull deve ser para dentro da parede' unless d < 0 end
end

class Entities
  attr_reader :items
  def initialize; @items = [] end
  def length; @items.length end
  def add_face(pts)
    raise "face precisa de >= 3 pontos" if pts.length < 3
    STATS[:faces] += 1; f = Face.new(pts); @items << f; f
  end
  def add_group; STATS[:groups] += 1; g = Group.new; @items << g; g end
  def add_instance(defn, tr) STATS[:instances] += 1; i = Instance.new(defn, tr); @items << i; i end
end

class Group
  attr_accessor :name, :layer, :material
  attr_reader :entities
  def initialize; @entities = Entities.new end
end

class Instance
  attr_accessor :name, :layer
  attr_reader :attrs, :definition
  def initialize(d, t) @definition, @tr, @attrs = d, t, {} end
  def set_attribute(dict, k, v) (@attrs[dict] ||= {})[k] = v end
end

class NamedCollection
  def initialize(klass) @h, @klass = {}, klass end
  def [](n) @h[n] end
  def add(n) @h[n] = @klass.new(n) end
  def purge_unused; end
  def names; @h.keys end
end

class Layer; attr_reader :name; def initialize(n) @name = n end end
class Material; attr_accessor :color; attr_reader :name; def initialize(n) @name = n end end
class Definition; attr_reader :name, :entities; def initialize(n) @name, @entities = n, Entities.new end end

module Sketchup
  class Color; def initialize(r, g, b) raise 'cor inválida' unless [r, g, b].all? { |c| (0..255).cover?(c) } end end
  class Model
    VERSION_2016 = 16
    attr_reader :entities, :layers, :materials, :definitions, :saved
    def initialize
      @entities = Entities.new
      @layers = NamedCollection.new(Layer); @materials = NamedCollection.new(Material)
      @definitions = NamedCollection.new(Definition)
    end
    def active_entities; @entities end
    def start_operation(*) end
    def commit_operation; end
    def save(path, version = nil) @saved = [path, version]; true end
  end
  @model = Model.new
  def self.active_model; @model end
  def self.file_new; @model = Model.new end
end

script = ARGV[0] or abort('informe o script')
load script
m = Sketchup.active_model
report = {
  'stats' => STATS, 'tags' => m.layers.names, 'materials' => m.materials.names,
  'definitions' => m.definitions.names, 'saved' => m.saved,
  'top_level' => m.entities.items.map { |e|
    { 'class' => e.class.name, 'name' => e.name, 'layer' => (e.layer && e.layer.name) }
  },
}
puts JSON.generate(report)
