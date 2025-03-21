/* eslint-disable @typescript-eslint/no-unused-vars */
// import type { Metadata } from "next";
"use client"
import { Inter, Roboto_Mono } from "next/font/google";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>   {children}</body>
      </QueryClientProvider>
    </html>
  );
}
