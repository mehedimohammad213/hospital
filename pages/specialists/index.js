import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";
import SpecialistCard from "../components/SpecialistCard";
import { BeatLoader } from "react-spinners";
import { MyContext } from "../../utils/ContextApi";
import instance from "../api/api_instance";


function specialistsPage() {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const allDoctors = services?.flatMap(service => service.doctors) || [];
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(12);
  const { langu } = useContext(MyContext);
  const filteredDoctors = allDoctors.filter(doctor => {
    // Department filter (dropdown)
    const matchesDepartment = value ? doctor.department === value : true;

    // Search filter (text field) - searches in name, name_bn, department, and department_bn
    const matchesSearch = searchTerm
      ? (
        // Search in English name
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in Bengali name
        doctor.name_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in English department
        doctor.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in Bengali department
        doctor.department_bn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in designation
        doctor.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.designation_bn?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : true;

    return matchesDepartment && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [value, searchTerm]);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const router = useRouter();
  const fetchServices = async () => {
    try {
      setLoading(true);

      // Try to fetch from dynamic API first
      try {
        const response = await instance.get("/pages/homepage");
        const data = response.data;

        // Extract doctors from page data
        const { extractBodyPartsAndDepartments } = await import("../../utils/pageDataService");
        const { doctors, departments } = extractBodyPartsAndDepartments(data);

        // Create transformed data structure ensuring all departments from API are included
        const transformedData = departments.map(dept => {
          const deptName = dept.name;
          const deptBn = dept.name_bn || deptName;
          const deptDoctors = doctors.filter(d => d.department === deptName).map(d => ({
            name: d.name,
            name_bn: d.name_bn || d.name,
            slug: d.slug,
            id: d.id,
            department: deptName,
            department_bn: deptBn,
            designation: d.designation,
            designation_bn: d.designation_bn || d.designation,
            qualifications: d.qualifications ? [d.qualifications] : [],
            qualifications_bn: d.qualifications_bn ? [d.qualifications_bn] : (d.qualifications ? [d.qualifications] : []),
            schedule: d.schedule ? [{ day: 'Available', time: d.schedule }] : [],
            schedule_bn: d.schedule_bn ? [{ day: 'Available', time: d.schedule_bn }] : (d.schedule ? [{ day: 'Available', time: d.schedule }] : []),
            hospital: d.designation,
            hospital_bn: d.designation_bn || d.designation,
            image: d.image
          }));

          return {
            department: deptName,
            department_bn: deptBn,
            doctors: deptDoctors
          };
        });

        setServices(transformedData);
        console.log('Dynamic data loaded in specialists:', transformedData);
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
          <Typography sx={{ fontSize: { md: 60, xs: 40 }, fontWeight: 500 }}>
            {langu === "en" ? (
              <>Our Dedicated <span style={{ color: "#12A551" }}>Specialists</span></>
            ) : (
              <>আমাদের নিবেদিত <span style={{ color: "#12A551" }}>বিশেষজ্ঞ</span></>
            )}
          </Typography>
          <Stack direction={"row"} spacing={1}  >
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
              {langu === "en" ? router?.pathname ? router?.pathname.split("/") : "Not Found" : "বিশেষজ্ঞদের"}
            </Typography>
          </Stack>
        </Stack>

        <img
          src={"/assets/specialist/banner.svg"}
          width={"100%"}
          style={{ marginTop: "23px", height: 469, borderRadius: 16, objectFit: "cover" }}
        />

        <Typography
          textAlign={"center"}
          sx={{ fontSize: 36, fontWeight: 700, color: "#2A6498", my: 2 }}
        >
          {langu === "en" ? "Our Dedicated Doctors Team" : "আমাদের ডাক্তার দল"}
        </Typography>

        <Stack
          direction={{ md: "row", xs: "column" }}
          spacing={1}
          maxWidth={800}
          alignItems={"center"}
        >
          <Select
            fullWidth
            displayEmpty
            size="small"
            variant="outlined"
            value={value}
            onChange={handleChange}
            renderValue={(selected) => {
              if (!selected) {
                return langu === "en" ? "Select Department" : "বিভাগ নির্বাচন করুন";
              }
              // Show Bengali name if available and language is Bengali
              const selectedService = services.find(s => s.department === selected);
              return langu === "bn" ? (selectedService?.department_bn || selected) : selected;
            }}
            sx={{
              cursor: 'pointer',
              '& .MuiSelect-select': {
                cursor: 'pointer',
              },
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            <MenuItem value="">
              {langu === "en" ? "All Departments" : "সকল বিভাগ"}
            </MenuItem>
            {services?.map((service, index) => (
              <MenuItem key={index} value={service?.department}>
                {langu === 'bn' ? (service?.department_bn || service?.department) : service?.department}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            size="small"
            placeholder={langu === "en" ? "Search by name, department or designation" : "নাম, বিভাগ বা পদবি দিয়ে খুঁজুন"}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#2A6498",
              color: "white",
              px: 8,
              py: 1.5,
              "&:hover": {
                bgcolor: "#2A6498",
              },
              maxwidth: 106,
              borderRadius: 50,
              textTransform: "capitalize",
            }}
          >
            Submit
          </Button> */}
        </Stack>

        <Grid container spacing={2} my={6}>
          {currentDoctors.length > 0 ? currentDoctors?.map((item, index) => (
            <Grid size={{ md: 4, xl: 3, xs: 12 }} key={index}>
              <SpecialistCard
                title={langu === 'bn' ? (item?.name_bn || item?.name) : item?.name}
                cardImg={item?.image || "/assets/images.png"}
                des={langu === 'bn' ? (item?.designation_bn || item?.designation) : item?.designation}
                dig={
                  (() => {
                    const q =
                      langu === "bn"
                        ? item?.qualifications_bn || item?.qualifications
                        : item?.qualifications;
                    const text = Array.isArray(q) ? q.join(", ") : q;
                    // CMS often stores a long bio in Qualifications — keep cards to short credentials only
                    if (!text || String(text).split(/\s+/).length > 12) return "";
                    return q;
                  })()
                }
                btn={langu === "en" ? "View Profile" : "প্রোফাইল দেখুন"}
                slug={item?.slug || `doctor-${index}`}
                path={item.path}
                department={langu === 'bn' ? (item?.department_bn || item?.department) : item?.department}
                doctorId={item?.id}
              />
            </Grid>
          )) : <Typography sx={{ fontSize: 18, mt: 2 }}>{langu === "en" ? "No doctors found." : "কোনো ডাক্তার পাওয়া যায়নি।"}</Typography>}
        </Grid>

        {/* Pagination */}
        {filteredDoctors.length > itemsPerPage && (
          <Stack spacing={2} alignItems="center" sx={{ my: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                },
                '& .Mui-selected': {
                  bgcolor: '#2A6498 !important',
                  color: 'white',
                },
              }}
            />
          </Stack>
        )}
      </Box>
    </>
  );
}

export default specialistsPage;
