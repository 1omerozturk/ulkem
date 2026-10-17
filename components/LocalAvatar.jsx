import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AVATARS, DEFAULT_AVATAR_ID, getAvatarId } from "../constants/Avatars";

export default function LocalAvatar({ avatarId, profile, size = 68, style }) {
  const selectedId = avatarId || getAvatarId(profile) || DEFAULT_AVATAR_ID;
  const avatar = AVATARS.find((item) => item.id === selectedId) || AVATARS[0];

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.34,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: avatar.background,
        },
        style,
      ]}
    >
      <Ionicons name={avatar.icon} size={size * 0.48} color={avatar.color} />
    </View>
  );
}
