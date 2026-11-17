import { useEffect, useRef, useState } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Dumbbell,
  Salad,
  HeartPulse,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import API from "../api/axios.js";

const suggestions = [
  {
    icon: Dumbbell,
    label: "Build muscle",
    prompt: "Create a 3-day workout plan for muscle hypertrophy.",
  },
  {
    icon: Salad,
    label: "Nutrition advice",
    prompt: "Suggest a healthy high-protein meal plan.",
  },
  {
    icon: HeartPulse,
    label: "Recovery tips",
    prompt: "How can I improve muscle recovery and sleep?",
  },
];

function AICoach() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm your **FitTrack AI Coach**. 💪\n\nI'm here to help you build muscle, improve your nutrition and reach your fitness goals.\n\nWhat would you like to work on today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const handleSend = async (e, suggestedMessage) => {
    e?.preventDefault();

    const message = (suggestedMessage || input).trim();

    if (!message || loading) return;

    const updatedMessages = [...messages, { role: "user", text: message }];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/ai/chat", {
        message,
        history: updatedMessages.slice(-10),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.reply || "No response received.",
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to your AI Coach. Please try again.",
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    if (loading) return;

    setMessages([
      {
        role: "assistant",
        text: "Hey! I'm your **FitTrack AI Coach**. 💪\n\nI'm ready to help with your workouts, nutrition and recovery. What's your next goal?",
      },
    ]);

    setError("");
    setInput("");
  };

  return (
    <main className="ai-page">
      <section className="ai-shell">
        {/* Header */}
        <header className="ai-header">
          <div className="ai-brand">
            <div className="ai-brand-icon">
              <Sparkles size={23} />
            </div>

            <div>
              <div className="ai-title-row">
                <h1>AI Fitness Coach</h1>
                <span className="ai-pro-badge">FITTRACK AI</span>
              </div>

              <p>Your personal intelligence for a stronger you.</p>
            </div>
          </div>

          <button
            className="ai-reset-button"
            onClick={handleReset}
            disabled={loading}
            title="Start a new conversation"
          >
            <RotateCcw size={16} />
            <span>New chat</span>
          </button>
        </header>

        {/* Status */}
        <div className="ai-status-bar">
          <span className="ai-online-dot" />
          <span>AI Coach is ready</span>
          <span className="ai-status-divider">•</span>
          <span>Powered by Gemini</span>
        </div>

        {/* Chat */}
        <section className="ai-chat-card">
          <div className="ai-messages">
            {messages.map((msg, index) => (
              <article className={`ai-message-row ${msg.role}`} key={index}>
                <div className={`ai-avatar ${msg.role}`}>
                  {msg.role === "assistant" ? (
                    <Bot size={19} />
                  ) : (
                    <User size={19} />
                  )}
                </div>

                <div className="ai-message-content">
                  <div className="ai-message-meta">
                    <span>
                      {msg.role === "assistant" ? "FitTrack Coach" : "You"}
                    </span>

                    {msg.role === "assistant" && (
                      <span className="ai-verified">
                        <Sparkles size={11} />
                        AI
                      </span>
                    )}
                  </div>

                  <div className={`ai-bubble ${msg.role}`}>
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ children, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* Typing indicator */}
            {loading && (
              <article className="ai-message-row assistant">
                <div className="ai-avatar assistant">
                  <Bot size={19} />
                </div>

                <div className="ai-message-content">
                  <div className="ai-message-meta">
                    <span>FitTrack Coach</span>
                    <span className="ai-verified">
                      <Sparkles size={11} />
                      AI
                    </span>
                  </div>

                  <div className="ai-bubble assistant ai-typing">
                    <span />
                    <span />
                    <span />
                    <small>Thinking...</small>
                  </div>
                </div>
              </article>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length === 1 && !loading && (
            <div className="ai-suggestions">
              <p>GET STARTED WITH</p>

              <div className="ai-suggestion-list">
                {suggestions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      className="ai-suggestion"
                      key={item.label}
                      onClick={() => handleSend(null, item.prompt)}
                    >
                      <Icon size={17} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="ai-error">
              <span>{error}</span>
              <button onClick={() => setError("")}>Dismiss</button>
            </div>
          )}

          {/* Input */}
          <form className="ai-composer" onSubmit={handleSend}>
            <div className="ai-composer-inner">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about fitness, nutrition or recovery..."
                disabled={loading}
                aria-label="Message your AI fitness coach"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send size={19} />
              </button>
            </div>

            <div className="ai-composer-footer">
              <span>
                <Sparkles size={12} />
                Your personal fitness companion
              </span>

              <span>Press Enter to send</span>
            </div>
          </form>
        </section>

        <footer className="ai-footer">
          <span>
            AI-generated guidance may not always be accurate. Consult a
            qualified professional for medical concerns.
          </span>
        </footer>
      </section>
    </main>
  );
}

export default AICoach;
