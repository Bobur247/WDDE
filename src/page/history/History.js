import { useState, useMemo } from 'react'
import JSZip from 'jszip'
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

// ===== DEMO ma'lumotlar =====
// Productionda bu ro'yxat backend'dan (paginatsiya bilan) keladi, va
// statistik kartalar alohida backend aggregate so'rovi orqali olinadi.
function daysAgo(n, hour, minute) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, minute, 0, 0)
  return d
}

const MOCK_RECORDS = [
  {
    id: 1,
    type: 'extraction',
    typeLabel: "Ma'lumot ajratish",
    fileName: "Talabalar_ro'yxati.docx",
    date: daysAgo(0, 10, 24),
    status: 'success',
    result: '3 ta record',
  },
  {
    id: 2,
    type: 'conversion',
    typeLabel: 'Konvertatsiya',
    fileName: 'Hisobot.pdf',
    date: daysAgo(1, 16, 45),
    status: 'success',
    result: '5 ta fayl',
  },
  {
    id: 3,
    type: 'document',
    typeLabel: 'Hujjat yaratish',
    fileName: 'Darslik.docx',
    date: daysAgo(2, 14, 32),
    status: 'success',
    result: '1 ta hujjat',
  },
  {
    id: 4,
    type: 'extraction',
    typeLabel: "Ma'lumot ajratish",
    fileName: 'Maqola.docx',
    date: daysAgo(2, 9, 18),
    status: 'error',
    result: 'Kalit so\u02bbz topilmadi',
  },
  {
    id: 5,
    type: 'conversion',
    typeLabel: 'Konvertatsiya',
    fileName: 'Foto.png',
    date: daysAgo(3, 18, 20),
    status: 'success',
    result: '1 ta fayl',
  },
  {
    id: 6,
    type: 'document',
    typeLabel: 'Hujjat yaratish',
    fileName: 'Taklif_noma.docx',
    date: daysAgo(3, 11, 5),
    status: 'success',
    result: '2 ta sahifa',
  },
  {
    id: 7,
    type: 'extraction',
    typeLabel: "Ma'lumot ajratish",
    fileName: 'Xodimlar.xlsx',
    date: daysAgo(0, 8, 2),
    status: 'success',
    result: '12 ta record',
  },
  {
    id: 8,
    type: 'other',
    typeLabel: 'Boshqalar',
    fileName: 'Skan.pdf',
    date: daysAgo(4, 12, 0),
    status: 'error',
    result: 'Fayl shikastlangan',
  },
  {
    id: 9,
    type: 'document',
    typeLabel: 'Hujjat yaratish',
    fileName: 'Ariza.docx',
    date: daysAgo(0, 9, 40),
    status: 'success',
    result: '1 ta hujjat',
  },
  {
    id: 10,
    type: 'conversion',
    typeLabel: 'Konvertatsiya',
    fileName: 'Shartnoma.docx',
    date: daysAgo(5, 15, 10),
    status: 'success',
    result: '1 ta fayl',
  },
]

const TYPE_FILTERS = [
  { value: 'all', label: 'Barcha tur' },
  { value: 'extraction', label: "Ma'lumot ajratish" },
  { value: 'conversion', label: 'Konvertatsiya' },
  { value: 'document', label: 'Hujjat yaratish' },
  { value: 'other', label: 'Boshqalar' },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'Barcha holat' },
  { value: 'success', label: 'Muvaffaqiyatli' },
  { value: 'error', label: 'Xatolik' },
]

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
  const [records, setRecords] = useState(MOCK_RECORDS)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [viewingRecord, setViewingRecord] = useState(null)
  const [deletingRecord, setDeletingRecord] = useState(null)
  const [exporting, setExporting] = useState(false)

  const stats = useMemo(() => {
    const total = records.length
    const success = records.filter((r) => r.status === 'success').length
    const errors = records.filter((r) => r.status === 'error').length
    const today = records.filter((r) => isToday(r.date)).length
    return { total, success, errors, today }
  }, [records])

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
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
  }, [records, search, typeFilter, statusFilter, dateFrom, dateTo])

  const typeStats = useMemo(() => {
    const counts = { extraction: 0, conversion: 0, document: 0, other: 0 }
    records.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })
    return [
      {
        key: 'extraction',
        label: "Ma'lumot ajratish",
        value: counts.extraction,
        color: '#2563eb',
      },
      {
        key: 'conversion',
        label: 'Konvertatsiya',
        value: counts.conversion,
        color: '#a855f7',
      },
      {
        key: 'document',
        label: 'Hujjat yaratish',
        value: counts.document,
        color: '#16a34a',
      },
      {
        key: 'other',
        label: 'Boshqalar',
        value: counts.other,
        color: '#f59e0b',
      },
    ]
  }, [records])

  const recentActivity = useMemo(() => {
    return [...records].sort((a, b) => b.date - a.date).slice(0, 5)
  }, [records])

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
        ['№', 'Amal turi', 'Fayl nomi', 'Bajarilgan vaqti', 'Holat', 'Natija'],
        ...filteredRecords.map((r, i) => [
          i + 1,
          r.typeLabel,
          r.fileName,
          r.date.toLocaleString('uz-UZ'),
          r.status === 'success' ? 'Muvaffaqiyatli' : 'Xatolik',
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
            <h1>Tarix (Hisoboti)</h1>
            <p>Barcha bajarilgan amallar tarixi va hisobotlar</p>
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
            {exporting ? 'Tayyorlanmoqda...' : 'Hisobotlarni eksport qilish'}
          </span>
        </button>
      </div>

      <div className="statCardsRow">
        <StatCard
          icon="file"
          value={stats.total}
          label="Umumiy amallar"
          tone="blue"
        />
        <StatCard
          icon="check"
          value={stats.success}
          label="Muvaffaqiyatli"
          tone="green"
        />
        <StatCard
          icon="warning"
          value={stats.errors}
          label="Xatoliklar"
          tone="red"
        />
        <StatCard
          icon="clock"
          value={stats.today}
          label="Bugungi amallar"
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
