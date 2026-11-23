"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitLeadAction, LeadSubmissionState } from "@/lib/actions/leads";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Sparkles,
} from "lucide-react";

const initialState: LeadSubmissionState = {
  success: false,
};

export default function LeadForm() {
  const t = useTranslations("contact");
  const tf = useTranslations("form");
  const locale = useLocale();

  const [state, formAction, isPending] = useActionState(
    submitLeadAction,
    initialState
  );

  const [service, setService] = useState("enterprise_ai");
  const [phone, setPhone] = useState("+962 ");

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full circuit-badge text-otech-cyan-400 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            {t("h2")}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t("sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Amman HQ Hub & Direct WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-otech-cyan-400/20 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-otech-dark-700/80 pb-4">
                <div className="w-10 h-10 rounded-xl bg-otech-cyan-400/10 border border-otech-cyan-400/30 flex items-center justify-center text-otech-cyan-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {t("slaTitle")}
                  </h3>
                  <p className="text-xs text-slate-400">{t("slaDesc")}</p>
                </div>
              </div>

              {/* Office Details */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-otech-cyan-400 shrink-0" />
                  <span>{t("location")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-otech-cyan-400 shrink-0" />
                  <a
                    href="mailto:contact@o-tech.space"
                    className="hover:text-otech-cyan-400 transition-colors font-mono"
                  >
                    {t("email")}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-otech-cyan-400 shrink-0" />
                  <span className="font-mono">+962 6 000 0000 / +962 7 9000 0000</span>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/962790000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{t("wa")}</span>
                </a>
              </div>
            </div>

            {/* Privacy & Guarantee note */}
            <div className="p-4 rounded-xl bg-otech-dark-900/50 border border-otech-dark-700/60 flex items-start gap-3 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-otech-cyan-400 shrink-0 mt-0.5" />
              <span>{tf("privacy")}</span>
            </div>
          </div>

          {/* Right Column: Lead Intake Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-otech-dark-700 shadow-2xl relative">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  {tf("title")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {tf("desc")}
                </p>
              </div>

              {/* Success State */}
              {state.success ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {tf("successTitle")}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    {state.message || tf("successDesc")}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 px-4 py-2 rounded-lg bg-otech-dark-900 text-xs font-semibold text-otech-cyan-400 border border-otech-dark-700 hover:bg-otech-dark-850 cursor-pointer"
                  >
                    {tf("sendAnother")}
                  </button>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="locale" value={locale} />

                  {/* Error Notification */}
                  {state.error && (
                    <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{state.error}</span>
                    </div>
                  )}

                  {/* Full Name & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {tf("name")}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder={tf("namePlaceholder")}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-otech-dark-900 border border-otech-dark-700 text-slate-100 text-sm focus:outline-none focus:border-otech-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {tf("company")}
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        placeholder={tf("companyPlaceholder")}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-otech-dark-900 border border-otech-dark-700 text-slate-100 text-sm focus:outline-none focus:border-otech-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Work Email & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {tf("email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={tf("emailPlaceholder")}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-otech-dark-900 border border-otech-dark-700 text-slate-100 text-sm focus:outline-none focus:border-otech-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {tf("phone")}
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={tf("phonePlaceholder")}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-otech-dark-900 border border-otech-dark-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-otech-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {tf("interest")}
                    </label>
                    <select
                      name="serviceInterest"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-otech-dark-900 border border-otech-dark-700 text-slate-100 text-sm focus:outline-none focus:border-otech-cyan-400 transition-colors cursor-pointer"
                    >
                      <option value="enterprise_ai">
                        {tf("interestOptions.enterprise_ai")}
                      </option>
                      <option value="custom_software">
                        {tf("interestOptions.custom_software")}
                      </option>
                      <option value="system_automation">
                        {tf("interestOptions.system_automation")}
                      </option>
                      <option value="technical_consulting">
                        {tf("interestOptions.technical_consulting")}
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {tf("message")}
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={tf("messagePlaceholder")}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-otech-dark-900 border border-otech-dark-700 text-slate-100 text-sm focus:outline-none focus:border-otech-cyan-400 transition-colors resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 via-otech-cyan-300 to-otech-blue-400 hover:from-white hover:to-otech-cyan-400 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isPending ? tf("submitting") : tf("submit")}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
