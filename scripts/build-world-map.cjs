const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const input = path.join(root, "assets/maps/world-countries.geojson");
const output = path.join(root, "assets/maps/worldCountries.json");
const geojson = JSON.parse(fs.readFileSync(input, "utf8"));
const countryRecords = JSON.parse(fs.readFileSync(path.join(root, "model/world/countries.json"), "utf8"));

const toPath = (ring) => ring.map(([longitude, latitude], index) => {
  const x = ((longitude + 180) / 360) * 1000;
  const y = ((90 - latitude) / 180) * 500;
  return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ") + "Z";

const getBounds = (polygons) => {
  const points = polygons.flat(2);
  const projected = points.map(([longitude, latitude]) => [
    ((longitude + 180) / 360) * 1000,
    ((90 - latitude) / 180) * 500,
  ]);
  return projected.reduce((bounds, [x, y]) => ({
    minX: Math.min(bounds.minX, x),
    minY: Math.min(bounds.minY, y),
    maxX: Math.max(bounds.maxX, x),
    maxY: Math.max(bounds.maxY, y),
  }), { minX: 1000, minY: 500, maxX: 0, maxY: 0 });
};

const shapes = geojson.features.flatMap((feature) => {
  const { ISO_A2: isoCode, ADMIN, CONTINENT: continent } = feature.properties;
  const code = isoCode && isoCode !== "-99"
    ? isoCode
    : countryRecords.find((country) => country.name === ADMIN)?.code;
  if (!code || code === "-99" || continent === "Antarctica") return [];

  const polygons = feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.type === "MultiPolygon"
      ? feature.geometry.coordinates
      : [];
  const paths = polygons.flatMap((polygon) => polygon.map(toPath));
  const focusBounds = polygons.map((polygon) => getBounds([polygon])).sort((left, right) =>
    (right.maxX - right.minX) * (right.maxY - right.minY) -
    (left.maxX - left.minX) * (left.maxY - left.minY),
  )[0];
  return paths.length ? [{ id: code, continent, paths, bounds: getBounds(polygons), focusBounds }] : [];
});

fs.writeFileSync(output, `${JSON.stringify(shapes)}\n`);
console.log(`Created ${shapes.length} country SVG shapes from Natural Earth data.`);
