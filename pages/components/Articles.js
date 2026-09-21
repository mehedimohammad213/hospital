import { cmsMediaUrl } from "@/lib/cms";
import { Paper, Typography, Chip, Box, Stack, IconButton } from "@mui/material";
import React, { useContext, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { useRouter } from "next/router";
import { MyContext } from "@/utils/ContextApi";
function Articles({ event, headingSubTitle, headingTitle }) {
    // console.log(event, "event")
  const router = useRouter()
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { langu } = useContext(MyContext);
  const breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 10 },
    380: { slidesPerView: 1, spaceBetween: 15 },
    600: { slidesPerView: 2, spaceBetween: 20 },
    900: { slidesPerView: 3, spaceBetween: 10 },
    1200: { slidesPerView: 3, spaceBetween: 10 },
    1920: { slidesPerView: 4, spaceBetween: 10 },
  };
  return (
    <>
      <Stack>
        {/* <Typography sx={{ color: "#2A6498", fontSize: 36, fontWeight: 700 }}>
          {headingTitle}
        </Typography> */}

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >

          <Typography sx={{ color: "#2A6498", fontSize: 36, fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: headingTitle || "" }} />

          <Stack direction={"row"}>
            <IconButton ref={prevRef}>
              <img src="/assets/left.svg" alt="" width={30} />
            </IconButton>
            <IconButton ref={nextRef}>
              <img src="/assets/right.svg" alt="" width={30} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Swiper
        style={{ marginTop: 20, marginBottom: 20 }}
        breakpoints={breakpoints}
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation?.init();
          swiper.navigation?.update();
        }}
        // spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        {event?.map((event, index) => (
          <SwiperSlide key={index} onClick={() => router.push(`/newsroom/${event?.link_url}`)} style={{ cursor: "pointer" }} >
            <Paper
              sx={{
                borderRadius: 5,
                position: "relative",
                maxWidth: 412,
                height: 300,
                mt: 3,
                mb: 1,
              }}
            >
              {/* Date badge */}
              <Chip
                label={langu === "en" ? event?.title_en : event?.altTitle?.replace(/<[^>]+>/g, '')}
                sx={{
                  position: "absolute",
                  top: 42,
                  right: 0,
                  bgcolor: "#12A551",
                  color: "#fff",
                  fontSize: 16,
                  borderRadius: 0,
                  borderTopLeftRadius: 12,
                  fontWeight: 500,
                }}
              />

              {/* Image */}
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <img
                  src={cmsMediaUrl(event?.media_files?.file_path)}
                  alt={event?.title}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 200,
                  }}
                />
              </Box>

              {/* Title */}
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#2A6498",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: (langu === "en" ? event.description_en : event.altDescription) || "",
                  }}
                />
              </Box>
            </Paper>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Articles;
