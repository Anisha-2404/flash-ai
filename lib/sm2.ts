export function updateCard(card: any, quality: number) {
  let {
    repetitions = 0,
    interval = 1,
    easeFactor = 2.5,
  } = card;

  // ❌ If difficult
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;

    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  // 🧠 Update ease factor
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (easeFactor < 1.3) easeFactor = 1.3;

  // ⭐ FIX: use DAYS instead of seconds
  const dueDate =
    Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    repetitions,
    interval,
    easeFactor,
    dueDate, // ⭐ use this instead of nextReview
  };
}