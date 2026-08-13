import { useState, useRef } from 'react'
import {
  FaFileAlt,
  FaFileWord,
  FaCloudUploadAlt,
  FaFolderOpen,
} from 'react-icons/fa'

const DocumentInfoCard = ({
  file,
  docInfo,
  analyzing,
  onFileSelected,
  onRemoveFile,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef(null)

  function handleChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    if (!selected.name.toLowerCase().endsWith('.docx')) {
      alert('Faqat DOCX formatidagi fayl yuklash mumkin!')
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
        <h3>Hujjat ma'lumotlari</h3>
      </div>

      {!file ? (
        <div className="docInfoDropzone">
          <FaCloudUploadAlt className="docInfoDropzoneIcon" />
          <p>DOCX faylni yuklang</p>
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
            <span>Fayl tanlash</span>
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
                  <label htmlFor="iaFileInput">Faylni almashtirish</label>
                  <input
                    ref={inputRef}
                    type="file"
                    id="iaFileInput"
                    accept=".docx"
                    hidden
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => onFileSelected(file)}>
                    Faylni qayta yuklash
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false)
                      alert(
                        `Fayl: ${file.name}\nHajmi: ${docInfo?.sizeLabel}\nTuri: ${file.type || 'DOCX'}`,
                      )
                    }}
                  >
                    Fayl haqida ma'lumot
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      setShowMenu(false)
                      onRemoveFile()
                    }}
                  >
                    Faylni olib tashlash
                  </button>
                </div>
              )}
            </div>
          </div>

          {analyzing && (
            <p className="docInfoAnalyzing">Hujjat tahlil qilinmoqda...</p>
          )}

          {!analyzing && docInfo && (
            <div className="docInfoStats">
              <div className="docInfoStatRow">
                <span>Sahifalar:</span>
                <span>{docInfo.pages}</span>
              </div>
              <div className="docInfoStatRow">
                <span>Paragraflar:</span>
                <span>{docInfo.paragraphs}</span>
              </div>
              <div className="docInfoStatRow">
                <span>Jadvallar:</span>
                <span>{docInfo.tables}</span>
              </div>
              <div className="docInfoStatRow">
                <span>Rasmlar:</span>
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
