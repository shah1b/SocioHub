"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "What happened in football today?",
  "Summarize today's tech news",
  "What videos should I watch?",
];

// Canned demo responses keyed by suggestion; the real assistant will be
// backed by an AI endpoint reading from the user's actual feed.
function demoReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("football")) {
    return "Here's your football recap: Fabrizio confirmed the midfield transfer is done (announcement within 48h), ESPN FC posted extended highlights of the 4-3 thriller, and The Athletic has a tactical breakdown of why the high press collapsed after the hour mark.";
  }
  if (q.includes("tech")) {
    return "Today in tech: TypeScript 6.0 drops implicit any (Fireship has a 2:47 explainer), MKBHD revisits foldables three years on, and Hugging Face released open weights for a 3B model matching last year's 70B on reasoning.";
  }
  if (q.includes("watch")) {
    return "Based on Learning mode: 1) Fireship's TypeScript 6.0 explainer (2:47), 2) The Athletic's tactical breakdown (6 min read), 3) MKBHD's foldables retrospective (14:05). Total: about 23 minutes of intentional watching.";
  }
  return "I'm running in demo mode — once Flow is connected to Supabase and an AI backend, I'll answer from your real feed. Try one of the suggestions to see how I'll summarize your day.";
}

/* The one intentionally light screen: a calm pastel canvas with white
   frosted bubbles — a visual breather from the black feed. */
export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm your Flow assistant. Ask me anything about the content in your feed — I'll summarize, recap, and recommend without wasting your time.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const question = text.trim();
    if (!question) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: demoReply(question) },
    ]);
    setInput("");
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  return (
    <div className="pastel-canvas fixed inset-0 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-4 pb-36 pt-6 text-zinc-900">
        <div className="flex items-center gap-3 pb-5">
          <Image
            src="/icon.png"
            alt="Flow logo"
            width={44}
            height={44}
            className="rounded-2xl shadow-lg shadow-accent/30"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Flow AI</h1>
            <p className="text-xs font-medium text-zinc-500">
              Answers from your feed only
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`animate-rise flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm font-medium leading-relaxed shadow-md ${
                  message.role === "user"
                    ? "bg-brand rounded-br-lg text-white shadow-accent/20"
                    : "rounded-bl-lg bg-white/85 text-zinc-800 shadow-zinc-300/40 backdrop-blur"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-28 mt-5 space-y-2.5">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => send(suggestion)}
                className="shrink-0 rounded-full bg-white/70 px-4 py-2 text-xs font-bold text-zinc-700 shadow-sm backdrop-blur transition active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-5 pr-1.5 shadow-lg shadow-zinc-300/40 backdrop-blur"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Start typing…"
              className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400"
            />
            <button
              type="submit"
              aria-label="Send"
              className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg shadow-accent/30 transition active:scale-90"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
