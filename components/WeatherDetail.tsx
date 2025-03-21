import React from "react";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuEye } from "react-icons/lu";
import { MdAir } from "react-icons/md";
import { WiSunrise, WiSunset } from "react-icons/wi";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

export default function WeatherDetail(props: WeatherDetailProps) {
  const {
    visability = "20 km",
    humidity = "80%",
    windSpeed = "10 km/h",
    airPressure = "1000 hPa",
    sunrise = "6:20",
    sunset = "18.20",
  } = props;
  return (
    <>
      <SingleWeatherDetails
        icon={<LuEye />}
        information="Visability"
        value={props.visability}
      />
      <SingleWeatherDetails
        icon={<FiDroplet />}
        information="Humidity"
        value={props.humidity}
      />
      <SingleWeatherDetails
        icon={<MdAir />}
        information="Windspeed"
        value={props.windSpeed}
      />
      <SingleWeatherDetails
        icon={<ImMeter />}
        information="Airpressure"
        value={props.airPressure}
      />
      <SingleWeatherDetails
        icon={<WiSunrise />}
        information="Sunrise"
        value={props.sunrise}
      />
      <SingleWeatherDetails
        icon={<WiSunset />}
        information="Sunset"
        value={props.sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetails(props: SingleWeatherDetailsProps) {
  return (
    <div className="w-full border-collapse ">
      <tbody>
        <tr className="align-middle">
          <td className=" min-w-[84px] font-semibold whitespace-nowrap transform translate-y-2/3">
            {props.information}
          </td>
          <td className="w-4/5   flex items-center gap-2 mx-5 text-center transform translate-y-2/3">
            <div className="text-3xl">{props.icon}</div>
            <p className="text-s font-semibold">{props.value}</p>
          </td>
        </tr>
      </tbody>
    </div>
  );
}
