import {NavLink} from 'react-router-dom'
import {React} from 'react'
import './Sidebar.css'
import { useTranslation } from 'react-i18next'
import { SidebarButton } from '../../components'
import {
  IoHomeOutline,
  IoDocumentsOutline,
  IoDocumentOutline,
  IoSettingsOutline,
  IoBarcodeOutline,
  IoCreateOutline,
  IoCloseOutline,
} from 'react-icons/io5'
import { GoArchive } from 'react-icons/go'



export const Sidebar = ({ onLinkClick, onClose }) => {
  const { t } = useTranslation()
  const menuItems = [
    {
      id: 0,
      text: t('sidebar.home'),
      icon: <IoHomeOutline />,
      to: '/',
    },
    {
      id: 1,
      text: t('sidebar.informationAllocation'),
      icon: <IoDocumentOutline />,
      to: '/information-allocation'
    },
    {
      id: 2,
      text: t('sidebar.convert'),
      icon: <IoDocumentsOutline />,
      to: '/convert'
    },
    {
      id: 3,
      text: t('sidebar.createDocument'),
      icon: <IoCreateOutline />,
      to: '/create-document'
    },
    {
      id: 4,
      text: t('sidebar.templates'),
      icon: <IoBarcodeOutline />,
      to: '/templates'
    },
    {
      id: 5,
      text: t('sidebar.history'),
      icon: <GoArchive />,
      to: '/history'
    },
    {
      id: 6,
      text: t('sidebar.settings'),
      icon: <IoSettingsOutline />,
      to: '/settings'
    }
  ]
  return (
    <div className="sidebarHome">
      <button
        type="button"
        className="sidebarCloseButton"
        onClick={onClose}
        aria-label={t('navbar.closeMenu')}
      >
        <IoCloseOutline />
      </button>
      {menuItems.map((item) => (
        <NavLink to={item.to} className="sidebarLink" key={item.id} onClick={onLinkClick}>
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
