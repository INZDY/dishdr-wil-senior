import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { dir } from "i18next";
import { fallbackLng, languages } from "../i18n/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "Dishdr",
  description: "Dynamic Inquiry System for Hospital Department Recommendation",
};

// export async function generateMetadata({ params }: {
//   params: {
//     lng: string;
//   };
// }) {
//   let { lng } = params
//   if (languages.indexOf(lng) < 0) lng = fallbackLng
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   // const { t } = await useTranslation(lng)
//   return {
//     title: "Dishdr",
//     // title: t('title'),
//     content: 'A playground to explore new Next.js 13/14 app directory features such as nested layouts, instant loading states, streaming, and component level data fetching.'
//   }
// }

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    lng: string;
  };
}>) {
  const { lng } = await params;
  return (
    <html lang={lng} dir={dir(lng)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-500`}
      >
        <Header lng={lng} />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
