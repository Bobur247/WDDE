import { FaEye, FaDownload, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const TemplateCards = ({ templates, viewMode, onView, onDeleteRequest }) => {
  const { t } = useTranslation()

  if (templates.length === 0) {
    return (
      <div className="templateCardsEmpty">
        <p>{t('templates.cards.empty')}</p>
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
              title={t('templates.cards.deleteTitle')}
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
                  <span>{t('templates.cards.view')}</span>
                </button>
                <button type="button" className="downloadButton">
                  <FaDownload />
                  <span>{t('templates.cards.download')}</span>
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
