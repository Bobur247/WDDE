import { useEffect, useState } from 'react'
import { FaEye, FaDownload, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import {
  fetchTemplateImageBlob,
  fetchTemplateFileBlob,
} from '../../../api/templates'

function TemplatePreview({ template, PreviewIcon }) {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    let url = ''
    if (template.has_preview_image) {
      fetchTemplateImageBlob(template.id)
        .then((blob) => {
          url = URL.createObjectURL(blob)
          setImageUrl(url)
        })
        .catch(() => setImageUrl(''))
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [template.id, template.has_preview_image])

  if (imageUrl)
    return (
      <img
        src={imageUrl}
        alt={template.name}
        className="templatePreviewImage"
      />
    )
  return <PreviewIcon className="templatePreviewIcon" />
}

const TemplateCards = ({
  templates,
  viewMode,
  onView,
  onDeleteRequest,
  onError,
}) => {
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
              <TemplatePreview template={tpl} PreviewIcon={PreviewIcon} />
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
                <button
                  type="button"
                  className="downloadButton"
                  onClick={async () => {
                    try {
                      const blob = await fetchTemplateFileBlob(tpl.id)
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = tpl.fileName
                      link.click()
                      URL.revokeObjectURL(url)
                    } catch (error) {
                      onError(error.message || "Faylni yuklab bo'lmaydi")
                    }
                  }}
                >
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
