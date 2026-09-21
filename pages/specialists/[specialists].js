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
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState, useContext } from "react";
import { BeatLoader } from "react-spinners";
import FormSubmit from "../components/FormSubmit";
import { extractBodyPartsAndDepartments } from "../../utils/pageDataService";
import { MyContext } from "../../utils/ContextApi";
import instance from "../api/api_instance";

function specialists() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const { langu } = useContext(MyContext);

  // Data fetch - try dynamic API first, fallback to JSON
  const fetchServices = async () => {
    try {
      setLoading(true);

      // Try to fetch from dynamic API first
      try {
        const response = await instance.get("/pages/homepage");
        const data = response.data;
        setPageData(data);

        // Extract doctors from page data
        const { doctors } = extractBodyPartsAndDepartments(data);
        setAllDoctors(doctors);

        // Transform doctors data to match the expected format
        const transformedData = doctors.reduce((acc, doctor) => {
          const deptName = doctor.department;
          if (!acc.find(dept => dept.department === deptName)) {
            acc.push({
              department: deptName,
              doctors: doctors.filter(d => d.department === deptName).map(d => ({
                name: d.name,
                name_bn: d.name_bn || d.name,
                slug: d.slug,
                id: d.id,
                designation: d.designation,
                designation_bn: d.designation_bn || d.designation,
                qualifications: d.qualifications ? [d.qualifications] : [],
                qualifications_bn: d.qualifications_bn ? [d.qualifications_bn] : (d.qualifications ? [d.qualifications] : []),
                schedule: d.schedule ? [{ day: 'Available', time: d.schedule }] : [],
                schedule_bn: d.schedule_bn ? [{ day: 'উপলব্ধ', time: d.schedule_bn }] : (d.schedule ? [{ day: 'উপলব্ধ', time: d.schedule }] : []),
                hospital: d.designation,
                hospital_bn: d.designation_bn || d.designation,
                image: d.image
              }))
            });
          }
          return acc;
        }, []);

        setServices(transformedData);
        console.log('Dynamic data loaded:', transformedData);
      } catch (apiError) {
        console.log('API not available, falling back to JSON');
        // Fallback to JSON file
        const response = await fetch("/doctors.json");
        const data = await response.json();
        setServices(data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Memoized department
  const findDept = useMemo(() => {
    return services.find(
      (item) => item.department === router?.query?.department
    );
  }, [services, router?.query?.department]);

  // Memoized doctor - try to find by ID first, then by slug
  const doctorsfind = useMemo(() => {
    if (router?.query?.doctorId) {
      // Find by unique ID first
      const doctorById = allDoctors.find(doc => doc.id === router.query.doctorId);
      if (doctorById) {
        return {
          name: langu === 'bn' ? (doctorById.name_bn || doctorById.name) : doctorById.name,
          slug: doctorById.slug,
          designation: langu === 'bn' ? (doctorById.designation_bn || doctorById.designation) : doctorById.designation,
          qualifications: langu === 'bn' ?
            (doctorById.qualifications_bn ? [doctorById.qualifications_bn] : (doctorById.qualifications ? [doctorById.qualifications] : [])) :
            (doctorById.qualifications ? [doctorById.qualifications] : []),
          schedule: langu === 'bn' ?
            (doctorById.schedule_bn ? [{ day: 'উপলব্ধ', time: doctorById.schedule_bn }] : (doctorById.schedule ? [{ day: 'উপলব্ধ', time: doctorById.schedule }] : [])) :
            (doctorById.schedule ? [{ day: 'Available', time: doctorById.schedule }] : []),
          hospital: langu === 'bn' ? (doctorById.designation_bn || doctorById.designation) : doctorById.designation,
          image: doctorById.image
        };
      }
    }

    // Fallback to finding by slug
    const foundDoctor = findDept?.doctors?.find(
      (doc) => doc.slug === router?.query?.specialists
    );

    if (foundDoctor) {
      return {
        name: langu === 'bn' ? (foundDoctor.name_bn || foundDoctor.name) : foundDoctor.name,
        slug: foundDoctor.slug,
        designation: langu === 'bn' ? (foundDoctor.designation_bn || foundDoctor.designation) : foundDoctor.designation,
        qualifications: langu === 'bn' ?
          (foundDoctor.qualifications_bn || foundDoctor.qualifications) :
          foundDoctor.qualifications,
        schedule: langu === 'bn' ?
          (foundDoctor.schedule_bn || foundDoctor.schedule) :
          foundDoctor.schedule,
        hospital: langu === 'bn' ? (foundDoctor.hospital_bn || foundDoctor.hospital) : foundDoctor.hospital,
        image: foundDoctor.image
      };
    }

    return foundDoctor;
  }, [findDept, router?.query?.specialists, router?.query?.doctorId, allDoctors, langu]);


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
          <Typography sx={{ fontSize: { md: 60, xs: 40 }, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: (langu === 'bn' ? 'আমাদের নিবেদিত' : 'Our Dedicated') + ' <span style="color:#12A551">' + (langu === 'bn' ? 'বিশেষজ্ঞরা' : 'Specialists') + '</span>' }} />
          <Stack direction={"row"} spacing={1}>
            <Typography sx={{ fontSize: 16, color: "#AAAAAA" }}>
              {langu === 'bn' ? 'হোম' : 'HOME'}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} />
            <Typography
              sx={{
                fontSize: 16,
                color: "#AAAAAA",
                textTransform: "uppercase",
              }}
            >
              {langu === 'bn' ? 'বিশেষজ্ঞরা' : 'specialists'}
            </Typography>
            <img src={"/assets/about/rightArrow.svg"} width={14} />
            <Typography
              sx={{
                fontSize: 16,
                color: "#AAAAAA",
                textTransform: "uppercase",
              }}
            >
              {router?.query.specialists
                ? router.query.specialists.split("-").join(" ")
                : (langu === 'bn' ? 'খুঁজে পাওয়া যায়নি' : "Not Found")}
            </Typography>
          </Stack>
        </Stack>

        <img
          src={"/assets/specialist/banner2.svg"}
          width={"100%"}
          style={{ marginTop: "23px" }}
        />

        <Typography
          my={4}
          sx={{ color: "#2A6498", fontSize: 36, fontWeight: 700 }}
          dangerouslySetInnerHTML={{ __html: (langu === 'bn' ? 'ডাক্তারের বিবরণ' : 'DOCTORS DETAILS') || "" }}
        />

        <Grid container spacing={10}>
          {/* first grid */}
          <Grid size={{ md: 4, xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                maxWidth: 544,
                borderRadius: 3,
                overflow: "hidden",
                border: "3px solid #2A6498",
                textAlign: "center",
                mx: "auto",
              }}
            >
              <Stack spacing={0}>
                {/* Doctor Image */}
                <Box
                  component="img"
                  src={doctorsfind?.image || "/assets/images.png"}
                  alt={doctorsfind?.name || "Doctor"}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    backgroundColor: "#fff",
                  }}
                  onError={(e) => {
                    e.target.src = "/assets/images.png";
                  }}
                />

                {/* Blue Background Section */}
                <Box sx={{ backgroundColor: "#2A6498", py: 2, px: 2 }}>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 600, color: "#ffffff" }}
                    dangerouslySetInnerHTML={{ __html: doctorsfind?.name || "" }}
                  />

                  <hr
                    style={{
                      border: "none",
                      height: "1px",
                      backgroundColor: "#4E7EAA",
                      width: 319,
                      margin: "12px auto",
                    }}
                  />

                  {/* Decorative Line */}
                  <Box
                    sx={{
                      height: 1,
                      backgroundColor: "#1C7DC1",
                      width: "50%",
                      mx: "auto",
                      my: 1.5,
                    }}
                  />

                  {/* Fake Button */}
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#12A551",
                      textTransform: "uppercase",

                      px: 2,
                      py: 0.5,
                    }}
                    dangerouslySetInnerHTML={{ __html: (langu === 'bn' ? 'অ্যাপয়েন্টমেন্ট করুন' : 'Make an Appointment') || "" }}
                  />
                </Box>
              </Stack>
            </Paper>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              mt={1}
            >
              {/* Social Share */}
              <Box sx={{ py: 2 }}>
                <Typography
                  sx={{ fontSize: 16, fontWeight: 600, color: "#000" }}
                >
                  {langu === 'bn' ? 'শেয়ার করুন:' : 'Share on:'}
                </Typography>
              </Box>
              <img
                src="/assets/specialist/Symbol1.svg"
                width={12}
                alt="Facebook"
              />
              <img
                src="/assets/specialist/Symbol2.svg"
                width={20}
                alt="Twitter"
              />
              <img
                src="/assets/specialist/Symbol3.svg"
                width={20}
                alt="LinkedIn"
              />
            </Stack>
          </Grid>
          {/* second grid */}
          <Grid size={{ md: 8, xs: 12 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: doctorsfind?.name || "" }} />
            <Typography
              sx={{ color: "#12A551", fontSize: 14, fontWeight: 700 }}
              dangerouslySetInnerHTML={{ __html: doctorsfind?.designation || "" }}
            />
            <hr
              style={{
                border: "none",
                height: "2px",
                backgroundColor: "#F0F0F0",
                // width: 319,
                margin: "12px auto",
              }}
            />
            {/* Qualifications */}
            <Box mt={4}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
                {langu === 'bn' ? 'যোগ্যতা' : 'Qualifications'}
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {doctorsfind?.qualifications?.map((q, idx) => (
                  <Box
                    component="li"
                    key={idx}
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: "#222",
                      mb: 0.5,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: (Array.isArray(q) ? q.join(", ") : (q != null ? String(q) : "")) || "",
                    }}
                  />
                ))}
              </Box>
            </Box>


            {/* Schedule */}
            <Box mt={2}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
                {langu === 'bn' ? 'ভিজিটিং সময়সূচী' : 'Visiting Schedule'}
              </Typography>
              {doctorsfind?.schedule?.map ? (
                doctorsfind.schedule.map((sch, idx) => (
                  <Typography key={idx} sx={{ fontSize: 16, color: "#222" }} dangerouslySetInnerHTML={{ __html: `${sch.day === 'Available' && langu === 'bn' ? 'উপলব্ধ' : sch.day} — ${sch.time}` }} />
                ))
              ) : (
                doctorsfind?.schedule && (
                  <Typography sx={{ fontSize: 16, color: "#222" }} dangerouslySetInnerHTML={{ __html: (doctorsfind.schedule === 'Available' && langu === 'bn' ? 'উপলব্ধ' : doctorsfind.schedule) || "" }} />
                )
              )}
            </Box>
            {doctorsfind?.hospital && <Box mt={2}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }} dangerouslySetInnerHTML={{ __html: (langu === 'bn' ? 'হাসপাতাল' : 'Hospital') || "" }} />

              <Typography sx={{ fontSize: 16, color: "#222", }} dangerouslySetInnerHTML={{ __html: doctorsfind?.hospital || "" }} />

            </Box>}

            {/* <Box mt={2}>
              <Typography
                component="li"
                sx={{ fontSize: 14, color: "#222222" }}
              >
                Ms. Shaila Sabrin obtained her{" "}
                <span style={{ fontWeight: 700 }}>M. Phil </span>(Nutrition &
                Food Science) from Dhaka University.
              </Typography>
              <Typography
                component="li"
                sx={{ fontSize: 14, color: "#222222" }}
              >
                Subsequently she completed
                <span style={{ fontWeight: 700 }}>MS </span> and{" "}
                <span style={{ fontWeight: 700 }}>Sc.</span> in Food & Nutrition
                from the same UniversityHeld on 22 February 2025, the event,
                organised by
              </Typography>

              <Typography
                component="li"
                sx={{ fontSize: 14, color: "#222222" }}
              >
                She has experience of working in various national &
                multi–national organizations and hospitals At the Philanthropy
                Conclave 2025, SAJIDA in different positions i.e. Samorita
                Hospital; BRB Hospital (Gastro Liver Hospital); ICDDRB; At the
                Philanthropy Conclave 2025, SAJIDA Glaxo Smith Kline (gsk);
                Tetra Pak; Nursing Institute Medical College for Women, Uttara
                and sustainable care economy care economy IPDC as Nutrition
                Counselor/Nutritionist.
              </Typography>

              <Typography
                component="li"
                sx={{ fontSize: 14, color: "#222222" }}
              >
                Ms. Shaila attended trainings on Clinical Nutrition & Dietetics
                from BIRDEM General Hospital as Dietetics from BIRDEM General
                Hospital as well as Management & Prevention of Gestational
                Diabetes Mellitius organized by CGDM Project, Mellitius
                organized by CGDM Project, Bangladesh University of Health
                Science, Dhaka.
              </Typography>

              <Typography
                component="li"
                sx={{ fontSize: 14, color: "#222222" }}
              >
                Ms. Shaila attended trainings on Clinical Nutrition & Dietetics
                from BIRDEM General Hospital as Dietetics from BIRDEM General
                Hospital as abroad (Indonesia, Chennai, Indore, Bengaluru).
              </Typography>
              <Typography
                component="li"
                sx={{ fontSize: 14, color: "#222222" }}
              >
                Ms. Shaila attended trainings on Clinical Nutrition & Dietetics
                from BIRDEM General Hospital as Dietetics from BIRDEM General
                Hospital as and serving patients regularly.
              </Typography>
            </Box> */}
          </Grid>
        </Grid>
        <FormSubmit />
      </Box>
    </>
  );
}

export default specialists;
