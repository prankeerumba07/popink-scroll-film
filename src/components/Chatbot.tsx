import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff, Phone, ExternalLink } from "lucide-react";
import { studioInfo } from "@/data/media";

interface Message {
  role: "bot" | "user";
  text: string;
  actions?: { label: string; url: string; icon: "phone" | "whatsapp" | "instagram" }[];
}

// FAQ knowledge base with multilingual keyword matching
const faqEntries: { keywords: string[]; response: string; actions?: Message["actions"] }[] = [
  {
    keywords: ["price", "cost", "rate", "kitna", "kitne", "charge", "paisa", "daam", "kharcha"],
    response: "Tattoo pricing starts at ₹3,000 for small designs (up to 2 inches). Use our Price Calculator on this page for an instant estimate, or consult an artist directly.",
    actions: [{ label: "WhatsApp", url: `https://wa.me/${studioInfo.whatsapp}`, icon: "whatsapp" }],
  },
  {
    keywords: ["book", "appointment", "slot", "schedule", "samay", "time"],
    response: "You can book a consultation via WhatsApp or call us directly. Walk-ins are also welcome!",
    actions: [
      { label: "Call", url: `tel:${studioInfo.phone}`, icon: "phone" },
      { label: "WhatsApp", url: `https://wa.me/${studioInfo.whatsapp}`, icon: "whatsapp" },
    ],
  },
  {
    keywords: ["location", "address", "kahan", "where", "direction", "studio"],
    response: `We're at ${studioInfo.address}. You can find us on Google Maps.`,
    actions: [{ label: "Get Directions", url: `https://www.google.com/maps/search/?api=1&query=22.5125,88.3315`, icon: "phone" }],
  },
  {
    keywords: ["pain", "hurt", "dard", "dukh", "painful"],
    response: "Pain varies by placement and personal tolerance. Areas with more nerve endings (ribs, spine, inner arm) tend to be more sensitive. Our artists ensure you're comfortable throughout the session.",
  },
  {
    keywords: ["aftercare", "heal", "care", "theek", "recover"],
    response: "We provide a medical-grade aftercare kit with every session. Keep it moisturized, avoid sun exposure for 2 weeks, and don't scratch. Full healing takes 2-4 weeks.",
  },
  {
    keywords: ["piercing", "pierce", "ear", "nose", "navel"],
    response: "We offer precision piercing using implant-grade titanium and gold. Health, symmetry, and the architecture of the body are our priorities.",
  },
  {
    keywords: ["style", "design", "type", "realism", "geometric", "blackwork", "minimalist", "tribal"],
    response: "We specialize in Hyper-Realism, Geometric, Blackwork, Fine-Line, and Custom designs. Check out our gallery above or consult with an artist for a custom composition.",
  },
  {
    keywords: ["hello", "hi", "hey", "namaste", "kaise", "how are", "sup"],
    response: "Hey! Welcome to The PopInk Studios. How can I help you today? Ask me about pricing, bookings, aftercare, or anything else!",
  },
  {
    keywords: ["instagram", "insta", "ig", "social"],
    response: "Follow us on Instagram to see our latest work and behind-the-scenes content!",
    actions: [{ label: "Instagram", url: studioInfo.socialLinks.instagramDM, icon: "instagram" }],
  },
  {
    keywords: ["open", "hours", "timing", "time", "kab", "close"],
    response: "We're generally open 11 AM – 9 PM, but it's best to confirm via WhatsApp before visiting.",
    actions: [{ label: "WhatsApp", url: `https://wa.me/${studioInfo.whatsapp}`, icon: "whatsapp" }],
  },
];

const fallbackResponse: Message = {
  role: "bot",
  text: "I'm not sure about that, but our artists can help! Reach out via WhatsApp or call us.",
  actions: [
    { label: "Call", url: `tel:${studioInfo.phone}`, icon: "phone" },
    { label: "WhatsApp", url: `https://wa.me/${studioInfo.whatsapp}`, icon: "whatsapp" },
    { label: "Instagram DM", url: studioInfo.socialLinks.instagramDM, icon: "instagram" },
  ],
};

function findResponse(input: string): Message {
  const lower = input.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  for (const faq of faqEntries) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return { role: "bot", text: faq.response, actions: faq.actions };
    }
  }
  return fallbackResponse;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Welcome to The PopInk Studios! 🎨 Ask me about pricing, bookings, styles, aftercare, or anything else." },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const userMsg: Message = { role: "user", text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTimeout(() => {
        const botMsg = findResponse(text);
        setMessages((prev) => [...prev, botMsg]);
      }, 500 + Math.random() * 500);
    },
    []
  );

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
      sendMessage(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  const actionIcons = {
    phone: <Phone size={12} />,
    whatsapp: <MessageCircle size={12} />,
    instagram: <ExternalLink size={12} />,
  };

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
                <p className="text-muted-foreground text-[10px] tracking-[0.1em]">Ask us anything</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-sm text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary/20 text-foreground"
                        : "bg-secondary text-foreground/80"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.actions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.actions.map((action) => (
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
                  </div>
                </div>
              ))}
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
              />
              <button
                onClick={() => sendMessage(input)}
                className="p-2 text-primary hover:text-primary/80 transition-colors"
                aria-label="Send"
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
