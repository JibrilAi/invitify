export const config = {
  coupleNames: process.env.NEXT_PUBLIC_COUPLE_NAMES || "Mikha & Clara",
  eventDate: process.env.NEXT_PUBLIC_EVENT_DATE || "2026-12-21T10:00:00",
  groom: process.env.NEXT_PUBLIC_GROOM_NAME || "Mikha Satria Sihotang",
  groomNickName: process.env.NEXT_PUBLIC_GROOM_NICKNAME || "Mikha",
  groomInstagram: process.env.NEXT_PUBLIC_GROOM_INSTAGRAM || "mikhasatria",
  groomBio: process.env.NEXT_PUBLIC_GROOM_BIO || "Architect and adventurer who found a lifelong love and companion in Clara.",
  bride: process.env.NEXT_PUBLIC_BRIDE_NAME || "Clara Sagala",
  brideNickName: process.env.NEXT_PUBLIC_BRIDE_NICKNAME || "Clara",
  brideInstagram: process.env.NEXT_PUBLIC_BRIDE_INSTAGRAM || "clarasagala",
  brideBio: process.env.NEXT_PUBLIC_BRIDE_BIO || "Designer and writer who found her soulmate and forever partner in Mikha.",
  bibleVerse: process.env.NEXT_PUBLIC_BIBLE_VERSE || "1 Corinthians 13:4-7",
  bibleVerseContent:
    process.env.NEXT_PUBLIC_BIBLE_VERSE_CONTENT ||
    "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.",
  timeline_1: process.env.NEXT_PUBLIC_YEAR_1 || "2021 — First Met",
  timeline_1_content:
    process.env.NEXT_PUBLIC_YEAR_1_CONTENT ||
    "A serendipitous meeting over warm morning coffee that sparked endless laughter and deep conversation.",
  timeline_2: process.env.NEXT_PUBLIC_YEAR_2 || "2023 — The Journey",
  timeline_2_content:
    process.env.NEXT_PUBLIC_YEAR_2_CONTENT ||
    "Years of sharing adventures, supporting each other's dreams, and discovering that home is wherever we are together.",
  timeline_3: process.env.NEXT_PUBLIC_YEAR_3 || "2025 — She Said Yes",
  timeline_3_content:
    process.env.NEXT_PUBLIC_YEAR_3_CONTENT ||
    "Under a canopy of stars, with hearts overflowing with certainty, we promised to walk hand in hand forever.",
  holyMatrimony: {
    enabled: process.env.NEXT_PUBLIC_HOLY_MATRIMONY !== "false",
    time: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_TIME || "09:00 AM - 11:00 AM",
    place: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_PLACE || "Cathedral of St. Mary",
    place_details: process.env.NEXT_PUBLIC_HOLY_MATRIMONY_PLACE_DETAILS || "Jl. Katedral No. 7, Jakarta Pusat",
    googleMapsLink:
      process.env.NEXT_PUBLIC_HOLY_MATRIMONY_GOOGLE_MAPS ||
      "https://maps.app.goo.gl/vPmfWux29qYYfkJTA",
  },
  weddingReception: {
    enabled: process.env.NEXT_PUBLIC_WEDDING_RECEPTION !== "false",
    time: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_TIME || "06:00 PM - 09:00 PM",
    place: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_PLACE || "Grand Ballroom Hotel",
    place_details: process.env.NEXT_PUBLIC_WEDDING_RECEPTION_PLACE_DETAILS || "Jl. Jend. Sudirman Kav. 1, Jakarta",
    googleMapsLink:
      process.env.NEXT_PUBLIC_WEDDING_RECEPTION_GOOGLE_MAPS ||
      "https://maps.app.goo.gl/fQGiC37iEx6fcuNq8",
  },
  livestreaming: {
    enabled: process.env.NEXT_PUBLIC_LIVE_STREAMING === "true",
    time: process.env.NEXT_PUBLIC_LIVE_STREAMING_TIME || "09:00 AM",
    link: process.env.NEXT_PUBLIC_LIVE_STREAMING_LINK || "https://youtube.com",
    detail:
      process.env.NEXT_PUBLIC_LIVE_STREAMING_DETAIL ||
      "For family and friends joining us from around the world, watch our ceremony live.",
  },
  prewedding: {
    enabled: process.env.NEXT_PUBLIC_PREWEDDING === "true",
    link: process.env.NEXT_PUBLIC_PREWEDDING_CODE_LINK_EMBED || "dQw4w9WgXcQ",
    detail: process.env.NEXT_PUBLIC_PREWEDDING_DETAIL || "Capturing moments of our love story.",
  },
  rsvp: {
    enabled: process.env.NEXT_PUBLIC_RSVP !== "false",
    detail:
      process.env.NEXT_PUBLIC_RSVP_DETAIL ||
      "We would be honored by your presence. Please kindly confirm your attendance below.",
  },
  thankyou: process.env.NEXT_PUBLIC_THANKYOU || "Thank You",
  thankyouDetail:
    process.env.NEXT_PUBLIC_THANKYOU_DETAIL ||
    "Your love, prayers, and presence make our wedding day truly unforgettable. With all our love.",
};
