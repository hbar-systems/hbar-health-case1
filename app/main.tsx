/**
 * hbar.health — CASE 1 (Lernwerkzeug)
 *
 * Walk a synthetic clinical-reasoning tree: organ → syndrome → pathogen →
 * therapy. Pure static content (cases.ts), no model, no brain data, no patient
 * records. A permanent banner marks it as a teaching tool, never for patient
 * care. This isolation is the point — it is why CASE 1 can exist inside a
 * clinical product without dragging device classification onto the suite.
 */

import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { type Theme, type ThemeColors, getStoredTheme, storeTheme, colors } from "./theme";
import { CASES, type TeachingCase, type Node } from "./cases";
import "./styles.css";

function cardStyle(c: ThemeColors): React.CSSProperties {
  return { background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, padding: "1rem 1.1rem" };
}

// Persistent "teaching only" banner — always visible, never dismissable.
function Banner({ c }: { c: ThemeColors }) {
  return (
    <div style={{ background: c.soonBg, border: `1px solid ${c.soonText}`, borderRadius: 8, padding: "0.6rem 0.85rem", marginBottom: "1.25rem" }}>
      <strong style={{ color: c.soonText, fontSize: "0.85rem" }}>Lernwerkzeug — nicht für die Patientenversorgung.</strong>
      <span style={{ color: c.muted, fontSize: "0.82rem" }}>
        {" "}Synthetische Lehrfälle, keine Verbindung zu Patientendaten, keine Diagnose realer Patienten.
      </span>
    </div>
  );
}

function CasePicker({ c, onPick }: { c: ThemeColors; onPick: (tc: TeachingCase) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h2 style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.06em", color: c.muted, margin: 0 }}>Lehrfall wählen</h2>
      {CASES.map((tc) => (
        <button
          key={tc.id}
          type="button"
          onClick={() => onPick(tc)}
          style={{ ...cardStyle(c), textAlign: "left", cursor: "pointer", color: c.text }}
        >
          <div style={{ fontWeight: 700, fontSize: "1rem", color: c.brand }}>{tc.title}</div>
          <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.85rem", color: c.muted, lineHeight: 1.5 }}>{tc.vignette}</p>
        </button>
      ))}
    </div>
  );
}

interface Step {
  nodeId: string;
  chosen: string;
}

function CaseWalker({ tc, c, onExit }: { tc: TeachingCase; c: ThemeColors; onExit: () => void }) {
  const [currentId, setCurrentId] = useState(tc.rootId);
  const [path, setPath] = useState<Step[]>([]);

  const node: Node = tc.nodes[currentId];

  const choose = (label: string, to: string) => {
    setPath((p) => [...p, { nodeId: currentId, chosen: label }]);
    setCurrentId(to);
  };

  const back = () => {
    setPath((p) => {
      if (p.length === 0) return p;
      const last = p[p.length - 1];
      setCurrentId(last.nodeId);
      return p.slice(0, -1);
    });
  };

  const restart = () => {
    setCurrentId(tc.rootId);
    setPath([]);
  };

  const isFinal = !!node.conclusion && !node.deadEnd;
  const isDeadEnd = !!node.conclusion && node.deadEnd;

  const breadcrumb = useMemo(() => path.map((s) => s.chosen).join("  →  "), [path]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: c.brand }}>{tc.title}</h2>
        <button type="button" className="rc-small" onClick={onExit} style={{ border: `1px solid ${c.border}`, background: "transparent", color: c.muted }}>
          Anderer Fall
        </button>
      </div>

      <p style={{ margin: 0, fontSize: "0.85rem", color: c.muted, lineHeight: 1.5 }}>{tc.vignette}</p>

      {breadcrumb && (
        <div style={{ fontSize: "0.78rem", color: c.muted, fontStyle: "italic" }}>Pfad: {breadcrumb}</div>
      )}

      {/* Current node */}
      {node.options && (
        <div style={cardStyle(c)}>
          <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.98rem", fontWeight: 600, color: c.text, lineHeight: 1.45 }}>{node.text}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {node.options.map((o) => (
              <button
                key={o.to + o.label}
                type="button"
                onClick={() => choose(o.label, o.to)}
                style={{
                  textAlign: "left",
                  padding: "0.65rem 0.85rem",
                  fontSize: "0.9rem",
                  border: `1px solid ${c.border}`,
                  borderRadius: 8,
                  background: c.inputBg,
                  color: c.text,
                  cursor: "pointer",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaf — final answer or teaching dead-end */}
      {(isFinal || isDeadEnd) && (
        <div style={{ ...cardStyle(c), background: isFinal ? c.okBg : c.overdueBg, borderLeft: `4px solid ${isFinal ? c.okText : c.overdueText}` }}>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isFinal ? c.okText : c.overdueText, marginBottom: "0.35rem" }}>
            {isFinal ? "Ergebnis" : "Sackgasse — Lernhinweis"}
          </div>
          <p style={{ margin: 0, fontSize: "0.9rem", color: c.text, lineHeight: 1.55 }}>{node.conclusion}</p>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        {path.length > 0 && (
          <button type="button" className="rc-small" onClick={back} style={{ border: `1px solid ${c.border}`, background: c.card, color: c.text }}>
            ← Schritt zurück
          </button>
        )}
        {(isFinal || isDeadEnd) && (
          <button type="button" className="rc-small" onClick={restart} style={{ border: `1px solid ${c.border}`, background: c.card, color: c.text }}>
            Neu starten
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const c = colors(theme);
  const [active, setActive] = useState<TeachingCase | null>(null);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    storeTheme(next);
  };

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, padding: "0 1rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", paddingTop: "1rem", paddingBottom: "3rem" }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: `1px solid ${c.navBorder}`, marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: c.brand, letterSpacing: "0.04em" }}>hbar.health · CASE 1</span>
          <button type="button" onClick={toggleTheme} style={{ padding: "0.2rem 0.55rem", fontSize: "0.75rem", fontWeight: 600, border: `1px solid ${c.border}`, borderRadius: 4, background: "transparent", color: c.muted, cursor: "pointer" }}>
            {theme === "light" ? "☀ → ☾" : "☾ → ☀"}
          </button>
        </nav>

        <Banner c={c} />

        {active ? (
          <CaseWalker tc={active} c={c} onExit={() => setActive(null)} />
        ) : (
          <>
            <p style={{ color: c.muted, fontSize: "0.9rem", lineHeight: 1.55, margin: "0 0 1.25rem 0" }}>
              Ein interaktiver Denkbaum: vom Organsystem über das Syndrom und den Erreger bis zur Therapie. Zeigt, wie strukturiertes klinisches Denken aussieht — an erfundenen Lehrfällen.
            </p>
            <CasePicker c={c} onPick={setActive} />
          </>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
