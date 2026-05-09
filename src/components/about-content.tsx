"use client";

/**
 * About page — long-form technical reference.
 *
 * Layout: Docusaurus-style two-column on lg+ (article + sticky right TOC).
 * Single-column on smaller screens. Each numbered section uses the same
 * design language as the home page: brand-coloured plate numeral,
 * fading hairline accent, corner ornaments — so the two surfaces feel
 * like one document.
 */
import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/i18n";
import { useScrollSpy } from "@/lib/use-scroll-spy";

type SectionKey =
  | "schema"
  | "drawing"
  | "routing"
  | "multi-floor"
  | "profiles"
  | "assistant"
  | "stack"
  | "design";

type SectionEntry = {
  key: SectionKey;
  n: string;
  topicEn: string;
  topicEl: string;
};

const SECTIONS: SectionEntry[] = [
  { key: "schema", n: "01", topicEn: "Schema", topicEl: "Σχήμα" },
  { key: "drawing", n: "02", topicEn: "Drawing", topicEl: "Σχεδίαση" },
  { key: "routing", n: "03", topicEn: "Routing", topicEl: "Δρομολόγηση" },
  { key: "multi-floor", n: "04", topicEn: "Multi-floor", topicEl: "Πολλαπλοί όροφοι" },
  { key: "profiles", n: "05", topicEn: "Profiles", topicEl: "Προφίλ" },
  { key: "assistant", n: "06", topicEn: "Assistant", topicEl: "Βοηθός" },
  { key: "stack", n: "07", topicEn: "Stack", topicEl: "Στοίβα" },
  { key: "design", n: "08", topicEn: "Design system", topicEl: "Σχεδιαστικό σύστημα" },
];

const SECTION_IDS = SECTIONS.map((s) => s.key) as readonly string[];

export function AboutContent() {
  const active = useScrollSpy(SECTION_IDS) as SectionKey | null;
  return (
    <AppShell>
      <article className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Backdrop />
        <Hero />
        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
          <main className="flex min-w-0 flex-col gap-20">
            <SchemaSection isActive={active === "schema"} />
            <DrawingSection isActive={active === "drawing"} />
            <RoutingSection isActive={active === "routing"} />
            <MultiFloorSection isActive={active === "multi-floor"} />
            <ProfilesSection isActive={active === "profiles"} />
            <AssistantSection isActive={active === "assistant"} />
            <StackSection isActive={active === "stack"} />
            <DesignSection isActive={active === "design"} />
            <Footer />
          </main>
          <aside className="hidden lg:block">
            <Toc active={active} />
          </aside>
        </div>
      </article>
    </AppShell>
  );
}


/* ─── Backdrop ────────────────────────────────────────────────────────────── */

function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
        backgroundSize: "26px 26px",
        opacity: 0.04,
      }}
    />
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */

function Hero() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Σχετικά με το AccessMap",
        title: "Εσωτερική προσβασιμότητα, σχεδιασμένη από δεδομένα.",
        lead:
          "Μια ολοκληρωμένη αναφορά για το πώς δουλεύει το AccessMap, από το JSON ενός ορόφου, μέχρι τη δρομολόγηση ανά προφίλ και τον βοηθό που χρησιμοποιεί εργαλεία. Διαβάζεται σε ένα απόγευμα.",
        ctaDemo: "Άνοιγμα demo",
        ctaGitHub: "Πηγή στο GitHub",
      }
    : {
        kicker: "About AccessMap",
        title: "Indoor accessibility, drawn from data.",
        lead:
          "A complete technical reference for how AccessMap works: the floor JSON, the per-profile routing, and the tool-using assistant. Readable in an afternoon.",
        ctaDemo: "Open the demo",
        ctaGitHub: "Source on GitHub",
      };
  return (
    <section
      className="relative isolate overflow-hidden rounded-3xl border border-[var(--border)] p-7 shadow-[var(--shadow-card)] sm:p-10 md:p-14"
      style={{
        background:
          "linear-gradient(180deg, var(--brand-soft) 0%, var(--background) 100%)",
      }}
    >
      <SectionOrnament position="tr" />
      <div className="relative flex flex-col items-start gap-5">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1 text-overline backdrop-blur-sm">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--brand)" }}
          />
          {t.kicker}
        </span>
        <h1 className="text-display max-w-[20ch]">{t.title}</h1>
        <p className="text-lead max-w-[58ch]">{t.lead}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/maps/demo-building/ground"
            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-body font-medium text-white shadow-[var(--shadow-card)] transition-[background,transform] hover:bg-[var(--brand-strong)] active:translate-y-px"
          >
            {t.ctaDemo}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="https://github.com/University-of-Macedonia-Research-Lab/accessmap"
            className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/80 px-4 py-2.5 text-body font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
          >
            {t.ctaGitHub}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

function Toc({ active }: { active: SectionKey | null }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  return (
    <nav
      aria-label={isEl ? "Πίνακας περιεχομένων" : "On this page"}
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
    >
      <p className="text-overline">{isEl ? "Σε αυτή τη σελίδα" : "On this page"}</p>
      <ul className="mt-3 flex flex-col gap-0.5 border-l border-[var(--border)] pl-3">
        {SECTIONS.map((s) => {
          const isActive = active === s.key;
          return (
            <li key={s.key} className="relative">
              {isActive && (
                <span
                  aria-hidden
                  className="absolute -left-[13px] top-1.5 bottom-1.5 w-[2px] rounded-r"
                  style={{ background: "var(--brand)" }}
                />
              )}
              <a
                href={`#${s.key}`}
                className={
                  "flex items-baseline gap-2 rounded-md py-1.5 pr-2 text-caption transition-colors " +
                  (isActive
                    ? "text-[color:var(--brand)]"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]")
                }
              >
                <span className="font-mono text-[0.7rem] tabular-nums opacity-70">
                  {s.n}
                </span>
                <span className={isActive ? "font-medium" : ""}>
                  {isEl ? s.topicEl : s.topicEn}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-caption text-[color:var(--muted-foreground)]">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="hover:text-[color:var(--foreground)]"
        >
          {isEl ? "Επιστροφή στην αρχή" : "Back to top"} ↑
        </a>
      </p>
    </nav>
  );
}

/* ─── Numbered section primitives ─────────────────────────────────────────── */

function NumberedSection({
  id,
  n,
  topic,
  title,
  lead,
  ornament = "tl",
  isActive = false,
  children,
}: {
  id: SectionKey;
  n: string;
  topic: string;
  title: string;
  lead?: ReactNode;
  ornament?: "tl" | "tr" | "bl" | "br";
  isActive?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      // Offset for the sticky 64px header + breathing room on anchor jumps.
      // `pt-6` keeps the big plate numeral from sitting on top of a top-
      // anchored corner ornament; bottom-anchored ornaments don't conflict
      // but the extra padding stays harmless.
      className="relative scroll-mt-24 flex flex-col gap-6 pt-6"
    >
      {/* Active-section indicator: a thin brand bar to the left of the
          section, only visible when this section is the one in the
          scroll-spy band. Positioned outside the content flow so the
          layout doesn't shift when active state changes. */}
      <span
        aria-hidden
        className="absolute -left-4 top-1 hidden w-[3px] rounded-full transition-opacity duration-300 md:block"
        style={{
          background: "var(--brand)",
          height: "5.5rem",
          opacity: isActive ? 1 : 0,
        }}
      />
      <SectionOrnament position={ornament} />
      <header className="flex flex-col gap-3">
        <NumberedKicker n={n} topic={topic} isActive={isActive} />
        <h2 className="text-h1 max-w-[26ch]">{title}</h2>
        {lead && <p className="text-lead max-w-[60ch]">{lead}</p>}
      </header>
      {children}
    </section>
  );
}

function NumberedKicker({
  n,
  topic,
  isActive = false,
}: {
  n: string;
  topic: string;
  isActive?: boolean;
}) {
  return (
    <div className="flex items-end gap-4">
      <span
        aria-hidden
        className="font-bold tabular-nums leading-[0.78] tracking-[-0.05em] transition-[filter] duration-300"
        style={{
          color: "var(--brand)",
          fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
          // Subtle glow on the plate numeral when active — works as a
          // peripheral cue without being loud.
          filter: isActive
            ? "drop-shadow(0 0 18px color-mix(in oklab, var(--brand), transparent 70%))"
            : "none",
        }}
      >
        {n}
      </span>
      <span className="flex flex-1 flex-col gap-1.5 pb-2">
        <span className="text-overline text-[color:var(--brand)]">{topic}</span>
        <span
          aria-hidden
          className="h-px w-full transition-[background] duration-500"
          style={{
            background: isActive
              ? "linear-gradient(to right, var(--brand) 0%, var(--brand) 100%, transparent 100%)"
              : "linear-gradient(to right, var(--brand) 0%, var(--brand) 36%, transparent 100%)",
            opacity: isActive ? 0.85 : 0.5,
          }}
        />
      </span>
    </div>
  );
}

function SectionOrnament({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const anchors: Record<typeof position, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };
  let bracket = "";
  let dots: Array<[number, number]> = [];
  switch (position) {
    case "tl":
      bracket = "M2,22 L2,2 L22,2";
      dots = [[34, 6], [42, 6], [50, 6]];
      break;
    case "tr":
      bracket = "M62,22 L62,2 L42,2";
      dots = [[14, 6], [22, 6], [30, 6]];
      break;
    case "bl":
      bracket = "M2,42 L2,62 L22,62";
      dots = [[34, 58], [42, 58], [50, 58]];
      break;
    case "br":
      bracket = "M62,42 L62,62 L42,62";
      dots = [[14, 58], [22, 58], [30, 58]];
      break;
  }
  return (
    <svg
      aria-hidden
      className={
        "pointer-events-none absolute hidden h-12 w-12 md:block " +
        anchors[position]
      }
      viewBox="0 0 64 64"
      style={{ color: "var(--brand)", opacity: 0.32 }}
    >
      <path
        d={bracket}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="currentColor" />
      ))}
    </svg>
  );
}

/* ─── 01 Schema ───────────────────────────────────────────────────────────── */

function SchemaSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        topic: "Σχήμα",
        title: "Οι όροφοι είναι JSON, όχι έργα τέχνης",
        lead:
          "Κάθε όροφος είναι ένα έγγραφο JSON με δωμάτια, πόρτες και γράφημα δρομολόγησης. Ο σχεδιαστής διασχίζει το έγγραφο για να φτιάξει το SVG· ο αλγόριθμος εύρεσης διαδρομής διασχίζει το ίδιο γράφημα για να σχεδιάσει διαδρομές. Η προσθήκη νέου ορόφου σημαίνει ένα νέο αρχείο JSON, όχι επεξεργασία γραφικών.",
        body: (
          <>
            Ένας όροφος αναφέρει τα δωμάτια ως 2-D πολύγωνα σε επίπεδο σύστημα
            συντεταγμένων, τις πόρτες ως σημεία σε κοινούς τοίχους, και ένα
            γράφημα κόμβων και ακμών που ζει δίπλα στη γεωμετρία. Οι ακμές
            φέρουν feature tags όπως <Code>stairs</Code>, <Code>elevator</Code>,
            {" "}
            <Code>ramp</Code>, ή <Code>narrow_passage</Code>, ώστε να μπορούμε
            να τα ξανα-σταθμίζουμε ανά προφίλ.
          </>
        ),
        source: (
          <>
            Πηγή σχήματος: <Code>src/lib/map/schema.ts</Code>, ένα Zod σχήμα που
            επικυρώνει το JSON και εξάγει τους αντίστοιχους τύπους TypeScript.
          </>
        ),
      }
    : {
        topic: "Schema",
        title: "Floors are JSON, not artwork",
        lead:
          "Every floor is a JSON document with rooms, doors, and a routing graph. The renderer walks that document to draw SVG; the pathfinder walks the same graph to plan routes. Adding a new floor means writing a new JSON file, not editing artwork.",
        body: (
          <>
            A floor lists rooms as 2-D polygons in a flat coordinate frame,
            doors as points on shared walls, and a graph of nodes and edges
            that lives alongside the geometry. Edges carry feature tags like{" "}
            <Code>stairs</Code>, <Code>elevator</Code>, <Code>ramp</Code>, or{" "}
            <Code>narrow_passage</Code> so we can reweight them per-profile.
          </>
        ),
        source: (
          <>
            Schema source: <Code>src/lib/map/schema.ts</Code>, a Zod schema
            that validates the JSON and exports the matching TypeScript types.
          </>
        ),
      };
  return (
    <NumberedSection id="schema" n="01" topic={t.topic} title={t.title} lead={t.lead} ornament="tr" isActive={isActive}>
      <p className="text-body">{t.body}</p>
      <CodeBlock>
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
      </CodeBlock>
      <p className="text-caption">{t.source}</p>
    </NumberedSection>
  );
}

/* ─── 02 Drawing ──────────────────────────────────────────────────────────── */

function DrawingSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        topic: "Σχεδίαση",
        title: "Μοιάζει με αληθινή κάτοψη",
        lead:
          "Ο σχεδιαστής συνθέτει το SVG με τη σειρά που θα ζωγράφιζε ένας αρχιτέκτονας: βάση ορόφου, γέμισμα δωματίων, εσωτερικά διαφράγματα, εξωτερικό κέλυφος, παράθυρα, πόρτες, και τέλος ετικέτες και διαδρομή από πάνω.",
        items: [
          { strong: "Outline", body: ", ένα προαιρετικό πολύγωνο για το εξωτερικό όριο του κτιρίου, σχεδιασμένο ως γεμισμένη «βάση ορόφου» με χοντρό περίγραμμα στις άκρες." },
          { strong: "Walls", body: (<>, τμήματα γραμμής με tag <Code>exterior</Code>, <Code>interior</Code>, ή <Code>window</Code>. Τα παράθυρα εμφανίζονται ως κυανό τζάμι πάνω στο μελάνι του τοίχου.</>) },
          { strong: "Routes", body: ", σχεδιασμένες δύο φορές: μία χοντρή στο χρώμα του φόντου ως άλω και μία στο χρώμα του brand από πάνω. Είναι το ίδιο τέχνασμα που χρησιμοποιούν Google Maps και Apple Maps και κρατά τη γραμμή ευανάγνωστη πάνω σε κάθε γέμισμα δωματίου." },
        ],
      }
    : {
        topic: "Drawing",
        title: "It looks like a real floor plan",
        lead:
          "The renderer composes the SVG in the same order an architect would draw the plan: floor base, room fills, interior partitions, exterior shell, windows, doors, then labels and route on top.",
        items: [
          { strong: "Outline", body: ", an optional polygon for the building's exterior boundary, drawn as a filled “floor base” with a thick stroke around its edges." },
          { strong: "Walls", body: (<>, line segments tagged <Code>exterior</Code>, <Code>interior</Code>, or <Code>window</Code>. Windows render as a cyan glass cut over the wall ink.</>) },
          { strong: "Routes", body: ", drawn twice: once thick in the page background colour as a halo, once in the brand colour on top. That's the same trick Google Maps and Apple Maps use, and it keeps the line readable on top of any room fill." },
        ],
      };
  return (
    <NumberedSection id="drawing" n="02" topic={t.topic} title={t.title} lead={t.lead} ornament="tl" isActive={isActive}>
      <ul className="flex flex-col gap-2 text-body">
        {t.items.map((it, i) => (
          <Bullet key={i}>
            <strong>{it.strong}</strong>
            {it.body}
          </Bullet>
        ))}
      </ul>
    </NumberedSection>
  );
}

