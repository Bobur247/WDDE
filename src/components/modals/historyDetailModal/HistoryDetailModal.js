import { FaTimes } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// DIQQAT: haqiqiy loyihada har bir amal (yuklash/ajratish/saqlash)
// alohida vaqt bilan backendda log qilinishi kerak. Bu yerda faqat
// saqlash vaqti haqiqiy — qolgan bosqichlar demo uchun taxminiy
// (saqlashdan bir necha daqiqa oldingi) vaqt bilan ko'rsatilgan.
function buildTimeline(item, t) {
  const saveTime = item.time
  const minus = (mins) => new Date(saveTime.getTime() - mins * 60000)

  return [
    { time: minus(3), text: t('informationAllocation.historyDetailModal.documentUploaded') },
    { time: minus(2), text: t('informationAllocation.historyDetailModal.blocksCreated', { count: item.blocksCount }) },
    { time: minus(1), text: t('informationAllocation.historyDetailModal.dataExtracted') },
    { time: saveTime, text: t('informationAllocation.historyDetailModal.fileSaved', { format: item.format }) },
  ]
}

const HistoryDetailModal = ({ item, onClose }) => {
  const { t } = useTranslation()
  const timeline = buildTimeline(item, t)

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        <div className="modalTopHeader">
          <h3>{item.fileName}</h3>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="timelineList">
          {timeline.map((t, i) => (
            <div className="timelineRow" key={i}>
              <span className="timelineTime">
                {t.time.toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="timelineDash">—</span>
              <span>{t.text}</span>
            </div>
          ))}
        </div>

        <div className="modalFooter">
          <button type="button" className="modalCancelButton" onClick={onClose}>
            <span>{t('informationAllocation.historyDetailModal.close')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HistoryDetailModal
