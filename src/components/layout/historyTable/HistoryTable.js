import { useState } from 'react'
import {
  FaFileAlt,
  FaExchangeAlt,
  FaFileSignature,
  FaEllipsisH,
  FaCheckCircle,
  FaExclamationCircle,
  FaDownload,
} from 'react-icons/fa'

const TYPE_ICONS = {
  extraction: { icon: FaFileAlt, tone: 'blue' },
  conversion: { icon: FaExchangeAlt, tone: 'purple' },
  document: { icon: FaFileSignature, tone: 'blue' },
  other: { icon: FaEllipsisH, tone: 'orange' },
}

const HistoryTable = ({ records, onView, onDeleteRequest }) => {
  const [openMenuId, setOpenMenuId] = useState(null)

  // Fayl qanday formatda (word/excel/pdf) yaratilgan/ishlangan bo'lsa,
  // aynan o'sha formatda (record.fileName kengaytmasi + record.blob turi
  // bilan) yuklab beradi — konvertatsiya qilmaydi.
  function handleDownload(record) {
    if (!record.blob) {
      console.warn("Bu yozuv uchun fayl mavjud emas (demo ma'lumot)")
      return
    }
    const url = URL.createObjectURL(record.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = record.fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="historyTableWrapper">
      <table className="historyReportTable">
        <thead>
          <tr>
            <th>№</th>
            <th>Amal turi</th>
            <th>Fayl nomi</th>
            <th>Bajarilgan vaqti</th>
            <th>Holat</th>
            <th>Natija</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={7} className="historyEmptyCell">
                Hech qanday amal topilmadi
              </td>
            </tr>
          )}

          {records.map((r, index) => {
            const typeInfo = TYPE_ICONS[r.type] || TYPE_ICONS.other
            const TypeIcon = typeInfo.icon

            return (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="historyTypeCell">
                    <span className={`historyTypeIcon tone-${typeInfo.tone}`}>
                      <TypeIcon />
                    </span>
                    <span>{r.typeLabel}</span>
                  </div>
                </td>
                <td className="historyFileName">{r.fileName}</td>
                <td className="historyDate">
                  {r.date.toLocaleDateString('uz-UZ')}{' '}
                  {r.date.toLocaleTimeString('uz-UZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  {r.status === 'success' ? (
                    <span className="statusBadge success">
                      <FaCheckCircle /> Muvaffaqiyatli
                    </span>
                  ) : (
                    <span className="statusBadge error">
                      <FaExclamationCircle /> Xatolik
                    </span>
                  )}
                </td>
                <td className="historyResult">{r.result}</td>
                <td>
                  <div className="historyActionsCell">
                    <button
                      type="button"
                      className="historyIconButton"
                      title="Yuklab olish"
                      onClick={() => handleDownload(r)}
                    >
                      <FaDownload />
                    </button>
                    <div className="historyMenuWrapper">
                      <button
                        type="button"
                        className="historyIconButton"
                        onClick={() =>
                          setOpenMenuId(openMenuId === r.id ? null : r.id)
                        }
                      >
                        ...
                      </button>
                      {openMenuId === r.id && (
                        <div className="historyDropdownMenu">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              onView(r)
                            }}
                          >
                            Ko'rish
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => {
                              setOpenMenuId(null)
                              onDeleteRequest(r)
                            }}
                          >
                            O'chirish
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable
