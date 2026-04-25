import Link from "next/link";
import { ArrowRight, TrendingDown, CheckCircle, Clock, Shield } from "lucide-react";
import { propiedades } from "@/lib/demo-data";
import PropertyCard from "@/components/PropertyCard";

const steps = [
  {
    num: "01",
    title: "Pujas en tiempo real",
    desc: "Los compradores pujan por la comisión que están dispuestos a pagar. Tú eliges cuánto vale el servicio.",
  },
  {
    num: "02",
    title: "Visitas por orden de puja",
    desc: "Quienes más pujan tienen prioridad de visita. Más interés, más opciones para el vendedor.",
  },
  {
    num: "03",
    title: "Arras y contrato",
    desc: "Cuando se llega a acuerdo, gestionamos el contrato de arras con asesoría legal incluida.",
  },
  {
    num: "04",
    title: "Firma ante notario",
    desc: "Acompañamos la operación hasta la firma notarial. Todo transparente, todo registrado.",
  },
];

const comisionRows = [
  { concepto: "Comisión comprador", bidify: "1% – 3%", tradicional: "3% – 6%" },
  { concepto: "Comisión vendedor", bidify: "1% – 3%", tradicional: "3% – 6%" },
  { concepto: "Transparencia de precio", bidify: "Total", tradicional: "Ninguna" },
  { concepto: "Asesoría legal incluida", bidify: "Sí", tradicional: "Coste adicional" },
  { concepto: "Ahorro medio en piso de 300k", bidify: "hasta 18.000€", tradicional: "—" },
];

