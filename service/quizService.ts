import { GAME_RULES } from "../constants/GameConfig";
import { getContinentName } from "../model/world/continents";

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
const worldCountries = require("../model/world/countries.json") as WorldCountry[];

type WorldCountry = {
  code: string;
  name: string;
  nameTr: string | string[];
  capital: string;
  continent: string;
  continentName: string;
};

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: boolean;
  visual?: { type: "flag"; key: string };
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

const getCountryName = (country: WorldCountry) =>
  Array.isArray(country.nameTr)
    ? country.nameTr.find((name) => name.length > 6) || country.nameTr[0]
    : country.nameTr || country.name;
const getCountries = (continentCode = "all") =>
  worldCountries.filter(
    (country) => continentCode === "all" || country.continent === continentCode,
  );

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
  generateRegionQuestions: (size = GAME_RULES.questionsPerQuiz) => createRegionQuestions(size),
  generatePlateQuestions: (size = GAME_RULES.questionsPerQuiz) => createPlateQuestions(size),
  generateDistrictQuestions: (size = GAME_RULES.questionsPerQuiz) => createDistrictQuestions(size),
  generateMetropolitanQuestions: (size = GAME_RULES.questionsPerQuiz) =>
    createMetropolitanQuestions(size),
  generateMapProvinceQuestions: async (size = GAME_RULES.questionsPerQuiz) => {
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

  generateCountryCapitalQuestions: (size = GAME_RULES.questionsPerQuiz, continentCode = "all") => {
    const validCountries = getCountries(continentCode);
    const uniqueCountries = [
      ...new Map(
        validCountries.map((country) => [country.capital, country]),
      ).values(),
    ];
    if (uniqueCountries.length < size || uniqueCountries.length < 4) {
      throw new Error("Bu kıtada başkent quizini hazırlamak için yeterli ülke yok.");
    }
    const selected = sample(uniqueCountries, size);
    return selected.map((country) => {
      const name = getCountryName(country);
      const capital = country.capital;
      const wrong = sample(
        uniqueCountries.filter((item) => getCountryName(item) !== name),
        3,
      ).map((item) => item.capital);
      return makeQuestion(
        `${name} ülkesinin başkenti hangisidir?`,
        [capital, ...wrong],
        capital,
      );
    });
  },

  generateCountryContinentQuestions: (size = GAME_RULES.questionsPerQuiz, continentCode = "all") => {
    const validCountries = getCountries();
    if (continentCode !== "all") {
      const correctPool = getCountries(continentCode);
      const distractorPool = validCountries.filter((country) => country.continent !== continentCode);
      const continentName = getContinentName(continentCode);
      if (correctPool.length < size || distractorPool.length < 3 || !continentName) {
        throw new Error("Bu kıta quizini hazırlamak için yeterli ülke verisi yok.");
      }
      return sample(correctPool, size).map((country) => {
        const answer = getCountryName(country);
        const wrong = sample(distractorPool, 3).map(getCountryName);
        return makeQuestion(
          `Aşağıdaki ülkelerden hangisi ${continentName} kıtasındadır?`,
          [answer, ...wrong],
          answer,
        );
      });
    }

    const continents = [...new Set(validCountries.map((item) => item.continent))];
    const selected = sample(validCountries, size);
    return selected.map((country) => {
      const continent = country.continent;
      const wrong = sample(continents.filter((item) => item !== continent), 3).map(getContinentName);
      const answer = getContinentName(continent);
      return makeQuestion(
        `${getCountryName(country)} hangi kıtada yer alır?`,
        [answer, ...wrong],
        answer,
      );
    });
  },

  generateCountryFlagQuestions: (size = GAME_RULES.questionsPerQuiz, continentCode = "all") => {
    const validCountries = getCountries(continentCode);
    if (validCountries.length < size || validCountries.length < 4) {
      throw new Error("Bu kıtada bayrak quizini hazırlamak için yeterli ülke yok.");
    }
    const selected = sample(validCountries, size);
    return selected.map((country) => {
      const name = getCountryName(country);
      const wrong = sample(
        validCountries.filter((item) => getCountryName(item) !== name),
        3,
      ).map(getCountryName);
      return {
        ...makeQuestion("Bu bayrak hangi ülkeye aittir?", [name, ...wrong], name),
        visual: { type: "flag", key: country.code },
      };
    });
  },
};
