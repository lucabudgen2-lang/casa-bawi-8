/* ============================================================
   Casa Ba'wi Apartemento 8 — Central Property Config
   ------------------------------------------------------------
   SINGLE SOURCE OF TRUTH for booking + property facts.
   Edit values here; main.js reads WhatsApp + booking data at
   runtime. SEO copy / guest counts are also written directly
   into the HTML (for crawlability) — keep both in sync if you
   change bedrooms/bathrooms/guest count.

   TODO (provide later to unlock full VacationRental SEO schema):
     - latitude / longitude   (from the Google Maps pin)
     - fullAddress            (street + number, if you want it public)
     - mapEmbedUrl            (Google Maps embed iframe src)
     - checkInTime / checkOutTime   (only if you want them public)
     - priceRange / rates           (only if you want them public)
   When latitude & longitude are added, the VacationRental JSON-LD
   block in index.html / es/index.html can be un-commented.
   ============================================================ */
window.CASA_CONFIG = {
  /* --- Production site URL (used for canonical / hreflang / OG / sitemap) ---
     TODO: replace with the real custom domain once connected in Vercel. */
  siteUrl: "https://casa-bawi.vercel.app",

  /* --- Brand --- */
  propertyName: "Casa Ba'wi Apartemento 8",
  identifier: "casa-bawi-apartemento-8",

  /* --- Location --- */
  city: "Puerto Escondido",
  region: "Oaxaca",
  country: "MX",
  area: "Tamarindos",
  nearestBeach: "Tamarindo Beach",

  /* --- Capacity (easy to change) --- */
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 2,
  beds: ["1 King", "2 Single"],

  /* --- Booking via WhatsApp --- */
  whatsapp: {
    phone: "529581075503", // +52 958 107 5503
    messages: {
      en: "Hi, I'm interested in Casa Ba'wi Apartemento 8. Could you please confirm availability and rates for my dates?",
      es: "Hola, me interesa Casa Ba'wi Apartemento 8. ¿Me podrían confirmar disponibilidad y tarifas para mis fechas?"
    }
  },

  /* --- Amenities (canonical list) --- */
  amenities: [
    "ac", "balcony", "beachAccess", "childFriendly", "internet", "kitchen",
    "microwave", "parking", "petsAllowed", "tv", "washer", "coffeeMaker",
    "ceilingFan", "oceanView"
  ],

  /* --- Lead-capture popup --- */
  popup: {
    autoOpen: true,      // auto-show once per browser session
    delaySeconds: 6      // delay before the auto-open
  },

  /* --- Deferred fields (leave null until provided) --- */
  latitude: 15.841838,
  longitude: -97.048472,
  fullAddress: null,
  mapEmbedUrl: "https://www.google.com/maps?q=15.841838,-97.048472&z=16&output=embed",
  checkInTime: null,
  checkOutTime: null,
  priceRange: null
};
