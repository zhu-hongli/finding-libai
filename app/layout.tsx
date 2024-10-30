import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeToggle from './components/ThemeToggle';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Finding Libai",
  description: "AI Poetry Evaluation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
