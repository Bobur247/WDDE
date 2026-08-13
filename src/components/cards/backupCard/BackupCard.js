import { useRef, useState } from 'react'
import {
  FaDatabase,
  FaDownload,
  FaUpload,
  FaSave,
  FaRedo,
} from 'react-icons/fa'

const BackupCard = ({ settings, onImport }) => {
  const importInputRef = useRef(null)
  const restoreInputRef = useRef(null)
  const [message, setMessage] = useState('')

  function downloadJson(filenamePrefix) {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenamePrefix}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleFileSelected(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const importedSettings = parsed.settings || parsed
      onImport(importedSettings)
      setMessage("Ma'lumotlar muvaffaqiyatli import qilindi")
    } catch (err) {
      console.error(err)
      setMessage('Faylni o\u02bbqishda xatolik — JSON formatini tekshiring')
    } finally {
      e.target.value = ''
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaDatabase />
        </span>
        <h3>Zaxira (Backup)</h3>
      </div>

      {message && <p className="successNote">{message}</p>}

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => downloadJson('sozlamalar-export')}
      >
        <FaDownload />
        <span>Ma'lumotlarni eksport qilish</span>
      </button>

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => importInputRef.current?.click()}
      >
        <FaUpload />
        <span>Ma'lumotlarni import qilish</span>
      </button>
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleFileSelected}
      />

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => downloadJson('backup')}
      >
        <FaSave />
        <span>Backup yaratish</span>
      </button>

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => restoreInputRef.current?.click()}
      >
        <FaRedo />
        <span>Restore (tiklash)</span>
      </button>
      <input
        ref={restoreInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleFileSelected}
      />

      <p className="fieldHint">
        Hozircha faqat sozlamalar (bu sahifadagilar) eksport/import qilinadi.
        Hujjatlar tarixi va shablonlar kabi ma'lumotlarni backup qilish backend
        ulanganda qo'shiladi.
      </p>
    </div>
  )
}

export default BackupCard
