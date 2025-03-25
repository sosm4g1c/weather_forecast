/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useQuery } from "react-query";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import Container from "../../components/Container";
import { convertKToCDegree } from "../../utils/convertKToCDegree";
import WeatherIcons from "../../components/WeatherIcons";
import { getDayOrNightIcon } from "../../utils/getDayOrNightIcon";
import WeatherDetail from "../../components/WeatherDetail";
import { metToKilomet } from "../../utils/metToKilomet";
import { loadingAtom, placeAtom } from "./atom";
import { use, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

type WeatherData = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
};

type CityData = {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type WeatherResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherData[];
  city: CityData;
};

export default function Home() {
  // const t = useTranslation("HomePage");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingcity, setLoadingCity] = useAtom(loadingAtom);
  const t = useTranslations("HomePage");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isLoading, data, error, refetch } = useQuery<WeatherResponse>(
    ["repoData"],
    async () => {
      const { data } = await axios.get(
        `https://pro.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&cnt=56`
      );
      return data;
    }
  );
  useEffect(() => {
    refetch();
  }, [place, refetch]);

  // console.log(data);
  const firstData = data?.list[0] ?? null;
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;
  // console.log(firstData?.sys.pod);
  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Đang Tải...</p>
      </div>
    );

  return (
    <div
      className="flex flex-col gap-4 min-h-screen"
      style={{ backgroundColor: "#e4eaf2" }}
    >
      <Navbar location={data?.city.name ?? ""} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingcity ? (
          <WeatherSkeleton />
        ) : (
          <>
            {/* {Phan du bao thoi tiet hom nay } */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Container className="gap-10 px-6 items-center rounded-md ">
                  {/* thoi gian va icon  */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((data, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-between gap-2 items-center text-s font-semibold"
                      >
                        <p className="whitespace-nowrap text-sm font-medium ">
                          {format(parseISO(data.dt_txt), "dd/MM/yyyy")}
                        </p>
                        <p className="whitespace-nowrap text-xs text-gray-500">
                          {format(parseISO(data.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcons
                          iconName={getDayOrNightIcon(
                            data.weather[0].icon,
                            data.dt_txt
                          )}
                        />
                        <p>{convertKToCDegree(data?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                {/* left  */}
                <Container className="w-1/2 justify-center flex-col px-4 items-center rounded-md">
                  <h2 className="flex gap-1 text-2xl items-end">
                    {/* <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p> */}
                    <p>
                      {format(parseISO(firstData?.dt_txt ?? ""), "EEEE", {
                        locale: dateLocale,
                      })}
                    </p>
                    <p className="text-lg">
                      ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")}
                      )
                    </p>
                  </h2>
                  <WeatherIcons
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                  <div className="flex flex-col px-4 my-5 flex flex-col items-center">
                    {/* nhiet do  */}
                    <span className="text-5xl ">
                      {convertKToCDegree(firstData?.main.temp ?? 0)}°
                    </span>
                    <p className="text-s text-gray-600 my-2">
                      {t("humidity")} {firstData?.main.humidity ?? 0}%
                    </p>
                    <p className="text-s space-x-2 ">
                      <span>
                        {" "}
                        {convertKToCDegree(firstData?.main.temp_min ?? 0)}°↓{""}
                      </span>
                      <span>
                        {" "}
                        {""} {convertKToCDegree(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                </Container>
                {/* right  */}
                <Container className=" w-1/2 px-6 grid grid-cols-2 gap-4 rounded-md">
                  <WeatherDetail
                    visability={metToKilomet(firstData?.visibility ?? 100000)}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={`${firstData?.wind.speed} km/h`}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 1702949452),
                      "H.mm a"
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 1702949452),
                      "H.mm a"
                    )}
                  />
                </Container>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function useTranslation(arg0: string) {
  throw new Error("Function not implemented.");
}
