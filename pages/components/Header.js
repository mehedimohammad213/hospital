import { cmsMediaUrl } from "@/lib/cms";
import React, { useContext, useState } from 'react';
import { Box, Toolbar, Typography, Paper, Stack, Button, IconButton, Drawer, Menu, MenuItem, Divider, CircularProgress } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { ExpandMore, SearchSharp } from '@mui/icons-material';
import { useRouter } from 'next/router';
import SearchComponents from './SearchComponents';
import { motion } from "framer-motion";
import { MyContext } from '@/utils/ContextApi';
function Header({ navbarData, navbarDataBn, buttonNavbarData, isLoading }) {
  const [open, setOpen] = useState(false)
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState()
  const opens = Boolean(anchorEl);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setLangu, langu } = useContext(MyContext);

  // Use English navbar (Sajida Main Nav) or Bangla navbar (Sajida Main Nav Bangla) based on language
  const currentNavbar = (langu === 'bn' ? navbarDataBn : navbarData) ?? navbarData;

  // Utility function to strip query parameters from URL
  const stripQueryParams = (url) => {
    if (!url) return url;
    return url.split('?')[0];
  };

  React.useEffect(() => {
    const match = currentNavbar?.menu?.menu_items?.find(item => {
      if (!item.link) return false;
      const path = stripQueryParams(item.link).replace(/^https?:\/\/[^/]+/, '');
      return path && router.pathname === path;
    });
    if (match) setSelected(match.id);
    else setSelected(null);
  }, [router.pathname, currentNavbar]);

  // Navigate to link: external URLs open in same window, internal paths use router
  const navigateToLink = (link) => {
    if (!link) return;
    const trimmed = (link || '').trim();
    if (/^https?:\/\//i.test(trimmed)) {
      window.location.href = trimmed;
    } else {
      router.push(trimmed);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (lang) => {
    if (lang) {
      setLangu(lang)
      setLanguage(lang)
    }
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        mt: { xs: 1, sm: 1, md: 2, },
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column',
        // gap: .2,

      }}
    >

      <Paper
        // elevation={4}
        sx={{
          width: '90%',
          maxWidth: '1720px',
          mx: 'auto',
          borderRadius: 100,
          backgroundColor: '#ffff',
          color: '#000',
          boxShadow: '0px 2px 4px rgba(18, 165, 81, 0.05)',
          height: { md: 90, xs: 80 },
          display: 'flex',
          alignItems: 'center',

        }}
      >
        <Toolbar sx={{ width: '100%', }}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ width: '100%', px: { xs: 1.5, md: 0 } }}>
            <Stack direction={"row"} spacing={5} sx={{ width: '100%' }} alignItems={"center"}>
              {langu === 'en' ? <img
                src={currentNavbar?.logo?.file_path ? cmsMediaUrl(currentNavbar.logo.file_path) : "/assets/images/Logo.svg"}
                alt={langu === 'bn' ? (currentNavbar?.title_bn || currentNavbar?.title_en || "Logo") : (currentNavbar?.title_en || "Logo")}
                width={136}
                height={48}
                onClick={() => router.push("\/")}
                style={{ cursor: 'pointer' }}
              /> : <img
                src={currentNavbar?.logo?.file_path ? cmsMediaUrl(currentNavbar.logo.file_path) : "/assets/banglalogsajida.png"}
                alt={langu === 'bn' ? (currentNavbar?.title_bn || currentNavbar?.title_en || "Logo") : (currentNavbar?.title_en || "Logo")}
                width={136}
                height={48}
                onClick={() => router.push("\/")}
                style={{ cursor: 'pointer', objectFit: "cover" }}
              />}
              <Stack sx={{ display: { xs: "none", md: "block" } }}>
                <img
                  src={buttonNavbarData?.logo?.file_path ? cmsMediaUrl(buttonNavbarData.logo.file_path) : "/assets/images/hospital.svg"}
                  alt={langu === 'bn' ? "হাসপাতাল" : "Hospital"}
                  width={73}
                  height={48}
                />
              </Stack>

            </Stack>
            <Stack direction={"row"} spacing={2} alignItems={"center"} width={"100%"} justifyContent={"flex-end"}>
              {buttonNavbarData?.menu?.menu_items?.map((item, index) => {
                // Map menu items to buttons based on title
                if (item.title.toLowerCase().includes('ambulance')) {
                  return (
                    <Button
                      key={item.id}
                      variant="outlined"
                      onClick={() => { router.push('/contact'); setOpen(false) }}
                      sx={{
                        width: 130,
                        height: 50,
                        fontWeight: 600,
                        display: { xs: "none", md: "block" },
                        fontSize: 16,
                        border: "1px solid #EAF0F5",
                        borderRadius: 100,
                        textTransform: 'capitalize',
                        p: 1,
                        borderColor: '#EAF0F5',
                        color: '#2A6498',
                        '&:hover': {
                          borderColor: '#EAF0F5',
                          backgroundColor: '#2A6498',
                          color: "#fff"
                        },
                      }}
                    >
                      {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                    </Button>
                  );
                }
                if (item.title.toLowerCase().includes('emergency')) {
                  return (
                    <Button
                      key={item.id}
                      variant="outlined"
                      onClick={() => { router.push('/contact'); setOpen(false) }}
                      sx={{
                        width: 166,
                        height: 50,
                        fontWeight: 600,
                        fontSize: 16,
                        border: "1px solid #EAF0F5",
                        display: { xs: "none", md: "block" },
                        borderRadius: 100,
                        textTransform: 'capitalize',
                        p: 1,
                        borderColor: '#EAF0F5',
                        color: '#2A6498',
                        '&:hover': {
                          borderColor: '#EAF0F5',
                          backgroundColor: '#2A6498',
                          color: "#fff"
                        },
                      }}
                    >
                      {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                    </Button>
                  );
                }
                if (item.title.toLowerCase().includes('appointment')) {
                  return (
                    <Button
                      key={item.id}
                      onClick={() => { navigateToLink(item.link || '/appointment'); setOpen(false) }}
                      variant="outlined"
                      sx={{
                        width: 145,
                        height: 50,
                        fontWeight: 600,
                        display: { xs: "none", md: "block" },
                        borderRadius: 100,
                        fontSize: 16,
                        textTransform: 'capitalize',
                        borderColor: '#EAF0F5',
                        p: 1,
                        // backgroundColor: '#2A6498',
                        color: '#2A6498',
                        '&:hover': {
                          backgroundColor: '#2A6498',
                          boxShadow: 'none',
                          color: "#fff"
                        },
                        '&:focus': {
                          outline: 'none',
                          boxShadow: 'none',
                        },
                        '&:focus-visible': {
                          outline: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                    </Button>
                  );
                }
                return null;
              })}

              <Button variant="contained"
                onClick={handleClick}
                sx={{
                  width: 76,
                  height: 47,
                  fontWeight: 500,
                  borderRadius: 100,
                  display: { xs: "none", md: "flex" },
                  fontSize: 16,
                  textTransform: 'capitalize',
                  p: 1,
                  backgroundColor: '#12A551', // ✅ Initial background color set
                  color: '#fff', // ✅ Text color
                  '&:hover': {
                    backgroundColor: '#12A551', // ✅ Keep same on hover
                    boxShadow: 'none',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }} endIcon={<ExpandMore />}>
                {langu === 'bn' ? 'বাং' : 'EN'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={opens}
                onClose={() => handleClose()}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleClose('en')}>English</MenuItem>
                <MenuItem onClick={() => handleClose('bn')}>বাংলা</MenuItem>
              </Menu>
              <Stack aria-label="" sx={{ display: { md: "none", xs: "block", }, cursor: "pointer" }} onClick={() => setOpen(true)} >
                <img src="/assets/Home/Menubar.svg" alt="" />
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </Paper>
      <Paper
        // elevation={4}
        sx={{
          width: '90%',
          maxWidth: '1720px',
          display: { xs: "none", md: "flex" },
          mx: 'auto',
          borderRadius: 100,
          backgroundColor: '#2A6498',
          color: '#000',
          boxShadow: '0px 2px 4px rgba(18, 165, 81, 0.05)',
          height: 60,
          alignItems: 'center',

        }}
      >
        <Toolbar sx={{ width: '100%' }}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ width: '100%' }}>
            <Stack
              direction={"row"}
              sx={{ width: "100%" }}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                currentNavbar?.menu?.menu_items?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Typography
                      fontSize={langu === "en" ? 18 : 16}
                      onClick={() => {
                        setSelected(item.id);
                        navigateToLink(item.link);
                      }}
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        cursor: "pointer",
                        borderRadius: "100px",
                        px: 3,
                        py: 0.5,
                        transition: "all 0.4s ease",
                        border: selected === item.id ? "2px solid transparent" : "none",
                        background: selected === item.id
                          ? "linear-gradient(#005BAA, #005BAA) padding-box, linear-gradient(90deg, #12A551, #005BAA) border-box"
                          : "transparent",
                        "&:hover": {
                          background:
                            "linear-gradient(#005BAA, #005BAA) padding-box, linear-gradient(90deg, #12A551, #005BAA) border-box",
                          border: "2px solid transparent",
                        },
                      }}
                    >
                      {langu === "bn" ? item.title_bn || item.title : item.title}
                    </Typography>
                  </motion.div>
                ))
              )}
              <img
                src="/assets/images/search.svg"
                onClick={() => setSearchOpen(true)}
                alt="search"
                width={30}
                height={30}
                style={{ cursor: "pointer" }}
              />
            </Stack>


          </Stack>
        </Toolbar>
      </Paper>
      <SearchComponents open={searchOpen} setOpen={setSearchOpen} />
      <Drawer anchor="left" variant="temporary" sx={{ display: { md: "none", xs: "block" } }}
        PaperProps={{
          sx: {
            width: '90%',
            maxWidth: 340,
            // height: '95vh', // full height
            overflowY: 'hidden'

          },
        }} open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
            p: 3,
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} mb={3}>
            {langu === 'en' ? <img
              src={currentNavbar?.logo?.file_path ? cmsMediaUrl(currentNavbar.logo.file_path) : "/assets/images/Logo.svg"}
              alt={langu === 'bn' ? (currentNavbar?.title_bn || currentNavbar?.title_en || "Logo") : (currentNavbar?.title_en || "Logo")}
              width={120}
              height={48}
            /> : <img
              src={currentNavbar?.logo?.file_path ? cmsMediaUrl(currentNavbar.logo.file_path) : "/assets/banglalogsajida.png"}
              alt={langu === 'bn' ? (currentNavbar?.title_bn || currentNavbar?.title_en || "Logo") : (currentNavbar?.title_en || "Logo")}
              width={136}
              height={48} />}
            <IconButton onClick={() => setOpen(false)} sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            currentNavbar?.menu?.menu_items?.map((item, index) => (
              <React.Fragment key={item.id}>
                <MenuItem
                  onClick={() => {
                    navigateToLink(item.link);
                    setOpen(false)
                  }}
                  sx={{ p: 0, fontWeight: 700, }}
                >
                  {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                </MenuItem>
                {index < (currentNavbar?.menu?.menu_items?.length ?? 0) - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
          <Divider />
          <MenuItem sx={{ p: 0, fontWeight: 700 }} onClick={() => {
            setSearchOpen(true)
            setOpen(false)
          }}> <Button variant="outlined" fullWidth color="primary" sx={{
            fontWeight: 600,
            fontSize: 16,
            border: "1px solid #EAF0F5",
            borderRadius: 100,
            textTransform: 'capitalize',
            p: 1,
            borderColor: '#EAF0F5',
            color: '#2A6498',
            '&:hover': {
              borderColor: '#EAF0F5',
              backgroundColor: 'rgba(234, 240, 245, 0.1)',
            },
          }} endIcon={<SearchSharp />} >
              {langu === 'bn' ? 'সার্চ করুন' : "search"}
            </Button> </MenuItem>
          <Divider />
          <Stack direction={"column"} spacing={1} >
            {buttonNavbarData?.menu?.menu_items?.map((item, index) => {
              // Map menu items to mobile buttons based on title
              if (item.title.toLowerCase().includes('ambulance')) {
                return (
                  <React.Fragment key={item.id}>
                    <Button
                      variant="outlined"
                      // onClick={() => { router.push('/contact'); setOpen(false) }}
                      component="a"
                      href="tel:09612223399"
                      size='small'
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        border: "1px solid #EAF0F5",
                        borderRadius: 100,
                        textTransform: 'capitalize',
                        p: 1,
                        borderColor: '#EAF0F5',
                        color: '#2A6498',
                        '&:hover': {
                          borderColor: '#EAF0F5',
                          backgroundColor: 'rgba(234, 240, 245, 0.1)',
                        },
                      }}
                    >
                      {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                    </Button>
                    <Divider />
                  </React.Fragment>
                );
              }
              if (item.title.toLowerCase().includes('emergency')) {
                return (
                  <React.Fragment key={item.id}>
                    <Button
                      variant="outlined"
                      onClick={() => { router.push('/contact'); setOpen(false) }}
                      size='small'
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        border: "1px solid #EAF0F5",
                        borderRadius: 100,
                        textTransform: 'capitalize',
                        p: 1,
                        borderColor: '#EAF0F5',
                        color: '#2A6498',
                        '&:hover': {
                          borderColor: '#EAF0F5',
                          backgroundColor: 'rgba(234, 240, 245, 0.1)',
                        },
                      }}
                    >
                      {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                    </Button>
                    <Divider />
                  </React.Fragment>
                );
              }
              if (item.title.toLowerCase().includes('appointment')) {
                return (
                  <React.Fragment key={item.id}>
                    <Button
                      size='small'
                      variant="contained"
                      onClick={() => { navigateToLink(item.link || '/appointment'); setOpen(false) }}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 100,
                        fontSize: 16,
                        textTransform: 'capitalize',
                        p: 1,
                        backgroundColor: '#2A6498',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#2A6498',
                          boxShadow: 'none',
                        },
                        '&:focus': {
                          outline: 'none',
                          boxShadow: 'none',
                        },
                        '&:focus-visible': {
                          outline: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {langu === 'bn' ? (item.title_bn || item.title) : item.title}
                    </Button>
                  </React.Fragment>
                );
              }
              return null;
            })}
            <Divider />
            <Button size='small' variant="contained"
              onClick={handleClick}
              sx={{
                // width: 76,
                // height: 47,
                fontWeight: 500,
                borderRadius: 100,

                fontSize: 16,
                textTransform: 'capitalize',
                p: 1,
                backgroundColor: '#12A551', // ✅ Initial background color set
                color: '#fff', // ✅ Text color
                '&:hover': {
                  backgroundColor: '#12A551', // ✅ Keep same on hover
                  boxShadow: 'none',
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              }} endIcon={<ExpandMore />}>
              {langu === 'bn' ? 'বাংলা' : 'EN'}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={opens}
              onClose={() => handleClose()}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => handleClose('en')}>English</MenuItem>
              <MenuItem onClick={() => handleClose('bn')}>বাংলা</MenuItem>
            </Menu>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Header;
