import { useTranslation } from 'react-i18next'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        type="button"
        className="paginationButton"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FaChevronLeft />
        <span>{t('informationAllocation.historyBar.prevPage')}</span>
      </button>

      <span className="paginationInfo">
        {t('informationAllocation.historyBar.page')} {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        className="paginationButton"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>{t('informationAllocation.historyBar.nextPage')}</span>
        <FaChevronRight />
      </button>
    </div>
  )
}

export default Pagination
