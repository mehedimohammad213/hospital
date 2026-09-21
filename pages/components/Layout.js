// src/components/Layout.js
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box, Container, IconButton, keyframes } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import instance from '../api/api_instance';
import { normalizeCmsData, normalizeNavbar, unwrapCmsList } from '@/lib/cms';


function Layout({ children }) {
  const [footerData, setFooterData] = useState(null);
  const [navbarData, setNavbarData] = useState(null);
  const [navbarDataBn, setNavbarDataBn] = useState(null);
  const [buttonNavbarData, setButtonNavbarData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFooterData = async () => {
    try {
      const listResponse = await instance.get("/pages?type=Footer");
      const footers = unwrapCmsList(listResponse.data);
      // Prefer the newest footer when duplicates exist from re-seeds
      const footerSummary = [...footers].sort(
        (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
      )[0];
      if (!footerSummary?.id) return;
      const response = await instance.get(`/pages/${footerSummary.id}`);
      setFooterData(normalizeCmsData(response.data));
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  const fetchNavbarData = async () => {
    try {
      const response = await instance.get("/navbars");
      const navbars = unwrapCmsList(response.data);
      const sajidaMainNavEn = navbars.find(navbar => navbar.title_en === "Sajida Main Nav") || navbars[0];
      setNavbarData(normalizeNavbar(sajidaMainNavEn));
      const sajidaMainNavBn = navbars.find(navbar => navbar.title_en === "Sajida Main Nav Bangla");
      setNavbarDataBn(normalizeNavbar(sajidaMainNavBn));
      const buttonNavbar = navbars.find(navbar => navbar.title_en === "SajidaOne");
      setButtonNavbarData(normalizeNavbar(buttonNavbar));
    } catch (error) {
      console.error("Error fetching navbar data:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchFooterData(), fetchNavbarData()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: "#F9F9F9" }}>
      <Header navbarData={navbarData} navbarDataBn={navbarDataBn} buttonNavbarData={buttonNavbarData} isLoading={isLoading} />
      <Box sx={{ flex: 1, }}>
        {children}
        <IconButton
          aria-label="whatsapp"
          href="https://wa.me/8801777772500"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#25D366',
            color: '#fff',
            boxShadow: 3,
            zIndex: 1000,
            animation: `${pulse} 1.5s infinite`,
            '&:hover': {
              backgroundColor: '#1EBE57',
            },
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
      <Footer footerData={footerData} />
    </Box>
  );
}

export default Layout;
