import { useState } from 'react'
import { FaFileAlt, FaChartBar, FaDownload } from 'react-icons/fa'

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
  const [openMenuBlockId, setOpenMenuBlockId] = useState(null)

  return (
    <div className="settingsCard extractedDataCard">
      <div className="settingsCardHeader">
        <span className="settingsCardIcon">
          <FaFileAlt />
        </span>
        <h3>Ajratilgan ma'lumotlar</h3>
        <span className="blockCountBadge">{blocks.length} ta blok</span>
      </div>

      <div className="blocksList">
        {blocks.length === 0 && (
          <p className="blocksEmpty">Hali hech narsa ajratilmagan</p>
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
                      Blokni o'chirish
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

            <p className="blockFieldCount">{block.fields.length} ta maydon</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="newBlockButton"
        onClick={onStartNewBlock}
      >
        + Yangi block boshlash
      </button>

      {stats.fieldCount > 0 && (
        <div className="previewMiniCard">
          <p className="previewMiniTitle">Preview</p>
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
            <span>Topildi:</span>
            <span>{stats.fieldCount} ta maydon</span>
          </div>
          <div className="statsMiniRow">
            <span>Belgilar:</span>
            <span>{stats.chars}</span>
          </div>
          <div className="statsMiniRow">
            <span>So'zlar:</span>
            <span>{stats.words}</span>
          </div>
        </div>
      </div>

      <p className="formatSectionTitle">Saqlash formatlari</p>
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
        <span>Yangi faylga saqlash</span>
      </button>
    </div>
  )
}

export default ExtractedDataCard
