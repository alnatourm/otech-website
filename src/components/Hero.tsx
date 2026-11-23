"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useLocale } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  const tm = useTranslations("mockup");
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section
      id="hero"
      className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden radial-hero-glow"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Regional & Scope Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full circuit-badge text-otech-cyan-400 text-xs sm:text-sm font-semibold mb-8 animate-float shadow-glow-cyan">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-otech-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-otech-cyan-400"></span>
            </span>
            <MapPin className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight sm:leading-tight lg:leading-tight mb-6">
            <span className="gradient-text">{t("h1")}</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
            {t("sub")}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 via-otech-cyan-300 to-otech-blue-400 hover:from-white hover:to-otech-cyan-400 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>{t("btnPrimary")}</span>
              <ArrowIcon className="w-4 h-4" />
            </a>

            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-slate-200 border border-otech-dark-700 bg-otech-dark-900/80 hover:bg-otech-dark-850 hover:border-otech-cyan-400/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-otech-cyan-400" />
              <span>{t("btnSecondary")}</span>
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-2 pb-10 border-t border-otech-dark-700/60 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center justify-center gap-2 py-2">
              <ShieldCheck className="w-4 h-4 text-otech-cyan-400 shrink-0" />
              <span>{t("trust1")}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Server className="w-4 h-4 text-otech-cyan-400 shrink-0" />
              <span>{t("trust2")}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Sparkles className="w-4 h-4 text-otech-cyan-400 shrink-0" />
              <span>{t("trust3")}</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Operations Console */}
        <div className="mt-6 max-w-5xl mx-auto rounded-2xl glass-card border border-otech-cyan-400/20 overflow-hidden shadow-2xl">
          {/* Console Header Bar */}
          <div className="bg-otech-dark-950/90 px-4 py-3 border-b border-otech-dark-700/80 flex items-center justify-between font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-slate-300 font-semibold text-[11px]">
                o-tech.space :: core-cloud-telemetry
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {tm("edgeLatency")}
              </span>
              <span className="text-[11px] text-otech-cyan-400 bg-otech-cyan-400/10 px-2 py-0.5 rounded border border-otech-cyan-400/20">
                {tm("clusterSync")}
              </span>
            </div>
          </div>

          {/* Console Active Engineering Pods Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-otech-dark-900/60">
            {/* Pod 1: Enterprise Portal */}
            <div className="rounded-xl p-4 bg-otech-dark-850/80 border border-otech-dark-700/80 hover:border-otech-cyan-400/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-otech-cyan-400 bg-otech-cyan-400/10 px-2 py-0.5 rounded">
                  POD-01 :: APP ROUTER
                </span>
                <span className="text-emerald-400 text-xs font-mono">
                  99.99% UP
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {tm("pod1Title")}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{tm("pod1Sub")}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-otech-dark-700/60">
                <span>Latency: 14ms</span>
                <span className="text-otech-cyan-400">PostgreSQL</span>
              </div>
            </div>

            {/* Pod 2: Arabic RAG Engine */}
            <div className="rounded-xl p-4 bg-otech-dark-850/80 border border-otech-dark-700/80 hover:border-otech-cyan-400/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-otech-cyan-400 bg-otech-cyan-400/10 px-2 py-0.5 rounded">
                  POD-02 :: ARABIC NLP
                </span>
                <span className="text-emerald-400 text-xs font-mono">
                  READY
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {tm("pod2Title")}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{tm("pod2Sub")}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-otech-dark-700/60">
                <span>Vectors: 1.2M</span>
                <span className="text-otech-cyan-400">pgvector</span>
              </div>
            </div>

            {/* Pod 3: Workflow Automation */}
            <div className="rounded-xl p-4 bg-otech-dark-850/80 border border-otech-dark-700/80 hover:border-otech-cyan-400/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-otech-cyan-400 bg-otech-cyan-400/10 px-2 py-0.5 rounded">
                  POD-03 :: AUTOMATION
                </span>
                <span className="text-emerald-400 text-xs font-mono">
                  ACTIVE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                {tm("pod3Title")}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{tm("pod3Sub")}</p>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-otech-dark-700/60">
                <span>Sync: Real-Time</span>
                <span className="text-otech-cyan-400">Zero Error</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
