import { useEffect } from "react";
import { GameLayout, MainIcon } from "@/App";

export type ResultsProps = {
  data: {
    gameId: string;
    won: boolean;
    attempts: number;
    timeSpent: number;
    score: number;
    word: string;
  };
  userId: string;
  onNewGame: () => void;
  onQuit: () => void;
};

function Result({ data, userId, onNewGame, onQuit }: ResultsProps) {
  const { gameId, won, attempts, timeSpent, score, word } = data;

  useEffect(() => {
    if (!gameId) return;

    const saveKey = `saved_game_${gameId}`;
    if (localStorage.getItem(saveKey)) {
      return;
    }

    const handleSaveScore = async () => {
      const payload = {
        gameId,
        playerId: userId,
        score,
        timestamp: Date.now(),
        attempts,
        timeSpent,
        won,
      };
      console.log("Sending to server:", JSON.stringify(payload, null, 2));
      try {
        await fetch("/api/score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        localStorage.setItem(saveKey, "1");
      } catch (error) {
        console.error("Ошибка сохранения результата:", error);
      }
    };

    handleSaveScore();
  }, [gameId, userId, score, attempts, timeSpent, won]);

  return (
    <GameLayout>
      <div className="text-center space-y-8">
        {won ? (
          <MainIcon variant="success">🎉</MainIcon>
        ) : (
          <MainIcon variant="error">😔</MainIcon>
        )}

        <div className="space-y-3">
          <h1
            className={`text-5xl md:text-6xl font-black tracking-tight uppercase ${
              won ? "text-green-400" : "text-red-400"
            }`}
          >
            {won ? "Победа!" : "Поражение"}
          </h1>
          <div
            className={`h-1 w-32 mx-auto ${won ? "bg-green-400" : "bg-red-400"}`}
          ></div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-300 text-lg font-medium">
            {won ? "Правильное слово:" : "Правильное слово было:"}
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {word.split("").map((letter, idx) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: letters are static and index is stable
                key={idx}
                className="bg-amber-400 text-slate-900 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center font-black text-xl md:text-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)]"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-700 p-4 border-2 border-slate-900 shadow-[3px_3px_0_0_rgb(15,23,42)]">
            <div className="text-slate-400 text-sm font-bold uppercase mb-1">
              Попытки
            </div>
            <div className="text-white text-2xl font-black">{attempts}</div>
          </div>
          <div className="bg-slate-700 p-4 border-2 border-slate-900 shadow-[3px_3px_0_0_rgb(15,23,42)]">
            <div className="text-slate-400 text-sm font-bold uppercase mb-1">
              Время
            </div>
            <div className="text-white text-2xl font-black">{timeSpent}с</div>
          </div>
          <div className="bg-slate-700 p-4 border-2 border-slate-900 shadow-[3px_3px_0_0_rgb(15,23,42)]">
            <div className="text-slate-400 text-sm font-bold uppercase mb-1">
              Очки
            </div>
            <div className="text-white text-2xl font-black">{score}</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            type="button"
            onClick={onNewGame}
            className="w-full px-8 py-5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-lg uppercase tracking-wider border-4 border-slate-900 shadow-[6px_6px_0_0_rgb(15,23,42)] hover:shadow-[4px_4px_0_0_rgb(15,23,42)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 active:shadow-[2px_2px_0_0_rgb(15,23,42)] active:translate-x-[4px] active:translate-y-[4px]"
          >
            Новая игра
          </button>
          <button
            type="button"
            onClick={onQuit}
            className="w-full px-8 py-5 bg-slate-700 hover:bg-slate-600 text-white font-black text-lg uppercase tracking-wider border-4 border-slate-900 shadow-[6px_6px_0_0_rgb(15,23,42)] hover:shadow-[4px_4px_0_0_rgb(15,23,42)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 active:shadow-[2px_2px_0_0_rgb(15,23,42)] active:translate-x-[4px] active:translate-y-[4px]"
          >
            В меню
          </button>
        </div>
      </div>
    </GameLayout>
  );
}

export default Result;