/* ─── 03 Routing ──────────────────────────────────────────────────────────── */

function RoutingSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        topic: "Δρομολόγηση",
        title: "A* σε γράφημα με βάρη",
        lead:
          "Όταν ο όροφος είναι γράφημα, η εύρεση διαδρομής γίνεται μια κλασική αναζήτηση A*. Η ευρετική είναι απλή ευθεία απόσταση, το κόστος ακμής είναι το βασικό μήκος επί έναν πολλαπλασιαστή προφίλ, και το Infinity μπλοκάρει εντελώς μια ακμή.",
        items: [
          { label: "Ευρετική:", body: " ευθεία απόσταση προς τον στόχο. Παραδεκτή, καθώς κάθε κόστος ακμής είναι τουλάχιστον όσο η ευθεία απόσταση." },
          { label: "Συνάρτηση κόστους:", body: (<> <Code>baseCost × max(profile.multiplier[feature])</Code> πάνω στα feature tags της ακμής.</>) },
          { label: "Ουρά προτεραιότητας:", body: " γραμμική σάρωση του open set. Επαρκής για διδακτικά γραφήματα και κατόψεις. Θα ήταν το πρώτο πράγμα που θα αντικαθιστούσαμε για παραγωγική χρήση." },
        ],
        source: (
          <>
            Πηγή: <Code>src/lib/map/pathfind.ts</Code>, περίπου 100 γραμμές, με
            το <Code>pathfind.test.ts</Code> δίπλα της.
          </>
        ),
      }
    : {
        topic: "Routing",
        title: "A* over a weighted graph",
        lead:
          "Once a floor is a graph, finding a route is a textbook A* search. The heuristic is plain Euclidean distance, the cost of an edge is its base length times a profile multiplier, and Infinity blocks an edge entirely.",
        items: [
          { label: "Heuristic:", body: " straight-line distance to the goal. Admissible because every edge cost is at least its straight-line length." },
          { label: "Cost function:", body: (<> <Code>baseCost × max(profile.multiplier[feature])</Code> over the edge's feature tags.</>) },
          { label: "Priority queue:", body: " a linear scan over the open set. Fine for teaching graphs and floor-plan-sized inputs; would be the first thing to swap in for a real deployment." },
        ],
        source: (
          <>
            Source: <Code>src/lib/map/pathfind.ts</Code>, about 100 lines, with{" "}
            <Code>pathfind.test.ts</Code> next to it.
          </>
        ),
      };
  return (
    <NumberedSection id="routing" n="03" topic={t.topic} title={t.title} lead={t.lead} ornament="tr" isActive={isActive}>
      <ul className="flex flex-col gap-2 text-body">
        {t.items.map((it, i) => (
          <Bullet key={i}>
            <strong>{it.label}</strong>
            {it.body}
          </Bullet>
        ))}
      </ul>
      <p className="text-caption">{t.source}</p>
    </NumberedSection>
  );
}

/* ─── 04 Multi-floor ──────────────────────────────────────────────────────── */

function MultiFloorSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        topic: "Πολλαπλοί όροφοι",
        title: "Ένα γράφημα, πολλοί όροφοι",
        lead:
          "Ένας κόμβος με `connectsToFloor` γίνεται μια ακμή ανάμεσα σε ορόφους. Ο αλγόριθμος εύρεσης διαδρομής φτιάχνει ένα ενοποιημένο γράφημα με κλειδί `floor:node` και τρέχει Dijkstra πάνω του: ίδιος κώδικας για περπάτημα ενός ορόφου και για διέλευση πέντε.",
        items: [
          (<>Οι ακμές ανάμεσα σε ορόφους κληρονομούν τα features του κόμβου-πηγής. Ένας σύνδεσμος <Code>n-elev</Code> ↔ <Code>n-elev</Code> φέρει <Code>elevator</Code>, οπότε το προφίλ αμαξιδίου εφαρμόζει την ίδια μικρή επιβάρυνση που θα έβαζε σε μια ακμή ασανσέρ μέσα σε όροφο, και ένας σύνδεσμος σκάλας μπλοκάρεται με τον ίδιο τρόπο.</>),
          (<>Το αποτέλεσμα είναι μια λίστα τμημάτων ανά όροφο. Το UI δείχνει το τμήμα του τρέχοντος ορόφου με την άλω της διαδρομής και προσφέρει συντόμευση για να μεταβείτε στον επόμενο όροφο όπου συνεχίζει η διαδρομή.</>),
          (<>Η ευρετική είναι <Code>0</Code> (Dijkstra), αφού η ευρετική A* με ευθεία απόσταση δεν γενικεύει σε ορόφους. Τα γραφήματα μεγέθους κάτοψης είναι μικρά, οπότε παραμένει ασήμαντα γρήγορο.</>),
        ],
        source: (
          <>
            Πηγή: <Code>src/lib/map/multi-pathfind.ts</Code>, με το{" "}
            <Code>multi-pathfind.test.ts</Code> να καλύπτει τις περιπτώσεις
            ανάμεσα σε ορόφους.
          </>
        ),
      }
    : {
        topic: "Multi-floor",
        title: "One graph, many floors",
        lead:
          "A node with `connectsToFloor` becomes a cross-floor edge. The pathfinder builds a single unified graph keyed by `floor:node` and runs Dijkstra over it: same code path for a one-floor walk and a five-floor traversal.",
        items: [
          (<>Cross-floor edges inherit the source node's features. An <Code>n-elev</Code> ↔ <Code>n-elev</Code> link carries <Code>elevator</Code>, so the wheelchair profile applies the same slight surcharge it would on an in-floor elevator edge, and a stairs link is hard-blocked the same way.</>),
          (<>The result is a list of per-floor segments. The UI shows the current floor's segment with the route halo and offers a shortcut to switch to the next floor where the route continues.</>),
          (<>Heuristic is <Code>0</Code> (Dijkstra) since A*'s euclidean heuristic doesn't generalise across floors. Floor-plan-sized graphs are tiny, so this stays trivially fast.</>),
        ],
        source: (
          <>
            Source: <Code>src/lib/map/multi-pathfind.ts</Code>, with{" "}
            <Code>multi-pathfind.test.ts</Code> covering the cross-floor cases.
          </>
        ),
      };
  return (
    <NumberedSection id="multi-floor" n="04" topic={t.topic} title={t.title} lead={t.lead} ornament="bl" isActive={isActive}>
      <ul className="flex flex-col gap-2 text-body">
        {t.items.map((it, i) => (
          <Bullet key={i}>{it}</Bullet>
        ))}
      </ul>
      <p className="text-caption">{t.source}</p>
    </NumberedSection>
  );
}

/* ─── 05 Profiles ─────────────────────────────────────────────────────────── */

function ProfilesSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const rows: Array<[string, string, string, string]> = [
    ["stairs", "1×", isEl ? "∞ (αποκλεισμένο)" : "∞ (blocked)", "1.5×"],
    ["step", "1×", isEl ? "∞ (αποκλεισμένο)" : "∞ (blocked)", "1×"],
    ["narrow_passage", "1×", "3×", "1.5×"],
    ["ramp", "1×", "1.1×", "1×"],
    ["elevator", "1×", "1.2×", "1×"],
  ];
  const t = isEl
    ? {
        topic: "Προφίλ",
        title: "Τα προφίλ αλλάζουν το κόστος, όχι το γράφημα",
        lead:
          "Το ίδιο γράφημα δίνει διαφορετικές διαδρομές για διαφορετικούς χρήστες. Κάθε προφίλ είναι μια αντιστοίχιση από feature tag σε πολλαπλασιαστή βάρους. Βάλτε ένα feature στο ∞ και κάθε ακμή με αυτό το tag βγαίνει από την αναζήτηση.",
        h1: "Feature",
        h2: "Default",
        h3: "Αμαξίδιο",
        h4: "Άτομο με προβλήματα όρασης",
      }
    : {
        topic: "Profiles",
        title: "Profiles change the cost, not the graph",
        lead:
          "The same map graph yields different routes for different users. Each profile is a map from feature tag to weight multiplier. Set a feature to ∞ and any edge with that tag drops out of the search.",
        h1: "Feature",
        h2: "Default",
        h3: "Wheelchair",
        h4: "Visually impaired",
      };
  return (
    <NumberedSection id="profiles" n="05" topic={t.topic} title={t.title} lead={t.lead} ornament="tl" isActive={isActive}>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-card)]">
        <table className="w-full text-body">
          <thead className="bg-[var(--surface-2)] text-overline">
            <tr>
              <th className="px-4 py-3 text-left">{t.h1}</th>
              <th className="px-4 py-3 text-left">{t.h2}</th>
              <th className="px-4 py-3 text-left">{t.h3}</th>
              <th className="px-4 py-3 text-left">{t.h4}</th>
            </tr>
          </thead>
          <tbody className="text-[color:var(--muted-foreground)]">
            {rows.map(([feat, ...vals]) => (
              <tr key={feat} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium text-[color:var(--foreground)]">
                  <Code>{feat}</Code>
                </td>
                {vals.map((v, i) => (
                  <td key={i} className="px-4 py-3 tabular-nums">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NumberedSection>
  );
}

/* ─── 06 Assistant ────────────────────────────────────────────────────────── */

function AssistantSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        topic: "Βοηθός",
        title: "Δύο εργαλεία και ένα cached prompt",
        lead:
          "Ο βοηθός εκθέτει ακριβώς δύο εργαλεία: find_room και find_route. Και τα δύο είναι λεπτά περιτυλίγματα γύρω από τον κώδικα αναζήτησης και δρομολόγησης που ήδη τρέχει στην εφαρμογή. Δεν υπάρχει παράλληλη υλοποίηση.",
        items: [
          { strong: "JSON χάρτη στο system prompt", body: (<>, σημειωμένο με <Code>cache_control: ephemeral</Code>. Ο πρώτος γύρος γράφει την cache· οι επόμενοι τη διαβάζουν στο περίπου ένα δέκατο του κόστους.</>) },
          { strong: "Βρόχος του tool runner", body: (<> από το επίσημο SDK. Ο βρόχος, η εκτέλεση εργαλείων και η διαχείριση αποτελεσμάτων είναι όλα στο <Code>client.beta.messages.toolRunner()</Code>.</>) },
          { strong: "Captured διαδρομή:", body: (<> όταν το <Code>find_route</Code> πετύχει, η λίστα κόμβων του τροφοδοτείται πίσω στο ίδιο prop <Code>highlightedRoute</Code> που χρησιμοποιεί ο χειροκίνητος επιλογέας, οπότε η οπτικοποίηση είναι ταυτόσημη.</>) },
        ],
        source: (
          <>
            Πηγή: <Code>src/lib/ai/assistant.ts</Code>, route handler στο{" "}
            <Code>src/app/api/assistant/route.ts</Code>.
          </>
        ),
      }
    : {
        topic: "Assistant",
        title: "Two tools and a cached prompt",
        lead:
          "The assistant exposes exactly two tools: find_room and find_route. Both are thin wrappers around the search and routing code already shipping in the app. There is no parallel implementation.",
        items: [
          { strong: "Map JSON in the system prompt", body: (<>, marked with <Code>cache_control: ephemeral</Code>. Turn 1 writes the cache; subsequent turns read it back at roughly a tenth of the price.</>) },
          { strong: "Tool runner loop", body: (<> handled by the official SDK. The agent loop, tool execution, and tool-result plumbing are all in <Code>client.beta.messages.toolRunner()</Code>.</>) },
          { strong: "Captured route:", body: (<> when <Code>find_route</Code> succeeds, its node list is pushed back into the same <Code>highlightedRoute</Code> prop the manual route picker uses, so the visualisation is identical.</>) },
        ],
        source: (
          <>
            Source: <Code>src/lib/ai/assistant.ts</Code>, route handler at{" "}
            <Code>src/app/api/assistant/route.ts</Code>.
          </>
        ),
      };
  return (
    <NumberedSection id="assistant" n="06" topic={t.topic} title={t.title} lead={t.lead} ornament="tr" isActive={isActive}>
      <ul className="flex flex-col gap-2 text-body">
        {t.items.map((it, i) => (
          <Bullet key={i}>
            <strong>{it.strong}</strong>
            {it.body}
          </Bullet>
        ))}
      </ul>
      <p className="text-caption">{t.source}</p>
    </NumberedSection>
  );
}

/* ─── 07 Stack ────────────────────────────────────────────────────────────── */

function StackSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const items: Array<[string, string]> = isEl
    ? [
        ["Next.js 16 (App Router)", "Routing, layouts, server components."],
        ["TypeScript + Zod", "Σχήμα και τύποι από μία πηγή."],
        ["Tailwind v4 + shadcn/ui", "Design tokens συνθέτονται σε utility classes· primitives μέσω Base UI."],
        ["Inter + Geist Mono", "Σώμα σε Inter, κώδικας σε Geist Mono. Και τα δύο μέσω next/font."],
        ["next-themes", "Φωτεινό, σκοτεινό και θέμα συστήματος, αποθηκευμένο σε localStorage."],
        ["Leaflet (CRS.Simple)", "Pan, pinch-zoom, χειρονομίες κινητού πάνω σε επίπεδο σύστημα συντεταγμένων."],
        ["Prisma + SQLite", "Κατάλογος κτιρίων και ορόφων. Η γεωμετρία μένει σε JSON."],
        ["Anthropic SDK", "Adaptive thinking, betaZodTool tool runner, prompt caching."],
        ["Vitest", "Τα unit tests του pathfinder ζουν δίπλα στην υλοποίηση."],
      ]
    : [
        ["Next.js 16 (App Router)", "Routing, layouts, server components."],
        ["TypeScript + Zod", "Schema and types from one source."],
        ["Tailwind v4 + shadcn/ui", "Design tokens compose into utility classes; primitives via Base UI."],
        ["Inter + Geist Mono", "Body in Inter, code in Geist Mono. Both via next/font."],
        ["next-themes", "Light, dark, and system theme, persisted to localStorage."],
        ["Leaflet (CRS.Simple)", "Pan, pinch-zoom, mobile gestures over a flat coordinate frame."],
        ["Prisma + SQLite", "Catalog of buildings and floors. Geometry stays in JSON."],
        ["Anthropic SDK", "Adaptive thinking, betaZodTool tool runner, prompt caching."],
        ["Vitest", "Pathfinder unit tests live next to the implementation."],
      ];
  const t = isEl
    ? { topic: "Στοίβα", title: "Τι τρέχει", lead: "Όλα τα κομμάτια του puzzle, και γιατί επιλέχθηκαν." }
    : { topic: "Stack", title: "What's running", lead: "Every piece of the stack, and why it's there." };
  return (
    <NumberedSection id="stack" n="07" topic={t.topic} title={t.title} lead={t.lead} ornament="bl" isActive={isActive}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(([name, desc]) => (
          <li
            key={name}
            className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-body shadow-[var(--shadow-card)]"
          >
            <p className="font-semibold">{name}</p>
            <p className="text-caption">{desc}</p>
          </li>
        ))}
      </ul>
    </NumberedSection>
  );
}

