import { FaTrash, FaTimes } from 'react-icons/fa'

const DeleteRecordModal = ({ record, onCancel, onConfirm }) => {
  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="modalBox deleteRecordModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deleteRecordIcon">
          <FaTrash />
        </div>
        <h3>Yozuvni o'chirish</h3>
        <p>
          <b>{record.fileName}</b> tarixdan o'chirilsinmi? Bu amalni ortga
          qaytarib bo'lmaydi.
        </p>
        <div className="modalFooter center">
          <button
            type="button"
            className="modalCancelButton"
            onClick={onCancel}
          >
            <FaTimes />
            <span>Bekor qilish</span>
          </button>
          <button
            type="button"
            className="modalDangerButton"
            onClick={onConfirm}
          >
            <FaTrash />
            <span>O'chirish</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteRecordModal
