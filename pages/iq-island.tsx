import { usePlayer } from "@/components/context/PlayerContext";
import { ButtonCVA } from "@/components/cva/ButtonCVA";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface Player {
  id: number;
  name: string;
  score: number;
  quote?: string;
  updatedAt: Date;
}

export default function Done() {
  const { fullPlayerObj } = usePlayer();
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
        if (Array.isArray(data)) {
          const playerIndex = data.findIndex(
            (el: Player) => el.name == fullPlayerObj.name
          );
          if (playerIndex == -1 && fullPlayerObj.name) {
            data.push(fullPlayerObj);
          }
          data.sort((a: Player, b: Player) => b.score - a.score);
          setPlayers(data);
        } else {
          setPlayers([fullPlayerObj]);
        }
      });
  }, []);

  useEffect(() => {
    console.log("Players has changed");
    console.log(players);
    if (players && playerRef.current) {
      playerRef.current?.focus();
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [players]);

  return (
    <>
      <Link href="/" className="mt-4 ml-4 block w-fit">
        <button className="black-shadow group flex w-fit flex-row items-center justify-start gap-2 rounded-full bg-blue-500 p-2 px-5 text-white transition-colors duration-200 hover:bg-blue-600 focus-visible:translate-y-1 active:translate-y-1">
          <AiOutlineArrowLeft className="text-2xl transition-transform duration-200 group-hover:-translate-x-2" />
          <span>Restart</span>
        </button>
      </Link>
      <div className="py-16">
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
                className="flex cursor-pointer flex-row items-center gap-6 p-4 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none focus-visible:bg-blue-50"
                ref={player.name == fullPlayerObj.name ? playerRef : null}
                id={player.name == fullPlayerObj.name ? "yes" : ""}
                tabIndex={0}
                onClick={() => {
                  dialogRef.current?.showModal();
                  setCurrentPlayer(player);
                }}
              >
                <div>
                  <span className="mr-6 text-neutral-500">#{index + 1}</span>
                  <h1 className="inline font-bold">{player.name}</h1>
                </div>
                <span className="grow text-sm text-neutral-500 line-clamp-1">
                  {player.quote}
                </span>
                <span>{player.score}</span>
              </div>
            );
          })}
        </div>
        <dialog
          ref={dialogRef}
          className="min-h-[20vh] min-w-[50vw] overflow-hidden rounded-lg p-0 shadow-lg"
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
