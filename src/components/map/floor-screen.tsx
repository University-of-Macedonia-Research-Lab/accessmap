"use client";

/**
 * Floor demo screen.
 *
 * Layout: a real left sidebar (via AppShell.sidebar) holds the controls
 * and the map fills the rest of the viewport. Sidebar surface matches
 * the map's so the panel reads as part of the same canvas.
 *
 * Sidebar UX is two tabs:
 *   - Explore — read the map: floor switcher, display toggles, stats.
 *   - Navigate — go somewhere: pick a profile + From/To (or ask the
 *                assistant), then transition to a step-by-step
 *                directions view. "Back" returns to the settings.
 *
 * The directions list in this commit is a deliberate stub — it walks
 * the multi-floor path and emits a step for each meaningful waypoint
 * (start, room arrivals, elevator/stairs, floor changes, end). Phase 2
 * will replace it with a real turn-by-turn synthesiser.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CornerRightDown,
  Eye,
  Info,
  MapPin,
  Navigation,
  Compass as CompassIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FloorMap } from "./floor-map";
import { AssistantPanel } from "./assistant-panel";
import { PROFILES, type Profile } from "@/lib/map/pathfind";
import {
  findMultiFloorRouteBetweenRooms,
  type MultiFloorPath,
} from "@/lib/map/multi-pathfind";
import type {
  AccessibilityFeature,
  FloorMap as FloorMapData,
  GraphNode,
} from "@/lib/map/schema";
import { useLang, type Lang } from "@/lib/i18n";

const PROFILE_LIST = Object.values(PROFILES);

type Props = {
  buildingSlug: string;
  floors: FloorMapData[];
  currentFloorSlug: string;
};

type RoomRef = { floor: string; room: string };
type Tab = "explore" | "navigate";
type NavView = "settings" | "directions";

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
  const isEl = lang === "el";
  const t = isEl
    ? {
        controls: "Έλεγχοι χάρτη",
        explore: "Εξερεύνηση",
        navigate: "Πλοήγηση",
      }
    : {
        controls: "Map controls",
        explore: "Explore",
        navigate: "Navigate",
      };

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
    return first
      ? { floor: first.floor, room: first.room }
      : { floor: currentFloorSlug, room: "" };
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

  const [tab, setTab] = useState<Tab>("navigate");
  const [navView, setNavView] = useState<NavView>("settings");

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

  // When the assistant returns a route, jump straight into the directions
  // view so the user sees the answer instead of having to click through
  // the form again.
  useEffect(() => {
    if (aiPath) {
      setTab("navigate");
      setNavView("directions");
    }
  }, [aiPath]);

  const currentSegmentNodes = useMemo(() => {
    if (!activePath) return undefined;
    const segs = activePath.segments.filter(
      (s) => s.floorSlug === currentFloorSlug,
    );
    if (segs.length === 0) return undefined;
    return segs.flatMap((s) => s.nodes);
  }, [activePath, currentFloorSlug]);

  const sidebar = (
    <div className="flex flex-col gap-4">
      <Tabs
        value={tab}
        onChange={(v) => {
          setTab(v);
          // Switching to navigate after a route already exists feels
          // most natural landing on the directions view.
          if (v === "navigate" && activePath) setNavView("directions");
        }}
        labels={{ explore: t.explore, navigate: t.navigate }}
      />

      {tab === "explore" ? (
        <ExplorePanel
          lang={lang}
          buildingSlug={buildingSlug}
          floors={floors}
          currentFloor={currentFloor}
          currentFloorSlug={currentFloorSlug}
          showGraph={showGraph}
          onShowGraphChange={setShowGraph}
        />
      ) : navView === "directions" && activePath ? (
        <DirectionsPanel
          lang={lang}
          path={activePath}
          fromRef={fromRef}
          toRef={toRef}
          floors={floors}
          buildingSlug={buildingSlug}
          currentFloorSlug={currentFloorSlug}
          profile={profile}
          aiAuthored={Boolean(aiPath)}
          onBack={() => setNavView("settings")}
        />
      ) : (
        <NavigateSettings
          lang={lang}
          fromRef={fromRef}
          toRef={toRef}
          options={allRoomOptions}
          profileId={profileId}
          onFromChange={setFromRef}
          onToChange={setToRef}
          onProfileChange={setProfileId}
          onSwap={() => {
            setFromRefState(toRef);
            setToRefState(fromRef);
            setAiPath(null);
          }}
          onShowDirections={() => setNavView("directions")}
          activePath={activePath}
          buildingSlug={buildingSlug}
          currentFloorSlug={currentFloorSlug}
          onAssistantRoute={(p) => setAiPath(p)}
        />
      )}
    </div>
  );

  return (
    <AppShell
      headerSlot={
        <span className="text-[color:var(--muted-foreground)]">
          {prettyBuildingName(buildingSlug)} · {currentFloor.name[lang]}
        </span>
      }
      sidebar={sidebar}
      sidebarTitle={t.controls}
    >
      <FloorMap
        map={currentFloor}
        showGraph={showGraph}
        highlightedRoute={currentSegmentNodes}
        lang={lang}
      />
    </AppShell>
  );
}

/* ─── Tabs ────────────────────────────────────────────────────────────────── */

function Tabs({
  value,
  onChange,
  labels,
}: {
  value: Tab;
  onChange: (v: Tab) => void;
  labels: { explore: string; navigate: string };
}) {
  return (
    <div
      role="tablist"
      className="flex rounded-xl border border-[var(--border)] bg-[var(--background)] p-0.5"
    >
      <TabButton
        active={value === "explore"}
        onClick={() => onChange("explore")}
        icon={<Eye className="h-3.5 w-3.5" />}
        label={labels.explore}
      />
      <TabButton
        active={value === "navigate"}
        onClick={() => onChange("navigate")}
        icon={<Navigation className="h-3.5 w-3.5" />}
        label={labels.navigate}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors " +
        (active
          ? "bg-[var(--brand)] text-white shadow-[var(--shadow-card)]"
          : "text-[color:var(--muted-foreground)] hover:bg-[var(--surface-3)] hover:text-[color:var(--foreground)]")
      }
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Explore tab ─────────────────────────────────────────────────────────── */

function ExplorePanel({
  lang,
  buildingSlug,
  floors,
  currentFloor,
  currentFloorSlug,
  showGraph,
  onShowGraphChange,
}: {
  lang: Lang;
  buildingSlug: string;
  floors: FloorMapData[];
  currentFloor: FloorMapData;
  currentFloorSlug: string;
  showGraph: boolean;
  onShowGraphChange: (v: boolean) => void;
}) {
  const isEl = lang === "el";
  const t = isEl
    ? {
        floor: "Όροφος",
        display: "Εμφάνιση",
        graphLabel: "Εμφάνιση γραφήματος δρομολόγησης",
        graphHint: "Επικάλυψη κόμβων και ακμών πάνω στην κάτοψη.",
        info: "Στοιχεία",
        rooms: "Δωμάτια",
        doors: "Πόρτες",
        nodes: "Κόμβοι",
        edges: "Ακμές",
        building: "Κτίριο",
        howWorks: "Πώς λειτουργεί;",
      }
    : {
        floor: "Floor",
        display: "Display",
        graphLabel: "Show routing graph",
        graphHint: "Overlay nodes and edges over the floor plan.",
        info: "Info",
        rooms: "Rooms",
        doors: "Doors",
        nodes: "Nodes",
        edges: "Edges",
        building: "Building",
        howWorks: "How does this work?",
      };

  return (
    <div className="flex flex-col gap-5">
      <Section label={t.floor}>
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
                    : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-3)]")
                }
              >
                <span
                  className={
                    "grid h-7 w-9 place-items-center rounded-md font-mono text-[0.72rem] tabular-nums " +
                    (active
                      ? "bg-[var(--brand)] text-white"
                      : "bg-[var(--surface-3)] text-[color:var(--muted-foreground)]")
                  }
                >
                  L{f.level}
                </span>
                <span className="flex-1 font-medium">{f.name[lang]}</span>
                <span className="text-caption">
                  {f.rooms.length} {t.rooms.toLowerCase()}
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section label={t.display}>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 hover:bg-[var(--surface-3)]">
          <input
            type="checkbox"
            checked={showGraph}
            onChange={(e) => onShowGraphChange(e.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-body font-medium">{t.graphLabel}</span>
            <span className="text-caption">{t.graphHint}</span>
          </span>
        </label>
      </Section>

      <Section label={t.info}>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-caption">
          <Stat term={t.building} value={prettyBuildingName(buildingSlug)} />
          <Stat term={t.floor} value={currentFloor.name[lang]} />
          <Stat term={t.rooms} value={currentFloor.rooms.length} />
          <Stat term={t.doors} value={currentFloor.doors.length} />
          <Stat term={t.nodes} value={currentFloor.nodes.length} />
          <Stat term={t.edges} value={currentFloor.edges.length} />
        </dl>
      </Section>

      <Link
        href="/about"
        className="text-caption font-medium text-[color:var(--brand)] hover:underline"
      >
        {t.howWorks} →
      </Link>
    </div>
  );
}

