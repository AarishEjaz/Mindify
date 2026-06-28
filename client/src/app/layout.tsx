import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

// One global font for the whole app (Inter — sharp and professional).
// Every page inherits it, so individual pages no longer import a font.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mindify-By-Aarish",
  description:
    "Career and personality guidance assessment (not a medical diagnosis).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${inter.className} flex min-h-full flex-col bg-zinc-50 text-zinc-900`}
      >
        {/* AuthProvider makes the logged-in user available everywhere.
            Navbar sits above every page. */}
        <AuthProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
