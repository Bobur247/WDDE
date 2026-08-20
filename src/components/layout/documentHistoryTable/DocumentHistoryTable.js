import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaClock, FaFileWord, FaEye, FaDownload, FaTrash } from 'react-icons/fa'
import { ViewFileModal, DeleteRecordModal } from '../../components'
import { downloadDocumentFile } from '../../../api/documents'

const DocumentHistoryTable = ({ history, onDelete }) => {
  const { t } = useTranslation()
  const [viewingDoc, setViewingDoc] = useState(null)
  const [deletingDoc, setDeletingDoc] = useState(null)

  async function handleDownload(entry) {
    try {
      const blob = await downloadDocumentFile(entry.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = entry.fileName || entry.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Yuklab olishda xatolik:', err)
    }
  }

  async function handleView(entry) {
    try {
      const blob = await downloadDocumentFile(entry.id)
      setViewingDoc({ ...entry, blob })
    } catch (err) {
      console.error('Ko\'rishda xatolik:', err)
    }
  }

  return (
    <div className="documentHistoryTable">
      <div className="historyHeaderRow">
        <div className="historyHeaderLeft">
          <FaClock />
          <h3>{t('createDocument.history.title')}</h3>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="historyEmpty">{t('createDocument.history.empty')}</p>
      ) : (
        <table className="historyTable">
          <thead>
            <tr>
              <th>{t('createDocument.history.columns.number')}</th>
              <th>{t('createDocument.history.columns.documentName')}</th>
              <th>{t('createDocument.history.columns.template')}</th>
              <th>{t('createDocument.history.columns.createdDate')}</th>
              <th>{t('createDocument.history.columns.format')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td className="historyDocName">
                  <FaFileWord />
                  <span>{entry.name}</span>
                </td>
                <td>{entry.templateName}</td>
                <td>{entry.date}</td>
                <td>
                  <span className="formatBadge">{entry.format}</span>
                </td>
                <td>
                  <div className="historyRowActions">
                    <button
                      type="button"
                      className="historyActionButton"
                      onClick={() => handleView(entry)}
                    >
                      <FaEye />
                      <span>{t('createDocument.history.actions.view')}</span>
                    </button>
                    <button
                      type="button"
                      className="historyActionButton primary"
                      onClick={() => handleDownload(entry)}
                    >
                      <FaDownload />
                      <span>{t('createDocument.history.actions.download')}</span>
                    </button>
                    <button
                      type="button"
                      className="historyActionButton danger"
                      onClick={() => setDeletingDoc(entry)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {viewingDoc && (
        <ViewFileModal
          record={viewingDoc}
          onClose={() => setViewingDoc(null)}
          fullScreen
        />
      )}

      {deletingDoc && (
        <DeleteRecordModal
          record={deletingDoc}
          onCancel={() => setDeletingDoc(null)}
          onConfirm={() => {
            onDelete(deletingDoc.id)
            setDeletingDoc(null)
          }}
        />
      )}
    </div>
  )
}

export default DocumentHistoryTable
