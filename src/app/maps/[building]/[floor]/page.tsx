import { notFound } from "next/navigation";
import { loadBuilding } from "@/lib/map/loader";
import { FloorScreen } from "@/components/map/floor-screen";

type Params = { building: string; floor: string };

export default async function FloorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { building, floor } = await params;
  const floors = await loadBuilding(building);
  const current = floors.find((f) => f.floorSlug === floor);
  if (!current) notFound();
  return (
    <FloorScreen
      buildingSlug={building}
      floors={floors}
      currentFloorSlug={current.floorSlug}
    />
  );
}
