// import Vue from "vue";
// import VueI18n from "vue-i18n";
import { createI18n } from "vue-i18n";
import messages from "@/lang/messages";
// import ElementPlus from "element-plus";
import "element-ui/lib/theme-chalk/index.css";

import enLocale from "element-ui/lib/locale/lang/en";
import esLocale from "element-ui/lib/locale/lang/es";

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

// Vue.use(VueI18n);
export const i18n = createI18n({
  locale: curLocale,
  fallbackLocale: "en",
  messages
});

// Vue.use(ElementPlus, {
//   i18n: (key: string, value: string) => i18n.t(key, value)
// });
