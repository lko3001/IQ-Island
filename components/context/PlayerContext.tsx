import React, { ReactNode, createContext, useContext, useState } from "react";

type PlayerType = {
  id: number;
  name: string;
  score: number;
  quote?: string;
  updatedAt: Date;
};
type FullPlayerType = {
  fullPlayerObj: PlayerType;
  changePlayerObj: (newPlayerContextObj: PlayerType) => void;
  clearPlayerObj: () => void;
};

const PlayerContext = createContext({} as FullPlayerType);

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [fullPlayer, setPlayerContextObj] = useState({} as PlayerType);

  const changePlayerObj = (newPlayerContextObj: PlayerType) =>
    setPlayerContextObj(newPlayerContextObj);
  const clearPlayerObj = () => setPlayerContextObj({} as PlayerType);

  return (
    <PlayerContext.Provider
      value={{ fullPlayerObj: fullPlayer, changePlayerObj, clearPlayerObj }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
