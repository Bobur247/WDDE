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
  FaFileAlt,
  FaEye,
  FaDownload,
  FaTrash,
} from 'react-icons/fa'
import { LivePreview, ViewFileModal, DeleteRecordModal } from '../../components'
import { downloadDocumentFile } from '../../../api/documents'

const TAB_IDS = ['asosiy', 'yaratilganHujjatlar']

const DocumentSettingsPanel = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  documentName,
  setDocumentName,
  fieldValues,
  setFieldValues,
  history,
  onDelete,
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('asosiy')

  const tabs = TAB_IDS.map((id) => ({
    id,
    label: t(`createDocument.settingsPanel.tabs.${id}`),
  }))

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

      {activeTab === 'yaratilganHujjatlar' && (
        <CreatedDocumentsTab history={history} onDelete={onDelete} />
      )}
    </div>
  )
}

function CreatedDocumentsTab({ history, onDelete }) {
  const { t } = useTranslation()
  const [viewingDoc, setViewingDoc] = useState(null)
  const [deletingDoc, setDeletingDoc] = useState(null)

  async function handleDownload(doc) {
    try {
      const blob = await downloadDocumentFile(doc.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.fileName || doc.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Yuklab olishda xatolik:', err)
    }
  }

  async function handleView(doc) {
    try {
      const blob = await downloadDocumentFile(doc.id)
      setViewingDoc({ ...doc, blob })
    } catch (err) {
      console.error('Ko\'rishda xatolik:', err)
    }
  }

  async function handleDelete() {
    if (!deletingDoc) return
    try {
      await onDelete(deletingDoc.id)
      setDeletingDoc(null)
    } catch (err) {
      console.error("O'chirishda xatolik:", err)
    }
  }

  if (!history || history.length === 0) {
    return (
      <div className="createdDocsEmpty">
        <div className="createdDocsEmptyIcon">
          <FaFileAlt />
        </div>
        <p className="createdDocsEmptyTitle">
          {t('createDocument.settingsPanel.yaratilganHujjatlar.empty')}
        </p>
        <p className="createdDocsEmptySubtitle">
          {t('createDocument.settingsPanel.yaratilganHujjatlar.emptySubtitle')}
        </p>
      </div>
    )
  }

  return (
    <div className="createdDocumentCards">
      {history.map((doc) => (
        <div key={doc.id} className="createdDocumentCard">
          <div className="createdDocumentPreview">
            <FaFileAlt className="createdDocumentPreviewIcon" />
          </div>
          <div className="createdDocumentCardBody">
            <div className="createdDocumentCardTitleRow">
              <h4>{doc.fileName}</h4>
            </div>
            <p className="createdDocumentCardMeta">
              {doc.result || doc.typeLabel}
            </p>
            <p className="createdDocumentCardDate">
              Yaratilgan: {doc.date}
            </p>
            <p className="createdDocumentCardFormat">
              Format: <span className="formatBadge">{doc.format}</span>
            </p>
            <div className="createdDocumentCardActions">
              <button
                type="button"
                className="createdDocActionButton"
                onClick={() => handleView(doc)}
              >
                <FaEye />
                <span>{t('createDocument.history.actions.view')}</span>
              </button>
              <button
                type="button"
                className="createdDocActionButton primary"
                onClick={() => handleDownload(doc)}
              >
                <FaDownload />
                <span>{t('createDocument.history.actions.download')}</span>
              </button>
              <button
                type="button"
                className="createdDocActionButton danger"
                onClick={() => setDeletingDoc(doc)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}

      {viewingDoc && (
        <ViewFileModal
          record={viewingDoc}
          onClose={() => setViewingDoc(null)}
          fullScreen
        />
      )}

      {deletingDoc && (
        <DeleteRecordModal
          record={deletingDoc}
          onCancel={() => setDeletingDoc(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export default DocumentSettingsPanel
