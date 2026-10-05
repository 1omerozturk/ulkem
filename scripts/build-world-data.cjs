const fs = require("node:fs");
const path = require("node:path");
const { gzipSync } = require("node:zlib");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "model/world/source");
const rawCountries = require(path.join(sourceRoot, "countries.min.json"));
const turkishNames = require(path.join(sourceRoot, "country-names-tr.json")).countries;
const flagDirectory = path.join(sourceRoot, "flag-icons-main/flags/4x3");
const outputDirectory = path.join(root, "model/world");

const countries = [];
const flags = {};

for (const [code, country] of Object.entries(rawCountries)) {
  const flagPath = path.join(flagDirectory, `${code.toLowerCase()}.svg`);
  if (
    !country.capital ||
    !country.continent ||
    country.continent === "AN" ||
    !fs.existsSync(flagPath)
  ) continue;

  const flagXml = fs
    .readFileSync(flagPath, "utf8")
    .replace(/<\?xml[^>]*\?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .trim();

  countries.push({
    code,
    name: country.name,
    nameTr: Array.isArray(turkishNames[code])
      ? turkishNames[code].find((name) => name.length > 6) || turkishNames[code][0]
      : turkishNames[code] || country.name,
    capital: country.capital,
    continent: country.continent,
  });
  flags[code] = flagXml;
}

countries.sort((left, right) => left.name.localeCompare(right.name, "en"));
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "countries.json"),
  `${JSON.stringify(countries)}\n`,
);
const compressedFlags = gzipSync(Buffer.from(JSON.stringify(flags))).toString("base64");
fs.writeFileSync(
  path.join(outputDirectory, "flags-compressed.json"),
  `${JSON.stringify(compressedFlags)}\n`,
);

console.log(`Created ${countries.length} country records and ${Object.keys(flags).length} local flags.`);
