import { useState } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const SaveFileModal = ({ defaultName, format, history, onClose, onSave }) => {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState(defaultName)
  const [mode, setMode] = useState('new')
  const [existingHistoryId, setExistingHistoryId] = useState('')

  // "Mavjud faylga qo'shish" faqat matn asosli formatlar uchun haqiqatan
  // ishlaydi (txt/csv/json) — docx/pdf uchun ichki strukturaga yozish
  // backend (docxtemplater) talab qiladi.
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
          <input type="text" value={format.toUpperCase()} disabled />
        </div>

        <p className="settingsField label-only">{t('informationAllocation.saveFileModal.saveMethodLabel')}</p>
        <label className="radioRow">
          <input
            type="radio"
            name="saveMode"
            checked={mode === 'new'}
            onChange={() => setMode('new')}
          />
          <span>{t('informationAllocation.saveFileModal.newFile')}</span>
        </label>
        <label className={`radioRow ${!canAppend ? 'disabledRow' : ''}`}>
          <input
            type="radio"
            name="saveMode"
            checked={mode === 'append'}
            disabled={!canAppend || matchingHistory.length === 0}
            onChange={() => setMode('append')}
          />
          <span>{t('informationAllocation.saveFileModal.appendFile')}</span>
        </label>

        {!canAppend && (
          <p className="fieldHint">
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
              <option value="">{t('informationAllocation.saveFileModal.selectFileOption')}</option>
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
          >
            <FaSave />
            <span>{t('informationAllocation.saveFileModal.save')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveFileModal
