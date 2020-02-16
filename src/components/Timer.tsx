import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertSecondsToTime } from "../utils/time";

export const Timer = () => {
  const gameState = useSelector((state: any) => state.game);
  const dispatch = useDispatch();

  const intervelRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentStartState = useRef<boolean>(gameState.start);
  const currentEndState = useRef<boolean>(gameState.end);

  const [timeLeft, setTimeLeft] = useState<number>(gameState.duration);

  useEffect(() => {
    setTimeLeft(gameState.duration);
  }, [gameState.duration]);

  useEffect(() => {
    if (currentStartState.current === false && gameState.start === true) {
      // start state from false -> true means the game now really start

      // set current start state
      currentStartState.current = true;

      // start countdow
      intervelRef.current = setInterval(() => {
        setTimeLeft(time => {
          const timeLeft = time - 1;

          return timeLeft;
        });
      }, 1000);
    }

    if (currentEndState.current === true && gameState.end === false) {
      // end state from true -> false means the game has been reset

      // set current end state
      currentEndState.current = false;

      // reset countdown
      setTimeLeft(gameState.duration);
    }

    if (gameState.end === true) {
      currentStartState.current = false;
      currentEndState.current = true;

      intervelRef.current && clearInterval(intervelRef.current);
    }

    return () => {
      intervelRef.current && clearInterval(intervelRef.current);
    };
  }, [gameState.start, gameState.end, gameState.duration]);

  useEffect(() => {
    // lose condition
    if (timeLeft === 0) {
      intervelRef.current && clearInterval(intervelRef.current);

      dispatch({
        type: "END_GAME",
        payload: false
      });
    }
  }, [timeLeft]);

  const { minutes, seconds } = convertSecondsToTime(timeLeft);
  return (
    <div className="text-2xl font-bold text-center bg-green-500 border border-green-500 text-white md:rounded-full h-12 md:h-24 w-24 flex items-center justify-center">
      {minutes < 10 ? "0" + minutes : minutes}:
      {seconds < 10 ? "0" + seconds : seconds}
    </div>
  );
};
