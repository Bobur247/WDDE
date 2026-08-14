import { useTranslation } from 'react-i18next'
import { FaSyncAlt } from 'react-icons/fa'

const PDF_QUALITIES = ['high', 'standard', 'compressed']

const ConversionSettingsCard = ({ values, onChange }) => {
  const { t } = useTranslation()
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaSyncAlt />
        </span>
        <h3>{t('settings.conversion.title')}</h3>
      </div>

      <div className="settingsField">
        <label>{t('settings.conversion.pdfQualityLabel')}</label>
        <select
          value={values.pdfQuality}
          onChange={(e) => onChange({ pdfQuality: e.target.value })}
        >
          {PDF_QUALITIES.map((q) => (
            <option key={q} value={q}>
              {t(`settings.conversion.pdfQualities.${q}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="toggleRow">
        <span>{t('settings.conversion.ocr')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.ocr}
            onChange={(e) => onChange({ ocr: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="toggleRow">
        <span>{t('settings.conversion.imageQuality')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.imageQuality}
            onChange={(e) => onChange({ imageQuality: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="toggleRow">
        <span>{t('settings.conversion.embedFonts')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.embedFonts}
            onChange={(e) => onChange({ embedFonts: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>
    </div>
  )
}

export default ConversionSettingsCard
