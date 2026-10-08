type CountryNameRecord = {
  code: string;
  name: string;
  nameTr?: string | string[];
  capital: string;
};

const countryNameOverrides: Record<string, string> = {
  CV: "Cabo Verde",
  TL: "Doğu Timor",
};

const capitalNameOverrides: Record<string, string> = {
  AF: "Kabil",
  AL: "Tiran",
  DZ: "Cezayir",
  AM: "Erivan",
  AT: "Viyana",
  AZ: "Bakü",
  BD: "Dakka",
  BE: "Brüksel",
  AE: "Abu Dabi",
  MX: "Meksika Şehri",
  VE: "Karakas",
  BA: "Saraybosna",
  BG: "Sofya",
  BF: "Vagadugu",
  BT: "Timpu",
  GB: "Londra",
  TD: "Encemine",
  CZ: "Prag",
  CN: "Pekin",
  DK: "Kopenhag",
  EC: "Kito",
  ID: "Cakarta",
  CI: "Yamusukro",
  GE: "Tiflis",
  GH: "Akra",
  GN: "Konakri",
  ZA: "Pretorya",
  IQ: "Bağdat",
  IR: "Tahran",
  IT: "Roma",
  KH: "Punom Pen",
  CA: "Ottava",
  ME: "Podgoritsa",
  KG: "Bişkek",
  KI: "Tarava",
  CG: "Brazavil",
  CD: "Kinşasa",
  KR: "Seul",
  CR: "San Hose",
  LA: "Viyentiyan",
  LY: "Trablus",
  LB: "Beyrut",
  HU: "Budapeşte",
  MW: "Lilongve",
  MV: "Malé",
  EG: "Kahire",
  MN: "Ulanbator",
  XK: "Priştine",
  EE: "Tallin",
  MD: "Kişinev",
  MR: "Nuakşot",
  MM: "Nepido",
  NP: "Katmandu",
  UZ: "Taşkent",
  PA: "Panama Şehri",
  PL: "Varşova",
  PT: "Lizbon",
  RO: "Bükreş",
  RU: "Moskova",
  KN: "Baster",
  LK: "Kolombo",
  RS: "Belgrad",
  SI: "Lübliyana",
  SO: "Mogadişu",
  SD: "Hartum",
  SY: "Şam",
  SA: "Riyad",
  TJ: "Duşanbe",
  TN: "Tunus",
  TM: "Aşkabat",
  UA: "Kiev",
  OM: "Muskat",
  VA: "Vatikan",
  YE: "Sana",
  GR: "Atina",
  US: "Vaşington",
};

export function getTurkishCountryName(country: CountryNameRecord): string {
  const override = countryNameOverrides[country.code];
  if (override) return override;

  const localizedName = Array.isArray(country.nameTr)
    ? country.nameTr[0]
    : country.nameTr;
  return localizedName?.trim() || country.name;
}

export function getTurkishCapitalName(country: CountryNameRecord): string {
  return capitalNameOverrides[country.code] || country.capital;
}
