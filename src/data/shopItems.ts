export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: 'boost' | 'unlock' | 'banner';
  durationMinutes?: number; // for boosts
}

export const shopItems: ShopItem[] = [
  {
    id: 'double-xp-10',
    name: 'Dubbel XP (10 min)',
    description: 'Få dubbel XP i 10 minuter!',
    price: 50,
    icon: '⚡',
    type: 'boost',
    durationMinutes: 10,
  },
  {
    id: 'double-xp-60',
    name: 'Dubbel XP (1 timme)',
    description: 'Få dubbel XP i en hel timme!',
    price: 200,
    icon: '🔥',
    type: 'boost',
    durationMinutes: 60,
  },
  {
    id: 'hard-mode',
    name: 'Hard Mode 🔓',
    description: '10 skrivfrågor som AI rättar. Ger dubbel XP som stackar med boost!',
    price: 1000,
    icon: '💀',
    type: 'unlock',
  },
];

export type BannerEffect = 'none' | 'shimmer' | 'flame' | 'pulse' | 'glitter' | 'rainbow';

export interface BannerItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  gradient: string; // tailwind gradient classes
  effect: BannerEffect;
  premium?: boolean;
}

export const bannerItems: BannerItem[] = [
  // Standard banners (under 500)
  { id: 'banner-fire', name: 'Eld', emoji: '🔥', price: 150, gradient: 'from-orange-500 to-red-500', effect: 'none' },
  { id: 'banner-ice', name: 'Is', emoji: '❄️', price: 150, gradient: 'from-cyan-400 to-blue-500', effect: 'none' },
  { id: 'banner-nature', name: 'Natur', emoji: '🌿', price: 150, gradient: 'from-green-400 to-emerald-600', effect: 'none' },
  { id: 'banner-sunset', name: 'Solnedgång', emoji: '🌅', price: 200, gradient: 'from-orange-400 to-pink-500', effect: 'none' },
  { id: 'banner-galaxy', name: 'Galax', emoji: '🌌', price: 300, gradient: 'from-purple-500 to-indigo-600', effect: 'none' },
  { id: 'banner-toxic', name: 'Toxic', emoji: '☠️', price: 300, gradient: 'from-lime-400 to-green-600', effect: 'none' },

  // Premium animated banners (500+)
  { id: 'banner-gold', name: 'Guld ✨', emoji: '👑', price: 500, gradient: 'from-yellow-400 via-amber-300 to-yellow-500', effect: 'shimmer', premium: true },
  { id: 'banner-inferno', name: 'Inferno 🔥', emoji: '🌋', price: 750, gradient: 'from-red-600 via-orange-500 to-yellow-400', effect: 'flame', premium: true },
  { id: 'banner-rainbow', name: 'Regnbåge 🌈', emoji: '🌈', price: 800, gradient: 'from-pink-500 via-yellow-400 to-cyan-400', effect: 'rainbow', premium: true },
  { id: 'banner-diamond', name: 'Diamant 💎', emoji: '💎', price: 1000, gradient: 'from-cyan-300 via-blue-200 to-purple-300', effect: 'pulse', premium: true },
  { id: 'banner-cosmic', name: 'Kosmisk Glitter ✨', emoji: '🪐', price: 1500, gradient: 'from-fuchsia-600 via-violet-500 to-indigo-600', effect: 'glitter', premium: true },
];
