import { FaExclamationTriangle } from 'react-icons/fa'

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="modalBox confirmModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirmIcon">
          <FaExclamationTriangle />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modalFooter center">
          <button
            type="button"
            className="modalCancelButton"
            onClick={onCancel}
          >
            <span>Bekor qilish</span>
          </button>
          <button
            type="button"
            className="modalDangerButton"
            onClick={onConfirm}
          >
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
