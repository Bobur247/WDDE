import { useTranslation } from 'react-i18next'
import { FaClock, FaEye, FaDownload, FaTrash, FaFileWord } from 'react-icons/fa'

const DocumentHistoryTable = ({ history, onDelete }) => {
  const { t } = useTranslation()

  function handleDownload(entry) {
    if (!entry.blob) return
    const url = URL.createObjectURL(entry.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = entry.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
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
                      onClick={() =>
                        entry.blob &&
                        window.open(URL.createObjectURL(entry.blob))
                      }
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
                      onClick={() => onDelete(entry.id)}
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
    </div>
  )
}

export default DocumentHistoryTable
