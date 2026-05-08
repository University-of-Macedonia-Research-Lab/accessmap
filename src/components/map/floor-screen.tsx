"use client";

/**
 * Floor demo screen.
 *
 * Layout: the map fills the entire main area. A single floating "command
 * dock" overlays the map with six numbered chips (01 Plan, 02 Profile, 03
 * Floor, 04 View, 05 Assistant, 06 Info) — the same numbered structure the
 * home page uses, applied to the demo's actual controls. Tap a chip and a
 * panel expands beneath the dock with that section's content.
 *
 * The dock is the same component on mobile and desktop; only its anchor
 * changes — bottom-pinned on small screens, floating top-left on md+.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Compass,
  Eye,
  Info,
  Layers,
  MessageCircle,
  Route,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FloorMap } from "./floor-map";
import { AssistantPanel } from "./assistant-panel";
import { PROFILES, type Profile } from "@/lib/map/pathfind";
import {
  findMultiFloorRouteBetweenRooms,
  type MultiFloorPath,
} from "@/lib/map/multi-pathfind";
import type { FloorMap as FloorMapData } from "@/lib/map/schema";
import { useLang, type Lang } from "@/lib/i18n";

const PROFILE_LIST = Object.values(PROFILES);

type Props = {
  buildingSlug: string;
  floors: FloorMapData[];
  currentFloorSlug: string;
};

type RoomRef = { floor: string; room: string };

type SectionId = "plan" | "profile" | "floor" | "view" | "assistant" | "info";

type SectionMeta = {
  id: SectionId;
  n: string;
  icon: React.ReactNode;
  topicEn: string;
  topicEl: string;
};

const SECTIONS: SectionMeta[] = [
  { id: "plan", n: "01", icon: <Route className="h-4 w-4" />, topicEn: "Plan", topicEl: "Σχεδιασμός" },
  { id: "profile", n: "02", icon: <Compass className="h-4 w-4" />, topicEn: "Profile", topicEl: "Προφίλ" },
  { id: "floor", n: "03", icon: <Layers className="h-4 w-4" />, topicEn: "Floor", topicEl: "Όροφος" },
  { id: "view", n: "04", icon: <Eye className="h-4 w-4" />, topicEn: "View", topicEl: "Εμφάνιση" },
  { id: "assistant", n: "05", icon: <MessageCircle className="h-4 w-4" />, topicEn: "Assistant", topicEl: "Βοηθός" },
  { id: "info", n: "06", icon: <Info className="h-4 w-4" />, topicEn: "Info", topicEl: "Στοιχεία" },
];

function profileLabel(p: Profile, lang: Lang): string {
  return lang === "el" ? p.labelEl : p.label;
}

function prettyBuildingName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function FloorScreen({ buildingSlug, floors, currentFloorSlug }: Props) {
  const { lang } = useLang();
  const currentFloor =
    floors.find((f) => f.floorSlug === currentFloorSlug) ?? floors[0];

  const allRoomOptions = useMemo(
    () =>
      floors.flatMap((f) =>
        f.rooms
          .filter((r) => r.kind !== "corridor")
          .map((r) => ({
            value: `${f.floorSlug}|${r.id}`,
            floor: f.floorSlug,
            room: r.id,
            label: r.code ? `${r.code} · ${r.name[lang]}` : r.name[lang],
            floorName: f.name[lang],
          })),
      ),
    [floors, lang],
  );

  const defaultFrom: RoomRef = useMemo(() => {
    const entrance = floors.flatMap((f) =>
      f.rooms.filter((r) => r.kind === "entrance").map((r) => ({ floor: f.floorSlug, room: r.id })),
    )[0];
    if (entrance) return entrance;
    const first = allRoomOptions[0];
    return first ? { floor: first.floor, room: first.room } : { floor: currentFloorSlug, room: "" };
  }, [floors, allRoomOptions, currentFloorSlug]);

  const defaultTo: RoomRef = useMemo(() => {
    const onCurrent = allRoomOptions.find(
      (o) =>
        o.floor === currentFloorSlug &&
        !(o.floor === defaultFrom.floor && o.room === defaultFrom.room),
    );
    if (onCurrent) return { floor: onCurrent.floor, room: onCurrent.room };
    const any = allRoomOptions.find(
      (o) => !(o.floor === defaultFrom.floor && o.room === defaultFrom.room),
    );
    return any ? { floor: any.floor, room: any.room } : defaultFrom;
  }, [allRoomOptions, currentFloorSlug, defaultFrom]);

  const [fromRef, setFromRefState] = useState<RoomRef>(defaultFrom);
  const [toRef, setToRefState] = useState<RoomRef>(defaultTo);
  const [profileId, setProfileIdState] = useState<string>("default");
  const [showGraph, setShowGraph] = useState(false);
  const [aiPath, setAiPath] = useState<MultiFloorPath | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId | null>("plan");

  const setFromRef = (v: RoomRef) => {
    setFromRefState(v);
    setAiPath(null);
  };
  const setToRef = (v: RoomRef) => {
    setToRefState(v);
    setAiPath(null);
  };
  const setProfileId = (v: string) => {
    setProfileIdState(v);
    setAiPath(null);
  };

  const profile: Profile = PROFILES[profileId] ?? PROFILES.default;

  const manualPath = useMemo(() => {
    if (!fromRef.room || !toRef.room) return null;
    if (fromRef.floor === toRef.floor && fromRef.room === toRef.room) return null;
    return findMultiFloorRouteBetweenRooms(floors, fromRef, toRef, profile);
  }, [floors, fromRef, toRef, profile]);

  const activePath: MultiFloorPath | null = aiPath ?? manualPath;
  const currentSegmentNodes = useMemo(() => {
    if (!activePath) return undefined;
    const segs = activePath.segments.filter(
      (s) => s.floorSlug === currentFloorSlug,
    );
    if (segs.length === 0) return undefined;
    return segs.flatMap((s) => s.nodes);
  }, [activePath, currentFloorSlug]);

  return (
    <AppShell
      headerSlot={
        <span className="text-[color:var(--muted-foreground)]">
          {prettyBuildingName(buildingSlug)} · {currentFloor.name[lang]}
        </span>
      }
    >
      <FloorMap
        map={currentFloor}
        showGraph={showGraph}
        highlightedRoute={currentSegmentNodes}
        lang={lang}
      />

      <Dock
        lang={lang}
        active={activeSection}
        onSelect={(id) =>
          setActiveSection((cur) => (cur === id ? null : id))
        }
        onClose={() => setActiveSection(null)}
        summary={
          activePath ? (
            <RouteSummaryStrip
              activePath={activePath}
              aiAuthored={Boolean(aiPath)}
              profile={profile}
              lang={lang}
              currentFloorSlug={currentFloorSlug}
              floors={floors}
              buildingSlug={buildingSlug}
            />
          ) : null
        }
      >
        {activeSection === "plan" && (
          <PlanPanel
            lang={lang}
            fromRef={fromRef}
            toRef={toRef}
            options={allRoomOptions}
            onFromChange={setFromRef}
            onToChange={setToRef}
            onSwap={() => {
              setFromRefState(toRef);
              setToRefState(fromRef);
              setAiPath(null);
            }}
          />
        )}
        {activeSection === "profile" && (
          <ProfilePanel
            lang={lang}
            profileId={profileId}
            onSelect={setProfileId}
          />
        )}
        {activeSection === "floor" && (
          <FloorPanel
            lang={lang}
            buildingSlug={buildingSlug}
            floors={floors}
            currentFloorSlug={currentFloorSlug}
          />
        )}
        {activeSection === "view" && (
          <ViewPanel
            lang={lang}
            showGraph={showGraph}
            onShowGraphChange={setShowGraph}
          />
        )}
        {activeSection === "assistant" && (
          <AssistantPanel
            building={buildingSlug}
            floor={currentFloorSlug}
            onRoute={(path) => {
              setAiPath(path);
            }}
          />
        )}
        {activeSection === "info" && (
          <InfoPanel
            lang={lang}
            buildingSlug={buildingSlug}
            currentFloor={currentFloor}
          />
        )}
      </Dock>
    </AppShell>
  );
}

/* ─── Dock shell ──────────────────────────────────────────────────────────── */

