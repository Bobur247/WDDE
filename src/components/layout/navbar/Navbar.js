import React from 'react'
import './Navbar.css'
import { IoMenuOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { logoImg, avatarImg } from '../../../assets/index'
import { useTheme } from '../../../context/ThemeContext'

const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'uz-Cyrl', label: 'Ўзбекча' },
  { code: 'en', label: 'English' },
]

export const Navbar = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <div className="navbar">
      <div className="navbarLeft">
        <button
          type="button"
          className="hamburgerButton"
          onClick={onMenuClick}
          aria-label={t('navbar.openMenu')}
        >
          <IoMenuOutline />
        </button>
        <div className="logo">
          <img src={logoImg} className="logoImg" alt="Alog" />
          <div className="navbarText">
            <h3>WDDE</h3>
            <p>{t('navbar.subtitle')}</p>
          </div>
        </div>
      </div>
      <div className="user">
        <button
          type="button"
          className="themeToggleButton"
          onClick={toggleTheme}
          aria-label={
            isDark
              ? t('navbar.toggleThemeToLight')
              : t('navbar.toggleThemeToDark')
          }
        >
          {isDark ? <IoSunnyOutline /> : <IoMoonOutline />}
        </button>
        <form
          action=""
          className="language"
          onSubmit={(event) => event.preventDefault()}
        >
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            aria-label={t('navbar.languageLabel')}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </form>
        <div className="userAvatar">
          <img src={avatarImg} alt="" />
        </div>
      </div>
    </div>
  )
}
