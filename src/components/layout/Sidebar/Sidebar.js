import {NavLink} from 'react-router-dom'
import {React} from 'react'
import './Sidebar.css'
import { SidebarButton } from '../../components'
import {
  IoHomeOutline,
  IoDocumentsOutline,
  IoDocumentOutline,
  IoSettingsOutline,
  IoBarcodeOutline,
  IoCreateOutline,
} from 'react-icons/io5'
import { GoArchive } from 'react-icons/go'



export const Sidebar = () => {
  const menuItems = [
    {
      id: 0,
      text: 'Bosh sahifa',
      icon: <IoHomeOutline />,
      to: '/',
    },
    {
      id: 1,
      text: "Ma'lumot ajratish",
      icon: <IoDocumentOutline />,
      to: '/information-allocation'
    },
    {
      id: 2,
      text: "Konvertatsiya",
      icon: <IoDocumentsOutline />,
      to: '/convert'
    },
    {
      id: 3,  
      text: "Hujjat yaratish",
      icon: <IoCreateOutline />,
      to: '/create-document'
    },
    {
      id: 4,
      text: "Shablonlar",
      icon: <IoBarcodeOutline />,
      to: '/templates'
    },
    {
      id: 5,
      text: "Tarix(Hisoboti)",
      icon: <GoArchive />,
      to: '/history'
    },
    {
      id: 6,
      text: "Sozlamalar",
      icon: <IoSettingsOutline />,
      to: '/settings'
    }
  ]
  return (
    <div className="sidebarHome">
      {menuItems.map((item) => (
        <NavLink to={item.to} className="sidebarLink" key={item.id}>
          {({ isActive }) => (
              <SidebarButton
                  icon={item.icon}
                  text={item.text}
                  active={isActive ? 'active' : ''}
                />
          )}          
        </NavLink>
      ))}
    </div>
  )
}
