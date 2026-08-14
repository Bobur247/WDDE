import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

// Kategoriya RO'YXATI (id + icon) — nomlar tarjima kaliti orqali
// render vaqtida hisoblanadi, count esa pastda templates massividan
// avtomatik hisoblanadi
const CATEGORY_DEFS = [
  { id: 'biznes', icon: FaBriefcase },
  { id: 'talim', icon: FaGraduationCap },
  { id: 'shaxsiy', icon: FaUser },
  { id: 'huquqiy', icon: FaGavel },
  { id: 'texnik', icon: FaCog },
  { id: 'boshqalar', icon: FaEllipsisH },
]

// DEMO uchun shablonlar — haqiqiy loyihada backenddan keladi.
// Matnli maydonlar (name/description/previewTitle) tarjima kaliti
// orqali render vaqtida hisoblanadi (pastga qarang).
const MOCK_TEMPLATES = [
  {
    id: 1,
    key: 'template1',
    categoryId: 'biznes',
    badgeColor: 'blue',
    language: "O'zbekcha",
    previewIcon: FaFileAlt,
    previewTheme: 'light',
  },
  {
    id: 2,
    key: 'template2',
    categoryId: 'shaxsiy',
    badgeColor: 'green',
    language: "O'zbekcha",
    previewIcon: FaUserCircle,
    previewTheme: 'light',
  },
  {
    id: 3,
    key: 'template3',
    categoryId: 'biznes',
    badgeColor: 'blue',
    language: "O'zbekcha",
    previewIcon: FaBuilding,
    previewTheme: 'gradient',
  },
  {
    id: 4,
    key: 'template4',
    categoryId: 'talim',
    badgeColor: 'purple',
    language: "O'zbekcha",
    previewIcon: FaBook,
    previewTheme: 'light',
  },
  {
    id: 5,
    key: 'template5',
    categoryId: 'huquqiy',
    badgeColor: 'orange',
    language: "O'zbekcha",
    previewIcon: FaBalanceScale,
    previewTheme: 'light',
  },
  {
    id: 6,
    key: 'template6',
    categoryId: 'biznes',
    badgeColor: 'blue',
    language: "O'zbekcha",
    previewIcon: FaChartBar,
    previewTheme: 'light',
  },
]

const Templates = () => {
  const { t, i18n } = useTranslation()

  // Foydalanuvchi qo'shgan shablonlar (haqiqiy matn bilan, tarjima talab qilmaydi)
  const [customTemplates, setCustomTemplates] = useState([])
  // O'chirilgan demo (mock) shablonlarning id'lari
  const [deletedMockIds, setDeletedMockIds] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const [showAddModal, setShowAddModal] = useState(false)
  const [viewingTemplate, setViewingTemplate] = useState(null)
  const [deletingTemplate, setDeletingTemplate] = useState(null)

  // Demo shablonlar tili UI tiliga qarab o'zgarganda ham qayta tarjima qilinadi
  const translatedMockTemplates = useMemo(
    () =>
      MOCK_TEMPLATES.filter((item) => !deletedMockIds.includes(item.id)).map(
        (item) => ({
          ...item,
          name: t(`templates.mock.${item.key}.name`),
          categoryLabel: t(`templates.categories.${item.categoryId}`),
          description: t(`templates.mock.${item.key}.description`),
          previewTitle: t(`templates.mock.${item.key}.previewTitle`),
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language, deletedMockIds],
  )

  const templates = useMemo(
    () => [...customTemplates, ...translatedMockTemplates],
    [customTemplates, translatedMockTemplates],
  )

  // Kategoriya sonlari HAQIQIY templates massividan hisoblanadi —
  // qattiq yozilgan raqamlar emas
  const categories = useMemo(() => {
    const all = {
      id: 'all',
      name: t('templates.categories.all'),
      count: templates.length,
      icon: FaFileAlt,
    }
    const rest = CATEGORY_DEFS.map((def) => ({
      ...def,
      name: t(`templates.categories.${def.id}`),
      count: templates.filter((tpl) => tpl.categoryId === def.id).length,
    }))
    return [all, ...rest]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, t, i18n.language])

  const filteredTemplates = useMemo(() => {
    let result = [...templates]

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      result = result.filter(
        (tpl) =>
          tpl.name.toLowerCase().includes(q) ||
          tpl.categoryLabel.toLowerCase().includes(q),
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter((tpl) => tpl.categoryId === selectedCategory)
    }

    if (selectedLanguage !== 'all') {
      result = result.filter((tpl) => tpl.language === selectedLanguage)
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
    setCustomTemplates((prev) => [{ id: Date.now(), ...newTemplate }, ...prev])
    setShowAddModal(false)
  }

  function handleConfirmDelete() {
    const id = deletingTemplate.id
    if (customTemplates.some((tpl) => tpl.id === id)) {
      setCustomTemplates((prev) => prev.filter((tpl) => tpl.id !== id))
    } else {
      setDeletedMockIds((prev) => [...prev, id])
    }
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
            <h1>{t('templates.header.title')}</h1>
            <p>{t('templates.header.subtitle')}</p>
          </div>
        </div>
        <button
          type="button"
          className="addTemplateButton"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
          <span>{t('templates.header.addButton')}</span>
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
