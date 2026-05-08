import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "About — AccessMap",
  description:
    "How AccessMap works: data-driven floor plans, A* routing with accessibility profiles, and an AI assistant that calls those same primitives as tools.",
};

export default function AboutPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-5 py-10 sm:px-8 sm:py-14">
        <Hero />
        <SchemaSection />
        <ArchitectureSection />
        <PathfindingSection />
        <MultiFloorSection />
        <ProfilesSection />
        <AssistantSection />
        <StackSection />
        <StyleGuide />
        <Footer />
      </div>
    </AppShell>
  );
}

function Hero() {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-overline">About AccessMap</p>
      <h1 className="text-display">Indoor accessibility, drawn from data.</h1>
      <p className="text-lead">
        AccessMap is a teaching project. It pairs a small JSON schema for
        floor plans with classic pathfinding and a Claude tool-using assistant,
        so undergraduates can read the whole stack end-to-end in an afternoon.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/maps/demo-building/ground"
          className="inline-flex items-center rounded-md bg-[var(--brand)] px-3 py-1.5 text-body font-medium text-[color:var(--brand-foreground)] transition-opacity hover:opacity-90"
        >
          Open the demo
        </Link>
        <Link
          href="https://github.com/University-of-Macedonia-Research-Lab/accessmap"
          className="inline-flex items-center rounded-md border border-[var(--border)] px-3 py-1.5 text-body font-medium hover:bg-[var(--surface-2)]"
        >
          Source on GitHub
        </Link>
      </div>
    </section>
  );
}

function SchemaSection() {
  return (
    <Section
      kicker="Data first"
      title="Floors are JSON, not artwork"
      lead="Every floor is a JSON document with rooms, doors, and a routing graph. The renderer walks that document to draw SVG; the pathfinder walks the same graph to plan routes. Adding a new floor means writing a new JSON file — not editing artwork."
    >
      <p className="text-body">
        A floor lists rooms as 2-D polygons in a flat coordinate frame, doors
        as points on shared walls, and a graph of nodes and edges that lives
        alongside the geometry. Edges carry feature tags like{" "}
        <Code>stairs</Code>, <Code>elevator</Code>, <Code>ramp</Code>, or{" "}
        <Code>narrow_passage</Code> so we can reweight them per-profile.
      </p>
      <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-4 text-caption leading-relaxed">
{`{
  "outline": [{ "x": 0, "y": 0 }, { "x": 100, "y": 0 }, ...],   // exterior boundary
  "walls":   [{ "id": "win-101", "kind": "window",
                "start": { "x": 8, "y": 50 }, "end": { "x": 22, "y": 50 } }],
  "rooms":   [{ "id": "room-101", "code": "101", "polygon": [...] }],
  "doors":   [{ "id": "d-101", "between": ["room-101", "corridor"], "position": {...} }],
  "nodes":   [{ "id": "n-elev", "roomId": "elevator-shaft", "features": ["elevator"],
                "connectsToFloor": { "floorSlug": "first", "nodeId": "n-elev" } }],
  "edges":   [{ "id": "e-c4-stair", "from": "c4", "to": "n-stair", "features": ["stairs"] }]
}`}
      </pre>
      <p className="text-caption">
        Schema source:{" "}
        <Code>src/lib/map/schema.ts</Code> — a Zod schema that validates the
        JSON and exports the matching TypeScript types.
      </p>
    </Section>
  );
}

function ArchitectureSection() {
  return (
    <Section
      kicker="Drawing"
      title="It looks like a real floor plan"
      lead="The renderer composes the SVG in the same order an architect would draw the plan: floor base, room fills, interior partitions, exterior shell, windows, doors, then labels and route on top."
    >
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        <li>
          <span className="font-medium">Outline</span> — an optional polygon
          for the building&rsquo;s exterior boundary, drawn as a filled
          &ldquo;floor base&rdquo; with a thick stroke around its edges.
        </li>
        <li>
          <span className="font-medium">Walls</span> — line segments tagged{" "}
          <Code>exterior</Code>, <Code>interior</Code>, or <Code>window</Code>.
          Windows render as a cyan glass cut over the wall ink.
        </li>
        <li>
          <span className="font-medium">Routes</span> — drawn twice, once
          thick in the page background colour as a halo, once in the brand
          colour on top. That&rsquo;s the same trick Google Maps and Apple
          Maps use, and it keeps the line readable on top of any room fill.
        </li>
      </ul>
    </Section>
  );
}

function PathfindingSection() {
  return (
    <Section
      kicker="Routing"
      title="A* over a weighted graph"
      lead="Once a floor is a graph, finding a route is a textbook A* search. The heuristic is plain Euclidean distance, the cost of an edge is its base length times a profile multiplier, and Infinity blocks an edge entirely."
    >
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        <li>
          <span className="font-medium">Heuristic:</span> straight-line distance
          to the goal — admissible because every edge cost is at least its
          straight-line length.
        </li>
        <li>
          <span className="font-medium">Cost function:</span>{" "}
          <Code>baseCost × max(profile.multiplier[feature])</Code> over the
          edge&rsquo;s feature tags.
        </li>
        <li>
          <span className="font-medium">Priority queue:</span> a linear scan
          over the open set. Fine for teaching graphs and floor-plan-sized
          inputs; would be the first thing to swap in for a real deployment.
        </li>
      </ul>
      <p className="text-caption">
        Source: <Code>src/lib/map/pathfind.ts</Code> — about 100 lines, with{" "}
        <Code>pathfind.test.ts</Code> next to it.
      </p>
    </Section>
  );
}

function MultiFloorSection() {
  return (
    <Section
      kicker="Routing across floors"
      title="One graph, many floors"
      lead="A node with `connectsToFloor` becomes a cross-floor edge. The pathfinder builds a single unified graph keyed by `floor:node` and runs Dijkstra over it — same code path for a one-floor walk and a five-floor traversal."
    >
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        <li>
          Cross-floor edges inherit the source node&rsquo;s features. An
          <Code> n-elev</Code> ↔ <Code>n-elev</Code> link carries{" "}
          <Code>elevator</Code>, so the wheelchair profile applies the same
          slight surcharge it would on an in-floor elevator edge — and a
          stairs link is hard-blocked the same way.
        </li>
        <li>
          The result is a list of per-floor segments. The UI shows the
          current floor&rsquo;s segment with the route halo and offers a
          shortcut to switch to the next floor where the route continues.
        </li>
        <li>
          Heuristic is <Code>0</Code> (Dijkstra) since A*&rsquo;s euclidean
          heuristic doesn&rsquo;t generalise across floors. Floor-plan-sized
          graphs are tiny, so this stays trivially fast.
        </li>
      </ul>
      <p className="text-caption">
        Source: <Code>src/lib/map/multi-pathfind.ts</Code>, with{" "}
        <Code>multi-pathfind.test.ts</Code> covering the cross-floor cases.
      </p>
    </Section>
  );
}

