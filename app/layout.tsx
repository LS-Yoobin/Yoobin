import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AnalyticsEventBridge from "@/components/AnalyticsEventBridge";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Yoobin Portfolio",
  description: "Immersive cockpit hero experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K7KQGS5D2R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K7KQGS5D2R');
          `}
        </Script>
      </head>
      <body>
        <AnalyticsEventBridge />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
