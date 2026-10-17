export const AVATAR_PROFILE_PREFIX = "local-avatar:";
export const DEFAULT_AVATAR_ID = "compass";

// These icon-based avatars are bundled with the app, so they work offline and
// do not add image downloads to the app package.
export const AVATARS = [
  { id: "compass", name: "Pusula", icon: "compass", color: "#176B5B", background: "#DCEDE6" },
  { id: "globe", name: "Dünya", icon: "earth", color: "#3976A8", background: "#E2EFF8" },
  { id: "mountain", name: "Dağcı", icon: "trail-sign", color: "#8B6547", background: "#F4E9DC" },
  { id: "star", name: "Yıldız", icon: "star", color: "#B47A12", background: "#FBF1D9" },
  { id: "rocket", name: "Kaşif", icon: "rocket", color: "#8557A4", background: "#F0E7F7" },
  { id: "leaf", name: "Doğa", icon: "leaf", color: "#438153", background: "#E6F2E5" },
  { id: "sun", name: "Güneş", icon: "sunny", color: "#CA7047", background: "#FCEADF" },
  { id: "boat", name: "Denizci", icon: "boat", color: "#337B91", background: "#E0F1F4" },
  { id: "planet", name: "Uzay", icon: "planet", color: "#6D63A8", background: "#ECEAF8" },
  { id: "map", name: "Haritacı", icon: "map", color: "#A04F59", background: "#F8E8E9" },
  { id: "telescope", name: "Gözlemci", icon: "telescope", color: "#4A6E91", background: "#E6EDF5" },
  { id: "sparkles", name: "Parıltı", icon: "sparkles", color: "#B25E87", background: "#F8E8F0" },
  { id: "paw", name: "Dost", icon: "paw", color: "#987049", background: "#F5EBDD" },
  { id: "airplane", name: "Gezgin", icon: "airplane", color: "#427E9A", background: "#E4F1F6" },
  { id: "flower", name: "Çiçek", icon: "flower", color: "#B35375", background: "#F9E8EF" },
  { id: "forest", name: "Orman", icon: "leaf", color: "#39774C", background: "#E4F1E5" },
  { id: "moon", name: "Ay Işığı", icon: "moon", color: "#6C6B9E", background: "#ECEAF7" },
  { id: "cloud", name: "Bulut", icon: "cloud", color: "#5B7893", background: "#E9F0F6" },
  { id: "bonfire", name: "Kampçı", icon: "bonfire", color: "#C86B3F", background: "#FCEADF" },
  { id: "shield", name: "Muhafız", icon: "shield-checkmark", color: "#477C70", background: "#E4F1ED" },
  { id: "medal", name: "Şampiyon", icon: "medal", color: "#AA7A19", background: "#FBF1D9" },
  { id: "diamond", name: "Kristal", icon: "diamond", color: "#5D79B5", background: "#E9EDFA" },
  { id: "cube", name: "Küp", icon: "cube", color: "#80649C", background: "#F0EAF6" },
  { id: "color-palette", name: "Ressam", icon: "color-palette", color: "#B35C63", background: "#F8E8E9" },
  { id: "camera", name: "Fotoğrafçı", icon: "camera", color: "#54728C", background: "#E7EEF4" },
  { id: "book", name: "Bilgin", icon: "book", color: "#825F45", background: "#F3EADD" },
  { id: "flask", name: "Bilimci", icon: "flask", color: "#5876A8", background: "#E7ECF7" },
  { id: "basketball", name: "Sporcu", icon: "basketball", color: "#C66A3F", background: "#FBE9DF" },
  { id: "musical-notes", name: "Müzisyen", icon: "musical-notes", color: "#A25281", background: "#F7E8F1" },
  { id: "bug", name: "Minik Kaşif", icon: "bug", color: "#55805E", background: "#E9F2E8" },
  { id: "fish", name: "Balıkçı", icon: "fish", color: "#367E94", background: "#E1F1F4" },
  { id: "rose", name: "Gül", icon: "rose", color: "#B64F68", background: "#F9E8ED" },
  { id: "snow", name: "Kar Tanesi", icon: "snow", color: "#4F83AA", background: "#E5F1F8" },
  { id: "flash", name: "Şimşek", icon: "flash", color: "#B37C17", background: "#FBF1D9" },
  { id: "infinite", name: "Sonsuz", icon: "infinite", color: "#735CA5", background: "#EEEAF7" },
  { id: "key", name: "Anahtar", icon: "key", color: "#9A7442", background: "#F3EDDF" },
];

export const AVATAR_UNLOCK_TIERS = [
  { points: 0, count: 1, cost: 0 },
  { points: 1_000, count: 8, cost: 500 },
  { points: 5_000, count: 10, cost: 750 },
  { points: 10_000, count: 12, cost: 1_000 },
  { points: 20_000, count: 15, cost: 1_250 },
  { points: 35_000, count: 18, cost: 1_500 },
  { points: 50_000, count: 20, cost: 1_750 },
  { points: 75_000, count: 24, cost: 2_000 },
  { points: 100_000, count: 28, cost: 2_500 },
  { points: 150_000, count: 32, cost: 3_000 },
  { points: 200_000, count: AVATARS.length, cost: 4_000 },
];

export const getUnlockedAvatarCount = (lifetimeScore = 0) => {
  const points = Math.max(0, Number(lifetimeScore) || 0);
  return AVATAR_UNLOCK_TIERS.reduce(
    (count, tier) => (points >= tier.points ? tier.count : count),
    AVATAR_UNLOCK_TIERS[0].count,
  );
};

export const getAvatarUnlockPoints = (avatarIndex) =>
  AVATAR_UNLOCK_TIERS.find((tier) => tier.count > avatarIndex)?.points ?? null;

export const getAvatarPurchaseCost = (avatarIndex) =>
  AVATAR_UNLOCK_TIERS.find((tier) => tier.count > avatarIndex)?.cost ?? null;

export const getNextAvatarUnlock = (lifetimeScore = 0, minimumCount = 0) => {
  const points = Math.max(0, Number(lifetimeScore) || 0);
  const currentCount = Math.max(getUnlockedAvatarCount(points), minimumCount);
  const nextTier = AVATAR_UNLOCK_TIERS.find((tier) => tier.count > currentCount);
  return nextTier ? { ...nextTier, remaining: Math.max(0, nextTier.points - points) } : null;
};

export const getOwnedAvatarIds = (savedAvatars, currentProfile) => {
  let savedIds = [];
  try {
    const parsed = Array.isArray(savedAvatars) ? savedAvatars : JSON.parse(savedAvatars || "[]");
    if (Array.isArray(parsed)) savedIds = parsed;
  } catch {
    savedIds = [];
  }

  const validIds = savedIds.filter((id) => AVATARS.some((avatar) => avatar.id === id));
  const currentId = getAvatarId(currentProfile);
  return [...new Set([DEFAULT_AVATAR_ID, ...validIds, currentId])];
};

export const getAvatarProfile = (avatarId) => `${AVATAR_PROFILE_PREFIX}${avatarId}`;

export const getAvatarId = (profile) => {
  if (typeof profile !== "string" || !profile.startsWith(AVATAR_PROFILE_PREFIX)) {
    return DEFAULT_AVATAR_ID;
  }

  const avatarId = profile.slice(AVATAR_PROFILE_PREFIX.length);
  return AVATARS.some((avatar) => avatar.id === avatarId) ? avatarId : DEFAULT_AVATAR_ID;
};

export const isLocalAvatarProfile = (profile) =>
  typeof profile === "string" &&
  profile.startsWith(AVATAR_PROFILE_PREFIX) &&
  AVATARS.some((avatar) => avatar.id === profile.slice(AVATAR_PROFILE_PREFIX.length));
