// import ServerLayout from "./ServerLayout";

// (SSver)layout để láy locale và message để truyền qua cho phía clien là RootLayout
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
      <RootLayout messages={messages} locale={locale}>
        {children}
      </RootLayout>
  );
}
