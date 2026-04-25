"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E6E2]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-playfair text-2xl font-semibold tracking-tight"
            style={{ color: "#C9993A" }}
          >
            Bidify
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/propiedades"
            className={`text-sm font-medium transition-colors hover:text-[#0D0C0A] ${
              pathname.startsWith("/propiedades")
                ? "text-[#0D0C0A]"
                : "text-[#9E9A94]"
            }`}
          >
            Propiedades
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-[#0D0C0A] ${
              pathname === "/dashboard" ? "text-[#0D0C0A]" : "text-[#9E9A94]"
            }`}
          >
            Panel vendedor
          </Link>
          <Link
            href="/propiedades"
            className="text-sm font-medium px-4 py-2 border border-[#0D0C0A] rounded-lg hover:bg-[#0D0C0A] hover:text-white transition-colors"
          >
            Ver propiedades
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E8E6E2] bg-white px-6 py-4 flex flex-col gap-4">
          <Link
            href="/propiedades"
            className="text-sm font-medium text-[#0D0C0A]"
            onClick={() => setOpen(false)}
          >
            Propiedades
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#0D0C0A]"
            onClick={() => setOpen(false)}
          >
            Panel vendedor
          </Link>
          <Link
            href="/propiedades"
            className="text-sm font-medium px-4 py-2 border border-[#0D0C0A] rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Ver propiedades
          </Link>
        </div>
      )}
    </header>
  );
}
