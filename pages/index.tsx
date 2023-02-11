import { useEffect, useReducer, useRef, useState } from "react";
import Time from "@/components/Time";
import { ButtonCVA } from "@/components/cva/ButtonCVA";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePlayer } from "@/components/context/PlayerContext";
import { useStats } from "@/components/context/StatsContext";
import Head from "next/head";

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
  const [clicked, setClicked] = useState(false);
  const [categories, setCategories] = useState<{ [key: string]: string[] }>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();
  const { changePlayerObj, clearPlayerObj } = usePlayer();
  const { changeStats, clearStats } = useStats();

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
    fetch("https://the-trivia-api.com/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

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
      changeStats({
        score: state.score,
        questionsLength: state.questions.length,
      });
      router.push("/finished");
    }
  }, [state.qNumber]);

  return (
    <>
      <Head>
        <title>IQ Island</title>
        <meta property="og:title" content="IQ Island" />
        <meta name="description" content="Start the quiz and have fun" />
        <meta property="og:description" content="Start the quiz and have fun" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/q.ico" />
        <meta property="og:image" content="/fUudAEr.png" />
        <meta property="og:url" content="https://iq-island.vercel.app/" />
      </Head>
      <div className={`flex min-h-screen flex-col px-4 ${state.color}`}>
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
              <h1 className="my-8 text-center text-3xl font-bold md:my-0 md:text-5xl lg:text-6xl">
                {(state.questions.length &&
                  state.questions[state.qNumber].question) ||
                  "Loading..."}
              </h1>
              <div className="mb-4 flex w-full flex-col gap-4 md:mb-0 md:grid md:grid-cols-2 md:grid-rows-2">
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
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="flex grow flex-col items-center justify-center pt-[20vh] sm:pt-0">
            <div className="contents">
              <h1 className="mb-6 text-7xl font-black lg:text-9xl">
                IQ Island
              </h1>
              <div className="flex flex-col items-center gap-16">
                <ButtonCVA
                  bigText
                  disabled={clicked}
                  disableHover={clicked}
                  greyedOut={clicked}
                  onClick={() => {
                    setClicked(true);
                    console.log(
                      `https://the-trivia-api.com/api/questions?limit=25${
                        selectedCategories.length
                          ? `&categories=${selectedCategories.join(",")}`
                          : ""
                      }`
                    );
                    fetch(
                      `https://the-trivia-api.com/api/questions?limit=25${
                        selectedCategories.length
                          ? `&categories=${selectedCategories.join(",")}`
                          : ""
                      }`
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data, "aaaaaaaaa");
                        const shuffledAnswers = data.map((question: Question) =>
                          [
                            question.correctAnswer,
                            ...question.incorrectAnswers,
                          ].sort(() => Math.random() - 0.5)
                        );
                        dispatch({
                          type: "fetch_questions",
                          payload: {
                            questions: data,
                            answers: shuffledAnswers,
                          },
                        });
                      })
                      .then(() => {
                        resetTimeout();
                        dispatch({ type: "start" });
                      });
                  }}
                  text="Start"
                />
                <section className="max-w-4xl">
                  <h4 className="mb-4 text-center text-lg font-bold">
                    Select Cateogories
                  </h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    {Object.keys(categories).map((category) => {
                      const categorySlug = categories[category][0];
                      return (
                        <ButtonCVA
                          key={categorySlug}
                          text={category}
                          className="rounded-full text-sm"
                          intent="special"
                          pressed={selectedCategories.includes(categorySlug)}
                          onClick={() => {
                            if (selectedCategories.includes(categorySlug)) {
                              setSelectedCategories((prev) =>
                                prev.filter((cat) => cat !== categorySlug)
                              );
                            } else {
                              setSelectedCategories((prev) => [
                                ...prev,
                                categorySlug,
                              ]);
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
            <footer className="mt-8 mb-4 w-full text-center text-sm text-neutral-500 [&>a]:underline">
              <Link href="/iq-island">IQ Island</Link>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}
