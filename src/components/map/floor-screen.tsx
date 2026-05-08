"use client";

/**
 * The full floor experience: app shell with a sidebar of controls (floor
 * switcher + route picker + assistant) and a Leaflet map filling the main
 * area. Owns the shared state so the manual route picker and the
 * assistant can both feed the same `highlightedRoute` prop on the map.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
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

function profileLabel(p: Profile, lang: Lang): string {
  return lang === "el" ? p.labelEl : p.label;
}

export function FloorScreen({ buildingSlug, floors, currentFloorSlug }: Props) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        plan: "Σχεδιασμός διαδρομής",
        from: "Από",
        to: "Προς",
        profile: "Προφίλ",
        display: "Εμφάνιση",
        showGraph: "Εμφάνιση γραφήματος δρομολόγησης",
        floor: "Όροφος",
        howWorks: "Πώς λειτουργεί;",
        controls: "Έλεγχοι χάρτη",
      }
    : {
        plan: "Plan a route",
        from: "From",
        to: "To",
        profile: "Profile",
        display: "Display",
        showGraph: "Show routing graph",
        floor: "Floor",
        howWorks: "How does this work?",
        controls: "Map controls",
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
            label: r.code
              ? `${r.code} · ${r.name[lang]}`
              : r.name[lang],
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
  // Assistant-suggested multi-floor route. Overrides the manual route until
  // the user touches the From/To/Profile form again.
  const [aiPath, setAiPath] = useState<MultiFloorPath | null>(null);

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

  const sidebar = (
    <div className="flex flex-col gap-5">
      <FloorSwitcher
        buildingSlug={buildingSlug}
        floors={floors}
        currentFloorSlug={currentFloorSlug}
        floorLabel={t.floor}
        lang={lang}
      />

      <Divider />

      <section className="flex flex-col gap-3">
        <h2 className="text-overline">{t.plan}</h2>
        <Field label={t.from}>
          <RoomSelect
            value={fromRef}
            options={allRoomOptions}
            onChange={setFromRef}
          />
        </Field>
        <Field label={t.to}>
          <RoomSelect
            value={toRef}
            options={allRoomOptions}
            onChange={setToRef}
          />
        </Field>
        <Field label={t.profile}>
          <div className="flex flex-wrap gap-1.5">
            {PROFILE_LIST.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProfileId(p.id)}
                className={
                  "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors " +
                  (p.id === profileId
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--border)] bg-[var(--background)] text-[color:var(--foreground)] hover:bg-[var(--surface-2)]")
                }
              >
                {profileLabel(p, lang)}
              </button>
            ))}
          </div>
        </Field>

        <RouteSummary
          activePath={activePath}
          aiAuthored={Boolean(aiPath)}
          fromRef={fromRef}
          toRef={toRef}
          profile={profile}
          buildingSlug={buildingSlug}
          currentFloorSlug={currentFloorSlug}
          floors={floors}
          lang={lang}
        />
      </section>

      <Divider />

      <section className="flex flex-col gap-2">
        <h2 className="text-overline">{t.display}</h2>
        <label className="flex cursor-pointer items-center gap-2 text-body">
          <input
            type="checkbox"
            checked={showGraph}
            onChange={(e) => setShowGraph(e.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          {t.showGraph}
        </label>
      </section>

      <Divider />

      <AssistantPanel
        building={buildingSlug}
        floor={currentFloorSlug}
        onRoute={(path) => setAiPath(path)}
      />

      <Divider />

      <section className="flex flex-col gap-2 text-caption">
        <Link href="/about" className="text-[color:var(--brand)] hover:underline">
          {t.howWorks} →
        </Link>
      </section>
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

function FloorSwitcher({
  buildingSlug,
  floors,
  currentFloorSlug,
  floorLabel,
  lang,
}: {
  buildingSlug: string;
  floors: FloorMapData[];
  currentFloorSlug: string;
  floorLabel: string;
  lang: Lang;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-overline">{floorLabel}</h2>
      <div className="flex flex-wrap gap-1.5">
        {floors.map((f) => {
          const active = f.floorSlug === currentFloorSlug;
          return (
            <Link
              key={f.floorSlug}
              href={`/maps/${buildingSlug}/${f.floorSlug}`}
              className={
                "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors " +
                (active
                  ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                  : "border-[var(--border)] bg-[var(--background)] text-[color:var(--foreground)] hover:bg-[var(--surface-2)]")
              }
            >
              <span
                className={
                  "font-mono text-[0.75rem] tabular-nums " +
                  (active ? "text-white/80" : "text-[color:var(--muted-foreground)]")
                }
              >
                L{f.level}
              </span>
              <span>{f.name[lang]}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function RouteSummary({
  activePath,
  aiAuthored,
  fromRef,
  toRef,
  profile,
  buildingSlug,
  currentFloorSlug,
  floors,
  lang,
}: {
  activePath: MultiFloorPath | null;
  aiAuthored: boolean;
  fromRef: RoomRef;
  toRef: RoomRef;
  profile: Profile;
  buildingSlug: string;
  currentFloorSlug: string;
  floors: FloorMapData[];
  lang: Lang;
}) {
  const isEl = lang === "el";
  const tx = isEl
    ? {
        pickDifferent: "Επιλέξτε δύο διαφορετικά δωμάτια.",
        noRouteFor: (label: string) =>
          `Καμία διαδρομή για το προφίλ «${label.toLowerCase()}».`,
        assistantRoute: "Διαδρομή βοηθού",
        route: "Διαδρομή",
        segments: "τμήματα",
        cost: "κόστος",
        profileSuffix: "προφίλ",
        notOnFloor: "Αυτή η διαδρομή δεν περνά από αυτόν τον όροφο.",
        continueOn: (name: string) => `Συνέχεια στον όροφο: ${name}`,
      }
    : {
        pickDifferent: "Pick two different rooms.",
        noRouteFor: (label: string) =>
          `No route for the ${label.toLowerCase()} profile.`,
        assistantRoute: "Assistant route",
        route: "Route",
        segments: "segments",
        cost: "cost",
        profileSuffix: "profile",
        notOnFloor: "This route doesn't pass through this floor.",
        continueOn: (name: string) => `Continue on ${name}`,
      };

  const base =
    "rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-caption";
  if (!activePath) {
    if (
      fromRef.floor === toRef.floor &&
      fromRef.room === toRef.room
    ) {
      return <p className={base}>{tx.pickDifferent}</p>;
    }
    return (
      <p
        className={
          base + " font-medium text-[color:color-mix(in_oklab,var(--warning),#000_15%)]"
        }
      >
        {tx.noRouteFor(profileLabel(profile, lang))}
      </p>
    );
  }
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
    <div className={base}>
      <p
        className={
          "font-medium " +
          (aiAuthored ? "text-[color:var(--brand)]" : "text-[color:var(--foreground)]")
        }
      >
        {aiAuthored ? tx.assistantRoute : tx.route} · {totalSegments} {tx.segments} · {tx.cost} {activePath.cost.toFixed(1)}
      </p>
      <p className="mt-0.5">{profileLabel(profile, lang)} {tx.profileSuffix}</p>
      {!onCurrent && otherFloors.length > 0 && (
        <p className="mt-1.5 text-[color:var(--foreground)]">{tx.notOnFloor}</p>
      )}
      {otherFloors.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
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
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[color:var(--foreground)] hover:bg-[var(--surface-3)]"
                >
                  {above ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                  )}
                  {tx.continueOn(f.name[lang])}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
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

type RoomOption = {
  value: string;
  floor: string;
  room: string;
  label: string;
  floorName: string;
};

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

function Divider() {
  return <div className="h-px w-full bg-[var(--border)]" />;
}

function prettyBuildingName(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
