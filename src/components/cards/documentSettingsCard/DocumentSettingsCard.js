import { FaFileAlt } from 'react-icons/fa'

const FORMATS = [
  { value: 'docx', label: 'DOCX (Word)' },
  { value: 'pdf', label: 'PDF' },
  { value: 'docx-pdf', label: 'DOCX + PDF' },
]

const FONTS = ['Arial', 'Times New Roman', 'Calibri', 'Georgia']
const PAGE_SIZES = [
  'A4 (210 x 297 mm)',
  'A5 (148 x 210 mm)',
  'Letter (216 x 279 mm)',
]
const MARGINS = [
  { value: 'narrow', label: 'Tor (1.27 cm)' },
  { value: 'normal', label: 'Normal (2.5 cm)' },
  { value: 'wide', label: 'Keng (3.18 cm)' },
]

const DocumentSettingsCard = ({ values, onChange }) => {
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>Hujjat sozlamalari</h3>
      </div>

      <div className="cardTwoCol">
        <div className="cardColStack">
          <div className="settingsField">
            <label>Standart saqlash formati</label>
            <select
              value={values.defaultFormat}
              onChange={(e) => onChange({ defaultFormat: e.target.value })}
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="settingsField">
            <label>Standart shrift</label>
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
            <label>Sahifa o'lchami</label>
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
            <label>Marginlar</label>
            <select
              value={values.margins}
              onChange={(e) => onChange({ margins: e.target.value })}
            >
              {MARGINS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="toggleRow">
        <span className="toggleLabelWithIcon">
          <FaFileAlt /> Header / Footer avtomatik qo'shish
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
          <FaFileAlt /> Sahifa raqamlari
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
