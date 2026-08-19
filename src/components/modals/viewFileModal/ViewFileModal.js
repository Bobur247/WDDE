import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaTimes, FaDownload, FaFileAlt } from 'react-icons/fa'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'
import { downloadHistoryFile } from '../../../api/history'

function getFileKind(fileName) {
  const name = fileName.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'excel'
  return 'other'
}

const ViewFileModal = ({ record, onClose }) => {
  const { t } = useTranslation()
  const fileKind = getFileKind(record.fileName)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [docHtml, setDocHtml] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [excelRows, setExcelRows] = useState(null)

  useEffect(() => {
    let objectUrl = ''

    async function loadFile() {
      setLoading(true)
      setError('')
      try {
        const fileBlob = record.blob || (await downloadHistoryFile(record.id))
        if (fileKind === 'pdf') {
          objectUrl = URL.createObjectURL(fileBlob)
          setPdfUrl(objectUrl)
        } else if (fileKind === 'docx') {
          const arrayBuffer = await fileBlob.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setDocHtml(result.value)
        } else if (fileKind === 'excel') {
          const arrayBuffer = await fileBlob.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          setExcelRows(XLSX.utils.sheet_to_json(sheet, { header: 1 }))
        }
      } catch (err) {
        console.error(err)
        setError(t('history.viewModal.error'))
      } finally {
        setLoading(false)
      }
    }

    loadFile()
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [record, fileKind, t])

  function handleDownload() {
    downloadHistoryFile(record.id)
      .then((blob) => {
        const url = URL.createObjectURL(record.blob || blob)
        const a = document.createElement('a')
        a.href = url
        a.download = record.fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      })
      .catch((err) => setError(err.message))
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalBox viewFileModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalTopHeader">
          <div>
            <h3>{record.fileName}</h3>
            <p className="viewFileModalSubtitle">
              {record.typeLabel} · {record.date.toLocaleString('uz-UZ')}
            </p>
          </div>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {!record.blob && !loading && !error && (
          <p className="viewFileDemoNote">
            <FaFileAlt /> Arxivdagi fayl serverdan yuklanmoqda.
          </p>
        )}

        {loading && (
          <p className="viewFileLoading">{t('history.viewModal.loading')}</p>
        )}
        {!loading && error && <p className="viewFileError">{error}</p>}

        {!loading && !error && fileKind === 'pdf' && pdfUrl && (
          <iframe title="pdf-preview" src={pdfUrl} className="pdfViewerFrame" />
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

        <div className="modalFooter">
          <button type="button" className="modalCancelButton" onClick={onClose}>
            <span>{t('history.viewModal.close')}</span>
          </button>
          <button
            type="button"
            className="modalSaveButton"
            onClick={handleDownload}
            disabled={loading}
          >
            <FaDownload />
            <span>{t('history.viewModal.download')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewFileModal
