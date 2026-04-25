"use client";

import { useState } from "react";
import { Plus, TrendingUp, Users, Clock, Gavel } from "lucide-react";
import { propiedades, formatPrice } from "@/lib/demo-data";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

// Build chart data from bids of the first active property
function buildChartData(propSlug: string) {
  const prop = propiedades.find((p) => p.slug === propSlug);
  if (!prop) return [];
  const sorted = [...prop.pujas_demo].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  return sorted.map((bid) => ({
    time: format(new Date(bid.timestamp), "HH:mm", { locale: es }),
    puja: bid.porcentaje,
  }));
}

export default function DashboardPage() {
  const activeProp = propiedades.find((p) => p.estado === "activa")!;
  const allActive = propiedades.filter((p) => p.estado === "activa");
  const [selectedProp, setSelectedProp] = useState(activeProp?.slug ?? "");

  const stats = {
    pujasActivas: allActive.reduce((sum, p) => sum + p.pujas_demo.length, 0),
    pujaMaxima: allActive.reduce((max, p) => {
      const top = p.pujas_demo[0]?.porcentaje ?? 0;
      return top > max ? top : max;
    }, 0),
    compradores: allActive.reduce((sum, p) => sum + p.pujas_demo.length, 0),
    propiedadesActivas: allActive.length,
  };

  return (
    <div className="pt-16 min-h-screen bg-[#F5F4F2]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-2">
              Panel vendedor
            </p>
            <h1 className="font-playfair text-4xl font-semibold text-[#0D0C0A]">
              Dashboard
            </h1>
          </div>
          <button className="hidden md:flex items-center gap-2 bg-[#0D0C0A] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#C9993A] transition-colors">
            <Plus size={15} />
            Publicar propiedad
          </button>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Gavel,
              label: "Pujas recibidas",
              value: String(stats.pujasActivas),
              sub: "en propiedades activas",
            },
            {
              icon: TrendingUp,
              label: "Puja más alta",
              value: `${stats.pujaMaxima}%`,
              sub: "de comisión",
            },
            {
              icon: Users,
              label: "Compradores",
              value: String(stats.compradores),
              sub: "interesados activos",
            },
            {
              icon: Clock,
              label: "Subastas activas",
              value: String(stats.propiedadesActivas),
              sub: "en curso ahora mismo",
            },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white border border-[#E8E6E2] rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[#9E9A94] font-medium">{label}</p>
                <Icon size={16} className="text-[#C9993A]" />
              </div>
              <p className="font-playfair text-3xl font-semibold text-[#0D0C0A]">{value}</p>
              <p className="text-xs text-[#9E9A94] mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-[#E8E6E2] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-lg font-semibold text-[#0D0C0A]">
                Evolución de pujas
              </h2>
              <select
                value={selectedProp}
                onChange={(e) => setSelectedProp(e.target.value)}
                className="text-xs border border-[#E8E6E2] rounded-lg px-2 py-1.5 outline-none text-[#0D0C0A] bg-white"
              >
                {allActive.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.ciudad} — {p.barrio}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={buildChartData(selectedProp)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F4F2" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#9E9A94" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E8E6E2" }}
                />
                <YAxis
                  domain={[0.5, 3.5]}
                  ticks={[1, 1.5, 2, 2.5, 3]}
                  tick={{ fontSize: 11, fill: "#9E9A94" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                  width={36}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E8E6E2",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "none",
                  }}
                  formatter={(value) => [`${value}%`, "Puja"]}
                />
                <Line
                  type="monotone"
                  dataKey="puja"
                  stroke="#C9993A"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#C9993A", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Active properties list */}
          <div className="bg-white border border-[#E8E6E2] rounded-lg p-5">
            <h2 className="font-playfair text-lg font-semibold text-[#0D0C0A] mb-5">
              Tus propiedades
            </h2>
            <div className="space-y-3">
              {propiedades.map((p) => (
                <Link
                  key={p.id}
                  href={`/propiedad/${p.slug}`}
                  className="block border border-[#E8E6E2] rounded-lg p-3 hover:border-[#9E9A94] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#0D0C0A] truncate">{p.titulo}</p>
                      <p className="text-xs text-[#9E9A94] mt-0.5">{p.ciudad}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        p.estado === "activa"
                          ? "bg-[#0D0C0A] text-white"
                          : p.estado === "vendida"
                          ? "bg-[#E8E6E2] text-[#9E9A94]"
                          : "bg-[#F5F4F2] text-[#9E9A94] border border-[#E8E6E2]"
                      }`}
                    >
                      {p.estado === "activa" ? "Activa" : p.estado === "vendida" ? "Vendida" : "Pronto"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[#9E9A94]">
                      {p.pujas_demo.length} pujas
                    </p>
                    {p.pujas_demo[0] && (
                      <p className="text-xs font-medium text-[#C9993A]">
                        Mejor: {p.pujas_demo[0].porcentaje}%
                      </p>
                    )}
                    <p className="text-xs font-medium text-[#0D0C0A]">
                      {formatPrice(p.precio_orientativo)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bids table */}
        <div className="mt-6 bg-white border border-[#E8E6E2] rounded-lg p-6">
          <h2 className="font-playfair text-lg font-semibold text-[#0D0C0A] mb-5">
            Últimas pujas recibidas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E6E2]">
                  <th className="text-left py-2.5 text-xs font-medium text-[#9E9A94] uppercase tracking-wider">
                    Comprador
                  </th>
                  <th className="text-left py-2.5 text-xs font-medium text-[#9E9A94] uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="text-right py-2.5 text-xs font-medium text-[#9E9A94] uppercase tracking-wider">
                    Puja
                  </th>
                  <th className="text-right py-2.5 text-xs font-medium text-[#9E9A94] uppercase tracking-wider hidden md:table-cell">
                    Importe
                  </th>
                  <th className="text-right py-2.5 text-xs font-medium text-[#9E9A94] uppercase tracking-wider hidden lg:table-cell">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {allActive
                  .flatMap((p) =>
                    p.pujas_demo.slice(0, 4).map((b) => ({
                      ...b,
                      propTitulo: `${p.ciudad} · ${p.barrio}`,
                      propSlug: p.slug,
                      precio: p.precio_orientativo,
                    }))
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  )
                  .slice(0, 10)
                  .map((row, i) => (
                    <tr key={i} className="border-b border-[#F5F4F2] last:border-0">
                      <td className="py-3 text-sm text-[#0D0C0A]">{row.usuario}</td>
                      <td className="py-3">
                        <Link
                          href={`/propiedad/${row.propSlug}`}
                          className="text-sm text-[#9E9A94] hover:text-[#0D0C0A] transition-colors"
                        >
                          {row.propTitulo}
                        </Link>
                      </td>
                      <td className="py-3 text-right font-medium text-[#C9993A]">
                        {row.porcentaje}%
                      </td>
                      <td className="py-3 text-right text-sm text-[#0D0C0A] hidden md:table-cell">
                        {formatPrice(Math.round(row.precio * row.porcentaje / 100))}
                      </td>
                      <td className="py-3 text-right text-xs text-[#9E9A94] hidden lg:table-cell">
                        {format(new Date(row.timestamp), "d MMM · HH:mm", { locale: es })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile publish button */}
        <div className="mt-6 md:hidden">
          <button className="w-full flex items-center justify-center gap-2 bg-[#0D0C0A] text-white py-4 rounded-lg text-sm font-medium">
            <Plus size={15} />
            Publicar propiedad
          </button>
        </div>
      </div>
    </div>
  );
}
