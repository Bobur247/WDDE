import { FaBars, FaPlay, FaTable } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const HEADING_LEVELS = [
  { value: 'H1', label: 'H1' },
  { value: 'H2', label: 'H2' },
  { value: 'H3', label: 'H3' },
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
  tableIndex,
  setTableIndex,
  headingLevel,
  setHeadingLevel,
  selectedBookmark,
  setSelectedBookmark,
  bookmarks,
  tablesCount,
  headingsList,
}) => {
  const { t } = useTranslation()
  const METHODS = [
    { value: 'range', label: t('informationAllocation.extractionMethod.methods.range') },
    { value: 'select', label: t('informationAllocation.extractionMethod.methods.select') },
    { value: 'regex', label: t('informationAllocation.extractionMethod.methods.regex') },
    { value: 'table', label: t('informationAllocation.extractionMethod.methods.table') },
    { value: 'heading', label: t('informationAllocation.extractionMethod.methods.heading') },
    { value: 'bookmark', label: t('informationAllocation.extractionMethod.methods.bookmark') },
  ]

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
          </label>
        ))}
      </div>

      {method === 'range' && (
        <>
          <div className="settingsField">
            <label>{t('informationAllocation.extractionMethod.rangeStartLabel')}</label>
            <div className="inputWithIcon">
              <input
                type="text"
                placeholder={t('informationAllocation.extractionMethod.rangeStartPlaceholder')}
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                disabled={disabled}
              />
              <FaBars />
            </div>
          </div>
          <div className="settingsField">
            <label>{t('informationAllocation.extractionMethod.rangeEndLabel')}</label>
            <div className="inputWithIcon">
              <input
                type="text"
                placeholder={t('informationAllocation.extractionMethod.rangeEndPlaceholder')}
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
            <span>{t('informationAllocation.extractionMethod.includeStart')}</span>
          </label>
          <label className="checkboxRow">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
              disabled={disabled}
            />
            <span>{t('informationAllocation.extractionMethod.includeEnd')}</span>
          </label>
        </>
      )}

      {method === 'select' && (
        <div className="selectMethodBox">
          <label>{t('informationAllocation.extractionMethod.selectedTextLabel')}</label>
          <div className="selectedTextPreview">
            {pendingSelectedText || t('informationAllocation.extractionMethod.selectedTextPlaceholder')}
          </div>
          <button
            type="button"
            className="addSelectedTextButton"
            onClick={onAddSelectedText}
            disabled={disabled || !pendingSelectedText}
          >
            {t('informationAllocation.extractionMethod.addSelectedText')}
          </button>
        </div>
      )}

      {method === 'regex' && (
        <div className="settingsField">
          <label>{t('informationAllocation.extractionMethod.regexPatternLabel')}</label>
          <input
            type="text"
            placeholder={t('informationAllocation.extractionMethod.regexPatternPlaceholder')}
            value={regexPattern}
            onChange={(e) => setRegexPattern(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}

      {method === 'table' && (
        <div className="settingsField">
          <label>{t('informationAllocation.extractionMethod.tableIndexLabel')}</label>
          <div className="inputWithIcon">
            <input
              type="number"
              min="1"
              placeholder={t('informationAllocation.extractionMethod.tableIndexPlaceholder')}
              value={tableIndex}
              onChange={(e) => setTableIndex(e.target.value)}
              disabled={disabled || tablesCount === 0}
            />
            <FaTable />
          </div>
          {tablesCount === 0 && (
            <p className="fieldHint">{t('informationAllocation.extractionMethod.noTablesFound')}</p>
          )}
          {tablesCount > 0 && (
            <p className="fieldHint">
              {t('informationAllocation.extractionMethod.tableIndexPlaceholder', { count: tablesCount })}
            </p>
          )}
        </div>
      )}

      {method === 'heading' && (
        <div className="settingsField">
          <label>{t('informationAllocation.extractionMethod.headingLevelLabel')}</label>
          <select
            value={headingLevel}
            onChange={(e) => setHeadingLevel(e.target.value)}
            disabled={disabled || headingsList.length === 0}
          >
            <option value="">{t('informationAllocation.extractionMethod.headingLevelPlaceholder')}</option>
            {HEADING_LEVELS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
          {headingsList.length === 0 && (
            <p className="fieldHint">{t('informationAllocation.extractionMethod.noHeadingsFound')}</p>
          )}
        </div>
      )}

      {method === 'bookmark' && (
        <div className="settingsField">
          <label>{t('informationAllocation.extractionMethod.bookmarkSelectLabel')}</label>
          <select
            value={selectedBookmark}
            onChange={(e) => setSelectedBookmark(e.target.value)}
            disabled={disabled || bookmarks.length === 0}
          >
            <option value="">{t('informationAllocation.extractionMethod.bookmarkPlaceholder')}</option>
            {bookmarks.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
          {bookmarks.length === 0 && (
            <p className="fieldHint">{t('informationAllocation.extractionMethod.noBookmarksFound')}</p>
          )}
        </div>
      )}

      {method !== 'select' && (
        <button
          type="button"
          className="extractButton"
          onClick={onExtract}
          disabled={disabled}
        >
          <FaPlay />
          <span>{t('informationAllocation.extractionMethod.extract')}</span>
        </button>
      )}
    </div>
  )
}

export default ExtractionMethodCard
