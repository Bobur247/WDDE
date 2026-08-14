import { FaSearch, FaThLarge, FaListUl } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// Diqqat: bu yerdagi qiymatlar ("Barchasi" bundan mustasno) shablon
// hujjatining TILINI bildiruvchi ma'lumot qiymatlari (filtrlash uchun
// MOCK_TEMPLATES'dagi `language` maydoni bilan solishtiriladi), shuning
// uchun ular UI tiliga qarab tarjima qilinmaydi — faqat "Barchasi" varianti
// tarjima qilinadi.
const LANGUAGES = ['Barchasi', "O'zbekcha", 'Ruscha', 'Inglizcha']

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'templates.filters.sortNewest' },
  { value: 'oldest', labelKey: 'templates.filters.sortOldest' },
  { value: 'name', labelKey: 'templates.filters.sortByName' },
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
  const { t } = useTranslation()

  return (
    <div className="templateFilters">
      <div className="searchBox">
        <FaSearch className="searchIcon" />
        <input
          type="text"
          placeholder={t('templates.filters.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filterField">
        <label>{t('templates.filters.categoryLabel')}</label>
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
        <label>{t('templates.filters.languageLabel')}</label>
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
              {lang === 'Barchasi' ? t('templates.filters.allLanguages') : lang}
            </option>
          ))}
        </select>
      </div>

      <div className="filterField">
        <label>{t('templates.filters.sortLabel')}</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="viewToggle">
        <button
          type="button"
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
          aria-label={t('templates.filters.gridView')}
          title={t('templates.filters.gridView')}
        >
          <FaThLarge />
        </button>
        <button
          type="button"
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
          aria-label={t('templates.filters.listView')}
          title={t('templates.filters.listView')}
        >
          <FaListUl />
        </button>
      </div>
    </div>
  )
}

export default TemplateFilters
