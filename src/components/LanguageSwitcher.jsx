// src/components/LanguageSwitcher.jsx
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const cur = i18n.resolvedLanguage

  return (
    <div className="lang-switch">
      <button
        type="button"
        className={`btn ${cur === 'ru' ? 'btn-brand' : 'btn-outline-brand'}`}
        onClick={() => i18n.changeLanguage('ru')}
      >
        RU
      </button>
      <button
        type="button"
        className={`btn ${cur === 'en' ? 'btn-brand' : 'btn-outline-brand'}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        EN
      </button>
    </div>
  )
}
