import { useState, useMemo } from 'react'
import JSZip from 'jszip'
import { useTranslation } from 'react-i18next'
import { FaClock, FaFileArchive } from 'react-icons/fa'
import {
  ActivityStatsChart,
  HistoryFilters,
  HistoryTable,
  RecentActivity,
  StatCard,
  DeleteRecordModal,
  ViewFileModal,
} from '../../components/components'
import './History.css'

function daysAgo(n, hour, minute) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, minute, 0, 0)
  return d
}

// Demo yozuvlar: typeLabel/result matnlari render vaqtida t() bilan
// tarjima qilinadi (pastda useMemo ichida), shuning uchun bu yerda faqat
// tarjima kaliti (resultKey) va parametrlar (resultCount) saqlanadi.
const MOCK_RECORDS = [
  {
    id: 1,
    type: 'extraction',
    fileName: "Talabalar_ro'yxati.docx",
    date: daysAgo(0, 10, 24),
    status: 'success',
    resultKey: 'resultRecords',
    resultCount: 3,
  },
  {
    id: 2,
    type: 'conversion',
    fileName: 'Hisobot.pdf',
    date: daysAgo(1, 16, 45),
    status: 'success',
    resultKey: 'resultFiles',
    resultCount: 5,
  },
  {
    id: 3,
    type: 'document',
    fileName: 'Darslik.docx',
    date: daysAgo(2, 14, 32),
    status: 'success',
    resultKey: 'resultDocuments',
    resultCount: 1,
  },
  {
    id: 4,
    type: 'extraction',
    fileName: 'Maqola.docx',
    date: daysAgo(2, 9, 18),
    status: 'error',
    resultKey: 'keywordNotFound',
  },
  {
    id: 5,
    type: 'conversion',
    fileName: 'Foto.png',
    date: daysAgo(3, 18, 20),
    status: 'success',
    resultKey: 'resultFiles',
    resultCount: 1,
  },
  {
    id: 6,
    type: 'document',
    fileName: 'Taklif_noma.docx',
    date: daysAgo(3, 11, 5),
    status: 'success',
    resultKey: 'resultPages',
    resultCount: 2,
  },
  {
    id: 7,
    type: 'extraction',
    fileName: 'Xodimlar.xlsx',
    date: daysAgo(0, 8, 2),
    status: 'success',
    resultKey: 'resultRecords',
    resultCount: 12,
  },
  {
    id: 8,
    type: 'other',
    fileName: 'Skan.pdf',
    date: daysAgo(4, 12, 0),
    status: 'error',
    resultKey: 'fileCorrupted',
  },
  {
    id: 9,
    type: 'document',
    fileName: 'Ariza.docx',
    date: daysAgo(0, 9, 40),
    status: 'success',
    resultKey: 'resultDocuments',
    resultCount: 1,
  },
  {
    id: 10,
    type: 'conversion',
    fileName: 'Shartnoma.docx',
    date: daysAgo(5, 15, 10),
    status: 'success',
    resultKey: 'resultFiles',
    resultCount: 1,
  },
]

const TYPE_ORDER = ['extraction', 'conversion', 'document', 'other']
const TYPE_CHART_COLORS = {
  extraction: '#2563eb',
  conversion: '#a855f7',
  document: '#16a34a',
  other: '#f59e0b',
}

