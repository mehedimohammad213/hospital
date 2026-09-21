import {
    Box,
    Drawer,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { BeatLoader } from "react-spinners";
import SearchIcon from '@mui/icons-material/Search';
import SpecialistCard from "./SpecialistCard";
import instance from "../api/api_instance";
import { MyContext } from "../../utils/ContextApi";

function SearchComponents({ open, setOpen }) {
    const [services, setServices] = useState([]); // array
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { langu } = useContext(MyContext);

    // fetch data
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

                // Transform doctors data to match the expected format
                const transformedData = doctors.reduce((acc, doctor) => {
                    const deptName = doctor.department;
                    const deptBn = departments.find(d => d.name === deptName)?.name_bn || deptName;
                    if (!acc.find(dept => dept.department === deptName)) {
                        acc.push({
                            department: deptName,
                            department_bn: deptBn,
                            doctors: doctors.filter(d => d.department === deptName).map(d => ({
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
                            }))
                        });
                    }
                    return acc;
                }, []);

                setServices(transformedData);
                console.log('Dynamic data loaded in search:', transformedData);
            } catch (apiError) {
                console.log('API not available, falling back to JSON');
                // Fallback to JSON file
                const response = await fetch("/doctors.json");
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // flatMap all doctors from all departments
    const allDoctors = services.flatMap((dept) => dept.doctors);

    // filter by searchTerm - searches across multiple fields
    const filteredDoctors = allDoctors.filter((doctor) =>
        searchTerm
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
            : true
    );

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
        <Drawer
            anchor="top"
            variant="temporary"
            PaperProps={{
                sx: {
                    //   height: 400,
                    bgcolor: "#2A6498",
                },
            }}
            open={open}
            onClose={() => setOpen(false)}
        >
            {/* Heading */}
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                    width: "90%",
                    maxWidth: "1720px",
                    margin: "0 auto",
                    mt: 4,
                    color: "#fff",
                }}
            >
                <Typography fontSize={{ md: 36, xs: 18 }} fontWeight={500}>
                    {langu === 'bn' ? 'আমরা আপনাকে কী খুঁজে পেতে সাহায্য করতে পারি?' : 'What can we help you find?'}
                </Typography>
                <IconButton
                    onClick={() => setOpen(false)}
                    sx={{
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                        backgroundColor: "#FFF",
                    }}
                >
                    <CloseIcon sx={{ color: "#000" }} />
                </IconButton>
            </Stack>

            {/* Search input */}
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                    width: "90%",
                    maxWidth: "1720px",
                    margin: "0 auto",
                    mt: 5,
                    color: "#fff",
                }}
            >
                <TextField
                    id="standard-basic"
                    label=""
                    variant="standard"
                    placeholder={langu === 'bn' ? 'নাম, বিভাগ বা পদবি অনুসারে অনুসন্ধান করুন' : 'Search by name, department or designation'}
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputLabelProps={{
                        sx: {
                            color: "#fff",
                            "&.Mui-focused": {
                                color: "#fff",
                            },
                        },
                    }}
                    InputProps={{
                        disableUnderline: false,
                        sx: {
                            color: "#fff",
                            "&:before": {
                                borderBottom: "1px solid #fff",
                            },
                            "&:hover:not(.Mui-disabled):before": {
                                borderBottom: "1px solid #fff",
                            },
                            "&:after": {
                                borderBottom: "1px solid #fff",
                            },
                        },
                        startAdornment: (
                            <InputAdornment position="start" sx={{ color: "#fff" }}>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}

                />

            </Stack>

            {/* Search Results */}
            {/* Search Results */}
            <Box
                sx={{
                    width: "90%",
                    maxWidth: "1720px",
                    margin: "0 auto",
                    mt: 3,
                    color: "#fff",
                }}
            >
                {searchTerm ? (
                    <Grid container spacing={2} my={6}>
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((item, index) => (
                                <Grid item md={4} size={{ md: 4, lg: 4, xl: 3, xs: 12 }} key={index}>
                                    <SpecialistCard
                                        title={langu === 'bn' ? (item?.name_bn || item?.name) : item?.name}
                                        cardImg={item?.image || "/assets/images.png"}
                                        des={langu === 'bn' ? (item?.designation_bn || item?.designation) : item?.designation}
                                        dig={langu === 'bn' ? (item?.qualifications_bn || item?.qualifications) : item?.qualifications}
                                        btn={langu === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
                                        slug={item?.slug || `doctor-${index}`}
                                        path={item.path}
                                        department={langu === 'bn' ? (item?.department_bn || item?.department) : item?.department}
                                        doctorId={item?.id}
                                        view={setOpen}
                                        stop={searchTerm}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Typography sx={{ fontSize: 18, mt: 2 }}>
                                {langu === 'bn' ? 'কোন ডাক্তার পাওয়া যায়নি।' : 'No doctors found.'}
                            </Typography>
                        )}
                    </Grid>
                ) : null}
            </Box>

        </Drawer>
    );
}

export default SearchComponents;
