/* eslint-disable @next/next/no-img-element */
import React from "react";
// import Image from "next/image";
import { cn } from "../utils/cn";

export default function WeatherIcons(props: React.HTMLProps<HTMLDivElement> & {iconName: string}) {
  return (
    <div {...props} className={cn("relative h-30 w-30")}>
      <img
        width={100}
        height={100}
        className="absolute w-full h-full shadow-lg"
        src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
        alt="weatherIcon"
      />
    </div>
  );
}
