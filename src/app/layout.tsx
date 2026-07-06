import "./globals.css";
import NeuroGlowBackground from "@/components/fx/NeuroGlowBackground";

import {
  NEURO_METADATA,
  NEURO_VIEWPORT,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
export const metadata = NEURO_METADATA;
export const viewport = NEURO_VIEWPORT;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
        <NeuroGlowBackground intensity="normal">{children}</NeuroGlowBackground>
      </body>
    </html>
  );
}
