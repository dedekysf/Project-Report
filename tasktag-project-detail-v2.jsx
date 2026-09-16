import { useState, useRef, useLayoutEffect, useEffect, useMemo, useContext, createContext } from "react";
import { createPortal } from "react-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft, Search, MoreVertical, Plus, Check, Link, Download,
  LayoutGrid, MapPin, Hash, FileText, FileImage,
  Activity, Users, BarChart2, SlidersHorizontal,
  ArrowUpDown, Calendar, AlignJustify, Clock,
  UserPlus, Link2, ChevronUp, ChevronDown, X, Pencil, Trash2, Crown, AlertTriangle,
  RotateCw, ZoomIn, ZoomOut, Folder, ArrowLeft, ArrowRight, Info,
} from "lucide-react";

import logoImg from "./src/Img/tasktag-logo.13f1babda8fdbb1b7251572a0fe11f9e.png";
import img1Src from "./src/Img/annie-spratt-8_o7g0q4Egg-unsplash.jpg";
import img2Src from "./src/Img/florian-meissner-Nb7meWvvcGo-unsplash.jpg";
import img3Src from "./src/Img/h-co-3coKbdfnAFg-unsplash.jpg";
import img4Src from "./src/Img/jason-gooljar-wkzpK41J2MU-unsplash.jpg";
import img5Src from "./src/Img/jon-tyson-7uPzmidQ4jI-unsplash.jpg";
import img6Src from "./src/Img/lallaoke-v01rpdnjTg0-unsplash.jpg";
import img7Src from "./src/Img/oleg-stepanov-50QCy-3VsBk-unsplash.jpg";
import img8Src from "./src/Img/solomen-i6V6diaf71A-unsplash.jpg";
import img9Src from "./src/Img/the-blowup-ps8Cfl8os70-unsplash.jpg";

// ── DS tokens ──
const style = document.createElement("style");
style.textContent = `
  :root {
    --tt-brand:      #00c97a;
    --tt-secondary:  #16a97d;
    --tt-dark:       #035b60;
    --tt-text-1:     #0a1629;
    --tt-text-2:     #303742;
    --tt-grey01:     #fafbfc;
    --tt-grey02:     #f7f8fa;
    --tt-grey03:     #e8e8e6;
    --tt-grey04:     #bdbdbd;
    --tt-grey05:     #828282;
    --tt-grey06:     #303742;
    --tt-mint:       #dcf2ec;
    --tt-red:        #e5484d;
    --tt-blue:       #138eff;
    --tt-pastel-magenta: #a85796;
    --radius: 0.5rem;
  }

  /* Tab — inactive: icon grey06, text text-secondary */
  /* TabsList — no overflow clip so -1px margin can bleed */
  [role="tablist"] {
    overflow: visible !important;
    padding-bottom: 0 !important;
  }

  /* SelectTrigger — left-align value */
  [data-radix-select-trigger] {
    justify-content: space-between !important;
  }

  [role="tabpanel"] {
    margin-top: 0 !important;
    padding-top: 16px !important;
  }

  [data-radix-collection-item] {
    color: var(--tt-text-2) !important;
    border-bottom: 2px solid transparent;
    border-radius: 0 !important;
    padding: 12px 12px;
    font-size: 14px;
    font-weight: 400 !important;
    background: transparent !important;
    box-shadow: none !important;
    transition: color 0.15s;
    margin-bottom: -1px;
    position: relative;
    z-index: 1;
  }
  [data-radix-collection-item]:hover { color: var(--tt-text-1) !important; }
  [data-radix-collection-item][data-state="active"] {
    color: var(--tt-secondary) !important;
    font-weight: 400 !important;
    border-bottom: 2px solid var(--tt-secondary) !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .tt-radio-card {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 20px;
    border: 1.5px solid var(--tt-grey03);
    border-radius: 12px; cursor: pointer;
    background: white; transition: border-color 0.15s;
  }
  .tt-radio-card[data-selected="true"] { border-color: var(--tt-secondary); }

  .tt-chip {
    padding: 7px 16px; border-radius: 9999px;
    border: 1.5px solid var(--tt-grey03);
    background: white; color: var(--tt-text-2);
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: border-color 0.15s;
  }
  .tt-chip[data-selected="true"] { border-color: var(--tt-secondary); }

  .tt-task-chip {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 10px; border: 1px solid var(--tt-grey03);
    border-radius: 8px; font-size: 12px;
    color: var(--tt-text-2); background: white; white-space: nowrap;
  }

  .tt-section-label {
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.06em; color: var(--tt-grey05);
    text-transform: uppercase; margin-bottom: 12px;
  }

  @keyframes tt-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes tt-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }
  .tt-skeleton {
    background: var(--tt-grey03);
    border-radius: 6px;
    animation: tt-pulse 1.2s ease-in-out infinite;
  }

  @keyframes tt-toast-progress {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }


  /* CTA button — icon + text */
  .tt-cta-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 10px; border-radius: 8px;
    border: none; background: none; cursor: pointer;
    color: var(--tt-text-2); font-size: 13px; font-weight: 500;
    transition: background 0.15s; white-space: nowrap;
  }
  .tt-cta-btn:hover { background: var(--tt-grey02); }

  /* Fixed tooltip — rendered via portal, always on top */
  .tt-fixed-tooltip {
    position: fixed; z-index: 9999;
    background: var(--tt-text-1); color: white;
    font-size: 11px; font-weight: 500; white-space: nowrap;
    padding: 4px 8px; border-radius: 4px;
    pointer-events: none;
    transform: translateX(-50%);
  }

  /* Icon button (kept for modal close etc) */
  .tt-icon-btn {
    position: relative;
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    border: none; background: none; cursor: pointer;
    color: var(--tt-text-2); transition: background 0.15s;
  }
  .tt-icon-btn:hover { background: var(--tt-grey02); }
`;
document.head.appendChild(style);

const SW = 1.2;

// The app's fixed "today" — all mock data (DUMMY_ENTRIES, last-N-days
// ranges) is anchored to this date rather than the real device clock.
const APP_TODAY = new Date(2026, 8, 10); // Sep 10, 2026
// TODO(BE): replace with the project's actual name/address from the API
const PROJECT_NAME = "The Alvarez Home Renovation";
const PROJECT_ADDRESS = "11 North Raintree Hollow Court, Sienna Plantation, Missouri City";
// TODO(BE): replace with the project's actual point of contact from the API
const POINT_OF_CONTACT_NAME = "Maria Jose";
const POINT_OF_CONTACT_ROLE = "Project Manager";
const initialsOf = (name) => name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
// TODO(BE): replace with the actual report ID from the API
const REPORT_ID = `TX-1520-${APP_TODAY.getFullYear()}-${String(APP_TODAY.getMonth() + 1).padStart(2, "0")}`;

// ── Paginated document sizing ──
// The live preview lays out its document as stacked A4 sheets (each with
// its own header/footer) instead of one continuous scrolling card, so it
// reads like a real paginated report. Width matches the reading column
// this whole panel already uses (800px); height follows from the A4
// ratio (297:210) at that width.
const PAGE_W   = 800;
const PAGE_H   = Math.round(PAGE_W * 297 / 210);
const PAGE_PAD = 40;

// TODO(BE): replace with the task's actual status/due date from the API —
// derived from the entry's date here only because DUMMY_ENTRIES has no
// status field of its own. Most entries are simply completed (they're a
// log of work already done); a deterministic minority are flagged
// in_progress or past_due so the report shows all three states.
function statusForEntry(e) {
  const dateStr = typeof e === "string" ? e : e.date;
  const d = parseDate(dateStr);
  const daysAgo = Math.round((APP_TODAY - d) / 86400000);
  // forcePastDue guarantees at least one Past Due example in every report
  // (see buildReportData) — the daysAgo>14 condition below can never fire
  // on its own for a short/recent period, since every entry in it is by
  // definition within the last few days.
  if (typeof e === "object" && e.forcePastDue) return { kind: "past_due", daysAgo };
  const bucket = d.getDate() % 5;
  if (bucket === 0) return { kind: daysAgo > 14 ? "past_due" : "in_progress", daysAgo };
  return { kind: "completed", daysAgo };
}
const STATUS_META = {
  completed:   { label: "Completed",   color: "var(--tt-secondary)" },
  in_progress: { label: "In Progress", color: "var(--tt-blue)" },
  past_due:    { label: "Past Due",    color: "var(--tt-red)" },
};

