import { cmsMediaUrl, normalizeCmsData } from "@/lib/cms";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import FormSubmit from "../components/FormSubmit";
import instance from "../api/api_instance";
import { MyContext } from "@/utils/ContextApi";

function embed(item) {
  return item?._mave || item?._headless || null;
}

function itemsOfType(section, type) {
  return (section?.data || []).filter((item) => item?.type === type);
}

function firstOfType(section, type) {
  return itemsOfType(section, type)[0] || null;
}

function pickLocalized(langu, enValue, bnValue) {
  if (langu === "en") return enValue || bnValue || "";
  return bnValue || enValue || "";
}

function extractServiceDetail(sections, langu) {
  const banner = firstOfType(sections?.[0], "media");
  const contentSection =
    (sections || []).find(
      (section) =>
        itemsOfType(section, "titledescription").length > 0 &&
        itemsOfType(section, "media").length > 0
    ) || sections?.[1];
  const extraSection =
    (sections || []).find(
      (section, index) =>
        index > 0 &&
        section !== contentSection &&
        itemsOfType(section, "titledescription").length > 0
    ) || sections?.[2];

  const contentMedia = firstOfType(contentSection, "media");
  const contentTitles = itemsOfType(contentSection, "titledescription");
  const mainTitle = contentTitles[0] || null;
  const extraTitles = itemsOfType(extraSection, "titledescription");
  const secondaryTitle = extraTitles[extraTitles.length - 1] || extraTitles[0] || null;

  const mainEmb = embed(mainTitle);
  const secondaryEmb = embed(secondaryTitle);

  return {
    bannerPath: embed(banner)?.file_path || "",
    contentImagePath: embed(contentMedia)?.file_path || "",
    title: pickLocalized(
      langu,
      mainEmb?.title,
      mainEmb?.altTitleFirst || mainEmb?.altTitle
    ),
    description: pickLocalized(
      langu,
      mainEmb?.description,
      mainEmb?.altDescription
    ),
    secondaryTitle: pickLocalized(
      langu,
      secondaryEmb?.title,
      secondaryEmb?.altTitleFirst || secondaryEmb?.altTitle
    ),
    secondaryDescription: pickLocalized(
      langu,
      secondaryEmb?.description,
      secondaryEmb?.altDescription
    ),
  };
}

function Services() {
  const router = useRouter();
  const { query, isReady } = router;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { langu } = useContext(MyContext);

  useEffect(() => {
    if (!isReady) return;

    const fetchData = async () => {
      const slug = Array.isArray(query.services) ? query.services[0] : query.services;
      const pageId = Array.isArray(query.page_id) ? query.page_id[0] : query.page_id;

      if (!slug && !pageId) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Prefer slug — CMS link_url page_ids are often stale after reseeds
        let response = null;
        if (slug) {
          try {
            response = await instance.get(`/pages/${encodeURIComponent(slug)}`);
          } catch {
            response = null;
          }
        }
        if (!response && pageId) {
          response = await instance.get(`/pages/${encodeURIComponent(pageId)}`);
        }
        setData(normalizeCmsData(response?.data?.body) || []);
      } catch (error) {
        console.error("Error fetching service detail:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isReady, query.services, query.page_id]);

  const content = useMemo(
    () => extractServiceDetail(data, langu),
    [data, langu]
  );

  const breadcrumbLabel = (() => {
    if (langu !== "en") {
      return (
        content.title ||
        (typeof query.pageName === "string" ? query.pageName : "") ||
        "সেবা"
      );
    }
    if (typeof query.pageName === "string" && query.pageName) return query.pageName;
    if (typeof query.services === "string") {
      return query.services.split("-").join(" ");
    }
    return "Service";
  })();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <BeatLoader color="#191919" size={30} />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 2 }}>
        <Stack justifyContent={"center"} alignItems={"center"}>
          <Typography
            sx={{
              fontSize: { md: 60, xs: 40 },
              fontWeight: 500,
              textTransform: "capitalize",
              textAlign: "center",
            }}
            dangerouslySetInnerHTML={{
              __html: (() => {
                const isEn = langu === "en";
                const servicesText = isEn ? "Services" : "সেবাসমূহ";
                const titleText = isEn
                  ? breadcrumbLabel || "Our"
                  : content.title || "আমাদের";
                if (
                  String(titleText)
                    .toLowerCase()
                    .includes(String(servicesText).toLowerCase())
                ) {
                  return titleText;
                }
                return `${titleText} <span style="color:#12A551">${servicesText}</span>`;
              })(),
            }}
          />
          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: 16, color: "#AAAAAA" }}>
              {langu === "en" ? "HOME" : "হোম"}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} alt="" />
            <Typography
              sx={{
                fontSize: 16,
                color: "#AAAAAA",
                textTransform: "uppercase",
              }}
            >
              {langu === "en" ? "Services" : "সেবাসমূহ"}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} alt="" />
            <Typography
              sx={{
                fontSize: 16,
                color: "#AAAAAA",
                textTransform: "uppercase",
              }}
              dangerouslySetInnerHTML={{ __html: breadcrumbLabel || "" }}
            />
          </Stack>
        </Stack>

        {content.bannerPath ? (
          <img
            src={cmsMediaUrl(content.bannerPath)}
            width={"100%"}
            alt=""
            style={{
              marginTop: "23px",
              height: 469,
              borderRadius: 16,
              objectFit: "cover",
            }}
          />
        ) : null}
      </Box>

      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto" }}>
        {(content.title || content.description || content.contentImagePath) && (
          <Grid container spacing={4} my={5} alignItems={"center"}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction={"column"} spacing={1}>
                <Typography
                  sx={{
                    color: "#2A6498",
                    fontSize: { md: 36, xs: 24 },
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                  dangerouslySetInnerHTML={{ __html: content.title || "" }}
                />
                <Typography
                  sx={{
                    color: "#222222",
                    fontSize: 16,
                    textAlign: "justify",
                    width: "100%",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: content.description || "",
                  }}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {content.contentImagePath ? (
                <img
                  src={cmsMediaUrl(content.contentImagePath)}
                  alt=""
                  style={{
                    width: "100%",
                    maxWidth: "873px",
                    maxHeight: "553px",
                    borderRadius: 16,
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </Grid>
          </Grid>
        )}

        {content.secondaryTitle ? (
          <Typography
            sx={{ color: "#2A6498", fontSize: 36, fontWeight: 700, mb: 2 }}
            dangerouslySetInnerHTML={{ __html: content.secondaryTitle || "" }}
          />
        ) : null}

        {content.secondaryDescription ? (
          <Typography
            sx={{
              color: "#222222",
              fontSize: 16,
              textAlign: "justify",
              width: "100%",
            }}
            dangerouslySetInnerHTML={{
              __html: content.secondaryDescription || "",
            }}
          />
        ) : null}

        <FormSubmit />
      </Box>
    </>
  );
}

export default Services;
