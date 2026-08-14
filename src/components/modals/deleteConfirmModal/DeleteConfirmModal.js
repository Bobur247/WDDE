import { FaTrash, FaTimes } from 'react-icons/fa'
import { Trans, useTranslation } from 'react-i18next'

const DeleteConfirmModal = ({ template, onCancel, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="modalBox deleteConfirmModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deleteConfirmIcon">
          <FaTrash />
        </div>
        <h3>{t('templates.deleteModal.title')}</h3>
        <p>
          <Trans
            i18nKey="templates.deleteModal.confirmText"
            values={{ name: template.name }}
          >
            <b>{{ name: template.name }}</b> shablonini rostdan ham
            o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.
          </Trans>
        </p>
        <div className="modalFooter center">
          <button
            type="button"
            className="modalCancelButton"
            onClick={onCancel}
          >
            <FaTimes />
            <span>{t('templates.deleteModal.cancel')}</span>
          </button>
          <button
            type="button"
            className="modalDeleteButton"
            onClick={onConfirm}
          >
            <FaTrash />
            <span>{t('templates.deleteModal.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
