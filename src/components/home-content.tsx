"use client";

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
import { useLang } from "@/lib/i18n";

export function HomeContent() {
  return (
    <AppShell>
      <Hero />
      <article className="relative mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
        <Backdrop />
        <main className="relative flex flex-col gap-24 md:gap-32">
          <Pillars />
          <WebAccessibility n="01" />
          <MapAccessibility n="02" />
          <Architecture n="03" />
          <Algorithms n="04" />
          <DrawingAMap n="05" />
          <AssistantSection n="06" />
        </main>
        <FinalCTA />
        <Footer />
      </article>
    </AppShell>
  );
}

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
  const t =
    lang === "el"
      ? {
          badge: "Εκπαιδευτικό έργο",
          title: "Πώς φτιάχνεται ένας χάρτης εσωτερικής προσβασιμότητας.",
          lead: (
            <>
              Το AccessMap είναι ένας ολοκληρωμένος οδηγός σχεδίασης, από άκρο
              σε άκρο: το JSON που περιγράφει έναν όροφο, ο αλγόριθμος
              γραφημάτων που οδηγεί ένα αμαξίδιο γύρω από μια σκάλα, και ο
              βοηθός που απαντά στο{" "}
              <em>«πώς πάω στην αίθουσα 404;»</em>. Κάθε επίπεδο χρησιμοποιεί
              τα ίδια πρωτογενή στοιχεία που μπορείτε να διαβάσετε στον κώδικα.
            </>
          ),
          ctaDemo: "Άνοιγμα ζωντανού demo",
          ctaGitHub: "Δείτε στο GitHub",
          itemA: { label: "Α. Προσβασιμότητα Web", body: "Βασικά WCAG 2.2 AA" },
          itemB: { label: "Β. Προσβασιμότητα χάρτη", body: "Διαδρομές ανά προφίλ" },
          itemC: { label: "Γ. Αλγόριθμοι", body: "A* + Dijkstra" },
          itemD: { label: "Δ. Βοηθός", body: "Δύο εργαλεία, αληθινά δεδομένα" },
        }
      : {
          badge: "Teaching project",
          title: "How an indoor accessibility map is built.",
          lead: (
            <>
              AccessMap is a self-contained walkthrough of the design, end to
              end: the JSON that describes a floor, the graph algorithm that
              routes a wheelchair around a flight of stairs, and the assistant
              that answers <em>&ldquo;how do I get to room 404?&rdquo;</em>.
              Every layer uses the same primitives you can read in the source.
            </>
          ),
          ctaDemo: "Open the live demo",
          ctaGitHub: "View on GitHub",
          itemA: { label: "A. Web a11y", body: "WCAG 2.2 AA basics" },
          itemB: { label: "B. Map a11y", body: "Per-profile routing" },
          itemC: { label: "C. Algorithms", body: "A* + Dijkstra" },
          itemD: { label: "D. Assistant", body: "Two tools, real data" },
        };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-[var(--border)]"
      style={{
        background:
          "linear-gradient(180deg, var(--brand-soft) 0%, var(--background) 70%)",
      }}
    >
      <HeroSchematic />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.15fr_1fr] md:gap-14 md:py-28 lg:py-32">
        <div className="flex flex-col items-start gap-6">
          <BrandBadge label={t.badge} />
          <h1
            id="hero-title"
            className="text-display max-w-[20ch] sm:text-[3.5rem] sm:leading-[1.05]"
          >
            {t.title}
          </h1>
          <p className="text-lead max-w-[58ch]">{t.lead}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/maps/demo-building/ground"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-body font-medium text-white shadow-[var(--shadow-card)] transition-[background,transform] hover:bg-[var(--brand-strong)] active:translate-y-px"
            >
              {t.ctaDemo}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="https://github.com/University-of-Macedonia-Research-Lab/accessmap"
              className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-body font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
            >
              {t.ctaGitHub}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <ul className="mt-1 grid w-full max-w-md grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8">
            <LearnItem {...t.itemA} />
            <LearnItem {...t.itemB} />
            <LearnItem {...t.itemC} />
            <LearnItem {...t.itemD} />
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function LearnItem({ label, body }: { label: string; body: string }) {
  return (
    <li className="flex min-w-0 flex-col gap-0.5 whitespace-nowrap">
      <span
        className="font-mono text-[0.7rem] font-semibold tracking-[0.06em]"
        style={{ color: "var(--brand)" }}
      >
        {label}
      </span>
      <span className="text-caption text-[color:var(--foreground)]">
        {body}
      </span>
    </li>
  );
}

function HeroSchematic() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-20 -top-16 hidden h-[120%] w-[70%] opacity-[0.08] md:block"
      viewBox="0 0 600 500"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="40" y="60" width="500" height="380" fill="none" stroke="var(--brand)" strokeWidth="3" rx="14" />
      <line x1="40" y1="240" x2="540" y2="240" stroke="var(--brand)" strokeWidth="1.5" />
      <line x1="40" y1="280" x2="540" y2="280" stroke="var(--brand)" strokeWidth="1.5" />
      {[180, 320, 460].map((x) => (
        <line key={`u${x}`} x1={x} y1="60" x2={x} y2="240" stroke="var(--brand)" strokeWidth="1.5" />
      ))}
      {[160, 280, 400].map((x) => (
        <line key={`l${x}`} x1={x} y1="280" x2={x} y2="440" stroke="var(--brand)" strokeWidth="1.5" />
      ))}
      {[[110,150],[250,150],[390,150],[100,360],[340,360],[470,360]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="var(--brand)" />
      ))}
      <polyline
        points="100,400 100,260 340,260 340,150 250,150"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroVisual() {
  const { lang } = useLang();
  const t =
    lang === "el"
      ? {
          aria:
            "Μικρός χάρτης ορόφου με προσβάσιμη διαδρομή με αμαξίδιο από την είσοδο στην αίθουσα μέσω ασανσέρ",
          profile: "Αμαξίδιο",
          path: "διαδρομή · είσοδος → ασανσέρ → 101",
          summary: "Σκάλες αποκλεισμένες · 5 τμήματα · κόστος 14.6",
          labels: { c101: "101", lab: "Εργ.", office: "Γραφ.", in: "Εισ." },
        }
      : {
          aria:
            "Small floor plan with a wheelchair-accessible route from the entrance to a classroom via the elevator",
          profile: "Wheelchair",
          path: "route · entrance → elevator → 101",
          summary: "Stairs blocked · 5 segments · cost 14.6",
          labels: { c101: "101", lab: "Lab", office: "Office", in: "In" },
        };
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-[var(--shadow-card)]"
      role="img"
      aria-label={t.aria}
    >
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
        <rect x="14" y="14" width="292" height="192" fill="var(--floor-base)" stroke="var(--wall-exterior)" strokeWidth="3.5" rx="10" />
        <rect x="26" y="26" width="120" height="74" fill="oklch(0.94 0.025 250)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="158" y="26" width="136" height="74" fill="oklch(0.93 0.04 80)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="26" y="120" width="86" height="86" fill="oklch(0.94 0.025 295)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="124" y="120" width="56" height="86" fill="oklch(0.93 0.06 65)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="192" y="120" width="56" height="86" fill="oklch(0.92 0.04 30)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="260" y="120" width="34" height="86" fill="oklch(0.93 0.05 150)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="4" />
        <rect x="26" y="100" width="268" height="20" fill="oklch(0.96 0.005 95)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.4" />
        {[44, 84, 178, 224, 270].map((x, i) => (
          <line key={i} x1={x} y1="14" x2={x + 24} y2="14" stroke="var(--window-glass)" strokeWidth="3" />
        ))}
        <text x="86" y="65" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.c101}</text>
        <text x="226" y="65" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.lab}</text>
        <text x="69" y="167" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.office}</text>
        <text x="277" y="167" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.in}</text>
        <g>
          <circle cx="152" cy="160" r="11" fill="var(--feature)" />
          <text x="152" y="164" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" fill="white">E</text>
        </g>
        <g>
          <circle cx="220" cy="160" r="11" fill="var(--feature)" />
          <text x="220" y="164" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="700" fill="white">S</text>
        </g>
        <line x1="220" y1="110" x2="220" y2="148" stroke="oklch(0.6 0.21 27 / 0.6)" strokeWidth="1.4" strokeDasharray="3 2" />
        <g>
          <polyline points="277,160 277,110 152,110 152,148 86,148 86,63" fill="none" stroke="var(--route-halo)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="277,160 277,110 152,110 152,148 86,148 86,63" fill="none" stroke="var(--route)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="277" cy="160" r="6" fill="var(--route-halo)" />
          <circle cx="277" cy="160" r="3.5" fill="var(--route)" />
          <circle cx="86" cy="63" r="6" fill="var(--route-halo)" />
          <circle cx="86" cy="63" r="3.5" fill="var(--route)" />
        </g>
      </svg>
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/85 p-2.5 backdrop-blur-sm">
        <span className="grid h-7 w-7 place-items-center rounded-lg text-white" style={{ background: "var(--brand)" }}>
          <Accessibility className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption text-[color:var(--foreground)]">
            <span className="font-semibold">{t.profile}</span> {t.path}
          </p>
          <p className="truncate text-[11px] text-[color:var(--muted-foreground)]">
            {t.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

function BrandBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-overline">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand)" }} />
      {label}
    </span>
  );
}

/* ─── Pillars ─────────────────────────────────────────────────────────────── */

function Pillars() {
  const { lang } = useLang();
  const t =
    lang === "el"
      ? [
          {
            kicker: "Δεδομένα",
            title: "Οι όροφοι είναι JSON",
            body:
              "Ένα μικρό, επικυρωμένο σχήμα με δωμάτια, πόρτες, τοίχους και γράφημα. Ο σχεδιαστής, ο δρομολογητής και ο βοηθός διαβάζουν την ίδια δομή.",
          },
          {
            kicker: "Δρομολόγηση",
            title: "A* σε γράφημα με βάρη",
            body:
              "Το κόστος ακμής κλιμακώνεται με το προφίλ κάθε χρήστη. Οι σκάλες είναι άπειρες για τα αμαξίδια, μια ράμπα είναι μικρή επιβάρυνση. Ένας αλγόριθμος, τρεις απαντήσεις.",
          },
          {
            kicker: "Βοηθός",
            title: "Δύο εργαλεία, αληθινά δεδομένα",
            body:
              "Ο βοηθός καλεί τα find_room και find_route, τον ίδιο κώδικα που χρησιμοποιεί ο χειροκίνητος επιλογέας διαδρομής. Ο χάρτης βρίσκεται στο cached system prompt.",
          },
        ]
      : [
          {
            kicker: "Data",
            title: "Floors are JSON",
            body:
              "A small, validated schema with rooms, doors, walls, and a graph. The renderer, router, and assistant all read the same structure.",
          },
          {
            kicker: "Routing",
            title: "A* over a weighted graph",
            body:
              "Edge cost scales with each user's profile. Stairs are infinity for wheelchairs, a ramp is a small surcharge. One algorithm, three answers.",
          },
          {
            kicker: "Assistant",
            title: "Two tools, real data",
            body:
              "The assistant calls find_room and find_route, the same library code the manual route picker uses. The map sits in the cached system prompt.",
          },
        ];
  const icons = [
    <Workflow className="h-5 w-5" key="i" />,
    <Network className="h-5 w-5" key="r" />,
    <Sparkles className="h-5 w-5" key="a" />,
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {t.map((p, i) => (
        <Pillar key={p.title} icon={icons[i]} {...p} />
      ))}
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
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]" style={{ background: "var(--brand-soft)" }}>
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

/* ─── Web accessibility ───────────────────────────────────────────────────── */

function WebAccessibility({ n }: { n: string }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const items = isEl
    ? [
        {
          icon: <KeyRound className="h-5 w-5" />,
          title: "Πλήρης πλοήγηση με πληκτρολόγιο",
          body:
            "Κάθε διαδραστικό στοιχείο είναι προσβάσιμο με Tab, ενεργοποιείται με Enter / Space και έχει ορατό focus ring. Καμία λειτουργία αποκλειστικά με ποντίκι, καμία παγίδα.",
        },
        {
          icon: <Eye className="h-5 w-5" />,
          title: "Φιλικό προς αναγνώστες οθόνης",
          body:
            "Πρώτα σημασιολογικό HTML, ARIA μόνο όπου η πλατφόρμα δεν μεταφέρει ήδη το νόημα. Οι έλεγχοι του χάρτη εκθέτουν roles και labels· το SVG φέρει aria-label.",
        },
        {
          icon: <Contrast className="h-5 w-5" />,
          title: "Αντίθεση που στέκεται",
          body:
            "Το σώμα κειμένου ξεπερνά 4.5:1 πάνω στην επιφάνειά του· τα μεγάλα κείμενα και τα στοιχεία UI 3:1. Δοκιμασμένο σε φωτεινό και σκοτεινό θέμα.",
        },
        {
          icon: <Hand className="h-5 w-5" />,
          title: "Στόχοι αφής ≥ 44px",
          body:
            "Pills, κουμπιά και το κουμπί ανοίγματος του πλαϊνού πληρούν το WCAG 2.5.5. Δεν υπάρχουν κουμπιά εικονιδίων 24×24 που κρύβουν τη μοναδική έξοδο από ένα modal.",
        },
      ]
    : [
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
            "Body text clears 4.5:1 against its surface; large text and UI states clear 3:1. Tested in light and dark themes alike.",
        },
        {
          icon: <Hand className="h-5 w-5" />,
          title: "Touch targets ≥ 44px",
          body:
            "Pills, buttons, and the map drawer trigger meet WCAG 2.5.5 target size. No 24×24 icon buttons hiding the only way to dismiss a modal.",
        },
      ];
  const head = isEl
    ? {
        kicker: "Προσβασιμότητα στο Web",
        title: "Το ίδιο το προϊόν πρέπει να είναι προσιτό.",
        lead:
          "Πριν ένας χάρτης μπορέσει να οδηγήσει ένα αμαξίδιο μέσα σε ένα κτίριο, η σελίδα που τον φιλοξενεί πρέπει να είναι λειτουργική με πληκτρολόγιο, αναγνώσιμη από screen reader, και ευανάγνωστη για άτομα με χαμηλή όραση. Αυτές είναι οι βασικές απαιτήσεις, το WCAG 2.2 AA, και είναι ενσωματωμένες στα στοιχεία μας, όχι προστιθέμενες στο τέλος.",
      }
    : {
        kicker: "Web accessibility",
        title: "The product itself has to be reachable.",
        lead:
          "Before a map can route a wheelchair through a building, the page that hosts it has to be operable by a keyboard, parsable by a screen reader, and legible to someone with low vision. Those are the table stakes, WCAG 2.2 AA, encoded in our component primitives rather than bolted on at the end.",
      };
  return (
    <Section n={n} ornament="tr" kicker={head.kicker} title={head.title} lead={head.lead}>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <FeatureCard key={it.title} {...it} />
        ))}
      </div>
      <Callout>
        {isEl ? (
          <p>
            <strong className="font-semibold text-[color:var(--foreground)]">
              Γιατί έχει σημασία στην πράξη.
            </strong>{" "}
            Περίπου το <span className="tabular-nums">15%</span> του πληθυσμού
            παγκοσμίως ζει με κάποια μορφή αναπηρίας (ΠΟΥ,{" "}
            <em>World Report on Disability</em>). Για τους περισσότερους, η
            προσβασιμότητα στο web δεν είναι feature· είναι η διαφορά ανάμεσα
            στο να μπορούν ή να μην μπορούν να εγγραφούν σε ένα μάθημα.
          </p>
        ) : (
          <p>
            <strong className="font-semibold text-[color:var(--foreground)]">
              Why it matters in practice.
            </strong>{" "}
            About <span className="tabular-nums">15%</span> of the world&rsquo;s
            population lives with some form of disability (WHO,{" "}
            <em>World Report on Disability</em>). For most of them, web
            accessibility is not a feature; it&rsquo;s the difference between
            being able to enrol in a class and being locked out of one.
          </p>
        )}
      </Callout>
    </Section>
  );
}

/* ─── Map accessibility ───────────────────────────────────────────────────── */

function MapAccessibility({ n }: { n: string }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const head = isEl
    ? {
        kicker: "Προσβασιμότητα στον χάρτη",
        title: "Μια διαδρομή που δεν υπάρχει για όλους είναι λάθος διαδρομή.",
        lead:
          "Οι περισσότεροι online χάρτες υποθέτουν ότι όλοι περπατούν με τον ίδιο τρόπο. Δεν είναι έτσι. Το AccessMap δρομολογεί ανά προφίλ, κωδικοποιώντας τους περιορισμούς κινητικότητας, όρασης και αισθητηριακής αντίληψης ως βάρη ακμών στο ίδιο γράφημα. Η απάντηση στο «πώς πάω εκεί;» διαμορφώνεται από το ποιος ρωτάει.",
        head1: "Στοιχείο στη διαδρομή",
        head2: "Default",
        head3: "Αμαξίδιο",
        head4: "Χαμηλή όραση",
        rows: [
          ["Σκάλες", "1×", "αποκλεισμένο (∞)", "1.5×"],
          ["Σκαλοπάτι", "1×", "αποκλεισμένο (∞)", "1×"],
          ["Στενό πέρασμα", "1×", "3×", "1.5×"],
          ["Ράμπα", "1×", "1.1×", "1×"],
          ["Ασανσέρ", "1×", "1.2×", "1×"],
          ["Αυτόματη πόρτα", "1×", "1×", "1×"],
        ],
        coda: (
          <>
            Οι αριθμοί είναι ρυθμιζόμενοι, όχι δόγμα: είναι συντονισμένοι για
            διδασκαλία. Η αρχή είναι το βαρύνον σημείο: <em>ίδιο γράφημα,
            διαφορετικά βάρη.</em> Η προσθήκη ενός νέου προφίλ (κωφό-τυφλό,
            καρότσι, με αποσκευές) είναι λίγες γραμμές στο{" "}
            <code className="rounded bg-[var(--surface-2)] px-1 font-mono text-[0.85em]">PROFILES</code>·
            καμία αλλαγή σχήματος, κανένας δεύτερος renderer.
          </>
        ),
      }
    : {
        kicker: "Map accessibility",
        title: "A route that doesn't exist for everyone is the wrong route.",
        lead:
          "Most online maps treat the world as if everyone walks the same way. They don't. AccessMap routes per profile, encoding the constraints of mobility, vision, and sensory impairment as edge weights on the same graph, so the answer to “how do I get there?” is shaped by who is asking.",
        head1: "Feature on the path",
        head2: "Default",
        head3: "Wheelchair",
        head4: "Low vision",
        rows: [
          ["Stairs", "1×", "blocked (∞)", "1.5×"],
          ["Step", "1×", "blocked (∞)", "1×"],
          ["Narrow passage", "1×", "3×", "1.5×"],
          ["Ramp", "1×", "1.1×", "1×"],
          ["Elevator", "1×", "1.2×", "1×"],
          ["Automatic door", "1×", "1×", "1×"],
        ],
        coda: (
          <>
            The numbers are knobs, not gospel: they&rsquo;re tuned for teaching.
            The principle is the load-bearing part: <em>same graph, different
            weights.</em> Adding a profile (deafblind, stroller, with-luggage)
            is a few lines in{" "}
            <code className="rounded bg-[var(--surface-2)] px-1 font-mono text-[0.85em]">PROFILES</code>:
            no schema change, no second renderer.
          </>
        ),
      };
  return (
    <Section n={n} ornament="tl" kicker={head.kicker} title={head.title} lead={head.lead}>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-card)]">
        <table className="w-full text-body">
          <thead className="bg-[var(--surface-2)] text-overline">
            <tr>
              <th className="px-4 py-3 text-left">{head.head1}</th>
              <th className="px-4 py-3 text-left">{head.head2}</th>
              <th className="px-4 py-3 text-left">{head.head3}</th>
              <th className="px-4 py-3 text-left">{head.head4}</th>
            </tr>
          </thead>
          <tbody className="text-[color:var(--muted-foreground)]">
            {head.rows.map(([feat, ...vals]) => (
              <tr key={feat as string} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 font-medium text-[color:var(--foreground)]">{feat}</td>
                {vals.map((v, i) => (
                  <td key={i} className="px-4 py-3 tabular-nums">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-body text-[color:var(--muted-foreground)]">{head.coda}</p>
    </Section>
  );
}

/* ─── Architecture ────────────────────────────────────────────────────────── */

function Architecture({ n }: { n: string }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const head = isEl
    ? {
        kicker: "Αρχιτεκτονική",
        title: "Ένα γράφημα, τρεις αναγνώστες.",
        lead:
          "Ένας όροφος περιγράφεται ως δεδομένα: γεωμετρία συν ένα γράφημα που ζει δίπλα της. Ο σχεδιαστής διαβάζει τη γεωμετρία για να ζωγραφίσει, ο δρομολογητής διαβάζει το γράφημα για να βρει διαδρομή, και ο βοηθός τα διαβάζει και τα δύο μέσω εργαλείων. Κανείς τους δεν επικαλύπτει τους άλλους.",
        primitivesTitle: "Τα τέσσερα πρωτογενή στοιχεία",
        items: [
          ["Δωμάτια", "Πολύγωνα σε ένα επίπεδο 2-D σύστημα συντεταγμένων. Καθένα φέρει ένα είδος (αίθουσα, γραφείο, εργαστήριο, …) και δίγλωσσο όνομα."],
          ["Πόρτες", "Σημεία σε τοίχο που μοιράζονται δύο δωμάτια. Ο σχεδιαστής τα σημειώνει· το γράφημα ήδη κωδικοποιεί τη συνδεσιμότητα, οπότε οι πόρτες είναι οπτικό συμπλήρωμα, όχι δεδομένα δρομολόγησης."],
          ["Κόμβοι", "Κορυφές στο γράφημα δρομολόγησης, τοποθετημένες σε κέντρα δωματίων, διασταυρώσεις διαδρόμων και σημεία αλλαγής ορόφου (ασανσέρ, σκάλες). Ένας κόμβος μπορεί να φέρει feature tags που σταθμίζονται από τα προφίλ."],
          ["Ακμές", "Συνδέσεις ανάμεσα σε κόμβους, καθεμία με τα δικά της feature tags. Κόστος ακμής = βασική απόσταση × πολλαπλασιαστής προφίλ. Το Infinity μπλοκάρει την ακμή."],
        ] as Array<[string, string]>,
      }
    : {
        kicker: "Architecture",
        title: "One graph, three readers.",
        lead:
          "A floor is described as data: geometry plus a graph that lives alongside it. The renderer reads the geometry to draw, the pathfinder reads the graph to route, and the assistant reads both through tools. None of them duplicates the other.",
        primitivesTitle: "The four primitives",
        items: [
          ["Rooms", "Polygons in a flat 2-D coordinate frame. Each carries a kind (classroom, office, lab, …) and a bilingual name."],
          ["Doors", "Points on a wall shared by two rooms. The renderer marks them; the graph already encodes that connectivity, so doors are visual sugar, not routing data."],
          ["Nodes", "Vertices in the routing graph, placed at room centres, corridor junctions, and floor-changers (elevator, stairs). A node may carry feature tags that profiles weigh."],
          ["Edges", "Connections between nodes, each carrying its own feature tags. Edge cost = base distance × profile multiplier. Infinity blocks the edge entirely."],
        ] as Array<[string, string]>,
      };
  return (
    <Section n={n} ornament="tr" kicker={head.kicker} title={head.title} lead={head.lead}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <ArchitectureDiagram />
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-h3">{head.primitivesTitle}</h3>
          <DefList items={head.items} />
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
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        title: "Γεωμετρία + γράφημα",
        caption:
          "Ένας απλοποιημένος όροφος: δύο δωμάτια εκατέρωθεν ενός διαδρόμου, ένα ασανσέρ, μια σκάλα, και το γράφημα δρομολόγησης ζωγραφισμένο από πάνω.",
        aria: "Αρχιτεκτονικό διάγραμμα με δωμάτια, πόρτες, κόμβους γραφήματος και ακμές",
        labels: { c101: "101", c102: "102", office: "Γραφ.", el: "ΑΣ", st: "ΣΚ", in: "Εισ." },
        legend: {
          room: "Πολύγωνο δωματίου",
          node: "Κόμβος γραφήματος",
          feature: "Κόμβος feature (E/S)",
          route: "Υπολογισμένη διαδρομή",
          stairs: "Ακμή σκάλας (διακεκομμένη)",
        },
      }
    : {
        title: "Geometry + graph",
        caption:
          "A simplified floor: two rooms either side of a corridor, an elevator, a stairwell, and the routing graph drawn on top.",
        aria: "Architectural diagram showing rooms, doors, graph nodes, and edges",
        labels: { c101: "101", c102: "102", office: "Office", el: "EL", st: "ST", in: "In" },
        legend: {
          room: "Room polygon",
          node: "Graph node",
          feature: "Feature node (E/S)",
          route: "Computed route",
          stairs: "Stairs edge (dashed)",
        },
      };
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
      <h3 className="text-h3">{t.title}</h3>
      <p className="text-caption">{t.caption}</p>
      <div className="overflow-hidden rounded-xl bg-[var(--surface-2)]">
        <svg viewBox="0 0 320 180" className="block h-auto w-full" role="img" aria-label={t.aria}>
          <rect x="10" y="10" width="300" height="160" fill="var(--floor-base)" stroke="var(--wall-exterior)" strokeWidth="3" rx="6" />
          <rect x="20" y="20" width="120" height="60" fill="oklch(0.94 0.025 250)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="180" y="20" width="120" height="60" fill="oklch(0.94 0.025 250)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="20" y="100" width="80" height="60" fill="oklch(0.94 0.025 295)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="120" y="100" width="60" height="60" fill="oklch(0.93 0.06 65)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="200" y="100" width="60" height="60" fill="oklch(0.92 0.04 30)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="280" y="100" width="20" height="60" fill="oklch(0.93 0.05 150)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.6" rx="3" />
          <rect x="20" y="80" width="280" height="20" fill="oklch(0.96 0.005 95)" stroke="oklch(0.7 0.02 270)" strokeWidth="0.4" />
          <text x="80" y="55" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.c101}</text>
          <text x="240" y="55" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.c102}</text>
          <text x="60" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.office}</text>
          <text x="150" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.el}</text>
          <text x="230" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.st}</text>
          <text x="290" y="135" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9" fontWeight="500" fill="oklch(0.3 0.02 270)">{t.labels.in}</text>
          {[80, 240, 60, 150, 230, 290].map((x, i) => (
            <circle key={i} cx={x} cy={i < 2 ? 80 : 100} r="2.5" fill="white" stroke="oklch(0.5 0.02 270)" strokeWidth="0.5" />
          ))}
          <line x1="60" y1="90" x2="290" y2="90" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="80" y1="90" x2="80" y2="50" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="240" y1="90" x2="240" y2="50" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="60" y1="90" x2="60" y2="130" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="150" y1="90" x2="150" y2="130" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          <line x1="230" y1="90" x2="230" y2="130" stroke="oklch(0.6 0.21 27 / 0.6)" strokeWidth="1.2" strokeDasharray="3 2" />
          <line x1="290" y1="90" x2="290" y2="130" stroke="oklch(0.3 0.02 270 / 0.5)" strokeWidth="1.2" />
          {[[80,50],[240,50],[60,130],[290,130],[80,90],[150,90],[230,90],[290,90]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="oklch(0.3 0.02 270)" />
          ))}
          <circle cx="150" cy="130" r="9" fill="var(--feature)" />
          <text x="150" y="133" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="700" fill="white">E</text>
          <circle cx="230" cy="130" r="9" fill="var(--feature)" />
          <text x="230" y="133" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" fontWeight="700" fill="white">S</text>
          <g>
            <polyline points="290,130 290,90 150,90 150,130" fill="none" stroke="var(--route-halo)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="290,130 290,90 150,90 150,130" fill="none" stroke="var(--route)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="290" cy="130" r="4.5" fill="var(--route-halo)" />
            <circle cx="290" cy="130" r="2.5" fill="var(--route)" />
            <circle cx="150" cy="130" r="4.5" fill="var(--route-halo)" />
            <circle cx="150" cy="130" r="2.5" fill="var(--route)" />
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption">
        <Legend swatch="oklch(0.94 0.025 250)" label={t.legend.room} />
        <Legend swatch="oklch(0.3 0.02 270)" label={t.legend.node} round />
        <Legend swatch="var(--feature)" label={t.legend.feature} round />
        <Legend swatch="var(--route)" label={t.legend.route} line />
        <Legend swatch="oklch(0.6 0.21 27)" label={t.legend.stairs} line />
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
        <span className={"h-3 w-3 " + (round ? "rounded-full" : "rounded-sm")} style={{ background: swatch }} />
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

/* ─── Algorithms ──────────────────────────────────────────────────────────── */

function Algorithms({ n }: { n: string }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const head = isEl
    ? {
        kicker: "Αλγόριθμοι",
        title: "A* σε έναν όροφο, Dijkstra ανάμεσα σε αυτούς.",
        lead:
          "Ο αλγόριθμος εύρεσης διαδρομής είναι αρκετά μικρός για να διαβαστεί σε μια συνεδρία. Η ενδιαφέρουσα κίνηση είναι στη συνάρτηση κόστους: απόσταση επί τον υψηλότερο πολλαπλασιαστή του προφίλ στην ακμή. Αυτό κάνει το ίδιο γράφημα να δίνει τρεις διαφορετικές διαδρομές.",
        astarTitle: "A* με απλά λόγια",
        bullets: [
          { strong: "Open set", body: ", οι κόμβοι που έχουμε φτάσει αλλά δεν έχουμε ολοκληρώσει. Επιλέγουμε πάντα αυτόν με το μικρότερο " },
          { strong: "g(n)", body: ", το καλύτερο γνωστό κόστος για να φτάσουμε στον " },
          { strong: "h(n)", body: ", η ευθυγραμμική απόσταση από τον " },
          { strong: "Ανακατασκευή", body: ", μόλις ο στόχος βγει, ακολουθούμε το " },
        ],
        codeTitle: "Κόστος ακμής, σε κώδικα",
        why: (
          <>
            <em>Γιατί η χειρότερη περίπτωση;</em> Μια ακμή με tag{" "}
            <Code>narrow_passage</Code> ΚΑΙ <Code>step</Code> πρέπει να είναι
            τόσο επιβαρυμένη όσο η χειρότερη από τις δύο για το επιλεγμένο
            προφίλ· ποτέ μαλακωμένη από μέσο όρο. Αυτός ο κανόνας κρατά τη
            σύνθεση προφίλ προβλέψιμη όσο προσθέτουμε features.
          </>
        ),
        callout: (
          <>
            Για δρομολόγηση ανάμεσα σε ορόφους η ευρετική είναι{" "}
            <Code>0</Code>. Η ευθεία απόσταση δεν γενικεύει σε διαφορετικούς
            ορόφους, οπότε πέφτουμε σε Dijkstra: σωστό και ασήμαντα γρήγορο
            για γραφήματα μεγέθους κάτοψης.
          </>
        ),
      }
    : {
        kicker: "Algorithms",
        title: "A* on a single floor, Dijkstra across them.",
        lead:
          "The pathfinder is small enough to read in one sitting. The interesting move is in the cost function: distance multiplied by the heaviest profile multiplier on the edge, which is what makes the same graph yield three different routes.",
        astarTitle: "A* in plain terms",
        bullets: [
          { strong: "Open set", body: ", nodes we've reached but not finished expanding. We always pop the one with the smallest " },
          { strong: "g(n)", body: ", best-known cost to reach " },
          { strong: "h(n)", body: ", straight-line distance from " },
          { strong: "Reconstruction", body: ", once the goal is popped, follow " },
        ],
        codeTitle: "Edge cost, in code",
        why: (
          <>
            <em>Why the worst case?</em> An edge tagged{" "}
            <Code>narrow_passage</Code> AND <Code>step</Code> should be as bad
            as the worse of the two for the chosen profile, never softened by
            averaging. That single rule keeps profile composition predictable
            as you add features.
          </>
        ),
        callout: (
          <>
            For multi-floor routing the heuristic is <Code>0</Code>. Euclidean
            distance doesn&rsquo;t generalise across floors, and falling back
            to Dijkstra is correct and trivially fast for floor-plan-sized
            graphs.
          </>
        ),
      };
  return (
    <Section n={n} ornament="bl" kicker={head.kicker} title={head.title} lead={head.lead}>
      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <Card>
          <h3 className="text-h3">{head.astarTitle}</h3>
          <ul className="flex flex-col gap-2 text-body">
            <Bullet>
              <strong>{head.bullets[0].strong}</strong>{head.bullets[0].body}
              <Code>f = g + h</Code>.
            </Bullet>
            <Bullet>
              <strong>{head.bullets[1].strong}</strong>{head.bullets[1].body}<Code>n</Code>{isEl ? " από την αρχή." : " from the start."}
            </Bullet>
            <Bullet>
              <strong>{head.bullets[2].strong}</strong>{head.bullets[2].body}<Code>n</Code>{isEl
                ? " στον στόχο. Παραδεκτή, καθώς κάθε κόστος ακμής είναι τουλάχιστον όσο η ευθεία απόσταση, οπότε ποτέ δεν υπερεκτιμούμε."
                : " to the goal. Admissible because every edge cost is at least its straight-line length, so we never overestimate."}
            </Bullet>
            <Bullet>
              <strong>{head.bullets[3].strong}</strong>{head.bullets[3].body}<Code>cameFrom</Code>{isEl
                ? " ανάποδα για να ανακτήσουμε τη διαδρομή."
                : " backwards to recover the path."}
            </Bullet>
          </ul>
          <Callout muted>{head.callout}</Callout>
        </Card>

        <Card>
          <h3 className="text-h3">{head.codeTitle}</h3>
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
          <p className="text-caption">{head.why}</p>
        </Card>
      </div>
    </Section>
  );
}

/* ─── How to draw a map ───────────────────────────────────────────────────── */

function DrawingAMap({ n }: { n: string }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const head = isEl
    ? {
        kicker: "Πώς να σχεδιάσετε χάρτη",
        title: "JSON μέσα, κάτοψη ορόφου έξω.",
        lead:
          "Η συγγραφή ενός νέου ορόφου είναι έξι μικρές αποφάσεις, με σειρά. Καμία δεν απαιτεί εργαλείο γραφικών: ο σχεδιαστής συνθέτει το SVG από το JSON κατά την εκτέλεση.",
        stepLabel: "Βήμα",
      }
    : {
        kicker: "How to draw a map",
        title: "JSON in, top-view floor plan out.",
        lead:
          "Authoring a new floor is six small decisions, in order. None of them require a graphics tool: the renderer composes the SVG from the JSON at runtime.",
        stepLabel: "Step",
      };
  const steps = isEl
    ? [
        { n: "01", title: "Επιλέξτε σύστημα συντεταγμένων", body: (<>Επίπεδο 2-D, χωρίς γεωγραφική προβολή. Διαλέξτε μονάδα (εμείς χρησιμοποιούμε «1 unit ≈ 0.1 m») και bounding box. Το <Code>{"{ minX, minY, maxX, maxY }"}</Code> γίνεται το viewBox του SVG.</>) },
        { n: "02", title: "Σχεδιάστε το περίγραμμα", body: (<>Ένα πολύγωνο που περιγράφει τον εξωτερικό τοίχο. Ο σχεδιαστής το χρησιμοποιεί για τη βάση του ορόφου και το βαρύ εξωτερικό περίγραμμα· διακοπές σε αυτό είναι <Code>walls</Code> με tag <Code>window</Code>.</>) },
        { n: "03", title: "Χωρίστε τον όροφο σε δωμάτια", body: (<>Κάθε δωμάτιο είναι πολύγωνο και ένα είδος (αίθουσα, γραφείο, εργαστήριο, σκάλα, …). Γειτονικά δωμάτια μοιράζονται μια ακμή· αυτή η ακμή είναι ο τοίχος μεταξύ τους, και η <Code>door</Code> πάνω της είναι το σημείο διέλευσης.</>) },
        { n: "04", title: "Τοποθετήστε κόμβους γραφήματος", body: (<>Ένας ανά δωμάτιο (συνήθως στο κέντρο) και μια αλυσίδα κατά μήκος των διαδρόμων. Σημειώστε τους κόμβους ασανσέρ και σκάλας με <Code>features: [&quot;elevator&quot;]</Code> / <Code>[&quot;stairs&quot;]</Code> και συνδέστε τους με τον αντίστοιχο κόμβο σε γειτονικούς ορόφους μέσω του <Code>connectsToFloor</Code>.</>) },
        { n: "05", title: "Συνδέστε με ακμές", body: (<>Συνδέστε κόμβους που μπορούν να συνδεθούν με ευθεία γραμμή χωρίς να διασταυρώνουν τοίχο. Σημειώστε με τα features που ισχύουν: <Code>stairs</Code>, <Code>narrow_passage</Code>, <Code>ramp</Code>. Το σύστημα προφίλ κάνει τα υπόλοιπα.</>) },
        { n: "06", title: "Επικυρώστε και δημοσιεύστε", body: (<>Αποθηκεύστε στο <Code>src/data/maps/&lt;κτίριο&gt;/&lt;όροφος&gt;.json</Code>. Το Zod το ελέγχει στη φόρτωση: λάθος δομή, γρήγορη αποτυχία. Η αρχική, ο επιλογέας ορόφου και ο βοηθός το αναγνωρίζουν αυτόματα.</>) },
      ]
    : [
        { n: "01", title: "Pick a coordinate frame", body: (<>A flat 2-D plane, no real-world projection. Pick a unit (we use “1 unit ≈ 0.1 m”) and a bounding box. <Code>{"{ minX, minY, maxX, maxY }"}</Code> becomes the SVG viewBox.</>) },
        { n: "02", title: "Trace the building outline", body: (<>A polygon describing the exterior wall. The renderer uses it for the floor base fill and the heavy exterior stroke; cuts in that stroke are <Code>walls</Code> tagged <Code>window</Code>.</>) },
        { n: "03", title: "Cut the floor into rooms", body: (<>Each room is a polygon plus a kind (classroom, office, lab, stairwell, …). Adjacent rooms share an edge: that edge is the wall between them, and the <Code>door</Code> placed on it is where you can pass.</>) },
        { n: "04", title: "Drop graph nodes", body: (<>One per room (the centroid, usually) and a chain along corridors. Tag the elevator and stairwell nodes with <Code>features: [&quot;elevator&quot;]</Code> / <Code>[&quot;stairs&quot;]</Code> and link them to the equivalent node on adjacent floors via <Code>connectsToFloor</Code>.</>) },
        { n: "05", title: "Wire edges", body: (<>Connect nodes that you can walk between in a straight line without crossing a wall. Tag with the features the path actually carries: <Code>stairs</Code>, <Code>narrow_passage</Code>, <Code>ramp</Code>. The profile system does the rest.</>) },
        { n: "06", title: "Validate and ship", body: (<>Drop the file under <Code>src/data/maps/&lt;building&gt;/&lt;floor&gt;.json</Code>. Zod parses it on load: wrong shape, fast failure. The home page, floor switcher, and assistant pick it up automatically.</>) },
      ];
  return (
    <Section n={n} ornament="tl" kicker={head.kicker} title={head.title} lead={head.lead}>
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((s) => (
          <li key={s.n} className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-[var(--shadow-card)]">
            <span className="text-overline text-[color:var(--brand)]">{head.stepLabel} {s.n}</span>
            <h3 className="text-h3">{s.title}</h3>
            <p className="text-body text-[color:var(--muted-foreground)]">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ─── Assistant ───────────────────────────────────────────────────────────── */

function AssistantSection({ n }: { n: string }) {
  const { lang } = useLang();
  const isEl = lang === "el";
  const head = isEl
    ? {
        kicker: "Βοηθός",
        title: "Ένας βοηθός που δεν εφευρίσκει δωμάτια.",
        lead:
          "Ο βοηθός είναι ένας chat πελάτης με ακριβώς δύο εργαλεία, find_room και find_route, που και τα δύο καλούν τον ίδιο κώδικα βιβλιοθήκης που χρησιμοποιεί ο χειροκίνητος επιλογέας διαδρομής. Δεν χρειάζεται ποτέ να επινοήσει ένα node id ή μια διαδρομή· ρωτάει.",
        c1Title: "Εργαλεία, όχι prompts",
        c1: (
          <>
            Οι είσοδοι των εργαλείων είναι τυποποιημένες με Zod. Ο runner
            χειρίζεται τον αυτόματο βρόχο, οπότε ο κώδικας του API είναι κάτω
            από 200 γραμμές. Όταν το <Code>find_route</Code> πετύχει, το ίδιο
            αντικείμενο διαδρομής που χρησιμοποιεί ο χειροκίνητος επιλογέας
            επιστρέφει στον χάρτη.
          </>
        ),
        c2Title: "Cached δεδομένα χάρτη",
        c2: (
          <>
            Όλο το JSON του κτιρίου βρίσκεται στο system prompt με ένα{" "}
            <Code>cache_control: ephemeral</Code> breakpoint. Ο πρώτος γύρος
            γράφει την cache· κάθε επόμενος τη διαβάζει στο περίπου ένα δέκατο
            του κόστους.
          </>
        ),
      }
    : {
        kicker: "Assistant",
        title: "A wayfinder that doesn't make up rooms.",
        lead:
          "The assistant is a chat client with exactly two tools, find_room and find_route, both of which call the same library code the manual route picker uses. It never has to invent a node id or a path; it asks.",
        c1Title: "Tools, not prompts",
        c1: (
          <>
            Tool inputs are typed with Zod. The runner handles the agent loop,
            so the API code is &lt; 200 lines. When <Code>find_route</Code>{" "}
            succeeds, the same path object the UI&rsquo;s manual picker uses
            gets piped back to the map.
          </>
        ),
        c2Title: "Cached map data",
        c2: (
          <>
            The whole building&rsquo;s JSON sits in the system prompt with a{" "}
            <Code>cache_control: ephemeral</Code> breakpoint. The first turn
            writes the cache; every turn after that reads it back at roughly a
            tenth of the price.
          </>
        ),
      };
  return (
    <Section n={n} ornament="br" kicker={head.kicker} title={head.title} lead={head.lead}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]" style={{ background: "var(--brand-soft)" }}>
            <Code2 className="h-5 w-5" />
          </span>
          <h3 className="text-h3">{head.c1Title}</h3>
          <p className="text-body text-[color:var(--muted-foreground)]">{head.c1}</p>
        </Card>
        <Card>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]" style={{ background: "var(--brand-soft)" }}>
            <Compass className="h-5 w-5" />
          </span>
          <h3 className="text-h3">{head.c2Title}</h3>
          <p className="text-body text-[color:var(--muted-foreground)]">{head.c2}</p>
        </Card>
      </div>
    </Section>
  );
}

/* ─── Final CTA ───────────────────────────────────────────────────────────── */

function FinalCTA() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        title: "Τώρα κατευθύνετε ένα αμαξίδιο γύρω από μια σκάλα.",
        lead: (
          <>
            Ανοίξτε το demo, αλλάξτε το προφίλ σε <em>Αμαξίδιο</em>, ζητήστε
            από τον βοηθό να σας πάει από την είσοδο στο αμφιθέατρο του πρώτου
            ορόφου, και δείτε τη διαδρομή να επιλέγει το ασανσέρ αντί για τη
            σκάλα.
          </>
        ),
        ctaDemo: "Άνοιγμα demo",
        ctaAbout: "Διαβάστε την τεχνική αναφορά",
      }
    : {
        title: "Now route a wheelchair around a flight of stairs.",
        lead: (
          <>
            Open the demo, switch the profile to <em>Wheelchair</em>, ask the
            assistant to take you from the entrance to the lecture hall on the
            first floor, and watch the route pick the elevator over the
            stairwell.
          </>
        ),
        ctaDemo: "Open the demo",
        ctaAbout: "Read the technical reference",
      };
  return (
    <section
      className="relative mt-24 overflow-hidden rounded-3xl border border-[var(--border)] p-8 shadow-[var(--shadow-card)] sm:p-12"
      style={{ background: "var(--brand-soft)" }}
    >
      <SectionOrnament position="tr" />
      <div className="relative flex flex-col items-start gap-5">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-white">
          <Accessibility className="h-5 w-5" />
        </span>
        <h2 className="text-h1 max-w-[24ch]">{t.title}</h2>
        <p className="text-lead max-w-[60ch]">{t.lead}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/maps/demo-building/ground"
            className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-body font-medium text-white shadow-[var(--shadow-card)] transition-[background,transform] hover:bg-[var(--brand-strong)] active:translate-y-px"
          >
            {t.ctaDemo}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-body font-medium text-[color:var(--foreground)] hover:bg-[var(--surface-2)]"
          >
            {t.ctaAbout}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */

function Footer() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        body: (
          <>
            Το AccessMap είναι αδελφικό έργο του <em>accessguide</em>, του
            χάρτη προσβασιμότητας του Πανεπιστημίου Μακεδονίας, χτισμένο ως
            προπτυχιακό εκπαιδευτικό υλικό. Δεν είναι προϊόν παραγωγικής
            χρήσης.
          </>
        ),
        github: "Open-source στο GitHub",
        ref: "Οδηγός στιλ και τεχνική αναφορά",
      }
    : {
        body: (
          <>
            AccessMap is a sibling of <em>accessguide</em>, the campus
            accessibility map for the University of Macedonia, built as
            undergraduate teaching material. It is not a production navigation
            product.
          </>
        ),
        github: "Open-source on GitHub",
        ref: "Style guide and technical reference",
      };
  return (
    <footer className="mt-16 flex flex-col gap-3 border-t border-[var(--border)] pt-8 text-caption">
      <p className="text-body text-[color:var(--muted-foreground)]">{t.body}</p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-[color:var(--muted-foreground)]">
          <Users className="h-3.5 w-3.5" /> {t.github}
        </span>
        <span className="text-[color:var(--muted-foreground)]">·</span>
        <Link href="/about" className="text-[color:var(--brand)] hover:underline">
          {t.ref}
        </Link>
      </div>
    </footer>
  );
}

