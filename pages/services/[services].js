import { cmsMediaUrl, normalizeCmsData } from "@/lib/cms";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Articles from "../components/Articles";
import { BeatLoader } from "react-spinners";
import FormSubmit from "../components/FormSubmit";
import instance from "../api/api_instance";
import { MyContext } from "@/utils/ContextApi";

function Services() {
  const router = useRouter();
  const { query } = router;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { langu } = useContext(MyContext);
  console.log(data, "service")
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/pages/${query?.page_id}`);
      setData(normalizeCmsData(response.data.body));
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);
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
                  ? router?.query.services?.split("-").join(" ") || "Our"
                  : data[1]?.data[1]?._mave?.altTitleFirst || "আমাদের";
                if (titleText.toLowerCase().includes(servicesText.toLowerCase())) {
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
            <img src={"/assets/about/rightArrow.svg"} width={14} />
            <Typography sx={{ fontSize: 16, color: "#AAAAAA", textTransform: "uppercase" }}>
              {langu === "en" ? "Services" : "সেবাসমূহ"}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} />
            <Typography sx={{ fontSize: 16, color: "#AAAAAA", textTransform: "uppercase" }}>
              {langu === "en" ? router?.query.services ? router.query.services.split("-").join(" ") : "Not Found" : data[1]?.data[1]?._mave?.
                altTitleFirst}

            </Typography>
          </Stack>
        </Stack>

        <img
          src={cmsMediaUrl(data[0]?.data[0]?._mave?.file_path)}
          width={"100%"}
          style={{ marginTop: "23px", height: 469, borderRadius: 16, objectFit: "cover" }}
        />
      </Box>

      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", }}>
        <Grid container spacing={4} my={5} alignItems={"center"}  >
          {/* inner grid 1 */}
          <Grid size={{ xs: 12, md: 6 }}  >
            <Stack direction={"column"} spacing={1}>
              <Stack direction={"column"}>  <Typography
                sx={{ color: "#2A6498", fontSize: { md: 36, xs: 24 }, fontWeight: 700, textTransform: "uppercase" }}
                dangerouslySetInnerHTML={{ __html: (langu === "en" ? data[1]?.data[1]?._mave?.title : data[1]?.data[1]?._mave?.altTitleFirst) || "" }}
              />
                {/* <Typography sx={{ color: "#222222", fontSize: 28 }}>
                  Medicine
                </Typography>  */}
              </Stack>

              <Typography
                sx={{
                  color: "#222222",
                  fontSize: 16,
                  textAlign: "justify",

                  width: "100%",

                }}
                dangerouslySetInnerHTML={{
                  __html: langu === "en" ? data[1]?.data[1]?._mave?.description : data[1]?.data[1]?._mave?.altDescription,
                }}
              >

              </Typography>

              {/* <Typography
                sx={{
                  color: "#222222",
                  fontSize: 16,
                  textAlign: "justify",

                  width: "100%",
                  maxWidth: 600,
                }}
              >
                The organisation has come a long way since its humble beginnings
                in 1993 when it was presented as a gift by our Founder, Syed
                Humayun Kabir, to the patron Sajida Humayun Kabir to mark their
                25th wedding anniversary. Syed Humayun Kabir served as SAJIDA’s
                Chairperson for almost two decades and also as board member of
                Renata Limited.
              </Typography> */}
            </Stack>
          </Grid>
          {/* inner grid 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <img
              src={cmsMediaUrl(data[1]?.data[0]?._mave?.file_path)}
              style={{ width: "100%", maxWidth: "873px", maxHeight: "553px", borderRadius: 16, objectFit: "cover" }}
            />
          </Grid>
        </Grid>

        <Typography
          sx={{ color: "#2A6498", fontSize: 36, fontWeight: 700, mb: 2 }}
          dangerouslySetInnerHTML={{ __html: (langu === "en" ? data[1]?.data[2]?._mave?.title : data[1]?.data[2]?._mave?.altTitleFirst) || "" }}
        />

        <Typography
          sx={{
            color: "#222222",
            fontSize: 16,
            textAlign: "justify",

            width: "100%",

          }}
          dangerouslySetInnerHTML={{
            __html: langu === "en" ? data[1]?.data[2]?._mave?.description : data[1]?.data[2]?._mave?.altDescription,
          }}
        >

        </Typography>

        {/* <Box component="ul" sx={{ pl: 4, mb: 4 }}>
          <Typography
            component="li"
            sx={{ fontSize: 16, color: "#222222", mb: 1 }}
          >
            Etiam blandit felis justo, vel vulputate enim vulputate vulputate
          </Typography>
          <Typography
            component="li"
            sx={{ fontSize: 16, color: "#222222", mb: 1 }}
          >
            Ord varius netaque penatibus et magnis dis parturient mentes
          </Typography>
          <Typography
            component="li"
            sx={{ fontSize: 16, color: "#222222", mb: 1 }}
          >
            Nascenas vitae lectus o orci tristique sollicitudin eos sed nisi
          </Typography>
          <Typography
            component="li"
            sx={{ fontSize: 16, color: "#222222", mb: 1 }}
          >
            Nullam elit ligula, sodales sed mauris nt, cursus porttitor est
          </Typography>
        </Box>

        <Grid container spacing={5} py={1} >
          <Grid size={{ md: 6, xs: 12 }}>
            <Stack direction={"column"}>
              <Typography
                sx={{
                  color: "#2A6498",
                  fontSize: 28,
                  fontWeight: 700,
                  mb: 3,

                }}
              >
                Advantages
              </Typography>

              <Typography
                sx={{
                  color: "#222222",
                  fontSize: 18,
                  textAlign: "justify",

                  mb: 4,
                  width: "100%",
                  maxWidth: 1200,
                }}
              >
                Donec commodo ercu porttitor neque convallis tincidunt. Proin
                viverra consectetur odio, ci imperdiet turpis malesuada eu.
                Nascenas quis turpis o nisi pulvinar convallis vitae sed massa.
                Aliquam eget por minus erus.
              </Typography>

              <Typography
                sx={{
                  color: "#222222",
                  fontSize: 18,
                  textAlign: "justify",
                  mb: 4,
                  width: "100%",
                  maxWidth: 1200,
                }}
              >
                Nullam placerat, tellus eu eleifend ultricies, turpis augue
                rutrum justo, ut molestie purus locus ut magna.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ md: 6, xs: 12 }}>
            <Stack direction={"column"}>
              <Typography
                sx={{
                  color: "#2A6498",
                  fontSize: 28,
                  fontWeight: 700,
                  mb: 3,

                }}
              >
                Health Care Plans
              </Typography>

              <Typography
                sx={{
                  color: "#222222",
                  fontSize: 18,
                  textAlign: "justify",
                  mb: 4,
                  width: "100%",
                  maxWidth: 1200,
                }}
              >
                Cros kocino sit amet elit eu occumsan. Vestibulum auctor nec
                metus e sodales. Proin dignissim sem vel ipsum occumsan congue.
                Quisque looreet orci diam, non fringilla massa fusius nec. Horbi
                turpis elit, aliquam imperdiet tempor eu, semper vel diam.Cros
                kocino sit amet elit eu occumsan. Vestibulum auctor nec metus e
                sodales. Proin dignissim sem vel ipsum occumsan congue. Quisque
                looreet orci diam, non fringilla massa fusius nec. Horbi turpis
                elit, aliquam imperdiet tempor eu, semper vel diam.
              </Typography>
            </Stack>
          </Grid>
        </Grid> */}

        {/* here */}
        <FormSubmit />
      </Box>

      {/* Fixing the Box to properly render */}
      {/* <Box sx={{ padding: 2, textAlign: "center" }}>
        {router.query.services ? (
          <Typography variant="h6">Service: {router.query.services}</Typography>
        ) : (                     
          <Typography variant="h6">Service Not Found</Typography>
        )}
      </Box>
      <Box>{router.query.services}</Box> */}
    </>
  );
}

export default Services;
