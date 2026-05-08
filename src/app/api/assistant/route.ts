import { z } from "zod";
import { askAssistant, type AssistantMessage } from "@/lib/ai/assistant";
import { loadBuilding } from "@/lib/map/loader";

const RequestSchema = z.object({
  building: z.string().min(1),
  /** The floor the user is currently viewing, used to disambiguate "here". */
  floor: z.string().min(1),
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .max(20)
    .default([]),
  lang: z.enum(["en", "el"]).default("en"),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "invalid_request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const floors = await loadBuilding(parsed.data.building);
  if (floors.length === 0) {
    return Response.json({ error: "building_not_found" }, { status: 404 });
  }
  if (!floors.some((f) => f.floorSlug === parsed.data.floor)) {
    return Response.json({ error: "floor_not_found" }, { status: 404 });
  }

  try {
    const result = await askAssistant(
      floors,
      parsed.data.floor,
      parsed.data.history as AssistantMessage[],
      parsed.data.message,
      parsed.data.lang,
    );
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 500;
    return Response.json({ error: message }, { status });
  }
}
