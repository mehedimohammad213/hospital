import { cmsMediaUrl, normalizeCmsData } from "@/lib/cms";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import instance from "../api/api_instance";
import { BeatLoader } from "react-spinners";
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

function extractStoryDetail(sections, langu) {
  const section0 = sections?.[0];
  const media = firstOfType(section0, "media");
  const titleBlock =
    firstOfType(section0, "titledescription") ||
    firstOfType(sections?.[1], "titledescription");
  const emb = embed(titleBlock);

  return {
    bannerPath: embed(media)?.file_path || "",
    title: pickLocalized(
      langu,
      emb?.title,
      emb?.altTitleFirst || emb?.altTitle
    ),
    description: pickLocalized(langu, emb?.description, emb?.altDescription),
  };
}

function Stories() {
  const router = useRouter();
  const { query, isReady } = router;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { langu } = useContext(MyContext);

  useEffect(() => {
    if (!isReady) return;

    const fetchData = async () => {
      const slug = Array.isArray(query.stories) ? query.stories[0] : query.stories;
      const pageId = Array.isArray(query.page_id) ? query.page_id[0] : query.page_id;

      if (!slug && !pageId) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
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
        console.error("Error fetching story detail:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isReady, query.stories, query.page_id]);

  const content = useMemo(
    () => extractStoryDetail(data, langu),
    [data, langu]
  );

  const breadcrumbLabel = (() => {
    if (typeof query.pageName === "string" && query.pageName) return query.pageName;
    if (content.title) return content.title.replace(/<[^>]+>/g, "");
    if (typeof query.stories === "string") {
      return query.stories.split("-").join(" ");
    }
    return langu === "en" ? "Story" : "স্টোরি";
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
    <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 2 }}>
      <Stack justifyContent="center" alignItems="center">
        <Typography sx={{ fontSize: { md: 60, xs: 40 }, fontWeight: 500 }}>
          {langu === "en" ? (
            <>
              Case <span style={{ color: "#12A551" }}>Stories</span>
            </>
          ) : (
            <>
              কেস <span style={{ color: "#12A551" }}>স্টোরিজ</span>
            </>
          )}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 16, color: "#AAAAAA" }}>
            {langu === "en" ? "HOME" : "হোম"}
          </Typography>
          <img
            src="/assets/about/rightArrow.svg"
            width={14}
            alt="Right Arrow"
          />
          <Typography
            sx={{ fontSize: 16, color: "#AAAAAA", textTransform: "uppercase" }}
          >
            {langu === "en" ? "Stories" : "স্টোরিজ"}
          </Typography>
          <img
            src="/assets/about/rightArrow.svg"
            width={14}
            alt="Right Arrow"
          />
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
          width="100%"
          alt="Case Stories Banner"
          style={{
            marginTop: "23px",
            height: 469,
            borderRadius: 16,
            objectFit: "cover",
          }}
        />
      ) : null}

      <Grid container spacing={4} my={5} alignItems={"center"}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Stack direction={"column"}>
            <Stack direction={"column"} spacing={2}>
              <Typography
                sx={{
                  color: "#2A6498",
                  fontSize: { md: 30, xs: 24 },
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
                dangerouslySetInnerHTML={{ __html: content.title || "" }}
              />
            </Stack>
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
      </Grid>
    </Box>
  );
}

export default Stories;
