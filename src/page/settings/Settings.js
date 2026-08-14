// FaSave
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCog, FaRedo } from 'react-icons/fa'
import {
  ConfirmModal,
  AdditionalCard,
  AppInfoCard,
  BackupCard,
  ConversionSettingsCard,
  DocumentSettingsCard,
  ExtractionSettingsCard,
  FileSettingsCard,
  GeneralSettingsCard,
  SecurityCard,
} from '../../components/components'

import './Settings.css'

const STORAGE_KEY = 'word-toolkit-settings'

const DEFAULT_SETTINGS = {
  general: {
    language: 'uz',
    darkMode: true,
    dateFormat: 'DD.MM.YYYY HH:mm',
    notifications: true,
    region: 'UZ',
  },
  document: {
    defaultFormat: 'docx',
    defaultFont: 'Arial',
    pageSize: 'A4',
    margins: 'normal',
    headerFooterAuto: true,
    pageNumbers: true,
  },
  conversion: {
    pdfQuality: 'high',
    ocr: true,
    imageQuality: true,
    embedFonts: true,
  },
  extraction: {
    defaultMethod: 'table',
    saveMarkers: true,
    regexMode: false,
    autoLoadTemplates: true,
  },
  file: {
    downloadPath: 'C:\\Users\\Documents\\WordToolkit',
    autoRename: true,
    maxFileSize: '50',
  },
  security: {
    twoFA: false,
  },
}

const Settings = () => {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [savedBanner, setSavedBanner] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Saqlangan sozlamalarni birinchi ochilishda yuklab olamiz
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }))
      }
    } catch (err) {
      console.error('Sozlamalarni yuklashda xatolik:', err)
    }
  }, [])

  // Dark mode - shu komponent doirasida haqiqatan ishlaydi
  useEffect(() => {
    document.documentElement.classList.toggle(
      'settings-dark',
      settings.general.darkMode,
    )
  }, [settings.general.darkMode])

  function updateSection(section, patch) {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }))
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSavedBanner(true)
    setTimeout(() => setSavedBanner(false), 2500)
  }

  function handleResetDefaults() {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(STORAGE_KEY)
    setShowResetConfirm(false)
  }

  function handleImportSettings(imported) {
    setSettings((prev) => ({ ...prev, ...imported }))
  }

  return (
    <div className="SettingsPage">
      <div className="settingsPageHeader">
        <div className="settingsPageHeaderLeft">
          <span className="settingsPageIcon">
            <FaCog />
          </span>
          <div>
            <h1>{t('settings.header.title')}</h1>
            <p>
              {t('settings.header.subtitle')}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="resetDefaultsButton"
          onClick={() => setShowResetConfirm(true)}
        >
          <FaRedo />
          <span>{t('settings.header.resetButton')}</span>
        </button>
      </div>

      {savedBanner && (
        <div className="savedBanner">{t('settings.header.savedBanner')}</div>
      )}

      <div className="settingsGrid">
        <div className="gridArea-general">
          <GeneralSettingsCard
            values={settings.general}
            onChange={(patch) => updateSection('general', patch)}
          />
        </div>

        <div className="gridArea-document">
          <DocumentSettingsCard
            values={settings.document}
            onChange={(patch) => updateSection('document', patch)}
          />
        </div>

        <div className="gridArea-sidebar">
          <AppInfoCard onSave={handleSave} />
        </div>

        <div className="gridArea-conversion">
          <ConversionSettingsCard
            values={settings.conversion}
            onChange={(patch) => updateSection('conversion', patch)}
          />
        </div>

        <div className="gridArea-extraction">
          <ExtractionSettingsCard
            values={settings.extraction}
            onChange={(patch) => updateSection('extraction', patch)}
          />
        </div>

        <div className="gridArea-file">
          <FileSettingsCard
            values={settings.file}
            onChange={(patch) => updateSection('file', patch)}
          />
        </div>

        <div className="gridArea-security">
          <SecurityCard
            values={settings.security}
            onChange={(patch) => updateSection('security', patch)}
          />
        </div>

        <div className="gridArea-backup">
          <BackupCard settings={settings} onImport={handleImportSettings} />
        </div>

        <div className="gridArea-additional">
          <AdditionalCard />
        </div>
      </div>

      {showResetConfirm && (
        <ConfirmModal
          title={t('settings.resetConfirm.title')}
          message={t('settings.resetConfirm.message')}
          confirmLabel={t('settings.resetConfirm.confirmLabel')}
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={handleResetDefaults}
        />
      )}
    </div>
  )
}

export default Settings
