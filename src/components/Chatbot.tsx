import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff, Phone, ExternalLink, Loader2 } from "lucide-react";
import { studioInfo } from "@/data/media";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ESCALATION_ACTIONS = [
  { label: "Call", url: `tel:${studioInfo.phone}`, icon: "phone" as const },
  { label: "WhatsApp", url: `https://wa.me/${studioInfo.whatsapp}`, icon: "whatsapp" as const },
  { label: "Instagram DM", url: studioInfo.socialLinks.instagramDM, icon: "instagram" as const },
];

const actionIcons = {
  phone: <Phone size={12} />,
  whatsapp: <MessageCircle size={12} />,
  instagram: <ExternalLink size={12} />,
};

// Detect if message contains escalation keywords
function hasEscalation(text: string): boolean {
  const triggers = ["call", "whatsapp", "instagram", "connect with", "book", "consultation", "8420523235"];
  const lower = text.toLowerCase();
  return triggers.some((t) => lower.includes(t));
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const streamChat = useCallback(async (allMessages: Msg[]) => {
    setIsLoading(true);
    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Failed to connect" }));
        upsertAssistant(err.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("Chat stream error:", e);
      upsertAssistant("Connection error. Please try again.");
    }
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      streamChat(next);
      return next;
    });
    setInput("");
  }, [isLoading, streamChat]);

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  // Check if latest assistant message has escalation
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const showActions = lastAssistant ? hasEscalation(lastAssistant.content) : false;

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_30px_rgba(139,0,0,0.4)] ${isOpen ? "hidden" : ""}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[340px] max-h-[500px] flex flex-col rounded-sm border border-border/40 bg-card shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card">
              <div>
                <p className="text-foreground text-sm tracking-[0.15em]">POPINK ASSISTANT</p>
                <p className="text-muted-foreground text-[10px] tracking-[0.1em]">AI-Powered • Ask anything</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
              {/* Welcome */}
              {messages.length === 0 && (
                <div className="bg-secondary text-foreground/80 max-w-[85%] px-3 py-2 rounded-sm text-xs leading-relaxed">
                  <p>Welcome to The PopInk Studios! 🎨 Ask me about pricing, bookings, styles, aftercare, or anything else.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-sm text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary/20 text-foreground"
                        : "bg-secondary text-foreground/80"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground/50 px-3 py-2 rounded-sm text-xs flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              {/* Escalation actions */}
              {showActions && !isLoading && (
                <div className="flex flex-wrap gap-2 ml-1">
                  {ESCALATION_ACTIONS.map((action) => (
                    <a
                      key={action.label}
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary-foreground text-[10px] rounded-sm tracking-wider uppercase transition-colors"
                    >
                      {actionIcons[action.icon]}
                      {action.label}
                    </a>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-border/30 bg-card">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-sm transition-colors ${
                  isListening ? "bg-primary text-primary-foreground" : "text-foreground/40 hover:text-foreground"
                }`}
                aria-label={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={isListening ? "Listening..." : "Type a message..."}
                className="flex-1 bg-secondary/50 border border-border/20 rounded-sm px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                className="p-2 text-primary hover:text-primary/80 transition-colors disabled:opacity-30"
                aria-label="Send"
                disabled={isLoading || !input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
