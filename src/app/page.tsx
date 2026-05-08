import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { parseFloorMap, type FloorMap } from "@/lib/map/schema";

type FloorEntry = { building: string; floor: string; map: FloorMap };

async function listFloors(): Promise<FloorEntry[]> {
  const root = path.join(process.cwd(), "src", "data", "maps");
  const out: FloorEntry[] = [];
  let buildings: string[];
  try {
    buildings = await fs.readdir(root);
  } catch {
    return out;
  }
  for (const building of buildings) {
    let entries: string[];
    try {
      entries = await fs.readdir(path.join(root, building));
    } catch {
      continue;
    }
    for (const file of entries) {
      if (!file.endsWith(".json")) continue;
      const floor = file.slice(0, -".json".length);
      try {
        const raw = await fs.readFile(path.join(root, building, file), "utf8");
        out.push({ building, floor, map: parseFloorMap(JSON.parse(raw)) });
      } catch {
        // Skip files that don't parse — keeps the home page resilient.
      }
    }
  }
  return out.sort((a, b) =>
    a.building === b.building
      ? a.map.level - b.map.level
      : a.building.localeCompare(b.building),
  );
}

export default async function Home() {
  const floors = await listFloors();
  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-3">
          <p className="text-overline">AccessMap</p>
          <h1 className="text-display">Indoor accessibility, drawn from data.</h1>
          <p className="text-lead">
            Floors are described as JSON; the renderer, the routing engine,
            and the AI assistant all read the same graph. Pick a floor to
            explore, or start with the explanation.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/about"
              className="inline-flex items-center rounded-md border border-[var(--border)] px-3 py-1.5 text-body font-medium hover:bg-[var(--surface-2)]"
            >
              How it works
            </Link>
          </div>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-overline">Available floors</h2>
          {floors.length === 0 ? (
            <p className="text-body">
              No floors found. Add one under <code>src/data/maps</code>.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {floors.map(({ building, floor, map }) => (
                <li key={`${building}/${floor}`}>
                  <Link
                    href={`/maps/${building}/${floor}`}
                    className="flex flex-col gap-1 rounded-md border border-[var(--border)] bg-[var(--background)] p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span className="text-overline">{building}</span>
                    <span className="text-h3">{map.name.en}</span>
                    <span className="text-caption">
                      Level {map.level} · {map.rooms.length} rooms ·{" "}
                      {map.nodes.length} nodes
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
