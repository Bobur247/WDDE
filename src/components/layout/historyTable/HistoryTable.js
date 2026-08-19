import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FaFileAlt,
  FaExchangeAlt,
  FaFileSignature,
  FaEllipsisH,
  FaCheckCircle,
  FaExclamationCircle,
  FaDownload,
} from 'react-icons/fa'
import { downloadHistoryFile } from '../../../api/history'

const TYPE_ICONS = {
  extraction: { icon: FaFileAlt, tone: 'blue' },
  conversion: { icon: FaExchangeAlt, tone: 'purple' },
  document: { icon: FaFileSignature, tone: 'blue' },
  other: { icon: FaEllipsisH, tone: 'orange' },
}

const HistoryTable = ({ records, onView, onDeleteRequest }) => {
  const { t } = useTranslation()
  const [openMenuId, setOpenMenuId] = useState(null)

  // Fayl qanday formatda (word/excel/pdf) yaratilgan/ishlangan bo'lsa,
  // aynan o'sha formatda (record.fileName kengaytmasi + record.blob turi
  // bilan) yuklab beradi — konvertatsiya qilmaydi.
  async function handleDownload(record) {
    try {
      const blob = record.blob || (await downloadHistoryFile(record.id))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = record.fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Faylni yuklab olishda xatolik:', err)
    }
  }

  return (
    <div className="historyTableWrapper">
      <table className="historyReportTable">
        <thead>
          <tr>
            <th>{t('history.table.headers.index')}</th>
            <th>{t('history.table.headers.type')}</th>
            <th>{t('history.table.headers.fileName')}</th>
            <th>{t('history.table.headers.date')}</th>
            <th>{t('history.table.headers.status')}</th>
            <th>{t('history.table.headers.result')}</th>
            <th>{t('history.table.headers.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && (
            <tr>
              <td colSpan={7} className="historyEmptyCell">
                {t('history.table.empty')}
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
                      <FaCheckCircle /> {t('history.status.success')}
                    </span>
                  ) : (
                    <span className="statusBadge error">
                      <FaExclamationCircle /> {t('history.status.error')}
                    </span>
                  )}
                </td>
                <td className="historyResult">{r.result}</td>
                <td>
                  <div className="historyActionsCell">
                    <button
                      type="button"
                      className="historyIconButton"
                      title={t('history.table.download')}
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
                            {t('history.table.view')}
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => {
                              setOpenMenuId(null)
                              onDeleteRequest(r)
                            }}
                          >
                            {t('history.table.delete')}
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
