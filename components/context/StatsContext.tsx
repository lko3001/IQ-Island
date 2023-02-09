import { ReactNode, createContext, useContext, useState } from "react";

type Stats = {
  score: number;
  questionsLength: number;
};
type FullStats = {
  stats: Stats;
  changeStats: (options: Stats) => void;
  clearStats: () => void;
};

const StatsContext = createContext({} as FullStats);

export function useStats() {
  return useContext(StatsContext);
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState({} as Stats);

  const changeStats = (options: Stats) => {
    setStats((prev) => ({
      ...prev,
      score: options.score || prev.score,
      questionsLength: options.questionsLength || prev.questionsLength,
    }));
  };
  const clearStats = () => setStats({} as Stats);

  return (
    <StatsContext.Provider value={{ stats, changeStats, clearStats }}>
      {children}
    </StatsContext.Provider>
  );
}
