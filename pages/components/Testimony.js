import {
  Paper,
  Typography,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { MyContext } from "@/utils/ContextApi";

const SECTION_COLOR = "#2A6498";
const TEXT_MUTED = "#6B7280";
const BORDER_COLOR = "#E5E7EB";

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1, spaceBetween: 16 },
  600: { slidesPerView: 2, spaceBetween: 20 },
  960: { slidesPerView: 4, spaceBetween: 24 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
  1920: { slidesPerView: 4, spaceBetween: 24 },
};

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").trim();
}

function Testimony({ event }) {
  const { langu } = useContext(MyContext);
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  console.log(event, "event")

  const handleOpenDetails = (item) => {
    setSelectedCard(item);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCard(null);
  };

  const sectionTitle =
    langu === "en" ? event?.title_en : event?.altTitle;
  const cards = event?.cards ?? [];

  return (
    <Stack component="section" aria-label="Patient testimonials" spacing={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography
          component="h2"
          sx={{
            color: SECTION_COLOR,
            fontSize: { xs: 28, sm: 32, md: 36 },
            fontWeight: 700,
            lineHeight: 1.2,
          }}
          dangerouslySetInnerHTML={{ __html: sectionTitle || "" }}
        />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            ref={prevRef}
            aria-label={langu === "en" ? "Previous testimonial" : "আগের টেস্টিমোনিয়াল"}
            sx={{
              color: SECTION_COLOR,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <img src="/assets/left.svg" alt="" width={24} height={24} />
          </IconButton>
          <IconButton
            ref={nextRef}
            aria-label={langu === "en" ? "Next testimonial" : "পরবর্তী টেস্টিমোনিয়াল"}
            sx={{
              color: SECTION_COLOR,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <img src="/assets/right.svg" alt="" width={24} height={24} />
          </IconButton>
        </Stack>
      </Stack>

      <Swiper
        style={{ marginTop: 8 }}
        breakpoints={SWIPER_BREAKPOINTS}
        modules={[Navigation, Autoplay]}
        loop={cards.length > 1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
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
        className="mySwiper"
      >
        {cards.map((card, index) => {
          const description =
            langu === "en"
              ? stripHtml(card.description_en)
              : stripHtml(card.altDescription);
          const name = langu === "en" ? card.title_en : card.description_bn;
          const fullName = langu === "en" ? card.
            title_bn : card.altTitle
;

          return (
            <SwiperSlide key={card.id ?? index}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  border: `1px solid ${BORDER_COLOR}`,
                  overflow: "hidden",
                  p: 2.5,
                  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    borderColor: "divider",
                  },
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: TEXT_MUTED,
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 2,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: (langu === "en"
                      ? card.title_en
                      : card.description_bn
                    )?.replace(/&quot;/g, '"') || "",
                  }}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1.5}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDetails(card)}
                    sx={{
                      minWidth: 109,
                      height: 40,
                      fontWeight: 600,
                      borderRadius: "100px",
                      fontSize: 14,
                      textTransform: "capitalize",
                      backgroundColor: SECTION_COLOR,
                      "&:hover": {
                        backgroundColor: "#234a7a",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {langu === "en" ? "Details" : "বিস্তারিত"}
                  </Button>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: SECTION_COLOR,
                    }}
                    dangerouslySetInnerHTML={{ __html: fullName || "" }}
                  />
                </Stack>
              </Paper>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: SECTION_COLOR,
            pb: 0,
          }}
          dangerouslySetInnerHTML={{
            __html: selectedCard
              ? (langu === "en" ? selectedCard.title_en : selectedCard.altTitle) || ""
              : "",
          }}
        />
        <DialogContent>
          <DialogContentText component="div" sx={{ pt: 1.5 }}>
            <Typography
              sx={{
                fontSize: 16,
                lineHeight: 1.7,
                color: TEXT_MUTED,
                textAlign: "justify",
              }}
              dangerouslySetInnerHTML={{
                __html: selectedCard
                  ? (langu === "en" ? selectedCard.description_en : selectedCard.altDescription) || ""
                  : "",
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: "capitalize",
              borderColor: BORDER_COLOR,
              color: TEXT_MUTED,
              "&:hover": {
                borderColor: SECTION_COLOR,
                color: SECTION_COLOR,
                backgroundColor: "transparent",
              },
            }}
          >
            {langu === "en" ? "Close" : "বন্ধ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default Testimony;
