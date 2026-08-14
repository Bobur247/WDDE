import React, { useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'
import {
  CardHome,
  SelectFile,
  DocxViewer,
  SeparateOptions,
} from '../../components/components'
import { IoDocumentsOutline } from 'react-icons/io5'
import { SiGoogledataproc } from 'react-icons/si'
import { HiOutlineDocumentAdd } from 'react-icons/hi'
import { LuLayoutTemplate } from 'react-icons/lu'

const Home = () => {
  const { t } = useTranslation()
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [isBox, setBox] = useState(false)
  const [loading, setLoading] = useState(false)

  const [rawText, setRawText] = useState('')
  const [lines, setLines] = useState([])
  const [htmlContent, setHtmlContent] = useState('')

  const [method, setMethod] = useState('block')
  const [selectedItems, setSelectedItems] = useState([])
  const [manualPending, setManualPending] = useState('')
  const [extractedItems, setExtractedItems] = useState([])
  const nextId = useRef(1)

  function toggleSelect(line) {
    setSelectedItems((prev) =>
      prev.includes(line)
        ? prev.filter((item) => item !== line)
        : [...prev, line],
    )
  }

  function handleExtract(methodKey, items) {
    setExtractedItems((prev) => [
      ...prev,
      ...items.map((text) => ({
        id: nextId.current++,
        method: methodKey,
        text,
      })),
    ])
  }
  function handleUndoLast() {
    setExtractedItems((prev) => prev.slice(0, -1))
  }

  function handleResetExtracted() {
    setExtractedItems([])
    setSelectedItems([])
    setManualPending('')
  }

  const itemCards = [
    {
      id: 0,
      title: t('home.cards.convert.title'),
      subtitle: t('home.cards.convert.subtitle'),
      icon: <IoDocumentsOutline />,
      iconColor: '#000CFE',
      bgColor: '#000CFE40',
      to: '/convert',
    },
    {
      id: 1,
      title: t('home.cards.informationAllocation.title'),
      subtitle: t('home.cards.informationAllocation.subtitle'),
      icon: <SiGoogledataproc />,
      iconColor: '#691CD6',
      bgColor: '#691CD640',
      to: '/information-allocation',
    },
    {
      id: 2,
      title: t('home.cards.createDocument.title'),
      subtitle: t('home.cards.createDocument.subtitle'),
      icon: <HiOutlineDocumentAdd />,
      iconColor: '#06A959',
      bgColor: '#06A95940',
      to: '/create-document',
    },
    {
      id: 3,
      title: t('home.cards.templates.title'),
      subtitle: t('home.cards.templates.subtitle'),
      icon: <LuLayoutTemplate />,
      iconColor: '#DD5B12',
      bgColor: '#DD5B1240',
      to: '/templates',
    },
  ]

  return (
    <div className="home">
      <div className="cards">
        {itemCards.map((item) => (
          <NavLink to={item.to} key={item.id}>
            <CardHome
              bgColor={item.bgColor}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.iconColor}
            />
          </NavLink>
        ))}
      </div>
      <div className="homeBody">
        <div className="homeBodtNavbar">
          <div className="icon">
            <SiGoogledataproc />
          </div>
          <div className="subtitle">
            <p>{t('home.body.title')}</p>
            <span>{t('home.body.subtitle')}</span>
          </div>
        </div>
        <div className="homeBodyMain">
          <div className="item">
            <div className="selctFileBox">
              <SelectFile
                file={file}
                setFile={setFile}
                error={error}
                setError={setError}
                isBox={isBox}
                setBox={setBox}
                setRawText={setRawText}
                setLines={setLines}
                setHtmlContent={setHtmlContent}
                setSelectedItems={setSelectedItems}
                loading={loading}
                setLoading={setLoading}
                onReset={handleResetExtracted}
              />
            </div>
            {isBox && (
              <SeparateOptions
                method={method}
                setMethod={setMethod}
                rawText={rawText}
                htmlContent={htmlContent}
                selectedItems={selectedItems}
                manualPending={manualPending}
                setManualPending={setManualPending}
                onExtract={handleExtract}
                onUndoLast={handleUndoLast}
                extractedItems={extractedItems}
                hasExtractedItems={extractedItems.length > 0}
              />
            )}
          </div>
          <div className="item">
            <DocxViewer
              isBox={isBox}
              loading={loading}
              method={method}
              lines={lines}
              rawText={rawText}
              selectedItems={selectedItems}
              toggleSelect={toggleSelect}
              manualPending={manualPending}
              setManualPending={setManualPending}
              extractedItems={extractedItems}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
