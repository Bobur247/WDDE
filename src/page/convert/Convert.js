import React from 'react'
import './Convert.css'
import { IoDocumentsOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { UniversalTabs,Convertdocxhtml,Convertpdfdocx,Convertdocxtxt } from '../../components/components'

const Convert = () => {
  const { t } = useTranslation()
  const tabs = [
    {
      label: 'DOCX↔PDF',
      content: <Convertpdfdocx />,
    },
    {
      label: 'DOCX↔TXT',
      content: <Convertdocxtxt />,
    },
    {
      label: 'DOCX↔HTML',
      content: <Convertdocxhtml />,
    },
  ]
  return (
    <div>
      <div className="ConvertNavbar">
        <div className="nIcon">
          <IoDocumentsOutline />
        </div>
        <div className="nText">
          <h3>{t('convert.page.title')}</h3>
          <span>{t('convert.page.subtitle')}</span>
        </div>
      </div>
      <div className="ConvertMain">
        <UniversalTabs
          tabs={tabs}
          tabButtonSx={{
            backgroundColor: '#fff',
            flex: '1',
          }}
          tabSx={{
            backgroundColor: '#fff',
            padding: '8px',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '10px',
            boxShadow: '3px 3px 5px rgb(205, 224, 239)',
            width: '100% !important',
          }}
          contentSx={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "3px 3px 5px rgb(205, 224, 239)"
          }}
          defaultValue={0}
        />
      </div>
    </div>
  )
}

export default Convert
