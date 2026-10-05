export const WORLD_CONTINENTS = Object.freeze([
  { code: "all", name: "Tüm dünya" },
  { code: "AF", name: "Afrika" },
  { code: "AS", name: "Asya" },
  { code: "EU", name: "Avrupa" },
  { code: "NA", name: "Kuzey Amerika" },
  { code: "OC", name: "Okyanusya" },
  { code: "SA", name: "Güney Amerika" },
]);

export const getContinentName = (code) =>
  WORLD_CONTINENTS.find((continent) => continent.code === code)?.name ?? null;
