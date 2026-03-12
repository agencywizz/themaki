import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { RESTAURANT_INFO } from "@/lib/config";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: RESTAURANT_INFO.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Main Street",
    addressLocality: "Roscommon",
    addressCountry: "IE",
  },
  telephone: RESTAURANT_INFO.phone,
  servesCuisine: "Japanese",
  priceRange: RESTAURANT_INFO.priceRange,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: RESTAURANT_INFO.rating,
    reviewCount: RESTAURANT_INFO.totalReviews,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "12:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "12:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "12:00", closes: "21:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "12:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "12:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "13:00", closes: "21:00" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-bg-primary text-text-primary antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
