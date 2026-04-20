"use client";

import { useState } from "react";
import { updateCard } from "../lib/sm2";

export default function Home() {
  const [text, setText] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [flip, setFlip] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 GENERATE CARDS
  const generate = () => {
    if (!text) return;

    setLoading(true);

    const sentences = text
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .split(/[.?!]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    const generatedCards = sentences.map((sentence) => {
      const words = sentence.split(" ");

      return {
        question: `What is ${words.slice(0, 4).join(" ")}...?`,
        answer: sentence,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: Date.now(),
      };
    });

    setCards(generatedCards);
    setCurrent(0);
    setFlip(false);
    setLoading(false);
  };

  // ⭐ RATE CARD
  const rate = (quality: number) => {
    const updated = [...cards];

    const card = updated[current];
    const newCard = updateCard(card, quality);

    updated[current] = newCard;
    setCards(updated);

    const nextIndex = updated.findIndex(
      (c) => c.dueDate <= Date.now()
    );

    setCurrent(nextIndex !== -1 ? nextIndex : 0);
    setFlip(false);
  };

  // 🧠 DUE CARDS
  const dueCards = cards.filter((c) => c.dueDate <= Date.now());

  const currentCard =
    dueCards.length > 0 ? dueCards[0] : cards[current];

  // 📊 DASHBOARD
  const mastered = cards.filter(c => c.repetitions >= 4).length;
  const learning = cards.filter(c => c.repetitions > 0 && c.repetitions < 4).length;
  const newCards = cards.filter(c => c.repetitions === 0).length;

  const accuracy = cards.length
    ? Math.round(
        (cards.filter(c => c.repetitions > 0).length / cards.length) * 100
      )
    : 0;

  const progress = cards.length
    ? (mastered / cards.length) * 100
    : 0;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">

      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
        🧠 FlashAI
      </h1>

      {/* Dashboard */}
      <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-xl p-5 mb-6 w-full max-w-md text-white">

        <h2 className="text-lg font-semibold mb-3">📊 Progress</h2>

        <div className="flex justify-between text-sm mb-2">
          <span>✅ {mastered}</span>
          <span>📘 {learning}</span>
          <span>🆕 {newCards}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>⏳ Due: {dueCards.length}</span>
          <span>🎯 {accuracy}%</span>
        </div>

        <div className="w-full h-2 bg-white/30 rounded mt-2">
          <div
            className="h-2 bg-green-400 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* Input */}
      <textarea
        className="w-full max-w-md p-3 rounded-lg shadow-lg mb-4 focus:outline-none"
        placeholder="Paste your notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Button */}
      <button
        onClick={generate}
        className="bg-black/80 hover:bg-black text-white px-6 py-2 rounded-lg shadow-lg transition mb-6"
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </button>

      {/* Flashcards */}
      {cards.length > 0 && (
        <div className="flex flex-col items-center gap-6">

          <p className="text-white text-sm">
            ⏳ Due: {dueCards.length} | 📚 Total: {cards.length}
          </p>

          {/* Card */}
          <div
            onClick={() => setFlip(!flip)}
            className="w-80 h-48 perspective cursor-pointer"
          >
            <div className={`flip-inner ${flip ? "rotate-y-180" : ""}`}>

              <div className="flip-face bg-white text-black shadow-2xl rounded-xl flex items-center justify-center p-4 text-center">
                {currentCard?.question}
              </div>

              <div className="flip-face flip-back bg-black text-white shadow-2xl rounded-xl flex items-center justify-center p-4 text-center">
                {currentCard?.answer}
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              onClick={() => rate(2)}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
            >
              Hard 😓
            </button>

            <button
              onClick={() => rate(5)}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow"
            >
              Easy 😄
            </button>
          </div>

          {/* Message */}
          {dueCards.length === 0 && (
            <p className="text-white text-sm">
              🎉 You're all caught up!
            </p>
          )}

        </div>
      )}
    </main>
  );
}