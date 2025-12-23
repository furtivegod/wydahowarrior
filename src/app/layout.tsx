import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import PostHogProvider from "@/components/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wydaho Warrior Knife Check Assessment",
  description:
    "This assessment is designed for Christian chef-owners who feel burnt, crushed, spiritually depleted, or on the edge of disappearing. A professional-grade, emotionally grounded, chef-culture fluent, Gospel-centered assessment.",
  icons: {
    icon: [
      { url: "/top.png", sizes: "any" },
      { url: "/top.png", type: "image/png" },
    ],
    apple: "/top.png",
    shortcut: "/top.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
