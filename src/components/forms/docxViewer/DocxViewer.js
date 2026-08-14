import React from 'react'
import { useTranslation } from 'react-i18next'
import './DocxViewer.css'
const DocxViewer = ({
  isBox,
  loading,
  method,
  lines,
  rawText,
  selectedItems,
  toggleSelect,
  manualPending,
  setManualPending,
  extractedItems,
}) => {
  const { t } = useTranslation()

  function handleMouseUp() {
    if (method !== 'manual') return
    const selection = window.getSelection().toString()
    if (selection) setManualPending(selection)
  }

  return (
    <div className="DocxViewer">
      {!isBox && (
        <p className="docxViewerPlaceholder">
          {t('home.docxViewer.placeholder')}
        </p>
      )}

      {isBox && loading && <p>{t('home.docxViewer.loading')}</p>}

      {isBox && !loading && (
        <>
          {method === 'checkbox' && lines.length > 0 && (
            <div className="docxContent">
              <h4 className="SubtitleFileTopNavbar">
                {t('home.docxViewer.checkboxTitle')}
              </h4>
              <ul>
                {lines.map((line, index) => (
                  <li
                    key={index}
                    onClick={() => toggleSelect(line)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px',
                      backgroundColor: selectedItems.includes(line)
                        ? '#d1e7ff'
                        : 'transparent',
                      border: '1px solid #ddd',
                      marginBottom: '4px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(line)}
                      readOnly
                      style={{ marginRight: '8px' }}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {method === 'manual' && (
            <div className="docxContent">
              <h4 className="SubtitleFileTopNavbar">
                {t('home.docxViewer.manualTitle')}
              </h4>
              <pre className="manualText" onMouseUp={handleMouseUp}>
                {rawText}
              </pre>
              {manualPending && (
                <p className="manualPendingPreview">
                  <b>{t('home.docxViewer.manualPendingLabel')}</b>{' '}
                  {manualPending}
                </p>
              )}
            </div>
          )}

          {(method === 'block' ||
            method === 'keyword' ||
            method === 'regex' ||
            method === 'table') && (
            <div className="docxContent">
              <h4 className="SubtitleFileTopNavbar">
                {t('home.docxViewer.rawTextTitle')}
              </h4>
              <pre className="rawTextPreview">{rawText}</pre>
            </div>
          )}

          {extractedItems.length > 0 && (
            <div className="finalResults">
              <h4 className="SubtitleFileTopNavbar">
                {t('home.docxViewer.finalResultsTitle', {
                  count: extractedItems.length,
                })}
              </h4>
              <ol>
                {extractedItems.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DocxViewer
