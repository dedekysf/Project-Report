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
  UserPlus, Link2, ChevronUp, ChevronDown, X, Pencil, Trash2, Crown, AlertTriangle,
  Forward, RotateCw, ZoomIn, ZoomOut, Folder, ArrowLeft, ArrowRight,
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
const PROJECT_NAME = "Raintree Hollow Residence Renovation";

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
        pointerEvents: "auto", // guard against an ancestor (e.g. the side panel wrapper) turning this off
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
                background: selected ? "var(--tt-text-1)" : "transparent",
                border: isToday && !selected ? "1.5px solid var(--tt-text-1)" : "none",
                color: selected ? "#fff" : inBand ? "var(--tt-text-1)" : isFuture ? "var(--tt-grey04)" : otherMonth ? "var(--tt-grey03)" : isToday ? "var(--tt-text-1)" : "var(--tt-text-2)",
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
            border: "none", background: "var(--tt-text-1)",
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

// Photo grid thumbnail — the skeleton only covers the initial fixed delay,
// not how long the actual image takes to download, so each photo keeps its
// own shimmer placeholder up until it has genuinely finished loading.
function PhotoThumb({ src, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          width: "100%", aspectRatio: "4/3", borderRadius: 8,
          background: "var(--tt-grey03)", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--tt-grey05)" }}>No Image</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", cursor: onClick ? "pointer" : "default" }}
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

