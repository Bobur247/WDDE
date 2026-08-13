import { FaFolder, FaFolderOpen } from 'react-icons/fa'

const MAX_SIZES = ['10', '20', '50', '100', '200']

const FileSettingsCard = ({ values, onChange }) => {
  const supportsFolderPicker = typeof window.showDirectoryPicker === 'function'

  // Haqiqiy brauzer API (Chrome/Edge) — papka tanlaydi. Xavfsizlik
  // sabablariga ko'ra brauzer to'liq absolyut yo'lni bermaydi, faqat
  // papka nomini beradi, shuning uchun to'liq path input orqali ham
  // qo'lda kiritish imkoniyati qoldirilgan.
  async function handlePickFolder() {
    if (!supportsFolderPicker) return
    try {
      const dirHandle = await window.showDirectoryPicker()
      onChange({ downloadPath: dirHandle.name })
    } catch (err) {
      // foydalanuvchi bekor qilgan bo'lishi mumkin - xato emas
    }
  }

  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFolder />
        </span>
        <h3>Fayl sozlamalari</h3>
      </div>

      <div className="settingsField">
        <label>Default Download papkasi</label>
        <div className="pathInputRow">
          <input
            type="text"
            value={values.downloadPath}
            onChange={(e) => onChange({ downloadPath: e.target.value })}
          />
          <button
            type="button"
            className="pathPickButton"
            onClick={handlePickFolder}
            disabled={!supportsFolderPicker}
            title={
              supportsFolderPicker
                ? 'Papka tanlash'
                : "Brauzeringiz bu funksiyani qo'llab-quvvatlamaydi"
            }
          >
            <FaFolderOpen />
          </button>
        </div>
      </div>

      <div className="toggleRow">
        <span>Avtomatik nomlash</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={values.autoRename}
            onChange={(e) => onChange({ autoRename: e.target.checked })}
          />
          <span className="slider" />
        </label>
      </div>

      <div className="settingsField">
        <label>Maksimal fayl hajmi</label>
        <select
          value={values.maxFileSize}
          onChange={(e) => onChange({ maxFileSize: e.target.value })}
        >
          {MAX_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} MB
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FileSettingsCard
