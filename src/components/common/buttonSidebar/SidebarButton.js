import {React} from 'react'
import './SidebarButton.css'
function SidebarButton({ text, icon, active, onClick }) {
  
  return (
    <button className={`sidebarButton ${active}`} onClick={onClick}>
      <span>{icon}</span>
      <p>{text}</p>
    </button>
  )
}

export default SidebarButton
