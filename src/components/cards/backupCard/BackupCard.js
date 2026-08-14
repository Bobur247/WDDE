import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FaDatabase,
  FaDownload,
  FaUpload,
  FaSave,
  FaRedo,
} from 'react-icons/fa'

const BackupCard = ({ settings, onImport }) => {
  const { t } = useTranslation()
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
      setMessage(t('settings.backup.importSuccess'))
    } catch (err) {
      console.error(err)
      setMessage(t('settings.backup.importError'))
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
        <h3>{t('settings.backup.title')}</h3>
      </div>

      {message && <p className="successNote">{message}</p>}

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => downloadJson('sozlamalar-export')}
      >
        <FaDownload />
        <span>{t('settings.backup.exportButton')}</span>
      </button>

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => importInputRef.current?.click()}
      >
        <FaUpload />
        <span>{t('settings.backup.importButton')}</span>
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
        <span>{t('settings.backup.createBackupButton')}</span>
      </button>

      <button
        type="button"
        className="cardActionButton full"
        onClick={() => restoreInputRef.current?.click()}
      >
        <FaRedo />
        <span>{t('settings.backup.restoreButton')}</span>
      </button>
      <input
        ref={restoreInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleFileSelected}
      />

      <p className="fieldHint">
        {t('settings.backup.hint')}
      </p>
    </div>
  )
}

export default BackupCard
