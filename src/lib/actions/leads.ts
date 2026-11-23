"use server";

import { headers } from "next/headers";
import { createClient } from "../supabase/server";

export interface LeadSubmissionState {
  success: boolean;
  message?: string;
  error?: string;
  leadId?: string;
}

const VALID_SERVICES = [
  "enterprise_ai",
  "custom_software",
  "system_automation",
  "technical_consulting",
] as const;

export async function submitLeadAction(
  prevState: LeadSubmissionState | null,
  formData: FormData
): Promise<LeadSubmissionState> {
  try {
    const fullName = (formData.get("fullName") as string)?.trim();
    const companyName = (formData.get("companyName") as string)?.trim() || null;
    const email = (formData.get("email") as string)?.trim();
    const rawPhone = (formData.get("phoneNumber") as string)?.trim() || "";
    const serviceInterest = (formData.get("serviceInterest") as string)?.trim();
    const message = (formData.get("message") as string)?.trim() || null;
    const locale = (formData.get("locale") as string)?.trim() || "ar";

    // Validate required fields
    if (!fullName || fullName.length < 2) {
      return {
        success: false,
        error: locale === "ar" ? "يرجى إدخال الاسم الكامل" : "Full name is required",
      };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        error: locale === "ar" ? "يرجى إدخال بريد إلكتروني صالح للعمل" : "Valid work email is required",
      };
    }

    if (!serviceInterest || !VALID_SERVICES.includes(serviceInterest as any)) {
      return {
        success: false,
        error: locale === "ar" ? "يرجى اختيار نوع الخدمة المطلوبة" : "Please select a valid service interest",
      };
    }

    // Phone parsing & validation (Jordan / regional focus)
    let countryCode = "+962";
    let phoneNumber = rawPhone;

    if (rawPhone) {
      // Remove spaces, hyphens
      const cleaned = rawPhone.replace(/[\s\-()]/g, "");
      if (cleaned.startsWith("+")) {
        // e.g. +962791234567
        if (cleaned.startsWith("+962")) {
          countryCode = "+962";
          phoneNumber = cleaned.slice(4);
        } else {
          // generic international
          const match = cleaned.match(/^(\+\d{1,4})(\d{6,14})$/);
          if (match) {
            countryCode = match[1];
            phoneNumber = match[2];
          }
        }
      } else if (cleaned.startsWith("00962")) {
        countryCode = "+962";
        phoneNumber = cleaned.slice(5);
      } else if (cleaned.startsWith("07") && cleaned.length === 10) {
        countryCode = "+962";
        phoneNumber = cleaned.slice(1);
      }
    }

    // Extract headers for telemetry
    const headerList = await headers();
    const ipAddress =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      null;
    const userAgent = headerList.get("user-agent") || null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("website_leads")
      .insert({
        full_name: fullName,
        company_name: companyName,
        email: email.toLowerCase(),
        phone_number: phoneNumber,
        country_code: countryCode,
        service_interest: serviceInterest,
        message,
        locale,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[website_leads] Supabase error:", error);
      return {
        success: false,
        error:
          locale === "ar"
            ? "تعذر حفظ بيانات الطلب حالياً، يرجى المحاولة لاحقاً أو التواصل معنا عبر واتساب."
            : "Could not record inquiry. Please try again or reach out directly via WhatsApp.",
      };
    }

    return {
      success: true,
      leadId: data?.id,
      message:
        locale === "ar"
          ? "تم استلام طلبكم بنجاح! سيتواصل معكم أحد مهندسينا في عمّان خلال ساعتي عمل."
          : "Inquiry received successfully! An engineer in Amman will reach out within 2 business hours.",
    };
  } catch (err: any) {
    console.error("[website_leads] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please contact us directly via WhatsApp.",
    };
  }
}
