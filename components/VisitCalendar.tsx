"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

const SLOTS = ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00"];

type Props = { position: number };

export default function VisitCalendar({ position }: Props) {
  const [selected, setSelected] = useState<{ day: number; slot: string } | null>(null);

  const base = addDays(new Date(), 1);
  const days = Array.from({ length: 7 }, (_, i) => addDays(base, i));

  // Slots taken by higher-ranked buyers
  const takenSlots = (dayIdx: number): number => Math.max(0, position - 1 - dayIdx * 2);

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#0D0C0A] uppercase tracking-wider mb-4">
        Disponibilidad de visitas
      </h3>
      <p className="text-xs text-[#9E9A94] mb-4">
        Los slots se asignan por orden de posición en el ranking.
        Tu posición #{position} tiene prioridad sobre compradores posteriores.
      </p>

      <div className="space-y-2">
        {days.map((day, di) => {
          const taken = takenSlots(di);
          const dayLabel = format(day, "EEE d MMM", { locale: es });

          return (
            <div key={di} className="border border-[#E8E6E2] rounded-lg p-3">
              <p className="text-xs font-medium text-[#0D0C0A] mb-2 capitalize">{dayLabel}</p>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((slot, si) => {
                  const isBlocked = si < taken;
                  const isSelected = selected?.day === di && selected?.slot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={isBlocked}
                      onClick={() => setSelected({ day: di, slot })}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        isBlocked
                          ? "border-[#F5F4F2] text-[#E8E6E2] cursor-not-allowed"
                          : isSelected
                          ? "border-[#C9993A] bg-[#C9993A] text-white"
                          : "border-[#E8E6E2] text-[#0D0C0A] hover:border-[#9E9A94]"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 bg-[#F5F4F2] rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#9E9A94]">Visita seleccionada</p>
            <p className="text-sm font-medium text-[#0D0C0A]">
              {format(days[selected.day], "EEEE d MMM", { locale: es })} a las {selected.slot}
            </p>
          </div>
          <button className="text-xs font-medium text-white bg-[#0D0C0A] px-3 py-1.5 rounded-lg hover:bg-[#C9993A] transition-colors">
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
}
