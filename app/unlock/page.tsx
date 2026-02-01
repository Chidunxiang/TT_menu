"use client";

import { useEffect, useState } from "react";

export default function UnlockPage() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      if (next) setNextPath(next);
    } catch {
      // ignore
    }
  }, []);

  async function submit() {
    setErr("");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      setErr("密码不对 😤");
      return;
    }

    window.location.href = nextPath;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-['Nunito']">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-2xl font-extrabold text-pink-500">TT Menu</div>
        <div className="mt-1 text-sm text-gray-500">输入密码进入（only for TT 💗）</div>

        <div className="mt-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Passcode"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
          />
          {err && <div className="mt-2 text-sm text-red-500">{err}</div>}
        </div>

        <button
          onClick={submit}
          className="mt-4 w-full py-2 rounded-xl bg-pink-400 hover:bg-pink-500 text-white font-extrabold"
        >
          Enter
        </button>
      </div>
    </div>
  );
}