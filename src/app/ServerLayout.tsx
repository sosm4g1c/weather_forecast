/* eslint-disable @typescript-eslint/no-unused-vars */
// components/ServerLayout.tsx
import { getLocale, getMessages } from "next-intl/server";

export default async function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
