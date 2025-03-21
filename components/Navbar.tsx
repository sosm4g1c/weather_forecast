/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { MdWbSunny, MdMyLocation, MdLocationOn } from "react-icons/md";
import Searchbox from "./SearchBox";
import axios from "axios";
import { loadingAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import { ca } from "date-fns/locale";

type Props = { location?: string };

export default function Navbar({ location = "Ho Chi Minh" }: Props) {
  // const { location } = props;
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingAtom);

  useEffect(() => {
    if (city.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
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
          setShowSuggestions(false);
          setError("Không tìm thấy kết quả nào");
        } else {
          setSuggestions(
            response.data.map(
              (city: { name: string; country: string }) =>
                `${city.name}, ${city.country}`
            )
          );
          setShowSuggestions(true);
          setError("");
        }
      } catch {
        setError("Lỗi kết nối, vui lòng thử lại!");
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(delay);
  }, [city]);

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

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
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoadingCity(true);
          const respone = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );

          setTimeout(() => {
            setLoadingCity(false);
            setPlace(respone.data.name);
            setCity("");
          }, 500);
        } catch (error) {
          setLoadingCity(false);
          console.log(error);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </div>
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Dùng vị trí hiện tại"
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdLocationOn className="text-3xl" />
            <p className="text-gray-900/80 text-sm">{location}</p>
            <div className="relative hidden md:flex">
              <Searchbox
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onSubmit={handleSubmitSearch}
              />
              <SuggestionsBox
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                handleSuggestionClick={handleSuggestionClick}
                error={error}
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
          <SuggestionsBox
            showSuggestions={showSuggestions}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
            error={error}
          />
        </div>
      </section>
    </> 
  );
}

function SuggestionsBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {(showSuggestions  || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1">{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
