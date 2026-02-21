export const calcChange = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
};

export const getDealStatus = (probability) => {
  if (probability >= 100) return "Won";
  if (probability <= 0) return "Lost";
  return "In Progress";
};
