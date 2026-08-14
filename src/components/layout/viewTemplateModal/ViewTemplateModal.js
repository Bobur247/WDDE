import { useEffect, useState } from 'react'
import { FaTimes, FaDownload, FaFileAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// Fayl kengaytmasiga qarab qanday ko'rinishda ochilishini aniqlaydi
function getFileKind(file) {
  if (!file) return null
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'excel'
  return 'other'
}

const ViewTemplateModal = ({ template, onClose }) => {
  const { t } = useTranslation()
  const PreviewIcon = template.previewIcon
  const file = template.docxFile // AddTemplateModal'dan kelgan haqiqiy fayl (bo'lishi mumkin yoki yo'q)
  const fileKind = getFileKind(file)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [docHtml, setDocHtml] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [excelRows, setExcelRows] = useState(null)

  useEffect(() => {
    if (!file) return // demo shablon - haqiqiy fayl yo'q

    let objectUrl = ''

    async function loadFile() {
      setLoading(true)
      setError('')
      try {
        if (fileKind === 'pdf') {
          objectUrl = URL.createObjectURL(file)
          setPdfUrl(objectUrl)
        } else if (fileKind === 'docx') {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setDocHtml(result.value)
        } else if (fileKind === 'excel') {
          const arrayBuffer = await file.arrayBuffer()
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
  }, [file, fileKind])

  function handleDownload() {
    if (!file) return
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
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

        {/* Fayl mavjud bo'lmasa (demo shablon) — faqat namuna ko'rsatiladi */}
        {!file && (
          <>
            <div className={`viewTemplatePreview ${template.previewTheme}`}>
              <PreviewIcon className="viewTemplatePreviewIcon" />
              <span className="viewTemplatePreviewTitle">
                {template.previewTitle}
              </span>
            </div>
            <p className="viewTemplateDemoNote">
              <FaFileAlt /> {t('templates.viewModal.demoNote')}
            </p>
          </>
        )}

        {/* Haqiqiy fayl bo'lsa — ichini ochib beramiz */}
        {file && loading && (
          <div className="fileViewerLoading">
            {t('templates.viewModal.loading')}
          </div>
        )}

        {file && !loading && error && (
          <div className="fileViewerError">{error}</div>
        )}

        {file && !loading && !error && fileKind === 'pdf' && pdfUrl && (
          <iframe
            title={t('templates.viewModal.pdfPreviewTitle')}
            src={pdfUrl}
            className="pdfViewerFrame"
          />
        )}

        {file && !loading && !error && fileKind === 'docx' && (
          <div
            className="docxViewerContent"
            dangerouslySetInnerHTML={{ __html: docHtml }}
          />
        )}

        {file && !loading && !error && fileKind === 'excel' && excelRows && (
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

        {file && !loading && !error && fileKind === 'other' && (
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
            disabled={!file}
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
