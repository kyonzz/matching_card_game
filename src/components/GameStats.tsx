import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import { convertTimeToString, convertSecondsToTime } from "../utils/time";
import { IGameStatsProps } from "../@types";

const Stats = ({ stats }: { stats: IGameStatsProps }) => {
  return (
    <div className="border border-orange-500 bg-orange-200 p-2">
      <div className="flex w-full justify-center items-center">
        <p className="text-2xl">Game stats</p>
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="lg:w-40 px-1 lg:mb-0 lg:flex lg:items-center">
          <div className="uppercase w-full text-green-500 font-bold py-3 px-8 text-center">
            Won: {stats.wonTime}
          </div>
        </div>
        <p>~</p>
        <div className="lg:w-40 px-1 lg:mb-0 lg:flex lg:items-center">
          <div className="uppercase w-full text-red-500 font-bold py-3 px-8 text-center">
            Lost: {stats.lostTime}
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="text-center font-bold">Best time</p>
        <table className="table-fixed border border-gray-600 m-auto w-56">
          <thead>
            <tr>
              <th className="border border-gray-600 w-1/3 font-semibold">
                Easy
              </th>
              <th className="border border-gray-600 w-1/3 font-semibold">
                Normal
              </th>
              <th className="border border-gray-600 w-1/3 font-semibold">
                Hard
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-600 px-4 py-2 text-center">
                {stats.bestEASY === undefined
                  ? "--:--"
                  : convertTimeToString(convertSecondsToTime(stats.bestEASY))}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-center">
                {stats.bestNORMAL === undefined
                  ? "--:--"
                  : convertTimeToString(convertSecondsToTime(stats.bestNORMAL))}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-center">
                {stats.bestHARD === undefined
                  ? "--:--"
                  : convertTimeToString(convertSecondsToTime(stats.bestHARD))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const GameStats = React.memo(({ stats }: { stats: IGameStatsProps }) => {
  const [statsVisible, setStatsVisible] = useState<boolean>(false);

  const { left }: any = useSpring({
    left: statsVisible ? 0 : -16,
    opacity: statsVisible ? 1 : 0
  });

  return (
    <div>
      <a.div
        className="w-64 absolute visible lg:invisible"
        style={{
          top: 5,
          left: left.interpolate(l => `${l}rem`)
        }}
      >
        <Stats stats={stats} />
        <div
          className="visible lg:invisible p-2 bg-green-400 border border-green-500 inline-block absolute cursor-pointer"
          onClick={() => setStatsVisible(!statsVisible)}
          style={{
            width: 100,
            top: 10,
            left: "16rem"
          }}
        >
          Show stats
        </div>
      </a.div>

      <div className="invisible lg:visible">
        <div className="w-64 lg:absolute lg:top-0 lg:left-0">
          <Stats stats={stats} />
        </div>
      </div>
    </div>
  );
});
