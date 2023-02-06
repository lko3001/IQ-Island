import React, { ReactNode, createContext, useContext, useState } from "react";

type PlayerType = {
  playerName: string;
  changePlayerName: (newScore: string) => void;
};

const PlayerContext = createContext({} as PlayerType);

export function usePlayer() {
  return useContext(PlayerContext);
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerName] = useState("");
  const changePlayerName = (newPlayerName: string) =>
    setPlayerName(newPlayerName);
  return (
    <PlayerContext.Provider value={{ playerName, changePlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
}
