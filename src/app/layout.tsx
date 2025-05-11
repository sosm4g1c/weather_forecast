// import ServerLayout from "./ServerLayout";
import RootLayout from "./RootLayout";
import { getMessages, getLocale } from "next-intl/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale(); // Thêm getLocale()

  return (
    // <ServerLayout>
      <RootLayout messages={messages} locale={locale}>
        {children}
      </RootLayout>
    // </ServerLayout>
  );
}
