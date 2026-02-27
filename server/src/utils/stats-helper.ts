export const calcChange = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
};

export const getDealStatus = (probability: number): string => {
  if (probability >= 100) return "Won";
  if (probability <= 0) return "Lost";
  return "In Progress";
};
