import { useState, useMemo, useCallback, useEffect } from 'react'
import { FaFileAlt, FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa'
import mammoth from 'mammoth'
import { useTranslation, Trans } from 'react-i18next'
import {
  SaveFileModal,
  HistoryDetailModal,
  StepperBar,
  HistoryBar,
  ExtractionMethodCard,
  ExtractedDataCard,
  DocumentPreviewCard,
  DocumentInfoCard,
  ConfirmModal,
} from '../../components/components'
import './InformationAllocation.css'
import { Document, Packer, Paragraph } from 'docx'
import { uploadHistoryFile, downloadHistoryFile, deleteHistoryItem } from '../../api/history'

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
  const [tableIndex, setTableIndex] = useState('')
  const [headingLevel, setHeadingLevel] = useState('')
  const [selectedBookmark, setSelectedBookmark] = useState('')

  // ===== Bloklar (ajratilgan ma'lumotlar) =====
  const [blocks, setBlocks] = useState([])

  // ===== Saqlash =====
  const [saveFormat, setSaveFormat] = useState('docx')
  const [showSaveModal, setShowSaveModal] = useState(false)

  // ===== Tarix =====
  const [history, setHistory] = useState([])
  const [viewingHistoryItem, setViewingHistoryItem] = useState(null)
  const [deletingHistoryItem, setDeletingHistoryItem] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [archiveSaving, setArchiveSaving] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)
  const historyPerPage = 5

  // ===== Toast =====
  const [toasts, setToasts] = useState([])

  // ===== Bosqich (stepper) — state'dan avtomatik hisoblanadi =====
  const step = useMemo(() => {
    if (!file) return 1
    if (blocks.length === 0) return 2
    if (!showSaveModal && blocks.some((b) => b.selected)) return 3
    return 4
  }, [file, blocks, showSaveModal])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  // ===== Hujjat tuzilishini tahlil qilish =====
  const bookmarks = useMemo(() => {
    if (!htmlContent) return []
    const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi
    const found = []
    let match
    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '').trim()
      if (text) found.push(text)
    }
    return found
  }, [htmlContent])

  const tablesCount = useMemo(() => {
    if (!htmlContent) return 0
    return (htmlContent.match(/<table/gi) || []).length
  }, [htmlContent])

  const headingsList = useMemo(() => {
    if (!htmlContent) return []
    const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi
    const found = []
    let match
    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '').trim()
      if (text) found.push(text)
    }
    return found
  }, [htmlContent])

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
      const tables = (htmlResult.value.match(/<table/gi) || []).length
      const images = (htmlResult.value.match(/<img/gi) || []).length
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
    setTableIndex('')
    setHeadingLevel('')
    setSelectedBookmark('')
    analyzeFile(selectedFile)
  }

  function handleRemoveFile() {
    setFile(null)
    setRawText('')
    setHtmlContent('')
    setDocInfo(null)
    setBlocks([])
    setTableIndex('')
    setHeadingLevel('')
    setSelectedBookmark('')
  }

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

  function extractTableText(html, index) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const tables = doc.querySelectorAll('table')
    if (!tables[index]) return ''
    const rows = tables[index].querySelectorAll('tr')
    const lines = []
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th')
      const cellTexts = Array.from(cells).map((c) => c.textContent.trim())
      if (cellTexts.length > 0) lines.push(cellTexts.join(' | '))
    })
    return lines.join('\n')
  }

  function extractHeadingText(html, level) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll(level)
    const lines = []
    headings.forEach((h) => {
      let text = h.textContent.trim()
      let sibling = h.nextElementSibling
      while (sibling && !/^H[1-6]$/i.test(sibling.tagName)) {
        const siblingText = sibling.textContent.trim()
        if (siblingText) text += '\n' + siblingText
        sibling = sibling.nextElementSibling
      }
      lines.push(text)
    })
    return lines.join('\n\n---\n\n')
  }

  function extractBookmarkText(html, bookmarkName) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let startIdx = -1
    headings.forEach((h, i) => {
      if (h.textContent.trim() === bookmarkName) startIdx = i
    })
    if (startIdx === -1) return ''
    let text = headings[startIdx].textContent.trim()
    let sibling = headings[startIdx].nextElementSibling
    const endHeading = headings[startIdx + 1]
    while (sibling && sibling !== endHeading) {
      const siblingText = sibling.textContent.trim()
      if (siblingText) text += '\n' + siblingText
      sibling = sibling.nextElementSibling
    }
    return text
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
        rangeStart.replace(/[:\s]+/g, '').trim() ||
          t('informationAllocation.extractedData.defaultFieldLabel'),
        finalValue,
      )
      return
    }

    if (method === 'select') {
      if (!pendingSelectedText) return
      addFieldToCurrentBlock(
        t('informationAllocation.extractedData.selectedTextValueLabel'),
        pendingSelectedText,
      )
      setPendingSelectedText('')
      return
    }

    if (method === 'regex') {
      if (!regexPattern) return
      try {
        const re = new RegExp(regexPattern, 'g')
        const matches = [...rawText.matchAll(re)].map((m) => m[0])
        if (matches.length === 0) {
          addToast(t('informationAllocation.extractionMethod.regexNoMatch', 'Mos keluvchi natija topilmadi'), 'error')
          return
        }
        matches.forEach((m, i) =>
          addFieldToCurrentBlock(
            t('informationAllocation.extractedData.regexResultLabel', {
              index: i + 1,
            }),
            m,
          ),
        )
      } catch (err) {
        addToast(t('informationAllocation.extractionMethod.regexInvalid', 'Regex noto\'g\'ri kiritildi'), 'error')
        console.error('Regex xato:', err)
      }
      return
    }

    if (method === 'table') {
      const idx = parseInt(tableIndex, 10) - 1
      if (isNaN(idx) || idx < 0 || idx >= tablesCount) return
      const tableText = extractTableText(htmlContent, idx)
      if (!tableText) return
      addFieldToCurrentBlock(
        t('informationAllocation.extractedData.defaultFieldLabel') + ` ${t('informationAllocation.extractionMethod.methods.table')} ${idx + 1}`,
        tableText,
      )
      return
    }

    if (method === 'heading') {
      if (!headingLevel) return
      const headingText = extractHeadingText(htmlContent, headingLevel)
      if (!headingText) return
      addFieldToCurrentBlock(
        `${t('informationAllocation.extractionMethod.methods.heading')} ${headingLevel}`,
        headingText,
      )
      return
    }

    if (method === 'bookmark') {
      if (!selectedBookmark) return
      const bookmarkText = extractBookmarkText(htmlContent, selectedBookmark)
      if (!bookmarkText) return
      addFieldToCurrentBlock(
        `${t('informationAllocation.extractionMethod.methods.bookmark')}: ${selectedBookmark}`,
        bookmarkText,
      )
      return
    }
  }

  function handleAddSelectedText() {
    if (!pendingSelectedText) return
    addFieldToCurrentBlock(
      t('informationAllocation.extractedData.selectedTextValueLabel'),
      pendingSelectedText,
    )
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
    setSaveError('')
    setArchiveSaving(true)
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
        const rows = [
          [
            t('informationAllocation.extractedData.csv.block'),
            t('informationAllocation.extractedData.csv.field'),
            t('informationAllocation.extractedData.csv.value'),
          ],
        ]
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

      if (mode === 'append' && existingHistoryId) {
        const existing = history.find((h) => h.id === existingHistoryId)
        if (existing?.blob) {
          const oldText = await existing.blob.text()
          content = `${oldText}\n\n${content}`
        }
      }

      blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    } else if (saveFormat === 'docx') {
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
      console.warn('PDF eksporti backend orqali amalga oshiriladi (demo)')
      blob = new Blob(['PDF eksporti backend ulanganda ishlaydi (demo)'], {
        type: 'text/plain',
      })
      ext = 'txt'
    }

    const outputName = `${safeName}.${ext}`
    try {
      const outputFile = new File([blob], outputName, { type: blob.type })
      await uploadHistoryFile(outputFile, outputName, {
        blocksCount: blocks.filter((b) => b.selected).length,
        result: t('informationAllocation.saveFileModal.saved'),
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = outputName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setHistory((prev) => [
        {
          id: Date.now(),
          fileName: outputName,
          blocksCount: blocks.filter((b) => b.selected).length,
          time: new Date(),
          format: ext.toUpperCase(),
          blob,
          downloaded: false,
          templateName: file?.name || '',
        },
        ...prev,
      ])
      setShowSaveModal(false)
      addToast(t('informationAllocation.saveFileModal.saved'))
      window.dispatchEvent(new Event('history-updated'))
    } catch (err) {
      console.error('[InformationAllocation] Upload error:', err)
      setSaveError(err.message || 'Faylni arxivga saqlashda xatolik yuz berdi')
      addToast(t('informationAllocation.saveFileModal.saveError'), 'error')
    } finally {
      setArchiveSaving(false)
    }
  }

  // ===== Tarix amallari =====
  const totalHistoryPages = Math.max(1, Math.ceil(history.length / historyPerPage))
  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * historyPerPage
    return history.slice(start, start + historyPerPage)
  }, [history, historyPage, historyPerPage])

  useEffect(() => {
    if (historyPage > totalHistoryPages) setHistoryPage(1)
  }, [historyPage, totalHistoryPages])

  async function handleDownloadHistory(item) {
    try {
      const blob = item.blob || (await downloadHistoryFile(item.id))
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setHistory((prev) =>
        prev.map((h) => (h.id === item.id ? { ...h, downloaded: true } : h)),
      )
    } catch (err) {
      console.error('Yuklab olishda xatolik:', err)
    }
  }

  async function handleDeleteHistory() {
    const id = deletingHistoryItem.id
    try {
      await deleteHistoryItem(id)
      setHistory((prev) => prev.filter((h) => h.id !== id))
      setDeletingHistoryItem(null)
      addToast(t('informationAllocation.historyBar.deleted', 'Yozuv o\'chirildi'))
    } catch (err) {
      console.error("O'chirishda xatolik:", err)
    }
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
            <p>{t('informationAllocation.header.subtitle')}</p>
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

      {saveError && <p className="iaSaveError">{saveError}</p>}

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
            tableIndex={tableIndex}
            setTableIndex={setTableIndex}
            headingLevel={headingLevel}
            setHeadingLevel={setHeadingLevel}
            selectedBookmark={selectedBookmark}
            setSelectedBookmark={setSelectedBookmark}
            bookmarks={bookmarks}
            tablesCount={tablesCount}
            headingsList={headingsList}
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
        history={paginatedHistory}
        onSelect={(h) => setViewingHistoryItem(h)}
        onDownload={handleDownloadHistory}
        onDeleteRequest={(h) => setDeletingHistoryItem(h)}
        currentPage={historyPage}
        totalPages={totalHistoryPages}
        onPageChange={setHistoryPage}
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
          saving={archiveSaving}
        />
      )}

      {viewingHistoryItem && (
        <HistoryDetailModal
          item={viewingHistoryItem}
          onClose={() => setViewingHistoryItem(null)}
        />
      )}

      {deletingHistoryItem && (
        <ConfirmModal
          title={t('informationAllocation.historyBar.confirmDelete')}
          message={
            <Trans
              i18nKey="informationAllocation.historyBar.confirmDeleteMessage"
              values={{ fileName: deletingHistoryItem.fileName }}
              components={{ b: <b /> }}
            />
          }
          confirmLabel={t('history.table.delete')}
          onCancel={() => setDeletingHistoryItem(null)}
          onConfirm={handleDeleteHistory}
        />
      )}

      <div className="toastContainer">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toastIcon">
              {toast.type === 'success' ? <FaCheckCircle /> : <FaClock />}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InformationAllocation
