export type FotoZona = {
  zona: string;
  urls: string[];
};

export type PujaDemo = {
  usuario: string;
  porcentaje: number;
  timestamp: string;
};

export type Propiedad = {
  id: string;
  slug: string;
  titulo: string;
  ciudad: string;
  barrio: string;
  precio_orientativo: number;
  m2: number;
  habitaciones: number;
  banos: number;
  planta: string;
  año_construccion: number;
  descripcion: string;
  fotos: FotoZona[];
  video_url: string;
  certificacion_energetica: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  extras: string[];
  estado: "activa" | "proximamente" | "vendida";
  duracion_puja_dias: 3 | 5 | 7;
  fecha_inicio_puja: string;
  fecha_fin_puja: string;
  pujas_demo: PujaDemo[];
};

const now = new Date();
const addDays = (d: Date, days: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r.toISOString();
};
const subDays = (d: Date, days: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() - days);
  return r.toISOString();
};

// All valid bid steps from 0.15% to 3.00% in 0.15% increments
export const BID_STEPS: number[] = Array.from(
  { length: 20 },
  (_, i) => Math.round((i + 1) * 15) / 100
);

function genPujas(count: number, startHoursAgo: number): PujaDemo[] {
  const usuarios = [
    "Usuario_482", "Usuario_119", "Usuario_307", "Usuario_055",
    "Usuario_891", "Usuario_234", "Usuario_673", "Usuario_418",
    "Usuario_552", "Usuario_029", "Usuario_774", "Usuario_336",
    "Usuario_907", "Usuario_143", "Usuario_688", "Usuario_821",
    "Usuario_365", "Usuario_512", "Usuario_047", "Usuario_999",
  ];
  // Pick `count` unique percentages spread across the high end of the range
  const availableSteps = [...BID_STEPS].reverse(); // start from highest (3.00%)
  const chosenPcts = availableSteps.slice(0, Math.min(count, availableSteps.length));

  const result: PujaDemo[] = [];
  for (let i = 0; i < chosenPcts.length; i++) {
    const hoursAgo = startHoursAgo - (i * (startHoursAgo / chosenPcts.length));
    const t = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    result.push({
      usuario: usuarios[i % usuarios.length],
      porcentaje: chosenPcts[i],
      timestamp: t.toISOString(),
    });
  }
  return result.sort((a, b) => b.porcentaje - a.porcentaje);
}

