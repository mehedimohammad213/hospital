import { cmsMediaUrl, normalizeCmsData } from "@/lib/cms";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import instance from "./api/api_instance";
import FaqCom from "./components/FaqCom";
import { MyContext } from "@/utils/ContextApi";


function contact() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { langu } = useContext(MyContext);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/pages/contact-us");

      setData(normalizeCmsData(response.data.body));
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <Typography sx={{ fontSize: { md: 60, xs: 40 }, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? "Contact " : "যোগাযোগ ") + '<span style="color:#12A551">' + (langu === "en" ? "Room" : "রুম") + '</span>' }} />
          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: 16, color: "#AAAAAA" }}>
              {langu === "en" ? "HOME" : "হোম"}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} />
            <Typography
              sx={{
                fontSize: 16,
                color: "#AAAAAA",
                textTransform: "uppercase",
              }}
            >
              {langu === "en" ? (router?.pathname ? router?.pathname?.split("/") : "Not Found") : "যোগাযোগ"}
            </Typography>
          </Stack>
        </Stack>
        <img
          src={cmsMediaUrl(data[0]?.data[0]?._mave?.file_path)}
          width={"100%"}
          style={{ marginTop: "23px", height: 469, borderRadius: 16, objectFit: "cover" }}
        />

        <Typography
          sx={{
            color: "#2A6498",
            fontSize: 36,
            fontWeight: 700,
            textTransform: "uppercase",
            mt: 5,
          }}
          dangerouslySetInnerHTML={{ __html: (langu === "en" ? data[1]?.data[0]?._mave?.title : data[1]?.data[0]?._mave?.altTitleFirst) || "" }} />
        <Typography
          my={2}
          // sx={{ color: "#222222", fontSize: 28 }}
          dangerouslySetInnerHTML={{
            __html: langu === "en" ? data[1]?.data[0]?._mave?.description || "" : data[1]?.data[0]?._mave?.altDescription || "",
          }}
        />

        <Grid container spacing={2}>
          {/* first grid */}
          <Grid size={{ md: 6, xs: 12 }}>
            {/* <Typography
              sx={{
                fontSize: 16,
                color: "#7A7A7A",
                textAlign: "justify",
                maxWidth: 650,
              }}
              dangerouslySetInnerHTML={{
                __html: data[1]?.data[0]?._mave?.altDescription || "",
              }}
            /> */}

            <Stack my={3} direction={{ md: "row", xs: "column" }} spacing={2}>
              <Stack direction={{ md: "row", xs: "column" }} spacing={2}>
                <img src={"/assets/contact/address.svg"} width={44} />
                <Stack direction={"column"}>
                  <Typography sx={{ fontSize: 17 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? data[2]?.data[0]?._mave?.title : data[2]?.data[0]?._mave?.altTitleFirst) || "" }} />
                  <Typography
                    sx={{ fontSize: 16, color: "#7A7A7A", maxWidth: 199 }}
                    dangerouslySetInnerHTML={{
                      __html: langu === "en" ?data[2]?.data[0]?._mave?.description || "": data[2]?.data[0]?._mave?.altDescription || "",
                    }}
                  />
                </Stack>
              </Stack>
              {/* another one */}
              <Stack direction={{ md: "row", xs: "column" }} spacing={2}>
                <img src={"/assets/contact/email.svg"} width={44} />
                <Stack direction={"column"}>
                  <Typography sx={{ fontSize: 17 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? data[2]?.data[1]?._mave?.title : data[2]?.data[1]?._mave?.altTitleFirst) || "" }} />
                  <Typography
                    sx={{ fontSize: 16, color: "#7A7A7A", maxWidth: 199 }}
                    dangerouslySetInnerHTML={{
                      __html: langu === "en" ? data[2]?.data[1]?._mave?.description || "": data[2]?.data[1]?._mave?.altDescription || "",
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Stack my={3} direction={{ md: "row", xs: "column" }} spacing={2}>
              <img src={"/assets/contact/number.svg"} width={44} />
              <Stack direction={"column"}>
                <Typography sx={{ fontSize: 17 }} dangerouslySetInnerHTML={{ __html: (langu === "en" ? data[2]?.data[2]?._mave?.title : data[2]?.data[2]?._mave?.altTitleFirst) || "" }} />
                <Typography
                  sx={{ fontSize: 16, color: "#7A7A7A",  }}
                  dangerouslySetInnerHTML={{
                    __html: langu === "en" ? data[2]?.data[2]?._mave?.description || "": data[2]?.data[2]?._mave?.altDescription || "",
                  }}
                />
              </Stack>
            </Stack>
            <hr
              style={{
                border: "none",
                height: "2px",
                backgroundColor: "#F0F0F0",
                // width: 319,
                margin: "18px auto",
              }}
            />
            {/* logos */}

            <Stack mt={5} direction={"row"} spacing={1}>
              <img src={"/assets/contact/facebook.svg"} width={33} />
              <img src={"/assets/contact/twitter.svg"} width={33} />
              <img src={"/assets/contact/youtube.svg"} width={33} />
              <img src={"/assets/contact/linkedin.svg"} width={33} />
            </Stack>
          </Grid>
          {/* second grid */}
          <Grid size={{ md: 6, xs: 12 }}>
            <Paper elevation={0} sx={{ border: "1px solid #EAF0F5", p: 2 }}>
              <Stack alignItems={"start"}>
                <Typography sx={{ my: 2, fontWeight: 500, fontSize: 14 }}>
                  {langu === "en" ? "Name" : "নাম"} <span style={{ color: "#0E0E25" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder={langu === "en" ? "Enter your name" : "আপনার নাম লিখুন"}
                  variant="outlined"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: 16,
                      backgroundColor: "#F9F9FE",
                    },

                    width: "100%",
                  }}
                />
              </Stack>
              <Stack
                direction={{ md: "row", xs: "column" }}
                spacing={{ md: 3, xs: 0 }}
                width={"100%"}
              >
                <Stack alignItems={"start"} width={"100%"}>
                  <Typography sx={{ my: 2, fontWeight: 500, fontSize: 14 }}>
                    {langu === "en" ? "Phone" : "ফোন"} <span style={{ color: "#0E0E25" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={langu === "en" ? "+1 (234) 567 890" : "+১ (২৩৪) ৫৬৭ ৮৯০"}
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: 16,
                        backgroundColor: "#F9F9FE",
                      },

                      width: "100%",
                    }}
                  />
                </Stack>
                <Stack alignItems={"start"} width={"100%"}>
                  <Typography sx={{ my: 2, fontWeight: 500, fontSize: 14 }}>
                    {langu === "en" ? "Email" : "ইমেইল"} <span style={{ color: "#0E0E25" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={langu === "en" ? "example@mail.com" : "example@mail.com"}
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: 16,
                        backgroundColor: "#F9F9FE",
                      },

                      width: "100%",
                    }}
                  />
                </Stack>
              </Stack>
              <Stack alignItems={"start"} width={"100%"}>
                <Typography sx={{ my: 2, fontWeight: 500, fontSize: 14 }}>
                  {langu === "en" ? "Message" : "বার্তা"} <span style={{ color: "#0E0E25" }}>*</span>
                </Typography>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  placeholder={langu === "en" ? "Hello there!" : "হ্যালো!"}
                  variant="outlined"
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: 16,
                      backgroundColor: "#F9F9FE",
                    },

                    width: "100%",
                  }}
                />
              </Stack>
              <Box my={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#2A6498",
                    color: "white",
                    fontSize: 16,
                    px: 4,
                    py: 1,
                    "&:hover": {
                      bgcolor: "#2A6498",
                    },
                    maxwidth: 267,
                    borderRadius: 100,
                    textTransform: "capitalize",
                  }}
                >
                  {langu === "en" ? "Submit Form" : "ফর্ম জমা দিন"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {/* map section */}
        <Stack sx={{ width: "100%", mt: 3 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18236.325697473294!2d90.39593963955079!3d23.78058080000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7006f2b3f23%3A0x8e9fb6342f63d08!2sSAJIDA%20Foundation!5e1!3m2!1sen!2sbd!4v1754818171089!5m2!1sen!2sbd"
            allowfullscreen=""
            height={400}
            style={{ borderRadius: 24 }}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </Stack>
        {/* FAQ component */}
        {/* <FaqCom /> */}
      </Box>
    </>
  );
}

export default contact;
