import React, { useState, useEffect } from 'react'
import { GrLinkPrevious } from 'react-icons/gr'
import { MdSwitchAccessShortcut } from 'react-icons/md'
import './SeparateOptions.css'
import { Document, Packer, Paragraph } from 'docx'
import { saveAs } from 'file-saver'

const METHODS = [
  { value: 'block', label: 'Blok (Boshlanishi-tugashi)' },
  { value: 'checkbox', label: 'Checkbox (Har bir qator bilan)' },
  { value: 'manual', label: "Matnni qo'lda tanlash" },
  { value: 'keyword', label: "Kalit so'z bo'yicha" },
  { value: 'regex', label: "Regex bo'yicha" },
  { value: 'table', label: 'Jadvaldan ajratish' },
]

const METHOD_BUTTON_LABEL = {
  block: 'Ajratish',
  checkbox: 'Ajratish',
  keyword: 'Ajratish',
  regex: 'Ajratish',
  table: 'Ajratish',
}

const SeparateOptions = ({
  method,
  setMethod,
  rawText,
  htmlContent,
  selectedItems,
  manualPending,
  setManualPending,
  onExtract,
  onUndoLast,
  hasExtractedItems,
  extractedItems,
}) => {
  const [blockStart, setBlockStart] = useState('')
  const [blockEnd, setBlockEnd] = useState('')
  const [keyword, setKeyword] = useState('')
  const [keywordCount, setKeywordCount] = useState(100)
  const [regexPattern, setRegexPattern] = useState('')
  const [tableRows, setTableRows] = useState([])
  const [tableColumn, setTableColumn] = useState('')
  const [tableRowNumber, setTableRowNumber] = useState('')
  const [localError, setLocalError] = useState('')
  const [showNameModal, setShowNameModal] = useState(false)
  const [exportFileName, setExportFileName] = useState('')

  useEffect(() => {
    setLocalError('')
    if (method !== 'table' || !htmlContent) {
      setTableRows([])
      return
    }
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html')
    const table = doc.querySelector('table')
    if (!table) {
      setTableRows([])
      return
    }
    const rows = Array.from(table.querySelectorAll('tr')).map((tr) =>
      Array.from(tr.querySelectorAll('th,td')).map((td) =>
        td.textContent.trim(),
      ),
    )
    setTableRows(rows)
  }, [method, htmlContent])

  function handleMethodExtract() {
    setLocalError('')

    if (method === 'block') {
      if (!blockStart || !blockEnd) {
        setLocalError('Boshlanish va tugash matnlarini kiriting')
        return
      }
      const startIdx = rawText.indexOf(blockStart)
      const endIdx = rawText.indexOf(blockEnd, startIdx + blockStart.length)
      if (startIdx === -1 || endIdx === -1) {
        setLocalError('Belgilangan matn faylda topilmadi')
        return
      }
      const extracted = rawText
        .slice(startIdx + blockStart.length, endIdx)
        .trim()
      onExtract('block', [extracted])
      return
    }

    if (method === 'checkbox') {
      if (selectedItems.length === 0) {
        setLocalError('Hech qanday qator tanlanmadi')
        return
      }
      onExtract('checkbox', selectedItems)
      return
    }

    if (method === 'keyword') {
      if (!keyword) {
        setLocalError("Kalit so'zni kiriting")
        return
      }
      const idx = rawText.indexOf(keyword)
      if (idx === -1) {
        setLocalError("Kalit so'z faylda topilmadi")
        return
      }
      const startPos = idx + keyword.length
      const extracted = rawText
        .slice(startPos, startPos + Number(keywordCount))
        .trim()
      onExtract('keyword', [extracted])
      return
    }

    if (method === 'regex') {
      if (!regexPattern) {
        setLocalError('Regex ifodasini kiriting')
        return
      }
      try {
        const re = new RegExp(regexPattern, 'g')
        const matches = [...rawText.matchAll(re)].map((m) => m[0])
        if (matches.length === 0) {
          setLocalError('Mos keluvchi natija topilmadi')
          return
        }
        onExtract('regex', matches)
      } catch (err) {
        setLocalError("Regex noto'g'ri kiritildi")
      }
      return
    }

    if (method === 'table') {
      if (tableRows.length === 0) {
        setLocalError('Faylda jadval topilmadi')
        return
      }
      if (tableColumn) {
        const headerIndex = tableRows[0].indexOf(tableColumn)
        if (headerIndex === -1) {
          setLocalError('Ustun topilmadi')
          return
        }
        const values = tableRows.slice(1).map((row) => row[headerIndex])
        onExtract('table', values)
      } else if (tableRowNumber !== '') {
        const rowIndex = Number(tableRowNumber)
        if (!tableRows[rowIndex]) {
          setLocalError('Bunday qator topilmadi')
          return
        }
        onExtract('table', [tableRows[rowIndex].join(' | ')])
      } else {
        setLocalError('Ustun yoki qator raqamini tanlang')
      }
      return
    }
  }

  function handleManualTake() {
    if (!manualPending) {
      setLocalError('Avval matnni sichqoncha bilan belgilang')
      return
    }
    onExtract('manual', [manualPending])
    setManualPending('')
    setLocalError('')
  }

  function handleManualBack() {
    if (manualPending) {
      setManualPending('')
      setLocalError('')
      return
    }
    onUndoLast()
    setLocalError('')
  }

  async function handleExportToWord() {
    const finalName = exportFileName.trim() || 'ajratilgan-malumotlar'

    const doc = new Document({
      sections: [
        {
          children: extractedItems.map(
            (item) => new Paragraph({ text: item.text }),
          ),
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${finalName}.docx`)

    setShowNameModal(false)
    setExportFileName('')
  }

  return (
    <div className="separate">
      <form onSubmit={(e) => e.preventDefault()}>
        <p className="subtitleSelect">Ajratish usuli</p>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {method === 'block' && (
          <div className="methodInputs">
            <input
              type="text"
              placeholder="Boshlanishi"
              value={blockStart}
              onChange={(e) => setBlockStart(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tugashi"
              value={blockEnd}
              onChange={(e) => setBlockEnd(e.target.value)}
            />
          </div>
        )}

        {method === 'keyword' && (
          <div className="methodInputs">
            <input
              type="text"
              placeholder="Kalit so'z (masalan: Telefon:)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              type="number"
              placeholder="Belgilar soni (masalan: 100)"
              value={keywordCount}
              onChange={(e) => setKeywordCount(e.target.value)}
            />
          </div>
        )}

        {method === 'regex' && (
          <div className="methodInputs">
            <input
              type="text"
              placeholder="Regex, masalan: \+998\d{9}"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
            />
          </div>
        )}

        {method === 'table' && (
          <div className="methodInputs">
            {tableRows.length > 0 ? (
              <>
                <select
                  value={tableColumn}
                  onChange={(e) => {
                    setTableColumn(e.target.value)
                    setTableRowNumber('')
                  }}
                >
                  <option value="">-- Ustun tanlang --</option>
                  {tableRows[0].map((col, i) => (
                    <option key={i} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="yoki qator raqami (0 = sarlavha)"
                  value={tableRowNumber}
                  onChange={(e) => {
                    setTableRowNumber(e.target.value)
                    setTableColumn('')
                  }}
                />
              </>
            ) : (
              <p className="methodHint">Faylda jadval topilmadi</p>
            )}
          </div>
        )}

        {localError && <p style={{ color: 'red' }}>{localError}</p>}
        {method !== 'manual' && (
          <button
            type="button"
            className="clickMethodAdd"
            onClick={handleMethodExtract}
          >
            <MdSwitchAccessShortcut />
            <span>{METHOD_BUTTON_LABEL[method]}</span>
          </button>
        )}

        {method === 'manual' && (
          <div className="manualButtons">
            <button
              type="button"
              className="clickMethodAdd"
              onClick={handleManualTake}
            >
              <MdSwitchAccessShortcut />
              <span>Ajratish</span>
            </button>
            <button
              type="button"
              className="clickBack"
              onClick={handleManualBack}
            >
              <span>
                <GrLinkPrevious />
              </span>
            </button>
          </div>
        )}
      </form>

      <div className="finalActions">
        <button
          type="button"
          className="clickBack"
          onClick={onUndoLast}
          disabled={!hasExtractedItems}
        >
          <span>
            <GrLinkPrevious />
          </span>
        </button>
        <button
          type="button"
          className="clickSeparate"
          onClick={() => {
            if (!hasExtractedItems) {
              setLocalError("Hali hech qanday ma'lumot ajratilmagan")
              return
            }
            setShowNameModal(true)
          }}
          disabled={!hasExtractedItems}
        >
          <MdSwitchAccessShortcut />
          <span>Ma'lumotni ajratish</span>
        </button>
      </div>

      {showNameModal && (
        <div className="modalOverlay" onClick={() => setShowNameModal(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <h4>Fayl nomini kiriting</h4>
            <input
              type="text"
              autoFocus
              placeholder="Masalan: mijozlar-royxati"
              value={exportFileName}
              onChange={(e) => setExportFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExportToWord()
              }}
            />
            <div className="modalButtons">
              <button
                type="button"
                className="clickBackModal"
                onClick={() => setShowNameModal(false)}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="clickSeparateModal"
                onClick={handleExportToWord}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeparateOptions
