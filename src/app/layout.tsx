import "./globals.css";
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";

const hankenGrotesque = Hanken_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serverless Chat",
  description: "A simple chat server using Server-Sent Events (SSE)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={hankenGrotesque.className}>{children}</body>
    </html>
  );
}
