import { useMemo } from 'react'
import { FaDesktop, FaGlobe, FaExpand, FaSave } from 'react-icons/fa'

// Brauzer va OS nomini navigator ma'lumotlaridan HAQIQATAN aniqlaydi
function detectSystemInfo() {
  const ua = navigator.userAgent

  let os = "Noma'lum"
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Linux')) os = 'Linux'

  let browser = "Noma'lum"
  const edgeMatch = ua.match(/Edg\/([\d.]+)/)
  const chromeMatch = ua.match(/Chrome\/([\d.]+)/)
  const firefoxMatch = ua.match(/Firefox\/([\d.]+)/)
  const safariMatch = ua.match(/Version\/([\d.]+).*Safari/)

  if (edgeMatch) browser = `Edge ${edgeMatch[1].split('.')[0]}`
  else if (chromeMatch) browser = `Chrome ${chromeMatch[1].split('.')[0]}`
  else if (firefoxMatch) browser = `Firefox ${firefoxMatch[1].split('.')[0]}`
  else if (safariMatch) browser = `Safari ${safariMatch[1].split('.')[0]}`

  const screenSize = `${window.screen.width} x ${window.screen.height}`

  return { os, browser, screenSize }
}

const AppInfoCard = ({ onSave }) => {
  const info = useMemo(() => detectSystemInfo(), [])

  return (
    <div className="appInfoCard">
      <div className="appInfoLogo">W</div>
      <h3 className="appInfoName">Word Document Toolkit</h3>

      <div className="appInfoVersionRow">
        <span>Versiya:</span>
        <span className="appInfoVersion">1.0.0</span>
        <span className="appInfoBadge">Faol</span>
      </div>

      <div className="appInfoDivider" />

      <h4 className="appInfoSectionTitle">Tizim ma'lumotlari</h4>

      <div className="appInfoRow">
        <FaDesktop />
        <div>
          <p className="appInfoRowLabel">Operatsion tizim:</p>
          <p className="appInfoRowValue">{info.os}</p>
        </div>
      </div>

      <div className="appInfoRow">
        <FaGlobe />
        <div>
          <p className="appInfoRowLabel">Brauzer:</p>
          <p className="appInfoRowValue">{info.browser}</p>
        </div>
      </div>

      <div className="appInfoRow">
        <FaExpand />
        <div>
          <p className="appInfoRowLabel">Ekran o'lchami:</p>
          <p className="appInfoRowValue">{info.screenSize}</p>
        </div>
      </div>

      <button type="button" className="appInfoSaveButton" onClick={onSave}>
        <FaSave />
        <span>Saqlash</span>
      </button>
    </div>
  )
}

export default AppInfoCard
