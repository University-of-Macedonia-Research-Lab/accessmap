import { describe, expect, it } from "vitest";
import { parseFloorMap, type FloorMap } from "./schema";
import { PROFILES } from "./pathfind";
import {
  findMultiFloorPath,
  findMultiFloorRouteBetweenRooms,
  nodeForRoomOnFloor,
} from "./multi-pathfind";
import groundJson from "@/data/maps/demo-building/ground.json";
import firstJson from "@/data/maps/demo-building/first.json";

const ground: FloorMap = parseFloorMap(groundJson);
const first: FloorMap = parseFloorMap(firstJson);
const floors = [ground, first];

describe("findMultiFloorPath", () => {
  it("routes within a single floor without a cross-floor segment", () => {
    const r = findMultiFloorPath(
      floors,
      { floor: "ground", node: "n-entrance" },
      { floor: "ground", node: "n-101" },
      PROFILES.default,
    );
    expect(r).not.toBeNull();
    expect(r!.segments).toHaveLength(1);
    expect(r!.segments[0].floorSlug).toBe("ground");
  });

  it("routes from ground entrance to first-floor library via the elevator", () => {
    const r = findMultiFloorPath(
      floors,
      { floor: "ground", node: "n-entrance" },
      { floor: "first", node: "n-lib" },
      PROFILES.wheelchair,
    );
    expect(r).not.toBeNull();
    // Should change floor exactly once.
    expect(r!.segments.length).toBe(2);
    expect(r!.segments[0].floorSlug).toBe("ground");
    expect(r!.segments[1].floorSlug).toBe("first");
    // Transition node on each side must be the elevator (stairs are blocked).
    expect(r!.segments[0].nodes).toContain("n-elev");
    expect(r!.segments[1].nodes).toContain("n-elev");
    expect(r!.segments[1].nodes).not.toContain("n-stair");
  });

  it("default profile may pick the stairs if cheaper", () => {
    const r = findMultiFloorPath(
      floors,
      { floor: "ground", node: "n-entrance" },
      { floor: "first", node: "n-lh" },
      PROFILES.default,
    );
    expect(r).not.toBeNull();
    // Either elevator or stairs is fine, but it must traverse one.
    const all = r!.segments.flatMap((s) => s.nodes);
    expect(all.some((n) => n === "n-elev" || n === "n-stair")).toBe(true);
  });

  it("returns null when start or goal is unknown", () => {
    expect(
      findMultiFloorPath(
        floors,
        { floor: "ground", node: "nope" },
        { floor: "first", node: "n-lib" },
        PROFILES.default,
      ),
    ).toBeNull();
    expect(
      findMultiFloorPath(
        floors,
        { floor: "ground", node: "c1" },
        { floor: "missing", node: "n-lib" },
        PROFILES.default,
      ),
    ).toBeNull();
  });
});

describe("nodeForRoomOnFloor / findMultiFloorRouteBetweenRooms", () => {
  it("resolves a room id to its representative node on a given floor", () => {
    expect(nodeForRoomOnFloor(floors, "first", "library")).toEqual({
      floor: "first",
      node: "n-lib",
    });
  });

  it("routes between rooms across floors", () => {
    const r = findMultiFloorRouteBetweenRooms(
      floors,
      { floor: "ground", room: "entrance" },
      { floor: "first", room: "office-302" },
      PROFILES.default,
    );
    expect(r).not.toBeNull();
    expect(r!.segments.length).toBe(2);
  });
});
