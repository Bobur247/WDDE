import { useState } from 'react'
import { FaTimes, FaSave } from 'react-icons/fa'

const SaveFileModal = ({ defaultName, format, history, onClose, onSave }) => {
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
          <h3>Yangi fayl yaratish</h3>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="settingsField">
          <label>Fayl nomi:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <div className="settingsField">
          <label>Format:</label>
          <input type="text" value={format.toUpperCase()} disabled />
        </div>

        <p className="settingsField label-only">Saqlash usuli:</p>
        <label className="radioRow">
          <input
            type="radio"
            name="saveMode"
            checked={mode === 'new'}
            onChange={() => setMode('new')}
          />
          <span>Yangi fayl yaratish</span>
        </label>
        <label className={`radioRow ${!canAppend ? 'disabledRow' : ''}`}>
          <input
            type="radio"
            name="saveMode"
            checked={mode === 'append'}
            disabled={!canAppend || matchingHistory.length === 0}
            onChange={() => setMode('append')}
          />
          <span>Mavjud faylga qo'shish</span>
        </label>

        {!canAppend && (
          <p className="fieldHint">
            DOCX/PDF fayllarga qo'shish backend integratsiyasi bilan qo'shiladi
            — hozircha faqat TXT/CSV/JSON uchun ishlaydi.
          </p>
        )}

        {mode === 'append' && canAppend && (
          <div className="settingsField">
            <label>Qaysi faylga qo'shilsin:</label>
            <select
              value={existingHistoryId}
              onChange={(e) => setExistingHistoryId(e.target.value)}
            >
              <option value="">Faylni tanlang</option>
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
            <span>Bekor qilish</span>
          </button>
          <button
            type="button"
            className="modalSaveButton"
            onClick={handleSubmit}
          >
            <FaSave />
            <span>Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveFileModal
