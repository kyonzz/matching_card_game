import React from "react";
import { useSpring, animated as a } from "react-spring";
import { CardType } from "../@types";

export interface ICardProps extends CardType {
  onClick: Function;
}

const Card = ({ flipped, onClick, matched, type }: ICardProps) => {
  const { transform, opacity }: any = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  const { opacity: wrapperOpacity, transformRatio }: any = useSpring({
    opacity: matched ? 0 : 1,
    transformRatio: matched ? 1.5 : 1,
    config: { mass: 5, tension: 500, friction: 80, duration: 1500 }
  });

  return (
    <a.div
      className="w-full h-20 md:h-32"
      style={{
        position: "relative",
        opacity: wrapperOpacity.interpolate({
          range: [0, 0.25, 0.5, 0.75, 1],
          output: [0, 0.5, 1, 1, 1]
        }),
        transform: transformRatio
          .interpolate({
            range: [1, 1.25, 1.5],
            output: [1, 1, 1.5]
          })
          .interpolate(t => `scale(${t})`),
        visibility: wrapperOpacity.interpolate(o =>
          o === 0 ? "hidden" : "visible"
        )
      }}
      onClick={() => {
        onClick();
      }}
    >
      <a.div
        className="card back bg-gray-600 w-full h-full text-lg font-bold shadow-md"
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform
        }}
      />
      <a.div
        className="card front bg-blue-900 text-white w-full h-full flex justify-center items-center text-lg font-bold shadow-md"
        style={{
          backfaceVisibility: "hidden",
          opacity,
          transform: transform.interpolate(t => `${t} rotateY(180deg)`)
        }}
      >
        {type}
      </a.div>
    </a.div>
  );
};

// Card.whyDidYouRender = true;

export { Card };
