import { cmsMediaUrl, CMS_PAGES, normalizeCmsData, pagePath } from "@/lib/cms";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import instance from "../api/api_instance";
import { MyContext } from "@/utils/ContextApi";
import NewsroomCards from "../components/NewsroomCards";

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

/** Build card list from slider.cards, lone card components, and title/media pairs. */
function collectStoryCards(sections) {
  const cards = [];
  const seen = new Set();

  const pushCard = (card) => {
    if (!card) return;
    const key = String(
      card.id ||
        card.title_en ||
        card.title_bn ||
        card.link_url ||
        card.description_en ||
        ""
    )
      .trim()
      .toLowerCase();
    if (key && seen.has(key)) return;
    if (key) seen.add(key);
    cards.push(card);
  };

  for (const section of sections || []) {
    for (const item of section?.data || []) {
      const emb = embed(item);
      if (!emb) continue;

      if (Array.isArray(emb.cards) && emb.cards.length) {
        emb.cards.forEach(pushCard);
        continue;
      }

      if (item.type === "card") {
        pushCard(emb);
      }
    }
  }

  // Also pair titledescription + media blocks (skip the page heading)
  for (const section of sections || []) {
    const data = section?.data || [];
    const titles = data.filter((item) => item.type === "titledescription");
    const medias = data.filter((item) => item.type === "media");
    const storyTitles = titles.length > 1 ? titles.slice(1) : [];

    storyTitles.forEach((titleItem, index) => {
      const emb = embed(titleItem);
      if (!emb?.title && !emb?.description) return;
      const mediaEmb = embed(medias[index] || medias[0]);
      pushCard({
        title_en: emb.title,
        title_bn: emb.altTitle || emb.title,
        description_en: emb.description,
        description_bn: emb.altDescription || emb.description,
        media_files: mediaEmb
          ? {
              file_path: mediaEmb.file_path,
              file_name: mediaEmb.file_name,
              file_type: mediaEmb.file_type,
            }
          : null,
        link_url: emb.link || null,
      });
    });
  }

  return cards;
}

function extractStoriesContent(sections, langu) {
  const s0 = sections?.[0];
  const s1 = sections?.[1];

  // Newsroom-style: title + media + description in section 0
  const legacyTitle = firstOfType(s0, "title");
  const legacyMedia = firstOfType(s0, "media");
  const legacyDescription = firstOfType(s0, "description");

  if (legacyTitle || (legacyMedia && legacyDescription)) {
    const cardsSection =
      (sections || []).find((section) =>
        (section?.data || []).some((item) => Array.isArray(embed(item)?.cards))
      ) || sections?.[1];
    const cardsEmbed = embed(cardsSection?.data?.[0]);

    return {
      headingHtml:
        langu === "en"
          ? legacyTitle?.value || ""
          : embed(legacyTitle)?.altText || legacyTitle?.value || "",
      imagePath: embed(legacyMedia)?.file_path || "",
      descriptionHtml:
        langu === "en"
          ? legacyDescription?.value || ""
          : embed(legacyDescription)?.altContent ||
            legacyDescription?.value ||
            "",
      cardsHeading:
        langu === "en"
          ? cardsEmbed?.title_en || ""
          : cardsEmbed?.title_bn || cardsEmbed?.title_en || "",
      cards: collectStoryCards(sections),
    };
  }

  // Seeded case-stories shape:
  // section0: banner media
  // section1: titledescription, media, titledescription, media
  // section2+: individual cards
  const titleBlocks = itemsOfType(s1, "titledescription");
  const mediaBlocks = [
    ...itemsOfType(s1, "media"),
    ...itemsOfType(s0, "media"),
  ];
  const headingBlock = titleBlocks[0];
  const storyBlock = titleBlocks[1] || titleBlocks[0];
  const headingEmb = embed(headingBlock);
  const storyEmb = embed(storyBlock);

  return {
    headingHtml: pickLocalized(
      langu,
      headingEmb?.title,
      headingEmb?.altTitle
    ),
    imagePath: embed(mediaBlocks[0])?.file_path || "",
    descriptionHtml: pickLocalized(
      langu,
      storyEmb?.description || headingEmb?.description,
      storyEmb?.altDescription || headingEmb?.altDescription
    ),
    cardsHeading: langu === "en" ? "Stories" : "স্টোরিজ",
    cards: collectStoryCards(sections),
  };
}

function cardHrefSlug(linkUrl, index) {
  if (!linkUrl || typeof linkUrl !== "string") return `story-${index + 1}`;
  return linkUrl.trim() || `story-${index + 1}`;
}

function storiesPage() {
  const { langu } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const path = router?.pathname;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(pagePath(CMS_PAGES.caseStories));
      setData(normalizeCmsData(response.data?.body) || []);
    } catch (error) {
      console.error("Error fetching case stories:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const content = useMemo(
    () => extractStoriesContent(data, langu),
    [data, langu]
  );

  const getBreadcrumbLabel = (currentPath) => {
    if (!currentPath) return langu === "en" ? "NOT FOUND" : "না পাওয়া গেল";
    const last = currentPath.split("/").filter(Boolean).pop() || "";
    const translations = {
      stories: { en: "STORIES", bn: "স্টোরিজ" },
    };
    const key = last.toLowerCase();
    if (langu === "en") return translations[key]?.en || last.toUpperCase();
    return translations[key]?.bn || last;
  };

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
          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: 16, color: "#AAAAAA" }}>
              {langu === "en" ? "HOME" : "হোম"}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} alt="" />
            <Typography
              sx={{
                fontSize: 16,
                color: "#AAAAAA",
                textTransform: langu === "en" ? "uppercase" : "none",
              }}
            >
              {getBreadcrumbLabel(router?.pathname)}
            </Typography>
          </Stack>
        </Stack>

        {content.headingHtml ? (
          <Typography
            my={4}
            sx={{ fontSize: { md: 32, xs: 18 }, fontWeight: 700, color: "#2A6498" }}
            dangerouslySetInnerHTML={{ __html: content.headingHtml }}
          />
        ) : null}

        {(content.imagePath || content.descriptionHtml) && (
          <Grid container spacing={4} my={6} alignItems={"center"}>
            <Grid size={{ xs: 12, md: 6 }}>
              {content.imagePath ? (
                <img
                  src={cmsMediaUrl(content.imagePath)}
                  alt=""
                  style={{
                    width: "100%",
                    maxWidth: "843px",
                    maxHeight: "445px",
                    borderRadius: 24,
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              ) : null}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{ fontSize: 20, textAlign: "justify" }}
                dangerouslySetInnerHTML={{ __html: content.descriptionHtml || "" }}
              />
            </Grid>
          </Grid>
        )}

        {content.cardsHeading ? (
          <Typography
            sx={{ fontSize: 28, mt: 6, mb: 2 }}
            dangerouslySetInnerHTML={{ __html: content.cardsHeading }}
          />
        ) : null}

        <Grid container spacing={2} mb={6}>
          {content.cards.map((item, index) => {
            const mediaPath =
              item?.media_files?.file_path ||
              (Array.isArray(item?.media_files) &&
                item.media_files[0]?.file_path) ||
              "";

            return (
              <Grid item key={item?.id || index} size={{ xs: 12, md: 4, xl: 3 }}>
                <NewsroomCards
                  image={
                    mediaPath
                      ? cmsMediaUrl(mediaPath)
                      : "/assets/stories/people.svg"
                  }
                  title={pickLocalized(langu, item?.title_en, item?.title_bn)}
                  description={pickLocalized(
                    langu,
                    item?.description_en,
                    item?.description_bn
                  )}
                  path={path}
                  slug={cardHrefSlug(item?.link_url, index)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

export default storiesPage;
