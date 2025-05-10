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
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingAtom);
  const [locale, setLocale] = useState<string>("");
  const router = useRouter();
  const t = useTranslations("Header");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split(";")
      .find((row) => row.startsWith("MYNEXTAPP_LOCALE="))
      ?.split("=")[1];
    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}`;
    router.refresh();
  };

  useEffect(() => {
    if (city.length < 3) {
      setSuggestions([]);

      setError("");
      return;
    }

    const fetchSuggestions = async () => {
      console.log(city);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );

        if (response.data.length === 0) {
          setSuggestions([]);

          setError("Không tìm thấy kết quả nào");
        } else {
          setSuggestions(
            response.data.map(
              (city: { name: string; country: string }) =>
                `${city.name}, ${city.country}`
            )
          );

          setError("");
        }
      } catch {
        setError("Lỗi kết nối, vui lòng thử lại!");
        setSuggestions([]);
      }
    };

    const delay = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delay);
  }, [city]);

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (city.trim() === "") {
      setError("Vui lòng nhập thành phố hợp lệ!");
      return;
    }

    if (suggestions.length === 0) {
      setError("Không tìm thấy kết quả nào");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        // setShowSuggestions(false);
      }, 500);
    }
  }

  // function handleCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       try {
  //         setLoadingCity(true);
  //         const respone = await axios.get(
  //           `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
  //         );

  //         setTimeout(() => {
  //           setLoadingCity(false);
  //           setPlace(respone.data.name);
  //           setCity("");
  //         }, 500);
  //       } catch (error) {
  //         setLoadingCity(false);
  //         console.log(error);
  //       }
  //     });
  //   }
  // }

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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onSubmit={handleSubmitSearch}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative ">
          <Searchbox
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onSubmit={handleSubmitSearch}
          />
        </div>
      </section>
    </>
  );
}
