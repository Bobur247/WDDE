import { useTranslation } from 'react-i18next'
import { FaTimes, FaFileAlt, FaMagic } from 'react-icons/fa'

const NewDocumentModal = ({ onClose, onUseTemplate, onUseBlank }) => {
  const { t } = useTranslation()

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalBox newDocModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalTopHeader">
          <h3>{t('createDocument.newDocModal.title')}</h3>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <p className="newDocQuestion">{t('createDocument.newDocModal.question')}</p>

        <div className="newDocOptions">
          <button
            type="button"
            className="newDocOption"
            onClick={onUseTemplate}
          >
            <FaFileAlt />
            <span>{t('createDocument.newDocModal.useTemplate')}</span>
          </button>
          <button type="button" className="newDocOption" onClick={onUseBlank}>
            <FaMagic />
            <span>{t('createDocument.newDocModal.useBlank')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewDocumentModal
