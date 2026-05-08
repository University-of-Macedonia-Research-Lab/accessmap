"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/i18n";

export function AboutContent() {
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
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Σχετικά με το AccessMap",
        title: "Εσωτερική προσβασιμότητα, σχεδιασμένη από δεδομένα.",
        lead:
          "Το AccessMap είναι εκπαιδευτικό έργο. Συνδυάζει ένα μικρό σχήμα JSON για κατόψεις ορόφων με κλασική εύρεση διαδρομής και έναν βοηθό που χρησιμοποιεί εργαλεία, ώστε προπτυχιακοί φοιτητές να διαβάσουν ολόκληρη τη στοίβα από άκρο σε άκρο σε ένα απόγευμα.",
        ctaDemo: "Άνοιγμα demo",
        ctaGitHub: "Πηγή στο GitHub",
      }
    : {
        kicker: "About AccessMap",
        title: "Indoor accessibility, drawn from data.",
        lead:
          "AccessMap is a teaching project. It pairs a small JSON schema for floor plans with classic pathfinding and a tool-using assistant, so undergraduates can read the whole stack end to end in an afternoon.",
        ctaDemo: "Open the demo",
        ctaGitHub: "Source on GitHub",
      };
  return (
    <section className="flex flex-col gap-3">
      <p className="text-overline">{t.kicker}</p>
      <h1 className="text-display">{t.title}</h1>
      <p className="text-lead">{t.lead}</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/maps/demo-building/ground"
          className="inline-flex items-center rounded-md bg-[var(--brand)] px-3 py-1.5 text-body font-medium text-white transition-opacity hover:opacity-90"
        >
          {t.ctaDemo}
        </Link>
        <Link
          href="https://github.com/University-of-Macedonia-Research-Lab/accessmap"
          className="inline-flex items-center rounded-md border border-[var(--border)] px-3 py-1.5 text-body font-medium hover:bg-[var(--surface-2)]"
        >
          {t.ctaGitHub}
        </Link>
      </div>
    </section>
  );
}

function SchemaSection() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Πρώτα τα δεδομένα",
        title: "Οι όροφοι είναι JSON, όχι έργα τέχνης",
        lead:
          "Κάθε όροφος είναι ένα έγγραφο JSON με δωμάτια, πόρτες και γράφημα δρομολόγησης. Ο σχεδιαστής διασχίζει το έγγραφο για να φτιάξει το SVG· ο αλγόριθμος εύρεσης διαδρομής διασχίζει το ίδιο γράφημα για να σχεδιάσει διαδρομές. Η προσθήκη νέου ορόφου σημαίνει ένα νέο αρχείο JSON, όχι επεξεργασία γραφικών.",
        body: (
          <>
            Ένας όροφος αναφέρει τα δωμάτια ως 2-D πολύγωνα σε επίπεδο σύστημα
            συντεταγμένων, τις πόρτες ως σημεία σε κοινούς τοίχους, και ένα
            γράφημα κόμβων και ακμών που ζει δίπλα στη γεωμετρία. Οι ακμές
            φέρουν feature tags όπως <Code>stairs</Code>, <Code>elevator</Code>,{" "}
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
        kicker: "Data first",
        title: "Floors are JSON, not artwork",
        lead:
          "Every floor is a JSON document with rooms, doors, and a routing graph. The renderer walks that document to draw SVG; the pathfinder walks the same graph to plan routes. Adding a new floor means writing a new JSON file, not editing artwork.",
        body: (
          <>
            A floor lists rooms as 2-D polygons in a flat coordinate frame, doors
            as points on shared walls, and a graph of nodes and edges that lives
            alongside the geometry. Edges carry feature tags like{" "}
            <Code>stairs</Code>, <Code>elevator</Code>, <Code>ramp</Code>, or{" "}
            <Code>narrow_passage</Code> so we can reweight them per-profile.
          </>
        ),
        source: (
          <>
            Schema source: <Code>src/lib/map/schema.ts</Code>, a Zod schema that
            validates the JSON and exports the matching TypeScript types.
          </>
        ),
      };
  return (
    <Section kicker={t.kicker} title={t.title} lead={t.lead}>
      <p className="text-body">{t.body}</p>
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
      <p className="text-caption">{t.source}</p>
    </Section>
  );
}

