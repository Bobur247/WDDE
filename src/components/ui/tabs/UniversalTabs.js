import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import './UniversalTabs.css'

function UniversalTabs({
  tabs = [],
  defaultValue = 0,
  sx = {},
  tabButtonSx = {},
  tabSx = {},
  contentSx = {},
  variant = 'standard',
  centered = false,
}) {
  const [value, setValue] = useState(defaultValue)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={sx}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant={variant}
        centered={centered}
        sx={tabSx}
      >
        {tabs.map((tab, index) => (
          <Tab
            className="tabUn"
            key={index}
            label={tab.label}
            sx={tabButtonSx}
          />
        ))}
      </Tabs>
      <Box sx={contentSx}>
        {tabs[value]?.content}
      </Box>
    </Box>
  )
}

export default UniversalTabs
