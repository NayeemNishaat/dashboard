import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import messages from "./messages";

import enLocale from "element-plus/es/locale/lang/en";
import esLocale from "element-plus/es/locale/lang/es";

Object.assign(messages.en, enLocale);
Object.assign(messages.es, esLocale);

export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" }
];

export const supportedLanguageCodes = ["en", "es"];

function browserLanguage() {
  const lang = navigator.language || (navigator as any).userLanguage || "en";
  const langcode = lang.split("-")[0];
  if (supportedLanguageCodes.includes(langcode)) {
    return langcode;
  }
  return "en";
}

const curLocale = localStorage.getItem("lang") || browserLanguage();
localStorage.setItem("lang", curLocale);

export const i18n = createI18n({
  locale: curLocale,
  fallbackLocale: "en",
  messages
});
