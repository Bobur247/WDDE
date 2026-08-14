import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GrLinkPrevious } from 'react-icons/gr'
import { MdSwitchAccessShortcut } from 'react-icons/md'
import './SeparateOptions.css'
import { saveAs } from 'file-saver'

const { Document, Packer, Paragraph } = require('docx')

const METHOD_VALUES = [
  'block',
  'checkbox',
  'manual',
  'keyword',
  'regex',
  'table',
]

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
  const { t } = useTranslation()
  const METHODS = METHOD_VALUES.map((value) => ({
    value,
    label: t(`home.separateOptions.methods.${value}`),
  }))
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
        setLocalError(t('home.separateOptions.errors.blockMissingInputs'))
        return
      }
      const startIdx = rawText.indexOf(blockStart)
      const endIdx = rawText.indexOf(blockEnd, startIdx + blockStart.length)
      if (startIdx === -1 || endIdx === -1) {
        setLocalError(t('home.separateOptions.errors.blockNotFound'))
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
        setLocalError(t('home.separateOptions.errors.noRowsSelected'))
        return
      }
      onExtract('checkbox', selectedItems)
      return
    }

    if (method === 'keyword') {
      if (!keyword) {
        setLocalError(t('home.separateOptions.errors.keywordMissing'))
        return
      }
      const idx = rawText.indexOf(keyword)
      if (idx === -1) {
        setLocalError(t('home.separateOptions.errors.keywordNotFound'))
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
        setLocalError(t('home.separateOptions.errors.regexMissing'))
        return
      }
      try {
        const re = new RegExp(regexPattern, 'g')
        const matches = [...rawText.matchAll(re)].map((m) => m[0])
        if (matches.length === 0) {
          setLocalError(t('home.separateOptions.errors.regexNoMatch'))
          return
        }
        onExtract('regex', matches)
      } catch (err) {
        setLocalError(t('home.separateOptions.errors.regexInvalid'))
      }
      return
    }

    if (method === 'table') {
      if (tableRows.length === 0) {
        setLocalError(t('home.separateOptions.errors.tableNotFound'))
        return
      }
      if (tableColumn) {
        const headerIndex = tableRows[0].indexOf(tableColumn)
        if (headerIndex === -1) {
          setLocalError(t('home.separateOptions.errors.columnNotFound'))
          return
        }
        const values = tableRows.slice(1).map((row) => row[headerIndex])
        onExtract('table', values)
      } else if (tableRowNumber !== '') {
        const rowIndex = Number(tableRowNumber)
        if (!tableRows[rowIndex]) {
          setLocalError(t('home.separateOptions.errors.rowNotFound'))
          return
        }
        onExtract('table', [tableRows[rowIndex].join(' | ')])
      } else {
        setLocalError(t('home.separateOptions.errors.selectColumnOrRow'))
      }
      return
    }
  }

  function handleManualTake() {
    if (!manualPending) {
      setLocalError(t('home.separateOptions.errors.selectTextFirst'))
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
        <p className="subtitleSelect">
          {t('home.separateOptions.methodLabel')}
        </p>
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
              placeholder={t('home.separateOptions.placeholders.blockStart')}
              value={blockStart}
              onChange={(e) => setBlockStart(e.target.value)}
            />
            <input
              type="text"
              placeholder={t('home.separateOptions.placeholders.blockEnd')}
              value={blockEnd}
              onChange={(e) => setBlockEnd(e.target.value)}
            />
          </div>
        )}

        {method === 'keyword' && (
          <div className="methodInputs">
            <input
              type="text"
              placeholder={t('home.separateOptions.placeholders.keyword')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              type="number"
              placeholder={t(
                'home.separateOptions.placeholders.keywordCount',
              )}
              value={keywordCount}
              onChange={(e) => setKeywordCount(e.target.value)}
            />
          </div>
        )}

        {method === 'regex' && (
          <div className="methodInputs">
            <input
              type="text"
              placeholder={t('home.separateOptions.placeholders.regex')}
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
                  <option value="">
                    {t('home.separateOptions.placeholders.selectColumn')}
                  </option>
                  {tableRows[0].map((col, i) => (
                    <option key={i} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder={t(
                    'home.separateOptions.placeholders.tableRowNumber',
                  )}
                  value={tableRowNumber}
                  onChange={(e) => {
                    setTableRowNumber(e.target.value)
                    setTableColumn('')
                  }}
                />
              </>
            ) : (
              <p className="methodHint">
                {t('home.separateOptions.errors.tableNotFound')}
              </p>
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
            <span>{t('home.separateOptions.extractButton')}</span>
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
              <span>{t('home.separateOptions.extractButton')}</span>
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
              setLocalError(
                t('home.separateOptions.errors.nothingExtractedYet'),
              )
              return
            }
            setShowNameModal(true)
          }}
          disabled={!hasExtractedItems}
        >
          <MdSwitchAccessShortcut />
          <span>{t('home.separateOptions.mainExtractButton')}</span>
        </button>
      </div>

      {showNameModal && (
        <div className="modalOverlay" onClick={() => setShowNameModal(false)}>
          <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <h4>{t('home.separateOptions.modal.title')}</h4>
            <input
              type="text"
              autoFocus
              placeholder={t(
                'home.separateOptions.placeholders.exportFileName',
              )}
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
                {t('home.separateOptions.modal.cancel')}
              </button>
              <button
                type="button"
                className="clickSeparateModal"
                onClick={handleExportToWord}
              >
                {t('home.separateOptions.modal.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeparateOptions
