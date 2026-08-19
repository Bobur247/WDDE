import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { getDashboard } from '../../api/dashboard'
import { getHistory, deleteHistoryItem } from '../../api/history'
import { setToken } from '../../api/client'
import './History.css'

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
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [viewingRecord, setViewingRecord] = useState(null)
  const [deletingRecord, setDeletingRecord] = useState(null)
  const [exporting, setExporting] = useState(false)

  const [dashboardStats, setDashboardStats] = useState(null)
  const [dashboardRecent, setDashboardRecent] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getDashboard()
      .then((data) => {
        if (cancelled) return
        setDashboardStats(data?.stats ?? null)
        setDashboardRecent(Array.isArray(data?.recent) ? data.recent : [])
      })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) {
          setToken(null)
          navigate('/login', { replace: true })
          return
        }
        console.error('Dashboard maʼlumotlarini olishda xatolik:', err)
      })
      .finally(() => {
        if (!cancelled) setDashboardLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    let cancelled = false

    getHistory()
      .then((data) => {
        if (cancelled) return
        const items = Array.isArray(data) ? data : []
        setRecords(items.map((item) => ({ ...item, date: new Date(item.date) })))
      })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) {
          setToken(null)
          navigate('/login', { replace: true })
          return
        }
        console.error('Tarixni olishda xatolik:', err)
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  // Backend typeLabel/result'ni allaqachon o'zbek tilida qaytaradi;
  // typeLabel yo'q bo'lgan holat uchun joriy tilga mos fallback beriladi.
  const translatedRecords = useMemo(() => {
    return records.map((r) => ({
      ...r,
      typeLabel: r.typeLabel || t(`history.types.${r.type}`),
      result: r.result ?? '',
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

  // Backend /api/dashboard'dan kelgan `recent` massivini RecentActivity
  // komponenti kutgan shaklga (fileName/typeLabel/date) o'giradi.
  const remoteRecentActivity = useMemo(() => {
    if (!dashboardRecent) return null
    return dashboardRecent.map((r, i) => ({
      id: r.id ?? i,
      type: r.type,
      typeLabel: t(`history.types.${r.type}`, r.type),
      fileName: r.file_name,
      status: r.status,
      date: new Date(r.created_at),
    }))
  }, [dashboardRecent, t])

  const displayStats = dashboardStats ?? stats
  const displayRecentActivity = remoteRecentActivity ?? recentActivity

  async function handleDeleteRecord() {
    const id = deletingRecord.id
    try {
      await deleteHistoryItem(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error("Yozuvni o'chirishda xatolik:", err)
    } finally {
      setDeletingRecord(null)
    }
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

      {(dashboardLoading || historyLoading) && (
        <p className="dashboardLoadingNote">{t('history.dashboardLoading', 'Yuklanmoqda...')}</p>
      )}

      <div className="statCardsRow">
        <StatCard
          icon="file"
          value={displayStats.total}
          label={t('history.stats.total')}
          tone="blue"
        />
        <StatCard
          icon="check"
          value={displayStats.success}
          label={t('history.stats.success')}
          tone="green"
        />
        <StatCard
          icon="warning"
          value={displayStats.errors}
          label={t('history.stats.errors')}
          tone="red"
        />
        <StatCard
          icon="clock"
          value={displayStats.today}
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
          records={displayRecentActivity}
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
