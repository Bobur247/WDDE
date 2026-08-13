import { FaClock, FaEye, FaDownload, FaTrash, FaFileWord } from 'react-icons/fa'

const DocumentHistoryTable = ({ history, onDelete }) => {
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
          <h3>Yaratilgan hujjatlar tarixi</h3>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="historyEmpty">
          Hali hech qanday hujjat yaratilmagan. Chapdan shablon tanlab,
          "Hujjatni yaratish" tugmasini bosing.
        </p>
      ) : (
        <table className="historyTable">
          <thead>
            <tr>
              <th>№</th>
              <th>Hujjat nomi</th>
              <th>Shablon</th>
              <th>Yaratilgan sana</th>
              <th>Format</th>
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
                      <span>Ko'rish</span>
                    </button>
                    <button
                      type="button"
                      className="historyActionButton primary"
                      onClick={() => handleDownload(entry)}
                    >
                      <FaDownload />
                      <span>Yuklab olish</span>
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
