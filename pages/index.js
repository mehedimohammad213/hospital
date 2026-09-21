import { cmsMediaUrl, normalizeCmsData } from "@/lib/cms";
import React, { useContext, useEffect, useState } from "react";
import { Box, Paper, Stack, Typography, Grid, Button } from "@mui/material";
import SwiperCard from "./components/SwiperCard";
import ConteactItemCard from "./components/ConteactItemCard";
import AboutHeroSection from "./components/AboutHeroSection";
import { useRouter } from "next/router";

import ServiceCards from "./components/ServiceCards";
import Bodypart from "./components/Bodypart";
import Dep_Doctor_bodyparts from "./components/Dep_Doctor_bodyparts";
import { Article } from "@mui/icons-material";
import Articles from "./components/Articles";
import Testimony from "./components/Testimony";
import { BeatLoader } from "react-spinners";
import dynamic from "next/dynamic";
import instance from "./api/api_instance";
import FaqCom from "./components/FaqCom";
import { MyContext } from "@/utils/ContextApi";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
function Home() {
  const router = useRouter();
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const handleBodyPartSelect = (bodyPart, departments) => {
    setSelectedBodyPart(bodyPart);
    setSelectedDepartments(departments);
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const { langu } = useContext(MyContext);
  // console.log(data, "data")
  useEffect(() => {
    fetch("/services.json")
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/pages/homepage");
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
        <SwiperCard data={data[0]?.data[0]?._mave?.cards} />
      </Box>
      <Box
        bgcolor={"#2A6498"}
        sx={{
          // height: { md: 181 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent={"space-between"}
          py={4}
          alignItems={"center"}
          sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto" }}
        >
          {data[2]?.data[0]?._mave?.testimonials.map((item, index) => (
            <Grid size={{ md: 4, xs: 12 }} key={index}>
              <ConteactItemCard
                image={cmsMediaUrl(item?.image?.file_path)}
                title={langu === "en" ? item?.author : item?.
                  altAuthor
                }
                description={langu === "en" ? item?.quote : item?.altQuote}
              />{" "}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 2 }}>
        <AboutHeroSection
          image1={cmsMediaUrl(data[3]?.data[0]?._mave?.file_path)}
          image2={cmsMediaUrl(data[3]?.data[1]?._mave?.file_path)}
          title1={langu === "en" ? data[3]?.data[2]?._mave?.title : data[3]?.data[2]?._mave?.altTitleFirst}
          title2={langu === "en" ? data[3]?.data[2]?._mave?.altTitle : data[3]?.data[2]?._mave?.altTitleSecond}
          subtitle1={langu === "en" ? data[3]?.data[2]?._mave?.description : data[3]?.data[2]?._mave?.altDescription}
          // subtitle2={data[3]?.data[2]?._mave?.altDescription}
          // description={
          //   data[3]?.data[2]?._mave?.altDescription
          // }
          image3={"/assets/Goal-removebg-preview.png"}
          title3={langu === "en" ? data[3]?.data[3]?._mave?.title : data[3]?.data[3]?._mave?.altTitleFirst}
          des1={
            langu === "en" ? data[3]?.data[3]?._mave?.description : data[3]?.data[3]?._mave?.altDescription
          }
          image4={"/assets/about/vision.svg"}
          title4={langu === "en" ? data[3]?.data[4]?._mave?.title : data[3]?.data[4]?._mave?.altTitleFirst}
          des2={
            langu === "en" ? data[3]?.data[4]?._mave?.description : data[3]?.data[4]?._mave?.altDescription

          }
          button1={langu === "en" ? "Learn More" : "আরও জানুন"}
          disable={router?.pathname}
        />
      </Box>
      <Box
        sx={{
          backgroundImage: "url('/assets/about/homesevice.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // height: "100vh",
          // width: "90%", maxWidth: "1500px", margin: "0 auto",
          border: "1px solid #EAF0F5",
        }}
      >
        <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto" }}>
           <Stack direction={"column"} justifyContent={"flex-end"} alignItems={"flex-end"} py={3}>
             <Button variant="outlined" color="primary"  sx={{
                // width: 192.72,
                // height: 57,
                fontWeight: 500,
                 borderRadius: 100,
                fontSize: 16,
                marginTop: 4,
                textTransform: "capitalize",
                outline:"none",
                border:"none",
                px: 2,
                backgroundColor: "#2A6498",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                  boxShadow: "none",
                  color: "#2A6498",
                },
              }} endIcon={<ArrowForwardIosIcon />} onClick={() => router.push('/services')}>
             {langu === "en" ? "See more" : "আরও দেখুন"}
           </Button></Stack> 
          <Grid container spacing={2}  mb={5}>
            {data[8]?.data[1]?._mave?.cards?.slice(0, 5).map((item, index) => {
               const isNullLink = item?.link_url === null;
             
              return (
                <Grid size={{ xs: 12, lg: 4, xl: 3 }} key={index}>
                  <ServiceCards title={langu === "en" ? item.title_en : item.altTitle} des={langu === "en" ? item.description_en : item.altDescription
                  } btn={langu === "en" ? "Learn More" : "আরও জানুন"} iconItem={item.description_bn} slug={item.link_url} index={index} isNullLink={isNullLink} />
                  
                </Grid>
              )
            })}
          
          </Grid>
        </Box>
      </Box>
      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto" }}>
        <Grid container spacing={4}>
          <Grid
            size={{ xs: 12, md: 7, xl: 8 }}
            sx={{ order: { xs: 2, md: 0 } }}
          >
            <Dep_Doctor_bodyparts
              selectedBodyPart={selectedBodyPart}
              selectedDepartments={selectedDepartments}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5, xl: 4 }} mt={{ md: 6, xs: 0 }}>
            <Stack
              direction={"row"}
              alignItems={"flex-end"}
              justifyContent={"flex-end"}
              py={{ md: 6, xs: 0 }}
            >
              {" "}
              <Box
                sx={{
                  backgroundColor: "#FFFFFF",
                  px: 3,
                  py: 1,
                  borderRadius: 100,
                }}
              >
                <Typography
                  fontSize={18}
                  fontWeight={600}
                  sx={{
                    background: "linear-gradient(to right, #12A551, #76CB9A)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {langu === "en" ? "Select Body Part" : "শরীরের অংশ নির্বাচন করুন"}
                </Typography>
              </Box>
            </Stack>

            <Bodypart onBodyPartSelect={handleBodyPartSelect} />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.45),
        rgba(0, 0, 0, 0.45)
      ), url(${cmsMediaUrl(data[4]?.data[0]?._mave?.testimonials[0]?.image?.file_path)})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: { xs: "300px", sm: "400px", md: "466px" },
          mt: 2,

        }}
      >
        <Stack direction="column" spacing={2} sx={{ py: 4, px: 3, width: "90%", maxWidth: "1720px", margin: "0 auto", }}>
          <Typography
            color="#fff"
            fontWeight="bold"
            textTransform="uppercase"
            sx={{
              fontSize: { xs: 22, sm: 28, md: 40 },
            }}
            dangerouslySetInnerHTML={{
              __html: (langu === "en" ? data[4]?.data[0]?._mave?.testimonials[0]?.author : data[4]?.data[0]?._mave?.testimonials[0]?.altAuthor) || "",
            }}
          />

          <Typography
            color="#fff"
            sx={{
              fontWeight: 500,
              fontSize: { xs: 14, sm: 18, md: 26 },
              maxWidth: { xs: "100%", md: 854 },
              color: "#fff !important",
              "& *": { color: "#fff !important" },
            }}
            dangerouslySetInnerHTML={{
              __html: (langu === "en" ? data[4]?.data[0]?._mave?.testimonials[0]?.quote : data[4]?.data[0]?._mave?.testimonials[0]?.altQuote) || "",
            }}
          />

          <Button
            variant="outlined"
            sx={{
              width: { xs: 120, sm: 140, md: 152 },
              height: { xs: 40, sm: 45, md: 50 },
              fontWeight: 500,
              borderRadius: 100,
              fontSize: { xs: 14, sm: 15, md: 16 },
              textTransform: "capitalize",
              p: 1,
              backgroundColor: "#fff",
              color: "#2A6498",
              "&:hover": {
                backgroundColor: "#2A6498",
                color: "#fff",
                boxShadow: "none",
              },
            }}
          >
            {langu === "en" ? "Learn More" : "আরও জানুন"}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 4 }}>
        <Articles
          event={data[5]?.data[0]?._mave?.cards}
          headingTitle={langu === "en" ? data[5]?.data[0]?._mave?.title_en : data[5]?.data[0]?._mave?.altTitle}
        // headingSubTitle={"Doctors & Hospital"}
        />
      </Box>
      <Box
        sx={{
          backgroundImage: `url(${cmsMediaUrl(data[5]?.data[0]?._mave?.cards?.image?.file_path)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // height: "100vh",
          // width: "90%", maxWidth: "1500px", margin: "0 auto",
          border: "1px solid #EAF0F5",
        }}
      >
        <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 4 }}>
          <Testimony event={data[5]?.data[1]?._mave} />
        </Box>
      </Box>
      <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 4 }}>
        <FaqCom
          event={data[6]?.data} loading={loading}
        />

      </Box>
      <Stack sx={{ width: "100%", mt: 3 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18236.325697473294!2d90.39593963955079!3d23.78058080000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7006f2b3f23%3A0x8e9fb6342f63d08!2sSAJIDA%20Foundation!5e1!3m2!1sen!2sbd!4v1754818171089!5m2!1sen!2sbd"
          allowfullscreen=""
          height={400}
          // style={{ borderRadius: 24 }}
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </Stack>
    </>
  );
}

export default Home;