export default function HomePage() {
  const featuredProps = propiedades.filter((p) => p.estado === "activa").slice(0, 3);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-28 md:py-36">
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-6">
            La revolución inmobiliaria
          </p>
          <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-[#0D0C0A] leading-[1.05] mb-8">
            La primera inmobiliaria donde tú decides lo que pagas
          </h1>
          <p className="text-lg md:text-xl text-[#9E9A94] font-light leading-relaxed mb-12 max-w-2xl">
            La comisión la decide el mercado mediante un sistema de pujas transparente.
            Compra y vende propiedades en Andalucía con comisiones reales, no impuestas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 bg-[#0D0C0A] text-white px-8 py-4 rounded-lg text-sm font-medium hover:bg-[#C9993A] transition-colors"
            >
              Ver propiedades
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-[#E8E6E2] text-[#0D0C0A] px-8 py-4 rounded-lg text-sm font-medium hover:border-[#0D0C0A] transition-colors"
            >
              Vender mi propiedad
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-[#E8E6E2] grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1–3%", label: "Comisión de mercado" },
            { value: "6+", label: "Propiedades activas" },
            { value: "18.000€", label: "Ahorro medio por operación" },
            { value: "100%", label: "Transparencia en precios" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-playfair text-3xl font-semibold text-[#C9993A]">{s.value}</div>
              <div className="text-sm text-[#9E9A94] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F5F4F2] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-4">
              El proceso
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#0D0C0A]">
              Cómo funciona Bidify
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num}>
                <div className="font-playfair text-5xl font-semibold text-[#E8E6E2] mb-4 leading-none">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-[#0D0C0A] mb-2">{step.title}</h3>
                <p className="text-sm text-[#9E9A94] leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission comparison */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-4">
              Comparativa
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#0D0C0A]">
              Lo que pagas en Bidify vs. lo de siempre
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E6E2]">
                  <th className="text-left py-4 text-sm font-medium text-[#9E9A94] w-1/2">Concepto</th>
                  <th className="text-left py-4 text-sm font-semibold text-[#C9993A]">Bidify</th>
                  <th className="text-left py-4 text-sm font-medium text-[#9E9A94]">Inmobiliaria tradicional</th>
                </tr>
              </thead>
              <tbody>
                {comisionRows.map((row) => (
                  <tr key={row.concepto} className="border-b border-[#F5F4F2]">
                    <td className="py-4 text-sm text-[#0D0C0A]">{row.concepto}</td>
                    <td className="py-4 text-sm font-medium text-[#0D0C0A]">{row.bidify}</td>
                    <td className="py-4 text-sm text-[#9E9A94]">{row.tradicional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 p-8 border border-[#E8E6E2] rounded-lg bg-[#F5F4F2]">
            <p className="text-sm text-[#9E9A94] mb-4 font-medium">Ejemplo real — Piso de 285.000€</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#9E9A94] uppercase tracking-wider mb-1">Comisión Bidify (2%)</p>
                <p className="font-playfair text-3xl font-semibold text-[#0D0C0A]">5.700€</p>
                <p className="text-xs text-[#9E9A94] mt-1">Cada parte</p>
              </div>
              <div>
                <p className="text-xs text-[#9E9A94] uppercase tracking-wider mb-1">Comisión tradicional (5%)</p>
                <p className="font-playfair text-3xl font-semibold text-[#9E9A94] line-through">14.250€</p>
                <p className="text-xs text-[#9E9A94] mt-1">Cada parte</p>
              </div>
              <div>
                <p className="text-xs text-[#9E9A94] uppercase tracking-wider mb-1">Tu ahorro total</p>
                <p className="font-playfair text-3xl font-semibold text-green-600">17.100€</p>
                <p className="text-xs text-[#9E9A94] mt-1">Por operación</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bidify */}
      <section className="bg-[#F5F4F2] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-4">
              Ventajas
            </p>
            <h2 className="font-playfair text-4xl font-semibold text-[#0D0C0A]">
              Por qué elegir Bidify
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingDown, title: "Comisión justa", desc: "El mercado decide, no nosotros. Pujas entre 1% y 3% frente al 5-6% habitual." },
              { icon: CheckCircle, title: "Transparencia total", desc: "Ranking de pujas visible en tiempo real. Sin sorpresas, sin letra pequeña." },
              { icon: Clock, title: "Proceso ágil", desc: "De publicación a firma notarial en semanas, no meses. Todo en un solo lugar." },
              { icon: Shield, title: "Seguridad jurídica", desc: "Preacuerdo legal digital, servicio notarial incluido y protección para ambas partes." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#E8E6E2] rounded-lg p-6">
                <Icon size={24} className="text-[#C9993A] mb-4" />
                <h3 className="font-semibold text-[#0D0C0A] mb-2">{title}</h3>
                <p className="text-sm text-[#9E9A94] leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-[#C9993A] mb-4">
                Subastas activas
              </p>
              <h2 className="font-playfair text-4xl font-semibold text-[#0D0C0A]">
                Propiedades con puja abierta
              </h2>
            </div>
            <Link
              href="/propiedades"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[#9E9A94] hover:text-[#0D0C0A] transition-colors"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProps.map((p) => (
              <PropertyCard key={p.id} propiedad={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#E8E6E2]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#0D0C0A] mb-6">
            ¿Listo para pagar menos comisión?
          </h2>
          <p className="text-lg text-[#9E9A94] font-light mb-10 max-w-xl mx-auto">
            Únete a cientos de compradores y vendedores que ya confían en el mercado para fijar comisiones justas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 bg-[#C9993A] text-white px-8 py-4 rounded-lg text-sm font-medium hover:bg-[#b8882e] transition-colors"
            >
              Explorar propiedades
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-[#E8E6E2] text-[#0D0C0A] px-8 py-4 rounded-lg text-sm font-medium hover:border-[#0D0C0A] transition-colors"
            >
              Publicar mi propiedad
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E6E2] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-playfair text-xl font-semibold text-[#C9993A]">Bidify</span>
          <p className="text-xs text-[#9E9A94]">
            © 2025 Bidify. La primera inmobiliaria donde tú decides lo que pagas.
          </p>
          <div className="flex gap-6 text-xs text-[#9E9A94]">
            <a href="#" className="hover:text-[#0D0C0A] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#0D0C0A] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#0D0C0A] transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
