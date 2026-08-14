import { useState, useMemo } from 'react'
import { FaFileAlt, FaPlus } from 'react-icons/fa'
import mammoth from 'mammoth'
import { Document, Packer, Paragraph } from 'docx'
import { useTranslation } from 'react-i18next'
import {
  SaveFileModal,
  HistoryDetailModal,
  StepperBar,
  HistoryBar,
  ExtractionMethodCard,
  ExtractedDataCard,
  DocumentPreviewCard,
  DocumentInfoCard,
} from '../../components/components'
import './InformationAllocation.css'

let nextFieldId = 1
let nextBlockId = 1

const InformationAllocation = () => {
  const { t } = useTranslation()
  // ===== Fayl va tahlil =====
  const [file, setFile] = useState(null)
  const [rawText, setRawText] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [docInfo, setDocInfo] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  // ===== Ajratish usuli va uning sozlamalari =====
  const [method, setMethod] = useState('range')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [includeStart, setIncludeStart] = useState(false)
  const [includeEnd, setIncludeEnd] = useState(false)
  const [regexPattern, setRegexPattern] = useState('')
  const [pendingSelectedText, setPendingSelectedText] = useState('')

  // ===== Bloklar (ajratilgan ma'lumotlar) =====
  const [blocks, setBlocks] = useState([])

  // ===== Saqlash =====
  const [saveFormat, setSaveFormat] = useState('docx')
  const [showSaveModal, setShowSaveModal] = useState(false)

  // ===== Tarix =====
  const [history, setHistory] = useState([])
  const [viewingHistoryItem, setViewingHistoryItem] = useState(null)

  // ===== Bosqich (stepper) — state'dan avtomatik hisoblanadi =====
  const step = useMemo(() => {
    if (!file) return 1
    if (blocks.length === 0) return 2
    if (!showSaveModal && blocks.some((b) => b.selected)) return 3
    return 4
  }, [file, blocks, showSaveModal])

  async function analyzeFile(selectedFile) {
    setAnalyzing(true)
    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const rawResult = await mammoth.extractRawText({ arrayBuffer })
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer })

      const text = rawResult.value
      const paragraphs = text
        .split('\n')
        .filter((l) => l.trim().length > 0).length
      const tables = (htmlResult.value.match(/<table/g) || []).length
      const images = (htmlResult.value.match(/<img/g) || []).length
      // DIQQAT: sahifalar soni docx'dan aniq olinmaydi (render qilinmaguncha).
      // Bu — belgilar soniga asoslangan TAXMINIY hisob.
      const pages = Math.max(1, Math.ceil(text.length / 1800))

      setRawText(text)
      setHtmlContent(htmlResult.value)
      setDocInfo({
        sizeLabel: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        pages,
        paragraphs,
        tables,
        images,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  function handleFileSelected(selectedFile) {
    setFile(selectedFile)
    setBlocks([])
    analyzeFile(selectedFile)
  }

  function handleRemoveFile() {
    setFile(null)
    setRawText('')
    setHtmlContent('')
    setDocInfo(null)
    setBlocks([])
  }

  // Joriy (oxirgi) blokka yangi maydon qo'shadi; blok bo'lmasa yangisini yaratadi
  function addFieldToCurrentBlock(label, value) {
    setBlocks((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: nextBlockId++,
            name: `${t('informationAllocation.extractedData.blockDefaultName')} 1`,
            selected: true,
            fields: [{ id: nextFieldId++, label, value }],
          },
        ]
      }
      const updated = [...prev]
      const last = { ...updated[updated.length - 1] }
      last.fields = [...last.fields, { id: nextFieldId++, label, value }]
      updated[updated.length - 1] = last
      return updated
    })
  }

  function handleStartNewBlock() {
    setBlocks((prev) => [
      ...prev,
      {
        id: nextBlockId++,
        name: `${t('informationAllocation.extractedData.blockDefaultName')} ${prev.length + 1}`,
        selected: true,
        fields: [],
      },
    ])
  }

  function handleToggleBlock(blockId) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, selected: !b.selected } : b)),
    )
  }

  function handleDeleteBlock(blockId) {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId))
  }

  function handleRenameBlock(blockId, name) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, name } : b)),
    )
  }

  // ===== Ajratish usullari bo'yicha haqiqiy logika =====
  function handleExtract() {
    if (method === 'range') {
      if (!rangeStart || !rangeEnd) return
      const startIdx = rawText.indexOf(rangeStart)
      if (startIdx === -1) return
      const searchFrom = startIdx + rangeStart.length
      const endIdx = rawText.indexOf(rangeEnd, searchFrom)
      if (endIdx === -1) return

      const extracted = rawText.slice(searchFrom, endIdx).trim()
      const finalValue =
        (includeStart ? rangeStart : '') +
        extracted +
        (includeEnd ? rangeEnd : '')
      addFieldToCurrentBlock(
        rangeStart.replace(':', '').trim() || t('informationAllocation.extractedData.defaultFieldLabel'),
        finalValue,
      )
      return
    }

    if (method === 'regex') {
      if (!regexPattern) return
      try {
        const re = new RegExp(regexPattern, 'g')
        const matches = [...rawText.matchAll(re)].map((m) => m[0])
        matches.forEach((m, i) => addFieldToCurrentBlock(t('informationAllocation.extractedData.regexResultLabel', { index: i + 1 }), m))
      } catch (err) {
        console.error('Regex xato:', err)
      }
      return
    }
    // 'select' usulida asosiy tugma emas, alohida "+ Ajratishga qo'shish" ishlaydi
  }

  function handleAddSelectedText() {
    if (!pendingSelectedText) return
    addFieldToCurrentBlock(t('informationAllocation.extractedData.selectedTextValueLabel'), pendingSelectedText)
    setPendingSelectedText('')
  }

  // ===== Statistika (tanlangan bloklardan) =====
  const stats = useMemo(() => {
    const selectedFields = blocks
      .filter((b) => b.selected)
      .flatMap((b) => b.fields)
    const chars = selectedFields.reduce((sum, f) => sum + f.value.length, 0)
    const words = selectedFields.reduce(
      (sum, f) => sum + f.value.trim().split(/\s+/).filter(Boolean).length,
      0,
    )
    return { fieldCount: selectedFields.length, chars, words, selectedFields }
  }, [blocks])

  // ===== Saqlash — haqiqiy fayl generatsiya qilinadi (format bo'yicha) =====
  async function handleSaveFile({ fileName, mode, existingHistoryId }) {
    const safeName = fileName.trim().replace(/\s+/g, '_') || 'malumot'
    let blob
    let ext = saveFormat

    if (saveFormat === 'txt' || saveFormat === 'csv' || saveFormat === 'json') {
      let content = ''
      if (saveFormat === 'json') {
        content = JSON.stringify(
          blocks
            .filter((b) => b.selected)
            .map((b) => ({
              block: b.name,
              fields: Object.fromEntries(
                b.fields.map((f) => [f.label, f.value]),
              ),
            })),
          null,
          2,
        )
      } else if (saveFormat === 'csv') {
        const rows = [[
          t('informationAllocation.extractedData.csv.block'),
          t('informationAllocation.extractedData.csv.field'),
          t('informationAllocation.extractedData.csv.value'),
        ]]
        blocks
          .filter((b) => b.selected)
          .forEach((b) =>
            b.fields.forEach((f) => rows.push([b.name, f.label, f.value])),
          )
        content = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
      } else {
        content = blocks
          .filter((b) => b.selected)
          .map(
            (b) =>
              `${b.name}\n` +
              b.fields.map((f) => `${f.label}: ${f.value}`).join('\n'),
          )
          .join('\n\n')
      }

      // "Mavjud faylga qo'shish" — matn asosli formatlar uchun haqiqatan
      // ishlaydi (eski kontentni topib, oxiriga qo'shadi)
      if (mode === 'append' && existingHistoryId) {
        const existing = history.find((h) => h.id === existingHistoryId)
        if (existing?.blob) {
          const oldText = await existing.blob.text()
          content = `${oldText}\n\n${content}`
        }
      }

      blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    } else if (saveFormat === 'docx') {
      // DIQQAT: bu oddiy struktura quradi, "mavjud faylga qo'shish" uchun
      // haqiqiy docx ichiga yozish backend (docxtemplater) talab qiladi.
      const doc = new Document({
        sections: [
          {
            children: blocks
              .filter((b) => b.selected)
              .flatMap((b) => [
                new Paragraph({ text: b.name, heading: 'Heading2' }),
                ...b.fields.map(
                  (f) => new Paragraph({ text: `${f.label}: ${f.value}` }),
                ),
              ]),
          },
        ],
      })
      blob = await Packer.toBlob(doc)
    } else {
      // PDF — brauzerda haqiqiy generatsiya qilinmaydi, backend kerak
      console.warn('PDF eksporti backend orqali amalga oshiriladi (demo)')
      blob = new Blob(['PDF eksporti backend ulanganda ishlaydi (demo)'], {
        type: 'text/plain',
      })
      ext = 'txt'
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${safeName}.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    setHistory((prev) => [
      {
        id: Date.now(),
        fileName: `${safeName}.${ext}`,
        blocksCount: blocks.filter((b) => b.selected).length,
        time: new Date(),
        format: ext.toUpperCase(),
        blob,
      },
      ...prev,
    ])

    setShowSaveModal(false)
  }

  return (
    <div className="InformationAllocationPage">
      <div className="iaHeader">
        <div className="iaHeaderLeft">
          <span className="iaHeaderIcon">
            <FaFileAlt />
          </span>
          <div>
            <h1>{t('informationAllocation.header.title')}</h1>
            <p>
              {t('informationAllocation.header.subtitle')}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="newProjectButton"
          onClick={handleRemoveFile}
        >
          <FaPlus />
          <span>{t('informationAllocation.header.newProject')}</span>
        </button>
      </div>

      <StepperBar currentStep={step} />

      <div className="iaGrid">
        <div className="iaLeftCol">
          <DocumentInfoCard
            file={file}
            docInfo={docInfo}
            analyzing={analyzing}
            onFileSelected={handleFileSelected}
            onRemoveFile={handleRemoveFile}
          />

          <ExtractionMethodCard
            disabled={!file}
            method={method}
            setMethod={setMethod}
            rangeStart={rangeStart}
            setRangeStart={setRangeStart}
            rangeEnd={rangeEnd}
            setRangeEnd={setRangeEnd}
            includeStart={includeStart}
            setIncludeStart={setIncludeStart}
            includeEnd={includeEnd}
            setIncludeEnd={setIncludeEnd}
            regexPattern={regexPattern}
            setRegexPattern={setRegexPattern}
            pendingSelectedText={pendingSelectedText}
            onAddSelectedText={handleAddSelectedText}
            onExtract={handleExtract}
          />
        </div>

        <DocumentPreviewCard
          file={file}
          htmlContent={htmlContent}
          method={method}
          setPendingSelectedText={setPendingSelectedText}
          highlightValues={blocks.flatMap((b) => b.fields.map((f) => f.value))}
        />

        <ExtractedDataCard
          blocks={blocks}
          onToggleBlock={handleToggleBlock}
          onDeleteBlock={handleDeleteBlock}
          onRenameBlock={handleRenameBlock}
          onStartNewBlock={handleStartNewBlock}
          stats={stats}
          saveFormat={saveFormat}
          setSaveFormat={setSaveFormat}
          onOpenSaveModal={() => setShowSaveModal(true)}
        />
      </div>

      <HistoryBar
        history={history}
        onSelect={(h) => setViewingHistoryItem(h)}
      />

      {showSaveModal && (
        <SaveFileModal
          defaultName={
            file
              ? file.name.replace(/\.[^/.]+$/, '') + '_malumotlari'
              : 'malumot'
          }
          format={saveFormat}
          history={history}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveFile}
        />
      )}

      {viewingHistoryItem && (
        <HistoryDetailModal
          item={viewingHistoryItem}
          onClose={() => setViewingHistoryItem(null)}
        />
      )}
    </div>
  )
}

export default InformationAllocation
