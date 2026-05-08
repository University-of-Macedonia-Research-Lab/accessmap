/**
 * Filesystem-backed loaders for floor JSON. The geometry intentionally lives
 * in JSON files (not Prisma) so a contributor can add a floor by dropping a
 * file into `src/data/maps/<building>/<floor>.json`, no migration needed.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseFloorMap, type FloorMap } from "./schema";

const ROOT = path.join(process.cwd(), "src", "data", "maps");

export async function loadFloor(
  building: string,
  floor: string,
): Promise<FloorMap | null> {
  const file = path.join(ROOT, building, `${floor}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    return parseFloorMap(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function loadBuilding(building: string): Promise<FloorMap[]> {
  const dir = path.join(ROOT, building);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const out: FloorMap[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".json")) continue;
    const floor = entry.slice(0, -".json".length);
    const map = await loadFloor(building, floor);
    if (map) out.push(map);
  }
  return out.sort((a, b) => a.level - b.level);
}

export async function listBuildings(): Promise<string[]> {
  try {
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }
}
