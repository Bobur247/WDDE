import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaDesktop, FaMobileAlt, FaPrint } from 'react-icons/fa'

// **qalin**, *qiya*, __tagiga chizilgan__ ni oddiy HTML'ga aylantiradi (demo formatlash)
function applyPseudoMarkup(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
    .replace(/\n/g, '<br/>')
}

function renderBody(bodyHtml, fieldValues) {
  let result = bodyHtml
  Object.entries(fieldValues).forEach(([key, value]) => {
    const display = value
      ? applyPseudoMarkup(value)
      : `<span class="prevEmpty">…</span>`
    result = result.replaceAll(`{{${key}}}`, display)
  })
  return result
}

const LivePreview = ({ documentName, template, fieldValues }) => {
  const { t } = useTranslation()
  const [device, setDevice] = useState('desktop')
  const paperRef = useRef(null)

  // Faqat preview qog'ozini (butun sahifani emas) yangi oynada ochib chop etadi
  function handlePrint() {
    const content = paperRef.current?.innerHTML || ''
    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${documentName || t('createDocument.livePreview.documentFallbackTitle')}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
            .prevWordIcon { display: none; }
            .prevDocName { text-align: center; margin-bottom: 20px; }
            .prevBodyWrapper { border: none; padding: 0; }
            .prevSignature { border-top: 1px solid #ccc; padding-top: 10px; margin-top: 14px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  function handleDeviceClick(mode) {
    if (mode === 'print') {
      handlePrint()
      return // print rejimi ko'rinishni o'zgartirmaydi, faqat chop etadi
    }
    setDevice(mode)
  }

  return (
    <div className="livePreviewBox">
      <div className="livePreviewHeader">
        <span>{t('createDocument.livePreview.label')}</span>
        <div className="livePreviewDeviceToggle">
          <button
            type="button"
            title={t('createDocument.livePreview.desktopTitle')}
            className={device === 'desktop' ? 'active' : ''}
            onClick={() => handleDeviceClick('desktop')}
          >
            <FaDesktop />
          </button>
          <button
            type="button"
            title={t('createDocument.livePreview.mobileTitle')}
            className={device === 'mobile' ? 'active' : ''}
            onClick={() => handleDeviceClick('mobile')}
          >
            <FaMobileAlt />
          </button>
          <button
            type="button"
            title={t('createDocument.livePreview.printTitle')}
            onClick={() => handleDeviceClick('print')}
          >
            <FaPrint />
          </button>
        </div>
      </div>

      <div className={`livePreviewPaper ${device}`} ref={paperRef}>
        <div className="prevWordIcon">W</div>
        <h1 className="prevDocName">
          {documentName || t('createDocument.livePreview.untitledDocument')}
        </h1>
        <div
          className="prevBodyWrapper"
          dangerouslySetInnerHTML={{
            __html: renderBody(template.bodyHtml, fieldValues),
          }}
        />
      </div>
    </div>
  )
}

export default LivePreview