function ProfilesSection() {
  const rows: Array<[string, string, string, string]> = [
    ["stairs", "1×", "∞ (blocked)", "1.5×"],
    ["step", "1×", "∞ (blocked)", "1×"],
    ["narrow_passage", "1×", "3×", "1.5×"],
    ["ramp", "1×", "1.1×", "1×"],
    ["elevator", "1×", "1.2×", "1×"],
  ];
  return (
    <Section
      kicker="Accessibility"
      title="Profiles change the cost, not the graph"
      lead="The same map graph yields different routes for different users. Each profile is a map from feature tag to weight multiplier. Set a feature to ∞ and any edge with that tag drops out of the search."
    >
      <div className="overflow-x-auto rounded-md border border-[var(--border)]">
        <table className="w-full text-body">
          <thead className="bg-[var(--surface-2)] text-caption uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Feature</th>
              <th className="px-3 py-2 text-left font-semibold">Default</th>
              <th className="px-3 py-2 text-left font-semibold">Wheelchair</th>
              <th className="px-3 py-2 text-left font-semibold">
                Visually impaired
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feat, ...vals]) => (
              <tr key={feat} className="border-t border-[var(--border)]">
                <td className="px-3 py-2">
                  <Code>{feat}</Code>
                </td>
                {vals.map((v, i) => (
                  <td key={i} className="px-3 py-2 tabular-nums">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function AssistantSection() {
  return (
    <Section
      kicker="AI"
      title="Two tools and a cached prompt"
      lead="The assistant is Claude Opus 4.7 with adaptive thinking and exactly two tools: find_room and find_route. Both are thin wrappers around the search and routing code already shipping in the app — there is no parallel implementation."
    >
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        <li>
          <span className="font-medium">Map JSON in the system prompt</span>,
          marked with <Code>cache_control: ephemeral</Code>. Turn 1 writes the
          cache; subsequent turns read it back at roughly a tenth of the price.
        </li>
        <li>
          <span className="font-medium">Tool runner loop</span> handled by the
          official SDK — the agent loop, tool execution, and tool-result
          plumbing are all in <Code>client.beta.messages.toolRunner()</Code>.
        </li>
        <li>
          <span className="font-medium">Captured route</span>: when{" "}
          <Code>find_route</Code> succeeds, its node list is pushed back into
          the same <Code>highlightedRoute</Code> prop the manual route picker
          uses, so the visualisation is identical.
        </li>
      </ul>
      <p className="text-caption">
        Source: <Code>src/lib/ai/assistant.ts</Code>, route handler at{" "}
        <Code>src/app/api/assistant/route.ts</Code>.
      </p>
    </Section>
  );
}

function StackSection() {
  const items: Array<[string, string]> = [
    ["Next.js 16 (App Router)", "Routing, layouts, server components."],
    ["TypeScript + Zod", "Schema and types from one source."],
    [
      "Tailwind v4 + shadcn/ui",
      "Design tokens compose into utility classes; primitives via Base UI.",
    ],
    ["Inter + Geist Mono", "Body in Inter, code in Geist Mono. Both via next/font."],
    ["next-themes", "Light, dark, and system theme — persisted to localStorage."],
    ["Leaflet (CRS.Simple)", "Pan, pinch-zoom, mobile gestures over a flat coordinate frame."],
    [
      "Prisma + SQLite",
      "Catalog of buildings/floors. Geometry stays in JSON.",
    ],
    [
      "Anthropic SDK",
      "Claude Opus 4.7 + adaptive thinking, betaZodTool tool runner, prompt caching.",
    ],
    ["Vitest", "Pathfinder unit tests live next to the implementation."],
  ];
  return (
    <Section kicker="Stack" title="What's running">
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(([name, desc]) => (
          <li
            key={name}
            className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-body shadow-[var(--shadow-card)]"
          >
            <p className="font-medium">{name}</p>
            <p className="text-caption">{desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function StyleGuide() {
  const swatches: Array<{ name: string; cssVar: string; note: string }> = [
    { name: "Brand", cssVar: "--brand", note: "Indigo-violet — primary CTAs, brand mark." },
    { name: "Brand strong", cssVar: "--brand-strong", note: "Hover/active brand surfaces." },
    { name: "Brand soft", cssVar: "--brand-soft", note: "Tinted brand surfaces, badges." },
    { name: "Route", cssVar: "--route", note: "Highlighted path stroke (with white halo)." },
    { name: "Feature", cssVar: "--feature", note: "Cyan accessibility-feature icons." },
    { name: "Foreground", cssVar: "--foreground", note: "Body text, headlines." },
    { name: "Muted fg", cssVar: "--muted-foreground", note: "Captions, secondary copy." },
    { name: "Surface 1", cssVar: "--surface-1", note: "Page background." },
    { name: "Surface 2", cssVar: "--surface-2", note: "Sidebar panels, summary cards." },
    { name: "Floor base", cssVar: "--floor-base", note: "Building interior fill on the map." },
    { name: "Wall", cssVar: "--wall-exterior", note: "Exterior wall ink." },
    { name: "Window", cssVar: "--window-glass", note: "Glass cuts in exterior walls." },
    { name: "Border", cssVar: "--border", note: "Dividers, input outlines." },
    { name: "Success", cssVar: "--success", note: "Confirmation states." },
    { name: "Warning", cssVar: "--warning", note: "Soft alerts, no-route." },
    { name: "Danger", cssVar: "--danger", note: "Destructive, blocked edges." },
  ];

  const typeRows: Array<[string, string, string]> = [
    [".text-display", "48 / 56 · 700", "Hero headline"],
    [".text-h1", "32 / 40 · 600", "Page title"],
    [".text-h2", "24 / 32 · 600", "Section title"],
    [".text-h3", "18 / 26 · 600", "Subsection"],
    [".text-lead", "17 / 26 · 400", "Intro paragraph"],
    [".text-body", "15 / 24 · 400", "Body copy"],
    [".text-caption", "13 / 19 · 400", "Helper / metadata"],
    [".text-overline", "11 / 14 · 600", "Section kicker"],
  ];

  return (
    <Section kicker="Design system" title="Tokens & type scale">
      <div className="flex flex-col gap-3">
        <h3 className="text-h3">Color tokens</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map((s) => (
            <div
              key={s.cssVar}
              className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-card)]"
            >
              <div
                className="h-12 w-full"
                style={{ background: `var(${s.cssVar})` }}
                aria-label={s.name}
              />
              <div className="flex flex-col gap-0.5 p-2.5">
                <p className="text-body font-medium">{s.name}</p>
                <p className="text-caption">
                  <Code>{s.cssVar}</Code>
                </p>
                <p className="text-caption">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-h3">Type scale</h3>
        <div className="overflow-x-auto rounded-md border border-[var(--border)]">
          <table className="w-full text-body">
            <thead className="bg-[var(--surface-2)] text-caption uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Class</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Size / line-height · weight
                </th>
                <th className="px-3 py-2 text-left font-semibold">Use</th>
              </tr>
            </thead>
            <tbody>
              {typeRows.map(([cls, spec, use]) => (
                <tr key={cls} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">
                    <Code>{cls}</Code>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{spec}</td>
                  <td className="px-3 py-2 text-caption">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-overline">Specimens</p>
          <p className="text-display">Display</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-lead">
            Lead — used for intro paragraphs that introduce a section.
          </p>
          <p className="text-body">
            Body — the workhorse size, used for almost all paragraph copy.
          </p>
          <p className="text-caption">Caption — metadata, hints, helper text.</p>
          <p className="text-overline">Overline label</p>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] pt-6 text-caption">
      <p>
        AccessMap is built as undergraduate teaching material. It is a sibling
        of <em>accessguide</em>, the campus accessibility map for the
        University of Macedonia — sharing the goal but not the codebase.
      </p>
    </footer>
  );
}

function Section({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-overline">{kicker}</p>
        <h2 className="text-h1">{title}</h2>
        {lead && <p className="text-lead">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}
