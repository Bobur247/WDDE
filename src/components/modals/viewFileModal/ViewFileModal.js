import { useEffect, useState } from 'react'
import { FaTimes, FaDownload, FaFileAlt } from 'react-icons/fa'
import mammoth from 'mammoth'
import * as XLSX from 'xlsx'

function getFileKind(fileName) {
  const name = fileName.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'docx'
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'excel'
  return 'other'
}

const ViewFileModal = ({ record, onClose }) => {
  const fileKind = getFileKind(record.fileName)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [docHtml, setDocHtml] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [excelRows, setExcelRows] = useState(null)

  useEffect(() => {
    if (!record.blob) return // demo yozuv - haqiqiy fayl yo'q

    let objectUrl = ''

    async function loadFile() {
      setLoading(true)
      setError('')
      try {
        if (fileKind === 'pdf') {
          objectUrl = URL.createObjectURL(record.blob)
          setPdfUrl(objectUrl)
        } else if (fileKind === 'docx') {
          const arrayBuffer = await record.blob.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setDocHtml(result.value)
        } else if (fileKind === 'excel') {
          const arrayBuffer = await record.blob.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          setExcelRows(XLSX.utils.sheet_to_json(sheet, { header: 1 }))
        }
      } catch (err) {
        console.error(err)
        setError('Faylni ochishda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadFile()
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [record, fileKind])

  function handleDownload() {
    if (!record.blob) return
    const url = URL.createObjectURL(record.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = record.fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
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

        {!record.blob && (
          <p className="viewFileDemoNote">
            <FaFileAlt /> Bu demo yozuv — original fayl saqlanmagan, shuning
            uchun ichini ko'rsatib bo'lmaydi. Haqiqiy loyihada backend fayl
            saqlagichidan (masalan S3, disk) olib ko'rsatiladi.
          </p>
        )}

        {record.blob && loading && (
          <p className="viewFileLoading">Fayl ochilmoqda...</p>
        )}
        {record.blob && !loading && error && (
          <p className="viewFileError">{error}</p>
        )}

        {record.blob && !loading && !error && fileKind === 'pdf' && pdfUrl && (
          <iframe title="pdf-preview" src={pdfUrl} className="pdfViewerFrame" />
        )}

        {record.blob && !loading && !error && fileKind === 'docx' && (
          <div
            className="docxViewerContent"
            dangerouslySetInnerHTML={{ __html: docHtml }}
          />
        )}

        {record.blob &&
          !loading &&
          !error &&
          fileKind === 'excel' &&
          excelRows && (
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
            <span>Yopish</span>
          </button>
          <button
            type="button"
            className="modalSaveButton"
            onClick={handleDownload}
            disabled={!record.blob}
          >
            <FaDownload />
            <span>Yuklab olish</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewFileModal
