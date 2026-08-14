import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FaTimes,
  FaFileWord,
  FaFolderOpen,
  FaImage,
  FaCheck,
  FaSave,
} from 'react-icons/fa'

const AddTemplateModal = ({ categories, onClose, onSave }) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [language, setLanguage] = useState("O'zbekcha")
  const [description, setDescription] = useState('')
  const [docxFile, setDocxFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

  const docxInputRef = useRef(null)
  const imageInputRef = useRef(null)

  function handleDocxChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    const validExt = ['.docx', '.pdf', '.xlsx', '.xls']
    const isValid = validExt.some((ext) =>
      selected.name.toLowerCase().endsWith(ext),
    )
    if (!isValid) {
      setError(t('templates.addModal.invalidFileType'))
      return
    }
    setError('')
    setDocxFile(selected)
  }

  function handleImageChange(e) {
    const selected = e.target.files[0]
    if (selected) setImageFile(selected)
  }

  function handleSubmit() {
    if (!name.trim() || !categoryId || !language || !docxFile) {
      setError(t('templates.addModal.requiredFields'))
      return
    }

    const category = categories.find((c) => c.id === categoryId)

    onSave({
      name: name.trim(),
      categoryId,
      categoryLabel: category?.name ?? '',
      badgeColor: 'blue',
      language,
      description,
      previewTitle: name.trim().toUpperCase(),
      previewIcon: FaFileWord,
      previewTheme: 'light',
      docxFile,
      imageFile,
    })
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalBox addTemplateModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalTopHeader">
          <div className="modalTopHeaderLeft">
            <span className="modalHeaderIcon">
              <FaFileWord />
            </span>
            <div>
              <h3>{t('templates.addModal.title')}</h3>
              <p>{t('templates.addModal.subtitle')}</p>
            </div>
          </div>
          <button type="button" className="modalCloseIcon" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="addTemplateGrid">
          <div className="addTemplateColumn">
            <div className="formField">
              <label>
                {t('templates.addModal.nameLabel')}{' '}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder={t('templates.addModal.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="formField">
              <label>
                {t('templates.addModal.categoryLabel')}{' '}
                <span className="required">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">
                  {t('templates.addModal.categoryPlaceholder')}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="formField">
              <label>
                {t('templates.addModal.languageLabel')}{' '}
                <span className="required">*</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="O'zbekcha">O'zbekcha</option>
                <option value="Ruscha">Ruscha</option>
                <option value="Inglizcha">Inglizcha</option>
              </select>
            </div>

            <div className="formField">
              <label>{t('templates.addModal.descriptionLabel')}</label>
              <textarea
                placeholder={t('templates.addModal.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="addTemplateColumn">
            <div className="formField">
              <label>
                {t('templates.addModal.fileLabel')}{' '}
                <span className="required">*</span>
              </label>

              {!docxFile ? (
                <div className="docxDropzone">
                  <FaFileWord className="docxDropzoneIcon" />
                  <p className="docxDropzoneTitle">
                    {t('templates.addModal.dropzoneTitle')}
                  </p>
                  <p className="docxDropzoneSubtitle">
                    {t('templates.addModal.dropzoneSubtitle')}
                  </p>
                  <input
                    ref={docxInputRef}
                    type="file"
                    id="addTemplateDocxInput"
                    accept=".docx,.pdf,.xlsx,.xls"
                    hidden
                    onChange={handleDocxChange}
                  />
                  <label
                    htmlFor="addTemplateDocxInput"
                    className="chooseFileButton"
                  >
                    <FaFolderOpen />
                    <span>{t('templates.addModal.chooseFile')}</span>
                  </label>
                  <p className="docxDropzoneHint">
                    {t('templates.addModal.dropzoneHint')}
                  </p>
                </div>
              ) : (
                <div className="docxSelectedBox">
                  <FaFileWord className="docxSelectedIcon" />
                  <span className="docxSelectedName">{docxFile.name}</span>
                  <FaCheck className="docxSelectedCheck" />
                </div>
              )}
            </div>

            <div className="formField">
              <label>{t('templates.addModal.imageLabel')}</label>
              <div className="imagePickerRow">
                <div className="imagePreviewBox">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt={t('templates.addModal.imagePreviewAlt')}
                      className="imagePreviewImg"
                    />
                  ) : (
                    <FaImage />
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  id="addTemplateImageInput"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="addTemplateImageInput"
                  className="chooseFileButton outline"
                >
                  <FaFolderOpen />
                  <span>{t('templates.addModal.chooseImage')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="modalError">{error}</p>}

        <div className="modalFooter">
          <button type="button" className="modalCancelButton" onClick={onClose}>
            <FaTimes />
            <span>{t('templates.addModal.cancel')}</span>
          </button>
          <button
            type="button"
            className="modalSaveButton"
            onClick={handleSubmit}
          >
            <FaSave />
            <span>{t('templates.addModal.save')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTemplateModal
