"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, LifeBuoy, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = locale === "ar";
  const otherLocale = isAr ? "en" : "ar";
  const switchLabel = isAr ? "English" : "العربية";

  const handleLanguageSwitch = () => {
    router.replace(pathname, { locale: otherLocale });
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & Official Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl p-0.5 bg-gradient-to-br from-otech-cyan-400 to-otech-blue-500 shadow-glow-cyan overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/otech-logo.jpg"
              alt="OTECH Logo"
              width={44}
              height={44}
              className="w-full h-full object-cover rounded-[10px] bg-white"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white font-mono flex items-center gap-1.5">
              OTECH
              <span className="text-otech-cyan-400 text-xs px-1.5 py-0.5 rounded bg-otech-cyan-400/10 border border-otech-cyan-400/20 font-sans">
                JO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-tight">
              {t("subtitle")}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#hero"
            className="hover:text-otech-cyan-400 transition-colors"
          >
            {t("home")}
          </a>
          <a
            href="#services"
            className="hover:text-otech-cyan-400 transition-colors"
          >
            {t("services")}
          </a>
          <a
            href="#solutions"
            className="hover:text-otech-cyan-400 transition-colors"
          >
            {t("solutions")}
          </a>
          <a
            href="#about"
            className="hover:text-otech-cyan-400 transition-colors"
          >
            {t("about")}
          </a>
          <a
            href="#contact"
            className="hover:text-otech-cyan-400 transition-colors"
          >
            {t("contact")}
          </a>
          <a
            href="https://tickets.o-tech.space/en"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-otech-cyan-400 transition-colors border-l border-r border-slate-700/60 px-3 py-1"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span className="text-xs">{t("tickets")}</span>
            <ArrowUpRight className="w-3 h-3 opacity-70" />
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={handleLanguageSwitch}
            aria-label={`Switch to ${switchLabel}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-otech-dark-700 bg-otech-dark-900/90 text-xs font-semibold text-slate-200 hover:border-otech-cyan-400/40 hover:text-otech-cyan-400 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-otech-cyan-400" />
            <span>{switchLabel}</span>
          </button>

          {/* Primary CTA */}
          <a
            href="#contact"
            className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold rounded-xl text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-cyan-300 hover:from-white hover:to-otech-cyan-400 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {t("cta")}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={handleLanguageSwitch}
            aria-label={`Switch to ${switchLabel}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-otech-dark-700 bg-otech-dark-900 text-xs font-semibold text-slate-200"
          >
            <Globe className="w-3.5 h-3.5 text-otech-cyan-400" />
            <span>{switchLabel}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-otech-cyan-400" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-otech-dark-700/80 px-5 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-200">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-otech-cyan-400"
            >
              {t("home")}
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-otech-cyan-400"
            >
              {t("services")}
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-otech-cyan-400"
            >
              {t("solutions")}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-otech-cyan-400"
            >
              {t("about")}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-otech-cyan-400"
            >
              {t("contact")}
            </a>
            <a
              href="https://tickets.o-tech.space/en"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 flex items-center gap-2 text-otech-cyan-400"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>{t("tickets")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center py-2.5 text-xs font-bold rounded-xl text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-cyan-300 shadow-glow-cyan"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
