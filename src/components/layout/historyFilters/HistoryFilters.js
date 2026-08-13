import { useState, useRef, useEffect } from 'react'
import { FaSearch, FaCalendarAlt } from 'react-icons/fa'

const HistoryFilters = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  typeOptions,
  statusOptions,
}) => {
  const [showDateRange, setShowDateRange] = useState(false)
  const wrapperRef = useRef(null)

  // Tashqariga bosilganda panel yopiladi
  useEffect(() => {
    if (!showDateRange) return

    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDateRange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDateRange])

  // Ikkala sana ham tanlangach panel avtomatik yopiladi
  useEffect(() => {
    if (dateFrom && dateTo) {
      setShowDateRange(false)
    }
  }, [dateFrom, dateTo])

  const dateLabel =
    dateFrom || dateTo
      ? `${dateFrom || '...'} — ${dateTo || '...'}`
      : "Sana oralig'i"

  return (
    <div className="historyFilters">
      <div className="hfSearchBox">
        <FaSearch className="hfSearchIcon" />
        <input
          type="text"
          placeholder="Amallarni qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        {typeOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <div className="hfDateRangeWrapper" ref={wrapperRef}>
        <button
          type="button"
          className="hfDateRangeButton"
          onClick={() => setShowDateRange((v) => !v)}
        >
          <FaCalendarAlt />
          <span>{dateLabel}</span>
        </button>

        {showDateRange && (
          <div className="hfDateRangePanel">
            <div className="hfDateField">
              <label>Dan</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="hfDateField">
              <label>Gacha</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="hfDateClearButton"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
                setShowDateRange(false)
              }}
            >
              Tozalash
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryFilters
