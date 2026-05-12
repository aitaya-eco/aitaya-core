import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "../../styles/globals.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attire — Your Style Is An Evolution",
  description:
    "A curated digital sanctuary for fashion visionaries. Explore the architectural beauty of bespoke garments, build your mood boards, and architect your next look.",
  openGraph: {
    title: "Attire — Your Style Is An Evolution",
    description: "A curated digital sanctuary for fashion visionaries.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  );
}
