import { notFound } from "next/navigation";
import { propiedades, getPropiedadBySlug } from "@/lib/demo-data";
import PropertyDetailClient from "./PropertyDetailClient";

export async function generateStaticParams() {
  return propiedades.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPropiedadBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.titulo} — Bidify`,
    description: p.descripcion.slice(0, 160),
  };
}

export default async function PropiedadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const propiedad = getPropiedadBySlug(slug);
  if (!propiedad) notFound();
  return <PropertyDetailClient propiedad={propiedad} />;
}
