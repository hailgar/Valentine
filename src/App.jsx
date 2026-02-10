import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const YOUR_WA_NUMBER = "6281314922705";

/**
 * Background music (global).
 * Put your audio file in: /public/audio/backsound.mp3
 * It will start after the user's first click (browser policy), and remembers ON/OFF in localStorage.
 */
function BackgroundMusic() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("bgm_enabled") === "1";
    } catch {
      return false;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const syncPlayingState = () => {
    const a = audioRef.current;
    if (!a) return;
    setIsPlaying(!a.paused && !a.ended);
  };

  const tryPlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = 0.35;
      await a.play();
      setIsPlaying(true);
    } catch {
      // Autoplay will be blocked until user interaction; ignore.
      setIsPlaying(false);
    }
  };

  const toggle = async () => {
    const a = audioRef.current;
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem("bgm_enabled", next ? "1" : "0");
    } catch {}

    if (!a) return;

    if (next) {
      await tryPlay();
    } else {
      a.pause();
      a.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // If user previously enabled, start after first click anywhere
  useEffect(() => {
    if (!enabled) return;

    const onFirstGesture = () => {
      tryPlay();
      document.removeEventListener("click", onFirstGesture);
      document.removeEventListener("touchstart", onFirstGesture);
    };

    document.addEventListener("click", onFirstGesture, { once: true });
    document.addEventListener("touchstart", onFirstGesture, { once: true });

    return () => {
      document.removeEventListener("click", onFirstGesture);
      document.removeEventListener("touchstart", onFirstGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

    const startOnFirstInteraction = () => {
      audio.volume = 0.35;
      audio.play().catch(() => {});
      document.removeEventListener("click", startOnFirstInteraction);
      document.removeEventListener("touchstart", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
    };

    document.addEventListener("click", startOnFirstInteraction);
    document.addEventListener("touchstart", startOnFirstInteraction);
    document.addEventListener("keydown", startOnFirstInteraction);

    return () => {
      document.removeEventListener("click", startOnFirstInteraction);
      document.removeEventListener("touchstart", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
    };
  }, []);
  
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/backsound.mp3"
        loop
        preload="auto"
        onLoadedMetadata={syncPlayingState}
      />

      <button
        type="button"
        onClick={toggle}
        title={enabled ? (isPlaying ? "Pause music" : "Play music") : "Enable music"}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 9999,
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          padding: "10px 14px",
          fontWeight: 650,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{enabled ? "🎵" : "🔇"}</span>
        <span style={{ fontSize: 13 }}>
          {enabled ? (isPlaying ? "Music On" : "Tap to Play") : "Music Off"}
        </span>
      </button>
    </>
  );
}

function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}
function isValidTimeRange(start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s == null || e == null) return false;
  return e - s >= 30; // minimal 30 menit
}

function FloatingHearts() {
  // lightweight hearts background (no Tailwind)
  const hearts = useMemo(() => Array.from({ length: 14 }), []);
  return (
    <div className="vh-hearts" aria-hidden="true">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="vh-heart"
          initial={{
            y: "110vh",
            x: `${Math.random() * 100}vw`,
            opacity: 0,
            rotate: Math.random() * 360,
            scale: 0.7 + Math.random() * 0.7,
          }}
          animate={{
            y: "-15vh",
            opacity: [0, 0.9, 0.9, 0],
            rotate: Math.random() * 360 + 360,
          }}
          transition={{
            duration: 7 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form fields
  const [address, setAddress] = useState("");
  const [whereFree, setWhereFree] = useState("");
  const [timeStart, setTimeStart] = useState("18:00");
  const [timeEnd, setTimeEnd] = useState("20:00");
  const [timezone, setTimezone] = useState("WIB (UTC+7)");
  const [notes, setNotes] = useState("");

  const valid =
    address.trim().length >= 8 &&
    whereFree.trim().length >= 3 &&
    isValidTimeRange(timeStart, timeEnd);

  const summary = useMemo(() => {
    return {
      date: "14",
      address: address.trim(),
      whereFree: whereFree.trim(),
      time: `${timeStart} - ${timeEnd}`,
      timezone,
      notes: notes.trim(),
    };
  }, [address, whereFree, timeStart, timeEnd, timezone, notes]);

  // Runaway NO
  const arenaRef = useRef(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [placed, setPlaced] = useState(false);

  const moveNo = (evt) => {
    const arena = arenaRef.current;
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    const btnW = 160;
    const btnH = 52;
    const pad = 12;

    const maxX = Math.max(pad, rect.width - btnW - pad);
    const maxY = Math.max(pad, rect.height - btnH - pad);

    // pick farthest from cursor to feel “kabur”
    let px = null,
      py = null;
    if (evt && "clientX" in evt) {
      px = evt.clientX - rect.left;
      py = evt.clientY - rect.top;
    }

    let best = { x: pad, y: pad, score: -1 };
    for (let i = 0; i < 10; i++) {
      const x = pad + Math.random() * (maxX - pad);
      const y = pad + Math.random() * (maxY - pad);

      let score = Math.random();
      if (px != null && py != null) {
        const dx = x - px;
        const dy = y - py;
        score = dx * dx + dy * dy;
      }
      if (score > best.score) best = { x, y, score };
    }

    setNoPos({ x: best.x, y: best.y });
    setPlaced(true);
  };

  useEffect(() => {
    if (accepted) return;
    const t = setTimeout(() => moveNo(), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accepted]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
    setTimeout(sendToWhatsApp, 350);
  };

  const sendToWhatsApp = () => {
  const msg = [
      "💌 Valentine Date – Tanggal 14 ❤️",
      "",
      "📍 Alamat:",
      summary.address,
      "",
      "📍 Free di mana:",
      summary.whereFree,
      "",
      "⏰ Waktu:",
      `${summary.time} (${summary.timezone})`,
      "",
      "📝 Catatan:",
      summary.notes ? summary.notes : "—",
      "",
      "✨ Status: It's a date!",
      "See you on February 14th 💖",
    ].join("\n");

    const url = `https://wa.me/${YOUR_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="vh-page">
      <FloatingHearts />
      <BackgroundMusic autoPlay/>

      <div className="vh-shell">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.section
              key="ask"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="vh-card"
            >
              <div className="vh-top">
                <div className="vh-pill">💌 Valentine</div>

                <h1 className="vh-title">
                  Do you want to be my <span>Valentine date</span>?
                </h1>

                {/* I LOVE YOU pulse (membesar-mengecil) */}
                <motion.div
                  className="vh-love"
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
                >
                  | <span>i</span> <span className="vh-heartIcon">❤</span> <span>u</span> |
                </motion.div>

                <p className="vh-sub">
                  Kamu cuma bisa klik <b>YES</b>. Tombol <b>NO</b> akan kabur 😄
                </p>
              </div>

              <div
                ref={arenaRef}
                className="vh-arena"
                onMouseMove={(e) => {
                  const arena = arenaRef.current;
                  if (!arena) return;
                  const rect = arena.getBoundingClientRect();
                  const px = e.clientX - rect.left;
                  const py = e.clientY - rect.top;

                  const bx = (placed ? noPos.x : rect.width * 0.62) + 80;
                  const by = (placed ? noPos.y : rect.height * 0.55) + 26;

                  const dx = px - bx;
                  const dy = py - by;
                  const dist = Math.sqrt(dx * dx + dy * dy);

                  if (dist < 120) moveNo(e);
                }}
                onTouchStart={(e) => moveNo(e.touches?.[0] || e)}
              >
                <div className="vh-centerRow">
                  <img
                    className="vh-gif"
                    src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
                    alt="bear"
                  />

                  <button
                    className="vh-yesBtn"
                    type="button"
                    onClick={() => setAccepted(true)}
                  >
                    <span className="vh-shine" aria-hidden="true" />
                    YES 💖
                  </button>
                </div>

                <button
                  type="button"
                  className="vh-noBtn"
                  style={{
                    transform: `translate(${placed ? noPos.x : 0}px, ${placed ? noPos.y : 0}px)`,
                    left: placed ? 0 : "64%",
                    top: placed ? 0 : "18%",
                  }}
                  onMouseEnter={moveNo}
                  onPointerEnter={moveNo}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    moveNo(e);
                  }}
                  onFocus={moveNo}
                  onClick={(e) => {
                    e.preventDefault();
                    moveNo(e);
                  }}
                  aria-label="No (kabur)"
                >
                  NO 🙈
                </button>
              </div>

              <div className="vh-tip">
                <span className="vh-dot" /> Tip: coba “kejar” tombol NO… good luck 😅
              </div>
            </motion.section>
          ) : !submitted ? (
            <motion.section
              key="form"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              className="vh-card"
            >
              <div className="vh-top">
                <div className="vh-pill">✨ Yay!</div>
                <h2 className="vh-h2">Alamat & Availability</h2>
                <p className="vh-sub">
                  Isi alamat kamu & kamu free di tanggal <b>14</b> di mana dan jam berapa.
                </p>
              </div>

              <form className="vh-form" onSubmit={onSubmit}>
                <label className="vh-field">
                  <div className="vh-label">
                    Alamat kamu <span className="vh-req">*</span>
                  </div>
                  <textarea
                    className="vh-input vh-textarea"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Melati No. 10, Kecamatan..., Kota..."
                    required
                  />
                  <div className="vh-help">Minimal 8 karakter.</div>
                </label>

                <label className="vh-field">
                  <div className="vh-label">
                    Free di mana (tanggal 14) <span className="vh-req">*</span>
                  </div>
                  <input
                    className="vh-input"
                    value={whereFree}
                    onChange={(e) => setWhereFree(e.target.value)}
                    placeholder="Contoh: Mall X / daerah Sudirman / rumah"
                    required
                  />
                  <div className="vh-help">Minimal 3 karakter.</div>
                </label>

                {/* time = start & end (bukan durasi) */}
                <div className="vh-grid3">
                  <label className="vh-field">
                    <div className="vh-label">Timezone</div>
                    <select
                      className="vh-input"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option>WIB (UTC+7)</option>
                      <option>WITA (UTC+8)</option>
                      <option>WIT (UTC+9)</option>
                      <option>Malaysia/Singapore (UTC+8)</option>
                    </select>
                  </label>

                  <label className="vh-field">
                    <div className="vh-label">
                      Start time <span className="vh-req">*</span>
                    </div>
                    <input
                      className="vh-input"
                      type="time"
                      value={timeStart}
                      onChange={(e) => setTimeStart(e.target.value)}
                      required
                    />
                  </label>

                  <label className="vh-field">
                    <div className="vh-label">
                      End time <span className="vh-req">*</span>
                    </div>
                    <input
                      className="vh-input"
                      type="time"
                      value={timeEnd}
                      onChange={(e) => setTimeEnd(e.target.value)}
                      required
                    />
                  </label>
                </div>

                {!isValidTimeRange(timeStart, timeEnd) ? (
                  <div className="vh-warn">
                    Set jam mulai & jam selesai. Minimal selisih 30 menit ya.
                  </div>
                ) : null}

                <label className="vh-field">
                  <div className="vh-label">Catatan (optional)</div>
                  <input
                    className="vh-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Misal: aku free setelah pulang kerja / jangan terlalu malam"
                  />
                </label>

                <div className="vh-actions">
                  <button
                    type="button"
                    className="vh-ghost"
                    onClick={() => {
                      setAccepted(false);
                      setSubmitted(false);
                      setPlaced(false);
                    }}
                  >
                    ← Back
                  </button>

                  <button className="vh-primary" type="submit" disabled={!valid}>
                    Submit ✅
                  </button>
                </div>

                <div className="vh-preview">
                  <div className="vh-previewTitle">Preview</div>
                  <pre className="vh-previewBox">{JSON.stringify(summary, null, 2)}</pre>
                </div>
              </form>
            </motion.section>
          ) : (
            <motion.section
              key="success"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="vh-success"
            >
              <video
                controls
                autoPlay
                playsInline
                loop
                preload="metadata"
                style={{ width: "100%", borderRadius: "12px" }}
              >
                <source src="/Video.mp4" type="video/mp4" />
                Browser kamu tidak mendukung video.
              </video>
              <h2 className="vh-successTitle">It’s a Date! 💞</h2>
              <p className="vh-successSub">Wait for me on February 14th! ❤️</p>

              <div className="vh-summaryCard">
                <div className="vh-previewTitle">Summary</div>
                <pre className="vh-previewBox">{`Tanggal: 14
      Alamat: ${summary.address}
      Free di mana: ${summary.whereFree}
      Waktu: ${summary.time} (${summary.timezone})
      Catatan: ${summary.notes ? summary.notes : "-"}
      `}</pre>

                <div className="vh-actions">
                  <button
                    type="button"
                    className="vh-ghost"
                    onClick={() => setSubmitted(false)}
                  >
                    Edit
                  </button>
                  <button type="button" className="vh-primary" onClick={sendToWhatsApp}>
                    Send to WhatsApp
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
