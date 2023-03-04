import { Space_Grotesk } from "@next/font/google";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlayerProvider } from "@/components/context/PlayerContext";
import { StatsProvider } from "@/components/context/StatsContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--spaceGrotesk",
  display: 'swap' 
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <StatsProvider>
        <main
          className={`font-spaceGrotesk ${spaceGrotesk.variable} bg-slate-90 min-h-screen`}
        >
          <Component {...pageProps} />
        </main>
      </StatsProvider>
    </PlayerProvider>
  );
}
