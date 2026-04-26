import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import { Toaster } from "sonner";

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home - Fitlife.id",
  description:
    "Platform manajemen diet dan pola makan digital untuk hidup yang lebih sehat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interSans.className} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
