import { useState, useMemo } from 'react'
import { FaFileAlt, FaPlus } from 'react-icons/fa'
import {
  DocumentSettingsPanel,
  AdditionalSettingsPanel,
  DocumentHistoryTable,
  NewDocumentModal,
} from '../../components/components'
import './CreateDocument.css'


const RASMIY_XAT_FIELDS = [
  { key: 'SARLAVHA', label: 'Sarlavha', type: 'text' },
  { key: 'MATN', label: 'Matn', type: 'richtext' },
  { key: 'MUALLIF', label: 'Muallif', type: 'text' },
  { key: 'SANA', label: 'Sana', type: 'date' },
]

const ARIZA_FIELDS = [
  { key: 'FISH', label: 'F.I.Sh.', type: 'text' },
  { key: 'LAVOZIM', label: 'Lavozim', type: 'text' },
  { key: 'BOLIM', label: "Bo'lim", type: 'text' },
  { key: 'TATIL_BOSHLANISH', label: "Ta'til boshlanish sanasi", type: 'date' },
  { key: 'TATIL_TUGASH', label: "Ta'til tugash sanasi", type: 'date' },
  { key: 'SABAB', label: 'Sabab', type: 'richtext' },
]

const BLANK_FIELDS = [
  { key: 'SARLAVHA', label: 'Sarlavha', type: 'text' },
  { key: 'MATN', label: 'Matn', type: 'richtext' },
]

export const GALLERY_TEMPLATES = [
  {
    id: 'rasmiy-xat',
    name: 'Rasmiy xat',
    fields: RASMIY_XAT_FIELDS,
    bodyHtml:
      '<h2 class="prevTitle">{{SARLAVHA}}</h2><p class="prevBody">{{MATN}}</p><div class="prevSignature"><b>{{MUALLIF}}</b><br/>{{SANA}}</div>',
  },
  {
    id: 'tashakkurnoma',
    name: 'Tashakkurnoma',
    fields: RASMIY_XAT_FIELDS,
    bodyHtml:
      '<h2 class="prevTitle">{{SARLAVHA}}</h2><p class="prevBody">{{MATN}}</p><div class="prevSignature"><b>{{MUALLIF}}</b><br/>{{SANA}}</div>',
  },
  {
    id: 'kadrlar-ariza',
    name: 'Kadrlar uchun ariza',
    fields: ARIZA_FIELDS,
    bodyHtml:
      '<h2 class="prevTitle">ARIZA</h2>' +
      '<p class="prevBody">F.I.Sh.: {{FISH}}</p>' +
      '<p class="prevBody">Lavozim: {{LAVOZIM}}</p>' +
      '<p class="prevBody">Bo\'lim: {{BOLIM}}</p>' +
      '<p class="prevBody">Boshlanish sanasi: {{TATIL_BOSHLANISH}}</p>' +
      '<p class="prevBody">Tugash sanasi: {{TATIL_TUGASH}}</p>' +
      '<p class="prevBody">Sabab: {{SABAB}}</p>',
  },
  {
    id: 'shartnoma',
    name: 'Shartnoma',
    fields: RASMIY_XAT_FIELDS,
    bodyHtml:
      '<h2 class="prevTitle">{{SARLAVHA}}</h2><p class="prevBody">{{MATN}}</p><div class="prevSignature"><b>{{MUALLIF}}</b><br/>{{SANA}}</div>',
  },
]

export const BLANK_TEMPLATE = {
  id: 'blank',
  name: "Bo'sh hujjat",
  fields: BLANK_FIELDS,
  bodyHtml:
    '<h2 class="prevTitle">{{SARLAVHA}}</h2><p class="prevBody">{{MATN}}</p>',
}

function defaultValuesFor(template) {
  const values = {}
  template.fields.forEach((f) => {
    values[f.key] = ''
  })
  return values
}

const CreateDocument = () => {
  const [templates, setTemplates] = useState(GALLERY_TEMPLATES)
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    GALLERY_TEMPLATES[0].id,
  )
  const selectedTemplate = useMemo(
    () =>
      templates.find((t) => t.id === selectedTemplateId) ||
      GALLERY_TEMPLATES[0],
    [templates, selectedTemplateId],
  )

  const [documentName, setDocumentName] = useState('Rahmat xati')
  const [fieldValues, setFieldValues] = useState(() =>
    defaultValuesFor(GALLERY_TEMPLATES[0]),
  )

  function handleSelectTemplate(templateId) {
    const tpl = templates.find((t) => t.id === templateId) || BLANK_TEMPLATE
    setSelectedTemplateId(templateId)
    setFieldValues(defaultValuesFor(tpl))
    setDocumentName(tpl.id === 'blank' ? 'Yangi hujjat' : tpl.name)
  }

  function handleSelectBlank() {
    setTemplates((prev) =>
      prev.find((t) => t.id === 'blank') ? prev : [BLANK_TEMPLATE, ...prev],
    )
    handleSelectTemplate('blank')
  }

  // ===== Qo'shimcha sozlamalar =====
  const [logoFile, setLogoFile] = useState(null)
  const [headerOn, setHeaderOn] = useState(true)
  const [footerOn, setFooterOn] = useState(true)
  const [pageNumOn, setPageNumOn] = useState(true)
  const [headerOrgName, setHeaderOrgName] = useState('')
  const [headerPhone, setHeaderPhone] = useState('')
  const [footerText, setFooterText] = useState('')
  const [pageNumPosition, setPageNumPosition] = useState('bottom-right')
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  const [outputFormat, setOutputFormat] = useState('docx')
  const [pdfQuality, setPdfQuality] = useState('standard')

  const [showNewDocModal, setShowNewDocModal] = useState(false)

  const [history, setHistory] = useState([])
  const [generatedResult, setGeneratedResult] = useState(null)

  function handleGenerated(entry) {
    setHistory((prev) => [entry, ...prev])
    setGeneratedResult(entry)
  }

  function handleDeleteHistory(id) {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="CreateDocument">
      <div className="cdHeader">
        <div className="cdHeaderLeft">
          <span className="cdHeaderIcon">
            <FaFileAlt />
          </span>
          <div>
            <h1>Hujjat yaratish</h1>
            <p>
              Yangi hujjat yaratish, shablonlardan foydalanish va professional
              ko'rinishda tayyorlash
            </p>
          </div>
        </div>
        <button
          type="button"
          className="cdNewDocButton"
          onClick={() => setShowNewDocModal(true)}
        >
          <FaPlus />
          <span>Yangi hujjat yaratish</span>
        </button>
      </div>

      <div className="cdGrid">
        <DocumentSettingsPanel
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleSelectTemplate}
          documentName={documentName}
          setDocumentName={setDocumentName}
          fieldValues={fieldValues}
          setFieldValues={setFieldValues}
        />

        <AdditionalSettingsPanel
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          headerOn={headerOn}
          setHeaderOn={setHeaderOn}
          footerOn={footerOn}
          setFooterOn={setFooterOn}
          pageNumOn={pageNumOn}
          setPageNumOn={setPageNumOn}
          headerOrgName={headerOrgName}
          setHeaderOrgName={setHeaderOrgName}
          headerPhone={headerPhone}
          setHeaderPhone={setHeaderPhone}
          footerText={footerText}
          setFooterText={setFooterText}
          pageNumPosition={pageNumPosition}
          setPageNumPosition={setPageNumPosition}
          pageSize={pageSize}
          setPageSize={setPageSize}
          orientation={orientation}
          setOrientation={setOrientation}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          pdfQuality={pdfQuality}
          setPdfQuality={setPdfQuality}
          documentName={documentName}
          selectedTemplate={selectedTemplate}
          fieldValues={fieldValues}
          generatedResult={generatedResult}
          onGenerated={handleGenerated}
        />

        <DocumentHistoryTable
          history={history}
          onDelete={handleDeleteHistory}
        />
      </div>

      {showNewDocModal && (
        <NewDocumentModal
          onClose={() => setShowNewDocModal(false)}
          onUseTemplate={() => setShowNewDocModal(false)}
          onUseBlank={() => {
            handleSelectBlank()
            setShowNewDocModal(false)
          }}
        />
      )}
    </div>
  )
}

export default CreateDocument
