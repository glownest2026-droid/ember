// web/src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "../components/ConditionalHeader";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ember — Simple, trusted guidance from bump to big steps.",
  description: "Never behind the curve. Know what's next. Buy smart. Move it on.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
