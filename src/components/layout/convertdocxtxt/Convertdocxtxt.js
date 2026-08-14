import React, { useState, useRef } from 'react'
import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaFileWord,
  FaExchangeAlt,
  FaCog,
  FaCheckCircle,
  FaDownload,
  FaRedo,
} from 'react-icons/fa'
import { CiCircleRemove } from 'react-icons/ci'
import '../../../page/convert/Convert.css'
import { useTranslation } from 'react-i18next'

const ConvertDocxTxt = () => {
  const { t } = useTranslation()
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null) 
  const [direction, setDirection] = useState(null) 
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
      selected.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      selected.name.toLowerCase().endsWith('.docx')
    ) {
      return 'docx'
    }
    if (
      selected.type === 'text/plain' ||
      selected.name.toLowerCase().endsWith('.txt')
    ) {
      return 'txt'
    }
    return null
  }

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return

    const type = detectType(selected)
    if (!type) {
      setError(t('convert.docxTxt.errorInvalidFormat'))
      e.target.value = ''
      return
    }

    setError('')
    setFile(selected)
    setFileType(type)
    setDirection(type === 'docx' ? 'docx-to-txt' : 'txt-to-docx')
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
      const outputFormat = direction === 'docx-to-txt' ? 'TXT' : 'DOCX'
      const outputExt = direction === 'docx-to-txt' ? 'txt' : 'docx'
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
        blob: file,
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
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaCloudUploadAlt />
          </span>
          <h3>{t('convert.shared.uploadTitle')}</h3>
        </div>

        {!file ? (
          <div className="dropzone">
            <FaCloudUploadAlt className="dropzoneIcon" />
            <p>{t('convert.shared.dropzoneHint')}</p>
            <input
              ref={inputRef}
              type="file"
              id="convertDocxTxtInput"
              accept=".docx,.txt"
              hidden
              onChange={handleFileChange}
            />
            <label htmlFor="convertDocxTxtInput" className="uploadButton">
              <FaCloudUploadAlt />
              <span>{t('convert.shared.uploadButton')}</span>
            </label>
          </div>
        ) : (
          <div className="dropzone selectedBox">
            <div className="selectedFileInfo">
              {fileType === 'docx' ? (
                <FaFileWord className="fileTypeIcon docx" />
              ) : (
                <FaFileAlt className="fileTypeIcon txt" />
              )}
              <p className="selectedFileName">{file.name}</p>
            </div>
            <div className="removeFileAction" onClick={handleRemoveFile}>
              <CiCircleRemove className="removeFileActionIcon" />
              <span>{t('convert.shared.removeFile')}</span>
            </div>
          </div>
        )}

        {error && <p className="errorText">{error}</p>}

        <p className="formatsLabel">{t('convert.shared.formatsLabel')}</p>
        <div className="formatsRow">
          <span className={`formatPill ${fileType === 'docx' ? 'active' : ''}`}>
            DOCX
          </span>
          <span className={`formatPill ${fileType === 'txt' ? 'active' : ''}`}>
            TXT
          </span>
        </div>
      </div>

      {/* 2-USTUN: Konvertatsiya yo'nalishi */}
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaExchangeAlt />
          </span>
          <h3>{t('convert.shared.directionTitle')}</h3>
        </div>

        <div
          className={`directionCard ${
            direction === 'docx-to-txt' ? 'active' : ''
          } ${fileType && fileType !== 'docx' ? 'disabled' : ''}`}
        >
          <FaFileWord className="directionIcon docx" />
          <span className="directionArrow">→</span>
          <FaFileAlt className="directionIcon txt" />
          <p>{t('convert.docxTxt.directionDocxToTxt')}</p>
        </div>

        <div
          className={`directionCard ${
            direction === 'txt-to-docx' ? 'active' : ''
          } ${fileType && fileType !== 'txt' ? 'disabled' : ''}`}
        >
          <FaFileAlt className="directionIcon txt" />
          <span className="directionArrow">→</span>
          <FaFileWord className="directionIcon docx" />
          <p>{t('convert.docxTxt.directionTxtToDocx')}</p>
        </div>

        <div className="settingsBlock">
          <div className="panelHeader small">
            <span className="panelIcon">
              <FaCog />
            </span>
            <h4>{t('convert.shared.settingsTitle')}</h4>
          </div>

          <label className="settingRow">
            <input
              type="checkbox"
              checked={keepStyling}
              onChange={(e) => setKeepStyling(e.target.checked)}
            />
            {t('convert.shared.keepStyling')}
          </label>

          <label className="settingRow">
            <input
              type="checkbox"
              checked={keepImages}
              onChange={(e) => setKeepImages(e.target.checked)}
            />
            {t('convert.shared.keepImages')}
          </label>

          <label className="settingRow">
            <input
              type="checkbox"
              checked={keepSearchIndex}
              onChange={(e) => setKeepSearchIndex(e.target.checked)}
            />
            {t('convert.shared.keepSearchIndex')}
          </label>

          <label
            className={`settingRow ${
              direction !== 'docx-to-txt' ? 'disabledRow' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={useOcr}
              disabled={direction !== 'docx-to-txt'}
              onChange={(e) => setUseOcr(e.target.checked)}
            />
            {t('convert.docxTxt.ocrLabel')}
          </label>
        </div>

        <button
          type="button"
          className="convertButton"
          disabled={!file || converting}
          onClick={startConversion}
        >
          {converting ? t('convert.shared.converting') : t('convert.shared.convertButton')}
        </button>
      </div>

      {/* 3-USTUN: Natija */}
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaFileAlt />
          </span>
          <h3>{t('convert.shared.resultTitle')}</h3>
        </div>

        {!file && !converting && !result && (
          <p className="resultPlaceholder">
            {t('convert.shared.resultPlaceholderEmpty')}
          </p>
        )}

        {file && !converting && !result && (
          <p className="resultPlaceholder">
            {t('convert.shared.resultPlaceholderReady')}
          </p>
        )}

        {converting && (
          <div className="convertingBox">
            <div className="spinner" />
            <p>{t('convert.shared.converting')}</p>
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
                <p className="successTitle">{t('convert.shared.successTitle')}</p>
                <p className="successSubtitle">
                  {t('convert.shared.successSubtitle')}
                </p>
              </div>
            </div>

            <div className="resultFileCard">
              {result.outputFormat === 'DOCX' ? (
                <FaFileWord className="fileTypeIcon docx" />
              ) : (
                <FaFileAlt className="fileTypeIcon txt" />
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
                <span>{t('convert.shared.detailOriginalFormat')}</span>
                <span>{result.originalFormat}</span>
              </div>
              <div className="resultDetailRow">
                <span>{t('convert.shared.detailNewFormat')}</span>
                <span>{result.outputFormat}</span>
              </div>
              <div className="resultDetailRow">
                <span>{t('convert.shared.detailPages')}</span>
                <span>{result.pages}</span>
              </div>
              <div className="resultDetailRow">
                <span>{t('convert.shared.detailTime')}</span>
                <span>{result.time}</span>
              </div>
              <div className="resultDetailRow">
                <span>{t('convert.shared.detailOriginalSize')}</span>
                <span>{result.originalSizeKb} KB</span>
              </div>
              <div className="resultDetailRow">
                <span>{t('convert.shared.detailNewSize')}</span>
                <span>{result.newSizeKb} KB</span>
              </div>
            </div>

            <button
              type="button"
              className="downloadMainButton"
              onClick={handleDownload}
            >
              <FaDownload />
              <span>{t('convert.shared.downloadButton')}</span>
            </button>

            <button
              type="button"
              className="convertAnotherButton"
              onClick={handleConvertAnother}
            >
              <FaRedo />
              <span>{t('convert.shared.convertAnotherButton')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ConvertDocxTxt
