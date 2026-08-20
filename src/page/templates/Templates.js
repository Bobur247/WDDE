import { useState, useMemo, useEffect } from 'react'
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
} from 'react-icons/fa'
import {
  TemplateFilters,
  TemplateCategories,
  TemplateCards,
  AddTemplateModal,
  ViewTemplateModal,
  DeleteConfirmModal,
} from '../../components/components'
import {
  createTemplate,
  deleteTemplate,
  getCategories,
  getTemplates,
} from '../../api/templates'
import './Templates.css'

// Kategoriya RO'YXATI (id + icon) — nomlar tarjima kaliti orqali
// render vaqtida hisoblanadi, count esa pastda templates massividan
// avtomatik hisoblanadi
const CATEGORY_ICONS = [
  FaBriefcase,
  FaGraduationCap,
  FaUser,
  FaGavel,
  FaCog,
  FaEllipsisH,
]

const Templates = () => {
  const { t, i18n } = useTranslation()

  const [templates, setTemplates] = useState([])
  const [categoriesFromApi, setCategoriesFromApi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const [showAddModal, setShowAddModal] = useState(false)
  const [viewingTemplate, setViewingTemplate] = useState(null)
  const [deletingTemplate, setDeletingTemplate] = useState(null)

  async function loadTemplates() {
    setLoading(true)
    setError('')
    try {
      const [templateResponse, categoryResponse] = await Promise.all([
        getTemplates(),
        getCategories(),
      ])
      setTemplates((templateResponse?.data || []).map(normalizeTemplate))
      setCategoriesFromApi(categoryResponse?.data || [])
    } catch (err) {
      setError(err.message || "Shablonlarni yuklab bo'lmadi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function normalizeTemplate(item) {
    return {
      ...item,
      categoryId: item.category?.slug || item.category?.id,
      categoryLabel: item.category?.name || '',
      previewTitle: item.name,
      previewIcon: FaFileAlt,
      previewTheme: 'light',
      badgeColor: 'blue',
      fileName: `${item.name}.${item.file_format}`,
    }
  }

  // Kategoriya sonlari HAQIQIY templates massividan hisoblanadi —
  // qattiq yozilgan raqamlar emas
  const categories = useMemo(() => {
    const all = {
      id: 'all',
      name: t('templates.categories.all'),
      count: templates.length,
      icon: FaFileAlt,
    }
    const rest = categoriesFromApi.map((category, index) => ({
      id: category.slug || category.id,
      categoryId: category.id,
      name: category.name,
      count: category.count ?? 0,
      icon: CATEGORY_ICONS[index % CATEGORY_ICONS.length],
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

  async function handleAddTemplate(newTemplate) {
    const formData = new FormData()
    formData.append('name', newTemplate.name)
    formData.append('category_id', String(newTemplate.categoryId))
    formData.append('language', newTemplate.language)
    formData.append('description', newTemplate.description || '')
    formData.append('file', newTemplate.docxFile)
    if (newTemplate.imageFile) formData.append('image', newTemplate.imageFile)
    setSaving(true)
    try {
      await createTemplate(formData)
      setShowAddModal(false)
      await loadTemplates()
    } catch (err) {
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteTemplate(deletingTemplate.id)
      setTemplates((prev) =>
        prev.filter((tpl) => tpl.id !== deletingTemplate.id),
      )
      setDeletingTemplate(null)
      await loadTemplates()
    } catch (err) {
      setError(err.message || "Shablonni o'chirib bo'lmadi")
    }
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

      {loading && <p className="templateCardsEmpty">Yuklanmoqda...</p>}
      {!loading && error && <p className="templateCardsEmpty">{error}</p>}

      {!loading && !error && (
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
            onError={setError}
          />
        </div>
      )}

      {showAddModal && (
        <AddTemplateModal
          categories={categories
            .filter((c) => c.id !== 'all')
            .map((c) => ({ ...c, id: c.categoryId || c.id }))}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTemplate}
          saving={saving}
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
