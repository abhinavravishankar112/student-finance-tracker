import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusCoin | Smart Finance for Students",
  description: "Track your expenses, manage budgets, and survive college.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="md:pl-64">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}