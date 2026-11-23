"use client";

import { useTranslations } from "next-intl";
import {
  Check,
  Clock,
  Compass,
  FileCode2,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function About() {
  const t = useTranslations("about");

  const principles = [
    {
      icon: Rocket,
      title: t("pillar1.title"),
      desc: t("pillar1.desc"),
    },
    {
      icon: Lock,
      title: t("pillar2.title"),
      desc: t("pillar2.desc"),
    },
    {
      icon: Clock,
      title: t("pillar3.title"),
      desc: t("pillar3.desc"),
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative bg-otech-dark-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative & Stats */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full circuit-badge text-otech-cyan-400 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>{t("badge")}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {t("title")}
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>

            {/* Key Value Guarantees */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl glass-card border border-otech-dark-700/80 flex items-start gap-3">
                <FileCode2 className="w-5 h-5 text-otech-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {t("stat1")}
                </span>
              </div>
              <div className="p-4 rounded-xl glass-card border border-otech-dark-700/80 flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {t("stat2")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Engineering Principles */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-otech-cyan-400/20 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-otech-dark-700/80 pb-4">
                <ShieldCheck className="w-5 h-5 text-otech-cyan-400" />
                <span>{t("pillarsTitle")}</span>
              </h3>

              <div className="space-y-5">
                {principles.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-otech-dark-900 border border-otech-dark-700 flex items-center justify-center text-otech-cyan-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
