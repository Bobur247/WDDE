import { FaTrash, FaTimes } from 'react-icons/fa'

const DeleteConfirmModal = ({ template, onCancel, onConfirm }) => {
  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="modalBox deleteConfirmModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deleteConfirmIcon">
          <FaTrash />
        </div>
        <h3>Shablonni o'chirish</h3>
        <p>
          <b>{template.name}</b> shablonini rostdan ham o'chirmoqchimisiz? Bu
          amalni orqaga qaytarib bo'lmaydi.
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
            className="modalDeleteButton"
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

export default DeleteConfirmModal
