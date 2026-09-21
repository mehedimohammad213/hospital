import { cmsMediaUrl, normalizeCmsData } from "@/lib/cms";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import StoryCard from "../components/StoryCard";
import { BeatLoader } from "react-spinners";
import instance from "../api/api_instance";
import { MyContext } from "@/utils/ContextApi";
import NewsroomCards from "../components/NewsroomCards";

function storiesPage() {
  const { langu } = useContext(MyContext);
  const [data, setData] = useState([]);
   console.log("stories", data);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/pages/case-stories");

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


  const router = useRouter();
  const path = router?.pathname;
 console.log(path,"stories")
  const getBreadcrumbLabel = (path) => {
    if (!path) return langu === "en" ? "NOT FOUND" : "না পাওয়া গেল";
    const last = path.split("/").filter(Boolean).pop() || "";
    const translations = {
      stories: { en: "STORIES", bn: "স্টোরিজ" },
      // add other route translations here, e.g.:
      // about: { en: "ABOUT", bn: "তথ্য" },
    };
    const key = last.toLowerCase();
    if (langu === "en") return translations[key]?.en || last.toUpperCase();
    return translations[key]?.bn || last;
  };

  return (
    <>
     <Box sx={{ width: "90%", maxWidth: "1720px", margin: "0 auto", my: 2 }}>
        <Stack justifyContent={"center"} alignItems={"center"}>
          <Typography sx={{ fontSize: { md: 60, xs: 40 }, fontWeight: 500 }}>
           {langu === "en" ? (
              <>Case <span style={{ color: "#12A551" }}>Stories</span></>
            ) : (
              <>কেস <span style={{ color: "#12A551" }}>স্টোরিজ</span></>
            )}
          </Typography>
          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: 16, color: "#AAAAAA" }}>
              {langu === "en" ? "HOME" : "হোম"}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} />
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

        <Typography
          my={4}
          sx={{ fontSize: {md:32,xs:18}, fontWeight: 700, color: "#2A6498" }}
          dangerouslySetInnerHTML={{
                  __html: langu === "en" ? data[0]?.data[0]?.value : data[0]?.data[0]?._mave?.altText,
                }}
        >
          
        </Typography>

        <Grid container spacing={4} my={6} alignItems={"center"}>
          {/* inner grid 1 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <img
              src={cmsMediaUrl(data[0]?.data[1]?._mave?.file_path)}
              style={{
                width: "100%",
                maxWidth: "843px",
                maxHeight: "445px",
                borderRadius: 24,
                objectFit: "cover",
                objectPosition: "top",
                
              }}
            />
          </Grid>
          {/* inner grid 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{ fontSize: 20, textAlign: "justify" }}
              dangerouslySetInnerHTML={{ __html:langu === "en" ?data[0]?.data[2]?.value: data[0]?.data[2]?._mave?.altContent }}
            />
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: 28, mt: 6, mb: 2 }}dangerouslySetInnerHTML={{ __html: langu === "en" ? data[1]?.data[0]?._mave?.title_en:data[1]?.data[0]?._mave?.title_bn }}></Typography>
        <Grid container spacing={2} mb={6}>

          {Array.isArray(data[1]?.data[0]?._mave?.cards
          ) &&
            data[1]?.data[0]?._mave?.cards.map((item, index) => (
              <Grid item key={index} size={{ xs: 12, md: 4, xl: 3 }}>
                <NewsroomCards
                  image={
                    item?.media_files?.file_path
                      ? cmsMediaUrl(item?.media_files.file_path) : "/assets/stories/people.svg"
                  }
                  title={langu==="en"?item?.title_en : item?.title_bn}
                  description={langu==="en"?item?.description_en : item?.description_bn}
                  path={path}
                  slug={item?.link_url}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
}

export default storiesPage;
