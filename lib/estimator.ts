import {
  estimatorConfig,
  estimatorFinish,
  estimatorGround,
  estimatorLocations,
  estimatorTypes,
} from "@/data/siteData";

export interface EstimatorInput {
  typeId: string;
  area: number;
  locationId: string;
  groundId: string;
  finishId: string;
}

export interface EstimateLine {
  label: string;
  value: string;
}

export interface Estimate {
  ratePerSqm: number;
  base: number;
  low: number;
  high: number;
  contingency: number;
  weeksMin: number;
  weeksMax: number;
  tonnesSteel: number;
  cubicMetresConcrete: number;
  crew: number;
  lines: EstimateLine[];
}

const typeDefaults = estimatorTypes[0]!;

function option(list: typeof estimatorTypes, id: string) {
  return list.find((item) => item.id === id) ?? list[0]!;
}

/** Deterministic order-of-cost model — no randomness, so SSR and client agree. */
export function estimateProject(input: EstimatorInput): Estimate {
  const type = option(estimatorTypes, input.typeId) ?? typeDefaults;
  const location = option(estimatorLocations, input.locationId);
  const ground = option(estimatorGround, input.groundId);
  const finish = option(estimatorFinish, input.finishId);

  const area = Math.min(Math.max(input.area, estimatorConfig.minArea), estimatorConfig.maxArea);
  const ratePerSqm = Math.round(
    type.ratePerSqm * location.multiplier * ground.multiplier * finish.multiplier,
  );
  const base = ratePerSqm * area;
  const contingency = base * estimatorConfig.contingency;
  const total = base + contingency;
  const spread = estimatorConfig.rangeSpread;

  const weeksBase = type.baseWeeks + (area / 1000) * type.weeksPer1000Sqm;
  const weeksMin = Math.round(weeksBase * 0.92);
  const weeksMax = Math.round(weeksBase * 1.16);

  // Structural rules of thumb used by our pre-construction team.
  const intensity = type.id === "industrial" ? 0.055 : type.id === "civil" ? 0.11 : 0.085;
  const tonnesSteel = Math.round(area * intensity * (finish.multiplier * 0.85 + 0.15));
  const cubicMetresConcrete = Math.round(
    area * (type.id === "industrial" ? 0.32 : type.id === "retrofit" ? 0.28 : 0.45),
  );
  const crew = Math.round(28 + area / 260);

  return {
    ratePerSqm,
    base,
    low: Math.round(total * (1 - spread)),
    high: Math.round(total * (1 + spread)),
    contingency: Math.round(contingency),
    weeksMin,
    weeksMax,
    tonnesSteel,
    cubicMetresConcrete,
    crew,
    lines: [
      { label: "Type", value: type.label },
      { label: "Floor area", value: `${area.toLocaleString("en-US")} m²` },
      { label: "Location", value: location.label },
      { label: "Ground", value: ground.label },
      { label: "Finish", value: finish.label },
    ],
  };
}

export function estimatorLabels(input: EstimatorInput) {
  return {
    type: option(estimatorTypes, input.typeId).label,
    location: option(estimatorLocations, input.locationId),
    ground: option(estimatorGround, input.groundId),
    finish: option(estimatorFinish, input.finishId),
  };
}
