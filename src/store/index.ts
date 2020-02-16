import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./reducers";

const store = configureStore({
  reducer: {
    game: gameReducer
  }
});

export { store };