function Stat({ term, value }: { term: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <dt className="text-overline">{term}</dt>
      <dd className="text-body text-[color:var(--foreground)]">{value}</dd>
    </div>
  );
}

/* ─── Navigate · Settings view ────────────────────────────────────────────── */

type RoomOption = {
  value: string;
  floor: string;
  room: string;
  label: string;
  floorName: string;
};

function NavigateSettings({
  lang,
  fromRef,
  toRef,
  options,
  profileId,
  onFromChange,
  onToChange,
  onProfileChange,
  onSwap,
  onShowDirections,
  activePath,
  buildingSlug,
  currentFloorSlug,
  onAssistantRoute,
}: {
  lang: Lang;
  fromRef: RoomRef;
  toRef: RoomRef;
  options: RoomOption[];
  profileId: string;
  onFromChange: (v: RoomRef) => void;
  onToChange: (v: RoomRef) => void;
  onProfileChange: (v: string) => void;
  onSwap: () => void;
  onShowDirections: () => void;
  activePath: MultiFloorPath | null;
  buildingSlug: string;
  currentFloorSlug: string;
  onAssistantRoute: (p: MultiFloorPath) => void;
}) {
  const isEl = lang === "el";
  const t = isEl
    ? {
        profile: "Προφίλ",
        from: "Από",
        to: "Προς",
        swap: "Αντιστροφή",
        getDirections: "Οδηγίες",
        noRoute: "Επιλέξτε δύο διαφορετικά δωμάτια.",
        noRouteForProfile: (p: string) => `Καμία διαδρομή για το προφίλ «${p.toLowerCase()}».`,
        or: "ή ρωτήστε τον βοηθό",
      }
    : {
        profile: "Profile",
        from: "From",
        to: "To",
        swap: "Swap",
        getDirections: "Get directions",
        noRoute: "Pick two different rooms.",
        noRouteForProfile: (p: string) => `No route for the ${p.toLowerCase()} profile.`,
        or: "or ask the assistant",
      };

  const profile: Profile = PROFILES[profileId] ?? PROFILES.default;
  const sameRoom = fromRef.floor === toRef.floor && fromRef.room === toRef.room;

  return (
    <div className="flex flex-col gap-5">
      <Section label={t.profile}>
        <div className="flex flex-col gap-1.5">
          {PROFILE_LIST.map((p) => {
            const active = p.id === profileId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onProfileChange(p.id)}
                className={
                  "flex items-center justify-between rounded-md border px-3 py-2 text-left text-body transition-colors " +
                  (active
                    ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[color:var(--foreground)]"
                    : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-3)]")
                }
              >
                <span className="font-medium">{profileLabel(p, lang)}</span>
                {active && (
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
      </Section>

      <Section label={`${t.from} / ${t.to}`}>
        <Field label={t.from}>
          <RoomSelect value={fromRef} options={options} onChange={onFromChange} />
        </Field>
        <Field label={t.to}>
          <RoomSelect value={toRef} options={options} onChange={onToChange} />
        </Field>
        <button
          type="button"
          onClick={onSwap}
          className="self-start rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-3)]"
        >
          ↑↓ {t.swap}
        </button>

        {sameRoom ? (
          <p className="text-caption">{t.noRoute}</p>
        ) : !activePath ? (
          <p className="text-caption text-[color:color-mix(in_oklab,var(--warning),#000_15%)]">
            {t.noRouteForProfile(profileLabel(profile, lang))}
          </p>
        ) : (
          <button
            type="button"
            onClick={onShowDirections}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white shadow-[var(--shadow-card)] hover:bg-[var(--brand-strong)]"
          >
            {t.getDirections}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </Section>

      <div className="flex items-center gap-2 text-caption">
        <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[color:var(--muted-foreground)]">{t.or}</span>
        <span aria-hidden className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <AssistantPanel
        building={buildingSlug}
        floor={currentFloorSlug}
        onRoute={onAssistantRoute}
      />
    </div>
  );
}

/* ─── Navigate · Directions view ──────────────────────────────────────────── */

type Step = {
  kind: "start" | "go" | "elevator" | "stairs" | "switch-floor" | "arrive";
  text: string;
  floorSlug: string;
  nodeId?: string;
};

function buildSteps(
  path: MultiFloorPath,
  fromRef: RoomRef,
  toRef: RoomRef,
  floors: FloorMapData[],
  lang: Lang,
): Step[] {
  const isEl = lang === "el";
  const word = isEl
    ? {
        startAt: "Ξεκινάτε από",
        passingThrough: "Περάστε από",
        takeElevator: "Πάρτε το ασανσέρ",
        takeStairs: "Πάρτε τις σκάλες",
        switchTo: "Φτάνετε στον όροφο",
        arriveAt: "Φτάνετε στο",
      }
    : {
        startAt: "Start at",
        passingThrough: "Pass by",
        takeElevator: "Take the elevator",
        takeStairs: "Take the stairs",
        switchTo: "Arrive on",
        arriveAt: "Arrive at",
      };

  const floorBySlug = new Map(floors.map((f) => [f.floorSlug, f]));
  const lookupRoom = (floorSlug: string, roomId: string | undefined) => {
    if (!roomId) return null;
    const f = floorBySlug.get(floorSlug);
    if (!f) return null;
    return f.rooms.find((r) => r.id === roomId) ?? null;
  };
  const lookupNode = (floorSlug: string, nodeId: string): GraphNode | null => {
    const f = floorBySlug.get(floorSlug);
    if (!f) return null;
    return f.nodes.find((n) => n.id === nodeId) ?? null;
  };
  const featureFor = (n: GraphNode): AccessibilityFeature | null => {
    return n.features[0] ?? null;
  };

  const steps: Step[] = [];

  // Start
  const fromRoom = lookupRoom(fromRef.floor, fromRef.room);
  steps.push({
    kind: "start",
    floorSlug: fromRef.floor,
    text: `${word.startAt} ${fromRoom ? fromRoom.name[lang] : fromRef.room}`,
  });

  // Walk segments
  for (let segIdx = 0; segIdx < path.segments.length; segIdx++) {
    const seg = path.segments[segIdx];
    const f = floorBySlug.get(seg.floorSlug);
    if (!f) continue;

    // Notable waypoints inside this segment: nodes with a roomId or a
    // feature, *excluding* the endpoints which we name as start/arrive.
    const isFirst = segIdx === 0;
    const isLast = segIdx === path.segments.length - 1;
    for (let i = 0; i < seg.nodes.length; i++) {
      const nodeId = seg.nodes[i];
      // Skip the very start of the very first segment (already covered)
      // and the very end of the very last segment (handled below).
      if (isFirst && i === 0) continue;
      if (isLast && i === seg.nodes.length - 1) continue;

      const node = lookupNode(seg.floorSlug, nodeId);
      if (!node) continue;
      const feat = featureFor(node);
      const room = lookupRoom(seg.floorSlug, node.roomId);

      if (feat === "elevator") {
        steps.push({
          kind: "elevator",
          floorSlug: seg.floorSlug,
          nodeId,
          text: word.takeElevator,
        });
      } else if (feat === "stairs") {
        steps.push({
          kind: "stairs",
          floorSlug: seg.floorSlug,
          nodeId,
          text: word.takeStairs,
        });
      } else if (room && room.kind !== "corridor") {
        steps.push({
          kind: "go",
          floorSlug: seg.floorSlug,
          nodeId,
          text: `${word.passingThrough} ${room.name[lang]}`,
        });
      }
    }

    // Floor change between this segment and the next
    if (segIdx < path.segments.length - 1) {
      const next = path.segments[segIdx + 1];
      const nextFloor = floorBySlug.get(next.floorSlug);
      if (nextFloor) {
        steps.push({
          kind: "switch-floor",
          floorSlug: next.floorSlug,
          text: `${word.switchTo} ${nextFloor.name[lang]}`,
        });
      }
    }
  }

  // Arrive
  const toRoom = lookupRoom(toRef.floor, toRef.room);
  steps.push({
    kind: "arrive",
    floorSlug: toRef.floor,
    text: `${word.arriveAt} ${toRoom ? toRoom.name[lang] : toRef.room}`,
  });

  return steps;
}

function DirectionsPanel({
  lang,
  path,
  fromRef,
  toRef,
  floors,
  buildingSlug,
  currentFloorSlug,
  profile,
  aiAuthored,
  onBack,
}: {
  lang: Lang;
  path: MultiFloorPath;
  fromRef: RoomRef;
  toRef: RoomRef;
  floors: FloorMapData[];
  buildingSlug: string;
  currentFloorSlug: string;
  profile: Profile;
  aiAuthored: boolean;
  onBack: () => void;
}) {
  const isEl = lang === "el";
  const t = isEl
    ? {
        back: "Πίσω στις ρυθμίσεις",
        directions: "Οδηγίες",
        assistant: "Από τον βοηθό",
        cost: "κόστος",
        segments: "τμήματα",
        notOnFloor: "Αυτό το βήμα είναι σε άλλον όροφο.",
      }
    : {
        back: "Back to settings",
        directions: "Directions",
        assistant: "From the assistant",
        cost: "cost",
        segments: "segments",
        notOnFloor: "This step is on another floor.",
      };

  const steps = useMemo(
    () => buildSteps(path, fromRef, toRef, floors, lang),
    [path, fromRef, toRef, floors, lang],
  );

  const totalSegments = path.segments.reduce(
    (n, s) => n + Math.max(0, s.nodes.length - 1),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 self-start rounded-md text-xs font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t.back}
      </button>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-h3">{t.directions}</h2>
          {aiAuthored && (
            <span className="text-caption text-[color:var(--brand)]">
              {t.assistant}
            </span>
          )}
        </div>
        <p className="text-caption">
          {profileLabel(profile, lang)} · {totalSegments} {t.segments} ·{" "}
          {t.cost} {path.cost.toFixed(1)}
        </p>
      </div>

      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <StepItem
            key={i}
            n={i + 1}
            step={step}
            floors={floors}
            lang={lang}
            isOnCurrentFloor={step.floorSlug === currentFloorSlug}
            isLast={i === steps.length - 1}
            buildingSlug={buildingSlug}
            notOnFloorLabel={t.notOnFloor}
          />
        ))}
      </ol>
    </div>
  );
}

function StepItem({
  n,
  step,
  floors,
  lang,
  isOnCurrentFloor,
  isLast,
  buildingSlug,
  notOnFloorLabel,
}: {
  n: number;
  step: Step;
  floors: FloorMapData[];
  lang: Lang;
  isOnCurrentFloor: boolean;
  isLast: boolean;
  buildingSlug: string;
  notOnFloorLabel: string;
}) {
  const floor = floors.find((f) => f.floorSlug === step.floorSlug);
  const Icon = stepIcon(step.kind);
  return (
    <li className="relative flex items-start gap-3">
      {/* Vertical connector */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[15px] top-8 bottom-[-0.5rem] w-px bg-[var(--border)]"
        />
      )}
      <span
        className={
          "z-[1] grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 " +
          (step.kind === "arrive"
            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
            : step.kind === "start"
              ? "border-[var(--brand)] bg-[var(--background)] text-[color:var(--brand)]"
              : "border-[var(--border)] bg-[var(--background)] text-[color:var(--muted-foreground)]")
        }
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex flex-1 flex-col gap-0.5 pt-1">
        <p className="text-body text-[color:var(--foreground)]">
          <span className="text-caption mr-1.5">{n}.</span>
          {step.text}
        </p>
        {!isOnCurrentFloor && floor && (
          <Link
            href={`/maps/${buildingSlug}/${floor.floorSlug}`}
            className="inline-flex items-center gap-1 self-start rounded-md border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-[0.7rem] text-[color:var(--muted-foreground)] hover:bg-[var(--surface-3)] hover:text-[color:var(--foreground)]"
          >
            <CornerRightDown className="h-3 w-3" />
            {floor.name[lang]} · {notOnFloorLabel}
          </Link>
        )}
      </div>
    </li>
  );
}

function stepIcon(kind: Step["kind"]) {
  switch (kind) {
    case "start":
      return MapPin;
    case "elevator":
      return ArrowUp;
    case "stairs":
      return ArrowDown;
    case "switch-floor":
      return CompassIcon;
    case "arrive":
      return Info;
    case "go":
    default:
      return ArrowRight;
  }
}

/* ─── Shared layout primitives ────────────────────────────────────────────── */

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-overline">{label}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

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
