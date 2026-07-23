// web/src/app/layout.tsx
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalHeader from "../components/ConditionalHeader";
import { ThemeProvider } from "../components/ThemeProvider";
import { SubnavStatsProvider } from "../lib/subnav/SubnavStatsContext";
import { SubnavGate } from "../components/subnav/SubnavGate";
import { PostHogProvider } from "../lib/analytics/PostHogProvider";
import { OneSignalProvider } from "../lib/onesignal/OneSignalProvider";
import { discoverManrope } from "../lib/discover/manrope";
import { discoverPlayful } from "../lib/discover/playful";
import { PublicFooterGate } from "../components/compliance/PublicFooterGate";

export const metadata: Metadata = {
  title: "Ember. Simple, trusted guidance from bump to big steps.",
  description:
    "Over 600 free ideas for your child's first three years. Know what's next. Buy smart. Move it on.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ember",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FF6347",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${discoverManrope.variable} ${discoverPlayful.variable} ember-figma-app overflow-x-clip`}
    >
      <body className={`${discoverManrope.className} antialiased min-w-0 max-w-[100vw] bg-white`}>
        <ThemeProvider>
          <PostHogProvider>
            <OneSignalProvider>
              <SubnavStatsProvider>
                <Suspense fallback={<div className="h-16 md:h-20 shrink-0" aria-hidden />}>
                  <ConditionalHeader />
                </Suspense>
                <SubnavGate />
                {children}
                <PublicFooterGate />
              </SubnavStatsProvider>
            </OneSignalProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
