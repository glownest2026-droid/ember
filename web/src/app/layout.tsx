// web/src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalHeader from "../components/ConditionalHeader";
import { ThemeProvider } from "../components/ThemeProvider";
import { SubnavStatsProvider } from "../lib/subnav/SubnavStatsContext";
import { SubnavGate } from "../components/subnav/SubnavGate";
import { ContentSpacer } from "../components/subnav/ContentSpacer";

export const metadata: Metadata = {
  title: "Ember — Simple, trusted guidance from bump to big steps.",
  description: "Never behind the curve. Know what's next. Buy smart. Move it on.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ember",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FF6347",
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <SubnavStatsProvider>
            <SubnavGate />
            <ConditionalHeader />
            <ContentSpacer />
            {children}
          </SubnavStatsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
