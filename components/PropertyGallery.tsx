"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { FotoZona } from "@/lib/demo-data";

type Props = { fotos: FotoZona[] };

export default function PropertyGallery({ fotos }: Props) {
  const [activeZona, setActiveZona] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState<{ zona: number; photo: number } | null>(null);

  const currentZona = fotos[activeZona];
  const allUrls = currentZona?.urls ?? [];

  useEffect(() => {
    setActivePhoto(0);
  }, [activeZona]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function nextPhoto() {
    if (!lightbox) return;
    const zona = fotos[lightbox.zona];
    setLightbox({ zona: lightbox.zona, photo: (lightbox.photo + 1) % zona.urls.length });
  }

  function prevPhoto() {
    if (!lightbox) return;
    const zona = fotos[lightbox.zona];
    setLightbox({ zona: lightbox.zona, photo: (lightbox.photo - 1 + zona.urls.length) % zona.urls.length });
  }

  return (
    <>
      {/* Zone tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {fotos.map((zona, i) => (
          <button
            key={zona.zona}
            onClick={() => setActiveZona(i)}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeZona === i
                ? "border-[#0D0C0A] bg-[#0D0C0A] text-white"
                : "border-[#E8E6E2] text-[#9E9A94] hover:border-[#9E9A94]"
            }`}
          >
            {zona.zona}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative h-80 md:h-96 rounded-lg overflow-hidden bg-[#F5F4F2] cursor-zoom-in"
        onClick={() => setLightbox({ zona: activeZona, photo: activePhoto })}
      >
        {allUrls[activePhoto] && (
          <Image
            src={allUrls[activePhoto]}
            alt={`${currentZona.zona} ${activePhoto + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
            priority
          />
        )}
        {allUrls.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActivePhoto((p) => (p - 1 + allUrls.length) % allUrls.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActivePhoto((p) => (p + 1) % allUrls.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Foto siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {activePhoto + 1} / {allUrls.length}
        </div>
      </div>

      {/* Thumbnails */}
      {allUrls.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {allUrls.map((url, i) => (
            <button
              key={url}
              onClick={() => setActivePhoto(i)}
              className={`flex-shrink-0 relative w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                activePhoto === i ? "border-[#C9993A]" : "border-transparent"
              }`}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            aria-label="Anterior"
          >
            <ChevronLeft size={32} />
          </button>
          <div
            className="relative w-full max-w-4xl h-[70vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            {fotos[lightbox.zona]?.urls[lightbox.photo] && (
              <Image
                src={fotos[lightbox.zona].urls[lightbox.photo]}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
              />
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
            aria-label="Siguiente"
          >
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {fotos[lightbox.zona]?.zona} · {lightbox.photo + 1} / {fotos[lightbox.zona]?.urls.length}
          </div>
        </div>
      )}
    </>
  );
}
