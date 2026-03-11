import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAKI Sushi | Fresh Japanese Cuisine in Roscommon",
  description:
    "Order sushi online or reserve a table at MAKI Sushi, Roscommon. Fresh, delicious Japanese cuisine. Dine-in, takeaway & contactless delivery.",
  openGraph: {
    title: "MAKI Sushi | Fresh Japanese Cuisine in Roscommon",
    description:
      "Order sushi online or reserve a table at MAKI Sushi, Roscommon. Fresh, delicious Japanese cuisine. Dine-in, takeaway & contactless delivery.",
    type: "website",
    locale: "en_IE",
    siteName: "MAKI Sushi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-bg-primary text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
