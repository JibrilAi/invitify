export interface MilestoneItem {
  id: string;
  year: string;
  title: string;
  content: string;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface ColorPaletteItem {
  name: string;
  hex: string;
}

export interface EventVenueInfo {
  enabled: boolean;
  time: string;
  place: string;
  place_details: string;
  googleMapsLink: string;
}

export interface LivestreamInfo {
  enabled: boolean;
  time: string;
  link: string;
  detail: string;
}

export interface FeatureFlags {
  rsvp: boolean;
  music: boolean;
  story: boolean;
  events: boolean;
  countdown: boolean;
  dressCode: boolean;
  digitalEnvelope: boolean;
  songRequest: boolean;
  guestbook: boolean;
  coupleProfiles: boolean;
  sacredVerse: boolean;
  livestream: boolean;
  storiesMode: boolean;
}

export interface InvitationConfig {
  coupleNames: string;
  eventDate: string;
  theme: "midnight" | "terracotta" | "botanical" | "champagne";
  groom: {
    name: string;
    nickName: string;
    bio: string;
    instagram: string;
    photo: string;
  };
  bride: {
    name: string;
    nickName: string;
    bio: string;
    instagram: string;
    photo: string;
  };
  sacredVerse: {
    reference: string;
    quote: string;
  };
  story: {
    items: MilestoneItem[];
  };
  venues: {
    holyMatrimony: EventVenueInfo;
    weddingReception: EventVenueInfo;
    livestream: LivestreamInfo;
  };
  dressCode: {
    note: string;
    colors: ColorPaletteItem[];
  };
  digitalEnvelope: {
    note: string;
    accounts: BankAccountItem[];
    qrNotice: string;
  };
  features: FeatureFlags;
  thankYou: {
    headline: string;
    message: string;
  };
}

export const DEFAULT_INVITATION_CONFIG: InvitationConfig = {
  coupleNames: "Mikha & Clara",
  eventDate: "2026-12-21T10:00:00",
  theme: "midnight",
  groom: {
    name: "Mikha Satria Sihotang",
    nickName: "Mikha",
    bio: "Architect and adventurer who found a lifelong love and companion in Clara.",
    instagram: "mikhasatria",
    photo: "/foto_3.jpg",
  },
  bride: {
    name: "Clara Sagala",
    nickName: "Clara",
    bio: "Designer and writer who found her soulmate and forever partner in Mikha.",
    instagram: "clarasagala",
    photo: "/foto_1.jpg",
  },
  sacredVerse: {
    reference: "1 Corinthians 13:4-7",
    quote:
      "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.",
  },
  story: {
    items: [
      {
        id: "story-1",
        year: "2021 — First Met",
        title: "The First Coffee",
        content:
          "A serendipitous meeting over warm morning coffee that sparked endless laughter and deep conversation.",
      },
      {
        id: "story-2",
        year: "2023 — The Journey",
        title: "Growing Together",
        content:
          "Years of sharing adventures, supporting each other's dreams, and discovering that home is wherever we are together.",
      },
      {
        id: "story-3",
        year: "2025 — She Said Yes",
        title: "Forever Begins",
        content:
          "Under a canopy of stars, with hearts overflowing with certainty, we promised to walk hand in hand forever.",
      },
    ],
  },
  venues: {
    holyMatrimony: {
      enabled: true,
      time: "09:00 AM - 11:00 AM",
      place: "Cathedral of St. Mary",
      place_details: "Jl. Katedral No. 7, Jakarta Pusat",
      googleMapsLink: "https://maps.app.goo.gl/vPmfWux29qYYfkJTA",
    },
    weddingReception: {
      enabled: true,
      time: "06:00 PM - 09:00 PM",
      place: "Grand Ballroom Hotel",
      place_details: "Jl. Jend. Sudirman Kav. 1, Jakarta",
      googleMapsLink: "https://maps.app.goo.gl/fQGiC37iEx6fcuNq8",
    },
    livestream: {
      enabled: true,
      time: "09:00 AM WIB",
      link: "https://youtube.com",
      detail:
        "For family and friends joining us from around the world, watch our holy matrimony ceremony live broadcast.",
    },
  },
  dressCode: {
    note: "We invite our lovely guests to wear formal or cocktail attire inspired by our wedding color palette:",
    colors: [
      { name: "Champagne", hex: "#E8D8C8" },
      { name: "Terracotta", hex: "#C87D65" },
      { name: "Emerald Pine", hex: "#2C4A3E" },
      { name: "Midnight Noir", hex: "#1C1C1C" },
    ],
  },
  digitalEnvelope: {
    note: "Your prayers and blessings are our greatest gift. For those wishing to send a token of love, you may transfer directly below:",
    accounts: [
      {
        id: "bca-1",
        bankName: "BANK BCA",
        accountNumber: "8415-0921-33",
        accountHolder: "Mikha Satria Sihotang",
      },
      {
        id: "mandiri-1",
        bankName: "BANK MANDIRI",
        accountNumber: "132-00-98412-1",
        accountHolder: "Clara Sagala",
      },
    ],
    qrNotice: "Scan using any banking app or e-wallet (BCA, Mandiri, GoPay, OVO, Dana, QRIS).",
  },
  features: {
    rsvp: true,
    music: true,
    story: true,
    events: true,
    countdown: true,
    dressCode: true,
    digitalEnvelope: true,
    songRequest: true,
    guestbook: true,
    coupleProfiles: true,
    sacredVerse: true,
    livestream: false,
    storiesMode: true,
  },
  thankYou: {
    headline: "Thank You",
    message:
      "Your love, prayers, and presence make our wedding day truly unforgettable. With all our love.",
  },
};

/**
 * Pure function: toggle a feature on or off
 */
export function toggleFeature(
  config: InvitationConfig,
  feature: keyof FeatureFlags
): InvitationConfig {
  return {
    ...config,
    features: {
      ...config.features,
      [feature]: !config.features[feature],
    },
  };
}

/**
 * Pure function: update top-level or nested config property
 */
export function updateConfig<K extends keyof InvitationConfig>(
  config: InvitationConfig,
  key: K,
  value: InvitationConfig[K]
): InvitationConfig {
  return {
    ...config,
    [key]: value,
  };
}
