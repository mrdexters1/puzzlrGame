import { useCallback, useEffect, useRef, useState } from "react";
import { GameLayout } from "@/App";
import { useLocalStorage } from "@/toolbox/hooks/useLocalStorage";
import type { ResultsProps } from "./Result";

type GameState = {
  word: string;
  scrambledWord: string;
  attempts: number;
  timeStart: number;
  hint: string;
};

const MAX_ATTEMPTS = 5;

function Game({
  gameId,
  onFinish,
  onQuit,
}: {
  gameId: string;
  onFinish: (data: ResultsProps["data"]) => void;
  onQuit: () => void;
}) {
  const [savedGameState, setSavedGameState] = useLocalStorage<GameState | null>(
    "currentGame",
    null,
  );
  const [word, setWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [timeStart, setTimeStart] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hint, setHint] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isRestoredRef = useRef(false);

  const scrambleWord = useCallback(({ word }: { word: string }) => {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join("");
  }, []);

  const fetchWord = useCallback(async () => {
    try {
      const response = await fetch(`/api/word`);
      const data = await response.json();
      const wordToGuess = data.word.toUpperCase();
      const scrambled = scrambleWord({ word: wordToGuess });
      const startTime = Date.now();
      isRestoredRef.current = true;
      setWord(wordToGuess);
      setScrambledWord(scrambled);
      setAttempts(0);
      setGuess("");
      setHint("");
      setTimeStart(startTime);
      setTimeSpent(0);
      setSavedGameState({
        word: wordToGuess,
        scrambledWord: scrambled,
        attempts: 0,
        timeStart: startTime,
        hint: "",
      });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error loading word:", error);
    }
  }, [scrambleWord, setSavedGameState]);

  useEffect(() => {
    if (!savedGameState?.word) {
      fetchWord();
      return;
    }

    if (isRestoredRef.current) {
      return;
    }

    isRestoredRef.current = true;
    setWord(savedGameState.word);
    setScrambledWord(savedGameState.scrambledWord);
    setAttempts(savedGameState.attempts);
    setTimeStart(savedGameState.timeStart);
    setHint(savedGameState.hint);

    setTimeSpent(Math.floor((Date.now() - savedGameState.timeStart) / 1000));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [savedGameState, fetchWord]);

  useEffect(() => {
    if (word && timeStart && isRestoredRef.current) {
      setSavedGameState({
        word,
        scrambledWord,
        attempts,
        timeStart,
        hint,
      });
    }
  }, [word, scrambledWord, attempts, timeStart, hint, setSavedGameState]);

  useEffect(() => {
    if (word && timeStart) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - timeStart) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [word, timeStart]);

  const getFinalTime = () => {
    return timeStart ? Math.floor((Date.now() - timeStart) / 1000) : 0;
  };

  const finishGame = (won: boolean) => {
    const finalTime = getFinalTime();
    setSavedGameState(null);
    onFinish({
      gameId,
      won,
      attempts: attempts + 1,
      timeSpent: finalTime,
      score: won
        ? calculateScore({
            attempts: attempts + 1,
            time: finalTime,
            wordLength: word.length,
          })
        : 0,
      word,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!guess.trim()) return;

    const newAttempts = attempts + 1;
    const guessUpper = guess.toUpperCase().trim();

    if (guessUpper === word) {
      finishGame(true);
    } else if (newAttempts >= MAX_ATTEMPTS) {
      finishGame(false);
    } else {
      const matches = countMatches({ guess: guessUpper, word });
      setHint(`Matching letters: ${matches} of ${word.length}`);
      setAttempts(newAttempts);
      setGuess("");
      inputRef.current?.focus();
    }
  };

  const countMatches = ({ guess, word }: { guess: string; word: string }) => {
    let matches = 0;
    const minLength = Math.min(guess.length, word.length);
    for (let i = 0; i < minLength; i++) {
      if (guess[i] === word[i]) {
        matches++;
      }
    }
    return matches;
  };

  const calculateScore = ({
    attempts,
    time,
    wordLength,
  }: {
    attempts: number;
    time: number;
    wordLength: number;
  }) => {
    const baseScore = wordLength * 100;
    const attemptBonus = (MAX_ATTEMPTS - attempts + 1) * 50;
    const timeBonus = Math.max(0, 60 - time) * 10;
    return baseScore + attemptBonus + timeBonus;
  };

  const remainingAttempts = MAX_ATTEMPTS - attempts;

  return (
    <GameLayout>
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onQuit}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0_0_rgb(15,23,42)] hover:shadow-[2px_2px_0_0_rgb(15,23,42)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-100"
        >
          Quit
        </button>
        <div className="flex gap-4 text-white font-bold">
          <div className="bg-slate-700 px-3 py-1 border-2 border-slate-900 shadow-[2px_2px_0_0_rgb(15,23,42)]">
            Attempts: {remainingAttempts}/{MAX_ATTEMPTS}
          </div>
          <div className="bg-slate-700 px-3 py-1 border-2 border-slate-900 shadow-[2px_2px_0_0_rgb(15,23,42)]">
            Time: {timeSpent}s
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-2">
            Guess the word!
          </h2>
          <div className="h-1 w-24 bg-amber-400 mx-auto"></div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {scrambledWord.split("").map((letter, idx) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: letters are static and index is stable
              key={idx}
              className="bg-amber-400 text-slate-900 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-black text-xl md:text-2xl border-4 border-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)]"
            >
              {letter}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value.toUpperCase())}
            placeholder="Enter word"
            maxLength={word.length}
            className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 font-bold text-lg uppercase tracking-wider border-4 border-slate-900 shadow-[4px_4px_0_0_rgb(15,23,42)] focus:outline-none focus:bg-slate-600 transition-colors"
          />
          <button
            type="submit"
            disabled={!guess.trim()}
            className="w-full px-8 py-4 bg-amber-400 hover:bg-amber-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-900 font-black text-lg uppercase tracking-wider border-4 border-slate-900 shadow-[6px_6px_0_0_rgb(15,23,42)] hover:shadow-[4px_4px_0_0_rgb(15,23,42)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 active:shadow-[2px_2px_0_0_rgb(15,23,42)] active:translate-x-[4px] active:translate-y-[4px] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          >
            Check
          </button>
        </form>

        {hint && (
          <div className="text-center">
            <div className="inline-block bg-slate-700 px-4 py-2 text-white font-bold border-2 border-slate-900 shadow-[3px_3px_0_0_rgb(15,23,42)]">
              {hint}
            </div>
          </div>
        )}

        {remainingAttempts <= 2 && remainingAttempts > 0 && (
          <div className="text-center">
            <div className="inline-block bg-red-600 px-4 py-2 text-white font-black uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0_0_rgb(15,23,42)]">
              ⚠️ Attempts remaining: {remainingAttempts}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
}

export default Game;
