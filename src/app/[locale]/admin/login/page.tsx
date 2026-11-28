'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { loginAdmin, logoutAdmin } from '@/lib/actions/auth';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('sales@o-tech.space');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<{ id: string; email?: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if session already exists
  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted && user) {
          setExistingUser({ id: user.id, email: user.email });
        }
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        if (mounted) setIsCheckingAuth(false);
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Authenticate with browser client (stores session in browser cookies / local memory)
      const { data: browserAuthData, error: browserError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      // 2. Also sync with Next.js Server Action to guarantee server cookieStore is populated
      const serverResult = await loginAdmin({
        email: cleanEmail,
        password,
      });

      if (browserError && !serverResult.success) {
        const msg =
          browserError.message === 'Invalid login credentials'
            ? 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.'
            : browserError.message;
        setErrorMessage(msg);
        setIsLoading(false);
        return;
      }

      setSuccessMessage('تم التحقق بنجاح! جاري تحميل نظام إدارة المبيعات...');
      
      // Navigate to CRM contacts page
      setTimeout(() => {
        router.push('/admin/crm/contacts');
        router.refresh();
      }, 700);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء تسجيل الدخول.';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  const handleLogoutExisting = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await logoutAdmin();
      setExistingUser(null);
      setSuccessMessage('تم تسجيل الخروج بنجاح.');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-otech-dark-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-tajawal relative overflow-hidden selection:bg-otech-cyan-400 selection:text-otech-dark-950">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 w-96 h-96 bg-otech-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-80 h-80 bg-otech-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Header */}
      <div className="absolute top-0 inset-x-0 h-16 border-b border-otech-dark-800 bg-otech-dark-900/60 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-otech-cyan-400/40">
            <Image
              src="/otech-logo.jpg"
              alt="OTECH Logo"
              fill
              className="object-cover group-hover:scale-105 transition"
            />
          </div>
          <span className="font-heading font-black text-lg tracking-wide text-white group-hover:text-otech-cyan-400 transition">
            OTECH
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">| بوابة إدارة المبيعات</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-otech-cyan-400 transition"
        >
          <span>العودة للرئيسية</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 mt-8">
        {/* OTTY Mascot Card */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-20 h-20 rounded-full border-2 border-otech-cyan-400/60 p-1 bg-otech-dark-900 shadow-glow-cyan mb-3">
            <Image
              src="/otty.png"
              alt="OTTY Official Mascot"
              width={72}
              height={72}
              className="rounded-full object-cover"
              priority
            />
            <span className="absolute bottom-1 end-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-otech-dark-900" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-otech-blue-500/20 text-otech-cyan-400 border border-otech-cyan-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام إدارة المبيعات الداخلي (CRM)</span>
          </div>

          <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
            تسجيل الدخول الإداري
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            أهلاً بك! أدخل بيانات حسابك للوصول إلى قاعدة جهات الاتصال وإدارة الصفقات.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-otech-dark-900/90 border border-otech-dark-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {isCheckingAuth ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-otech-cyan-400" />
              <span className="text-xs">جاري فحص الجلسة...</span>
            </div>
          ) : existingUser ? (
            /* User already authenticated */
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">أنت مسجل الدخول بالفعل</h3>
                <p className="text-xs text-slate-400 mt-1 dir-ltr">
                  {existingUser.email}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => router.push('/admin/crm/contacts')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition"
                >
                  <span>الدخول إلى جهات الاتصال (CRM)</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
                </button>

                <button
                  onClick={handleLogoutExisting}
                  disabled={isLoading}
                  className="w-full text-xs text-slate-400 hover:text-rose-400 py-1.5 transition"
                >
                  تسجيل الخروج والتبديل لحساب آخر
                </button>
              </div>
            </div>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-otech-cyan-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="sales@o-tech.space"
                    className="w-full ps-10 pe-3 py-2.5 text-sm bg-otech-dark-800 border border-otech-dark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-otech-cyan-400 focus:ring-1 focus:ring-otech-cyan-400 transition font-mono dir-ltr text-start"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-otech-cyan-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full ps-10 pe-10 py-2.5 text-sm bg-otech-dark-800 border border-otech-dark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-otech-cyan-400 focus:ring-1 focus:ring-otech-cyan-400 transition dir-ltr text-start"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>تسجيل الدخول للنظام</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-500">
                <span>الحساب الرسمي المعتمد: </span>
                <span className="font-mono text-slate-400">sales@o-tech.space</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          OTECH Systems & Enterprise AI &copy; 2026 &bull; عمّان، الأردن
        </p>
      </div>
    </div>
  );
}