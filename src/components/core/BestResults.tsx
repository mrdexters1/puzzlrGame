import { useCallback, useEffect, useState } from "react";
import { isNullish } from "@/toolbox/isNullish";
import type { ResultsProps } from "./Result";

export function BestResults() {
  const [scores, setScores] = useState<ResultsProps["data"][] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const MAX_SCORES = 5;

  const loadScores = useCallback(() => {
    setIsLoading(true);
    fetch("/api/scores")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setScores(data.scores))
      .catch(() => {
        setScores(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  if (isLoading) {
    return (
      <BestResultsLayout>
        <p className="text-slate-400 text-sm">Loading results...</p>
      </BestResultsLayout>
    );
  }

  if (isNullish(scores)) {
    return (
      <BestResultsLayout>
        <p className="text-slate-400 text-sm">
          An error occurred while loading the results
        </p>
        <button
          type="button"
          onClick={loadScores}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[2px_2px_0_0_rgb(15,23,42)] hover:shadow-[1px_1px_0_0_rgb(15,23,42)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-100"
        >
          Try again
        </button>
      </BestResultsLayout>
    );
  }

  if (scores.length === 0) {
    return (
      <BestResultsLayout>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-white font-black text-lg uppercase">
            Top results
          </h3>
          <p className="text-slate-400 text-sm">
            No results yet! Play and show how fast you are.
          </p>
        </div>
      </BestResultsLayout>
    );
  }

  const handleClear = async () => {
    const response = await fetch("/api/scores", {
      method: "DELETE",
      cache: "no-cache",
    });
    if (response.ok) {
      setScores([]);
    }
  };

  return (
    <BestResultsLayout>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-white font-black text-lg uppercase">Top results</h3>
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[2px_2px_0_0_rgb(15,23,42)] hover:shadow-[1px_1px_0_0_rgb(15,23,42)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-100"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {scores.slice(0, MAX_SCORES).map((entry, idx) => (
          <div
            key={entry.gameId}
            className="bg-slate-700 p-2 border-2 border-slate-900"
          >
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-bold text-sm">
                #{idx + 1}
              </span>
              <span className="text-white font-black">{entry.score}</span>
            </div>
            <div className="text-slate-400 text-xs mt-1">
              <span className="font-bold">Number of attempts:</span>
              {entry.attempts}
            </div>
            <div className="text-slate-400 text-xs mt-1">
              <span className="font-bold">Time spent:</span> {entry.timeSpent}с
            </div>
          </div>
        ))}
      </div>
    </BestResultsLayout>
  );
}

const BestResultsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-2">{children}</div>;
};
