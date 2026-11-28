"use server";

import { createClient } from "@/lib/supabase/server";

export interface AuthActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AdminUserData {
  id: string;
  email?: string;
}

/**
 * Server action to sign in as CRM admin using Supabase Auth.
 * Automatically synchronizes session cookies with the request/response via @supabase/ssr.
 */
export async function loginAdmin(credentials: {
  email: string;
  password: string;
}): Promise<AuthActionResult<AdminUserData>> {
  try {
    const email = credentials?.email?.trim();
    const password = credentials?.password;

    if (!email || !password) {
      return {
        success: false,
        error: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error:
          error.message === "Invalid login credentials"
            ? "بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني وكلمة المرور."
            : error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "تعذر تسجيل الدخول، يرجى المحاولة مرة أخرى.",
      };
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "حدث خطأ غير متوقع أثناء معالجة تسجيل الدخول.";
    return { success: false, error: msg };
  }
}

/**
 * Server action to sign out from the CRM admin session.
 */
export async function logoutAdmin(): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الخروج.";
    return { success: false, error: msg };
  }
}

/**
 * Server action to retrieve currently active admin user session.
 */
export async function getAdminUser(): Promise<AdminUserData | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return {
      id: user.id,
      email: user.email,
    };
  } catch {
    return null;
  }
}