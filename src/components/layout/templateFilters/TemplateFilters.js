import { FaSearch, FaThLarge, FaListUl } from 'react-icons/fa'

const LANGUAGES = ['Barchasi', "O'zbekcha", 'Ruscha', 'Inglizcha']

const SORT_OPTIONS = [
  { value: 'newest', label: 'Yangi avval' },
  { value: 'oldest', label: 'Eski avval' },
  { value: 'name', label: "Nomi bo'yicha" },
]

const TemplateFilters = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedLanguage,
  setSelectedLanguage,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="templateFilters">
      <div className="searchBox">
        <FaSearch className="searchIcon" />
        <input
          type="text"
          placeholder="Shablon nomi yoki kategoriya bo'yicha qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filterField">
        <label>Kategoriya</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filterField">
        <label>Tillar</label>
        <select
          value={selectedLanguage === 'all' ? 'Barchasi' : selectedLanguage}
          onChange={(e) =>
            setSelectedLanguage(
              e.target.value === 'Barchasi' ? 'all' : e.target.value,
            )
          }
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="filterField">
        <label>Tartib</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="viewToggle">
        <button
          type="button"
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
        >
          <FaThLarge />
        </button>
        <button
          type="button"
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
        >
          <FaListUl />
        </button>
      </div>
    </div>
  )
}

export default TemplateFilters
