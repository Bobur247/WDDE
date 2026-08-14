import React from 'react'
import mammoth from 'mammoth'
import { useTranslation } from 'react-i18next'
import './SelectFile.css'
import { FaFileWord } from 'react-icons/fa'
import { TiFolderOpen } from 'react-icons/ti'
import { CiCircleRemove } from 'react-icons/ci'

const SelectFile = ({
  file,
  setFile,
  error,
  setError,
  isBox,
  setBox,
  setRawText,
  setLines,
  setHtmlContent,
  setSelectedItems,
  loading,
  setLoading,
  onReset,
}) => {
  const { t } = useTranslation()

  async function handleFileChange(e) {
    const selectFile = e.target.files[0]
    if (!selectFile) return

    const isDocx =
      selectFile.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      selectFile.name.endsWith('.docx')

    if (!isDocx) {
      setError(t('home.selectFile.errorInvalidType'))
      setFile(null)
      e.target.value = ''
      return
    }

    setError('')
    setFile(selectFile)
    setBox(true)
    setLoading(true)
    onReset() 

    try {
      const arrayBuffer = await selectFile.arrayBuffer()

      const textResult = await mammoth.extractRawText({ arrayBuffer })
      const rawText = textResult.value
      const lines = rawText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      // Jadval strukturasini saqlab qolish uchun HTML ko'rinishi
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer })

      setRawText(rawText)
      setLines(lines)
      setHtmlContent(htmlResult.value)
      setSelectedItems([])
    } catch (err) {
      setError(t('home.selectFile.errorReadFailed'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function clickExit() {
    setFile(null)
    setBox(false)
    setRawText('')
    setLines([])
    setHtmlContent('')
    setSelectedItems([])
    setError('')
    onReset() 
  }

  return (
    <div className="SelectFile">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* 1-holat: fayl hali tanlanmagan */}
        <div className={`initial ${isBox ? 'hide' : ''}`}>
          <p className="selectFileIcon">
            <FaFileWord />
          </p>
          <h3>{t('home.selectFile.title')}</h3>
          <p className="selectFilesubtilte">
            {t('home.selectFile.subtitle')}
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            onChange={handleFileChange}
            type="file"
            id="selecteFile"
            accept=".docx"
            hidden
          />
          <div className="selectFileButtons">
            <label htmlFor="selecteFile" className="selectFileButtona">
              <TiFolderOpen />
              <span>{t('home.selectFile.chooseFile')}</span>
            </label>
          </div>
        </div>

        <div className={`mainFiles ${!isBox ? 'hide' : ''}`}>
          <div className="item SelectmainFileIcon">
            <FaFileWord className="SelectmainFileIcon1" />
            {file && (
              <p>
                <b>{t('home.selectFile.selectedFileLabel')}</b> {file.name}
              </p>
            )}
          </div>
          <div className="item SelectmainFileIconExit" onClick={clickExit}>
            <CiCircleRemove className="SelectmainFileIconExit1" />
            <p>{t('home.selectFile.cancelFile')}</p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SelectFile
