"use client";

import { useRef, useState } from "react";
import type { AssistantResponse } from "@/lib/ai/assistant";
import type { MultiFloorPath } from "@/lib/map/multi-pathfind";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Props = {
  building: string;
  floor: string;
  /** Called whenever the assistant returns a non-null multi-floor path. */
  onRoute: (path: MultiFloorPath) => void;
};

export function AssistantPanel({ building, floor, onRoute }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send() {
    const message = input.trim();
    if (!message || busy) return;
    setInput("");
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content: message }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          building,
          floor,
          message,
          history: messages,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `request_failed_${res.status}`);
      }
      const data = (await res.json()) as AssistantResponse;
      setMessages([
        ...next,
        { role: "assistant", content: data.text || "(empty response)" },
      ]);
      if (data.path) onRoute(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown_error");
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      });
    }
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-overline">Ask the assistant</h2>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-caption hover:text-[color:var(--foreground)]"
          >
            clear
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="max-h-56 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-body"
      >
        {messages.length === 0 ? (
          <p className="text-caption">
            Try: <em>&ldquo;How do I get to room 201?&rdquo;</em> or{" "}
            <em>&ldquo;I use a wheelchair, how do I reach the lecture hall?&rdquo;</em>
          </p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m, i) => (
              <li key={i} className="leading-snug">
                <span
                  className={
                    m.role === "user"
                      ? "font-medium text-[color:var(--foreground)]"
                      : "font-medium text-[color:var(--brand)]"
                  }
                >
                  {m.role === "user" ? "You" : "Assistant"}:
                </span>{" "}
                <span className="text-[color:var(--foreground)]">
                  {m.content}
                </span>
              </li>
            ))}
            {busy && <li className="text-caption">Thinking…</li>}
          </ul>
        )}
      </div>

      {error && (
        <p className="text-caption text-[color:color-mix(in_oklab,var(--warning),#000_15%)]">
          {error.includes("ANTHROPIC_API_KEY")
            ? "Add ANTHROPIC_API_KEY to .env.local to enable the assistant."
            : `Error: ${error}`}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a route…"
          disabled={busy}
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-body shadow-sm focus:border-[var(--brand)] focus:outline-none disabled:bg-[var(--surface-2)]"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-md bg-[var(--brand)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand-strong)] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
