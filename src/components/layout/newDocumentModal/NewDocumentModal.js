import { FaTimes, FaFileAlt, FaMagic } from 'react-icons/fa'

const NewDocumentModal = ({ onClose, onUseTemplate, onUseBlank }) => {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalBox newDocModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalTopHeader">
          <h3>Yangi hujjat yaratish</h3>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="newDocQuestion">Qanday hujjat yaratmoqchisiz?</p>

        <div className="newDocOptions">
          <button
            type="button"
            className="newDocOption"
            onClick={onUseTemplate}
          >
            <FaFileAlt />
            <span>Shablondan foydalanish</span>
          </button>
          <button type="button" className="newDocOption" onClick={onUseBlank}>
            <FaMagic />
            <span>Bo'sh hujjat yaratish</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewDocumentModal
