import { useTranslation } from 'react-i18next'
import {
  FaClock,
  FaFileAlt,
  FaExchangeAlt,
  FaFileSignature,
  FaEllipsisH,
} from 'react-icons/fa'

const TYPE_ICONS = {
  extraction: { icon: FaFileAlt, tone: 'blue' },
  conversion: { icon: FaExchangeAlt, tone: 'purple' },
  document: { icon: FaFileSignature, tone: 'blue' },
  other: { icon: FaEllipsisH, tone: 'orange' },
}

const RecentActivity = ({ records, onView }) => {
  const { t } = useTranslation()
  return (
    <div className="recentActivityCard">
      <div className="settingsCardHeaderLike">
        <span className="cardHeaderIcon">
          <FaClock />
        </span>
        <h3>{t('history.recentActivity.title')}</h3>
      </div>

      <div className="recentActivityList">
        {records.length === 0 && (
          <p className="recentActivityEmpty">
            {t('history.recentActivity.empty')}
          </p>
        )}

        {records.map((r) => {
          const typeInfo = TYPE_ICONS[r.type] || TYPE_ICONS.other
          const TypeIcon = typeInfo.icon
          return (
            <button
              type="button"
              className="recentActivityRow"
              key={r.id}
              onClick={() => onView(r)}
            >
              <span className={`historyTypeIcon tone-${typeInfo.tone}`}>
                <TypeIcon />
              </span>
              <span className="recentActivityFile">{r.fileName}</span>
              <span className="recentActivityType">{r.typeLabel}</span>
              <span className="recentActivityTime">
                {r.date.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
