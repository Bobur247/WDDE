import React, { useState, useRef } from 'react'
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileWord,
  FaExchangeAlt,
  FaCog,
  FaCheckCircle,
  FaDownload,
  FaRedo,
} from 'react-icons/fa'
import '../../../page/convert/Convert.css'
import { CiCircleRemove } from 'react-icons/ci'
import { useTranslation } from 'react-i18next'
import { convertFile, downloadConversionFile } from '../../../api/convert'

const ConvertPdfDocx = () => {
  const { t } = useTranslation()
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
      setError(t('convert.pdfDocx.errorInvalidFormat'))
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

  async function startConversion() {
    if (!file || !direction) return

    setConverting(true)
    setResult(null)
    setProgress(0)
    try {
      setProgress(30)
      const response = await convertFile(file, direction, {
        keep_styling: keepStyling,
        keep_images: keepImages,
        keep_search_index: keepSearchIndex,
        ocr: useOcr,
      })
      const data = response?.data || {}
      setProgress(100)
      setResult({
        name: data.file_name || data.fileName || `${file.name}.converted`,
        outputFormat: (data.format || '').toUpperCase(),
        originalFormat: fileType.toUpperCase(),
        newSizeKb: data.size ? (Number(data.size) / 1024).toFixed(1) : '-',
        conversionId: data.id,
        warning: data.warning,
      })
    } catch (error) {
      const message =
        error.response?.data?.errors?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Konvertatsiya amalga oshmadi.'
      setError(message)
    } finally {
      setConverting(false)
    }
  }

  async function handleDownload() {
    if (!result) return
    try {
      const blob = await downloadConversionFile(result.conversionId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    }
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
          <h3>{t('convert.shared.uploadTitle')}</h3>
        </div>

        {!file ? (
          <div className="dropzone">
            <FaCloudUploadAlt className="dropzoneIcon" />
            <p>{t('convert.shared.dropzoneHint')}</p>
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
              <span>{t('convert.shared.uploadButton')}</span>
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
              <CiCircleRemove className="removeFileActionIcon" />
              <span>{t('convert.shared.removeFile')}</span>
            </div>
          </div>
        )}

        {error && <p className="errorText">{error}</p>}

        <p className="formatsLabel">{t('convert.shared.formatsLabel')}</p>
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
          <h3>{t('convert.shared.directionTitle')}</h3>
        </div>

        <div
          className={`directionCard ${
            direction === 'pdf-to-docx' ? 'active' : ''
          } ${fileType && fileType !== 'pdf' ? 'disabled' : ''}`}
        >
          <FaFilePdf className="directionIcon pdf" />
          <span className="directionArrow">→</span>
          <FaFileWord className="directionIcon docx" />
          <p>{t('convert.pdfDocx.directionPdfToDocx')}</p>
        </div>

        <div
          className={`directionCard ${
            direction === 'docx-to-pdf' ? 'active' : ''
          } ${fileType && fileType !== 'docx' ? 'disabled' : ''}`}
        >
          <FaFileWord className="directionIcon docx" />
          <span className="directionArrow">→</span>
          <FaFilePdf className="directionIcon pdf" />
          <p>{t('convert.pdfDocx.directionDocxToPdf')}</p>
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
              direction !== 'pdf-to-docx' ? 'disabledRow' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={useOcr}
              disabled={direction !== 'pdf-to-docx'}
              onChange={(e) => setUseOcr(e.target.checked)}
            />
            {t('convert.pdfDocx.ocrLabel')}
          </label>
        </div>

        <button
          type="button"
          className="convertButton"
          disabled={!file || converting}
          onClick={startConversion}
        >
          {converting
            ? t('convert.shared.converting')
            : t('convert.shared.convertButton')}
        </button>
      </div>

      {/* 3-USTUN: Natija */}
      <div className="panel">
        <div className="panelHeader">
          <span className="panelIcon">
            <FaFileWord />
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
                <p className="successTitle">
                  {t('convert.shared.successTitle')}
                </p>
                <p className="successSubtitle">
                  {t('convert.shared.successSubtitle')}
                </p>
                {result.warning && (
                  <p className="errorText">{result.warning}</p>
                )}
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

export default ConvertPdfDocx
