import { useState } from 'react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaLink,
} from 'react-icons/fa'
import {LivePreview} from '../../components'

const TABS = ['Asosiy', 'Header/Footer', "Qo'shimcha", 'Uslub']

const DocumentSettingsPanel = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  documentName,
  setDocumentName,
  fieldValues,
  setFieldValues,
}) => {
  const [activeTab, setActiveTab] = useState('Asosiy')

  function updateField(key, value) {
    setFieldValues((prev) => ({ ...prev, [key]: value }))
  }

  // Oddiy formatlash: tanlangan matnni **/__/*.. bilan o'raydi (demo darajasida)
  function wrapSelection(key, wrapper) {
    const textarea = document.getElementById(`field-${key}`)
    if (!textarea) return
    const { selectionStart, selectionEnd, value } = textarea
    const selected = value.slice(selectionStart, selectionEnd) || 'matn'
    const newValue =
      value.slice(0, selectionStart) +
      wrapper[0] +
      selected +
      wrapper[1] +
      value.slice(selectionEnd)
    updateField(key, newValue)
  }

  return (
    <div className="documentSettingsPanel">
      <h3 className="settingsPanelTitle">Hujjatni sozlash</h3>

      <div className="settingsTabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== 'Asosiy' && (
        <p className="tabComingSoon">
          "{activeTab}" bo'limi keyingi bosqichda qo'shiladi. Hozircha logo /
          header / footer sozlamalarini o'ng paneldan ("Qo'shimcha sozlamalar")
          boshqarishingiz mumkin.
        </p>
      )}

      {activeTab === 'Asosiy' && (
        <div className="settingsPanelBody">
          <div className="settingsFormColumn">
            <div className="formSectionLabel">Hujjat ma'lumotlari</div>

            <div className="formField">
              <label>Hujjat nomi:</label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div className="formField">
              <label>Shablon:</label>
              <select
                value={selectedTemplate.id}
                onChange={(e) => onSelectTemplate(e.target.value)}
              >
                {templates
                  .filter((t) => t.id !== 'blank')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                {selectedTemplate.id === 'blank' && (
                  <option value="blank">Bo'sh hujjat</option>
                )}
              </select>
            </div>

            <div className="formSectionLabel">Shablon maydonlari</div>

            {selectedTemplate.fields.map((field) => (
              <div className="formField" key={field.key}>
                <label>{field.label}:</label>

                {field.type === 'date' && (
                  <input
                    type="date"
                    value={fieldValues[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                  />
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={fieldValues[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                  />
                )}

                {field.type === 'richtext' && (
                  <div className="richTextField">
                    <div className="richTextToolbar">
                      <button
                        type="button"
                        onClick={() => wrapSelection(field.key, ['**', '**'])}
                      >
                        <FaBold />
                      </button>
                      <button
                        type="button"
                        onClick={() => wrapSelection(field.key, ['*', '*'])}
                      >
                        <FaItalic />
                      </button>
                      <button
                        type="button"
                        onClick={() => wrapSelection(field.key, ['__', '__'])}
                      >
                        <FaUnderline />
                      </button>
                      <button type="button">
                        <FaListUl />
                      </button>
                      <button type="button">
                        <FaListOl />
                      </button>
                      <button type="button">
                        <FaAlignLeft />
                      </button>
                      <button type="button">
                        <FaLink />
                      </button>
                    </div>
                    <textarea
                      id={`field-${field.key}`}
                      className="richTextArea"
                      rows={4}
                      value={fieldValues[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="settingsPreviewColumn">
            <LivePreview
              documentName={documentName}
              template={selectedTemplate}
              fieldValues={fieldValues}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentSettingsPanel
