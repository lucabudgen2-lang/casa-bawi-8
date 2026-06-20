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
  /* ============================================================
     SITE_URL - single source of truth for the production domain.
     ------------------------------------------------------------
     >>> REPLACE the "REPLACE_WITH_CUSTOM_DOMAIN.com" token with your
         real custom domain (no trailing slash) once it is connected
         in Vercel. The site is static HTML (no build step), so the
         same token also appears in the HTML heads (canonical,
         hreflang, og:url, og:image, twitter:image, JSON-LD url) and
         in sitemap.xml / robots.txt. Do ONE project-wide find-replace
         of "REPLACE_WITH_CUSTOM_DOMAIN.com" to update every reference.
     ============================================================ */
  SITE_URL: "https://REPLACE_WITH_CUSTOM_DOMAIN.com",
  siteUrl: "https://REPLACE_WITH_CUSTOM_DOMAIN.com", // alias, kept for compatibility

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

  /* --- Availability signal (shown next to the booking CTA) ---
     >>> REPLACE the "SEASON" placeholder with the period you are
         currently taking bookings for, e.g. "Winter 2026" or
         "the 2026 season". Rendered as "Now booking SEASON" (EN) /
         "Reservaciones abiertas: SEASON" (ES). Set season to null
         to hide the line entirely. */
  availability: {
    season: "SEASON"
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
