# encoding: UTF-8
# Gerado por promob_auto_generator — projeto: Quarto_Casal_Real
# Uso: no SketchUp (2017 ou superior), Janela > Console Ruby:
#   load "C:/caminho/para/Quarto_Casal_Real_sketchup.rb"
# O script cria um modelo novo, monta parede/piso/módulos e salva
#   Quarto_Casal_Real.skp (versão SketchUp 2016, exigida pelo "Importar Arquivo 3D" do Promob)
# na mesma pasta deste script, sem sobrescrever arquivos existentes.
require 'json'

module PromobGen
  DATA = JSON.parse(<<'__JSON__')
{
 "skp_name": "Quarto_Casal_Real.skp",
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
    -150.0,
    4000.0,
    0.0
   ],
   "size": [
    3900.0,
    150.0,
    2700.0
   ],
   "thickness": 150.0,
   "openings": []
  },
  {
   "name": "Parede B",
   "origin": [
    3600.0,
    0.0,
    0.0
   ],
   "size": [
    150.0,
    4000.0,
    2700.0
   ],
   "thickness": 150.0,
   "openings": [
    {
     "type": "window",
     "pts": [
      [
       3600.0,
       2400.0,
       1000.0
      ],
      [
       3600.0,
       1200.0,
       1000.0
      ],
      [
       3600.0,
       1200.0,
       2200.0
      ],
      [
       3600.0,
       2400.0,
       2200.0
      ]
     ],
     "normal": [
      -1.0,
      0.0,
      0.0
     ]
    }
   ]
  },
  {
   "name": "Parede C",
   "origin": [
    -150.0,
    -150.0,
    0.0
   ],
   "size": [
    3900.0,
    150.0,
    2700.0
   ],
   "thickness": 150.0,
   "openings": [
    {
     "type": "door",
     "pts": [
      [
       900.0,
       0.0,
       0.0
      ],
      [
       100.0,
       0.0,
       0.0
      ],
      [
       100.0,
       0.0,
       2100.0
      ],
      [
       900.0,
       0.0,
       2100.0
      ]
     ],
     "normal": [
      0.0,
      1.0,
      0.0
     ]
    }
   ]
  },
  {
   "name": "Parede D",
   "origin": [
    -150.0,
    0.0,
    0.0
   ],
   "size": [
    150.0,
    4000.0,
    2700.0
   ],
   "thickness": 150.0,
   "openings": []
  }
 ],
 "floor": {
  "origin": [
   0.0,
   0.0,
   -20.0
  ],
  "size": [
   3600.0,
   4000.0,
   20.0
  ]
 },
 "modules": [
  {
   "name": "M01_wall_panel 1400x600x30",
   "position": [
    1100.0,
    3970.0,
    450.0
   ],
   "parts": [
    {
     "name": "Painel",
     "origin": [
      0.0,
      0.0,
      0.0
     ],
     "size": [
      1400.0,
      30.0,
      600.0
     ],
     "material": "Courino Branco",
     "color": [
      0.96,
      0.95,
      0.93
     ]
    }
   ],
   "attributes": {
    "type": "wall_panel",
    "label": "Cabeceira estofada Reta Luxo Dupla (Flamingo Design)",
    "wall": "A",
    "width": 1400.0,
    "depth": 30.0,
    "height": 600.0
   }
  },
  {
   "name": "M02_bed 1380x540x1880",
   "position": [
    1110.0,
    2090.0,
    0.0
   ],
   "parts": [
    {
     "name": "Base Box",
     "origin": [
      0.0,
      0.0,
      0.0
     ],
     "size": [
      1380.0,
      1880.0,
      297.0
     ],
     "material": "Tecido Linho Cinza",
     "color": [
      0.6,
      0.61,
      0.62
     ]
    },
    {
     "name": "Colchão",
     "origin": [
      10.0,
      10.0,
      297.0
     ],
     "size": [
      1360.0,
      1860.0,
      243.0
     ],
     "material": "Colchao",
     "color": [
      0.95,
      0.95,
      0.93
     ]
    },
    {
     "name": "Travesseiro 1",
     "origin": [
      170.0,
      1470.0,
      540.0
     ],
     "size": [
      500.0,
      350.0,
      120.0
     ],
     "material": "Travesseiro",
     "color": [
      0.98,
      0.98,
      0.97
     ]
    },
    {
     "name": "Travesseiro 2",
     "origin": [
      710.0,
      1470.0,
      540.0
     ],
     "size": [
      500.0,
      350.0,
      120.0
     ],
     "material": "Travesseiro",
     "color": [
      0.98,
      0.98,
      0.97
     ]
    },
    {
     "name": "Peseira (manta)",
     "origin": [
      0.0,
      100.0,
      535.0
     ],
     "size": [
      1380.0,
      450.0,
      12.0
     ],
     "material": "Manta Tecido",
     "color": [
      0.42,
      0.47,
      0.55
     ]
    }
   ],
   "attributes": {
    "type": "bed",
    "label": "Cama box casal c/ colchao Union (Ortobom)",
    "wall": "A",
    "width": 1380.0,
    "depth": 1880.0,
    "height": 540.0
   }
  },
  {
   "name": "M03_nightstand 520x620x450",
   "position": [
    570.0,
    3512.0,
    0.0
   ],
   "parts": [
    {
     "name": "Lateral Esquerda",
     "origin": [
      0.0,
      38.0,
      60.0
     ],
     "size": [
      15.0,
      450.0,
      620.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      505.0,
      38.0,
      60.0
     ],
     "size": [
      15.0,
      450.0,
      620.0
     ],
     "material": "MDP Branco TX 15mm",
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
      60.0
     ],
     "size": [
      490.0,
      447.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
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
      485.0,
      75.0
     ],
     "size": [
      490.0,
      3.0,
      590.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    },
    {
     "name": "Tampo Interno",
     "origin": [
      15.0,
      38.0,
      665.0
     ],
     "size": [
      490.0,
      447.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
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
      63.0
     ],
     "size": [
      514.0,
      18.0,
      305.5
     ],
     "material": "MDP Branco TX Espelhado",
     "color": [
      0.8,
      0.86,
      0.9
     ]
    },
    {
     "name": "Puxador Gaveta 1",
     "origin": [
      180.0,
      0.0,
      318.5
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
      88.0
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Lateral D",
     "origin": [
      480.0,
      38.0,
      88.0
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      443.0,
      88.0
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      88.0
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      88.0
     ],
     "size": [
      440.0,
      393.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
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
      371.5
     ],
     "size": [
      514.0,
      18.0,
      305.5
     ],
     "material": "MDP Branco TX Espelhado",
     "color": [
      0.8,
      0.86,
      0.9
     ]
    },
    {
     "name": "Puxador Gaveta 2",
     "origin": [
      180.0,
      0.0,
      627.0
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
      396.5
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Lateral D",
     "origin": [
      480.0,
      38.0,
      396.5
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      443.0,
      396.5
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      396.5
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      396.5
     ],
     "size": [
      440.0,
      393.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
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
      520.0,
      15.0,
      60.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.3,
      0.3,
      0.3
     ]
    }
   ],
   "attributes": {
    "type": "nightstand",
    "label": "Criado-mudo 807E 2 gavetas (Foscarini)",
    "wall": "A",
    "width": 520.0,
    "depth": 450.0,
    "height": 620.0
   }
  },
  {
   "name": "M04_nightstand 520x620x450",
   "position": [
    2510.0,
    3512.0,
    0.0
   ],
   "parts": [
    {
     "name": "Lateral Esquerda",
     "origin": [
      0.0,
      38.0,
      60.0
     ],
     "size": [
      15.0,
      450.0,
      620.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      505.0,
      38.0,
      60.0
     ],
     "size": [
      15.0,
      450.0,
      620.0
     ],
     "material": "MDP Branco TX 15mm",
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
      60.0
     ],
     "size": [
      490.0,
      447.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
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
      485.0,
      75.0
     ],
     "size": [
      490.0,
      3.0,
      590.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    },
    {
     "name": "Tampo Interno",
     "origin": [
      15.0,
      38.0,
      665.0
     ],
     "size": [
      490.0,
      447.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
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
      63.0
     ],
     "size": [
      514.0,
      18.0,
      305.5
     ],
     "material": "MDP Branco TX Espelhado",
     "color": [
      0.8,
      0.86,
      0.9
     ]
    },
    {
     "name": "Puxador Gaveta 1",
     "origin": [
      180.0,
      0.0,
      318.5
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
      88.0
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Lateral D",
     "origin": [
      480.0,
      38.0,
      88.0
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      443.0,
      88.0
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      88.0
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      88.0
     ],
     "size": [
      440.0,
      393.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
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
      371.5
     ],
     "size": [
      514.0,
      18.0,
      305.5
     ],
     "material": "MDP Branco TX Espelhado",
     "color": [
      0.8,
      0.86,
      0.9
     ]
    },
    {
     "name": "Puxador Gaveta 2",
     "origin": [
      180.0,
      0.0,
      627.0
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
      396.5
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Lateral D",
     "origin": [
      480.0,
      38.0,
      396.5
     ],
     "size": [
      12.0,
      417.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      443.0,
      396.5
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      396.5
     ],
     "size": [
      440.0,
      12.0,
      245.5
     ],
     "material": "MDP Branco TX 15mm",
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
      396.5
     ],
     "size": [
      440.0,
      393.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
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
      520.0,
      15.0,
      60.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.3,
      0.3,
      0.3
     ]
    }
   ],
   "attributes": {
    "type": "nightstand",
    "label": "Criado-mudo 807E 2 gavetas (Foscarini)",
    "wall": "A",
    "width": 520.0,
    "depth": 450.0,
    "height": 620.0
   }
  },
  {
   "name": "M05_wardrobe 2490x2250x500",
   "position": [
    1110.0,
    0.0,
    0.0
   ],
   "parts": [
    {
     "name": "Lateral Esquerda",
     "origin": [
      2475.0,
      0.0,
      100.0
     ],
     "size": [
      15.0,
      500.0,
      2250.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      0.0,
      0.0,
      100.0
     ],
     "size": [
      15.0,
      500.0,
      2250.0
     ],
     "material": "MDP Branco TX 15mm",
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
      3.0,
      100.0
     ],
     "size": [
      2460.0,
      497.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
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
      0.0,
      115.0
     ],
     "size": [
      2460.0,
      3.0,
      2220.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    },
    {
     "name": "Tampo Interno",
     "origin": [
      15.0,
      3.0,
      2335.0
     ],
     "size": [
      2460.0,
      497.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Maleiro 1",
     "origin": [
      1665.0,
      3.0,
      1935.0
     ],
     "size": [
      810.0,
      477.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.9,
      0.9,
      0.88
     ]
    },
    {
     "name": "Cabideiro 1",
     "origin": [
      1670.0,
      240.0,
      1875.0
     ],
     "size": [
      800.0,
      20.0,
      15.0
     ],
     "material": "Tubo Oval Cromado",
     "color": [
      0.75,
      0.75,
      0.77
     ]
    },
    {
     "name": "Divisória 1",
     "origin": [
      1650.0,
      3.0,
      115.0
     ],
     "size": [
      15.0,
      497.0,
      2220.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Maleiro 2",
     "origin": [
      840.0,
      3.0,
      1935.0
     ],
     "size": [
      810.0,
      477.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.9,
      0.9,
      0.88
     ]
    },
    {
     "name": "Cabideiro 2",
     "origin": [
      845.0,
      240.0,
      1875.0
     ],
     "size": [
      800.0,
      20.0,
      15.0
     ],
     "material": "Tubo Oval Cromado",
     "color": [
      0.75,
      0.75,
      0.77
     ]
    },
    {
     "name": "Divisória 2",
     "origin": [
      825.0,
      3.0,
      115.0
     ],
     "size": [
      15.0,
      497.0,
      2220.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Maleiro 3",
     "origin": [
      15.0,
      3.0,
      1935.0
     ],
     "size": [
      810.0,
      477.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.9,
      0.9,
      0.88
     ]
    },
    {
     "name": "Cabideiro 3",
     "origin": [
      20.0,
      240.0,
      1875.0
     ],
     "size": [
      800.0,
      20.0,
      15.0
     ],
     "material": "Tubo Oval Cromado",
     "color": [
      0.75,
      0.75,
      0.77
     ]
    },
    {
     "name": "Gaveta Interna 1 Frente",
     "origin": [
      28.0,
      420.0,
      195.0
     ],
     "size": [
      784.0,
      15.0,
      180.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Gaveta Interna 1 Caixa",
     "origin": [
      28.0,
      23.0,
      195.0
     ],
     "size": [
      784.0,
      397.0,
      150.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta Interna 2 Frente",
     "origin": [
      28.0,
      420.0,
      385.0
     ],
     "size": [
      784.0,
      15.0,
      180.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Gaveta Interna 2 Caixa",
     "origin": [
      28.0,
      23.0,
      385.0
     ],
     "size": [
      784.0,
      397.0,
      150.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta Interna 3 Frente",
     "origin": [
      28.0,
      420.0,
      575.0
     ],
     "size": [
      784.0,
      15.0,
      180.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Gaveta Interna 3 Caixa",
     "origin": [
      28.0,
      23.0,
      575.0
     ],
     "size": [
      784.0,
      397.0,
      150.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta Interna 4 Frente",
     "origin": [
      28.0,
      420.0,
      765.0
     ],
     "size": [
      784.0,
      15.0,
      180.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Gaveta Interna 4 Caixa",
     "origin": [
      28.0,
      23.0,
      765.0
     ],
     "size": [
      784.0,
      397.0,
      150.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Porta 1",
     "origin": [
      2075.5,
      500.0,
      103.0
     ],
     "size": [
      411.5,
      18.0,
      2244.0
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 1",
     "origin": [
      2095.5,
      518.0,
      1100.0
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
      1661.0,
      500.0,
      103.0
     ],
     "size": [
      411.5,
      18.0,
      2244.0
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 2",
     "origin": [
      2032.5,
      518.0,
      1100.0
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
     "name": "Porta 3",
     "origin": [
      1246.5,
      500.0,
      103.0
     ],
     "size": [
      411.5,
      18.0,
      2244.0
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 3",
     "origin": [
      1266.5,
      518.0,
      1100.0
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
     "name": "Porta 4",
     "origin": [
      832.0,
      500.0,
      103.0
     ],
     "size": [
      411.5,
      18.0,
      2244.0
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 4",
     "origin": [
      1203.5,
      518.0,
      1100.0
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
     "name": "Porta 5",
     "origin": [
      417.5,
      500.0,
      103.0
     ],
     "size": [
      411.5,
      18.0,
      2244.0
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 5",
     "origin": [
      437.5,
      518.0,
      1100.0
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
     "name": "Porta 6",
     "origin": [
      3.0,
      500.0,
      103.0
     ],
     "size": [
      411.5,
      18.0,
      2244.0
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Porta 6",
     "origin": [
      374.5,
      518.0,
      1100.0
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
      440.0,
      0.0
     ],
     "size": [
      2490.0,
      15.0,
      100.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.3,
      0.3,
      0.3
     ]
    }
   ],
   "attributes": {
    "type": "wardrobe",
    "label": "Guarda-roupa casal H555 6 portas 4 gavetas c/ pes (Kappesberg)",
    "wall": "C",
    "width": 2490.0,
    "depth": 500.0,
    "height": 2250.0
   }
  },
  {
   "name": "M06_dresser 1265x950x510",
   "position": [
    0.0,
    1500.0,
    0.0
   ],
   "parts": [
    {
     "name": "Lateral Esquerda",
     "origin": [
      0.0,
      0.0,
      60.0
     ],
     "size": [
      510.0,
      15.0,
      950.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      0.0,
      1250.0,
      60.0
     ],
     "size": [
      510.0,
      15.0,
      950.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Base",
     "origin": [
      3.0,
      15.0,
      60.0
     ],
     "size": [
      507.0,
      1235.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Fundo",
     "origin": [
      0.0,
      15.0,
      75.0
     ],
     "size": [
      3.0,
      1235.0,
      920.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    },
    {
     "name": "Tampo Interno",
     "origin": [
      3.0,
      15.0,
      995.0
     ],
     "size": [
      507.0,
      1235.0,
      15.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.93,
      0.93,
      0.91
     ]
    },
    {
     "name": "Frente Gaveta 1",
     "origin": [
      510.0,
      3.0,
      63.0
     ],
     "size": [
      18.0,
      1259.0,
      233.75
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 1",
     "origin": [
      528.0,
      552.5,
      246.75
     ],
     "size": [
      20.0,
      160.0,
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
      33.0,
      28.0,
      88.0
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Lateral D",
     "origin": [
      33.0,
      1225.0,
      88.0
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Traseira",
     "origin": [
      33.0,
      40.0,
      88.0
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Contrafrente",
     "origin": [
      498.0,
      40.0,
      88.0
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 1 Fundo",
     "origin": [
      45.0,
      40.0,
      88.0
     ],
     "size": [
      453.0,
      1185.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Frente Gaveta 2",
     "origin": [
      510.0,
      3.0,
      299.75
     ],
     "size": [
      18.0,
      1259.0,
      233.75
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 2",
     "origin": [
      528.0,
      552.5,
      483.5
     ],
     "size": [
      20.0,
      160.0,
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
      33.0,
      28.0,
      324.75
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Lateral D",
     "origin": [
      33.0,
      1225.0,
      324.75
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Traseira",
     "origin": [
      33.0,
      40.0,
      324.75
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Contrafrente",
     "origin": [
      498.0,
      40.0,
      324.75
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 2 Fundo",
     "origin": [
      45.0,
      40.0,
      324.75
     ],
     "size": [
      453.0,
      1185.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Frente Gaveta 3",
     "origin": [
      510.0,
      3.0,
      536.5
     ],
     "size": [
      18.0,
      1259.0,
      233.75
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 3",
     "origin": [
      528.0,
      552.5,
      720.25
     ],
     "size": [
      20.0,
      160.0,
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
      33.0,
      28.0,
      561.5
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Lateral D",
     "origin": [
      33.0,
      1225.0,
      561.5
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Traseira",
     "origin": [
      33.0,
      40.0,
      561.5
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Contrafrente",
     "origin": [
      498.0,
      40.0,
      561.5
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 3 Fundo",
     "origin": [
      45.0,
      40.0,
      561.5
     ],
     "size": [
      453.0,
      1185.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Frente Gaveta 4",
     "origin": [
      510.0,
      3.0,
      773.25
     ],
     "size": [
      18.0,
      1259.0,
      233.75
     ],
     "material": "MDP Branco TX 18mm",
     "color": [
      0.97,
      0.97,
      0.97
     ]
    },
    {
     "name": "Puxador Gaveta 4",
     "origin": [
      528.0,
      552.5,
      957.0
     ],
     "size": [
      20.0,
      160.0,
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
     "name": "Gaveta 4 Lateral E",
     "origin": [
      33.0,
      28.0,
      798.25
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 4 Lateral D",
     "origin": [
      33.0,
      1225.0,
      798.25
     ],
     "size": [
      477.0,
      12.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 4 Traseira",
     "origin": [
      33.0,
      40.0,
      798.25
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 4 Contrafrente",
     "origin": [
      498.0,
      40.0,
      798.25
     ],
     "size": [
      12.0,
      1185.0,
      173.75
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Gaveta 4 Fundo",
     "origin": [
      45.0,
      40.0,
      798.25
     ],
     "size": [
      453.0,
      1185.0,
      3.0
     ],
     "material": "HDF Branco 3mm",
     "color": [
      0.8,
      0.78,
      0.74
     ]
    },
    {
     "name": "Rodapé",
     "origin": [
      450.0,
      0.0,
      0.0
     ],
     "size": [
      15.0,
      1265.0,
      60.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.3,
      0.3,
      0.3
     ]
    }
   ],
   "attributes": {
    "type": "dresser",
    "label": "Comoda Americana 4 gavetas (Henn)",
    "wall": "D",
    "width": 1265.0,
    "depth": 510.0,
    "height": 950.0
   }
  },
  {
   "name": "M07_desk 1200x730x600",
   "position": [
    3000.0,
    800.0,
    0.0
   ],
   "parts": [
    {
     "name": "Tampo",
     "origin": [
      0.0,
      0.0,
      705.0
     ],
     "size": [
      600.0,
      1200.0,
      25.0
     ],
     "material": "MDP Sevilha",
     "color": [
      0.7,
      0.52,
      0.36
     ]
    },
    {
     "name": "Lateral Esquerda",
     "origin": [
      0.0,
      1185.0,
      0.0
     ],
     "size": [
      580.0,
      15.0,
      705.0
     ],
     "material": "MDP Sevilha",
     "color": [
      0.7,
      0.52,
      0.36
     ]
    },
    {
     "name": "Lateral Direita",
     "origin": [
      0.0,
      0.0,
      0.0
     ],
     "size": [
      580.0,
      15.0,
      705.0
     ],
     "material": "MDP Sevilha",
     "color": [
      0.7,
      0.52,
      0.36
     ]
    },
    {
     "name": "Painel Frontal (saia)",
     "origin": [
      545.0,
      15.0,
      405.0
     ],
     "size": [
      15.0,
      1170.0,
      300.0
     ],
     "material": "MDP Branco TX 15mm",
     "color": [
      0.85,
      0.85,
      0.83
     ]
    }
   ],
   "attributes": {
    "type": "desk",
    "label": "Escrivaninha 120 cm CR25312 (Multimoveis)",
    "wall": "B",
    "width": 1200.0,
    "depth": 600.0,
    "height": 730.0
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
