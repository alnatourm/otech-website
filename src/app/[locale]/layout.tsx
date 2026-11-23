import type { Metadata } from "next";
import { Cairo, Inter, JetBrains_Mono, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    metadataBase: new URL("https://o-tech.space"),
    title: isAr
      ? "شركة OTECH | لهندسة البرمجيات والذكاء الاصطناعي للمؤسسات (عمّان، الأردن)"
      : "OTECH | Software Engineering & Enterprise AI Solutions (Amman, Jordan)",
    description: isAr
      ? "شركة OTECH للتطوير البرمجي في عمّان، الأردن. نبني منصات سحابية مخصصة، وكلاء ذكاء اصطناعي، وأتمتة مسارات العمل للمؤسسات الكبرى."
      : "OTECH Software Engineering & AI Company in Amman, Jordan. Bespoke cloud platforms, autonomous AI agents, and workflow automation.",
    keywords: [
      "OTECH",
      "Software Engineering",
      "Enterprise AI",
      "Amman Jordan",
      "Custom Software",
      "Next.js",
      "Supabase",
      "شركة برمجة الأردن",
      "ذكاء اصطناعي عمّان",
    ],
    icons: {
      icon: "/otech-logo.jpg",
      apple: "/otech-logo.jpg",
    },
    openGraph: {
      title: isAr
        ? "شركة OTECH | هندسة البرمجيات والذكاء الاصطناعي المؤسسي"
        : "OTECH | Software Engineering & Enterprise AI Solutions",
      description: isAr
        ? "حلول برمجية متطورة وأنظمة ذكاء اصطناعي سيادية من قلب عمّان للمنطقة والعالم."
        : "Enterprise software engineering, bilingual AI agents, and systems automation from Amman, Jordan.",
      url: "https://o-tech.space",
      siteName: "OTECH",
      images: [
        {
          url: "/otech-logo.jpg",
          width: 800,
          height: 800,
          alt: "OTECH Logo",
        },
      ],
      locale: isAr ? "ar_JO" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontVars = `${cairo.variable} ${tajawal.variable} ${inter.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang={locale} dir={dir} className="scroll-smooth">
      <body
        className={`${fontVars} min-h-screen flex flex-col antialiased cyber-grid selection:bg-otech-cyan-400 selection:text-otech-dark-950`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
