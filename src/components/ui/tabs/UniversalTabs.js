import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'

function UniversalTabs({
  tabs = [],
  defaultValue = 0,
  sx = {},
  tabButtonSx = {},
  tabSx = {},
  contentSx = {},
  variant = 'fullWidth',
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
          <Tab key={index} label={tab.label} sx={tabButtonSx} />
        ))}
      </Tabs>
      <Box sx={contentSx}>{tabs[value]?.content}</Box>
    </Box>
  )
}

export default UniversalTabs
