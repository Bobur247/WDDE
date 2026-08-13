import { FaBars, FaPlay } from 'react-icons/fa'

const METHODS = [
  { value: 'range', label: "Belgi oralig'i", ready: true },
  { value: 'select', label: 'Matn tanlash', ready: true },
  { value: 'regex', label: 'Regex (ifoda)', ready: true },
  { value: 'table', label: 'Jadval', ready: false },
  { value: 'heading', label: 'Heading (sarlavha)', ready: false },
  { value: 'bookmark', label: 'Bookmark', ready: false },
]

const ExtractionMethodCard = ({
  disabled,
  method,
  setMethod,
  rangeStart,
  setRangeStart,
  rangeEnd,
  setRangeEnd,
  includeStart,
  setIncludeStart,
  includeEnd,
  setIncludeEnd,
  regexPattern,
  setRegexPattern,
  pendingSelectedText,
  onAddSelectedText,
  onExtract,
}) => {
  const activeMethod = METHODS.find((m) => m.value === method)

  return (
    <div className={`settingsCard ${disabled ? 'cardDisabled' : ''}`}>
      <div className="methodList">
        {METHODS.map((m) => (
          <label className="methodRadioRow" key={m.value}>
            <input
              type="radio"
              name="extractionMethod"
              checked={method === m.value}
              disabled={disabled}
              onChange={() => setMethod(m.value)}
            />
            <span>{m.label}</span>
            {!m.ready && <span className="methodSoonBadge">tez orada</span>}
          </label>
        ))}
      </div>

      {method === 'range' && (
        <>
          <div className="settingsField">
            <label>Boshlanish belgisi:</label>
            <div className="inputWithIcon">
              <input
                type="text"
                placeholder="Masalan: Ism:"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                disabled={disabled}
              />
              <FaBars />
            </div>
          </div>
          <div className="settingsField">
            <label>Tugash belgisi:</label>
            <div className="inputWithIcon">
              <input
                type="text"
                placeholder="Masalan: Manzil:"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                disabled={disabled}
              />
              <FaBars />
            </div>
          </div>
          <label className="checkboxRow">
            <input
              type="checkbox"
              checked={includeStart}
              onChange={(e) => setIncludeStart(e.target.checked)}
              disabled={disabled}
            />
            <span>Boshlanishni qo'sh</span>
          </label>
          <label className="checkboxRow">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
              disabled={disabled}
            />
            <span>Tugashni qo'sh</span>
          </label>
        </>
      )}

      {method === 'select' && (
        <div className="selectMethodBox">
          <label>Tanlangan matn:</label>
          <div className="selectedTextPreview">
            {pendingSelectedText || 'Preview oynasida matn belgilang...'}
          </div>
          <button
            type="button"
            className="addSelectedTextButton"
            onClick={onAddSelectedText}
            disabled={disabled || !pendingSelectedText}
          >
            + Ajratishga qo'shish
          </button>
        </div>
      )}

      {method === 'regex' && (
        <div className="settingsField">
          <label>Regex ifoda:</label>
          <input
            type="text"
            placeholder="Masalan: \+998\d{9}"
            value={regexPattern}
            onChange={(e) => setRegexPattern(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}

      {(method === 'table' ||
        method === 'heading' ||
        method === 'bookmark') && (
        <p className="methodComingSoon">
          "{activeMethod?.label}" usuli keyingi bosqichda qo'shiladi — bu docx
          faylning ichki strukturasini (jadval/sarlavha/bookmark) chuqurroq
          tahlil qilishni talab qiladi.
        </p>
      )}

      {method !== 'select' && (
        <button
          type="button"
          className="extractButton"
          onClick={onExtract}
          disabled={
            disabled ||
            method === 'table' ||
            method === 'heading' ||
            method === 'bookmark'
          }
        >
          <FaPlay />
          <span>Ajratish</span>
        </button>
      )}
    </div>
  )
}

export default ExtractionMethodCard
