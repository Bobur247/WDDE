import { useTranslation } from 'react-i18next'
import { FaFileAlt } from 'react-icons/fa'

const METHODS = ['table', 'block', 'checkbox', 'keyword', 'regex']

const ExtractionSettingsCard = ({ values, onChange }) => {
  const { t } = useTranslation()
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>{t('settings.extraction.title')}</h3>
      </div>

      <div className="settingsField">
        <label>{t('settings.extraction.defaultMethodLabel')}</label>
        <select
          value={values.defaultMethod}
          onChange={(e) => onChange({ defaultMethod: e.target.value })}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {t(`settings.extraction.methods.${m}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="toggleRow">
        <span>{t('settings.extraction.saveMarkers')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.saveMarkers}
            onChange={(e) => onChange({ saveMarkers: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="toggleRow">
        <span>{t('settings.extraction.regexMode')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.regexMode}
            onChange={(e) => onChange({ regexMode: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="toggleRow">
        <span>{t('settings.extraction.autoLoadTemplates')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.autoLoadTemplates}
            onChange={(e) => onChange({ autoLoadTemplates: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>
    </div>
  )
}

export default ExtractionSettingsCard
