import { cmsMediaUrl } from "@/lib/cms";
import React, { useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Stack,
} from "@mui/material";
import { BeatLoader } from "react-spinners";
import { MyContext } from "@/utils/ContextApi";

function FaqCom({ event, loading }) {
  // console.log(event, "fq")
  const { langu } = useContext(MyContext);

  const [expanded, setExpanded] = useState(null);
  const toggle = (index) =>
    setExpanded((prev) => (prev === index ? null : index));

  if (!event || event.length < 3) {
    return <BeatLoader color="#191919" size={30} />;
  }


  return (
    <>
      <Grid my={5} container spacing={6}>
        {/* first grid */}
        <Grid size={{ md: 5, xs: 12 }}>
          <img
            src={
              event?.[2]?._mave?.file_path
                ? cmsMediaUrl(event[2]._mave.file_path) : "/fallback-image.jpg"
            }
            width="100%"
            alt="FAQ"
            style={{ borderRadius: 10 }}
          />

        </Grid>

        {/* second grid */}
        <Grid size={{ md: 7, xs: 12 }}>
          <Typography sx={{ fontSize: 36, color: "#2A6498", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? event[1]?._mave?.title || "" : event[2]?._mave?.altTitle) || "" }} />
          <Typography sx={{ fontSize: 28 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? event[1]?._mave?.altTitle || "" : event[2]?._mave?.altDescription) || "" }} />
          {/* <Typography
            sx={{
              fontSize: 16,
              color: "#AAAAAA",
              textAlign: "justify",
              width: "100%",
              mt: 2,
            }}
            dangerouslySetInnerHTML={{
              __html: event[1]?._mave?.description || "",
            }}
          /> */}

          {/* accordion */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 3,

              border: "1px solid",
              borderColor: "#E7ECF2",
              backgroundColor: "#FAFBFC",
            }}
          >
            {event[3]?._mave?.testimonials
              ?.map((item, i) => {
                const isOpen = expanded === i;
                return (
                  <Accordion
                    key={i}
                    disableGutters
                    elevation={0}
                    expanded={isOpen}
                    onChange={() => toggle(i)}
                    sx={{
                      "&::before": { display: "none" },
                      borderBottom:
                        i === item.length - 1 ? "none" : "1px solid #E7ECF2",
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        minHeight: 56,
                        "& .MuiAccordionSummary-content": { m: 0 },
                      }}
                    >
                      <Stack direction="row" alignItems="center" width="100%">
                        <Typography sx={{ fontSize: 18 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? item?.author : item?.altAuthor) || "" }} />
                        <Box flex={1} />
                        {/* Right circular button with a white cross (plus → × when open) */}
                        <IconButton
                          disableRipple
                          aria-label={isOpen ? "Collapse" : "Expand"}
                          sx={{
                            ml: 2,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "#2A6498",
                            "&:hover": { bgcolor: "#2A6498" }, // keep solid like screenshot
                            p: 0,
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: 14,
                              height: 14,
                              "&::before, &::after": {
                                content: '""',
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                width: 14,
                                height: 2,
                                bgcolor: "#FFFFFF",
                                transform: "translate(-50%, -50%) rotate(0deg)",
                                transition: "transform .2s ease",
                                borderRadius: 1, // subtle rounding
                              },
                              // vertical bar for the plus
                              "&::after": {
                                transform: "translate(-50%, -50%) rotate(90deg)",
                              },
                              ...(isOpen && {
                                // turn into an "×"
                                "&::before": {
                                  transform:
                                    "translate(-50%, -50%) rotate(45deg)",
                                },
                                "&::after": {
                                  transform:
                                    "translate(-50%, -50%) rotate(-45deg)",
                                },
                              }),
                            }}
                          />
                        </IconButton>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2.5, pb: 2, pt: 0 }}>
                      <Typography sx={{ color: "#AAAAAA", fontSize: 14 }} dangerouslySetInnerHTML={{
                        __html: langu === "en" ? item?.quote : item?.altQuote,
                      }}>
                        {/* {item.quote} */}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default FaqCom;
