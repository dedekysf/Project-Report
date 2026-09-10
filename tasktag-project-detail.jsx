import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft, Search, MoreVertical, Plus, Check, Link, Download,
  LayoutGrid, MapPin, Hash, FileText, FileImage,
  Activity, Users, BarChart2, SlidersHorizontal,
  ArrowUpDown, Calendar, AlignJustify, Clock,
  UserPlus, Link2, ChevronUp, ChevronDown, X, Pencil, Trash2,
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

// The app's fixed "today" — all mock data (DUMMY_ENTRIES, this_week/last_week
// ranges) is anchored to this date rather than the real device clock.
const APP_TODAY = new Date(2026, 8, 10); // Sep 10, 2026

// ── Date Range Calendar ──
function DateRangeCalendar({ anchorRef, onClose, onApply }) {
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

  // ── Fixed position: left-aligned to anchor, above/below based on window ──
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

    // prefer below; flip above if not enough space below
    const spaceBelow = vh - anchor.bottom - MARGIN;
    const spaceAbove = anchor.top - MARGIN;
    let top;
    if (spaceBelow >= CAL_H) {
      top = anchor.bottom + MARGIN;
    } else if (spaceAbove >= CAL_H) {
      top = anchor.top - CAL_H - MARGIN;
    } else {
      // not enough space either way — center vertically in viewport
      top = Math.max(MARGIN, (vh - CAL_H) / 2);
    }

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

  const effectiveEnd = rangeEnd || hovering;

  const handleDay = (key) => {
    if (key > todayKey) return; // dates after today can't be selected
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
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        width: 308,
        padding: "16px 12px 12px",
        border: "1.5px solid var(--tt-grey03)",
        borderRadius: 16,
        background: "white",
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
          const disabled = isFuture; // prev/next-month preview days are selectable, just future dates aren't
          const start    = key === rangeStart;
          const end      = key === rangeEnd;
          const selected = start || end;
          const col      = i % 7; // 0=Sun, 6=Sat

          // seamless range band: full-width bg between start and end (inclusive of selected ends)
          const lo = rangeStart;
          const hi = effectiveEnd && effectiveEnd > rangeStart ? effectiveEnd : rangeStart && !rangeEnd && hovering && hovering > rangeStart ? hovering : null;
          const inBand = lo && hi && key >= lo && key <= hi;

          // band left/right caps for rounded ends
          const isLeft  = start || col === 0 || key === lo;
          const isRight = end   || col === 6 || key === hi;

          const bandRadius = inBand
            ? `${isLeft ? "50%" : "0"} ${isRight ? "50%" : "0"} ${isRight ? "50%" : "0"} ${isLeft ? "50%" : "0"}`
            : "0";

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
                // seamless band background
                background: inBand ? "var(--tt-grey03)" : "transparent",
                borderRadius: bandRadius,
              }}
            >
              {/* The actual date circle */}
              <div style={{
                width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "50%",
                background: selected ? "#000" : "transparent",
                border: isToday && !selected ? "1.5px solid #000" : "none",
                color: selected ? "#fff" : inBand ? "#000" : isFuture ? "var(--tt-grey04)" : otherMonth ? "var(--tt-grey03)" : isToday ? "#000" : "var(--tt-text-2)",
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
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--tt-grey03)" }}>
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
            border: "none", background: "#000",
            fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer", transition: "opacity 0.15s",
          }}>Apply</button>
      </div>
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

        <div className="flex items-center gap-3 py-[10px] border-b border-[var(--tt-grey03)]">
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

const PERIOD_OPTIONS_BASE = [
  { id: "this_week", label: "This week" },
  { id: "last_week", label: "Last week" },
  { id: "custom",    label: "Custom date" },
];

const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

