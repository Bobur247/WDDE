import { FaBars, FaPlay } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const METHODS = [
    { value: 'range', label: t('informationAllocation.extractionMethod.methods.range'), ready: true },
    { value: 'select', label: t('informationAllocation.extractionMethod.methods.select'), ready: true },
    { value: 'regex', label: t('informationAllocation.extractionMethod.methods.regex'), ready: true },
    { value: 'table', label: t('informationAllocation.extractionMethod.methods.table'), ready: false },
    { value: 'heading', label: t('informationAllocation.extractionMethod.methods.heading'), ready: false },
    { value: 'bookmark', label: t('informationAllocation.extractionMethod.methods.bookmark'), ready: false },
  ]
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
            {!m.ready && <span className="methodSoonBadge">{t('informationAllocation.extractionMethod.soonBadge')}</span>}
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

      {(method === 'table' ||
        method === 'heading' ||
        method === 'bookmark') && (
        <p className="methodComingSoon">
          {t('informationAllocation.extractionMethod.comingSoon', { label: activeMethod?.label })}
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
          <span>{t('informationAllocation.extractionMethod.extract')}</span>
        </button>
      )}
    </div>
  )
}

export default ExtractionMethodCard
