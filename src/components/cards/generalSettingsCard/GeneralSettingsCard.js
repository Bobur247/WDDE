import { useTranslation } from 'react-i18next'
import { FaCog, FaMoon, FaBell } from 'react-icons/fa'

const LANGUAGES = ['uz', 'ru', 'en']

const DATE_FORMATS = [
  'DD.MM.YYYY HH:mm',
  'MM/DD/YYYY hh:mm A',
  'YYYY-MM-DD HH:mm',
]

// value == original Uzbek display string (unchanged data contract); label is translated for display
const REGIONS = [
  { value: "O'zbekiston", key: 'uzbekistan' },
  { value: 'Rossiya', key: 'russia' },
  { value: "Qozog'iston", key: 'kazakhstan' },
  { value: 'AQSH', key: 'usa' },
]

const GeneralSettingsCard = ({ values, onChange }) => {
  const { t } = useTranslation()
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaCog />
        </span>
        <h3>{t('settings.general.title')}</h3>
      </div>

      <div className="cardColStack">
        <div className="settingsField">
          <label>{t('settings.general.languageLabel')}</label>
          <select
            value={values.language}
            onChange={(e) => onChange({ language: e.target.value })}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {t(`settings.general.languages.${l}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="settingsField">
          <label>{t('settings.general.dateFormatLabel')}</label>
          <select
            value={values.dateFormat}
            onChange={(e) => onChange({ dateFormat: e.target.value })}
          >
            {DATE_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="settingsField">
          <label>{t('settings.general.regionLabel')}</label>
          <select
            value={values.region}
            onChange={(e) => onChange({ region: e.target.value })}
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {t(`settings.general.regions.${r.key}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="toggleBox">
          <span className="toggleBoxIcon">
            <FaMoon />
          </span>
          <span className="toggleBoxLabel">{t('settings.general.darkMode')}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={values.darkMode}
              onChange={(e) => onChange({ darkMode: e.target.checked })}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="toggleBox">
          <span className="toggleBoxIcon">
            <FaBell />
          </span>
          <span className="toggleBoxLabel">{t('settings.general.notifications')}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={values.notifications}
              onChange={(e) => onChange({ notifications: e.target.checked })}
            />
            <span className="slider" />
          </label>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettingsCard
