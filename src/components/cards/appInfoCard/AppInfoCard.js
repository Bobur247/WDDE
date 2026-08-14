import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaDesktop, FaGlobe, FaExpand, FaSave } from 'react-icons/fa'

// Brauzer va OS nomini navigator ma'lumotlaridan HAQIQATAN aniqlaydi
function detectSystemInfo(unknownLabel) {
  const ua = navigator.userAgent

  let os = unknownLabel
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Linux')) os = 'Linux'

  let browser = unknownLabel
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
  const { t } = useTranslation()
  const info = useMemo(() => detectSystemInfo(t('settings.appInfo.unknown')), [t])

  return (
    <div className="appInfoCard">
      <div className="appInfoLogo">W</div>
      <h3 className="appInfoName">Word Document Toolkit</h3>

      <div className="appInfoVersionRow">
        <span>{t('settings.appInfo.versionLabel')}</span>
        <span className="appInfoVersion">1.0.0</span>
        <span className="appInfoBadge">{t('settings.appInfo.activeBadge')}</span>
      </div>

      <div className="appInfoDivider" />

      <h4 className="appInfoSectionTitle">{t('settings.appInfo.systemInfoTitle')}</h4>

      <div className="appInfoRow">
        <FaDesktop />
        <div>
          <p className="appInfoRowLabel">{t('settings.appInfo.osLabel')}</p>
          <p className="appInfoRowValue">{info.os}</p>
        </div>
      </div>

      <div className="appInfoRow">
        <FaGlobe />
        <div>
          <p className="appInfoRowLabel">{t('settings.appInfo.browserLabel')}</p>
          <p className="appInfoRowValue">{info.browser}</p>
        </div>
      </div>

      <div className="appInfoRow">
        <FaExpand />
        <div>
          <p className="appInfoRowLabel">{t('settings.appInfo.screenSizeLabel')}</p>
          <p className="appInfoRowValue">{info.screenSize}</p>
        </div>
      </div>

      <button type="button" className="appInfoSaveButton" onClick={onSave}>
        <FaSave />
        <span>{t('settings.appInfo.saveButton')}</span>
      </button>
    </div>
  )
}

export default AppInfoCard
