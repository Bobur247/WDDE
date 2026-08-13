import { useState } from 'react'
import {
  FaShieldAlt,
  FaKey,
  FaLaptop,
  FaTimes,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'

function generateFakeToken() {
  // Demo uchun tasodifiy token — HAQIQIY autentifikatsiya huquqiga ega emas.
  // Productionda bu albatta backend API orqali generatsiya qilinishi kerak.
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = 'wtk_'
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

const SecurityCard = ({ values, onChange }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showTokensModal, setShowTokensModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)

  // ===== Parol o'zgartirish (forma frontendda tayyor, submit backend kerak) =====
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSubmitted, setPasswordSubmitted] = useState(false)

  function handlePasswordSubmit() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Barcha maydonlarni to'ldiring")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("Yangi parol kamida 8 belgidan iborat bo'lishi kerak")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Yangi parollar mos kelmadi')
      return
    }
    setPasswordError('')
    // TODO (backend): bu yerda /api/change-password ga so'rov yuboriladi
    setPasswordSubmitted(true)
  }

  function closePasswordModal() {
    setShowPasswordModal(false)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setPasswordSubmitted(false)
  }

  // ===== API Tokenlar (demo - client tomonda generatsiya, backendga bog'liq emas) =====
  const [tokens, setTokens] = useState([])

  function handleGenerateToken() {
    setTokens((prev) => [
      {
        id: Date.now(),
        value: generateFakeToken(),
        created: new Date().toLocaleDateString('uz-UZ'),
      },
      ...prev,
    ])
  }

  function handleRevokeToken(id) {
    setTokens((prev) => prev.filter((t) => t.id !== id))
  }

  // ===== Aktiv sessiyalar (faqat joriy brauzer haqiqiy, qolganlari backend kerak) =====
  const currentSession = {
    device: navigator.userAgent.includes('Mobile')
      ? 'Mobil qurilma'
      : 'Kompyuter',
    browser: navigator.userAgent,
    time: new Date().toLocaleString('uz-UZ'),
  }

  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaShieldAlt />
        </span>
        <h3>Xavfsizlik</h3>
      </div>

      <div className="actionRow">
        <span>Parolni o'zgartirish</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={() => setShowPasswordModal(true)}
        >
          <FaKey />
          <span>Parolni o'zgartirish</span>
        </button>
      </div>

      <div className="toggleRow">
        <span>2 bosqichli tasdiqlash (2FA)</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.twoFA}
            onChange={(e) => onChange({ twoFA: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>
      {values.twoFA && (
        <p className="fieldHint">
          2FA yoqildi (demo). Haqiqiy QR-kod orqali sozlash uchun backend
          integratsiyasi kerak bo'ladi.
        </p>
      )}

      <div className="actionRow">
        <span>API Token</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={() => setShowTokensModal(true)}
        >
          <FaKey />
          <span>Tokenlar</span>
        </button>
      </div>

      <div className="actionRow">
        <span>Aktiv sessiyalar</span>
        <button
          type="button"
          className="cardActionButton"
          onClick={() => setShowSessionsModal(true)}
        >
          <FaLaptop />
          <span>Sessiyalar</span>
        </button>
      </div>

      {/* ===== Parol modali ===== */}
      {showPasswordModal && (
        <div className="modalOverlay" onClick={closePasswordModal}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalTopHeader">
              <h3>Parolni o'zgartirish</h3>
              <button
                type="button"
                className="modalCloseIcon"
                onClick={closePasswordModal}
              >
                <FaTimes />
              </button>
            </div>

            {passwordSubmitted ? (
              <p className="successNote">
                So'rov tayyorlandi. Bu demo — haqiqiy parol backend API
                ulanganda almashtiriladi.
              </p>
            ) : (
              <>
                <div className="settingsField">
                  <label>Joriy parol</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="settingsField">
                  <label>Yangi parol</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="settingsField">
                  <label>Yangi parolni tasdiqlang</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordError && <p className="modalError">{passwordError}</p>}
              </>
            )}

            <div className="modalFooter">
              <button
                type="button"
                className="modalCancelButton"
                onClick={closePasswordModal}
              >
                <span>{passwordSubmitted ? 'Yopish' : 'Bekor qilish'}</span>
              </button>
              {!passwordSubmitted && (
                <button
                  type="button"
                  className="modalSaveButton"
                  onClick={handlePasswordSubmit}
                >
                  <span>Saqlash</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Tokenlar modali ===== */}
      {showTokensModal && (
        <div className="modalOverlay" onClick={() => setShowTokensModal(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalTopHeader">
              <h3>API Tokenlar</h3>
              <button
                type="button"
                className="modalCloseIcon"
                onClick={() => setShowTokensModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <p className="fieldHint">
              Demo rejimi — bu tokenlar faqat ko'rinish uchun, haqiqiy
              autentifikatsiyada ishlatilmaydi.
            </p>

            <button
              type="button"
              className="cardActionButton full"
              onClick={handleGenerateToken}
            >
              <FaPlus />
              <span>Yangi token yaratish</span>
            </button>

            <div className="tokenList">
              {tokens.length === 0 && (
                <p className="emptyListText">Tokenlar yo'q</p>
              )}
              {tokens.map((t) => (
                <div className="tokenRow" key={t.id}>
                  <div>
                    <p className="tokenValue">{t.value}</p>
                    <p className="tokenDate">Yaratilgan: {t.created}</p>
                  </div>
                  <button
                    type="button"
                    className="tokenRevokeButton"
                    onClick={() => handleRevokeToken(t.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="modalFooter">
              <button
                type="button"
                className="modalCancelButton"
                onClick={() => setShowTokensModal(false)}
              >
                <span>Yopish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Sessiyalar modali ===== */}
      {showSessionsModal && (
        <div
          className="modalOverlay"
          onClick={() => setShowSessionsModal(false)}
        >
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalTopHeader">
              <h3>Aktiv sessiyalar</h3>
              <button
                type="button"
                className="modalCloseIcon"
                onClick={() => setShowSessionsModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="sessionRow current">
              <FaLaptop />
              <div>
                <p className="sessionDevice">
                  {currentSession.device} (joriy sessiya)
                </p>
                <p className="sessionMeta">{currentSession.time}</p>
              </div>
            </div>

            <p className="fieldHint">
              Boshqa qurilmalardagi sessiyalar ro'yxati backend (server
              tomonidagi sessiya bazasi) ulanganda shu yerda ko'rinadi.
            </p>

            <div className="modalFooter">
              <button
                type="button"
                className="modalCancelButton"
                onClick={() => setShowSessionsModal(false)}
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

export default SecurityCard
