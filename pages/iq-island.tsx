import { usePlayer } from "@/components/context/PlayerContext";
import { useEffect, useRef, useState } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
  quote?: string;
  updatedAt: Date;
}

export default function Done() {
  const { playerName } = usePlayer();
  const [players, setPlayers] = useState<Player[]>([]);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getPlayers`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a: Player, b: Player) => b.score - a.score);
        setPlayers(data);
      })
      .then(() => {
        playerRef.current?.focus();
        playerRef.current?.scrollIntoView({ behavior: "smooth" });
      });
  }, []);

  return (
    <div>
      <h1 className="text-">Minds Of Fame</h1>
      <div className="mx-auto my-16 flex max-w-5xl flex-col divide-y divide-blue-200 p-4">
        <div className="flex flex-row items-center justify-between gap-6 p-4">
          <h1 className="text-lg font-bold">Name</h1>
          <h1 className="text-lg font-bold">Score</h1>
        </div>
        {players.map((player, index) => {
          return (
            <div
              key={player.id}
              className={`flex cursor-pointer scroll-m-10 flex-row items-center justify-between gap-6 p-4 hover:bg-blue-50 focus:outline-none focus-visible:bg-blue-50`}
              ref={player.name == playerName ? playerRef : null}
              tabIndex={0}
            >
              <div>
                <span className="mr-6">#{index + 1}</span>
                <h1 className="inline">{player.name}</h1>
              </div>
              <span>{player.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
