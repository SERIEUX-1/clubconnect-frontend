export const READY_LANGUAGE_CODES = ["en", "fr", "rw"];

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", dir: "ltr" },
  { code: "fr", name: "French", native: "Français", dir: "ltr" },
  { code: "rw", name: "Kinyarwanda", native: "Ikinyarwanda", dir: "ltr" },
  { code: "sw", name: "Swahili", native: "Kiswahili", dir: "ltr" },
  { code: "ar", name: "Arabic", native: "العربية", dir: "rtl" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr" },
  { code: "zh", name: "Chinese", native: "中文", dir: "ltr" },
  { code: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "rn", name: "Kirundi", native: "Ikirundi", dir: "ltr" },
  { code: "lg", name: "Luganda", native: "Luganda", dir: "ltr" },
  { code: "so", name: "Somali", native: "Soomaali", dir: "ltr" },
  { code: "am", name: "Amharic", native: "አማርኛ", dir: "ltr" },
  { code: "ha", name: "Hausa", native: "Hausa", dir: "ltr" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", dir: "ltr" },
  { code: "ig", name: "Igbo", native: "Igbo", dir: "ltr" },
  { code: "zu", name: "Zulu", native: "isiZulu", dir: "ltr" },
  { code: "af", name: "Afrikaans", native: "Afrikaans", dir: "ltr" },
  { code: "ln", name: "Lingala", native: "Lingála", dir: "ltr" },
  { code: "it", name: "Italian", native: "Italiano", dir: "ltr" },
  { code: "nl", name: "Dutch", native: "Nederlands", dir: "ltr" },
  { code: "ru", name: "Russian", native: "Русский", dir: "ltr" },
  { code: "uk", name: "Ukrainian", native: "Українська", dir: "ltr" },
  { code: "pl", name: "Polish", native: "Polski", dir: "ltr" },
  { code: "tr", name: "Turkish", native: "Türkçe", dir: "ltr" },
  { code: "ja", name: "Japanese", native: "日本語", dir: "ltr" },
  { code: "ko", name: "Korean", native: "한국어", dir: "ltr" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", dir: "ltr" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", dir: "ltr" },
  { code: "th", name: "Thai", native: "ไทย", dir: "ltr" },
  { code: "bn", name: "Bengali", native: "বাংলা", dir: "ltr" },
  { code: "ur", name: "Urdu", native: "اردو", dir: "rtl" },
  { code: "fa", name: "Persian", native: "فارسی", dir: "rtl" },
  { code: "he", name: "Hebrew", native: "עברית", dir: "rtl" },
  { code: "el", name: "Greek", native: "Ελληνικά", dir: "ltr" },
  { code: "sv", name: "Swedish", native: "Svenska", dir: "ltr" },
  { code: "no", name: "Norwegian", native: "Norsk", dir: "ltr" },
  { code: "da", name: "Danish", native: "Dansk", dir: "ltr" },
  { code: "fi", name: "Finnish", native: "Suomi", dir: "ltr" },
  { code: "cs", name: "Czech", native: "Čeština", dir: "ltr" },
  { code: "ro", name: "Romanian", native: "Română", dir: "ltr" },
  { code: "hu", name: "Hungarian", native: "Magyar", dir: "ltr" },
  { code: "fil", name: "Filipino", native: "Filipino", dir: "ltr" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", dir: "ltr" },
  { code: "ht", name: "Haitian Creole", native: "Kreyòl ayisyen", dir: "ltr" },
  { code: "mg", name: "Malagasy", native: "Malagasy", dir: "ltr" },
  { code: "ny", name: "Chichewa", native: "Chichewa", dir: "ltr" },
  { code: "sn", name: "Shona", native: "chiShona", dir: "ltr" },
  { code: "ga", name: "Irish", native: "Gaeilge", dir: "ltr" },
];

export const RTL = new Set(LANGUAGES.filter((l) => l.dir === "rtl").map((l) => l.code));

export function languageMeta(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export function isLanguageReady(code) {
  return READY_LANGUAGE_CODES.includes(code);
}
