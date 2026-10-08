import React from "react";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

function TabIcon({ color, focused, icon, activeIcon, label }) {
  return (
    <View style={[styles.tabPill, focused && styles.tabPillActive]}>
      <Ionicons
        name={focused ? activeIcon : icon}
        size={22}
        color={color}
      />
      {focused ? <Text style={styles.tabPillLabel}>{label}</Text> : null}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.authTextMuted,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: styles.tabBar,
        sceneStyle: { backgroundColor: COLORS.authBackground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Oyna",
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="game-controller-outline"
              activeIcon="game-controller"
              label="Oyna"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: (props) => (
            <TabIcon
              {...props}
              icon="person-circle-outline"
              activeIcon="person-circle"
              label="Profil"
            />
          ),
        }}
      />
      <Tabs.Screen name="life" options={{ href: null }} />
      <Tabs.Screen name="quiz/[type]" options={{ href: null, tabBarStyle: { display: "none" } }} />
      <Tabs.Screen name="quiz/world" options={{ href: null }} />
      <Tabs.Screen name="quiz/turkey" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = {
  tabBar: {
    height: 60,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.authSurface,
    borderTopWidth: 1,
    borderTopColor: COLORS.authBorder,
    elevation: 15,
    shadowColor: COLORS.authShadow,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -5 },
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabPill: {
    minWidth: 54,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 15,
    borderRadius: 16,
  },
  tabPillActive: {
    minWidth: 112,
    backgroundColor: COLORS.authPrimary,
  },
  tabPillLabel: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
  },
};
