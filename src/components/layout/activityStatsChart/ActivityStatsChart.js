import { FaChartBar } from 'react-icons/fa'

const ActivityStatsChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="activityStatsCard">
      <div className="settingsCardHeaderLike">
        <span className="cardHeaderIcon">
          <FaChartBar />
        </span>
        <h3>Amallar bo'yicha statistika</h3>
      </div>

      <div className="barChartRow">
        {data.map((item) => (
          <div className="barChartCol" key={item.key}>
            <span className="barChartValue">{item.value}</span>
            <div className="barChartTrack">
              <div
                className="barChartFill"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  background: item.color,
                }}
              />
            </div>
            <span className="barChartLabel">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityStatsChart
