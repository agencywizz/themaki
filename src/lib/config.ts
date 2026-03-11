export const N8N_CONFIG = {
  ENABLED: process.env.NEXT_PUBLIC_N8N_ENABLED === "true",
  // TODO: Set n8n webhook URL for order submissions
  ORDER_WEBHOOK: process.env.NEXT_PUBLIC_N8N_ORDER_WEBHOOK ?? "",
  // TODO: Set n8n webhook URL for reservation submissions
  RESERVE_WEBHOOK: process.env.NEXT_PUBLIC_N8N_RESERVE_WEBHOOK ?? "",
} as const;

export const RESTAURANT_INFO = {
  name: "MAKI Sushi",
  tagline: "Fresh Japanese Cuisine in Roscommon",
  address: "Main Street, Roscommon, Ireland",
  phone: "+353 90 662 1234",
  website: "https://themaki.ie",
  googleMapsQuery: "MAKI+Sushi+Roscommon+Ireland",
  priceRange: "€€",
  rating: 4.8,
  totalReviews: 127,
  hours: {
    monday: "Closed",
    tuesday: "12:00 – 21:00",
    wednesday: "12:00 – 21:00",
    thursday: "12:00 – 21:00",
    friday: "12:00 – 22:00",
    saturday: "12:00 – 22:00",
    sunday: "13:00 – 21:00",
  },
  social: {
    instagram: "https://instagram.com/makisushi_roscommon",
    facebook: "https://facebook.com/makisushiroscommon",
  },
} as const;
