import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import { Toaster } from "@/components/ui/sonner";

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
          <AddTransactionModal />
          <Toaster theme="dark" position="top-right" />
        </Providers>
      </body>
    </html>
  );
}