function getWeekRange(offset = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const PERIOD_LABELS = {
  this_week:  `This week · ${getWeekRange(0)}`,
  last_week:  `Last week · ${getWeekRange(-1)}`,
  custom:     "Custom date",
  since_last: "Since last report",
};

const PERIOD_RANGE = {
  this_week:  getWeekRange(0),
  last_week:  getWeekRange(-1),
  custom:     "Custom range",
  since_last: "Since last report",
};

const PERIOD_DISPLAY = {
  this_week: `This week`,
  last_week: `Last week`,
  custom:    "Custom date",
};

// ── Dummy data ──
const DUMMY_TASKS = [
  { name: "Site survey", done: true },
  { name: "Structural assessment", done: true },
  { name: "Scaffolding installation", done: true },
  { name: "Waterproofing", done: true },
  { name: "Brickwork reinforcement", done: true },
  { name: "Wall crack repair", done: true },
  { name: "Paint removal & prep", done: true },
  { name: "Door frame replacement", done: true },
  { name: "Door hardware installation", done: true },
  { name: "Electrical connections", done: true },
  { name: "Ceiling light installation", done: true },
  { name: "Interior repainting", done: false },
  { name: "Floor refinishing", done: false },
  { name: "Final inspection", done: false },
  { name: "Punch list resolution", done: false },
  { name: "Client walkthrough", done: false },
  { name: "Certificate of occupancy", done: false },
  { name: "Landscaping", done: false },
  { name: "Final cleaning", done: false },
  { name: "Project closeout documentation", done: false },
  { name: "Warranty submission", done: false },
  { name: "Handover", done: false },
];

const DUMMY_ENTRIES = [
  { date: "2026-09-10", note: "Flooring installation started on the ground floor.", photos: ["img5", "img1", "img6"] },
  { date: "2026-09-09", note: "Exterior siding repairs completed on the south wall.", photos: ["img9", "img2", "img3", "img7", "img4"] },
  { date: "2026-09-08", note: "Final electrical connections completed in the main panel.", photos: ["img9", "img8"] },
  { date: "2026-09-07", note: "Plumbing fixtures installed in all bathrooms.", photos: ["img7"] },
  { date: "2026-09-06", note: "Ceiling lights installed and tested.", photos: ["img8", "img7"] },
  { date: "2026-09-03", note: "Interior door hardware fitted — knobs and locks in place.", photos: ["img6", "img7"] },
  { date: "2026-08-28", note: "Cracked wall sections patched and primed.", photos: ["img1", "img3", "img4"] },
  { date: "2026-08-21", note: "Brickwork reinforcement completed on the north facade.", photos: ["img2", "img1"] },
  { date: "2026-08-14", note: "Peeling paint removed and surface prepared for recoat.", photos: ["img5", "img4", "img3"] },
  { date: "2026-08-07", note: "Door frame replaced in the storage room.", photos: ["img7", "img6"] },
  { date: "2026-07-31", note: "Structural assessment completed — no major issues found.", photos: ["img2"] },
  { date: "2026-07-24", note: "Scaffolding erected on the west side.", photos: ["img9", "img1"] },
  { date: "2026-07-17", note: "Waterproofing membrane applied to basement walls.", photos: ["img3", "img5"] },
  { date: "2026-07-10", note: "Project kickoff — site survey and initial documentation.", photos: ["img2", "img9", "img6"] },
];

// ── Report generation engine ──
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function parsePeriodDates(periodStr, dateRange, customRange) {
  const now = APP_TODAY;

  if (dateRange === "this_week") {
    const day = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - ((day + 6) % 7));
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return { start: mon, end: sun };
  }
  if (dateRange === "last_week") {
    const day = now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - ((day + 6) % 7) - 7);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return { start: mon, end: sun };
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

function applyPhotoCap(groups, maxPhotos = 45) {
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

  // Rebuild groups keeping only selected photos
  return groups.map((g, gi) => ({
    ...g,
    entries: g.entries.map((e, ei) => ({
      ...e,
      photos: e.photos.filter((_, pi) => selected.has(all.findIndex(a => a.gi === gi && a.ei === ei && a.pi === pi))),
    })).filter(e => e.photos.length > 0 || e.note),
  }));
}

function buildReportData(reportType, dateRange, periodStr, customRange) {
  const { start, end } = parsePeriodDates(periodStr, dateRange, customRange);
  const grouping = getGrouping(start, end);
  let groups = groupEntries(DUMMY_ENTRIES, start, end, grouping);
  groups = applyPhotoCap(groups);

  const completed = DUMMY_TASKS.filter(t => t.done).length;
  const total = DUMMY_TASKS.length;
  const pct = Math.round(completed / total * 100);

  return { groups, grouping, completed, total, pct, reportType };
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
      g.entries.splice(entryIdx + 1, 0, { note: text, photos: [] });
    });
  });

  const emptyNote = extraNotes.empty;
  if (emptyNote && emptyNote.trim() && cloned.length === 0) {
    cloned.push({ key: "notes", entries: [{ note: emptyNote, photos: [] }] });
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

// ── HTML report generator ──
// Builds the same report content (header, meta, schedule status, task
// rollup, grouped notes + photos) as a standalone HTML string, shared by
// both the "Download" button and the copy-link shared view.
const buildReportHTML = (report) => {
  const { groups, grouping, completed, total, pct, reportType: rType } =
    report.data || buildReportData(report.reportType, "custom", report.period, null);

  const h = (tag, attrs, ...children) => {
    const attrStr = Object.entries(attrs || {}).map(([k, v]) => ` ${k}="${v}"`).join("");
    return `<${tag}${attrStr}>${children.join("")}</${tag}>`;
  };
  const selfClose = (tag, attrs) => {
    const attrStr = Object.entries(attrs || {}).map(([k, v]) => ` ${k}="${v}"`).join("");
    return `<${tag}${attrStr}/>`;
  };

  // Fixed 4-column grid -- cell size never changes with row count.
  const renderPhotos = (photos) => {
    if (!photos || photos.length === 0) return "";
    const cells = photos.map(k => {
      const src = IMG_MAP[k];
      return src
        ? selfClose("img", { src: toAbsoluteUrl(src), style: "width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;display:block;" })
        : "";
    });
    return h("div", { style: "display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px;" }, ...cells);
  };

  const groupLabel = (g) => formatGroupLabel(g, grouping);

  const progressHTML = rType === "progress"
    ? h("div", { style: "margin-bottom:24px;" },
        h("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:13px;font-weight:600;" },
          h("span", { style: "color:#0a1629;" }, `${completed} of ${total} tasks complete`),
          h("span", { style: "color:#16a97d;" }, `${pct}%`)
        ),
        h("div", { style: "height:6px;background:#e8e8e6;border-radius:99px;overflow:hidden;" },
          h("div", { style: `width:${pct}%;height:100%;background:#16a97d;border-radius:99px;` }, "")
        )
      )
    : "";

  // Each entry keeps its own note directly above its own photos, regardless
  // of whether the section groups by day, week, or month -- otherwise a
  // week/month section would stack every note together and dump all of its
  // photos into one grid with no way to tell which belongs to which.
  const entryHTML = (e) =>
    h("div", { style: "margin-bottom:20px;" },
      h("p", { style: "font-size:14px;color:#303742;line-height:1.6;margin:0;" }, e.note),
      renderPhotos(e.photos)
    );

  const entriesHTML = groups.length === 0
    ? h("p", { style: "font-size:13px;color:#828282;text-align:center;padding:32px 0;" }, "No activity entries for this period.")
    : groups.map(g =>
        h("div", { style: "margin-bottom:32px;" },
          h("p", { style: "font-size:11px;font-weight:600;color:#828282;letter-spacing:.06em;text-transform:uppercase;margin:0 0 4px;" }, groupLabel(g).toUpperCase()),
          ...g.entries.map(entryHTML)
        )
      ).join("");

  const css = "*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#f7f8fa;min-height:100vh;padding:32px 24px}.card{background:white;border:1px solid #e8e8e6;overflow:hidden;max-width:660px;margin:0 auto}";

  const headerContent =
    selfClose("img", { src: toAbsoluteUrl(IMG_MAP_LOGO), alt: "tasktag", style: "height:24px;display:block;" }) +
    h("span", { style: "font-size:10px;font-weight:600;letter-spacing:.04em;color:#16a97d;text-transform:uppercase;border:1px solid #16a97d;border-radius:20px;padding:3px 10px;" }, rType === "photo" ? "Photo Update" : "Progress Report");

  const header = h("div", { style: "display:flex;align-items:center;justify-content:space-between;padding:14px 20px;" }, headerContent);
  // Inset divider (not edge-to-edge) between header and body.
  const divider = h("div", { style: "height:1px;background:#e8e8e6;margin:0 20px;" }, "");

  // TODO(BE): replace with the project's actual name and address from the API
  const meta =
    h("p", { style: "font-size:11px;color:#828282;margin-bottom:24px;text-transform:uppercase;" }, `Period: ${report.period}`) +
    h("h2", { style: "font-size:28px;font-weight:700;color:#0a1629;margin-bottom:4px;line-height:1.15;" }, "Raintree Hollow Residence Renovation") +
    h("p", { style: "font-size:12px;color:#828282;margin-bottom:24px;" }, "11 North Raintree Hollow Court, Sienna Plantation, Missouri City");

  const body = h("div", { style: "padding:20px;" }, meta + progressHTML + entriesHTML);
  const card = h("div", { class: "card" }, header + divider + body);

  const title = rType === "photo" ? "Photo Update" : "Progress Report";
  return "<!DOCTYPE html>" +
    h("html", {},
      h("head", {},
        selfClose("meta", { charset: "UTF-8" }),
        h("title", {}, `${title} – ${report.period}`),
        h("style", {}, css)
      ),
      h("body", {}, card)
    );
};

