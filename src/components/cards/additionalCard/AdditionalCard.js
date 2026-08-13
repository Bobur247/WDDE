import { useState } from 'react'
import { FaInfoCircle, FaSyncAlt, FaTrashAlt, FaTimes } from 'react-icons/fa'
import {ConfirmModal} from '../../components'

const AdditionalCard = () => {
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
      setUpdateResult("Siz eng so'nggi versiyadasiz (v1.0.0)")
    }, 1200)
  }

  function handleClearCache() {
    sessionStorage.clear()
    Object.keys(localStorage)
      .filter((key) => key.startsWith('wtk-'))
      .forEach((key) => localStorage.removeItem(key))
    setShowClearConfirm(false)
    setClearedMessage('Kesh tozalandi')
    setTimeout(() => setClearedMessage(''), 2500)
  }

  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaInfoCircle />
        </span>
        <h3>Qo'shimcha</h3>
      </div>

      {clearedMessage && <p className="successNote">{clearedMessage}</p>}

      <div className="actionRow">
        <span>Yangilanishlarni tekshirish</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={handleCheckUpdates}
          disabled={checking}
        >
          <FaSyncAlt className={checking ? 'spinning' : ''} />
          <span>{checking ? 'Tekshirilmoqda...' : 'Tekshirish'}</span>
        </button>
      </div>
      {updateResult && <p className="fieldHint">{updateResult}</p>}

      <div className="actionRow">
        <span>Keshni tozalash</span>
        <button
          type="button"
          className="cardActionButton danger"
          onClick={() => setShowClearConfirm(true)}
        >
          <FaTrashAlt />
          <span>Tozalash</span>
        </button>
      </div>

      <div className="actionRow">
        <span>Dastur haqida</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={() => setShowAbout(true)}
        >
          <FaInfoCircle />
          <span>Ma'lumot</span>
        </button>
      </div>

      {showClearConfirm && (
        <ConfirmModal
          title="Keshni tozalash"
          message="Vaqtinchalik saqlangan ma'lumotlar tozalanadi. Sozlamalaringizga ta'sir qilmaydi."
          confirmLabel="Tozalash"
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={handleClearCache}
        />
      )}

      {showAbout && (
        <div className="modalOverlay" onClick={() => setShowAbout(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalTopHeader">
              <h3>Dastur haqida</h3>
              <button
                type="button"
                className="modalCloseIcon"
                onClick={() => setShowAbout(false)}
              >
                <FaTimes />
              </button>
            </div>
            <p className="aboutText">
              <b>Word Document Toolkit</b> — hujjatlar bilan ishlash, ulardan
              ma'lumot ajratish, formatlar orasida konvertatsiya qilish va
              shablonlar asosida yangi hujjatlar yaratish uchun mo'ljallangan
              vosita.
            </p>
            <p className="aboutText">Versiya: 1.0.0</p>
            <div className="modalFooter">
              <button
                type="button"
                className="modalCancelButton"
                onClick={() => setShowAbout(false)}
              >
                <span>Yopish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalCard
