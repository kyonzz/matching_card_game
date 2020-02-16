import { LEVEL, CardType, DimensionType } from "../@types";
import { generateData } from "../utils/card";
import { MINUTE_IN_SECONDS } from "../utils/time";
import { IGameStoreProps } from "../@types";

const initState = (): IGameStoreProps => ({
  start: false,
  end: false,
  won: false,
  level: LEVEL.EASY,
  matchedCards: 0,
  startTime: undefined,
  endTime: undefined,
  ...getGameSettingFromLevel(LEVEL.EASY),
  // duration: 5,
  // cardList: generateData({ x: 2, y: 2 }),
});

const getGameSettingFromLevel = (
  level: LEVEL
): {
  duration: number;
  dimension: DimensionType;
  cardList: CardType[];
} => {
  let dimension;
  let duration;
  let cardList;

  switch (level) {
    case LEVEL.EASY:
      dimension = { x: 4, y: 4 };
      duration = 2 * MINUTE_IN_SECONDS;
      break;

    case LEVEL.NORMAL:
      dimension = { x: 4, y: 4 };
      duration = 1 * MINUTE_IN_SECONDS;
      break;

    case LEVEL.HARD:
      dimension = { x: 6, y: 6 };
      duration = 2 * MINUTE_IN_SECONDS;
      break;

    default:
      break;
  }

  cardList = generateData(dimension);

  return { duration, dimension, cardList };
};

export const gameReducer = (state = initState(), action) => {
  switch (action.type) {
    case "NEW_GAME":
      return initState();

    case "START_GAME":
      return {
        ...state,
        start: true,
        startTime: new Date().getTime(),
        end: false,
        won: false
      };

    case "RESTART_GAME":
      return {
        ...state,
        matchedCards: 0,
        start: true,
        startTime: new Date().getTime(),
        end: false,
        won: false,
        ...getGameSettingFromLevel(state.level)
      };

    case "END_GAME":
      return {
        ...state,
        won: action.payload,
        start: false,
        end: true,
        endTime: new Date().getTime()
      };

    case "SET_FINISH_TIME":
      return {
        ...state,
        finished_time: action.payload
      };

    case "LEVEL_CHANGE":
      const level = action.payload;

      return {
        ...state,
        level,
        ...getGameSettingFromLevel(level)
      };

    case "FLIP_CARD":
      return {
        ...state,
        cardList: state.cardList.map(item => {
          return item.id === action.payload && !item.flipped
            ? { ...item, flipped: true }
            : item;
        })
      };
    case "FOLD_CARD":
      return {
        ...state,
        cardList: state.cardList.map(item => {
          return item.id === action.payload
            ? { ...item, flipped: false }
            : item;
        })
      };
    case "MATCH_CARD":
      const newMatchedCards = state.matchedCards + 1;
      return {
        ...state,
        matchedCards: newMatchedCards,
        cardList: state.cardList.map(item => {
          return item.id === action.payload ? { ...item, matched: true } : item;
        })
      };
    case "FLIP_ALL":
      return {
        ...state,
        cardList: state.cardList.map(item => ({ ...item, flipped: true }))
      };
    case "FOLD_ALL":
      return {
        ...state,
        openedCards: [],
        cardList: state.cardList.map(item =>
          item.matched ? item : { ...item, flipped: false }
        )
      };

    default:
      return state;
  }
};