function ArchitectureSection() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Σχεδίαση",
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
        kicker: "Drawing",
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
    <Section kicker={t.kicker} title={t.title} lead={t.lead}>
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        {t.items.map((it, i) => (
          <li key={i}>
            <span className="font-medium">{it.strong}</span>
            {it.body}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function PathfindingSection() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Δρομολόγηση",
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
        kicker: "Routing",
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
    <Section kicker={t.kicker} title={t.title} lead={t.lead}>
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        {t.items.map((it, i) => (
          <li key={i}>
            <span className="font-medium">{it.label}</span>
            {it.body}
          </li>
        ))}
      </ul>
      <p className="text-caption">{t.source}</p>
    </Section>
  );
}

function MultiFloorSection() {
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Δρομολόγηση ανάμεσα σε ορόφους",
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
        kicker: "Routing across floors",
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
    <Section kicker={t.kicker} title={t.title} lead={t.lead}>
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        {t.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
      <p className="text-caption">{t.source}</p>
    </Section>
  );
}

function ProfilesSection() {
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
        kicker: "Προσβασιμότητα",
        title: "Τα προφίλ αλλάζουν το κόστος, όχι το γράφημα",
        lead:
          "Το ίδιο γράφημα δίνει διαφορετικές διαδρομές για διαφορετικούς χρήστες. Κάθε προφίλ είναι μια αντιστοίχιση από feature tag σε πολλαπλασιαστή βάρους. Βάλτε ένα feature στο ∞ και κάθε ακμή με αυτό το tag βγαίνει από την αναζήτηση.",
        h1: "Feature",
        h2: "Default",
        h3: "Αμαξίδιο",
        h4: "Άτομο με προβλήματα όρασης",
      }
    : {
        kicker: "Accessibility",
        title: "Profiles change the cost, not the graph",
        lead:
          "The same map graph yields different routes for different users. Each profile is a map from feature tag to weight multiplier. Set a feature to ∞ and any edge with that tag drops out of the search.",
        h1: "Feature",
        h2: "Default",
        h3: "Wheelchair",
        h4: "Visually impaired",
      };
  return (
    <Section kicker={t.kicker} title={t.title} lead={t.lead}>
      <div className="overflow-x-auto rounded-md border border-[var(--border)]">
        <table className="w-full text-body">
          <thead className="bg-[var(--surface-2)] text-caption uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">{t.h1}</th>
              <th className="px-3 py-2 text-left font-semibold">{t.h2}</th>
              <th className="px-3 py-2 text-left font-semibold">{t.h3}</th>
              <th className="px-3 py-2 text-left font-semibold">{t.h4}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feat, ...vals]) => (
              <tr key={feat} className="border-t border-[var(--border)]">
                <td className="px-3 py-2"><Code>{feat}</Code></td>
                {vals.map((v, i) => (
                  <td key={i} className="px-3 py-2 tabular-nums">{v}</td>
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
  const { lang } = useLang();
  const isEl = lang === "el";
  const t = isEl
    ? {
        kicker: "Βοηθός",
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
        kicker: "Assistant",
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
    <Section kicker={t.kicker} title={t.title} lead={t.lead}>
      <ul className="list-disc space-y-1.5 pl-5 text-body">
        {t.items.map((it, i) => (
          <li key={i}>
            <span className="font-medium">{it.strong}</span>
            {it.body}
          </li>
        ))}
      </ul>
      <p className="text-caption">{t.source}</p>
    </Section>
  );
}

function StackSection() {
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
  return (
    <Section kicker={isEl ? "Στοίβα" : "Stack"} title={isEl ? "Τι τρέχει" : "What's running"}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(([name, desc]) => (
          <li key={name} className="rounded-md border border-[var(--border)] bg-[var(--background)] p-3 text-body shadow-[var(--shadow-card)]">
            <p className="font-medium">{name}</p>
            <p className="text-caption">{desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function StyleGuide() {
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
        { name: "Border", cssVar: "--border", note: "Διαχωριστικά, περιγράμματα input." },
        { name: "Success", cssVar: "--success", note: "Καταστάσεις επιβεβαίωσης." },
        { name: "Warning", cssVar: "--warning", note: "Ήπιες προειδοποιήσεις, καμία διαδρομή." },
        { name: "Danger", cssVar: "--danger", note: "Καταστροφικά, μπλοκαρισμένες ακμές." },
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
        { name: "Border", cssVar: "--border", note: "Dividers, input outlines." },
        { name: "Success", cssVar: "--success", note: "Confirmation states." },
        { name: "Warning", cssVar: "--warning", note: "Soft alerts, no-route." },
        { name: "Danger", cssVar: "--danger", note: "Destructive, blocked edges." },
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
    ? { kicker: "Σχεδιαστικό σύστημα", title: "Tokens και κλίμακα τυπογραφίας", h1: "Color tokens", h2: "Type scale", h3: "Class", h4: "Μέγεθος / line-height · weight", h5: "Χρήση", h6: "Specimens",
        specLead: "Lead, χρησιμοποιείται σε εισαγωγικές παραγράφους ενότητας.",
        specBody: "Body, το βασικό μέγεθος, σχεδόν για όλο το κείμενο.",
        specCaption: "Caption, metadata, νύξεις, helper text.",
        specOverline: "Overline label" }
    : { kicker: "Design system", title: "Tokens and type scale", h1: "Color tokens", h2: "Type scale", h3: "Class", h4: "Size / line-height · weight", h5: "Use", h6: "Specimens",
        specLead: "Lead, used for intro paragraphs that introduce a section.",
        specBody: "Body, the workhorse size, used for almost all paragraph copy.",
        specCaption: "Caption, metadata, hints, helper text.",
        specOverline: "Overline label" };

  return (
    <Section kicker={t.kicker} title={t.title}>
      <div className="flex flex-col gap-3">
        <h3 className="text-h3">{t.h1}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {swatches.map((s) => (
            <div key={s.cssVar} className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-card)]">
              <div className="h-12 w-full" style={{ background: `var(${s.cssVar})` }} aria-label={s.name} />
              <div className="flex flex-col gap-0.5 p-2.5">
                <p className="text-body font-medium">{s.name}</p>
                <p className="text-caption"><Code>{s.cssVar}</Code></p>
                <p className="text-caption">{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-h3">{t.h2}</h3>
        <div className="overflow-x-auto rounded-md border border-[var(--border)]">
          <table className="w-full text-body">
            <thead className="bg-[var(--surface-2)] text-caption uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">{t.h3}</th>
                <th className="px-3 py-2 text-left font-semibold">{t.h4}</th>
                <th className="px-3 py-2 text-left font-semibold">{t.h5}</th>
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

        <div className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <p className="text-overline">{t.h6}</p>
          <p className="text-display">Display</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-lead">{t.specLead}</p>
          <p className="text-body">{t.specBody}</p>
          <p className="text-caption">{t.specCaption}</p>
          <p className="text-overline">{t.specOverline}</p>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  const { lang } = useLang();
  const isEl = lang === "el";
  return (
    <footer className="border-t border-[var(--border)] pt-6 text-caption">
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
