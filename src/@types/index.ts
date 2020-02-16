export type DimensionType = {
  x: number;
  y: number;
};

export type CardType = {
  id: string | number;
  type: string;
  flipped: boolean;
  matched: boolean;
};

export enum LEVEL {
  EASY = "EASY",
  NORMAL = "NORMAL",
  HARD = "HARD"
}

export interface IGameStoreProps {
  start: boolean;
  end: boolean;
  won: boolean;
  duration: number;
  level: LEVEL;
  matchedCards: number;
  cardList: CardType[];
  startTime: number | undefined;
  endTime: number | undefined;
}

export interface IGameStatsProps {
  wonTime: number;
  lostTime: number;
  bestEASY: number | undefined;
  bestNORMAL: number | undefined;
  bestHARD: number | undefined;
}