/* ─── 08 Design system ────────────────────────────────────────────────────── */

function DesignSection({ isActive }: { isActive: boolean }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const swatches: Array<{ name: string; cssVar: string; note: string }> = isEl
    ? [
        { name: "Brand", cssVar: "--brand", note: "Indigo-violet, κύρια CTAs, brand mark." },
        { name: "Brand strong", cssVar: "--brand-strong", note: "Hover/active επιφάνειες brand." },
        { name: "Brand soft", cssVar: "--brand-soft", note: "Απαλές επιφάνειες brand, badges." },
        { name: "Route", cssVar: "--route", note: "Στροκ διαδρομής (με λευκή άλω)." },
        { name: "Feature", cssVar: "--feature", note: "Κυανά εικονίδια προσβασιμότητας." },
        { name: "Foreground", cssVar: "--foreground", note: "Σώμα κειμένου, τίτλοι." },
        { name: "Muted fg", cssVar: "--muted-foreground", note: "Captions, δευτερεύον κείμενο." },
        { name: "Surface 1", cssVar: "--surface-1", note: "Φόντο σελίδας." },
        { name: "Surface 2", cssVar: "--surface-2", note: "Πάνελ πλαϊνής, summary cards." },
        { name: "Floor base", cssVar: "--floor-base", note: "Γέμισμα εσωτερικού κτιρίου στον χάρτη." },
        { name: "Wall", cssVar: "--wall-exterior", note: "Μελάνι εξωτερικού τοίχου." },
        { name: "Window", cssVar: "--window-glass", note: "Γυάλινες κοπές σε εξωτερικούς τοίχους." },
      ]
    : [
        { name: "Brand", cssVar: "--brand", note: "Indigo-violet, primary CTAs, brand mark." },
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
      ];
  const typeRows: Array<[string, string, string]> = isEl
    ? [
        [".text-display", "48 / 56 · 700", "Τίτλος hero"],
        [".text-h1", "32 / 40 · 600", "Τίτλος σελίδας"],
        [".text-h2", "24 / 32 · 600", "Τίτλος ενότητας"],
        [".text-h3", "18 / 26 · 600", "Υπο-ενότητα"],
        [".text-lead", "17 / 26 · 400", "Εισαγωγική παράγραφος"],
        [".text-body", "15 / 24 · 400", "Σώμα κειμένου"],
        [".text-caption", "13 / 19 · 400", "Helper / metadata"],
        [".text-overline", "11 / 14 · 600", "Section kicker"],
      ]
    : [
        [".text-display", "48 / 56 · 700", "Hero headline"],
        [".text-h1", "32 / 40 · 600", "Page title"],
        [".text-h2", "24 / 32 · 600", "Section title"],
        [".text-h3", "18 / 26 · 600", "Subsection"],
        [".text-lead", "17 / 26 · 400", "Intro paragraph"],
        [".text-body", "15 / 24 · 400", "Body copy"],
        [".text-caption", "13 / 19 · 400", "Helper / metadata"],
        [".text-overline", "11 / 14 · 600", "Section kicker"],
      ];
  const t = isEl
    ? { topic: "Σχεδιαστικό σύστημα", title: "Tokens και κλίμακα τυπογραφίας", colors: "Color tokens", typescale: "Type scale" }
    : { topic: "Design system", title: "Tokens and type scale", colors: "Color tokens", typescale: "Type scale" };
  return (
    <NumberedSection id="design" n="08" topic={t.topic} title={t.title} ornament="tr" isActive={isActive}>
      <div className="flex flex-col gap-4">
        <h3 className="text-h3">{t.colors}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map((s) => (
            <div
              key={s.cssVar}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-card)]"
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

      <div className="flex flex-col gap-4">
        <h3 className="text-h3">{t.typescale}</h3>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <table className="w-full text-body">
            <thead className="bg-[var(--surface-2)] text-overline">
              <tr>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">{isEl ? "Μέγεθος / line-height · weight" : "Size / line-height · weight"}</th>
                <th className="px-3 py-2 text-left">{isEl ? "Χρήση" : "Use"}</th>
              </tr>
            </thead>
            <tbody>
              {typeRows.map(([cls, spec, use]) => (
                <tr key={cls} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2"><Code>{cls}</Code></td>
                  <td className="px-3 py-2 tabular-nums">{spec}</td>
                  <td className="px-3 py-2 text-caption">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </NumberedSection>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  const { lang } = useLang();
  const isEl = lang === "el";
  return (
    <footer className="mt-8 border-t border-[var(--border)] pt-8 text-caption">
      <p>
        {isEl ? (
          <>
            Το AccessMap είναι χτισμένο ως προπτυχιακό εκπαιδευτικό υλικό. Είναι
            αδελφικό έργο του <em>accessguide</em>, του χάρτη προσβασιμότητας
            του Πανεπιστημίου Μακεδονίας: μοιράζεται τον στόχο, όχι τον κώδικα.
          </>
        ) : (
          <>
            AccessMap is built as undergraduate teaching material. It is a
            sibling of <em>accessguide</em>, the campus accessibility map for
            the University of Macedonia: sharing the goal but not the codebase.
          </>
        )}
      </p>
    </footer>
  );
}

/* ─── Shared primitives ───────────────────────────────────────────────────── */

function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 font-mono text-caption leading-relaxed">
      {children}
    </pre>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span
        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "var(--brand)" }}
        aria-hidden="true"
      />
      <span className="text-[color:var(--muted-foreground)] [&_strong]:font-semibold [&_strong]:text-[color:var(--foreground)]">
        {children}
      </span>
    </li>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  );
}
