# Puzzlr Game - Hidden Word

A word guessing game with scrambled letters. Guess the word in the minimum number of attempts and time!

## 🚀 Quick Start

### Requirements

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Or with npm
npm install
```

### Running the Project

```bash
# Run frontend and backend simultaneously
pnpm dev
```

After running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

### Production Build

```bash
pnpm build
pnpm preview
```

## 📁 Project Structure

```
puzzlrGame/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   └── core/          # Core game components
│   ├── toolbox/           # Utilities and hooks
│   └── App.tsx            # Main component
├── server/                 # Backend server
│   └── index.js           # Express API
└── dist/                   # Built frontend
```

## 🎮 How to Play

1. Click "Start Fighting" to begin the game
2. You'll see scrambled letters of a word
3. Guess the original word within 5 attempts
4. The faster you are and the fewer attempts you use - the higher your score!

## 🛠 Technologies

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS
- **Backend**: Express.js, Node.js
- **Package Manager**: pnpm

---

## 🗺 Game Development Roadmap

### Stage 1: Authentication and Database
**Goal**: Add user system and persistent data storage

- [ ] Implement user registration and authentication
- [ ] Add JWT tokens for sessions
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Migrate results storage to database
- [ ] Add user profiles with game history
- [ ] Implement password recovery

**Result**: Users can register, log in, and their results are saved in the database

---

### Stage 2: Leaderboard and Social Features
**Goal**: Create ranking system and ability to share results

- [ ] Global leaderboard (all-time top players)
- [ ] Weekly/monthly leaderboards
- [ ] Category-based leaderboards (easy/medium/hard words)
- [ ] Ability to share results on social media
- [ ] Generate beautiful result images for sharing
- [ ] Achievement and badge system

**Result**: Players can compete and share their achievements

---

### Stage 3: Gameplay Expansion
**Goal**: Add more content and mechanics

- [ ] Different difficulty levels (easy/medium/hard)
- [ ] Word categories (technology, nature, sports, etc.)
- [ ] "Daily Challenge" mode (one word per day for everyone)
- [ ] "Tournament" mode (time-based competition)
- [ ] Hint system (purchase with in-game currency)
- [ ] Multiplayer mode (1v1 competition)

**Result**: The game becomes more diverse and interesting

---

### Stage 4: Progression and Customization
**Goal**: Add progress system and personalization

- [ ] Level and experience (XP) system
- [ ] Unlockable themes
- [ ] Avatar customization
- [ ] Word collection (history of guessed words)
- [ ] Player statistics (win rate, average score, etc.)
- [ ] Daily rewards and streaks

**Result**: Players get motivation to return and develop their profile

---

### Stage 5: Social Features and Communities
**Goal**: Create player community

- [ ] Friends and follow system
- [ ] Private messages between players
- [ ] Groups/clubs by interests
- [ ] In-game chat
- [ ] Ability to create custom word dictionaries
- [ ] Publishing user dictionaries in marketplace

**Result**: Players can communicate and create content

---

### Stage 6: Monetization and Premium Features
**Goal**: Add monetization capability (optional)

- [ ] Premium subscription (remove ads, exclusive themes)
- [ ] In-game currency
- [ ] Shop for skins, themes, hints
- [ ] Advertising (for free users)
- [ ] Sponsored word dictionaries from brands
- [ ] Partnership programs

**Result**: The game can generate revenue for further development

---

### Stage 7: Analytics and Optimization
**Goal**: Improve experience based on data

- [ ] Analytics system (Google Analytics, Mixpanel)
- [ ] A/B testing of new features
- [ ] Metrics tracking (retention, engagement)
- [ ] Score calculation algorithm optimization
- [ ] Word difficulty balancing
- [ ] Personalization based on player behavior

**Result**: The game constantly improves based on data

---

### Stage 8: AI and Personalization
**Goal**: Use AI to improve experience

- [ ] AI word generation based on player interests
- [ ] Adaptive difficulty (adjusts to player level)
- [ ] AI learning assistant (explains strategies)
- [ ] Personalized challenge generation
- [ ] Chatbot for player support
- [ ] Game pattern analysis and recommendations

**Result**: The game becomes smarter and more personalized

---
