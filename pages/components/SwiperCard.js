import { cmsMediaUrl } from "@/lib/cms";
import React, { useContext, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import { MyContext } from "@/utils/ContextApi";
function SwiperCard({ data }) {
  const { langu } = useContext(MyContext);
  //  console.log(data, "data")
  const router = useRouter()
  return (
    <Swiper
      style={{ position: "relative" }}
      loop={true}
      // slidesPerView={"auto"}
      // spaceBetween={30}
      // freeMode={true}
      // allowTouchMove={true}
      // speed={5000}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }}
      pagination={{
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className} custom-dot"></span>`;
        },
      }}
      modules={[Pagination, Autoplay]}
      className="mySwiper"
    >
      {data?.map((item, index) => {
        // console.log(item, "item")
        return (
          <SwiperSlide key={index}>
            <Grid container spacing={4} mt={{ md: 2 }}>
              <Grid size={{ md: 5, xs: 12 }} mt={{ md: 2 }}>
                {langu === "en" ? (
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: item.description_en,
                    }}
                  />
                ) : (
                  <>
                    <Typography
                    sx={{fontSize: { md: 12, xl: 16 }}}
                      dangerouslySetInnerHTML={{
                        __html: item.altTitle,
                      }}
                    />

                  </>
                )}


                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#4E7EAA",
                    maxWidth: 542,
                    mt: 1,
                  }}
                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
                />
                <Stack direction={"row"} spacing={2} py={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push("/about")}
                    sx={{
                      width: 132,
                      height: 60,
                      fontWeight: 500,
                      borderRadius: 100,
                      fontSize: 16,
                      textTransform: "capitalize",
                      p: 1,
                      // backgroundColor: "#2A6498", // ✅ Initial background color set
                      color: "#2A6498", // ✅ Text color
                      "&:hover": {
                        backgroundColor: "#2A6498", // ✅ Keep same on hover
                        boxShadow: "none",
                        color: "#fff"
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                      },

                    }}
                  >
                    {langu === "en" ? "Learn More" : "আরও জানুন"}
                  </Button>
                  <Button
                    onClick={() => router.push("/contact")}
                    variant="outlined"
                    color="primary"
                    sx={{
                      width: langu === "en" ? 128 : 135,
                      height: 60,
                      fontWeight: 500,
                      borderRadius: 100,
                      fontSize: 16,
                      textTransform: "capitalize",
                      p: 1,
                      // backgroundColor: '#2A6498', // ✅ Initial background color set
                      color: "#2A6498", // ✅ Text color
                      '&:hover': {

                        backgroundColor: '#2A6498',
                        color: "#fff"

                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {langu === "en" ? "Contact Us" : "যোগাযোগ করুন"}
                  </Button>
                </Stack>
                <Stack sx={{ display: { xs: "flex", md: "none" }, mb: 3 }}>
                  <img src={cmsMediaUrl(item.media_files?.file_path)} alt="Hero" style={{ width: "100%" }} /></Stack>
                {langu === "en" ?
                  <Stack direction={{ md: "row", xs: "column" }} spacing={1} divider={
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", }} />
                  }>

                    {item.description_bn && (() => {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(item.description_bn, "text/html");
                      const ps = Array.from(doc.querySelectorAll("p"))
                        .map(p => p.textContent.trim())
                        .filter(Boolean);

                      const stats = [];
                      for (let i = 0; i < ps.length; i += 2) {
                        stats.push({ value: ps[i], label: ps[i + 1] || "" });
                      }

                      return stats.map((s, i) => (<>
                        <Stack
                          direction={{ md: "row", xs: "column" }}
                          justifyContent={"center"}
                          alignItems={"center"}
                          spacing={2}

                          sx={{ display: { xs: "flex", md: "none" } }}
                          width={"100%"}
                        >

                          <Paper
                            sx={{
                              width: "100%",
                              minHeight: 140,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            {" "}
                            <Typography
                              sx={{
                                fontWeight: 600,
                               
                                lineHeight: 1.2,
                                textAlign: "center",
                              }}
                              dangerouslySetInnerHTML={{ __html: `${s.value || ""} <br /> <span style="color:#2A6498;font-weight:500;font-size:18px">${s.label || ""}</span>` }}
                            />
                          </Paper>


                        </Stack>
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "left",
                            textAlign: "left",
                            display: { xs: "none", md: "flex" }
                          }}
                        >
                          <Typography sx={{fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: `${s.value || ""}` }} />

                          <Typography sx={{
                            color: "#2A6498",
                            fontWeight: 500,
                          }} dangerouslySetInnerHTML={{ __html: s.label || "" }} />
                        </Box></>
                      ));
                    })()}
                  </Stack> :

                  <Stack direction={{ md: "row", xs: "column" }} spacing={1} divider={
                    <Divider orientation="vertical" flexItem sx={{ borderColor: "#ccc", }} />
                  }>

                    {item.altDescription
                      && (() => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(item.altDescription
                          , "text/html");
                        const ps = Array.from(doc.querySelectorAll("p"))
                          .map(p => p.textContent.trim())
                          .filter(Boolean);

                        const stats = [];
                        for (let i = 0; i < ps.length; i += 2) {
                          stats.push({ value: ps[i], label: ps[i + 1] || "" });
                        }

                        return stats.map((s, i) => (<>
                          <Stack
                            direction={{ md: "row", xs: "column" }}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={2}

                            sx={{ display: { xs: "flex", md: "none" } }}
                            width={"100%"}
                          >

                            <Paper
                              sx={{
                                width: "100%",
                                minHeight: 140,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              {" "}
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                 
                                  lineHeight: 1.2,
                                  textAlign: "center",
                                }}
                                dangerouslySetInnerHTML={{ __html: `${s.value || ""} <br /> <span style="color:#2A6498;font-weight:500;font-size:18px">${s.label || ""}</span>` }}
                              />
                            </Paper>


                          </Stack>
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "left",
                              textAlign: "left",
                              display: { xs: "none", md: "flex" }
                            }}
                          >
                            <Typography sx={{ fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: s.value || "" }} />

                            <Typography sx={{
                              color: "#2A6498",
                              fontWeight: 500,
                            }} dangerouslySetInnerHTML={{ __html: s.label || "" }} />
                          </Box></>
                        ));
                      })()}
                  </Stack>}

              </Grid>
              <Grid size={{ md: 7, xs: 12 }} >
                <Box sx={{ position: "relative", display: { xs: "none", md: "flex" } }}>
                  <img src={cmsMediaUrl(item.media_files?.file_path)} alt="Hero" style={{ width: "100%" }} />

                  {/* Swiper pagination will be injected automatically here and positioned correctly */}
                </Box>


              </Grid>
            </Grid>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default SwiperCard;
