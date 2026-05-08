import { describe, expect, it } from "vitest";
import { parseFloorMap, type FloorMap } from "./schema";
import {
  PROFILES,
  findPath,
  findRouteBetweenRooms,
  nodeForRoom,
} from "./pathfind";
import demoGround from "@/data/maps/demo-building/ground.json";

const ground: FloorMap = parseFloorMap(demoGround);

describe("findPath", () => {
  it("finds the shortest path between adjacent corridor nodes", () => {
    const r = findPath(ground, "c1", "c2", PROFILES.default);
    expect(r).not.toBeNull();
    expect(r!.nodes).toEqual(["c1", "c2"]);
    expect(r!.cost).toBeGreaterThan(0);
  });

  it("routes from the entrance to a classroom via the corridor", () => {
    const r = findPath(ground, "n-entrance", "n-101", PROFILES.default);
    expect(r).not.toBeNull();
    expect(r!.nodes[0]).toBe("n-entrance");
    expect(r!.nodes[r!.nodes.length - 1]).toBe("n-101");
    // Must traverse the corridor
    expect(r!.nodes.some((id) => id.startsWith("c"))).toBe(true);
  });

  it("returns a zero-cost identity path when from === to", () => {
    const r = findPath(ground, "c1", "c1", PROFILES.default);
    expect(r).toEqual({ nodes: ["c1"], cost: 0 });
  });

  it("returns null when given an unknown node id", () => {
    expect(findPath(ground, "nope", "c1", PROFILES.default)).toBeNull();
    expect(findPath(ground, "c1", "nope", PROFILES.default)).toBeNull();
  });
});

describe("accessibility profiles", () => {
  it("default profile may use the stairs edge if it's on the shortest path", () => {
    const r = findPath(ground, "c4", "n-stair", PROFILES.default);
    expect(r).not.toBeNull();
    expect(r!.nodes).toEqual(["c4", "n-stair"]);
  });

  it("wheelchair profile cannot reach a stairs-only node", () => {
    // n-stair is connected to the corridor only via an edge tagged "stairs",
    // which is Infinity for the wheelchair profile.
    const r = findPath(ground, "c1", "n-stair", PROFILES.wheelchair);
    expect(r).toBeNull();
  });

  it("wheelchair profile still reaches the elevator", () => {
    const r = findPath(ground, "n-entrance", "n-elev", PROFILES.wheelchair);
    expect(r).not.toBeNull();
    // Last hop must be the elevator edge
    expect(r!.nodes[r!.nodes.length - 1]).toBe("n-elev");
  });
});

describe("room-level routing", () => {
  it("resolves a room to its representative node", () => {
    expect(nodeForRoom(ground, "room-101")).toBe("n-101");
    expect(nodeForRoom(ground, "missing")).toBeNull();
  });

  it("routes between rooms by id", () => {
    const r = findRouteBetweenRooms(
      ground,
      "entrance",
      "lab-1",
      PROFILES.default,
    );
    expect(r).not.toBeNull();
    expect(r!.nodes[0]).toBe("n-entrance");
    expect(r!.nodes[r!.nodes.length - 1]).toBe("n-lab");
  });
});
