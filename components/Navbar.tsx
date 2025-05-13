/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { MdWbSunny, MdMyLocation, MdLocationOn } from "react-icons/md";
import Searchbox from "./SearchBox";
import axios from "axios";
import { loadingAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Props = { location?: string };

export default function Navbar({ location = "Ho Chi Minh" }: Props) {

// 1. Lấy thành phố từ ô Search 
// Sau khi nhập thành phố, gán giá trí mới nhập cho city
const [city, setCity] = useState("");

// hook kiểm soát lỗi
const [error, setError] = useState("");


// Lấy atom quản lý loading và địa điểm hiện tại
const [place, setPlace] = useAtom(placeAtom);
const [_, setLoadingCity] = useAtom(loadingAtom);

// Đa ngôn ngữ
const [locale, setLocale] = useState<string>("");
const router = useRouter();
const t = useTranslations("Header");

// 2. Khi component được mount, kiểm tra và thiết lập ngôn ngữ lưu trữ bằng cookie
useEffect(() => {
  
  //lấy giá trị locale từ cookie
  // Tách chuỗi và lấy phần dữ liệu bắt đầu với "MYNEXTAPP_LOCALE="
  const cookieLocale = document.cookie
    .split(";")
    .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
    ?.split("=")[1];

  // Nếu MYNEXTAPP_LOCALE= đã có trong cookie thì gán luôn 
  if (cookieLocale) {
    setLocale(cookieLocale);
  } else {
  // không thì 
  // Lấy ngôn ngữ mặc định của trình duyệt (ví dụ: "vi", "en", ...)
    const browserLocale = navigator.language.slice(0, 2);
  // Cập nhật ngôn ngữ cho giao diện ứng dụng
    setLocale(browserLocale);
  // Lưu ngôn ngữ này vào cookie để nhớ cho lần truy cập sau
    document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}`;
  // Làm mới trang để áp dụng ngôn ngữ mới vào giao diện
    router.refresh();
  }
}, [router]);



// Hàm thay đổi locale và lưu vào cookie
const changeLocale = (newLocale: string) => {
  setLocale(newLocale);
  document.cookie = `MYNEXTAPP_LOCALE=${newLocale}`;
  router.refresh();
};



// 3. Hàm xử lý Submitsearch 
function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
  setLoadingCity(true);
  // Ngăn hành vi tải lại trang
  e.preventDefault();

  // Kiểm tra dữ liệu được nhập vào ô Search có nội dung không 
  if (city.trim() === "") {
    // không thì báo lỗi
    setError("Vui lòng nhập thành phố hợp lệ!");
    setLoadingCity(false);
    // console.log(error);
    alert(error);
    return;
  }

  // Kiểm tra nếu độ dài thành phố < 3 ký tự thì không gửi API
  if (city.length < 3) {
    setError("Vui lòng nhập tối thiểu 3 ký tự!");
    setLoadingCity(false);
    alert(error);
    return;
  }

  // Gọi API của OpenWeather Map để kiểm tra tên thành phố có tồn tại không
  const fetchCity = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );

      // Kiểm tra nếu không có dữ liệu trả về thì báo lỗi 
      if (response.data.length === 0) {
        setError("Không tìm thấy kết quả nào");
        // alert("Khong tim thay thanh pho");
      } else {
        // Nếu có dữ liệu từ API thì gán dữ liệu City trong ô Search cho biến place 
        setError("");
        setPlace(city);
      }
    } catch {
      // Nếu có lỗi xảy ra thì gán lỗi
      setError("Lỗi kết nối, vui lòng thử lại!");
    } finally {
      setLoadingCity(false);
    }
  };
  // Gọi hàm fetchCity
  fetchCity();
}

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">{t("title")}</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </div>
          <section className="flex gap-2 items-center">
            {/* <LanguageSwitch /> */}
            {/*Button chuyen doi ngon ngu sang tieng viet*/}
            <button
              onClick={() => changeLocale("vi")}
              className={`border p-2 font-bold rounded-md text-sm transition cursor-pointer ${
                locale === "vi"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black"
              }`}
            >
              VN
            </button>
            {/* // them button chuyen doi ngon ngu sang tieng trung*/}
            
            {/* <button
              onClick={() => changeLocale("cn")}
              className={`border p-2 font-bold rounded-md text-sm transition cursor-pointer ${
                locale === "cn"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black"
              }`}
            >
              CN
            </button> */}

               {/*Button chuyen doi ngon ngu sang tieng anh*/}
            <button
              onClick={() => changeLocale("en")}
              className={`border p-2 font-bold rounded-md text-sm transition  cursor-pointer ${
                locale === "en"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black"
              }`}
            >
              EN
            </button>
            {/* <MdMyLocation
              title="Dùng vị trí hiện tại"
              // onClick={handleCurrentLocation}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            /> */}
            <MdLocationOn className="text-3xl" />
            <p className="text-gray-900/80 text-sm">{location}</p>
            <div className="relative hidden md:flex">
              <Searchbox
              // ô tìm kiếm cho người dùng nhập thành phố cần tìm
                value = {city}
                onChange = {(e) => setCity(e.target.value)}
                onSubmit = {handleSubmitSearch}
              />
            </div>
          </section>
        </div>
      </nav>
    </>
  );
}
