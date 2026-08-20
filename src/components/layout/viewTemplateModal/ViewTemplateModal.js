import { useEffect, useState } from 'react'
import { FaTimes, FaDownload } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import { fetchTemplateFileBlob } from '../../../api/templates'

// Fayl kengaytmasiga qarab qanday ko'rinishda ochilishini aniqlaydi
const ViewTemplateModal = ({ template, onClose }) => {
  const { t } = useTranslation()
  const PreviewIcon = template.previewIcon
  const fileKind =
    template.file_format === 'xlsx' || template.file_format === 'xls'
      ? 'excel'
      : template.file_format === 'pdf'
        ? 'pdf'
        : 'docx'
  const fileName =
    template.fileName || `${template.name}.${template.file_format}`

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [docHtml, setDocHtml] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [excelRows, setExcelRows] = useState(null)
  const [fileBlob, setFileBlob] = useState(null)

  useEffect(() => {
    let objectUrl = ''

    async function loadFile() {
      setLoading(true)
      setError('')
      try {
        const blob = await fetchTemplateFileBlob(template.id)
        setFileBlob(blob)
        if (fileKind === 'pdf') {
          objectUrl = URL.createObjectURL(blob)
          setPdfUrl(objectUrl)
        } else if (fileKind === 'docx') {
          const arrayBuffer = await blob.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setDocHtml(result.value)
        } else if (fileKind === 'excel') {
          const arrayBuffer = await blob.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[firstSheetName]
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
          setExcelRows(rows)
        }
      } catch (err) {
        console.error(err)
        setError(t('templates.viewModal.fileError'))
      } finally {
        setLoading(false)
      }
    }

    loadFile()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id, fileKind])

  function handleDownload() {
    if (!fileBlob) return
    const url = URL.createObjectURL(fileBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalBox viewTemplateModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalTopHeader">
          <div className="modalTopHeaderLeft">
            <span className="modalHeaderIcon">
              <PreviewIcon />
            </span>
            <div>
              <h3>{template.name}</h3>
              <p>
                {template.categoryLabel} · {template.language}
              </p>
            </div>
          </div>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading && (
          <div className="fileViewerLoading">
            {t('templates.viewModal.loading')}
          </div>
        )}

        {!loading && error && <div className="fileViewerError">{error}</div>}

        {!loading && !error && fileKind === 'pdf' && pdfUrl && (
          <iframe
            title={t('templates.viewModal.pdfPreviewTitle')}
            src={pdfUrl}
            className="pdfViewerFrame"
          />
        )}

        {!loading && !error && fileKind === 'docx' && (
          <div
            className="docxViewerContent"
            dangerouslySetInnerHTML={{ __html: docHtml }}
          />
        )}

        {!loading && !error && fileKind === 'excel' && excelRows && (
          <div className="excelViewerWrapper">
            <table className="excelViewerTable">
              <tbody>
                {excelRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && fileKind === 'other' && (
          <p className="viewTemplateDemoNote">
            {t('templates.viewModal.unsupportedFile')}
          </p>
        )}

        {template.description && (
          <p className="viewTemplateDescription">{template.description}</p>
        )}

        <div className="modalFooter">
          <button type="button" className="modalCancelButton" onClick={onClose}>
            <span>{t('templates.viewModal.close')}</span>
          </button>
          <button
            type="button"
            className="modalSaveButton"
            onClick={handleDownload}
            disabled={!fileBlob || loading}
          >
            <FaDownload />
            <span>{t('templates.viewModal.download')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewTemplateModal
