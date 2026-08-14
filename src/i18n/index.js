import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import uz from './locales/uz.json'
import uzCyrl from './locales/uz-Cyrl.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      'uz-Cyrl': { translation: uzCyrl },
      en: { translation: en },
    },
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'uz-Cyrl', 'en'],
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'wdde_language',
    },
  })

export default i18n
