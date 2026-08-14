import { Trans, useTranslation } from 'react-i18next'
import { FaTrash, FaTimes } from 'react-icons/fa'

const DeleteRecordModal = ({ record, onCancel, onConfirm }) => {
  const { t } = useTranslation()
  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="modalBox deleteRecordModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deleteRecordIcon">
          <FaTrash />
        </div>
        <h3>{t('history.deleteModal.title')}</h3>
        <p>
          <Trans
            i18nKey="history.deleteModal.message"
            values={{ fileName: record.fileName }}
            components={{ b: <b /> }}
          />
        </p>
        <div className="modalFooter center">
          <button
            type="button"
            className="modalCancelButton"
            onClick={onCancel}
          >
            <FaTimes />
            <span>{t('history.deleteModal.cancel')}</span>
          </button>
          <button
            type="button"
            className="modalDangerButton"
            onClick={onConfirm}
          >
            <FaTrash />
            <span>{t('history.deleteModal.confirm')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteRecordModal
