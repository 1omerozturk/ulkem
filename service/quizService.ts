import citiesData from "../model/data.json";

export const quizService = {
  generateRegionQuestions: () => {
    const shuffled = [...citiesData.data].sort(() => 0.5 - Math.random());
    const selectedRegions = new Set(); // Seçilen bölgeleri takip eden küme

    return shuffled
      .filter((city) => {
        if (selectedRegions.has(city.region.tr)) return false; // Aynı bölge tekrar eklenmesin
        selectedRegions.add(city.region.tr);
        return true;
      })
      .slice(0, 10)
      .map((city) => {
        const wrongOptions = citiesData.data
          .filter((c) => c.region.tr !== city.region.tr)
          .sort(() => 0.5 - Math.random())
          .map((c) => c.region.tr);

        const uniqueOptions = new Set([city.region.tr]); // Seçeneklerin benzersiz olmasını sağla

        wrongOptions.forEach((option) => {
          if (uniqueOptions.size < 4) uniqueOptions.add(option);
        });

        const options = [...uniqueOptions].sort(() => 0.5 - Math.random());

        return {
          question: ` İlmiz hangi bölgemizdedir?`,
          city: city.name,
          options,
          correctAnswer: options.indexOf(city.region.tr),
        };
      });
  },

  generatePlateQuestions: () => {
    const shuffled = [...citiesData.data].sort(() => 0.5 - Math.random());
    const selectedCities = new Set(); // Seçilen şehirleri takip eden küme

    return shuffled
      .filter((city) => {
        if (selectedCities.has(city.id)) return false; // Aynı şehir tekrar eklenmesin
        selectedCities.add(city.id);
        return true;
      })
      .slice(0, 10)
      .map((city) => {
        const wrongOptions = citiesData.data
          .filter((c) => c.id !== city.id)
          .sort(() => 0.5 - Math.random())
          .map((c) => c.name);

        const uniqueOptions = new Set([city.name]); // Seçeneklerin benzersiz olmasını sağla

        wrongOptions.forEach((option) => {
          if (uniqueOptions.size < 4) uniqueOptions.add(option); // Aynı seçenek eklenmesin
        });

        const options = [...uniqueOptions].sort(() => 0.5 - Math.random());

        return {
          question: ` Plakalı ilmiz hangisidir?`,
          plate: city.id.toString(),
          options,
          correctAnswer: options.indexOf(city.name),
        };
      });
  },

  generateDistrictQuestions: () => {
    const shuffledCities = [...citiesData.data].sort(() => 0.5 - Math.random());

    // 1. Tüm ilçeleri topla ve kaç kere geçtiğini say
    const districtCountMap = new Map<string, number>();

    citiesData.data.forEach((city) => {
      city.districts.forEach((district) => {
        const name = district.name;
        districtCountMap.set(name, (districtCountMap.get(name) || 0) + 1);
      });
    });

    // 2. Sadece benzersiz (tek ile ait) ilçeleri al
    const uniqueDistricts = citiesData.data.flatMap((city) =>
      city.districts
        .filter((d) => districtCountMap.get(d.name) === 1)
        .map((d) => ({
          name: d.name,
          cityName: city.name,
        }))
    );

    return shuffledCities
      .slice(0, 10)
      .map((city) => {
        let isPositive = Math.random() > 0.5;
        const cityDistricts = city.districts
          .filter((d) => districtCountMap.get(d.name) === 1)
          .map((d) => d.name);

        let options: string[] = [];
        let correctAnswer: number;

        if (isPositive && cityDistricts.length === 0) {
          isPositive = false;
        }

        if (isPositive) {
          // Pozitif soru
          const correct = cityDistricts.sort(() => 0.5 - Math.random())[0];

          const wrongOptions = uniqueDistricts
            .filter((d) => d.cityName !== city.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((d) => d.name);

          options = [...wrongOptions, correct].sort(() => 0.5 - Math.random());
          correctAnswer = options.indexOf(correct);

          return {
            type: isPositive, // true: olumlu, false: olumsuz
            question: isPositive
              ? `ilimizin ilçesidir?`
              : `ilimizin ilçesi değildir?`,
            cityName: city.name,
            options,
            correctAnswer,
          };
        } else {
          // Negatif soru
          const correctOptions = cityDistricts
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          if (correctOptions.length < 3) {
            return null;
          }

          const wrong = uniqueDistricts
            .filter((d) => d.cityName !== city.name)
            .sort(() => 0.5 - Math.random())[0].name;

          options = [...correctOptions, wrong].sort(() => 0.5 - Math.random());
          correctAnswer = options.indexOf(wrong);

          return {
            type: isPositive, // true: olumlu, false: olumsuz
            question: isPositive
              ? `ilimizin ilçesi hangisidir?`
              : `ilimizin ilçesi hangisi değildir?`,
            cityName: city.name,
            options,
            correctAnswer,
          };
        }
      })
      .filter(Boolean); // null olan soruları at
  },
};
