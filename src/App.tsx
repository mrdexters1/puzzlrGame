import { useState } from "react";
import Game from "@/components/core/Game";
import Result, { type ResultsProps } from "@/components/core/Result";
import { useLocalStorage } from "@/toolbox/hooks/useLocalStorage";
import { generateUUID } from "@/toolbox/utils/generateUUID";
import { BestResults } from "./components/core/BestResults";

export enum AppState {
  HOME = "home",
  PLAYING = "playing",
  FINISHED = "finished",
}

type GameData = ResultsProps["data"];

function App() {
  const [userId] = useLocalStorage<string>("userId", () => generateUUID());
  const [mainState, setMainState] = useLocalStorage<AppState>(
    "mainState",
    AppState.HOME,
  );
  const [gameData, setGameData] = useLocalStorage<GameData | null>(
    "gameData",
    null,
  );
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const clearCurrentGame = () => {
    localStorage.removeItem("currentGame");
  };

  const startNewGame = () => {
    clearCurrentGame();
    setCurrentGameId(generateUUID());
    setMainState(AppState.PLAYING);
    setGameData(null);
  };

  const handleGameFinish = (data: GameData) => {
    setMainState(AppState.FINISHED);
    setGameData(data);
  };

  const handleQuit = () => {
    clearCurrentGame();
    setMainState(AppState.HOME);
    setGameData(null);
  };

  return (
    <div className="app">
      {mainState === AppState.HOME && (
        <GameLayout>
          <div className="text-center space-y-8">
            <MainIcon>🧩</MainIcon>

            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase">
                Hidden Word
              </h1>
              <div className="h-1 w-32 bg-amber-400 mx-auto"></div>
              <h2 className="text-xl font-bold text-slate-400 uppercase tracking-wider">
                Guess the word before you run out of tries.
              </h2>
            </div>

            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Think you’re as sharp as you say you are? Prove it.
            </p>

            <button
              type="button"
              onClick={startNewGame}
              className="w-full mt-10 px-8 py-5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg uppercase tracking-wider border-4 border-slate-900 shadow-[6px_6px_0_0_rgb(15,23,42)] hover:shadow-[4px_4px_0_0_rgb(15,23,42)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 active:shadow-[2px_2px_0_0_rgb(15,23,42)] active:translate-x-[4px] active:translate-y-[4px]"
            >
              Start Fighting
            </button>
          </div>
        </GameLayout>
      )}

      {mainState === AppState.PLAYING && currentGameId && (
        <Game
          gameId={currentGameId}
          onFinish={handleGameFinish}
          onQuit={handleQuit}
        />
      )}

      {mainState === AppState.FINISHED && gameData && (
        <Result
          data={gameData}
          userId={userId}
          onNewGame={startNewGame}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}

export function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-slate-900 p-4 gap-4 lg:gap-8">
      <div className="max-w-2xl w-full order-1 lg:order-1">
        <div className="bg-slate-800 border-2 border-slate-700 p-4 sm:p-6 md:p-10 shadow-[8px_8px_0_0_rgb(15,23,42)]">
          {children}
        </div>
      </div>

      <div className="w-full max-w-2xl lg:w-64 lg:max-w-none flex-shrink-0 order-2 lg:order-2">
        <div className="bg-slate-800 border-2 border-slate-700 p-4 shadow-[8px_8px_0_0_rgb(15,23,42)]">
          <BestResults />
        </div>
      </div>
    </div>
  );
}

export function MainIcon({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "error";
}) {
  const bgColor =
    variant === "success"
      ? "bg-green-500"
      : variant === "error"
        ? "bg-red-500"
        : "bg-amber-400";

  return (
    <div className="inline-block">
      <div
        className={`${bgColor} w-24 h-24 flex items-center justify-center border-4 border-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)]`}
      >
        <span className="text-5xl">{children}</span>
      </div>
    </div>
  );
}

export default App;
