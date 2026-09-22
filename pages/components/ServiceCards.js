import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import React, { useContext, useMemo } from "react";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import ChildCareOutlinedIcon from "@mui/icons-material/ChildCareOutlined";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import MedicationIcon from "@mui/icons-material/Medication";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BiotechIcon from "@mui/icons-material/Biotech";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import HearingDisabledIcon from "@mui/icons-material/HearingDisabled";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import SoapIcon from "@mui/icons-material/Soap";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import { MyContext } from "@/utils/ContextApi";

/** Build /services/{slug}?… from CMS link_url like `/nicu?page_id=153&pageName=…`. */
function buildServiceHref(linkUrl) {
  if (!linkUrl || typeof linkUrl !== "string") return null;
  const raw = linkUrl.trim();
  if (!raw) return null;
  if (raw.startsWith("/services/")) return raw;

  try {
    const url = new URL(raw, "http://local.invalid");
    const slug = url.pathname.replace(/^\/+/, "").split("/").filter(Boolean)[0];
    if (!slug) return null;
    const qs = url.searchParams.toString();
    return `/services/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`;
  } catch {
    const cleaned = raw.replace(/^\//, "");
    return cleaned ? `/services/${cleaned}` : null;
  }
}

function ServiceCards({ iconItem, title, des, btn, slug, isNullLink, index = 0 }) {
  const { langu } = useContext(MyContext);
  const icons = {
    LocalHospitalOutlinedIcon,
    BloodtypeOutlinedIcon,
    BiotechOutlinedIcon,
    ChildCareOutlinedIcon,
    AccessibilityNewOutlinedIcon,
    MedicalServicesIcon,
    MedicationIcon,
    FactCheckOutlinedIcon,
    MonitorHeartIcon,
    SoapIcon,
    BiotechIcon,
    MedicationLiquidIcon,
    HealthAndSafetyIcon,
    HearingDisabledIcon,
    AccessibleForwardIcon,
    FaceRetouchingNaturalIcon,
  };

  const fallbackIcons = Object.values(icons);

  const cleanName = iconItem
    ?.replace(/<[^>]+>/g, "")
    .replace(/&[^;]+;/g, "")
    .trim();

  const IconComponent =
    icons[cleanName] || fallbackIcons[index % fallbackIcons.length];

  const href = useMemo(
    () => (isNullLink ? null : buildServiceHref(slug)),
    [isNullLink, slug]
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 412,
        height: 291,
        borderRadius: "26px",
        border: "1px solid #EAF0F5",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: "#2A6498",
          "& .card-title, & .card-text, & .learn-more-btn": {
            color: "#ffffff !important",
          },
          "& .icon-box": {
            backgroundColor: "#ffffff",
            "& svg": {
              color: "#2A6498",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          p: "30px 32px",
        }}
      >
        <Box>
          <Box
            className="icon-box"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#2A6498",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              transition: "all 0.3s ease",
            }}
          >
            <IconComponent sx={{ color: "#ffffff", fontSize: 28 }} />
          </Box>

          <Typography
            variant="h3"
            className="card-title"
            sx={{
              fontSize: 20,
              color: "#2A6498",
              fontWeight: 600,
              mb: 1.5,
              transition: "color 0.3s ease",
            }}
            dangerouslySetInnerHTML={{ __html: title || "" }}
          />

          <Typography
            variant="body1"
            className="card-text"
            sx={{
              fontSize: langu === "en" ? 16 : 15,
              color: "#83A5C3",
              lineHeight: "22px",
              mb: 2,
              transition: "color 0.3s ease",
              whiteSpace: "pre-line",
            }}
            dangerouslySetInnerHTML={{ __html: des || "" }}
          />
        </Box>

        <Box sx={{ mt: "auto" }}>
          {href ? (
            <Link href={href} passHref style={{ textDecoration: "none" }}>
              <Button
                className="learn-more-btn"
                sx={{
                  p: 0,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#2A6498",
                  transition: "color 0.3s ease",
                }}
                endIcon={
                  <span style={{ fontSize: "16px", marginLeft: 4 }}>→</span>
                }
              >
                <span dangerouslySetInnerHTML={{ __html: btn || "" }} />
              </Button>
            </Link>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default ServiceCards;