// ── Reports Tab ──
function ReportsTab() {
  const [reportType,  setReportType]  = useState("progress");
  const [dateRange,   setDateRange]   = useState("this_week");
  const [showCal,     setShowCal]     = useState(false);
  const [customRange, setCustomRange] = useState(null); // { start, end } date strings
  const prevDateRangeRef = useRef("this_week"); // dateRange to fall back to if custom is opened but no date is picked
  const [reports,     setReports]     = useState([]);
  const [openType,    setOpenType]    = useState(false);
  const [openPeriod,  setOpenPeriod]  = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [copiedPos,   setCopiedPos]   = useState({ top: 0, left: 0 });
  const reportTypeRef = useRef(null);
  const periodRef     = useRef(null);
  const chipRef       = useRef(null);

  // ── Generate preview modal ──
  // { reportType, dateRange, period, customRange, extraNotes } | null
  // extraNotes: { [entryKey]: noteText } — one note per entry/photo-list at most
  const [preview,          setPreview]          = useState(null);
  const [previewPeriodOpen, setPreviewPeriodOpen] = useState(false);
  const [previewShowCal,   setPreviewShowCal]   = useState(false);
  const [noteDraft,        setNoteDraft]        = useState("");
  const [activeNoteFormKey, setActiveNoteFormKey] = useState(null); // entryKey whose add/edit note form is open
  const [previewLoading,   setPreviewLoading]    = useState(false);
  const previewPrevDateRangeRef = useRef("this_week");
  const previewPeriodRef = useRef(null);

  useEffect(() => {
    if (!openType) return;
    const handler = (e) => { if (reportTypeRef.current && !reportTypeRef.current.contains(e.target)) setOpenType(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openType]);

  useEffect(() => {
    if (!openPeriod) return;
    const handler = (e) => { if (periodRef.current && !periodRef.current.contains(e.target)) setOpenPeriod(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openPeriod]);

  const DATE_LABELS = {
    since:  "Aug 4, 2026 – Sep 1, 2026",
    custom: "Custom range",
  };

  const reportOptions = [
    { id: "progress", title: "Progress report",  desc: "Schedule status, task rollup, and photos" },
    { id: "photo",    title: "Photo update",      desc: "Photos and notes, no schedule or task list" },
  ];

  const handleChip = (id) => {
    setDateRange(id);
    setShowCal(id === "custom");
  };

  // Adds a report to the results list (called only once the user confirms
  // via "Save report" in the preview modal — Generate no longer does this
  // directly).
  const pushReport = ({ reportType, dateRange, period, data }) => {
    const id = Date.now();
    const newReport = {
      id,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      period,
      dateRange,
      status: "in_progress",
      reportType,
      data,
    };
    setReports(prev => [newReport, ...prev]);
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "done" } : r));
    }, 3000);
  };

  const handleGenerate = () => {
    setPreview({
      reportType,
      dateRange,
      period: getPeriodRange(dateRange),
      customRange,
      extraNotes: {},
    });
    setPreviewPeriodOpen(false);
    setPreviewShowCal(false);
    setActiveNoteFormKey(null);
    setNoteDraft("");
  };

  const closePreview = () => {
    setPreview(null);
    setPreviewPeriodOpen(false);
    setPreviewShowCal(false);
    setActiveNoteFormKey(null);
    setNoteDraft("");
  };

  useEffect(() => {
    if (!preview) return;
    const handler = (e) => { if (e.key === "Escape") closePreview(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [preview]);

  // Show a loading skeleton whenever the previewed data would change —
  // both on first open and whenever the period is edited.
  useEffect(() => {
    if (!preview) return;
    setPreviewLoading(true);
    const t = setTimeout(() => setPreviewLoading(false), 500);
    return () => clearTimeout(t);
  }, [preview?.period]);

  const previewData = preview
    ? buildReportData(preview.reportType, preview.dateRange, preview.period, preview.customRange)
    : null;
  // Final groups with manually-added notes spliced in at their entry —
  // what actually gets downloaded / copy-linked / saved.
  const previewFinalGroups = previewData ? applyExtraNotesToGroups(previewData.groups, preview.extraNotes) : [];

  const handleSaveNote = (key) => {
    const text = noteDraft.trim();
    if (!text) return;
    setPreview(p => ({ ...p, extraNotes: { ...p.extraNotes, [key]: text } }));
    setNoteDraft("");
    setActiveNoteFormKey(null);
  };

  const handleDeleteNote = (key) => {
    setPreview(p => {
      const next = { ...p.extraNotes };
      delete next[key];
      return { ...p, extraNotes: next };
    });
  };

  // Rendered under every entry's photo list (and once for the empty-period
  // state). Each entry can carry at most one manually-added note tied to
  // that specific photo list — once saved, this becomes an edit/delete
  // control instead of an "add" button (no stacking multiple notes here).
  const renderNoteSlot = (key) => {
    const savedNote = preview.extraNotes[key];

    if (activeNoteFormKey === key) {
      return (
        <div style={{ position: "relative", marginTop: 10 }}>
          <input
            autoFocus
            type="text"
            value={noteDraft}
            onChange={e => setNoteDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSaveNote(key);
              if (e.key === "Escape") { setActiveNoteFormKey(null); setNoteDraft(""); }
            }}
            placeholder="Add a note for this list..."
            style={{ width: "100%", height: 40, padding: "0 76px 0 12px", border: "1px solid var(--tt-grey03)", borderRadius: 8, fontSize: 13, fontFamily: "inherit", color: "var(--tt-text-2)", outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
            <button
              onClick={() => { setActiveNoteFormKey(null); setNoteDraft(""); }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, color: "var(--tt-text-2)", cursor: "pointer", transition: "background 0.15s" }}
            >
              <X size={14} strokeWidth={SW} />
            </button>
            <button
              onClick={() => handleSaveNote(key)}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", transition: "opacity 0.15s" }}
            >
              <Check size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      );
    }

    if (savedNote) {
      return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 4, marginTop: 10 }}>
          <p style={{ fontSize: 14, color: "#303742", lineHeight: "1.6", margin: 0, flex: 1 }}>{savedNote}</p>
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => { setActiveNoteFormKey(key); setNoteDraft(savedNote); }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, color: "var(--tt-grey05)", cursor: "pointer", transition: "background 0.15s" }}
            >
              <Pencil size={12} strokeWidth={SW} />
            </button>
            <button
              onClick={() => handleDeleteNote(key)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, color: "var(--tt-grey05)", cursor: "pointer", transition: "background 0.15s" }}
            >
              <Trash2 size={12} strokeWidth={SW} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => { setActiveNoteFormKey(key); setNoteDraft(""); }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1px dashed var(--tt-grey03)", borderRadius: 8, padding: "6px 12px", marginTop: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "var(--tt-text-2)", transition: "background 0.15s" }}
      >
        <Plus size={12} strokeWidth={SW} /> Add note
      </button>
    );
  };

  const handlePreviewSave = () => {
    pushReport({ reportType: preview.reportType, dateRange: preview.dateRange, period: preview.period, data: { ...previewData, groups: previewFinalGroups } });
    setDateRange("since_last");
    closePreview();
  };

  const [isWide, setIsWide] = useState(window.innerWidth > 1280);
  useEffect(() => {
    const handler = () => setIsWide(window.innerWidth > 1280);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleDownload = (report) => {
    const html = buildReportHTML(report);
    const fileName = report.reportType + "_" + report.period.replace(/[\s]/g, "_").replace(/–/g, "-") + ".html";
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

    const handleCopy = async (rect, report) => {
    // Report content is fully reproducible from these params, so the link
    // needs no server/storage round-trip — it can never fail to resolve.
    const params = new URLSearchParams({
      type: report.reportType,
      range: report.dateRange || "custom",
      period: report.period,
    });
    const url = `${window.location.href.split("?")[0]}?${params.toString()}`;
    try { await navigator.clipboard.writeText(url); }
    catch {
      const el = document.createElement("textarea");
      el.value = url; el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setCopiedPos({ top: rect.bottom + 8, left: rect.right });
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic period options — add "Since last report" if a report exists
  const lastReport = reports[0];
  const sinceLastDate = lastReport
    ? lastReport.date.split(",")[0]
    : null;

  const PERIOD_OPTIONS = lastReport
    ? [{ id: "since_last", label: "Since last report" }, ...PERIOD_OPTIONS_BASE]
    : PERIOD_OPTIONS_BASE;

  const getPeriodLabel = (id, cr = customRange) => {
    if (id === "since_last") return `Since last report · ${sinceLastDate}`;
    if (id === "custom" && cr) return `${cr.start} – ${cr.end}`;
    return PERIOD_LABELS[id];
  };

  const getPeriodRange = (id, cr = customRange) => {
    if (id === "since_last") return `${sinceLastDate} – ${fmtDate(new Date())}`;
    if (id === "custom" && cr) return `${cr.start} – ${cr.end}`;
    return PERIOD_RANGE[id];
  };

  return (
    <div className="pb-6">

      {/* ── Create report — compact card ── */}
      <div style={{ background: "var(--tt-grey02)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)" }}>Choose what this report includes.</p>
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, width: "100%" }}>

          {/* Report Type — custom div dropdown */}
          <div style={{ flex: 1, minWidth: 0, position: "relative" }} ref={reportTypeRef}>
            <Label style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)", marginBottom: 6, display: "block" }}>Report type</Label>
            <div
              onClick={() => setOpenType(o => !o)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
              style={{
                width: "100%", height: 40, padding: "0 12px",
                background: "white", border: `1px solid ${openType ? "#000" : "var(--tt-grey03)"}`,
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "var(--tt-text-1)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                userSelect: "none", transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <span>{reportType === "progress" ? "Progress report" : "Photo update"}</span>
              <ChevronDown size={14} strokeWidth={SW} color="var(--tt-grey05)"
                style={{ flexShrink: 0, transform: `rotate(${openType ? "180deg" : "0deg"})`, transition: "transform 0.15s" }} />
            </div>
            {openType && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, overflow: "hidden",
              }}>
                {reportOptions.map(({ id, title, desc }, i) => (
                  <div key={id}>
                    <div
                      onClick={() => { setReportType(id); setOpenType(false); }}
                      style={{
                        padding: "10px 12px", cursor: "pointer",
                        background: reportType === id ? "var(--tt-grey02)" : "white",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { if (reportType !== id) e.currentTarget.style.background = "var(--tt-grey02)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = reportType === id ? "var(--tt-grey02)" : "white"; }}
                    >
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", margin: 0 }}>{title}</p>
                        <p style={{ fontSize: 11, color: "var(--tt-grey05)", margin: 0, lineHeight: "16px" }}>{desc}</p>
                      </div>
                      {reportType === id && <Check size={14} color="var(--tt-secondary)" strokeWidth={2} style={{ flexShrink: 0 }} />}
                    </div>
                    {i < reportOptions.length - 1 && (
                      <div style={{ height: 1, background: "var(--tt-grey03)", margin: "0 12px" }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Period — custom div dropdown */}
          <div style={{ flex: 1, minWidth: 0, position: "relative" }} ref={periodRef}>
            <Label style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)", marginBottom: 6, display: "block" }}>Period</Label>
            <div
              onClick={() => setOpenPeriod(o => !o)}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
              style={{
                width: "100%", height: 40, padding: "0 12px",
                background: "white", border: `1px solid ${openPeriod ? "#000" : "var(--tt-grey03)"}`,
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "var(--tt-text-1)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                userSelect: "none", transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <span>{getPeriodLabel(dateRange)}</span>
              <ChevronDown size={14} strokeWidth={SW} color="var(--tt-grey05)"
                style={{ flexShrink: 0, transform: `rotate(${openPeriod ? "180deg" : "0deg"})`, transition: "transform 0.15s" }} />
            </div>
            {openPeriod && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
                background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, overflow: "hidden",
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
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--tt-text-1)" }}>
                        {id === "custom" && customRange
                          ? `${customRange.start} – ${customRange.end}`
                          : getPeriodLabel(id)}
                      </span>
                      {dateRange === id && <Check size={14} color="var(--tt-secondary)" strokeWidth={2} />}
                    </div>
                    {i < PERIOD_OPTIONS.length - 1 && (
                      <div style={{ height: 1, background: "var(--tt-grey03)", margin: "0 12px" }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generate button */}
          <div style={{ flexShrink: 0 }}>
            <button
              style={{
                height: 40, padding: "0 24px",
                minWidth: isWide ? 120 : "auto",
                background: "var(--tt-text-1)", color: "white",
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                whiteSpace: "nowrap", transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              onClick={() => { setShowCal(false); handleGenerate(); }}
            >
              Generate
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
        <div style={{ marginTop: 24, border: "1px solid var(--tt-grey03)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ maxHeight: 556, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr style={{ background: "var(--tt-grey02)", borderBottom: `1px solid var(--tt-grey03)` }}>
                {["Generation date", "Period"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 500, color: "var(--tt-text-1)" }}>{h}</th>
                ))}
                <th style={{ padding: "10px 16px", width: 120 }} />
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={r.id} style={{ background: "white", borderTop: i > 0 ? `1px solid var(--tt-grey03)` : "none" }}>
                  <td style={{ padding: "0 16px", fontSize: 13, color: "var(--tt-text-2)", whiteSpace: "nowrap", height: 52, verticalAlign: "middle" }}>{r.date}</td>
                  <td style={{ padding: "0 16px", fontSize: 13, color: "var(--tt-text-2)", height: 52, verticalAlign: "middle" }}>{r.period}</td>
                  <td style={{ padding: "0 14px 0 16px", textAlign: "right", height: 52, verticalAlign: "middle", width: 120 }}>
                    {r.status === "in_progress" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--tt-text-2)" }}>
                        In progress
                        <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--tt-grey03)", borderTopColor: "var(--tt-grey05)", display: "inline-block", animation: "tt-spin 0.75s linear infinite" }} />
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <FixedTooltipBtn label="Download HTML file" onAction={() => handleDownload(r)}><Download size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                        <FixedTooltipBtn label="Copy link" onAction={(rect) => handleCopy(rect, r)}><Link size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* ── Generate preview modal ── */}
      {preview && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,22,41,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <div style={{ background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 16, maxWidth: 660, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Modal chrome */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--tt-grey03)", flexShrink: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--tt-text-1)" }}>Draft {preview.reportType === "photo" ? "Photo Update" : "Progress Report"}</p>
              <button
                onClick={closePreview}
                onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                style={{ background: "none", border: "none", borderRadius: 6, cursor: "pointer", padding: 4, display: "flex", color: "var(--tt-text-2)", transition: "background 0.15s" }}
              >
                <X size={18} strokeWidth={SW} />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ padding: 20 }}>
                {/* Editable period — same select-box style as the main card's Period dropdown */}
                <div style={{ position: "relative", marginBottom: 24, maxWidth: 280 }} ref={previewPeriodRef}>
                  <Label style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)", marginBottom: 6, display: "block" }}>Period</Label>
                  <div
                    onClick={() => setPreviewPeriodOpen(o => !o)}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                    style={{
                      width: "100%", height: 40, padding: "0 12px",
                      background: "white", border: `1px solid ${previewPeriodOpen ? "#000" : "var(--tt-grey03)"}`,
                      borderRadius: 8, fontSize: 13, fontWeight: 500,
                      color: "var(--tt-text-1)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      userSelect: "none", transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <span>{preview.period}</span>
                    <ChevronDown size={14} strokeWidth={SW} color="var(--tt-grey05)"
                      style={{ flexShrink: 0, transform: `rotate(${previewPeriodOpen ? "180deg" : "0deg"})`, transition: "transform 0.15s" }} />
                  </div>
                  {previewPeriodOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200, background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, overflow: "hidden" }}>
                      {PERIOD_OPTIONS.map(({ id }, i) => (
                        <div key={id}>
                          <div
                            onClick={() => {
                              if (id === "custom") previewPrevDateRangeRef.current = preview.dateRange;
                              setPreview(p => ({ ...p, dateRange: id, period: getPeriodRange(id, p.customRange) }));
                              setPreviewShowCal(id === "custom");
                              setPreviewPeriodOpen(false);
                            }}
                            style={{
                              padding: "10px 12px", cursor: "pointer",
                              background: preview.dateRange === id ? "var(--tt-grey02)" : "white",
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              transition: "background 0.1s",
                            }}
                            onMouseEnter={e => { if (preview.dateRange !== id) e.currentTarget.style.background = "var(--tt-grey02)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = preview.dateRange === id ? "var(--tt-grey02)" : "white"; }}
                          >
                            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--tt-text-1)" }}>
                              {getPeriodLabel(id, preview.customRange)}
                            </span>
                            {preview.dateRange === id && <Check size={14} color="var(--tt-secondary)" strokeWidth={2} />}
                          </div>
                          {i < PERIOD_OPTIONS.length - 1 && <div style={{ height: 1, background: "var(--tt-grey03)", margin: "0 12px" }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {previewLoading ? (
                  <>
                    <div className="tt-skeleton" style={{ width: "70%", height: 28, marginBottom: 8 }} />
                    <div className="tt-skeleton" style={{ width: "50%", height: 14, marginBottom: 24 }} />
                    {preview.reportType === "progress" && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div className="tt-skeleton" style={{ width: 140, height: 13 }} />
                          <div className="tt-skeleton" style={{ width: 30, height: 13 }} />
                        </div>
                        <div className="tt-skeleton" style={{ width: "100%", height: 6, borderRadius: 99 }} />
                      </div>
                    )}
                    {[0, 1].map(gi => (
                      <div key={gi} style={{ marginBottom: 32 }}>
                        <div className="tt-skeleton" style={{ width: 90, height: 11, marginBottom: 10 }} />
                        <div className="tt-skeleton" style={{ width: "85%", height: 14, marginBottom: 10 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                          {[0, 1, 2, 3].map(pi => (
                            <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "4/3" }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0a1629", marginBottom: 4, lineHeight: 1.15 }}>Raintree Hollow Residence Renovation</h2>
                    <p style={{ fontSize: 12, color: "#828282", marginBottom: 24 }}>11 North Raintree Hollow Court, Sienna Plantation, Missouri City</p>

                    {preview.reportType === "progress" && previewData && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
                          <span style={{ color: "#0a1629" }}>{previewData.completed} of {previewData.total} tasks complete</span>
                          <span style={{ color: "#16a97d" }}>{previewData.pct}%</span>
                        </div>
                        <div style={{ height: 6, background: "#e8e8e6", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${previewData.pct}%`, height: "100%", background: "#16a97d", borderRadius: 99 }} />
                        </div>
                      </div>
                    )}

                    {previewData && previewData.groups.length === 0 && (
                      <>
                        <p style={{ fontSize: 13, color: "#828282", textAlign: "center", padding: "32px 0 8px" }}>No activity entries for this period.</p>
                        {renderNoteSlot("empty")}
                      </>
                    )}
                    {previewData && previewData.groups.map(g => (
                      <div key={g.key} style={{ marginBottom: 32 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#828282", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                          {formatGroupLabel(g, previewData.grouping).toUpperCase()}
                        </p>
                        {g.entries.map((e, i) => {
                          const entryKey = `${g.key}_${i}`;
                          return (
                            <div key={entryKey} style={{ marginBottom: 20 }}>
                              <p style={{ fontSize: 14, color: "#303742", lineHeight: "1.6", margin: 0 }}>{e.note}</p>
                              {e.photos.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}>
                                  {e.photos.map((k, pi) => (
                                    <img key={pi} src={IMG_MAP[k]} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8, display: "block" }} />
                                  ))}
                                </div>
                              )}
                              {renderNoteSlot(entryKey)}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Footer CTAs — Download 25% / Copy link 25% / Save report 50% */}
            <div style={{ display: "flex", gap: 8, padding: "16px 20px", borderTop: "1px solid var(--tt-grey03)", flexShrink: 0 }}>
              <button
                disabled={previewLoading}
                onClick={() => handleDownload({ reportType: preview.reportType, period: preview.period, data: { ...previewData, groups: previewFinalGroups } })}
                onMouseEnter={e => !previewLoading && (e.currentTarget.style.background = "var(--tt-grey02)")}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "background 0.15s" }}
              >
                <Download size={14} strokeWidth={SW} /> Download
              </button>
              <button
                disabled={previewLoading}
                onClick={(e) => handleCopy(e.currentTarget.getBoundingClientRect(), { reportType: preview.reportType, dateRange: preview.dateRange, period: preview.period })}
                onMouseEnter={e => !previewLoading && (e.currentTarget.style.background = "var(--tt-grey02)")}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "background 0.15s" }}
              >
                <Link size={14} strokeWidth={SW} /> Copy link
              </button>
              <button
                disabled={previewLoading}
                onClick={handlePreviewSave}
                onMouseEnter={e => !previewLoading && (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => e.currentTarget.style.opacity = previewLoading ? 0.5 : 1}
                style={{ flex: 2, padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--tt-text-1)", fontSize: 13, fontWeight: 500, color: "white", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "opacity 0.15s" }}
              >
                Save report
              </button>
            </div>
          </div>

          {/* Custom date calendar for editing the period inside the modal */}
          {previewShowCal && (
            <DateRangeCalendar
              anchorRef={previewPeriodRef}
              onClose={() => {
                if (!preview.customRange) setPreview(p => ({ ...p, dateRange: previewPrevDateRangeRef.current, period: getPeriodRange(previewPrevDateRangeRef.current, p.customRange) }));
                setPreviewShowCal(false);
              }}
              onApply={(start, end) => {
                if (start && end) {
                  const fmt = (s) => {
                    const [y, m, d] = s.split("-");
                    return new Date(y, m-1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  };
                  const cr = { start: fmt(start), end: fmt(end) };
                  setPreview(p => ({ ...p, customRange: cr, period: getPeriodRange("custom", cr) }));
                } else if (!preview.customRange) {
                  setPreview(p => ({ ...p, dateRange: previewPrevDateRangeRef.current, period: getPeriodRange(previewPrevDateRangeRef.current, p.customRange) }));
                }
                setPreviewShowCal(false);
              }}
            />
          )}
        </div>
      )}

      {/* Fixed "Link copied!" tooltip */}
      {copied && (
        <div style={{ position: "fixed", zIndex: 9999, top: copiedPos.top, left: copiedPos.left, transform: "translateX(-100%)", background: "white", color: "var(--tt-text-1)", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", padding: "4px 8px", borderRadius: 4, display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--tt-grey03)", pointerEvents: "none" }}>
          <span style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid var(--tt-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Check size={8} strokeWidth={2.5} color="var(--tt-secondary)" />
          </span>
          Link copied!
        </div>
      )}
    </div>
  );
}

// ── Root ──
// ── Report Page (shared link view) ──
// Report content is fully reproducible from its URL params (reportType,
// dateRange, period) — rebuilt on the fly rather than fetched from storage,
// so a shared link works on any device/browser and can never 404.
function ReportPage({ reportType, dateRange, period }) {
  const data = buildReportData(reportType, dateRange, period, null);
  const html = buildReportHTML({ reportType, period, data });

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
  const sharedReportType = params.get("type");
  if (sharedReportType) return <ReportPage reportType={sharedReportType} dateRange={params.get("range")} period={params.get("period")} />;

  const [activeTab, setActiveTab] = useState("reports");

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
                11 North Raintree Hollow Court, Sienna Plantation, Missouri City
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
                <MapPin size={11} strokeWidth={SW} /> Houston, Texas
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
          <div className="flex items-center gap-2 pb-[1px]">
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
        <TabsContent value="reports"   className="mt-0 px-4" style={{ paddingTop: 16 }}><ReportsTab /></TabsContent>
        <TabsContent value="checklist" className="mt-0 px-4" style={{ paddingTop: 16 }}></TabsContent>
        <TabsContent value="files"     className="mt-0 px-4" style={{ paddingTop: 16 }} />
        <TabsContent value="activity"  className="mt-0 px-4" style={{ paddingTop: 16 }} />
        <TabsContent value="members"   className="mt-0 px-4" style={{ paddingTop: 16 }} />
      </Tabs>
      </div>
    </div>
  );
}
