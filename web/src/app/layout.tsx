// web/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "../components/ConditionalHeader";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Ember — Simple, trusted guidance from bump to big steps.",
  description: "Never behind the curve. Know what's next. Buy smart. Move it on.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <ConditionalHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
