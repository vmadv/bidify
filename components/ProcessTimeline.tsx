import { Gavel, Eye, FileText, Building2 } from "lucide-react";

type Step = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  desc: string;
  status: "active" | "pending" | "done";
};

type Props = {
  currentStep?: 0 | 1 | 2 | 3;
};

export default function ProcessTimeline({ currentStep = 0 }: Props) {
  const steps: Step[] = [
    {
      icon: Gavel,
      title: "Puja",
      subtitle: "7 días",
      desc: "Los compradores pujan la comisión. Ranking en tiempo real.",
      status: currentStep === 0 ? "active" : currentStep > 0 ? "done" : "pending",
    },
    {
      icon: Eye,
      title: "Visita",
      subtitle: "Post-subasta",
      desc: "Visitas ordenadas por posición en el ranking.",
      status: currentStep === 1 ? "active" : currentStep > 1 ? "done" : "pending",
    },
    {
      icon: FileText,
      title: "Arras",
      subtitle: "Contrato",
      desc: "Contrato de arras con servicio legal incluido.",
      status: currentStep === 2 ? "active" : currentStep > 2 ? "done" : "pending",
    },
    {
      icon: Building2,
      title: "Notaría",
      subtitle: "Firma",
      desc: "Escritura de compraventa ante notario.",
      status: currentStep === 3 ? "active" : "pending",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start min-w-max md:min-w-0 gap-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Icon + connector */}
                <div className="flex items-center w-full">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      step.status === "active"
                        ? "border-[#C9993A] bg-[#C9993A] text-white"
                        : step.status === "done"
                        ? "border-[#0D0C0A] bg-[#0D0C0A] text-white"
                        : "border-[#E8E6E2] bg-white text-[#9E9A94]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px mx-2 bg-[#E8E6E2]" />
                  )}
                </div>

                {/* Text */}
                <div className="mt-3 pr-4 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className={`text-sm font-semibold ${
                        step.status === "active"
                          ? "text-[#C9993A]"
                          : step.status === "done"
                          ? "text-[#0D0C0A]"
                          : "text-[#9E9A94]"
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.status === "active" && (
                      <span className="text-[10px] bg-[#C9993A] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide font-medium">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9E9A94] mb-1">{step.subtitle}</p>
                  <p className="text-xs text-[#9E9A94] leading-relaxed hidden md:block">{step.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
