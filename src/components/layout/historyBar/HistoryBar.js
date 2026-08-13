import { FaClock, FaFileAlt } from 'react-icons/fa'

const HistoryBar = ({ history, onSelect }) => {
  return (
    <div className="settingsCard historyBarCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaClock />
        </span>
        <h3>Bajarilgan amallar (History)</h3>
      </div>

      {history.length === 0 ? (
        <p className="historyBarEmpty">Hali hech qanday fayl saqlanmagan</p>
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
              <span className="historyBarMeta">{h.blocksCount} ta block</span>
              <span className="historyBarMeta">
                {h.time.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="formatBadge">{h.format}</span>
              <span className="historyBarDetail">Batafsil →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryBar
