import { FaCog, FaMoon, FaBell } from 'react-icons/fa'

const LANGUAGES = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
]

const DATE_FORMATS = [
  'DD.MM.YYYY HH:mm',
  'MM/DD/YYYY hh:mm A',
  'YYYY-MM-DD HH:mm',
]

const REGIONS = ["O'zbekiston", 'Rossiya', "Qozog'iston", 'AQSH']

const GeneralSettingsCard = ({ values, onChange }) => {
  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaCog />
        </span>
        <h3>Umumiy sozlamalar</h3>
      </div>

      <div className="cardTwoCol">
        <div className="cardColStack">
          <div className="settingsField">
            <label>Dastur tili</label>
            <select
              value={values.language}
              onChange={(e) => onChange({ language: e.target.value })}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="settingsField">
            <label>Sana va vaqt formati</label>
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
            <label>Mintaqa</label>
            <select
              value={values.region}
              onChange={(e) => onChange({ region: e.target.value })}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cardColStack">
          <div className="toggleBox">
            <span className="toggleBoxIcon">
              <FaMoon />
            </span>
            <span className="toggleBoxLabel">Tungi rejim</span>
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
            <span className="toggleBoxLabel">Bildirishnomalar</span>
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
    </div>
  )
}

export default GeneralSettingsCard
