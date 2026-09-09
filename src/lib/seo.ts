import type { Metadata, Viewport } from "next";

export const SITE_URL = "https://www.neurotrading.app";
export const PLATFORM_URL = "https://app.neurotrading.app/app";
export const BRAND_NAME = "Neuro Trading";
export const BRAND_TAGLINE = "AI Intelligence. Market Edge.";
export const BRAND_DESCRIPTION =
  "Neuro Trading es una plataforma Cloud de trading con inteligencia artificial, conexión a broker, gestión de riesgo, análisis de mercado y acceso profesional desde navegador.";

export const SEO_KEYWORDS = [
  "Neuro Trading",
  "Neuro Cloud",
  "plataforma de trading",
  "plataforma de trading online",
  "trading con inteligencia artificial",
  "IA para trading",
  "MT5",
  "MetaTrader 5",
  "gestión de riesgo trading",
  "broker trading",
  "trading automático",
  "trading manual",
  "análisis de mercado",
  "plataforma fintech",
  "trading app",
  "trading Colombia",
];

export const SEO_PAGES = [
  { path: "/", title: "Neuro Trading | Plataforma Cloud de trading con IA", description: "Plataforma profesional de trading con inteligencia artificial, gestión de riesgo, conexión a broker y acceso online desde navegador.", priority: 1, changeFrequency: "daily" as const },
  { path: "/cloud", title: "Neuro Cloud | Acceso online a Neuro Trading", description: "Accede a Neuro Trading desde navegador sin descarga obligatoria. PWA opcional y apps nativas como complementos futuros.", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/pricing", title: "Planes Neuro Trading | 30 días de prueba", description: "Consulta Starter, Pro y Elite y crea tu cuenta para acceder a la prueba de 30 días de Neuro Trading.", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/security", title: "Seguridad Neuro Trading | Riesgo, acceso y control", description: "Conoce el enfoque de seguridad, control de riesgo, límites operativos y protección de acceso en Neuro Trading.", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/technology", title: "Tecnología Neuro Trading | IA, datos y arquitectura", description: "Explora la tecnología de Neuro Trading: inteligencia artificial, arquitectura web, conexión a broker y análisis de mercado.", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/brokers", title: "Brokers compatibles | Neuro Trading", description: "Información sobre conexión a brokers, cuentas demo, cuentas reales y flujo de integración de Neuro Trading.", priority: 0.78, changeFrequency: "weekly" as const },
  { path: "/market", title: "Mercado | Neuro Trading", description: "Visión de mercado, análisis y herramientas para apoyar decisiones dentro del ecosistema Neuro Trading.", priority: 0.75, changeFrequency: "daily" as const },
  { path: "/neuro-chat", title: "Neuro Chat | Asistente IA de Neuro Trading", description: "Neuro Chat ayuda a explicar la plataforma, responder preguntas y guiar al usuario dentro del ecosistema Neuro Trading.", priority: 0.7, changeFrequency: "weekly" as const },
];

export const canonicalUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
};

export const openGraphImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Neuro Trading - AI Intelligence. Market Edge.",
};

export const NEURO_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BRAND_NAME,
  title: {
    default: "Neuro Trading | Plataforma Cloud de trading con IA",
    template: "%s | Neuro Trading",
  },
  description: BRAND_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Neuro Trading" }],
  creator: "Neuro Trading",
  publisher: "Neuro Trading",
  category: "Finance",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: "Neuro Trading | Plataforma Cloud de trading con IA",
    description: BRAND_DESCRIPTION,
    images: [openGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuro Trading | Plataforma Cloud de trading con IA",
    description: BRAND_DESCRIPTION,
    images: [openGraphImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/neuro-trading-icon.svg",
  },
};

export const NEURO_VIEWPORT: Viewport = {
  themeColor: "#081320",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/neuro-trading-logo.svg`,
  slogan: BRAND_TAGLINE,
  sameAs: [SITE_URL],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_NAME,
  url: SITE_URL,
  description: BRAND_DESCRIPTION,
  inLanguage: "es-CO",
};

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: BRAND_NAME,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: PLATFORM_URL,
  description:
    "Plataforma Cloud de trading con inteligencia artificial, conexión a broker y herramientas de control de riesgo. Acceso desde navegador; operar implica riesgo y no hay resultados garantizados.",
  offers: {
    "@type": "Offer",
    category: "Subscription",
    url: `${SITE_URL}/pricing`,
    availability: "https://schema.org/OnlineOnly",
  },
  publisher: {
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
  },
};
