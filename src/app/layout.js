import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "URL Shortener - Free Link Shortener",
  description:
    "Shorten your long URLs into compact, shareable links instantly. Free URL shortener with no registration required.",
  keywords:
    "URL shortener, link shortener, short URLs, free URL shortener, URL compression",
  creator: "diego ivan perea montealegre ,Diego Ivan Perea Montealegre",
  authors: [{ name: "Diego Ivan Perea Montealegre" } ,{name:"diego ivan perea montealegre"}],
  openGraph: {
    title: "URL Shortener - Free Link Shortener",
    description:
      "Shorten your long URLs into compact, shareable links instantly.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener - Free Link Shortener",
    description:
      "Shorten your long URLs into compact, shareable links instantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.ico",
    apple: "/icon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#232323" />
        <meta name="msapplication-TileColor" content="#232323" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
