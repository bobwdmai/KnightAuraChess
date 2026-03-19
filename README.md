# ♞ KNightAuraChess

KNightAuraChess is a modern web-based chess variant where standard chess pieces gain "jump" abilities when positioned near friendly knights. 

The application is built with React, features a fully client-side AI engine powered by Web Workers, and supports real-time online multiplayer via Firebase.

![Main Interface Outline](public/riderchess.png) <!-- Assuming you have a logo or image here -->

## ✨ Features

- **Unique Jump Mechanics**: Sliding pieces, pawns, and kings can jump over a single blocking piece if they are within a Knight's "aura" (adjacent or a knight-jump away).
- **In-Browser AI Engine**: 100% client-side Alpha-Beta search AI running in a Web Worker means zero lag, no server hosting costs, and offline support. Supports Easy, Medium, Hard, and Expert difficulties.
- **Online Multiplayer**: Real-time peer-to-peer gameplay syncing using Firebase Firestore. 
- **Premium UI**: Integrated Lichess-inspired dark theme, elegant move highlighting, and a dynamic interactive "Learn" page tutorial.

## 🚀 Quick Start (Local Development)

The application is a standard **Vite + React** project. No backend server is required to run the game or the AI!

### Prerequisites
- Node.js (v18+)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/` in your browser.

## 🌐 Online Multiplayer Setup (Firebase)

To enable online matchmaking and Google Sign-in:

1. Create a [Firebase Project](https://console.firebase.google.com/).
2. Enable **Firestore Database** and set the security rules strictly using the provided `firestore.rules`.
3. Enable **Authentication** (Google and Anonymous providers).
4. Copy `.env.example` to `.env` and fill in your Firebase configuration keys:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
   VITE_FIREBASE_APP_ID=your_app_id
   ```

*(Note: API keys are safe to commit to your deployment provider or expose in the client build. Security is guaranteed by your Firestore Rules, not the API key itself.)*

## 🌩️ Deployment (Cloudflare Pages)

KNightAuraChess is optimized for seamless deployment to **Cloudflare Pages**:

1. In your Cloudflare Dashboard, go to **Workers & Pages** -> **Create application** -> **Pages**.
2. Connect your GitHub repository.
3. Use the following build settings:
   - **Framework preset**: None / Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy!
5. *Important*: If you use a custom domain, be sure to add it to your Firebase **Authorized Domains** list under Authentication Settings so Google Sign-In works.

## 🧠 AI Engine details
The AI is implemented entirely in JavaScript (`src/workers/aiWorker.js`) and calculates moves without freezing the UI. It features:
- **Alpha-Beta Pruning** with Iterative Deepening
- **Piece-Square Tables (PST)** and Material Evaluation
- Custom positional bonuses for the Knight Aura variant
- MVV-LVA move ordering (Most Valuable Victim - Least Valuable Attacker)
- Strict time limits per difficulty level to guarantee responsiveness

## 📜 License
MIT License
