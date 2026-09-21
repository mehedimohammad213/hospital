import React from 'react'
import FormSubmit from './components/FormSubmit'
import { Box } from '@mui/material'

function appointment() {
  return (
    <Box sx={{
      width: "90%",
      maxWidth: "1720px",
      margin: "0 auto",
      my: 3,
    }}>
      <FormSubmit /></Box>
  )
}

export default appointment