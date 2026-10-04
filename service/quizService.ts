type Province = {
  id: number;
  name: string;
  region?: { tr?: string; en?: string };
  isMetropolitan: boolean;
};

type District = { id: number; name: string; provinceId: number };

// Türkiye quizleri uygulama paketindeki sabit veriden üretilir; ağ bağlantısı gerekmez.
const provinces = require("../model/provinces.json") as Province[];
const districts = require("../model/districts.json") as District[];
const mapProvinces = require("../assets/maps/turkeyProvinces.json") as {
  id: number;
  name: string;
  paths: string[];
}[];

type Country = {
  name: { common?: string; official?: string };
  capital?: string[];
  region?: string;
  continents?: string[];
  flags?: { png?: string; svg?: string };
};

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: boolean;
  flagUrl?: string;
};

const shuffle = <T,>(values: T[]): T[] => {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
};

const sample = <T,>(values: T[], size: number): T[] =>
  shuffle(values).slice(0, size);

const makeQuestion = (
  question: string,
  options: string[],
  correctOption: string,
  type?: boolean,
): QuizQuestion => {
  const shuffledOptions = shuffle([...new Set(options)]);
  const correctAnswer = shuffledOptions.indexOf(correctOption);
  if (shuffledOptions.length !== 4 || correctAnswer < 0) {
    throw new Error("Quiz için dört farklı cevap seçeneği oluşturulamadı.");
  }

  return {
    id: Date.now() + Math.floor(Math.random() * 1_000_000),
    question,
    options: shuffledOptions,
    correctAnswer,
    ...(type === undefined ? {} : { type }),
  };
};

const getCountryName = (country: Country) =>
  country.name?.common || country.name?.official || "Bilinmeyen ülke";

let countriesRequest: Promise<Country[]> | null = null;

async function fetchCountries(): Promise<Country[]> {
  if (!countriesRequest) {
    countriesRequest = fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,region,flags,continents",
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Ülke verisi alınamadı (HTTP ${response.status}).`);
        }
        const data = (await response.json()) as Country[];
        return data.filter(
          (country) =>
            getCountryName(country) &&
            country.capital?.length &&
            country.region &&
            country.continents?.length,
        );
      })
      .catch((error) => {
        countriesRequest = null;
        throw error;
      });
  }
  return countriesRequest;
}

async function createRegionQuestions(size: number): Promise<QuizQuestion[]> {
  const validProvinces = provinces.filter((province) => province.region?.tr);
  const regions = [...new Set(validProvinces.map((province) => province.region!.tr!))];
  if (regions.length < 4) {
    throw new Error("Bölge quizini hazırlamak için yeterli veri bulunamadı.");
  }

  return sample(validProvinces, size).map((province, index) => {
    const region = province.region!.tr!;
    if (index % 2 === 0) {
      const otherRegions = sample(regions.filter((item) => item !== region), 3);
      return makeQuestion(
        `${province.name} hangi bölgemizdedir?`,
        [region, ...otherRegions],
        region,
      );
    }

    const otherRegionProvinces = validProvinces.filter(
      (item) => item.region?.tr !== region,
    );
    const sameRegionProvinces = validProvinces.filter(
      (item) => item.region?.tr === region,
    );
    const answerProvince = sample(otherRegionProvinces, 1)[0];
    const wrongProvinces = sample(sameRegionProvinces, 3);
    if (wrongProvinces.length !== 3) {
      throw new Error(`${region} bölgesi için yeterli il verisi bulunamadı.`);
    }

    const options = sample([answerProvince, ...wrongProvinces], 4).map(
      (item) => item.name,
    );
    const correctName = answerProvince.name;
    return makeQuestion(
      `Hangisi ${region} bölgesi ili değildir?`,
      options,
      correctName,
      false,
    );
  });
}

async function createPlateQuestions(size: number): Promise<QuizQuestion[]> {
  if (provinces.length < 4) {
    throw new Error("Plaka quizini hazırlamak için yeterli il verisi bulunamadı.");
  }

  return sample(provinces, size).map((province) => {
    const plate = String(province.id).padStart(2, "0");
    if (Math.random() < 0.5) {
      const distractors = sample(
        provinces.filter((item) => item.id !== province.id),
        3,
      ).map((item) => item.name);
      return makeQuestion(
        `${plate} plakalı il hangisidir?`,
        [province.name, ...distractors],
        province.name,
      );
    }

    const distractors = sample(
      provinces.filter((item) => item.id !== province.id),
      3,
    ).map((item) => String(item.id).padStart(2, "0"));
    return makeQuestion(
      `${province.name} ilinin plaka kodu kaçtır?`,
      [plate, ...distractors],
      plate,
    );
  });
}

async function createDistrictQuestions(size: number): Promise<QuizQuestion[]> {
  const districtNameCounts = new Map<string, number>();
  districts.forEach((district) => {
    districtNameCounts.set(
      district.name,
      (districtNameCounts.get(district.name) ?? 0) + 1,
    );
  });
  const uniqueDistricts = districts.filter(
    (district) => districtNameCounts.get(district.name) === 1,
  );

  const questions: QuizQuestion[] = [];
  for (const province of provinces) {
    const localDistricts = uniqueDistricts.filter(
      (district) => district.provinceId === province.id,
    );
    const otherDistricts = uniqueDistricts.filter(
      (district) => district.provinceId !== province.id,
    );

    if (localDistricts.length > 0 && otherDistricts.length >= 3) {
      const correct = sample(localDistricts, 1)[0];
      const distractors = sample(otherDistricts, 3);
      questions.push(
        makeQuestion(
          `Hangisi ${province.name} ilimizin ilçesidir?`,
          [correct.name, ...distractors.map((district) => district.name)],
          correct.name,
          true,
        ),
      );
    }

    if (localDistricts.length >= 3 && otherDistricts.length > 0) {
      const correct = sample(otherDistricts, 1)[0];
      const distractors = sample(localDistricts, 3);
      questions.push(
        makeQuestion(
          `Hangisi ${province.name} ilimizin ilçesi değildir?`,
          [correct.name, ...distractors.map((district) => district.name)],
          correct.name,
          false,
        ),
      );
    }
  }

  const selected = sample(questions, size);
  if (selected.length < size) {
    throw new Error("İlçe quizini hazırlamak için yeterli veri bulunamadı.");
  }
  return selected;
}

async function createMetropolitanQuestions(size: number): Promise<QuizQuestion[]> {
  const metropolitan = provinces.filter((province) => province.isMetropolitan);
  const otherProvinces = provinces.filter((province) => !province.isMetropolitan);
  if (metropolitan.length < 3 || otherProvinces.length < 3) {
    throw new Error("Büyükşehir quizini hazırlamak için yeterli veri bulunamadı.");
  }

  const questions: QuizQuestion[] = [];
  const positiveCount = Math.ceil(size / 2);
  for (let index = 0; index < size; index += 1) {
    const askForMetropolitan = index < positiveCount;
    const answerPool = askForMetropolitan ? metropolitan : otherProvinces;
    const distractorPool = askForMetropolitan ? otherProvinces : metropolitan;
    const correct = sample(answerPool, 1)[0];
    const distractors = sample(distractorPool, 3);
    questions.push(
      makeQuestion(
        askForMetropolitan
          ? "Aşağıdaki illerden hangisi büyükşehir statüsündedir?"
          : "Aşağıdaki illerden hangisi büyükşehir statüsünde değildir?",
        [correct.name, ...distractors.map((province) => province.name)],
        correct.name,
        askForMetropolitan,
      ),
    );
  }

  return shuffle(questions);
}

export const quizService = {
  fetchCountryData: fetchCountries,
  generateRegionQuestions: (size = 10) => createRegionQuestions(size),
  generatePlateQuestions: (size = 10) => createPlateQuestions(size),
  generateDistrictQuestions: (size = 10) => createDistrictQuestions(size),
  generateMetropolitanQuestions: (size = 10) =>
    createMetropolitanQuestions(size),
  generateMapProvinceQuestions: async (size = 10) => {
    const available = provinces.filter((province) =>
      mapProvinces.some((shape) => shape.id === province.id && shape.paths.length),
    );
    const selected = sample(available, size);
    return selected.map((province) => {
      const wrong = sample(
        available.filter((item) => item.id !== province.id),
        3,
      ).map((item) => item.name);
      return {
        ...makeQuestion(
          "Haritada işaretli il hangisidir?",
          [province.name, ...wrong],
          province.name,
        ),
        map: { mapId: "turkey", highlightedId: String(province.id) },
      };
    });
  },

  generateCountryCapitalQuestions: async (size = 10) => {
    const countries = await fetchCountries();
    const validCountries = [
      ...new Map(
        countries
          .filter((country) => country.capital?.[0])
          .map((country) => [country.capital![0], country]),
      ).values(),
    ];
    const selected = sample(validCountries, size);
    return selected.map((country) => {
      const name = getCountryName(country);
      const capital = country.capital![0];
      const wrong = sample(
        validCountries.filter((item) => getCountryName(item) !== name),
        3,
      ).map((item) => item.capital![0]);
      return makeQuestion(
        `${name} ülkesinin başkenti hangisidir?`,
        [capital, ...wrong],
        capital,
      );
    });
  },

  generateCountryContinentQuestions: async (size = 10) => {
    const countries = await fetchCountries();
    const validCountries = countries.filter(
      (country) => country.continents?.[0],
    );
    const continents = [...new Set(validCountries.map((item) => item.continents![0]))];
    const selected = sample(validCountries, size);
    return selected.map((country) => {
      const continent = country.continents![0];
      const wrong = sample(continents.filter((item) => item !== continent), 3);
      return makeQuestion(
        `${getCountryName(country)} hangi kıtada yer alır?`,
        [continent, ...wrong],
        continent,
      );
    });
  },

  generateCountryFlagQuestions: async (size = 10) => {
    const countries = await fetchCountries();
    const validCountries = countries.filter(
      (country) => country.flags?.png || country.flags?.svg,
    );
    const selected = sample(validCountries, size);
    return selected.map((country) => {
      const name = getCountryName(country);
      const wrong = sample(
        validCountries.filter((item) => getCountryName(item) !== name),
        3,
      ).map(getCountryName);
      return {
        ...makeQuestion("Bu bayrak hangi ülkeye aittir?", [name, ...wrong], name),
        flagUrl: country.flags?.png || country.flags?.svg,
      };
    });
  },
};
