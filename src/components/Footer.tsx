"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Globe,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const ts = useTranslations("services");

  return (
    <footer className="border-t border-otech-dark-700/80 bg-otech-dark-950 py-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-otech-dark-700/60">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg p-0.5 bg-gradient-to-br from-otech-cyan-400 to-otech-blue-500 overflow-hidden flex items-center justify-center">
                <Image
                  src="/otech-logo.jpg"
                  alt="OTECH Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover rounded-[7px] bg-white"
                />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-white font-mono flex items-center gap-1.5">
                OTECH
                <span className="text-otech-cyan-400 text-xs px-1.5 py-0.5 rounded bg-otech-cyan-400/10 border border-otech-cyan-400/20 font-sans">
                  JO
                </span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t("desc")}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://tickets.o-tech.space/en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-otech-cyan-400/10 border border-otech-cyan-400/30 text-otech-cyan-400 hover:bg-otech-cyan-400/20 transition-colors"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">{tn("tickets")}</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-otech-cyan-400 transition-colors">
                  {tn("home")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-otech-cyan-400 transition-colors">
                  {tn("services")}
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-otech-cyan-400 transition-colors">
                  {tn("solutions")}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-otech-cyan-400 transition-colors">
                  {tn("about")}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-otech-cyan-400 transition-colors">
                  {tn("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t("servicesTitle")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-otech-cyan-400 transition-colors">
                  {ts("card1.title")}
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-otech-cyan-400 transition-colors">
                  {ts("card2.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-otech-cyan-400 transition-colors">
                  {ts("card3.title")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {t("contactTitle")}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-otech-cyan-400 shrink-0" />
                <span>{t("amman")}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Globe className="w-3.5 h-3.5 text-otech-cyan-400 shrink-0" />
                <span>{t("domain")}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-otech-cyan-400 shrink-0" />
                <span>contact@o-tech.space</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} {t("rights")} · {t("domain")}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Amman Edge
            </span>
            <span>Next.js 16 + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
