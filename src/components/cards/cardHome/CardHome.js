import React from 'react'
import './CardHome.css'
import { GrLinkNext } from 'react-icons/gr'

const CardHome = ({ title, subtitle, color, icon, bgColor }) => {
  return (
    <div className="CardHome" style={{ '--after-bg-color': bgColor }}>
      <div className="cardAbout">
        <div
          className="cardImg"
          style={{ color: `${color}`, background: `${bgColor}` }}
        >
          {icon}
        </div>
        <div className="cardText">
          <p title={title}>{title}</p>
          <span title={subtitle}>{subtitle}</span>
        </div>
      </div>
      <div className="cardnextPage">
        <GrLinkNext />
      </div>
    </div>
  )
}

export default CardHome
