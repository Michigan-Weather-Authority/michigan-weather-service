import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Sparkles, MessageCircle, X, Send, CloudRain, ShieldAlert, Compass } from "lucide-react";
import { askHailey } from "../lib/hailey.functions";

interface Message {
  id: string;
  sender: "hailey" | "user";
  text: string;
}

export function HaileyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "hailey",
      text: "Hey! I'm Hailey 🌨️ (get it, hail!) — your Michigan weather co-pilot. What can I check for your day?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend?: string) {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askHailey({ data: { question: q } });
      setMessages((prev) => [
        ...prev,
        { id: `h-${Date.now()}`, sender: "hailey", text: res.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, sender: "hailey", text: "Lost connection to the storm tower. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickPrompts = [
    { label: "🚗 Commute weather", q: "How are the roads and commute looking in Michigan today?" },
    { label: "⚡ Severe risk", q: "Are there any severe storm or high wind risks today?" },
    { label: "⛵ Lake conditions", q: "How are waves and winds on the Great Lakes?" },
    { label: "🧥 What should I wear?", q: "What layers or jacket do I need in Michigan today?" },
  ];

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Chat with Hailey AI"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Ask Hailey</span>
        </Button>
      )}

      {/* Chat drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[520px] w-[92vw] max-w-[380px] flex-col rounded-lg border border-border bg-card/95 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground">Hailey</h3>
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                    AI Co-Pilot
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">MIWeather by Michigan Weather Authority</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              aria-label="Close Hailey chat"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages list */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/70 text-foreground border border-border/50 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-none border border-border/50 bg-muted/70 px-3.5 py-2 text-muted-foreground">
                  Hailey is reading the radar...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick preset chips */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-border/50 px-3 py-2 scrollbar-none">
            {quickPrompts.map((p) => (
              <Button
                key={p.label}
                disabled={loading}
                onClick={() => handleSend(p.q)}
                className="whitespace-nowrap rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about snow, storms, wind..."
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
