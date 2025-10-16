export default function Lobby() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Lobby</h2>
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded">Create Room</button>
        <button className="px-3 py-2 border rounded">Quick Play</button>
      </div>
      <div className="border rounded p-3">Rooms list (todo)</div>
    </div>
  );
}

