import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaInfoCircle, FaSyncAlt, FaTrashAlt, FaTimes } from 'react-icons/fa'
import {ConfirmModal} from '../../components'

const AdditionalCard = () => {
  const { t } = useTranslation()
  const [checking, setChecking] = useState(false)
  const [updateResult, setUpdateResult] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearedMessage, setClearedMessage] = useState('')
  const [showAbout, setShowAbout] = useState(false)

  function handleCheckUpdates() {
    setChecking(true)
    setUpdateResult('')
    setTimeout(() => {
      setChecking(false)
      setUpdateResult(t('settings.additional.updateResult'))
    }, 1200)
  }

  function handleClearCache() {
    sessionStorage.clear()
    Object.keys(localStorage)
      .filter((key) => key.startsWith('wtk-'))
      .forEach((key) => localStorage.removeItem(key))
    setShowClearConfirm(false)
    setClearedMessage(t('settings.additional.cacheCleared'))
    setTimeout(() => setClearedMessage(''), 2500)
  }

  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaInfoCircle />
        </span>
        <h3>{t('settings.additional.title')}</h3>
      </div>

      {clearedMessage && <p className="successNote">{clearedMessage}</p>}

      <div className="actionRow">
        <span>{t('settings.additional.checkUpdates')}</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={handleCheckUpdates}
          disabled={checking}
        >
          <FaSyncAlt className={checking ? 'spinning' : ''} />
          <span>{checking ? t('settings.additional.checking') : t('settings.additional.checkButton')}</span>
        </button>
      </div>
      {updateResult && <p className="fieldHint">{updateResult}</p>}

      <div className="actionRow">
        <span>{t('settings.additional.clearCache')}</span>
        <button
          type="button"
          className="cardActionButton danger"
          onClick={() => setShowClearConfirm(true)}
        >
          <FaTrashAlt />
          <span>{t('settings.additional.clearButton')}</span>
        </button>
      </div>

      <div className="actionRow">
        <span>{t('settings.additional.aboutApp')}</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={() => setShowAbout(true)}
        >
          <FaInfoCircle />
          <span>{t('settings.additional.aboutButton')}</span>
        </button>
      </div>

      {showClearConfirm && (
        <ConfirmModal
          title={t('settings.additional.clearConfirm.title')}
          message={t('settings.additional.clearConfirm.message')}
          confirmLabel={t('settings.additional.clearConfirm.confirmLabel')}
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={handleClearCache}
        />
      )}

      {showAbout && (
        <div className="modalOverlay" onClick={() => setShowAbout(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalTopHeader">
              <h3>{t('settings.additional.aboutModal.title')}</h3>
              <button
                type="button"
                className="modalCloseIcon"
                onClick={() => setShowAbout(false)}
              >
                <FaTimes />
              </button>
            </div>
            <p className="aboutText">
              <b>Word Document Toolkit</b> — {t('settings.additional.aboutModal.description')}
            </p>
            <p className="aboutText">{t('settings.additional.aboutModal.version')}</p>
            <div className="modalFooter">
              <button
                type="button"
                className="modalCancelButton"
                onClick={() => setShowAbout(false)}
              >
                <span>{t('settings.additional.aboutModal.closeButton')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalCard
