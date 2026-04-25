"use client";

import { useCallback } from "react";
import { formatPrice, calcComision, BID_STEPS } from "@/lib/demo-data";

const MIN = BID_STEPS[0];                       // 0.15
const MAX = BID_STEPS[BID_STEPS.length - 1];    // 3.00
const RANGE = MAX - MIN;                         // 2.85

// Labels shown below the slider (just 5 reference points to avoid clutter)
const LABELS = [0.15, 0.75, 1.50, 2.25, 3.00];

type Props = {
  value: number;
  onChange: (v: number) => void;
  precio: number;
  takenPcts?: number[]; // percentages already bid by others
};

export default function BidSlider({ value, onChange, precio, takenPcts = [] }: Props) {
  const miComision = calcComision(precio, value);
  const vendedorComision = calcComision(precio, value);
  const totalComision = miComision + vendedorComision;
  const tradicional = calcComision(precio, 5) * 2;
  const ahorro = tradicional - totalComision;

  const isTaken = (pct: number) => takenPcts.includes(pct);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseFloat(e.target.value);
      // Snap to nearest BID_STEP
      const snapped = BID_STEPS.reduce((prev, curr) =>
        Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev
      );
      onChange(snapped);
    },
    [onChange]
  );

  const pct = ((value - MIN) / RANGE) * 100;

  return (
    <div className="space-y-5">
      {/* Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-[#9E9A94] uppercase tracking-wider">Tu comisión</span>
          <span className="font-playfair text-2xl font-semibold text-[#C9993A]">
            {value.toFixed(2).replace(".", ",")}%
          </span>
        </div>

        <div className="relative py-2.5">
          {/* Track */}
          <div className="h-0.5 bg-[#E8E6E2] rounded-full">
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C9993A] rounded-full transition-all duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Taken marks */}
          {takenPcts.map((p) => (
            <div
              key={p}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#E8E6E2] border border-[#9E9A94]/40 pointer-events-none"
              style={{ left: `calc(${((p - MIN) / RANGE) * 100}% - 3px)` }}
            />
          ))}
          {/* Invisible range input */}
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={0.15}
            value={value}
            onChange={handleChange}
            aria-label="Porcentaje de comisión"
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={value}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ margin: 0, height: "100%" }}
          />
          {/* Visible thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#C9993A] border-2 border-white shadow-[0_0_0_2px_#C9993A] transition-all duration-150 pointer-events-none"
            style={{ left: `calc(${pct}% - 10px)` }}
          />
        </div>

        {/* Reference labels */}
        <div className="flex justify-between mt-1">
          {LABELS.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`text-[11px] transition-colors ${
                value === p
                  ? "text-[#C9993A] font-medium"
                  : isTaken(p)
                  ? "text-[#E8E6E2] cursor-not-allowed"
                  : "text-[#9E9A94] hover:text-[#0D0C0A]"
              }`}
              disabled={isTaken(p)}
            >
              {p.toFixed(2).replace(".", ",")}%
            </button>
          ))}
        </div>
      </div>

      {/* Calculations */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-[#9E9A94]">Lo que pagarías tú</span>
          <span className="font-medium text-[#0D0C0A] tabular-nums">{formatPrice(miComision)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#9E9A94]">Lo que paga el vendedor</span>
          <span className="font-medium text-[#0D0C0A] tabular-nums">{formatPrice(vendedorComision)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[#F5F4F2]">
          <span className="text-[#9E9A94]">Comisión total</span>
          <span className="font-semibold text-[#0D0C0A] tabular-nums">{formatPrice(totalComision)}</span>
        </div>
      </div>

      {/* Savings */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
        <p className="text-xs text-[#9E9A94] mb-1">vs. inmobiliaria tradicional (5% por parte)</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#9E9A94]">Comisión típica</span>
          <span className="text-xs text-[#9E9A94] line-through tabular-nums">{formatPrice(tradicional)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-semibold text-green-700">Ahorras</span>
          <span className="text-sm font-bold text-green-700 tabular-nums">{formatPrice(ahorro)}</span>
        </div>
      </div>
    </div>
  );
}
