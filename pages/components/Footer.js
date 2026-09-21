import { cmsMediaUrl, unwrapCmsList } from "@/lib/cms";
import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { MyContext } from "@/utils/ContextApi";
import instance from "../api/api_instance";

function Footer({ footerData }) {
  const router = useRouter();
  const { langu } = useContext(MyContext);
  const [navbarData, setNavbarData] = useState(null);
  
  const [menuItemsData, setMenuItemsData] = useState(null);
  // Fetch navbar data for Bengali translations
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const navbarEndpoint = process.env.NEXT_PUBLIC_NAVBAR_ENDPOINT || "/navbars";
        const response = await instance.get(navbarEndpoint);
        setNavbarData(unwrapCmsList(response.data));
      } catch (error) {
        console.error("Error fetching navbar data:", error);
      }
    };
    fetchNavbarData();
  }, []);

  // Fetch menu items data for Bengali translations
  useEffect(() => {
    const fetchMenuItemsData = async () => {
      try {
        const menuItemsEndpoint = process.env.NEXT_PUBLIC_MENUITEMS_ENDPOINT || "/menuitems";
        const response = await instance.get(menuItemsEndpoint);
        setMenuItemsData(unwrapCmsList(response.data));
      } catch (error) {
        console.error("Error fetching menu items data:", error);
      }
    };
    fetchMenuItemsData();
  }, []);

  // Utility function to strip query parameters from URL
  const stripQueryParams = (url) => {
    if (!url) return url;
    return url.split('?')[0];
  };

  // Make phone numbers in HTML clickable (tel: links). Handles both English and Bengali digits.
  const PHONE_NUMBER = '+8801777772500';
  const wrapPhoneNumbersWithTelLink = (html) => {
    if (!html || typeof html !== 'string') return html;
    const telLink = (match) => `<a href="tel:${PHONE_NUMBER}" style="color: inherit; text-decoration: underline; cursor: pointer;">${match}</a>`;
    return html
      .replace(/\+\s*880\s*1777-?7/gi, telLink)
      .replace(/\+\s*৮৮০\s*১৭৭৭-?৭/g, telLink);
  };

  // Helper function to get Bengali translation from navbar data and menu items API
  const getBengaliTranslation = (title) => {
    if (langu !== 'bn') return title;

    // First, try to find in menu items API data
    if (menuItemsData) {
      const menuItem = menuItemsData.find(item =>
        item.title.toLowerCase() === title.toLowerCase()
      );
      if (menuItem && menuItem.title_bn) {
        return menuItem.title_bn;
      }
    }

    // Fallback to navbar data
    if (navbarData) {
      for (const navbar of navbarData) {
        const items = navbar.menu?.menu_items ?? navbar.menu_items ?? [];
        for (const item of items) {
          if (item.title?.toLowerCase() === title.toLowerCase()) {
            return item.title_bn || title;
          }
        }
      }
    }

    // Specific hardcoded translations for the requested menu items
    const specificTranslations = {
      'Quicklinks': 'দ্রুত লিংকসমূহ',
      'About Us': 'আমাদের সম্পর্কে',
      'Contact Us': 'যোগাযোগ করুন',
      'Our Services': 'আমাদের সেবাসমূহ',
      'Resources': 'সম্পদসমূহ',
      'Case Stories': 'কেস স্টোরি',
      'Specialists': 'বিশেষজ্ঞবৃন্দ'
    };

    return specificTranslations[title] || title;
  };
  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          width: "90%",
          maxWidth: "1720px",
          mx: "auto",
           mt: 3,
          // bgcolor:"red",
          alignItems: "flex-start",
        }}
      >
        <Grid size={{ xs: 12, md: 3 }}>
          {/* Logo from Section 1 */}
          {langu === 'en' ?footerData?.body?.[0]?.data?.find(item => item.type === "media") && (
            <img
              src={"/assets/mave_J50hDp.png"}
              alt=""
              width={194}
            />
          ): <img src={"/assets/banglalogsajida.png"} alt="" width={194} style={{objectFit:"cover"}}/>}
          {/* Description from Section 1 */}
          {footerData?.body?.[0]?.data?.find(item => item.type === "description") && (
            <Typography
              variant="body1"
              color="#AAAAAA"
              sx={{ fontSize: 14 }}
              mt={2}
              dangerouslySetInnerHTML={{
                __html: langu === 'bn'
                  ? (footerData.body[0].data.find(item => item.type === "description")._mave?.altContent || footerData.body[0].data.find(item => item.type === "description").value || "")
                  : (footerData.body[0].data.find(item => item.type === "description").value || "")
              }}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          {/* Contact title from Section 2 */}
          {footerData?.body?.[1]?.data?.find(item => item.type === "title") && (
            <Typography variant="h6" fontWeight={600} color="#222222" dangerouslySetInnerHTML={{
              __html: (langu === 'bn'
                ? (footerData.body[1].data.find(item => item.type === "title")._mave?.altText || footerData.body[1].data.find(item => item.type === "title").value || "")
                : (footerData.body[1].data.find(item => item.type === "title").value || "")) || "",
            }} />
          )}
          {/* Contact info from Section 2 */}
          {footerData?.body?.[1]?.data?.find(item => item.type === "description") && (
            <Typography
              variant="body1"
              sx={{ fontSize: 16 }}
              mt={2}
              dangerouslySetInnerHTML={{
                __html: wrapPhoneNumbersWithTelLink(
                  langu === 'bn'
                    ? (footerData.body[1].data.find(item => item.type === "description")._mave?.altContent || footerData.body[1].data.find(item => item.type === "description").value || "")
                    : (footerData.body[1].data.find(item => item.type === "description").value || "")
                )
              }}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 3 }} >
          {/* Quicklinks menu from Section 3 */}
          {footerData?.body?.[2]?.data?.find(item => item.type === "menu") && (
            <>
              <Typography variant="h6"mt={2} fontWeight={600} color="#222222" dangerouslySetInnerHTML={{
                __html: (langu === 'bn'
                  ? (footerData.body[2].data.find(item => item.type === "menu")._mave?.altTitle || getBengaliTranslation(footerData.body[2].data.find(item => item.type === "menu")._mave?.name || ""))
                  : (footerData.body[2].data.find(item => item.type === "menu")._mave?.name || "")) || "",
              }} />
              {footerData.body[2].data.find(item => item.type === "menu")._mave?.menu_items?.map((menuItem, index) => (
                <li
                  key={index}
                  onClick={() => router.push(stripQueryParams(menuItem.link))}
                  style={{
                    textDecoration: "none",
                    listStyle: "none",
                    cursor: "pointer",
                    color: "black",
                    display: "block",
                    marginBottom: "16px",
                    marginTop:16
                  }}
                >
                  {getBengaliTranslation(menuItem.title)}
                </li>
              ))}
            </>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          {/* Resources menu from Section 4 */}
          {footerData?.body?.[3]?.data?.find(item => item.type === "menu") && (
            <>
              <Typography variant="h6" mt={2} fontWeight={600} color="#222222" dangerouslySetInnerHTML={{
                __html: (langu === 'bn'
                  ? (footerData.body[3].data.find(item => item.type === "menu")._mave?.altTitle || getBengaliTranslation(footerData.body[3].data.find(item => item.type === "menu")._mave?.name || ""))
                  : (footerData.body[3].data.find(item => item.type === "menu")._mave?.name || "")) || "",
              }} />
              <Box sx={{ listStyle: "none" }}>
                {footerData.body[3].data.find(item => item.type === "menu")._mave?.menu_items?.map((menuItem, index) => (
                  <li
                    key={index}
                    onClick={() => router.push(stripQueryParams(menuItem.link))}
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      color: "black",
                      display: "block",
                       marginBottom: "16px",
                    marginTop:16
                    }}
                    >
                      {getBengaliTranslation(menuItem.title)}
                    </li>
                ))}
              </Box>
            </>
          )}
        </Grid>

        <Grid size={3}></Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            spacing={{ md: 5, xs: 2 }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {/* Button from Section 5 */}
            {footerData?.body?.[4]?.data?.find(item => item.type === "button") && (
              <Typography
                fontSize={14}
                color="#2A6498"
                textAlign={"center"}
                fontWeight={500}
                onClick={() => window.open(footerData.body[4].data.find(item => item.type === "button")._mave.action.url, '_blank', 'noopener,noreferrer')}
                sx={{ cursor: 'pointer' }}
                dangerouslySetInnerHTML={{
                  __html: (langu === 'bn'
                    ? (footerData.body[4].data.find(item => item.type === "button")._mave.altText || footerData.body[4].data.find(item => item.type === "button")._mave.text)
                    : footerData.body[4].data.find(item => item.type === "button")._mave.text) || "",
                }}
              />
            )}

          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
         <Stack direction="column" spacing={2}>
            <img src="/assets/images/footericons.svg" alt="" width={142} />
            <Stack direction={"row"} spacing={1} mt={1}>

            {/* Social icons from Section 6 */}
            {footerData?.body?.[5]?.data[0]?._mave?.testimonials
              ?.map((item, index) => (
                  <Link key={index} href={item?.author} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`${cmsMediaUrl(item?.image?.file_path)}`}
                      width={40}
                      alt={item.altText || item.icon}

                    />
                  </Link>
                )
              )}
          </Stack>
         </Stack>

        </Grid>
      </Grid>
      <hr
        style={{
          backgroundColor: "#F0F0F0",
          height: "2px",
          border: "none",
        }}
      />
      {/* Copyright from Section 7 */}
      {footerData?.body?.[6]?.data?.find(item => item.type === "description") && (
        <Typography
          fontSize={14}
          fontWeight={500}
          textAlign={{ md: "center", xs: "left" }}
          px={2}
          my={2}
          dangerouslySetInnerHTML={{
            __html: langu === 'bn'
              ? (footerData.body[6].data.find(item => item.type === "description")._mave?.altContent || footerData.body[6].data.find(item => item.type === "description").value || "")
              : (footerData.body[6].data.find(item => item.type === "description").value || "")
          }}
        />
      )}
    </Box>
  );
}

export default Footer;
