"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, Clock } from "lucide-react";
import { Propiedad, formatPrice } from "@/lib/demo-data";
import CountdownTimer from "@/components/CountdownTimer";

type Props = { propiedad: Propiedad };

const estadoBadge: Record<Propiedad["estado"], { label: string; classes: string }> = {
  activa: { label: "Puja activa", classes: "bg-[#0D0C0A] text-white" },
  proximamente: { label: "Próximamente", classes: "bg-[#F5F4F2] text-[#9E9A94] border border-[#E8E6E2]" },
  vendida: { label: "Vendida", classes: "bg-[#E8E6E2] text-[#9E9A94]" },
};

export default function PropertyCard({ propiedad }: Props) {
  const badge = estadoBadge[propiedad.estado];
  const topPhoto = propiedad.fotos[0]?.urls[0] ?? "";
  const highestBid = propiedad.pujas_demo[0]?.porcentaje ?? null;

  return (
    <Link href={`/propiedad/${propiedad.slug}`} className="group block">
      <div className="bg-white border border-[#E8E6E2] rounded-lg overflow-hidden hover:border-[#9E9A94] transition-colors">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#F5F4F2]">
          {topPhoto && (
            <Image
              src={topPhoto}
              alt={propiedad.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.classes}`}>
              {badge.label}
            </span>
          </div>
          {propiedad.certificacion_energetica && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: certColor(propiedad.certificacion_energetica) }}>
              {propiedad.certificacion_energetica}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-[#9E9A94] mb-1">{propiedad.ciudad} · {propiedad.barrio}</p>
          <h3 className="font-playfair text-base font-semibold text-[#0D0C0A] leading-snug mb-3 line-clamp-2">
            {propiedad.titulo}
          </h3>

          <div className="flex items-center gap-4 text-xs text-[#9E9A94] mb-4">
            <span className="flex items-center gap-1"><Square size={12} /> {propiedad.m2} m²</span>
            <span className="flex items-center gap-1"><Bed size={12} /> {propiedad.habitaciones} hab.</span>
            <span className="flex items-center gap-1"><Bath size={12} /> {propiedad.banos} baños</span>
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-[#F5F4F2]">
            <div>
              <p className="text-xs text-[#9E9A94] mb-0.5">Precio vivienda</p>
              <p className="font-playfair text-lg font-semibold text-[#0D0C0A]">
                {formatPrice(propiedad.precio_orientativo)}
              </p>
            </div>

            {propiedad.estado === "activa" && (
              <div className="text-right">
                {highestBid !== null && (
                  <p className="text-xs text-[#9E9A94] mb-0.5">
                    Puja más alta: <span className="text-[#C9993A] font-medium">{highestBid}%</span>
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-[#9E9A94]">
                  <Clock size={11} />
                  <CountdownTimer endDate={propiedad.fecha_fin_puja} compact />
                </div>
              </div>
            )}

            {propiedad.estado === "proximamente" && (
              <p className="text-xs text-[#9E9A94]">Abre pronto</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function certColor(cert: string): string {
  const colors: Record<string, string> = {
    A: "#16a34a", B: "#65a30d", C: "#ca8a04",
    D: "#ea580c", E: "#dc2626", F: "#b91c1c", G: "#7f1d1d",
  };
  return colors[cert] ?? "#9E9A94";
}
