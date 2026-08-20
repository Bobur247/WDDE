import { useState } from 'react'
import { FaTimes, FaSave, FaFileWord, FaFilePdf, FaFileAlt, FaFileCode, FaFileCsv } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const FORMAT_ICONS = {
  docx: FaFileWord,
  pdf: FaFilePdf,
  txt: FaFileAlt,
  json: FaFileCode,
  csv: FaFileCsv,
}

const SaveFileModal = ({
  defaultName,
  format,
  history,
  onClose,
  onSave,
  saving = false,
}) => {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState(defaultName)
  const [mode, setMode] = useState('new')
  const [existingHistoryId, setExistingHistoryId] = useState('')
  const [hoveredDisabled, setHoveredDisabled] = useState(false)

  const canAppend = format === 'txt' || format === 'csv' || format === 'json'
  const matchingHistory = history.filter(
    (h) => h.format.toLowerCase() === format,
  )

  function handleSubmit() {
    if (!fileName.trim()) return
    onSave({
      fileName,
      mode,
      existingHistoryId: mode === 'append' ? Number(existingHistoryId) : null,
    })
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="modalTopHeader">
          <h3>{t('informationAllocation.saveFileModal.title')}</h3>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="settingsField">
          <label>{t('informationAllocation.saveFileModal.fileNameLabel')}</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div className="settingsField">
          <label>{t('informationAllocation.saveFileModal.formatLabel')}</label>
          <div className="formatIconsGrid">
            {Object.entries(FORMAT_ICONS).map(([key, Icon]) => (
              <div
                key={key}
                className={`formatIconItem ${format === key ? 'active' : ''}`}
              >
                <Icon />
                <span>{key.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="settingsField label-only">
          {t('informationAllocation.saveFileModal.saveMethodLabel')}
        </p>

        <div className="saveMethodCards">
          <div
            className={`saveMethodCard ${mode === 'new' ? 'active' : ''}`}
            onClick={() => setMode('new')}
          >
            <span className="saveMethodCardIcon">
              <FaSave />
            </span>
            <span className="saveMethodCardLabel">
              {t('informationAllocation.saveFileModal.newFile')}
            </span>
          </div>

          {canAppend ? (
            <div
              className={`saveMethodCard ${mode === 'append' ? 'active' : ''}`}
              onClick={() => setMode('append')}
            >
              <span className="saveMethodCardIcon">
                <FaFileAlt />
              </span>
              <span className="saveMethodCardLabel">
                {t('informationAllocation.saveFileModal.appendFile')}
              </span>
            </div>
          ) : (
            <div
              className="disabledCardWrapper"
              onMouseEnter={() => setHoveredDisabled(true)}
              onMouseLeave={() => setHoveredDisabled(false)}
            >
              <div className={`saveMethodCard disabled`}>
                <span className="saveMethodCardIcon">
                  <FaFileAlt />
                </span>
                <span className="saveMethodCardLabel">
                  {t('informationAllocation.saveFileModal.appendFile')}
                </span>
                <span className="saveMethodCardHint">
                  {t('informationAllocation.saveFileModal.appendNotSupportedDocxPdf')}
                </span>
              </div>
              {hoveredDisabled && (
                <div className="tooltip">
                  {t('informationAllocation.saveFileModal.appendNotSupportedDocxPdf')}
                </div>
              )}
            </div>
          )}
        </div>

        {!canAppend && (
          <p className="fieldHint" style={{ marginTop: -8, marginBottom: 12 }}>
            {t('informationAllocation.saveFileModal.appendHint')}
          </p>
        )}

        {mode === 'append' && canAppend && (
          <div className="settingsField">
            <label>{t('informationAllocation.saveFileModal.appendToLabel')}</label>
            <select
              value={existingHistoryId}
              onChange={(e) => setExistingHistoryId(e.target.value)}
            >
              <option value="">
                {t('informationAllocation.saveFileModal.selectFileOption')}
              </option>
              {matchingHistory.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.fileName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="modalFooter">
          <button type="button" className="modalCancelButton" onClick={onClose}>
            <span>{t('informationAllocation.saveFileModal.cancel')}</span>
          </button>
          <button
            type="button"
            className="modalSaveButton"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving && <span className="inlineSpinner" />}
            <span>
              {saving
                ? t('informationAllocation.saveFileModal.saving')
                : t('informationAllocation.saveFileModal.save')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveFileModal
