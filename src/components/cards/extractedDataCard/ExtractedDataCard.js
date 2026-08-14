import { useState } from 'react'
import { FaFileAlt, FaChartBar, FaDownload } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const FORMATS = [
  { value: 'docx', label: 'DOCX' },
  { value: 'pdf', label: 'PDF' },
  { value: 'txt', label: 'TXT' },
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
]

const ExtractedDataCard = ({
  blocks,
  onToggleBlock,
  onDeleteBlock,
  onRenameBlock,
  onStartNewBlock,
  stats,
  saveFormat,
  setSaveFormat,
  onOpenSaveModal,
}) => {
  const { t } = useTranslation()
  const [openMenuBlockId, setOpenMenuBlockId] = useState(null)

  return (
    <div className="settingsCard extractedDataCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>{t('informationAllocation.extractedData.title')}</h3>
        <span className="blockCountBadge">{t('informationAllocation.extractedData.blockCount', { count: blocks.length })}</span>
      </div>

      <div className="blocksList">
        {blocks.length === 0 && (
          <p className="blocksEmpty">{t('informationAllocation.extractedData.empty')}</p>
        )}

        {blocks.map((block) => (
          <div className="blockCard" key={block.id}>
            <div className="blockCardHeader">
              <label className="blockCheckboxLabel">
                <input
                  type="checkbox"
                  checked={block.selected}
                  onChange={() => onToggleBlock(block.id)}
                />
                <input
                  type="text"
                  className="blockNameInput"
                  value={block.name}
                  onChange={(e) => onRenameBlock(block.id, e.target.value)}
                />
              </label>
              <div className="blockMenuWrapper">
                <button
                  type="button"
                  className="blockMenuButton"
                  onClick={() =>
                    setOpenMenuBlockId(
                      openMenuBlockId === block.id ? null : block.id,
                    )
                  }
                >
                  ⋮
                </button>
                {openMenuBlockId === block.id && (
                  <div className="blockDropdownMenu">
                    <button
                      type="button"
                      className="danger"
                      onClick={() => {
                        setOpenMenuBlockId(null)
                        onDeleteBlock(block.id)
                      }}
                    >
                      {t('informationAllocation.extractedData.deleteBlock')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {block.fields.map((f) => (
              <p className="blockFieldRow" key={f.id}>
                {f.label}
              </p>
            ))}

            <p className="blockFieldCount">{t('informationAllocation.extractedData.fieldCount', { count: block.fields.length })}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="newBlockButton"
        onClick={onStartNewBlock}
      >
        {t('informationAllocation.extractedData.newBlock')}
      </button>

      {stats.fieldCount > 0 && (
        <div className="previewMiniCard">
          <p className="previewMiniTitle">{t('informationAllocation.extractedData.previewTitle')}</p>
          {stats.selectedFields.map((f) => (
            <div className="previewMiniRow" key={f.id}>
              <span>{f.label}:</span>
              <span>{f.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="statsMiniCard">
        <span className="statsMiniIcon">
          <FaChartBar />
        </span>
        <div className="statsMiniRows">
          <div className="statsMiniRow">
            <span>{t('informationAllocation.extractedData.statsFound')}</span>
            <span>{t('informationAllocation.extractedData.fieldCount', { count: stats.fieldCount })}</span>
          </div>
          <div className="statsMiniRow">
            <span>{t('informationAllocation.extractedData.statsChars')}</span>
            <span>{stats.chars}</span>
          </div>
          <div className="statsMiniRow">
            <span>{t('informationAllocation.extractedData.statsWords')}</span>
            <span>{stats.words}</span>
          </div>
        </div>
      </div>

      <p className="formatSectionTitle">{t('informationAllocation.extractedData.formatSectionTitle')}</p>
      <div className="formatPillsGrid">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`formatPillButton ${saveFormat === f.value ? 'active' : ''}`}
            onClick={() => setSaveFormat(f.value)}
          >
            <FaFileAlt />
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="saveToFileButton"
        onClick={onOpenSaveModal}
        disabled={stats.fieldCount === 0}
      >
        <FaDownload />
        <span>{t('informationAllocation.extractedData.saveToFile')}</span>
      </button>
    </div>
  )
}

export default ExtractedDataCard
