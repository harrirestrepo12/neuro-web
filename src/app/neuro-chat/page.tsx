"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/site/Navbar";
import Container from "@/components/layout/Container";
import FXBackground from "@/components/site/FXBackground";
import { apiPost } from "@/lib/api";

type Mode = "novato" | "experto";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
};


type HybridChatResponse = {
  aiMessage?: string;
  summary?: string;
  recommendation?: string;
};

type AskRes =
  | {
      ok: true;
      answer?: string;
      response?: HybridChatResponse | null;
      hybridChat?: { response?: HybridChatResponse | null } | null;
      neuroChatAI?: { response?: HybridChatResponse | null } | null;
    }
  | { ok: false; error: string };

type ResetReq = {
  userId: string;
  mode: Mode;
};

type ResetRes =
  | {
      ok: true;
      reset: true;
    }
  | {
      ok: false;
      error: string;
    };

type UsageRes =
  | {
      ok: true;
      userId: string;
      monthKey: string;
      spentUsd: number;
      remainingUsd: number;
      limitUsd: number;
      canUseLlm: boolean;
    }
  | { ok: false; error?: string };

const quickChips: { label: string; message: string }[] = [
  { label: "¿Qué operar hoy?", message: "¿Qué activos recomiendas observar hoy y por qué?" },
  { label: "Riesgo recomendado", message: "Dame un riesgo recomendado para un perfil conservador y uno agresivo." },
  { label: "Explica EURUSD", message: "Expl\u00edcame EURUSD como novato: tendencia, riesgo y qu\u00e9 evitar." },
  { label: "Noticias y mercado", message: "\u00bfQu\u00e9 eventos/noticias suelen afectar m\u00e1s Forex e \u00edndices?" },
  { label: "Plan de aprendizaje", message: "Hazme un plan de 7 d\u00edas para aprender trading con demo y control de riesgo." },
  { label: "Errores comunes", message: "\u00bfCu\u00e1les son los 10 errores m\u00e1s comunes y c\u00f3mo evitarlos con reglas?" },
];

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const initialAssistantMessageBase: Omit<ChatMsg, "id" | "ts"> = {
  role: "assistant",
  content:
    "Hola, soy Neuro Chat.\n\nEstoy aquí­ para ayudarte a entender mejor el mercado, ordenar tus ideas y tomar decisiones con más claridad.\n\nPuedes preguntarme sobre riesgo, estrategia, contexto de mercado o aprendizaje de trading.",
};

