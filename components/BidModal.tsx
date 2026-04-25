"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Bell, ChevronRight } from "lucide-react";
import { Propiedad, formatPrice, calcComision } from "@/lib/demo-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = {
  propiedad: Propiedad;
  bidPct: number;
  estimatedPosition: number;
  onClose: () => void;
  onConfirm: (name: string, email: string) => void;
};

type Step = 1 | 2 | 3;

export default function BidModal({ propiedad, bidPct, estimatedPosition, onClose, onConfirm }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [accepted, setAccepted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(false);

  const myComision = calcComision(propiedad.precio_orientativo, bidPct);
  const today = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });

  function handleSign() {
    if (!accepted || !name.trim()) return;
    setStep(3);
    onConfirm(name, email);
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E6E2]">
          <div className="flex items-center gap-3">
            {/* Step dots */}
            {([1, 2, 3] as Step[]).map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s === step ? "bg-[#C9993A]" : s < step ? "bg-[#0D0C0A]" : "bg-[#E8E6E2]"
                }`}
              />
            ))}
            <span className="text-xs text-[#9E9A94] ml-1">Paso {step} de 3</span>
          </div>
          <button onClick={onClose} className="text-[#9E9A94] hover:text-[#0D0C0A] transition-colors" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              <div>
                <h2 className="font-playfair text-2xl font-semibold text-[#0D0C0A] mb-1">
                  Confirmar puja
                </h2>
                <p className="text-sm text-[#9E9A94]">Revisa los detalles antes de continuar</p>
              </div>

              <div className="bg-[#F5F4F2] rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-[#9E9A94] mb-0.5">Propiedad</p>
                  <p className="text-sm font-medium text-[#0D0C0A] leading-snug">{propiedad.titulo}</p>
                  <p className="text-xs text-[#9E9A94]">{propiedad.ciudad} · {propiedad.barrio}</p>
                </div>
                <div className="border-t border-[#E8E6E2] pt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#9E9A94] mb-0.5">Tu puja</p>
                    <p className="text-xl font-playfair font-semibold text-[#C9993A]">{bidPct}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9E9A94] mb-0.5">Tu comisión</p>
                    <p className="text-xl font-playfair font-semibold text-[#0D0C0A]">{formatPrice(myComision)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9E9A94] mb-0.5">Posición estimada</p>
                    <p className="text-xl font-playfair font-semibold text-[#0D0C0A]">#{estimatedPosition}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9E9A94] mb-0.5">Precio orientativo</p>
                    <p className="text-sm font-medium text-[#0D0C0A]">{formatPrice(propiedad.precio_orientativo)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#0D0C0A] text-white py-3.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#C9993A] transition-colors"
              >
                Confirmar y continuar
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              <div>
                <h2 className="font-playfair text-2xl font-semibold text-[#0D0C0A] mb-1">
                  Preacuerdo legal
                </h2>
                <p className="text-sm text-[#9E9A94]">Lee y firma para confirmar tu puja</p>
              </div>

              <div className="bg-[#F5F4F2] rounded-lg p-4 text-sm text-[#0D0C0A] leading-relaxed space-y-3 max-h-48 overflow-y-auto">
                <p>
                  El presente preacuerdo se establece entre <strong>Bidify</strong> y el comprador interesado en
                  la propiedad <em>{propiedad.titulo}</em>, ubicada en {propiedad.ciudad}.
                </p>
                <p>
                  Al firmar este documento, el comprador se compromete a:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>Abonar una comisión del <strong>{bidPct}%</strong> ({formatPrice(myComision)}) sobre el precio de venta en caso de efectuarse la compraventa.</li>
                  <li>Realizar la transacción exclusivamente a través de la plataforma Bidify.</li>
                  <li>Asistir a la visita en la fecha asignada según su posición en el ranking.</li>
                  <li>Mantener la confidencialidad sobre las pujas de otros compradores.</li>
                </ul>
                <p className="text-[#9E9A94] text-xs">
                  Este preacuerdo no implica obligación de compra. Solo se activa en caso de acuerdo mutuo entre comprador y vendedor.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#9E9A94] uppercase tracking-wider block mb-1.5">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre y apellidos"
                    className="w-full border border-[#E8E6E2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0D0C0A] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#9E9A94] uppercase tracking-wider block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full border border-[#E8E6E2] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#0D0C0A] transition-colors"
                  />
                </div>
                <div className="text-xs text-[#9E9A94]">Fecha: {today}</div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        accepted ? "bg-[#0D0C0A] border-[#0D0C0A]" : "border-[#E8E6E2]"
                      }`}
                    >
                      {accepted && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className="text-sm text-[#0D0C0A]">
                    He leído y acepto el preacuerdo legal de Bidify
                  </span>
                </label>
              </div>

              <button
                onClick={handleSign}
                disabled={!accepted || !name.trim()}
                className="w-full bg-[#0D0C0A] text-white py-3.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#C9993A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Firmar y pujar
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-6 space-y-6 text-center"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-[#FDF8F0] border-2 border-[#C9993A] flex items-center justify-center"
                >
                  <Check size={36} className="text-[#C9993A]" strokeWidth={2.5} />
                </motion.div>
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-semibold text-[#0D0C0A] mb-2">
                  ¡Estás en el ranking!
                </h2>
                <p className="text-sm text-[#9E9A94]">
                  Tu puja del <strong className="text-[#C9993A]">{bidPct}%</strong> ha sido registrada.
                </p>
                <div className="mt-4 bg-[#F5F4F2] rounded-lg py-4 px-6 inline-block">
                  <p className="text-xs text-[#9E9A94] mb-1">Tu posición</p>
                  <p className="font-playfair text-4xl font-semibold text-[#0D0C0A]">
                    #{estimatedPosition}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#9E9A94]">
                Hemos enviado un resumen a {email || "tu correo"}.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setAlertEnabled(!alertEnabled)}
                  className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border transition-colors ${
                    alertEnabled
                      ? "bg-[#0D0C0A] text-white border-[#0D0C0A]"
                      : "border-[#E8E6E2] text-[#0D0C0A] hover:border-[#0D0C0A]"
                  }`}
                >
                  <Bell size={15} />
                  {alertEnabled ? "Alertas activadas" : "Activar alerta si me superan"}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-lg text-sm font-medium text-[#9E9A94] hover:text-[#0D0C0A] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
