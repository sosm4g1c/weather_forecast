import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("MYNEXTAPP_LOCALE")?.value || "vi";
  const locale = cookieLocale;
  
  // sau khi lấy được locale cụ thể là vi hay en thì kết hợp với đoạn json trong folder message 
  // Sau đó áp dụng cho toàn bộ project 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
