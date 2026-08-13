import { useState, useMemo } from 'react'
import {
  FaFileWord,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
} from 'react-icons/fa'

// DOM orqali html ichidagi matn tugunlarini aylanib, berilgan qiymatlarni
// <mark> bilan o'raydi (real highlight)
function highlightHtml(html, values) {
  const cleanValues = [...new Set(values.filter(Boolean))]
  if (cleanValues.length === 0 || !html) return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  const textNodes = []
  let node
  while ((node = walker.nextNode())) textNodes.push(node)

  textNodes.forEach((textNode) => {
    const text = textNode.textContent
    const found = cleanValues.filter((v) => text.includes(v))
    if (found.length === 0) return

    let remaining = text
    found.forEach((v) => {
      remaining = remaining.split(v).join(`\u0000${v}\u0000`)
    })
    const parts = remaining.split('\u0000')

    const frag = doc.createDocumentFragment()
    parts.forEach((part) => {
      if (found.includes(part)) {
        const mark = doc.createElement('mark')
        mark.className = 'extractedHighlight'
        mark.textContent = part
        frag.appendChild(mark)
      } else if (part) {
        frag.appendChild(doc.createTextNode(part))
      }
    })
    textNode.parentNode.replaceChild(frag, textNode)
  })

  return doc.body.innerHTML
}

const DocumentPreviewCard = ({
  file,
  htmlContent,
  method,
  setPendingSelectedText,
  highlightValues,
}) => {
  const [zoom, setZoom] = useState(100)
  const [fullscreen, setFullscreen] = useState(false)

  const renderedHtml = useMemo(
    () => highlightHtml(htmlContent, highlightValues),
    [htmlContent, highlightValues],
  )

  function handleMouseUp() {
    if (method !== 'select') return
    const selection = window.getSelection().toString().trim()
    if (selection) setPendingSelectedText(selection)
  }

  return (
    <div
      className={`documentPreviewCard ${fullscreen ? 'fullscreenPreview' : ''}`}
    >
      <div className="previewTopBar">
        <span className="previewTopBarTitle">
          <FaFileWord /> Hujjat preview
        </span>
        <div className="previewTopBarControls">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
          >
            <FaSearchMinus />
          </button>
          <span className="previewZoomValue">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
          >
            <FaSearchPlus />
          </button>
          <button type="button" onClick={() => setFullscreen((v) => !v)}>
            {fullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <div className="previewBody" onMouseUp={handleMouseUp}>
        {!file && (
          <p className="previewEmptyState">
            Fayl yuklanganda hujjat shu yerda ko'rinadi
          </p>
        )}

        {file && !htmlContent && (
          <p className="previewEmptyState">Hujjat o'qilmoqda...</p>
        )}

        {file && htmlContent && (
          <div
            className="previewContent"
            style={{ fontSize: `${zoom}%` }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>
    </div>
  )
}

export default DocumentPreviewCard
