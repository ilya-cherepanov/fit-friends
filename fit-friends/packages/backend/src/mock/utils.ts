export function* generateReverseDaysSequence(daysCount: number) {
  if (daysCount <= 0) {
    throw new Error('daysCount must be greater than 0');
  }

  const loopDate = new Date();
  for (let i = 0; i < daysCount; ++i) {
    yield new Date(loopDate);
    loopDate.setDate(loopDate.getDate() - 1);
  }
}
