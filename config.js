/**
 * Anonymizer Configuration
 * 
 * Edit this file to customize detection patterns and corporate terms.
 * All matching is case-insensitive unless noted otherwise.
 */

// ─── Corporate Dictionary ───────────────────────────────────────────────────
// Add your company-specific sensitive terms here.
// Keys are matched case-insensitively with word-boundary awareness.

const CORPORATE_TERMS = [
  // Client / Partner names
  { term: "Acme Corp", category: "CLIENT_NAME" },
  { term: "Acme Corporation", category: "CLIENT_NAME" },
  { term: "Globex", category: "CLIENT_NAME" },
  { term: "Initech", category: "CLIENT_NAME" },
  { term: "Umbrella Corp", category: "CLIENT_NAME" },
  { term: "Wayne Enterprises", category: "CLIENT_NAME" },

  // Project codenames
  { term: "Project Falcon", category: "PROJECT_CODENAME" },
  { term: "Project Phoenix", category: "PROJECT_CODENAME" },
  { term: "Project Titan", category: "PROJECT_CODENAME" },
  { term: "Operation Nightfall", category: "PROJECT_CODENAME" },

  // Internal tool / platform names
  { term: "Heimdall", category: "INTERNAL_TOOL" },
  { term: "Valhalla", category: "INTERNAL_TOOL" },
  { term: "Mjolnir", category: "INTERNAL_TOOL" },

  // Pricing tiers / product names
  { term: "Enterprise Tier", category: "PRICING_TIER" },
  { term: "Professional Tier", category: "PRICING_TIER" },
  { term: "Starter Tier", category: "PRICING_TIER" },

  // Internal division / team names  
  { term: "Skunkworks", category: "INTERNAL_TEAM" },
  { term: "Tiger Team", category: "INTERNAL_TEAM" },
];


// ─── Regex Patterns ─────────────────────────────────────────────────────────
// Each pattern has: regex, category label, and a description for the entity map.
// Patterns are applied in order — put more specific patterns first.

const REGEX_PATTERNS = [
  // ── Email addresses ──
  {
    regex: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
    category: "EMAIL",
    description: "Email address",
  },

  // ── IBAN (international, 15-34 chars) ──
  {
    regex: /\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}[\s]?(?:[\dA-Z]{4}[\s]?){1,7}[\dA-Z]{1,4}\b/g,
    category: "FINANCIAL",
    description: "IBAN",
  },

  // ── Credit card numbers (13-19 digits, with optional spaces/dashes) ──
  {
    regex: /\b(?:\d[\s\-]?){13,19}\b/g,
    category: "FINANCIAL",
    description: "Credit card number",
    // Extra validation: must start with 3,4,5,6 (Amex, Visa, MC, Discover)
    validate: (match) => /^[3-6]/.test(match.replace(/[\s\-]/g, "")),
  },

  // ── Phone numbers (international formats) ──
  {
    regex: /(?:\+\d{1,3}[\s\-]?)?(?:\(?\d{2,5}\)?[\s\-]?)?\d{3,4}[\s\-]?\d{3,4}(?:[\s\-]?\d{1,4})?\b/g,
    category: "PHONE",
    description: "Phone number",
    // Must have at least 7 digits total to avoid matching short numbers
    validate: (match) => {
      const digits = match.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
  },

  // ── German Personalausweis (10 alphanumeric) ──
  {
    regex: /\b[CFGHJKLMNPRTVWXYZ0-9]{10}\b/g,
    category: "ID_NUMBER",
    description: "German ID number",
    // Only match if surrounded by ID-related context
    contextRequired: true,
    contextPatterns: [/personalausweis/i, /ausweis/i, /identity\s*(?:card|document)/i, /ID[\s\-]?(?:number|nr|no)/i],
  },

  // ── German Tax ID / Steuer-ID (11 digits) ──
  {
    regex: /\b\d{2}[\s\/]?\d{3}[\s\/]?\d{3}[\s\/]?\d{3}\b/g,
    category: "ID_NUMBER",
    description: "Tax ID / Steuer-ID",
    contextRequired: true,
    contextPatterns: [/steuer/i, /tax[\s\-]?id/i, /tin\b/i, /identifikationsnummer/i],
  },

  // ── Social Security Number (US) ──
  {
    regex: /\b\d{3}[\-\s]?\d{2}[\-\s]?\d{4}\b/g,
    category: "ID_NUMBER",
    description: "SSN",
    contextRequired: true,
    contextPatterns: [/social\s*security/i, /\bSSN\b/i, /sozialversicherung/i],
  },

  // ── IPv4 addresses ──
  {
    regex: /\b(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}\b/g,
    category: "IP_ADDRESS",
    description: "IPv4 address",
  },

  // ── IPv6 addresses (simplified) ──
  {
    regex: /\b(?:[0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{1,4}\b/g,
    category: "IP_ADDRESS",
    description: "IPv6 address",
  },

  // ── Dates (multiple formats) ──
  {
    regex: /\b(?:0?[1-9]|[12]\d|3[01])[.\-\/](?:0?[1-9]|1[0-2])[.\-\/](?:19|20)\d{2}\b/g,
    category: "DATE",
    description: "Date (DD.MM.YYYY)",
  },
  {
    regex: /\b(?:19|20)\d{2}[.\-\/](?:0?[1-9]|1[0-2])[.\-\/](?:0?[1-9]|[12]\d|3[01])\b/g,
    category: "DATE",
    description: "Date (YYYY-MM-DD)",
  },

  // ── Street addresses (German-style) ──
  {
    regex: /\b[A-ZÄÖÜ][a-zäöüß]+(?:straße|strasse|str\.|weg|gasse|allee|platz|ring|damm|ufer)\s*\d+[a-zA-Z]?\b/gi,
    category: "ADDRESS",
    description: "Street address",
  },

  // ── Postal codes (German 5-digit) ──
  {
    regex: /\b\d{5}\s+[A-ZÄÖÜ][a-zäöüß]+(?:\s+[a-zäöüß]+)?\b/g,
    category: "ADDRESS",
    description: "Postal code + city",
  },

  // ── URLs (http/https) ──
  {
    regex: /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g,
    category: "URL",
    description: "URL",
  },
];


// ─── Category Display Settings ──────────────────────────────────────────────

const CATEGORY_CONFIG = {
  // NLP-detected entities
  PERSON:           { color: "#60a5fa", bgColor: "rgba(96, 165, 250, 0.15)",  icon: "👤", label: "People" },
  ORGANIZATION:     { color: "#a78bfa", bgColor: "rgba(167, 139, 250, 0.15)", icon: "🏢", label: "Organizations" },
  LOCATION:         { color: "#34d399", bgColor: "rgba(52, 211, 153, 0.15)",  icon: "📍", label: "Locations" },

  // Regex-detected entities
  EMAIL:            { color: "#fb923c", bgColor: "rgba(251, 146, 60, 0.15)",  icon: "✉️",  label: "Emails" },
  PHONE:            { color: "#f472b6", bgColor: "rgba(244, 114, 182, 0.15)", icon: "📞", label: "Phones" },
  FINANCIAL:        { color: "#fbbf24", bgColor: "rgba(251, 191, 36, 0.15)",  icon: "💳", label: "Financial" },
  ID_NUMBER:        { color: "#f87171", bgColor: "rgba(248, 113, 113, 0.15)", icon: "🪪", label: "ID Numbers" },
  IP_ADDRESS:       { color: "#38bdf8", bgColor: "rgba(56, 189, 248, 0.15)",  icon: "🌐", label: "IP Addresses" },
  DATE:             { color: "#c084fc", bgColor: "rgba(192, 132, 252, 0.15)", icon: "📅", label: "Dates" },
  ADDRESS:          { color: "#4ade80", bgColor: "rgba(74, 222, 128, 0.15)",  icon: "🏠", label: "Addresses" },
  URL:              { color: "#22d3ee", bgColor: "rgba(34, 211, 238, 0.15)",  icon: "🔗", label: "URLs" },

  // Corporate dictionary entities
  CLIENT_NAME:      { color: "#e879f9", bgColor: "rgba(232, 121, 249, 0.15)", icon: "🤝", label: "Client Names" },
  PROJECT_CODENAME: { color: "#fb7185", bgColor: "rgba(251, 113, 133, 0.15)", icon: "🚀", label: "Project Codenames" },
  INTERNAL_TOOL:    { color: "#a3e635", bgColor: "rgba(163, 230, 53, 0.15)",  icon: "🔧", label: "Internal Tools" },
  PRICING_TIER:     { color: "#fcd34d", bgColor: "rgba(252, 211, 77, 0.15)",  icon: "💰", label: "Pricing Tiers" },
  INTERNAL_TEAM:    { color: "#67e8f9", bgColor: "rgba(103, 232, 249, 0.15)", icon: "👥", label: "Internal Teams" },

  // Aggressive mode catch-all
  UNKNOWN_ENTITY:   { color: "#94a3b8", bgColor: "rgba(148, 163, 184, 0.15)", icon: "❓", label: "Unknown Entities" },
};


// ─── Aggressive Mode Settings ───────────────────────────────────────────────

const AGGRESSIVE_MODE = {
  // In aggressive mode, also flag monetary amounts
  catchMonetaryAmounts: true,
  monetaryRegex: /(?:€|EUR|\$|USD|£|GBP)\s?\d[\d.,]*\d|\d[\d.,]*\d\s?(?:€|EUR|\$|USD|£|GBP)/gi,

  // Flag potential project/product names (capitalized multi-word phrases not in common dictionary)
  catchCapitalizedPhrases: true,
};
