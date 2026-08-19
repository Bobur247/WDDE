import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FaCog,
  FaImage,
  FaFolderOpen,
  FaFileAlt,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaTimes,
} from 'react-icons/fa'
import mammoth from 'mammoth'
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx'

const PAGE_SIZES = ['A4', 'A5', 'A3', 'Letter', 'Legal']
const PAGE_NUM_POSITION_KEYS = [
  { value: 'bottom-right', labelKey: 'bottomRight' },
  { value: 'bottom-center', labelKey: 'bottomCenter' },
  { value: 'bottom-left', labelKey: 'bottomLeft' },
  { value: 'top-right', labelKey: 'topRight' },
  { value: 'top-center', labelKey: 'topCenter' },
  { value: 'top-left', labelKey: 'topLeft' },
]

const AdditionalSettingsPanel = ({
  logoFile,
  setLogoFile,
  headerOn,
  setHeaderOn,
  footerOn,
  setFooterOn,
  pageNumOn,
  setPageNumOn,
  headerOrgName,
  setHeaderOrgName,
  headerPhone,
  setHeaderPhone,
  footerText,
  setFooterText,
  pageNumPosition,
  setPageNumPosition,
  pageSize,
  setPageSize,
  orientation,
  setOrientation,
  outputFormat,
  setOutputFormat,
  pdfQuality,
  setPdfQuality,
  documentName,
  selectedTemplate,
  fieldValues,
  generatedResult,
  onGenerated,
}) => {
  const { t } = useTranslation()
  const [generating, setGenerating] = useState(false)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('')

  const [viewingDoc, setViewingDoc] = useState(false)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewHtml, setViewHtml] = useState('')
  const [viewError, setViewError] = useState('')

  // Logo uchun object URL ni faqat fayl o'zgarganda yaratamiz va
  // eskisini tozalaymiz (memory leak bo'lmasligi uchun)
  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(logoFile)
    setLogoPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [logoFile])

  function handleLogoChange(e) {
    const selected = e.target.files[0]
    if (selected) setLogoFile(selected)
  }

  // DOCX generatsiya — `docx` kutubxonasi bilan HAQIQIY .docx yaratadi.
  // Diqqat: bu original shablon vizual formatini emas, oddiy struktura
  // (sarlavha + paragraflar + header/footer)ni qayta quradi. Original
  // shablon ko'rinishini aynan saqlash uchun productionda `docxtemplater`
  // (+ pizzip) tavsiya etiladi.
  async function handleGenerate() {
    setGenerating(true)
    setViewHtml('')

    try {
      const bodyParagraphs = selectedTemplate.fields.map(
        (field) =>
          new Paragraph({
            text: `${field.label}: ${fieldValues[field.key] || ''}`,
          }),
      )

      const children = [
        new Paragraph({
          text: documentName,
          heading: HeadingLevel.HEADING_1,
        }),
      ]

      if (headerOn && headerOrgName) {
        children.push(
          new Paragraph({
            text: headerOrgName,
            alignment: AlignmentType.CENTER,
          }),
        )
      }
      if (headerOn && headerPhone) {
        children.push(
          new Paragraph({
            text: headerPhone,
            alignment: AlignmentType.CENTER,
          }),
        )
      }

      children.push(...bodyParagraphs)

      if (footerOn && footerText) {
        children.push(
          new Paragraph({ text: footerText, alignment: AlignmentType.CENTER }),
        )
      }
      if (pageNumOn) {
        children.push(
          new Paragraph({ text: '— 1 —', alignment: AlignmentType.CENTER }),
        )
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  orientation:
                    orientation === 'landscape' ? 'landscape' : 'portrait',
                },
              },
            },
            children,
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const safeName =
        documentName.trim().replace(/\s+/g, '_') ||
        t('createDocument.additionalSettings.fallbackFileName')

      const entry = {
        id: Date.now(),
        name: `${safeName}.docx`,
        templateName: selectedTemplate.name,
        date: new Date().toLocaleString('uz-UZ'),
        format:
          outputFormat === 'docx-pdf'
            ? t('createDocument.additionalSettings.outputFormat.docxPdf')
            : outputFormat.toUpperCase(),
        blob,
      }

      onGenerated(entry)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  function handleDownload(entry) {
    if (!entry?.blob) return
    const url = URL.createObjectURL(entry.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = entry.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // "Ko'rish" — DOCX blobni yangi tabda ochish o'rniga, mammoth bilan
  // HTML'ga aylantirib, modalda ko'rsatamiz (docx faylni brauzer o'zi
  // to'g'ridan-to'g'ri ochib bera olmaydi, faqat yuklab beradi)
  async function handleView() {
    if (!generatedResult?.blob) return
    setViewingDoc(true)
    setViewLoading(true)
    setViewError('')
    try {
      const arrayBuffer = await generatedResult.blob.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setViewHtml(result.value)
    } catch (err) {
      console.error(err)
      setViewError(t('createDocument.additionalSettings.viewModal.error'))
    } finally {
      setViewLoading(false)
    }
  }

  return (
    <div className="additionalSettingsPanel">
      <div className="settingsPanelHeaderRow">
        <span className="settingsPanelHeaderIcon">
          <FaCog />
        </span>
        <h3>{t('createDocument.additionalSettings.title')}</h3>
      </div>

      <div className="settingsSubLabel">
        {t('createDocument.additionalSettings.logo.sectionLabel')}
      </div>

      {!logoFile ? (
        <div className="logoDropzone">
          <FaImage className="logoDropzoneIcon" />
          <p>{t('createDocument.additionalSettings.logo.dropzoneText')}</p>
          <span>{t('createDocument.additionalSettings.logo.dropzoneHint')}</span>
          <input
            type="file"
            id="logoInput"
            accept="image/png,image/jpeg,image/svg+xml"
            hidden
            onChange={handleLogoChange}
          />
          <label htmlFor="logoInput" className="chooseFileButton outline small">
            <FaFolderOpen />
            <span>{t('createDocument.additionalSettings.logo.chooseFile')}</span>
          </label>
        </div>
      ) : (
        <div className="logoSelectedBox">
          {logoPreviewUrl && (
            <img
              src={logoPreviewUrl}
              alt={t('createDocument.additionalSettings.logo.altText')}
              className="logoSelectedImg"
            />
          )}
          <span className="logoSelectedName">{logoFile.name}</span>
          <button type="button" onClick={() => setLogoFile(null)}>
            &times;
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="toggleRow">
        <span>{t('createDocument.additionalSettings.header.label')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={headerOn}
            onChange={(e) => setHeaderOn(e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
      {headerOn && (
        <div className="inlineSubSettings">
          <input
            type="text"
            placeholder={t(
              'createDocument.additionalSettings.header.orgNamePlaceholder',
            )}
            value={headerOrgName}
            onChange={(e) => setHeaderOrgName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t(
              'createDocument.additionalSettings.header.phonePlaceholder',
            )}
            value={headerPhone}
            onChange={(e) => setHeaderPhone(e.target.value)}
          />
        </div>
      )}

      {/* FOOTER */}
      <div className="toggleRow">
        <span>{t('createDocument.additionalSettings.footer.label')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={footerOn}
            onChange={(e) => setFooterOn(e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
      {footerOn && (
        <div className="inlineSubSettings">
          <input
            type="text"
            placeholder={t(
              'createDocument.additionalSettings.footer.textPlaceholder',
            )}
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>
      )}

      {/* SAHIFA RAQAMI */}
      <div className="toggleRow">
        <span>{t('createDocument.additionalSettings.pageNumbers.label')}</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={pageNumOn}
            onChange={(e) => setPageNumOn(e.target.checked)}
          />
          <span className="slider" />
        </label>
      </div>
      {pageNumOn && (
        <div className="inlineSubSettings">
          <select
            value={pageNumPosition}
            onChange={(e) => setPageNumPosition(e.target.value)}
          >
            {PAGE_NUM_POSITION_KEYS.map((p) => (
              <option key={p.value} value={p.value}>
                {t(
                  `createDocument.additionalSettings.pageNumbers.positions.${p.labelKey}`,
                )}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="settingsSubLabel">
        {t('createDocument.additionalSettings.pageSizeLabel')}
      </div>
      <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
        {PAGE_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="settingsSubLabel">
        {t('createDocument.additionalSettings.orientation.label')}
      </div>
      <select
        value={orientation}
        onChange={(e) => setOrientation(e.target.value)}
      >
        <option value="portrait">
          {t('createDocument.additionalSettings.orientation.portrait')}
        </option>
        <option value="landscape">
          {t('createDocument.additionalSettings.orientation.landscape')}
        </option>
      </select>

      <div className="settingsSubLabel">
        {t('createDocument.additionalSettings.outputFormat.label')}
      </div>
      <select
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value)}
      >
        <option value="docx">
          {t('createDocument.additionalSettings.outputFormat.docx')}
        </option>
        <option value="pdf">
          {t('createDocument.additionalSettings.outputFormat.pdf')}
        </option>
        <option value="docx-pdf">
          {t('createDocument.additionalSettings.outputFormat.docxPdf')}
        </option>
      </select>

      {(outputFormat === 'pdf' || outputFormat === 'docx-pdf') && (
        <>
          <div className="settingsSubLabel">
            {t('createDocument.additionalSettings.pdfQuality.label')}
          </div>
          <select
            value={pdfQuality}
            onChange={(e) => setPdfQuality(e.target.value)}
          >
            <option value="high">
              {t('createDocument.additionalSettings.pdfQuality.high')}
            </option>
            <option value="standard">
              {t('createDocument.additionalSettings.pdfQuality.standard')}
            </option>
            <option value="compressed">
              {t('createDocument.additionalSettings.pdfQuality.compressed')}
            </option>
          </select>
        </>
      )}

      <button
        type="button"
        className="generateButton"
        onClick={handleGenerate}
        disabled={generating}
      >
        <FaFileAlt />
        <span>
          {generating
            ? t('createDocument.additionalSettings.generating')
            : t('createDocument.additionalSettings.generateButton')}
        </span>
      </button>

      {generatedResult && (
        <div className="generatedResultBox">
          <div className="generatedResultTitle">
            <FaCheckCircle />
            <span>
              {t('createDocument.additionalSettings.result.successTitle')}
            </span>
          </div>
          <p className="generatedResultName">{generatedResult.name}</p>
          <div className="generatedResultActions">
            <button
              type="button"
              className="chooseFileButton outline small"
              onClick={handleView}
            >
              <FaEye />
              <span>{t('createDocument.additionalSettings.result.view')}</span>
            </button>
            <button
              type="button"
              className="chooseFileButton small"
              onClick={() => handleDownload(generatedResult)}
            >
              <FaDownload />
              <span>
                {t('createDocument.additionalSettings.result.download')}
              </span>
            </button>
          </div>
        </div>
      )}

      {(outputFormat === 'pdf' || outputFormat === 'docx-pdf') &&
        generatedResult && (
          <p className="pdfNote">
            {t('createDocument.additionalSettings.pdfNote')}
          </p>
        )}

      {viewingDoc && (
        <div className="modalOverlay" onClick={() => setViewingDoc(false)}>
          <div
            className="modalBox viewDocModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalTopHeader">
              <h3>{generatedResult?.name}</h3>
              <button
                type="button"
                className="modalCloseIcon"
                onClick={() => setViewingDoc(false)}
              >
                <FaTimes />
              </button>
            </div>

            {viewLoading && (
              <p className="fileViewerLoading">
                {t('createDocument.additionalSettings.viewModal.loading')}
              </p>
            )}
            {!viewLoading && viewError && (
              <p className="fileViewerError">{viewError}</p>
            )}
            {!viewLoading && !viewError && (
              <div
                className="docResultPreview"
                dangerouslySetInnerHTML={{ __html: viewHtml }}
              />
            )}

            <div className="modalFooter">
              <button
                type="button"
                className="modalCancelButton"
                onClick={() => setViewingDoc(false)}
              >
                <span>
                  {t('createDocument.additionalSettings.viewModal.close')}
                </span>
              </button>
              <button
                type="button"
                className="modalSaveButton"
                onClick={() => handleDownload(generatedResult)}
              >
                <FaDownload />
                <span>
                  {t('createDocument.additionalSettings.viewModal.download')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalSettingsPanel
