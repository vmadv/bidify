"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Bed, Bath, Square, Calendar, Zap, MapPin, Play,
  Users, Gavel, ArrowLeft, AlertTriangle, Clock,
} from "lucide-react";
import Link from "next/link";
import { Propiedad, formatPrice } from "@/lib/demo-data";
import PropertyGallery from "@/components/PropertyGallery";
import BidSlider from "@/components/BidSlider";
import BidRanking from "@/components/BidRanking";
import BidModal from "@/components/BidModal";
import ProcessTimeline from "@/components/ProcessTimeline";
import CountdownTimer from "@/components/CountdownTimer";
import VisitCalendar from "@/components/VisitCalendar";

type Props = { propiedad: Propiedad };

const certColors: Record<string, string> = {
  A: "#16a34a", B: "#65a30d", C: "#ca8a04",
  D: "#ea580c", E: "#dc2626", F: "#b91c1c", G: "#7f1d1d",
};

export default function PropertyDetailClient({ propiedad }: Props) {
  const [bidPct, setBidPct] = useState(1.5);
  const [modalOpen, setModalOpen] = useState(false);
  const [myBid, setMyBid] = useState<number | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [takenPcts, setTakenPcts] = useState<number[]>([]);
  const mobileBidPanelRef = useRef<HTMLDivElement>(null);

  const isActive = propiedad.estado === "activa";
  const isClosed = propiedad.estado === "vendida";
  const isSoon = propiedad.estado === "proximamente";

  const daysLeft = isActive
    ? Math.max(0, Math.ceil((new Date(propiedad.fecha_fin_puja).getTime() - Date.now()) / 86400000))
    : null;
  const topBidPct = propiedad.pujas_demo[0]?.porcentaje ?? null;

  function estimatePosition(pct: number): number {
    return propiedad.pujas_demo.filter((b) => b.porcentaje > pct).length + 1;
  }

  function handleBidConfirm(_name: string, _email: string) {
    const pos = estimatePosition(bidPct);
    setMyBid(bidPct);
    setMyPosition(pos);
    setModalOpen(false);
    setTimeout(() => {
      setToast(`⚠ Te han superado. Ahora estás en la posición #${pos + 1}`);
      setTimeout(() => setToast(null), 5000);
    }, 15000);
  }

  return (
    <div className="pt-16 min-h-screen overflow-x-hidden">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/propiedades"
          className="inline-flex items-center gap-2 text-sm text-[#9E9A94] hover:text-[#0D0C0A] transition-colors"
        >
          <ArrowLeft size={14} />
          Todas las propiedades
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-28 lg:pb-20">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                isActive
                  ? "bg-[#0D0C0A] text-white"
                  : isClosed
                  ? "bg-[#E8E6E2] text-[#9E9A94]"
                  : "bg-[#F5F4F2] text-[#9E9A94] border border-[#E8E6E2]"
              }`}
            >
              {isActive ? "Puja activa" : isClosed ? "Vendida" : "Próximamente"}
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: certColors[propiedad.certificacion_energetica] }}
            >
              Cert. {propiedad.certificacion_energetica}
            </span>
            {isActive && daysLeft !== null && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0D0C0A] text-[#C9993A] border border-[#C9993A]/30">
                <Clock size={11} />
                {daysLeft === 0 ? "Cierra hoy" : daysLeft === 1 ? "Cierra mañana" : `${daysLeft} días restantes`}
              </span>
            )}
            {isActive && topBidPct !== null && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDF8F0] text-[#C9993A] border border-[#C9993A]/30">
                <Gavel size={11} />
                Puja máxima: {topBidPct.toFixed(2).replace(".", ",")}% comisión
              </span>
            )}
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#0D0C0A] mb-2 leading-tight">
            {propiedad.titulo}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-[#9E9A94]">
            <MapPin size={14} />
            {propiedad.barrio}, {propiedad.ciudad}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-10 bg-[#F5F4F2] rounded-lg p-5 overflow-x-auto">
          <ProcessTimeline currentStep={isActive ? 0 : isClosed ? 3 : 0} />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* ── Left column ── */}
          <div className="lg:col-span-3 space-y-12">
            {/* Gallery */}
            <section>
              <PropertyGallery fotos={propiedad.fotos} />
            </section>

            {/* Video */}
            {propiedad.video_url && (
              <section>
                <h2 className="font-playfair text-xl font-semibold text-[#0D0C0A] mb-4">
                  Tour virtual
                </h2>
                {videoOpen ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={`${propiedad.video_url}?autoplay=1`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title="Tour virtual"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#F5F4F2] flex items-center justify-center border border-[#E8E6E2] hover:border-[#9E9A94] transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#0D0C0A] group-hover:bg-[#C9993A] transition-colors flex items-center justify-center">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                    <span className="absolute bottom-4 text-sm text-[#9E9A94]">Ver tour virtual</span>
                  </button>
                )}
              </section>
            )}

            {/* Description */}
            <section>
              <h2 className="font-playfair text-xl font-semibold text-[#0D0C0A] mb-4">
                Descripción
              </h2>
              <div className="space-y-4 text-sm text-[#0D0C0A] leading-relaxed font-light">
                {propiedad.descripcion.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Specs */}
            <section>
              <h2 className="font-playfair text-xl font-semibold text-[#0D0C0A] mb-4">
                Ficha técnica
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Square, label: "Superficie", value: `${propiedad.m2} m²` },
                  { icon: Bed, label: "Habitaciones", value: String(propiedad.habitaciones) },
                  { icon: Bath, label: "Baños", value: String(propiedad.banos) },
                  { icon: MapPin, label: "Planta", value: propiedad.planta },
                  { icon: Calendar, label: "Construcción", value: String(propiedad.año_construccion) },
                  { icon: Zap, label: "Cert. energética", value: `Clase ${propiedad.certificacion_energetica}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#F5F4F2] rounded-lg p-4">
                    <Icon size={14} className="text-[#9E9A94] mb-2" />
                    <p className="text-[11px] text-[#9E9A94] mb-0.5 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium text-[#0D0C0A]">{value}</p>
                  </div>
                ))}
              </div>

              {propiedad.extras.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs text-[#9E9A94] uppercase tracking-wider mb-3">Extras</p>
                  <div className="flex flex-wrap gap-2">
                    {propiedad.extras.map((extra) => (
                      <span
                        key={extra}
                        className="text-xs border border-[#E8E6E2] px-3 py-1.5 rounded-full text-[#0D0C0A]"
                      >
                        {extra}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Map */}
            <section>
              <h2 className="font-playfair text-xl font-semibold text-[#0D0C0A] mb-4">
                Ubicación
              </h2>
              <div className="bg-[#F5F4F2] rounded-lg h-44 flex items-center justify-center border border-[#E8E6E2]">
                <div className="text-center">
                  <MapPin size={22} className="text-[#9E9A94] mx-auto mb-2" />
                  <p className="text-sm text-[#9E9A94]">{propiedad.barrio}, {propiedad.ciudad}</p>
                  <p className="text-xs text-[#9E9A94] mt-1">
                    Dirección exacta tras visita confirmada
                  </p>
                </div>
              </div>
            </section>

            {/* Mobile bid panel — slider + ranking + CTA */}
            {isActive && (
              <section ref={mobileBidPanelRef} className="lg:hidden space-y-5">
                <div className="bg-white border border-[#E8E6E2] rounded-lg overflow-hidden">
                  <div className="bg-[#0D0C0A] px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-white/50 mb-1">
                        Subasta activa
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#C9993A] animate-pulse" />
                        <span className="text-sm text-white font-medium">
                          <CountdownTimer endDate={propiedad.fecha_fin_puja} compact />
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 mb-0.5">Compradores</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Users size={13} className="text-white/50" />
                        <span className="text-sm font-medium text-white">
                          {propiedad.pujas_demo.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-5">
                    <BidSlider
                      value={bidPct}
                      onChange={setBidPct}
                      precio={propiedad.precio_orientativo}
                      takenPcts={takenPcts}
                    />
                    {myBid !== null ? (
                      <div className="space-y-3">
                        <div className="bg-[#FDF8F0] border border-[#C9993A]/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-[#9E9A94] mb-0.5">Tu puja activa</p>
                          <p className="font-playfair text-2xl font-semibold text-[#C9993A]">{myBid}%</p>
                          {myPosition && (
                            <p className="text-xs text-[#9E9A94] mt-0.5">Posición #{myPosition}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="w-full border border-[#0D0C0A] text-[#0D0C0A] py-3.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#0D0C0A] hover:text-white transition-colors"
                        >
                          <Gavel size={14} />
                          Actualizar puja
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="w-full bg-[#C9993A] text-white py-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#b8882e] transition-colors"
                      >
                        <Gavel size={15} />
                        Pujar ahora →
                      </button>
                    )}
                  </div>
                </div>
                <BidRanking
                  initialBids={propiedad.pujas_demo}
                  myBid={myBid}
                  isActive={isActive}
                  onTakenPcts={setTakenPcts}
                />
              </section>
            )}
            {!isActive && myBid !== null && (
              <section className="lg:hidden">
                <BidRanking
                  initialBids={propiedad.pujas_demo}
                  myBid={myBid}
                  isActive={isActive}
                  onTakenPcts={setTakenPcts}
                />
              </section>
            )}

            {/* Visit calendar after bidding */}
            {myBid !== null && myPosition !== null && (
              <section>
                <VisitCalendar position={myPosition} />
              </section>
            )}
          </div>

          {/* ── Right column — sticky bid panel ── */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Price card */}
              <div className="bg-white border border-[#E8E6E2] rounded-lg p-5">
                <p className="text-[11px] text-[#9E9A94] uppercase tracking-wider mb-1">
                  Precio orientativo
                </p>
                <p className="font-playfair text-3xl font-semibold text-[#0D0C0A]">
                  {formatPrice(propiedad.precio_orientativo)}
                </p>
              </div>

              {/* Active auction panel */}
              {isActive && (
                <div className="bg-white border border-[#E8E6E2] rounded-lg overflow-hidden">
                  <div className="bg-[#0D0C0A] px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-white/50 mb-1">
                        Subasta activa
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#C9993A] animate-pulse" />
                        <span className="text-sm text-white font-medium">
                          <CountdownTimer endDate={propiedad.fecha_fin_puja} compact />
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 mb-0.5">Compradores</p>
                      <div className="flex items-center gap-1 justify-end">
                        <Users size={13} className="text-white/50" />
                        <span className="text-sm font-medium text-white">
                          {propiedad.pujas_demo.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    <BidSlider
                      value={bidPct}
                      onChange={setBidPct}
                      precio={propiedad.precio_orientativo}
                      takenPcts={takenPcts}
                    />

                    {myBid !== null ? (
                      <div className="space-y-3">
                        <div className="bg-[#FDF8F0] border border-[#C9993A]/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-[#9E9A94] mb-0.5">Tu puja activa</p>
                          <p className="font-playfair text-2xl font-semibold text-[#C9993A]">
                            {myBid}%
                          </p>
                          {myPosition && (
                            <p className="text-xs text-[#9E9A94] mt-0.5">
                              Posición #{myPosition}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="w-full border border-[#0D0C0A] text-[#0D0C0A] py-3.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#0D0C0A] hover:text-white transition-colors"
                        >
                          <Gavel size={14} />
                          Actualizar puja
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="w-full bg-[#C9993A] text-white py-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#b8882e] transition-colors"
                      >
                        <Gavel size={15} />
                        Pujar ahora →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isSoon && (
                <div className="bg-[#F5F4F2] border border-[#E8E6E2] rounded-lg p-6 text-center">
                  <Calendar size={22} className="text-[#9E9A94] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#0D0C0A] mb-1">
                    La puja aún no ha abierto
                  </p>
                  <p className="text-xs text-[#9E9A94] mb-4">
                    Recibirás un aviso cuando comience
                  </p>
                  <button className="text-xs font-medium border border-[#E8E6E2] px-4 py-2 rounded-lg hover:border-[#0D0C0A] transition-colors">
                    Avisarme cuando abra
                  </button>
                </div>
              )}

              {isClosed && (
                <div className="bg-[#F5F4F2] border border-[#E8E6E2] rounded-lg p-5 text-center">
                  <p className="text-sm text-[#9E9A94]">Esta propiedad ya ha sido vendida</p>
                </div>
              )}

              {/* Ranking — desktop */}
              <div className="hidden lg:block">
                <BidRanking
                  initialBids={propiedad.pujas_demo}
                  myBid={myBid}
                  isActive={isActive}
                  onTakenPcts={setTakenPcts}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating CTA — scrolls to bid panel first */}
      {isActive && myBid === null && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[#E8E6E2] px-4 py-3">
          <button
            onClick={() => mobileBidPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="w-full bg-[#C9993A] text-white py-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Gavel size={15} />
            Ver subasta y pujar →
          </button>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#0D0C0A] text-white text-sm px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-40 whitespace-nowrap">
          <AlertTriangle size={14} className="text-[#C9993A]" />
          {toast}
        </div>
      )}

      {/* Bid modal */}
      <AnimatePresence>
        {modalOpen && (
          <BidModal
            propiedad={propiedad}
            bidPct={bidPct}
            estimatedPosition={estimatePosition(bidPct)}
            onClose={() => setModalOpen(false)}
            onConfirm={handleBidConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
