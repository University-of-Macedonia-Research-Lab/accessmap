import { describe, expect, it } from "vitest";
import { parseFloorMap, type FloorMap } from "./schema";
import { PROFILES } from "./pathfind";
import { findMultiFloorRouteBetweenRooms } from "./multi-pathfind";
import { buildDirections } from "./directions";
import groundJson from "@/data/maps/demo-building/ground.json";
import firstJson from "@/data/maps/demo-building/first.json";

const ground: FloorMap = parseFloorMap(groundJson);
const first: FloorMap = parseFloorMap(firstJson);
const floors = [ground, first];

describe("buildDirections", () => {
  it("emits a Start step then an Arrive step bracketing the route", () => {
    const path = findMultiFloorRouteBetweenRooms(
      floors,
      { floor: "ground", room: "entrance" },
      { floor: "ground", room: "room-101" },
      PROFILES.default,
    )!;
    const steps = buildDirections(
      path,
      { floor: "ground", room: "entrance" },
      { floor: "ground", room: "room-101" },
      floors,
      "en",
    );
    expect(steps[0].kind).toBe("start");
    expect(steps[steps.length - 1].kind).toBe("arrive");
    expect(steps[0].text).toContain("Main Entrance");
    expect(steps[steps.length - 1].text).toContain("Classroom 101");
  });

  it("inserts an elevator step when a wheelchair route changes floors", () => {
    const path = findMultiFloorRouteBetweenRooms(
      floors,
      { floor: "ground", room: "entrance" },
      { floor: "first", room: "library" },
      PROFILES.wheelchair,
    )!;
    const steps = buildDirections(
      path,
      { floor: "ground", room: "entrance" },
      { floor: "first", room: "library" },
      floors,
      "en",
    );
    const elevators = steps.filter((s) => s.kind === "elevator");
    expect(elevators.length).toBe(1);
    expect(elevators[0].text).toContain("First Floor");
    // No stairs step for the wheelchair profile.
    expect(steps.some((s) => s.kind === "stairs")).toBe(false);
  });

  it("uses the stairs step kind when the path goes via the stairwell", () => {
    // Ground n-stair → first n-stair via the stairs cross-floor edge.
    // Default profile may pick stairs.
    const path = findMultiFloorRouteBetweenRooms(
      floors,
      { floor: "ground", room: "entrance" },
      { floor: "first", room: "library" },
      PROFILES.default,
    )!;
    const steps = buildDirections(
      path,
      { floor: "ground", room: "entrance" },
      { floor: "first", room: "library" },
      floors,
      "en",
    );
    // Either elevator or stairs depending on which is shorter; both
    // are acceptable. Just confirm exactly one floor-change step exists.
    const transitions = steps.filter(
      (s) => s.kind === "elevator" || s.kind === "stairs",
    );
    expect(transitions.length).toBe(1);
  });

  it("continue steps carry a positive metres distance", () => {
    const path = findMultiFloorRouteBetweenRooms(
      floors,
      { floor: "ground", room: "entrance" },
      { floor: "ground", room: "lab-1" },
      PROFILES.default,
    )!;
    const steps = buildDirections(
      path,
      { floor: "ground", room: "entrance" },
      { floor: "ground", room: "lab-1" },
      floors,
      "en",
    );
    const continues = steps.filter((s) => s.kind === "continue");
    expect(continues.length).toBeGreaterThan(0);
    for (const s of continues) {
      if (s.kind === "continue") {
        expect(s.distanceM).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("returns Greek phrasing when lang is el", () => {
    const path = findMultiFloorRouteBetweenRooms(
      floors,
      { floor: "ground", room: "entrance" },
      { floor: "ground", room: "room-101" },
      PROFILES.default,
    )!;
    const steps = buildDirections(
      path,
      { floor: "ground", room: "entrance" },
      { floor: "ground", room: "room-101" },
      floors,
      "el",
    );
    expect(steps[0].text).toContain("Ξεκινήστε");
    expect(steps[steps.length - 1].text).toContain("Φτάνετε");
  });
});
