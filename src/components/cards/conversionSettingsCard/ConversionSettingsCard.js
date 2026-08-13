import { FaSyncAlt } from 'react-icons/fa'

const PDF_QUALITIES = [
  { value: 'high', label: 'Yuqori (600 DPI)' },
  { value: 'standard', label: 'Standart (300 DPI)' },
  { value: 'compressed', label: 'Siqilgan (150 DPI)' },
]

const ConversionSettingsCard = ({ values, onChange }) => {
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaSyncAlt />
        </span>
        <h3>Konvertatsiya sozlamalari</h3>
      </div>

      <div className="settingsField">
        <label>PDF sifati</label>
        <select
          value={values.pdfQuality}
          onChange={(e) => onChange({ pdfQuality: e.target.value })}
        >
          {PDF_QUALITIES.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>
      </div>

      <div className="toggleRow">
        <span>OCR (matnni tanib olish)</span>
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
        <span>Rasm sifatini saqlash</span>
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
        <span>Fontlarni embed qilish</span>
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
