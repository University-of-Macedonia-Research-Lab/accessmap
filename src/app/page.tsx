import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  Compass,
  Sparkles,
  Network,
  Code2,
  Workflow,
  Accessibility,
  KeyRound,
  Contrast,
  Hand,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const metadata = {
  title: "AccessMap — Indoor accessibility, drawn from data",
  description:
    "An educational walkthrough of accessibility on the web and in maps, the algorithms that power wayfinding, the data architecture behind a floor plan, and how to draw your own map.",
};

export default function Home() {
  return (
    <AppShell>
      <article className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <Hero />
        <Rail>
          <Stop n="01" topic="Web accessibility">
            <WebAccessibility />
          </Stop>
          <Stop n="02" topic="Map accessibility">
            <MapAccessibility />
          </Stop>
          <Stop n="03" topic="Architecture">
            <Architecture />
          </Stop>
          <Stop n="04" topic="Algorithms">
            <Algorithms />
          </Stop>
          <Stop n="05" topic="How to draw a map">
            <DrawingAMap />
          </Stop>
          <Stop n="06" topic="AI assistant">
            <AISection />
          </Stop>
        </Rail>
        <FinalCTA />
        <Footer />
      </article>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Rail — a route-themed vertical thread that connects every section, with   */
/*  the same halo + brand-line idiom we draw on the actual map. Hidden below  */
/*  md to keep it from crowding small screens.                                */
/* ────────────────────────────────────────────────────────────────────────── */

function Rail({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-label="The journey"
      className="relative mt-20 flex flex-col gap-24 md:mt-28 md:pl-20"
    >
      {/* Halo (white/dark stroke) */}
      <div
        aria-hidden
        className="pointer-events-none absolute hidden md:block"
        style={{
          left: "calc(2rem - 5px)",
          top: 0,
          bottom: 0,
          width: "10px",
          background: "var(--route-halo)",
          opacity: 0.55,
          borderRadius: "999px",
        }}
      />
      {/* Brand line on top */}
      <div
        aria-hidden
        className="pointer-events-none absolute hidden md:block"
        style={{
          left: "calc(2rem - 1.5px)",
          top: 0,
          bottom: 0,
          width: "3px",
          background:
            "linear-gradient(to bottom, var(--brand) 0%, var(--brand) 92%, transparent 100%)",
          borderRadius: "999px",
        }}
      />
      {/* Pillars float at the very top of the rail. */}
      <Pillars />
      {children}
    </section>
  );
}

function Stop({
  n,
  topic,
  children,
}: {
  n: string;
  topic: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Marker — drawn as a route endpoint (halo + filled brand circle), with
          the section number inside. Aligned to the Rail's vertical line. */}
      <div
        aria-hidden
        className="absolute hidden md:flex"
        style={{
          left: "calc(2rem - 22px)",
          top: "0.25rem",
          width: "44px",
          height: "44px",
          borderRadius: "999px",
          background: "var(--route-halo)",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "999px",
            background: "var(--brand)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {n}
        </div>
      </div>
      {/* Mobile-only mini chip so the section numbers stay legible without the rail. */}
      <span
        aria-hidden
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-overline md:hidden"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--brand)" }}
        />
        {n} · {topic}
      </span>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Hero                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative">
      {/* Soft brand-tinted glow behind the hero — sits beneath the article
          padding so the rest of the page reads on its neutral surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[420px] w-[120%] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, var(--brand-soft), transparent 70%)",
        }}
      />

      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col items-start gap-7">
          <BrandBadge />
          <h1 className="text-display max-w-[18ch] sm:text-[3.75rem] sm:leading-[1.05]">
            Indoor accessibility, drawn from data.
          </h1>
          <p className="text-lead max-w-[60ch]">
            AccessMap is a teaching project that explains, end to end, how a
            modern accessibility map is built — from the JSON that describes a
            floor, to the graph algorithms that route a wheelchair around a
            flight of stairs, to the AI assistant that answers{" "}
            <em>&ldquo;how do I get to room 404?&rdquo;</em> — using the same
            primitives you can read in the source.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/maps/demo-building/ground"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-body font-medium text-white shadow-[var(--shadow-card)] transition-[background,transform] hover:bg-[var(--brand-strong)] active:translate-y-px"
            >
              Open the live demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="https://github.com/University-of-Macedonia-Research-Lab/accessmap"
              className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-body font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
            >
              View on GitHub
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-caption">
            <Stat label="WCAG 2.2" value="AA" />
            <Stat label="Pathfinding" value="A* + Dijkstra" />
            <Stat label="Profiles" value="3 (default · wheelchair · low-vision)" />
            <Stat label="AI" value="Claude tool-use" />
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  // A stylised mini floor: outline, two rooms above a corridor, an elevator,
  // a stairwell, and the same route halo + brand stroke we draw on the
  // actual map. Themed via CSS vars so it tracks light/dark.
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-[var(--shadow-card)]"
      role="img"
      aria-label="Animated mini floor plan with a wheelchair-accessible route from the entrance to a classroom via the elevator"
    >
      {/* Decorative grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <svg viewBox="0 0 320 220" className="block h-auto w-full">
        {/* Floor base + exterior walls */}
        <rect
          x="14" y="14" width="292" height="192"
          fill="var(--floor-base)"
          stroke="var(--wall-exterior)"
          strokeWidth="3.5"
          rx="10"
        />
        {/* Rooms */}
        <rect x="26" y="26" width="120" height="74" fill="oklch(0.94 0.025 250)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="158" y="26" width="136" height="74" fill="oklch(0.93 0.04 80)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="26" y="120" width="86" height="86" fill="oklch(0.94 0.025 295)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="124" y="120" width="56" height="86" fill="oklch(0.93 0.06 65)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="192" y="120" width="56" height="86" fill="oklch(0.92 0.04 30)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="260" y="120" width="34" height="86" fill="oklch(0.93 0.05 150)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        {/* Corridor */}
        <rect x="26" y="100" width="268" height="20" fill="oklch(0.96 0.005 95)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.4" />
        {/* Windows on the north wall */}
        {[44, 84, 178, 224, 270].map((x, i) => (
          <line
            key={i}
            x1={x} y1="14" x2={x + 24} y2="14"
            stroke="var(--window-glass)"
            strokeWidth="3"
          />
        ))}
        {/* Labels */}
        <text x="86" y="65" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">101</text>
        <text x="226" y="65" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">Lab</text>
        <text x="69" y="167" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">Office</text>
        <text x="277" y="167" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">In</text>
        {/* Feature icons */}
        <g>
          <circle cx="152" cy="160" r="11" fill="var(--feature)" />
          <text x="152" y="164" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" fill="white">E</text>
        </g>
        <g>
          <circle cx="220" cy="160" r="11" fill="var(--feature)" />
          <text x="220" y="164" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" fill="white">S</text>
        </g>
        {/* Stairs edge — dashed red */}
        <line x1="220" y1="110" x2="220" y2="148" stroke="oklch(0.6 0.21 27 / 0.6)" strokeWidth="1.4" strokeDasharray="3 2" />
        {/* Route: entrance → corridor → elevator → into classroom 101 */}
        <g>
          <polyline
            points="277,160 277,110 152,110 152,148 86,148 86,63"
            fill="none"
            stroke="var(--route-halo)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="277,160 277,110 152,110 152,148 86,148 86,63"
            fill="none"
            stroke="var(--route)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Endpoints */}
          <circle cx="277" cy="160" r="6" fill="var(--route-halo)" />
          <circle cx="277" cy="160" r="3.5" fill="var(--route)" />
          <circle cx="86" cy="63" r="6" fill="var(--route-halo)" />
          <circle cx="86" cy="63" r="3.5" fill="var(--route)" />
        </g>
      </svg>
      {/* Caption strip mimicking a real-app overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/85 p-2.5 backdrop-blur-sm">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg text-white"
          style={{ background: "var(--brand)" }}
        >
          <Accessibility className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption text-[color:var(--foreground)]">
            <span className="font-semibold">Wheelchair</span> route · entrance
            → elevator → 101
          </p>
          <p className="truncate text-[11px] text-[color:var(--muted-foreground)]">
            Stairs blocked · 5 segments · cost 14.6
          </p>
        </div>
      </div>
    </div>
  );
}

function BrandBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-overline">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--brand)" }}
      />
      Teaching project
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-[color:var(--muted-foreground)]">{label}</span>
      <span className="mx-1.5 text-[color:var(--muted-foreground)]">·</span>
      <span className="text-[color:var(--foreground)]">{value}</span>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Pillars                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

function Pillars() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Pillar
        icon={<Workflow className="h-5 w-5" />}
        kicker="Data"
        title="Floors are JSON"
        body="A small, validated schema with rooms, doors, walls, and a graph. The renderer, router, and assistant all read the same structure."
      />
      <Pillar
        icon={<Network className="h-5 w-5" />}
        kicker="Routing"
        title="A* over a weighted graph"
        body="Edge cost scales with each user's profile. Stairs are infinity for wheelchairs; a ramp is a small surcharge. One algorithm, three answers."
      />
      <Pillar
        icon={<Sparkles className="h-5 w-5" />}
        kicker="Intelligence"
        title="Claude with two tools"
        body="The assistant calls find_room and find_route — the same library code the manual route picker uses. The map is in the cached system prompt."
      />
    </section>
  );
}

function Pillar({
  icon,
  kicker,
  title,
  body,
}: {
  icon: React.ReactNode;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]"
        style={{ background: "var(--brand-soft)" }}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-overline">{kicker}</p>
        <h3 className="text-h3">{title}</h3>
      </div>
      <p className="text-body text-[color:var(--muted-foreground)]">{body}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Web accessibility                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

function WebAccessibility() {
  const items = [
    {
      icon: <KeyRound className="h-5 w-5" />,
      title: "Keyboard navigable",
      body:
        "Every interactive element is reachable with Tab, operable with Enter / Space, and shows a visible focus ring. No mouse-only menus, no traps.",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Screen-reader friendly",
      body:
        "Semantic HTML first, ARIA only where the platform doesn't already convey meaning. Map controls expose roles and labels; the SVG carries an aria-label.",
    },
    {
      icon: <Contrast className="h-5 w-5" />,
      title: "Contrast that holds up",
      body:
        "Body text clears 4.5:1 against its surface; large text and UI states clear 3:1. Tested in light and dark modes — both ship.",
    },
    {
      icon: <Hand className="h-5 w-5" />,
      title: "Touch targets ≥ 44px",
      body:
        "Pills, buttons, and the map drawer trigger meet WCAG 2.5.5 target size. No 24×24 icon buttons hiding the only way to dismiss a modal.",
    },
  ];
  return (
    <Section
      kicker="Accessibility on the web"
      title="The product itself has to be reachable."
      lead="Before a map can route a wheelchair through a building, the page that hosts it has to be operable by a keyboard, parsable by a screen reader, and legible to someone with low vision. Those are the table stakes — WCAG 2.2 AA — and they're encoded in our component primitives, not bolted on at the end."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <FeatureCard key={it.title} {...it} />
        ))}
      </div>
      <Callout>
        <p>
          <strong className="font-semibold text-[color:var(--foreground)]">
            Why it matters in practice.
          </strong>{" "}
          About <span className="tabular-nums">15%</span> of the world&rsquo;s
          population lives with some form of disability (WHO,{" "}
          <em>World Report on Disability</em>). For most of them, web
          accessibility is not a feature — it&rsquo;s the difference between
          being able to enrol in a class and being locked out of one.
        </p>
      </Callout>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Map accessibility                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

function MapAccessibility() {
  return (
    <Section
      kicker="Accessibility on a map"
      title="A route that doesn't exist for everyone is the wrong route."
      lead="Most online maps treat the world as if everyone walks the same way. They don't. AccessMap routes per profile — encoding the constraints of mobility, vision, and sensory impairment as edge weights on the same graph — so the answer to “how do I get there?” is shaped by who is asking."
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-card)]">
        <table className="w-full text-body">
          <thead className="bg-[var(--surface-2)] text-overline">
            <tr>
              <th className="px-4 py-3 text-left">Feature on the path</th>
              <th className="px-4 py-3 text-left">Default</th>
              <th className="px-4 py-3 text-left">Wheelchair</th>
              <th className="px-4 py-3 text-left">Low vision</th>
            </tr>
          </thead>
          <tbody className="text-[color:var(--muted-foreground)]">
            {[
              ["Stairs", "1×", "blocked (∞)", "1.5×"],
              ["Step", "1×", "blocked (∞)", "1×"],
              ["Narrow passage", "1×", "3×", "1.5×"],
              ["Ramp", "1×", "1.1×", "1×"],
              ["Elevator", "1×", "1.2×", "1×"],
              ["Automatic door", "1×", "1×", "1×"],
            ].map(([feat, ...vals]) => (
              <tr
                key={feat as string}
                className="border-t border-[var(--border)]"
              >
                <td className="px-4 py-3 font-medium text-[color:var(--foreground)]">
                  {feat}
                </td>
                {vals.map((v, i) => (
                  <td key={i} className="px-4 py-3 tabular-nums">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-body text-[color:var(--muted-foreground)]">
        The numbers are knobs, not gospel — they're tuned for teaching. The
        principle is the load-bearing part: <em>same graph, different
        weights.</em> Adding a profile (deafblind, stroller, with-luggage) is
        a few lines in <code className="rounded bg-[var(--surface-2)] px-1 font-mono text-[0.85em]">PROFILES</code>{" "}
        — no schema change, no second renderer.
      </p>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Architecture                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

function Architecture() {
  return (
    <Section
      kicker="Architecture"
      title="One graph, three readers."
      lead="A floor is described as data — geometry plus a graph that lives alongside it. The renderer reads the geometry to draw, the pathfinder reads the graph to route, and the AI assistant reads both through tools. None of them duplicates the other."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <ArchitectureDiagram />
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-h3">The four primitives</h3>
          <DefList
            items={[
              [
                "Rooms",
                "Polygons in a flat 2-D coordinate frame. Each carries a kind (classroom, office, lab, …) and a bilingual name.",
              ],
              [
                "Doors",
                "Points on a wall shared by two rooms. The renderer marks them; the graph already encodes that connectivity, so doors are visual sugar, not routing data.",
              ],
              [
                "Nodes",
                "Vertices in the routing graph — placed at room centres, corridor junctions, and floor-changers (elevator, stairs). A node may carry feature tags that profiles weigh.",
              ],
              [
                "Edges",
                "Connections between nodes, each carrying its own feature tags. Edge cost = base distance × profile multiplier — Infinity blocks the edge entirely.",
              ],
            ]}
          />
          <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-caption leading-relaxed">
{`{
  "outline": [{ "x": 0, "y": 0 }, …],
  "walls":   [{ "kind": "window", … }],
  "rooms":   [{ "id": "room-101", "code": "101", "polygon": […] }],
  "nodes":   [{ "id": "n-elev", "features": ["elevator"],
                "connectsToFloor": { "floorSlug": "first", "nodeId": "n-elev" } }],
  "edges":   [{ "from": "c4", "to": "n-stair", "features": ["stairs"] }]
}`}
          </pre>
        </div>
      </div>
    </Section>
  );
}

function ArchitectureDiagram() {
  // Hand-laid out so every label is legible. Tokens reference our CSS vars.
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="text-h3">Geometry + graph</h3>
      <p className="text-caption">
        A simplified floor: two rooms either side of a corridor, an elevator, a
        stairwell, and the routing graph drawn on top.
      </p>
      <div className="overflow-hidden rounded-xl bg-[var(--surface-2)]">
        <svg
          viewBox="0 0 320 180"
          className="block h-auto w-full"
          role="img"
          aria-label="Architectural diagram showing rooms, doors, graph nodes, and edges"
        >
          {/* outline / floor base */}
          <rect
            x="10" y="10" width="300" height="160"
            fill="var(--floor-base)"
            stroke="var(--wall-exterior)"
            strokeWidth="3"
            rx="6"
          />

          {/* rooms */}
          <rect x="20" y="20" width="120" height="60" fill="oklch(0.94 0.025 250)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="180" y="20" width="120" height="60" fill="oklch(0.94 0.025 250)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="20" y="100" width="80" height="60" fill="oklch(0.94 0.025 295)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="120" y="100" width="60" height="60" fill="oklch(0.93 0.06 65)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="200" y="100" width="60" height="60" fill="oklch(0.92 0.04 30)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="280" y="100" width="20" height="60" fill="oklch(0.93 0.05 150)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />

          {/* corridor */}
          <rect x="20" y="80" width="280" height="20" fill="oklch(0.96 0.005 95)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.4" />

          {/* room labels */}
          <text x="80" y="55" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">101</text>
          <text x="240" y="55" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">102</text>
          <text x="60" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">Office</text>
          <text x="150" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">EL</text>
          <text x="230" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">ST</text>
          <text x="290" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9" fontWeight="500" fill="oklch(0.3 0.02 270)">In</text>

          {/* doors */}
          {[80, 240, 60, 150, 230, 290].map((x, i) => (
            <circle key={i} cx={x} cy={i < 2 ? 80 : 100} r="2.5" fill="white" stroke="oklch(0.5 0.02 270)" strokeWidth="0.5" />
          ))}

          {/* edges */}
          {/* corridor chain */}
          <line x1="60" y1="90" x2="290" y2="90" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          {/* connections */}
          <line x1="80" y1="90" x2="80" y2="50" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="240" y1="90" x2="240" y2="50" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="60" y1="90" x2="60" y2="130" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="150" y1="90" x2="150" y2="130" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="230" y1="90" x2="230" y2="130" stroke="oklch(0.6 0.21 27 / 0.6)" strokeWidth="1.2" strokeDasharray="3 2" />
          <line x1="290" y1="90" x2="290" y2="130" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />

          {/* nodes */}
          {[[80,50],[240,50],[60,130],[290,130],[80,90],[150,90],[230,90],[290,90]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="oklch(0.3 0.02 270)" />
          ))}

          {/* feature icons */}
          <circle cx="150" cy="130" r="9" fill="var(--feature)" />
          <text x="150" y="133" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="700" fill="white">E</text>
          <circle cx="230" cy="130" r="9" fill="var(--feature)" />
          <text x="230" y="133" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="700" fill="white">S</text>

          {/* highlighted route halo + line: entrance → corridor → elevator */}
          <g>
            <polyline
              points="290,130 290,90 150,90 150,130"
              fill="none"
              stroke="var(--route-halo)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="290,130 290,90 150,90 150,130"
              fill="none"
              stroke="var(--route)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="290" cy="130" r="4.5" fill="var(--route-halo)" />
            <circle cx="290" cy="130" r="2.5" fill="var(--route)" />
            <circle cx="150" cy="130" r="4.5" fill="var(--route-halo)" />
            <circle cx="150" cy="130" r="2.5" fill="var(--route)" />
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption">
        <Legend swatch="oklch(0.94 0.025 250)" label="Room polygon" />
        <Legend swatch="oklch(0.3 0.02 270)" label="Graph node" round />
        <Legend swatch="var(--feature)" label="Feature node (E/S)" round />
        <Legend swatch="var(--route)" label="Computed route" line />
        <Legend swatch="oklch(0.6 0.21 27)" label="Stairs edge (dashed)" line />
      </div>
    </div>
  );
}

function Legend({
  swatch,
  label,
  round,
  line,
}: {
  swatch: string;
  label: string;
  round?: boolean;
  line?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {line ? (
        <span className="h-0.5 w-4 rounded-full" style={{ background: swatch }} />
      ) : (
        <span
          className={"h-3 w-3 " + (round ? "rounded-full" : "rounded-sm")}
          style={{ background: swatch }}
        />
      )}
      {label}
    </span>
  );
}

function DefList({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="flex flex-col gap-3">
      {items.map(([term, def]) => (
        <div key={term} className="grid grid-cols-[6.5rem_1fr] gap-x-3">
          <dt className="text-body font-semibold">{term}</dt>
          <dd className="text-body text-[color:var(--muted-foreground)]">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Algorithms                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

function Algorithms() {
  return (
    <Section
      kicker="Algorithms"
      title="A* on a single floor, Dijkstra across them."
      lead="The pathfinder is small enough to read in one sitting. The interesting move is in the cost function — distance multiplied by the heaviest profile multiplier on the edge — which is what makes the same graph yield three different routes."
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <Card>
          <h3 className="text-h3">A* in plain terms</h3>
          <ul className="flex flex-col gap-2 text-body">
            <Bullet>
              <strong>Open set</strong> — nodes we've reached but not finished
              expanding. We always pop the one with the smallest{" "}
              <Code>f = g + h</Code>.
            </Bullet>
            <Bullet>
              <strong>g(n)</strong> — best-known cost to reach{" "}
              <Code>n</Code> from the start.
            </Bullet>
            <Bullet>
              <strong>h(n)</strong> — straight-line distance from{" "}
              <Code>n</Code> to the goal. Admissible because every edge cost
              is at least its straight-line length, so we never overestimate.
            </Bullet>
            <Bullet>
              <strong>Reconstruction</strong> — once the goal is popped, follow{" "}
              <Code>cameFrom</Code> backwards to recover the path.
            </Bullet>
          </ul>
          <Callout muted>
            For multi-floor routing the heuristic is{" "}
            <Code>0</Code> — Euclidean distance doesn&rsquo;t generalise across
            floors, and falling back to Dijkstra is correct and trivially fast
            for floor-plan-sized graphs.
          </Callout>
        </Card>

        <Card>
          <h3 className="text-h3">Edge cost, in code</h3>
          <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-caption leading-relaxed">
{`function edgeMultiplier(features, profile) {
  let m = 1;
  for (const f of features) {
    const w = profile.weights[f];
    if (w === undefined) continue;
    if (w === Infinity) return Infinity;   // blocks edge
    if (w > m) m = w;                      // worst-case
  }
  return m;
}

const cost = baseDistance * edgeMultiplier(edge.features, profile);`}
          </pre>
          <p className="text-caption">
            <em>Why the worst case?</em> An edge tagged{" "}
            <Code>narrow_passage</Code> AND <Code>step</Code> should be as bad
            as the worse of the two for the chosen profile — never softened by
            averaging. That single rule keeps profile composition predictable
            as you add features.
          </p>
        </Card>
      </div>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  How to draw a map                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

function DrawingAMap() {
  const steps: Array<{ n: string; title: string; body: React.ReactNode }> = [
    {
      n: "01",
      title: "Pick a coordinate frame",
      body: (
        <>
          A flat 2-D plane, no real-world projection. Pick a unit (we use
          “1 unit ≈ 0.1 m”) and a bounding box. <Code>{"{ minX, minY, maxX, maxY }"}</Code>{" "}
          becomes the SVG viewBox.
        </>
      ),
    },
    {
      n: "02",
      title: "Trace the building outline",
      body: (
        <>
          A polygon describing the exterior wall. The renderer uses it for the
          floor base fill and the heavy exterior stroke; cuts in that stroke
          are <Code>walls</Code> tagged <Code>window</Code>.
        </>
      ),
    },
    {
      n: "03",
      title: "Cut the floor into rooms",
      body: (
        <>
          Each room is a polygon plus a kind (classroom, office, lab,
          stairwell, …). Adjacent rooms share an edge — that edge is the wall
          between them, and the <Code>door</Code> placed on it is where you
          can pass.
        </>
      ),
    },
    {
      n: "04",
      title: "Drop graph nodes",
      body: (
        <>
          One per room (the centroid, usually) and a chain along corridors.
          Tag the elevator and stairwell nodes with{" "}
          <Code>features: [&quot;elevator&quot;]</Code> /{" "}
          <Code>[&quot;stairs&quot;]</Code> and link them to the equivalent
          node on adjacent floors via <Code>connectsToFloor</Code>.
        </>
      ),
    },
    {
      n: "05",
      title: "Wire edges",
      body: (
        <>
          Connect nodes that you can walk between in a straight line without
          crossing a wall. Tag with the features the path actually carries —
          <Code>stairs</Code>, <Code>narrow_passage</Code>, <Code>ramp</Code>{" "}
          — and the profile system does the rest.
        </>
      ),
    },
    {
      n: "06",
      title: "Validate & ship",
      body: (
        <>
          Drop the file under <Code>src/data/maps/&lt;building&gt;/&lt;floor&gt;.json</Code>.
          Zod parses it on load — wrong shape, fast failure. The home page,
          floor switcher, and assistant pick it up automatically.
        </>
      ),
    },
  ];
  return (
    <Section
      kicker="How to draw a map"
      title="JSON in, top-view floor plan out."
      lead="Authoring a new floor is six small decisions, in order. None of them require a graphics tool — the renderer composes the SVG from the JSON at runtime."
    >
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((s) => (
          <li
            key={s.n}
            className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]"
          >
            <span className="text-overline text-[color:var(--brand)]">
              Step {s.n}
            </span>
            <h3 className="text-h3">{s.title}</h3>
            <p className="text-body text-[color:var(--muted-foreground)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  AI                                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

function AISection() {
  return (
    <Section
      kicker="AI assistant"
      title="A wayfinder that doesn't make up rooms."
      lead="The assistant is Claude Opus 4.7 with adaptive thinking and exactly two tools — find_room and find_route — both of which call the same library code the manual route picker uses. The model never has to invent a node id or a path; it asks."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]" style={{ background: "var(--brand-soft)" }}>
            <Code2 className="h-5 w-5" />
          </span>
          <h3 className="text-h3">Tools, not prompts</h3>
          <p className="text-body text-[color:var(--muted-foreground)]">
            Tool inputs are typed with Zod. The runner handles the agent loop,
            so the API code is &lt; 200 lines. When <Code>find_route</Code>{" "}
            succeeds, the same path object the UI&rsquo;s manual picker uses
            gets piped back to the map.
          </p>
        </Card>
        <Card>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]" style={{ background: "var(--brand-soft)" }}>
            <Compass className="h-5 w-5" />
          </span>
          <h3 className="text-h3">Cached map data</h3>
          <p className="text-body text-[color:var(--muted-foreground)]">
            The whole building&rsquo;s JSON sits in the system prompt with a{" "}
            <Code>cache_control: ephemeral</Code> breakpoint. The first turn
            writes the cache; every turn after that reads it back at roughly a
            tenth of the price.
          </p>
        </Card>
      </div>
    </Section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Final CTA                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section
      className="relative mt-24 flex flex-col items-start gap-5 rounded-3xl border border-[var(--border)] p-8 shadow-[var(--shadow-card)] sm:p-12"
      style={{ background: "var(--brand-soft)" }}
    >
      {/* Tail of the rail descends into this CTA, ending in a route endpoint
          to visually close the journey. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 hidden md:block"
        style={{ left: "calc(50% - 1.5px)", width: "3px", height: "96px" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 0%, var(--brand) 30%, var(--brand) 100%)",
            borderRadius: "999px",
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-3 hidden md:block"
        style={{
          left: "calc(50% - 9px)",
          width: "18px",
          height: "18px",
          borderRadius: "999px",
          background: "var(--route-halo)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "4px",
            borderRadius: "999px",
            background: "var(--brand)",
          }}
        />
      </div>

      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-white">
        <Accessibility className="h-5 w-5" />
      </span>
      <h2 className="text-h1 max-w-[24ch]">
        Now route a wheelchair around a flight of stairs.
      </h2>
      <p className="text-lead max-w-[60ch]">
        Open the demo, switch the profile to <em>Wheelchair</em>, ask the
        assistant to take you from the entrance to the lecture hall on the
        first floor — and watch the route pick the elevator over the
        stairwell.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/maps/demo-building/ground"
          className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-body font-medium text-white shadow-[var(--shadow-card)] transition-[background,transform] hover:bg-[var(--brand-strong)] active:translate-y-px"
        >
          Open the demo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-body font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
        >
          Read the technical reference
        </Link>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Footer                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-16 flex flex-col gap-3 border-t border-[var(--border)] pt-8 text-caption">
      <p className="text-body text-[color:var(--muted-foreground)]">
        AccessMap is a sibling of <em>accessguide</em> — the campus
        accessibility map for the University of Macedonia — built as
        undergraduate teaching material. It is not a production navigation
        product.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
          <Users className="h-3.5 w-3.5" /> Open-source on GitHub
        </span>
        <span className="text-[color:var(--muted-foreground)]">·</span>
        <Link href="/about" className="text-[color:var(--brand)] hover:underline">
          Style guide & technical reference
        </Link>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Shared primitives                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

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
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-overline text-[color:var(--brand)]">{kicker}</p>
        <h2 className="text-h1 max-w-[24ch]">{title}</h2>
        {lead && <p className="text-lead max-w-[60ch]">{lead}</p>}
      </header>
      {children}
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]"
        style={{ background: "var(--brand-soft)" }}
      >
        {icon}
      </span>
      <h3 className="text-h3">{title}</h3>
      <p className="text-body text-[color:var(--muted-foreground)]">{body}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
      {children}
    </div>
  );
}

function Callout({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl border-l-4 p-4 text-body " +
        (muted
          ? "border-[var(--border)] bg-[var(--surface-2)] text-[color:var(--muted-foreground)]"
          : "border-[var(--brand)] bg-[var(--brand-soft)] text-[color:var(--foreground)]")
      }
    >
      {children}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "var(--brand)" }}
        aria-hidden="true"
      />
      <span className="text-[color:var(--muted-foreground)] [&_strong]:text-[color:var(--foreground)]">
        {children}
      </span>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}
