import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaFileAlt, FaPlus } from 'react-icons/fa'
import {
  DocumentSettingsPanel,
  AdditionalSettingsPanel,
  DocumentHistoryTable,
  NewDocumentModal,
} from '../../components/components'
import './CreateDocument.css'


const RASMIY_XAT_FIELDS = [
  { key: 'SARLAVHA', labelKey: 'sarlavha', type: 'text' },
  { key: 'MATN', labelKey: 'matn', type: 'richtext' },
  { key: 'MUALLIF', labelKey: 'muallif', type: 'text' },
  { key: 'SANA', labelKey: 'sana', type: 'date' },
]

const ARIZA_FIELDS = [
  { key: 'FISH', labelKey: 'fish', type: 'text' },
  { key: 'LAVOZIM', labelKey: 'lavozim', type: 'text' },
  { key: 'BOLIM', labelKey: 'bolim', type: 'text' },
  { key: 'TATIL_BOSHLANISH', labelKey: 'tatilBoshlanish', type: 'date' },
  { key: 'TATIL_TUGASH', labelKey: 'tatilTugash', type: 'date' },
  { key: 'SABAB', labelKey: 'sabab', type: 'richtext' },
]

const BLANK_FIELDS = [
  { key: 'SARLAVHA', labelKey: 'sarlavha', type: 'text' },
  { key: 'MATN', labelKey: 'matn', type: 'richtext' },
]

const RASMIY_XAT_BODY_HTML =
  '<h2 class="prevTitle">{{SARLAVHA}}</h2><p class="prevBody">{{MATN}}</p><div class="prevSignature"><b>{{MUALLIF}}</b><br/>{{SANA}}</div>'

// Kadrlar uchun ariza shablonining tanasi statik matnlarni o'z ichiga olgani
// uchun (masalan "F.I.Sh.:", "Lavozim:"), uni tarjima funksiyasi (t) orqali
// dinamik tuzamiz. {{PLACEHOLDER}} tokenlari o'zgarmasdan qoladi.
function buildArizaBodyHtml(t) {
  return (
    `<h2 class="prevTitle">${t('createDocument.preview.arizaTitle')}</h2>` +
    `<p class="prevBody">${t('createDocument.preview.fishLabel')}: {{FISH}}</p>` +
    `<p class="prevBody">${t('createDocument.preview.lavozimLabel')}: {{LAVOZIM}}</p>` +
    `<p class="prevBody">${t('createDocument.preview.bolimLabel')}: {{BOLIM}}</p>` +
    `<p class="prevBody">${t('createDocument.preview.boshlanishSanasiLabel')}: {{TATIL_BOSHLANISH}}</p>` +
    `<p class="prevBody">${t('createDocument.preview.tugashSanasiLabel')}: {{TATIL_TUGASH}}</p>` +
    `<p class="prevBody">${t('createDocument.preview.sababLabel')}: {{SABAB}}</p>`
  )
}

// Shablon "ta'riflari" — tarjima qilinmaydigan (id, key, type) va tarjima
// kaliti (nameKey / labelKey) saqlanadi. Haqiqiy matnlar komponent ichida
// t() yordamida hosil qilinadi (RAW_* massivlar module darajasida bo'lgani
// uchun bu yerda t() chaqira olmaymiz).
const RAW_TEMPLATES = [
  {
    id: 'rasmiy-xat',
    nameKey: 'rasmiyXat',
    fields: RASMIY_XAT_FIELDS,
    buildBodyHtml: () => RASMIY_XAT_BODY_HTML,
  },
  {
    id: 'tashakkurnoma',
    nameKey: 'tashakkurnoma',
    fields: RASMIY_XAT_FIELDS,
    buildBodyHtml: () => RASMIY_XAT_BODY_HTML,
  },
  {
    id: 'kadrlar-ariza',
    nameKey: 'kadrlarAriza',
    fields: ARIZA_FIELDS,
    buildBodyHtml: buildArizaBodyHtml,
  },
  {
    id: 'shartnoma',
    nameKey: 'shartnoma',
    fields: RASMIY_XAT_FIELDS,
    buildBodyHtml: () => RASMIY_XAT_BODY_HTML,
  },
]

const RAW_BLANK_TEMPLATE = {
  id: 'blank',
  nameKey: 'blank',
  fields: BLANK_FIELDS,
  buildBodyHtml: () =>
    '<h2 class="prevTitle">{{SARLAVHA}}</h2><p class="prevBody">{{MATN}}</p>',
}

function translateTemplate(raw, t) {
  return {
    id: raw.id,
    name: t(`createDocument.templates.${raw.nameKey}.name`),
    fields: raw.fields.map((f) => ({
      key: f.key,
      type: f.type,
      label: t(`createDocument.fields.${f.labelKey}`),
    })),
    bodyHtml: raw.buildBodyHtml(t),
  }
}

function defaultValuesFor(template) {
  const values = {}
  template.fields.forEach((f) => {
    values[f.key] = ''
  })
  return values
}

const CreateDocument = () => {
  const { t } = useTranslation()

  const galleryTemplates = useMemo(
    () => RAW_TEMPLATES.map((raw) => translateTemplate(raw, t)),
    [t],
  )
  const blankTemplate = useMemo(
    () => translateTemplate(RAW_BLANK_TEMPLATE, t),
    [t],
  )

  const [templates, setTemplates] = useState(galleryTemplates)
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    galleryTemplates[0].id,
  )

  // Til o'zgarganda (yoki ilova birinchi marta yuklanganda) shablonlar
  // ro'yxatidagi nom/label matnlarini yangi tarjimalar bilan yangilaymiz,
  // "bo'sh hujjat" shabloni tanlangan bo'lsa uni ham saqlab qolamiz.
  useEffect(() => {
    setTemplates((prev) =>
      prev.map((tpl) => {
        if (tpl.id === blankTemplate.id) return blankTemplate
        return galleryTemplates.find((g) => g.id === tpl.id) || tpl
      }),
    )
  }, [galleryTemplates, blankTemplate])

  const selectedTemplate = useMemo(
    () =>
      templates.find((tpl) => tpl.id === selectedTemplateId) ||
      galleryTemplates[0],
    [templates, selectedTemplateId, galleryTemplates],
  )

  const [documentName, setDocumentName] = useState(() =>
    t('createDocument.defaultDocumentName'),
  )
  const [fieldValues, setFieldValues] = useState(() =>
    defaultValuesFor(galleryTemplates[0]),
  )

  function handleSelectTemplate(templateId) {
    const tpl =
      templates.find((item) => item.id === templateId) || blankTemplate
    setSelectedTemplateId(templateId)
    setFieldValues(defaultValuesFor(tpl))
    setDocumentName(
      tpl.id === 'blank' ? t('createDocument.newDocumentName') : tpl.name,
    )
  }

  function handleSelectBlank() {
    setTemplates((prev) =>
      prev.find((item) => item.id === 'blank') ? prev : [blankTemplate, ...prev],
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
            <h1>{t('createDocument.header.title')}</h1>
            <p>{t('createDocument.header.subtitle')}</p>
          </div>
        </div>
        <button
          type="button"
          className="cdNewDocButton"
          onClick={() => setShowNewDocModal(true)}
        >
          <FaPlus />
          <span>{t('createDocument.header.newDocButton')}</span>
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
