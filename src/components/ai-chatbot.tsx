import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickBookModal } from "@/components/quick-book-modal";

type Msg = { id: string; role: "user" | "ai"; text: string };

const intro: Msg = {
  id: "intro",
  role: "ai",
  text: "Hey 👋 I'm Luka's AI concierge. I can help you book a session, share pricing, or recommend a program. What are you after?",
};

function reply(input: string): string {
  const q = input.toLowerCase();
  if (/(price|pricing|cost|how much|fee)/.test(q))
    return "Our 1-1 coaching call is $199.99 (45 min). The 12-week mobility plan is $499, and digital programs start at $39.97. Want me to open the booking form?";
  if (/(book|schedule|appointment|session|call|meeting)/.test(q))
    return "Perfect — tap the Book Meeting button below and I'll auto-fill the best available slot for you.";
  if (/(available|time|when|slot|today|tomorrow)/.test(q))
    return "Luka's calendar opens daily 8 AM – 8 PM. Evenings 5–7 PM book fastest, so I'd grab one early.";
  if (/(service|program|offer|coaching|what do you)/.test(q))
    return "We run 1-1 coaching, custom 12-week mobility plans, the Foundation Protocol, a Handstand Course, and two communities (Handstand & Mindset).";
  if (/(hi|hello|hey|yo|sup)/.test(q))
    return "Hey! Ready to level up your movement? I can book a call in under 30 seconds.";
  if (/(refund|cancel|reschedule)/.test(q))
    return "Reschedules are free up to 24h before your session. Drop the request and I'll flag it for Luka.";
  if (/(contact|email|whatsapp|phone)/.test(q))
    return "Easiest path: book a session and Luka reaches out directly. Or hit the Contact page in the menu.";
  return "Got it. I can help you book a session, explain pricing, or describe Luka's programs — which would you like?";
}

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([intro]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const delay = 600 + Math.random() * 700;
    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: reply(trimmed) }]);
      setTyping(false);
    }, delay);
  };

  return (
    <>
      {!open && (
        <button
          aria-label="Open AI assistant"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-primary/50"
        >
          <span className="relative grid size-6 place-items-center">
            <MessageCircle className="size-5" />
            <span className="absolute -right-1 -top-1 size-2 animate-ping rounded-full bg-primary-foreground" />
          </span>
          Ask AI
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-40 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl shadow-primary/20 backdrop-blur-xl animate-scale-in">
          <header className="flex items-center justify-between border-b border-border/60 bg-gradient-to-br from-primary/15 via-transparent to-transparent p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold">Luka AI</p>
                <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="size-1.5 animate-pulse rounded-full bg-green-500" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-1 hover:bg-muted">
              <X className="size-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/60 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <button
                onClick={() => setShowBook(true)}
                className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/20"
              >
                <Sparkles className="mr-1 inline size-3" /> Book meeting
              </button>
              <button
                onClick={() => send("What are your prices?")}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-muted"
              >
                Pricing
              </button>
              <button
                onClick={() => send("What services do you offer?")}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-muted"
              >
                Services
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="h-9"
              />
              <Button type="submit" size="icon" aria-label="Send">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <QuickBookModal open={showBook} onOpenChange={setShowBook} />
    </>
  );
}
