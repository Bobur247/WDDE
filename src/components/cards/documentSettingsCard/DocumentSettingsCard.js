import { useTranslation } from 'react-i18next'
import { FaFileAlt } from 'react-icons/fa'

const FORMATS = ['docx', 'pdf', 'docx-pdf']

const FONTS = ['Arial', 'Times New Roman', 'Calibri', 'Georgia']
const PAGE_SIZES = [
  'A4 (210 x 297 mm)',
  'A5 (148 x 210 mm)',
  'Letter (216 x 279 mm)',
]
const MARGINS = ['narrow', 'normal', 'wide']

const DocumentSettingsCard = ({ values, onChange }) => {
  const { t } = useTranslation()
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>{t('settings.document.title')}</h3>
      </div>

      <div className="cardTwoCol">
        <div className="cardColStack">
          <div className="settingsField">
            <label>{t('settings.document.defaultFormatLabel')}</label>
            <select
              value={values.defaultFormat}
              onChange={(e) => onChange({ defaultFormat: e.target.value })}
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {t(`settings.document.formats.${f}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="settingsField">
            <label>{t('settings.document.defaultFontLabel')}</label>
            <select
              value={values.defaultFont}
              onChange={(e) => onChange({ defaultFont: e.target.value })}
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cardColStack">
          <div className="settingsField">
            <label>{t('settings.document.pageSizeLabel')}</label>
            <select
              value={values.pageSize}
              onChange={(e) => onChange({ pageSize: e.target.value })}
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="settingsField">
            <label>{t('settings.document.marginsLabel')}</label>
            <select
              value={values.margins}
              onChange={(e) => onChange({ margins: e.target.value })}
            >
              {MARGINS.map((m) => (
                <option key={m} value={m}>
                  {t(`settings.document.margins.${m}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="toggleRow">
        <span className="toggleLabelWithIcon">
          <FaFileAlt /> {t('settings.document.headerFooterAuto')}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.headerFooterAuto}
            onChange={(e) => onChange({ headerFooterAuto: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="toggleRow">
        <span className="toggleLabelWithIcon">
          <FaFileAlt /> {t('settings.document.pageNumbers')}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.pageNumbers}
            onChange={(e) => onChange({ pageNumbers: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>
    </div>
  )
}

export default DocumentSettingsCard
