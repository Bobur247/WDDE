import { FaClock, FaDownload, FaTrash, FaCheckCircle, FaClock as FaClockIcon } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Pagination from '../../ui/pagination/Pagination'

const HistoryBar = ({
  history,
  onSelect,
  onDownload,
  onDeleteRequest,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation()

  return (
    <div className="settingsCard historyBarCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaClock />
        </span>
        <h3>{t('informationAllocation.historyBar.title')}</h3>
      </div>

      {history.length === 0 ? (
        <p className="historyBarEmpty">{t('informationAllocation.historyBar.empty')}</p>
      ) : (
        <>
          <div className="iaHistoryTableWrapper">
            <table className="iaHistoryTable">
              <thead>
                <tr>
                  <th>{t('informationAllocation.historyBar.templateName')}</th>
                  <th>{t('history.table.headers.fileName')}</th>
                  <th>{t('history.table.headers.format')}</th>
                  <th>{t('history.table.headers.date')}</th>
                  <th>{t('informationAllocation.historyBar.statusNotDownloaded')}</th>
                  <th>{t('history.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td className="historyFileName">{h.templateName || '-'}</td>
                    <td className="historyFileName">{h.fileName}</td>
                    <td>
                      <span className="formatBadge">{h.format}</span>
                    </td>
                    <td className="historyDate">
                      {h.time.toLocaleDateString('uz-UZ')}{' '}
                      {h.time.toLocaleTimeString('uz-UZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <span className={`iaHistoryStatusBadge ${h.downloaded ? 'downloaded' : 'notDownloaded'}`}>
                        {h.downloaded ? <FaCheckCircle /> : <FaClockIcon />}
                        {h.downloaded
                          ? t('informationAllocation.historyBar.statusDownloaded')
                          : t('informationAllocation.historyBar.statusNotDownloaded')}
                      </span>
                    </td>
                    <td>
                      <div className="iaHistoryActionsCell">
                        <button
                          type="button"
                          className="iaHistoryIconButton"
                          title={t('informationAllocation.historyBar.download')}
                          onClick={() => onDownload(h)}
                        >
                          <FaDownload />
                        </button>
                        <button
                          type="button"
                          className="iaHistoryIconButton"
                          title={t('informationAllocation.historyBar.detail')}
                          onClick={() => onSelect(h)}
                        >
                          {t('informationAllocation.historyBar.detail')}
                        </button>
                        <div className="iaHistoryMenuWrapper">
                          <button
                            type="button"
                            className="iaHistoryIconButton"
                            onClick={() =>
                              onDeleteRequest(h)
                            }
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  )
}

export default HistoryBar
