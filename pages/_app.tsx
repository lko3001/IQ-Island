import { Space_Grotesk } from "@next/font/google";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlayerProvider } from "@/components/context/PlayerContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--spaceGrotesk",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <main
        className={`font-spaceGrotesk ${spaceGrotesk.variable} bg-slate-90 min-h-screen`}
      >
        <Component {...pageProps} />
      </main>
    </PlayerProvider>
  );
}
