import { FaClock, FaFileAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const HistoryBar = ({ history, onSelect }) => {
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
        <div className="historyBarList">
          {history.map((h) => (
            <button
              type="button"
              className="historyBarRow"
              key={h.id}
              onClick={() => onSelect(h)}
            >
              <FaFileAlt />
              <span className="historyBarName">{h.fileName}</span>
              <span className="historyBarMeta">{t('informationAllocation.historyBar.blocksCount', { count: h.blocksCount })}</span>
              <span className="historyBarMeta">
                {h.time.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="formatBadge">{h.format}</span>
              <span className="historyBarDetail">{t('informationAllocation.historyBar.detail')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryBar
