import React, { useState, useEffect } from "react";
import { Card, ICardProps } from "./components/Card";
import { LEVEL, IGameStatsProps } from "./@types";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Timer } from "./components/Timer";

import { Dialog } from "@reach/dialog";
import { convertSecondsToTime, convertTimeToString } from "./utils/time";
import { GameStats } from "./components/GameStats";

const App = () => {
  const gameState = useSelector((state: any) => state.game);
  const dispatch = useDispatch();

  const statsFromLocalStorage = localStorage.getItem(
    "matching_card_game_stats"
  );

  const [gameStats, setGameStats] = useState<IGameStatsProps>(
    statsFromLocalStorage
      ? JSON.parse(statsFromLocalStorage)
      : { wonTime: 0, lostTime: 0 }
  );

  useEffect(() => {
    localStorage.setItem("matching_card_game_stats", JSON.stringify(gameStats));
  }, [gameStats]);

  const [showAlert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    // win condition
    if (gameState.matchedCards === gameState.cardList.length) {
      dispatch({
        type: "END_GAME",
        payload: true
      });
    }
  }, [gameState.matchedCards, gameState.cardList]);

  useEffect(() => {
    if (!gameState.end) return;

    if (gameState.won) {
      setGameStats(stats => {
        return {
          ...stats,
          wonTime: stats.wonTime + 1,
          ["best" + gameState.level]: Math.min(
            stats["best" + gameState.level] === undefined
              ? Number.MAX_SAFE_INTEGER
              : stats["best" + gameState.level],
            Math.floor((gameState.endTime - gameState.startTime) / 1000)
          )
        };
      });
    } else {
      setGameStats(stats => {
        return {
          ...stats,
          lostTime: stats.lostTime + 1
        };
      });
    }

    setAlert(true);
  }, [gameState.end]);

  const [flippedCard, setFlippedCard] = useState<
    (ICardProps & { id: string }) | null
  >(null);

  const [clickDisabled, setClickDisabled] = useState<Boolean>(false);

  const handleCardClick = card => {
    if (clickDisabled || !gameState.start || card.flipped || card.matched)
      return;

    dispatch({
      type: "FLIP_CARD",
      payload: card.id
    });

    if (flippedCard) {
      setClickDisabled(true); // open max 2 cards at time

      // compare
      if (flippedCard.type === card.type) {
        // matched
        dispatch({
          type: "MATCH_CARD",
          payload: flippedCard.id
        });
        dispatch({
          type: "MATCH_CARD",
          payload: card.id
        });

        setClickDisabled(false);
        setFlippedCard(null);
      } else {
        // fold both
        setTimeout(() => {
          dispatch({
            type: "FOLD_CARD",
            payload: flippedCard.id
          });
          dispatch({
            type: "FOLD_CARD",
            payload: card.id
          });

          setClickDisabled(false);
          setFlippedCard(null);
        }, 500);
      }
    } else {
      setFlippedCard(card);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-full md:max-w-6xl xl:max-w-screen-xl relative">
      <Dialog
        isOpen={showAlert}
        style={{
          background: "transparent"
        }}
        className="w-full md:w-2/3 xl:w-1/3"
      >
        <div role="alert">
          <div
            className={classNames(
              "text-white text-center font-bold rounded-t px-4 py-2",
              {
                "bg-red-500": !gameState.won,
                "bg-green-500": gameState.won
              }
            )}
          >
            GAME ENDED
          </div>
          <div
            className={classNames(
              "border border-t-0 rounded-b px-4 py-3 text-red-700",
              {
                "border-red-400 bg-red-100": !gameState.won,
                "border-green-400 bg-green-100": gameState.won
              }
            )}
          >
            <div className="mb-6 mt-2 text-center">
              {gameState.won ? (
                <div>
                  <p>👏🎉🎊Congratulation!!!🎊🎉👏</p>
                  <p>
                    You finished the game in{" "}
                    {convertTimeToString(
                      convertSecondsToTime(
                        Math.floor(
                          (gameState.endTime - gameState.startTime) / 1000
                        )
                      )
                    )}
                  </p>
                </div>
              ) : (
                <p>Sorry but you lost :(. Try one more time?</p>
              )}
            </div>
            <div className="flex justify-center items-center mx-2">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mx-1"
                onClick={() => {
                  setAlert(false);
                  dispatch({
                    type: "NEW_GAME"
                  });
                }}
              >
                New Game
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded mx-1"
                onClick={() => {
                  setAlert(false);
                  dispatch({
                    type: "RESTART_GAME"
                  });
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <div className="flex flex-wrap w-full justify-center mx-1 mb-2 md:mb-6">
        <h2 className="block text-center w-full mb-6 text-4xl truncate text-gray-800 font-bold">
          LETTER MATCHING GAME
        </h2>
        <div className="w-full lg:w-1/4 px-1 mb-6 lg:mb-0 lg:flex lg:items-center">
          <div className="flex-grow">
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={gameState.start}
                onChange={e => {
                  dispatch({
                    type: "LEVEL_CHANGE",
                    payload: e.target.value
                  });
                }}
              >
                <option value={LEVEL.EASY}>Easy</option>
                <option value={LEVEL.NORMAL}>Normal</option>
                <option value={LEVEL.HARD}>Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4 px-1 mb-2 lg:mb-0 lg:flex lg:items-center">
          <button
            className="w-full bg-blue-500 active:hover:bg-blue-700 text-white font-bold py-3 px-8 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={gameState.start}
            onClick={() => {
              dispatch({
                type: "START_GAME"
              });
            }}
          >
            Start Game
          </button>
        </div>
      </div>

      <div className="flex w-full justify-center mb-2 md:mb-6">
        <Timer />
      </div>

      <div className="card-container flex flex-wrap justify-center mb-8 w-full">
        <div
          className={classNames("flex flex-wrap w-full", {
            "md:w-1/2 lg:w-2/3":
              gameState.level === LEVEL.EASY ||
              gameState.level === LEVEL.NORMAL,
            "w-full": gameState.level === LEVEL.HARD
          })}
        >
          {gameState.cardList.map((card, idx) => {
            return (
              <div
                key={idx}
                className={classNames("p-1", {
                  "w-3/12":
                    gameState.level === LEVEL.EASY ||
                    gameState.level === LEVEL.NORMAL,
                  "w-2/12": gameState.level === LEVEL.HARD
                })}
              >
                <Card
                  // {...card}
                  id={card.id}
                  type={card.type}
                  matched={card.matched}
                  flipped={card.flipped}
                  onClick={() => {
                    handleCardClick(card);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <GameStats stats={gameStats} />
    </div>
  );
};

export default App;
