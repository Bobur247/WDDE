import { useState, useEffect } from 'react'
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
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx'
import mammoth from 'mammoth'

const PAGE_SIZES = ['A4', 'A5', 'A3', 'Letter', 'Legal']
const PAGE_NUM_POSITIONS = [
  { value: 'bottom-right', label: "Pastki o'ng" },
  { value: 'bottom-center', label: 'Pastki markaz' },
  { value: 'bottom-left', label: 'Pastki chap' },
  { value: 'top-right', label: "Yuqori o'ng" },
  { value: 'top-center', label: 'Yuqori markaz' },
  { value: 'top-left', label: 'Yuqori chap' },
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
      const safeName = documentName.trim().replace(/\s+/g, '_') || 'hujjat'

      const entry = {
        id: Date.now(),
        name: `${safeName}.docx`,
        templateName: selectedTemplate.name,
        date: new Date().toLocaleString('uz-UZ'),
        format:
          outputFormat === 'docx-pdf'
            ? 'DOCX + PDF'
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
      setViewError("Hujjatni ko'rsatishda xatolik yuz berdi")
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
        <h3>Qo'shimcha sozlamalar</h3>
      </div>

      <div className="settingsSubLabel">Rasm va logotip</div>

      {!logoFile ? (
        <div className="logoDropzone">
          <FaImage className="logoDropzoneIcon" />
          <p>Logotip yuklash</p>
          <span>PNG / JPG, SVG (max 2MB)</span>
          <input
            type="file"
            id="logoInput"
            accept="image/png,image/jpeg,image/svg+xml"
            hidden
            onChange={handleLogoChange}
          />
          <label htmlFor="logoInput" className="chooseFileButton outline small">
            <FaFolderOpen />
            <span>Fayl tanlash</span>
          </label>
        </div>
      ) : (
        <div className="logoSelectedBox">
          {logoPreviewUrl && (
            <img src={logoPreviewUrl} alt="logo" className="logoSelectedImg" />
          )}
          <span className="logoSelectedName">{logoFile.name}</span>
          <button type="button" onClick={() => setLogoFile(null)}>
            &times;
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="toggleRow">
        <span>Header (sarlavha)</span>
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
            placeholder="Tashkilot nomi"
            value={headerOrgName}
            onChange={(e) => setHeaderOrgName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Telefon"
            value={headerPhone}
            onChange={(e) => setHeaderPhone(e.target.value)}
          />
        </div>
      )}

      {/* FOOTER */}
      <div className="toggleRow">
        <span>Footer (pastki qism)</span>
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
            placeholder="Footer matni (masalan: www.example.uz)"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>
      )}

      {/* SAHIFA RAQAMI */}
      <div className="toggleRow">
        <span>Sahifa raqamlari</span>
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
            {PAGE_NUM_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="settingsSubLabel">Sahifa o'lchami:</div>
      <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
        {PAGE_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="settingsSubLabel">Orientatsiya:</div>
      <select
        value={orientation}
        onChange={(e) => setOrientation(e.target.value)}
      >
        <option value="portrait">Portrait (vertikal)</option>
        <option value="landscape">Landscape (gorizontal)</option>
      </select>

      <div className="settingsSubLabel">Hujjat formati:</div>
      <select
        value={outputFormat}
        onChange={(e) => setOutputFormat(e.target.value)}
      >
        <option value="docx">DOCX (Word)</option>
        <option value="pdf">PDF</option>
        <option value="docx-pdf">DOCX + PDF</option>
      </select>

      {(outputFormat === 'pdf' || outputFormat === 'docx-pdf') && (
        <>
          <div className="settingsSubLabel">PDF sifati:</div>
          <select
            value={pdfQuality}
            onChange={(e) => setPdfQuality(e.target.value)}
          >
            <option value="high">Yuqori</option>
            <option value="standard">Standart</option>
            <option value="compressed">Siqilgan</option>
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
        <span>{generating ? 'Yaratilmoqda...' : 'Hujjatni yaratish'}</span>
      </button>

      {generatedResult && (
        <div className="generatedResultBox">
          <div className="generatedResultTitle">
            <FaCheckCircle />
            <span>Hujjat muvaffaqiyatli yaratildi</span>
          </div>
          <p className="generatedResultName">{generatedResult.name}</p>
          <div className="generatedResultActions">
            <button
              type="button"
              className="chooseFileButton outline small"
              onClick={handleView}
            >
              <FaEye />
              <span>Ko'rish</span>
            </button>
            <button
              type="button"
              className="chooseFileButton small"
              onClick={() => handleDownload(generatedResult)}
            >
              <FaDownload />
              <span>Yuklab olish</span>
            </button>
          </div>
        </div>
      )}

      {(outputFormat === 'pdf' || outputFormat === 'docx-pdf') &&
        generatedResult && (
          <p className="pdfNote">
            PDF eksporti brauzerda amalga oshirilmaydi — bu backend (masalan
            LibreOffice) orqali qo'shiladi.
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
              <p className="fileViewerLoading">Hujjat ochilmoqda...</p>
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
                <span>Yopish</span>
              </button>
              <button
                type="button"
                className="modalSaveButton"
                onClick={() => handleDownload(generatedResult)}
              >
                <FaDownload />
                <span>Yuklab olish</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalSettingsPanel
