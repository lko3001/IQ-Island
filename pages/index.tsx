import { useEffect, useReducer, useRef } from "react";
import Time from "@/components/Time";
import { ButtonCVA } from "@/components/cva/ButtonCVA";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePlayer } from "@/components/context/PlayerContext";

interface Question {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: string;
  difficulty: string;
  regions: string[];
  isNiche: boolean;
}
interface State {
  questions: Question[];
  answers: string[];
  qNumber: number;
  score: number;
  answered: boolean;
  started: boolean;
  disabled: boolean;
  selected: undefined;
  style: { transition: string; backgroundPosition: string };
  color: string;
  hp: number;
  ended: boolean;
  exists: boolean;
  isScoreHigher: boolean;
}
interface Action {
  type: string;
  payload?: any;
}
interface Player {
  id: number;
  name: string;
  score: number;
  quote?: string;
  updatedAt: Date;
}

const qIntervalMs = 1000;
const qTimeLimitMs = 10000;
const filledBar = {
  transition: "0s linear",
  backgroundPosition: "left",
};
const emptyingBar = {
  transition: `${qTimeLimitMs / qIntervalMs}s linear`,
  backgroundPosition: "right",
};
const initialState = {
  questions: [],
  answers: [],
  qNumber: 0,
  score: 0,
  answered: false,
  started: false,
  disabled: true,
  selected: undefined,
  style: filledBar,
  color: "",
  hp: 3,
  ended: false,
  exists: false,
  isScoreHigher: undefined,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "fetch_questions":
      return {
        ...state,
        questions: action.payload.questions,
        answers: action.payload.answers,
      };
    case "increase_question":
      return {
        ...state,
        qNumber: state.qNumber + 1,
        color: "",
      };
    case "time_is_up":
      return {
        ...state,
        answered: action.payload.boolean,
        disabled: action.payload.boolean,
        hp: state.hp - 1,

        color: "bg-red-100",
      };

    case "set_disabled_false":
      return {
        ...state,
        disabled: false,
      };
    case "start": {
      console.log("clicked start");
      return {
        ...state,
        started: true,
      };
    }
    case "empty_bar":
      return {
        ...state,
        style: emptyingBar,
      };
    case "increase_score":
      return {
        ...state,
        score: state.score + 1,
        color: "bg-green-100",
      };
    case "reset_options":
      return {
        ...state,
        style: filledBar,
        answered: false,
      };
    case "empty_bar_and_set_disabled_false":
      return {
        ...state,
        style: emptyingBar,
        disabled: false,
      };
    case "handle_answer_click":
      return {
        ...state,
        answered: true,
        disabled: true,
        selected: action.payload.index,
        style: filledBar,
      };
    case "next_question":
      return {
        ...state,
        answered: false,
        selected: undefined,
        qNumber: state.qNumber + 1,
        color: "",
      };
    case "wrong":
      return {
        ...state,
        hp: state.hp - 1,
        color: "bg-red-100",
      };
    case "end_game":
      return {
        ...state,
        ended: true,
      };
    case "does_name_exists":
      return {
        ...state,
        exists: action.payload.boolean,
        isScoreHigher: action.payload.isScoreHigher,
      };
    default:
      return state;
  }
}

