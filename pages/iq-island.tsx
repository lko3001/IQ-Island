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
  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(
    undefined
  );
  const playerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
    <>
      <div className="my-16">
        <h1 className="mb-2 text-center text-5xl font-bold sm:text-6xl">
          IQ Island
        </h1>
        <div className="mx-auto flex max-w-5xl flex-col divide-y divide-blue-200 p-4">
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
                onClick={() => {
                  dialogRef.current?.showModal();
                  setCurrentPlayer(player);
                }}
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
        <dialog
          ref={dialogRef}
          className="overflow-hidden rounded-lg p-0"
          onClick={() => dialogRef.current?.close()}
        >
          <div
            className="flex flex-col gap-8 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="mb-1 text-3xl font-bold">{currentPlayer?.name}</h2>
              <p className="text-sm">Score: {currentPlayer?.score}</p>
            </div>
            <p>{currentPlayer?.quote}</p>
            {currentPlayer?.updatedAt &&
              ("0" + new Date(currentPlayer?.updatedAt).getDate()).slice(-2)}
            /
            {currentPlayer?.updatedAt &&
              ("0" + (new Date(currentPlayer?.updatedAt).getMonth() + 1)).slice(
                -2
              )}
            /
            {currentPlayer?.updatedAt &&
              new Date(currentPlayer?.updatedAt)
                .getFullYear()
                .toString()
                .slice(-2)}
          </div>
        </dialog>
      </div>
    </>
  );
}