/* ─── Shared primitives ───────────────────────────────────────────────────── */

function Section({
  n,
  kicker,
  title,
  lead,
  children,
  ornament = "tl",
}: {
  n?: string;
  kicker: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  ornament?: "tl" | "tr" | "bl" | "br";
}) {
  return (
    <section className="relative flex flex-col gap-6">
      <SectionOrnament position={ornament} />
      <header className="flex flex-col gap-3">
        {n ? (
          <NumberedKicker n={n} topic={kicker} />
        ) : (
          <p className="text-overline text-[color:var(--brand)]">{kicker}</p>
        )}
        <h2 className="text-h1 max-w-[24ch]">{title}</h2>
        {lead && <p className="text-lead max-w-[60ch]">{lead}</p>}
      </header>
      {children}
    </section>
  );
}

function NumberedKicker({ n, topic }: { n: string; topic: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-4 sm:gap-6">
        <span
          aria-hidden
          className="font-bold tabular-nums leading-[0.78] tracking-[-0.05em]"
          style={{
            color: "var(--brand)",
            fontSize: "clamp(4.5rem, 11vw, 8rem)",
          }}
        >
          {n}
          <span
            aria-hidden
            className="inline-block align-baseline"
            style={{
              width: "0.18em",
              height: "0.18em",
              marginLeft: "0.04em",
              marginBottom: "0.05em",
              borderRadius: "999px",
              background: "var(--brand)",
            }}
          />
        </span>
        <span className="flex flex-1 flex-col gap-2 pb-2 sm:pb-3">
          <span className="text-overline text-[color:var(--brand)]">{topic}</span>
          <span
            aria-hidden
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, var(--brand) 0%, var(--brand) 36%, transparent 100%)",
              opacity: 0.5,
            }}
          />
        </span>
      </div>
    </div>
  );
}

function SectionOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const anchors: Record<typeof position, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };
  const viewBox = "0 0 64 64";
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
      className={"pointer-events-none absolute hidden h-12 w-12 md:block " + anchors[position]}
      viewBox={viewBox}
      style={{ color: "var(--brand)", opacity: 0.32 }}
    >
      <path d={bracket} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="currentColor" />
      ))}
    </svg>
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
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--brand)]" style={{ background: "var(--brand-soft)" }}>
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
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--brand)" }} aria-hidden="true" />
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
