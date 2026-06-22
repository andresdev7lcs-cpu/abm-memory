const MODUTRIPLEX_CONFIG = {
  site: {
    name: "Modutriplex",
    feature: "cotizador_2d",
    version: "v5",
    currency: "COP",
    vat_rate: 0.19,
    edge_holdup_rate: 0.08
  },

  catalog: {
    sheet_references: [
      { label: "244 x 120", width_mm: 2440, height_mm: 1200 },
      { label: "244 x 153", width_mm: 2440, height_mm: 1530 },
      { label: "244 x 183", width_mm: 2440, height_mm: 1830 },
      { label: "244 x 212", width_mm: 2440, height_mm: 2120 }
    ],
    materials: [
      "MDF crudo",
      "blanco",
      "negro",
      "gris",
      "tablex",
      "tablex RH",
      "cedro",
      "wengue",
      "arena"
    ],
    calibers: ["9mm", "12mm", "15mm", "18mm", "25mm", "36mm"],
    prices_base: {
      "MDF crudo 9mm": 85000,
      "MDF crudo 12mm": 95000,
      "MDF crudo 15mm": 110000,
      "MDF crudo 18mm": 125000,
      "MDF crudo 25mm": 165000,
      "Melamínico blanco 9mm": 95000,
      "Melamínico blanco 12mm": 110000,
      "Melamínico blanco 15mm": 125000,
      "Melamínico blanco 18mm": 145000,
      "Melamínico blanco 25mm": 185000,
      "Melamínico color 18mm": 165000,
      "Melamínico RH 18mm": 195000,
      "Cedro 18mm": 280000,
      "Wengue 18mm": 310000,
      "Arena 18mm": 265000,
      "Tablex 4mm": 45000,
      "Tablex RH 4mm": 65000
    },
    edge_prices: {
      rigid_ml: 4500,
      flexible_ml: 3800
    }
  },

  project_config: {
    materials_selected: [
      {
        material: "MDF blanco",
        caliber: "18mm",
        sheet_reference: "244 x 183"
      }
    ]
  },

  pieces: [
    {
      quantity: 3,
      width_mm: 600,
      height_mm: 400,
      material: "MDF blanco",
      caliber: "18mm",
      sheet_reference: "244 x 183",
      edge_color: "blanco",
      edges: {
        c_largo_1: "R",
        c_largo_2: "R",
        c_ancho_1: "",
        c_ancho_2: ""
      }
    }
  ],

  quote: {
    sheets_required: [],
    edge_totals: {
      rigid_m: 0,
      flexible_m: 0
    },
    costs: {
      materials_subtotal: 0,
      edges_subtotal: 0,
      subtotal_before_vat: 0,
      vat: 0,
      total: 0
    }
  }
};
