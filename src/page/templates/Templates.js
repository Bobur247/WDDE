import { useState, useMemo } from 'react'
import {
  FaFileAlt,
  FaPlus,
  FaBriefcase,
  FaGraduationCap,
  FaUser,
  FaGavel,
  FaCog,
  FaEllipsisH,
  FaUserCircle,
  FaBalanceScale,
  FaChartBar,
  FaBook,
  FaBuilding,
} from 'react-icons/fa'
import {
  TemplateFilters,
  TemplateCategories,
  TemplateCards,
  AddTemplateModal,
  ViewTemplateModal,
  DeleteConfirmModal,
} from '../../components/components'
import './Templates.css'

// Kategoriya RO'YXATI (nom + icon) — count endi bu yerda YO'Q,
// u pastda templates massividan avtomatik hisoblanadi
const CATEGORY_DEFS = [
  { id: 'biznes', name: 'Biznes', icon: FaBriefcase },
  { id: 'talim', name: "Ta'lim", icon: FaGraduationCap },
  { id: 'shaxsiy', name: 'Shaxsiy', icon: FaUser },
  { id: 'huquqiy', name: 'Huquqiy', icon: FaGavel },
  { id: 'texnik', name: 'Texnik', icon: FaCog },
  { id: 'boshqalar', name: 'Boshqalar', icon: FaEllipsisH },
]

// DEMO uchun shablonlar — haqiqiy loyihada backenddan keladi
const MOCK_TEMPLATES = [
  {
    id: 1,
    name: 'Rasmiy xat',
    categoryId: 'biznes',
    categoryLabel: 'Biznes',
    badgeColor: 'blue',
    language: "O'zbekcha",
    description: 'Kompaniya va tashkilotlar uchun rasmiy xat shabloni',
    previewTitle: 'RASMIY XAT',
    previewIcon: FaFileAlt,
    previewTheme: 'light',
  },
  {
    id: 2,
    name: 'Ishga qabul qilish uchun rezyume',
    categoryId: 'shaxsiy',
    categoryLabel: 'Shaxsiy',
    badgeColor: 'green',
    language: "O'zbekcha",
    description: 'Professional rezyume shabloni',
    previewTitle: 'REZYUME',
    previewIcon: FaUserCircle,
    previewTheme: 'light',
  },
  {
    id: 3,
    name: 'Kompaniya taqdimoti',
    categoryId: 'biznes',
    categoryLabel: 'Biznes',
    badgeColor: 'blue',
    language: "O'zbekcha",
    description: 'Kompaniya taqdimoti uchun shablon',
    previewTitle: 'COMPANY PRESENTATION',
    previewIcon: FaBuilding,
    previewTheme: 'gradient',
  },
  {
    id: 4,
    name: 'Dars ishlanma',
    categoryId: 'talim',
    categoryLabel: "Ta'lim",
    badgeColor: 'purple',
    language: "O'zbekcha",
    description: "O'qituvchilar uchun dars ishlanma shabloni",
    previewTitle: 'DARS ISHLANMA',
    previewIcon: FaBook,
    previewTheme: 'light',
  },
  {
    id: 5,
    name: 'Shartnoma',
    categoryId: 'huquqiy',
    categoryLabel: 'Huquqiy',
    badgeColor: 'orange',
    language: "O'zbekcha",
    description: 'Huquqiy hujjatlar uchun shablon',
    previewTitle: 'SHARTNOMA',
    previewIcon: FaBalanceScale,
    previewTheme: 'light',
  },
  {
    id: 6,
    name: 'Hisobot',
    categoryId: 'biznes',
    categoryLabel: 'Biznes',
    badgeColor: 'blue',
    language: "O'zbekcha",
    description: 'Yillik yoki davriy hisobot shabloni',
    previewTitle: 'HISOBOT',
    previewIcon: FaChartBar,
    previewTheme: 'light',
  },
]

const Templates = () => {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const [showAddModal, setShowAddModal] = useState(false)
  const [viewingTemplate, setViewingTemplate] = useState(null)
  const [deletingTemplate, setDeletingTemplate] = useState(null)

  // Kategoriya sonlari HAQIQIY templates massividan hisoblanadi —
  // qattiq yozilgan raqamlar emas
  const categories = useMemo(() => {
    const all = {
      id: 'all',
      name: 'Barchasi',
      count: templates.length,
      icon: FaFileAlt,
    }
    const rest = CATEGORY_DEFS.map((def) => ({
      ...def,
      count: templates.filter((t) => t.categoryId === def.id).length,
    }))
    return [all, ...rest]
  }, [templates])

  const filteredTemplates = useMemo(() => {
    let result = [...templates]

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q),
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.categoryId === selectedCategory)
    }

    if (selectedLanguage !== 'all') {
      result = result.filter((t) => t.language === selectedLanguage)
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => b.id - a.id)
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => a.id - b.id)
    } else if (sortOrder === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [templates, searchTerm, selectedCategory, selectedLanguage, sortOrder])

  function handleAddTemplate(newTemplate) {
    setTemplates((prev) => [{ id: Date.now(), ...newTemplate }, ...prev])
    setShowAddModal(false)
  }

  function handleConfirmDelete() {
    setTemplates((prev) => prev.filter((t) => t.id !== deletingTemplate.id))
    setDeletingTemplate(null)
  }

  return (
    <div className="TemplatesPage">
      <div className="templatesHeader">
        <div className="headerLeft">
          <span className="headerIcon">
            <FaFileAlt />
          </span>
          <div>
            <h1>Shablonlar</h1>
            <p>Ish, ta'lim va biznes uchun tayyor Word hujjat shablonlari</p>
          </div>
        </div>
        <button
          type="button"
          className="addTemplateButton"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
          <span>Yangi shablon qo'shish</span>
        </button>
      </div>

      <TemplateFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="templatesBody">
        <TemplateCategories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <TemplateCards
          templates={filteredTemplates}
          viewMode={viewMode}
          onView={(tpl) => setViewingTemplate(tpl)}
          onDeleteRequest={(tpl) => setDeletingTemplate(tpl)}
        />
      </div>

      {showAddModal && (
        <AddTemplateModal
          categories={categories.filter((c) => c.id !== 'all')}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTemplate}
        />
      )}

      {viewingTemplate && (
        <ViewTemplateModal
          template={viewingTemplate}
          onClose={() => setViewingTemplate(null)}
        />
      )}

      {deletingTemplate && (
        <DeleteConfirmModal
          template={deletingTemplate}
          onCancel={() => setDeletingTemplate(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default Templates