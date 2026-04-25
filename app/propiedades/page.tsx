"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { propiedades, Propiedad } from "@/lib/demo-data";
import PropertyCard from "@/components/PropertyCard";

type Filters = {
  ciudad: string;
  estado: string;
  precioMin: number;
  precioMax: number;
  m2Min: number;
  habitaciones: number;
};

const CITIES = ["Todas", ...Array.from(new Set(propiedades.map((p) => p.ciudad))).sort()];
const ESTADOS = [
  { value: "", label: "Todos los estados" },
  { value: "activa", label: "Puja activa" },
  { value: "proximamente", label: "Próximamente" },
  { value: "vendida", label: "Vendida" },
];

export default function PropiedadesPage() {
  const [filters, setFilters] = useState<Filters>({
    ciudad: "Todas",
    estado: "",
    precioMin: 0,
    precioMax: 1000000,
    m2Min: 0,
    habitaciones: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    return propiedades.filter((p) => {
      if (filters.ciudad !== "Todas" && p.ciudad !== filters.ciudad) return false;
      if (filters.estado && p.estado !== filters.estado) return false;
      if (p.precio_orientativo < filters.precioMin) return false;
      if (p.precio_orientativo > filters.precioMax) return false;
      if (p.m2 < filters.m2Min) return false;
      if (filters.habitaciones > 0 && p.habitaciones < filters.habitaciones) return false;
      return true;
    });
  }, [filters]);

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ ciudad: "Todas", estado: "", precioMin: 0, precioMax: 1000000, m2Min: 0, habitaciones: 0 });
  }

  const activeFilterCount = [
    filters.ciudad !== "Todas",
    filters.estado !== "",
    filters.precioMax < 1000000,
    filters.m2Min > 0,
    filters.habitaciones > 0,
  ].filter(Boolean).length;

  const Sidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#0D0C0A] uppercase tracking-wider">Filtros</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-[#9E9A94] hover:text-[#0D0C0A] flex items-center gap-1">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Ciudad */}
      <div>
        <p className="text-xs font-medium text-[#9E9A94] uppercase tracking-wider mb-3">Ciudad</p>
        <div className="space-y-1.5">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => set("ciudad", city)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.ciudad === city
                  ? "bg-[#0D0C0A] text-white"
                  : "text-[#0D0C0A] hover:bg-[#F5F4F2]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Estado */}
      <div>
        <p className="text-xs font-medium text-[#9E9A94] uppercase tracking-wider mb-3">Estado de puja</p>
        <div className="space-y-1.5">
          {ESTADOS.map((e) => (
            <button
              key={e.value}
              onClick={() => set("estado", e.value)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.estado === e.value
                  ? "bg-[#0D0C0A] text-white"
                  : "text-[#0D0C0A] hover:bg-[#F5F4F2]"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div>
        <p className="text-xs font-medium text-[#9E9A94] uppercase tracking-wider mb-3">Precio máximo</p>
        <div className="space-y-2">
          {[200000, 300000, 400000, 600000, 1000000].map((p) => (
            <button
              key={p}
              onClick={() => set("precioMax", p)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.precioMax === p
                  ? "bg-[#0D0C0A] text-white"
                  : "text-[#0D0C0A] hover:bg-[#F5F4F2]"
              }`}
            >
              {p >= 1000000 ? "Sin límite" : `Hasta ${(p / 1000).toFixed(0)}k€`}
            </button>
          ))}
        </div>
      </div>

      {/* Habitaciones */}
      <div>
        <p className="text-xs font-medium text-[#9E9A94] uppercase tracking-wider mb-3">Habitaciones mínimas</p>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => set("habitaciones", n)}
              className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                filters.habitaciones === n
                  ? "bg-[#0D0C0A] border-[#0D0C0A] text-white"
                  : "border-[#E8E6E2] text-[#0D0C0A] hover:border-[#9E9A94]"
              }`}
            >
              {n === 0 ? "T" : n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-2">
              Catálogo
            </p>
            <h1 className="font-playfair text-4xl font-semibold text-[#0D0C0A]">
              Propiedades
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#9E9A94]">{filtered.length} resultados</span>
            <button
              className="md:hidden flex items-center gap-2 border border-[#E8E6E2] px-3 py-2 rounded-lg text-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal size={14} />
              Filtros
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-[#C9993A] text-white rounded-full text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-48 flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#9E9A94] mb-4">No hay propiedades con esos filtros</p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-[#0D0C0A] border border-[#E8E6E2] px-4 py-2 rounded-lg hover:border-[#0D0C0A] transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} propiedad={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-[#9E9A94] hover:text-[#0D0C0A]"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
