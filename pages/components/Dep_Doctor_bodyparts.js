import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import SpecialistCard from "./SpecialistCard";
import { extractBodyPartsAndDepartments, getDoctorsByBodyPartAndDepartment } from "../../utils/pageDataService";
import { MyContext } from "../../utils/ContextApi";
import instance from "../api/api_instance";
import { getDepartments, getDoctors } from "../../lib/client-api";

/**
 * Dep_Doctor_bodyparts Component
 *
 * This component displays departments and doctors with icons from the API.
 * It prioritizes department icons from the page data API (/pages/homepage) which includes
 * department icons via the proxy-image endpoint. Falls back to the departments API
 * only when page data is not available.
 */

function Dep_Doctor_bodyparts({ selectedBodyPart, selectedDepartments }) {
  const [doctors, setDoctors] = useState([]);
  const [doctorsprofile, setDoctorsprofile] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const [departmentIcons, setDepartmentIcons] = useState({});
  const [departmentData, setDepartmentData] = useState([]); // Store full department objects
  // console.log(doctorsprofile)
  const [selectedDep, setSelectedDep] = useState(null);
  const { langu } = useContext(MyContext);

  // Fetch departments from API (fallback when page data is not available)
  const fetchDepartments = async () => {
    console.log('🔄 fetchDepartments called');
    setLoading(true);
    try {
      // If we have page data with departments, use it instead of API call
      if (pageData && departmentData.length > 0) {
        console.log('✅ Using pageData, skipping API call');
        const departmentNames = departmentData.map(dept => dept.name);
        console.log('📋 Department names from pageData:', departmentNames);
        setDepartments(departmentNames);
        if (departmentNames.length > 0) {
          setSelectedDep(departmentNames[0]);
          fetchDoctorsByDepartment(departmentNames[0]);
        }
        setLoading(false);
        return;
      }

      console.log('🌐 Making API call to getDepartments()');
      // Fallback to client-side API call only when page data is not available
      const data = await getDepartments();
      console.log('📡 API response:', data);
      if (data.data) {
        console.log('📋 API returned departments:', data.data);
        setDepartments(data.data);
        if (data.data.length > 0) {
          setSelectedDep(data.data[0]);
          fetchDoctorsByDepartment(data.data[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors by department
  const fetchDoctorsByDepartment = async (department) => {
    setLoading(true);
    try {
      // If we have page data, use it directly
      if (pageData && allDoctors.length > 0) {
        const doctorsForDepartment = getDoctorsByBodyPartAndDepartment(allDoctors, selectedBodyPart, department);
        console.log("Using page data for department:", department, doctorsForDepartment);
        setDoctorsprofile(doctorsForDepartment);
        setLoading(false);
        return;
      }

      // Fallback to API call
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (selectedBodyPart) params.append('bodyPart', selectedBodyPart);

      const data = await getDoctors(department, selectedBodyPart);
      if (data.data) {
        setDoctorsprofile(data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load page data on component mount
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await instance.get('/pages/homepage');
        const data = response.data;
        setPageData(data);

        // Extract doctors and departments from page data
        const { doctors, departments: extractedDepartments } = extractBodyPartsAndDepartments(data);

        // Filter out doctors from unwanted departments
        // Remove doctors from "Ultrasonography" and "Food and nutrition specialist" departments (both variations)
        const filteredDoctors = doctors.filter(doctor =>
          doctor.department !== "Ultrasonography" &&
          doctor.department !== "Food and nutrition specialist" &&
          doctor.department !== "Food and Nutrition Specialist"
        );

        setAllDoctors(filteredDoctors);

        // Filter out unwanted departments from the department list
        // Remove "Ultrasonography" and "Food and nutrition specialist" departments (both variations)
        const filteredDepartments = extractedDepartments.filter(dept =>
          dept.name !== "Ultrasonography" &&
          dept.name !== "Food and nutrition specialist" &&
          dept.name !== "Food and Nutrition Specialist"
        );

        setDepartmentData(filteredDepartments); // Store full department objects
        setDepartments(filteredDepartments.map(dept => dept.name));

        // Create department icons mapping for filtered departments
        const iconsMap = {};
        filteredDepartments.forEach(dept => {
          iconsMap[dept.name] = dept.icon;
          console.log(`🔍 Department Icon Mapping: ${dept.name} -> ${dept.icon}`);
        });
        setDepartmentIcons(iconsMap);
        console.log('📋 Final Department Icons Map:', iconsMap);

        console.log('Page data loaded:', data);
        console.log('Doctors extracted (before filtering):', doctors);
        console.log('Doctors filtered:', filteredDoctors);
        console.log('Departments extracted (before filtering):', extractedDepartments);
        console.log('Departments filtered:', filteredDepartments);
        console.log('Department icons:', iconsMap);
        console.log('Current language:', langu);

        // Debug department icons specifically
        console.log('🏥 Department Icon Debug Info:');
        filteredDepartments.forEach(dept => {
          console.log(`  📁 Department: ${dept.name}`);
          console.log(`  🖼️  Icon URL: ${dept.icon}`);
          console.log(`  📝 Full Object:`, dept);
        });
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    loadPageData();
  }, []);

  // Initial load - use page data with icons when available
  useEffect(() => {
    console.log('🔄 Initial load useEffect triggered');
    console.log('📊 Current state:', {
      selectedDepartments,
      pageData: !!pageData,
      departmentDataLength: departmentData.length,
      allDoctorsLength: allDoctors.length,
      departmentIcons: Object.keys(departmentIcons).length
    });

    // If page data hasn't loaded yet, do nothing and wait for the next render.
    if (!pageData || allDoctors.length === 0) {
      console.log('⏳ Waiting for pageData and allDoctors to load...');
      return;
    }

    if (selectedBodyPart) {
      console.log('✅ Using selectedDepartments:', selectedDepartments);
      // Use departments from body part selection
      setDepartments(selectedDepartments);
      if (selectedDepartments && selectedDepartments.length > 0) {
        setSelectedDep(selectedDepartments[0]);
        fetchDoctorsByDepartment(selectedDepartments[0]);
      } else {
        // Handle case where a body part is selected but has no matching departments
        setDoctorsprofile([]);
      }
    } else { // This block now runs only if no body part is selected AND pageData is loaded.
      console.log('✅ Using pageData with departmentData');
      // Use page data with department icons
      const departmentNames = departmentData.map(dept => dept.name);
      console.log('📋 Department names from departmentData:', departmentNames);
      setDepartments(departmentNames);
      if (departmentNames.length > 0) {
        setSelectedDep(departmentNames[0]);
        fetchDoctorsByDepartment(departmentNames[0]);
      }
    }
  }, [selectedDepartments, selectedBodyPart, pageData, allDoctors, departmentData]);

  // Debug departmentIcons state changes
  useEffect(() => {
    console.log('🖼️  Department Icons State Updated:', departmentIcons);
    console.log('📊 Icons Count:', Object.keys(departmentIcons).length);
    Object.entries(departmentIcons).forEach(([dept, icon]) => {
      console.log(`  ${dept}: ${icon}`);
    });
  }, [departmentIcons]);

  // Function to truncate text to 6 words and add ellipsis
  const truncateText = (text, maxWords = 6) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Helper function to get department name based on language
  const getDepartmentDisplayName = (departmentName) => {
    let displayName;
    if (langu === 'bn') {
      const departmentObj = departmentData.find(dept => dept.name === departmentName);
      console.log('Looking for Bengali name for:', departmentName, 'Found:', departmentObj);
      displayName = departmentObj?.name_bn || departmentName;
    } else {
      displayName = departmentName;
    }
    return truncateText(displayName);
  };

  // Helper function to get doctor data based on language
  const getDoctorDisplayData = (doctor) => {
    let data;
    if (langu === 'bn') {
      data = {
        name: doctor.name_bn || doctor.name,
        department: doctor.department_bn || doctor.department,
        designation: doctor.designation_bn || doctor.designation,
        qualifications: doctor.qualifications_bn || doctor.qualifications,
        schedule: doctor.schedule_bn || doctor.schedule,
        bodyParts: doctor.bodyParts_bn || doctor.bodyParts
      };
    } else {
      data = {
        name: doctor.name,
        department: doctor.department,
        designation: doctor.designation,
        qualifications: doctor.qualifications,
        schedule: doctor.schedule,
        bodyParts: doctor.bodyParts
      };
    }

    // Apply truncation to name and designation
    return {
      ...data,
      name: truncateText(data.name),
      designation: truncateText(data.designation)
    };
  };

  const handeler = (dep) => {
    setSelectedDep(dep);
    fetchDoctorsByDepartment(dep);
  };



  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef1 = useRef(null);
  const nextRef1 = useRef(null);

  const breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 10 },
    380: { slidesPerView: 1, spaceBetween: 15 },
    600: { slidesPerView: 2, spaceBetween: 20 },
    900: { slidesPerView: 3, spaceBetween: 10 },
    1200: { slidesPerView: 3, spaceBetween: 10 },
    1920: { slidesPerView: 4, spaceBetween: 10 },
  };

  const breakpoint = {
    0: { slidesPerView: 1, spaceBetween: 10 },
    380: { slidesPerView: 1, spaceBetween: 15 },
    600: { slidesPerView: 2, spaceBetween: 20 },
    900: { slidesPerView: 2, spaceBetween: 10 },
    1200: { slidesPerView: 2, spaceBetween: 10 },
    1920: { slidesPerView: 3, spaceBetween: 20 },
  };



  return (
    <>
      <Stack direction={"column"} spacing={1}>
        <Typography fontSize={36} fontWeight={700} color="#0D5EAE" dangerouslySetInnerHTML={{ __html: (langu === "en" ? "Healthcare at Its Finest" : "সেরা স্বাস্থ্যসেবা") || "" }} />
        <Typography fontSize={28} dangerouslySetInnerHTML={{ __html: (langu === "en" ? "Our Doctors Team" : "আমাদের ডাক্তার দল") || "" }} />
      </Stack>

      <Stack
        mt={2}
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={1}
      >
        <Box
          sx={{ backgroundColor: "#FFFFFF", px: 3, py: 1, borderRadius: 100 }}
        >
          <Typography
            fontSize={18}
            fontWeight={600}
            sx={{
              background: "linear-gradient(to right, #12A551, #76CB9A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            dangerouslySetInnerHTML={{ __html: (langu === "en" ? "Department" : "বিভাগ") || "" }}
          />
        </Box>

        <Stack direction={"row"}>
          <IconButton ref={prevRef}>
            <img src="/assets/left.svg" alt="" width={30} />
          </IconButton>
          <IconButton ref={nextRef}>
            <img src="/assets/right.svg" alt="" width={30} />
          </IconButton>
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
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        {departments?.map((department, index) => {
          return (
            <SwiperSlide key={index} style={{ cursor: "pointer" }} onClick={() => handeler(department)}>
              <Paper
                elevation={0}
                sx={{
                  maxWidth: 322,
                  borderRadius: "16px",
                  border: "1px solid #EAF0F5",
                  backgroundColor: selectedDep === department ? "#2A6498" : "#FFFFFF",
                  color: selectedDep === department ? "#FFFFFF" : "inherit",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                  height={83}
                  // add horizontal padding
                  px={2}
                >
                  <img
                    src={departmentIcons[department] || "/assets/images.png"}
                    width={55}
                    height={55}
                    alt={`${department} icon`}
                    style={{ objectFit: 'contain' }}
                    onError={(e) => {
                      console.error(`❌ Failed to load icon for ${department}:`, e.target.src);
                      console.error(`🔍 Available icons:`, departmentIcons);
                      console.error(`🔍 Looking for key: "${department}"`);
                      e.target.src = "/assets/images.png";
                    }}
                  />
                  <Typography variant="body1" sx={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: getDepartmentDisplayName(department) || "" }} />
                </Stack>
              </Paper>
            </SwiperSlide>
          );
        })}

      </Swiper>

      <Stack
        direction="row"
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={1}
      >
        <Box
          sx={{ backgroundColor: "#FFFFFF", px: 3, py: 1, borderRadius: 100 }}
        >
          <Typography
            fontSize={18}
            fontWeight={600}
            sx={{
              background: "linear-gradient(to right, #12A551, #76CB9A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            dangerouslySetInnerHTML={{ __html: (langu === "en" ? "Doctors" : "ডাক্তার") || "" }}
          />
        </Box>

        <Stack direction={"row"}>
          <IconButton ref={prevRef1}>
            <img src="/assets/left.svg" alt="" width={30} />
          </IconButton>
          <IconButton ref={nextRef1}>
            <img src="/assets/right.svg" alt="" width={30} />
          </IconButton>
        </Stack>
      </Stack>

      <Swiper
        style={{ marginTop: 20 }}
        breakpoints={breakpoint}
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef1.current,
          nextEl: nextRef1.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef1.current;
          swiper.params.navigation.nextEl = nextRef1.current;
          swiper.navigation?.init();
          swiper.navigation?.update();
        }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        {doctorsprofile?.map((item, index) => {
          // Get display data based on language
          const displayData = getDoctorDisplayData(item);
          // console.log(item)
          return (
            <SwiperSlide key={item?.id || index}>
              <SpecialistCard
                title={displayData.name}
                // Pass other necessary props to SpecialistCard
                cardImg={item?.image || "/assets/images.png"}
                des={displayData.designation || ""}
                dig={displayData.qualifications || ""}
                btn={langu === "en" ? "View Profile" : "প্রোফাইল দেখুন"}
                slug={item?.slug || `doctor-${item?.id || index}`}
                department={displayData.department || selectedDep}
                schedule={displayData.schedule || ""}
                doctorId={item?.id} // Pass unique ID
                onImageError={(e) => {
                  console.log(`Failed to load doctor image for ${displayData.name}:`, e.target.src);
                  e.target.src = "/assets/images.png";
                }}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  );
}

export default Dep_Doctor_bodyparts;