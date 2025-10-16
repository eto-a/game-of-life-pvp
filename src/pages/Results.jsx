export default function Results() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Results</h2>
      <div className="border rounded p-3">Score & Rating delta (todo)</div>
      <div className="flex gap-2">
        <a href="/lobby" className="px-3 py-2 border rounded">Play Again</a>
        <a href="/leaderboard" className="px-3 py-2 border rounded">Leaderboard</a>
      </div>
    </div>
  );
}

