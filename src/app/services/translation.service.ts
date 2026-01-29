import { Injectable, signal, PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import enTranslations from "@translations/en.json";
import esTranslations from "@translations/es.json";

type Translations = { [key: string]: any };

const translations = {
  en: enTranslations,
  es: esTranslations,
};

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  private currentLocale = signal<"en" | "es">("en");

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeLocale();
  }

  private initializeLocale() {
    if (isPlatformBrowser(this.platformId)) {
      const browserLang = navigator.language.split("-")[0] as "en" | "es";
      const locale = ["en", "es"].includes(browserLang) ? browserLang : "en";
      this.currentLocale.set(locale);
    }
  }

  setLocale(locale: "en" | "es") {
    this.currentLocale.set(locale);
  }

  getCurrentLocale() {
    return this.currentLocale();
  }

  t(key: string): string {
    const keys = key.split(".");
    let value: any = translations[this.currentLocale()];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  translate(key: string): string {
    return this.t(key);
  }
}
