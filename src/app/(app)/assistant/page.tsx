"use client";

import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

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
    <div className="flex min-h-[calc(100dvh-11rem)] flex-col">
      <div className="flex items-center gap-2.5 pb-4">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h1 className="text-lg font-semibold">Flow AI</h1>
          <p className="text-xs text-muted">Answers from your feed only</p>
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
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "rounded-br-lg bg-gradient-to-r from-violet-600 to-violet-500 text-white"
                  : "glass rounded-bl-lg text-foreground/90"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-24 mt-4 space-y-2.5">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => send(suggestion)}
              className="glass shrink-0 rounded-full px-3.5 py-2 text-xs font-medium text-foreground/85 transition active:scale-95"
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
          className="glass-strong flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your feed…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white transition active:scale-90"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
