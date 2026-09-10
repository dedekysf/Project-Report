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
  UserPlus, Link2, ChevronUp, ChevronDown,
} from "lucide-react";

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

// ── Date Range Calendar ──
function DateRangeCalendar({ anchorRef, onClose, onApply }) {
  const today = new Date();
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

  const handleDay = (d) => {
    const key = toKey(viewYear, viewMonth, d);
    if (!rangeStart || rangeEnd) {
      setRangeStart(key); setRangeEnd(null);
    } else {
      if (key < rangeStart) { setRangeEnd(rangeStart); setRangeStart(key); }
      else setRangeEnd(key);
    }
  };

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

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
        <button onClick={() => shiftMonth(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--tt-text-2)", display: "flex" }}>
          <ChevronLeft size={16} strokeWidth={SW} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-text-1)" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={() => shiftMonth(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--tt-text-2)", display: "flex", transform: "rotate(180deg)" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${CELL}px)` }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} style={{ height: CELL }} />;

          const key      = toKey(viewYear, viewMonth, d);
          const isToday  = key === todayKey;
          const start    = key === rangeStart;
          const end      = key === rangeEnd;
          const selected = start || end;
          const col      = i % 7; // 0=Sun, 6=Sat

          // seamless range band: full-width bg between start and end (inclusive of selected ends)
          const lo = rangeStart;
          const hi = effectiveEnd && effectiveEnd > rangeStart ? effectiveEnd : rangeStart && !rangeEnd && hovering && hovering > rangeStart ? hovering : null;
          const inBand = lo && hi && key >= lo && key <= hi;

          // band left/right caps for rounded ends
          const isLeft  = start || col === 0 || d === 1;
          const isRight = end   || col === 6 || d === daysInMonth;

          const bandRadius = inBand
            ? `${isLeft ? "50%" : "0"} ${isRight ? "50%" : "0"} ${isRight ? "50%" : "0"} ${isLeft ? "50%" : "0"}`
            : "0";

          return (
            <div
              key={key}
              onMouseEnter={() => setHovering(key)}
              onMouseLeave={() => setHovering(null)}
              onClick={() => handleDay(d)}
              style={{
                position: "relative",
                height: CELL, width: CELL,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
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
                color: selected ? "#fff" : isToday ? "#000" : "var(--tt-text-2)",
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
        <button onClick={onClose} style={{
          padding: "6px 16px", borderRadius: 8,
          border: "1px solid var(--tt-grey03)", background: "white",
          fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: "pointer",
        }}>Cancel</button>
        <button onClick={() => onApply ? onApply(rangeStart, rangeEnd) : onClose()} style={{
          padding: "6px 16px", borderRadius: 8,
          border: "none", background: "#000",
          fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer",
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
  const now = new Date(2026, 8, 10); // Sep 10 2026

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

function formatGroupLabel(key, grouping) {
  if (grouping === "day") {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }
  if (grouping === "week") {
    const [y, m, d] = key.split("-").map(Number);
    const mon = new Date(y, m - 1, d);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const fmt = (dt) => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(mon)} – ${fmt(sun)}`;
  }
  // month
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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


// ── Image assets (base64) ──
const IMG_MAP_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAwCAYAAACWqXFuAAAKAUlEQVR4nO2cX27bxhaHv6ETJUgfyq6g9AVuEgEXiLKCMiuI82g4vpVXYGcFklcQZQWS4ch+TLoCMyuQChRQrBQ1vYLyKbdxI859GCqyxRlqSNHWvQk/gEg05JwZUz/On3MOJai4ymn/DPDmSkMebK2voDdfPc6qO1DxbVMJsGKlVAKsWCmVACtWyq1UyWlfpsqEDLj//MlNdOgbxAdONOX7QPtGe7ICqhGwYqVUAqxYKZUAK1ZKJcCKlVIJsGKl3GLU9RZeJYWrve4vIh7vRAvrD7ou9+74CH4C6X4pn8TnOGtD4k9D6juhda9N9uNJgzXnx9kJETGRv8JFsJT9PGTdT9UHNzmmfG+4+nvSIUGA0LInLrABPJpr7xwIkqMMfKCRtJPVhqerLLRuF1vieJ/6dtt4ftB1+e5OCxk3QbiZtgQ9Jhf7uYQy6nqs3dm1sy8CJvKA+lYv87plYsHj467qi4ZYHlB/3sTsdrHlCdniaQAvk3ayiIC3KHdPmLMPLrAL7HFV3POEif0e6m9O9en6puDfj37m3u0zpNxbKA4ASROndsaH45a1fef2wN6+9HHoMj56aWU/L+Ojlxbiu25awIDF4gMlnCZKGBs52mgkbbTJFh+oB7mbtKG99noEOO7vMpE9K2HME8fthSL8/ejnwval3GPc7+aul8WH45Z6EDTcrPjaBep5wBvsRNhAicnL2Yaf1E1RvgBHXQ9JZykbcdxmdOgb7U/i5exLmrw/2lvKxpQPxy3iuK09d3Pi22X5qEmX7BHNI2MkK8othAyKV3fCdFHNsL6REbF8hcOQmAgHl1hs4IiftZevrbXQrXXWai2k9iaESPkK+ffb5DqXCQ0cWuieWCFbDLo9q02UiSzxwVuD+CKW2wBEc5891FpMRwD8glqLRahR6Cn6KdpN7LQNthaJLwB+BYZJnx5hMaqKRRfkYnTo4zg6AQ75ePFE+2WP+w2kPNFOp7fx+MfW+ZUy0ybh48Vjo5hO+/opJp7sUP93z8r+/CYkW3zmv7d8mqjRa56sWHIbNWXPEwE/5GgDlOBeoH+ovKQt/SBD2VOwMCg+dp4Zv4z7W0Ni+Up77tPkagLE6NhDN5pJ+Srzy65d7KBGgauHWGsY62Qx7u/+j4gP9F9uSPaU3AYONOUu8KOm3LQmH5K9Kw9R4t03dSSdDaNbe02ciH9tDU1GvvBwew/zdGDm7ucOFzXNHym83LZ0rO9EQDkp9WoD1DGcLSI+F/0CPcTOPVI0S6mHXryPUX68KRuY/ZHPSC8JdLRRU39j/kR6BHSck9RRk9fjupiiBBJq+qJ7GtMIsWvlUF+WL7tvLUVHvgZqfTV/NIt10prQUO7OfX5quO5thg0dka4wPQKWjS5KUTQCUt8MOX0dadaLHk7tjPFRwGTyDgiobwfl/AEJ437jGsR3XXiojYbHbEo9R02ZQ/IJp2Eo103hubk+AY4OfdbWWkjpgwTHgWnMxXFQZTU47YfE5jVCili+whH6NYmUPo7jAy1O+yr6AUMk7/j4KVhCIG6yUdKdCzPXuDeLj1qv+QuuC4B3ljYbmrIIJeSluSZH9NFLHOdEiW8hHg5dbJ2bdz93sH2CpfSVg1i+4V7tT8b9bsGp2jU6vYUIqW/a9ef68JhN3b7F9T7mjYUN4RJ1r1C+AMfHXWNUoAzWdyJi5wlFbkLecJ+VTemXai8/HvbCK2JbR1RWA+UK8MNxyxgPLZP6pvLLxXGRQLqKtJQVCZnaOz3aKM1ePvSO9nIIDeWltVeeAEddz+gbEzIgZof4Yp0HW4IHWwLBY6R8wTLDeX27nQjxCXG8nyuqI+TLYtOxjAzlRaf3ZfAx75YDlJtkHbV4/QHlsjlg+d2rm6N+JiVuQmq+ttiUsnV/a4hayHY4fd0DQ0jOBrXjDb58Hh36CNHA4SlS6PsFIGp75PFbxvE+3OrhTAaaNaGLU3vDoLtqJzTADsrPd5mIWY6eh31SwZD09O4mZYFF/UzKGwEdrb8ozMwXnFL7e888shSgvh3w8HmH+8+fEDvTqTqN4Cdrm9MHqb4ZEosXhqsafHfnJteDDU1Zj7T45glRo6MNpt1y8QHjEuUJUGh3iYFV3fWdCERUWl8uU99UD4FyyczjWVq5+iDVt3rIWB8+lHKv1PVlNg1Nma17JbK8LjCUN7Hf+LgY7rXdFCytEj6jVJkoKZQ25bT/BkQjVf7xkzkRYcokPscpMffi4fYep/2f0IlAyBa/9QOr8KUZ1+KakPQXO/95WYLk8DXnuqh1ZZhR3yVjuteMgNqp0GPQdTMaARmfp8ukz2/9RmY9UMF9mxsn43OQXuqwmfYcoZtuw4X1soidZwYbLrd5s/CeZffhkaF8UV27e5lvCjUFCjxUdrRuJ+6iRDvAHE3RCVCEmutc7tVOvohp0HUZHfqMj074o69CPZK32hZuc8Ko39SeG3Rd5bqxTGA1tTHNctbtQgddN0nDT5+T1tOVnvpmSBzvGM563Ltjk3kdGcp91LsdXvLZRSUGXLap679Ldpp9I7HRtujblABz6M1NbJ2hxHaS/HuGxUYnPSe9P+wgnF3rrl3O2RsfZUQ/ZIRwhiBD9ZEGGU9GQo8HW1e/4Mw2SMJv0zaEC7FvjGLEznoqilHkpaT3r/cQQp+w4Tht/rm5KNSYx5EcMsvscVFftJtx7fSAWXw4C90OetrWwKJ+LtIjoGmUsUKadoeAcFVojCaSJovFp2ciprl9hi5cbkNumMUX75cWQnv4vAOG+5b1esGMooH9iIxcO2ZJCc3k8Aq2M22rWAQqg7QA69uB0W2xiPtbQ2JMU1I51DfDwqG4KbE8sHIP5WGW9JrGcRY5qXsU96l1yBZhmYSofEG9B0BPhDlj2uCGqW+3C4uwvtUjdtbJIxDJq1zXT0UYy5wjh4yQ8sW1vCi0vhMheGbcxDm1NwssPKO4CNuoqTO0vD4in4jm6+6hlgFZUZVpG4/BvMbP9kuoHLg95WROTWUhcZw9kowOfRBNHB5ddZ/ICMGQiXzHX587PN6JeN/v4MirvxIwEe8Wvkg+OvYQkw1z1CNpK+YX/vP34peQdP2AiPvPM5YXl/vTb7Im9Q7uiTywyFNsonaovuZcgHrJqLOg/lPUdNu4VB6iohrvmK3xdOvWA/I/CA2u+vqGpNO1dLvh0N4xNui63E0Wu7Y/ybEK5qe6m/pJjuvBu/T/iBKzUFaA1JQFN92Jiv8/fJR45o9mCTY6pfWy4qvFRS8ew/vfWroGG36J/az4ijlBLyCbxIuWoe7ZtfS04qvERy8iCcbXKVzUJsdUrwll/zJCxdfMomjNkNkmySPb6R1S1nvaFd8MHmraNI1otocu1FlRYYXHciIsPZZc8W3SJp8Q/8SQfVOtASuK4qJSvnxU7qLHLCsnYhZ5+QXlcI50Rv4LB1kX4crY+i8AAAAASUVORK5CYII=";
const IMG_MAP = {
  "img1": "data:image/jpeg;base64,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",
  "img2": "data:image/jpeg;base64,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",
  "img3": "data:image/jpeg;base64,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rxbn/gVTgADtxQA6xsrq91L+09SRYSq7YIBg7B6k+tbfb1ooxQAZozRiigAooooAKTpS9jRQACjHNLSUAFFFFABiiiigApMUUtABSUvWigBKMiikoAKKKSgBO9FFFACGkpcUlABRR0ooAQGlzTRnFLQA7PNLTaWgB1FIDS0ALR+FJS0AFGD2oxRigAzilpDQKAFooooAWikpaACjFH4UUAGKQ9qdSGgBaSlooAMUtFFABS0UtACN0z6UtI3SjNABRmiigApaQUUALRSUUAHFFFFABRRRmgA6VgeHPMQ6hBKm0pdMxyefm56Vv1h2YNv4kv0Z932pFmUD+HHy4oA2fx/Ojn0oyaPpQAUUUZNABRRR+NAC44pKO1FAC4pKKKACiikoAWiikoAKKKXNACUfhQaKAEopcUUAJ9aT6UtJQAlJTqaaACg0fSmkUAHFFHPrRQAgHp0paaDntS85oAcBS9qb0paAHdaUUgooAdRSUCgBaKO9FAB/KiijigAoozS0ALRSUUALRRS0AJRS0UAApaSigBaWkFFAC0UUUAB5GPWikz8wpaACiiigAoooz2oAWkzQRnGQOKMUAFFGKKAA80uMdKSg0AHFYDEL4zKomM2YLH1+bit+ueAZ/Gc8h4WK2Vfrk0AboNLSUtABjFFJRQAtJ+VGfxpNwPT+VADhjH/180UnbmloAKKSloASg0uKSgAooo70AFJQaKACiigZoAOneij9aKAEoo6e1FABSGikoASkzS0lABRSdKKABenNDc0oGBQDyBQABB6UuAOnSlpOtADhRQBRQAtFA6UooAKMUH86KADFLSD2ooAKWjtRQAtFH1ooAKKKKADNGaKM0AG4etG760UUAG/0BNGT2GPrRSUAKS3tRkn/AOtRRQAmDuyGI/lTGklRgdodO4HB+tPooAi+1qD86lV/v8YH19KsConjWRSrqGU8EEZzUCeZabVGZIOnXLIP6igC7QM801WDAFSCD0Ip1ABRRSdqADIopRSZoAWikzRzQAtc287XPjMLA37u3tysuB1JOQPzq9resx6XbFQd11IuIo1GST61V8Oac9pbtPOm24m5cHqPagDcBo60AUUAFFFJkKAM9aACg/Wl7UmM84/SgBcYHFFHWlFABR3opOaACiik5xyeaAF+lNJ5pc0YoAM5o/GiigAxRSd6XFACc0UuQKKAE+tFFJQA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",
  "img4": "data:image/jpeg;base64,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",
  "img5": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCAGQAlgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyWiiipAKKWigBKSlpKACnU2nUAFLSUtABR2ope1ACDvRQOtLQAUUUUhhThTadQIa1JStSUwCiiigBKKWigBKKKKACiiigAooooAKSlpKACiiimAUUUUAd/wCAv+QTP/12/oK6o9a5bwEP+JPN/wBdj/IV1ZHzGsyxAOadQKXFABilAooFAgFOxQBzS4oAFHzD61sp956yEHzj61rR9ZPqauImYV//AMfUn1qi3Sr19/x8yfWqbDisnuWiFuprMtxnVj9R/OtRxWba86u3+8KllHVDpTxSCnCtjISgCloFABRS0tACUUUtACClopaYhKKWgUAJS4opaAEpaKWgBKKWigApKWigBO1FKOlFACUUtFACUUtFAHgdFFFAC0UUUAJSU6koASnU2n0AFFFFABS9jSUvY0AA70UdzRSGFFFFABTqbThQDEam05qbTEFFLSUAFFFFABRRRQAlFLRQAlFFFABSUtFACUUUUAFFFLQB6D4CH/Eml/67H+Qrqm6muW8A/wDIGl/67H+QrqT1qCxRS0ClFABRS0d6BCgU6kFLTAWMfOPrWtF1f6msuMfvF+orVj/j+pqoiZg3v/HxJ9apt0q5d8zv9apsKye5aImrNshnVW/3xWm3Ss7T+dWb/fqXuV0OqFKtApQK2MgoApaWgBKWiigBKWjFLQAlFLRTEJS0UtACYpaWigBKWiloASilooASijvRQADpRSj7tFACUUUUAFFFFAHgVFFLQAUUUUAFJS0lACU+mU+gAoopaACg9DRR2NIYdzRR3NLQAlLRRQAU70ptO9KAY1qSlakoEFFFFAxKKWigQUlLRQMSiiimISilooASiiigBKMUtJQAUUUUAeieAR/xJZP+ux/kK6kiuX8AjOiP/wBdz/IV1J61BYopRSCnUCE70tFAoGOFLihaWmIdD/rU+orUi6P9TWZCP3yf7wrUiHyt9TVREzAu/wDXv9aqtVq55mf6mqp61ky0Rt0rO0wZ1Z8/360WqhpXzao5/wBup6ldDqF6UopF6U4da2MgxS0lLQAUGloNACUUtFAABRSijFMQlLRS0AFFFLQAmKKWigAooooATvQaWg0AC/dFJSjoKMUAJRS0lABRRRQB4DS0UUAFFFFABSUtJQAlP7UynigApaKKQwo7Gil7GgBO5paTvS0AFFFFABTvSm070oAR6bTmptAIKKKKACiiigAooooASiiigAooopiEoo70UAFFFFABR2oo7UAei+Af+QG3/Xdv5Cup7/jXLeAD/wASSQek5/kK6ruagsSnUmKWgBaAKXtSigQCnU0U6mA+D/Xx/UVqRfcb6ms23GbiP61pRf6tvxqokswLj/WP/vGqp61an/1j/wC8arHrWTNERPVDRx/xMXP/AE0IrQfpVHRh/pzD0cml1H0OmXpS0L0pe9amYUtFFAB2oNLRTAKKWkoEFLRRQAUUUtABS0UUAJ3paKKACilooAbQaWkPb60AKOlFL2pO1ACUGlooASilooA8AooooAKKKKACkpaSgBKeOlMp46UALRRRSGFL2NJT2ZSqhVxgcnPWgBg60tIOv4UtABRRRQAU4dqbTh0FIBGptPfqaZTAKKWkoAKKKKACiiigApKWkoAKKKKACkpaKAEooooAKD0NFB6GmI9H8AjGgsfWdv5Cuo9frXL+A+NAz/03b+QrqPWo6lC0tIKcKBh2pRR2pRTEAp1IKWgCS1/4+I/rWnF/qjWbbf8AHxH9a0ov9TVxJZz8/wB9vqarmrEvU/U1XNYs0RG/SqWic3rkdNxNXZBwfpVLQv8Aj6Y/7R/lS6ofQ6ZelLSDpS1qZhS0UtACGilpKYC0UUUCAUtAooAKUUlLQAtFFFAAKKBS0AJRS0UAIaaadSHpQA7tSU+m4oASil7UYoASiiigD5/ooooAKKKKACkNLSGgBKeOlMp46UMBaKKKQxaKKKAEH9KWkH9KWgAooooAKeOgptOHQUgEk600U5+tNpgFFFFACUUUUAFFFFABSUtFACUUUUAFFFFACUUtFACUHpRQehpgek+Ah/xT5/67t/IV0/rXM+Av+ReP/Xdv5CunxUjAU4UlOoAO1AopRzQAClopaAJbX/j4j+taUfEJrOtf+PmP61or/qDVolnPS85+pqA1Yl4yPc1A1ZM0RDJ0NVNBGbg+xJq5J90/SqugDFwffP8ASp6ofQ6OlFHagVqZhS0UUAFFFKOopiCilpKAAUtAooAKWkpaAFoopaAEFKOlJS0AJS0UUAJTadQB/OgB1J3p1JTATFGKKWgBtFLRQB8+0UUUgCiiigApDS0hoAKcvSm08dKGAUtJS0hhRRRQAg/pS0g7fSnUAFFFFABTh0FNpR0FIAfrTac/X8KaOlMAooooASiiigAooooAKKKKAEooooAKKKKACikpaADFIehpTSHoaAPS/AXHh4n/AKbt/IV01cz4CIPh8jPInb+QrpzSGAp1IKdQAhpy9KTvS0ALRQKWmIltf9en1rRX/j3P0rPtBm4Qe9aHS2b6VSEzn5epPqTUDVPJUJ6VkzREMv3T9KreHh++P0arMv3D9Kr6BxKp9Q38xU9UPodF2pRRxRnmtTMWijNFMApR2pO1KOcUCCg07tTKAF7fWlpB0FLQAUtJS5oAKWgGjNAB3paSlzQAUlLSUwCkHb60uRSD7340gH0lGeaM0AFFISKTcKAFopNwooA+faKKKADNLmkpaADNIaWjFACU5elNIpy9KGAtLSUtIYUopKUUAJ6UtIKWgAooooAKcO1Npw7UgEkpop7KWzjsKjFMBaKKKACkpaSgAooooAKKKKACkpaSgAoo70UAFFFFAC009DS0h6GgD0vwCP8AiQN7zt/IV09cz4B/5F9v+u7fyFdORSGKOlLSCnUAFFFLQAClpB1p1MRLa/69K0RxbH6VnW3/AB8J9a0elqfpVITOfk61A1WJOpNRBC7DFZMsi8oyfKKlsrAWcOxSCck5Iq0kQQcVIKLDuRqrDjNBVumRUmKXFOwiMI2OtLsb1p4pcUWAi2N2NKEbI+apKB1osFxpQ/3jTdj/AN7ipqSnYVyPY2PvUbG/vVJRRYLkexv71KEb+8fzqSgUWC4zY2eW4pdh7OafiiiwXGbGz980bD/fNPoosFxmw/3zRsbH3zUmKCKLBci2Nn79IEfcPn4qSlUZNFguM2N3c0eWf7xqUikxTsFyLyz/AHjSeX/tGpaTFFguR+X7mipMUUrBc8CoooqiQoopaADFGKKWgBMUuMUUUhi0UUUAFKKSlHWgBPSlpKWgAooopAJTgcCkpKAAkk0mKXFFMBMUUuKMUAN/OinYpKAE59aM0tJj2oAM0Zoo4oAM0ZpMUYpiF70UAUUhhRRRQAUh6GlpD0NMD0zwB/yL7f8AXdv5CuoxXL/D3/kAv/13b+QrqcVIwFLSUtABS9qKO1MBRS96QUtAiS3/AOPhPrWnnFoT7Vm2wzcKPr/KtDzVWEKeSR0qkJmIyFmwKkWMKMCrXkLuJ55o8lePb9anlHcrgUuMVP5I9R+VOEYHbNPlC5XoxVnYvoKPLX0FHKFytilxVjy19BR5a+go5QuV6B1/CrPlr6CgRKCcd6OULkGOKMVY2LRsX0FOwrlfbRirHlr6CgRiiwXK+KUCrHlj0FGxc9BRYLlfFLip9g9qNg9qLBcgxRip9go2LRYLkOKCKm2Cl2j2osFytilUcmpxGAc0uwDoBRyhcgoqcqPQUmwe1HKFyDvSEVY2CjaPajlC5XxRU/ljOcCijlC5880UUUgClpKWgApaSlpDCiinbTtDdulACUUUUAFLSUtACd6WkPX8aWkAUUUUASQ7Mt5nTacfWo6KKBhSUtFAgpKKKYBRRRQAlFFFABRRRQAlFLSUAFFFFABRRRQAUh6GloPQ0wPSvh9zoLj/AKbt/IV1IOTXK/D7/kBSf9d2/kK6odTUjFpTSUGgB1LSClpiDtTqTtS9qAHQyGKVXAyR2NPaRSTwwycjmoh1/Gl+tAD93oTS7vc0zFLTAfv9z+VLvHqfypgoouIfuHqfyo38dTTaKBjw47k0BvUmmUtFwHb/AEJpd3uaZRRcCTePejd7mmUU7iH7h70u4e9MoouA/d7mjd7mm0UXAfu+tG4e9MpaLgO3fWgEe9NoouA7d9aNwPrTaKAHbh70ZHvTaWi4C7h70bvrTaKAHbvrRuHvTaKLgOJHvRTaKLgfPdFFFIApaSloAKWkpaQBT937oL2zmmUUDFooooAKWkpaAEPX8aWkP9aWkAUUUUAFFFFABRRRQAUUUUAJRRRTAKSiigAoopKACiiigAooooAKKKKACkPQ0tB6UAelfD7/AJAEn/Xdv5CupHU/U1ynw9IOhSjPInOfyFdWvcUhi0UUh6UxElApuetLnigBRTu1MBp46UAJ/EPrTx0pn8Q+tPHSgBaWkFFAC0tJRQAtFFFMBaKKKAFooooELRRRQAUUUtABRRQaAFopKWgApaSlpgFFFFABRRRQAlFFLQAUlLRQAlFFFAHz3RRRSAKWkpaAClpKWgAooopDFooooAKWkpaAEP8AWlpD/WlpAFFFFABRRRQAUUUUAJRS0UwEooooASiiigApKKUKT0FADTRmkIIOCMUmaYh9FNzS5oAXtRRmikMKQ9KWkPSgD0n4eLjQpTgcztz3PArqwOv1Nct8PR/xIJP+vhv5Cuqx1+ppDENITTjUTHH50ASE0gbFMLVGZQvemIn3461IrZ6HrXLax4uttLcxRr9ouD/Ap4X6n+lc6vinXb3P2ZliUHhY1AP5nk0rjPTT1HPenjpXBWHirU4nzqETuqgElADx6lev4iu0sNQg1C2Wa3cMreh6e1CdwaLVFFApiFoopaAClpKWmAUtJS0AFLSUtABRRRQIWiiigBaKKKYBiiiigBaKKKACiiigAooooAKKKKACikooAKKKKAPnuiiikAUvakooAWlpKKAFooopDFooooAKWkooADS0hpaQBRRRQAUUUUAFFFFACUUUUAFFFFMBKKKKAEqXDBOnFRGnCUkYoY0NY7xg9ulR1IeOaZTQmFGeKKD0piFBp1MHSn0mMKQ9KWkPSkB6V8PG3aFKuPuznn8BXWnrXJ/Ds50GQelw38hXT3EohgklPRFLflSGVNQ1iy01gt1OEdhkL1OPWlhvIbyMS28gkjJxuFeVapdtcO9wVJeRy2Sen0re8F3ri4lgJYiVN230YYwf6UeYeR3DSYJrnvEWsnT7Q+Wf3j8L7e9a0kvy57gc1xHiiRjdQY5GD1qbjsYLuY5C8gWSRjn5ufxqwvmJLbXTHKFwPYDt/UfhVANuky2W5qxJcFYfssZ3Rht+SOQe4q7E3Ops3t7XXb1wpZIrYqozn5iSBV7RpTbRjUrd1UvPtWMD/WRgYJP15INcnYwXV7HdPbzgyhN0iE/My9yPXFa+hahmdS0QeOMBFhbo319v51LKR6gGBAZTlWAIPtS9Ko6VI0tgm8YdSQwHbmr9UhAKWkpaYhaBRRQAUtFFABS0UUAFFLSUCFooooAWikoFAC9aKKKAFooopgFFFFABRRRQAUlLSUAFJmloNIAopKKYHz5RSZpc0gClpKKAFpaQUtIYUUUUALRRRQAUtJS0AIaWkPeikAtFFFABRRRQAUUUUAJRRRQAUUUUwEooooAKbinUUANIz1pMU6kpgJig0tLQA3rTqKKACgY3DPIzzRSHoaQHp3geNIdOulj4QXBwOv8ACK37xTLaTRjqyED64rmfAEjPo85Y8mc/+giunc1HSxfU8dnEpSSBgAyfwngjnmtnwj5z6kVXHlxgSPkdxgD+ddTq3hi11OYT7jDL/Eyj731qXT9GttItnjtwS74LyN1b/wCt7UOWgKOosjHDVz+t2P2uPOOVzXStHwaj+yh85Gay1L0PKhw30p5GCwJ5PINdJ4j8MyWmLqyiZomPzogJKn1+lc8Bhlhded3ORyPaui9zG1jQtLtfMtP3aQi3B3yJ1ce9aGgR3TXE11ZSRqCxALDJU+3NYkUayeaEyCuCuT2rrPD2j/2tcrLJC8EaYMhAK59ge+f0qGUjtdERxp6yzSGSWYl2c9+39K0qZFGsUaxoAqKMADsKfVrRCYtKKSlpiClpKKAFpaSigBaBSUtAC0UUUAFFFFABS0UUCCiiloASlpKKAFopOlFAC0lLRQAlFFFABRSUUALRSUUAfPeKMUtFACUUtFACUuaKDQAbqUHJptC9aAJKKKKQwpaSigANLSGlpAFFJS0AFFFGCaACikzRmgAoozRQAUUUUwEopaSgAooooASiiigAooooAKKKKACkPQ0tIehoA9D+H5/4k04/6bn+QrqWNcp8Px/xKZz/ANNv6CurYVD3LQymMuRUu2l2cVNh3K5iyalSGpdnNTKvFUkJsYkQAxVG98OabfzJPcWqmRe6nbn6461qgU4jiqsTcxLfwxpNvdxzRWgV1PHzEj8q2wAAAOAOgpMfMv1qTFCQNgOlKOtJSiqELRRRQAtFJS0ALQKTmloAWikpaAFopKWgAooooAKKKKAClpKKAFopKWgAooooAKKKKACiiigQlFLRQAlFFFAHz5RRRQAUUUtABRRQaAG0L1ooHWgB9LRRSGFLSUtACGilpKQC0UUUAFOTvTKcnegAZeM0zFSt92o6EAlJTqKYDaKWjFACZozRijFABmjNGKSgBc0UlFAC0UlLQAUUUUAFIehpaT1oA9C+H3/IIuf+u/8A7KK63Fcj8POdKuxjpMP/AEGuxI5/Gpe5QwLTgvFPApccUAIF5p6ilA5pcYpiFpabRmmIco+dR6tinmmDho254cdPy/rT2+9igYlKKSimIWlpKWgApaSloAKKKKAFooooAWiiigAooooAWikpRQAUUtFACUtFFABRRQKACilpKACiiigApKWkoAKKKKBHz5RRRQAUUUUALRRRQA2gdaKB1oAkopKWkMKKKKAFNJRS0AJS0UUgEpy9aSlXrQA4/dplOP3aZQgCiiimAUlLRQAlFLSUAFJS0UAJRRRQAUUUUAFFFFABRRSGgD0L4d/8gu7/AOuw/wDQRXYn7x+tcb8OT/xL7wf9NV/lXZ96RQ4CjtQKUjigBw60tIOtFMkWkpaKAJYkLthcZAyAahmLo3UA+jDpVm0/1p/3TVi+hV4N5AJWhrQaZlCdv9ml88+o/Km/Ztw4Y/hR9j4+8351HvFaDxM3cr+VHnn+8Pypos8H77fjS/ZB6mn7wtBfOP8AeX8qXzj/AHh+VILQY6ml+yD1NGoaB55/vD8qPOP94flS/ZR70fZR70ahoHnH++PypPPb+8Pyp32Qe9H2Ue9GoaCeef7w/Kl88/3x+VH2RfenfZRRqF0N87/b/Sjzj/f/AEp32Rfej7KvpTswuhvnH+/+lHnf7f6U/wCyr6UfZF9KLMLob5x/v/pR55/v/pT/ALKvpR9lX0oswuhnnf7f6Uef/t/pT/sq+lH2VPSizC6Gef8A7f6Uef8A7f6U/wCyp6UfZUz0oswuhnn/AO3+lJ53+3+lSfZU9KPsqehoswuiPzz/AH/0o8//AGz+QqT7InofzpPsaZzg/nRZhdDPP/2z+QpPPH99ql+yIf4aT7HH6frRZhdEfnD++1FSfZIx/DRRZiujwKiiiqJCiiigBaDRRQA2gdaKB1oAfRRRSGLRRRQAUUtIKAFopKWgApV60lKvWkAp6UynnpTKEAUUUUwCiiigApKKKACiiigApKWigBKKKKACiiigAoNFIelAHoPw5/5B97/11X+VdpiuL+HP/IOvP+uq/wDoNdoKQx1B6UUdqAFpaSgUxDqO1J2pT0oAntf9b+Bq5ejNme3IqlbHDE/7Jq9eH/QmqlsHUx45fLk2t901bGG6Vmylt33fzNPt7lkbD9PrUJjaNDbS4oVgwyKWrJExS4paKAExS4paWmA3FGKd2ooATFLilooATFGKdRQAmKMUtFACYoxS0tADcUYp1FADcUYp1GKAG4oxTsUUANxRinUUANxRinUlACYopaKAPnaiiipAKKKKAFpKKKAEoHWijvTAfRRRUjFooooAKBRRQAUtJS0AFKvWkoXrSAcelMp56UygBaSiimAUUUlABRRRQAUUUUAFJS0lABRRRQAUUUUAFIelLSHpQB6D8Of+Qfef9dV/9BrtBXF/Dn/jwvf+uq/+g12g60hju1B6UUvagA7UCgdKBTAWjtRQelAia26n/dNX7r/jyP4VRtup/wB01du/+PL8qpbB1MKXrUJ61NL96oT1rJlokTUBaDMuSmQOK102uu5WBB7iuU1T/j2/4EK19IdjaZLE8nFOMtbClHS5rbPel2jHWq+9vU0bj6mtLkFjaPWl2j1qvvb1NLvPrRcLE+0etG0etQbz60bj60XCxY2j1pdo9ar7z60bz60XCxY2j1o2j1qDcfWjcfWi4WJ9o9aNo9ag3H1o3H1ouFixgetJt96h3H1pNx9adwsT7R60YHrUO4+tJuPrRcLE+B60uPeq+4+tLuPrSuFifHvRt96g3H1o3H1ouFibHvRt96g3H1o3H1ouBPj3ox71BuPrRuPrTuBMR70VDuPrRSuFj56paSlpAFFFFABRRRQAlJ3paSmBJRRRUjClpKWgAoFFAoAKKKKAFpU602lXrSAcelMp56UygAooopgJRS0lABRRRQAUUUUAFJRRQAUUUUAFFFFABSHpS0h6UAd/8OD/AKHfD/pov8jXbelcP8Of+Pa+/wB9P5Gu49KQxRS9jSUvY0AKKBSClpgApe1FJQInturf7pq9dn/Qj+FUbb7x/wB0/wAqu3Z/0H8qa2DqYUvU1Calk61CazZaKGpn/RT9RWvo5/0FfqayNT/49W+orW0j/jyX6mlH4hy2NCikpa1MwpaSigBaKKKAFooooAWgUlLQAUtJRQAtFJRQAtFGaSgBaKSigBaKSlzQAUUlFAC0UmaKACiiigD58ooooELRSUtABRRRQAlJS0lMCSikHSlqRhRRRQAtAoooAKKKKAClXrSUo60gHdqZTu1NoAKKKSmAUUUUAFFFFABRRRQAlFFFABRRRQAUUlFABRRQelAHdfDlv3d8vbKH+dd16Vw/w5Gbe+PoyfyNdx6UhjhS9qaKWgBaKKKYCijtQKD0oAmtuWb/AHTV28/48vxFUrfhm/3TVy85sh9RTWwuphSdah9alkqI96yZZR1T/j1P1Fauk/8AHmv1NZOq/wDHqfqK19K4s1+tEfiG9i8KWkpRWpmLRSUtABS0lLQAUUUUALRSUtAC0UlFAC0UlFAC0UUUAFFFJQAtFJRQAtFJRmgAooooAKKSigD5+ooopiClpKKQC0UUUAJSUppKYDx0paQdKWpGFFFFAC0gpaSgBaKKKACgUUDrQA6m06m0gCkpaSmAUUUUAFFFFABRRSUAFFFFABRRRQAlFFFABQelFB6UAd38Oc/Z7/03IP0Ndz6Vw/w6/wCPO/P+2n8jXb0hjqWminUAFFHaigBaU0goNMCe3+83+6auXgzZenIqnb/eb/dNXLv/AI8fyp9BdTBk71D3qaSoayZZQ1T/AI9v+BCtjS/+PJfrWPqn/Ht/wIfzrY0z/jzSiPxDlsXu1FJS1qZi0UUUALRSUtABS0lFAC0UUUAFLSUUALRSUUALRRRQAUUUUAFFFFABRSUUAFFFFABRSUUAfP8ARRRTEFFFFAC0UlLSAQ0lKaSmA8dKWmjpS1IxaKKKADtRRRQAUtJRQAUopKUUALSUtJSAKSiimAUUUUAFFFFACUUUUAFFFFABSUtFACUUUUAFFFB6UAd58Ov+PO/H+2n8jXbVxHw6/wCPbUP95OPwNdvSGKKd3ptLQMXPFKOVB9aQdKKBCig9qQUp7UAT2/3n/wB01du/+PE/hVG3PzN/umrt5/x4n8KpbC6mDJ1qE1LJ1NRHvWTNChqn/HsP94Vs6Z/x5x/SsXVT/ov/AAIVs6X/AMeUf0oj8QS2LxoooBrUzFFKaQUUALRSUtABS0lFAC0UUUALRSUUALRSUtAC0lFFABRRRQAUUUUAFFFFACUUUUgCikNFAHgFFFFUIKKKKAClpKKQAaSlpKYDh0paQdKWkAUtJRSGLRR2ooAKKKKAClFJQOtADqSlptABRRRQAUUUUAFFFJQAUUUUAFFFJQAtJS0lABRRRQAUHpRQelMDuPhy2Bfjsdh/nXdd64b4c423/r8n9a7jvU9ShadTRS9qADtThTQeKUUAKKD2pBSnkigRNbn5n/3DV685sT+FUIP4/wDdNX7v/jyOPaqWwmYEn3jUJ6mppOpqA9TWRoUNVP8Aov8AwIVtaZ/x5p9KxNV4tf8AgQra0z/jzj+lEfiCWxeoFJS1qZiilpopelAC0Ugpe1AC0UlLQAZozRQKAFopKKAFopKWgAooooAKKKKACiiigAozRRQAZozSUUgCijFFMDwCikpaYgooooAKKKKAEooooAUdKdTR0paQC0UUUAHaiijvSGLRRRQAUDrRQKAHU2nU00AFFFFABSUUUAFFFFABRRRQAUlFFABRRRQAUUUUxBQelJQaAO2+HRPnXo7bF/nXeZ5NcH8O1Jlu2/hAAP8AT+td3U9Shw7Uopo7UtAwFLTR0pT0oAUUp6ikFBoET2/3n/3TV+7/AOPNqoW333/3TV67OLJvpVLYXUwJOtQHqalk61CTyayNChq3/Hsv++K29N/484/pWHqx/wBHX/fFbmm/8ecf0FEdwlsXaKSjNamY4UpPFNFLQAopaaKUUgFopKBTAWiiigAH1zS0lFIBaKSigB1FJmimAUUZopALRSZooAWkoNJQAtFJRQAtFJRQB//Z",
  "img6": "data:image/jpeg;base64,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",
  "img7": "data:image/jpeg;base64,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",
  "img8": "data:image/jpeg;base64,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",
  "img9": "data:image/jpeg;base64,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"
};

const buildReportHTML = (report) => {
  const logo = IMG_MAP_LOGO;
  const { groups, grouping, completed, total, pct, reportType: rType } =
    report.data || buildReportData(report.reportType, "custom", report.period, null);

  const h = (tag, attrs, ...children) => {
    const attrStr = Object.entries(attrs || {}).map(([k,v]) => ` ${k}="${v}"`).join("");
    const inner = children.join("");
    return `<${tag}${attrStr}>${inner}</${tag}>`;
  };
  const selfClose = (tag, attrs) => {
    const attrStr = Object.entries(attrs || {}).map(([k,v]) => ` ${k}="${v}"`).join("");
    return `<${tag}${attrStr}/>`;
  };

  const renderPhotos = (photos) => {
    if (!photos || photos.length === 0) return "";
    const cols = 4;
    const cells = photos.map(k => {
      const src = IMG_MAP[k] || "";
      return src
        ? selfClose("img", { src, style: "width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;display:block;" })
        : h("div", { style: "width:100%;aspect-ratio:4/3;background:#e8e8e6;border-radius:8px;" }, "");
    });
    return h("div", { style: `display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;margin-top:10px;` }, ...cells);
  };

  const groupLabel = (g) => {
    if (grouping === "week") {
      const [y,m,d] = g.key.split("-").map(Number);
      const mon = new Date(y,m-1,d);
      const fmt = dt => dt.toLocaleDateString("en-US",{month:"short",day:"numeric"}).toLowerCase();
      const tp = g.entries.reduce((s,e) => s + e.photos.length, 0);
      return `week of ${fmt(mon)} \xB7 ${tp} photo${tp!==1?"s":""}`;
    }
    if (grouping === "month") {
      const [y,m] = g.key.split("-").map(Number);
      const label = new Date(y,m-1,1).toLocaleDateString("en-US",{month:"long",year:"numeric"}).toLowerCase();
      const tp = g.entries.reduce((s,e) => s + e.photos.length, 0);
      return `${label} \xB7 ${tp} photo${tp!==1?"s":""}`;
    }
    const [y,m,d] = g.key.split("-").map(Number);
    return new Date(y,m-1,d).toLocaleDateString("en-US",{day:"numeric",month:"short"}).toUpperCase();
  };

  const progressHTML = rType === "progress"
    ? h("div", { style: "margin-bottom:20px;" },
        h("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:13px;font-weight:600;" },
          h("span", { style: "color:#0a1629;" }, `${completed} of ${total} tasks complete`),
          h("span", { style: "color:#16a97d;" }, `${pct}%`)
        ),
        h("div", { style: "height:6px;background:#e8e8e6;border-radius:99px;overflow:hidden;" },
          h("div", { style: `width:${pct}%;height:100%;background:#16a97d;border-radius:99px;` }, "")
        )
      )
    : "";


  const entriesHTML = groups.length === 0
    ? h("p", { style: "font-size:13px;color:#828282;text-align:center;padding:32px 0;" }, "No activity entries for this period.")
    : groups.map(g => {
        const lbl = groupLabel(g);
        if (grouping === "day") {
          return h("div", { style: "margin-bottom:28px;" },
            h("p", { style: "font-size:11px;font-weight:600;color:#828282;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;" }, lbl),
            ...g.entries.map(e =>
              h("div", { style: "margin-bottom:16px;" },
                h("p", { style: "font-size:14px;color:#303742;line-height:1.6;margin:0;" }, e.note),
                renderPhotos(e.photos)
              )
            )
          );
        }
        const allPhotos = g.entries.flatMap(e => e.photos);
        return h("div", { style: "margin-bottom:28px;" },
          h("p", { style: "font-size:11px;font-weight:600;color:#828282;letter-spacing:.06em;text-transform:uppercase;margin:0 0 4px;" }, lbl),
          ...g.entries.map(e => h("p", { style: "font-size:14px;color:#303742;line-height:1.6;margin:0 0 8px;" }, e.note)),
          renderPhotos(allPhotos)
        );
      }).join("");

  const css = "*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#f7f8fa;min-height:100vh;padding:32px 24px}.card{background:white;border-radius:16px;border:1px solid #e8e8e6;overflow:hidden;max-width:660px;margin:0 auto}";

  const headerContent =
    selfClose("img", { src: logo, alt: "tasktag", style: "height:26px;" }) +
    h("span", { style: "font-size:10px;font-weight:600;letter-spacing:.04em;color:#16a97d;text-transform:uppercase;border:1px solid #16a97d;border-radius:20px;padding:3px 10px;" }, rType === "photo" ? "Photo Update" : "Progress Report");

  const header = h("div", { style: "display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #e8e8e6;" }, headerContent);

  const meta =
    h("p", { style: "font-size:11px;color:#828282;margin-bottom:24px;text-transform:uppercase;" }, `Period: ${report.period}`) +
    h("h2", { style: "font-size:28px;font-weight:700;color:#0a1629;margin-bottom:4px;line-height:1.15;" }, "11 North Raintree Hollow Court") +
    h("p", { style: "font-size:12px;color:#828282;margin-bottom:20px;" }, rType === "progress" ? "401 Franklin St, Houston \xB7 Target opening Sep 20, 2026" : "401 Franklin St, Houston");

  const body = h("div", { style: "padding:20px;" }, meta + progressHTML + entriesHTML);
  const card = h("div", { class: "card" }, header + body);

  const title = rType === "photo" ? "Photo Update" : "Progress Report";
  return "<!DOCTYPE html>" +
    h("html", {},
      h("head", {},
        selfClose("meta", { charset: "UTF-8" }),
        h("title", {}, `${title} \u2013 ${report.period}`),
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

  const handleGenerate = () => {
    const id = Date.now();
    const periodDisplay = getPeriodRange(dateRange);
    const reportData = buildReportData(reportType, dateRange, periodDisplay, customRange);
    const newReport = {
      id,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      period: periodDisplay,
      status: "in_progress",
      reportType,
      data: reportData,
    };
    setReports(prev => [newReport, ...prev]);
    setDateRange("since_last");
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: "done" } : r));
    }, 3000);
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
    const html = buildReportHTML(report);
    try {
      const key = `report_${report.id}`;
      await window.storage.set(key, html);
      const url = `${window.location.href.split("?")[0]}?report=${key}`;
      try { await navigator.clipboard.writeText(url); }
      catch {
        const el = document.createElement("textarea");
        el.value = url; el.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
      }
    } catch(e) { console.error(e); }
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

  const getPeriodLabel = (id) => {
    if (id === "since_last") return `Since last report · ${sinceLastDate}`;
    if (id === "custom" && customRange) return `${customRange.start} – ${customRange.end}`;
    return PERIOD_LABELS[id];
  };

  const getPeriodRange = (id) => {
    if (id === "since_last") return `${sinceLastDate} – ${fmtDate(new Date())}`;
    if (id === "custom" && customRange) return `${customRange.start} – ${customRange.end}`;
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
                background: "white", border: `1px solid ${openType ? "#000" : "var(--tt-grey03)"}`,
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
                background: "white", border: `1px solid ${openPeriod ? "#000" : "var(--tt-grey03)"}`,
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "var(--tt-text-1)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                userSelect: "none", transition: "border-color 0.15s",
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
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
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
                        <FixedTooltipBtn label="Download PDF file" onAction={() => handleDownload(r)}><Download size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                        <FixedTooltipBtn label="Copy link" onAction={(rect) => handleCopy(rect, r)}><Link size={16} strokeWidth={SW} color="var(--tt-grey06)" /></FixedTooltipBtn>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
function ReportPage({ reportKey }) {
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(reportKey);
        if (result) setHtml(result.value);
      } catch (e) {}
      setLoading(false);
    })();
  }, [reportKey]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f7f8fa" }}>
      <span style={{ fontSize: 14, color: "#828282" }}>Loading report…</span>
    </div>
  );

  if (!html) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f7f8fa" }}>
      <span style={{ fontSize: 14, color: "#828282" }}>Report not found.</span>
    </div>
  );

  // Renders the exact same HTML document produced by the "Download" button.
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
  const reportKey = params.get("report");
  if (reportKey) return <ReportPage reportKey={reportKey} />;

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
