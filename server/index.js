import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());

const scores = [];

const words = [
  "CODE",
  "GAME",
  "PROGRAM",
  "ALGORITHM",
  "FUNCTION",
  "VARIABLE",
  "ARRAY",
  "OBJECT",
  "CLASS",
  "METHOD",
  "INTERFACE",
  "TYPE",
  "STRING",
  "NUMBER",
  "BOOLEAN",
  "LOOP",
  "CONDITION",
  "ERROR",
  "DEBUG",
  "TEST",
  "REPOSITORY",
  "COMMIT",
  "BRANCH",
  "MERGE",
  "REQUEST",
];

app.get("/api/word", (_req, res) => {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  res.json({ word: randomWord });
});

app.post("/api/score", (req, res) => {
  const { gameId, playerId, score, timestamp, attempts, timeSpent, won } =
    req.body;

  const scoreEntry = {
    gameId: gameId || null,
    playerId,
    score,
    timestamp: timestamp || Date.now(),
    attempts,
    timeSpent,
    won,
  };

  scores.push(scoreEntry);

  if (scores.length > 1000) {
    scores.shift();
  }

  res.json({ success: true, score: scoreEntry });
});

app.get("/api/scores", (_req, res) => {
  const sorted = [...scores].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timestamp - b.timestamp;
  });
  res.json({ scores: sorted });
});

app.delete("/api/scores", (_req, res) => {
  while (scores.length > 0) {
    scores.pop();
  }
  res.json({ success: true, message: "Scores cleared" });
});

app.listen(PORT);
