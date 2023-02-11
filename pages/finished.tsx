import { usePlayer } from "@/components/context/PlayerContext";
import { useStats } from "@/components/context/StatsContext";
import { ButtonCVA } from "@/components/cva/ButtonCVA";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface Player {
  id: number;
  name: string;
  score: number;
  quote?: string;
  updatedAt: Date;
}

export default function Finished() {
  const [score, setScore] = useState(8);
  const [questionsLength, setQuestionsLength] = useState(10);
  const [exists, setExists] = useState(false);
  const [isScoreHigher, setIsScoreHigher] = useState<boolean | undefined>(
    undefined
  );

  const nameInput = useRef<HTMLInputElement | null>(null);
  const quoteInput = useRef<HTMLTextAreaElement | null>(null);
  const { changePlayerObj } = usePlayer();
  const router = useRouter();
  const { stats, clearStats } = useStats();

  useEffect(() => {
    if (Object.keys(stats).length) {
      setQuestionsLength(stats.questionsLength);
      setScore(stats.score);
    } else {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>You're Done</title>
        <meta property="og:title" content={`You\'re Done`} />
        <meta name="description" content="Quiz is done and finished" />
        <meta property="og:description" content="Quiz is done and finished" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/q.ico" />
        <meta property="og:image" content="/fUudAEr.png" />
        <meta property="og:url" content="https://iq-island.vercel.app/" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        <Link href="/" className="fixed top-4 left-4 w-fit">
          <button className="black-shadow group flex w-fit flex-row items-center justify-start gap-2 rounded-full bg-blue-500 p-2 px-5 text-white transition-colors duration-200 hover:bg-blue-600 focus-visible:translate-y-1 active:translate-y-1">
            <AiOutlineArrowLeft className="text-2xl transition-transform duration-200 group-hover:-translate-x-2" />
            <span>Restart</span>
          </button>
        </Link>
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold sm:text-5xl">
            You Scored {score}/{questionsLength}
          </h1>
          {!exists ? (
            <span className="text-sm sm:text-base ">
              If you want to lock your score in the IQ Island, write your name
            </span>
          ) : isScoreHigher ? (
            <span className="max-w-xl text-center text-sm text-red-500 sm:text-base">
              That name already exists, but you can <strong>change it</strong>,
              or if you want to
              <strong> update your score</strong>, click the button again.
            </span>
          ) : (
            <span className="max-w-xl text-center text-sm text-red-500 sm:text-base">
              This name already exists but you can use a different name. You
              cannot update the score of that user because yours is lower
            </span>
          )}
        </div>
        <form
          className="contents"
          onSubmit={async (e) => {
            e.preventDefault();

            let existingPlayer: Player;
            const playerObject = {
              id: 0,
              name: nameInput.current!.value,
              score: score,
              quote: quoteInput.current!.value || undefined,
              updatedAt: new Date(),
            };

            if (exists === false) {
              console.log("Checking if player already exists");
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/getPlayers`
              );
              const data = await res.json();

              existingPlayer = await data.find(
                (player: Player) => player.name === nameInput.current!.value
              );

              setExists(Boolean(existingPlayer));
              setIsScoreHigher(
                existingPlayer ? score > existingPlayer.score : undefined
              );
            }

            if (exists && isScoreHigher) {
              fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updatePlayer`, {
                method: "POST",
                body: JSON.stringify(playerObject),
              });
              console.log("Wants to Update");
              changePlayerObj(playerObject);
              clearStats();
              router.push("/iq-island");
            } else if (existingPlayer!) {
              console.log(exists);
              console.log("Name already exists");
            } else if (!isScoreHigher) {
              fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createPlayer`, {
                method: "POST",
                body: JSON.stringify(playerObject),
              });
              console.log("Creating player...");
              changePlayerObj(playerObject);
              clearStats();
              router.push("/iq-island");
            }
          }}
        >
          <input
            type="text"
            className="black-shadow bg-white px-4 py-2"
            ref={nameInput}
            minLength={3}
            placeholder="John Doe*"
            required
            onChange={() => {
              setExists(false);
              setIsScoreHigher(undefined);
            }}
          />
          <textarea
            className="black-shadow h-40 w-full px-4 py-2 sm:max-w-sm"
            placeholder="I got more points than you because..."
            ref={quoteInput}
          />
          {(isScoreHigher === undefined || isScoreHigher) && (
            <ButtonCVA
              text={`Lock your ${exists ? "score" : "name"}`}
              intent={exists ? "good" : "normal"}
            />
          )}
        </form>
      </div>
    </>
  );
}
