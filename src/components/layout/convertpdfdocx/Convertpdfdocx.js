import React, { useState, useRef } from 'react'
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileWord,
  FaTimesCircle,
  FaExchangeAlt,
  FaCog,
  FaCheckCircle,
  FaDownload,
  FaRedo,
} from 'react-icons/fa'
import '../../../page/convert/Convert.css'

const ConvertPdfDocx = () => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null) // 'pdf' | 'docx'
  const [direction, setDirection] = useState(null) // 'pdf-to-docx' | 'docx-to-pdf'
  const [error, setError] = useState('')

  const [keepStyling, setKeepStyling] = useState(true)
  const [keepImages, setKeepImages] = useState(true)
  const [keepSearchIndex, setKeepSearchIndex] = useState(false)
  const [useOcr, setUseOcr] = useState(false)

  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const inputRef = useRef(null)
  const progressTimer = useRef(null)

  function detectType(selected) {
    if (
      selected.type === 'application/pdf' ||
      selected.name.toLowerCase().endsWith('.pdf')
    ) {
      return 'pdf'
    }
    if (
      selected.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      selected.name.toLowerCase().endsWith('.docx')
    ) {
      return 'docx'
    }
    return null
  }

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return

    const type = detectType(selected)
    if (!type) {
      setError('Faqat PDF yoki DOCX formatidagi fayl yuklash mumkin!')
      e.target.value = ''
      return
    }

    setError('')
    setFile(selected)
    setFileType(type)
    // Fayl turiga qarab yo'nalish avtomatik tanlanadi
    setDirection(type === 'pdf' ? 'pdf-to-docx' : 'docx-to-pdf')
    setResult(null)
    setProgress(0)
  }

  function handleRemoveFile() {
    setFile(null)
    setFileType(null)
    setDirection(null)
    setResult(null)
    setProgress(0)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  // MUHIM: bu yerda haqiqiy konvertatsiya albatta backend (server) orqali
  // bajarilishi kerak (masalan LibreOffice/Aspose kabi xizmat bilan).
  // Hozircha jarayon va natija DEMO sifatida simulyatsiya qilingan —
  // haqiqiy loyihada startConversion ichini o'z API chaqiruvingiz bilan
  // almashtiring.
  function startConversion() {
    if (!file || !direction) return

    setConverting(true)
    setResult(null)
    setProgress(0)

    const startedAt = Date.now()

    progressTimer.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 18
        return next >= 96 ? 96 : next
      })
    }, 220)

    setTimeout(() => {
      clearInterval(progressTimer.current)
      setProgress(100)

      const seconds = ((Date.now() - startedAt) / 1000).toFixed(2)
      const outputFormat = direction === 'pdf-to-docx' ? 'DOCX' : 'PDF'
      const outputExt = direction === 'pdf-to-docx' ? 'docx' : 'pdf'
      const baseName = file.name.replace(/\.[^/.]+$/, '')
      const originalSizeKb = (file.size / 1024).toFixed(1)
      const newSizeKb = (
        (file.size * (0.85 + Math.random() * 0.3)) /
        1024
      ).toFixed(1)

      setResult({
        name: `${baseName}.${outputExt}`,
        outputFormat,
        originalFormat: fileType.toUpperCase(),
        pages: Math.floor(Math.random() * 20) + 1,
        time: `${seconds}s`,
        originalSizeKb,
        newSizeKb,
        blob: file, // DEMO: haqiqiy loyihada bu yerga konvertatsiya qilingan fayl keladi
      })

      setConverting(false)
    }, 1800)
  }

  function handleDownload() {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function handleConvertAnother() {
    handleRemoveFile()
  }

  return (
    <div className="ConvertGrid">
      {/* 1-USTUN: Fayl yuklash */}
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaCloudUploadAlt />
          </span>
          <h3>Fayl yuklash</h3>
        </div>

        {!file ? (
          <div className="dropzone">
            <FaCloudUploadAlt className="dropzoneIcon" />
            <p>Faylni shu yerga tashlang yoki tanlang</p>
            <input
              ref={inputRef}
              type="file"
              id="convertFileInput"
              accept=".pdf,.docx"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="convertFileInput" className="uploadButton">
              <FaCloudUploadAlt />
              <span>Fayl tanlash</span>
            </label>
          </div>
        ) : (
          <div className="dropzone selectedBox">
            <div className="selectedFileInfo">
              {fileType === 'pdf' ? (
                <FaFilePdf className="fileTypeIcon pdf" />
              ) : (
                <FaFileWord className="fileTypeIcon docx" />
              )}
              <p className="selectedFileName">{file.name}</p>
            </div>
            <div className="removeFileAction" onClick={handleRemoveFile}>
              <FaTimesCircle />
              <span>Bekor qilish</span>
            </div>
          </div>
        )}

        {error && <p className="errorText">{error}</p>}

        <p className="formatsLabel">Qo'llab-quvvatlanadigan formatlar:</p>
        <div className="formatsRow">
          <span className={`formatPill ${fileType === 'pdf' ? 'active' : ''}`}>
            PDF
          </span>
          <span className={`formatPill ${fileType === 'docx' ? 'active' : ''}`}>
            DOCX
          </span>
        </div>
      </div>

      {/* 2-USTUN: Konvertatsiya yo'nalishi */}
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaExchangeAlt />
          </span>
          <h3>Konvertatsiya yo'nalishi</h3>
        </div>

        <div
          className={`directionCard ${
            direction === 'pdf-to-docx' ? 'active' : ''
          } ${fileType && fileType !== 'pdf' ? 'disabled' : ''}`}
        >
          <FaFilePdf className="directionIcon pdf" />
          <span className="directionArrow">→</span>
          <FaFileWord className="directionIcon docx" />
          <p>PDF dan DOCX ga</p>
        </div>

        <div
          className={`directionCard ${
            direction === 'docx-to-pdf' ? 'active' : ''
          } ${fileType && fileType !== 'docx' ? 'disabled' : ''}`}
        >
          <FaFileWord className="directionIcon docx" />
          <span className="directionArrow">→</span>
          <FaFilePdf className="directionIcon pdf" />
          <p>DOCX dan PDF ga</p>
        </div>

        <div className="settingsBlock">
          <div className="panelHeader small">
            <span className="panelIcon">
              <FaCog />
            </span>
            <h4>Qo'shimcha sozlamalar</h4>
          </div>

          <label className="settingRow">
            <input
              type="checkbox"
              checked={keepStyling}
              onChange={(e) => setKeepStyling(e.target.checked)}
            />
            Formatni saqlash (original styling)
          </label>

          <label className="settingRow">
            <input
              type="checkbox"
              checked={keepImages}
              onChange={(e) => setKeepImages(e.target.checked)}
            />
            Rasmlarni saqlash
          </label>

          <label className="settingRow">
            <input
              type="checkbox"
              checked={keepSearchIndex}
              onChange={(e) => setKeepSearchIndex(e.target.checked)}
            />
            Sahifa qidiruvini saqlash
          </label>

          <label
            className={`settingRow ${
              direction !== 'pdf-to-docx' ? 'disabledRow' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={useOcr}
              disabled={direction !== 'pdf-to-docx'}
              onChange={(e) => setUseOcr(e.target.checked)}
            />
            OCR (skanerlangan PDF uchun)
          </label>
        </div>

        <button
          type="button"
          className="convertButton"
          disabled={!file || converting}
          onClick={startConversion}
        >
          {converting ? 'Konvertatsiya qilinmoqda...' : 'Konvertatsiya qilish'}
        </button>
      </div>

      {/* 3-USTUN: Natija */}
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaFileWord />
          </span>
          <h3>Natija</h3>
        </div>

        {!file && !converting && !result && (
          <p className="resultPlaceholder">
            Fayl yuklab, konvertatsiya qilingandan so'ng natija shu yerda
            ko'rinadi
          </p>
        )}

        {file && !converting && !result && (
          <p className="resultPlaceholder">
            "Konvertatsiya qilish" tugmasini bosing
          </p>
        )}

        {converting && (
          <div className="convertingBox">
            <div className="spinner" />
            <p>Konvertatsiya qilinmoqda...</p>
            <div className="progressBarOuter">
              <div
                className="progressBarInner"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="progressPercent">{Math.round(progress)}%</p>
          </div>
        )}

        {!converting && result && (
          <>
            <div className="successBanner">
              <FaCheckCircle className="successIcon" />
              <div>
                <p className="successTitle">Konvertatsiya tayyor!</p>
                <p className="successSubtitle">
                  Fayl muvaffaqiyatli konvertatsiya qilindi.
                </p>
              </div>
            </div>

            <div className="resultFileCard">
              {result.outputFormat === 'DOCX' ? (
                <FaFileWord className="fileTypeIcon docx" />
              ) : (
                <FaFilePdf className="fileTypeIcon pdf" />
              )}
              <div className="resultFileInfo">
                <p className="resultFileName">{result.name}</p>
                <p className="resultFileSize">{result.newSizeKb} KB</p>
              </div>
              <button
                type="button"
                className="iconDownloadButton"
                onClick={handleDownload}
              >
                <FaDownload />
              </button>
            </div>

            <div className="resultDetails">
              <div className="resultDetailRow">
                <span>Asl format:</span>
                <span>{result.originalFormat}</span>
              </div>
              <div className="resultDetailRow">
                <span>Yangi format:</span>
                <span>{result.outputFormat}</span>
              </div>
              <div className="resultDetailRow">
                <span>Sahifalar:</span>
                <span>{result.pages}</span>
              </div>
              <div className="resultDetailRow">
                <span>Vaqt:</span>
                <span>{result.time}</span>
              </div>
              <div className="resultDetailRow">
                <span>Oldingi hajm:</span>
                <span>{result.originalSizeKb} KB</span>
              </div>
              <div className="resultDetailRow">
                <span>Yangi hajm:</span>
                <span>{result.newSizeKb} KB</span>
              </div>
            </div>

            <button
              type="button"
              className="downloadMainButton"
              onClick={handleDownload}
            >
              <FaDownload />
              <span>Yuklab olish</span>
            </button>

            <button
              type="button"
              className="convertAnotherButton"
              onClick={handleConvertAnother}
            >
              <FaRedo />
              <span>Boshqa formatga ham konvertatsiya</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConvertPdfDocx
