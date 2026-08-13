import {
  FaFileAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
} from 'react-icons/fa'

const ICONS = {
  file: FaFileAlt,
  check: FaCheckCircle,
  warning: FaExclamationCircle,
  clock: FaClock,
}

const StatCard = ({ icon, value, label, tone }) => {
  const Icon = ICONS[icon] || FaFileAlt

  return (
    <div className={`statCard tone-${tone}`}>
      <span className="statCardIcon">
        <Icon />
      </span>
      <div>
        <p className="statCardValue">{value}</p>
        <p className="statCardLabel">{label}</p>
      </div>
    </div>
  )
}

export default StatCard