export default function Start() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const { changePlayerName } = usePlayer();

  const timerId = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nameInput = useRef<HTMLInputElement | null>(null);
  const quoteInput = useRef<HTMLTextAreaElement | null>(null);

  function resetTimeout() {
    console.log(`QNUMBER: ${state.qNumber + 1} and SCORE: ${state.score}`);

    dispatch({ type: "reset_options" });

    setTimeout(() => {
      clearTimeout(timerId.current);
      timerId.current = setTimeout(() => {
        console.log("TIME'S OVER");
        dispatch({ type: "time_is_up", payload: { boolean: true } });

        setTimeout(() => {
          dispatch({ type: "increase_question" });
        }, qIntervalMs);
      }, qTimeLimitMs);
      dispatch({ type: "empty_bar_and_set_disabled_false" });
    }, qIntervalMs);
  }

  function handleAnswerClick(answer: string, index: number) {
    if (answer == state.questions[state.qNumber].correctAnswer) {
      console.log("YOU WON");
      dispatch({ type: "increase_score" });
    } else {
      console.log("YOU LOST");
      dispatch({ type: "wrong" });
    }

    dispatch({ type: "handle_answer_click", payload: { index: index } });

    clearTimeout(timerId.current);
    setTimeout(() => {
      dispatch({ type: "next_question" });
    }, qIntervalMs);
  }

  useEffect(() => {
    if (
      state.started &&
      state.qNumber + 1 <= state.questions.length &&
      state.hp >= 1
    ) {
      resetTimeout();
    } else if (state.started && state.qNumber !== 0 && !state.ended) {
      console.log("THE END");
      dispatch({ type: "end_game" });
    }
  }, [state.qNumber]);

  return (
    <div className={`flex min-h-screen flex-col ${state.color}`}>
      {state.started && state.ended == false ? (
        <>
          <div className="flex h-full flex-row items-center gap-6 p-4 [&>span]:text-xl [&>span]:font-bold [&>span]:md:text-3xl">
            <span>
              {state.qNumber + 1}/{state.questions.length}
            </span>
            <span className="flex flex-row items-center gap-2">
              {state.score}
              <AiFillStar className="text-yellow-500" />
            </span>
            <Time styleProp={state.style} />
            <span className="flex flex-row items-center gap-2">
              {state.hp}
              <AiFillHeart className="text-red-500" />
            </span>
          </div>
          <div className="m-auto flex h-full w-full max-w-7xl flex-col justify-start gap-20 px-4 md:justify-evenly">
            <h1 className="my-16 text-center text-3xl font-bold md:my-0 md:text-5xl lg:text-6xl">
              {(state.questions.length &&
                state.questions[state.qNumber].question) ||
                "Loading..."}
            </h1>
            <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-2">
              {state.questions.length &&
                state.answers[state.qNumber].map(
                  (answer: string, index: number) => (
                    <ButtonCVA
                      key={answer}
                      text={answer}
                      disabled={state.disabled}
                      big={true}
                      disableHover={state.disabled}
                      intent={
                        state.answered &&
                        answer == state.questions[state.qNumber].correctAnswer
                          ? "good"
                          : state.answered &&
                            answer !=
                              state.questions[state.qNumber].correctAnswer &&
                            index == state.selected
                          ? "danger"
                          : "normal"
                      }
                      onClick={() => handleAnswerClick(answer, index)}
                    />
                  )
                )}
            </div>
          </div>
        </>
      ) : state.qNumber !== 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold sm:text-5xl">
              You Scored {state.score}/{state.questions.length}
            </h1>
            {!state.exists ? (
              <span className="text-sm sm:text-base ">
                If you want to lock your score in the IQ Island, write your name
              </span>
            ) : state.isScoreHigher ? (
              <span className="max-w-xl text-center text-sm text-red-500 sm:text-base">
                That name already exists, but you can <strong>change it</strong>
                , or if you want to
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

              if (state.exists === false) {
                console.log("Checking if player already exists");
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/api/getPlayers`
                );
                const data = await res.json();
                existingPlayer = data.find(
                  (player: Player) => player.name === nameInput.current!.value
                );

                dispatch({
                  type: "does_name_exists",
                  payload: {
                    boolean: Boolean(existingPlayer),
                    isScoreHigher: existingPlayer
                      ? state.score > existingPlayer.score
                      : undefined,
                  },
                });
              }

              if (state.exists && state.isScoreHigher) {
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/updatePlayer`, {
                  method: "POST",
                  body: JSON.stringify({
                    name: nameInput.current!.value,
                    score: state.score,
                    quote: quoteInput.current!.value || undefined,
                  }),
                });
                console.log("Wants to Update");
                changePlayerName(nameInput.current!.value);
                router.push("/iq-island");
              } else if (existingPlayer!) {
                console.log(state.exists);
                console.log("Name already exists");
              } else if (!state.isScoreHigher) {
                fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/createPlayer`, {
                  method: "POST",
                  body: JSON.stringify({
                    name: nameInput.current!.value,
                    score: state.score,
                    quote: quoteInput.current!.value || undefined,
                  }),
                });
                console.log("Creating player...");
                changePlayerName(nameInput.current!.value);
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
              onChange={() =>
                dispatch({
                  type: "does_name_exists",
                  payload: { boolean: false, isScoreHigher: undefined },
                })
              }
            />
            <textarea
              className="black-shadow h-40 w-full px-4 py-2 sm:max-w-sm"
              placeholder="I got more points than you because..."
              ref={quoteInput}
            />
            {(state.isScoreHigher === undefined || state.isScoreHigher) && (
              <ButtonCVA
                text={`Lock your ${state.exists ? "score" : "name"}`}
                intent={state.exists ? "good" : "normal"}
              />
            )}
          </form>
        </div>
      ) : (
        <div className="flex h-full min-h-screen flex-col items-center justify-center gap-16">
          <h1 className="text-7xl font-black lg:text-9xl">IQ Island</h1>
          <div className="flex flex-row gap-4">
            <Link href="/start">
              <ButtonCVA
                onClick={() => {
                  fetch("https://the-trivia-api.com/api/questions?limit=50")
                    .then((res) => res.json())
                    .then((data) => {
                      const shuffledAnswers = data.map((question: Question) =>
                        [
                          question.correctAnswer,
                          ...question.incorrectAnswers,
                        ].sort(() => Math.random() - 0.5)
                      );
                      dispatch({
                        type: "fetch_questions",
                        payload: { questions: data, answers: shuffledAnswers },
                      });
                    })
                    .then(() => {
                      resetTimeout();
                      dispatch({ type: "start" });
                    });
                }}
                text="Start"
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