function buildInitialAssistantMessage(): ChatMsg {
  return {
    ...initialAssistantMessageBase,
    id: uid(),
    ts: Date.now(),
  };
}

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return new Date(ts).toLocaleTimeString();
  }
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getNeuroChatUserId(): string {
  if (typeof window === "undefined") return "web_demo_user";

  const storageKey = "neuro_chat_user_id";
  const existing = window.localStorage.getItem(storageKey);

  if (existing && existing.trim()) return existing;

  const nextId = `web_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
  window.localStorage.setItem(storageKey, nextId);
  return nextId;
}

function formatUsd(value: number) {
  return `$${value.toFixed(2)}`;
}

function sanitizeAnswer(answer: string): string {
  const raw = answer.trim();

  const technicalMarkers = [
    "OPENAI_API_KEY",
    "gateway LLM",
    "modelo avanzado",
    "backend",
    "configuración del servidor",
    "capa LLM",
    "Falta OPENAI_API_KEY",
    "El gateway LLM",
  ];

  if (technicalMarkers.some((marker) => raw.includes(marker))) {
    return "Estoy listo para ayudarte. Hazme una pregunta concreta sobre trading, riesgo, mercado o aprendizaje.";
  }

  return raw || "Estoy listo para ayudarte. Hazme una pregunta concreta.";
}

function getStoredUserName(): string {
  if (typeof window === "undefined") return "";

  const possibleKeys = [
    "neuro_user_name",
    "neuro_user",
    "neuro_auth_user",
    "user",
    "profile",
  ];

  for (const key of possibleKeys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      if (raw.startsWith("{")) {
        const parsed = JSON.parse(raw) as {
          name?: string;
          fullName?: string;
          firstName?: string;
          email?: string;
        };

        const value =
          parsed.name ||
          parsed.fullName ||
          parsed.firstName ||
          (parsed.email ? parsed.email.split("@")[0] : "");

        if (value && value.trim()) return value.trim();
      }

      if (raw && !raw.includes("{") && raw.length <= 40) {
        return raw.trim();
      }
    } catch {
      // Ignorar datos locales inválidos.
    }
  }

  return "";
}

function isSimpleGreeting(message: string): boolean {
  const normalized = message
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return [
    "hola",
    "buenas",
    "buenos dias",
    "buenas tardes",
    "buenas noches",
    "hey",
    "hi",
    "hello",
  ].includes(normalized);
}

function buildFriendlyGreeting(): string {
  const name = getStoredUserName();
  const greetingName = name ? `, ${name}` : "";

  return `Hola${greetingName}. Bienvenido a Neuro Chat.

Estoy listo para ayudarte de forma clara y profesional.

¿En qué vamos a trabajar hoy? Puedes preguntarme sobre mercado, riesgo, una operación, aprendizaje, brokers, planes o configuración de tu cuenta.`;
}
function extractAssistantAnswer(res: AskRes): string {
  if (!res || !res.ok) {
    return "No pude responder en este momento. Intenta de nuevo.";
  }

  const hybridResponse =
    res.response ??
    res.hybridChat?.response ??
    res.neuroChatAI?.response ??
    null;

  return (
    res.answer ||
    hybridResponse?.aiMessage ||
    hybridResponse?.summary ||
    hybridResponse?.recommendation ||
    "Estoy listo para ayudarte. Hazme una pregunta concreta sobre trading, riesgo, mercado o aprendizaje."
  );
}

export default function NeuroChatPage() {
  const [mode, setMode] = useState<Mode>("novato");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([buildInitialAssistantMessage()]);
  const [usage, setUsage] = useState<UsageRes | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const userId = useMemo(() => getNeuroChatUserId(), []);

  const headerHint = useMemo(() => {
    return mode === "novato"
      ? "Modo Novato: explicaciones claras, simples y prácticas."
      : "Modo Experto: respuestas más directas y técnicas.";
  }, [mode]);

  const stateText = busy ? "pensando…" : "listo";
  const stateTone = busy ? "text-white/70" : "text-emerald-300";

  const loadUsage = useCallback(async () => {
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
      if (!apiBase) return;

      const res = await fetch(`${apiBase}/neurochat/usage?userId=${encodeURIComponent(userId)}`, {
        method: "GET",
      });

      if (!res.ok) return;

      const data = (await res.json()) as UsageRes;
      setUsage(data);
    } catch {
      // silencioso
    }
  }, [userId]);

  function scrollToBottom(smooth = true) {
    const el = listRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    void loadUsage();
  }, [loadUsage]);

  async function resetConversation() {
    if (busy) return;

    setBusy(true);

    try {
      const res = await apiPost<ResetRes>("/neurochat/reset", {
        userId,
        mode,
      } satisfies ResetReq);

      if (res && res.ok) {
        setMessages([buildInitialAssistantMessage()]);
        setInput("");
        scrollToBottom(false);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          ts: Date.now(),
          content: "No pude reiniciar la conversación. Intenta de nuevo.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          ts: Date.now(),
          content: "No pude reiniciar la conversación. Intenta de nuevo.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || busy) return;

    setBusy(true);

    const userMsg: ChatMsg = {
      id: uid(),
      role: "user",
      content: msg,
      ts: Date.now(),
    };

    setMessages((current) => [...current, userMsg]);
    setInput("");

    
    if (isSimpleGreeting(msg)) {
      const assistantMsg: ChatMsg = {
        id: uid(),
        role: "assistant",
        ts: Date.now(),
        content: buildFriendlyGreeting(),
      };

      setMessages((current) => [...current, assistantMsg]);
      setBusy(false);
      return;
    }

    try {
      const res = await apiPost<AskRes>("/neuro-chat", {
        message: msg,
        userId,
        mode,
        source: "neuro-web",
        tradingContext: {
          mode,
          symbol: "EURUSD",
          selectedAccount: {
            accountId: userId,
          },
        },
      });

      if (!res) {
        setMessages((current) => [
          ...current,
          {
            id: uid(),
            role: "assistant",
            ts: Date.now(),
            content: "No pude responder en este momento. Intenta de nuevo.",
          },
        ]);
      } else if (res.ok) {
        const assistantMsg: ChatMsg = {
          id: uid(),
          role: "assistant",
          ts: Date.now(),
          content: sanitizeAnswer(extractAssistantAnswer(res)),
        };

        setMessages((current) => [...current, assistantMsg]);
      } else {
        setMessages((current) => [
          ...current,
          {
            id: uid(),
            role: "assistant",
            ts: Date.now(),
            content: "No pude responder en este momento. Intenta de nuevo.",
          },
        ]);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          role: "assistant",
          ts: Date.now(),
          content: "No pude responder en este momento. Intenta de nuevo.",
        },
      ]);
    } finally {
      setBusy(false);
      void loadUsage();
    }
  }

  const usagePercent =
    usage && "ok" in usage && usage.ok && usage.limitUsd > 0
      ? Math.min(100, Math.max(0, (usage.spentUsd / usage.limitUsd) * 100))
      : 0;

  return (
    <FXBackground imageSrc="/ai/neuro-bg.jpg" className="min-h-screen" imageOpacity={0.16}>
      <div className="min-h-screen">
        <Navbar />

        <main>
          <section className="pt-8 md:pt-12">
            <Container className="max-w-7xl px-6 py-6 md:px-8 md:py-10">
              <div className="mx-auto max-w-[1480px]">
                <div className="text-center">
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-black/40 px-5 py-2.5 text-sm text-white/82 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.95)]" />
                    Neuro Chat • IA
                  </p>

                  <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-tight text-white md:text-7xl xl:text-8xl">
                    Neuro Chat <span className="text-emerald-400">IA</span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-4xl text-lg leading-relaxed text-white/78 md:text-2xl">
                    {headerHint}
                  </p>
                </div>
              </div>
            </Container>
          </section>

          <section className="pb-10 md:pb-14">
            <Container className="max-w-7xl px-6 md:px-8">
              <div className="mx-auto grid max-w-[1480px] gap-8 2xl:grid-cols-[380px_minmax(0,1fr)]">
                <aside>
                  <div className="space-y-5">
                    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.30)] backdrop-blur-xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex rounded-[22px] border border-white/10 bg-black/35 p-1.5 shadow-[0_14px_40px_rgba(0,0,0,0.28)]">
                          <button
                            onClick={() => setMode("novato")}
                            className={cx(
                              "rounded-[18px] px-5 py-3 text-sm transition duration-200",
                              mode === "novato"
                                ? "bg-[linear-gradient(180deg,rgba(16,185,129,1)_0%,rgba(5,150,105,0.92)_100%)] font-semibold text-black shadow-[0_16px_40px_rgba(16,185,129,0.45)]"
                                : "text-white/80 hover:bg-white/5 hover:text-white"
                            )}
                            type="button"
                          >
                            Novato
                          </button>
                          <button
                            onClick={() => setMode("experto")}
                            className={cx(
                              "rounded-[18px] px-5 py-3 text-sm transition duration-200",
                              mode === "experto"
                                ? "bg-[linear-gradient(180deg,rgba(16,185,129,1)_0%,rgba(5,150,105,0.92)_100%)] font-semibold text-black shadow-[0_16px_40px_rgba(16,185,129,0.45)]"
                                : "text-white/80 hover:bg-white/5 hover:text-white"
                            )}
                            type="button"
                          >
                            Experto
                          </button>
                        </div>

                        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
                          Estado: <span className={stateTone}>{stateText}</span>
                        </div>

                        <button
                          type="button"
                          onClick={resetConversation}
                          disabled={busy}
                          className="rounded-full border border-rose-400/20 bg-[linear-gradient(180deg,rgba(244,63,94,0.14)_0%,rgba(244,63,94,0.08)_100%)] px-4 py-3 text-sm text-rose-200 shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-rose-500/15 disabled:opacity-50"
                        >
                          Reset
                        </button>
                      </div>

                      {usage && "ok" in usage && usage.ok ? (
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-sm text-white/55">
                            <span>Capacidad disponible</span>
                            <span className="text-white/80">{formatUsd(usage.remainingUsd)}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,1)_0%,rgba(59,130,246,0.92)_100%)] transition-all"
                              style={{ width: `${100 - usagePercent}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.30)] backdrop-blur-xl">
                      <div className="flex flex-wrap gap-2">
                        {quickChips.map((chip) => (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => send(chip.message)}
                            disabled={busy}
                            className="rounded-full border border-emerald-400/14 bg-black/35 px-4 py-2.5 text-sm text-white/78 shadow-[0_10px_24px_rgba(0,0,0,0.20)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:text-white disabled:opacity-50"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative rounded-[32px] p-px bg-[linear-gradient(135deg,rgba(16,185,129,0.35),rgba(59,130,246,0.18),rgba(16,185,129,0.24))] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
                      <div className="relative overflow-hidden rounded-[31px] border border-emerald-400/16 bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-7">
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-px rounded-[30px] border border-white/5"
                        />

                        <div className="relative">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                            <div className="text-2xl font-semibold text-white/92">Centro de gu&iacute;a</div>
                          </div>

                          <p className="mt-4 text-left text-base leading-relaxed text-white/72">
                            Haz preguntas claras sobre <b className="text-white/92">riesgo</b>,{" "}
                            <b className="text-white/92">mercado</b>, <b className="text-white/92">estrategia</b> o{" "}
                            <b className="text-white/92">aprendizaje</b>.
                          </p>

                          <div className="mt-6 space-y-4">
                            <Tip title="Ejemplo (Experto)">
                              &ldquo;EURUSD: contexto, niveles clave, gatillo, SL/TP, invalidaci&oacute;n.&rdquo;
                            </Tip>
                            <Tip title="Ejemplo (Novato)">
                              &ldquo;Expl\u00edcame qu\u00e9 es spread y c\u00f3mo me afecta al operar.&rdquo;
                            </Tip>
                            <Tip title="Regla Neuro">
                              Riesgo primero. Claridad antes de ejecutar.
                            </Tip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                <div>
                  <div className="relative rounded-[34px] p-px bg-[linear-gradient(135deg,rgba(16,185,129,0.42),rgba(59,130,246,0.20),rgba(16,185,129,0.28))] shadow-[0_36px_120px_rgba(0,0,0,0.62)]">
                    <div className="relative overflow-hidden rounded-[33px] border border-emerald-400/18 bg-[linear-gradient(180deg,rgba(8,12,18,0.96)_0%,rgba(7,10,16,0.91)_100%)]">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-24 -right-14 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-px rounded-[32px] border border-white/5"
                      />

                      <div className="relative flex h-[78vh] min-h-[760px] flex-col">
                        <div className="border-b border-emerald-400/10 px-7 py-6">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                            <div className="text-2xl font-semibold text-white/94">Neuro Chat</div>
                          </div>
                          <div className="mt-2 text-left text-base text-white/58">
                            {mode === "novato" ? "Mentor claro" : "Analista técnico"}
                          </div>
                        </div>

                        <div
                          ref={listRef}
                          className="flex-1 overflow-y-auto px-7 py-7 md:px-8"
                        >
                          <div className="space-y-6">
                            {messages.map((message) => (
                              <MessageBubble key={message.id} msg={message} />
                            ))}
                          </div>
                        </div>

                        <div className="sticky bottom-0 border-t border-emerald-400/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.76)_0%,rgba(7,10,16,0.96)_100%)] px-6 py-5 backdrop-blur-xl md:px-8">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              send(input);
                            }}
                            className="flex flex-col gap-4 md:flex-row md:items-end"
                          >
                            <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void send(input);
                              }
                            }}
                              placeholder={
                                mode === "novato"
                                  ? "Escribe tu pregunta..."
                                  : "Plantea tu consulta con precisión..."
                              }
                              rows={3}
                              className="min-h-[84px] flex-1 resize-none rounded-3xl border border-emerald-400/12 bg-black/38 px-5 py-4 text-base text-white/94 shadow-[0_16px_50px_rgba(0,0,0,0.40)] placeholder:text-white/34 focus:border-emerald-400/28 focus:outline-none"
                            />

                            <button
                              type="submit"
                              disabled={busy || !input.trim()}
                              className="h-[84px] min-w-[160px] rounded-3xl bg-[linear-gradient(180deg,rgba(16,185,129,1)_0%,rgba(5,150,105,0.94)_100%)] px-8 text-lg font-semibold text-black shadow-[0_22px_60px_rgba(16,185,129,0.30)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(16,185,129,0.38)] hover:bg-emerald-400 disabled:opacity-50"
                            >
                              Enviar
                            </button>
                          </form>

                          <div className="mt-4 text-left text-sm text-white/42">
                            Neuro Chat es un asistente educativo y operativo. El trading tiene riesgo.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function Tip({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-3xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.36)]">
      <div className="text-left text-base font-semibold text-white/88">{title}</div>
      <div className="mt-2 text-left text-sm leading-7 text-white/66">{children}</div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";

  return (
    <div className={cx("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[96%] md:max-w-[82%]">
        <div className={cx("mb-2 px-1 text-[12px] text-white/42", isUser ? "text-right" : "text-left")}>
          {isUser ? "Tú" : "Neuro Chat"} • {formatTime(msg.ts)}
        </div>

        <div
          className={cx(
            "rounded-[28px] px-6 py-5 text-[15px] leading-8 whitespace-pre-wrap shadow-[0_16px_50px_rgba(0,0,0,0.40)] md:text-[17px]",
            isUser
              ? "border border-emerald-400/22 bg-[linear-gradient(180deg,rgba(16,185,129,0.18)_0%,rgba(16,185,129,0.10)_100%)] text-white"
              : "border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] text-white/92"
          )}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}





