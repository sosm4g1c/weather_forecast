/* eslint-disable @typescript-eslint/no-explicit-any */

// (Client) Nhận locale và message từ (server) layout và hiển thị lên giao diện màn hìnhhình
"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Inter, Roboto_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

const geistSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Roboto_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
  messages,
  locale, // Thêm locale
}: {
  children: React.ReactNode;
  messages: any;
  locale: string; // Định nghĩa kiểu dữ liệu cho locale
}) {
  return (
    <html>
    <QueryClientProvider client={queryClient}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
          {children}
        </NextIntlClientProvider>
      </body>
    </QueryClientProvider>
    </html>
  );
}
