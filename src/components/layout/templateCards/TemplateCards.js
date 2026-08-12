import { FaEye, FaDownload, FaTrash } from 'react-icons/fa'

const TemplateCards = ({ templates, viewMode, onView, onDeleteRequest }) => {
  if (templates.length === 0) {
    return (
      <div className="templateCardsEmpty">
        <p>Hech qanday shablon topilmadi</p>
      </div>
    )
  }

  return (
    <div className={`templateCards ${viewMode}`}>
      {templates.map((tpl) => {
        const PreviewIcon = tpl.previewIcon
        return (
          <div key={tpl.id} className="templateCard">
            <button
              type="button"
              className="deleteIconButton"
              title="O'chirish"
              onClick={() => onDeleteRequest(tpl)}
            >
              <FaTrash />
            </button>

            <div className={`templatePreview ${tpl.previewTheme}`}>
              <PreviewIcon className="templatePreviewIcon" />
              <span className="templatePreviewTitle">{tpl.previewTitle}</span>
            </div>

            <div className="templateCardBody">
              <div className="templateCardTitleRow">
                <h4>{tpl.name}</h4>
                <span className={`categoryBadge ${tpl.badgeColor}`}>
                  {tpl.categoryLabel}
                </span>
              </div>
              <p className="templateCardDescription">{tpl.description}</p>

              <div className="templateCardActions">
                <button
                  type="button"
                  className="viewButton"
                  onClick={() => onView(tpl)}
                >
                  <FaEye />
                  <span>Ko'rish</span>
                </button>
                <button type="button" className="downloadButton">
                  <FaDownload />
                  <span>Yuklab olish</span>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TemplateCards
