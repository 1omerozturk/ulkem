import citiesData from "../model/data.json";

export const quizService = {
  /*  generateRegionQuestions: () => {
    const allCities = citiesData.data;
    if (!allCities || allCities.length === 0) {
      console.error("Şehir verisi bulunamadı veya boş.");
      return [];
    }

    const allRegionNames = [
      ...new Set(allCities.map((city) => city.region.tr)),
    ];

    // Diziyi karıştıran yardımcı fonksiyon
    const shuffleArray = (array: any) =>
      [...array].sort(() => 0.5 - Math.random());

    // Her biri farklı bir bölgeden olmak üzere soru üretilecek ana şehirleri seçme
    const shuffledInitialCities = shuffleArray(allCities);
    const anchorCities = [];
    const selectedRegions = new Set();

    for (const city of shuffledInitialCities) {
      if (!selectedRegions.has(city.region.tr)) {
        anchorCities.push(city);
        selectedRegions.add(city.region.tr);
      }
    }
    // En fazla 10 farklı bölgeden soru üretelim (isteğe bağlı olarak değiştirilebilir)
    const finalAnchorCities = anchorCities.slice(0, 7);
    const questions = finalAnchorCities.flatMap((anchorCity) => {
      const questionsForThisAnchor = [];
      const correctRegionOfAnchor = anchorCity.region.tr;
      const correctCityNameOfAnchor = anchorCity.name;

      // --- Soru Tipi 1: "[BÖLGE] bölgesi ilidir." (Olumlu - Şıklarda şehirler) ---
      const citiesNotInAnchorRegion = shuffleArray(
        allCities.filter((c) => c.region.tr !== correctRegionOfAnchor)
      );
      if (citiesNotInAnchorRegion.length >= 3) {
        const wrongCityOptions = citiesNotInAnchorRegion
          .slice(0, 3)
          .map((c) => c.name);

        const optionsArray = shuffleArray([
          correctCityNameOfAnchor,
          ...wrongCityOptions,
        ]);
        const correctAnswerValue = correctCityNameOfAnchor;
        questionsForThisAnchor.push({
          id: Math.floor(Math.random() * 100000) + 1,
          question: `Aşağıdakilerden hangisi ${correctRegionOfAnchor} bölgesi ilidir?`,
          options: optionsArray,
          correctAnswer: optionsArray.indexOf(correctAnswerValue), // İndeksi ata
          type: true,
        });
      }

      // --- Soru Tipi 2: "[BÖLGE] bölgesi ili değildir." (Olumsuz - Şıklarda şehirler) ---
      const citiesActuallyInAnchorRegion = allCities.filter(
        (c) => c.region.tr === correctRegionOfAnchor
      );
      const citiesActuallyNotInAnchorRegion = allCities.filter(
        (c) => c.region.tr !== correctRegionOfAnchor
      );

      if (
        citiesActuallyNotInAnchorRegion.length > 0 &&
        citiesActuallyInAnchorRegion.length >= 3
      ) {
        const correctAnswerCityForQ2Value = shuffleArray(
          // Değişken adını netleştirelim
          citiesActuallyNotInAnchorRegion
        )[0].name;
        const wrongOptionsForQ2 = shuffleArray(citiesActuallyInAnchorRegion)
          .filter((c) => c.name !== correctAnswerCityForQ2Value)
          .slice(0, 3)
          .map((c) => c.name);

        if (wrongOptionsForQ2.length === 3) {
          const optionsArray = shuffleArray([
            correctAnswerCityForQ2Value,
            ...wrongOptionsForQ2,
          ]);
          questionsForThisAnchor.push({
            id: Math.floor(Math.random() * 100000) + 1,
            question: `Aşağıdakilerden hangisi ${correctRegionOfAnchor} bölgesi ili DEĞİLDİR?`,
            options: optionsArray,
            correctAnswer: optionsArray.indexOf(correctAnswerCityForQ2Value), // İndeksi ata
            type: false,
          });
        }
      }

      // --- Soru Tipi 3: "[İL] hangi bölgededir?" (Olumlu - Şıklarda bölgeler) ---
      const otherRegions = shuffleArray(
        allRegionNames.filter((r) => r !== correctRegionOfAnchor)
      );
      if (otherRegions.length >= 3) {
        const wrongRegionOptions = otherRegions.slice(0, 3);
        const correctAnswerValue = correctRegionOfAnchor;
        const optionsArray = shuffleArray([
          correctAnswerValue,
          ...wrongRegionOptions,
        ]);

        questionsForThisAnchor.push({
          id: Math.floor(Math.random() * 100000) + 1,
          question: `${correctCityNameOfAnchor} hangi bölgededir?`,
          options: optionsArray,
          correctAnswer: optionsArray.indexOf(correctAnswerValue), // İndeksi ata
          type: true,
        });
      }
      return questionsForThisAnchor;
    });

    return shuffleArray(questions.slice(0, 10)); // Tüm üretilen soruları en sonda karıştır
  }, */

  generateRegionQuestions: () => {
    const allCities = citiesData.data;
    if (!allCities || allCities.length === 0) {
      console.error("Şehir verisi bulunamadı veya boş.");
      return [];
    }

    const allRegionNames = [
      ...new Set(allCities.map((city) => city.region.tr)),
    ];

    // Diziyi karıştıran yardımcı fonksiyon
    const shuffleArray = (array: any) =>
      [...array].sort(() => 0.5 - Math.random());

    const shuffledCities = shuffleArray(allCities);
    const selectedCities = shuffledCities.slice(0, 10);
    const questions = selectedCities.flatMap((city) => {
      const correctRegion = city.region.tr;
      const correctCityName = city.name;

      // --- Soru Tipi 1: "[İL] hangi bölgededir?" ---
      const otherRegions = shuffleArray(
        allRegionNames.filter((r) => r !== correctRegion)
      ).slice(0, 3);
      const regionOptions = shuffleArray([correctRegion, ...otherRegions]);

      const question1 = {
        id: Math.floor(Math.random() * 100000) + 1,
        question: `${correctCityName} hangi bölgededir?`,
        options: regionOptions,
        correctAnswer: regionOptions.indexOf(correctRegion),
        type: "true",
      };

      // --- Soru Tipi 2: "Hangisi [BÖLGE] bölgesi ilidir?" ---
      const wrongCities = shuffleArray(
        allCities.filter((c) => c.region.tr !== correctRegion)
      ).slice(0, 3);
      const cityOptions = shuffleArray([
        correctCityName,
        ...wrongCities.map((c) => c.name),
      ]);

      const question2 = {
        id: Math.floor(Math.random() * 100000) + 1,
        question: `Hangisi ${correctRegion} bölgesi ilidir?`,
        options: cityOptions,
        correctAnswer: cityOptions.indexOf(correctCityName),
        type: "true",
      };

      // --- Soru Tipi 3: "Hangisi [BÖLGE] bölgesi ili değildir?" ---
      const wrongRegionCity = shuffleArray(
        allCities.filter((c) => c.region.tr !== correctRegion)
      )[0].name;
      const correctCities = shuffleArray(
        allCities.filter((c) => c.region.tr === correctRegion)
      ).slice(0, 3);
      const negationOptions = shuffleArray([
        wrongRegionCity,
        ...correctCities.map((c) => c.name),
      ]);

      const question3 = {
        id: Math.floor(Math.random() * 100000) + 1,
        question: `Hangisi ${correctRegion} bölgesi ili **DEĞİLDİR**?`,
        options: negationOptions,
        correctAnswer: negationOptions.indexOf(wrongRegionCity),
        type: "false",
      };

      return [question1, question2, question3];
    });

    return shuffleArray(questions).slice(0, 10);
  },

  generatePlateQuestions: (size?: number) => {
    const shuffled = [...citiesData.data].sort(() => 0.5 - Math.random());
    const selectedCities = new Set();

    return shuffled
      .filter((city) => {
        if (selectedCities.has(city.id)) return false;
        selectedCities.add(city.id);
        return true;
      })
      .slice(0, size ? size : 10)
      .map((city) => {
        // Rastgele soru tipi seç (0: Plakadan şehir, 1: Şehirden plaka)
        const questionType = Math.floor(Math.random() * 2);

        if (questionType === 0) {
          // Tip 1: "XX plakalı il hangisidir?" (Şehir seçenekleri)
          const wrongOptions = citiesData.data
            .filter((c) => c.id !== city.id)
            .sort(() => 0.5 - Math.random())
            .map((c) => c.name);

          const uniqueOptions = new Set([city.name]);
          wrongOptions.forEach((option) => {
            if (uniqueOptions.size < 4) uniqueOptions.add(option);
          });

          const options = [...uniqueOptions].sort(() => 0.5 - Math.random());

          return {
            id: Math.floor(Math.random() * 100000) + 1,
            question: `${
              city.id < 10 ? "0".concat(city.id.toString()) : city.id.toString()
            } plakalı il hangisidir?`,
            options,
            correctAnswer: options.indexOf(city.name),
          };
        } else {
          // Tip 2: "YY ilinin plaka kodu kaçtır?" (Plaka seçenekleri)
          const wrongOptions = citiesData.data
            .filter((c) => c.id !== city.id)
            .sort(() => 0.5 - Math.random())
            .map((c) =>
              c.id < 10 ? "0".concat(c.id.toString()) : c.id.toString()
            );

          const uniqueOptions = new Set([
            city.id < 10 ? "0".concat(city.id.toString()) : city.id.toString(),
          ]);
          wrongOptions.forEach((option) => {
            if (uniqueOptions.size < 4) uniqueOptions.add(option);
          });

          const options = [...uniqueOptions].sort(() => 0.5 - Math.random());

          return {
            id: Math.floor(Math.random() * 100000) + 1,
            question: `${city.name} ilinin plaka kodu kaçtır?`,
            options,
            correctAnswer: options.indexOf(
              city.id < 10 ? "0".concat(city.id.toString()) : city.id.toString()
            ),
          };
        }
      });
  },

  generateDistrictQuestions: () => {
    const shuffledCities = [...citiesData.data].sort(() => 0.5 - Math.random());

    const districtCountMap = new Map<string, number>();
    citiesData.data.forEach((city) => {
      city.districts.forEach((district) => {
        const name = district.name;
        districtCountMap.set(name, (districtCountMap.get(name) || 0) + 1);
      });
    });

    const uniqueDistricts = citiesData.data.flatMap((city) =>
      city.districts
        .filter((d) => districtCountMap.get(d.name) === 1)
        .map((d) => ({
          name: d.name,
          cityName: city.name,
        }))
    );

    return shuffledCities
      .map((city) => {
        const cityDistricts = city.districts
          .filter((d) => districtCountMap.get(d.name) === 1)
          .map((d) => d.name);

        const isPositive = cityDistricts.length > 0 && Math.random() > 0.5;

        let options: string[] = [];
        let correctAnswer: number;

        if (isPositive) {
          // Pozitif soru
          const correct = cityDistricts.sort(() => 0.5 - Math.random())[0];

          const wrongOptions = uniqueDistricts
            .filter((d) => d.cityName !== city.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((d) => d.name);

          if (wrongOptions.length < 3) return null;

          options = [...wrongOptions, correct].sort(() => 0.5 - Math.random());
          correctAnswer = options.indexOf(correct);
        } else {
          // Negatif soru
          const correctOptions = cityDistricts
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          if (correctOptions.length < 3) return null;

          const wrongOption = uniqueDistricts
            .filter((d) => d.cityName !== city.name)
            .sort(() => 0.5 - Math.random())[0]?.name;

          if (!wrongOption) return null;

          options = [...correctOptions, wrongOption].sort(
            () => 0.5 - Math.random()
          );
          correctAnswer = options.indexOf(wrongOption);
        }

        return {
          id: Math.floor(Math.random() * 100000) + 1,
          type: isPositive,
          question: isPositive
            ? `Hangisi ${city.name} ilimizin ilçesidir?`
            : `Hangisi ${city.name} ilimizin ilçesi değildir?`,
          cityName: city.name,
          options,
          correctAnswer,
        };
      })
      .filter(Boolean)
      .slice(0, 10); // sadece 10 geçerli soru döndür
  },
};
