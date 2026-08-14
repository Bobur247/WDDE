import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const TAB_IDS = ['asosiy', 'headerFooter', 'qoshimcha', 'uslub']

const DocumentSettingsPanel = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  documentName,
  setDocumentName,
  fieldValues,
  setFieldValues,
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('asosiy')

  const tabs = TAB_IDS.map((id) => ({
    id,
    label: t(`createDocument.settingsPanel.tabs.${id}`),
  }))
  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || ''

  function updateField(key, value) {
    setFieldValues((prev) => ({ ...prev, [key]: value }))
  }

  // Oddiy formatlash: tanlangan matnni **/__/*.. bilan o'raydi (demo darajasida)
  function wrapSelection(key, wrapper) {
    const textarea = document.getElementById(`field-${key}`)
    if (!textarea) return
    const { selectionStart, selectionEnd, value } = textarea
    const selected =
      value.slice(selectionStart, selectionEnd) ||
      t('createDocument.settingsPanel.richText.placeholderWord')
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
      <h3 className="settingsPanelTitle">
        {t('createDocument.settingsPanel.title')}
      </h3>

      <div className="settingsTabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'asosiy' && (
        <p className="tabComingSoon">
          {t('createDocument.settingsPanel.tabComingSoon', {
            tab: activeTabLabel,
          })}
        </p>
      )}

      {activeTab === 'asosiy' && (
        <div className="settingsPanelBody">
          <div className="settingsFormColumn">
            <div className="formSectionLabel">
              {t('createDocument.settingsPanel.documentInfo')}
            </div>

            <div className="formField">
              <label>{t('createDocument.settingsPanel.documentNameLabel')}</label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div className="formField">
              <label>{t('createDocument.settingsPanel.templateLabel')}</label>
              <select
                value={selectedTemplate.id}
                onChange={(e) => onSelectTemplate(e.target.value)}
              >
                {templates
                  .filter((tpl) => tpl.id !== 'blank')
                  .map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                {selectedTemplate.id === 'blank' && (
                  <option value="blank">
                    {t('createDocument.templates.blank.name')}
                  </option>
                )}
              </select>
            </div>

            <div className="formSectionLabel">
              {t('createDocument.settingsPanel.templateFieldsLabel')}
            </div>

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
