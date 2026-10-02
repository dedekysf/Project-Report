import { useState, useRef, useLayoutEffect, useEffect, useMemo, useCallback, useContext, createContext, Fragment } from "react";
import { createPortal } from "react-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft, Search, MoreVertical, Plus, Check, Link, Download,
  LayoutGrid, MapPin, Hash, FileText, FileImage, IdCard,
  Activity, Users, BarChart2, SlidersHorizontal,
  ArrowUpDown, Calendar, AlignJustify, Clock,
  UserPlus, Link2, ChevronUp, ChevronDown, X, Pencil, Trash2, Crown, AlertTriangle,
  RotateCw, ZoomIn, ZoomOut, Folder, ArrowLeft, ArrowRight, Info, StickyNote,
  ExternalLink, Forward, Loader, Mail, Phone, Upload, ImagePlus, GripVertical, Eye, Lock,
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
    border-bottom: none !important;
    border-radius: 8px !important;
    padding: 12px 12px;
    font-size: 14px;
    font-weight: 400 !important;
    background: transparent !important;
    box-shadow: none !important;
    transition: background-color 0.15s, color 0.2s ease;
    position: relative;
    isolation: isolate;
    cursor: pointer;
  }
  /* The active fill is a gradient, which CSS can't transition directly
     (background-image doesn't interpolate), so it lives on a ::before
     whose opacity fades in/out, so tab-to-tab switches animate smoothly. isolation:isolate on the tab
     keeps the z-index:-1 layer behind the label/icon but above whatever
     sits behind the tab. */
  [data-radix-collection-item]::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: linear-gradient(to bottom, color-mix(in srgb, var(--tt-mint) 25%, transparent), color-mix(in srgb, var(--tt-mint) 85%, transparent));
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  [data-radix-collection-item][data-state="active"]::before { opacity: 1; }
  [data-radix-collection-item]:disabled { cursor: not-allowed; }
  [data-radix-collection-item]:hover { color: var(--tt-text-1) !important; }
  /* Active tab — light green fill, no underline (this used to be a
     border-bottom indicator; the inactive rule above carried a matching
     transparent border-bottom + -1px margin + z-index just to keep that
     border from shifting layout when it toggled on, none of which is
     needed anymore now that "active" is a background fill instead). */
  [data-radix-collection-item][data-state="active"] {
    color: var(--tt-secondary) !important;
    font-weight: 400 !important;
    border-bottom: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  /* For icons built from an outer shape plus an inner glyph (e.g.
     FileImage's file outline vs. its sun-and-mountain photo glyph) —
     Lucide sets a single strokeWidth on the root <svg>, inherited by
     every child path/circle/etc. alike, so getting the outer shape and
     the inner glyph onto two different weights (1.6 outer / 1.4 inner)
     needs a CSS override per icon instead of the strokeWidth prop alone.
     One block per icon below, each keyed to that icon's own specific
     __iconNode shape (checked against lucide-react's actual source, not
     guessed) — nth-of-type counts only same-tag siblings, so these still
     work regardless of other tag types sitting between them in source
     order. Every other icon used in this file is either a single shape
     or several equal/peer shapes with no real "frame containing a
     glyph" relationship (e.g. Trash2's lid+body+handle are peers, not
     a frame; Users' two people are peers, not nested) — splitting
     those wouldn't correspond to anything actually nested, so only the
     icons below (plus FileImage, already split pre-this-pass) get a
     class at all. */

  /* FileImage — file outline (2 paths) containing a sun-and-mountain
     photo glyph (circle + 1 path). */
  .tt-split-fileimage path:nth-of-type(1),
  .tt-split-fileimage path:nth-of-type(2) { stroke-width: 1.6; }
  .tt-split-fileimage circle,
  .tt-split-fileimage path:nth-of-type(3) { stroke-width: 1.4; }

  /* MapPin — pin body (path) containing its hole/dot (circle). */
  .tt-split-mappin path { stroke-width: 1.6; }
  .tt-split-mappin circle { stroke-width: 1.4; }

  /* FileText — file outline (2 paths) containing 3 lines of text. */
  .tt-split-filetext path:nth-of-type(1),
  .tt-split-filetext path:nth-of-type(2) { stroke-width: 1.6; }
  .tt-split-filetext path:nth-of-type(3),
  .tt-split-filetext path:nth-of-type(4),
  .tt-split-filetext path:nth-of-type(5) { stroke-width: 1.4; }

  /* Clock — face (circle) containing its hands (polyline). */
  .tt-split-clock circle { stroke-width: 1.6; }
  .tt-split-clock polyline { stroke-width: 1.4; }

  /* Trash2 — lid-top/body/handle (3 paths) containing 2 ridge lines. */
  .tt-split-trash2 path { stroke-width: 1.6; }
  .tt-split-trash2 line { stroke-width: 1.4; }

  /* AlertTriangle — triangle outline (1 path) containing the
     exclamation mark (stem + dot, 2 paths). */
  .tt-split-alerttriangle path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-alerttriangle path:nth-of-type(2),
  .tt-split-alerttriangle path:nth-of-type(3) { stroke-width: 1.4; }

  /* ZoomIn — lens + handle (circle + 1st line) containing a "+" made of
     2 more lines. */
  .tt-split-zoomin circle,
  .tt-split-zoomin line:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-zoomin line:nth-of-type(2),
  .tt-split-zoomin line:nth-of-type(3) { stroke-width: 1.4; }

  /* ZoomOut — lens + handle (circle + 1st line) containing a single
     "−" line. */
  .tt-split-zoomout circle,
  .tt-split-zoomout line:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-zoomout line:nth-of-type(2) { stroke-width: 1.4; }

  /* Info — badge (circle) containing the "i" (stem + dot, 2 paths). */
  .tt-split-info circle { stroke-width: 1.6; }
  .tt-split-info path { stroke-width: 1.4; }

  /* Mail — envelope (rect) containing its V-flap line (path). */
  .tt-split-mail rect { stroke-width: 1.6; }
  .tt-split-mail path { stroke-width: 1.4; }

  /* Eye — outline (path) containing the pupil (circle). */
  .tt-split-eye path { stroke-width: 1.6; }
  .tt-split-eye circle { stroke-width: 1.4; }

  /* Pencil — body (1st path) with its tip-highlight detail (2nd path). */
  .tt-split-pencil path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-pencil path:nth-of-type(2) { stroke-width: 1.4; }

  /* ExternalLink — box frame (1st + 3rd paths) with the diagonal arrow
     drawn through it (2nd path). */
  .tt-split-externallink path:nth-of-type(1),
  .tt-split-externallink path:nth-of-type(3) { stroke-width: 1.6; }
  .tt-split-externallink path:nth-of-type(2) { stroke-width: 1.4; }

  /* IdCard — card frame (rect) containing the mini portrait (circle +
     shoulders path) and the 2 text lines. */
  .tt-split-idcard rect { stroke-width: 1.6; }
  .tt-split-idcard circle,
  .tt-split-idcard path { stroke-width: 1.4; }

  /* Download — tray (path) containing the drop-in arrow (polyline + line). */
  .tt-split-download path { stroke-width: 1.6; }
  .tt-split-download polyline,
  .tt-split-download line { stroke-width: 1.4; }

  /* Forward — open shelf (path) containing the arrow popping out of it (polyline). */
  .tt-split-forward path { stroke-width: 1.6; }
  .tt-split-forward polyline { stroke-width: 1.4; }

  /* ImagePlus — picture frame (3rd path) containing a mountain glyph (4th
     path) + sun (circle); the "+" badge (1st/2nd paths) sits outside the
     frame, same "accessory badge reads as inner detail" treatment
     UserPlus's own "+" gets below. */
  .tt-split-imageplus path:nth-of-type(3) { stroke-width: 1.6; }
  .tt-split-imageplus path:nth-of-type(1),
  .tt-split-imageplus path:nth-of-type(2),
  .tt-split-imageplus path:nth-of-type(4),
  .tt-split-imageplus circle { stroke-width: 1.4; }

  /* Upload — tray (path) containing the lift-out arrow (polyline + line). */
  .tt-split-upload path { stroke-width: 1.6; }
  .tt-split-upload polyline,
  .tt-split-upload line { stroke-width: 1.4; }

  /* X — 2 crossing diagonals, 1st stroke outline / 2nd stroke inner. */
  .tt-split-x path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-x path:nth-of-type(2) { stroke-width: 1.4; }

  /* MoreVertical — top dot outline, other 2 dots inner. */
  .tt-split-morevertical circle:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-morevertical circle:nth-of-type(2),
  .tt-split-morevertical circle:nth-of-type(3) { stroke-width: 1.4; }

  /* Link — 2 mirrored chain-link halves, 1st outline / 2nd inner. */
  .tt-split-link path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-link path:nth-of-type(2) { stroke-width: 1.4; }

  /* ArrowLeft/ArrowRight — bold arrowhead (outline) with a thinner shaft (inner). */
  .tt-split-arrowleft path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-arrowleft path:nth-of-type(2) { stroke-width: 1.4; }
  .tt-split-arrowright path:nth-of-type(2) { stroke-width: 1.6; }
  .tt-split-arrowright path:nth-of-type(1) { stroke-width: 1.4; }

  /* GripVertical — left column of dots outline, right column inner. */
  .tt-split-gripvertical circle:nth-of-type(-n+3) { stroke-width: 1.6; }
  .tt-split-gripvertical circle:nth-of-type(n+4) { stroke-width: 1.4; }

  /* Plus — horizontal stroke outline, vertical stroke inner. */
  .tt-split-plus line:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-plus line:nth-of-type(2) { stroke-width: 1.4; }

  /* Loader — first half of the rays outline, second half inner. */
  .tt-split-loader path:nth-of-type(-n+4) { stroke-width: 1.6; }
  .tt-split-loader path:nth-of-type(n+5) { stroke-width: 1.4; }

  /* BarChart2 — tallest/center bar outline, the 2 shorter bars inner. */
  .tt-split-barchart2 line:nth-of-type(2) { stroke-width: 1.6; }
  .tt-split-barchart2 line:nth-of-type(1),
  .tt-split-barchart2 line:nth-of-type(3) { stroke-width: 1.4; }

  /* Crown — crown shape outline, base line inner. */
  .tt-split-crown path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-crown path:nth-of-type(2) { stroke-width: 1.4; }

  /* LayoutGrid — top row outline, bottom row inner. */
  .tt-split-layoutgrid rect:nth-of-type(1),
  .tt-split-layoutgrid rect:nth-of-type(2) { stroke-width: 1.6; }
  .tt-split-layoutgrid rect:nth-of-type(3),
  .tt-split-layoutgrid rect:nth-of-type(4) { stroke-width: 1.4; }

  /* Search — lens outline, handle inner. */
  .tt-split-search circle { stroke-width: 1.6; }
  .tt-split-search path { stroke-width: 1.4; }

  /* UserPlus — person silhouette outline, "+" badge inner. */
  .tt-split-userplus path:nth-of-type(1),
  .tt-split-userplus circle { stroke-width: 1.6; }
  .tt-split-userplus line { stroke-width: 1.4; }

  /* SlidersHorizontal — 3 horizontal tracks outline, 3 knob ticks inner. */
  .tt-split-slidershorizontal line:nth-of-type(-n+6) { stroke-width: 1.6; }
  .tt-split-slidershorizontal line:nth-of-type(n+7) { stroke-width: 1.4; }

  /* ArrowUpDown — both arrowheads outline, both shafts inner. */
  .tt-split-arrowupdown path:nth-of-type(1),
  .tt-split-arrowupdown path:nth-of-type(3) { stroke-width: 1.6; }
  .tt-split-arrowupdown path:nth-of-type(2),
  .tt-split-arrowupdown path:nth-of-type(4) { stroke-width: 1.4; }

  /* Calendar — body outline, binder rings + divider line inner. */
  .tt-split-calendar rect { stroke-width: 1.6; }
  .tt-split-calendar path { stroke-width: 1.4; }

  /* AlignJustify — top line outline, other 2 lines inner. */
  .tt-split-alignjustify path:nth-of-type(1) { stroke-width: 1.6; }
  .tt-split-alignjustify path:nth-of-type(2),
  .tt-split-alignjustify path:nth-of-type(3) { stroke-width: 1.4; }

  /* Hash — 2 horizontal bars outline, 2 vertical bars inner. */
  .tt-split-hash line:nth-of-type(1),
  .tt-split-hash line:nth-of-type(2) { stroke-width: 1.6; }
  .tt-split-hash line:nth-of-type(3),
  .tt-split-hash line:nth-of-type(4) { stroke-width: 1.4; }

  /* Users — front person (body+head) outline, back person inner. */
  .tt-split-users path:nth-of-type(1),
  .tt-split-users circle { stroke-width: 1.6; }
  .tt-split-users path:nth-of-type(2),
  .tt-split-users path:nth-of-type(3) { stroke-width: 1.4; }

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

  /* For a spinner that's ALSO centered via transform:translate(-50%,-50%)
     (Generate/Save Report's absolutely-positioned icon) — an animated
     "transform" fully replaces the property for the animation's duration,
     it doesn't compose with a separate inline transform, so plain tt-spin
     here would silently drop the centering translate and leave the icon
     offset by half its own size the moment it started spinning. Baking
     the same translate into every keyframe step keeps both at once. */
  @keyframes tt-spin-centered {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
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

  /* Scrollable content with no visible scrollbar chrome (see Summary's
     own textarea in EditableField) — overflow:auto/scroll alone still
     scrolls fine with this applied, it's purely cosmetic. Needs all
     three: the first two are plain properties (Firefox/legacy Edge),
     the third is a pseudo-element only WebKit/Blink (Chrome/Safari)
     understand, which is why this has to be a real class instead of an
     inline style — inline styles can't target ::-webkit-scrollbar at all. */
  .tt-no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .tt-no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  @keyframes tt-toast-progress {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* A loader icon that replaces an image/empty-state via a ternary (Logo,
     Highlight Photo, Footer avatar) mounts fresh rather than toggling an
     existing element's opacity, so a plain CSS transition on it has
     nothing to animate from — this keyframe is what actually fades it in
     instead of it just snapping into view. Combined with tt-spin via a
     comma-separated animation list (both apply to the same element at
     once). */
  @keyframes tt-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
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

const SW = 1.6;

// Maps an icon COMPONENT (not its name — these are passed around as bare
// component references, e.g. navGroups' own `icon` field, or iconFor's
// return value) to its .tt-split-* class (see those classes' own
// definitions in the <style> above) for icons built from an outer shape
// plus an inner glyph. Centralized here rather than duplicated per call
// site, since the same icon component can reach a render spot through
// several different generic "whatever icon this group/tab happens to
// use" paths (NavSidebar, the tabs array, ReportPreviewChrome's iconFor).
// Every icon NOT in this map is a single shape or equal/peer shapes with
// nothing to split, so iconSplitClassFor returns undefined for it — a
// no-op className.
const ICON_SPLIT_CLASSES = new Map([
  [FileImage, "tt-split-fileimage"],
  [MapPin, "tt-split-mappin"],
  [FileText, "tt-split-filetext"],
  [Clock, "tt-split-clock"],
  [Trash2, "tt-split-trash2"],
  [AlertTriangle, "tt-split-alerttriangle"],
  [ZoomIn, "tt-split-zoomin"],
  [ZoomOut, "tt-split-zoomout"],
  [Info, "tt-split-info"],
  [Mail, "tt-split-mail"],
  [Eye, "tt-split-eye"],
  [Pencil, "tt-split-pencil"],
  [ExternalLink, "tt-split-externallink"],
  [Download, "tt-split-download"],
  [Forward, "tt-split-forward"],
  [IdCard, "tt-split-idcard"],
  [Upload, "tt-split-upload"],
  [ImagePlus, "tt-split-imageplus"],
  [X, "tt-split-x"],
  [MoreVertical, "tt-split-morevertical"],
  [Link, "tt-split-link"],
  [ArrowLeft, "tt-split-arrowleft"],
  [ArrowRight, "tt-split-arrowright"],
  [GripVertical, "tt-split-gripvertical"],
  [Plus, "tt-split-plus"],
  [Loader, "tt-split-loader"],
  [BarChart2, "tt-split-barchart2"],
  [Crown, "tt-split-crown"],
  [LayoutGrid, "tt-split-layoutgrid"],
  [Search, "tt-split-search"],
  [UserPlus, "tt-split-userplus"],
  [SlidersHorizontal, "tt-split-slidershorizontal"],
  [ArrowUpDown, "tt-split-arrowupdown"],
  [Calendar, "tt-split-calendar"],
  [AlignJustify, "tt-split-alignjustify"],
  [Hash, "tt-split-hash"],
  [Users, "tt-split-users"],
]);
const iconSplitClassFor = Icon => ICON_SPLIT_CLASSES.get(Icon);

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
// TODO(BE): replace with the actual report ID from the API. A function of
// the report's own generation date (not a fixed constant) — every report
// needs its OWN id reflecting when THAT report was actually generated, not
// a single value frozen at whenever the app happened to load (APP_TODAY).
// dateStr is each report's own `date` (see pushReport's toLocaleString
// call) — parseable by Date since it's produced by that same call — or
// missing entirely for a link built before this existed, where APP_TODAY
// is the closest fallback available.
const reportIdFor = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : APP_TODAY;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `TX-1520-${y}-${m}-${day}`;
};

// Cover header's companyEmail/companyPhone (see EditableField's `validate`
// prop) — companyPhone is specifically a US office number: optional
// +1/1 country code, area code with or without parens, any of
// space/dash/dot as the separator, optional extension ("ext 123"/"x123").
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const US_PHONE_PATTERN = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}(\s?(ext\.?|x)\.?\s?\d{1,5})?$/i;
// Auto-formats as the user types (see companyPhone's `filterInput`) —
// pulls out only the digits (ignoring whatever punctuation was actually
// typed, so pasting "2234222342" or "(223) 422-2342" both land the same
// way), drops a leading "1" country code once there are 11+ digits, and
// caps at 10 (a plain US number, no extension support here). Builds up
// progressively as digits arrive rather than waiting for all 10 — e.g.
// "223" -> "(223", "223422" -> "(223) 422" — so the format is visible
// from the very first digit instead of only once the number is complete.
const formatUSPhone = (raw) => {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits[0] === "1") digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// ── Paginated document sizing ──
// The live preview lays out its document as stacked Letter sheets (each
// with its own header/footer) instead of one continuous scrolling card,
// so it reads like a real paginated report. Width matches the reading
// column this whole panel already uses (800px); height follows from the
// US Letter ratio (11:8.5) at that width.
const PAGE_W   = 800;
const PAGE_H   = Math.round(PAGE_W * 11 / 8.5);
const PAGE_PAD = 40;
// Inner padding of each section card in the live draft/preview. Separate
// from PAGE_PAD (the exported document's own page padding, used by
// buildReportHTML and its pagination math), which stays 40.
const DRAFT_PAD = 24;
// Draft nav sidebar's fixed width — wide enough that a typical task title
// doesn't truncate immediately (see the sidebar in the modal body).
const NAV_W = 280;
// NavSidebar's own outer padding (16) + a top-level row's own left padding
// (12, see topStyle) — the distance from the sidebar's left edge to where
// its icons actually start. Reused by the chrome bar's logo (draft-chrome/
// ReportPreviewChrome) so the logo lines up with that icon column instead
// of just centering somewhere inside the sidebar's width.
const NAV_SIDEBAR_ICON_INSET = 28;
// Uniform gap around the document card on every side (top, right, bottom,
// left) — matches the exported document's own outer margin (see
// buildReportHTML's `body{padding:${PAGE_GUTTER}px}`), so the card reads
// as the same "floating in a light grey frame" page in draft mode and in
// Preview/Download/Copy link alike.
const PAGE_GUTTER = 24;
// A real (non-overlay) vertical scrollbar eats into whatever box it
// scrolls — draft mode's mainScrollRef, Preview's iframe, and a
// downloaded file's own browser window all do this identically — so a
// plain PAGE_GUTTER right padding actually renders thinner than the
// other three sides once a scrollbar shows up, part of it silently eaten
// instead of staying clear space. Padding on the RIGHT side specifically
// (see the content wrapper below and buildReportHTML's own body css)
// adds this on top of PAGE_GUTTER so the visible gap still comes out to
// a clean PAGE_GUTTER no matter which of those three scrollbars is
// actually present. A plain constant, not a measured value (same spirit
// as every other size here) — most desktop browsers' classic scrollbars
// land close to this, and on an overlay-scrollbar system (nothing to
// compensate for) this just reads as a few extra px of breathing room
// instead of a shortfall.
const SCROLLBAR_W = 17;
// Extra width budget on top of NAV_W + PAGE_W for the document column's
// own left+right padding/scrollbar room (see the content wrapper below) —
// without it, that column would be sized to exactly PAGE_W with nowhere
// left to fit padding, forcing the fixed-width document card to overflow
// it and triggering an unwanted horizontal scrollbar on the whole modal.
// Chrome bar and body share this same total width (and center within it
// the same way), so their content lines up and any leftover space on a
// wide screen balances evenly on both sides instead of the whole unit
// piling up against one edge. PAGE_GUTTER×2 (left+right) + SCROLLBAR_W
// (the right side's own extra allowance) — matches
// ReportPreviewChrome's own PREVIEW_CONTENT_BUFFER exactly (it reuses
// this same constant), so draft and Preview reserve the exact same total
// gutter.
const CONTENT_BUFFER = PAGE_GUTTER * 2 + SCROLLBAR_W;
const ROW_W = NAV_W + PAGE_W + CONTENT_BUFFER;
// Two jobs: (1) reserved on top of the footer's own measured height when
// deciding what still fits on a page, so the pagination pass leaves this
// much slack in its budget; (2) applied as a literal paddingBottom on
// every page's content area, which is what actually GUARANTEES the gap —
// relying on flex:1 to fill leftover space only works when the measured
// heights used for packing exactly match what really renders, which
// isn't reliable enough on its own to keep the last item/photo on a page
// from ever sitting flush against (or overlapping) the footer. Matches
// the 40px "breathing room" gap already used elsewhere in this file
// (e.g. between entries).
const PAGE_BOTTOM_BUFFER = 40;

// TODO(BE): replace with the task's actual status from the API — derived
// from the entry's date here only because DUMMY_ENTRIES has no status
// field of its own. Most entries are simply completed (they're a log of
// work already done); a deterministic minority are flagged open so the
// report shows both states.
function statusForEntry(e) {
  const dateStr = typeof e === "string" ? e : e.date;
  const d = parseDate(dateStr);
  const bucket = d.getDate() % 5;
  return { kind: bucket === 0 ? "open" : "completed" };
}
const STATUS_META = {
  completed: { label: "Completed", color: "var(--tt-secondary)" },
  open:      { label: "Open",      color: "var(--tt-blue)" },
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
            <Icon size={14} strokeWidth={SW} className={iconSplitClassFor(Icon)} /> {label}
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
        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
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
// Only one EditableField may be in edit mode at a time across the whole
// document — opening one closes whichever other
// field was open, the same way a browser only lets one <details> in a
// group stay open. Backed by a single { activeField, setActiveField } pair
// held in ReportsTab and handed down via context (rather than threading
// activeField/onActivate/onDeactivate through every call site by hand),
// with each field identified by its own fieldId string.
const ActiveEditContext = createContext({ activeField: null, setActiveField: () => {} });

// Draft-mode form validation. Fields marked `live` (see EditableField) write
// straight into the draft state as you type — there is no per-field save —
// so nothing is checked until Save Report is clicked. That handler fills
// `errors` ({ [fieldId]: message }) and each live field reads its own entry
// from here, clearing it (`clearError`) as soon as that field is edited.
const FormErrorsContext = createContext({ errors: {}, clearError: () => {} });

// A caret popover has to sit right against its trigger to read as
// "attached" to it — clamping its position to hover below the draft
// modal's fixed chrome bar (Photo Limit / Cancel / Save) instead just made
// it look unmoored, floating with no visible connection to anything. So
// once the trigger scrolls fully behind the chrome (nothing left to point
// at), the right call is to close the popover instead of relocating it.
// `#draft-chrome` is the chrome bar's own id; a trigger not yet clipped by
// it (or the chrome not being mounted at all) is never considered hidden.
function isHiddenByChrome(rect) {
  const chrome = document.getElementById("draft-chrome");
  if (!chrome) return false;
  return rect.bottom <= chrome.getBoundingClientRect().bottom;
}

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
// `alwaysEditing` skips the click-to-edit dance only while a field is
// empty (Summary, per-entry notes read as a live textarea/input from the
// start instead of hiding behind a placeholder click) — every keystroke
// calls onSave directly, no deferred draft. Once it holds a value and
// isn't focused, it flips to plain, clickable text (hover highlights it,
// click re-opens the textarea/input and focuses it), same affordance as
// every click-to-edit field below. A check button sits at the bottom-right
// corner of the live textarea/input, disabled while empty; clicking it (or
// pressing Enter — Shift+Enter still inserts a newline) just blurs the
// field, which is what triggers the flip to plain text. No X here — there's
// no deferred draft to discard, only the click-to-edit fields below get
// that. `aboveWhenEditing` (Additional Information's "Additional Information"/"Optional" label row) only
// renders alongside the live textarea/input — it disappears the moment the
// field flips to plain text, same as once the whole report locks.
// `disabled` still wins over all of this (a saved/locked report shows
// plain text unconditionally, with no `aboveWhenEditing` either).
//
// `popover` (company name/address, client name) opens a small 240px-wide
// caret popover off the trigger's own bounding rect instead of swapping
// inline — same caret/positioning mechanics as the photo caption popover.
// The check button sits inside the input itself (right-aligned, like the
// alwaysEditing fields) and is disabled while the draft is empty. It's the
// only way to commit — Enter also works, but clicking outside (or Escape)
// just closes the popover without saving, so there's no separate cancel
// button to draw.
//
// Focuses an input/textarea and places the caret at the end of its current
// text, instead of wherever the browser's default focus() leaves it (often
// position 0) — every edit mode across EditableField/PhotoGrid uses this so
// re-editing existing content always picks up at the end. A stable,
// module-level function (not an inline arrow) so passing it directly as
// `ref` only fires once per mount rather than on every re-render while
// typing; call sites that also need to run other ref logic guard the call
// with `el !== document.activeElement` for the same reason.
function focusAtEnd(el) {
  if (!el) return;
  el.focus();
  const len = el.value.length;
  el.setSelectionRange(len, len);
}

// Whatever sits below an active (editing) field is always 8px away: a
// non-boxed field's own wrapper carries that as marginBottom, multiline's
// check/cancel row sits 8px under the textarea, and the error message (if
// any) sits 8px under that.
//
// `live` (the draft's form fields — everything except the checklist, whose
// rows keep the confirm-button flow above) is a plain controlled form
// field: always an input/textarea while the report is a draft, `onSave`
// fires on every change, and there is no confirm button, blur-revert or
// click-to-edit text. Committing is Save Report's job (see
// handleSaveReportClick, which also runs the required/format checks that
// `required`/`validate` describe here). Once the report is saved the
// `disabled` branch below shows it as plain text, as before.
function EditableField({ fieldId, value, placeholder, placeholderStyle, inputPlaceholder, filterInput, onSave, onCancel, multiline, disabled, boxed, required, validate, errorMessage, textStyle, inputStyle, as: Tag = "p", alwaysEditing, live, gap = 0, popover, popoverAlign = "left", aboveWhenEditing, counter, maxLength, rows = 2, leadingIcon }) {
  const { activeField, setActiveField } = useContext(ActiveEditContext);
  const { errors: formErrors, clearError: clearFormError } = useContext(FormErrorsContext);
  const [draft, setDraft] = useState(value || "");
  const [error, setError] = useState(false);
  const alwaysEditingRef = useRef(null);
  // Shares activeField/setActiveField with the click-to-edit `editing`
  // branch below instead of tracking its own local "am I focused" state —
  // that's what makes clicking a second alwaysEditing field's committed
  // text (e.g. another Cover Header field) reliably close whichever one
  // was open before it, rather than depending on native blur timing across
  // two entirely separate field instances that don't otherwise know about
  // each other.
  const alwaysEditingFocused = activeField === fieldId;
  const editStartValueRef = useRef(value);
  const editing = !disabled && !alwaysEditing && activeField === fieldId;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  useEffect(() => {
    if (!popoverOpen) return;
    const handler = e => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popoverOpen]);
  // The popover is `position: fixed`, so its top/left are only ever
  // correct for the scroll position at the moment it opened — without
  // this, scrolling the modal's body leaves it stranded while the trigger
  // moves on. `true` (capture phase) is what lets this catch scroll on the
  // modal's own scroll container, not just window-level scroll. Once the
  // trigger scrolls fully behind the chrome bar, close instead of relocating
  // — see isHiddenByChrome.
  // popoverAlign:"right" (companyName/companyAddress/companyEmail/
  // companyPhone, all inside the cover's right-aligned column) hangs the
  // popover from the trigger's right edge instead of its left — matching
  // where the right-aligned text itself actually sits, rather than
  // opening away from it toward the left every time. 240 is the
  // popover's own fixed width (see its `width:240` below).
  const popoverLeftFor = (r) => popoverAlign === "right" ? r.right - 240 : r.left;

  useEffect(() => {
    if (!popoverOpen) return;
    const reposition = () => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      if (isHiddenByChrome(r)) { setPopoverOpen(false); return; }
      setPopoverPos({ top: r.bottom + 8, left: popoverLeftFor(r) });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popoverOpen]);

  const boxStyle = boxed ? { position: "relative", background: "var(--tt-grey02)", borderRadius: 8, padding: 8 } : {};

  if (disabled) {
    // whiteSpace here matches the live "display" branch further down —
    // a read-only value with line breaks (multiline) still needs to keep
    // them, not collapse to one line.
    if (value) return <div style={boxStyle}><Tag style={{ display: "block", whiteSpace: multiline ? "pre-wrap" : "normal", ...textStyle }}>{value}</Tag></div>;
    return placeholder ? <div style={boxStyle}><Tag style={{ display: "block", ...textStyle, color: "var(--tt-grey05)" }}>{placeholder}</Tag></div> : null;
  }

  if (live) {
    const liveError = formErrors[fieldId];
    const current = value || "";
    const handleChange = ev => {
      let next = ev.target.value;
      if (filterInput) next = filterInput(next);
      if (maxLength) next = next.slice(0, maxLength);
      if (liveError) clearFormError(fieldId);
      onSave(next);
    };
    const handleFocus = () => setActiveField(fieldId);
    const handleBlur = () => setActiveField(prev => prev === fieldId ? null : prev);
    return multiline ? (
      <div data-field={fieldId} style={boxStyle}>
        {aboveWhenEditing}
        <div style={{ position: "relative" }}>
          <Textarea
            // Auto-grow on every render (see the alwaysEditing textarea
            // below for the same reasoning) — no focusAtEnd here, the
            // field is always mounted so there's no text-to-input swap to
            // re-seat the caret after.
            ref={el => {
              if (!el) return;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
            value={current}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={ev => { if (ev.key === "Escape") { ev.stopPropagation(); ev.currentTarget.blur(); } }}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            style={{ fontFamily: "inherit", paddingBottom: counter ? 22 : undefined, resize: "none", overflow: "hidden", ...(liveError ? { borderColor: "var(--tt-red)" } : {}), ...inputStyle }}
          />
          {counter && maxLength && (
            <span style={{ position: "absolute", right: 12, bottom: 9, fontSize: 11, fontWeight: 500, color: current.length >= maxLength ? "var(--tt-red)" : "var(--tt-grey05)" }}>
              {maxLength - current.length}
            </span>
          )}
        </div>
        {liveError && (
          <p style={{ color: "var(--tt-red)", fontSize: 10, fontWeight: 500, margin: "4px 0 0", textAlign: "left" }}>{liveError}</p>
        )}
      </div>
    ) : (
      // The gap to the next field (`gap`) is a fixed margin on this wrapper,
      // not on the <input> itself: it stays the same whether the field is
      // empty, filled, or showing an error, instead of depending on
      // margin-collapsing through the nested wrappers below.
      <div data-field={fieldId} style={{ marginBottom: gap }}>
        {aboveWhenEditing}
        <div style={{ position: "relative" }}>
          {/* leadingIcon sits inside the input itself (absolutely
              positioned over its own left padding), not as a sibling
              beside it — paddingLeft below reserves exactly enough room
              so typed text never runs under it. */}
          {leadingIcon && (
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
              {leadingIcon}
            </div>
          )}
          <Input
            type="text"
            value={current}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={ev => {
              if (ev.key === "Enter") { ev.preventDefault(); ev.currentTarget.blur(); }
              if (ev.key === "Escape") { ev.stopPropagation(); ev.currentTarget.blur(); }
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            style={{ fontFamily: "inherit", paddingLeft: leadingIcon ? 34 : 12, paddingRight: counter && maxLength ? 44 : 12, ...(liveError ? { borderColor: "var(--tt-red)" } : {}), ...inputStyle, margin: 0 }}
          />
          {counter && maxLength && (
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 11, fontWeight: 500, color: current.length >= maxLength ? "var(--tt-red)" : "var(--tt-grey05)" }}>
              {maxLength - current.length}
            </span>
          )}
        </div>
        {liveError && (
          <p style={{ color: "var(--tt-red)", fontSize: 10, fontWeight: 500, margin: "4px 0 0", textAlign: "left" }}>{liveError}</p>
        )}
      </div>
    );
  }

  if (popover) {
    const openPopover = () => {
      setDraft(value || "");
      setError(false);
      if (triggerRef.current) {
        const r = triggerRef.current.getBoundingClientRect();
        setPopoverPos({ top: r.bottom + 8, left: popoverLeftFor(r) });
      }
      setPopoverOpen(true);
    };
    // `validate` only ever runs against a non-empty draft — an optional
    // field (companyEmail/companyPhone) can still be cleared back to blank
    // without tripping format validation.
    const commit = () => {
      const trimmed = draft.trim();
      if (validate && trimmed && !validate(trimmed)) { setError(true); return; }
      onSave(trimmed);
      setPopoverOpen(false);
      setError(false);
    };
    const popoverEmpty = !draft.trim();
    // Same "nothing to confirm" rule as every other edit mode — disabled
    // until the draft actually differs from the value this popover opened
    // with (openPopover seeds `draft` from `value`, so this is a plain diff).
    const confirmDisabled = popoverEmpty || draft.trim() === (value || "").trim();
    return (
      <div style={{ position: "relative" }}>
        <Tag
          ref={triggerRef}
          onClick={openPopover}
          onMouseEnter={ev => ev.currentTarget.style.background = "var(--tt-grey03)"}
          onMouseLeave={ev => ev.currentTarget.style.background = "none"}
          style={{ display: "inline-block", position: "relative", cursor: "pointer", ...textStyle }}
        >
          {value || <span style={{ color: "var(--tt-grey05)", textDecoration: "underline", ...placeholderStyle }}>{placeholder}</span>}
        </Tag>
        {popoverOpen && (
          <div ref={popoverRef} style={{ position: "fixed", top: popoverPos.top, left: popoverPos.left, zIndex: 300, width: 240 }}>
            {/* The caret sits under wherever the trigger actually is —
                near the panel's left edge for popoverAlign:"left" (the
                trigger's own left edge, per popoverLeftFor), near its
                right edge for "right" (the trigger's right edge). */}
            <div style={{ position: "absolute", top: -5, left: popoverAlign === "right" ? "auto" : 12, right: popoverAlign === "right" ? 12 : "auto", width: 10, height: 10, background: "white", border: "1px solid var(--tt-grey03)", borderRight: "none", borderBottom: "none", transform: "rotate(45deg)" }} />
            {/* textAlign:"left" overrides whatever the trigger's own
                container has it set to (the cover header's right-aligned
                column, for companyName/companyAddress/companyEmail/
                companyPhone) — this panel is a fixed-position overlay,
                not part of that text flow, so it always reads left to
                right regardless. */}
            <div style={{ position: "relative", background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, padding: 8, boxShadow: "0 8px 24px rgba(10,22,41,0.16)", textAlign: "left" }}>
              <div style={{ position: "relative" }}>
                <Input
                  ref={focusAtEnd}
                  value={draft}
                  onChange={ev => {
                    const raw = ev.target.value;
                    setDraft(filterInput ? filterInput(raw) : raw);
                    if (error) setError(false);
                  }}
                  onKeyDown={ev => {
                    if (ev.key === "Enter") { ev.preventDefault(); commit(); }
                    // stopPropagation so this only closes the popover, not
                    // the whole preview modal — same reasoning as the
                    // click-to-edit fields' Escape handler.
                    if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); setPopoverOpen(false); }
                  }}
                  placeholder={inputPlaceholder || placeholder}
                  style={{ fontSize: 12, height: 32, padding: "0 36px 0 10px", borderColor: error ? "var(--tt-red)" : undefined }}
                />
                <button
                  disabled={confirmDisabled}
                  onClick={commit}
                  onMouseEnter={ev => !confirmDisabled && (ev.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={ev => ev.currentTarget.style.opacity = "1"}
                  style={{
                    position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
                    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    width: 24, height: 24, background: confirmDisabled ? "var(--tt-grey04)" : "var(--tt-text-1)",
                    border: "none", borderRadius: 6, cursor: confirmDisabled ? "not-allowed" : "pointer", padding: 0,
                  }}
                >
                  <Check size={13} strokeWidth={SW} color="white" />
                </button>
              </div>
              {error && (
                <p style={{ color: "var(--tt-red)", fontSize: 10, fontWeight: 500, margin: "4px 0 0", textAlign: "left" }}>
                  {errorMessage || "That doesn't look right."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (alwaysEditing) {
    const isEmpty = !value || !value.trim();
    // Typing only ever touches this local draft — onSave (writing into the
    // parent's committed value) fires only from the confirm button or
    // Enter, same as the click-to-edit `editing` branch below, never from
    // onChange or blur.
    //
    // No X button — the confirm button is never disabled (clicking it with
    // an empty draft saves blank, same as every other save, and commit()
    // below still guards against an invalid non-empty one via `validate`,
    // or an empty one via `required` — e.g. Company Name/Address, which
    // unlike most fields here can't be cleared back to blank at all).
    // Cancelling an unsaved edit is instead just: click away. Blur syncs
    // editStartValueRef back into draft (see onBlur below), which discards
    // whatever was typed and never saved; a successful commit() keeps
    // editStartValueRef in sync with the fresh value first, so the same
    // blur-triggered sync after a save is a no-op, not a revert.
    const commit = () => {
      const trimmed = draft.trim();
      if (required && !trimmed) { setError(true); return; }
      if (trimmed && validate && !validate(trimmed)) { setError(true); return; }
      onSave(trimmed);
      editStartValueRef.current = trimmed;
      setError(false);
      alwaysEditingRef.current?.blur();
    };
    // Hidden on a pristine, still-blank field until the user actually
    // types something — there's nothing to confirm yet. Once this edit
    // session started from an existing non-blank value (editStartValueRef
    // — set on the text-tag's onClick below, or by commit() after a save),
    // it stays visible for the rest of the session even if the draft gets
    // cleared back to empty, so clearing existing content and explicitly
    // saving that empty state is still possible — not just left to
    // blur-cancel, which would revert to the old text instead.
    const showConfirm = !!(editStartValueRef.current && editStartValueRef.current.trim()) || draft.trim().length > 0;
    const buttonReserve = showConfirm ? 44 : 12;
    const confirmButton = (
      <button
        // Without this, clicking the button first fires a native blur on
        // the still-focused textarea/input (mousedown moves focus to the
        // button before its own click event fires) — which would run
        // onBlur's cancel-reset (setDraft back to editStartValueRef)
        // BEFORE commit() ever reads `draft`, wiping out what was just
        // typed and saving blank instead. preventDefault on mousedown
        // stops the browser from shifting focus at all, so no blur (and
        // no reset) happens before the click's own commit() runs.
        onMouseDown={ev => ev.preventDefault()}
        onClick={commit}
        onMouseEnter={ev => ev.currentTarget.style.opacity = "0.85"}
        onMouseLeave={ev => ev.currentTarget.style.opacity = "1"}
        style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "var(--tt-text-1)", border: "none", borderRadius: 6, cursor: "pointer", padding: 0, transition: "opacity 0.15s" }}
      >
        <Check size={15} strokeWidth={SW} color="white" />
      </button>
    );

    // Once it holds a value and isn't actively focused, it reads as plain,
    // clickable text — same hover-then-click affordance as every other
    // EditableField (see the plain "display" branch below). An empty field
    // skips this and always shows the live textarea/input instead of
    // hiding behind a placeholder click.
    if (!isEmpty && !alwaysEditingFocused) {
      const textTag = (
        <Tag
          onClick={() => { editStartValueRef.current = value; setDraft(value || ""); setActiveField(fieldId); }}
          onMouseEnter={ev => ev.currentTarget.style.background = "var(--tt-grey03)"}
          onMouseLeave={ev => ev.currentTarget.style.background = "none"}
          style={{ display: "block", cursor: "pointer", borderRadius: 6, margin: 0, whiteSpace: multiline ? "pre-wrap" : "normal", ...textStyle }}
        >
          {value}
        </Tag>
      );
      return multiline ? <div style={boxStyle}>{textTag}</div> : textTag;
    }

    // `!isEmpty` guards the focus() call — it only needs to fire on the
    // transition from the text tag above into this textarea/input (a fresh
    // mount, so nothing is focused yet), not on an empty field a user
    // hasn't clicked into on its own. `el !== document.activeElement` then
    // keeps that from re-firing (and re-snapping the caret to the end) on
    // every keystroke's re-render, once the field is already focused — see
    // focusAtEnd. `aboveWhenEditing` (Additional Information's "Additional
    // Information"/"Optional" label row) only makes sense while the field is actually live — it
    // disappears along with the textarea once the value flips to plain
    // text above.
    return multiline ? (
      <div style={boxStyle}>
        {aboveWhenEditing}
        <div style={{ position: "relative" }}>
          <Textarea
            // Same two-job ref callback the photo caption's own textarea
            // uses (see PhotoLightbox) — focusAtEnd only once, on mount,
            // guarded by `el !== document.activeElement` so it doesn't
            // yank the caret back to the end on every keystroke's
            // re-render; the height auto-grow below is the opposite,
            // meant to rerun on every one of those re-renders, since
            // that's what keeps the box's height tracking its content.
            // Resetting to "auto" first is what lets scrollHeight shrink
            // back down too, not just grow.
            ref={el => {
              alwaysEditingRef.current = el;
              if (!el) return;
              if (!isEmpty && el !== document.activeElement) focusAtEnd(el);
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
            value={draft}
            onChange={ev => setDraft(maxLength ? ev.target.value.slice(0, maxLength) : ev.target.value)}
            onFocus={() => setActiveField(fieldId)}
            // Blur = cancel (click away, or Escape below triggering this
            // same path via .blur()): resets draft back to whatever this
            // edit session started from, discarding anything typed but
            // never saved. "Only clears if this field is still the active
            // one" guards setActiveField the same way it always has — a
            // plain unconditional null would risk wiping out whichever
            // OTHER field's click just claimed activeField. A successful
            // commit() already synced editStartValueRef to the fresh value
            // first, so this reset is a no-op in that case, not a revert.
            onBlur={() => {
              setActiveField(prev => prev === fieldId ? null : prev);
              setDraft(editStartValueRef.current || "");
              setError(false);
            }}
            onKeyDown={ev => {
              if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); commit(); }
              // stopPropagation so this only blurs (cancelling) this
              // field's own edit, not bubbling into the preview modal's
              // own document-level Escape listener and closing it too.
              if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); alwaysEditingRef.current?.blur(); }
            }}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            // resize:"none" — height is the ref callback's job now, not a
            // manual drag handle fighting it on the next keystroke.
            // overflow:"hidden" — there's nothing to scroll once the box
            // itself always grows to fit its content.
            // paddingBottom reserves room for the counter below (same
            // "controls live inside the textarea" idea as buttonReserve
            // does for the confirm button) so typed text never runs under it.
            style={{ fontFamily: "inherit", paddingRight: buttonReserve, paddingBottom: counter ? 22 : undefined, resize: "none", overflow: "hidden", ...inputStyle }}
          />
          {/* Remaining count, not "used/max" — starts at maxLength and
              counts down as you type, same bottom-left corner/style the
              photo caption's own counter uses in PhotoLightbox. */}
          {counter && maxLength && (
            <span style={{ position: "absolute", right: showConfirm ? 40 : 12, bottom: 9, fontSize: 11, fontWeight: 500, color: draft.length >= maxLength ? "var(--tt-red)" : "var(--tt-grey05)" }}>
              {maxLength - draft.length}
            </span>
          )}
          <div style={{ position: "absolute", right: 6, bottom: 6, display: "flex", alignItems: "center", gap: 4 }}>{showConfirm && confirmButton}</div>
        </div>
      </div>
    ) : (
      <div>
        {aboveWhenEditing}
        <div style={{ position: "relative" }}>
          <Input
            ref={el => { alwaysEditingRef.current = el; if (el && !isEmpty && el !== document.activeElement) focusAtEnd(el); }}
            type="text"
            value={draft}
            // filterInput (e.g. companyPhone's auto-formatter) applies as
            // the user types, same as the popover mode's own onChange.
            onChange={ev => { setDraft(filterInput ? filterInput(ev.target.value) : ev.target.value); if (error) setError(false); }}
            onFocus={() => setActiveField(fieldId)}
            // Same blur-is-cancel reset as the multiline branch above.
            onBlur={() => {
              setActiveField(prev => prev === fieldId ? null : prev);
              setDraft(editStartValueRef.current || "");
              setError(false);
            }}
            onKeyDown={ev => {
              if (ev.key === "Enter") { ev.preventDefault(); commit(); }
              if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); alwaysEditingRef.current?.blur(); }
            }}
            placeholder={placeholder}
            style={{ fontFamily: "inherit", padding: `0 ${buttonReserve}px 0 12px`, ...(error ? { borderColor: "var(--tt-red)" } : {}), ...inputStyle }}
          />
          <div style={{ position: "absolute", right: 6, bottom: 6, display: "flex", alignItems: "center", gap: 4 }}>{showConfirm && confirmButton}</div>
        </div>
        {error && (
          <p style={{ color: "var(--tt-red)", fontSize: 10, fontWeight: 500, margin: "4px 0 0", textAlign: "left" }}>
            {errorMessage || "That doesn't look right."}
          </p>
        )}
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
    const onChange = ev => { setDraft(ev.target.value); if (error) setError(false); };
    // No X button — the confirm button is never disabled (an empty/
    // unchanged draft saves fine, same as every other field now). Clicking
    // away cancels instead: blur below clears activeField without calling
    // onSave, so this whole block un-mounts back to the plain display
    // below, which still shows the untouched `value` — draft re-seeds
    // fresh from `value` the next time editing starts (see the display
    // Tag's own onClick), so there's nothing to actively revert here.
    // Same "hidden until there's something to confirm" rule as the
    // always-editing branch above — visible once this session started
    // from an existing non-blank value OR the draft has anything typed,
    // so clearing existing content can still be explicitly saved rather
    // than only ever left to blur-cancel (which reverts instead).
    const showConfirm = !!(value && value.trim()) || draft.trim().length > 0;
    return (
      <div key="editing" style={{ position: "relative", maxWidth: "100%", minWidth: 0, ...(!boxed ? { marginBottom: 8 } : {}), ...boxStyle }}>
        {multiline ? (
          <textarea
            ref={focusAtEnd}
            value={draft}
            onChange={onChange}
            onBlur={() => setActiveField(prev => prev === fieldId ? null : prev)}
            onKeyDown={ev => {
              if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); commit(); }
              // stopPropagation so this only cancels the field's own edit —
              // without it, the keydown still bubbles to the preview
              // modal's own document-level Escape listener and closes the
              // whole modal right behind it.
              if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); setActiveField(prev => prev === fieldId ? null : prev); }
            }}
            rows={3}
            placeholder={placeholder}
            style={{ display: "block", width: "100%", fontFamily: "inherit", border: `1px solid ${error ? "var(--tt-red)" : "var(--tt-text-1)"}`, borderRadius: 8, outline: "none", resize: "none", padding: "8px 12px", boxSizing: "border-box", background: "white", ...inputStyle }}
          />
        ) : (
          <input
            ref={focusAtEnd}
            type="text"
            value={draft}
            onChange={onChange}
            onBlur={() => setActiveField(prev => prev === fieldId ? null : prev)}
            onKeyDown={ev => {
              if (ev.key === "Enter") { ev.preventDefault(); commit(); }
              // Same reasoning as the textarea above — stop this from also
              // bubbling into the modal's own Escape-to-close listener.
              if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); setActiveField(prev => prev === fieldId ? null : prev); }
            }}
            placeholder={placeholder}
            style={{ fieldSizing: "content", width: "100%", maxWidth: "100%", minWidth: 120, height: 40, padding: `0 ${showConfirm ? 44 : 12}px 0 12px`, border: `1px solid ${error ? "var(--tt-red)" : "var(--tt-text-1)"}`, borderRadius: 8, fontFamily: "inherit", outline: "none", boxSizing: "border-box", ...inputStyle }}
          />
        )}
        {showConfirm && (
          <div style={multiline
            ? { display: "flex", justifyContent: "flex-end", gap: 4, marginTop: 8 }
            : { position: "absolute", right: 6, bottom: 6, display: "flex", alignItems: "center", gap: 4 }
          }>
            <button
              onClick={commit}
              onMouseEnter={ev => ev.currentTarget.style.opacity = "0.85"}
              onMouseLeave={ev => ev.currentTarget.style.opacity = "1"}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "var(--tt-text-1)", border: "none", borderRadius: 6, cursor: "pointer", padding: 0, transition: "opacity 0.15s" }}
            >
              <Check size={15} strokeWidth={SW} color="white" />
            </button>
          </div>
        )}
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
        // whiteSpace:pre-wrap for multiline — without it, a value with
        // line breaks (this branch is reachable by a plain click-to-edit
        // multiline field, not just alwaysEditing ones) collapses them
        // to one line here same as any other CSS "normal" text would.
        style={{ display: "inline-block", position: boxed ? "static" : "relative", cursor: "pointer", whiteSpace: multiline ? "pre-wrap" : "normal", ...textStyle }}
      >
        {value || <span style={{ color: "var(--tt-grey05)", textDecoration: "underline", ...placeholderStyle }}>{placeholder}</span>}
      </Tag>
    </div>
  );
}

// Downscales an uploaded image to a data URL (longest side capped at
// maxDim) instead of keeping the original file's full resolution — no
// upload endpoint, so this has to travel as a data URL wherever it's
// used. maxDim only needs to comfortably cover the largest size the
// image actually renders at (the logo's own fixed display width, or the
// cover photo's full page-content width) — capping well past that would
// just bloat the data URL for no visible gain, and capping short of it
// (the old flat 64px default, tuned for a since-grown ~80px display)
// shows up as visible blur once upscaled to fill a bigger box. Neither
// the logo nor an uploaded cover photo ever ride along in the "Copy
// link" URL (see handleCopy) — only the download, which has no such
// size constraint — so there's no reason to cap either one tighter than
// what actually keeps them looking sharp. mimeType/quality default to
// lossless PNG (right for a logo, which may have transparency); the
// cover photo instead asks for JPEG at quality, since it's ordinary
// photographic content where PNG would cost several times the file size
// for no visible difference.
// The "up to 5 MB" hint next to the Logo/Highlight Photo uploaders (see
// LogoUploadBox and handleCoverImageUpload) was display-only until now —
// nothing actually checked the picked file's own size before handing it
// to resizeImageToDataURL, so a much bigger file quietly went through
// anyway (just resized down like any other). This is what both of those
// now check against first.
const MAX_UPLOAD_IMAGE_BYTES = 5 * 1024 * 1024;

const resizeImageToDataURL = (file, maxDim = 64, mimeType = "image/png", quality) => new Promise((resolve, reject) => {
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
      resolve(canvas.toDataURL(mimeType, quality));
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
function LogoUploadBox({ src, onChange, disabled, size = 120, resizeTo = 360, hint, title = "Company Logo", alt = "Company logo", fit = "contain", mimeType = "image/png", quality }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = ev => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD_IMAGE_BYTES) { setError("File size exceeds the limit of 5 MB."); return; }
    setError("");
    setLoading(true);
    // resizeTo — comfortably sharp at any real on-screen size this box
    // ends up rendered at (its own display size is dynamic, driven by the
    // caller's `size` prop — see renderCoverHeader's own ResizeObserver —
    // not a fixed pixel width), without the flat 64px default (tuned for
    // a since-grown ~80px display) showing up as visible blur.
    resizeImageToDataURL(file, resizeTo, mimeType, quality)
      .then(url => { onChange(url); setLoading(false); })
      .catch(() => setLoading(false));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
    <div
      className={`tt-editable-wrap${src ? " group" : ""}`}
      onClick={() => !disabled && !loading && inputRef.current?.click()}
      style={{
        position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: disabled || loading ? "default" : "pointer",
        // Explicit width AND height from `size` (a measured pixel value
        // the caller passes down, not CSS alone) — align-items:stretch +
        // aspect-ratio looks like it should keep this box an exact square
        // matching its sibling's height on its own, but doesn't: a flex
        // item's main-axis size (width, in a row) is resolved BEFORE
        // align-items:stretch assigns its cross-axis (height) size, so
        // aspect-ratio never actually sees a resolved height to derive a
        // width from — it only ever sees this box's own tiny intrinsic
        // content width, leaving it tall and narrow instead of square.
        // object-fit:contain below centers a real logo within this square
        // instead of cropping it to fill (object-fit:cover would), so an
        // uploaded logo's own full image — whatever its real aspect ratio
        // — always stays entirely visible.
        width: size, height: size,
        // border-box — once uploaded, this box also gets a 12px inner
        // padding on every side (so the logo doesn't touch its own
        // frame); border-box is what keeps that padding (and the border
        // itself) from pushing the box past size×size, same squared
        // dimensions the empty/dashed state already has without either.
        boxSizing: "border-box",
        borderRadius: 8, overflow: "hidden",
        ...(src
          ? { border: `1px solid ${error ? "var(--tt-red)" : "var(--tt-grey03)"}`, background: "white", padding: fit === "cover" ? 0 : 12 }
          : { border: `1px dashed ${error ? "var(--tt-red)" : "var(--tt-grey04)"}`, background: "var(--tt-grey01)" }),
      }}
    >
      {loading ? (
        <Loader size={18} strokeWidth={SW} color="var(--tt-text-2)" className="tt-split-loader" style={{ display: "block", animation: "tt-spin 0.75s linear infinite, tt-fade-in 0.15s ease-out" }} />
      ) : src ? (
        <>
          <img src={src} alt={alt} style={{ display: "block", width: "100%", height: "100%", objectFit: fit }} />
          {/* Same darkening overlay a task's own PhotoGrid thumbnail shows
              on hover (rgba(10,22,41,0.25) over the whole image) — this
              box didn't have one before, just the corner button, which
              read inconsistently against every other hoverable image in
              this app. pointer-events-none so it doesn't intercept the
              click that's still meant for the box itself. */}
          {!disabled && (
            <div className="absolute inset-0 bg-[rgba(10,22,41,0.25)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-events-none" />
          )}
          {/* Hover-revealed, same corner-edit affordance/pattern as
              PhotoGrid's own per-photo delete button — whole-box click
              already re-opens the file picker (see onClick above), this
              is just the visible cue that it's editable. stopPropagation
              only to avoid double-firing the same click handler both
              here and on the box itself. */}
          {!disabled && (
            <button
              onClick={e => { e.stopPropagation(); !loading && inputRef.current?.click(); }}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                position: "absolute", top: 6, right: 32, width: 20, height: 20, borderRadius: "50%",
                border: "none", background: "rgba(10,22,41,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                cursor: "pointer", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
              }}
            >
              <Pencil size={12} color="white" strokeWidth={2.25} />
            </button>
          )}
          {/* Remove — clears the logo back to the empty/dashed state
              (rather than only ever being replaceable) via the same
              onChange the real upload uses, just with an empty value. */}
          {!disabled && (
            <button
              onClick={e => { e.stopPropagation(); setError(""); onChange(""); }}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%",
                border: "none", background: "rgba(10,22,41,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                cursor: "pointer", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
              }}
            >
              <Trash2 size={12} color="white" strokeWidth={2.25} />
            </button>
          )}
        </>
      ) : (
        <>
          <ImagePlus size={40} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-imageplus" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-2)", marginTop: 8 }}>{title}</span>
          {hint && !disabled && (
            <span style={{ fontSize: 12, fontWeight: 400, lineHeight: 1.4, color: "var(--tt-grey05)", textAlign: "center", padding: "0 12px", marginTop: 2 }}>{hint}</span>
          )}
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full mt-3"
              onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Choose File
            </Button>
          )}
        </>
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
    {error && (
      <p style={{ color: "var(--tt-red)", fontSize: 10, fontWeight: 500, margin: "4px 0 0", textAlign: "center" }}>{error}</p>
    )}
    </div>
  );
}

// ── Section nav sidebar ──
// One component shared by the draft modal and the Preview tab, so their
// icons, fonts, sizes and spacing can never drift apart again. Items:
//   leaf  { type:"leaf", key, label, icon }                      — a nav target
//   group { type:"group", label, icon, children:[{ key, label, groupLabel? }] }
// `icon` is a lucide component. Top-level rows (leaf or group heading) are
// bold text-1 with an icon; group children sit in a left-bordered rail,
// smaller and lighter, with an optional week/month divider above a child.
const NAV_CHILD_LIMIT = 10;
function NavSidebar({ items, activeKey, onSelect, footer }) {
  const [expanded, setExpanded] = useState({});
  return (
    // A flex column spanning the sidebar's full height (a stretched flex
    // item in its own row — see this component's own callers) split into
    // a scrollable nav list and an optional fixed footer (draft mode's own
    // Photo Limit widget — see its caller) pinned below it — the footer
    // stays put as the list scrolls past it instead of scrolling away too.
    // The logo itself lives in the chrome bar above (see draft-chrome/
    // ReportPreviewChrome), not here — centered over this same NAV_W
    // column from up there instead.
    <div style={{ width: NAV_W, flexShrink: 0, borderRight: "1px solid var(--tt-grey03)", background: "white", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16 }}>
      {items.map((group, gi) => {
        const topStyle = active => ({
          display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
          padding: "8px 12px", marginTop: gi === 0 ? 0 : 14, borderRadius: 8, border: "none",
          background: active ? "var(--tt-grey02)" : "transparent",
          color: "var(--tt-text-1)", fontSize: 13, fontWeight: 700,
          cursor: "pointer", transition: "background 0.15s",
        });
        const Icon = group.icon;
        if (group.type === "leaf") {
          const active = activeKey === group.key;
          return (
            <button
              key={group.key}
              onClick={() => onSelect(group.key)}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--tt-grey02)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              style={topStyle(active)}
            >
              <Icon size={16} strokeWidth={SW} color="var(--tt-text-1)" className={iconSplitClassFor(Icon)} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.label}</span>
            </button>
          );
        }
        // Group heading is plain text, not a button — there's nothing of its
        // own to scroll to, only its children.
        return (
          <div key={group.label}>
            <div style={topStyle(false)}>
              <Icon size={16} strokeWidth={SW} color="var(--tt-text-1)" className={iconSplitClassFor(Icon)} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.label}</span>
            </div>
            <div style={{ marginLeft: 21, paddingLeft: 12, borderLeft: "2px solid var(--tt-grey03)" }}>
              {(expanded[group.label] ? group.children : group.children.slice(0, NAV_CHILD_LIMIT)).map((child, ci) => {
                const active = activeKey === child.key;
                return (
                  <div key={child.key}>
                    {child.groupLabel && (
                      <p style={{ margin: ci === 0 ? "0 0 4px" : "12px 0 4px", padding: "0 10px", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--tt-text-1)" }}>
                        {child.groupLabel}
                      </p>
                    )}
                    <button
                      onClick={() => onSelect(child.key)}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--tt-grey02)"; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                      style={{
                        display: "flex", alignItems: "center", width: "100%", textAlign: "left",
                        padding: "6px 10px", marginTop: 2, borderRadius: 6, border: "none",
                        background: active ? "var(--tt-grey02)" : "transparent",
                        color: active ? "var(--tt-text-1)" : "var(--tt-grey06)",
                        fontSize: 12, fontWeight: active ? 600 : 400,
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                    >
                      {/* minWidth:0 — flex items default to min-width:auto,
                          which would otherwise stop this from ever actually
                          shrinking/truncating below its content's width. */}
                      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{child.label}</span>
                    </button>
                  </div>
                );
              })}
              {group.children.length > NAV_CHILD_LIMIT && (
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [group.label]: !prev[group.label] }))}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", marginTop: 2, border: "none", background: "transparent", color: "var(--tt-text-1)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                >
                  {expanded[group.label] ? "Show less" : `Show all (${group.children.length})`}
                </button>
              )}
            </div>
          </div>
        );
      })}
      </div>
      {footer && (
        // Horizontal padding matches NAV_SIDEBAR_ICON_INSET, not the list's
        // own 16 — a nav row's actual content (icon/text) sits inset that
        // far from the sidebar's edges (container padding + the row's own
        // left/right padding, see topStyle), so this lines the footer's
        // content up with that same edge instead of the container's own.
        <div style={{ flexShrink: 0, padding: `16px ${NAV_SIDEBAR_ICON_INSET}px`, borderTop: "1px solid var(--tt-grey03)" }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ── Fixed-position tooltip button ──
// Renders tooltip via a fixed div that escapes overflow clipping
// Small lock badge pinned to an action icon's bottom-right corner — marks
// Download / Copy link as locked behind the paywall (clicking them opens
// the paywall modal instead, see handleDownload/handleCopy). `dark` is for
// icons sitting on the lightbox's dark toolbar.
function LockedIcon({ locked, dark, children }) {
  if (!locked) return children;
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      {children}
      <span style={{
        position: "absolute", right: -5, bottom: -5, width: 12, height: 12, borderRadius: "50%",
        background: dark ? "var(--tt-text-1)" : "white", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Lock size={9} strokeWidth={2.5} color={dark ? "white" : "var(--tt-text-2)"} />
      </span>
    </span>
  );
}

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
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 4, overflow: "hidden", cursor: onClick ? "pointer" : "default" }}
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

// How many checklist items a task section shows before collapsing the
// rest behind "Show more" — see ReportsTab's renderTaskSection.
const CHECKLIST_COLLAPSE_COUNT = 3;

// Shared with ReportsTab's renderTaskSection, which needs the same chunk
// size to build continuation PhotoGrid calls for a "+N more" reveal.
const PHOTO_GRID_COLS = 5;
const PHOTO_GRID_CAP = PHOTO_GRID_COLS; // 1 row before "+N more"

// Photo grid capped to 1 row of 3 — beyond that, the last visible cell
// becomes a "+N more" overlay that expands the grid in place to show every
// photo (no cap), rather than jumping into the lightbox. Each visible photo
// also carries a select checkbox in its top-right corner; checking one or
// more surfaces a selection toolbar (rendered by the caller) with a Delete
// action. Deleted photos are filtered out here by their *original* index
// (excludedPhotos), so remaining photos keep the same index-based keys
// even after some are removed. An entry with zero visible photos renders
// nothing.
//
// `windowStart`/`windowEnd` (rather than a simple "expanded" boolean) are
// what let "+N more" render a fresh, independent PhotoGrid call instead of
// growing this one — see renderTaskSection's chunkNums. A block with an
// open windowEnd (undefined) shows up to PHOTO_GRID_CAP items starting at
// windowStart and, if more remain beyond that, a "+N more" cell — same
// cap logic the very first (unwindowed) block already used. A block with
// a closed windowEnd just shows exactly that slice, with no cap cell,
// because whatever comes after it already exists as the next call.
// `onExpand` is called only from an open-ended block's cap cell, and is
// owned by the caller (ReportsTab) rather than local state — every
// PhotoGrid call for the same entry reads the same lifted
// expandedPhotoGroups state, so a purely local "expanded" flag here would
// leave the other calls for that entry with no way to find out.
//
// A second circle in the bottom-left corner (icon centered inside it, both
// axes) is the caption trigger — hover-only, always, even once a caption
// is already set. Clicking it opens a small caret popover, fixed-positioned
// off the trigger's own bounding rect (so it isn't clipped by the
// grid/scroll container), with a single input for the caption text. Only
// one popover is open at a time across the grid.
function PhotoGrid({ photos, onOpen, excludedPhotos, entryKey, onDeletePhoto, captions, windowStart, windowEnd, onExpand }) {
  // Captions are read-only here — editable only from the lightbox (see
  // PhotoLightbox). The sticky-note icon itself is always visible once a
  // caption already exists (not just on hover, unlike the delete button
  // above) — hovering it (not clicking) shows the caption text in a
  // tooltip.
  const [captionTooltipIdx, setCaptionTooltipIdx] = useState(null); // original photo index, or null
  const [captionTooltipPos, setCaptionTooltipPos] = useState({ top: 0, left: 0 });
  const [deleteTooltipIdx, setDeleteTooltipIdx] = useState(null); // original photo index, or null
  const [deleteTooltipPos, setDeleteTooltipPos] = useState({ top: 0, left: 0 });

  const items = (photos || [])
    .map((k, i) => ({ k, i }))
    .filter(({ i }) => !(excludedPhotos && excludedPhotos[`${entryKey}_${i}`]));

  if (items.length === 0) return null;

  // This block's slice of the full (post-exclusion) items — [0, all) for
  // the plain/first block, [windowStart, windowEnd) for a bounded earlier
  // continuation chunk, or [windowStart, all) for the current open-ended
  // tip of the reveal chain (see the doc comment above).
  const windowItems = windowEnd != null
    ? items.slice(windowStart || 0, windowEnd)
    : items.slice(windowStart || 0);
  if (windowItems.length === 0) return null;

  const remaining = windowItems.length - PHOTO_GRID_CAP;
  const visibleItems = remaining <= 0 ? windowItems : windowItems.slice(0, PHOTO_GRID_CAP);
  // Full entry's photos (not just this block's window) — the lightbox
  // filmstrip should always offer every photo, regardless of which chunk
  // was clicked into it.
  const visiblePhotoKeys = items.map(it => it.k);
  // Original (pre-filter) indices for each visible photo, in the same
  // order as visiblePhotoKeys — lets the lightbox map a filmstrip
  // selection back to this entry's real excludedPhotos keys.
  const visibleOriginalIndices = items.map(it => it.i);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${PHOTO_GRID_COLS},1fr)`, gap: 8, marginTop: 10 }}>
      {visibleItems.map(({ k, i }, viewIdxInWindow) => {
        // Position within the FULL (unwindowed) items/visiblePhotoKeys
        // array — what the lightbox filmstrip actually indexes by.
        const viewIdx = (windowStart || 0) + viewIdxInWindow;
        const isCapCell = remaining > 0 && viewIdxInWindow === visibleItems.length - 1;
        const canOpen = !!(IMG_MAP[k] && onOpen) && !isCapCell;
        const caption = captions && captions[`${entryKey}_${i}`];
        return (
          <div key={i} className="group" style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ position: "relative" }}
            onMouseEnter={e => { if (canOpen) e.currentTarget.lastElementChild.style.opacity = "1"; }}
            onMouseLeave={e => { if (canOpen) e.currentTarget.lastElementChild.style.opacity = "0"; }}
          >
            <PhotoThumb src={IMG_MAP[k]} onClick={canOpen ? () => onOpen(visiblePhotoKeys, viewIdx, visibleOriginalIndices) : undefined} />
            {/* Deletes immediately — no confirmation, no multi-select (see
                handleDeletePhoto). */}
            {!isCapCell && IMG_MAP[k] && onDeletePhoto && (
              <button
                onClick={e => { e.stopPropagation(); onDeletePhoto(i); }}
                onMouseEnter={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setDeleteTooltipPos({ top: r.bottom + 6, left: r.right });
                  setDeleteTooltipIdx(i);
                }}
                onMouseLeave={() => setDeleteTooltipIdx(null)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%",
                  border: "none", background: "rgba(10,22,41,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  cursor: "pointer", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                  zIndex: 2,
                }}
              >
                <Trash2 size={12} color="white" strokeWidth={2.25} />
              </button>
            )}
            {deleteTooltipIdx === i && createPortal(
              <div style={{ position: "fixed", top: deleteTooltipPos.top, left: deleteTooltipPos.left, zIndex: 5300, maxWidth: 200, pointerEvents: "none" }}>
                <div style={{ background: "var(--tt-text-1)", color: "white", fontSize: 11, fontWeight: 500, lineHeight: 1.4, padding: "6px 10px", borderRadius: 6, boxShadow: "0 8px 24px rgba(10,22,41,0.24)" }}>
                  Only removed from this report.
                </div>
              </div>,
              document.body
            )}
            {!isCapCell && IMG_MAP[k] && caption && (
              <button
                type="button"
                onMouseEnter={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setCaptionTooltipPos({ top: r.bottom + 6, left: r.left });
                  setCaptionTooltipIdx(i);
                }}
                onMouseLeave={() => setCaptionTooltipIdx(null)}
                style={{
                  position: "absolute", bottom: 6, left: 6,
                  width: 20, height: 20, borderRadius: "50%",
                  border: "none", background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  cursor: "default", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                  zIndex: 2,
                }}
              >
                <StickyNote size={11} color="var(--tt-grey06)" strokeWidth={2.25} />
              </button>
            )}
            {canOpen && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(10,22,41,0.25)", opacity: 0, transition: "opacity 0.15s", pointerEvents: "none", zIndex: 1 }} />
            )}
            {isCapCell && (
              <button
                onClick={onExpand}
                style={{
                  position: "absolute", inset: 0, background: "rgba(10,22,41,0.55)",
                  border: "none", borderRadius: 4, color: "white",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                +{remaining} more
              </button>
            )}
            {captionTooltipIdx === i && createPortal(
              // Portaled straight to <body> — same contentVisibility/
              // stacking-context reasoning as the lightbox's own caption
              // editor; see its comment for the full explanation. 280 (up
              // from 220) reads more comfortably now that a caption can
              // run up to CAPTION_MAX_LEN characters — wide enough that a
              // full-length caption wraps into a readable few lines
              // instead of a tall, narrow column of short ones; no
              // truncation either way, it just wraps.
              <div style={{ position: "fixed", top: captionTooltipPos.top, left: captionTooltipPos.left, zIndex: 5300, maxWidth: 280, pointerEvents: "none" }}>
                <div style={{ background: "var(--tt-text-1)", color: "white", fontSize: 11, fontWeight: 500, lineHeight: 1.4, padding: "6px 10px", borderRadius: 6, boxShadow: "0 8px 24px rgba(10,22,41,0.24)", whiteSpace: "pre-wrap" }}>
                  {caption}
                </div>
              </div>,
              document.body
            )}
          </div>
          </div>
        );
      })}
    </div>
  );
}

// Manage Photos modal thumbnail — same shimmer-until-loaded behavior as
// PhotoThumb, but without a click handler of its own since the enclosing
// button already toggles selection. loading="lazy" defers the actual
// fetch until the thumbnail nears the modal's own scroll container, so a
// report with many photos doesn't fire off every request at once.
function ManagedPhotoImage({ src, onLoad }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="tt-skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => { setLoaded(true); onLoad && onLoad(); }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.2s" }}
      />
    </>
  );
}

// Report-wide photo list, one section per task with photos — opened by
// hovering the "Photo Limit" indicator (see the draft chrome), not from
// any single task item anymore. Every photo shows here (both included and
// excluded) as a freely checkable/uncheckable thumbnail — but checking one
// more once already at PHOTO_LIMIT selected is blocked with a warning
// instead of silently going over, same limit
// defaultGlobalOverflowExclusions uses for a fresh report's default
// selection.
function PhotoManagerModal({ groups, excludedPhotos, titleOverrides, onSetPhotoExcluded, onPreviewPhoto, previewActive, onClose }) {
  const sections = groups.flatMap(g => g.entries.map((e, i) => {
    const entryKey = `${g.key}_${i}`;
    const items = (e.photos || []).map((k, pi) => ({ k, pi })).filter(({ k }) => IMG_MAP[k]);
    return items.length > 0 ? { entryKey, taskName: (titleOverrides && titleOverrides[entryKey]) ?? e.note, date: e.date, items } : null;
  })).filter(Boolean);
  const includedCount = sections.reduce(
    (s, sec) => s + sec.items.filter(({ pi }) => !(excludedPhotos && excludedPhotos[`${sec.entryKey}_${pi}`])).length,
    0
  );
  const [limitWarning, setLimitWarning] = useState(false);
  const warningTimerRef = useRef(null);
  const [cappedTooltipKey, setCappedTooltipKey] = useState(null); // `${entryKey}_${pi}` of the capped (disabled) photo currently hovered, or null
  const [cappedTooltipPos, setCappedTooltipPos] = useState({ top: 0, left: 0 });
  const [loadedPhotos, setLoadedPhotos] = useState({}); // { [entryKey_pi]: true } — outline/checkbox only draw once the thumbnail itself has loaded, so the skeleton shows as just a skeleton

  useEffect(() => {
    // Skipped while the shared PhotoLightbox is open on top of this modal
    // (see onPreviewPhoto) — its own Escape handler should close just the
    // preview, not this modal underneath it.
    if (previewActive) return;
    const handler = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, previewActive]);

  // Auto-dismisses the warning a couple seconds after the blocked attempt
  // that raised it, rather than leaving it stuck until the user notices.
  useEffect(() => () => { if (warningTimerRef.current) clearTimeout(warningTimerRef.current); }, []);
  const flashLimitWarning = () => {
    setLimitWarning(true);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    warningTimerRef.current = setTimeout(() => setLimitWarning(false), 2500);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 5100, background: "rgba(10,22,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 640, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "white", borderRadius: 16, boxShadow: "0 16px 48px rgba(10,22,41,0.25)", overflow: "hidden" }}
      >
        {/* Fixed on top — only the section list below scrolls. */}
        <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--tt-grey03)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--tt-text-1)", margin: 0 }}>Manage photos</p>
            <button
              onClick={onClose}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tt-text-1)", padding: 4, display: "flex", borderRadius: 6, transition: "background 0.15s" }}
            >
              <X size={20} strokeWidth={SW} className="tt-split-x" />
            </button>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-text-2)", margin: "4px 0 0" }}>
            {includedCount} of {PHOTO_LIMIT} selected
          </p>
        </div>
        <div style={{ overflowY: "auto", padding: 24 }}>
        {limitWarning && (
          <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--tt-red)", background: "rgba(229,72,77,0.08)", borderRadius: 6, padding: "8px 10px", margin: "0 0 16px" }}>
            <AlertTriangle size={13} strokeWidth={SW} className="tt-split-alerttriangle" style={{ flexShrink: 0 }} />
            You can select up to {PHOTO_LIMIT} photos — uncheck one first.
          </p>
        )}
        {sections.map(sec => (
          <div key={sec.entryKey} style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: "var(--tt-text-1)", margin: "0 0 2px" }}>{sec.taskName}</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--tt-grey05)", margin: "0 0 12px" }}>
              {sec.items.filter(({ pi }) => !(excludedPhotos && excludedPhotos[`${sec.entryKey}_${pi}`])).length} of {sec.items.length} selected
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
              {sec.items.map(({ k, pi }) => {
                const key = `${sec.entryKey}_${pi}`;
                const included = !(excludedPhotos && excludedPhotos[key]);
                const capped = !included && includedCount >= PHOTO_LIMIT;
                const loaded = !!loadedPhotos[key];
                return (
                  <div
                    key={pi}
                    className="group"
                    onClick={() => {
                      if (capped) { flashLimitWarning(); return; }
                      onSetPhotoExcluded(sec.entryKey, pi, included);
                    }}
                    onMouseEnter={capped ? e => {
                      setCappedTooltipPos({ top: e.clientY, left: e.clientX });
                      setCappedTooltipKey(key);
                    } : undefined}
                    onMouseMove={capped ? e => setCappedTooltipPos({ top: e.clientY, left: e.clientX }) : undefined}
                    onMouseLeave={capped ? () => setCappedTooltipKey(null) : undefined}
                    style={{ position: "relative", cursor: capped ? "not-allowed" : "pointer" }}
                  >
                    {/* Dimmed on capped — the checkbox is part of this
                        "can't select" cue, but the preview button below
                        stays outside it since previewing always works. */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 6, overflow: "hidden", opacity: capped ? 0.45 : 1 }}>
                      <ManagedPhotoImage src={IMG_MAP[k]} onLoad={() => setLoadedPhotos(p => ({ ...p, [key]: true }))} />
                      {/* Hover-revealed like the delete/preview buttons —
                          except once checked, it stays visible so the
                          selection state reads at a glance. Withheld
                          entirely until the thumbnail itself has loaded, so
                          the skeleton shows as just a skeleton, and skipped
                          altogether when capped since it can't be selected. */}
                      {loaded && !capped && (
                        <span
                          className={included ? undefined : "opacity-0 transition-opacity group-hover:opacity-100"}
                          style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%", background: included ? "var(--tt-secondary)" : "rgba(10,22,41,0.35)", border: included ? "none" : "1.5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {included && <Check size={10} color="white" strokeWidth={3} />}
                        </span>
                      )}
                    </div>
                    {onPreviewPhoto && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onPreviewPhoto({
                            photos: sec.items.map(it => it.k),
                            index: sec.items.findIndex(it => it.pi === pi),
                            originalIndices: sec.items.map(it => it.pi),
                            entryDate: sec.date,
                            taskName: sec.taskName,
                            entryKey: sec.entryKey,
                          });
                        }}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ position: "absolute", bottom: 6, left: 6, width: 20, height: 20, borderRadius: "50%", border: "none", background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, cursor: "pointer", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)", zIndex: 2 }}
                      >
                        <ExternalLink size={11} color="var(--tt-grey06)" strokeWidth={2.25} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        </div>
      </div>
      {cappedTooltipKey !== null && (
        <div style={{
          position: "fixed", zIndex: 5200,
          top: cappedTooltipPos.top + 16, left: cappedTooltipPos.left + 12,
          background: "var(--tt-text-1)", color: "white",
          fontSize: 11, fontWeight: 500, whiteSpace: "nowrap",
          padding: "4px 8px", borderRadius: 4,
          pointerEvents: "none",
        }}>
          Unselect an image first
        </div>
      )}
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

function PhotoLightbox({ photos, index, entryDate, taskName, entryKey, originalIndices, captions, onCaptionChange, onIndexChange, onClose, onDeleteSelected, onDownload, onCopyLink, linkCopied, actionsDisabled, locked }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [imgDims, setImgDims] = useState(null);
  const [selectedFilmstrip, setSelectedFilmstrip] = useState({}); // { [photoIndex]: photoKey } — filmstrip checkbox selection
  const [showMoreMenu, setShowMoreMenu] = useState(false); // "..." dropdown (Information/Delete)
  const moreMenuRef = useRef(null);
  const [captionEditing, setCaptionEditing] = useState(false); // caption input overlaid on the image
  const captionStartRef = useRef(""); // caption text when editing was opened, for the "Escape reverts" behavior
  // Shared by both delete actions below (the filmstrip's bulk "Delete"
  // pill and the "..." menu's own Delete item) — same reassurance text
  // PhotoGrid's own per-photo trash button already shows, just also
  // surfaced here since both of these delete more than one photo's worth
  // of confidence-checking at once. Holds the tooltip's own position
  // (computed fresh off whichever trigger it opened from — see each
  // button's onMouseEnter) rather than a plain boolean, since the two
  // triggers sit in different parts of the screen and need different
  // anchoring (see each one's own comment).
  const [deleteActionTooltip, setDeleteActionTooltip] = useState(null);

  // photos[index] (the actual photo key shown), not just index — deleting
  // a photo shifts every later one down to fill the gap, so the numeric
  // index can stay exactly the same while the photo actually displayed
  // there changes underneath it (see onDeleteSelected's own clamping).
  // Keying off index alone would then skip this reset, leaving whatever
  // rotation/zoom/etc. was mid-edit on the deleted photo applied to its
  // replacement instead.
  useEffect(() => { setRotation(0); setZoom(100); setShowFileDetails(false); setImgDims(null); setShowMoreMenu(false); setCaptionEditing(false); }, [photos[index]]);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = e => { if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMoreMenu]);

  const toggleFilmstripSelect = (i, photoKey) => {
    setSelectedFilmstrip(prev => {
      const next = { ...prev };
      if (next[i] !== undefined) delete next[i]; else next[i] = photoKey;
      return next;
    });
  };

  const handleDeleteSelectedFilmstrip = () => {
    onDeleteSelected && onDeleteSelected(Object.keys(selectedFilmstrip).map(Number));
    // The pill this tooltip is anchored to disappears the moment the
    // selection it's tied to is cleared (no native mouse movement to
    // trigger its own onMouseLeave), so this has to clear it explicitly.
    setDeleteActionTooltip(null);
    // The positions just deleted no longer mean anything once onDeleteSelected
    // above shrinks the photos/originalIndices arrays (every later photo
    // shifts down to fill the gap) — leaving the old selection around
    // would have it pointing at whatever new photos happen to have
    // slid into those same positions.
    setSelectedFilmstrip({});
  };

  useEffect(() => {
    const handler = (e) => {
      // Escape while the caption textarea is focused is already handled
      // (and stopped from bubbling here) by its own onKeyDown — it
      // reverts the caption, not the whole lightbox. Arrow keys have no
      // such guard of their own though: without captionEditing here too,
      // pressing Left/Right to move the caret while typing a caption
      // would also jump to the previous/next photo underneath it.
      if (e.key === "Escape") onClose();
      if (captionEditing) return;
      if (e.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onIndexChange(Math.min(photos.length - 1, index + 1));
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [index, photos.length, onClose, onIndexChange, captionEditing]);

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
  // `index` is a position in this filmstrip's own (possibly filtered)
  // photo list — originalIndices maps it back to the entry's real photo
  // index, the same one captions/excludedPhotos are keyed by everywhere
  // else (see PhotoGrid).
  const originalIdx = originalIndices ? originalIndices[index] : index;
  const caption = captions && captions[`${entryKey}_${originalIdx}`];

  return (
    // Stays exactly viewport-sized (overflowX here, no minWidth) — same
    // "fixed parent scrolls a wider plain child" split previewPanelRef
    // uses (see its own comment for why position:fixed + its own
    // min-width doesn't reliably become swipeable on a phone).
    <div style={{ position: "fixed", inset: 0, zIndex: 5500, background: "black", overflowX: "auto" }}>
    <div style={{ minWidth: 1200, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12,
        padding: "10px 20px", flexShrink: 0, background: "var(--tt-grey06)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, justifySelf: "start" }}>
          <button onClick={onClose} style={iconBtnStyle} onMouseEnter={onIconEnter} onMouseLeave={onIconLeave}>
            <ChevronLeft size={20} strokeWidth={SW} />
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
            <Pencil size={16} strokeWidth={SW} className="tt-split-pencil" />
          </LightboxIconBtn>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, justifySelf: "end" }}>
          <LightboxIconBtn label={locked ? "Upgrade to unlock" : "Download"} disabled={actionsDisabled} onClick={onDownload}>
            <LockedIcon locked={locked} dark><Download size={20} strokeWidth={SW} className="tt-split-download" /></LockedIcon>
          </LightboxIconBtn>
          <LightboxIconBtn label="Share">
            <Forward size={20} strokeWidth={SW} className="tt-split-forward" />
          </LightboxIconBtn>
          <LightboxIconBtn label={locked ? "Upgrade to unlock" : linkCopied ? "Link copied" : "Copy link to share"} disabled={actionsDisabled} onClick={onCopyLink}>
            {linkCopied ? <Check size={20} strokeWidth={SW} /> : <LockedIcon locked={locked} dark><Link size={20} strokeWidth={SW} className="tt-split-link" /></LockedIcon>}
          </LightboxIconBtn>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
          <LightboxIconBtn label="Rotate" onClick={() => setRotation(r => (r + 90) % 360)}>
            <RotateCw size={20} strokeWidth={SW} />
          </LightboxIconBtn>
          <LightboxIconBtn label="Zoom out" disabled={zoom <= 25} onClick={() => setZoom(z => Math.max(25, z - 25))}>
            <ZoomOut size={20} strokeWidth={SW} className="tt-split-zoomout" />
          </LightboxIconBtn>
          <span style={{ fontSize: 14, fontWeight: 500, color: "white", width: 40, textAlign: "center" }}>{zoom}%</span>
          <LightboxIconBtn label="Zoom in" disabled={zoom >= 200} onClick={() => setZoom(z => Math.min(200, z + 25))}>
            <ZoomIn size={20} strokeWidth={SW} className="tt-split-zoomin" />
          </LightboxIconBtn>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
          <div ref={moreMenuRef} style={{ position: "relative" }}>
            <LightboxIconBtn label="More" onClick={() => setShowMoreMenu(o => !o)}>
              <MoreVertical size={20} strokeWidth={SW} className="tt-split-morevertical" />
            </LightboxIconBtn>
            {showMoreMenu && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 10, width: 200,
                background: "var(--tt-text-1)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                boxShadow: "0 12px 32px rgba(0,0,0,0.4)", overflow: "hidden", padding: 4,
              }}>
                <button
                  onClick={() => { setShowFileDetails(true); setShowMoreMenu(false); }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", background: "none", border: "none", borderRadius: 6, color: "white", fontSize: 14, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                >
                  <Info size={16} strokeWidth={SW} className="tt-split-info" /> Information
                </button>
                <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "4px 0" }} />
                <button
                  onClick={() => { setShowMoreMenu(false); setDeleteActionTooltip(null); onDeleteSelected && onDeleteSelected([index]); }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(229,72,77,0.12)";
                    const r = e.currentTarget.getBoundingClientRect();
                    setDeleteActionTooltip({ top: r.bottom + 6, left: r.left });
                  }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; setDeleteActionTooltip(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", background: "none", border: "none", borderRadius: 6, color: "var(--tt-red)", fontSize: 14, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                >
                  <Trash2 size={16} strokeWidth={SW} className="tt-split-trash2" /> Delete
                </button>
              </div>
            )}
          </div>
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
          display: "inline-flex", alignItems: "center", gap: 6, height: 22, padding: "0 10px",
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
              width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)",
              background: "rgba(10,22,41,0.4)", color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(10,22,41,0.4)"}
          >
            <ArrowLeft size={18} strokeWidth={SW} className="tt-split-arrowleft" />
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
              width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)",
              background: "rgba(10,22,41,0.4)", color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(10,22,41,0.4)"}
          >
            <ArrowRight size={18} strokeWidth={SW} className="tt-split-arrowright" />
          </button>
        )}

        {Object.keys(selectedFilmstrip).length > 0 && (
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10 }}>
            <button
              onClick={handleDeleteSelectedFilmstrip}
              // Anchored above (bottom, not top) — this pill already sits
              // near the bottom of the screen (bottom:16), right above
              // the filmstrip; a tooltip opening downward from here would
              // just run straight into it instead of having room to show.
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(10,22,41,1)";
                const r = e.currentTarget.getBoundingClientRect();
                setDeleteActionTooltip({ bottom: window.innerHeight - r.top + 6, left: r.left });
              }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,22,41,0.75)"; setDeleteActionTooltip(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, background: "rgba(10,22,41,0.75)",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "10px 16px",
                color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "background 0.15s",
              }}
            >
              <Trash2 size={16} strokeWidth={SW} className="tt-split-trash2" /> Delete
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
              onMouseEnter={e => e.currentTarget.style.background = "rgba(10,22,41,1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(10,22,41,0.75)"}
              style={{
                width: 44, height: 44, borderRadius: "50%", background: "rgba(10,22,41,0.75)",
                border: "1px solid rgba(255,255,255,0.2)", color: "white", display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <X size={18} strokeWidth={SW} className="tt-split-x" />
            </button>
          </div>
        )}

        {/* Shared by both delete triggers above (the bulk pill and the
            "..." menu's own Delete item) — see deleteActionTooltip's own
            comment. Portaled to <body>, same as PhotoGrid's identical
            per-photo delete tooltip in draft mode, at a higher zIndex
            (5600, not that one's 5300) since this lightbox itself
            already sits at 5500. */}
        {deleteActionTooltip && createPortal(
          <div style={{ position: "fixed", ...deleteActionTooltip, zIndex: 5600, maxWidth: 200, pointerEvents: "none" }}>
            <div style={{ background: "var(--tt-text-1)", color: "white", fontSize: 11, fontWeight: 500, lineHeight: 1.4, padding: "6px 10px", borderRadius: 6, boxShadow: "0 8px 24px rgba(10,22,41,0.24)" }}>
              Only removed from this report.
            </div>
          </div>,
          document.body
        )}

        {/* Caption — overlaid directly on the image, three states:
            - empty, not editing: a ghost Button (md/"default" size — this
              Button component's scale is sm/default/lg, "default" is its
              md), centered, sticky-note icon + "Add caption".
            - editing (clicked from either state below): a textarea styled
              like Summary's own (see renderSummaryBlock/Textarea) — same
              border/radius/font — 1 row by default (see .tt-caption-box
              in index.css for the width: 30% of the window, 90% on a
              real phone screen), but grows with its content past that
              instead of staying fixed or needing a manual resize handle
              (see the Textarea's own ref callback). The character
              counter and Check/X both sit overlaid INSIDE the box's own
              bottom corners (counter bottom-left, buttons bottom-right),
              same "controls live inside the textarea" idea Summary's own
              alwaysEditing textarea uses for its
              Check/X, just with the counter added on the opposite corner.
            - saved, not editing: centered plain text, 14px/1.6 line
              height (16px medium, text-wrap: balance so multi-line captions
              get near-equal line widths), clickable to re-edit. Bound directly to the
              `caption` prop (no separate draft/commit step) — every
              keystroke while editing calls onCaptionChange immediately;
              Escape is what reverts to captionStartRef instead. Hidden
              entirely (all three states, caption or not) while the
              filmstrip's own bulk-select bar is up — that bar sits in
              this same bottom area (see selectedFilmstrip above), and a
              caption prompt/box/text down here at the same time just
              clutters into it. */}
        {Object.keys(selectedFilmstrip).length === 0 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center",
          padding: "20px 24px 18px", background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
        }}>
          {captionEditing ? (() => {
            // No X — same "click away cancels, check button only shows
            // once there's something to confirm" rules as EditableField's
            // own alwaysEditing textarea (see its own comment). Here
            // "cancel" means reverting to captionStartRef (this session's
            // starting caption) since every keystroke already commits
            // live via onCaptionChange, same as Escape already did.
            const showCheck = !!(captionStartRef.current && captionStartRef.current.trim()) || (caption || "").trim().length > 0;
            const revertAndClose = () => { onCaptionChange && onCaptionChange(originalIdx, captionStartRef.current); setCaptionEditing(false); };
            return (
            <div className="tt-caption-box" style={{ position: "relative" }}>
              <Textarea
                // Combines two jobs in one ref callback (same pattern
                // EditableField's own alwaysEditing textarea uses — see
                // its own comment): focusAtEnd only once, right when this
                // textarea first mounts (el !== document.activeElement
                // guards that from re-firing on every keystroke's
                // re-render and yanking the caret back to the end while
                // mid-edit); the height auto-grow below, on the other
                // hand, is SUPPOSED to rerun on every one of those
                // re-renders, since that's what keeps the box's height
                // matching its content as it's typed. Resetting to "auto"
                // first is what lets scrollHeight shrink back down too,
                // not just grow.
                ref={el => {
                  if (!el) return;
                  if (el !== document.activeElement) focusAtEnd(el);
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }}
                value={caption || ""}
                onChange={ev => onCaptionChange && onCaptionChange(originalIdx, ev.target.value.slice(0, CAPTION_MAX_LEN))}
                // Blur = cancel (click away) — reverts the same way Escape
                // does. The check button's own onMouseDown preventDefault
                // (below) stops clicking it from triggering this first.
                onBlur={revertAndClose}
                onKeyDown={ev => {
                  // Enter alone confirms (closes editing, same as the
                  // Check button); Shift+Enter inserts a real newline.
                  if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); setCaptionEditing(false); }
                  if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); revertAndClose(); }
                }}
                placeholder="Add a caption"
                rows={1}
                maxLength={CAPTION_MAX_LEN}
                // fontSize/color/lineHeight match Summary's own inputStyle
                // exactly (see renderSummaryBlock); resize:none — height
                // is the ref callback's job now, not a manual drag handle
                // fighting it on the next keystroke. paddingLeft/Right/
                // Bottom carve out room for the counter (bottom-left) and
                // the check button (bottom-right, only once it's shown)
                // overlaid on top of the text.
                style={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, resize: "none", overflow: "hidden", paddingLeft: 12, paddingRight: showCheck ? 40 : 12, paddingBottom: 30 }}
              />
              {/* Remaining count, not "used/max" — starts at CAPTION_MAX_LEN
                  and counts down (250, 249, 248, ...) as you type. */}
              <span style={{ position: "absolute", left: 12, bottom: 9, fontSize: 11, fontWeight: 500, color: (caption || "").length >= CAPTION_MAX_LEN ? "var(--tt-red)" : "var(--tt-grey05)" }}>
                {CAPTION_MAX_LEN - (caption || "").length}
              </span>
              {showCheck && (
                <div style={{ position: "absolute", right: 6, bottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <button
                    onMouseDown={ev => ev.preventDefault()}
                    onClick={() => setCaptionEditing(false)}
                    onMouseEnter={ev => ev.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={ev => ev.currentTarget.style.opacity = "1"}
                    style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "var(--tt-text-1)", border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }}
                  >
                    <Check size={15} strokeWidth={SW} color="white" />
                  </button>
                </div>
              )}
            </div>
            );
          })() : caption ? (
            <p
              onClick={() => { captionStartRef.current = caption || ""; setCaptionEditing(true); }}
              // 50vw, not .tt-caption-box's 30/90 — see .tt-caption-saved
              // in index.css.
              className="tt-caption-saved"
              // underline only on hover — the "this text is clickable"
              // signal, without permanently making a saved caption look
              // like a link/placeholder at rest.
              onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}
              style={{ margin: 0, textAlign: "center", fontSize: 16, fontWeight: 500, lineHeight: 1.6, textWrap: "balance", color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.6)", cursor: "pointer", textDecoration: "none", whiteSpace: "pre-wrap" }}
            >
              {caption}
            </p>
          ) : onCaptionChange ? (
            <Button
              type="button"
              variant="ghost"
              size="default"
              onClick={() => { captionStartRef.current = ""; setCaptionEditing(true); }}
              // The ghost variant's own hover (a light gray-100 fill, see
              // buttonVariants) is a CSS class (:hover in the
              // stylesheet) — it doesn't go away just because these
              // handlers stop setting a background of their own, it has
              // to be explicitly cancelled back to transparent here too.
              // Underline instead is the actual "this is clickable"
              // signal, same one the saved-caption text's own hover
              // uses, which reads clearly regardless of what's behind it.
              onMouseEnter={ev => { ev.currentTarget.style.textDecoration = "underline"; ev.currentTarget.style.background = "transparent"; }}
              onMouseLeave={ev => { ev.currentTarget.style.textDecoration = "none"; ev.currentTarget.style.background = "transparent"; }}
              // Native <button> elements default to cursor:default (an
              // arrow, not a hand) in most browsers unless told otherwise
              // — the Button component's own buttonVariants classes don't
              // set cursor-pointer, so this needs to be explicit.
              style={{ color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.6)", cursor: "pointer" }}
            >
              <StickyNote size={14} strokeWidth={2} /> Add caption
            </Button>
          ) : null}
        </div>
        )}
      </div>

      {/* Filmstrip — shown even for a single photo, not just when there's
          more than one to switch between. */}
      {photos.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-start", gap: 10, padding: "14px 16px", flexShrink: 0, overflowX: "auto", background: "var(--tt-grey06)" }}>
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
                <X size={20} strokeWidth={SW} className="tt-split-x" />
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
  // Deliberately well over PER_ENTRY_PHOTO_LIMIT (15) — the most recent
  // entry is always the first task item shown, so the over-the-cap
  // "manage photos" UI has something to demo without needing a specific
  // date range. Kept at 30 (not the full PHOTO_LIMIT of 50) so the
  // prototype's default/first-load state stays manageable to click
  // through.
  {
    date: "2026-09-10", note: "Flooring installation started on the ground floor.",
    // Deliberately 12 items — over the 10-item cap, to demo the "(limited
    // to the 10 most recent)" truncation note on the first (most visible)
    // entry's checklist.
    checklist: [
      { text: "Remove old flooring throughout the ground floor" },
      { text: "Level and inspect subfloor for damage" },
      { text: "Acclimate hardwood planks to room humidity" },
      { text: "Order hardwood plank materials" },
      { text: "Begin hardwood plank installation in living room" },
      { text: "Install hardwood in dining room" },
      { text: "Install underlayment in hallway" },
      { text: "Fit transition strips between rooms" },
      { text: "Sand and prep subfloor seams" },
      { text: "Apply protective finish coat" },
      { text: "Let finish coat cure fully" },
      { text: "Clean and inspect finished flooring" },
    ],
    photos: ["img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8", "img9", "img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8", "img9", "img1", "img2", "img3", "img4", "img5", "img6", "img7", "img8", "img9", "img1", "img2", "img3"],
  },
  {
    date: "2026-09-09", note: "Exterior siding repairs completed on the south wall.",
    // Deliberately 7 items — see the flooring entry above for why.
    checklist: [
      { text: "Remove damaged siding panels" },
      { text: "Inspect wall for moisture damage" },
      { text: "Repair underlying sheathing" },
      { text: "Install house wrap over sheathing" },
      { text: "Install new siding panels" },
      { text: "Caulk and seal all seams" },
      { text: "Touch up paint to match existing siding" },
    ],
    photos: ["img9", "img2", "img3", "img7", "img4", "img5", "img6"],
  },
  {
    date: "2026-09-08", note: "Final electrical connections completed in the main panel.",
    checklist: [
      { text: "Install main breaker panel" },
      { text: "Connect circuit wiring" },
      { text: "Label all breakers" },
      { text: "Verify grounding and bonding" },
      { text: "Test panel for proper voltage" },
    ],
    photos: ["img9", "img8"],
  },
  {
    date: "2026-09-07", note: "Plumbing fixtures installed in all bathrooms.",
    checklist: [
      { text: "Install sinks and faucets" },
      { text: "Connect shower and tub fixtures" },
      { text: "Test all fixtures for leaks" },
    ],
    photos: [],
  },
  {
    date: "2026-09-06", note: "Ceiling lights installed and tested.",
    checklist: [
      { text: "Install and test all ceiling light fixtures" },
    ],
    photos: ["img8", "img7"],
  },
  {
    date: "2026-09-06", note: "Final walkthrough completed with the client — no issues noted.",
    checklist: [
      { text: "Review completed work with client" },
      { text: "Confirm no outstanding punch list items" },
      { text: "Collect client sign-off" },
    ],
    photos: [],
  },
  {
    date: "2026-09-05", note: "Bathroom tile installation completed on the second floor.",
    checklist: [
      { text: "Prep subfloor for tile" },
      { text: "Lay tile in shower and floor areas" },
      { text: "Grout and seal tile" },
    ],
    photos: [],
  },
  {
    date: "2026-09-04", note: "Kitchen cabinet hardware installed.",
    checklist: [
      { text: "Install cabinet hinges" },
      { text: "Attach handles and knobs" },
      { text: "Adjust cabinet doors for alignment" },
    ],
    photos: ["img6", "img1", "img9", "img2", "img3", "img4", "img8"],
  },
  {
    date: "2026-09-03", note: "Interior door hardware fitted — knobs and locks in place.",
    checklist: [
      { text: "Install door knobs" },
      { text: "Install deadbolts and locks" },
      { text: "Test door operation" },
    ],
    photos: ["img6", "img7"],
  },
  {
    date: "2026-09-02", note: "Drywall patching completed in the hallway.",
    checklist: [
      { text: "Cut out damaged drywall sections" },
      { text: "Install patch and tape seams" },
      { text: "Sand and prime patched area" },
    ],
    photos: ["img4"],
  },
  {
    date: "2026-09-01", note: "Exterior paint touch-ups finished on the west elevation.",
    checklist: [
      { text: "Pressure wash exterior surface" },
      { text: "Apply primer to touch-up areas" },
      { text: "Apply finish coat" },
    ],
    photos: ["img2", "img5", "img7", "img1"],
  },
  {
    date: "2026-08-31", note: "HVAC ductwork inspection passed.",
    checklist: [
      { text: "Inspect duct connections for leaks" },
      { text: "Verify airflow at each vent" },
      { text: "Confirm inspection sign-off" },
    ],
    photos: ["img8", "img9"],
  },
  {
    date: "2026-08-28", note: "Cracked wall sections patched and primed.",
    checklist: [
      { text: "Clean and widen cracks for patching" },
      { text: "Apply patching compound" },
      { text: "Prime patched sections" },
    ],
    photos: ["img1", "img3", "img4"],
  },
  {
    date: "2026-08-25", note: "Garage door opener installed and tested.",
    checklist: [
      { text: "Mount opener unit" },
      { text: "Program remote controls" },
      { text: "Test safety reverse sensors" },
    ],
    photos: ["img6"],
  },
  {
    date: "2026-08-21", note: "Brickwork reinforcement completed on the north facade.",
    checklist: [
      { text: "Remove loose or damaged brick" },
      { text: "Install reinforcement ties" },
      { text: "Repoint mortar joints" },
    ],
    photos: ["img2", "img1"],
  },
  {
    date: "2026-08-18", note: "Landscaping grading completed around the foundation.",
    checklist: [
      { text: "Grade soil away from foundation" },
      { text: "Install drainage swales" },
      { text: "Seed and mulch disturbed areas" },
    ],
    photos: ["img2", "img3"],
  },
  {
    date: "2026-08-14", note: "Peeling paint removed and surface prepared for recoat.",
    checklist: [
      { text: "Scrape peeling paint" },
      { text: "Sand rough surfaces" },
      { text: "Apply primer coat" },
    ],
    photos: ["img5", "img4", "img3"],
  },
  {
    date: "2026-08-11", note: "Window trim installed on the front facade.",
    checklist: [
      { text: "Measure and cut trim boards" },
      { text: "Install trim around window frames" },
      { text: "Caulk and paint trim" },
    ],
    photos: ["img5", "img1", "img4"],
  },
  {
    date: "2026-08-07", note: "Door frame replaced in the storage room.",
    checklist: [
      { text: "Remove old door frame" },
      { text: "Install new frame and shim level" },
      { text: "Rehang door and test swing" },
    ],
    photos: ["img7", "img6"],
  },
  {
    date: "2026-08-04", note: "Insulation installed in the attic space.",
    checklist: [
      { text: "Air-seal attic penetrations" },
      { text: "Install batt insulation between joists" },
      { text: "Verify coverage meets R-value target" },
    ],
    photos: ["img7", "img8"],
  },
  {
    date: "2026-07-31", note: "Structural assessment completed — no major issues found.",
    checklist: [
      { text: "Inspect load-bearing walls and beams" },
      { text: "Check foundation for cracking or settling" },
      { text: "Document findings in report" },
    ],
    photos: ["img2"],
  },
  {
    date: "2026-07-28", note: "Roof shingles replaced on the north slope.",
    checklist: [
      { text: "Remove damaged shingles" },
      { text: "Install underlayment" },
      { text: "Install new shingles and flashing" },
    ],
    photos: ["img9", "img2", "img6", "img3"],
  },
  {
    date: "2026-07-24", note: "Scaffolding erected on the west side.",
    checklist: [
      { text: "Assemble scaffold base and frames" },
      { text: "Secure guardrails and platforms" },
      { text: "Inspect scaffold for safety compliance" },
    ],
    photos: ["img9", "img1"],
  },
  {
    date: "2026-07-21", note: "Electrical panel upgrade completed.",
    checklist: [
      { text: "Disconnect and remove old panel" },
      { text: "Install new panel and breakers" },
      { text: "Schedule utility inspection" },
    ],
    photos: ["img1"],
  },
  {
    date: "2026-07-17", note: "Waterproofing membrane applied to basement walls.",
    checklist: [
      { text: "Clean and prep basement wall surface" },
      { text: "Apply waterproof membrane" },
      { text: "Install drainage board" },
    ],
    photos: ["img3", "img5"],
  },
  {
    date: "2026-07-14", note: "Foundation waterproofing sealant applied.",
    checklist: [
      { text: "Clean foundation exterior surface" },
      { text: "Apply sealant coating" },
      { text: "Backfill against foundation wall" },
    ],
    photos: ["img4", "img5"],
  },
  {
    date: "2026-07-10", note: "Project kickoff — site survey and initial documentation.",
    checklist: [
      { text: "Conduct site survey" },
      { text: "Document existing conditions" },
      { text: "Confirm project scope with client" },
    ],
    photos: ["img2", "img9", "img6"],
  },
  {
    date: "2026-06-30", note: "Framing inspection passed for the second-floor addition.",
    checklist: [
      { text: "Verify framing meets plan specifications" },
      { text: "Check header and joist spacing" },
      { text: "Pass inspector walkthrough" },
    ],
    photos: ["img3", "img7", "img9"],
  },
  {
    date: "2026-06-23", note: "Site utilities connected — water and sewer lines.",
    checklist: [
      { text: "Trench for utility lines" },
      { text: "Connect water service line" },
      { text: "Connect sewer line and test flow" },
    ],
    photos: ["img2"],
  },
  {
    date: "2026-06-16", note: "Excavation completed for the new foundation footprint.",
    checklist: [
      { text: "Mark foundation layout" },
      { text: "Excavate to required depth" },
      { text: "Verify grade and dimensions" },
    ],
    photos: ["img8", "img6", "img5", "img1", "img9"],
  },
];

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
    return `week of ${fmt(mon)}`;
  }
  if (grouping === "month") {
    const [y, m] = g.key.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toLowerCase();
  }
  const [y, m, d] = g.key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { day: "numeric", month: "short" }).toUpperCase();
}

// TODO(BE): replace with the account's actual per-report photo cap from the API
const PHOTO_LIMIT = 50;

// Report-wide version of defaultOverflowExclusions below — instead of
// physically trimming photos out of the data (the old applyPhotoCap, which
// left no way to see or reconsider what got dropped), this marks enough of
// them excluded (evenly sampled across the whole report, same algorithm
// applyPhotoCap used) to land at or under maxTotal, using the same
// excludedPhotos shape everything else already reads. Layered on top of
// perEntryExcluded (the per-task 15-cap's own default) so it only ever
// excludes photos that are still actually "included" after that first
// pass — the global Manage Photos modal then lets the user freely swap
// which ones stay excluded, same as the per-task swap panel already did.
function defaultGlobalOverflowExclusions(groups, perEntryExcluded, maxTotal = PHOTO_LIMIT) {
  const included = [];
  groups.forEach(g => g.entries.forEach((e, i) => {
    const entryKey = `${g.key}_${i}`;
    e.photos.forEach((_, pi) => {
      if (!perEntryExcluded[`${entryKey}_${pi}`]) included.push(`${entryKey}_${pi}`);
    });
  }));
  if (included.length <= maxTotal) return {};

  const step = included.length / maxTotal;
  const keep = new Set();
  for (let i = 0; i < maxTotal; i++) keep.add(Math.min(Math.floor(i * step), included.length - 1));

  const excluded = {};
  included.forEach((key, idx) => { if (!keep.has(idx)) excluded[key] = true; });
  return excluded;
}

// TODO(BE): replace with the account's actual per-task-item photo cap from the API
const PER_ENTRY_PHOTO_LIMIT = 15;

// Photo captions never truncate for display (see PhotoLightbox/PhotoGrid) —
// a hard length cap here is what keeps them from growing unbounded in the
// first place, enforced at the source (EditableField's own maxLength —
// see PhotoLightbox's caption field) rather than by cutting an
// already-saved caption short later.
const CAPTION_MAX_LEN = 250;

// Summary and Additional Information's own caps (EditableField's
// maxLength) — same "enforced at the source" idea as CAPTION_MAX_LEN above.
const SUMMARY_MAX_LEN = 1000;
const ADDITIONAL_INFO_MAX_LEN = 250;

// Marks everything past the first PER_ENTRY_PHOTO_LIMIT photos in each entry
// as excluded by default, using the exact same excludedPhotos shape (and
// `${entryKey}_${photoIndex}` keys) that applyPhotoExclusions/the results
// table/copy-link already read — so an overflowing entry starts capped down
// to its first 12 photos everywhere, with no separate data path to keep in
// sync. PhotoGrid's swap panel then just flips these same keys back and
// forth, never exceeding the cap.
function defaultOverflowExclusions(groups, maxPerEntry = PER_ENTRY_PHOTO_LIMIT) {
  const excluded = {};
  groups.forEach(g => {
    g.entries.forEach((e, i) => {
      if (e.photos.length <= maxPerEntry) return;
      const entryKey = `${g.key}_${i}`;
      e.photos.forEach((_, pi) => { if (pi >= maxPerEntry) excluded[`${entryKey}_${pi}`] = true; });
    });
  });
  return excluded;
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
  // Tag each entry's "no photos" status now — the full, uncapped photo
  // list stays intact from here on; the report-wide 50-photo limit is
  // enforced via excludedPhotos (see defaultGlobalOverflowExclusions),
  // not by trimming it out of the data, so Manage Photos can always show
  // (and let the user reconsider) every photo, not just whatever survived
  // an earlier automatic sample.
  groups = groups.map(g => ({
    ...g,
    entries: g.entries.map(e => ({ ...e, noPhotos: e.photos.length === 0 })),
  }));

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
  // Always maps (even with nothing excluded) so every entry carries its
  // own entryKey forward — applyTitleOverrides/applyExtraNotesToGroups
  // run after this and reindex/splice g.entries, so a position-based
  // `${g.key}_${i}` recomputed later (e.g. in buildReportHTML) would
  // drift for any entry after a spliced manual note. Reading e.entryKey
  // instead keeps every caption/exclusion lookup pinned to the same key
  // the live view stored it under, against this original, pre-splice
  // ordering.
  return groups.map(g => ({
    ...g,
    entries: g.entries.map((e, i) => {
      const entryKey = `${g.key}_${i}`;
      if (!excludedPhotos || Object.keys(excludedPhotos).length === 0) return { ...e, entryKey };
      // Captions are keyed by the photo's ORIGINAL index (before any
      // exclusion), so once photos are actually filtered out here, the
      // survivors' positions in the new array no longer line up with
      // those keys — photoOriginalIndices is the parallel map back,
      // consumed by buildReportHTML's caption lookup.
      const kept = e.photos.map((k, pi) => ({ k, pi })).filter(({ pi }) => !excludedPhotos[`${entryKey}_${pi}`]);
      return kept.length === e.photos.length
        ? { ...e, entryKey }
        : { ...e, entryKey, photos: kept.map(x => x.k), photoOriginalIndices: kept.map(x => x.pi) };
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

// Checklist items edited/added/deleted in the draft only override this
// report's own copy — the underlying DUMMY_ENTRIES task is never touched.
// Unlike titleOverrides (a single string), an override here is the whole
// replacement checklist array for that entry, since edits/deletes/adds
// all need to change array contents rather than one scalar value. Keyed
// and applied the same way as titleOverrides. Blank items (an "Add item"
// row never filled in) are dropped here — the same point extraNotes
// filters out blank notes — rather than while the user is still typing,
// so a freshly-added, still-empty row doesn't vanish out from under them.
function applyChecklistOverrides(groups, checklistOverrides) {
  if (!checklistOverrides || Object.keys(checklistOverrides).length === 0) return groups;
  return groups.map(g => ({
    ...g,
    entries: g.entries.map((e, i) => {
      const entryKey = `${g.key}_${i}`;
      const override = checklistOverrides[entryKey];
      return override ? { ...e, checklist: override.filter(item => item.text && item.text.trim()) } : e;
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

// Natural pixel dimensions of a loaded image, cached by src — module-level
// (not per-export-call) since the same bundled photo (img1..img9) gets
// reused across many reports/downloads and is a static asset that never
// changes size. Used by buildReportHTML's justified photo rows, which need
// each photo's real aspect ratio up front rather than discovering it after
// the fact via CSS. A broken/unreachable src resolves to a neutral 4:3
// placeholder instead of hanging the whole export on one bad image.
const imageDimsCache = new Map();
const loadImageDims = (src) => {
  if (imageDimsCache.has(src)) return imageDimsCache.get(src);
  const promise = new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth || 4, height: img.naturalHeight || 3 });
    img.onerror = () => resolve({ width: 4, height: 3 });
    img.src = src;
  });
  imageDimsCache.set(src, promise);
  return promise;
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
// Mirrors the live draft/preview's own visual design (renderCoverHeader,
// renderCoverContent, renderTaskSection) as static HTML, since the
// downloaded file and the "Copy link" content are meant to look like the
// same document, not a separate, simpler layout. This export is still a
// real paginated
// document though (unlike the live draft, which shows one natural-height
// section per entry with no repeating header/footer — see
// ReportsTab's sectionCards) — every page here still gets its own running
// header/footer (see runningHeaderHTML/footerHTML), since that's what
// keeps a real multi-page printed/PDF-style document identifiable page to
// page. The other intentional differences from the live view: every photo
// shows (no "+N more" cap, since there's no interaction left to expand it)
// and nothing here is editable (no placeholder prompts for fields the
// user left blank; those rows are just omitted instead).

// Cached 2D context for estimateCaptionHeight (packMasonryColumns, below)
// — one canvas element reused across every build instead of a fresh one
// created per call.
let _measureCtx = null;
const measureTextWidth = (text, font) => {
  if (!_measureCtx) _measureCtx = document.createElement("canvas").getContext("2d");
  _measureCtx.font = font;
  return _measureCtx.measureText(text).width;
};

const buildReportHTML = async (report) => {
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

  // Fixed 3-column masonry (see packMasonryColumns/masonryHTML below) is
  // now the default photo layout. The previous default — orientation-
  // grouped justified rows, see packRowsByOrientation below — lives on as
  // a comparison path: visit the app at /row-grouping to preview that
  // instead. Read once per export so a link copied while on /row-grouping
  // keeps rendering row-grouping for whoever opens it too (handleCopy's
  // share URL keeps whatever pathname was current when it was built).
  const useRowGrouping = typeof window !== "undefined" && /\/row-grouping\/?$/.test(window.location.pathname);

  const STATUS_HEX = { completed: "#16a97d", open: "#138eff" };
  // Editorial serif for headline/body content (title, address, summary,
  // task headings, descriptions, captions); small uppercase UI labels
  // (status pills, meta lines, section/footer chrome) stay on the sans
  // stack and re-declare it explicitly, since the body default below is
  // what's switching to serif.
  const SANS = "-apple-system,BlinkMacSystemFont,'Inter',sans-serif";
  const SERIF = "'Lora',Georgia,serif";

  // Orientation-grouped rows — every photo shows here (no "+N more" cap;
  // there's nothing left to expand into), at its own natural aspect ratio
  // rather than cropped to a fixed tile like the live draft's grid (see
  // PhotoGrid): there's no interactive lightbox left to see the full
  // frame in once this is a static export, so the export itself has to
  // show it. Rows group by ORIENTATION only now (landscape, then square,
  // then portrait — see packRowsByOrientation below) — no more comparing
  // raw pixel widths within a bucket, that's gone entirely. Each bucket's
  // own photo COUNT (not their widths) decides how many rows it becomes
  // and how many photos share each one (see rowMaxPhotos/distributeEvenly),
  // and every row that isn't a special case (the landscape highlight, or
  // a genuinely lone leftover photo — see below) is a true justified row:
  // one shared height solved so the row's photos exactly fill the page
  // width edge to edge, each photo's own width simply following from its
  // own aspect ratio at that height. Nothing is cropped and no individual
  // photo's own aspect ratio is distorted — this still isn't a CSS
  // column-count masonry (a column layout balances columns by their
  // TOTAL height, so the same photos would render at a different height
  // depending on what else ends up sharing their column-count container,
  // which made two chunks landing on the same page look like a
  // disconnected seam, and made a chunk's pre-measured height — see
  // blockHeights below — drift from its actual rendered height once
  // adjacent chunks changed what it was grouped with). A row's height
  // here only ever depends on the photos actually IN that row, so it
  // renders identically — and measures accurately — no matter what's
  // above or below it. Each row is its own pagination block (like the old
  // fixed-size photo chunks were), so a long photo set can still flow
  // across a page break instead of dragging the whole entry to the next
  // page as one piece.
  const JUSTIFIED_GAP = 8;
  const PHOTO_ROW_WIDTH = PAGE_W - PAGE_PAD * 2;
  const ORIENTATION_SQUARE_TOLERANCE = 0.05; // within 5% aspect ratio counts as square
  const photoOrientation = (p) => {
    const ratio = p.width / p.height;
    if (Math.abs(ratio - 1) <= ORIENTATION_SQUARE_TOLERANCE) return "square";
    return ratio > 1 ? "landscape" : "portrait";
  };
  // 2 per row when the group's own total is even, 3 when it's odd — a
  // flat rule applied once per group (the landscape highlight's own
  // leftover count, or square/portrait's plain total), not recomputed
  // photo-by-photo the way the old width-tolerance packer worked.
  const rowMaxPhotos = (total) => (total % 2 === 0 ? 2 : 3);
  // Splits `list` into rows no larger than maxPerRow, as evenly sized as
  // possible (7 at max 3 becomes [3,2,2], never [3,3,1] — a trailing row
  // of 1 stranded alone is exactly what this avoids). Front-loads any
  // remainder onto the earliest rows; which rows get the extra photo
  // doesn't matter, only that no row ends up more than one photo apart
  // from any other.
  const distributeEvenly = (list, maxPerRow) => {
    if (list.length === 0) return [];
    const numRows = Math.ceil(list.length / maxPerRow);
    const base = Math.floor(list.length / numRows);
    const remainder = list.length - base * numRows;
    const groups = [];
    let idx = 0;
    for (let r = 0; r < numRows; r++) {
      const size = base + (r < remainder ? 1 : 0);
      groups.push(list.slice(idx, idx + size));
      idx += size;
    }
    return groups;
  };
  // A true justified row — one shared height solved so photos.length
  // photos' combined width (at that height, each keeping its own aspect
  // ratio) plus the gaps between them exactly fills containerWidth.
  const justifiedRow = (photos, containerWidth, gap) => {
    const sumAspect = photos.reduce((sum, p) => sum + p.width / p.height, 0);
    const height = (containerWidth - gap * (photos.length - 1)) / sumAspect;
    return { photos, height };
  };
  // The one sizing exception: a group that's down to exactly one leftover
  // photo doesn't stretch that lone photo to fill the entire row width
  // (it'd render enormous, especially a portrait shot) — instead it's
  // sized as if it were one of three photos sharing a row, same width a
  // photo would get in a full 3-up row, just on its own line.
  const loneRow = (photo, containerWidth, gap) => {
    const thirdWidth = (containerWidth - gap * 2) / 3;
    return { photos: [photo], height: photo.height * (thirdWidth / photo.width) };
  };
  // Turns one orientation bucket (or the landscape leftovers after its
  // own highlight is pulled out) into its final rows — a lone photo gets
  // loneRow's special sizing, otherwise rowMaxPhotos/distributeEvenly
  // decide row membership and justifiedRow does the actual sizing.
  const buildRows = (list, containerWidth, gap) => {
    if (list.length === 0) return [];
    if (list.length === 1) return [loneRow(list[0], containerWidth, gap)];
    return distributeEvenly(list, rowMaxPhotos(list.length))
      .map(group => justifiedRow(group, containerWidth, gap));
  };

  const photoRowHTML = (row, marginTop, marginBottom) => {
    const gap = JUSTIFIED_GAP;
    const cellH = Math.round(row.height);
    const cells = row.photos.map(p => {
      const w = Math.round(row.height * (p.width / p.height));
      // min-width:0 — a flex item's default min-width is auto, which
      // floors it at its content's own intrinsic minimum; a caption with
      // one long unbroken run of characters (no spaces to wrap on)
      // otherwise forces this cell wider than its own width:w, throwing
      // the whole row out of alignment instead of wrapping inside it (see
      // the caption's own overflow-wrap below, same reasoning paired
      // together as EditableField's own long-caption handling).
      return h("div", { style: `flex-shrink:0;width:${w}px;min-width:0;` },
        selfClose("img", { src: p.src, style: `display:block;width:${w}px;height:${cellH}px;border-radius:4px;` }),
        p.caption ? h("p", { style: `font-size:13px;line-height:1.8;font-style:italic;color:#303742;font-family:${SERIF};text-align:center;margin:6px 0 0;overflow-wrap:break-word;` }, p.caption) : ""
      );
    }).join("");
    return h("div", { style: `display:flex;gap:${gap}px;align-items:flex-start;margin-top:${marginTop}px;margin-bottom:${marginBottom}px;` }, cells);
  };

  // Rows group by orientation — landscape/square/portrait rarely share a
  // row well even at similar widths (a landscape and a portrait shot can
  // be the same width and still look mismatched side by side). Highlight
  // rules (landscape only):
  //   - 1 landscape photo total: it's the highlight alone, full page
  //     width, and there's no landscape left over for buildRows below.
  //   - 2 landscape photos: NO highlight — both just become one normal
  //     2-photo row via buildRows, same as any other pair.
  //   - 3+ landscape photos: the first one (original order) becomes the
  //     highlight, full page width; everything else goes through
  //     buildRows same as the rest.
  // Square, then portrait, always follow in that order, each through the
  // same buildRows — nothing else about them is special.
  const packRowsByOrientation = (photos, containerWidth, gap) => {
    const landscape = photos.filter(p => photoOrientation(p) === "landscape");
    const square = photos.filter(p => photoOrientation(p) === "square");
    const portrait = photos.filter(p => photoOrientation(p) === "portrait");
    const rows = [];
    let landscapeRest = landscape;
    if (landscape.length === 1) {
      rows.push(justifiedRow(landscape, containerWidth, gap));
      landscapeRest = [];
    } else if (landscape.length >= 3) {
      const [hero, ...rest] = landscape;
      rows.push(justifiedRow([hero], containerWidth, gap));
      landscapeRest = rest;
    }
    rows.push(...buildRows(landscapeRest, containerWidth, gap));
    rows.push(...buildRows(square, containerWidth, gap));
    rows.push(...buildRows(portrait, containerWidth, gap));
    return rows;
  };

  // ── Default photo layout — fixed 3-column masonry, shortest-column-first ──
  // The orientation-grouped justified rows above are now the /row-grouping
  // comparison path instead; this runs whenever useRowGrouping is false.
  // Every photo shows here (no "+N more" cap), at its own natural aspect
  // ratio (needs real photoDims up front, same as the row-grouping path —
  // see allPhotoSrcs below, no longer skipped for this path), in
  // fixed-size chunks (see PHOTO_CHUNK) so the pagination pass can still
  // place each chunk on whichever page it fits — masonry columns reset
  // per chunk, they don't carry state across a page-fitting boundary.
  const MASONRY_COLUMNS = 3;
  // A photo goes into whichever column is currently shortest — not by
  // display order/orientation the way the row-grouping path groups (a
  // landscape, a square and a portrait shot can all end up next to each
  // other in different columns here, entirely by whichever column needed
  // filling next) — purely to keep the 3 columns' total heights as even
  // as possible. Height comes straight from the column's own fixed width
  // and the photo's real aspect ratio — never stretched, never cropped.
  // No highlight here either — the fixed-3-column grid is this layout's
  // entire visual idea, a solo full-width photo wouldn't fit that idea.
  // Placed tallest-first, not in upload order — a single very tall photo
  // landing late (once the "shortest" column is already a poor choice
  // for it) can throw the 3 columns badly out of balance; sorting so the
  // tallest photos get first pick of a still-empty column, while every
  // shorter one still gets placed purely by "which column is shortest
  // right now," keeps the actual column heights much closer to each
  // other without changing that placement rule at all.
  // A photo WITH a caption takes more total vertical space in its column
  // than one without, even though the image itself renders at the same
  // height either way (renderHeight, below, stays pure image height —
  // it's also what sets the <img>'s own height in masonryHTML). Without
  // this, "which column is shortest" was blind to captions, so a column
  // that happened to collect more/longer captions than the others could
  // end up visibly taller despite the algorithm intending them balanced.
  // Word-wrapped like the real caption would be (measureTextWidth, using
  // the same italic 12px/SERIF the caption itself renders in — see
  // photoRowHTML/masonryHTML's own caption style); a single word wider
  // than columnWidth on its own (overflow-wrap:break-word's territory,
  // e.g. this app's long-unbroken-string demo captions) is approximated
  // by how many columnWidth-wide "lines" its own width would take.
  const CAPTION_FONT = `italic 12px ${SERIF}`;
  const CAPTION_LINE_HEIGHT = 12 * 1.6;
  const estimateCaptionHeight = (caption, maxWidth) => {
    if (!caption) return 0;
    const words = caption.split(/\s+/).filter(Boolean);
    if (words.length === 0) return 0;
    const spaceWidth = measureTextWidth(" ", CAPTION_FONT);
    let lines = 1, lineWidth = 0;
    words.forEach(word => {
      let wordWidth = measureTextWidth(word, CAPTION_FONT);
      if (wordWidth > maxWidth) { lines += Math.ceil(wordWidth / maxWidth) - 1; wordWidth = maxWidth; }
      const next = lineWidth === 0 ? wordWidth : lineWidth + spaceWidth + wordWidth;
      if (next > maxWidth && lineWidth > 0) { lines += 1; lineWidth = wordWidth; }
      else { lineWidth = next; }
    });
    return lines * CAPTION_LINE_HEIGHT + 6; // + the caption <p>'s own margin-top
  };
  const packMasonryColumns = (photos, columnWidth, gap) => {
    const ordered = [...photos].sort((a, b) => (b.height / b.width) - (a.height / a.width));
    const columns = Array.from({ length: MASONRY_COLUMNS }, () => ({ photos: [], height: 0 }));
    ordered.forEach(photo => {
      const col = columns.reduce((shortest, c) => (c.height < shortest.height ? c : shortest), columns[0]);
      const renderHeight = photo.height * (columnWidth / photo.width);
      if (col.photos.length > 0) col.height += gap;
      col.photos.push({ ...photo, renderHeight });
      col.height += renderHeight + estimateCaptionHeight(photo.caption, columnWidth);
    });
    return columns;
  };
  const masonryHTML = (photos, columnWidth, gap, marginTop, marginBottom) => {
    const columns = packMasonryColumns(photos, columnWidth, gap);
    const columnsHTML = columns.map(col =>
      h("div", { style: `width:${Math.round(columnWidth)}px;flex-shrink:0;` },
        col.photos.map(p => {
          const cellH = Math.round(p.renderHeight);
          return h("div", { style: "margin-bottom:8px;" },
            selfClose("img", { src: p.src, style: `display:block;width:${Math.round(columnWidth)}px;height:${cellH}px;border-radius:4px;` }),
            // overflow-wrap:break-word — same reasoning as photoRowHTML's
            // own caption (a long unbroken run of characters otherwise
            // overflows past this column's own width instead of wrapping
            // inside it).
            p.caption ? h("p", { style: `font-size:13px;line-height:1.8;font-style:italic;color:#303742;font-family:${SERIF};text-align:center;margin:6px 0 0;overflow-wrap:break-word;` }, p.caption) : ""
          );
        }).join("")
      )
    ).join("");
    return h("div", { style: `display:flex;gap:${gap}px;align-items:flex-start;margin-top:${marginTop}px;margin-bottom:${marginBottom}px;` }, columnsHTML);
  };
  const PHOTO_CHUNK = 9;

  // Every unique photo src used anywhere in this report, deduped so a
  // bundled photo reused across several entries only ever loads once —
  // both the default masonry path and the /row-grouping path need each
  // photo's real aspect ratio up front (masonry needs it to know each
  // photo's rendered height before deciding which column is shortest;
  // row-grouping needs it for its own row packing), so this has to
  // resolve before blocks below are built at all either way.
  const allPhotoSrcs = new Set();
  groups.forEach(g => g.entries.forEach(e => {
    if (e.isNote || e.noPhotos) return;
    (e.photos || []).forEach(k => { const src = IMG_MAP[k]; if (src) allPhotoSrcs.add(src); });
  }));
  const photoDims = new Map();
  await Promise.all([...allPhotoSrcs].map(async src => {
    photoDims.set(src, await loadImageDims(src));
  }));

  const groupLabel = (g) => formatGroupLabel(g, grouping);

  // Manual notes are spliced into groups as {isNote:true} pseudo-entries
  // (see applyExtraNotesToGroups) right after the entry they're attached
  // to — plain text, same size as a checklist item's own text (13px),
  // not italic, not boxed.
  // A manual note is nested INSIDE its entry's own wrapper div (right
  // after the photos), same as the live view nests renderNoteSlot inside
  // renderTaskSection — not appended as a separate sibling block. Sibling
  // divs' margins collapse to their MAX, not their sum, so a standalone
  // note block with its own marginTop:8 sitting next to the entry's
  // marginBottom:24 rendered as a 24px gap instead of 8px; nesting it
  // avoids that collapse entirely and gives each gap its exact value.
  const noteHTML = (note) =>
    h("div", { style: "margin-top:24px;margin-bottom:16px;" },
      h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;color:#6b6b6b;margin:0;` }, "Note"),
      h("p", { style: `font-family:${SANS};font-size:14px;color:#303742;line-height:1.8;margin:0;` }, note.note)
    );

  // Title + meta line + divider — shared by both the no-checklist single
  // block (entryHeaderHTML) and the checklist-item-split path
  // (entryHeaderOnlyHTML), so the two never drift out of sync.
  const entryHeaderCoreHTML = (e) => {
    const { kind } = statusForEntry(e);
    const statusMeta = STATUS_META[kind];
    const statusColor = STATUS_HEX[kind];
    const visiblePhotoCount = (e.photos || []).length;
    const dot = `<span style="display:inline-block;width:3px;height:3px;border-radius:50%;background:#bdbdbd;vertical-align:middle;margin:0 6px;"></span>`;
    // Matches the live view exactly: Open never shows a date (just the
    // status), while Completed folds its date directly into the status
    // text — "Completed Sep 9" — with no separator dot between them and
    // no uppercase transform, per statusPartHTML below. The section label
    // above only appears for week/month grouping — see entriesHTML below,
    // which skips it for "day" the same way the live view's sections do.
    // Meta-line chrome (status/date/photo-count) stays on the sans stack,
    // same reasoning as SANS's own comment above.
    const statusDotHTML = `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${statusColor};vertical-align:middle;margin-right:6px;"></span>`;
    const statusPartHTML = kind === "completed"
      ? statusDotHTML + `<span style="font-family:${SANS};font-size:12px;font-weight:700;color:${statusColor};">${statusMeta.label} ${fmtDate(parseDate(e.date))}</span>`
      : statusDotHTML + `<span style="font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${statusColor};">${statusMeta.label}</span>`;
    const photoCountHTML = (!e.noPhotos && visiblePhotoCount > 0)
      ? `<span style="font-family:${SANS};font-size:12px;font-weight:500;text-transform:uppercase;color:#6b6b6b;">${visiblePhotoCount} photo${visiblePhotoCount === 1 ? "" : "s"}</span>`
      : "";
    const metaLine = [statusPartHTML, photoCountHTML].filter(Boolean).join(dot);
    // Same divider the live view always shows now (see renderTaskSection) —
    // the checklist (if any) and/or the attached note both sit below it.
    const dividerHTML = h("div", { style: "height:1px;background:#e8e8e6;margin-top:24px;" }, "");
    // id — jump target for the Preview tab's own sidebar nav (see
    // ReportPreviewChrome/buildReportHTMLFromParams' navItems); a plain
    // shared-link recipient never sees or uses it, it's just inert markup
    // to them.
    return h("p", { id: `report-task-${e.entryKey}`, style: `font-family:${SERIF};font-size:18px;font-weight:600;color:#0a1629;line-height:1.4;margin:0;` }, e.note) +
      h("div", { style: "margin-top:8px;" }, metaLine) +
      dividerHTML;
  };

  const checklistLabelHTML = (e) =>
    h("div", { style: "margin-top:24px;" },
      h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b;margin:0 0 16px;` },
        "Checklist items completed as of this update"
      )
    );

  const checklistItemRowHTML = (item) =>
    h("div", { style: "display:flex;align-items:center;gap:8px;" },
      h("span", { style: "flex-shrink:0;color:#16a97d;font-size:12px;font-weight:700;" }, "✓"),
      h("span", { style: `font-family:${SANS};font-size:14px;color:#303742;line-height:1.4;` }, item.text)
    );

  // Whole-entry block — used only when the entry has no checklist, so
  // there's nothing to split across pages and the header can safely carry
  // its own trailing margin/note directly.
  const entryHeaderHTML = (e, attachedNoteHTML, hasPhotos) =>
    h("div", { style: `margin-bottom:${hasPhotos ? 0 : 64}px;` },
      entryHeaderCoreHTML(e),
      attachedNoteHTML || ""
    );

  // Header-only block for a checklist-bearing entry — title/meta/divider
  // plus the "Completed as of this update" label, with NO items and no
  // trailing margin of its own. Paired with its first checklist item via
  // the same "must fit with next block" rule the pagination pass already
  // uses for section labels (see isEntryHeader below), so the header never
  // strands alone without at least one item under it.
  const entryHeaderOnlyHTML = (e) => entryHeaderCoreHTML(e) + checklistLabelHTML(e);

  // One checklist item as its own page-able block — items other than the
  // first each carry the 8px inter-item gap (matching the live view's
  // gap:6, rounded up to the 8px scale for the export) via marginTop;
  // the first item's marginTop is 0 since checklistLabelHTML already owns
  // that gap via its own margin-bottom. Only the LAST item carries the
  // entry's trailing margin and any attached manual note, since it's the
  // entry's true trailing edge whenever a checklist exists.
  const checklistItemHTML = (item, isFirst, isLast, hasPhotos, attachedNoteHTML) =>
    h("div", { style: `margin-top:${isFirst ? 0 : 8}px;margin-bottom:${isLast ? (hasPhotos ? 0 : 64) : 0}px;` },
      checklistItemRowHTML(item)
    ) + (isLast ? (attachedNoteHTML || "") : "");

  // Flat list of page-able blocks — a label block per group (skipped for
  // day grouping, same reasoning as before) followed by one block per
  // real entry — this export still paginates onto fixed Letter pages
  // (unlike the live draft, which shows one natural-height section per
  // entry instead — see ReportsTab's sections/renderTaskSection). A
  // manual note is spliced into
  // g.entries right after the entry it's attached to (isNote:true
  // pseudo-entry) — it's consumed here into that entry's own block
  // instead of becoming its own block in the list. `isLabel` lets the
  // pagination pass below keep a label glued to its first entry instead
  // of stranding it alone at the bottom of a page.
  const blocks = groups.length === 0
    ? [{ html: h("p", { style: `font-family:${SANS};font-size:13px;color:#6b6b6b;text-align:center;padding:32px 0;` }, "No activity entries for this period."), isLabel: false }]
    : groups.flatMap(g => {
        const groupBlocks = [];
        if (grouping !== "day") {
          groupBlocks.push({ html: h("p", { style: `font-family:${SANS};font-size:16px;font-weight:600;color:#6b6b6b;text-transform:uppercase;padding:8px 0;margin:0;` }, groupLabel(g).toUpperCase()), isLabel: true });
        }
        // e.entryKey (embedded by applyPhotoExclusions) instead of
        // recomputing `${g.key}_${i}` here — this loop runs on the final,
        // post-note-splice g.entries, where a real entry's position can
        // have shifted from where it was when captions were first keyed.
        g.entries.forEach((e, i) => {
          if (e.isNote) return;
          const next = g.entries[i + 1];
          const attachedNoteHTML = next && next.isNote ? noteHTML(next) : "";
          const photos = e.noPhotos ? [] : (e.photos || []);
          const checklistItems = (e.checklist || []).slice(-10);
          if (checklistItems.length === 0) {
            groupBlocks.push({ html: entryHeaderHTML(e, attachedNoteHTML, photos.length > 0), isLabel: false });
          } else {
            // Split into one block per item (see checklistItemHTML) instead
            // of one block for the whole entry, so a long checklist can
            // flow across a page break and fill leftover space instead of
            // dragging its entire entry (header included) to the next page
            // whole. isEntryHeader pairs the header with its first item via
            // the same rule the pagination pass uses for section labels.
            groupBlocks.push({ html: entryHeaderOnlyHTML(e), isLabel: false, isEntryHeader: true });
            checklistItems.forEach((item, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === checklistItems.length - 1;
              groupBlocks.push({
                html: checklistItemHTML(item, isFirst, isLast, photos.length > 0, attachedNoteHTML),
                isLabel: false,
              });
            });
          }
          if (photos.length > 0) {
            // Identity-mapped fallback when nothing's been excluded (see
            // applyPhotoExclusions) — never a chunk's own 0-based index,
            // which would only be correct for the first row/chunk.
            const originalIndices = e.photoOriginalIndices || photos.map((_, idx) => idx);
            const photoMetas = photos.map((k, i) => {
              const src = IMG_MAP[k];
              if (!src) return null;
              const dims = photoDims.get(src) || { width: 4, height: 3 };
              const caption = report.photoCaptions && report.photoCaptions[`${e.entryKey}_${originalIndices[i]}`];
              return { src: toAbsoluteUrl(src), width: dims.width, height: dims.height, caption };
            }).filter(Boolean);
            // The first row/chunk's own marginTop collapses against
            // whatever precedes it — 12 when that's an attached note's own
            // marginBottom:12 (see noteHTML), or 16 against the entry
            // header/checklist's marginBottom:0 otherwise (collapses up to
            // 16 either way since margin collapse takes the larger side).
            const firstChunkMarginTop = 16;
            if (useRowGrouping) {
              const rows = packRowsByOrientation(photoMetas, PHOTO_ROW_WIDTH, JUSTIFIED_GAP);
              rows.forEach((row, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === rows.length - 1;
                groupBlocks.push({
                  html: photoRowHTML(row, isFirst ? firstChunkMarginTop : 8, isLast ? 64 : 0),
                  isLabel: false,
                });
              });
            } else {
              const columnWidth = (PHOTO_ROW_WIDTH - JUSTIFIED_GAP * (MASONRY_COLUMNS - 1)) / MASONRY_COLUMNS;
              for (let start = 0; start < photoMetas.length; start += PHOTO_CHUNK) {
                const isFirst = start === 0;
                const isLast = start + PHOTO_CHUNK >= photoMetas.length;
                groupBlocks.push({
                  html: masonryHTML(
                    photoMetas.slice(start, start + PHOTO_CHUNK),
                    columnWidth, JUSTIFIED_GAP,
                    isFirst ? firstChunkMarginTop : 8, isLast ? 64 : 0
                  ),
                  isLabel: false,
                });
              }
            }
          }
        });
        return groupBlocks;
      });

  const progressHTML = report.includeSummary
    ? h("div", { style: "display:flex;align-items:center;gap:16px;margin-bottom:48px;" },
        h("div", { style: "flex:1;min-width:0;" },
          h("p", { style: `font-family:${SANS};font-size:13px;font-weight:600;color:#0a1629;line-height:1.4;margin:0 0 8px;` }, `${completed} of ${total} tasks complete`),
          h("div", { style: "height:6px;background:#e8e8e6;border-radius:99px;overflow:hidden;" },
            h("div", { style: `width:${pct}%;height:100%;background:#16a97d;border-radius:99px;` }, "")
          )
        ),
        h("span", { style: `font-family:${SERIF};font-size:28px;font-weight:700;font-style:italic;color:#0a1629;flex-shrink:0;line-height:1;` }, `${pct}%`)
      )
    : "";
  // Its own pagination block (not part of any header) — see the
  // pagination pass below, which always packs blocks fresh onto their
  // own running-header pages, after the cover and (when present) the
  // dedicated summary page.
  if (progressHTML) blocks.unshift({ html: progressHTML, isLabel: false });

  const projectName = report.projectName || PROJECT_NAME;
  const address = report.address || PROJECT_ADDRESS;
  const contactName = report.contactName || POINT_OF_CONTACT_NAME;
  const contactRole = report.contactRole || POINT_OF_CONTACT_ROLE;
  const summaryHTML = report.summary
    ? h("p", { style: `font-family:${SANS};font-size:16px;color:#303742;line-height:1.8;margin:0;max-width:600px;text-align:left;white-space:pre-wrap;` }, report.summary)
    : "";
  // Simple length rule, nothing fancier: a short summary folds straight
  // into the cover (same label+paragraph convention as Additional
  // Information right below it) instead of spending an entire page on a
  // couple of sentences; once it runs longer than that it goes back to
  // being its own dedicated page (see summaryPageHTML below) so it
  // actually has room to read well, exactly like every summary used to.
  const SUMMARY_INLINE_MAX_CHARS = 200;
  const summaryFitsOnCover = !!report.summary && report.summary.length <= SUMMARY_INLINE_MAX_CHARS;
  const coverSummaryHTML = summaryFitsOnCover
    ? h("div", { id: "report-summary", style: "margin-bottom:40px;" },
        // Divider above it, not below — this sits last on the cover
        // (after Prepared For/By, then Additional Information if either
        // is present), so it's what actually marks "Summary" as its own
        // distinct block rather than reading like a continuation of
        // whatever's directly above it.
        h("div", { style: "height:1px;background:#e8e8e6;margin-bottom:24px;" }, ""),
        h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b;margin:0 0 6px;` }, "Summary"),
        h("p", { style: `font-family:${SANS};font-size:14px;font-weight:400;color:#303742;line-height:1.8;margin:0;max-width:600px;white-space:pre-wrap;` }, report.summary)
      )
    : "";

  // Company name — cover: 22/600 (emphasized — the h2/webHeading22
  // weight), dark. Running header: name only (no address — editing both
  // lives on the cover), colored to match the "VIA TASKTAG" mark beside
  // it — see runningCompanyNameHTML/runningHeaderHTML.
  const companyNameHTML = report.companyName
    ? h("p", { style: `font-family:${SERIF};font-size:22px;font-weight:600;color:#0a1629;line-height:1.4;margin:0 0 4px;` }, report.companyName)
    : "";
  const runningCompanyNameHTML = report.companyName
    ? h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b;line-height:1;margin:0;` }, report.companyName)
    : "";
  // Address/email/phone — 14/400/SERIF, plain secondary text, cover-only
  // now (the running header shows company name alone). Same font-size
  // AND font-family as each other (email/phone used to be SANS, an
  // inconsistency against address/name right above it) — all three read
  // as one "company identity" block now, not two different type systems
  // stacked on top of each other. Email and phone share one line,
  // separated by a dash, rather than each getting its own — omitted
  // entirely (not two dangling dashes/lines) when neither is set, same
  // "omit empty fields" convention as everything else in this static
  // export.
  const companyAddressHTML = report.companyAddress
    ? h("p", { style: `font-family:${SERIF};font-size:14px;font-weight:400;color:#6b6b6b;line-height:1.4;margin:0 0 8px;` }, report.companyAddress)
    : "";
  const companyContactLine = [report.companyEmail, report.companyPhone].filter(Boolean).join(" - ");
  const companyContactHTML = companyContactLine
    ? h("p", { style: `font-family:${SERIF};font-size:14px;font-weight:400;color:#6b6b6b;line-height:1.4;margin:0;` }, companyContactLine)
    : "";

  // ── Cover (page 1) — its own one-off page: logo (fixed width 180,
  // height auto) on the left, company name/address/email-phone stacked
  // on the right, then project name/address, Prepared For + "By <owner>",
  // and one photo — starts empty (an upload prompt) until the user
  // uploads one (an IMG_MAP key either way doesn't exist for an upload,
  // so it falls through to itself — see coverImageSrc). No footer, no
  // "VIA TASKTAG" mark, no Update No./period line — the cover format is
  // distinct from every content page in this document.
  // Wrapped in its own width:180/height:auto div (not just set directly
  // on the <img>) so width:100% on the <img> is 100% of THIS wrapper (a
  // fixed 180px), not of the whole flex header. A fixed width rather
  // than a max-width — as a flex item, a max-width-only box's actual
  // rendered width depends on how its flex-basis resolves, which isn't
  // reliably "as wide as the cap allows" (it rendered far narrower than
  // 180 in practice); an explicit width sidesteps that, making this box
  // always exactly 180px wide, full stop.
  // Stand-in for an image that exists but couldn't be carried into this
  // view (a shared link can't hold data-URL images — see buildShareURL's
  // `missing` flag). Only ever shown when the real image is absent AND
  // flagged missing; a download, or an owner's Preview, has the real thing.
  const missingImageHTML = (style) => h("div", { style: `display:flex;align-items:center;justify-content:center;background:#f7f8fa;border:1px dashed #bdbdbd;border-radius:8px;color:#6b6b6b;font-family:${SANS};font-size:12px;text-align:center;${style}` }, "Image can't be loaded");
  const coverLogoHTML = report.logo
    // Capped at 180px wide AND 80px tall (whichever the logo hits first,
    // aspect ratio kept) instead of a fixed 180px width — a tall/square
    // logo no longer makes the header grow without limit. Never upscaled
    // past its own pixel size.
    ? h("div", { style: "flex-shrink:0;" },
        selfClose("img", { src: report.logo, alt: "Company logo", style: "display:block;width:auto;height:auto;max-width:180px;max-height:80px;" })
      )
    : (report.missingImages && report.missingImages.includes("logo")
        ? missingImageHTML("width:180px;height:64px;flex-shrink:0;")
        : "");
  // Logo and company info side by side, both left-aligned (info sits
  // right next to the logo, not pushed to the far right edge).
  const coverHeaderHTML = h("div", { style: "display:flex;align-items:center;justify-content:flex-start;gap:24px;" },
    coverLogoHTML,
    h("div", { style: "text-align:left;" }, companyNameHTML, companyAddressHTML, companyContactHTML)
  );
  // Prepared For / Prepared By — a stacked pair per person: small
  // uppercase label (grey, tracked) over the name in bold, normal case
  // (names are read, so they are not all-caps), side by side.
  const metaItemHTML = (label, value) => h("div", {},
    h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b;line-height:1.4;margin:0 0 4px;` }, label),
    h("p", { style: `font-family:${SANS};font-size:14px;font-weight:600;color:#0a1629;line-height:1.4;margin:0;` }, value)
  );
  const coverMetaHTML = h("div", { style: "display:flex;flex-wrap:wrap;gap:16px 48px;align-items:flex-start;margin-bottom:32px;" },
    report.clientName ? metaItemHTML("Prepared For", report.clientName) : "",
    metaItemHTML("Prepared By", contactName)
  );
  // Free-text note below Prepared For/By — no label, just the value
  // exactly as input; unlike Summary (which needs "Summary" to explain
  // what it's reading) this one's short/contextual enough to speak for
  // itself. Pre-wrap so line breaks the user typed survive.
  const additionalInfoHTML = report.additionalInfo
    ? h("p", { style: `font-family:${SANS};font-size:14px;font-weight:400;color:#303742;line-height:1.8;margin:0 0 40px;max-width:600px;white-space:pre-wrap;` }, report.additionalInfo)
    : "";
  // Resolves either form report.coverImage can hold: an IMG_MAP key (the
  // random initial pick — needs toAbsoluteUrl, same as every other
  // bundled asset in this export) or a full data URL (an upload — not in
  // IMG_MAP, so used as-is).
  const coverImageKeySrc = report.coverImage && IMG_MAP[report.coverImage];
  const coverImageSrc = coverImageKeySrc ? toAbsoluteUrl(coverImageKeySrc) : (report.coverImage || "");
  const coverImageHTML = coverImageSrc
    ? h("div", { style: "border-radius:12px;overflow:hidden;margin-bottom:48px;" },
        selfClose("img", { src: coverImageSrc, alt: "", style: "display:block;width:100%;max-height:360px;object-fit:cover;" })
      )
    : (report.missingImages && report.missingImages.includes("cover")
        ? missingImageHTML("height:240px;border-radius:12px;margin-bottom:48px;")
        : "");
  // X is this report's position in the project's save history (matches
  // the same "Update No." shown in the live draft/the results table),
  // not tied to the period itself — the same period can be regenerated
  // and saved more than once, so the period alone can't tell two saves
  // apart.
  // With a highlight photo the title block sits under the photo at a
  // compact size; without one it is the page's focal point — bigger title,
  // roomier spacing, vertically centered below the header (see coverHTML).
  const hasCoverPhoto = Boolean(coverImageHTML);
  const coverUpdateLineHTML = h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#303742;margin:0 0 ${hasCoverPhoto ? 16 : 24}px;` }, `Update No. ${report.version} \xB7 ${report.period}`);
  // Header stays pinned to the top; the content block below it (photo
  // through project name/summary) starts right under the header divider
  // and flows down from there (it used to be vertically centered in
  // whatever page height was left over). flex:1 on the outer div still
  // makes the card fill its full min-height.
  const coverHTML = h("div", { id: "report-cover", class: "card" },
    h("div", { style: `padding:${PAGE_PAD}px;display:flex;flex-direction:column;flex:1;` },
      coverHeaderHTML,
      // Divider under the cover header — 24px above, and the content block
      // below sits 24px under it (was a bare 64px gap before the divider).
      h("div", { style: "height:1px;background:#e8e8e6;margin-top:24px;" }),
      h("div", { style: `flex:1;display:flex;flex-direction:column;justify-content:${hasCoverPhoto ? "flex-start" : "center"};` },
        h("div", { style: `margin-top:${hasCoverPhoto ? 24 : 0}px;` },
          coverImageHTML,
          coverUpdateLineHTML,
          h("h1", { style: `font-family:${SERIF};font-size:${hasCoverPhoto ? 40 : 56}px;font-weight:700;color:#0a1629;line-height:${hasCoverPhoto ? 1.1 : 1.15};text-wrap:balance;margin:0 0 ${hasCoverPhoto ? 12 : 16}px;` }, projectName),
          h("p", { style: `font-family:${SERIF};font-size:15px;font-weight:400;font-style:italic;color:#6b6b6b;line-height:1.4;margin:0 0 ${hasCoverPhoto ? 32 : 48}px;` }, address),
          coverMetaHTML,
          additionalInfoHTML,
          coverSummaryHTML
        )
      )
    )
  );

  // Running header (every page after the cover) — company name only (no
  // address) and the "VIA TASKTAG" mark, deliberately without the logo
  // (that only ever shows on the cover).
  const runningHeaderHTML = h("div", { style: `padding:${PAGE_PAD}px ${PAGE_PAD}px 0;` },
    h("div", { style: "display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;" },
      h("div", {}, runningCompanyNameHTML),
      h("div", { style: "white-space:nowrap;" },
        h("span", { style: `font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b6b6b;line-height:1;` }, "VIA TASKTAG")
      )
    ) +
    h("div", { style: "height:1px;background:#e8e8e6;margin-bottom:16px;" }, "")
  );

  const contactRoleLine = contactRole + (report.companyName ? ` · ${report.companyName}` : "");
  // Real uploaded photo (see contactPhoto/the draft's Footer section) when
  // there is one, same "photo replaces the initials placeholder" pattern
  // the cover photo and logo already use — plain initials circle otherwise.
  const contactAvatarHTML = report.contactPhoto
    ? selfClose("img", { src: report.contactPhoto, alt: "", style: "display:block;width:36px;height:36px;border-radius:50%;object-fit:cover;" })
    : h("div", { style: "width:36px;height:36px;border-radius:50%;background:#a85796;display:flex;align-items:center;justify-content:center;flex-shrink:0;" },
        h("span", { style: `font-family:${SANS};font-size:13px;font-weight:700;color:white;` }, initialsOf(contactName))
      );
  // pageNum/totalPages render as "Page X of Y", centered — the three
  // children under justify-content:space-between land left/center/right
  // for free, no extra layout needed. A function (not a constant) because
  // totalPages isn't known until pagination below runs; the placeholder
  // call used to measure this footer's height (footerEl) passes dummy
  // numbers since the digits themselves don't affect layout height.
  const footerHTML = (pageNum, totalPages) => h("div", { style: "padding:24px 40px;border-top:1px solid #e8e8e6;" },
    h("div", { style: "display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;" },
      h("div", { style: "display:flex;align-items:center;gap:10px;" },
        contactAvatarHTML,
        h("div", {},
          h("p", { style: `font-family:${SANS};font-size:12px;font-weight:600;color:#0a1629;line-height:1;margin:0 0 6px;` }, contactName),
          h("p", { style: `font-family:${SANS};font-size:12px;font-weight:400;color:#6b6b6b;line-height:1;margin:0;` }, contactRoleLine)
        )
      ),
      h("div", { style: `font-family:${SANS};font-size:12px;color:#6b6b6b;line-height:1;align-self:center;white-space:nowrap;` }, `Page ${pageNum} of ${totalPages}`),
      h("div", { style: "text-align:right;" },
        h("p", { style: `font-family:${SANS};font-size:12px;color:#6b6b6b;line-height:1;margin:0 0 6px;` }, "Generated via TaskTag"),
        h("p", { style: `font-family:${SANS};font-size:12px;color:#6b6b6b;line-height:1;margin:0;` }, `Report ID: ${reportIdFor(report.date)}`)
      )
    )
  );

  // Summary page — its own dedicated page (running header + footer),
  // right after the cover, only when there's summary text long enough
  // that it isn't already folded into the cover instead (see
  // coverSummaryHTML/summaryFitsOnCover above). When there's no page for
  // it, progress/entries simply become the page right after the cover.
  // Its own HTML is built further down (see summaryPageHTML reassignment
  // near contentPagesHTML) once totalPages is known — the footer needs
  // the real page count, which isn't known until the content pages are
  // measured and split below. hasSummaryPage is decided right here
  // though, since it only depends on summaryHTML/summaryFitsOnCover.
  const hasSummaryPage = Boolean(summaryHTML && !summaryFitsOnCover);
  let summaryPageHTML = "";

  // ── Pagination — split into real Letter pages, same as the live draft ──
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
  const runningHeaderEl = appendMeasureEl(runningHeaderHTML);
  const footerEl = appendMeasureEl(footerHTML(1, 1));
  const blockEls = blocks.map(b => appendMeasureEl(b.html, PAGE_W - PAGE_PAD * 2));

  const runningHeaderH = runningHeaderEl.offsetHeight;
  const footerH = footerEl.offsetHeight;
  const blockHeights = blockEls.map(el => el.offsetHeight);
  document.body.removeChild(measureRoot);

  // The cover and (when present) the summary page are each their own
  // fixed, standalone page — see coverHTML/summaryPageHTML — so
  // progress/entries always pack fresh against runningHeaderH starting
  // from the very first block, with no "page 1" special-casing left here.
  const contentPages = [];
  let current = [];
  let used = 0;
  const available = PAGE_H - PAGE_PAD * 2 - runningHeaderH - footerH - PAGE_BOTTOM_BUFFER;
  blocks.forEach((block, i) => {
    const blockH = blockHeights[i];
    // A section label (or a checklist-bearing entry's header — see
    // isEntryHeader) must never be stranded alone at the bottom of a page
    // with its first piece of content starting on the next — check it
    // together with its very next block against the remaining space, not
    // just the label/header alone.
    const fitsCheckH = (block.isLabel || block.isEntryHeader) && i + 1 < blocks.length ? blockH + blockHeights[i + 1] : blockH;
    if (current.length > 0 && used + fitsCheckH > available) {
      contentPages.push(current);
      current = [];
      used = 0;
    }
    current.push(block.html);
    used += blockH;
  });
  if (current.length > 0 || contentPages.length === 0) contentPages.push(current);

  // width/min-height match PAGE_W/PAGE_H exactly (the live view's own
  // Letter proportions — 800 × round(800×11/8.5)) rather than a loose max-width,
  // and the shadow matches the live page card's own
  // "0 1px 3px rgba(10,22,41,0.08)".
  // display:flex + flex-direction:column on .card, with flex:1 on the
  // content area, is what actually pins the footer to the bottom of the
  // page — matching the live view's own page card (which uses the same
  // flex column + flex:1 content div). Without it, a page whose content
  // doesn't fill the full min-height just leaves the footer sitting right
  // after the last block, with the page's remaining empty space stranded
  // below the footer instead of above it.
  // card__body's paddingBottom (PAGE_BOTTOM_BUFFER) guarantees the gap to
  // the footer directly via the box model — see PAGE_BOTTOM_BUFFER's own
  // comment for why relying on flex:1 alone isn't reliable enough.
  // body padding is PAGE_GUTTER on every side, plus SCROLLBAR_W more on
  // the right (see that constant's own comment — a real scrollbar, be it
  // this iframe's own or a standalone tab's, eats into the right edge
  // otherwise) — matches draft mode's own frame around the card (see the
  // draft modal's content wrapper), so the page floats identically
  // whether it's this export, the live Preview tab, or a Copy link
  // recipient's own browser. `.card`'s own `margin:0 auto` means this
  // asymmetry only actually shows up when something outside (like
  // ReportPreviewChrome's fixed-width iframe) constrains the body to
  // exactly PAGE_W + CONTENT_BUFFER, leaving no slack for auto-centering
  // to override it — on a full, wide-open standalone tab there's ample
  // margin either way and centering dominates regardless.
  const css = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:${SERIF};background:#f7f8fa;min-height:100vh;padding:${PAGE_GUTTER}px ${PAGE_GUTTER + SCROLLBAR_W}px ${PAGE_GUTTER}px ${PAGE_GUTTER}px}.card{background:white;border:1px solid #e8e8e6;border-radius:12px;overflow:hidden;width:${PAGE_W}px;min-height:${PAGE_H}px;margin:0 auto;display:flex;flex-direction:column}.card+.card{margin-top:24px}.card__body{padding:0 ${PAGE_PAD}px ${PAGE_BOTTOM_BUFFER}px;flex:1}.card__body>:first-child{margin-top:0!important}`;

  // Page numbers: the cover is excluded from the count entirely (it
  // carries no footer/number of its own anyway — see coverHTML), so the
  // summary page, when present, is page 1; content pages fill in the
  // rest. This is the first point totalPages is known, so summaryPageHTML
  // (deferred above) is actually built here too, alongside the content
  // pages.
  const totalPages = (hasSummaryPage ? 1 : 0) + contentPages.length;
  summaryPageHTML = hasSummaryPage
    ? h("div", { id: "report-summary", class: "card" },
        runningHeaderHTML,
        h("div", { class: "card__body" },
          h("p", { style: `font-family:${SANS};font-size:22px;font-weight:600;color:#0a1629;text-align:center;margin:0 0 12px;` }, "Summary"),
          summaryHTML
        ),
        footerHTML(1, totalPages)
      )
    : "";
  const firstContentPageNum = 1 + (hasSummaryPage ? 1 : 0);
  const contentPagesHTML = contentPages.map((pageBlocks, i) =>
    h("div", { class: "card" },
      runningHeaderHTML,
      h("div", { class: "card__body" }, pageBlocks.join("")),
      footerHTML(firstContentPageNum + i, totalPages)
    )
  ).join("");
  const cardsHTML = coverHTML + summaryPageHTML + contentPagesHTML;

  const title = "Project Report";
  return "<!DOCTYPE html>" +
    h("html", {},
      h("head", {},
        selfClose("meta", { charset: "UTF-8" }),
        h("title", {}, `${title} – ${report.period}`),
        selfClose("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
        selfClose("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }),
        selfClose("link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" }),
        h("style", {}, css)
      ),
      h("body", {}, cardsHTML)
    );
};

// ── Reports Tab ──
function ReportsTab({ demoCase }) {
  // Free tier: 1 report included, Download/Copy link past that gated
  // behind the paywall modal below (see handleDownload/handleCopy) —
  // no real report-count/billing state to check against here (this is a
  // demo tool, not the real product), so the "paywall" demo case just
  // simulates having already used up that free report.
  const paywalled = demoCase === "paywall";
  const [showPaywallModal, setShowPaywallModal] = useState(false);
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
  const [companyIdentity, setCompanyIdentity] = useState({ logo: null, companyName: "", companyAddress: "", companyEmail: "", companyPhone: "" });
  // Same "carries forward across reports" pattern as companyIdentity —
  // seeded from the point-of-contact constants so a first-ever draft
  // still starts with a sensible name/role, then updated to whatever was
  // last saved once a report actually is.
  const [contactIdentity, setContactIdentity] = useState({ name: POINT_OF_CONTACT_NAME, role: POINT_OF_CONTACT_ROLE, photo: null });
  const [lastSavedId, setLastSavedId] = useState(null); // highlights the most recently saved row in the results table
  const [openPeriod,  setOpenPeriod]  = useState(false);
  const [toast,       setToast]       = useState(null); // { type: "success" | "error", message }
  const [deleteTarget, setDeleteTarget] = useState(null); // report pending delete confirmation
  const [showSaveConfirm, setShowSaveConfirm] = useState(false); // Save Report clicked, confirmation pending
  const [lightbox, setLightbox] = useState(null); // { photos, index, caption } | null — full-screen photo viewer
  const [photoManager, setPhotoManager] = useState(false); // report-wide "manage photos" modal, opened by hovering the Photo Limit indicator
  const [expandedPhotoGroups, setExpandedPhotoGroups] = useState({}); // { [entryKey]: revealedChunkCount } — how many extra "+N more" chunks are showing per entry; lifted (not local to PhotoGrid) so every PhotoGrid call for that entry (see renderTaskSection's chunkNums) agrees on how many chunks to render
  const [expandedChecklists, setExpandedChecklists] = useState({}); // { [entryKey]: true } — "Show more" toggled for that entry's checklist (default collapsed to the first 3 items)
  const [draggedChecklist, setDraggedChecklist] = useState(null); // { entryKey, idx } | null — the item currently being drag-reordered, if any
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
  const [checklistOverrides, setChecklistOverrides] = useState({}); // { [entryKey]: overriddenChecklist } — per-entry checklist edits/adds/deletes, this report only
  const [previewLoading,   setPreviewLoading]    = useState(false);
  const [previewSaved,     setPreviewSaved]      = useState(false); // chrome switches from Cancel/Save to back/Download/Copy link once true
  const [previewCopied,    setPreviewCopied]     = useState(false); // Copy link button shows "Link copied" briefly
  const [visibleCount,     setVisibleCount]      = useState(Infinity); // every entry is rendered at once (no batched infinite scroll) so the sidebar can list them all
  const [loadingMore,      setLoadingMore]       = useState(false);
  const [generating,       setGenerating]        = useState(false); // Generate button's own disabled/spinner state, before the inline view appears
  const [saving,           setSaving]             = useState(false); // Save report button's own disabled/spinner state, before the toast appears
  const previewPanelRef = useRef(null);
  // Cover image upload (see renderCoverContent) — mirrors LogoUploadBox's
  // own hidden-input + resizeImageToDataURL + loading-spinner mechanics,
  // just inlined here since it isn't reused anywhere else.
  const coverImageInputRef = useRef(null);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageError, setCoverImageError] = useState("");
  const handleCoverImageUpload = (ev) => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    if (file.size > MAX_UPLOAD_IMAGE_BYTES) { setCoverImageError("File size exceeds the limit of 5 MB."); return; }
    setCoverImageError("");
    setCoverImageUploading(true);
    // 1600 comfortably covers the cover's own full page-content width
    // (720px) with retina headroom to spare — well past the flat 64px
    // default (tuned for the logo's own much smaller display size), which
    // showed up as visible blur once upscaled to fill this much bigger
    // frame. JPEG (not the default PNG) since this is ordinary
    // photographic content, where PNG would cost several times the file
    // size for no visible difference.
    resizeImageToDataURL(file, 1600, "image/jpeg", 0.85)
      .then(url => { setPreview(p => ({ ...p, coverImage: url })); setCoverImageUploading(false); })
      .catch(() => setCoverImageUploading(false));
  };
  // Which EditableField (by fieldId) is currently in edit mode — only one
  // at a time across the whole document. Handed down
  // via ActiveEditContext instead of threading it through every render
  // function's props.
  const [activeEditField, setActiveEditField] = useState(null);
  const activeEditCtxValue = useMemo(() => ({ activeField: activeEditField, setActiveField: setActiveEditField }), [activeEditField]);
  // Save Report validation errors for the draft's live form fields, keyed
  // by fieldId (see FormErrorsContext). Filled by handleSaveReportClick,
  // cleared per field as it's edited.
  const [formErrors, setFormErrors] = useState({});
  const formErrorsCtxValue = useMemo(() => ({
    errors: formErrors,
    clearError: (id) => setFormErrors(prev => {
      if (!(id in prev)) return prev;
      const next = { ...prev }; delete next[id]; return next;
    }),
  }), [formErrors]);

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
  const pushReport = ({ includeSummary, includeNoPhotoTasks, dateRange, period, version, data, extraNotes, excludedPhotos, titleOverrides, checklistOverrides, photoCaptions, projectName, address, logo, companyName, companyAddress, companyEmail, companyPhone, contactName, contactRole, contactPhoto, summary, clientName, additionalInfo, coverImage }) => {
    const id = Date.now();
    const newReport = {
      id,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      period,
      version,
      dateRange,
      status: "in_progress",
      includeSummary,
      includeNoPhotoTasks,
      data,
      extraNotes,
      excludedPhotos,
      titleOverrides,
      checklistOverrides,
      photoCaptions,
      projectName,
      address,
      logo,
      companyName,
      companyAddress,
      companyEmail,
      companyPhone,
      contactName,
      contactRole,
      contactPhoto,
      summary,
      clientName,
      additionalInfo,
      coverImage,
    };
    setReports(prev => [newReport, ...prev]);
    // Saving is what promotes this draft's identity to "the" company
    // identity — future drafts start from it, and every already-saved
    // report's download/copy switches to it too (see handleDownload/
    // handleCopy, which read companyIdentity instead of their own
    // frozen report.logo/companyName/companyAddress).
    setCompanyIdentity({ logo, companyName, companyAddress, companyEmail, companyPhone });
    // Same reasoning as companyIdentity — see contactIdentity.
    setContactIdentity({ name: contactName, role: contactRole, photo: contactPhoto });
    // No auto-clearing timeout here — this row stays highlighted until
    // either the next report is saved (which just reassigns lastSavedId
    // to that one instead) or the page is reloaded (lastSavedId, like
    // every other piece of this demo's state, isn't persisted).
    setLastSavedId(id);
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
    // Free tier — the one report it includes is a ONE-TIME allowance, not
    // a re-generatable slot (see the row actions' own Delete removal for
    // the same reasoning: deleting it and generating again would be an
    // easy way around this). Download/Copy link stay open for that report
    // regardless (see handleDownload/handleCopy) — only another Generate
    // past it is what's actually gated here.
    if (paywalled && reports.length >= 1) { setShowPaywallModal(true); return; }
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
      // Per-task 15-cap first, then the report-wide 50-cap on top of
      // whatever that still leaves included — both are just a starting
      // point now, freely adjustable from Manage Photos (see
      // defaultGlobalOverflowExclusions).
      const perEntryExcluded = defaultOverflowExclusions(data.groups);
      const defaultExcludedPhotos = { ...perEntryExcluded, ...defaultGlobalOverflowExclusions(data.groups, perEntryExcluded) };
      setPreview({
        includeSummary,
        includeNoPhotoTasks,
        dateRange,
        period,
        customRange,
        // This draft's position in the project's save history if it gets
        // saved right now — see pushReport, which assigns the same number.
        // Continues the running count only while the period matches the
        // most recently saved report (reports[0], since pushReport
        // prepends); a different period starts a fresh Update No. 1
        // instead of just tacking onto the global save count.
        version: reports.length > 0 && reports[0].period === period ? reports[0].version + 1 : 1,
        extraNotes: {},
        excludedPhotos: defaultExcludedPhotos,
        photoCaptions: {},
        // System-generated starting point — freely editable from here, and
        // never regenerated for the life of this draft.
        projectName: PROJECT_NAME,
        address: PROJECT_ADDRESS,
        // Pre-filled from the last saved report's company identity (if
        // any) rather than always starting blank — see companyIdentity.
        logo: companyIdentity.logo,
        companyName: companyIdentity.companyName,
        companyAddress: companyIdentity.companyAddress,
        companyEmail: companyIdentity.companyEmail,
        companyPhone: companyIdentity.companyPhone,
        // Same pre-fill reasoning as company identity above — see
        // contactIdentity.
        contactName: contactIdentity.name,
        contactRole: contactIdentity.role,
        contactPhoto: contactIdentity.photo,
        summary: "",
        clientName: "",
        additionalInfo: "",
        // Starts empty — the cover shows an upload prompt (see
        // renderCoverContent) rather than auto-picking one of this
        // period's task photos, so the cover photo is always a deliberate
        // choice instead of a random one the user has to notice and
        // swap out.
        coverImage: null,
      });
      setActiveEditField(null);
      setFormErrors({});
      setTitleOverrides({});
      setChecklistOverrides({});
      setVisibleCount(Infinity);
      setLoadingMore(false);
      setGenerating(false);
    }, 900);
  };

  // Discards the draft (or dismisses it after saving) and returns the tab
  // to its normal "Choose what this report includes" + results table view.
  const closePreview = () => {
    setPreview(null);
    setActiveEditField(null);
    setFormErrors({});
    setTitleOverrides({});
    setChecklistOverrides({});
    setPreviewSaved(false);
    setPreviewCopied(false);
    setVisibleCount(Infinity);
    setLoadingMore(false);
    setPhotoManager(false);
    setExpandedPhotoGroups({});
    setExpandedChecklists({});
    setShowSaveConfirm(false);
  };

  useEffect(() => {
    if (!preview || lightbox || deleteTarget || photoManager || showSaveConfirm) return;
    const handler = (e) => { if (e.key === "Escape") closePreview(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [preview, lightbox, deleteTarget, photoManager, showSaveConfirm]);

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
    setVisibleCount(Infinity); // new period = new dataset, still all of it at once
    setLoadingMore(false);
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
    ? applyExtraNotesToGroups(applyChecklistOverrides(applyTitleOverrides(applyPhotoExclusions(previewData.groups, preview.excludedPhotos), titleOverrides), checklistOverrides), preview.extraNotes)
    : [];
  // Photos actually included (post-exclusion) vs. the account's per-report
  // limit — shown in the modal chrome's Photo Limit indicator. Reuses
  // previewFinalGroups (already exclusion-filtered) rather than
  // recomputing against excludedPhotos separately.
  const previewPhotoCount = previewFinalGroups.reduce((s, g) => s + g.entries.reduce((es, e) => es + (e.isNote ? 0 : e.photos.length), 0), 0);

  // TODO(BE): replace with the account's actual per-report photo cap and
  // usage from the API. Lives in the sidebar's own fixed footer (see
  // NavSidebar's `footer` prop below), not the chrome bar — it needs to
  // stay in view as the section list scrolls past it, same reasoning as
  // that footer slot's own comment. Built once here rather than inline at
  // each call site since both the real sidebar and its loading-skeleton
  // stand-in show it identically (previewPhotoCount is already known
  // synchronously, same as every other "real, not skeleton'd" bit of chrome
  // during the fake generate delay). Clicking it opens the report-wide
  // Manage Photos modal — the single entry point for curating which photos
  // count toward PHOTO_LIMIT. Hovering just previews the affordance by
  // tinting the text/icon secondary green.
  const photoLimitWidget = (
    <div
      onClick={() => setPhotoManager(true)}
      onMouseEnter={e => { e.currentTarget.firstElementChild.style.color = "var(--tt-secondary)"; }}
      onMouseLeave={e => { e.currentTarget.firstElementChild.style.color = "var(--tt-text-1)"; }}
      style={{ display: "flex", flexDirection: "column", gap: 6, cursor: "pointer" }}
    >
      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--tt-text-1)", margin: 0, whiteSpace: "nowrap", transition: "color 0.15s" }}>
        Photo Limit {previewPhotoCount} of {PHOTO_LIMIT}
        <ExternalLink size={14} strokeWidth={SW} className="tt-split-externallink" style={{ flexShrink: 0 }} />
      </p>
      <div style={{ width: "100%", height: 6, borderRadius: 99, background: "var(--tt-grey03)", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, (previewPhotoCount / PHOTO_LIMIT) * 100)}%`, height: "100%", borderRadius: 99, background: "var(--tt-secondary)" }} />
      </div>
    </div>
  );

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

  // ── Sections ──
  // The draft is organized per section (Cover Header, Cover Content,
  // Summary, one per task, Footer) rather than simulated Letter pages —
  // each section is its own card, sized to its natural content height,
  // and the left-side nav (see the sidebar in the modal body below) jumps
  // straight to any one of them. The cover used to be a single combined
  // section (logo/company header + project name/photo together) — split
  // into two here so each half is independently reachable from the nav.
  // A task's nav label is its own title (respecting any titleOverrides
  // edit — same as the section's own heading), truncated with a tooltip
  // on hover rather than a generic "Task N" — flat across every entry
  // regardless of date grouping (day/week/month); a group's own label
  // (week/month only, e.g. "September 2026") shows in the sidebar instead
  // (see navGroups), above the first task of a new group there, not
  // inline in the section content and not as its own separate nav entry.
  // Footer (point of contact name/role/photo) is always last — it's a
  // report-wide signature, not tied to any specific task.
  const sections = [];
  if (previewData) {
    sections.push({ key: "coverHeader", type: "coverHeader", navLabel: "Cover Header" });
    sections.push({ key: "coverPhoto", type: "coverPhoto", navLabel: "Highlight Photo" });
    sections.push({ key: "coverContent", type: "coverContent", navLabel: "Cover Content" });
    sections.push({ key: "summary", type: "summary", navLabel: "Summary" });
    visibleGroups.forEach(g => {
      g.entries.forEach((e, i) => {
        const entryKey = `${g.key}_${i}`;
        sections.push({
          key: entryKey, type: "task", navLabel: titleOverrides[entryKey] ?? e.note,
          entryKey, e,
          // Only the first entry of a new group carries that group's own
          // label — every later entry in the same group leaves it out.
          g: i === 0 ? g : null,
        });
      });
    });
    sections.push({ key: "footer", type: "footer", navLabel: "Footer" });
  }

  // Sidebar nav grouping — derived straight off `sections` (never a second
  // source of truth), just reshaped into the nested rail the sidebar
  // actually renders: Cover's two sections collapse under one "Cover"
  // group ("Header"/"Content" as its children), every task collapses
  // under one "Task List" group (each task's own title as a child),
  // and Summary/Footer stay flat, single-row leaves — exactly the shape
  // in the reference layout the user asked for.
  const navGroups = [];
  sections.forEach(s => {
    if (s.type === "coverHeader") {
      navGroups.push({ type: "group", label: "Cover", icon: FileText, children: [{ key: s.key, label: "Header" }] });
    } else if (s.type === "coverPhoto") {
      navGroups[navGroups.length - 1].children.push({ key: s.key, label: "Highlight Photo" });
    } else if (s.type === "coverContent") {
      navGroups[navGroups.length - 1].children.push({ key: s.key, label: "Content" });
    } else if (s.type === "summary") {
      navGroups.push({ type: "leaf", key: s.key, label: s.navLabel, icon: AlignJustify });
    } else if (s.type === "task") {
      // Week/month grouping shows here instead of as its own heading
      // inside the section content (see renderTaskSection/sectionCards) —
      // day grouping carries no such label at all, same "day" exclusion
      // that heading used to have.
      const groupLabel = (s.g && previewData.grouping !== "day") ? formatGroupLabel(s.g, previewData.grouping) : null;
      const last = navGroups[navGroups.length - 1];
      if (last && last.type === "group" && last.label === "Task List") {
        last.children.push({ key: s.key, label: s.navLabel, groupLabel });
      } else {
        navGroups.push({ type: "group", label: "Task List", icon: Hash, children: [{ key: s.key, label: s.navLabel, groupLabel }] });
      }
    } else if (s.type === "footer") {
      // IdCard, not Users — this section is one person's own signature
      // block (name/role/photo), not a list of people.
      navGroups.push({ type: "leaf", key: s.key, label: s.navLabel, icon: IdCard });
    }
  });

  // Checklist edit/delete/add — same "this report only" override pattern
  // as titleOverrides (see applyChecklistOverrides), just holding the
  // whole replacement array instead of a single string. getChecklist
  // reads the override once it exists, falling back to the entry's own
  // original checklist otherwise — every mutation below always starts
  // from that same effective list so edits/deletes/adds compose correctly
  // regardless of which happened first. Declared here (before
  // renderTaskSection/sections, which call it) rather than further down
  // near handleDeletePhoto — sections/sectionCards invoke renderTaskSection
  // synchronously during this same render pass, so a later declaration
  // would still be in its temporal dead zone at that point.
  // slice(-10) — never more than 10 items, same hard cap the export's own
  // checklistItems/slice(-10) already enforces (that one truncates a raw
  // e.checklist longer than 10 down to its most recent 10); capping it
  // here too means the draft can never even start from/hold more than 10,
  // not just refuse to add an 11th on top of however many already exist.
  const getChecklist = (entryKey, e) => (checklistOverrides[entryKey] ?? (e.checklist || [])).slice(-10);
  const updateChecklistItem = (entryKey, e, idx, text) => {
    const next = getChecklist(entryKey, e).map((item, i) => (i === idx ? { ...item, text } : item));
    setChecklistOverrides(p => ({ ...p, [entryKey]: next }));
  };
  const deleteChecklistItem = (entryKey, e, idx) => {
    const next = getChecklist(entryKey, e).filter((_, i) => i !== idx);
    setChecklistOverrides(p => ({ ...p, [entryKey]: next }));
  };
  const addChecklistItem = (entryKey, e) => {
    const current = getChecklist(entryKey, e);
    // Belt and suspenders — the UI already hides Add item at 10 (see
    // renderTaskSection), this just makes the 10-item cap a real
    // invariant of the function itself, not only a UI affordance.
    if (current.length >= 10) return;
    const next = [...current, { text: "" }];
    setChecklistOverrides(p => ({ ...p, [entryKey]: next }));
    // Auto-expand — otherwise a new item added while collapsed to the
    // first CHECKLIST_COLLAPSE_COUNT would land past that cutoff and
    // never actually become visible.
    setExpandedChecklists(p => ({ ...p, [entryKey]: true }));
  };
  // Drag-reorder (see the grip handle in renderTaskSection) — fromIdx/
  // toIdx are both real indices into the full (already 10-capped)
  // checklist, same as every other mutation here, not indices into
  // whatever subset happens to be visibleChecklistItems right now.
  const reorderChecklistItem = (entryKey, e, fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    const next = getChecklist(entryKey, e);
    const reordered = [...next];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setChecklistOverrides(p => ({ ...p, [entryKey]: reordered }));
  };

  // Rendered under every entry's photo list (and once for the empty-period
  // state) as a plain, always-editable input — no separate "Add a note"
  // trigger step. Notes commit into preview.extraNotes on every keystroke,
  // same as typing into any other input.
  const noteLabelStyle = { fontSize: 12, fontWeight: 600, color: "var(--tt-grey05)", margin: 0 };
  const renderNoteSlot = (key) => {
    // Locked once saved — Download/Copy link now act on the saved snapshot.
    // marginBottom explicit in both branches below — rather than left to
    // collapse with PhotoGrid's own fixed marginTop:10, so the gap to the
    // photo list below lands on the exact value intended (10 would
    // otherwise never lose to a collapse against either of these).
    if (previewSaved) {
      const savedNote = preview.extraNotes[key];
      if (!savedNote) return null;
      // Always settled/plain text once locked — same 24px-above/12px-below
      // rule as the live "isText" case below, just unconditional here since
      // there's no input state left to be in.
      return (
        <div style={{ marginTop: 24, marginBottom: 12 }}>
          <p style={noteLabelStyle}>Note</p>
          <p style={{ fontSize: 12, fontStyle: "italic", color: "var(--tt-text-2)", lineHeight: "1.5", margin: 0, background: "var(--tt-grey02)", padding: 8, borderRadius: 8 }}>{savedNote}</p>
        </div>
      );
    }

    const noteFieldId = `note_${key}`;
    // A plain form field while drafting (label + input, always visible) —
    // the small 12px "Note" label + plain text only exists in the saved
    // view above.
    return (
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <EditableField
          fieldId={noteFieldId}
          value={preview.extraNotes[key] || ""}
          placeholder="Describe the note for this task"
          aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Note</p>}
          live
          counter
          maxLength={250}
          onSave={v => {
            setPreview(p => {
              const next = { ...p.extraNotes };
              if (v) next[key] = v; else delete next[key];
              return { ...p, extraNotes: next };
            });
          }}
          // Same input as Company Name (14px, 40px tall) — the character
          // counter (counter/maxLength above) is the only extra.
          inputStyle={{ fontSize: 14, height: 40 }}
        />
      </div>
    );
  };


  // One task section = one entry, shown in full — title, meta, checklist
  // (if any), note, and every photo — rather than split across
  // page-fitting blocks the way it used to be: sections aren't paginated
  // any more, so there's no reason to hold anything back. "+N more"
  // still works the same as before — PhotoGrid caps itself to
  // PHOTO_GRID_CAP items per call, so revealing every remaining photo
  // still means one additional PhotoGrid call per PHOTO_GRID_CAP-sized
  // chunk, just rendered directly here instead of as separate pagination
  // blocks.
  const renderTaskSection = ({ entryKey, e }) => {
    const displayTitle = titleOverrides[entryKey] ?? e.note;
    // e.noPhotos is set once in buildReportData from the true, uncapped
    // photo count — an entry with excluded photos must never be shown as
    // photo-less here just because its currently-included count is 0.
    const isPhotoless = e.noPhotos;
    const { kind } = statusForEntry(e);
    const statusMeta = STATUS_META[kind];
    const visiblePhotoCount = (e.photos || []).filter(
      (_, i) => !(preview.excludedPhotos && preview.excludedPhotos[`${entryKey}_${i}`])
    ).length;
    // Editable now (see getChecklist/updateChecklistItem/etc.) — no more
    // hard 10-item cap from the read-only days, since the user is the one
    // deciding what belongs on the list. Default collapsed to the first 3
    // (CHECKLIST_COLLAPSE_COUNT) with a "Show more"/"Show less" toggle,
    // same idea as PhotoGrid's own "+N more" but simpler (no chunking
    // needed — a checklist has no page-fitting concern to chunk around).
    const checklistItems = getChecklist(entryKey, e);
    const checklistExpanded = !!expandedChecklists[entryKey];
    const visibleChecklistItems = checklistExpanded ? checklistItems : checklistItems.slice(0, CHECKLIST_COLLAPSE_COUNT);
    const hasRevealedContinuation = (expandedPhotoGroups[entryKey] || 0) > 0 && visiblePhotoCount > PHOTO_GRID_CAP;
    // Every chunk beyond the first CAP-sized one, once "+N more" has been
    // clicked — same chunk math the old pagination pass used, just
    // rendered directly here instead of as separate blocks.
    const chunkNums = [];
    if (hasRevealedContinuation) {
      for (let chunk = 1; chunk * PHOTO_GRID_CAP < visiblePhotoCount; chunk++) chunkNums.push(chunk);
    }
    const onOpenPhoto = (photos, idx, originalIndices) => setLightbox({ photos, index: idx, entryDate: e.date, taskName: displayTitle, entryKey, originalIndices });
    const onExpandPhotos = () => setExpandedPhotoGroups(p => ({ ...p, [entryKey]: Infinity }));
    return (
      <div>
        {/* Renaming here only overrides the title for this report — the
            original task/entry text is never modified. No pencil icon —
            hover shows the grey02 affordance, click edits. */}
        <EditableField
          fieldId={`title_${entryKey}`}
          value={displayTitle}
          disabled={previewSaved}
          // Same independent-save flow as a checklist item (plain text →
          // click to edit → confirm button commits), not a live form field
          // like the rest of the draft.
          alwaysEditing
          onSave={v => {
            setTitleOverrides(prev => {
              if (v && v.trim()) return { ...prev, [entryKey]: v.trim() };
              const next = { ...prev }; delete next[entryKey]; return next;
            });
          }}
          textStyle={{ fontSize: 18, fontWeight: 600, color: "var(--tt-text-1)", lineHeight: "1.35", margin: 0 }}
          inputStyle={{ fontSize: 18, fontWeight: 600 }}
        />
        {/* Status/date meta line — Completed (green) folds its date
            directly into the status text ("Completed Sep 9", no
            separator dot, no uppercase); Open (blue) shows only the
            status, no date at all. */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusMeta.color, flexShrink: 0 }} />
          {kind === "completed" ? (
            <span style={{ fontSize: 11, fontWeight: 700, color: statusMeta.color }}>
              {statusMeta.label} {fmtDate(parseDate(e.date))}
            </span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: statusMeta.color }}>
              {statusMeta.label}
            </span>
          )}
          {!isPhotoless && visiblePhotoCount > 0 && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tt-grey04)", flexShrink: 0 }} />
              {/* Plain text always now — Manage Photos moved to a single,
                  report-wide entry point (the Photo Limit indicator), not
                  triggered per task item from here anymore. */}
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--tt-grey05)" }}>
                {visiblePhotoCount} photo{visiblePhotoCount === 1 ? "" : "s"}
              </span>
            </>
          )}
        </div>
        <div style={{ height: 1, background: "var(--tt-grey03)", marginTop: 16 }} />
        {(checklistItems.length > 0 || !previewSaved) && (
          // data-checklist-list, not a bare Fragment — Add item (below)
          // needs a real DOM node to scope its post-add focus query to
          // this task's own checklist, not any other task's.
          <div data-checklist-list={entryKey}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-text-2)", margin: "16px 0 8px" }}>
              Checklist items completed as of this update
            </p>
            {!previewSaved && checklistItems.length >= 10 && (
              <p style={{ margin: "-4px 0 8px", color: "var(--tt-grey05)", fontSize: 11, fontWeight: 400 }}>
                Up to 10 items
              </p>
            )}
            {visibleChecklistItems.map((item, idx) => {
              const checklistFieldId = `checklist_${entryKey}_${idx}`;
              // Same "is this field actually live" condition EditableField
              // itself uses internally (isEmpty, or it's the shared
              // activeField) — while true, no check/edit/trash icon shows
              // at all, there's nothing to act on while the row is already
              // a live input.
              const isEditingThisItem = !previewSaved && (!item.text.trim() || activeEditField === checklistFieldId);
              const isBeingDragged = draggedChecklist?.entryKey === entryKey && draggedChecklist?.idx === idx;
              return (
                <div
                  key={idx}
                  className="group"
                  style={{
                    marginTop: idx === 0 ? 0 : 6, display: "flex", alignItems: "center", gap: 8,
                    paddingBottom: 2, transition: "border-color 0.15s",
                    // Just the line accent (no background fill) — the
                    // reference screenshot's own highlight, marking which
                    // row is actually in motion without also tinting it.
                    borderBottom: `2px solid ${isBeingDragged ? "var(--tt-secondary)" : "transparent"}`,
                  }}
                  // Live reorder, not just on drop — dragging over another
                  // row immediately swaps it into that row's position (a
                  // real reorderChecklistItem call, not a visual-only
                  // preview), so the rest of the list visibly shifts out
                  // of the way as you drag, the way most drag-reorder
                  // lists behave. onDrop below then just cleans up —
                  // the order is already correct by the time it fires.
                  onDragOver={!previewSaved ? ev => {
                    ev.preventDefault();
                    if (draggedChecklist && draggedChecklist.entryKey === entryKey && draggedChecklist.idx !== idx) {
                      reorderChecklistItem(entryKey, e, draggedChecklist.idx, idx);
                      setDraggedChecklist({ entryKey, idx });
                    }
                  } : undefined}
                  onDrop={!previewSaved ? ev => { ev.preventDefault(); setDraggedChecklist(null); } : undefined}
                >
                  {previewSaved ? (
                    <Check size={14} strokeWidth={SW} color="var(--tt-secondary)" style={{ flexShrink: 0 }} />
                  ) : !isEditingThisItem && (
                    // No separate Edit affordance — the text itself is
                    // already the click-to-edit target (EditableField's
                    // own alwaysEditing text branch). Grip (reorder) and
                    // Trash (delete) crossfade in together, so — like the
                    // old Edit+Trash pairing — the column widens on hover
                    // to fit both instead of permanently reserving that
                    // space (see the Show More/Add Item comment below,
                    // tuned against this same resting 14px width).
                    <div className="relative flex-shrink-0 h-[14px] w-[14px] transition-[width] duration-150 ease-out group-hover:w-[34px]">
                      <Check
                        size={14} strokeWidth={SW} color="var(--tt-secondary)"
                        className="transition-opacity duration-150 group-hover:opacity-0"
                        style={{ position: "absolute", left: 0, top: 0 }}
                      />
                      <div className="absolute left-0 top-0 flex items-center gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {/* Native HTML5 drag-and-drop — draggable lives on
                            just this handle (not the whole row, which
                            still needs normal clicks/text-selection to
                            work), the row itself is the drop target (see
                            onDragOver/onDrop above). */}
                        <div
                          draggable
                          onDragStart={() => setDraggedChecklist({ entryKey, idx })}
                          onDragEnd={() => setDraggedChecklist(null)}
                          style={{ flexShrink: 0, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", color: "var(--tt-grey06)" }}
                        >
                          <GripVertical size={13} strokeWidth={SW} className="tt-split-gripvertical" />
                        </div>
                        {/* Deletes immediately — no confirmation, same as
                            everywhere else in this draft (photos, notes). */}
                        <button
                          type="button"
                          onClick={() => deleteChecklistItem(entryKey, e, idx)}
                          style={{ flexShrink: 0, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", padding: 0, cursor: "pointer", color: "var(--tt-grey06)" }}
                        >
                          <Trash2 size={13} strokeWidth={SW} className="tt-split-trash2" />
                        </button>
                      </div>
                    </div>
                  )}
                  {previewSaved ? (
                    <span style={{ fontSize: 13, color: "var(--tt-text-2)" }}>{item.text}</span>
                  ) : (
                    // Same edit mode as the task note (renderNoteSlot) —
                    // alwaysEditing, so an empty item still starts as a
                    // live input, but once it holds text it reads as plain
                    // clickable text (hover-highlighted) and only becomes
                    // a real bordered input box again on click, with the
                    // same confirm/cancel affordance every other
                    // alwaysEditing field has — not a bare, borderless,
                    // always-live <input> committing on every keystroke.
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <EditableField
                        fieldId={checklistFieldId}
                        value={item.text}
                        placeholder="Checklist item"
                        alwaysEditing
                        onSave={v => updateChecklistItem(entryKey, e, idx, v)}
                        textStyle={{ fontSize: 13, color: "var(--tt-text-2)", margin: 0 }}
                        inputStyle={{ fontSize: 13, height: 40 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {/* Show more/less right under the list, indented 22px (the
                icon column's own resting 14px width + the row's own 8px
                gap — it only widens to 34px on hover, not at rest) to
                line up under each item's own text rather than its icon
                column — reads as "more of this text", not a new checklist
                row of its own. Add item then sits below THAT, flush left
                instead (no indent) so it lines up with the icon column —
                it's adding a new row, not more text under the last one. */}
            {checklistItems.length > CHECKLIST_COLLAPSE_COUNT && (
              <button
                onClick={() => setExpandedChecklists(p => ({ ...p, [entryKey]: !checklistExpanded }))}
                style={{ marginTop: 8, marginLeft: 22, display: "flex", alignItems: "center", gap: 4, border: "none", background: "none", padding: 0, cursor: "pointer", color: "var(--tt-grey05)", fontSize: 12, fontWeight: 500 }}
              >
                {checklistExpanded ? "Show less" : `Show ${checklistItems.length - CHECKLIST_COLLAPSE_COUNT} more`}
                {checklistExpanded ? <ChevronUp size={14} strokeWidth={SW} /> : <ChevronDown size={14} strokeWidth={SW} />}
              </button>
            )}
            {/* Capped at 10 items total — once the list is already at that
                cap, Add item just doesn't render (the "Up to 10 items"
                note under the header above already explains why). */}
            {!previewSaved && checklistItems.length < 10 && (
              <button
                onClick={ev => {
                  const container = ev.currentTarget.closest("[data-checklist-list]");
                  addChecklistItem(entryKey, e);
                  // The new item is empty, so EditableField already shows
                  // it as a live input (not plain text) — but its own
                  // ref-based autofocus only ever fires for a NON-empty
                  // field being re-opened (see EditableField's ref
                  // callback), an empty one is assumed to start
                  // unfocused. That's wrong specifically for a
                  // freshly-added item, which the user just asked for by
                  // clicking Add item — so focus it explicitly here
                  // instead. One frame later, since the input doesn't
                  // exist in the DOM until this render actually commits.
                  requestAnimationFrame(() => {
                    const inputs = container?.querySelectorAll("input");
                    inputs?.[inputs.length - 1]?.focus();
                  });
                }}
                style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", padding: 0, cursor: "pointer", color: "var(--tt-secondary)", fontSize: 12, fontWeight: 500 }}
              >
                <Plus size={14} strokeWidth={SW} className="tt-split-plus" /> Add item
              </button>
            )}
          </div>
        )}
        {renderNoteSlot(entryKey)}
        {!isPhotoless && (
          <>
            <PhotoGrid
              photos={e.photos}
              onOpen={onOpenPhoto}
              excludedPhotos={preview.excludedPhotos}
              entryKey={entryKey}
              onDeletePhoto={previewSaved ? undefined : (idx) => handleDeletePhoto(entryKey, idx)}
              captions={preview.photoCaptions}
              windowEnd={hasRevealedContinuation ? PHOTO_GRID_CAP : undefined}
              onExpand={onExpandPhotos}
            />
            {chunkNums.map((chunk, idx) => (
              <PhotoGrid
                key={chunk}
                photos={e.photos}
                onOpen={onOpenPhoto}
                excludedPhotos={preview.excludedPhotos}
                entryKey={entryKey}
                onDeletePhoto={previewSaved ? undefined : (idx2) => handleDeletePhoto(entryKey, idx2)}
                captions={preview.photoCaptions}
                windowStart={chunk * PHOTO_GRID_CAP}
                windowEnd={idx === chunkNums.length - 1 ? undefined : (chunk + 1) * PHOTO_GRID_CAP}
                onExpand={onExpandPhotos}
              />
            ))}
          </>
        )}
      </div>
    );
  };


  // Summary — plain content, no box/background/padding of its own (flat,
  // matching the rest of this flat-card design — see cardStyle). The
  // "Summary" label lives on the section heading right above it (see
  // groupHeading in sectionCards) and there's no "Optional" tag at all
  // anymore, so this is just the field itself now.
  const renderSummaryBlock = () => {
    return (
      <div>
        <EditableField
          fieldId="summary"
          value={preview.summary}
          placeholder="Add a high-level overview of the progress made during this period..."
          disabled={previewSaved}
          live
          multiline
          counter
          maxLength={SUMMARY_MAX_LEN}
          rows={5}
          onSave={v => setPreview(p => ({ ...p, summary: v }))}
          textStyle={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: 0 }}
          inputStyle={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6 }}
        />
      </div>
    );
  };

  // ── Cover Header ──
  // Its own dedicated section (see sections/sectionCards) — a plain
  // labeled form (each field below the logo has its own visible label,
  // matching the form-field convention used in the new Footer section
  // too) rather than the previous unlabeled "letterhead" layout. Order
  // reads top to bottom: Logo first (no label of its own — LogoUploadBox
  // already reads as "Logo" on its own when empty), then Company
  // Name, Address, Email/Phone.
  // Also reused by the Footer section's own Name/Role labels, for the
  // same "shared form-field convention" reasoning as before.
  const FIELD_LABEL_STYLE = { fontSize: 14, fontWeight: 500, color: "var(--tt-text-2)", margin: "0 0 6px" };
  // Measures the form column's actual rendered height (it changes as
  // labels/errors show and hide while editing) so the logo box beside it
  // can be kept an exact square matching that height. Pure CSS
  // (align-items:stretch + aspect-ratio on the box itself) looks like it
  // should handle this on its own, but doesn't: a flex item's main-axis
  // size (width, in this row) is resolved BEFORE align-items:stretch
  // assigns its cross-axis (height) size, so aspect-ratio never actually
  // sees a resolved height to derive a width from — it only ever sees
  // the box's own tiny intrinsic content width, leaving it tall and
  // narrow instead of square. Measuring the form's real height in JS
  // sidesteps that circular dependency.
  //
  // This is a ONE-TIME measurement, not a live ResizeObserver — Company
  // Name/Address can each independently grow by one error line
  // (required-field validation, see handleSaveReportClick), and
  // continuously re-measuring to chase that made the box visibly
  // resize (even flash a frame at the stale size first) right as a
  // Save click failed validation. Instead COVER_LOGO_ERROR_BUFFER bakes
  // that possible growth in up front, so the box is already tall enough
  // — taller than the error-free form actually needs — and never has to
  // move again once set.
  //
  // marginTop(4) + a 10px/500 error line's own rendered height(~14) per
  // field, no further margin (the field's own 16px gap-to-next-field
  // margin just relocates from the input onto the error message itself
  // when one shows, rather than adding on top of it — see EditableField's
  // own live-branch styling).
  const COVER_LOGO_ERROR_BUFFER = 2 * (4 + 14);
  // Footer upload box (profile photo) — the Footer form is only two fields
  // tall (150px), too short for the upload box's icon + title + hint +
  // Choose File button, so it gets a fixed size instead of the Cover
  // Header's "match the form height" one.
  const FOOTER_UPLOAD_SIZE = 180;
  const [coverLogoSize, setCoverLogoSize] = useState(120);
  // A CALLBACK ref (not useRef + useLayoutEffect with a [] dependency
  // array) — this section mounts behind the preview's own fake-generate
  // loading delay (previewLoading), well after ReportsTab's own first
  // render, so a plain useLayoutEffect(..., []) tied to THAT render
  // already ran — and bailed out on a still-null ref — long before this
  // div actually existed, and an empty dependency array meant it never
  // got a second chance once the div finally mounted. That's exactly
  // the "stuck at the 120 default forever" symptom this replaces: a
  // callback ref instead fires exactly when THIS element attaches,
  // however late that happens to be, so the measurement always runs
  // against the real, already-rendered (error-free) form.
  const coverFormRef = useCallback(el => {
    if (!el) return;
    setCoverLogoSize(el.getBoundingClientRect().height + COVER_LOGO_ERROR_BUFFER);
  }, []);
  // One-line description at the top of each cover card (Header / Highlight
  // Photo / Content) saying what the section is for — draft only, a saved
  // report is just its content. 27px line box (18px × 1.5), mirrored by the
  // skeletons' SECTION_INTRO_SKELETON below so loading and loaded heights match.
  const renderSectionIntro = (text) => !previewSaved && (
    <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.5, color: "var(--tt-text-2)", margin: "0 0 24px" }}>{text}</p>
  );
  const SECTION_INTRO_SKELETON = (
    <div style={{ height: 27, marginBottom: 24, display: "flex", alignItems: "center" }}>
      <div className="tt-skeleton" style={{ width: "55%", height: 18 }} />
    </div>
  );
  const renderCoverHeader = () => (
    // Logo (left) and the form fields (right), side by side — the logo's
    // size comes from coverLogoSize (see the ResizeObserver above this
    // function, measuring the form column's own ref below) rather than
    // CSS alone, so it stays an exact square matching the form's real
    // height. No flex `gap` on the form column itself on purpose — `gap`
    // and each field's own margin below would just add together (a 20px
    // gap plus a 4px margin reads as 24px, not 4px), which is why the
    // 4/8px rhythm below wasn't actually showing up; Name/Address/
    // Email-Phone space themselves purely off their own margins instead.
    <>
    {renderSectionIntro("Your company identity.")}
    <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
      <LogoUploadBox
        src={preview.logo}
        onChange={url => setPreview(p => ({ ...p, logo: url }))}
        disabled={previewSaved}
        size={coverLogoSize}
        hint="PNG or JPG · Max size 5MB"
      />
      <div ref={coverFormRef} style={{ flex: 1, minWidth: 0 }}>
      {/* TODO(BE): replace with the firm's actual name from the API */}
      {/* alwaysEditing — same edit mode as the task note input and
          project name/address above the fold (see renderNoteSlot):
          clicking the plain text turns it into a live input right in
          place, rather than opening a separate popover editor.
          aboveWhenEditing shows the label only while the input is
          actually live (empty, or an existing value being re-edited) —
          a committed value read as plain text needs no label above it. */}
      {/* Two different rhythms depending on which of textStyle/inputStyle
          is actually rendering — not a wrapping div's fixed margin, since
          the right gap here genuinely depends on state: 16px below the
          live input (the default empty form, label + input, breathing
          room a form needs), tightening to 4px/8px once it's read back as
          plain committed text (Name+Address then read as one "who" block,
          not two separate form rows). */}
      <EditableField
        fieldId="companyName"
        value={preview.companyName}
        placeholder="E.g. Acme Construction Co."
        disabled={previewSaved}
        live
        required
        errorMessage="Company name can't be empty."
        aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Company Name</p>}
        onSave={v => setPreview(p => ({ ...p, companyName: v }))}
        textStyle={{ fontSize: 22, fontWeight: 600, color: "var(--tt-text-1)", margin: "0 0 8px" }}
        gap={16}
        inputStyle={{ fontSize: 14, height: 40 }}
      />
      <EditableField
        fieldId="companyAddress"
        value={preview.companyAddress}
        placeholder="E.g. 123 Main St, Austin, TX"
        disabled={previewSaved}
        live
        required
        errorMessage="Address can't be empty."
        aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Address</p>}
        onSave={v => setPreview(p => ({ ...p, companyAddress: v }))}
        textStyle={{ fontSize: 14, fontWeight: 400, color: "var(--tt-grey05)", margin: "0 0 12px" }}
        gap={16}
        inputStyle={{ fontSize: 14, height: 40 }}
      />
      {/* Email and phone side by side, no dash between them, a flat 16px
          gap regardless of state (empty input, actively being edited, or
          committed value) — unlike the vertical margins above, this
          horizontal gap doesn't switch per state. Each field keeps its own
          label/validate/filterInput and is still independently
          click-to-edit. flex:1/minWidth:0 on each wrapper (rather than a
          fixed pixel `width` on the input itself) splits the row evenly
          between them, so the two together reach the same full width
          Address above fills, instead of a fixed width stopping short of
          it and leaving the rest of the row empty. */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <EditableField
            fieldId="companyEmail"
            value={preview.companyEmail}
            placeholder="E.g. hello@acme.com"
            disabled={previewSaved}
            live
            aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Email</p>}
            // Inside the input itself (see EditableField's own
            // leadingIcon — absolutely positioned over its left padding),
            // not a sibling beside it — always shown, not just once
            // saved/committed, same idea as the label above the input.
            leadingIcon={<Mail size={14} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-mail" />}
            validate={v => EMAIL_PATTERN.test(v)}
            errorMessage="Enter a valid email address."
            onSave={v => setPreview(p => ({ ...p, companyEmail: v }))}
            textStyle={{ fontSize: 14, fontWeight: 400, color: "var(--tt-text-2)", margin: 0 }}
            inputStyle={{ fontSize: 14, height: 40, width: "100%" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <EditableField
            fieldId="companyPhone"
            value={preview.companyPhone}
            placeholder="E.g. (212) 555-0100"
            filterInput={formatUSPhone}
            disabled={previewSaved}
            live
            aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Phone</p>}
            // Same "inside the input, via leadingIcon" reasoning as Email
            // above.
            leadingIcon={<Phone size={14} strokeWidth={SW} color="var(--tt-grey05)" />}
            validate={v => US_PHONE_PATTERN.test(v)}
            errorMessage="Enter a valid US phone number."
            onSave={v => setPreview(p => ({ ...p, companyPhone: v }))}
            textStyle={{ fontSize: 14, fontWeight: 400, color: "var(--tt-text-2)", margin: 0 }}
            inputStyle={{ fontSize: 14, height: 40, width: "100%" }}
          />
        </div>
      </div>
      </div>
    </div>
    </>
  );

  // Highlight photo — its own section between the Cover Header and Cover
  // Content. Starts empty (upload prompt, see the empty-state branch below)
  // until the user uploads one via coverImageInputRef/handleCoverImageUpload.
  const renderCoverPhoto = () => {
    // Resolves either form preview.coverImage can hold: an IMG_MAP key
    // (a bundled/demo photo) or a full data URL (an upload, via
    // handleCoverImageUpload — not in IMG_MAP, so falls through to itself).
    const coverImageSrc = preview.coverImage ? (IMG_MAP[preview.coverImage] || preview.coverImage) : null;
    return (
      // No deliberate top gap here — flows directly after the header for
      // now rather than a fixed/enforced spacing rule.
      <div>
        {renderSectionIntro("The photo that represents your project.")}
        {/* Landscape called out explicitly — the frame crops to a fixed
            aspect via object-fit:cover once a photo's set, so a portrait
            photo would lose a lot off its sides. Empty state matches
            LogoUploadBox's own empty state exactly — same dashed
            border/grey01 background/8px radius box, same 24px grey05 icon,
            same 20/600/grey05/underlined prompt text — just in a column
            (icon above text) rather than a row, since this box is a much
            bigger photo-sized area rather than a small inline control; the
            "(Landscape Preferred)" hint is extra, cover-specific info
            LogoUploadBox has no equivalent of. Once a photo IS set, the
            box drops the dashed/grey01 empty styling for the photo's own
            look, and a hover-revealed corner edit button (same pattern as
            LogoUploadBox's own — see there) takes over for swapping it
            out, instead of an always-visible "Change Photo" pill. */}
        <div className={coverImageSrc ? "group" : undefined} style={{
          position: "relative", overflow: "hidden",
          ...(coverImageSrc
            ? { borderRadius: 12, ...(coverImageError ? { border: "1px solid var(--tt-red)" } : {}) }
            : { borderRadius: 8, border: `1px dashed ${coverImageError ? "var(--tt-red)" : "var(--tt-grey04)"}`, background: "var(--tt-grey01)" }),
        }}>
          {coverImageSrc ? (
            <img src={coverImageSrc} alt="" style={{ display: "block", width: "100%", maxHeight: 360, objectFit: "cover" }} />
          ) : (
            <div
              onClick={() => !coverImageUploading && !previewSaved && coverImageInputRef.current?.click()}
              style={{ width: "100%", height: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 0, cursor: previewSaved ? "default" : "pointer" }}
            >
              {coverImageUploading ? (
                <Loader size={40} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-loader" style={{ display: "block", flexShrink: 0, animation: "tt-spin 0.75s linear infinite, tt-fade-in 0.15s ease-out" }} />
              ) : (
                <ImagePlus size={40} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-imageplus" style={{ flexShrink: 0 }} />
              )}
              {!previewSaved && (
                <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-2)", marginTop: 8 }}>Highlight Photo</span>
              )}
              <span style={{ fontSize: 12, fontWeight: 400, color: "var(--tt-grey05)", marginTop: 2 }}>Landscape 16:9 · PNG or JPG · Max size 5MB</span>
              {!previewSaved && !coverImageUploading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full mt-3"
                  onClick={e => { e.stopPropagation(); coverImageInputRef.current?.click(); }}
                >
                  Choose File
                </Button>
              )}
            </div>
          )}
          {coverImageSrc && !previewSaved && (
            // Same darkening overlay a task's own PhotoGrid thumbnail
            // shows on hover (rgba(10,22,41,0.25) over the whole image) —
            // the parent's own overflow:hidden/borderRadius above already
            // clips this to match, no radius needed here. pointer-events-
            // none so it doesn't intercept the edit button's own click.
            <div className="absolute inset-0 bg-[rgba(10,22,41,0.25)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 pointer-events-none" />
          )}
          {coverImageSrc && !previewSaved && (
            <button
              onClick={() => !coverImageUploading && coverImageInputRef.current?.click()}
              disabled={coverImageUploading}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                position: "absolute", top: 12, right: 48, width: 28, height: 28, borderRadius: "50%",
                border: "none", background: "rgba(10,22,41,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                cursor: coverImageUploading ? "default" : "pointer", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
              }}
            >
              {coverImageUploading ? (
                <Loader size={13} strokeWidth={2.25} color="white" style={{ display: "block", animation: "tt-spin 0.75s linear infinite, tt-fade-in 0.15s ease-out" }} />
              ) : (
                <Pencil size={13} strokeWidth={2.25} color="white" />
              )}
            </button>
          )}
          {/* Remove — clears the highlight photo back to the empty/dashed
              upload prompt (rather than only ever being replaceable). */}
          {coverImageSrc && !previewSaved && (
            <button
              onClick={() => { setCoverImageError(""); setPreview(p => ({ ...p, coverImage: "" })); }}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                position: "absolute", top: 12, right: 12, width: 28, height: 28, borderRadius: "50%",
                border: "none", background: "rgba(10,22,41,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                cursor: "pointer", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
              }}
            >
              <Trash2 size={13} strokeWidth={2.25} color="white" />
            </button>
          )}
          {!previewSaved && (
            <input
              ref={coverImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              style={{ display: "none" }}
            />
          )}
        </div>
        {coverImageError && (
          <p style={{ color: "var(--tt-red)", fontSize: 10, fontWeight: 500, margin: "4px 0 0", textAlign: "center" }}>{coverImageError}</p>
        )}
      </div>
    );
  };

  // Cover content — project name/address, Prepared For + By, Additional
  // Information. Its own section, separate from the Cover Header and the
  // Highlight Photo above it.
  const renderCoverContent = () => {
    return (
      <div>
        {renderSectionIntro("Project details and who it is for.")}
        {/* The "Update No. X · period" line lives on the right of the
            "Cover" group heading now (see sectionCards' groupHeading). */}
        {/* alwaysEditing — same edit mode as the task note input (see
            renderNoteSlot): a live, ready-to-type field while empty,
            rather than a click-to-edit prompt that only reveals the
            actual input once clicked. Once it holds a value and isn't
            focused, it settles back to plain clickable text, same as
            everywhere else. */}
        <EditableField
          fieldId="projectName"
          value={preview.projectName}
          placeholder={PROJECT_NAME}
          disabled={previewSaved}
          live
          aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Project Name</p>}
          onSave={v => setPreview(p => ({ ...p, projectName: v }))}
          textStyle={{ fontSize: 40, fontWeight: 700, color: "var(--tt-text-1)", lineHeight: 1.1, margin: "0 0 8px" }}
          // Only the committed display text (textStyle) is the big 40px
          // heading — while actually typing, the input reads as plain,
          // normal-sized text, same as the task note's own edit mode
          // (see renderNoteSlot's inputStyle). margin matches textStyle's
          // own — without it, the gap to address below collapses while
          // this field is actively being edited, since inputStyle isn't
          // otherwise related to textStyle at all.
          gap={16}
          inputStyle={{ fontSize: 14, height: 40 }}
        />
        <EditableField
          fieldId="address"
          value={preview.address}
          placeholder={PROJECT_ADDRESS}
          disabled={previewSaved}
          live
          aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Address</p>}
          onSave={v => setPreview(p => ({ ...p, address: v }))}
          textStyle={{ fontSize: 15, fontWeight: 400, fontStyle: "italic", color: "var(--tt-grey05)", lineHeight: 1.3, margin: "0 0 32px" }}
          // Same reasoning as projectName above — plain, normal-sized
          // input text while editing, not the italic display style.
          // margin matches textStyle's own — without it, the 32px gap
          // to Prepared For below collapses while this field is actively
          // being edited, the same issue projectName's own margin fixes.
          gap={16}
          inputStyle={{ fontSize: 14, height: 40 }}
        />
        {/* Prepared For and By are the same kind of pair (uppercase label
            + value), both text-secondary throughout — label and value
            alike, on both sides — with the same 4px label/value gap so
            neither group reads any tighter or looser than the other.
            alignItems:baseline (not center) is what actually keeps label
            and value reading as one line — center aligns the two
            elements' margin boxes, which isn't reliable once one of them
            (the value, via EditableField's own wrapper div) has slightly
            different box metrics than a plain <p>; baseline aligns by the
            text itself, which is what "aligned" actually means here
            regardless of any such wrapper differences. */}
        {previewSaved ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "baseline", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-grey05)", lineHeight: 1, margin: 0, flexShrink: 0 }}>Prepared For</p>
              <EditableField
                fieldId="clientName"
                value={preview.clientName}
                placeholder="Add client name"
                disabled
                textStyle={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--tt-text-2)", lineHeight: 1, margin: 0 }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tt-grey05)", lineHeight: 1, margin: 0, flexShrink: 0 }}>Prepared By</p>
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--tt-text-2)", lineHeight: 1, margin: 0 }}>{preview.contactName || POINT_OF_CONTACT_NAME}</p>
            </div>
          </div>
        ) : (
          // Draft: both are ordinary labeled form inputs, side by side,
          // same as the rest of the cover form. "By" edits the same
          // contactName the Footer section's Name field does (every
          // project has exactly one owner), so it has its own fieldId
          // only to keep focus tracking separate from that field.
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <EditableField
                fieldId="clientName"
                value={preview.clientName}
                placeholder="Add client name"
                live
                aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Prepared For</p>}
                onSave={v => setPreview(p => ({ ...p, clientName: v }))}
                inputStyle={{ fontSize: 14, height: 40, width: "100%" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <EditableField
                fieldId="coverContactName"
                value={preview.contactName}
                placeholder={POINT_OF_CONTACT_NAME}
                live
                aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Prepared By</p>}
                onSave={v => setPreview(p => ({ ...p, contactName: v }))}
                inputStyle={{ fontSize: 14, height: 40, width: "100%" }}
              />
            </div>
          </div>
        )}
        {/* Same free-text pattern as renderSummaryBlock — multiline,
            alwaysEditing, its label/"Optional" row passed as
            aboveWhenEditing so it only shows alongside the live textarea. */}
        <EditableField
          fieldId="additionalInfo"
          value={preview.additionalInfo}
          placeholder="Add any extra context for this cover..."
          disabled={previewSaved}
          live
          multiline
          rows={3}
          counter
          maxLength={ADDITIONAL_INFO_MAX_LEN}
          aboveWhenEditing={
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--tt-text-2)", margin: 0 }}>Additional Information</p>
              <span style={{ fontSize: 10, fontWeight: 400, color: "var(--tt-grey05)", lineHeight: 1 }}>Optional</span>
            </div>
          }
          onSave={v => setPreview(p => ({ ...p, additionalInfo: v }))}
          textStyle={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: 0 }}
          inputStyle={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6 }}
        />
      </div>
    );
  };

  // ── Section navigation ──
  // A ref per section (keyed by section.key) so the left sidebar can jump
  // straight to any one of them, plus which section is currently nearest
  // the top of the scroll container, so the sidebar can highlight it.
  const sectionRefs = useRef({});
  const mainScrollRef = useRef(null);
  const [activeSectionKey, setActiveSectionKey] = useState(null);

  const scrollToSection = (key) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Walks the sections top-to-bottom and keeps the last one whose top has
  // scrolled at or above a small offset from the container's own top —
  // i.e. the section currently "in focus" at the top of the visible area,
  // not just whichever one happens to be tallest on screen.
  // containerTop is already exactly the header's own bottom edge — the
  // scroll container sits directly beneath the chrome bar, nothing else
  // in between — so a section only counts as "active" once its own top
  // has actually reached that line (a tiny 1px tolerance for sub-pixel
  // rounding, not an arbitrary buffer), matching what clicking a nav item
  // itself scrolls to (scrollIntoView's block:"start" lines a section's
  // top up with this exact same edge).
  const updateActiveSection = () => {
    const container = mainScrollRef.current;
    if (!container || sections.length === 0) return;
    const containerTop = container.getBoundingClientRect().top;
    let current = sections[0].key;
    for (const s of sections) {
      const el = sectionRefs.current[s.key];
      if (!el) continue;
      if (el.getBoundingClientRect().top - containerTop <= 1) current = s.key;
      else break;
    }
    setActiveSectionKey(prev => (prev === current ? prev : current));
  };

  // Only re-checked when the section LIST itself changes (e.g. infinite
  // scroll revealing more tasks), not on every render — getBoundingClientRect
  // forces a synchronous layout read per section, and this component
  // already got bitten once by an unbounded effect like that making typing
  // feel sluggish (see the old pagination pass this replaced). Scrolling
  // itself is covered separately by handleModalScroll.
  useEffect(() => { updateActiveSection(); }, [sections.length]);

  // Group label shown once above the first card of each group — mirrors
  // navGroups' own grouping (Cover/Summary/Task List/Footer) below, so
  // the document reads with the same section structure the sidebar nav
  // does, instead of a flat stack of unlabeled cards. coverContent
  // continues the "Cover" group coverHeader already labeled, so it's
  // deliberately left out here.
  const SECTION_GROUP = {
    coverHeader: { label: "Cover" },
    summary:     { label: "Summary" },
    task:        { label: "Task List" },
    footer:      { label: "Footer" },
  };
  const sectionCards = (!preview || !previewData) ? null : sections.map((section, si) => {
    const isFirst = si === 0;
    const group = SECTION_GROUP[section.type];
    // A task section only gets the "Task List" heading on the first one —
    // every later task in the same group continues under it instead of
    // repeating the label.
    const showGroupHeading = !!group && (section.type !== "task" || sections[si - 1]?.type !== "task");
    // border/radius/no-shadow and the 24px gap between cards both match
    // Preview/Download/Copy link's own `.card`/`.card+.card` exactly (see
    // buildReportHTML's css) — grey03 border, 12px radius, no shadow, so
    // each section reads as the same page whether it's this live draft or
    // the exported document. No top margin when a group heading is about
    // to sit right above this card instead (its own margin/gap below
    // already does that job) — only a heading-less continuation (like
    // coverContent right after coverHeader, or task 2+ after task 1)
    // still needs the plain 24px card-to-card gap.
    const cardStyle = {
      width: PAGE_W, margin: isFirst || showGroupHeading ? 0 : "24px 0 0",
      boxSizing: "border-box",
      background: "white",
      border: "1px solid var(--tt-grey03)",
      borderRadius: 16,
      display: "flex", flexDirection: "column",
    };
    // "Task List" also carries the progress indicator (X of Y tasks
    // complete + bar + percentage) — moved here from its old spot above
    // Summary (see the removed renderProgressBlock call) since it's
    // about the task list itself, not the summary text.
    const groupHeadingStyle = { fontSize: 22, fontWeight: 700, color: "var(--tt-text-1)", margin: isFirst ? "0 0 12px" : "40px 0 12px" };
    const groupHeading = !showGroupHeading ? null : (section.type === "task" && preview.includeSummary) ? (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, margin: groupHeadingStyle.margin }}>
        <p style={{ ...groupHeadingStyle, margin: 0 }}>{group.label}</p>
        {/* One row — text, bar, and percentage side by side, not the bar
            sitting on its own line under the text. flex:1 on the bar
            itself is what lets it fill whatever space is actually left
            between the text and the percentage, rather than a fixed
            width guessed to fit both. maxWidth caps how long that ends
            up being — wide enough to read as a bar, not so wide it
            dominates the row. */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 260 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", margin: 0, whiteSpace: "nowrap", flexShrink: 0 }}>
            {previewData.completed} of {previewData.total} complete
          </p>
          <div style={{ flex: 1, minWidth: 0, height: 6, background: "var(--tt-grey03)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${previewData.pct}%`, height: "100%", background: "var(--tt-secondary)", borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, fontStyle: "italic", color: "var(--tt-text-1)", flexShrink: 0, lineHeight: 1 }}>
            {previewData.pct}%
          </span>
        </div>
      </div>
    ) : section.type === "coverHeader" ? (
      // X is this draft's position in the project's save history
      // (reports.length + 1, so the very first save reads "Update No.
      // 1"), not tied to the period itself — the same period can be
      // regenerated and saved more than once, so the period alone can't
      // tell two saves apart (see the results table, which shows this
      // same pairing for that reason). Sits right of the "Cover" heading.
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, margin: groupHeadingStyle.margin }}>
        <p style={{ ...groupHeadingStyle, margin: 0 }}>{group.label}</p>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--tt-text-2)", margin: 0 }}>
          Update No. {preview.version} · {preview.period}
        </p>
      </div>
    ) : (
      <p style={groupHeadingStyle}>{group.label}</p>
    );
    // Natural height on every section — no fixed Letter-page minHeight
    // forcing any of them taller than their own content. No running
    // header/footer repeated per section either — that was a print-page
    // convention (company name/"VIA TASKTAG" repeated at the top, Point
    // of Contact repeated at the bottom of every physical page), which no
    // longer applies once each section is its own natural-height card
    // rather than a simulated Letter page; Point of Contact now gets its
    // own dedicated Footer section instead (see below), shown once.
    if (section.type === "coverHeader") {
      return (
        // ref on this outer wrapper (heading + card together), not the
        // card alone — scrollToSection's block:"start" then brings the
        // heading into view too, instead of aligning the card's own top
        // edge right at the container top and scrolling the heading just
        // above it, out of view.
        <div key={section.key} ref={el => { sectionRefs.current[section.key] = el; }}>
          {groupHeading}
          <div style={cardStyle}>
            <div style={{ padding: DRAFT_PAD }}>
              {renderCoverHeader()}
            </div>
          </div>
        </div>
      );
    }
    if (section.type === "coverPhoto") {
      return (
        <div key={section.key} ref={el => { sectionRefs.current[section.key] = el; }} style={cardStyle}>
          <div style={{ padding: DRAFT_PAD }}>
            {renderCoverPhoto()}
          </div>
        </div>
      );
    }
    if (section.type === "coverContent") {
      return (
        <div key={section.key} ref={el => { sectionRefs.current[section.key] = el; }} style={cardStyle}>
          <div style={{ padding: DRAFT_PAD }}>
            {renderCoverContent()}
          </div>
        </div>
      );
    }
    if (section.type === "summary") {
      return (
        <div key={section.key} ref={el => { sectionRefs.current[section.key] = el; }}>
          {groupHeading}
          <div style={cardStyle}>
            {/* PAGE_PAD on every side, same as the cover's own padding — not
                PAGE_BOTTOM_BUFFER (that one's specifically the export's own
                pagination buffer; it happens to also be 40 today, but
                borrowing it here made this padding only accidentally equal
                to the cover's, not guaranteed to stay that way). */}
            <div style={{ padding: DRAFT_PAD }}>
              {renderSummaryBlock()}
              {/* Only reachable when there's no activity at all for the
                  period — every real task otherwise gets its own Task N
                  section below this one. */}
              {previewData.groups.length === 0 && renderNoteSlot("empty")}
            </div>
          </div>
        </div>
      );
    }
    if (section.type === "task") {
      return (
        <div key={section.key} ref={el => { sectionRefs.current[section.key] = el; }}>
          {groupHeading}
          <div style={cardStyle}>
            {/* Same PAGE_PAD-on-every-side padding as every other section —
                see the summary section's own comment on why this no longer
                borrows PAGE_BOTTOM_BUFFER. Week/month group label (e.g.
                "September 2026") no longer shows here — it's in the sidebar
                now instead (see navGroups). */}
            <div style={{ padding: DRAFT_PAD }}>
              {renderTaskSection(section)}
            </div>
          </div>
        </div>
      );
    }
    // type === "footer" — the report-wide Point of Contact signature
    // (name, role, avatar), always last. Editable here rather than a
    // plain static credit repeated on every page the way it used to be —
    // see contactIdentity for how these carry forward into future drafts
    // the same way company logo/name/address/email/phone already do.
    const contactPhotoSrc = preview.contactPhoto;
    return (
      <div key={section.key} ref={el => { sectionRefs.current[section.key] = el; }}>
        {groupHeading}
        <div style={cardStyle}>
        <div style={{ padding: DRAFT_PAD }}>
          {previewSaved ? (
            // Saved: just the signature — avatar (photo, or the same
            // initials circle the export shows) beside name and role.
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: "50%", overflow: "hidden" }}>
                {contactPhotoSrc ? (
                  <img src={contactPhotoSrc} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--tt-pastel-magenta)" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{initialsOf(preview.contactName || "?")}</span>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)", margin: "0 0 8px" }}>{preview.contactName}</p>
                <p style={{ fontSize: 14, fontWeight: 400, color: "var(--tt-grey05)", margin: 0 }}>{preview.contactRole}</p>
              </div>
            </div>
          ) : (
          <>
          {renderSectionIntro("Who this report is signed by.")}
          {/* Same layout as the Cover Header: upload box on the left (the
              shared LogoUploadBox, just photo-flavoured — cover-fit, JPEG),
              labelled form fields on the right with the same 16px rhythm. */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <LogoUploadBox
              src={contactPhotoSrc}
              onChange={url => setPreview(p => ({ ...p, contactPhoto: url }))}
              disabled={previewSaved}
              size={FOOTER_UPLOAD_SIZE}
              resizeTo={256}
              mimeType="image/jpeg"
              quality={0.85}
              fit="cover"
              title="Profile Photo"
              alt="Point of contact"
              hint="PNG or JPG · Max size 5MB"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <EditableField
                fieldId="contactName"
                value={preview.contactName}
                placeholder="E.g. Maria Jose"
                disabled={previewSaved}
                live
                aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Name</p>}
                onSave={v => setPreview(p => ({ ...p, contactName: v }))}
                textStyle={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)", margin: "0 0 8px" }}
                gap={16}
                inputStyle={{ fontSize: 14, height: 40 }}
              />
              <EditableField
                fieldId="contactRole"
                value={preview.contactRole}
                placeholder="E.g. Project Manager"
                disabled={previewSaved}
                live
                aboveWhenEditing={<p style={FIELD_LABEL_STYLE}>Role</p>}
                onSave={v => setPreview(p => ({ ...p, contactRole: v }))}
                textStyle={{ fontSize: 14, fontWeight: 400, color: "var(--tt-grey05)", margin: 0 }}
                inputStyle={{ fontSize: 14, height: 40 }}
              />
            </div>
          </div>
          </>
          )}
        </div>
        </div>
      </div>
    );
  });

  const handleModalScroll = (e) => {
    updateActiveSection();
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

  // Deletes immediately (no confirmation, no multi-select) — moves this one
  // photo straight into preview.excludedPhotos (permanently filtered
  // everywhere, including from the live grid). The original photo itself
  // is never touched, only excluded from this report.
  const handleDeletePhoto = (entryKey, photoIndex) => {
    setPreview(p => ({ ...p, excludedPhotos: { ...p.excludedPhotos, [`${entryKey}_${photoIndex}`]: true } }));
  };

  // Keyed the same way as excludedPhotos/extraNotes — `${entryKey}_${photoIndex}`
  // against the original, unspliced entry — so it survives note-splicing and
  // stays aligned with a photo even as others around it get excluded.
  const setPhotoCaption = (entryKey, photoIndex, text) => {
    setPreview(p => {
      const key = `${entryKey}_${photoIndex}`;
      const next = { ...p.photoCaptions };
      if (text) next[key] = text; else delete next[key];
      return { ...p, photoCaptions: next };
    });
  };


  const handlePreviewDownload = async () => {
    if (!hasGroupData(previewFinalGroups)) { showToast("error", "No data to export"); return; }
    await handleDownload({ includeSummary: preview.includeSummary, period: preview.period, version: preview.version, data: { ...previewData, groups: previewFinalGroups }, photoCaptions: preview.photoCaptions });
  };

  const handlePreviewCopy = async () => {
    if (!hasGroupData(previewFinalGroups)) { showToast("error", "No data to export"); return; }
    const ok = await handleCopy({ includeSummary: preview.includeSummary, includeNoPhotoTasks: preview.includeNoPhotoTasks, dateRange: preview.dateRange, period: preview.period, version: preview.version, extraNotes: preview.extraNotes, excludedPhotos: preview.excludedPhotos, titleOverrides, checklistOverrides, photoCaptions: preview.photoCaptions });
    // Paywalled — handleCopy already opened the modal instead of copying
    // anything, so there's nothing to flash "Link copied" about.
    if (!ok) return;
    setPreviewCopied(true);
    setTimeout(() => setPreviewCopied(false), 2000);
  };

  // Save Report itself only validates and opens the confirmation modal
  // below (see showSaveConfirm) — the actual save (handleSaveConfirmed)
  // only runs once the user confirms there, same "confirm before an
  // action that locks/can't be undone" pattern the delete flow already
  // uses (see deleteTarget).
  const handleSaveReportClick = () => {
    if (saving) return;
    // Draft form fields (the `live` EditableFields) already write into
    // preview as you type, so this is the first point they get checked —
    // required/format errors show inline under the field and block the
    // save, same fields the old per-field confirm used to guard.
    const errs = {};
    if (!preview.companyName.trim()) errs.companyName = "Company name can't be empty.";
    if (!preview.companyAddress.trim()) errs.companyAddress = "Address can't be empty.";
    const email = preview.companyEmail.trim();
    if (email && !EMAIL_PATTERN.test(email)) errs.companyEmail = "Enter a valid email address.";
    const phone = preview.companyPhone.trim();
    if (phone && !US_PHONE_PATTERN.test(phone)) errs.companyPhone = "Enter a valid US phone number.";
    setFormErrors(errs);
    const firstErrorId = Object.keys(errs)[0];
    if (firstErrorId) {
      setTimeout(() => document.querySelector(`[data-field="${firstErrorId}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 0);
      return;
    }
    const finalGroups = applyExtraNotesToGroups(applyChecklistOverrides(applyTitleOverrides(applyPhotoExclusions(previewData.groups, preview.excludedPhotos), titleOverrides), checklistOverrides), preview.extraNotes);
    if (!hasGroupData(finalGroups)) { showToast("error", "No data to save"); return; }
    setShowSaveConfirm(true);
  };

  // Saving locks the draft into a read-only view (chrome swaps to a back
  // button + Download/Copy link) instead of closing outright — closing is
  // left to the user, same as the click-to-edit fields locking in place.
  const handleSaveConfirmed = () => {
    if (saving) return;
    setShowSaveConfirm(false);
    // Recomputed rather than threaded through from handleSaveReportClick —
    // the confirm modal sits open long enough (however briefly) that
    // re-deriving it here keeps this from ever saving a stale snapshot if
    // anything changed while it was up.
    const finalGroups = applyExtraNotesToGroups(applyChecklistOverrides(applyTitleOverrides(applyPhotoExclusions(previewData.groups, preview.excludedPhotos), titleOverrides), checklistOverrides), preview.extraNotes);
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
      pushReport({ includeSummary: preview.includeSummary, includeNoPhotoTasks: preview.includeNoPhotoTasks, dateRange: preview.dateRange, period: preview.period, version: preview.version, data: { ...previewData, groups: finalGroups }, extraNotes: preview.extraNotes, excludedPhotos: preview.excludedPhotos, titleOverrides, checklistOverrides, photoCaptions: preview.photoCaptions, projectName: preview.projectName.trim(), address: preview.address.trim(), logo: preview.logo, companyName: preview.companyName.trim(), companyAddress: preview.companyAddress.trim(), companyEmail: preview.companyEmail.trim(), companyPhone: preview.companyPhone.trim(), contactName: preview.contactName.trim(), contactRole: preview.contactRole.trim(), contactPhoto: preview.contactPhoto, summary: preview.summary.trim(), clientName: preview.clientName.trim(), additionalInfo: preview.additionalInfo.trim(), coverImage: preview.coverImage });
      setDateRange("since_last");
      setSaving(false);
      showToast("success", "Report saved");
      // Straight back to the reports table — Download/Copy link for this
      // report are already one click away from its row there, so there's
      // no reason to detour through the locked read-only preview chrome
      // first (closePreview resets previewSaved/activeEditField/etc.
      // along with actually closing the modal).
      closePreview();
    }, 900);
  };

  // Used to read window.innerWidth and hide the sidebar/collapse a couple
  // of buttons below it once the real browser window got too narrow. Now
  // that body/previewPanelRef both carry an explicit min-width (see
  // index.css and previewPanelRef's own style) guaranteeing this column
  // is always at least that wide regardless of the actual device/window
  // — scrolling to it instead of shrinking below it — there's no longer
  // a real "too narrow" case left to detect: window.innerWidth on a
  // phone still reports its own small size even though the rendered
  // layout itself never drops below the guaranteed floor, which was
  // hiding the sidebar there for no reason. Left as a plain constant
  // (not removed outright) so every call site below still reads the
  // same, in case a real narrow-layout mode is worth reintroducing later.
  const isWide = true;

  // Returns whether the download actually happened — false when paywalled
  // (Download/Copy link are locked then; the paywall modal opens instead).
  // Callers (the table row's success toast, handlePreviewCopy's "Link
  // copied" flash) key their own follow-up feedback off it.
  const handleDownload = async (report) => {
    // Paywalled — Download is locked; open the paywall modal instead.
    if (paywalled) { setShowPaywallModal(true); return false; }
    // Free tier — Download/Copy link stay available for the one report it
    // already includes (see the paywall's own "Shareable link for any
    // period" unlock item — that's about OTHER periods, not this one).
    // What's actually gated is Generate past that first save (see
    // handleGenerate) and Delete (see the row actions), not this.
    // Company/contact identity always reflect the latest save, not this
    // report's own (possibly older) snapshot — see companyIdentity/
    // contactIdentity.
    const html = await buildReportHTML({ ...report, logo: companyIdentity.logo, companyName: companyIdentity.companyName, companyAddress: companyIdentity.companyAddress, companyEmail: companyIdentity.companyEmail, companyPhone: companyIdentity.companyPhone, contactName: contactIdentity.name, contactRole: contactIdentity.role, contactPhoto: contactIdentity.photo });
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
    return true;
  };

  // Shared by handleCopy and handlePreviewOpen below — both need the
  // exact same reproducible-from-params URL, the only difference is what
  // happens with it afterward (clipboard vs. a new tab) and whether the
  // preview-only chrome (Period/Generation date + Download/Copy link —
  // see ReportPreviewChrome) should come along for the ride.
  const buildShareURL = (report, { preview, paywall } = {}) => {
    // Report content is fully reproducible from these params, so the link
    // needs no server/storage round-trip — it can never fail to resolve.
    // Manually-added notes aren't part of the base activity log, so they
    // have to ride along in the URL too — otherwise the shared link would
    // silently drop them while the downloaded HTML (built from the saved
    // snapshot) still shows them, and the two outputs would diverge.
    const params = new URLSearchParams({
      range: report.dateRange || "custom",
      period: sanitizePeriodForUrl(report.period),
      version: String(report.version),
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
    // Same reasoning again — edited/added/deleted checklist items only
    // live in this report's draft state, not in DUMMY_ENTRIES, so without
    // this the shared link would revert to the original checklist even
    // where the downloaded HTML shows the edited one.
    if (report.checklistOverrides && Object.keys(report.checklistOverrides).length > 0) {
      params.set("checklists", JSON.stringify(report.checklistOverrides));
    }
    // Same reasoning again — photo captions live only in this report's
    // draft/saved state, not in DUMMY_ENTRIES, so without this the shared
    // link would render every photo caption-less even where the
    // downloaded HTML shows them.
    if (report.photoCaptions && Object.keys(report.photoCaptions).some(k => report.photoCaptions[k]?.trim())) {
      params.set("captions", JSON.stringify(report.photoCaptions));
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
    if (companyIdentity.companyEmail) params.set("companyEmail", companyIdentity.companyEmail);
    if (companyIdentity.companyPhone) params.set("companyPhone", companyIdentity.companyPhone);
    // Same "latest identity, not this report's frozen snapshot" reasoning.
    // contactPhoto is left out for the same reason the logo is — a data
    // URL, the single largest thing that would otherwise be in this link.
    if (contactIdentity.name) params.set("contactName", contactIdentity.name);
    if (contactIdentity.role) params.set("contactRole", contactIdentity.role);
    // "summary" is already taken (the includeSummary toggle above) — the
    // summary text content gets its own key.
    if (report.summary) params.set("summaryText", report.summary);
    if (report.clientName) params.set("clientName", report.clientName);
    if (report.additionalInfo) params.set("additionalInfo", report.additionalInfo);
    // Only when it's still an IMG_MAP key (e.g. "img3") — cheap to carry
    // in the link, same as clientName above. An uploaded cover photo (see
    // handleCoverImageUpload) is a full data URL instead, excluded here
    // for the same reason the logo is: it would turn an otherwise short,
    // simple link into an unreadable multi-thousand-character block. The
    // download (which has no such constraint) still includes it in full.
    if (report.coverImage && IMG_MAP[report.coverImage]) params.set("coverImage", report.coverImage);
    // The logo and an uploaded cover photo exist but can't ride in the URL
    // — flag which ones, so the shared page can show a "can't be loaded"
    // placeholder where they'd be instead of silently leaving blank space
    // (or, worse, looking like they were never set).
    const missingImages = [];
    if (companyIdentity.logo) missingImages.push("logo");
    if (report.coverImage && !IMG_MAP[report.coverImage]) missingImages.push("cover");
    if (missingImages.length > 0) params.set("missing", missingImages.join(","));
    // date rides along unconditionally now (not just for preview) — the
    // document's own footer Report ID (see buildReportHTML's footerHTML/
    // reportIdFor) needs the report's real generation date to be correct
    // wherever this link is opened, not only in the owner's own Preview tab.
    if (report.date) params.set("date", report.date);
    // preview=1 (see handlePreviewOpen) is what tells the root component
    // to wrap ReportPage in ReportPreviewChrome instead of rendering it bare.
    if (preview) {
      params.set("preview", "1");
    }
    // Carries the demo's paywalled state into the new tab (see
    // handlePreviewOpen) — ReportPreviewChrome is a fresh mount with no
    // access to this component's own `paywalled`, so without this its
    // Download/Copy link would always work even when the owner's own
    // Preview tab should have them locked too.
    if (paywall) {
      params.set("paywall", "1");
    }
    return `${window.location.href.split("?")[0]}?${params.toString()}`;
  };

  // Same "returns whether it actually happened" contract as handleDownload.
  const handleCopy = async (report) => {
    // Paywalled — Copy link is locked too, same as Download above.
    if (paywalled) { setShowPaywallModal(true); return false; }
    // Same "free tier still gets Download/Copy link for its one included
    // report" reasoning as handleDownload above.
    const url = buildShareURL(report);
    try { await navigator.clipboard.writeText(url); }
    catch {
      const el = document.createElement("textarea");
      el.value = url; el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    return true;
  };

  // Preview — opens the exact same reproducible-from-params document a
  // copied link would, in a new tab, just with preview=1 so the root
  // component adds the extra chrome (Period/Generation date on the left,
  // Download/Copy link on the right — see ReportPreviewChrome) around it
  // instead of rendering the bare iframe a real recipient sees.
  // The logo, footer avatar and an uploaded cover photo are data URLs —
  // too big for the URL (see buildShareURL), so a preview tab rebuilt from
  // the URL alone rendered without them while the table's own Download
  // (built from the full report object) had them. The owner's own new tab
  // is same-origin, so those three ride along via localStorage instead,
  // keyed by report id (pid); same latest-identity values handleDownload
  // uses, so Preview, its Download and the table's Download all match.
  const handlePreviewOpen = (report) => {
    const url = new URL(buildShareURL(report, { preview: true, paywall: paywalled }));
    try {
      localStorage.setItem(`tt-preview-assets-${report.id}`, JSON.stringify({
        logo: companyIdentity.logo,
        contactPhoto: contactIdentity.photo,
        coverImage: report.coverImage,
      }));
      url.searchParams.set("pid", String(report.id));
    } catch { /* storage full/blocked — preview still works, just without those images */ }
    window.open(url.toString(), "_blank", "noopener,noreferrer");
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
                position: "relative",
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
              {/* "Generate" stays in the DOM (just hidden) rather than
                  being swapped out for the spinner — that's what keeps
                  the button's own width constant between the two states;
                  swapping content outright let it shrink to the
                  spinner's much narrower intrinsic width whenever
                  minWidth wasn't already pinning it (e.g. on narrow
                  layouts, where it's "auto"). */}
              <span style={{ visibility: generating ? "hidden" : "visible" }}>Generate</span>
              {generating && (
                // tt-spin-centered (not plain tt-spin) — its keyframes
                // bake the translate(-50%,-50%) centering in alongside
                // the rotation, since an animated "transform" otherwise
                // fully replaces this element's own inline one for as
                // long as the animation runs, silently dropping the
                // centering and leaving the icon offset by half its own
                // size (see the keyframe's own comment).
                <Loader size={14} strokeWidth={SW} color="white" className="tt-split-loader" style={{ display: "block", position: "absolute", top: "50%", left: "50%", animation: "tt-spin-centered 0.75s linear infinite" }} />
              )}
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
      {/* The header row always renders, empty reports or not — only the
          body swaps between the empty state (a single full-width row, so
          it still lives inside the table the header describes rather
          than replacing the whole table with an unrelated card) and the
          real rows below. */}
      <div style={{ marginTop: 24, border: "1px solid var(--tt-grey03)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ maxHeight: 556, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr style={{ background: "var(--tt-grey02)", borderBottom: `1px solid var(--tt-grey03)` }}>
              {["Project Name", "Period", "Generation date"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 12, fontWeight: 500, color: "var(--tt-text-1)" }}>{h}</th>
              ))}
              <th style={{ padding: "10px 16px", width: 190 }} />
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--tt-grey02)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <BarChart2 size={32} color="var(--tt-grey06)" strokeWidth={SW} className="tt-split-barchart2" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-text-1)", marginBottom: 4 }}>No reports yet</p>
                  <p style={{ fontSize: 13, color: "var(--tt-grey05)", lineHeight: "20px", marginTop: 4 }}>
                    {paywalled
                      ? "Generate your first report free — download or share it anytime"
                      : "Configure your report first and click Generate to create your report."}
                  </p>
                </td>
              </tr>
            ) : reports.map((r, i) => (
                /* No "just saved" mint highlight while paywalled — free
                   tier's one report never gets a next save to hand the
                   highlight off to (see lastSavedId), so it would just
                   sit there permanently instead of reading as recent. */
                <tr key={r.id} style={{ background: (!paywalled && r.id === lastSavedId) ? "var(--tt-mint)" : "white", borderTop: i > 0 ? `1px solid var(--tt-grey03)` : "none", transition: "background 0.6s ease" }}>
                  <td style={{ padding: "0 16px", fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", height: 52, verticalAlign: "middle", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.projectName || PROJECT_NAME}</td>
                  <td style={{ padding: "0 16px", fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", height: 52, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    {/* Update No. shown alongside the period since the same
                        period can be regenerated and saved more than once —
                        the period alone can't tell those saves apart. */}
                    Update No. {r.version} · {r.period}
                  </td>
                  <td style={{ padding: "0 16px", fontSize: 13, color: "var(--tt-text-2)", whiteSpace: "nowrap", height: 52, verticalAlign: "middle" }}>{r.date}</td>
                  <td style={{ padding: "0 14px 0 16px", textAlign: "right", height: 52, verticalAlign: "middle", width: 190 }}>
                    {r.status === "in_progress" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--tt-text-2)" }}>
                        In progress
                        <Loader size={14} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-loader" style={{ display: "block", animation: "tt-spin 0.75s linear infinite" }} />
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <FixedTooltipBtn label="Preview" onAction={() => handlePreviewOpen(r)}><Eye size={16} strokeWidth={SW} color="var(--tt-grey06)" className="tt-split-eye" /></FixedTooltipBtn>
                        <FixedTooltipBtn label={paywalled ? "Upgrade to unlock" : "Download"} onAction={async () => { const ok = await handleDownload(r); if (ok) showToast("success", "Downloaded"); }}><LockedIcon locked={paywalled}><Download size={16} strokeWidth={SW} color="var(--tt-grey06)" className="tt-split-download" /></LockedIcon></FixedTooltipBtn>
                        <FixedTooltipBtn label={paywalled ? "Upgrade to unlock" : "Copy link to share"} onAction={async () => { const ok = await handleCopy(r); if (ok) showToast("success", "Link copied"); }}><LockedIcon locked={paywalled}><Link size={16} strokeWidth={SW} color="var(--tt-grey06)" className="tt-split-link" /></LockedIcon></FixedTooltipBtn>
                        {/* Free tier's one report is a one-time allowance
                            (see handleGenerate) — Delete stays hidden while
                            paywalled so there's no way to clear it and
                            generate a "fresh" free report in its place. */}
                        {!paywalled && (
                          <FixedTooltipBtn label="Delete report" onAction={() => setDeleteTarget(r)}><Trash2 size={16} strokeWidth={SW} color="var(--tt-grey06)" className="tt-split-trash2" /></FixedTooltipBtn>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
      </div>
      {reports.length > 0 && (
        <p style={{ fontSize: 12, color: "var(--tt-grey05)", marginTop: 8 }}>
          {paywalled
            ? (
              <span style={{ color: "var(--tt-text-1)" }}>
                Your free report is saved and read-only.{" "}
                <strong
                  onClick={() => setShowPaywallModal(true)}
                  onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}
                  style={{ fontWeight: 600, cursor: "pointer" }}
                >
                  Upgrade to generate more.
                </strong>
              </span>
            )
            : "Saved reports are read-only. To make changes, generate a new report for the range you need."}
        </p>
      )}
      </>
      )}

      {/* ── Generate preview — a full-screen takeover, same as the photo
          lightbox, not inline content within the tab. ── */}
      {preview && (
        <ActiveEditContext.Provider value={activeEditCtxValue}>
        <FormErrorsContext.Provider value={formErrorsCtxValue}>
          <div
            ref={previewPanelRef}
            style={{
              // Stays exactly viewport-sized (no minWidth here) — the
              // minWidth instead lives on the plain block child just
              // below, which is what actually needs to be ≥1200px. Doing
              // it there instead of here is what makes overflowX below
              // actually pannable/swipeable on a phone: a position:fixed
              // box that's forced wider than the real viewport via its
              // own min-width doesn't reliably become horizontally
              // scrollable at all (fixed positioning is resolved against
              // the viewport itself, not any box's own overflow) — but a
              // normal, non-fixed child that's wider than ITS (correctly
              // viewport-sized) fixed parent scrolls exactly like any
              // other overflowing content would.
              position: "fixed", inset: 0, zIndex: 2000, overflowX: "auto",
              // grey02 — the sidebar, chrome bar, and every section card
              // each set their own explicit white background, so against
              // this slightly-off-white body they still stand apart via
              // that contrast (plus their own shadow, for the section
              // cards) rather than blending into an identically-white page.
              background: "var(--tt-grey02)",
            }}
          >
          {/* minWidth is the actual desktop floor (see the outer div's own
              comment); height:100% carries this fixed box's own definite
              viewport height down to here, since that's what the flex
              column below (and its own flex:1 scrollable body row) needs
              to size correctly against. */}
          <div style={{ minWidth: 1200, height: "100%", display: "flex", flexDirection: "column" }}>

            {/* Modal chrome. Draft: Photo Limit usage on the left, Cancel +
                Save Report on the right — the period is locked in once
                Generate is clicked from the results page, so there's no
                back button or period control here, and closing is explicit
                via Cancel. Once saved: back button + the locked period on
                the left, Download/Copy link on the right — closing is then
                left to the user. Capped to ROW_W and centered — the exact
                same width and centering the body row below uses — so this
                bar's own left/right edges land precisely on the sidebar's
                left edge and the document column's right edge, and any
                leftover space on a wide screen balances evenly on both
                sides instead of the whole unit piling up against one edge.
                No scrollbarGutter reservation here (this bar's content
                never actually scrolls) — it was reserving space on only
                one side of this box and not the body row below, shifting
                this box's own centered content slightly off from the
                body's, which is exactly what broke the alignment between
                the two. */}
            <div
              id="draft-chrome"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px",
                borderBottom: "1px solid var(--tt-grey03)", flexShrink: 0, background: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: ROW_W, width: "100%", margin: "0 auto" }}>
              {/* Photo Limit lives in the sidebar's own fixed footer now
                  (see NavSidebar) — this slot is the logo, left-aligned to
                  match the sidebar's own icon column below (NAV_SIDEBAR_ICON_INSET
                  — this bar and the body row below share the same ROW_W/
                  margin:auto centering, so a plain fixed-width cell here
                  lands exactly over the sidebar), plus the back+period chip
                  once saved. */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: NAV_W, flexShrink: 0, display: "flex", paddingLeft: NAV_SIDEBAR_ICON_INSET }}>
                  <img src={IMG_MAP_LOGO} alt="TaskTag" style={{ height: 40, width: "auto" }} />
                </div>
                {previewSaved && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={closePreview}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}
                      style={{ width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8, cursor: "pointer", color: "var(--tt-text-2)", transition: "background 0.15s", marginRight: 8 }}
                    >
                      <ChevronLeft size={18} strokeWidth={SW} />
                    </button>
                    <div style={{
                      display: "flex", alignItems: "center",
                      background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 8,
                      height: 40, padding: "0 12px",
                      fontSize: 13, fontWeight: 500, color: "var(--tt-text-1)",
                    }}>
                      <span>{preview.period}</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {previewSaved ? (
                  <>
                    <button
                      disabled={previewLoading}
                      onClick={handlePreviewDownload}
                      onMouseEnter={e => !previewLoading && (e.currentTarget.style.background = "var(--tt-grey02)")}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}
                      style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "background 0.15s" }}
                    >
                      <LockedIcon locked={paywalled}><Download size={14} strokeWidth={SW} className="tt-split-download" /></LockedIcon> Download
                    </button>
                    <button
                      disabled={previewLoading}
                      onClick={handlePreviewCopy}
                      onMouseEnter={e => !previewLoading && (e.currentTarget.style.background = "var(--tt-grey02)")}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}
                      style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: previewLoading ? "not-allowed" : "pointer", opacity: previewLoading ? 0.5 : 1, transition: "background 0.15s" }}
                    >
                      {previewCopied
                        ? <><Check size={14} strokeWidth={SW} /> Link copied</>
                        : <><LockedIcon locked={paywalled}><Link size={14} strokeWidth={SW} className="tt-split-link" /></LockedIcon> Copy link</>}
                    </button>
                  </>
                ) : (
                  <>
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
                      onClick={handleSaveReportClick}
                      onMouseEnter={e => !(previewLoading || saving) && (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={e => e.currentTarget.style.opacity = (previewLoading || saving) ? 0.5 : 1}
                      style={{
                        position: "relative",
                        height: 40, padding: "0 24px", minWidth: isWide ? 120 : "auto", borderRadius: 8, border: "none",
                        background: "var(--tt-text-1)", fontSize: 13, fontWeight: 500, color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                        cursor: (previewLoading || saving) ? "not-allowed" : "pointer",
                        opacity: (previewLoading || saving) ? 0.5 : 1, transition: "opacity 0.15s",
                      }}
                    >
                      {/* "Save Report" stays in the DOM (just hidden) rather
                          than being swapped out for the icon — see the
                          Generate button's own identical fix — so the
                          button's width stays constant between the two
                          states instead of shrinking to the icon's much
                          narrower intrinsic width whenever minWidth wasn't
                          already pinning it (e.g. on narrow layouts, where
                          it's "auto"). */}
                      <span style={{ visibility: saving ? "hidden" : "visible" }}>Save Report</span>
                      {saving && (
                        // tt-spin-centered — see Generate's own identical
                        // fix/comment above.
                        <Loader size={14} strokeWidth={SW} color="white" className="tt-split-loader" style={{ display: "block", position: "absolute", top: "50%", left: "50%", animation: "tt-spin-centered 0.75s linear infinite" }} />
)}
                    </button>
                  </>
                )}
              </div>
              </div>
            </div>

            {/* Body — flows with the page (no fixed height/own scrollbar).
                This is a real full-screen overlay with its own scroll
                container, so infinite scroll is driven off this
                container's own scrollTop (handleModalScroll) instead of
                window scroll. Capped to ROW_W and centered — same width
                and centering as the chrome bar above, so the two stay
                aligned and the whole unit balances on a wide screen (see
                ROW_W's own comment). The sidebar still butts directly
                against the document with no gap of its own (see the
                content wrapper's own padding below). */}
            <div style={{ display: "flex", flex: 1, minHeight: 0, maxWidth: ROW_W, margin: "0 auto" }}>
              {/* Nav sidebar — a real, always-present column spanning the
                  full height of the body (a plain flex sibling, not
                  floated/absolute), so it naturally stays in view as the
                  document scrolls in its own container next to it —
                  the same structural layout a typical section-based
                  report editor uses (fixed-width nav rail + document pane),
                  just with this app's own section list/content. */}
              {/* Loading — same NAV_W column/border/padding as the real
                  sidebar below, walking the same navGroups shape (already
                  known synchronously off `preview`/`previewData`, not
                  actually gated behind this fake delay) so the row count,
                  grouping and indentation match the real nav exactly —
                  just skeleton bars instead of real labels. */}
              {isWide && previewLoading && navGroups.length > 0 && (
                // Same scrollable list + fixed Photo Limit footer split as
                // the real NavSidebar below (not skeleton'd — previewPhotoCount
                // is already known synchronously, nothing about it is loading).
                <div style={{ width: NAV_W, flexShrink: 0, borderRight: "1px solid var(--tt-grey03)", background: "white", display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 16 }}>
                  {navGroups.map((group, gi) => (
                    <div key={group.key || group.label} style={{ marginTop: gi === 0 ? 0 : 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
                        <div className="tt-skeleton" style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0 }} />
                        <div className="tt-skeleton" style={{ width: 70, height: 12 }} />
                      </div>
                      {group.type === "group" && (
                        <div style={{ marginLeft: 21, paddingLeft: 12, borderLeft: "2px solid var(--tt-grey03)" }}>
                          {group.children.map((child, ci) => (
                            <div key={child.key}>
                              {child.groupLabel && (
                                <div style={{ padding: "0 10px", margin: ci === 0 ? "0 0 4px" : "12px 0 4px" }}>
                                  <div className="tt-skeleton" style={{ width: 90, height: 10 }} />
                                </div>
                              )}
                              <div style={{ padding: "6px 10px", marginTop: 2 }}>
                                <div className="tt-skeleton" style={{ width: ci % 2 === 0 ? 130 : 100, height: 11 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                  {!previewSaved && (
                    <div style={{ flexShrink: 0, padding: `16px ${NAV_SIDEBAR_ICON_INSET}px`, borderTop: "1px solid var(--tt-grey03)" }}>
                      {photoLimitWidget}
                    </div>
                  )}
                </div>
              )}
              {isWide && !previewLoading && sections.length > 0 && (
                <NavSidebar items={navGroups} activeKey={activeSectionKey} onSelect={scrollToSection} footer={!previewSaved && photoLimitWidget} />
              )}
              {/* No scrollbarGutter reservation here (unlike elsewhere in
                  this modal) — this column is flex:1 with no width cap of
                  its own, but the document card inside has a genuinely
                  fixed width:PAGE_W (see cardStyle); reserving gutter space
                  in addition to that fixed width was shrinking the actual
                  available space below PAGE_W, which pushed the card past
                  this container's right edge and forced an unwanted
                  horizontal scrollbar on the whole modal. Its own padding
                  below (PAGE_GUTTER, plus SCROLLBAR_W more on the right —
                  see both constants' own comments) is what actually
                  reserves room for a real scrollbar (when content is tall
                  enough for one) instead — CONTENT_BUFFER is what's
                  budgeted into this column's own width for that. */}
              <div ref={mainScrollRef} style={{ overflowY: "auto", flex: 1 }} onScroll={handleModalScroll}>
              {/* PAGE_GUTTER on all four sides — the card floats inside
                  this light-grey frame the same way it does in
                  Preview/Download/Copy link (see buildReportHTML's own
                  body css) — except the right side also carries
                  SCROLLBAR_W on top, so the real scrollbar this container
                  renders (when content overflows) eats into that extra
                  allowance instead of the visible gap, leaving a clean
                  PAGE_GUTTER next to the card on every side, scrollbar or
                  not. */}
              <div style={{ padding: `${PAGE_GUTTER}px ${PAGE_GUTTER + SCROLLBAR_W}px ${PAGE_GUTTER}px ${PAGE_GUTTER}px` }}>
              <div style={{ maxWidth: PAGE_W }}>
                {previewLoading ? (
                  // One skeleton card per real section — same cardStyle
                  // (width/margin/background) as sectionCards below, in the
                  // same Cover Header/Cover Content/Summary/Task N/Footer
                  // order, so the loading state doesn't jump to a
                  // different structure once the real draft appears.
                  // `sections` (and every count it carries — task photos,
                  // whether the progress block shows) is already known
                  // synchronously off `preview`/`previewData`, not actually
                  // gated behind this fake delay, so every skeleton below
                  // is sized off the real data instead of a generic guess.
                  // Task sections are the one deliberate exception — a
                  // report can have any number of them, so skeletoning
                  // every single one (rather than one single-section/
                  // single-page, section like Cover/Summary, which really
                  // can only ever be exactly one) would mean a long scroll
                  // of near-identical shimmer cards for no benefit; only
                  // the FIRST task section renders here, as one
                  // representative placeholder, and the rest are skipped
                  // (return null below) until the real cards replace it.
                  (() => {
                    const firstTaskKey = sections.find(s => s.type === "task")?.key;
                    return sections.map((section, si) => {
                    if (section.type === "task" && section.key !== firstTaskKey) return null;
                    // Same group-heading logic as sectionCards below — the
                    // label/icon itself renders as real text/icon, not a
                    // shimmering bar, since it's static and already known
                    // synchronously (same reasoning as every skeleton size
                    // here), so it doesn't need to "load" at all.
                    const group = SECTION_GROUP[section.type];
                    const showGroupHeading = !!group && (section.type !== "task" || sections[si - 1]?.type !== "task");
                    const skeletonCardStyle = { width: PAGE_W, margin: si === 0 || showGroupHeading ? 0 : "24px 0 0", boxSizing: "border-box", background: "white", border: "1px solid var(--tt-grey03)", borderRadius: 16 };
                    // Same real progress values as sectionCards' own
                    // groupHeading (not a shimmer bar) — previewData is
                    // already known synchronously too, per this block's
                    // own comment above.
                    const skeletonGroupHeadingStyle = { fontSize: 22, fontWeight: 700, color: "var(--tt-text-1)", margin: si === 0 ? "0 0 12px" : "40px 0 12px" };
                    const groupHeading = !showGroupHeading ? null : (section.type === "task" && preview.includeSummary) ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, margin: skeletonGroupHeadingStyle.margin }}>
                        <p style={{ ...skeletonGroupHeadingStyle, margin: 0 }}>{group.label}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 260 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tt-text-1)", margin: 0, whiteSpace: "nowrap", flexShrink: 0 }}>
                            {previewData.completed} of {previewData.total} complete
                          </p>
                          <div style={{ flex: 1, minWidth: 0, height: 6, background: "var(--tt-grey03)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ width: `${previewData.pct}%`, height: "100%", background: "var(--tt-secondary)", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 28, fontWeight: 700, fontStyle: "italic", color: "var(--tt-text-1)", flexShrink: 0, lineHeight: 1 }}>
                            {previewData.pct}%
                          </span>
                        </div>
                      </div>
                    ) : section.type === "coverHeader" ? (
                      // Same "Update No. X · period" line on the right of
                      // the "Cover" heading as the real draft (see
                      // sectionCards' groupHeading) — static text, already
                      // known, so it renders for real instead of shimmering.
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, margin: skeletonGroupHeadingStyle.margin }}>
                        <p style={{ ...skeletonGroupHeadingStyle, margin: 0 }}>{group.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "var(--tt-text-2)", margin: 0 }}>
                          Update No. {preview.version} · {preview.period}
                        </p>
                      </div>
                    ) : (
                      <p style={skeletonGroupHeadingStyle}>{group.label}</p>
                    );
                    if (section.type === "coverHeader") {
                      // Mirrors renderCoverHeader's own real layout — logo
                      // (square) on the left, form fields on the right.
                      // Each field there is a LABEL (FIELD_LABEL_STYLE,
                      // 14px, 6px margin-bottom) above an actual INPUT box
                      // (40px tall, rounded) — see Company Name/Address/
                      // Email/Phone's own aboveWhenEditing+inputStyle —
                      // not a single flat bar, which is what this used to
                      // skeleton. Email/Phone split the row evenly
                      // (flex:1 each), matching that row's own fix.
                      // The logo box reuses the SAME coverFormRef/
                      // coverLogoSize the real logo does (see those hooks'
                      // own comment, above renderCoverHeader) — this field
                      // stack gets the ref instead of the real one while
                      // this skeleton is what's mounted, so the measured
                      // height is the real height of THIS stack, and the
                      // logo box is a genuinely identical size to the real
                      // logo's own, not just a visual approximation of it.
                      return (
                        <Fragment key={section.key}>
                          {groupHeading}
                          <div style={skeletonCardStyle}>
                            <div style={{ padding: DRAFT_PAD }}>
                            {SECTION_INTRO_SKELETON}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                              <div className="tt-skeleton" style={{ width: coverLogoSize, height: coverLogoSize, borderRadius: 8, flexShrink: 0 }} />
                              <div ref={coverFormRef} style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 100, height: 14 }} /></div>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 16 }} />
                                <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 60, height: 14 }} /></div>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 16 }} />
                                <div style={{ display: "flex", gap: 16 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 50, height: 14 }} /></div>
                                    <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 50, height: 14 }} /></div>
                                    <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                    if (section.type === "coverPhoto") {
                      return (
                        <div key={section.key} style={skeletonCardStyle}>
                          <div style={{ padding: DRAFT_PAD }}>
                            {SECTION_INTRO_SKELETON}
                            <div className="tt-skeleton" style={{ width: "100%", height: 242, borderRadius: 12 }} />
                          </div>
                        </div>
                      );
                    }
                    if (section.type === "coverContent") {
                      // Matches renderCoverContent's own real (draft,
                      // non-previewSaved) structure field for field — each
                      // of Project Name/Address/Prepared For/By is a
                      // label (FIELD_LABEL_STYLE, 14px/6px margin) above a
                      // 40px input, same rhythm as Cover Header's own
                      // skeleton; Additional Information is its own label
                      // row + a 3-row textarea (3×14×1.6=67.2 content +
                      // 8px top padding + 22px bottom padding reserved for
                      // its counter ≈ 97).
                      return (
                        <div key={section.key} style={skeletonCardStyle}>
                          <div style={{ padding: DRAFT_PAD }}>
                            {SECTION_INTRO_SKELETON}
                            <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 110, height: 14 }} /></div>
                            <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 16 }} />
                            <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 60, height: 14 }} /></div>
                            <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 16 }} />
                            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 90, height: 14 }} /></div>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 24, height: 14 }} /></div>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                              </div>
                            </div>
                            <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 160, height: 14 }} /></div>
                            <div className="tt-skeleton" style={{ width: "100%", height: 97, borderRadius: 8 }} />
                          </div>
                        </div>
                      );
                    }
                    if (section.type === "summary") {
                      // Matches renderSummaryBlock's own real height exactly
                      // (no stale label bar — the card itself has no label
                      // of its own anymore, that moved to groupHeading
                      // above): rows=5 at 14px/1.6 line-height is 5×22.4=112
                      // content px, plus the Textarea's own 8px top padding
                      // (py-2) and the 22px bottom padding reserved for the
                      // character counter (see EditableField's own
                      // paddingBottom:counter?22) = 142 total.
                      return (
                        <Fragment key={section.key}>
                          {groupHeading}
                          <div style={skeletonCardStyle}>
                            <div style={{ padding: DRAFT_PAD }}>
                              <div className="tt-skeleton" style={{ width: "100%", height: 142, borderRadius: 8 }} />
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                    if (section.type === "task") {
                      const e = section.e;
                      const photoCount = Math.min(e?.photos?.length || 0, 5);
                      // Same 10-item hard cap getChecklist itself enforces,
                      // then collapsed to CHECKLIST_COLLAPSE_COUNT — the
                      // real default, unexpanded view (see renderTaskSection).
                      const checklistCount = Math.min((e?.checklist || []).length, 10);
                      const checklistPreviewCount = Math.min(checklistCount, CHECKLIST_COLLAPSE_COUNT);
                      return (
                        <Fragment key={section.key}>
                          {groupHeading}
                          <div style={skeletonCardStyle}>
                            <div style={{ padding: DRAFT_PAD }}>
                              {/* Title is a `live` field now (see
                                  renderTaskSection) — always a real,
                                  rounded h-10 (40px) input, not committed
                                  text at a flat 18px, even while unsaved. */}
                              <div className="tt-skeleton" style={{ width: "60%", height: 40, borderRadius: 8, marginBottom: 8 }} />
                              <div className="tt-skeleton" style={{ width: 160, height: 11, marginTop: 8 }} />
                              <div style={{ height: 1, background: "var(--tt-grey03)", marginTop: 16 }} />
                              {/* The "Checklist items completed..." header
                                  itself shows unconditionally while
                                  !previewSaved (always true during this
                                  fake delay) — see renderTaskSection's own
                                  condition — not just when the task
                                  already has items; only the item rows
                                  below it are conditional on actually
                                  having any. */}
                              <div style={{ marginTop: 16 }}>
                                <div className="tt-skeleton" style={{ width: 220, height: 11, marginBottom: 8 }} />
                                {Array.from({ length: checklistPreviewCount }, (_, ci) => (
                                  <div key={ci} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: ci === 0 ? 0 : 6 }}>
                                    <div className="tt-skeleton" style={{ width: 14, height: 14, borderRadius: 4, flexShrink: 0 }} />
                                    <div className="tt-skeleton" style={{ width: ci % 2 === 0 ? "60%" : "45%", height: 13 }} />
                                  </div>
                                ))}
                              </div>
                              {/* Note — always a live input while loading
                                  (previewLoading only ever happens on an
                                  unsaved draft, see renderNoteSlot). */}
                              <div style={{ marginTop: 16, marginBottom: 12 }}>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                              </div>
                              {photoCount > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                                  {Array.from({ length: photoCount }, (_, pi) => (
                                    <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "16/9", borderRadius: 4 }} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                    // type === "footer" — Name/Role are `live` fields now
                    // (always a real 40px input, not committed text at
                    // 16px/14px the way this used to skeleton), each
                    // filling the full width of their own flex:1 column,
                    // same as the real contactName/contactRole inputs do.
                    return (
                      <Fragment key={section.key}>
                        {groupHeading}
                        <div style={skeletonCardStyle}>
                          <div style={{ padding: DRAFT_PAD }}>
                            {SECTION_INTRO_SKELETON}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                              <div className="tt-skeleton" style={{ width: FOOTER_UPLOAD_SIZE, height: FOOTER_UPLOAD_SIZE, borderRadius: 8, flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 50, height: 14 }} /></div>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 16 }} />
                                <div style={{ height: 21, marginBottom: 6, display: "flex", alignItems: "center" }}><div className="tt-skeleton" style={{ width: 40, height: 14 }} /></div>
                                <div className="tt-skeleton" style={{ width: "100%", height: 40, borderRadius: 8 }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    );
                    });
                  })()
                ) : (
                  <>
                    {/* Real, visible sections — Cover/Summary/Task N cards,
                        each sized to its own natural content height (see
                        sectionCards) rather than simulated Letter pages,
                        so the preview reads like a real document organized
                        by section instead of one long scroll or a stack of
                        fixed-height sheets. */}
                    {sectionCards}

                    {/* Infinite scroll: one skeleton item while the next batch "loads" */}
                    {loadingMore && (
                      <div style={{ width: PAGE_W, margin: "24px 0 0" }}>
                        <div className="tt-skeleton" style={{ width: "85%", height: 16, marginBottom: 10 }} />
                        {nextEntry && nextEntry.photos.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                            {[0, 1, 2, 3, 4].map(pi => (
                              <div key={pi} className="tt-skeleton" style={{ width: "100%", aspectRatio: "16/9", borderRadius: 4 }} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

              </div>
              </div>
              </div>
            </div>

          </div>
          </div>
        </FormErrorsContext.Provider>
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
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--tt-text-1)", margin: 0 }}>Delete Report</p>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tt-text-1)", padding: 4, display: "flex", borderRadius: 6, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <X size={20} strokeWidth={SW} className="tt-split-x" />
              </button>
            </div>
            {/* Same layout as the Save Report confirmation: project name,
                period, then the message. */}
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)", lineHeight: 1.6, margin: "0 0 4px" }}>
              {deleteTarget.projectName || PROJECT_NAME}
            </p>
            <p style={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: "0 0 16px" }}>
              Update No. {deleteTarget.version} · {deleteTarget.period}
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

      {/* Save report confirmation — same "confirm before an action that
          locks/can't be undone" pattern as the delete modal just above,
          same zIndex so it layers above the preview overlay (2000) the
          same way. */}
      {showSaveConfirm && preview && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(10,22,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowSaveConfirm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 420, maxWidth: "calc(100vw - 32px)", background: "white", borderRadius: 16, padding: 24, boxShadow: "0 16px 48px rgba(10,22,41,0.25)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--tt-text-1)", margin: 0 }}>Save Report</p>
              <button
                onClick={() => setShowSaveConfirm(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tt-text-1)", padding: 4, display: "flex", borderRadius: 6, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <X size={20} strokeWidth={SW} className="tt-split-x" />
              </button>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-text-1)", lineHeight: 1.6, margin: "0 0 4px" }}>
              {preview.projectName || PROJECT_NAME}
            </p>
            <p style={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: "0 0 16px" }}>
              Update No. {preview.version} · {preview.period}
            </p>
            <p style={{ fontSize: 14, color: "var(--tt-text-2)", lineHeight: 1.6, margin: "0 0 24px" }}>
              Once saved, this report becomes read-only — to make changes, you'll need to generate a new one.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSaveConfirmed}
                style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "none", background: "var(--tt-text-1)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paywall — opened by handleDownload/handleCopy instead of actually
          downloading/copying, once the free report is used up (see
          `paywalled`). Defined once here rather than per call site since
          both the table row actions and the post-generate Preview
          overlay's own Download/Copy link route through those same two
          functions. */}
      {showPaywallModal && (
        <PaywallModal onClose={() => setShowPaywallModal(false)} />
      )}

      {lightbox && (
        <PhotoLightbox
          photos={lightbox.photos}
          index={lightbox.index}
          entryDate={lightbox.entryDate}
          taskName={lightbox.taskName}
          entryKey={lightbox.entryKey}
          originalIndices={lightbox.originalIndices}
          captions={preview.photoCaptions}
          onCaptionChange={previewSaved ? undefined : (idx, text) => setPhotoCaption(lightbox.entryKey, idx, text)}
          onIndexChange={i => setLightbox(lb => ({ ...lb, index: i }))}
          onClose={() => setLightbox(null)}
          onDownload={handlePreviewDownload}
          onCopyLink={handlePreviewCopy}
          linkCopied={previewCopied}
          actionsDisabled={previewLoading}
          locked={paywalled}
          onDeleteSelected={(indices) => {
            // originalIndices map filmstrip position -> this entry's real
            // photo index, so the exclusion lands on the same keys the
            // panel's own photo-select/delete already uses.
            const deletedOriginalIndices = indices.map(i => lightbox.originalIndices[i]);
            setPreview(p => ({
              ...p,
              excludedPhotos: {
                ...p.excludedPhotos,
                ...Object.fromEntries(deletedOriginalIndices.map(i => [`${lightbox.entryKey}_${i}`, true])),
              },
            }));
            // Deleting shouldn't close the whole lightbox out from under
            // the viewer — just drop the deleted photo(s) from its own
            // filmstrip and land on whichever neighbor slides into the
            // same position (clamped to the new last photo if the
            // deleted one was at the end), same "delete and move to the
            // next item" a photo manager is expected to do. Only actually
            // closes once every photo is gone.
            const deletedSet = new Set(indices);
            const remainingPhotos = lightbox.photos.filter((_, i) => !deletedSet.has(i));
            if (remainingPhotos.length === 0) {
              setLightbox(null);
            } else {
              const remainingOriginalIndices = lightbox.originalIndices.filter((_, i) => !deletedSet.has(i));
              setLightbox(lb => ({
                ...lb,
                photos: remainingPhotos,
                originalIndices: remainingOriginalIndices,
                index: Math.min(lb.index, remainingPhotos.length - 1),
              }));
            }
          }}
        />
      )}

      {photoManager && previewData && (
        <PhotoManagerModal
          groups={previewData.groups}
          excludedPhotos={preview.excludedPhotos}
          titleOverrides={titleOverrides}
          onSetPhotoExcluded={(entryKey, idx, excluded) => setPreview(p => ({ ...p, excludedPhotos: { ...p.excludedPhotos, [`${entryKey}_${idx}`]: excluded } }))}
          onPreviewPhoto={lb => setLightbox(lb)}
          previewActive={!!lightbox}
          onClose={() => setPhotoManager(false)}
        />
      )}
    </div>
  );
}

// ── Paywall ── Content only (crown badge/headline/copy/unlock list/CTA) —
// rendered inside PaywallModal below wherever Download/Copy link is
// gated (see ReportsTab's handleDownload/handleCopy). No padding/margin
// of its own; the modal shell supplies that, same "content vs. chrome"
// split every other modal in this file uses.
function ReportPaywall() {
  const unlockItems = [
    "Full report history across project",
    "Progress reports with task completion summary",
    "Photo updates grouped by week or month",
    "Shareable link for any period",
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: "var(--tt-mint)",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
      }}>
        <Crown size={26} color="var(--tt-secondary)" strokeWidth={SW} className="tt-split-crown" />
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--tt-text-1)", margin: "0 0 10px" }}>
        Send a Report, Not a Wall of Text
      </h3>
      <p style={{ fontSize: 14, color: "var(--tt-grey05)", lineHeight: 1.6, margin: "0 0 28px" }}>
        Generate a ready-to-share report from your activity log in seconds. Photos, progress, and notes — all in one place.
      </p>

      <div style={{ background: "var(--tt-grey02)", borderRadius: 12, padding: "20px 24px", textAlign: "left", margin: "0 0 24px" }}>
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
          width: "100%", height: 44, border: "none", borderRadius: 10,
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

// Modal shell around ReportPaywall — same chrome every other modal in this
// file uses (dark scrim, centered white card, close X top-right,
// backdrop-click-to-close), just without a title row (the crown badge and
// headline inside ReportPaywall already read as the modal's own header).
function PaywallModal({ onClose }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 6000, background: "rgba(10,22,41,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", width: 440, maxWidth: "calc(100vw - 32px)", background: "white", borderRadius: 16, padding: "32px 28px 28px", boxShadow: "0 16px 48px rgba(10,22,41,0.25)" }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "var(--tt-grey06)", padding: 4, display: "flex", borderRadius: 6, transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <X size={18} strokeWidth={SW} className="tt-split-x" />
        </button>
        <ReportPaywall />
      </div>
    </div>
  );
}

// ── Root ──
// ── Report Page (shared link view) ──
// Report content is fully reproducible from its URL params (dateRange,
// period, included sections, excluded photos, and any manually-added
// notes) — rebuilt on the fly rather than fetched from storage, so a
// shared link works on any device/browser and can never 404. Split out
// from ReportPage below so ReportPreviewChrome's own Download button can
// build the exact same HTML on demand (e.g. for a fresh preview tab)
// without duplicating this reconstruction logic a second time.
async function buildReportHTMLFromParams({ dateRange, period, version, includeSummary, includeNoPhotoTasks, notesParam, excludedParam, titlesParam, checklistsParam, captionsParam, projectName, address, logo, companyName, companyAddress, companyEmail, companyPhone, contactName, contactRole, contactPhoto, summaryText, clientName, additionalInfo, coverImage, missingImages, date }) {
  let data = buildReportData(dateRange, period, null, includeNoPhotoTasks);
  let groups = data.groups;
  // Always runs (even with nothing excluded) — this is what embeds each
  // entry's entryKey, which the caption lookup below (and this same call
  // everywhere else it's made) reads instead of a position recomputed
  // after titles/notes have reshuffled g.entries.
  const excludedPhotos = {};
  if (excludedParam) {
    try { JSON.parse(excludedParam).forEach(k => { excludedPhotos[k] = true; }); }
    catch { /* malformed/tampered param — ignore */ }
  }
  groups = applyPhotoExclusions(groups, excludedPhotos);
  if (titlesParam) {
    try {
      const titleOverrides = JSON.parse(titlesParam);
      groups = applyTitleOverrides(groups, titleOverrides);
    } catch { /* malformed/tampered param — ignore */ }
  }
  if (checklistsParam) {
    try {
      const checklistOverrides = JSON.parse(checklistsParam);
      groups = applyChecklistOverrides(groups, checklistOverrides);
    } catch { /* malformed/tampered param — ignore */ }
  }
  if (notesParam) {
    try {
      const extraNotes = JSON.parse(notesParam);
      groups = applyExtraNotesToGroups(groups, extraNotes);
    } catch { /* malformed/tampered param — ignore */ }
  }
  let photoCaptions;
  if (captionsParam) {
    try { photoCaptions = JSON.parse(captionsParam); }
    catch { /* malformed/tampered param — ignore */ }
  }
  data = { ...data, groups };
  // navItems — only ReportPreviewChrome's own sidebar reads this
  // (ReportPage's plain iframe render ignores it entirely). Grouped the
  // same general shape the draft's own sidebar uses (navGroups), but
  // Cover is a flat leaf here, not a group with Header/Content children
  // the way the draft's own sidebar splits it — unlike the draft, this
  // export's cover is one unified page/card, not two separate sections,
  // so there's nothing distinct to split into children. Summary is a
  // flat leaf too, Task List a group with one child per task. No Footer
  // entry — unlike the draft's own dedicated Footer section, this
  // export's footer repeats on every page (a running byline, not a
  // single addressable section), so there's no one place for a "Footer"
  // nav item to actually point at. Every id here has to match an
  // id="..." buildReportHTML actually puts in the HTML, or a click would
  // have nothing to scroll to.
  const navItems = [
    { type: "leaf", id: "report-cover", label: "Cover", icon: "cover" },
  ];
  if (summaryText) navItems.push({ type: "leaf", id: "report-summary", label: "Summary", icon: "summary" });
  // groupLabel (week/month only — day grouping has none, same as the
  // draft's own sidebar) rides on the first task of each group, so the
  // sidebar can draw a divider above it, e.g. "September 2026".
  const taskChildren = [];
  groups.forEach(g => {
    let firstInGroup = true;
    g.entries.forEach(e => {
      if (e.isNote) return;
      taskChildren.push({
        id: `report-task-${e.entryKey}`,
        label: e.note,
        groupLabel: firstInGroup && data.grouping !== "day" ? formatGroupLabel(g, data.grouping) : null,
      });
      firstInGroup = false;
    });
  });
  if (taskChildren.length > 0) navItems.push({ type: "group", label: "Task List", icon: "task", children: taskChildren });
  const html = await buildReportHTML({ includeSummary, period, version, data, projectName, address, logo, companyName, companyAddress, companyEmail, companyPhone, contactName, contactRole, contactPhoto, summary: summaryText, clientName, additionalInfo, coverImage, missingImages, photoCaptions, date });
  return { html, navItems };
}

// Plain shared-link render — what an actual recipient sees, unchanged:
// no chrome, no nav, just the document full-screen. ReportPreviewChrome
// (the owner's own Preview tab) doesn't use this — it needs a direct ref
// to the iframe for its own sidebar nav to scroll, so it fetches
// html/navItems and renders its own iframe instead (see below).
function ReportPage(props) {
  // buildReportHTMLFromParams is async (it preloads each photo's real
  // dimensions before laying out the justified photo rows — see
  // loadImageDims), so the shared-link recipient's own render has to
  // wait for it too, same as Download/Copy link do.
  const [html, setHtml] = useState(null);
  useEffect(() => {
    let cancelled = false;
    buildReportHTMLFromParams(props).then(result => {
      if (!cancelled) setHtml(result.html);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (html === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--tt-grey02)" }}>
        <Loader size={24} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-loader" style={{ display: "block", animation: "tt-spin 0.75s linear infinite" }} />
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      title="Report"
      style={{ border: "none", width: "100%", height: "100vh", display: "block" }}
    />
  );
}

// ── Report Preview Chrome (owner's own "Preview" tab) ──
// Same document a copied link renders, just with the owner-only chrome a
// real recipient never sees: a top bar (Period/Generation date left,
// Download/Copy link right) and a left sidebar nav (Cover/Summary/one
// per task — see navItems), same visual language and layout shape as the
// draft modal's own sidebar+chrome (NAV_W-ish rail, chrome bar centered
// to the sidebar+document width together). Fetches html/navItems itself
// and renders its own iframe (with a ref) rather than delegating to
// ReportPage — it needs direct access to the iframe's contentDocument to
// scroll a clicked nav item into view, and reusing ReportPage would mean
// either threading a ref through it for no other reason or fetching the
// same html twice.
function ReportPreviewChrome({ reportPageProps, period, dateLabel, paywalled }) {
  const [html, setHtml] = useState(null);
  const [navItems, setNavItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const iframeRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  // This is a fresh tab/mount (see handlePreviewOpen) with no access to
  // ReportsTab's own `paywalled` state or its PaywallModal — `paywalled`
  // instead rides along via the ?paywall=1 param (see buildShareURL), and
  // this is its own copy of the same lock, so Download/Copy link read the
  // same here as they did in the owner's own Preview tab/table.
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    buildReportHTMLFromParams(reportPageProps).then(result => {
      if (!cancelled) { setHtml(result.html); setNavItems(result.navItems); }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async () => {
    if (paywalled) { setShowPaywallModal(true); return; }
    // html is already sitting in state from the fetch above — no need to
    // rebuild it a second time just for the file, unlike before this had
    // its own ref/nav (when this and ReportPage's own fetch were two
    // fully independent builds).
    if (downloading || html === null) return;
    setDownloading(true);
    const fileName = "report_" + sanitizePeriodForUrl(period) + ".html";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const handleCopyLink = async () => {
    if (paywalled) { setShowPaywallModal(true); return; }
    // The plain shareable link, not this preview tab's own URL — a
    // recipient of this link is meant to see the bare document (what
    // ReportPage renders on its own), never this owner-only chrome.
    const clean = new URL(window.location.href);
    clean.searchParams.delete("preview");
    clean.searchParams.delete("date");
    clean.searchParams.delete("pid");
    const url = clean.toString();
    try { await navigator.clipboard.writeText(url); }
    catch {
      const el = document.createElement("textarea");
      el.value = url; el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // srcDoc content is same-origin, so contentDocument is reachable
  // directly — no postMessage/cross-origin dance needed to scroll into
  // it from out here.
  const scrollToSection = (id) => {
    iframeRef.current?.contentDocument?.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll-spy, same rule as draft mode's updateActiveSection: the last
  // section (in document order, which is also nav order) whose top has
  // reached the top of the scroll viewport is the active one. Driven
  // purely by scroll — clicking a nav item just scrolls, and the scroll
  // event then sets it — so click and manual scrolling can't disagree.
  // The scroll listener lives on the iframe's own window (that's what
  // actually scrolls), attached from onLoad since srcDoc's document
  // doesn't exist until then. 2px tolerance for sub-pixel rounding.
  const navIds = navItems.flatMap(item => item.type === "group" ? item.children.map(c => c.id) : [item.id]);
  const navIdsRef = useRef([]);
  navIdsRef.current = navIds;
  const updateActiveFromScroll = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    let current = navIdsRef.current[0] || null;
    for (const id of navIdsRef.current) {
      const el = doc.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 2) current = id;
    }
    setActiveId(current);
  };
  const handleIframeLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    updateActiveFromScroll();
  };

  const btnStyle = { height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 14px", borderRadius: 8, border: "1px solid var(--tt-grey03)", background: "white", fontSize: 13, fontWeight: 500, color: "var(--tt-text-2)", cursor: "pointer", transition: "background 0.15s" };

  // Same NAV_W as the draft modal (the chrome bar centers to sidebar +
  // document width combined), and the same module-level CONTENT_BUFFER
  // draft mode's own row uses — it has to exactly match the iframe's own
  // fixed width below (PAGE_W + CONTENT_BUFFER, the export's own
  // PAGE_GUTTER/SCROLLBAR_W body padding — see buildReportHTML's css), or
  // the content column's flex-allotted share of previewRowW would come
  // out narrower than the iframe actually needs and the iframe would
  // overflow it instead of fitting exactly flush.
  const previewRowW = NAV_W + PAGE_W + CONTENT_BUFFER;

  // navItems' shape (string icon names, id) mapped to what the shared
  // NavSidebar takes (icon components, key) — the same component the draft
  // modal renders, so the two can't look different.
  const iconFor = name => (name === "summary" ? AlignJustify : name === "task" ? Hash : FileText);
  const sidebarItems = navItems.map(item => item.type === "group"
    ? { type: "group", label: item.label, icon: iconFor(item.icon), children: item.children.map(c => ({ key: c.id, label: c.label, groupLabel: c.groupLabel })) }
    : { type: "leaf", key: item.id, label: item.label, icon: iconFor(item.icon) });

  return (
    <div className="font-sans text-[var(--tt-text-1)] text-[14px] leading-[1.5]" style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--tt-grey02)" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--tt-grey03)", background: "white", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: previewRowW, width: "100%", margin: "0 auto" }}>
          {/* Logo only now — the period/"Generated ..." line that used to
              sit beside it was removed from this chrome. Still left-aligned
              to match the sidebar's own icon column below
              (NAV_SIDEBAR_ICON_INSET — its own padding + each row's own
              left padding, see NavSidebar) rather than centered over the
              NAV_W column — reads as lining up with the nav rail's content,
              not just sitting somewhere inside its width. */}
          <div style={{ width: NAV_W, flexShrink: 0, display: "flex", paddingLeft: NAV_SIDEBAR_ICON_INSET }}>
            <img src={IMG_MAP_LOGO} alt="TaskTag" style={{ height: 40, width: "auto" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              disabled={downloading}
              onClick={handleDownload}
              onMouseEnter={e => !downloading && (e.currentTarget.style.background = "var(--tt-grey02)")}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
              style={{ ...btnStyle, cursor: downloading ? "not-allowed" : "pointer", opacity: downloading ? 0.5 : 1 }}
            >
              <LockedIcon locked={paywalled}><Download size={14} strokeWidth={SW} className="tt-split-download" /></LockedIcon> Download
            </button>
            <button
              onClick={handleCopyLink}
              onMouseEnter={e => e.currentTarget.style.background = "var(--tt-grey02)"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
              style={btnStyle}
            >
              {copied ? <><Check size={14} strokeWidth={SW} /> Link copied</> : <><LockedIcon locked={paywalled}><Link size={14} strokeWidth={SW} /></LockedIcon> Copy link</>}
            </button>
          </div>
        </div>
      </div>
      {showPaywallModal && (
        <PaywallModal onClose={() => setShowPaywallModal(false)} />
      )}
      {/* Same maxWidth/margin:auto as the header bar above (previewRowW,
          shared) — same "chrome and body row centered to the identical
          width" fix draft mode's own sidebar+document needed (see
          ReportsTab's ROW_W comment): without this, sidebar+iframe fill
          the full viewport, piling everything up against the left edge
          instead of balancing evenly on both sides once the window's
          wider than the content actually needs. Sidebar and iframe still
          sit flush against each other either way — this only centers
          that combined unit as a whole, it doesn't add space between
          them. */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, maxWidth: previewRowW, width: "100%", margin: "0 auto" }}>
        {navItems.length > 0 && (
          // Grouped the same shape/style as the draft modal's own sidebar
          // (navGroups) — Cover/Task List as bold, non-clickable group
          // headings with an indented connector-rail of children below
          // them, Summary as a flat leaf at the same top-level weight —
          // see buildReportHTMLFromParams' own navItems comment for why
          // the shape matches but Footer doesn't appear here at all.
          <NavSidebar items={sidebarItems} activeKey={activeId} onSelect={scrollToSection} />
        )}
        {/* background here (not just on the loader) — a fixed-width iframe
            below no longer fills this whole column, so whatever's left
            over to its right needs to read as the same page background
            the sidebar/loader already use, not blank white. */}
        <div style={{ flex: 1, minWidth: 0, background: "var(--tt-grey02)" }}>
          {html === null ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Loader size={24} strokeWidth={SW} color="var(--tt-grey05)" className="tt-split-loader" style={{ display: "block", animation: "tt-spin 0.75s linear infinite" }} />
            </div>
          ) : (
            // Fixed width (PAGE_W + the export's own PAGE_GUTTER body
            // padding on each side — see buildReportHTML's own
            // `body{padding:${PAGE_GUTTER}px}`), not width:"100%" — the
            // exported document centers its own 800px card within
            // whatever width the iframe gives it, so a full-width iframe
            // here left a wide gap between the sidebar and the card
            // instead of floating it in the same PAGE_GUTTER frame draft
            // mode's own document uses. Flush left by default (no
            // margin) — the card's own left gutter comes from the
            // iframe's internal body padding, not from margin out here.
            <iframe
              ref={iframeRef}
              srcDoc={html}
              onLoad={handleIframeLoad}
              title="Report"
              style={{ border: "none", width: PAGE_W + CONTENT_BUFFER, height: "100%", display: "block" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}


export default function ProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const sharedPeriodRaw = params.get("period");
  const sharedPeriod = sharedPeriodRaw ? desanitizePeriodFromUrl(sharedPeriodRaw) : sharedPeriodRaw;
  if (sharedPeriod) {
    // Only an owner's own Preview tab carries pid (see handlePreviewOpen)
    // — the heavy data-URL images the URL itself can't hold. A real shared
    // link never has it, so its logo/avatar/uploaded cover stay off, same
    // as before.
    let handedOff = {};
    if (params.get("preview") === "1" && params.get("pid")) {
      try { handedOff = JSON.parse(localStorage.getItem(`tt-preview-assets-${params.get("pid")}`)) || {}; }
      catch { /* missing/corrupt — fall back to URL-only */ }
    }
    const reportPageProps = {
      dateRange: params.get("range"),
      period: sharedPeriod,
      version: params.get("version"),
      includeSummary: params.get("summary") !== "0",
      includeNoPhotoTasks: params.get("nophotos") !== "0",
      notesParam: params.get("notes"),
      excludedParam: params.get("excluded"),
      titlesParam: params.get("titles"),
      checklistsParam: params.get("checklists"),
      captionsParam: params.get("captions"),
      projectName: params.get("projectName"),
      address: params.get("address"),
      logo: handedOff.logo || params.get("logo"),
      contactPhoto: handedOff.contactPhoto || null,
      companyName: params.get("companyName"),
      companyAddress: params.get("companyAddress"),
      companyEmail: params.get("companyEmail"),
      companyPhone: params.get("companyPhone"),
      contactName: params.get("contactName"),
      contactRole: params.get("contactRole"),
      summaryText: params.get("summaryText"),
      clientName: params.get("clientName"),
      additionalInfo: params.get("additionalInfo"),
      coverImage: handedOff.coverImage || params.get("coverImage"),
      missingImages: (params.get("missing") || "").split(",").filter(Boolean),
      date: params.get("date"),
    };
    // preview=1 (see handlePreviewOpen) — only ever set by the report's
    // own owner opening the Preview action, never present on a link
    // actually meant to be shared, which renders ReportPage bare exactly
    // as it always has.
    if (params.get("preview") === "1") {
      return <ReportPreviewChrome reportPageProps={reportPageProps} period={sharedPeriod} dateLabel={params.get("date")} paywalled={params.get("paywall") === "1"} />;
    }
    return <ReportPage {...reportPageProps} />;
  }

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
                <MoreVertical size={16} strokeWidth={SW} className="tt-split-morevertical" />
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-[2px]">
              <span className="flex items-center gap-1 text-[12px] text-[var(--tt-grey05)]">
                <LayoutGrid size={11} strokeWidth={SW} className="tt-split-layoutgrid" /> Personal Projects
              </span>
              <span className="flex items-center gap-1 text-[12px] text-[var(--tt-grey05)]">
                <MapPin size={11} strokeWidth={SW} className="tt-split-mappin" /> {PROJECT_ADDRESS}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-[var(--tt-text-2)] hover:bg-[var(--tt-grey02)]" style={{ borderRadius: 12 }}>
            <Search size={16} strokeWidth={SW} className="tt-split-search" />
          </Button>
          <Button className="gap-2 bg-[var(--tt-text-1)] hover:bg-black text-white text-[14px] font-medium h-9 px-4 !rounded-xl">
            <Plus size={16} strokeWidth={SW} className="tt-split-plus" /> New Task
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
              <Clock size={18} color="var(--tt-secondary)" strokeWidth={SW} className="tt-split-clock" />
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
            <Clock size={14} strokeWidth={SW} color="var(--tt-text-2)" className="tt-split-clock" />
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
            // Active-state styling (light mint background, no underline)
            // lives in the global [data-radix-collection-item]
            // [data-state="active"] rule up top, not here — that rule's
            // !important declarations would silently beat any inline
            // style on this element anyway.
            return (
              <TabsTrigger key={id} value={id} className="flex items-center gap-2">
                <Icon
                  size={16}
                  strokeWidth={SW}
                  color={active ? "var(--tt-secondary)" : "var(--tt-grey06)"}
                  className={iconSplitClassFor(Icon)}
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
              <Link size={16} strokeWidth={SW} className="tt-split-link" />
            </Button>
            <Button
              variant="outline" size="sm"
              className="gap-2 h-8 px-4 text-[13px] font-medium bg-white"
              style={{ color: "var(--tt-text-1)", borderColor: "var(--tt-text-1)", borderWidth: "1.5px", borderRadius: "9999px" }}
            >
              <UserPlus size={14} strokeWidth={SW} className="tt-split-userplus" />
              Invite
            </Button>
          </div>
        </TabsList>

        <TabsContent value="tasks"     className="mt-0 px-4" style={{ paddingTop: 16 }} />
        <TabsContent value="reports"   className="mt-0 px-4" style={{ paddingTop: 16 }}>
          {/* "Paywall" no longer swaps out the whole tab for a static
              mockup — ReportsTab itself now simulates the free-tier gate
              inline (empty-state copy, and the PaywallModal that
              handleDownload/handleCopy open) whenever demoCase is
              "paywall", so the real table/Generate flow stays usable
              right alongside it. */}
          <ReportsTab key={demoCase} demoCase={demoCase} />
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
