"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"manager" | "editor">("editor");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;
    setStatus("sending");

    const res = await fetch("/api/admin/invite-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: name, role }),
    });

    if (res.ok) {
      setStatus("ok");
      setEmail("");
      setName("");
    } else {
      const j = await res.json().catch(() => ({}));
      setErrorMsg(j.error ?? "Greška pri pozivanju.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="text-sm text-green-600 font-medium">
        Pozivnica je poslana! Korisnik će dobiti e-mail s linkom za postavljanje lozinke.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">Ime i prezime</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Ana Anić"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="ana@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-text mb-1">Uloga</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "manager" | "editor")}
          className="h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="editor">Urednik — može uređivati proizvode i blog</option>
          <option value="manager">Menadžer — može sve osim upravljanja korisnicima</option>
        </select>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Pošalji pozivnicu
      </button>
    </form>
  );
}
