const METRIKA_ID = 105547587;

export function trackMetrikaGoal(goal) {
  if (typeof window === "undefined") return;
  const ym = window.ym;
  if (typeof ym !== "function") return;
  ym(METRIKA_ID, "reachGoal", goal);
}
