import Layout from '@/pages/components/Layout'
import theme from '@/utils/theme'
import '@/styles/globals.css'
import { ThemeProvider } from '@mui/material'
import { MyProvider } from '@/utils/ContextApi'
import { ToastContainer } from 'react-toastify'


export default function App({ Component, pageProps }) {
  return <>
    <MyProvider>
      <ThemeProvider theme={theme}>
        <Layout><Component {...pageProps} /></Layout>
         <ToastContainer />
      </ThemeProvider>
      </MyProvider>
  </>
}