export const propiedades: Propiedad[] = [
  {
    id: "1",
    slug: "piso-triana-sevilla",
    titulo: "Piso reformado en el corazón de Triana",
    ciudad: "Sevilla",
    barrio: "Triana",
    precio_orientativo: 285000,
    m2: 98,
    habitaciones: 3,
    banos: 2,
    planta: "3ª con ascensor",
    año_construccion: 1978,
    descripcion: `Espectacular piso reformado a estrenar en pleno barrio de Triana, uno de los más auténticos y demandados de Sevilla. El inmueble ha sido completamente renovado en 2023 con materiales de primera calidad, manteniendo el encanto de los patios sevillanos con una distribución moderna y luminosa.

La vivienda cuenta con una cocina americana totalmente equipada con isla central, perfecta para quienes disfrutan de cocinar y recibir. El salón-comedor de 35 m² da acceso a una terraza privada con vistas a la calle peatonal, ideal para disfrutar del clima sevillano durante gran parte del año.

Los tres dormitorios están perfectamente orientados al exterior, con armarios empotrados a medida. El dormitorio principal dispone de baño en suite con ducha italiana de obra. El segundo baño completo cuenta con bañera exenta de diseño.

La ubicación es inmejorable: a 5 minutos a pie del Puente de Triana, rodeado de comercio local, restaurantes de cocina andaluza y el famoso mercado de abastos de Triana. Acceso directo en transporte público al centro histórico y a la estación de Santa Justa.`,
    fotos: [
      {
        zona: "Salón",
        urls: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
        ],
      },
      {
        zona: "Cocina",
        urls: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
          "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=80",
        ],
      },
      {
        zona: "Dormitorios",
        urls: [
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
          "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
        ],
      },
      {
        zona: "Baños",
        urls: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
          "https://images.unsplash.com/photo-1620626011761-996317702782?w=1200&q=80",
        ],
      },
      {
        zona: "Exterior",
        urls: [
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=1200&q=80",
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80",
        ],
      },
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certificacion_energetica: "C",
    extras: ["Ascensor", "Terraza privada", "Aire acondicionado", "Suelo radiante", "Doble acristalamiento", "Trastero"],
    estado: "activa",
    duracion_puja_dias: 7,
    fecha_inicio_puja: subDays(now, 2),
    fecha_fin_puja: addDays(now, 5),
    pujas_demo: genPujas(19, 48),
  },
  {
    id: "2",
    slug: "apartamento-albaicin-granada",
    titulo: "Apartamento con vistas a la Alhambra en el Albaicín",
    ciudad: "Granada",
    barrio: "Albaicín",
    precio_orientativo: 210000,
    m2: 72,
    habitaciones: 2,
    banos: 1,
    planta: "2ª sin ascensor",
    año_construccion: 1965,
    descripcion: `Rara oportunidad de adquirir un apartamento de carácter único en el corazón del Albaicín, declarado Patrimonio de la Humanidad por la UNESCO. Desde las ventanas del salón y la terraza se disfruta de una vista panorámica privilegiada de la Alhambra y Sierra Nevada al fondo.

El inmueble conserva elementos originales de la arquitectura árabe-granadina: techos de madera con vigas vistas, suelo de barro cocido en el salón y arco de entrada al pasillo. La reforma reciente ha modernizado la instalación eléctrica, fontanería y cocina sin perder un ápice del encanto histórico.

La cocina independiente, con acceso a un pequeño patio interior, está completamente equipada. Los dos dormitorios tienen armarios empotrados; el principal tiene acceso a la terraza exterior con barandilla de forja original restaurada.

Vivir en el Albaicín es vivir en uno de los barrios más singulares de Europa: calles empedradas, carmen con jardines, el sonido de las campanas de las iglesias y la vista de la Alhambra iluminada cada noche. A 15 minutos a pie del centro y con múltiples líneas de autobús.`,
    fotos: [
      {
        zona: "Salón",
        urls: [
          "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
        ],
      },
      {
        zona: "Cocina",
        urls: [
          "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80",
          "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80",
        ],
      },
      {
        zona: "Dormitorios",
        urls: [
          "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=1200&q=80",
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
        ],
      },
      {
        zona: "Baños",
        urls: [
          "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=1200&q=80",
        ],
      },
      {
        zona: "Exterior",
        urls: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80",
        ],
      },
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certificacion_energetica: "E",
    extras: ["Terraza con vistas Alhambra", "Patio interior", "Vigas de madera originales", "Suelo de barro cocido"],
    estado: "activa",
    duracion_puja_dias: 5,
    fecha_inicio_puja: subDays(now, 1),
    fecha_fin_puja: addDays(now, 4),
    pujas_demo: genPujas(17, 24),
  },
  {
    id: "3",
    slug: "chalet-nueva-andalucia-marbella",
    titulo: "Chalet adosado en Nueva Andalucía, Marbella",
    ciudad: "Málaga",
    barrio: "Nueva Andalucía",
    precio_orientativo: 495000,
    m2: 185,
    habitaciones: 4,
    banos: 3,
    planta: "Unifamiliar",
    año_construccion: 2005,
    descripcion: `Impresionante chalet adosado en la exclusiva urbanización Valle Romano de Nueva Andalucía, a solo 5 minutos en coche de Puerto Banús y de las mejores playas de la Costa del Sol. La vivienda goza de orientación sur, lo que garantiza sol durante todo el día en su amplia terraza y piscina comunitaria.

La planta baja acoge un amplio salón-comedor con salida directa a terraza privada y jardín de 80 m², cocina de diseño totalmente equipada con electrodomésticos Siemens, aseo de cortesía y un dormitorio en suite ideal para invitados o home office.

En la planta superior se distribuyen tres dormitorios más, todos con armarios a medida. El dormitorio principal cuenta con vestidor independiente y baño en suite con bañera hidromasaje y ducha de lluvia. Desde la terraza del principal se disfruta de vistas parciales al mar y al campo de golf Las Brisas.

La urbanización dispone de piscina comunitaria, jardines con riego automatizado, vigilancia 24h y acceso controlado. A menos de 10 minutos del Marbella Club, el puerto deportivo de Banús y los mejores restaurantes de la zona.`,
    fotos: [
      {
        zona: "Salón",
        urls: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687644-c7171b46bbe0?w=1200&q=80",
        ],
      },
      {
        zona: "Cocina",
        urls: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        ],
      },
      {
        zona: "Dormitorios",
        urls: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80",
        ],
      },
      {
        zona: "Baños",
        urls: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
        ],
      },
      {
        zona: "Exterior",
        urls: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
          "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=1200&q=80",
        ],
      },
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certificacion_energetica: "B",
    extras: ["Piscina comunitaria", "Jardín privado 80m²", "Garaje 2 coches", "Vigilancia 24h", "Aire acondicionado centralizado", "Domótica", "Vistas al mar", "Cerca campo de golf"],
    estado: "activa",
    duracion_puja_dias: 7,
    fecha_inicio_puja: subDays(now, 3),
    fecha_fin_puja: addDays(now, 4),
    pujas_demo: genPujas(22, 72),
  },
  {
    id: "4",
    slug: "casa-el-puerto-cadiz",
    titulo: "Casa señorial reformada en El Puerto de Santa María",
    ciudad: "Cádiz",
    barrio: "Casco Histórico",
    precio_orientativo: 340000,
    m2: 220,
    habitaciones: 5,
    banos: 3,
    planta: "Unifamiliar 2 plantas",
    año_construccion: 1890,
    descripcion: `Excepcional casa señorial del siglo XIX completamente rehabilitada en el centro histórico de El Puerto de Santa María, la llamada "Ciudad de los Cien Palacios". Esta joya arquitectónica conserva todos sus elementos nobles: fachada original con reja de forja, patio andaluz central con naranjos, techos de artesanado y escalera de mármol.

La planta baja alberga un amplio zaguán de entrada, sala de estar con chimenea funcional, comedor formal con acceso al patio, cocina de diseño integrada con isla y office, y un baño completo. El patio central porticado es el corazón de la vivienda: 60 m² con fuente original, pavimento de barro vidriado y dos naranjos centenarios.

En la planta alta se distribuyen cinco dormitorios, todos con altos techos de tres metros y balcones a la calle o al patio. El dormitorio principal cuenta con vestidor y baño en suite de lujo. Desde los balcones delanteros se divisan las torres de la Prioral y el castillo de San Marcos.

A dos minutos a pie de la Plaza del Polvorista, a cinco del Mercado Central y a diez de las bodegas históricas de Osborne. Acceso directo en tren a Cádiz capital (20 min) y Jerez (15 min).`,
    fotos: [
      {
        zona: "Salón",
        urls: [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
          "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80",
        ],
      },
      {
        zona: "Cocina",
        urls: [
          "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80",
        ],
      },
      {
        zona: "Dormitorios",
        urls: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80",
        ],
      },
      {
        zona: "Baños",
        urls: [
          "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=1200&q=80",
        ],
      },
      {
        zona: "Exterior",
        urls: [
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=1200&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80",
        ],
      },
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certificacion_energetica: "D",
    extras: ["Patio andaluz con fuente", "Chimenea", "Terraza en azotea", "Bodega", "Naranjos centenarios", "Elementos arquitectónicos originales s.XIX"],
    estado: "proximamente",
    duracion_puja_dias: 7,
    fecha_inicio_puja: addDays(now, 3),
    fecha_fin_puja: addDays(now, 10),
    pujas_demo: [],
  },
  {
    id: "5",
    slug: "piso-centro-historico-cordoba",
    titulo: "Piso luminoso junto a la Mezquita-Catedral de Córdoba",
    ciudad: "Córdoba",
    barrio: "Centro Histórico",
    precio_orientativo: 195000,
    m2: 85,
    habitaciones: 2,
    banos: 2,
    planta: "1ª con ascensor",
    año_construccion: 1955,
    descripcion: `Precioso piso en el corazón del conjunto histórico de Córdoba, a menos de 200 metros de la Mezquita-Catedral, en una de las calles más emblemáticas del casco antiguo. El inmueble combina la arquitectura tradicional cordobesa —patio interior, techos altos, ventanas con reja de forja— con una reforma contemporánea de alta calidad.

El salón principal, de más de 30 m², dispone de acceso al balcón volado sobre la calle peatonal y cuenta con la luz natural que caracteriza a los primeros pisos de estas edificaciones históricas. La cocina ha sido completamente renovada con materiales de autor: encimera de granito negro, frentes laqueados en blanco y ventana al patio interior.

Ambos dormitorios tienen baño privado. El baño principal destaca por su ducha italiana de obra con azulejo artesanal en tonos azules y crema, en homenaje a la cerámica tradicional cordobesa. El segundo baño combina bañera y ducha.

El edificio, rehabilitado en 2021, conserva el patio interior original con pozo y maceteros florales. Es uno de los patios candidatos cada año al concurso de patios de Córdoba. Edificio con ascensor moderno instalado en la rehabilitación.`,
    fotos: [
      {
        zona: "Salón",
        urls: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
        ],
      },
      {
        zona: "Cocina",
        urls: [
          "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=80",
        ],
      },
      {
        zona: "Dormitorios",
        urls: [
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80",
        ],
      },
      {
        zona: "Baños",
        urls: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
        ],
      },
      {
        zona: "Exterior",
        urls: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
        ],
      },
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certificacion_energetica: "D",
    extras: ["Ascensor", "Patio interior comunitario", "Balcón volado", "Doble acristalamiento", "Reformado 2021", "Cerca Mezquita-Catedral"],
    estado: "activa",
    duracion_puja_dias: 5,
    fecha_inicio_puja: subDays(now, 1),
    fecha_fin_puja: addDays(now, 4),
    pujas_demo: genPujas(16, 20),
  },
  {
    id: "6",
    slug: "villa-sierra-nevada-granada",
    titulo: "Villa con jardín y piscina privada en las afueras de Granada",
    ciudad: "Granada",
    barrio: "Ogíjares",
    precio_orientativo: 580000,
    m2: 310,
    habitaciones: 5,
    banos: 4,
    planta: "Unifamiliar",
    año_construccion: 2010,
    descripcion: `Magnífica villa de diseño contemporáneo ubicada en la exclusiva urbanización de Ogíjares, a solo 8 km del centro de Granada y con impresionantes vistas a Sierra Nevada. La propiedad, construida con los más altos estándares de calidad, combina amplios espacios interiores con un jardín privado perfectamente integrado en el paisaje.

La planta baja se distribuye en torno a un hall de dobles alturas que vertebra los diferentes espacios: gran salón de representación con chimenea de etanol, comedor formal con puertas-ventana al jardín, salita de lectura, cocina profesional de 40 m² con despensa y lavadero, y un dormitorio en suite para invitados.

Las cuatro dormitorios de la planta superior están diseñados como suites independientes. La suite principal (70 m²) incluye vestidor walk-in, baño de lujo con bañera exenta con vistas a Sierra Nevada, ducha de experiencia y acceso a terraza privada. Desde esta terraza, en los días despejados, se distinguen los picos nevados a apenas 25 km de distancia.

El exterior (1.200 m² de parcela) cuenta con piscina infinity de 12x5 m con sistema de agua salada, zona de barbacoa cubierta, jardín paisajístico con sistema de riego automatizado y aparcamiento para 4 vehículos.`,
    fotos: [
      {
        zona: "Salón",
        urls: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
          "https://images.unsplash.com/photo-1600607687644-c7171b46bbe0?w=1200&q=80",
        ],
      },
      {
        zona: "Cocina",
        urls: [
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        ],
      },
      {
        zona: "Dormitorios",
        urls: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80",
        ],
      },
      {
        zona: "Baños",
        urls: [
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
        ],
      },
      {
        zona: "Exterior",
        urls: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
          "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=1200&q=80",
        ],
      },
    ],
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    certificacion_energetica: "A",
    extras: ["Piscina infinity 12x5m", "Jardín 1.200m²", "Garaje 4 coches", "Domótica KNX", "Suelo radiante", "Aerotermia", "Barbacoa cubierta", "Vistas Sierra Nevada", "Seguridad perimetral"],
    estado: "vendida",
    duracion_puja_dias: 7,
    fecha_inicio_puja: subDays(now, 14),
    fecha_fin_puja: subDays(now, 7),
    pujas_demo: genPujas(25, 168),
  },
];

export function getPropiedadBySlug(slug: string): Propiedad | undefined {
  return propiedades.find((p) => p.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calcComision(precio: number, porcentaje: number): number {
  return Math.round(precio * (porcentaje / 100));
}