// Fixed 4-column photo grid. Beyond 4 photos, only the first row renders —
// the 4th thumbnail gets a "+N more" overlay, and clicking it reveals (and
// only then starts loading) the rest.
function PhotoGrid({ photos, onOpen }) {
  const [expanded, setExpanded] = useState(false);
  if (!photos || photos.length === 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}>
        <PhotoThumb src={null} />
      </div>
    );
  }

  const remaining = photos.length - 4;
  const visible = expanded || remaining <= 0 ? photos : photos.slice(0, 4);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 10 }}>
      {visible.map((k, i) => (
        <div key={i} style={{ position: "relative" }}>
          <PhotoThumb src={IMG_MAP[k]} onClick={IMG_MAP[k] && onOpen ? () => onOpen(photos, i) : undefined} />
          {!expanded && remaining > 0 && i === 3 && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                position: "absolute", inset: 0, background: "rgba(10,22,41,0.55)",
                border: "none", borderRadius: 8, color: "white",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              +{remaining} more
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Full-screen photo viewer — opened by clicking a thumbnail in the side
// panel. Dark chrome built from the design system's darkest token
// (--tt-text-1) rather than a plain black, with a filmstrip of the same
// entry's other photos along the bottom for quick navigation.
const truncateLabel = (s, n = 20) => (s && s.length > n ? s.slice(0, n) + "..." : s);

function PhotoLightbox({ photos, index, entryDate, taskName, onIndexChange, onClose }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);

  useEffect(() => { setRotation(0); setZoom(100); }, [index]);

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

  // No real upload timestamp in the data model — derive a stable (not
  // random-on-every-render) time of day from the entry date + photo index.
  const uploadedAt = entryDate ? (() => {
    const dateLabel = parseDate(entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    let hash = index;
    for (let i = 0; i < entryDate.length; i++) hash = (hash * 31 + entryDate.charCodeAt(i)) >>> 0;
    const hour24 = 7 + (hash % 11);
    const minute = (hash >> 3) % 60;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = ((hour24 + 11) % 12) + 1;
    return `${dateLabel} at ${hour12}:${String(minute).padStart(2, "0")} ${period}`;
  })() : "";
  const fileName = entryDate ? `${entryDate.replace(/-/g, "")}-${String(index + 1).padStart(2, "0")}.jpg` : `photo-${index + 1}.jpg`;

  const handleDownloadPhoto = () => {
    const a = document.createElement("a");
    a.href = IMG_MAP[photos[index]];
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
            width: 32, height: 32, borderRadius: "50%", background: "var(--tt-mint)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tt-secondary)" }}>MJ</span>
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "white", margin: 0 }}>You</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: 0, whiteSpace: "nowrap" }}>{uploadedAt}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, justifySelf: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</span>
          <Pencil size={13} strokeWidth={SW} color="rgba(255,255,255,0.45)" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0, justifySelf: "end" }}>
          <button onClick={handleDownloadPhoto} style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <Download size={16} strokeWidth={SW} />
          </button>
          <button style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <Forward size={16} strokeWidth={SW} />
          </button>
          <button style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <Link size={16} strokeWidth={SW} />
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
          <button onClick={() => setRotation(r => (r + 90) % 360)} style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <RotateCw size={16} strokeWidth={SW} />
          </button>
          <button onClick={() => setZoom(z => Math.max(50, z - 25))} style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <ZoomOut size={16} strokeWidth={SW} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 500, color: "white", width: 40, textAlign: "center" }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 25))} style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <ZoomIn size={16} strokeWidth={SW} />
          </button>
          <button style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <MoreVertical size={16} strokeWidth={SW} />
          </button>
        </div>
      </div>

      {/* Tag chips */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "2px 16px 14px", flexShrink: 0, background: "var(--tt-grey06)" }}>
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
      </div>

      {/* Filmstrip */}
      {photos.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "14px 16px", flexShrink: 0, overflowX: "auto", background: "var(--tt-grey06)" }}>
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              style={{
                position: "relative", width: 160, height: 122, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                border: i === index ? "2px solid white" : "2px solid transparent",
                padding: 0, cursor: "pointer", opacity: i === index ? 1 : 0.55, transition: "opacity 0.15s",
              }}
            >
              <img src={IMG_MAP[p]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span style={{
                position: "absolute", top: 6, right: 6, width: 12, height: 12, borderRadius: "50%",
                border: "1.5px solid white", background: i === index ? "white" : "rgba(10,22,41,0.35)",
              }} />
            </button>
          ))}
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
  { date: "2026-09-10", note: "Flooring installation started on the ground floor.", photos: ["img5", "img1", "img6"] },
  { date: "2026-09-09", note: "Exterior siding repairs completed on the south wall.", photos: ["img9", "img2", "img3", "img7", "img4"] },
  { date: "2026-09-08", note: "Final electrical connections completed in the main panel.", photos: ["img9", "img8"] },
  { date: "2026-09-07", note: "Plumbing fixtures installed in all bathrooms.", photos: ["img7"] },
  { date: "2026-09-06", note: "Ceiling lights installed and tested.", photos: ["img8", "img7"] },
  { date: "2026-09-05", note: "Bathroom tile installation completed on the second floor.", photos: ["img3", "img8"] },
  { date: "2026-09-04", note: "Kitchen cabinet hardware installed.", photos: ["img6", "img1", "img9"] },
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

  // completed = entries actually attached to this report (countable from
  // what's shown below), total = the whole project's activity log — so the
  // number is always directly verifiable against the visible entries,
  // rather than referencing an unrelated, invisible task list.
  const completed = groups.reduce((s, g) => s + g.entries.length, 0);
  const total = DUMMY_ENTRIES.length;
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
  const noImageCell = h("div", { style: "width:100%;aspect-ratio:4/3;border-radius:8px;background:#e8e8e6;display:flex;align-items:center;justify-content:center;" },
    h("span", { style: "font-size:12px;font-weight:500;color:#828282;" }, "No Image")
  );
  const renderPhotos = (photos) => {
    if (!photos || photos.length === 0) {
      return h("div", { style: "display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px;" }, noImageCell);
    }
    const cells = photos.map(k => {
      const src = IMG_MAP[k];
      return src
        ? selfClose("img", { src: toAbsoluteUrl(src), style: "width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;display:block;" })
        : noImageCell;
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
  // Manual notes never carry photos, so skip renderPhotos for them entirely
  // instead of showing a stray "No Image" box — and style them the same
  // italic, wrapped way the live side panel does.
  const entryHTML = (e) => e.isNote
    ? h("div", { style: "margin-bottom:20px;" },
        h("p", { style: "font-size:12px;font-style:italic;color:#303742;line-height:1.5;margin:0;background:#f7f8fa;padding:8px;border-radius:8px;" }, e.note)
      )
    : h("div", { style: "margin-bottom:20px;" },
        h("p", { style: "font-size:16px;font-weight:600;color:#0a1629;line-height:1.5;margin:0;" }, e.note),
        renderPhotos(e.photos)
      );

  const entriesHTML = groups.length === 0
    ? h("p", { style: "font-size:13px;color:#828282;text-align:center;padding:32px 0;" }, "No activity entries for this period.")
    : groups.map(g =>
        h("div", { style: "margin-bottom:32px;" },
          h("p", { style: "font-size:11px;font-weight:600;color:#828282;letter-spacing:.06em;text-transform:uppercase;margin:0 0 2px;" }, groupLabel(g).toUpperCase()),
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
function ReportsTab({ demoCase }) {
  const [reportType,  setReportType]  = useState("progress");
  const [dateRange,   setDateRange]   = useState("last_7");
  const [showCal,     setShowCal]     = useState(false);
  const [customRange, setCustomRange] = useState(null); // { start, end } date strings
  const prevDateRangeRef = useRef("last_7"); // dateRange to fall back to if custom is opened but no date is picked
  const [reports,     setReports]     = useState([]);
  const [openType,    setOpenType]    = useState(false);
  const [openPeriod,  setOpenPeriod]  = useState(false);
  const [toast,       setToast]       = useState(null); // { type: "success" | "error", message }
  const [deleteTarget, setDeleteTarget] = useState(null); // report pending delete confirmation
  const [lightbox, setLightbox] = useState(null); // { photos, index, caption } | null — full-screen photo viewer
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
  const [previewSaved,     setPreviewSaved]      = useState(false); // footer switches from Save to Download/Copy link once true
  const [previewCopied,    setPreviewCopied]     = useState(false); // Copy link button shows "Link copied" briefly
  const [panelClosing,     setPanelClosing]      = useState(false); // panel stays mounted during its exit slide
  const [panelEntered,     setPanelEntered]      = useState(false); // flips true a tick after mount to animate in
  const [visibleCount,     setVisibleCount]      = useState(10); // infinite scroll — entries revealed so far
  const [loadingMore,      setLoadingMore]       = useState(false);
  const [generating,       setGenerating]        = useState(false); // Generate button's own disabled/spinner state, before the panel appears
  const previewPeriodRef = useRef(null);
  const previewPanelRef = useRef(null);

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

  const reportOptions = [
    { id: "progress", title: "Progress report",  desc: "Schedule status, task rollup, and photos" },
    { id: "photo",    title: "Photo update",      desc: "Photos and notes, no schedule or task list" },
  ];

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
      const data = buildReportData(reportType, dateRange, period, customRange);
      if (!hasGroupData(data.groups)) {
        setGenerating(false);
        showToast("error", "No data for this period");
        return; // don't open the modal on an empty period — just the toast
      }
      setPreview({
        reportType,
        dateRange,
        period,
        customRange,
        extraNotes: {},
      });
      setPanelClosing(false);
      setPanelEntered(false); // starts off-screen; the mount effect below slides it in
      setPreviewPeriodOpen(false);
      setPreviewShowCal(false);
      setActiveNoteFormKey(null);
      setNoteDraft("");
      setPreviewSaved(false);
      setPreviewCopied(false);
      setVisibleCount(10);
      setLoadingMore(false);
      setGenerating(false);
    }, 900);
  };

  // Slides the panel back out first; the actual unmount (setPreview(null))
  // is deferred until the exit transition finishes, so closing animates
  // just as smoothly as opening does.
  const closePreview = () => {
    setPanelClosing(true);
    setPanelEntered(false);
    setPreviewPeriodOpen(false);
    setPreviewShowCal(false);
    setTimeout(() => {
      setPreview(null);
      setPanelClosing(false);
      setActiveNoteFormKey(null);
      setNoteDraft("");
      setPreviewSaved(false);
      setPreviewCopied(false);
      setVisibleCount(10);
      setLoadingMore(false);
    }, 260);
  };

  // Slide the panel in a tick after it mounts (so the browser paints the
  // off-screen starting position first, letting the transition actually run).
  useEffect(() => {
    if (!preview || panelClosing) return;
    const raf = requestAnimationFrame(() => setPanelEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [preview, panelClosing]);

  useEffect(() => {
    if (!preview) return;
    const handler = (e) => { if (e.key === "Escape") closePreview(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [preview]);

  // Click outside the side panel closes it — there's no backdrop to catch
  // this anymore. Suspended while the custom-date calendar is open, since
  // that popup renders as a sibling (not nested inside the panel) and has
  // its own outside-click handling.
  useEffect(() => {
    if (!preview || previewShowCal) return;
    const handler = (e) => {
      if (previewPanelRef.current && !previewPanelRef.current.contains(e.target)) closePreview();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [preview, previewShowCal]);

  // Show a loading skeleton whenever the previewed data would change —
  // both on first open and whenever the period is edited. Once it resolves,
  // proactively flag an empty period instead of waiting for the user to hit
  // Download/Copy link/Save report and get blocked.
  useEffect(() => {
    if (!preview) return;
    setPreviewLoading(true);
    setVisibleCount(10); // new period = new dataset, restart infinite scroll from the top
    setLoadingMore(false);
    const t = setTimeout(() => {
      setPreviewLoading(false);
      const data = buildReportData(preview.reportType, preview.dateRange, preview.period, preview.customRange);
      const finalGroups = applyExtraNotesToGroups(data.groups, preview.extraNotes);
      if (!hasGroupData(finalGroups)) showToast("error", "No data for this period");
    }, 500);
    return () => clearTimeout(t);
  }, [preview?.period]);

  const previewData = preview
    ? buildReportData(preview.reportType, preview.dateRange, preview.period, preview.customRange)
    : null;
  // Final groups with manually-added notes spliced in at their entry —
  // what actually gets downloaded / copy-linked / saved.
  const previewFinalGroups = previewData ? applyExtraNotesToGroups(previewData.groups, preview.extraNotes) : [];

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

    // Locked once saved — notes can't be added/edited/removed anymore,
    // since Download/Copy link now act on the saved snapshot.
    if (previewSaved) {
      if (!savedNote) return null;
      return (
        <p style={{ fontSize: 12, fontStyle: "italic", color: "var(--tt-text-2)", lineHeight: "1.5", margin: "10px 0 0", background: "var(--tt-grey02)", padding: 8, borderRadius: 8 }}>{savedNote}</p>
      );
    }

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
            placeholder="Describe the note for this task"
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
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--tt-text-1)", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", transition: "opacity 0.15s" }}
            >
              <Check size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      );
    }

    if (savedNote) {
      return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 4, marginTop: 10, background: "var(--tt-grey02)", padding: 8, borderRadius: 8 }}>
          <p style={{ fontSize: 12, fontStyle: "italic", color: "var(--tt-text-2)", lineHeight: "1.5", margin: 0, flex: 1 }}>{savedNote}</p>
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            <button
              onClick={() => { setActiveNoteFormKey(key); setNoteDraft(savedNote); }}
              onMouseEnter={e => e.currentTarget.style.background = "white"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, color: "var(--tt-grey06)", cursor: "pointer", transition: "background 0.15s" }}
            >
              <Pencil size={12} strokeWidth={SW} />
            </button>
            <button
              onClick={() => handleDeleteNote(key)}
              onMouseEnter={e => e.currentTarget.style.background = "white"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
              style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, color: "var(--tt-grey06)", cursor: "pointer", transition: "background 0.15s" }}
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
        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, marginTop: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "var(--tt-text-2)" }}
      >
        <Plus size={12} strokeWidth={SW} /> Add note
      </button>
    );
  };

  const handlePreviewDownload = () => {
    if (!hasGroupData(previewFinalGroups)) { showToast("error", "No data to export"); return; }
    handleDownload({ reportType: preview.reportType, period: preview.period, data: { ...previewData, groups: previewFinalGroups } });
  };

  const handlePreviewCopy = async () => {
    if (!hasGroupData(previewFinalGroups)) { showToast("error", "No data to export"); return; }
    await handleCopy({ reportType: preview.reportType, dateRange: preview.dateRange, period: preview.period });
    setPreviewCopied(true);
    setTimeout(() => setPreviewCopied(false), 2000);
  };

  const handlePreviewSave = () => {
    if (!hasGroupData(previewFinalGroups)) { showToast("error", "No data to save"); return; }
    pushReport({ reportType: preview.reportType, dateRange: preview.dateRange, period: preview.period, data: { ...previewData, groups: previewFinalGroups } });
    setDateRange("since_last");
    // Closing is left to the user — the footer switches to Download/Copy
    // link so they can act on the just-saved report before dismissing it.
    setPreviewSaved(true);
    setActiveNoteFormKey(null);
    setNoteDraft("");
    setPreviewPeriodOpen(false);
    showToast("success", "Report saved");
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

    const handleCopy = async (report) => {
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
              style={{
                width: "100%", height: 40, padding: "0 12px",
                background: "white", border: `1px solid ${openType ? "var(--tt-text-1)" : "var(--tt-grey03)"}`,
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "var(--tt-text-1)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                userSelect: "none", transition: "border-color 0.15s",
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
                        {renderPeriodLabel(id)}
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
                <tr key={r.id} style={{ background: "white", borderTop: i > 0 ? `1px solid var(--tt-grey03)` : "none" }}>
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
      )}

      {/* ── Generate preview side panel ── */}
      {/* No backdrop — the page stays interactive. The panel docks to the
          right edge *within* the centered maxWidth:1114 content wrapper
          (not the browser viewport) — an absolute-positioned element,
          right:0 inside a same-width invisible container. */}
      {(preview || panelClosing) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, pointerEvents: "none" }}>
          <div style={{ maxWidth: 1114, height: "100%", margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div
            ref={previewPanelRef}
            style={{
            position: "absolute", top: 0, right: 0, height: "100%", width: 580,
            background: "white",
            // Negative spread pulls the shadow rect in vertically so the blur
            // reads as a left-edge-only shadow instead of wrapping top/bottom.
            boxShadow: "-8px 0 24px -6px rgba(10, 22, 41, 0.25)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            pointerEvents: "auto",
            transform: panelEntered ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
          }}>

            {/* Modal chrome */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--tt-grey03)", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--tt-text-1)" }}>Draft {preview.reportType === "photo" ? "Photo Update" : "Progress Report"}</p>

                {/* Borderless period dropdown, stacked below the title —
                    locked once the report is saved, so it can't drift out of
                    sync with what was actually saved */}
                <div style={{ position: "relative" }} ref={previewPeriodRef}>
                  <button
                    disabled={previewSaved}
                    onClick={() => !previewSaved && setPreviewPeriodOpen(o => !o)}
                    onMouseEnter={e => !previewSaved && (e.currentTarget.style.background = "var(--tt-grey02)")}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      background: "none", border: "none", borderRadius: 6,
                      margin: "0 0 0 -8px", padding: "2px 8px", cursor: previewSaved ? "default" : "pointer",
                      fontSize: 14, fontWeight: 400, color: "var(--tt-grey05)",
                      transition: "background 0.15s",
                    }}
                  >
                    {preview.period}
                    {!previewSaved && (
                      <ChevronDown size={14} strokeWidth={SW}
                        style={{ flexShrink: 0, transform: `rotate(${previewPeriodOpen ? "180deg" : "0deg"})`, transition: "transform 0.15s" }} />
                    )}
                  </button>
                  {previewPeriodOpen && !previewSaved && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 200, minWidth: 220, background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, overflow: "hidden" }}>
                      {PERIOD_OPTIONS.map(({ id }, i) => (
                        <div key={id}>
                          <div
                            onClick={() => {
                              // "Custom date" only opens the calendar — dateRange/period
                              // (and the data load they trigger) stay untouched until an
                              // actual range is applied, not merely selected from this list.
                              if (id === "custom") {
                                setPreviewShowCal(true);
                                setPreviewPeriodOpen(false);
                                return;
                              }
                              setPreview(p => ({ ...p, dateRange: id, period: getPeriodRange(id, p.customRange) }));
                              setPreviewShowCal(false);
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
                              {renderPeriodLabel(id, preview.customRange)}
                            </span>
                            {preview.dateRange === id && <Check size={14} color="var(--tt-secondary)" strokeWidth={2} />}
                          </div>
                          {i < PERIOD_OPTIONS.length - 1 && <div style={{ height: 1, background: "var(--tt-grey03)", margin: "0 12px" }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
            <div style={{ overflowY: "auto", flex: 1 }} onScroll={handleModalScroll}>
              <div style={{ padding: 20 }}>
                {previewLoading ? (
                  <>
                    {preview.reportType === "progress" && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <div className="tt-skeleton" style={{ width: 140, height: 13 }} />
                          <div className="tt-skeleton" style={{ width: 30, height: 13 }} />
                        </div>
                        <div className="tt-skeleton" style={{ width: "100%", height: 6, borderRadius: 99 }} />
                      </div>
                    )}
                    <div style={{ marginBottom: 32 }}>
                      <div className="tt-skeleton" style={{ width: 90, height: 11, marginBottom: 10 }} />
                      {[0, 1].map(ti => (
                        <div key={ti} style={{ marginBottom: 20 }}>
                          <div className="tt-skeleton" style={{ width: "85%", height: 16, marginBottom: 10 }} />
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                            {[0, 1, 2].map(pi => (
                              <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "4/3" }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {preview.reportType === "progress" && previewData && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
                          <span style={{ color: "var(--tt-text-1)" }}>{previewData.completed} of {previewData.total} tasks complete</span>
                          <span style={{ color: "var(--tt-secondary)" }}>{previewData.pct}%</span>
                        </div>
                        <div style={{ height: 6, background: "var(--tt-grey03)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${previewData.pct}%`, height: "100%", background: "var(--tt-secondary)", borderRadius: 99 }} />
                        </div>
                      </div>
                    )}

                    {/* No inline "no data" message here — the proactive toast already covers it */}
                    {previewData && previewData.groups.length === 0 && renderNoteSlot("empty")}
                    {previewData && visibleGroups.map(g => (
                      <div key={g.key} style={{ marginBottom: 32 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--tt-grey05)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>
                          {formatGroupLabel(g, previewData.grouping).toUpperCase()}
                        </p>
                        {g.entries.map((e, i) => {
                          const entryKey = `${g.key}_${i}`;
                          return (
                            <div key={entryKey} style={{ marginBottom: 20 }}>
                              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)", lineHeight: "1.5", margin: 0 }}>{e.note}</p>
                              <PhotoGrid photos={e.photos} onOpen={(photos, idx) => setLightbox({ photos, index: idx, entryDate: e.date, taskName: e.note })} />
                              {renderNoteSlot(entryKey)}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Infinite scroll: one skeleton item while the next batch "loads" */}
                    {loadingMore && (
                      <div style={{ marginBottom: 20 }}>
                        <div className="tt-skeleton" style={{ width: "85%", height: 16, marginBottom: 10 }} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                          {[0, 1, 2].map(pi => (
                            <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "4/3" }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer CTAs — defaults to just "Save report"; once saved,
                switches to Download/Copy link (closing is left to the user) */}
            <div style={{ display: "flex", gap: 8, padding: "16px 20px", borderTop: "1px solid var(--tt-grey03)", flexShrink: 0 }}>
              {previewSaved ? (
                <>
                  <button
                    disabled={previewLoading}
                    onClick={handlePreviewDownload}
                    onMouseEnter={e => !previewLoading && (e.currentTarget.style.background = "var(--tt-grey02)")}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                    style={{ flex: 1, height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "background 0.15s" }}
                  >
                    <Download size={14} strokeWidth={SW} /> Download
                  </button>
                  <button
                    disabled={previewLoading}
                    onClick={handlePreviewCopy}
                    onMouseEnter={e => !previewLoading && (e.currentTarget.style.background = "var(--tt-grey02)")}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                    style={{ flex: 1, height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "background 0.15s" }}
                  >
                    {previewCopied
                      ? <><Check size={14} strokeWidth={SW} /> Link copied</>
                      : <><Link size={14} strokeWidth={SW} /> Copy link</>}
                  </button>
                </>
              ) : (
                <button
                  disabled={previewLoading}
                  onClick={handlePreviewSave}
                  onMouseEnter={e => !previewLoading && (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => e.currentTarget.style.opacity = previewLoading ? 0.5 : 1}
                  style={{ flex: 1, height: 40, padding: "0 16px", borderRadius: 8, border: "none", background: "var(--tt-text-1)", fontSize: 13, fontWeight: 500, color: "white", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "opacity 0.15s" }}
                >
                  Save report
                </button>
              )}
            </div>
          </div>
          </div>

          {/* Custom date calendar for editing the period inside the modal.
              dateRange/period are only touched on a successful Apply — closing
              or applying with nothing picked leaves the preview exactly as it
              was, so no data reload happens for an incomplete filter. */}
          {previewShowCal && (
            <DateRangeCalendar
              anchorRef={previewPeriodRef}
              onClose={() => setPreviewShowCal(false)}
              onApply={(start, end) => {
                if (start && end) {
                  const fmt = (s) => {
                    const [y, m, d] = s.split("-");
                    return new Date(y, m-1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  };
                  const cr = { start: fmt(start), end: fmt(end) };
                  setPreview(p => ({ ...p, dateRange: "custom", customRange: cr, period: getPeriodRange("custom", cr) }));
                }
                setPreviewShowCal(false);
              }}
            />
          )}
        </div>
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
  const [demoCase, setDemoCase] = useState("happy");

  const demoCases = [
    { id: "happy",   label: "Happy Flow" },
    { id: "error",   label: "Error States" },
    { id: "paywall", label: "Paywall" },
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
                Raintree Hollow Residence Renovation
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
                <MapPin size={11} strokeWidth={SW} /> 11 North Raintree Hollow Court, Sienna Plantation, Missouri City
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
