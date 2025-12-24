import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-ignore: Cannot find module or type declarations for side-effect import of './globals.css'
import "./globals.css";
import Navbar from "./components/Navbar";
import { ViewTransitions } from "next-view-transitions";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/toaster";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster as ToastMsg } from "react-hot-toast";
import ScrollToTopButton from "./components/TopScroller";
import ThemeProvider from "./providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harsh Enterprises",
  description:
    "A full-featured e-commerce application where users can browse products, add them to a cart, and make purchases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
          <ThemeProvider>
            <NextAuthSessionProvider>
              <ReduxProvider>
                <Navbar />
                <ToastMsg position="bottom-right" />
                {children}
                <ScrollToTopButton />
                <Toaster />
                <Footer />
              </ReduxProvider>
            </NextAuthSessionProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
