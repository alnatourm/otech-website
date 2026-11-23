"use client";

import { useTranslations } from "next-intl";
import {
  Bot,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Network,
  Workflow,
  Zap,
} from "lucide-react";

export default function Services() {
  const t = useTranslations("services");

  const cards = [
    {
      id: "custom-software",
      icon: Code2,
      title: t("card1.title"),
      desc: t("card1.desc"),
      features: [t("card1.f1"), t("card1.f2"), t("card1.f3")],
      badges: ["Next.js 16", "React 19", "Supabase", "PostgreSQL", "TypeScript"],
      accent: "from-blue-500/20 to-otech-cyan-400/10",
      border: "hover:border-otech-cyan-400/50",
    },
    {
      id: "enterprise-ai",
      icon: Bot,
      title: t("card2.title"),
      desc: t("card2.desc"),
      features: [t("card2.f1"), t("card2.f2"), t("card2.f3")],
      badges: ["Arabic RAG", "Autonomous Agents", "pgvector", "WhatsApp API"],
      accent: "from-otech-cyan-400/20 to-otech-blue-500/10",
      border: "hover:border-otech-cyan-300/50",
    },
    {
      id: "system-automation",
      icon: Workflow,
      title: t("card3.title"),
      desc: t("card3.desc"),
      features: [t("card3.f1"), t("card3.f2"), t("card3.f3")],
      badges: ["ERP Integration", "Webhooks", "API Gateways", "SLA Monitoring"],
      accent: "from-emerald-500/20 to-otech-blue-500/10",
      border: "hover:border-emerald-400/40",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 relative">
      <div id="solutions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-otech-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-3 inline-block">
            {t("kicker")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t("desc")}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`glass-card rounded-2xl p-8 flex flex-col justify-between border border-otech-dark-700/80 ${card.border} transition-all duration-300 group`}
              >
                <div>
                  {/* Icon & Accent */}
                  <div className="w-14 h-14 rounded-xl bg-otech-dark-900 border border-otech-dark-700 flex items-center justify-center text-otech-cyan-400 mb-6 group-hover:scale-105 group-hover:border-otech-cyan-400/50 transition-all shadow-glow-cyan">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {card.desc}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {card.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal"
                      >
                        <CheckCircle2 className="w-4 h-4 text-otech-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Badges */}
                <div className="pt-4 border-t border-otech-dark-700/60">
                  <div className="flex flex-wrap gap-1.5">
                    {card.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-otech-dark-900 text-slate-300 border border-otech-dark-700/80 group-hover:border-otech-cyan-400/30 transition-colors"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