function isToday(date) {
  const now = new Date()
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

function formatDateForFileName(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

const HistoryReport = () => {
  const { t, i18n } = useTranslation()
  const [records, setRecords] = useState(MOCK_RECORDS)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [viewingRecord, setViewingRecord] = useState(null)
  const [deletingRecord, setDeletingRecord] = useState(null)
  const [exporting, setExporting] = useState(false)

  // MOCK_RECORDS'dagi type/resultKey kalitlari asosida joriy tilga
  // mos typeLabel/result matnlarini quradi (filtrlash mantig'iga tegmaydi).
  const translatedRecords = useMemo(() => {
    return records.map((r) => ({
      ...r,
      typeLabel: t(`history.types.${r.type}`),
      result:
        r.resultCount !== undefined
          ? t(`history.mock.${r.resultKey}`, { count: r.resultCount })
          : t(`history.mock.${r.resultKey}`),
    }))
  }, [records, t, i18n.language])

  const TYPE_FILTERS = useMemo(
    () => [
      { value: 'all', label: t('history.filters.allTypes') },
      ...TYPE_ORDER.map((type) => ({
        value: type,
        label: t(`history.types.${type}`),
      })),
    ],
    [t, i18n.language]
  )

  const STATUS_FILTERS = useMemo(
    () => [
      { value: 'all', label: t('history.filters.allStatuses') },
      { value: 'success', label: t('history.status.success') },
      { value: 'error', label: t('history.status.error') },
    ],
    [t, i18n.language]
  )

  const stats = useMemo(() => {
    const total = records.length
    const success = records.filter((r) => r.status === 'success').length
    const errors = records.filter((r) => r.status === 'error').length
    const today = records.filter((r) => isToday(r.date)).length
    return { total, success, errors, today }
  }, [records])

  const filteredRecords = useMemo(() => {
    return translatedRecords.filter((r) => {
      const matchesSearch =
        !search.trim() ||
        r.fileName.toLowerCase().includes(search.trim().toLowerCase())
      const matchesType = typeFilter === 'all' || r.type === typeFilter
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      const matchesFrom = !dateFrom || r.date >= new Date(dateFrom)
      const matchesTo = !dateTo || r.date <= new Date(`${dateTo}T23:59:59`)
      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesFrom &&
        matchesTo
      )
    })
  }, [translatedRecords, search, typeFilter, statusFilter, dateFrom, dateTo])

  const typeStats = useMemo(() => {
    const counts = { extraction: 0, conversion: 0, document: 0, other: 0 }
    records.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })
    return TYPE_ORDER.map((type) => ({
      key: type,
      label: t(`history.types.${type}`),
      value: counts[type],
      color: TYPE_CHART_COLORS[type],
    }))
  }, [records, t, i18n.language])

  const recentActivity = useMemo(() => {
    return [...translatedRecords].sort((a, b) => b.date - a.date).slice(0, 5)
  }, [translatedRecords])

  function handleDeleteRecord() {
    setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id))
    setDeletingRecord(null)
  }

  // Hamma (filtrlangan) hisobotni ZIP qilib, bugungi sana bilan yuklab beradi:
  // - Hisobot_<sana>.csv — jadval ma'lumotlari
  // - Fayllar/ papkasi ichida har bir yozuvning haqiqiy fayli (mavjud bo'lsa)
  async function handleExportReport() {
    setExporting(true)
    try {
      const zip = new JSZip()
      const todayStr = formatDateForFileName(new Date())

      const csvRows = [
        [
          t('history.table.headers.index'),
          t('history.table.headers.type'),
          t('history.table.headers.fileName'),
          t('history.table.headers.date'),
          t('history.table.headers.status'),
          t('history.table.headers.result'),
        ],
        ...filteredRecords.map((r, i) => [
          i + 1,
          r.typeLabel,
          r.fileName,
          r.date.toLocaleString('uz-UZ'),
          r.status === 'success'
            ? t('history.status.success')
            : t('history.status.error'),
          r.result,
        ]),
      ]
      const csv = csvRows
        .map((row) => row.map((c) => `"${c}"`).join(','))
        .join('\n')
      zip.file(`Hisobot_${todayStr}.csv`, '\uFEFF' + csv)

      const filesFolder = zip.folder('Fayllar')
      filteredRecords.forEach((r) => {
        if (r.blob) {
          filesFolder.file(r.fileName, r.blob)
        }
      })

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Hisobot_${todayStr}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="HistoryReportPage">
      <div className="hrHeader">
        <div className="hrHeaderLeft">
          <span className="hrHeaderIcon">
            <FaClock />
          </span>
          <div>
            <h1>{t('history.title')}</h1>
            <p>{t('history.subtitle')}</p>
          </div>
        </div>
        <button
          type="button"
          className="exportReportButton"
          onClick={handleExportReport}
          disabled={exporting}
        >
          <FaFileArchive />
          <span>
            {exporting ? t('history.exporting') : t('history.exportButton')}
          </span>
        </button>
      </div>

      <div className="statCardsRow">
        <StatCard
          icon="file"
          value={stats.total}
          label={t('history.stats.total')}
          tone="blue"
        />
        <StatCard
          icon="check"
          value={stats.success}
          label={t('history.stats.success')}
          tone="green"
        />
        <StatCard
          icon="warning"
          value={stats.errors}
          label={t('history.stats.errors')}
          tone="red"
        />
        <StatCard
          icon="clock"
          value={stats.today}
          label={t('history.stats.today')}
          tone="purple"
        />
      </div>

      <HistoryFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        typeOptions={TYPE_FILTERS}
        statusOptions={STATUS_FILTERS}
      />

      <HistoryTable
        records={filteredRecords}
        onView={(r) => setViewingRecord(r)}
        onDeleteRequest={(r) => setDeletingRecord(r)}
      />

      <div className="hrBottomGrid">
        <ActivityStatsChart data={typeStats} />
        <RecentActivity
          records={recentActivity}
          onView={(r) => setViewingRecord(r)}
        />
      </div>

      {viewingRecord && (
        <ViewFileModal
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
        />
      )}

      {deletingRecord && (
        <DeleteRecordModal
          record={deletingRecord}
          onCancel={() => setDeletingRecord(null)}
          onConfirm={handleDeleteRecord}
        />
      )}
    </div>
  )
}

export default HistoryReport