function Dock({
  lang,
  active,
  onSelect,
  onClose,
  summary,
  children,
}: {
  lang: Lang;
  active: SectionId | null;
  onSelect: (id: SectionId) => void;
  onClose: () => void;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  const isEl = lang === "el";
  const activeMeta = active ? SECTIONS.find((s) => s.id === active) : null;
  return (
    <div
      role="region"
      aria-label={isEl ? "Έλεγχοι χάρτη" : "Map controls"}
      className={
        // Mobile: pinned to the bottom, full-width-ish.
        // md+: floats top-left of the map area, fixed width.
        "pointer-events-none absolute z-20 " +
        "inset-x-3 bottom-3 " +
        "md:inset-auto md:bottom-auto md:left-4 md:top-4 md:w-[400px]"
      }
    >
      <div
        className={
          "pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] " +
          "bg-[var(--background)]/92 shadow-[var(--shadow-card)] backdrop-blur-md"
        }
      >
        {summary && (
          <div className="border-b border-[var(--border)]">{summary}</div>
        )}

        {/* Chip row */}
        <div className="flex items-center gap-1 p-1.5 sm:gap-1.5 sm:p-2">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            const topic = isEl ? s.topicEl : s.topicEn;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={isActive}
                aria-label={`${s.n} · ${topic}`}
                title={`${s.n} · ${topic}`}
                className={
                  "group relative flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-[0.7rem] font-semibold transition-colors " +
                  (isActive
                    ? "bg-[var(--brand)] text-white"
                    : "text-[color:var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[color:var(--foreground)]")
                }
              >
                <span className="font-mono tabular-nums opacity-80">{s.n}</span>
                {s.icon}
              </button>
            );
          })}
        </div>

        {/* Expanded panel */}
        {active && activeMeta && (
          <div className="flex max-h-[60vh] flex-col gap-3 border-t border-[var(--border)] p-4 md:max-h-[70vh]">
            <div className="flex items-start justify-between gap-3">
              <PanelHeader n={activeMeta.n} topic={isEl ? activeMeta.topicEl : activeMeta.topicEn} />
              <button
                type="button"
                onClick={onClose}
                aria-label={isEl ? "Κλείσιμο" : "Close"}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[color:var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[color:var(--foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelHeader({ n, topic }: { n: string; topic: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        aria-hidden
        className="font-mono text-[1.6rem] font-bold leading-none tabular-nums tracking-[-0.04em]"
        style={{ color: "var(--brand)" }}
      >
        {n}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-overline text-[color:var(--brand)]">{topic}</span>
        <span
          aria-hidden
          className="h-px w-16"
          style={{
            background:
              "linear-gradient(to right, var(--brand) 0%, transparent 100%)",
            opacity: 0.5,
          }}
        />
      </span>
    </div>
  );
}

/* ─── Persistent route summary (above the chip row) ───────────────────────── */

function RouteSummaryStrip({
  activePath,
  aiAuthored,
  profile,
  lang,
  currentFloorSlug,
  floors,
  buildingSlug,
}: {
  activePath: MultiFloorPath;
  aiAuthored: boolean;
  profile: Profile;
  lang: Lang;
  currentFloorSlug: string;
  floors: FloorMapData[];
  buildingSlug: string;
}) {
  const isEl = lang === "el";
  const totalSegments = activePath.segments.reduce(
    (n, s) => n + Math.max(0, s.nodes.length - 1),
    0,
  );
  const onCurrent = activePath.segments.find(
    (s) => s.floorSlug === currentFloorSlug,
  );
  const otherFloors = activePath.segments.filter(
    (s) => s.floorSlug !== currentFloorSlug,
  );
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-caption">
        <span
          className={
            "font-semibold " +
            (aiAuthored ? "text-[color:var(--brand)]" : "text-[color:var(--foreground)]")
          }
        >
          {profileLabel(profile, lang)}
        </span>
        <span className="text-[color:var(--muted-foreground)]">
          · {totalSegments} {isEl ? "τμήματα" : "segments"} · {isEl ? "κόστος" : "cost"}{" "}
          {activePath.cost.toFixed(1)}
        </span>
      </div>
      {!onCurrent && otherFloors.length > 0 && (
        <p className="text-[0.78rem] text-[color:color-mix(in_oklab,var(--warning),#000_15%)]">
          {isEl
            ? "Αυτή η διαδρομή δεν περνά από αυτόν τον όροφο."
            : "This route doesn't pass through this floor."}
        </p>
      )}
      {otherFloors.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {otherFloors.map((seg) => {
            const f = floors.find((f) => f.floorSlug === seg.floorSlug);
            if (!f) return null;
            const above =
              (f.level ?? 0) >
              (floors.find((x) => x.floorSlug === currentFloorSlug)?.level ?? 0);
            return (
              <li key={seg.floorSlug}>
                <Link
                  href={`/maps/${buildingSlug}/${seg.floorSlug}`}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[0.72rem] text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
                >
                  {above ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {f.name[lang]}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─── Section panels ──────────────────────────────────────────────────────── */

function PlanPanel({
  lang,
  fromRef,
  toRef,
  options,
  onFromChange,
  onToChange,
  onSwap,
}: {
  lang: Lang;
  fromRef: RoomRef;
  toRef: RoomRef;
  options: RoomOption[];
  onFromChange: (v: RoomRef) => void;
  onToChange: (v: RoomRef) => void;
  onSwap: () => void;
}) {
  const isEl = lang === "el";
  return (
    <div className="flex flex-col gap-3">
      <Field label={isEl ? "Από" : "From"}>
        <RoomSelect value={fromRef} options={options} onChange={onFromChange} />
      </Field>
      <Field label={isEl ? "Προς" : "To"}>
        <RoomSelect value={toRef} options={options} onChange={onToChange} />
      </Field>
      <button
        type="button"
        onClick={onSwap}
        className="self-start rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
      >
        {isEl ? "Αντιστροφή" : "Swap"}
      </button>
    </div>
  );
}

type RoomOption = {
  value: string;
  floor: string;
  room: string;
  label: string;
  floorName: string;
};

function ProfilePanel({
  lang,
  profileId,
  onSelect,
}: {
  lang: Lang;
  profileId: string;
  onSelect: (id: string) => void;
}) {
  const isEl = lang === "el";
  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption">
        {isEl
          ? "Το ίδιο γράφημα, διαφορετικά βάρη ανά προφίλ."
          : "Same graph, different weights per profile."}
      </p>
      <div className="flex flex-col gap-1.5">
        {PROFILE_LIST.map((p) => {
          const isActive = p.id === profileId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={
                "flex items-center justify-between rounded-md border px-3 py-2 text-left text-body transition-colors " +
                (isActive
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[color:var(--foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-2)]")
              }
            >
              <span className="font-medium">{profileLabel(p, lang)}</span>
              {isActive && (
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--brand)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FloorPanel({
  lang,
  buildingSlug,
  floors,
  currentFloorSlug,
}: {
  lang: Lang;
  buildingSlug: string;
  floors: FloorMapData[];
  currentFloorSlug: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {floors.map((f) => {
        const active = f.floorSlug === currentFloorSlug;
        return (
          <Link
            key={f.floorSlug}
            href={`/maps/${buildingSlug}/${f.floorSlug}`}
            className={
              "flex items-center gap-3 rounded-md border px-3 py-2 text-body transition-colors " +
              (active
                ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[color:var(--foreground)]"
                : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-2)]")
            }
          >
            <span
              className={
                "grid h-7 w-9 place-items-center rounded-md font-mono text-[0.72rem] tabular-nums " +
                (active
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--surface-2)] text-[color:var(--muted-foreground)]")
              }
            >
              L{f.level}
            </span>
            <span className="flex-1 font-medium">{f.name[lang]}</span>
            <span className="text-caption">
              {f.rooms.length} {lang === "el" ? "δωμάτια" : "rooms"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function ViewPanel({
  lang,
  showGraph,
  onShowGraphChange,
}: {
  lang: Lang;
  showGraph: boolean;
  onShowGraphChange: (v: boolean) => void;
}) {
  const isEl = lang === "el";
  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption">
        {isEl
          ? "Επιλογές οπτικοποίησης για διδακτική χρήση."
          : "Visualization options for teaching demos."}
      </p>
      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 hover:bg-[var(--surface-2)]">
        <input
          type="checkbox"
          checked={showGraph}
          onChange={(e) => onShowGraphChange(e.target.checked)}
          className="h-4 w-4 accent-[var(--brand)]"
        />
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-body font-medium">
            {isEl ? "Εμφάνιση γραφήματος δρομολόγησης" : "Show routing graph"}
          </span>
          <span className="text-caption">
            {isEl
              ? "Επικάλυψη κόμβων και ακμών πάνω στην κάτοψη."
              : "Overlay nodes and edges over the floor plan."}
          </span>
        </span>
      </label>
    </div>
  );
}

function InfoPanel({
  lang,
  buildingSlug,
  currentFloor,
}: {
  lang: Lang;
  buildingSlug: string;
  currentFloor: FloorMapData;
}) {
  const isEl = lang === "el";
  const stats: Array<[string, string | number]> = [
    [isEl ? "Κτίριο" : "Building", prettyBuildingName(buildingSlug)],
    [isEl ? "Όροφος" : "Floor", currentFloor.name[lang]],
    [isEl ? "Επίπεδο" : "Level", currentFloor.level],
    [isEl ? "Δωμάτια" : "Rooms", currentFloor.rooms.length],
    [isEl ? "Πόρτες" : "Doors", currentFloor.doors.length],
    [isEl ? "Κόμβοι γραφήματος" : "Graph nodes", currentFloor.nodes.length],
    [isEl ? "Ακμές γραφήματος" : "Graph edges", currentFloor.edges.length],
  ];
  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-caption">
        {stats.map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <dt className="text-overline">{k}</dt>
            <dd className="text-body text-[color:var(--foreground)]">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-1.5 text-caption">
        <Link
          href="/about"
          className="font-medium text-[color:var(--brand)] hover:underline"
        >
          {isEl ? "Πώς λειτουργεί;" : "How does this work?"} →
        </Link>
        <Link
          href="/"
          className="font-medium text-[color:var(--brand)] hover:underline"
        >
          {isEl ? "Επιστροφή στην αρχική" : "Back to the landing"} →
        </Link>
      </div>
    </div>
  );
}

/* ─── Shared form primitives ──────────────────────────────────────────────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-overline">{label}</span>
      {children}
    </label>
  );
}

function RoomSelect({
  value,
  onChange,
  options,
}: {
  value: RoomRef;
  onChange: (v: RoomRef) => void;
  options: RoomOption[];
}) {
  const byFloor = useMemo(() => {
    const m = new Map<string, { floorName: string; opts: RoomOption[] }>();
    for (const o of options) {
      const e = m.get(o.floor);
      if (e) e.opts.push(o);
      else m.set(o.floor, { floorName: o.floorName, opts: [o] });
    }
    return Array.from(m.entries());
  }, [options]);

  const currentValue = `${value.floor}|${value.room}`;

  return (
    <select
      value={currentValue}
      onChange={(e) => {
        const [floor, ...rest] = e.target.value.split("|");
        onChange({ floor, room: rest.join("|") });
      }}
      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-body shadow-sm focus:border-[var(--brand)] focus:outline-none"
    >
      {byFloor.map(([floorSlug, { floorName, opts }]) => (
        <optgroup key={floorSlug} label={floorName}>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
