import { FaFileAlt } from 'react-icons/fa'

const METHODS = [
  { value: 'table', label: 'Jadval (Table)' },
  { value: 'block', label: 'Blok (Boshlanishi-tugashi)' },
  { value: 'checkbox', label: 'Checkbox (Har bir qator)' },
  { value: 'keyword', label: "Kalit so'z bo'yicha" },
  { value: 'regex', label: "Regex bo'yicha" },
]

const ExtractionSettingsCard = ({ values, onChange }) => {
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>Ma'lumot ajratish sozlamalari</h3>
      </div>

      <div className="settingsField">
        <label>Standart ajratish usuli</label>
        <select
          value={values.defaultMethod}
          onChange={(e) => onChange({ defaultMethod: e.target.value })}
        >
          {METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="toggleRow">
        <span>Boshlanish va tugash belgilarini saqlash</span>
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
        <span>Regex rejimi</span>
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
        <span>Shablonlarni avtomatik yuklash</span>
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
