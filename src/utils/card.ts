import { ICardProps } from "../components/Card";
import { CardType, DimensionType } from "../@types";

const cardLetters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const generateData = (dimension: DimensionType): CardType[] => {
  let listLetter: string[] = [];

  // pick random (x*y)/2 letters
  for (let i = 0; i < (dimension.x * dimension.y) / 2; i++) {
    const randomLetter =
      cardLetters[Math.floor(Math.random() * cardLetters.length)];
    // push to listLetter twice
    listLetter.push(randomLetter, randomLetter);
  }

  // now suffle it
  const suffledArray = shuffleArray([...listLetter]); // not mutable listLetter

  // then generate the card list
  const cardsList = suffledArray.map((letter, idx) => ({
    id: idx,
    type: letter,
    flipped: false,
    matched: false
    // disabled: false
  }));

  return cardsList;
};
