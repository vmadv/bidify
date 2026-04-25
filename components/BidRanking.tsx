"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PujaDemo, BID_STEPS } from "@/lib/demo-data";

const NOMBRES = [
  "Usuario_482", "Usuario_119", "Usuario_307", "Usuario_055",
  "Usuario_891", "Usuario_234", "Usuario_673", "Usuario_418",
  "Usuario_552", "Usuario_029", "Usuario_774", "Usuario_336",
  "Usuario_907", "Usuario_143", "Usuario_688", "Usuario_821",
  "Usuario_365", "Usuario_512", "Usuario_047", "Usuario_999",
  "Usuario_163", "Usuario_740", "Usuario_285", "Usuario_614",
];

function nextVisitDate(base: Date, position: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + position);
  return d;
}

type BidRow = PujaDemo & { id: string; visitDate: Date };

type Props = {
  initialBids: PujaDemo[];
  myBid: number | null;
  isActive: boolean;
  onTakenPcts?: (pcts: number[]) => void;
};

export default function BidRanking({ initialBids, myBid, isActive, onTakenPcts }: Props) {
  const visitBase = new Date();
  visitBase.setDate(visitBase.getDate() + 1);

  function buildRows(bids: PujaDemo[]): BidRow[] {
    // Enforce uniqueness: keep only the latest bid per percentage slot
    const byPct = new Map<number, PujaDemo>();
    for (const bid of bids) {
      const existing = byPct.get(bid.porcentaje);
      if (!existing || new Date(bid.timestamp) > new Date(existing.timestamp)) {
        byPct.set(bid.porcentaje, bid);
      }
    }
    const unique = [...byPct.values()].sort((a, b) => b.porcentaje - a.porcentaje);
    return unique.map((bid, i) => ({
      ...bid,
      id: `${bid.usuario}-${bid.porcentaje}`,
      visitDate: nextVisitDate(visitBase, i),
    }));
  }

  const [rows, setRows] = useState<BidRow[]>(() => buildRows(initialBids));
  const [newRowId, setNewRowId] = useState<string | null>(null);
  const prevMyBidRef = useRef(myBid);

  // Notify parent of taken percentages so BidSlider can show them
  useEffect(() => {
    const taken = rows
      .filter((r) => r.usuario !== "Tú")
      .map((r) => r.porcentaje);
    onTakenPcts?.(taken);
  }, [rows, onTakenPcts]);

  // Live simulation: new user picks an available percentage every 8–12s
  useEffect(() => {
    if (!isActive) return;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      setRows((prev) => {
        const usedNames = new Set(prev.map((r) => r.usuario));
        const usedPcts = new Set(prev.map((r) => r.porcentaje));
        const availableNames = NOMBRES.filter((n) => !usedNames.has(n));
        const availablePcts = BID_STEPS.filter((p) => !usedPcts.has(p));

        if (availableNames.length === 0 || availablePcts.length === 0) return prev;

        const usuario = availableNames[Math.floor(Math.random() * availableNames.length)];
        // Bias toward higher percentages: pick from top half 70% of the time
        const pool =
          Math.random() < 0.7
            ? availablePcts.slice(Math.floor(availablePcts.length / 2))
            : availablePcts;
        const porcentaje = pool[Math.floor(Math.random() * pool.length)];

        const newBid: PujaDemo = { usuario, porcentaje, timestamp: new Date().toISOString() };
        const newId = `${usuario}-${porcentaje}`;
        setNewRowId(newId);
        setTimeout(() => setNewRowId(null), 700);

        const current = prev.map(({ id: _id, visitDate: _v, ...b }) => b as PujaDemo);
        return buildRows([...current, newBid]);
      });
      timeout = setTimeout(tick, Math.random() * 4000 + 8000);
    };

    timeout = setTimeout(tick, Math.random() * 4000 + 8000);
    return () => clearTimeout(timeout);
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync when myBid changes
  useEffect(() => {
    if (myBid === prevMyBidRef.current) return;
    prevMyBidRef.current = myBid;
    setRows((prev) => {
      const withoutMe = prev
        .filter((r) => r.usuario !== "Tú")
        .map(({ id: _id, visitDate: _v, ...b }) => b as PujaDemo);
      if (myBid === null) return buildRows(withoutMe);
      const myEntry: PujaDemo = { usuario: "Tú", porcentaje: myBid, timestamp: new Date().toISOString() };
      return buildRows([...withoutMe, myEntry]);
    });
  }, [myBid]); // eslint-disable-line react-hooks/exhaustive-deps

  const myPosition = rows.findIndex((r) => r.usuario === "Tú") + 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#0D0C0A] uppercase tracking-wider">
          Ranking actual
        </h3>
        {myPosition > 0 && (
          <span className="text-xs text-[#C9993A] font-medium">
            Tu posición: #{myPosition}
          </span>
        )}
      </div>

      <div className="border border-[#E8E6E2] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E6E2] bg-[#F5F4F2]">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-[#9E9A94] w-8">#</th>
              <th className="text-left py-2.5 px-2 text-xs font-medium text-[#9E9A94]">Comprador</th>
              <th className="text-right py-2.5 px-2 text-xs font-medium text-[#9E9A94]">Puja</th>
              <th className="text-right py-2.5 px-4 text-xs font-medium text-[#9E9A94] hidden md:table-cell">Visita</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 12).map((row, i) => {
              const isMe = row.usuario === "Tú";
              const isFirst = i === 0;
              const isAnimating = row.id === newRowId;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-[#F5F4F2] last:border-0 transition-colors ${
                    isMe ? "bg-[#FDF8F0]" : "hover:bg-[#F5F4F2]"
                  } ${isAnimating ? "ranking-row-enter" : ""}`}
                >
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold ${isFirst ? "text-[#C9993A]" : "text-[#9E9A94]"}`}>
                      #{i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isMe ? "font-semibold text-[#C9993A]" : "text-[#0D0C0A]"}`}>
                        {row.usuario}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-[#C9993A] text-white px-1.5 py-0.5 rounded-full">
                          TÚ
                        </span>
                      )}
                      {isFirst && !isMe && (
                        <span className="hidden md:inline text-[10px] bg-[#0D0C0A] text-white px-1.5 py-0.5 rounded-full">
                          PREFERENTE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-sm font-medium tabular-nums ${isMe ? "text-[#C9993A]" : "text-[#0D0C0A]"}`}>
                      {row.porcentaje.toFixed(2).replace(".", ",")}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right hidden md:table-cell">
                    <span className="text-xs text-[#9E9A94]">
                      {format(row.visitDate, "EEE d MMM", { locale: es })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length > 12 && (
          <div className="py-2 px-4 text-center text-xs text-[#9E9A94] border-t border-[#F5F4F2]">
            +{rows.length - 12} compradores más
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-[#9E9A94]">
        {rows.length} compradores pujando · Actualización en tiempo real
      </p>
    </div>
  );
}