// ── Date Range Calendar ──
function DateRangeCalendar({ anchorRef, onClose, onApply, allowFuture = false, singleDate = false, alwaysBelow = false }) {
  const today = APP_TODAY;
  const [viewYear,   setViewYear]   = useState(today.getFullYear());
  const [viewMonth,  setViewMonth]  = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [hovering,   setHovering]   = useState(null);
  const calRef = useRef(null);

  const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];

  // ── Scroll wheel to change month ──
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) shiftMonth(1); else shiftMonth(-1);
  };

  const shiftMonth = (dir) => {
    setViewMonth(m => {
      const next = m + dir;
      if (next < 0)  { setViewYear(y => y - 1); return 11; }
      if (next > 11) { setViewYear(y => y + 1); return 0; }
      return next;
    });
  };

  // ── Fixed position: left-aligned to anchor, always below it ──
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    if (!anchorRef?.current || !calRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const CAL_H = calRef.current.offsetHeight || 340;
    const MARGIN = 8;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const CAL_W = 308;

    // left-align to anchor left edge, clamp so it doesn't go off-screen
    let left = anchor.left;
    left = Math.min(left, vw - CAL_W - MARGIN);

    // Always opens below the anchor, never above it — only nudged up if it
    // would otherwise overflow the bottom of the viewport.
    let top = anchor.bottom + MARGIN;
    if (!alwaysBelow) top = Math.min(top, Math.max(MARGIN, vh - CAL_H - MARGIN));

    setPos({ top, left });
  }, [anchorRef]);

  // ── Click outside to close ──
  useEffect(() => {
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target) &&
          anchorRef?.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toKey = (y, m, d) =>
    `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  // In singleDate mode there's no range to preview — every click just
  // replaces the one selected day, and hovering never draws a band.
  const effectiveEnd = singleDate ? null : (rangeEnd || hovering);

  const handleDay = (key) => {
    if (!allowFuture && key > todayKey) return; // dates after today can't be selected
    if (singleDate) {
      setRangeStart(key);
      setRangeEnd(null);
      if (onApply) onApply(key, null);
      return;
    }
    if (!rangeStart || rangeEnd) {
      setRangeStart(key); setRangeEnd(null);
    } else {
      if (key < rangeStart) { setRangeEnd(rangeStart); setRangeStart(key); }
      else setRangeEnd(key);
    }
  };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  const prevMonthDate = new Date(viewYear, viewMonth - 1, 1);
  const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);

  // Always exactly 6 rows (42 cells) so the calendar doesn't resize between
  // months, with muted, non-selectable preview days from the prev/next month
  // filling the leading/trailing gaps — like a standard date picker.
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, month: prevMonthDate.getMonth(), year: prevMonthDate.getFullYear(), otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, otherMonth: false });
  }
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({ day: nextDay++, month: nextMonthDate.getMonth(), year: nextMonthDate.getFullYear(), otherMonth: true });
  }

  const CELL = 40; // px per cell

  return (
    <div
      ref={calRef}
      onWheel={handleWheel}
      style={{
        position: alwaysBelow ? "absolute" : "fixed",
        top: alwaysBelow ? "calc(100% + 8px)" : pos.top,
        left: alwaysBelow ? 0 : pos.left,
        zIndex: 9999,
        pointerEvents: "auto", // guard against an ancestor (e.g. the side panel wrapper) turning this off
        width: 308,
        padding: "16px 12px 12px",
        border: "1.5px solid var(--tt-grey03)",
        borderRadius: 16,
        background: "white",
        // A thin border alone was easy to lose against the white report
        // page behind it — even correctly on top (z-index 9999), it read
        // as "sunk into" the page below with nothing to visually separate
        // the two. A real elevation shadow, matching other floating
        // popovers in this app, fixes that regardless of what's behind it.
        boxShadow: "0 8px 24px rgba(10,22,41,0.16)",
        userSelect: "none",
      }}
    >
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 4px" }}>
        <button
          onClick={() => shiftMonth(-1)}
          onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
          style={{ background: "none", border: "none", borderRadius: 6, cursor: "pointer", padding: 4, color: "var(--tt-text-2)", display: "flex", transition: "background 0.15s" }}
        >
          <ChevronLeft size={16} strokeWidth={SW} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-text-1)" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={() => shiftMonth(1)}
          onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
          style={{ background: "none", border: "none", borderRadius: 6, cursor: "pointer", padding: 4, color: "var(--tt-text-2)", display: "flex", transform: "rotate(180deg)", transition: "background 0.15s" }}
        >
          <ChevronLeft size={16} strokeWidth={SW} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)`, marginBottom: 2 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: "var(--tt-grey05)", lineHeight: "20px" }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)`, rowGap: 4 }}>
        {cells.map((cell, i) => {
          const { day: d, month: cMonth, year: cYear, otherMonth } = cell;
          const key      = toKey(cYear, cMonth, d);
          const isToday  = key === todayKey;
          const isFuture = key > todayKey;
          const disabled = !allowFuture && isFuture; // prev/next-month preview days are selectable, just future dates aren't (unless allowFuture)
          const start    = key === rangeStart;
          const end      = key === rangeEnd;
          const selected = start || end;
          const col      = i % 7; // 0=Sun, 6=Sat

          // seamless range band: full-width bg between start and end (inclusive of selected ends)
          const lo = rangeStart;
          const hi = singleDate ? null : effectiveEnd && effectiveEnd > rangeStart ? effectiveEnd : rangeStart && !rangeEnd && hovering && hovering > rangeStart ? hovering : null;
          const inBand = lo && hi && key >= lo && key <= hi;

          // band left/right caps for rounded ends
          const isLeft  = start || col === 0 || key === lo;
          const isRight = end   || col === 6 || key === hi;

          const bandRadius = inBand
            ? `${isLeft ? "50%" : "0"} ${isRight ? "50%" : "0"} ${isRight ? "50%" : "0"} ${isLeft ? "50%" : "0"}`
            : "0";

          // Any date not already covered by the band preview still needs its
          // own plain hover cue — this covers singleDate mode (which has no
          // band at all), and range mode before a start date is picked, or
          // when hovering a day the in-progress band doesn't cover (e.g.
          // before rangeStart) — without it, those cases showed no hover
          // feedback whatsoever.
          const plainHover = !disabled && !selected && hovering === key && !inBand;

          return (
            <div
              key={key}
              onMouseEnter={() => !disabled && setHovering(key)}
              onMouseLeave={() => setHovering(null)}
              onClick={() => !disabled && handleDay(key)}
              style={{
                position: "relative",
                height: CELL, width: CELL,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                // seamless band background (or the plain per-day hover cue)
                background: (inBand || plainHover) ? "var(--tt-grey03)" : "transparent",
                borderRadius: plainHover ? "50%" : bandRadius,
              }}
            >
              {/* The actual date circle */}
              <div style={{
                width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "50%",
                background: selected ? "var(--tt-text-1)" : "transparent",
                border: isToday && !selected ? "1.5px solid var(--tt-text-1)" : "none",
                color: selected ? "#fff" : (inBand || plainHover) ? "var(--tt-text-1)" : disabled ? "var(--tt-grey04)" : otherMonth ? "var(--tt-grey03)" : isToday ? "var(--tt-text-1)" : "var(--tt-text-2)",
                fontSize: 13,
                fontWeight: selected || isToday ? 600 : 400,
                zIndex: 1,
                position: "relative",
                transition: "background 0.1s",
              }}>
                {d}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {!singleDate && <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--tt-grey03)" }}>
        <button
          onClick={onClose}
          onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
          onMouseLeave={e => e.currentTarget.style.background = "white"}
          style={{
            padding: "6px 16px", borderRadius: 8,
            border: "1px solid var(--tt-grey03)", background: "white",
            fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: "pointer", transition: "background 0.15s",
          }}>Cancel</button>
        <button
          onClick={() => onApply ? onApply(rangeStart, rangeEnd) : onClose()}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          style={{
            padding: "6px 16px", borderRadius: 8,
            border: "none", background: "var(--tt-text-1)",
            fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer", transition: "opacity 0.15s",
          }}>Apply</button>
      </div>}
    </div>
  );
}

// ── Tasks Tab ──
function TasksTab() {
  return (
    <div className="pb-4">
      <div className="flex gap-2 mb-4">
        {[
          { Icon: SlidersHorizontal, label: "Filter" },
          { Icon: ArrowUpDown,       label: "Sort" },
          { Icon: Calendar,          label: "Add to calendar" },
        ].map(({ Icon, label }) => (
          <Button key={label} variant="outline" size="sm"
            className="gap-2 text-[13px] font-normal text-[var(--tt-text-2)] border-[var(--tt-grey03)]">
            <Icon size={14} strokeWidth={SW} /> {label}
          </Button>
        ))}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between py-[10px] border-b border-[var(--tt-grey03)]">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--tt-text-1)]">
            Current
            <Badge className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-[11px] font-semibold bg-[var(--tt-grey03)] text-[var(--tt-text-2)]">1</Badge>
          </div>
          <ChevronUp size={16} color="var(--tt-grey05)" strokeWidth={SW} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 py-[10px] border-b border-[var(--tt-grey03)] mb-[40px] last:mb-0">
            <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--tt-grey04)] shrink-0 cursor-pointer hover:border-[var(--tt-secondary)] transition-colors" />
            <span className="flex-1 text-[14px] text-[var(--tt-text-1)]">Fix the sink</span>
            <div className="flex items-center gap-2">
              <div className="tt-task-chip"><AlignJustify size={12} color="var(--tt-grey05)" strokeWidth={1} /></div>
              <div className="tt-task-chip"><Calendar size={12} color="var(--tt-grey05)" strokeWidth={1} /><span>Oct 18</span></div>
              <div className="tt-task-chip"><Clock size={12} color="var(--tt-grey05)" strokeWidth={1} /><span>8.5h</span></div>
              <div className="tt-task-chip"><UserPlus size={12} color="var(--tt-grey05)" strokeWidth={1} /><span>Assignee</span></div>
              <div className="tt-task-chip"><Link2 size={12} color="var(--tt-grey05)" strokeWidth={1} /></div>
            </div>
          </div>
        </div>

        <input placeholder="Enter task name..."
          className="w-full py-[10px] border-none outline-none text-[14px] bg-transparent placeholder:text-[var(--tt-grey04)]" />
      </div>

      {["Overdue", "Completed"].map((label) => (
        <div key={label} className="mb-3">
          <div className="flex items-center justify-between py-[10px] border-b border-[var(--tt-grey03)] cursor-pointer">
            <span className="text-[14px] font-semibold text-[var(--tt-text-1)]">{label}</span>
            <ChevronDown size={16} color="var(--tt-grey05)" strokeWidth={SW} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Report section checkbox ──
// Toggle-able checkbox + label used to include/exclude a section of the
// report.
function ReportCheckbox({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 40, padding: 0, flexShrink: 0,
        background: "none", border: "none",
        fontSize: 13, fontWeight: 500,
        color: "var(--tt-text-2)",
        cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        lineHeight: 0, boxSizing: "border-box",
        background: active ? "var(--tt-secondary)" : "white",
        border: active ? "none" : "1.5px solid var(--tt-grey04)",
        transition: "background 0.15s, border-color 0.15s",
      }}>
        {active && <Check size={12} color="white" strokeWidth={3} style={{ display: "block" }} />}
      </span>
      {label}
    </button>
  );
}

// ── Exclusive edit-mode coordination ──
// Only one EditableField (or TargetOpeningField) may be in edit mode at a
// time across the whole document — opening one closes whichever other
// field was open, the same way a browser only lets one <details> in a
// group stay open. Backed by a single { activeField, setActiveField } pair
// held in ReportsTab and handed down via context (rather than threading
// activeField/onActivate/onDeactivate through every call site by hand),
// with each field identified by its own fieldId string.
const ActiveEditContext = createContext({ activeField: null, setActiveField: () => {} });
// A stable (never-changing identity) inert value for the hidden measuring
// scaffold to pin ActiveEditContext to — see hiddenMeasuringScaffold.
const INERT_ACTIVE_EDIT = { activeField: null, setActiveField: () => {} };

// ── Inline-editable text ──
// No pencil icon — hovering shows a grey03 background to signal the field
// is editable, and clicking swaps it for an input (or textarea) with
// check/cancel icons matching the task-name rename pattern (inside the
// input for single-line fields, below it in-flow for multiline ones, since
// icons can't sit inside wrapped text). `fieldId` plugs it into the
// exclusive edit-mode coordination above — only the field whose fieldId
// matches the shared activeField is ever actually in edit mode.
//
// `boxed` (multiline only) makes the field own its grey02 card chrome
// (background/padding/radius) in both states, instead of a caller-side
// wrapper — so editing swaps the card's plain text for a textarea (plus
// its check/cancel row) filling that same box, rather than nesting a
// separate bordered textarea inside it.
//
// `required` blocks committing an empty value — the check button (or
// Enter) just shows `errorMessage` below the field and leaves editing
// open instead of calling onSave.
//
// `alwaysEditing` skips the click-to-edit dance entirely — used for fields
// (Summary, per-entry notes) that should just read as a plain textarea/
// input from the start. Every keystroke calls onSave directly (no deferred
// draft, so there's nothing to cancel — no X here, only the click-to-edit
// fields below get that). A single check button sits at the bottom-right
// corner and is always visible, empty or not; clicking it just blurs the
// field, signaling "done" without changing the already-live value.
// `disabled` still wins over this (a saved/locked report shows plain text).
//
// Whatever sits below an active (editing) field is always 8px away: a
// non-boxed field's own wrapper carries that as marginBottom, multiline's
// check/cancel row sits 8px under the textarea, and the error message (if
// any) sits 8px under that.
function EditableField({ fieldId, value, placeholder, placeholderStyle, onSave, onCancel, multiline, disabled, boxed, required, errorMessage, textStyle, inputStyle, as: Tag = "p", alwaysEditing }) {
  const { activeField, setActiveField } = useContext(ActiveEditContext);
  const [draft, setDraft] = useState(value || "");
  const [error, setError] = useState(false);
  const alwaysEditingRef = useRef(null);
  const editing = !disabled && !alwaysEditing && activeField === fieldId;

  const boxStyle = boxed ? { position: "relative", background: "var(--tt-grey02)", borderRadius: 8, padding: 8 } : {};

  if (disabled) {
    if (value) return <div style={boxStyle}><Tag style={{ display: "block", ...textStyle }}>{value}</Tag></div>;
    return placeholder ? <div style={boxStyle}><Tag style={{ display: "block", ...textStyle, color: "var(--tt-grey05)" }}>{placeholder}</Tag></div> : null;
  }

  if (alwaysEditing) {
    const done = () => alwaysEditingRef.current?.blur();
    const confirmButton = (
      <button
        onClick={done}
        onMouseEnter={ev => ev.currentTarget.style.opacity = "0.85"}
        onMouseLeave={ev => ev.currentTarget.style.opacity = "1"}
        style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "var(--tt-secondary)", border: "none", borderRadius: 6, cursor: "pointer", padding: 0, transition: "opacity 0.15s" }}
      >
        <Check size={15} strokeWidth={SW} color="white" />
      </button>
    );
    return multiline ? (
      <div style={boxStyle}>
        <Textarea
          ref={alwaysEditingRef}
          value={value}
          onChange={ev => onSave(ev.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ fontFamily: "inherit", ...inputStyle }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>{confirmButton}</div>
      </div>
    ) : (
      <div style={{ position: "relative" }}>
        <Input
          ref={alwaysEditingRef}
          type="text"
          value={value}
          onChange={ev => onSave(ev.target.value)}
          placeholder={placeholder}
          style={{ fontFamily: "inherit", padding: "0 44px 0 12px", ...inputStyle }}
        />
        <div style={{ position: "absolute", right: 6, bottom: 6 }}>{confirmButton}</div>
      </div>
    );
  }

  if (editing) {
    const commit = () => {
      const trimmed = draft.trim();
      if (required && !trimmed) { setError(true); return; }
      onSave(trimmed);
      setActiveField(null);
      setError(false);
    };
    const cancel = () => { setActiveField(null); setError(false); if (onCancel) onCancel(); };
    const onChange = ev => { setDraft(ev.target.value); if (error) setError(false); };
    return (
      <div key="editing" style={{ position: "relative", maxWidth: "100%", minWidth: 0, ...(!boxed ? { marginBottom: 8 } : {}), ...boxStyle }}>
        {multiline ? (
          <textarea
            ref={el => { if (el) { el.focus(); const len = el.value.length; el.setSelectionRange(len, len); } }}
            value={draft}
            onChange={onChange}
            onKeyDown={ev => {
              if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); commit(); }
              // stopPropagation so this only cancels the field's own edit —
              // without it, the keydown still bubbles to the preview
              // modal's own document-level Escape listener and closes the
              // whole modal right behind it.
              if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); cancel(); }
            }}
            rows={3}
            placeholder={placeholder}
            style={{ display: "block", width: "100%", fontFamily: "inherit", border: `1px solid ${error ? "var(--tt-red)" : "var(--tt-text-1)"}`, borderRadius: 8, outline: "none", resize: "none", padding: "8px 12px", boxSizing: "border-box", background: "white", ...inputStyle }}
          />
        ) : (
          <input
            ref={el => { if (el) { el.focus(); const len = el.value.length; el.setSelectionRange(len, len); } }}
            type="text"
            value={draft}
            onChange={onChange}
            onKeyDown={ev => {
              if (ev.key === "Enter") { ev.preventDefault(); commit(); }
              // Same reasoning as the textarea above — stop this from also
              // bubbling into the modal's own Escape-to-close listener.
              if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); cancel(); }
            }}
            placeholder={placeholder}
            style={{ fieldSizing: "content", width: "100%", maxWidth: "100%", minWidth: 120, height: 40, padding: "0 76px 0 12px", border: `1px solid ${error ? "var(--tt-red)" : "var(--tt-text-1)"}`, borderRadius: 8, fontFamily: "inherit", outline: "none", boxSizing: "border-box", ...inputStyle }}
          />
        )}
        <div style={multiline
          ? { display: "flex", justifyContent: "flex-end", gap: 4, marginTop: 8 }
          : { position: "absolute", right: 6, bottom: 6, display: "flex", alignItems: "center", gap: 4 }
        }>
          <button
            onClick={cancel}
            onMouseEnter={ev => ev.currentTarget.style.background = boxed ? "rgba(255,255,255,0.6)" : "var(--tt-grey02)"}
            onMouseLeave={ev => ev.currentTarget.style.background = "none"}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "none", border: "none", borderRadius: 6, cursor: "pointer", padding: 0, transition: "background 0.15s" }}
          >
            <X size={15} strokeWidth={SW} color="var(--tt-grey06)" />
          </button>
          <button
            onClick={commit}
            onMouseEnter={ev => ev.currentTarget.style.opacity = "0.85"}
            onMouseLeave={ev => ev.currentTarget.style.opacity = "1"}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "var(--tt-secondary)", border: "none", borderRadius: 6, cursor: "pointer", padding: 0, transition: "opacity 0.15s" }}
          >
            <Check size={15} strokeWidth={SW} color="white" />
          </button>
        </div>
        {error && (
          <p style={{ color: "var(--tt-red)", fontSize: 11, fontWeight: 500, margin: "8px 0 0" }}>
            {errorMessage || "This can't be empty."}
          </p>
        )}
      </div>
    );
  }

  // Boxed fields (Summary) rest at grey02 (their permanent card fill, from
  // boxStyle) and hover one step darker to grey03 — hovering has to change
  // the WRAP (which owns the card's padding/radius), not the inner Tag,
  // since the Tag alone wouldn't cover the padded edges of the card.
  return (
    <div
      key="display"
      className="tt-editable-wrap"
      onMouseEnter={boxed ? (ev => ev.currentTarget.style.background = "var(--tt-grey03)") : undefined}
      onMouseLeave={boxed ? (ev => ev.currentTarget.style.background = "var(--tt-grey02)") : undefined}
      style={{ ...boxStyle }}
    >
      <Tag
        onClick={() => { setDraft(value || ""); setActiveField(fieldId); setError(false); }}
        onMouseEnter={!boxed ? (ev => ev.currentTarget.style.background = "var(--tt-grey03)") : undefined}
        onMouseLeave={!boxed ? (ev => ev.currentTarget.style.background = "none") : undefined}
        style={{ display: "inline-block", position: boxed ? "static" : "relative", cursor: "pointer", ...textStyle }}
      >
        {value || <span style={{ color: "var(--tt-grey05)", textDecoration: "underline", ...placeholderStyle }}>{placeholder}</span>}
      </Tag>
    </div>
  );
}

// Downscales an uploaded image to a small PNG data URL (longest side
// capped at maxDim) instead of keeping the original file's full
// resolution. The logo only ever displays at max-width:100px (in the
// export) or 80px (live), so this loses nothing visible — but it's also
// what keeps the resulting data URL small enough to embed in a "Copy
// link" URL. A 160px cap still produced a ~43KB data URL for a
// photographic test image, and a ~46,000-character URL built from it
// failed to even navigate in Chrome (chrome-error://chromewebdata) — well
// short of the ~2MB limits often quoted for data: URLs in isolation.
// 64px keeps the same test image's data URL under 10KB.
const resizeImageToDataURL = (file, maxDim = 64) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = reader.result;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// ── Company logo upload box ──
// Click opens a hidden file input; the chosen image is downscaled (see
// resizeImageToDataURL) and handed back via onChange — no upload endpoint,
// it's just a small data URL. Each instance keeps its own input ref, since
// the same header (and this box with it) renders once per page — a single
// shared ref would only ever point at whichever page's copy mounted last.
//
// Before a logo exists, this is a fixed 48x48 dashed placeholder. Once one
// is uploaded, the box drops the placeholder chrome and just sizes to the
// image itself (max-width 80px, height auto) so a wide logo isn't
// squeezed into a small square. While the file is being read, a small
// spinner replaces the placeholder/image.
function LogoUploadBox({ src, onChange, disabled }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = ev => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    setLoading(true);
    resizeImageToDataURL(file)
      .then(url => { onChange(url); setLoading(false); })
      .catch(() => setLoading(false));
  };

  return (
    <div
      className="tt-editable-wrap"
      onClick={() => !disabled && !loading && inputRef.current?.click()}
      style={{
        position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled || loading ? "default" : "pointer",
        ...(src
          ? { maxWidth: 80, height: "auto" }
          : { width: 48, height: 48, borderRadius: 8, overflow: "hidden", border: "1px dashed var(--tt-grey04)", background: "var(--tt-grey01)" }),
      }}
    >
      {loading ? (
        <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--tt-grey03)", borderTopColor: "var(--tt-text-2)", display: "inline-block", animation: "tt-spin 0.75s linear infinite" }} />
      ) : src ? (
        <img src={src} alt="Company logo" style={{ display: "block", maxWidth: 80, width: "100%", height: "auto" }} />
      ) : (
        <FileImage size={18} strokeWidth={SW} color="var(--tt-grey05)" />
      )}
      {!disabled && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}

// ── Target Opening — single-date field ──
// Its own component (not just inline JSX) so the calendar's anchor ref is
// per-instance — needed now that the full header (this field included)
// renders once per page rather than once for the whole document. Plugs
// into the same exclusive edit-mode coordination as EditableField (see
// ActiveEditContext above), via its own fieldId.
function TargetOpeningField({ fieldId, value, disabled, onApply }) {
  const { activeField, setActiveField } = useContext(ActiveEditContext);
  const anchorRef = useRef(null);
  const open = !disabled && activeField === fieldId;
  const [displayValue, setDisplayValue] = useState(value || "");

  useEffect(() => { setDisplayValue(value || ""); }, [value]);

  if (disabled) {
    return <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--tt-text-1)", margin: 0 }}>{displayValue || "—"}</p>;
  }

  return (
    <div className="tt-editable-wrap" ref={anchorRef} style={{ position: "relative" }}>
      <p
        onClick={() => setActiveField(open ? null : fieldId)}
        onMouseEnter={ev => ev.currentTarget.style.background = "var(--tt-grey03)"}
        onMouseLeave={ev => ev.currentTarget.style.background = "none"}
        style={{ display: "inline-block", position: "relative", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--tt-text-1)", textDecoration: displayValue ? "none" : "underline", margin: 0, cursor: "pointer" }}
      >
        {displayValue || "Add target date"}
      </p>
      {open && (
        <DateRangeCalendar
          anchorRef={anchorRef}
          allowFuture
          singleDate
          alwaysBelow
          onClose={() => setActiveField(null)}
          onApply={(start) => {
            if (start) {
              const [y, m, d] = start.split("-");
              const formatted = new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              setDisplayValue(formatted);
              onApply(formatted);
            }
            setActiveField(null);
          }}
        />
      )}
    </div>
  );
}

// ── Fixed-position tooltip button ──
// Renders tooltip via a fixed div that escapes overflow clipping
function FixedTooltipBtn({ children, label, onAction }) {
  const [tip, setTip] = useState(null); // { top, left }
  const btnRef = useRef(null);

  const showTip = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setTip({ top: r.bottom + 6, left: r.right });
  };
  const hideTip = () => setTip(null);

  return (
    <>
      <button
        ref={btnRef}
        className="tt-icon-btn"
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        onClick={() => { hideTip(); onAction && onAction(btnRef.current?.getBoundingClientRect()); }}
      >
        {children}
      </button>
      {tip && (
        <div style={{
          position: "fixed", zIndex: 9999,
          top: tip.top, left: tip.left,
          transform: "translateX(-100%)",
          background: "var(--tt-text-1)", color: "white",
          fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
          padding: "4px 8px", borderRadius: 4,
          pointerEvents: "none",
        }}>
          {label}
        </div>
      )}
    </>
  );
}

// Photo grid thumbnail — the skeleton only covers the initial fixed delay,
// not how long the actual image takes to download, so each photo keeps its
// own shimmer placeholder up until it has genuinely finished loading.
function PhotoThumb({ src, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <div
      onClick={onClick}
      style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 4, overflow: "hidden", cursor: onClick ? "pointer" : "default" }}
    >
      {!loaded && <div className="tt-skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.2s" }}
      />
    </div>
  );
}

// Photo grid capped to one row of 4 — beyond that, the last visible cell
// becomes a "+N more" overlay that expands the grid in place to show every
// photo (no cap), rather than jumping into the lightbox. Each visible photo
// also carries a select checkbox in its top-right corner; checking one or
// more surfaces a selection toolbar (rendered by the caller) with a Delete
// action. Deleted photos are filtered out here by their *original* index
// (excludedPhotos), so remaining photos keep the same index-based keys
// even after some are removed. An entry with zero visible photos renders
// nothing.
function PhotoGrid({ photos, onOpen, excludedPhotos, entryKey, selectedPhotos, onToggleSelect }) {
  const CAP = 4;
  const [expanded, setExpanded] = useState(false);
  const items = (photos || [])
    .map((k, i) => ({ k, i }))
    .filter(({ i }) => !(excludedPhotos && excludedPhotos[`${entryKey}_${i}`]));

  if (items.length === 0) return null;

  const remaining = items.length - CAP;
  const visibleItems = (expanded || remaining <= 0) ? items : items.slice(0, CAP);
  const visiblePhotoKeys = items.map(it => it.k);
  // Original (pre-filter) indices for each visible photo, in the same
  // order as visiblePhotoKeys — lets the lightbox map a filmstrip
  // selection back to this entry's real excludedPhotos keys.
  const visibleOriginalIndices = items.map(it => it.i);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginTop: 10 }}>
      {visibleItems.map(({ k, i }, viewIdx) => {
        const selected = !!(selectedPhotos && selectedPhotos[`${entryKey}_${i}`]);
        const isCapCell = !expanded && remaining > 0 && viewIdx === visibleItems.length - 1;
        const canOpen = !!(IMG_MAP[k] && onOpen) && !isCapCell;
        return (
          <div
            key={i}
            className="group"
            style={{ position: "relative" }}
            onMouseEnter={e => { if (canOpen && !selected) e.currentTarget.lastElementChild.style.opacity = "1"; }}
            onMouseLeave={e => { if (canOpen) e.currentTarget.lastElementChild.style.opacity = "0"; }}
          >
            <PhotoThumb src={IMG_MAP[k]} onClick={canOpen ? () => onOpen(visiblePhotoKeys, viewIdx, visibleOriginalIndices) : undefined} />
            {!isCapCell && IMG_MAP[k] && (
              <button
                onClick={e => { e.stopPropagation(); onToggleSelect && onToggleSelect(i, k); }}
                disabled={!onToggleSelect}
                className={`transition-opacity ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{
                  position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%",
                  border: selected ? "none" : "1.5px solid white", background: selected ? "var(--tt-secondary)" : "rgba(10,22,41,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  cursor: onToggleSelect ? "pointer" : "default", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                  zIndex: 2,
                }}
              >
                {selected && <Check size={12} color="white" strokeWidth={3} />}
              </button>
            )}
            {canOpen && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(10,22,41,0.25)", opacity: 0, transition: "opacity 0.15s", pointerEvents: "none", zIndex: 1 }} />
            )}
            {isCapCell && (
              <button
                onClick={() => setExpanded(true)}
                style={{
                  position: "absolute", inset: 0, background: "rgba(10,22,41,0.55)",
                  border: "none", borderRadius: 4, color: "white",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                +{remaining} more
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Full-screen photo viewer — opened by clicking a thumbnail in the side
// panel. Dark chrome built from the design system's darkest token
// (--tt-text-1) rather than a plain black, with a filmstrip of the same
// entry's other photos along the bottom for quick navigation.
const truncateLabel = (s, n = 20) => (s && s.length > n ? s.slice(0, n) + "..." : s);

// Icon button + hover tooltip for the lightbox's dark chrome — same
// bottom-right, getBoundingClientRect-based tooltip positioning as
// FixedTooltipBtn, but a lighter hover fill (FixedTooltipBtn's is tuned
// for light surfaces).
function LightboxIconBtn({ label, onClick, disabled, children }) {
  const [tip, setTip] = useState(null);
  const btnRef = useRef(null);

  const showTip = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setTip({ top: r.bottom + 6, left: r.right });
  };
  const hideTip = () => setTip(null);

  return (
    <>
      <button
        ref={btnRef}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={e => { showTip(); if (!disabled) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
        onMouseLeave={e => { hideTip(); e.currentTarget.style.background = "transparent"; }}
        style={{
          background: "none", border: "none", color: "white", display: "flex", padding: 8, borderRadius: 8,
          transition: "background 0.15s", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
        }}
      >
        {children}
      </button>
      {tip && (
        <div style={{
          position: "fixed", zIndex: 9999, top: tip.top, left: tip.left, transform: "translateX(-100%)",
          background: "var(--tt-text-1)", color: "white", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
          padding: "4px 8px", borderRadius: 4, pointerEvents: "none",
        }}>
          {label}
        </div>
      )}
    </>
  );
}

function PhotoLightbox({ photos, index, entryDate, taskName, onIndexChange, onClose, onDeleteSelected }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [imgDims, setImgDims] = useState(null);
  const [selectedFilmstrip, setSelectedFilmstrip] = useState({}); // { [photoIndex]: photoKey } — filmstrip checkbox selection

  useEffect(() => { setRotation(0); setZoom(100); setShowFileDetails(false); setImgDims(null); }, [index]);

  const toggleFilmstripSelect = (i, photoKey) => {
    setSelectedFilmstrip(prev => {
      const next = { ...prev };
      if (next[i] !== undefined) delete next[i]; else next[i] = photoKey;
      return next;
    });
  };

  const handleDeleteSelectedFilmstrip = () => {
    onDeleteSelected && onDeleteSelected(Object.keys(selectedFilmstrip).map(Number));
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onIndexChange(Math.min(photos.length - 1, index + 1));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [index, photos.length, onClose, onIndexChange]);

  const iconBtnStyle = {
    background: "none", border: "none", cursor: "pointer", color: "white",
    display: "flex", padding: 8, borderRadius: 8, transition: "background 0.15s",
  };
  const onIconEnter = e => e.currentTarget.style.background = "rgba(255,255,255,0.12)";
  const onIconLeave = e => e.currentTarget.style.background = "transparent";

  // No real upload timestamp (or file size) in the data model — derive
  // stable (not random-on-every-render) stand-ins from the entry date +
  // photo index instead.
  let hash = index;
  if (entryDate) for (let i = 0; i < entryDate.length; i++) hash = (hash * 31 + entryDate.charCodeAt(i)) >>> 0;
  const hour24 = 7 + (hash % 11);
  const minute = (hash >> 3) % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  const timeLabel = `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  const uploadedAt = entryDate
    ? `${parseDate(entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeLabel}`
    : "";
  const fullTimestamp = entryDate
    ? `${parseDate(entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ${timeLabel}`
    : "";
  const fileName = entryDate ? `${entryDate.replace(/-/g, "")}-${String(index + 1).padStart(2, "0")}.jpg` : `photo-${index + 1}.jpg`;
  const fileSizeKb = 140 + (hash % 260);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, background: "black", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12,
        padding: "10px 20px", flexShrink: 0, background: "var(--tt-grey06)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, justifySelf: "start" }}>
          <button onClick={onClose} style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <ChevronLeft size={18} strokeWidth={SW} />
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "var(--tt-pastel-magenta)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>MJ</span>
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0 }}>You</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: 0, whiteSpace: "nowrap" }}>{uploadedAt}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0, justifySelf: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</span>
          <LightboxIconBtn label="Rename">
            <Pencil size={13} strokeWidth={SW} />
          </LightboxIconBtn>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, justifySelf: "end" }}>
          <LightboxIconBtn label="Delete" onClick={() => onDeleteSelected && onDeleteSelected([index])}>
            <Trash2 size={16} strokeWidth={SW} />
          </LightboxIconBtn>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
          <LightboxIconBtn label="Rotate" onClick={() => setRotation(r => (r + 90) % 360)}>
            <RotateCw size={16} strokeWidth={SW} />
          </LightboxIconBtn>
          <LightboxIconBtn label="Zoom out" disabled={zoom <= 25} onClick={() => setZoom(z => Math.max(25, z - 25))}>
            <ZoomOut size={16} strokeWidth={SW} />
          </LightboxIconBtn>
          <span style={{ fontSize: 12, fontWeight: 500, color: "white", width: 40, textAlign: "center" }}>{zoom}%</span>
          <LightboxIconBtn label="Zoom in" disabled={zoom >= 200} onClick={() => setZoom(z => Math.min(200, z + 25))}>
            <ZoomIn size={16} strokeWidth={SW} />
          </LightboxIconBtn>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
          <LightboxIconBtn label="Information" onClick={() => setShowFileDetails(true)}>
            <Info size={16} strokeWidth={SW} />
          </LightboxIconBtn>
        </div>
      </div>

      {/* Tag chips */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 16px", flexShrink: 0, background: "var(--tt-grey06)" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6, height: 22, padding: "0 10px",
          borderRadius: 4, background: "var(--tt-secondary)", color: "white", fontSize: 10, fontWeight: 600,
        }}>
          <Folder size={11} strokeWidth={2} /> {truncateLabel(PROJECT_NAME)}
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 10px",
          borderRadius: 4, background: "var(--tt-text-1)", color: "white", fontSize: 10, fontWeight: 600,
        }}>
          <Hash size={11} strokeWidth={2} /> {truncateLabel(taskName)}
        </span>
      </div>

      {/* Image */}
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, padding: "0 24px", overflow: "hidden", background: "black" }}>
        {index > 0 && (
          <button
            onClick={() => onIndexChange(index - 1)}
            style={{
              position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)",
              background: "rgba(10,22,41,0.4)", color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(10,22,41,0.4)"}
          >
            <ArrowLeft size={18} strokeWidth={SW} />
          </button>
        )}
        <img
          src={IMG_MAP[photos[index]]}
          alt=""
          onLoad={e => setImgDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4, transform: `rotate(${rotation}deg) scale(${zoom / 100})`, transition: "transform 0.15s" }}
        />
        {index < photos.length - 1 && (
          <button
            onClick={() => onIndexChange(index + 1)}
            style={{
              position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)",
              background: "rgba(10,22,41,0.4)", color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(10,22,41,0.4)"}
          >
            <ArrowRight size={18} strokeWidth={SW} />
          </button>
        )}

        {Object.keys(selectedFilmstrip).length > 0 && (
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10 }}>
            <button
              onClick={handleDeleteSelectedFilmstrip}
              style={{
                display: "flex", alignItems: "center", gap: 8, background: "rgba(10,22,41,0.75)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "10px 16px",
                color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <Trash2 size={16} strokeWidth={SW} /> Delete
              <span style={{
                background: "var(--tt-secondary)", color: "white", borderRadius: "50%",
                width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {Object.keys(selectedFilmstrip).length}
              </span>
            </button>
            <button
              onClick={() => setSelectedFilmstrip({})}
              style={{
                width: 44, height: 44, borderRadius: "50%", background: "rgba(10,22,41,0.75)",
                border: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
              }}
            >
              <X size={18} strokeWidth={SW} />
            </button>
          </div>
        )}
      </div>

      {/* Filmstrip — shown even for a single photo, not just when there's
          more than one to switch between. */}
      {photos.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "14px 16px", flexShrink: 0, overflowX: "auto", background: "var(--tt-grey06)" }}>
          {photos.map((p, i) => {
            const isSelected = selectedFilmstrip[i] !== undefined;
            return (
              <div
                key={i}
                onClick={() => onIndexChange(i)}
                onMouseEnter={e => { if (i !== index) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { if (i !== index) e.currentTarget.style.opacity = "0.55"; }}
                style={{
                  position: "relative", width: 160, height: 122, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                  border: i === index ? "2px solid white" : "2px solid transparent",
                  cursor: "pointer", opacity: i === index ? 1 : 0.55, transition: "opacity 0.15s",
                }}
              >
                <img src={IMG_MAP[p]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <button
                  onClick={e => { e.stopPropagation(); toggleFilmstripSelect(i, p); }}
                  style={{
                    position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%",
                    border: isSelected ? "none" : "1.5px solid white", background: isSelected ? "var(--tt-secondary)" : "rgba(10,22,41,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 0, cursor: "pointer",
                  }}
                >
                  {isSelected && <Check size={12} color="white" strokeWidth={3} />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showFileDetails && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 5100, background: "rgba(10,22,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowFileDetails(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 420, maxWidth: "calc(100vw - 32px)", background: "white", borderRadius: 16, padding: 24, boxShadow: "0 16px 48px rgba(10,22,41,0.25)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--tt-text-1)", margin: 0 }}>File details</p>
              <button
                onClick={() => setShowFileDetails(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tt-text-1)", padding: 4, display: "flex", borderRadius: 6, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <X size={20} strokeWidth={SW} />
              </button>
            </div>
            {[
              ["Name", fileName],
              ["Type", "Image"],
              ["Size", `${fileSizeKb} KB`],
              ["Dimensions", imgDims ? `${imgDims.w} × ${imgDims.h}` : "—"],
              ["Owner", "You"],
              ["Created", fullTimestamp],
              ["Modified", fullTimestamp],
            ].map(([label, value], i, arr) => (
              <div key={label} style={{ marginBottom: i === arr.length - 1 ? 0 : 16 }}>
                <p style={{ fontSize: 12, color: "var(--tt-grey05)", margin: "0 0 2px" }}>{label}</p>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--tt-text-1)", margin: 0, wordBreak: "break-all" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Short/medium/long term tiers — chosen so each lands in a different
// getGrouping() bucket (day <=14, week <=61, month beyond) without needing
// to touch that logic: 7 days -> day, 30 days -> week, 90 days -> month.
const PERIOD_OPTIONS_BASE = [
  { id: "last_7",   label: "Last 7 days" },
  { id: "last_30",  label: "Last 30 days" },
  { id: "last_90",  label: "Last 90 days" },
  { id: "last_180", label: "Last 6 months" },
  { id: "custom",   label: "Custom date" },
];

const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

function getLastNDaysRange(n) {
  const end = APP_TODAY;
  const start = new Date(end);
  start.setDate(end.getDate() - (n - 1));
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}

const PERIOD_LABELS = {
  last_7:     `Last 7 days · ${getLastNDaysRange(7)}`,
  last_30:    `Last 30 days · ${getLastNDaysRange(30)}`,
  last_90:    `Last 90 days · ${getLastNDaysRange(90)}`,
  last_180:   `Last 6 months · ${getLastNDaysRange(180)}`,
  custom:     "Custom date",
  since_last: "Since last report",
};

const PERIOD_RANGE = {
  last_7:     getLastNDaysRange(7),
  last_30:    getLastNDaysRange(30),
  last_90:    getLastNDaysRange(90),
  last_180:   getLastNDaysRange(180),
  custom:     "Custom date",
  since_last: "Since last report",
};

// ── Dummy data ──
const DUMMY_ENTRIES = [
  { date: "2026-09-10", note: "Flooring installation started on the ground floor.", photos: ["img5", "img1", "img6", "img2", "img3", "img7", "img4", "img8"] },
  { date: "2026-09-09", note: "Exterior siding repairs completed on the south wall.", photos: ["img9", "img2", "img3", "img7", "img4", "img5", "img6"] },
  { date: "2026-09-08", note: "Final electrical connections completed in the main panel.", photos: ["img9", "img8"] },
  { date: "2026-09-07", note: "Plumbing fixtures installed in all bathrooms.", photos: [] },
  { date: "2026-09-06", note: "Ceiling lights installed and tested.", photos: ["img8", "img7"] },
  { date: "2026-09-06", note: "Final walkthrough completed with the client — no issues noted.", photos: [] },
  { date: "2026-09-05", note: "Bathroom tile installation completed on the second floor.", photos: [] },
  { date: "2026-09-04", note: "Kitchen cabinet hardware installed.", photos: ["img6", "img1", "img9", "img2", "img3", "img4", "img8"] },
  { date: "2026-09-03", note: "Interior door hardware fitted — knobs and locks in place.", photos: ["img6", "img7"] },
  { date: "2026-09-02", note: "Drywall patching completed in the hallway.", photos: ["img4"] },
  { date: "2026-09-01", note: "Exterior paint touch-ups finished on the west elevation.", photos: ["img2", "img5", "img7", "img1"] },
  { date: "2026-08-31", note: "HVAC ductwork inspection passed.", photos: ["img8", "img9"] },
  { date: "2026-08-28", note: "Cracked wall sections patched and primed.", photos: ["img1", "img3", "img4"] },
  { date: "2026-08-25", note: "Garage door opener installed and tested.", photos: ["img6"] },
  { date: "2026-08-21", note: "Brickwork reinforcement completed on the north facade.", photos: ["img2", "img1"] },
  { date: "2026-08-18", note: "Landscaping grading completed around the foundation.", photos: ["img2", "img3"] },
  { date: "2026-08-14", note: "Peeling paint removed and surface prepared for recoat.", photos: ["img5", "img4", "img3"] },
  { date: "2026-08-11", note: "Window trim installed on the front facade.", photos: ["img5", "img1", "img4"] },
  { date: "2026-08-07", note: "Door frame replaced in the storage room.", photos: ["img7", "img6"] },
  { date: "2026-08-04", note: "Insulation installed in the attic space.", photos: ["img7", "img8"] },
  { date: "2026-07-31", note: "Structural assessment completed — no major issues found.", photos: ["img2"] },
  { date: "2026-07-28", note: "Roof shingles replaced on the north slope.", photos: ["img9", "img2", "img6", "img3"] },
  { date: "2026-07-24", note: "Scaffolding erected on the west side.", photos: ["img9", "img1"] },
  { date: "2026-07-21", note: "Electrical panel upgrade completed.", photos: ["img1"] },
  { date: "2026-07-17", note: "Waterproofing membrane applied to basement walls.", photos: ["img3", "img5"] },
  { date: "2026-07-14", note: "Foundation waterproofing sealant applied.", photos: ["img4", "img5"] },
  { date: "2026-07-10", note: "Project kickoff — site survey and initial documentation.", photos: ["img2", "img9", "img6"] },
  { date: "2026-06-30", note: "Framing inspection passed for the second-floor addition.", photos: ["img3", "img7", "img9"] },
  { date: "2026-06-23", note: "Site utilities connected — water and sewer lines.", photos: ["img2"] },
  { date: "2026-06-16", note: "Excavation completed for the new foundation footprint.", photos: ["img8", "img6", "img5", "img1", "img9"] },
];

// TODO(BE): replace with the crew member who actually logged each entry,
// from the API — derived from the entry's date here only because DUMMY_
// ENTRIES has no owner field of its own.
const ENTRY_OWNERS = ["Paul Anderson", "Morgan Taylor", "Carlos Smith", "Casey Lin", "Riley Scott"];
const ownerForEntry = (dateStr) => ENTRY_OWNERS[parseDate(dateStr).getDate() % ENTRY_OWNERS.length];

// TODO(BE): replace with the project's actual task/checklist list from the
// API — powers the auto-generated summary text and the completion count
// used there, independent of the dated photo/activity log above (a task
// can be in progress for weeks before any activity entry ever mentions it).
const DUMMY_TASKS = [
  { name: "Site survey and initial documentation", category: "Site", dueDate: null, status: "complete" },
  { name: "Excavation for foundation footprint", category: "Site", dueDate: null, status: "complete" },
  { name: "Foundation waterproofing sealant", category: "Site", dueDate: null, status: "complete" },
  { name: "Framing inspection, second floor", category: "Framing", dueDate: null, status: "complete" },
  { name: "Electrical panel upgrade", category: "Electrical", dueDate: null, status: "complete" },
  { name: "Roof shingles, north slope", category: "Site", dueDate: null, status: "complete" },
  { name: "Insulation, attic space", category: "Framing", dueDate: null, status: "complete" },
  { name: "Vent hood connection", category: "Mechanical", dueDate: "2026-09-05", status: "in_progress" },
  { name: "Punch plumbing rough-in", category: "Plumbing", dueDate: "2026-09-12", status: "in_progress" },
  { name: "Painting, dining room", category: "Finishes", dueDate: "2026-09-15", status: "in_progress" },
  { name: "Booth installation", category: "Finishes", dueDate: null, status: "in_progress" },
  { name: "Bar rough-in", category: "Bar fit-out", dueDate: null, status: "upcoming" },
  { name: "Ceiling grid, dining room", category: "Finishes", dueDate: null, status: "upcoming" },
  { name: "Health inspection", category: "Site", dueDate: null, status: "upcoming" },
  { name: "Handover walkthrough", category: "Site", dueDate: null, status: "upcoming" },
];

// ── Report generation engine ──
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function parsePeriodDates(periodStr, dateRange, customRange) {
  const now = APP_TODAY;

  if (dateRange === "last_7" || dateRange === "last_30" || dateRange === "last_90" || dateRange === "last_180") {
    const n = dateRange === "last_7" ? 7 : dateRange === "last_30" ? 30 : dateRange === "last_90" ? 90 : 180;
    const start = new Date(now); start.setDate(now.getDate() - (n - 1));
    return { start, end: now };
  }
  if (dateRange === "since_last" || dateRange === "custom") {
    // Parse from periodStr like "Sep 3 – Sep 10" or "Sep 10 – Sep 10"
    if (periodStr && periodStr.includes("–")) {
      const parts = periodStr.split("–").map(s => s.trim());
      const parseShort = (s) => {
        const d = new Date(`${s} 2026`);
        return isNaN(d) ? now : d;
      };
      return { start: parseShort(parts[0]), end: parseShort(parts[1]) };
    }
    // since_last fallback: last 30 days
    const start = new Date(now); start.setDate(now.getDate() - 30);
    return { start, end: now };
  }
  return { start: new Date(now.getTime() - 7 * 86400000), end: now };
}

function getGrouping(start, end) {
  const days = Math.round((end - start) / 86400000);
  if (days <= 14) return "day";
  if (days <= 61) return "week";
  return "month";
}

function groupEntries(entries, start, end, grouping) {
  // Filter entries within range
  const filtered = entries.filter(e => {
    const d = parseDate(e.date);
    return d >= start && d <= end;
  });

  const groups = {};
  filtered.forEach(entry => {
    const d = parseDate(entry.date);
    let key;
    if (grouping === "day") {
      key = entry.date;
    } else if (grouping === "week") {
      const day = d.getDay();
      const mon = new Date(d); mon.setDate(d.getDate() - ((day + 6) % 7));
      key = mon.toISOString().slice(0, 10);
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    if (!groups[key]) groups[key] = { key, entries: [] };
    groups[key].entries.push(entry);
  });

  return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
}

// Shared by the download/copy-link HTML output and the generate preview
// modal, so both show identical section labels.
function formatGroupLabel(g, grouping) {
  if (grouping === "week") {
    const [y, m, d] = g.key.split("-").map(Number);
    const mon = new Date(y, m - 1, d);
    const fmt = dt => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase();
    const tp = g.entries.reduce((s, e) => s + e.photos.length, 0);
    return `week of ${fmt(mon)} \xB7 ${tp} photo${tp !== 1 ? "s" : ""}`;
  }
  if (grouping === "month") {
    const [y, m] = g.key.split("-").map(Number);
    const label = new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toLowerCase();
    const tp = g.entries.reduce((s, e) => s + e.photos.length, 0);
    return `${label} \xB7 ${tp} photo${tp !== 1 ? "s" : ""}`;
  }
  const [y, m, d] = g.key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { day: "numeric", month: "short" }).toUpperCase();
}

// TODO(BE): replace with the account's actual per-report photo cap from the API
const PHOTO_LIMIT = 50;

function applyPhotoCap(groups, maxPhotos = PHOTO_LIMIT) {
  // Count total photos
  let total = groups.reduce((sum, g) => sum + g.entries.reduce((s, e) => s + e.photos.length, 0), 0);
  if (total <= maxPhotos) return groups;

  // Even sampling: collect all photos with position, sample evenly
  const all = [];
  groups.forEach((g, gi) => g.entries.forEach((e, ei) => e.photos.forEach((p, pi) => {
    all.push({ gi, ei, pi, photo: p });
  })));

  const step = all.length / maxPhotos;
  const selected = new Set();
  for (let i = 0; i < maxPhotos; i++) {
    selected.add(Math.min(Math.floor(i * step), all.length - 1));
  }

  // Rebuild groups keeping only selected photos. An entry that started
  // with photos but got trimmed down to zero by the cap is dropped
  // entirely — keeping it around as a bare, photo-less title would be
  // indistinguishable from (and get mislabeled as) a genuinely completed
  // no-photo task. A genuinely no-photo entry (e.noPhotos, tagged before
  // capping) is always kept regardless.
  return groups.map((g, gi) => ({
    ...g,
    entries: g.entries.map((e, ei) => ({
      ...e,
      photos: e.photos.filter((_, pi) => selected.has(all.findIndex(a => a.gi === gi && a.ei === ei && a.pi === pi))),
    })).filter(e => e.photos.length > 0 || e.noPhotos),
  }));
}

function buildReportData(dateRange, periodStr, customRange, includeNoPhotoTasks = true) {
  const { start, end } = parsePeriodDates(periodStr, dateRange, customRange);
  const grouping = getGrouping(start, end);
  let groups = groupEntries(DUMMY_ENTRIES, start, end, grouping);
  if (!includeNoPhotoTasks) {
    groups = groups
      .map(g => ({ ...g, entries: g.entries.filter(e => e.photos.length > 0) }))
      .filter(g => g.entries.length > 0);
  }
  // Tag each entry's "no photos" status now, before applyPhotoCap can trim
  // an otherwise-photographed entry down to zero photos for display —
  // otherwise a task that merely got capped would be indistinguishable
  // from one that was genuinely completed with no photos, and both would
  // wrongly show the "Completed" tag.
  groups = groups.map(g => ({
    ...g,
    entries: g.entries.map(e => ({ ...e, noPhotos: e.photos.length === 0 })),
  }));
  groups = applyPhotoCap(groups).filter(g => g.entries.length > 0);

  // Guarantee at least one Past Due example in every generated report —
  // the bucket-based status assignment's daysAgo>14 condition can never
  // fire naturally for a short/recent period, since every entry in it is
  // by definition from the last few days, so without this a "Last 7 days"
  // (or similar) report could never show one. Forces it on the earliest
  // entry in the period if nothing already qualifies on its own.
  const hasPastDue = groups.some(g => g.entries.some(e => !e.isNote && statusForEntry(e).kind === "past_due"));
  if (!hasPastDue) {
    let oldest = null;
    groups.forEach(g => g.entries.forEach(e => {
      if (e.isNote) return;
      if (!oldest || e.date < oldest.date) oldest = e;
    }));
    if (oldest) {
      groups = groups.map(g => ({
        ...g,
        entries: g.entries.map(e => e === oldest ? { ...e, forcePastDue: true } : e),
      }));
    }
  }

  // completed = entries actually attached to this report (countable from
  // what's shown below), total = the whole project's activity log — so the
  // number is always directly verifiable against the visible entries,
  // rather than referencing an unrelated, invisible task list.
  const completed = groups.reduce((s, g) => s + g.entries.length, 0);
  const total = DUMMY_ENTRIES.length;
  const pct = Math.round(completed / total * 100);

  return { groups, grouping, completed, total, pct };
}

// Photos checked off in the side panel are excluded from the final output
// (download / copy-link / save) but still shown (checked) in the live
// panel so the exclusion can be undone. Keyed the same way as extraNotes —
// `${entryKey}_${photoIndex}` — against the *original*, unspliced entries,
// so it has to run before applyExtraNotesToGroups shifts entry positions.
function applyPhotoExclusions(groups, excludedPhotos) {
  if (!excludedPhotos || Object.keys(excludedPhotos).length === 0) return groups;
  return groups.map(g => ({
    ...g,
    entries: g.entries.map((e, i) => {
      const entryKey = `${g.key}_${i}`;
      const filtered = e.photos.filter((_, pi) => !excludedPhotos[`${entryKey}_${pi}`]);
      return filtered.length === e.photos.length ? e : { ...e, photos: filtered };
    }),
  }));
}

// Task names edited via the pencil icon in the draft only override the
// entry's displayed name for this report — the underlying DUMMY_ENTRIES
// "original" task is never touched. Keyed the same way as excludedPhotos
// and applied at the same point (before notes are spliced in and shift
// entry positions).
function applyTitleOverrides(groups, titleOverrides) {
  if (!titleOverrides || Object.keys(titleOverrides).length === 0) return groups;
  return groups.map(g => ({
    ...g,
    entries: g.entries.map((e, i) => {
      const entryKey = `${g.key}_${i}`;
      const override = titleOverrides[entryKey];
      return override && override.trim() ? { ...e, note: override.trim() } : e;
    }),
  }));
}

// A manually-added note is tied to the specific entry (photo list) it was
// added under, not to a date — so it's kept out of buildReportData entirely
// and spliced into the finalized groups only when producing real output
// (download / copy-link / save), right after that exact entry.
function applyExtraNotesToGroups(groups, extraNotes) {
  const entries = Object.entries(extraNotes || {}).filter(([, text]) => text && text.trim());
  if (entries.length === 0) return groups;

  const cloned = groups.map(g => ({ ...g, entries: [...g.entries] }));
  const byGroup = {};
  entries.forEach(([key, text]) => {
    if (key === "empty") return;
    const cut = key.lastIndexOf("_");
    const groupKey = key.slice(0, cut);
    const entryIdx = Number(key.slice(cut + 1));
    (byGroup[groupKey] ||= []).push({ entryIdx, text });
  });
  Object.entries(byGroup).forEach(([groupKey, inserts]) => {
    const g = cloned.find(gr => gr.key === groupKey);
    if (!g) return;
    // Insert highest index first so earlier splices don't shift the
    // position of entries still waiting to be inserted.
    inserts.sort((a, b) => b.entryIdx - a.entryIdx).forEach(({ entryIdx, text }) => {
      g.entries.splice(entryIdx + 1, 0, { note: text, photos: [], isNote: true });
    });
  });

  const emptyNote = extraNotes.empty;
  if (emptyNote && emptyNote.trim() && cloned.length === 0) {
    cloned.push({ key: "notes", entries: [{ note: emptyNote, photos: [], isNote: true }] });
  }
  return cloned;
}


// ── Image assets (base64) ──
const IMG_MAP_LOGO = logoImg;
const IMG_MAP = {
  img1: img1Src,
  img2: img2Src,
  img3: img3Src,
  img4: img4Src,
  img5: img5Src,
  img6: img6Src,
  img7: img7Src,
  img8: img8Src,
  img9: img9Src,
};

// Resolves an asset path (a Vite-imported URL) against the current page so
// a downloaded, standalone HTML file still loads its images correctly no
// matter where it's opened from.
const toAbsoluteUrl = (src) => {
  try { return new URL(src, window.location.href).href; } catch (e) { return src; }
};

// Same transform the download filename already applies (see handleDownload)
// — spaces to underscores, the en dash to a plain hyphen — so a copied
// share link reads as cleanly as "Sep_4_-_Sep_10" instead of URL-encoding
// the en dash out to "%E2%80%93" and spaces to "+". Reversible: period
// strings are always system-generated (date ranges, "This week",
// "September 2026", ...), never free text, so round-tripping through
// desanitizePeriodFromUrl reconstructs the exact original — which matters
// since parsePeriodDates re-parses this same string to recover the
// original date range for "custom"/"since_last" shares.
const sanitizePeriodForUrl = (period) => period.replace(/\s+/g, "_").replace(/–/g, "-");
const desanitizePeriodFromUrl = (period) => period.replace(/_/g, " ").replace(/-/g, "–");

// ── HTML report generator ──
// Builds the same report content (header, meta, schedule status, task
// rollup, grouped notes + photos) as a standalone HTML string, shared by
// both the "Download" button and the copy-link shared view.
// Mirrors the live draft/preview's own visual design (renderFullHeader,
// renderEntryBlock, renderPageFooter) as static HTML, since the downloaded
// file and the "Copy link" content are meant to look like the same
// document, not a separate, simpler layout — the two intentional
// differences from the live view are: every photo shows (no "+N more" cap,
// since there's no interaction left to expand it) and nothing here is
// editable (no placeholder prompts for fields the user left blank; those
// rows are just omitted instead).
const buildReportHTML = (report) => {
  const { groups, grouping, completed, total, pct } =
    report.data || buildReportData("custom", report.period, null, report.includeNoPhotoTasks);

  const h = (tag, attrs, ...children) => {
    const attrStr = Object.entries(attrs || {}).map(([k, v]) => ` ${k}="${v}"`).join("");
    return `<${tag}${attrStr}>${children.join("")}</${tag}>`;
  };
  const selfClose = (tag, attrs) => {
    const attrStr = Object.entries(attrs || {}).map(([k, v]) => ` ${k}="${v}"`).join("");
    return `<${tag}${attrStr}/>`;
  };

  const STATUS_HEX = { completed: "#16a97d", in_progress: "#138eff", past_due: "#e5484d" };

  // Fixed 4-column grid, same sizing as the live PhotoGrid — every photo
  // shows here (no "+N more" cap; there's nothing left to expand into).
  const renderPhotos = (photos) => {
    const cells = (photos || []).map(k => {
      const src = IMG_MAP[k];
      return src
        ? selfClose("img", { src: toAbsoluteUrl(src), style: "width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:4px;display:block;" })
        : "";
    }).filter(Boolean);
    if (cells.length === 0) return "";
    return h("div", { style: "display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:12px;" }, ...cells);
  };

  const groupLabel = (g) => formatGroupLabel(g, grouping);

  // Manual notes are spliced into groups as {isNote:true} pseudo-entries
  // (see applyExtraNotesToGroups) right after the entry they're attached
  // to — same as the live view, styled the same italic, padded way.
  // A manual note is nested INSIDE its entry's own wrapper div (right
  // after the photos), same as the live view nests renderNoteSlot inside
  // renderEntryBlock — not appended as a separate sibling block. Sibling
  // divs' margins collapse to their MAX, not their sum, so a standalone
  // note block with its own marginTop:8 sitting next to the entry's
  // marginBottom:24 rendered as a 24px gap instead of 8px; nesting it
  // avoids that collapse entirely and gives each gap its exact value.
  const noteHTML = (note) =>
    h("div", { style: "margin-top:8px;" },
      h("p", { style: "font-size:12px;color:#303742;line-height:1.5;margin:0;" }, note.note)
    );

  const entryHTML = (e, attachedNoteHTML) => {
    const { kind, daysAgo } = statusForEntry(e);
    const statusMeta = STATUS_META[kind];
    const statusColor = STATUS_HEX[kind];
    const visiblePhotoCount = (e.photos || []).length;
    const dot = "<span style=\"display:inline-block;width:3px;height:3px;border-radius:50%;background:#bdbdbd;vertical-align:middle;margin:0 6px;\"></span>";
    // Matches the live view exactly: the per-entry date always shows
    // inline (the live meta line has no grouping-based condition on it),
    // and the section label above only appears for week/month grouping —
    // see entriesHTML below, which skips it for "day" the same way the
    // live view's flatBlocks pagination does.
    const dueHTML = `<span style="font-size:11px;font-weight:500;color:#828282;">${fmtDate(parseDate(e.date))}</span>` + dot;
    const metaLine =
      `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${statusColor};vertical-align:middle;margin-right:6px;"></span>` +
      `<span style="font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${statusColor};">${statusMeta.label}${kind === "past_due" && daysAgo > 0 ? ` ${daysAgo} days` : ""}</span>` +
      dot +
      dueHTML +
      `<span style="font-size:11px;font-weight:500;color:#828282;">${ownerForEntry(e.date)}</span>` +
      (!e.noPhotos && visiblePhotoCount > 0
        ? dot + `<span style="font-size:11px;font-weight:500;color:#828282;">${visiblePhotoCount} photo${visiblePhotoCount === 1 ? "" : "s"}</span>`
        : "");
    return h("div", { style: "margin-bottom:40px;" },
      h("p", { style: "font-size:18px;font-weight:600;color:#0a1629;line-height:1.35;margin:0;" }, e.note),
      h("div", { style: "margin-top:4px;" }, metaLine),
      e.noPhotos ? "" : renderPhotos(e.photos),
      attachedNoteHTML || ""
    );
  };

  // Flat list of page-able blocks — a label block per group (skipped for
  // day grouping, same reasoning as before) followed by one block per
  // real entry — mirrors the live view's own flatBlocks list, which is
  // what gets packed onto A4 pages below. A manual note is spliced into
  // g.entries right after the entry it's attached to (isNote:true
  // pseudo-entry) — it's consumed here into that entry's own block
  // instead of becoming its own block in the list.
  const blocks = groups.length === 0
    ? [h("p", { style: "font-size:13px;color:#828282;text-align:center;padding:32px 0;" }, "No activity entries for this period.")]
    : groups.flatMap(g => {
        const groupBlocks = [];
        if (grouping !== "day") {
          groupBlocks.push(h("p", { style: "font-size:11px;font-weight:600;color:#828282;letter-spacing:.06em;text-transform:uppercase;padding:8px 0;margin:0;" }, groupLabel(g).toUpperCase()));
        }
        g.entries.forEach((e, i) => {
          if (e.isNote) return;
          const next = g.entries[i + 1];
          groupBlocks.push(entryHTML(e, next && next.isNote ? noteHTML(next) : ""));
        });
        return groupBlocks;
      });

  const progressHTML = report.includeSummary
    ? h("div", { style: "display:flex;align-items:center;gap:16px;margin-bottom:40px;" },
        h("div", { style: "flex:1;min-width:0;" },
          h("p", { style: "font-size:13px;font-weight:600;color:#0a1629;margin:0 0 8px;" }, `${completed} of ${total} tasks complete`),
          h("div", { style: "height:6px;background:#e8e8e6;border-radius:99px;overflow:hidden;" },
            h("div", { style: `width:${pct}%;height:100%;background:#16a97d;border-radius:99px;` }, "")
          )
        ),
        h("span", { style: "font-size:28px;font-weight:700;font-style:italic;color:#0a1629;flex-shrink:0;line-height:1;" }, `${pct}%`)
      )
    : "";

  // Row/box/divider structure always renders (matching the live page's
  // fixed layout exactly, spacing included) — only the individual text
  // values are conditional, since an "Add target date"-style placeholder
  // prompt has no meaning in a static, non-editable export.
  const targetRowHTML =
    h("div", { style: "display:flex;flex-wrap:nowrap;gap:24px;margin-top:16px;align-items:center;margin-bottom:24px;" },
      h("div", { style: "display:flex;align-items:center;gap:8px;" },
        h("span", { style: "font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#828282;" }, "Target Opening"),
        report.targetOpening ? h("span", { style: "font-size:12px;font-weight:600;text-transform:uppercase;color:#0a1629;" }, report.targetOpening) : ""
      ),
      h("div", { style: "display:flex;align-items:center;gap:8px;" },
        h("span", { style: "font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#828282;" }, "Prepared For"),
        report.clientName ? h("span", { style: "font-size:12px;font-weight:600;text-transform:uppercase;color:#0a1629;" }, report.clientName) : ""
      )
    ) +
    h("div", { style: "height:1px;background:#e8e8e6;margin:0 0 24px;" }, "");

  const projectName = report.projectName || PROJECT_NAME;
  const address = report.address || PROJECT_ADDRESS;
  const summaryHTML = h("div", { style: "background:#f7f8fa;border-radius:8px;padding:16px;" },
    report.summary ? h("p", { style: "font-size:14px;color:#303742;line-height:1.6;margin:0;" }, report.summary) : ""
  );

  const logoHTML = report.logo
    ? selfClose("img", { src: report.logo, alt: "Company logo", style: "display:block;max-width:100px;height:auto;" })
    : "";
  const companyNameHTML = report.companyName
    ? h("p", { style: "font-size:14px;font-weight:700;color:#0a1629;margin:0 0 2px;" }, report.companyName)
    : "";
  const companyAddressHTML = report.companyAddress
    ? h("p", { style: "font-size:11px;font-weight:400;color:#828282;margin:0;" }, report.companyAddress)
    : "";
  const identityLeft = (logoHTML || companyNameHTML || companyAddressHTML)
    ? h("div", { style: "display:flex;align-items:center;gap:12px;" },
        logoHTML,
        h("div", {}, companyNameHTML, companyAddressHTML)
      )
    : h("div", {}, "");
  const identityRowHTML = h("div", { style: "display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;" },
    identityLeft,
    h("div", { style: "display:flex;align-items:flex-end;gap:6px;white-space:nowrap;margin-top:10px;" },
      h("span", { style: "font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#828282;line-height:1;" }, "PERIOD"),
      h("p", { style: "font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#303742;margin:0;line-height:1;" }, report.period.toUpperCase())
    )
  );

  // Full (page 1) vs. running (page 2+) header — mirrors renderFullHeader/
  // renderRunningHeader/renderCompanyIdentityRow exactly, each self-padded
  // (padding:PAGE_PAD PAGE_PAD 0) rather than relying on a wrapping CSS
  // class, since with multiple pages there's no longer a single
  // "card__header" — every page needs its own header/footer sitting
  // directly in that page's own card.
  const fullHeaderHTML = h("div", { style: `padding:${PAGE_PAD}px ${PAGE_PAD}px 0;` },
    identityRowHTML +
    h("div", { style: "height:1px;background:#e8e8e6;margin-bottom:20px;" }, "") +
    h("div", { style: "display:flex;flex-direction:column;gap:8px;margin-bottom:24px;" },
      h("h2", { style: "font-size:28px;font-weight:700;color:#0a1629;line-height:1;margin:0;" }, projectName),
      h("p", { style: "font-size:13px;font-weight:400;color:#828282;line-height:1;margin:0;" }, address)
    ) +
    summaryHTML +
    targetRowHTML +
    progressHTML
  );
  const runningHeaderHTML = h("div", { style: `padding:${PAGE_PAD}px ${PAGE_PAD}px 0;` },
    identityRowHTML +
    h("div", { style: "height:1px;background:#e8e8e6;margin-bottom:24px;" }, "")
  );

  const contactRoleLine = POINT_OF_CONTACT_ROLE + (report.companyName ? ` · ${report.companyName}` : "");
  const footerHTML = h("div", { style: "padding:20px 40px;border-top:1px solid #e8e8e6;" },
    h("div", { style: "display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;" },
      h("div", { style: "display:flex;align-items:center;gap:10px;" },
        h("div", { style: "width:36px;height:36px;border-radius:50%;background:#a85796;display:flex;align-items:center;justify-content:center;flex-shrink:0;" },
          h("span", { style: "font-size:13px;font-weight:700;color:white;" }, initialsOf(POINT_OF_CONTACT_NAME))
        ),
        h("div", {},
          h("p", { style: "font-size:11px;font-weight:600;color:#0a1629;line-height:1;margin:0 0 6px;" }, POINT_OF_CONTACT_NAME),
          h("p", { style: "font-size:11px;font-weight:400;color:#828282;line-height:1;margin:0;" }, contactRoleLine)
        )
      ),
      h("div", { style: "text-align:right;" },
        h("p", { style: "font-size:11px;color:#828282;line-height:1;margin:0 0 6px;" }, "Generated via TaskTag"),
        h("p", { style: "font-size:11px;color:#828282;line-height:1;margin:0;" }, `Report ID: ${REPORT_ID}`)
      )
    )
  );

  // ── Pagination — split into real A4 pages, same as the live draft ──
  // Real DOM measurement (offsetHeight), same technique as the live
  // view's hidden measuring scaffold: buildReportHTML only ever runs
  // client-side (the download/copy handlers, and the shared-link
  // recipient's own browser rendering ReportPage), so `document` is
  // always available here, and a real reflow is as accurate as it is
  // live instead of guessing block heights analytically. Photo tiles use
  // aspect-ratio (not a loaded image's natural size) for their height, so
  // this measures correctly even before any <img> has finished loading.
  //
  // Header/runningHeader/footer/blocks are all measured as one continuous
  // chain of sibling elements (not each isolated in its own container) —
  // matching the live scaffold's structure exactly, since isolating each
  // piece changes how its own leading/trailing CSS margins collapse
  // (or don't) against neighbors, which shifted page breaks away from
  // what the live draft produces for the same report.
  const measureRoot = document.createElement("div");
  measureRoot.style.cssText = "position:absolute;visibility:hidden;height:0;overflow:hidden;pointer-events:none;left:-99999px;top:0;";
  document.body.appendChild(measureRoot);
  const scaffold = document.createElement("div");
  scaffold.style.cssText = `width:${PAGE_W}px;`;
  measureRoot.appendChild(scaffold);

  const appendMeasureEl = (htmlStr, width) => {
    const el = document.createElement("div");
    if (width) el.style.cssText = `width:${width}px;`;
    el.innerHTML = htmlStr;
    scaffold.appendChild(el);
    return el;
  };
  const headerEl = appendMeasureEl(fullHeaderHTML);
  const runningHeaderEl = appendMeasureEl(runningHeaderHTML);
  const footerEl = appendMeasureEl(footerHTML);
  const blockEls = blocks.map(b => appendMeasureEl(b, PAGE_W - PAGE_PAD * 2));

  const headerH = headerEl.offsetHeight;
  const runningHeaderH = runningHeaderEl.offsetHeight;
  const footerH = footerEl.offsetHeight;
  const blockHeights = blockEls.map(el => el.offsetHeight);
  document.body.removeChild(measureRoot);

  const pages = [];
  let current = [];
  let used = 0;
  let isFirstPage = true;
  blocks.forEach((block, i) => {
    const blockH = blockHeights[i];
    const available = PAGE_H - PAGE_PAD * 2 - (isFirstPage ? headerH : runningHeaderH) - footerH;
    if (current.length > 0 && used + blockH > available) {
      pages.push(current);
      current = [];
      used = 0;
      isFirstPage = false;
    }
    current.push(block);
    used += blockH;
  });
  if (current.length > 0 || pages.length === 0) pages.push(current);

  // width/min-height match PAGE_W/PAGE_H exactly (the live view's own A4
  // proportions — 800 × round(800×297/210)) rather than a loose max-width,
  // and the shadow matches the live page card's own
  // "0 1px 3px rgba(10,22,41,0.08)".
  // display:flex + flex-direction:column on .card, with flex:1 on the
  // content area, is what actually pins the footer to the bottom of the
  // page — matching the live view's own page card (which uses the same
  // flex column + flex:1 content div). Without it, a page whose content
  // doesn't fill the full min-height just leaves the footer sitting right
  // after the last block, with the page's remaining empty space stranded
  // below the footer instead of above it.
  const css = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#f7f8fa;min-height:100vh;padding:32px 24px}.card{background:white;border:1px solid #e8e8e6;border-radius:12px;overflow:hidden;width:${PAGE_W}px;min-height:${PAGE_H}px;margin:0 auto;display:flex;flex-direction:column}.card+.card{margin-top:24px}.card__body{padding:0 ${PAGE_PAD}px;flex:1}`;

  const cardsHTML = pages.map((pageBlocks, pi) =>
    h("div", { class: "card", style: "box-shadow:0 1px 3px rgba(10,22,41,0.08);" },
      pi === 0 ? fullHeaderHTML : runningHeaderHTML,
      h("div", { class: "card__body" }, pageBlocks.join("")),
      footerHTML
    )
  ).join("");

  const title = "Project Report";
  return "<!DOCTYPE html>" +
    h("html", {},
      h("head", {},
        selfClose("meta", { charset: "UTF-8" }),
        h("title", {}, `${title} – ${report.period}`),
        h("style", {}, css)
      ),
      h("body", {}, cardsHTML)
    );
};

// ── Reports Tab ──
function ReportsTab({ demoCase }) {
  const [includeSummary,      setIncludeSummary]      = useState(true); // "Task summary" chip — progress bar section
  const [includeNoPhotoTasks, setIncludeNoPhotoTasks] = useState(false); // "Task complete without photos" chip
  const [dateRange,   setDateRange]   = useState("last_7");
  const [showCal,     setShowCal]     = useState(false);
  const [customRange, setCustomRange] = useState(null); // { start, end } date strings
  const prevDateRangeRef = useRef("last_7"); // dateRange to fall back to if custom is opened but no date is picked
  const [reports,     setReports]     = useState([]);
  // The company identity (logo/name/address) last saved with any report —
  // reused as the default for every new draft, and also substituted into
  // every previously-saved report's download/copy output, so a later
  // update to it retroactively applies everywhere instead of only going
  // forward from the report it was captured on.
  const [companyIdentity, setCompanyIdentity] = useState({ logo: null, companyName: "", companyAddress: "" });
  const [lastSavedId, setLastSavedId] = useState(null); // highlights the most recently saved row in the results table
  const [openPeriod,  setOpenPeriod]  = useState(false);
  const [toast,       setToast]       = useState(null); // { type: "success" | "error", message }
  const [deleteTarget, setDeleteTarget] = useState(null); // report pending delete confirmation
  const [lightbox, setLightbox] = useState(null); // { photos, index, caption } | null — full-screen photo viewer
  const [selectedPhotos, setSelectedPhotos] = useState({}); // { [entryKey_photoIndex]: photoKey } — in-progress checkbox selection, not yet deleted
  const periodRef     = useRef(null);
  const chipRef       = useRef(null);
  // Fixed positioning so this dropdown isn't clipped by an ancestor's
  // overflow/scrollbarGutter.
  const [openPeriodPos, setOpenPeriodPos] = useState({ top: 0, left: 0 });
  useLayoutEffect(() => {
    if (!openPeriod || !periodRef.current) return;
    const r = periodRef.current.getBoundingClientRect();
    setOpenPeriodPos({ top: r.bottom + 4, left: r.left });
  }, [openPeriod]);

  // ── Generate preview modal ──
  // { includeSummary, includeNoPhotoTasks, dateRange, period, customRange, extraNotes } | null
  // extraNotes: { [entryKey]: noteText } — one note per entry/photo-list at most
  const [preview,          setPreview]          = useState(null);
  const [titleOverrides,   setTitleOverrides]    = useState({}); // { [entryKey]: overriddenTitle } — per-entry task name edits, this report only
  const [previewLoading,   setPreviewLoading]    = useState(false);
  const [visibleCount,     setVisibleCount]      = useState(10); // infinite scroll — entries revealed so far
  const [loadingMore,      setLoadingMore]       = useState(false);
  const [generating,       setGenerating]        = useState(false); // Generate button's own disabled/spinner state, before the inline view appears
  const [saving,           setSaving]             = useState(false); // Save report button's own disabled/spinner state, before the toast appears
  const previewPanelRef = useRef(null);
  // Which EditableField/TargetOpeningField (by fieldId) is currently in
  // edit mode — only one at a time across the whole document. Handed down
  // via ActiveEditContext instead of threading it through every render
  // function's props.
  const [activeEditField, setActiveEditField] = useState(null);
  const activeEditCtxValue = useMemo(() => ({ activeField: activeEditField, setActiveField: setActiveEditField }), [activeEditField]);

  useEffect(() => {
    if (!openPeriod) return;
    const handler = (e) => { if (periodRef.current && !periodRef.current.contains(e.target)) setOpenPeriod(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openPeriod]);

  const handleChip = (id) => {
    setDateRange(id);
    setShowCal(id === "custom");
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  // A group with zero entries means there's genuinely nothing to export —
  // used to block Download/Copy link/Save report and surface an error toast
  // instead of producing an empty report.
  const hasGroupData = (groups) => groups.some(g => g.entries.length > 0);

  // Adds a report to the results list (called only once the user confirms
  // via "Save report" in the preview modal — Generate no longer does this
  // directly).
  const pushReport = ({ includeSummary, includeNoPhotoTasks, dateRange, period, data, extraNotes, excludedPhotos, titleOverrides, projectName, address, logo, companyName, companyAddress, summary, targetOpening, clientName }) => {
    const id = Date.now();
    const newReport = {
      id,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      period,
      dateRange,
      status: "in_progress",
      includeSummary,
      includeNoPhotoTasks,
      data,
      extraNotes,
      excludedPhotos,
      titleOverrides,
      projectName,
      address,
      logo,
      companyName,
      companyAddress,
      summary,
      targetOpening,
      clientName,
    };
    setReports(prev => [newReport, ...prev]);
    // Saving is what promotes this draft's identity to "the" company
    // identity — future drafts start from it, and every already-saved
    // report's download/copy switches to it too (see handleDownload/
    // handleCopy, which read companyIdentity instead of their own
    // frozen report.logo/companyName/companyAddress).
    setCompanyIdentity({ logo, companyName, companyAddress });
    setLastSavedId(id);
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "done" } : r));
    }, 3000);
    setTimeout(() => {
      setLastSavedId(current => (current === id ? null : current));
    }, 8000);
  };

  const handleDeleteReport = () => {
    if (!deleteTarget) return;
    const remaining = reports.filter(r => r.id !== deleteTarget.id);
    setReports(remaining);
    // "Since last report" only makes sense while a report still exists to
    // measure "since" from — fall back to the default period once the list
    // is empty, otherwise leave it pointing at the new most recent report.
    if (remaining.length === 0 && dateRange === "since_last") {
      setDateRange("last_7");
    }
    setDeleteTarget(null);
    showToast("success", "Report deleted");
  };

  const handleGenerate = () => {
    if (generating) return;
    setGenerating(true);
    setTimeout(() => {
      // Demo case: "Error states" always fails to generate, regardless of
      // whether the selected period actually has data.
      if (demoCase === "error") {
        setGenerating(false);
        showToast("error", "Generation failed. Try again.");
        return;
      }
      const period = getPeriodRange(dateRange);
      const data = buildReportData(dateRange, period, customRange, includeNoPhotoTasks);
      if (!hasGroupData(data.groups)) {
        setGenerating(false);
        showToast("error", "No data for this period");
        return; // don't open the modal on an empty period — just the toast
      }
      setPreview({
        includeSummary,
        includeNoPhotoTasks,
        dateRange,
        period,
        customRange,
        extraNotes: {},
        excludedPhotos: {},
        // System-generated starting point — freely editable from here, and
        // never regenerated for the life of this draft.
        projectName: PROJECT_NAME,
        address: PROJECT_ADDRESS,
        // Pre-filled from the last saved report's company identity (if
        // any) rather than always starting blank — see companyIdentity.
        logo: companyIdentity.logo,
        companyName: companyIdentity.companyName,
        companyAddress: companyIdentity.companyAddress,
        summary: "",
        targetOpening: "",
        clientName: "",
      });
      setActiveEditField(null);
      setTitleOverrides({});
      setVisibleCount(10);
      setLoadingMore(false);
      setGenerating(false);
      setSelectedPhotos({});
    }, 900);
  };

  // Discards the draft (or dismisses it after saving) and returns the tab
  // to its normal "Choose what this report includes" + results table view.
  const closePreview = () => {
    setPreview(null);
    setActiveEditField(null);
    setTitleOverrides({});
    setVisibleCount(10);
    setLoadingMore(false);
    setSelectedPhotos({});
  };

  useEffect(() => {
    if (!preview || lightbox || deleteTarget) return;
    const handler = (e) => { if (e.key === "Escape") closePreview(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [preview, lightbox, deleteTarget]);

  // This screen is a full-screen takeover with its own scroll container —
  // the page behind it has no reason to scroll (or show its own scrollbar)
  // while it's open.
  useEffect(() => {
    if (!preview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [preview]);

  // Show a loading skeleton whenever the previewed data would change —
  // both on first open and whenever the period is edited. Once it resolves,
  // proactively flag an empty period instead of waiting for the user to hit
  // Download/Copy link/Save report and get blocked.
  useEffect(() => {
    if (!preview) return;
    setPreviewLoading(true);
    setVisibleCount(10); // new period = new dataset, restart infinite scroll from the top
    setLoadingMore(false);
    setSelectedPhotos({}); // entry/photo indices no longer line up with a different dataset
    const t = setTimeout(() => {
      setPreviewLoading(false);
      const data = buildReportData(preview.dateRange, preview.period, preview.customRange, preview.includeNoPhotoTasks);
      const finalGroups = applyExtraNotesToGroups(applyPhotoExclusions(data.groups, preview.excludedPhotos), preview.extraNotes);
      if (!hasGroupData(finalGroups)) showToast("error", "No data for this period");
    }, 500);
    return () => clearTimeout(t);
  }, [preview?.period]);

  // Filters/sorts/groups the whole DUMMY_ENTRIES set — memoized so it only
  // reruns when one of these four inputs actually changes, instead of on
  // every render of this tab (every keystroke elsewhere, every scroll-
  // triggered state update, etc.).
  const previewData = useMemo(() => (
    preview
      ? buildReportData(preview.dateRange, preview.period, preview.customRange, preview.includeNoPhotoTasks)
      : null
  ), [preview?.dateRange, preview?.period, preview?.customRange, preview?.includeNoPhotoTasks]);
  // Final groups with excluded photos filtered out and manually-added
  // notes spliced in at their entry — what actually gets downloaded /
  // copy-linked / saved.
  const previewFinalGroups = previewData
    ? applyExtraNotesToGroups(applyTitleOverrides(applyPhotoExclusions(previewData.groups, preview.excludedPhotos), titleOverrides), preview.extraNotes)
    : [];
  // Photos actually included in this draft (post-cap) vs. the account's
  // per-report limit — shown in the modal chrome's Photo Limit indicator.
  const previewPhotoCount = previewData
    ? previewData.groups.reduce((s, g) => s + g.entries.reduce((es, e) => es + e.photos.length, 0), 0)
    : 0;

  // Infinite scroll over the *displayed* groups (not previewFinalGroups —
  // manual notes are only spliced in for real output, not the live modal).
  const totalEntryCount = previewData ? previewData.groups.reduce((s, g) => s + g.entries.length, 0) : 0;
  const hasMoreEntries = totalEntryCount > visibleCount;
  let entryBudget = visibleCount;
  const visibleGroups = previewData
    ? previewData.groups
        .map(g => {
          if (entryBudget <= 0) return null;
          const take = Math.min(g.entries.length, entryBudget);
          entryBudget -= take;
          return take === g.entries.length ? g : { ...g, entries: g.entries.slice(0, take) };
        })
        .filter(Boolean)
    : [];

  // The next entry the infinite-scroll batch will reveal — used to size
  // its loading skeleton's photo count to the real thing instead of a
  // generic guess.
  const nextEntry = previewData ? previewData.groups.flatMap(g => g.entries)[visibleCount] : null;

  // ── Pagination ──
  // Flatten the visible groups into one ordered list of blocks (an
  // optional group-label block, then one block per entry) so they can be
  // measured and packed onto A4-sized pages, same as a real paginated
  // report would be laid out.
  const flatBlocks = [];
  if (previewData) {
    visibleGroups.forEach(g => {
      if (previewData.grouping !== "day") {
        flatBlocks.push({ type: "label", key: `label_${g.key}`, g });
      }
      g.entries.forEach((e, i) => {
        const entryKey = `${g.key}_${i}`;
        flatBlocks.push({ type: "entry", key: entryKey, entryKey, e });
      });
    });
  }

  // Rendered under every entry's photo list (and once for the empty-period
  // state) as a plain, always-editable input — no separate "Add a note"
  // trigger step. Notes commit into preview.extraNotes on every keystroke,
  // same as typing into any other input.
  //
  // Declared before renderEntryBlock/renderBlock (which call it) — those
  // get invoked synchronously from inside the hiddenMeasuringScaffold
  // useMemo further down, so if this were declared after that useMemo
  // statement, calling it here would hit its temporal-dead-zone and throw
  // "Cannot access 'renderNoteSlot' before initialization" the moment a
  // report is actually generated.
  const renderNoteSlot = (key) => {
    return (
      <div style={{ marginTop: 10 }}>
        <EditableField
          fieldId={`note_${key}`}
          value={preview.extraNotes[key] || ""}
          placeholder="Describe the note for this task"
          alwaysEditing
          onSave={v => {
            setPreview(p => {
              const next = { ...p.extraNotes };
              if (v) next[key] = v; else delete next[key];
              return { ...p, extraNotes: next };
            });
          }}
          inputStyle={{ fontSize: 12, height: 40 }}
        />
      </div>
    );
  };

  const renderGroupLabelBlock = (g) => (
    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--tt-grey05)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 0", margin: 0 }}>
      {formatGroupLabel(g, previewData.grouping).toUpperCase()}
    </p>
  );

  const renderEntryBlock = ({ entryKey, e }) => {
    const displayTitle = titleOverrides[entryKey] ?? e.note;
    // e.noPhotos is set once in buildReportData, before applyPhotoCap can
    // zero out an otherwise-photographed entry's photos — an entry merely
    // capped down to 0 photos must never be shown as photo-less here.
    const isPhotoless = e.noPhotos;
    const { kind, daysAgo } = statusForEntry(e);
    const statusMeta = STATUS_META[kind];
    const visiblePhotoCount = (e.photos || []).filter(
      (_, i) => !(preview.excludedPhotos && preview.excludedPhotos[`${entryKey}_${i}`])
    ).length;
    return (
      <div style={{ marginBottom: 40 }}>
        {/* Renaming here only overrides the title for this report — the
            original task/entry text is never modified. No pencil icon —
            hover shows the grey02 affordance, click edits. */}
        <EditableField
          fieldId={`title_${entryKey}`}
          value={displayTitle}
          onSave={v => {
            setTitleOverrides(prev => {
              if (v && v.trim()) return { ...prev, [entryKey]: v.trim() };
              const next = { ...prev }; delete next[entryKey]; return next;
            });
          }}
          textStyle={{ fontSize: 18, fontWeight: 600, color: "var(--tt-text-1)", lineHeight: "1.35", margin: 0 }}
          inputStyle={{ fontSize: 18, fontWeight: 600 }}
        />
        {/* Status/date/owner meta line — completed (green), in progress
            (blue), or past due (red, with how many days). */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusMeta.color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: statusMeta.color }}>
            {statusMeta.label}{kind === "past_due" && daysAgo > 0 ? ` ${daysAgo} days` : ""}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tt-grey04)", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--tt-grey05)" }}>
            {fmtDate(parseDate(e.date))}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tt-grey04)", flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "var(--tt-grey05)" }}>
            {ownerForEntry(e.date)}
          </span>
          {!isPhotoless && visiblePhotoCount > 0 && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tt-grey04)", flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--tt-grey05)" }}>
                {visiblePhotoCount} photo{visiblePhotoCount === 1 ? "" : "s"}
              </span>
            </>
          )}
        </div>
        {renderNoteSlot(entryKey)}
        {!isPhotoless && (
          <PhotoGrid
            photos={e.photos}
            onOpen={(photos, idx, originalIndices) => setLightbox({ photos, index: idx, entryDate: e.date, taskName: displayTitle, entryKey, originalIndices })}
            excludedPhotos={preview.excludedPhotos}
            entryKey={entryKey}
            selectedPhotos={selectedPhotos}
            onToggleSelect={(idx, photoKey) => togglePhotoSelected(entryKey, idx, photoKey)}
          />
        )}
      </div>
    );
  };

  const renderBlock = (block) => block.type === "label" ? renderGroupLabelBlock(block.g) : renderEntryBlock(block);

  // identity, summary + progress, and Target Opening/Prepared For.
  //
  // The logo/company identity row is the only thing that repeats on every
  // page (see renderRunningHeader) — factored out so both variants render
  // it identically.
  // `editable` is false for every repeat of this row on pages 2+ (and in the
  // hidden measuring scaffold's running-header copy) — company name/address
  // share a single fieldId, so if every repeat stayed interactive, clicking
  // to edit on one page would flip every other page's copy into edit mode
  // too (they all watch the same ActiveEditContext.activeField). Only the
  // page-1 (full header) copy is ever actually editable; the rest just
  // mirror its committed value as plain, non-interactive text/image.
  const renderCompanyIdentityRow = (editable = true) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <LogoUploadBox
          src={preview.logo}
          onChange={url => setPreview(p => ({ ...p, logo: url }))}
          disabled={!editable}
        />
        <div>
          {/* TODO(BE): replace with the firm's actual name from the API */}
          <EditableField
            fieldId="companyName"
            value={preview.companyName}
            placeholder="Add company name"
            placeholderStyle={{ color: "var(--tt-text-1)" }}
            disabled={!editable}
            onSave={v => setPreview(p => ({ ...p, companyName: v }))}
            textStyle={{ fontSize: 14, fontWeight: 700, color: "var(--tt-text-1)", margin: "0 0 2px" }}
            inputStyle={{ fontSize: 14, fontWeight: 700 }}
          />
          <EditableField
            fieldId="companyAddress"
            value={preview.companyAddress}
            placeholder="Add company address"
            disabled={!editable}
            onSave={v => setPreview(p => ({ ...p, companyAddress: v }))}
            textStyle={{ fontSize: 11, fontWeight: 400, color: "var(--tt-grey05)", margin: 0 }}
            inputStyle={{ fontSize: 11, fontWeight: 400 }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, whiteSpace: "nowrap", marginTop: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-grey05)", lineHeight: 1 }}>
          PERIOD
        </span>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-text-2)", margin: 0, lineHeight: 1 }}>
          {preview.period.toUpperCase()}
        </p>
      </div>
    </div>
  );

  const renderFullHeader = () => (
    <div style={{ padding: `${PAGE_PAD}px ${PAGE_PAD}px 0` }}>
      {renderCompanyIdentityRow()}
      <div style={{ height: 1, background: "var(--tt-grey03)", marginBottom: 20 }} />

      {/* Row 1: period (not editable — mirrors the chrome's own period
          control above; muted secondary text, not brand-colored). Row 2:
          project name — editable the same way as a task name, and sized
          like the old summary headline now that it's the document's real
          title. Row 3: address, in normal (not all-caps) text, also
          editable. Neither is required — an empty field just shows its
          placeholder. Summary and its progress bar sit directly below,
          with Target Opening/Prepared For after. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        <EditableField
          fieldId="projectName"
          value={preview.projectName}
          placeholder={PROJECT_NAME}
          onSave={v => setPreview(p => ({ ...p, projectName: v }))}
          textStyle={{ fontSize: 28, fontWeight: 700, color: "var(--tt-text-1)", lineHeight: 1, margin: 0 }}
          inputStyle={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: "var(--tt-text-1)" }}
        />
        <EditableField
          fieldId="address"
          value={preview.address}
          placeholder={PROJECT_ADDRESS}
          onSave={v => setPreview(p => ({ ...p, address: v }))}
          textStyle={{ fontSize: 13, fontWeight: 400, color: "var(--tt-grey05)", lineHeight: 1, margin: 0 }}
          inputStyle={{ fontSize: 13, fontWeight: 400, lineHeight: 1, color: "var(--tt-grey05)" }}
        />
      </div>

      {/* Summary — set apart in its own grey02 box like a project
          description. Always a plain textarea (`alwaysEditing`), not a
          click-to-edit field: the box owns its own grey02 chrome (via
          `boxed`) so the textarea fills that same card directly instead of
          nesting a separate bordered box inside it. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-grey05)", margin: 0 }}>Summary</p>
        <span style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)" }}>Optional</span>
      </div>
      <EditableField
        fieldId="summary"
        value={preview.summary}
        placeholder="Add a high-level overview of the progress made during this period..."
        alwaysEditing
        multiline
        boxed
        onSave={v => setPreview(p => ({ ...p, summary: v }))}
        textStyle={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: 0 }}
        inputStyle={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6 }}
      />

      <div style={{ display: "flex", flexWrap: "nowrap", gap: 24, marginTop: 16, alignItems: "center", marginBottom: 24 }}>
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-grey05)", margin: 0, flexShrink: 0 }}>Target Opening</p>
          <TargetOpeningField
            fieldId="targetOpening"
            value={preview.targetOpening}
            onApply={formatted => setPreview(p => ({ ...p, targetOpening: formatted }))}
          />
        </div>
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-grey05)", margin: 0, flexShrink: 0 }}>Prepared For</p>
          <EditableField
            fieldId="clientName"
            value={preview.clientName}
            placeholder="Add client name"
            placeholderStyle={{ color: "var(--tt-text-1)" }}
            onSave={v => setPreview(p => ({ ...p, clientName: v }))}
            textStyle={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: preview.clientName ? "var(--tt-text-1)" : "var(--tt-grey05)", margin: 0 }}
            inputStyle={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", width: 170 }}
          />
        </div>
      </div>

      <div style={{ height: 1, background: "var(--tt-grey03)", margin: "0 0 24px" }} />

      {/* Progress — entries logged this period vs. total on record, gated
          by the same "Task summary" checkbox the HTML export uses. */}
      {preview.includeSummary && previewData && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", margin: "0 0 8px" }}>
              {previewData.completed} of {previewData.total} tasks complete
            </p>
            <div style={{ height: 6, background: "var(--tt-grey03)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${previewData.pct}%`, height: "100%", background: "var(--tt-secondary)", borderRadius: 99 }} />
            </div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, fontStyle: "italic", color: "var(--tt-text-1)", flexShrink: 0, lineHeight: 1 }}>
            {previewData.pct}%
          </span>
        </div>
      )}
    </div>
  );

  // Running header — pages 2+: only the logo/company identity row
  // repeats. Everything else on the full header (period, project
  // name/address, summary, progress, Target Opening/Prepared For) is
  // page-1-only content, not repeated.
  const renderRunningHeader = () => (
    <div style={{ padding: `${PAGE_PAD}px ${PAGE_PAD}px 0` }}>
      {renderCompanyIdentityRow(false)}
      <div style={{ height: 1, background: "var(--tt-grey03)", marginBottom: 24 }} />
    </div>
  );

  // Footer — the same Point of Contact card (avatar, name, role/company
  // on the left; generation metadata on the right) repeats on every page.
  const renderPageFooter = () => (
    <div style={{ padding: `20px ${PAGE_PAD}px`, borderTop: "1px solid var(--tt-grey03)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--tt-pastel-magenta)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{initialsOf(POINT_OF_CONTACT_NAME)}</span>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--tt-text-1)", lineHeight: 1, margin: "0 0 6px" }}>{POINT_OF_CONTACT_NAME}</p>
            {/* TODO(BE): replace with the contact's actual role/company from the API */}
            <p style={{ fontSize: 11, fontWeight: 400, color: "var(--tt-grey05)", lineHeight: 1, margin: 0 }}>
              {POINT_OF_CONTACT_ROLE}{preview.companyName ? ` · ${preview.companyName}` : ""}
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 11, color: "var(--tt-grey05)", lineHeight: 1, margin: "0 0 6px" }}>Generated via TaskTag</p>
          {/* TODO(BE): replace with the actual report ID from the API */}
          <p style={{ fontSize: 11, color: "var(--tt-grey05)", lineHeight: 1, margin: 0 }}>Report ID: {REPORT_ID}</p>
        </div>
      </div>
    </div>
  );

  // Measure the header/footer and every block once (off-screen, at the
  // real page content width) and greedily pack them onto A4 pages — the
  // same technique a real paginated document layout engine uses, just
  // done in JS against actual rendered heights instead of a print
  // engine's own reflow. Page 1 gets the full header; every later page
  // gets the lighter running header, so only page 1 reserves headerH —
  // the rest reserve runningHeaderH.
  const headerMeasureRef = useRef(null);
  const runningHeaderMeasureRef = useRef(null);
  const footerMeasureRef = useRef(null);
  const blockMeasureRefs = useRef({});
  const [pageLayout, setPageLayout] = useState(null); // { pages: [[block,...],...] } | null while (re)measuring

  // Recomputing pagination forces a synchronous layout read (offsetHeight)
  // per block — cheap once, but expensive if it reran on every render (it
  // used to, with no dependency array at all, which is what made scrolling
  // feel sluggish: any unrelated state update anywhere in this component
  // re-triggered a full remeasure). This key changes only when something
  // that actually affects rendered heights changes, so the effect below
  // skips everything else. preview.logo is a data URL and can be large, so
  // it's swapped for its length instead of being fully re-stringified.
  const layoutDepsKey = preview
    ? JSON.stringify({ ...preview, logo: preview.logo ? preview.logo.length : 0 })
      + "|" + JSON.stringify(titleOverrides)
      + "|" + JSON.stringify(selectedPhotos)
      + "|" + flatBlocks.map(b => b.key).join(",")
    : "";

  useLayoutEffect(() => {
    if (!preview || !previewData) {
      if (pageLayout !== null) setPageLayout(null);
      return;
    }
    const headerH = headerMeasureRef.current?.offsetHeight || 0;
    const runningHeaderH = runningHeaderMeasureRef.current?.offsetHeight || 0;
    const footerH = footerMeasureRef.current?.offsetHeight || 0;

    const pages = [];
    let current = [];
    let used = 0;
    let isFirstPage = true;
    flatBlocks.forEach(block => {
      const h = blockMeasureRefs.current[block.key]?.offsetHeight || 0;
      const available = PAGE_H - PAGE_PAD * 2 - (isFirstPage ? headerH : runningHeaderH) - footerH;
      if (current.length > 0 && used + h > available) {
        pages.push(current);
        current = [];
        used = 0;
        isFirstPage = false;
      }
      current.push(block);
      used += h;
    });
    if (current.length > 0 || pages.length === 0) pages.push(current);

    const nextKey = pages.map(p => p.map(b => b.key).join(",")).join("|");
    setPageLayout(prev => {
      const prevKey = prev?.pages?.map(p => p.map(b => b.key).join(",")).join("|");
      return prevKey === nextKey ? prev : { pages };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutDepsKey]);

  // The hidden scaffold and the visible pages both call renderFullHeader/
  // renderBlock/etc. for potentially dozens of entries and their photos —
  // memoized on the same signature as the layout effect above, so an
  // unrelated re-render of this tab reuses the same React elements instead
  // of rebuilding (and having React reconcile) this whole subtree again.
  const hiddenMeasuringScaffold = useMemo(() => {
    // renderFullHeader/etc. read straight from `preview` with no
    // null-check (they're only ever meant to be called while the preview
    // modal is open) — this hook still runs on every render regardless,
    // including before "Generate" is ever clicked, so it must bail out
    // itself instead of assuming the caller already gated it.
    if (!preview) return null;
    return (
      <div aria-hidden="true" style={{ visibility: "hidden", height: 0, overflow: "hidden" }}>
        {/* Pinned to a static, always-null activeField — this scaffold
            exists purely to measure static rendered heights, but it
            renders the SAME EditableField/TargetOpeningField instances
            (with the same fieldId strings) as the visible page, which by
            default read the real, shared ActiveEditContext. Without this
            override, opening the visible Target Opening calendar also
            "opens" this hidden copy's own invisible DateRangeCalendar,
            which registers its own document-level outside-click listener.
            That listener has no idea the real calendar's DOM exists, so it
            treats every click on the real (visible) calendar as an outside
            click and force-closes the whole field — the date looked like
            it was never being saved, when actually the selection was being
            cancelled out from under it a moment after being applied. */}
        <ActiveEditContext.Provider value={INERT_ACTIVE_EDIT}>
          <div style={{ width: PAGE_W }}>
            <div ref={headerMeasureRef}>{renderFullHeader()}</div>
            <div ref={runningHeaderMeasureRef}>{renderRunningHeader()}</div>
            <div ref={footerMeasureRef}>{renderPageFooter()}</div>
            {flatBlocks.map(block => (
              <div key={block.key} ref={el => { blockMeasureRefs.current[block.key] = el; }} style={{ width: PAGE_W - PAGE_PAD * 2 }}>
                {renderBlock(block)}
              </div>
            ))}
          </div>
        </ActiveEditContext.Provider>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutDepsKey]);

  const visiblePages = useMemo(() => {
    // pageLayout is cleared by a useLayoutEffect that only runs AFTER this
    // render commits — so on the very render where `preview` first becomes
    // null (e.g. pressing Escape to close), this memo can still see the
    // OLD, non-null pageLayout from before, and would go on to call
    // renderFullHeader/renderRunningHeader (which read preview.* directly)
    // with preview already null. Guard on both.
    if (!pageLayout || !preview) return null;
    return pageLayout.pages.map((pageBlocks, pi) => {
      const isFirst = pi === 0;
      return (
        <div
          key={pi}
          style={{
            width: PAGE_W, minHeight: PAGE_H, margin: isFirst ? 0 : "24px 0 0",
            boxSizing: "border-box",
            background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 12,
            boxShadow: "0 1px 3px rgba(10,22,41,0.08)",
            display: "flex", flexDirection: "column",
            // Page 1 stays fully rendered (no content-visibility) — it
            // holds the only interactive header fields (Target Opening
            // etc.), and content-visibility:auto has been known to leave
            // stale paints on a descendant after a state-only update in
            // some Chrome versions, which made date selection look like it
            // silently did nothing even though the DOM had updated.
            ...(isFirst ? {} : {
              contentVisibility: "auto",
              containIntrinsicSize: `${PAGE_W}px ${PAGE_H}px`,
            }),
          }}
        >
          {isFirst ? renderFullHeader() : renderRunningHeader()}
          <div style={{ padding: `0 ${PAGE_PAD}px`, flex: 1 }}>
            {isFirst && previewData.groups.length === 0 && renderNoteSlot("empty")}
            {pageBlocks.map(block => <div key={block.key}>{renderBlock(block)}</div>)}
          </div>
          {renderPageFooter()}
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLayout, layoutDepsKey]);

  const handleModalScroll = (e) => {
    if (previewLoading || loadingMore || !hasMoreEntries) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 150) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(v => v + 10);
        setLoadingMore(false);
      }, 600);
    }
  };

  // Checking a photo just marks it selected (green check) — it still shows
  // in the grid until the selection toolbar's Delete is clicked, at which
  // point selected keys move into preview.excludedPhotos (permanently
  // filtered everywhere, including from the live grid).
  const togglePhotoSelected = (entryKey, photoIndex, photoKey) => {
    setSelectedPhotos(prev => {
      const key = `${entryKey}_${photoIndex}`;
      const next = { ...prev };
      if (next[key]) delete next[key]; else next[key] = photoKey;
      return next;
    });
  };

  const clearPhotoSelection = () => setSelectedPhotos({});

  const handleDeleteSelectedPhotos = () => {
    setPreview(p => ({ ...p, excludedPhotos: { ...p.excludedPhotos, ...Object.fromEntries(Object.keys(selectedPhotos).map(k => [k, true])) } }));
    setSelectedPhotos({});
  };

  // Saving pushes the report into the results table and returns straight
  // to the normal view — Download/Copy link for it are already available
  // per-row in that table, so there's no separate post-save state here.
  const handlePreviewSave = () => {
    if (saving) return;
    // Notes already live in preview.extraNotes — every EditableField note
    // commits there the moment its check icon is clicked, so there's no
    // draft state left to fold in here.
    const finalGroups = applyExtraNotesToGroups(applyTitleOverrides(applyPhotoExclusions(previewData.groups, preview.excludedPhotos), titleOverrides), preview.extraNotes);
    if (!hasGroupData(finalGroups)) { showToast("error", "No data to save"); return; }
    setSaving(true);
    setTimeout(() => {
      // Demo case: "Save report error" always fails to save, regardless of
      // whether there's valid data to save.
      if (demoCase === "save_error") {
        setSaving(false);
        showToast("error", "Save failed. Try again.");
        return;
      }
      pushReport({ includeSummary: preview.includeSummary, includeNoPhotoTasks: preview.includeNoPhotoTasks, dateRange: preview.dateRange, period: preview.period, data: { ...previewData, groups: finalGroups }, extraNotes: preview.extraNotes, excludedPhotos: preview.excludedPhotos, titleOverrides, projectName: preview.projectName, address: preview.address, logo: preview.logo, companyName: preview.companyName, companyAddress: preview.companyAddress, summary: preview.summary, targetOpening: preview.targetOpening, clientName: preview.clientName });
      setDateRange("since_last");
      setSaving(false);
      closePreview();
      showToast("success", "Report saved");
    }, 900);
  };

  const [isWide, setIsWide] = useState(window.innerWidth > 1280);
  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth > 1280);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleDownload = (report) => {
    // Company identity always reflects the latest save, not this report's
    // own (possibly older) snapshot — see companyIdentity.
    const html = buildReportHTML({ ...report, logo: companyIdentity.logo, companyName: companyIdentity.companyName, companyAddress: companyIdentity.companyAddress });
    const fileName = "report_" + sanitizePeriodForUrl(report.period) + ".html";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

    const handleCopy = async (report) => {
    // Report content is fully reproducible from these params, so the link
    // needs no server/storage round-trip — it can never fail to resolve.
    // Manually-added notes aren't part of the base activity log, so they
    // have to ride along in the URL too — otherwise the shared link would
    // silently drop them while the downloaded HTML (built from the saved
    // snapshot) still shows them, and the two outputs would diverge.
    const params = new URLSearchParams({
      range: report.dateRange || "custom",
      period: sanitizePeriodForUrl(report.period),
    });
    if (report.includeSummary === false) params.set("summary", "0");
    if (report.includeNoPhotoTasks === false) params.set("nophotos", "0");
    if (report.extraNotes && Object.keys(report.extraNotes).some(k => report.extraNotes[k]?.trim())) {
      params.set("notes", JSON.stringify(report.extraNotes));
    }
    // Same reasoning as notes — excluded photos are only tracked client-side,
    // so they'd otherwise reappear in the shared link even after being
    // unchecked from the saved/downloaded report.
    const excludedKeys = Object.keys(report.excludedPhotos || {}).filter(k => report.excludedPhotos[k]);
    if (excludedKeys.length > 0) {
      params.set("excluded", JSON.stringify(excludedKeys));
    }
    // Same reasoning again — an edited task name only lives in this
    // report's draft state, not in DUMMY_ENTRIES, so it has to ride along
    // too or the shared link would silently revert to the original name.
    if (report.titleOverrides && Object.keys(report.titleOverrides).some(k => report.titleOverrides[k]?.trim())) {
      params.set("titles", JSON.stringify(report.titleOverrides));
    }
    // Header identity/summary fields — plain short strings, safe to carry
    // in the URL so the shared link renders the same document as the
    // downloaded HTML instead of a stripped-down one missing them.
    if (report.projectName) params.set("projectName", report.projectName);
    if (report.address) params.set("address", report.address);
    // Same reasoning as the download branch — the latest saved identity,
    // not this report's own snapshot. The logo is deliberately left out
    // here even though it IS a small downscaled data URL (see
    // resizeImageToDataURL) — it's still the single largest thing in this
    // URL by far, and turns an otherwise short, simple link into an
    // unreadable multi-thousand-character block. The download (which has
    // no such constraint) still includes it in full.
    if (companyIdentity.companyName) params.set("companyName", companyIdentity.companyName);
    if (companyIdentity.companyAddress) params.set("companyAddress", companyIdentity.companyAddress);
    // "summary" is already taken (the includeSummary toggle above) — the
    // summary text content gets its own key.
    if (report.summary) params.set("summaryText", report.summary);
    if (report.targetOpening) params.set("targetOpening", report.targetOpening);
    if (report.clientName) params.set("clientName", report.clientName);
    const url = `${window.location.href.split("?")[0]}?${params.toString()}`;
    try { await navigator.clipboard.writeText(url); }
    catch {
      const el = document.createElement("textarea");
      el.value = url; el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
  };

  // Dynamic period options — add "Since last report" if a report exists.
  // Continues from where the last report's *covered period* ended, not
  // from whenever it happened to be generated — otherwise back-to-back
  // reports would have a gap (or overlap) between them.
  const lastReport = reports[0];
  const sinceLastDate = lastReport
    ? lastReport.period.split(" – ").pop()
    : null;

  const PERIOD_OPTIONS = lastReport
    ? [{ id: "since_last", label: "Since last report" }, ...PERIOD_OPTIONS_BASE]
    : PERIOD_OPTIONS_BASE;

  // Renders "Label · date range" with the date portion de-emphasized
  // (grey05, regular weight) — used for both the trigger and list items.
  const renderPeriodLabel = (id, cr = customRange) => {
    if (id === "custom" && cr) {
      return <>Custom date <span style={{ color: "var(--tt-grey05)", fontWeight: 400 }}>· {cr.start} – {cr.end}</span></>;
    }
    if (id === "custom") return "Custom date";
    if (id === "since_last") {
      const todayStr = fmtDate(APP_TODAY);
      const rangeText = sinceLastDate === todayStr ? todayStr : `${sinceLastDate} – ${todayStr}`;
      return <>Since last report <span style={{ color: "var(--tt-grey05)", fontWeight: 400 }}>· {rangeText}</span></>;
    }
    const [label, date] = PERIOD_LABELS[id].split(" · ");
    return <>{label} <span style={{ color: "var(--tt-grey05)", fontWeight: 400 }}>· {date}</span></>;
  };

  const getPeriodRange = (id, cr = customRange) => {
    if (id === "since_last") return `${sinceLastDate} – ${fmtDate(APP_TODAY)}`;
    if (id === "custom" && cr) return `${cr.start} – ${cr.end}`;
    return PERIOD_RANGE[id];
  };

  return (
    <div className="pb-6">

      {!preview && (
      <>
      {/* ── Create report — compact card ── */}
      <div style={{ background: "var(--tt-grey02)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)" }}>Choose what this report includes.</p>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, width: "100%" }}>

          {/* Period — custom div dropdown */}
          <div style={{ flex: "1 1 auto", minWidth: 0, position: "relative" }} ref={periodRef}>
            <Label style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)", marginBottom: 6, display: "block" }}>Period</Label>
            <div
              onClick={() => setOpenPeriod(o => !o)}
              style={{
                width: "100%", height: 40, padding: "0 12px",
                background: "white", border: `1px solid ${openPeriod ? "var(--tt-text-1)" : "var(--tt-grey03)"}`,
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "var(--tt-text-1)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                userSelect: "none", transition: "border-color 0.15s",
              }}
            >
              <span>{renderPeriodLabel(dateRange)}</span>
              <ChevronDown size={14} strokeWidth={SW} color="var(--tt-grey05)"
                style={{ flexShrink: 0, transform: `rotate(${openPeriod ? "180deg" : "0deg"})`, transition: "transform 0.15s" }} />
            </div>
            {openPeriod && (
              <div style={{
                position: "fixed", top: openPeriodPos.top, left: openPeriodPos.left, zIndex: 200, minWidth: 220,
                background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, overflow: "hidden",
                boxShadow: "0 8px 24px rgba(10,22,41,0.16)",
              }}>
                {PERIOD_OPTIONS.map(({ id }, i) => (
                  <div key={id}>
                    <div
                      onClick={() => {
                        if (id === "custom") prevDateRangeRef.current = dateRange;
                        setDateRange(id);
                        setShowCal(id === "custom");
                        setOpenPeriod(false);
                      }}
                      style={{
                        padding: "10px 12px", cursor: "pointer",
                        background: dateRange === id ? "var(--tt-grey02)" : "white",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { if (dateRange !== id) e.currentTarget.style.background = "var(--tt-grey02)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = dateRange === id ? "var(--tt-grey02)" : "white"; }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--tt-text-1)", whiteSpace: "nowrap" }}>
                        {renderPeriodLabel(id)}
                      </span>
                      {dateRange === id && <Check size={14} color="var(--tt-secondary)" strokeWidth={2} style={{ flexShrink: 0, marginLeft: 12 }} />}
                    </div>
                    {i < PERIOD_OPTIONS.length - 1 && (
                      <div style={{ height: 1, background: "var(--tt-grey03)", margin: "0 12px" }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task summary / no-photo-tasks checkboxes, grouped under one
              "Include" label — same label treatment as Period above. */}
          <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <Label style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)", marginBottom: 6, display: "block" }}>Include</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 20, height: 40 }}>
              <ReportCheckbox active={includeSummary} label="Task summary" onClick={() => setIncludeSummary(v => !v)} />
              <ReportCheckbox active={includeNoPhotoTasks} label="Task complete without photos" onClick={() => setIncludeNoPhotoTasks(v => !v)} />
            </div>
          </div>

          {/* Generate button */}
          <div style={{ flexShrink: 0 }}>
            <button
              disabled={generating}
              style={{
                height: 40, padding: "0 24px",
                minWidth: isWide ? 120 : "auto",
                background: "var(--tt-text-1)", color: "white",
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: generating ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                whiteSpace: "nowrap", transition: "opacity 0.15s",
                opacity: generating ? 0.7 : 1,
              }}
              onMouseEnter={e => !generating && (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => e.currentTarget.style.opacity = generating ? 0.7 : 1}
              onClick={() => { setShowCal(false); handleGenerate(); }}
            >
              {generating
                ? <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", display: "inline-block", animation: "tt-spin 0.75s linear infinite" }} />
                : "Generate"}
            </button>
          </div>
        </div>
      </div>{/* end card */}

      {/* Custom date calendar — fixed position centered on period trigger */}
      {showCal && (
        <DateRangeCalendar
          anchorRef={periodRef}
          onClose={() => {
            if (!customRange) setDateRange(prevDateRangeRef.current);
            setShowCal(false);
          }}
          onApply={(start, end) => {
            if (start && end) {
              const fmt = (s) => {
                const [y, m, d] = s.split("-");
                return new Date(y, m-1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              };
              setCustomRange({ start: fmt(start), end: fmt(end) });
            } else if (!customRange) {
              setDateRange(prevDateRangeRef.current);
            }
            setShowCal(false);
          }}
        />
      )}

      {/* ── Results ── */}
      {reports.length === 0 ? (
        <div style={{ marginTop: 24, border: "1px solid var(--tt-grey03)", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--tt-grey02)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <BarChart2 size={32} color="var(--tt-grey06)" strokeWidth={SW} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-text-1)", marginBottom: 4 }}>No reports yet</p>
          <p style={{ fontSize: 13, color: "var(--tt-grey05)", lineHeight: "20px", marginTop: 4 }}>
            Configure your report first and click Generate to create your report.
          </p>
        </div>
      ) : (
        <>
        <div style={{ marginTop: 24, border: "1px solid var(--tt-grey03)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ maxHeight: 556, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr style={{ background: "var(--tt-grey02)", borderBottom: `1px solid var(--tt-grey03)` }}>
                {["Generation date", "Period"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 500, color: "var(--tt-text-1)" }}>{h}</th>
                ))}
                <th style={{ padding: "10px 16px", width: 160 }} />
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={r.id} style={{ background: r.id === lastSavedId ? "var(--tt-mint)" : "white", borderTop: i > 0 ? `1px solid var(--tt-grey03)` : "none", transition: "background 0.6s ease" }}>
                  <td style={{ padding: "0 16px", fontSize: 13, color: "var(--tt-text-2)", whiteSpace: "nowrap", height: 52, verticalAlign: "middle" }}>{r.date}</td>
                  <td style={{ padding: "0 16px", fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", height: 52, verticalAlign: "middle" }}>{r.period}</td>
                  <td style={{ padding: "0 14px 0 16px", textAlign: "right", height: 52, verticalAlign: "middle", width: 160 }}>
                    {r.status === "in_progress" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--tt-text-2)" }}>
                        In progress
                        <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--tt-grey03)", borderTopColor: "var(--tt-grey05)", display: "inline-block", animation: "tt-spin 0.75s linear infinite" }} />
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <FixedTooltipBtn label="Download" onAction={() => { handleDownload(r); showToast("success", "Downloaded"); }}><Download size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                        <FixedTooltipBtn label="Copy link to share" onAction={async () => { await handleCopy(r); showToast("success", "Link copied"); }}><Link size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                        <FixedTooltipBtn label="Delete report" onAction={() => setDeleteTarget(r)}><Trash2 size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--tt-grey05)", marginTop: 8 }}>
          Saved reports are read-only. To make changes, generate a new report for the range you need.
        </p>
        </>
      )}
      </>
      )}

      {/* ── Generate preview — a full-screen takeover, same as the photo
          lightbox, not inline content within the tab. ── */}
      {preview && (
        <ActiveEditContext.Provider value={activeEditCtxValue}>
          <div
            ref={previewPanelRef}
            style={{
              position: "fixed", inset: 0, zIndex: 2000,
              background: "var(--tt-grey01)",
              display: "flex", flexDirection: "column",
            }}
          >

            {/* Modal chrome — Photo Limit usage on the left, Cancel + Save
                Report on the right. The period is locked in once Generate
                is clicked from the results page, so there's no back button
                or period control here — closing the draft is explicit via
                Cancel. Its content is capped to the same reading width as
                the document below, so the two line up instead of the bar
                stretching edge-to-edge across the full screen. */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px",
                borderBottom: "1px solid var(--tt-grey03)", flexShrink: 0, background: "white",
                overflowY: "auto", scrollbarGutter: "stable",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 800, width: "100%", margin: "0 auto" }}>
              {/* TODO(BE): replace with the account's actual per-report photo cap and usage from the API */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--tt-grey05)", whiteSpace: "nowrap" }}>Photo Limit</span>
                <div style={{ width: 120, height: 6, borderRadius: 99, background: "var(--tt-grey03)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, (previewPhotoCount / PHOTO_LIMIT) * 100)}%`, height: "100%", borderRadius: 99, background: "var(--tt-text-1)" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--tt-text-1)", whiteSpace: "nowrap" }}>{previewPhotoCount} / {PHOTO_LIMIT}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  disabled={previewLoading || saving}
                  onClick={closePreview}
                  onMouseEnter={e => !(previewLoading || saving) && (e.currentTarget.style.background = "var(--tt-grey02)")}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                  style={{
                    height: 40, padding: "0 20px", borderRadius: 8, border: "1px solid var(--tt-grey03)",
                    background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)",
                    cursor: (previewLoading || saving) ? "not-allowed" : "pointer",
                    opacity: (previewLoading || saving) ? 0.5 : 1, transition: "background 0.15s",
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={previewLoading || saving}
                  onClick={handlePreviewSave}
                  onMouseEnter={e => !(previewLoading || saving) && (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => e.currentTarget.style.opacity = (previewLoading || saving) ? 0.5 : 1}
                  style={{
                    height: 40, padding: "0 24px", minWidth: isWide ? 120 : "auto", borderRadius: 8, border: "none",
                    background: "var(--tt-text-1)", fontSize: 13, fontWeight: 500, color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                    cursor: (previewLoading || saving) ? "not-allowed" : "pointer",
                    opacity: (previewLoading || saving) ? 0.5 : 1, transition: "opacity 0.15s",
                  }}
                >
                  {saving
                    ? <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", display: "inline-block", animation: "tt-spin 0.75s linear infinite" }} />
                    : "Save Report"}
                </button>
              </div>
              </div>
            </div>

            {/* Body — flows with the page (no fixed height/own scrollbar).
                This is now a real full-screen overlay with its own scroll
                container, so infinite scroll is driven off this
                container's own scrollTop (handleModalScroll) instead of
                window scroll. The document itself is capped to a
                comfortable reading width and centered, rather than
                stretching edge-to-edge across the full screen. Horizontal
                padding lives on the outer wrapper (matching the chrome's
                own padding) rather than on the maxWidth:800 box itself, so
                the document's left/right edges line up exactly with the
                chrome's Photo Limit indicator and Cancel/Save buttons above. */}
            <div style={{ overflowY: "auto", scrollbarGutter: "stable", flex: 1 }} onScroll={handleModalScroll}>
              <div style={{ padding: "24px 20px" }}>
              <div style={{ maxWidth: 800, margin: "0 auto" }}>
                {previewLoading ? (
                  // Mirrors the real A4 page below it — same width/padding/
                  // footer structure — so the loading state doesn't jump to
                  // a different layout once the real draft appears. Entry
                  // rows still mirror the real data (group/photo counts),
                  // same as before.
                  <div style={{ width: PAGE_W, minHeight: PAGE_H, boxSizing: "border-box", border: "1px solid var(--tt-grey03)", borderRadius: 12, overflow: "hidden", background: "white", boxShadow: "0 1px 3px rgba(10,22,41,0.08)" }}>
                    <div style={{ padding: PAGE_PAD }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div className="tt-skeleton" style={{ width: 80, height: 20 }} />
                        <div className="tt-skeleton" style={{ width: 100, height: 14 }} />
                      </div>
                      <div style={{ height: 1, background: "var(--tt-grey03)", marginBottom: 20 }} />
                      <div className="tt-skeleton" style={{ width: 100, height: 11, marginBottom: 8 }} />
                      <div className="tt-skeleton" style={{ width: "70%", height: 26, marginBottom: 8 }} />
                      <div className="tt-skeleton" style={{ width: "50%", height: 16, marginBottom: 20 }} />
                      <div className="tt-skeleton" style={{ width: "100%", height: 70, borderRadius: 8, marginBottom: 24 }} />
                      <div className="tt-skeleton" style={{ width: "100%", height: 6, borderRadius: 99, marginBottom: 20 }} />
                      <div style={{ height: 1, background: "var(--tt-grey03)", margin: "20px 0" }} />
                      <div style={{ display: "flex", gap: 32 }}>
                        <div className="tt-skeleton" style={{ width: 120, height: 16 }} />
                        <div className="tt-skeleton" style={{ width: 120, height: 16 }} />
                      </div>
                    </div>
                    <div style={{ padding: `0 ${PAGE_PAD}px` }}>
                      {visibleGroups.map(g => (
                        <div key={g.key} style={{ marginBottom: 20 }}>
                          {g.entries.map((e, i) => (
                            <div key={i} style={{ marginBottom: 20 }}>
                              <div className="tt-skeleton" style={{ width: "60%", height: 18, marginBottom: 8 }} />
                              <div className="tt-skeleton" style={{ width: 160, height: 11, marginBottom: 10 }} />
                              {e.photos.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
                                  {[0, 1, 2, 3].map(pi => (
                                    <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "4/3", borderRadius: 4 }} />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: `20px ${PAGE_PAD}px`, borderTop: "1px solid var(--tt-grey03)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="tt-skeleton" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                        <div>
                          <div className="tt-skeleton" style={{ width: 100, height: 14, marginBottom: 4 }} />
                          <div className="tt-skeleton" style={{ width: 140, height: 12 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Hidden measuring scaffold — off-screen copies of the
                        header/footer and every content block, at the real
                        page content width, so their rendered heights can be
                        read via ref and packed into pages (see the
                        useLayoutEffect above). height:0 + overflow hidden on
                        the outer wrapper keeps it from affecting
                        scroll/layout while its children still get a normal,
                        measurable layout pass underneath. Memoized above
                        (hiddenMeasuringScaffold) alongside the layout
                        effect it feeds. */}
                    {hiddenMeasuringScaffold}

                    {/* Real, visible pages — stacked A4 sheets, each with
                        its own header/footer, so the preview reads like a
                        real paginated report instead of one long scroll.
                        content-visibility lets the browser skip layout/paint
                        for pages currently off-screen, which matters once
                        there are more than a couple of these (each one is a
                        fairly heavy subtree — full header, entries, photo
                        grids) — without it, scrolling a long report got
                        noticeably janky. containIntrinsicSize keeps the
                        scrollbar/scroll position stable while a page is
                        skipped. Memoized above (visiblePages). */}
                    {visiblePages}

                    {/* Infinite scroll: one skeleton item while the next batch "loads" */}
                    {loadingMore && (
                      <div style={{ width: PAGE_W, margin: "24px 0 0" }}>
                        <div className="tt-skeleton" style={{ width: "85%", height: 16, marginBottom: 10 }} />
                        {nextEntry && nextEntry.photos.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
                            {[0, 1, 2].map(pi => (
                              <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "4/3", borderRadius: 4 }} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Selection toolbar — sticky to the bottom of the scroll
                    viewport (not fixed to the screen) so it naturally
                    inherits this same maxWidth:800 box's width and
                    horizontal position — including the scrollbar-gutter
                    reservation above — instead of having to duplicate that
                    centering math against the raw viewport. Delete acts
                    immediately (no confirmation modal) since the "original
                    photo won't be deleted" disclaimer is always visible
                    right here; it moves the selection into excludedPhotos
                    (filtered everywhere). */}
                {Object.keys(selectedPhotos).length > 0 && (
                  <div style={{
                    position: "sticky", bottom: 0, zIndex: 100,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxSizing: "border-box", padding: "12px 20px",
                    background: "var(--tt-grey06)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        onClick={clearPhotoSelection}
                        style={{ background: "none", border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", padding: 0, flexShrink: 0 }}
                      >
                        <X size={13} strokeWidth={SW} />
                      </button>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>
                          {Object.keys(selectedPhotos).length} item{Object.keys(selectedPhotos).length > 1 ? "s" : ""} selected
                        </span>
                        <span style={{ fontSize: 12, color: "white" }}>
                          The original photo won't be deleted.
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={handleDeleteSelectedPhotos}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "white", cursor: "pointer", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, transition: "background 0.15s" }}
                      >
                        <Trash2 size={14} strokeWidth={SW} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>

          </div>
        </ActiveEditContext.Provider>
      )}

      {/* Toast — success (secondary green accent + check) / error (red accent + cross) */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 3000, background: "var(--tt-text-1)", borderRadius: 12, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)", pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 24px" }}>
            {toast.type === "success"
              ? <Check size={16} color="white" strokeWidth={2.5} />
              : <AlertTriangle size={16} color="white" strokeWidth={2.5} />}
            <span style={{ color: "white", fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" }}>{toast.message}</span>
          </div>
          <div style={{
            height: 4, background: toast.type === "success" ? "var(--tt-secondary)" : "var(--tt-red)",
            transformOrigin: "left", animation: "tt-toast-progress 2.5s linear forwards",
          }} />
        </div>
      )}

      {/* Delete report confirmation */}
      {deleteTarget && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(10,22,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 420, maxWidth: "calc(100vw - 32px)", background: "white", borderRadius: 16, padding: 24, boxShadow: "0 16px 48px rgba(10,22,41,0.25)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--tt-text-1)", margin: 0 }}>Delete report</p>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tt-text-1)", padding: 4, display: "flex", borderRadius: 6, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <X size={20} strokeWidth={SW} />
              </button>
            </div>
            <p style={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: "0 0 4px" }}>
              Generation date: <strong style={{ color: "var(--tt-text-1)" }}>{deleteTarget.date}</strong>
            </p>
            <p style={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: "0 0 24px" }}>
              This can't be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleDeleteReport}
                style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "var(--tt-text-1)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          index={lightbox.index}
          entryDate={lightbox.entryDate}
          taskName={lightbox.taskName}
          onIndexChange={i => setLightbox(lb => ({ ...lb, index: i }))}
          onClose={() => setLightbox(null)}
          onDeleteSelected={(indices) => {
            // originalIndices map filmstrip position -> this entry's real
            // photo index, so the exclusion lands on the same keys the
            // panel's own photo-select/delete already uses.
            const originalIndices = indices.map(i => lightbox.originalIndices[i]);
            setPreview(p => ({
              ...p,
              excludedPhotos: {
                ...p.excludedPhotos,
                ...Object.fromEntries(originalIndices.map(i => [`${lightbox.entryKey}_${i}`, true])),
              },
            }));
            setLightbox(null);
          }}
        />
      )}
    </div>
  );
}

// ── Paywall (demo case: replaces all Reports tab content) ──
function ReportPaywall() {
  const unlockItems = [
    "Full report history across project",
    "Progress reports with task completion summary",
    "Photo updates grouped by week or month",
    "Shareable link for any period",
  ];

  return (
    <div style={{ marginTop: 24, padding: "48px 40px", textAlign: "center" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: "var(--tt-mint)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
      }}>
        <Crown size={26} color="var(--tt-secondary)" strokeWidth={SW} />
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--tt-text-1)", margin: "0 0 10px" }}>
        Send a Report, Not a Wall of Text
      </h3>
      <p style={{ fontSize: 14, color: "var(--tt-grey05)", lineHeight: 1.6, maxWidth: 460, margin: "0 auto 28px" }}>
        Generate a ready-to-share report from your activity log in seconds. Photos, progress, and notes — all in one place.
      </p>

      <div style={{ background: "var(--tt-grey02)", borderRadius: 12, padding: "20px 24px", textAlign: "left", maxWidth: 440, margin: "0 auto 24px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", margin: "0 0 12px" }}>What you unlock:</p>
        {unlockItems.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i === unlockItems.length - 1 ? 0 : 10 }}>
            <Check size={16} color="var(--tt-secondary)" strokeWidth={SW} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 13, color: "var(--tt-text-2)", lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>

      <button
        style={{
          width: "100%", maxWidth: 440, height: 44, border: "none", borderRadius: 10,
          background: "var(--tt-text-1)", color: "white", fontSize: 14, fontWeight: 600,
          cursor: "pointer", transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Upgrade to Team Plan
      </button>
    </div>
  );
}

// ── Root ──
// ── Report Page (shared link view) ──
// Report content is fully reproducible from its URL params (dateRange,
// period, included sections, excluded photos, and any manually-added
// notes) — rebuilt on the fly rather than fetched from storage, so a
// shared link works on any device/browser and can never 404.
function ReportPage({ dateRange, period, includeSummary, includeNoPhotoTasks, notesParam, excludedParam, titlesParam, projectName, address, logo, companyName, companyAddress, summaryText, targetOpening, clientName }) {
  let data = buildReportData(dateRange, period, null, includeNoPhotoTasks);
  let groups = data.groups;
  if (excludedParam) {
    try {
      const excludedPhotos = {};
      JSON.parse(excludedParam).forEach(k => { excludedPhotos[k] = true; });
      groups = applyPhotoExclusions(groups, excludedPhotos);
    } catch { /* malformed/tampered param — ignore */ }
  }
  if (titlesParam) {
    try {
      const titleOverrides = JSON.parse(titlesParam);
      groups = applyTitleOverrides(groups, titleOverrides);
    } catch { /* malformed/tampered param — ignore */ }
  }
  if (notesParam) {
    try {
      const extraNotes = JSON.parse(notesParam);
      groups = applyExtraNotesToGroups(groups, extraNotes);
    } catch { /* malformed/tampered param — ignore */ }
  }
  data = { ...data, groups };
  const html = buildReportHTML({ includeSummary, period, data, projectName, address, logo, companyName, companyAddress, summary: summaryText, targetOpening, clientName });

  return (
    <iframe
      srcDoc={html}
      title="Report"
      style={{ border: "none", width: "100%", height: "100vh", display: "block" }}
    />
  );
}


export default function ProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const sharedPeriodRaw = params.get("period");
  const sharedPeriod = sharedPeriodRaw ? desanitizePeriodFromUrl(sharedPeriodRaw) : sharedPeriodRaw;
  if (sharedPeriod) return (
    <ReportPage
      dateRange={params.get("range")}
      period={sharedPeriod}
      includeSummary={params.get("summary") !== "0"}
      includeNoPhotoTasks={params.get("nophotos") !== "0"}
      notesParam={params.get("notes")}
      excludedParam={params.get("excluded")}
      titlesParam={params.get("titles")}
      projectName={params.get("projectName")}
      address={params.get("address")}
      logo={params.get("logo")}
      companyName={params.get("companyName")}
      companyAddress={params.get("companyAddress")}
      summaryText={params.get("summaryText")}
      targetOpening={params.get("targetOpening")}
      clientName={params.get("clientName")}
    />
  );

  const [activeTab, setActiveTab] = useState("reports");
  const [demoCase, setDemoCase] = useState("happy");

  const demoCases = [
    { id: "happy",      label: "Happy Flow" },
    { id: "error",      label: "Generate error" },
    { id: "save_error", label: "Save report error" },
    { id: "paywall",    label: "Paywall" },
  ];

  const tabs = [
    { id: "tasks",     label: "Tasks",         Icon: Hash },
    { id: "checklist", label: "Checklist",     Icon: FileText },
    { id: "files",     label: "Files & Media", Icon: FileImage },
    { id: "activity",  label: "Activity Log",  Icon: Activity },
    { id: "members",   label: "Members",       Icon: Users },
    { id: "reports",   label: "Reports",       Icon: BarChart2 },
  ];

  return (
    <div className="font-sans bg-white text-[var(--tt-text-1)] min-h-screen text-[14px] leading-[1.5]" style={{ background: "var(--tt-grey01)" }}>

      {/* Demo case switcher — not part of the product UI, just for previewing states */}
      <div style={{ background: "var(--tt-text-1)" }}>
        <div style={{ maxWidth: 1114, margin: "0 auto", display: "flex", alignItems: "center", gap: 4, padding: "10px 16px" }}>
          {demoCases.map(({ id, label }) => {
            const active = demoCase === id;
            return (
              <button
                key={id}
                onClick={() => setDemoCase(id)}
                style={{
                  height: 30, padding: "0 14px", borderRadius: 8, border: "none",
                  background: active ? "white" : "transparent",
                  color: active ? "var(--tt-text-1)" : "rgba(255,255,255,0.65)",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1114, margin: "0 auto", background: "white", minHeight: "100vh" }}>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-[var(--tt-grey03)]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 text-[var(--tt-grey05)] hover:bg-[var(--tt-grey02)]" style={{ borderRadius: 12 }}>
            <ChevronLeft size={16} strokeWidth={SW} />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[18px] font-semibold leading-[1.1] text-[var(--tt-text-1)] truncate">
                {PROJECT_NAME}
              </p>
              <Button variant="ghost" size="icon" className="w-6 h-6 shrink-0 text-[var(--tt-text-2)] hover:bg-[var(--tt-grey02)]" style={{ borderRadius: 12 }}>
                <MoreVertical size={16} strokeWidth={SW} />
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-[2px]">
              <span className="flex items-center gap-1 text-[12px] text-[var(--tt-grey05)]">
                <LayoutGrid size={11} strokeWidth={SW} /> Personal Projects
              </span>
              <span className="flex items-center gap-1 text-[12px] text-[var(--tt-grey05)]">
                <MapPin size={11} strokeWidth={SW} /> {PROJECT_ADDRESS}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-[var(--tt-text-2)] hover:bg-[var(--tt-grey02)]" style={{ borderRadius: 12 }}>
            <Search size={16} strokeWidth={SW} />
          </Button>
          <Button className="gap-2 bg-[var(--tt-text-1)] hover:bg-black text-white text-[14px] font-medium h-9 px-4 !rounded-xl">
            <Plus size={16} strokeWidth={SW} /> New Task
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-4">
        <div className="rounded-xl px-5 py-4" style={{ background: "var(--tt-grey02)" }}>
          <p className="text-[14px] font-semibold text-[var(--tt-text-1)] mb-1">Description</p>
          <p className="text-[14px] text-[var(--tt-text-2)] leading-6 max-w-[680px]">
            This project focuses on conducting a comprehensive assessment and improvement.
          </p>
        </div>
      </div>

      {/* Timesheet summary banner */}
      <div className="px-4 pb-3">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px", borderRadius: 12,
          border: "1px solid var(--tt-grey03)", background: "white",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: "var(--tt-mint)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Clock size={18} color="var(--tt-secondary)" strokeWidth={SW} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-text-1)", margin: 0 }}>16h logged this week</p>
              <p style={{ fontSize: 13, color: "var(--tt-grey05)", margin: 0 }}>Across 4 members</p>
            </div>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 40, padding: "0 12px", border: "none",
            borderRadius: 12, background: "transparent", cursor: "pointer",
            fontSize: 13, fontWeight: 500, color: "var(--tt-text-1)",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Clock size={14} strokeWidth={SW} color="var(--tt-text-2)" />
            <span style={{ lineHeight: "14px" }}>Open Timesheet</span>
            <ChevronDown size={14} strokeWidth={SW} color="var(--tt-grey05)" style={{ transform: "rotate(-90deg)" }} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className="flex items-center gap-1 px-4 rounded-none bg-transparent h-auto w-full justify-start"
          style={{ borderBottom: "1px solid var(--tt-grey03)" }}
        >
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <TabsTrigger key={id} value={id} className="flex items-center gap-2">
                <Icon
                  size={16}
                  strokeWidth={SW}
                  color={active ? "var(--tt-secondary)" : "var(--tt-grey06)"}
                  style={{ opacity: 1 }}
                />
                {label}
                {id === "members" && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 18, height: 18, borderRadius: "50%",
                    background: "var(--tt-grey06)", color: "white",
                    fontSize: 11, fontWeight: 600, lineHeight: 1, flexShrink: 0,
                  }}>4</span>
                )}
              </TabsTrigger>
            );
          })}

          <div className="flex-1" />
          {/* Extra right padding so Invite's edge lines up with Open
              Timesheet's above it, which sits inside a card with its own
              16px padding on top of this row's 16px (px-4). */}
          <div className="flex items-center gap-2 pb-[1px] pr-4">
            <Button
              variant="ghost" size="icon"
              className="w-8 h-8 hover:bg-[var(--tt-grey02)]"
              style={{ color: "var(--tt-grey06)" }}
            >
              <Link size={16} strokeWidth={SW} />
            </Button>
            <Button
              variant="outline" size="sm"
              className="gap-2 h-8 px-4 text-[13px] font-medium bg-white"
              style={{ color: "var(--tt-text-1)", borderColor: "var(--tt-text-1)", borderWidth: "1.5px", borderRadius: "9999px" }}
            >
              <UserPlus size={14} strokeWidth={SW} />
              Invite
            </Button>
          </div>
        </TabsList>

        <TabsContent value="tasks"     className="mt-0 px-4" style={{ paddingTop: 16 }} />
        <TabsContent value="reports"   className="mt-0 px-4" style={{ paddingTop: 16 }}>
          {demoCase === "paywall" ? <ReportPaywall /> : <ReportsTab key={demoCase} demoCase={demoCase} />}
        </TabsContent>
        <TabsContent value="checklist" className="mt-0 px-4" style={{ paddingTop: 16 }}></TabsContent>
        <TabsContent value="files"     className="mt-0 px-4" style={{ paddingTop: 16 }} />
        <TabsContent value="activity"  className="mt-0 px-4" style={{ paddingTop: 16 }} />
        <TabsContent value="members"   className="mt-0 px-4" style={{ paddingTop: 16 }} />
      </Tabs>
      </div>
    </div>
  );
}
