export default function Auth() {
  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Auth</h2>
      <form className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" />
        <button className="w-full px-4 py-2 rounded bg-black text-white">Sign In</button>
      </form>
    </div>
  );
}

