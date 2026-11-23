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

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
                href="https://github.com/alnatourm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-otech-dark-900 border border-otech-dark-700 text-slate-300 hover:text-otech-cyan-400 hover:border-otech-cyan-400/40 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">github.com/alnatourm</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://tickets.otech.jo"
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
