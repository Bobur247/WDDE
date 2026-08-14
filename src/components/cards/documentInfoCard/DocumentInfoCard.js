import { useState, useRef } from 'react'
import {
  FaFileAlt,
  FaFileWord,
  FaCloudUploadAlt,
  FaFolderOpen,
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const DocumentInfoCard = ({
  file,
  docInfo,
  analyzing,
  onFileSelected,
  onRemoveFile,
}) => {
  const { t } = useTranslation()
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef(null)

  function handleChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    if (!selected.name.toLowerCase().endsWith('.docx')) {
      alert(t('informationAllocation.documentInfo.docxOnlyAlert'))
      return
    }
    onFileSelected(selected)
    setShowMenu(false)
  }

  return (
    <div className="settingsCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>{t('informationAllocation.documentInfo.title')}</h3>
      </div>

      {!file ? (
        <div className="docInfoDropzone">
          <FaCloudUploadAlt className="docInfoDropzoneIcon" />
          <p>{t('informationAllocation.documentInfo.dropzoneText')}</p>
          <input
            ref={inputRef}
            type="file"
            id="iaFileInput"
            accept=".docx"
            hidden
            onChange={handleChange}
          />
          <label htmlFor="iaFileInput" className="chooseFileButton">
            <FaFolderOpen />
            <span>{t('informationAllocation.documentInfo.chooseFile')}</span>
          </label>
        </div>
      ) : (
        <>
          <div className="docInfoFileRow">
            <span className="docInfoFileIcon">
              <FaFileWord />
            </span>
            <div className="docInfoFileText">
              <p className="docInfoFileName">{file.name}</p>
              <p className="docInfoFileSize">
                {docInfo ? docInfo.sizeLabel : '...'}
              </p>
            </div>
            <div className="docInfoMenuWrapper">
              <button
                type="button"
                className="docInfoMenuButton"
                onClick={() => setShowMenu((v) => !v)}
              >
                ...
              </button>
              {showMenu && (
                <div className="docInfoDropdownMenu">
                  <label htmlFor="iaFileInput">{t('informationAllocation.documentInfo.replaceFile')}</label>
                  <input
                    ref={inputRef}
                    type="file"
                    id="iaFileInput"
                    accept=".docx"
                    hidden
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => onFileSelected(file)}>
                    {t('informationAllocation.documentInfo.reupload')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false)
                      alert(
                        t('informationAllocation.documentInfo.fileInfoAlert', {
                          name: file.name,
                          size: docInfo?.sizeLabel,
                          type: file.type || 'DOCX',
                        }),
                      )
                    }}
                  >
                    {t('informationAllocation.documentInfo.fileInfo')}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      setShowMenu(false)
                      onRemoveFile()
                    }}
                  >
                    {t('informationAllocation.documentInfo.removeFile')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {analyzing && (
            <p className="docInfoAnalyzing">{t('informationAllocation.documentInfo.analyzing')}</p>
          )}

          {!analyzing && docInfo && (
            <div className="docInfoStats">
              <div className="docInfoStatRow">
                <span>{t('informationAllocation.documentInfo.pages')}</span>
                <span>{docInfo.pages}</span>
              </div>
              <div className="docInfoStatRow">
                <span>{t('informationAllocation.documentInfo.paragraphs')}</span>
                <span>{docInfo.paragraphs}</span>
              </div>
              <div className="docInfoStatRow">
                <span>{t('informationAllocation.documentInfo.tables')}</span>
                <span>{docInfo.tables}</span>
              </div>
              <div className="docInfoStatRow">
                <span>{t('informationAllocation.documentInfo.images')}</span>
                <span>{docInfo.images}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DocumentInfoCard
