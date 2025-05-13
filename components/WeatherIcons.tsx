/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "../utils/cn";

export default function WeatherIcons({
  iconName,
  ...rest
}: React.HTMLProps<HTMLDivElement> & { iconName: string }) {
  return (
    <div {...rest} className={cn("relative h-30 w-30")}>
      <img
        width={100}
        height={100}
        className="absolute w-full h-full shadow-lg"
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
        alt="weatherIcon"
      />
    </div>
  );
}
