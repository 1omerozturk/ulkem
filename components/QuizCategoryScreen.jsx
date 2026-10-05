import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import styles from "../assets/styles/quiz-category.styles";

const iconColors = {
  "country-capital": ["#466E9E", "#E6EFF9"],
  "country-continent": ["#348A81", "#E3F3EF"],
  "country-flag": ["#C45B56", "#FAEAE7"],
  plate: ["#B77825", "#FFF1D9"],
  region: ["#548C66", "#E8F3E8"],
  district: ["#5276A3", "#E9EFF8"],
  metropolitan: ["#A85E7D", "#F8EAF0"],
  "map-province": ["#398895", "#E3F2F3"],
};

export default function QuizCategoryScreen({
  title,
  eyebrow,
  subtitle,
  items,
  accent,
  tint,
  note,
  continentOptions,
}) {
  const router = useRouter();
  const [selectedContinent, setSelectedContinent] = useState("all");

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.backButton}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/(tabs)")
            }
            accessibilityRole="button"
            accessibilityLabel="Geri dön"
          >
            <Ionicons name="arrow-back" size={21} color="#203730" />
          </TouchableOpacity>
          <View style={[styles.countPill, { backgroundColor: tint }]}>
            <Ionicons name="game-controller" size={15} color={accent} />
            <Text style={[styles.countText, { color: accent }]}>
              {items.length} OYUN
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[accent, `${accent}D9`]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons
              name={title.toLowerCase().includes("dünya") ? "globe" : "compass"}
              size={42}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.heroOrb} />
        </LinearGradient>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Bir meydan okuma seç</Text>
            <Text style={styles.sectionSubtitle}>
              Hazır olduğunda dokun ve başla
            </Text>
          </View>
          <Ionicons name="sparkles" size={21} color={accent} />
        </View>

        {continentOptions?.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.continentFilters}
            style={styles.continentScroll}
            accessibilityLabel="Kıta seç"
          >
            {continentOptions.map((continent) => {
              const selected = selectedContinent === continent.code;
              return (
                <TouchableOpacity
                  key={continent.code}
                  onPress={() => setSelectedContinent(continent.code)}
                  style={[
                    styles.continentChip,
                    selected && {
                      backgroundColor: accent,
                      borderColor: accent,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.continentChipText,
                      selected && styles.continentChipTextSelected,
                    ]}
                  >
                    {continent.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        <View style={styles.grid}>
          {items.map((item, index) => {
            const type = item.url.replace(/^quiz\//, "");
            const [iconColor, iconTint] = iconColors[type] || [accent, tint];
            return (
              <Animated.View
                key={type}
                entering={FadeInUp.delay(index * 65).duration(320)}
                style={styles.cardSlot}
              >
                <TouchableOpacity
                  style={[styles.card, { borderTopColor: iconColor }]}
                  onPress={() =>
                    router.push({
                      pathname: "/quiz/[type]",
                      params: {
                        type,
                        ...(continentOptions?.length
                          ? { continent: selectedContinent }
                          : {}),
                      },
                    })
                  }
                  activeOpacity={0.84}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}. ${item.description}`}
                >
                  <View style={styles.cardTop}>
                    <View
                      style={[styles.iconWrap, { backgroundColor: iconTint }]}
                    >
                      <Ionicons name={item.icon} size={29} color={iconColor} />
                    </View>
                    <View
                      style={[styles.cardAction, { backgroundColor: iconTint }]}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={17}
                        color={iconColor}
                      />
                    </View>
                  </View>
                  <View style={styles.cardCopy}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={[styles.playText, { color: iconColor }]}>
                      OYNA
                    </Text>
                    <Ionicons name="play" size={12} color={iconColor} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {!!note && (
          <View style={[styles.note, { backgroundColor: tint }]}>
            <Ionicons name="bulb-outline" size={20} color={accent} />
            <Text style={[styles.noteText, { color: accent }]}>{note}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
