import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { extractBodyPartsAndDepartments } from '../../utils/pageDataService';
import { MyContext } from '@/utils/ContextApi';
import instance from '../api/api_instance';
import { useRouter } from 'next/router';
import { CMS_API_URL, CMS_SITE_KEY, APPOINTMENT_FORM_ID } from '@/lib/cms';

function FormSubmit() {
  const [services, setServices] = useState(null)
  const router = useRouter()
  const [doctors, setDoctors] = useState(null)
  const { langu } = useContext(MyContext);
  const [formData, setFormData] = useState(
    {
      name: "",
      phone: "",
      email: "",
      department: "",
      service: "",
      doctor: "",
      message: ""
    }
  )
  const department = doctors?.find(d => d.department === formData?.department);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to fetch from dynamic API first
        const response = await instance.get("/pages/homepage");
        const data = response.data;

        // Extract doctors and departments from page data
        const { doctors: extractedDoctors, departments: extractedDepartments } = extractBodyPartsAndDepartments(data);

        // Transform doctors data to match the expected format
        const transformedDoctors = extractedDoctors.reduce((acc, doctor) => {
          const deptName = doctor.department;
          if (!acc.find(dept => dept.department === deptName)) {
            acc.push({
              department: deptName,
              doctors: extractedDoctors.filter(d => d.department === deptName).map(d => ({
                name: d.name,
                slug: d.slug,
                id: d.id,
                designation: d.designation,
                qualifications: d.qualifications ? [d.qualifications] : [],
                schedule: d.schedule ? [{ day: 'Available', time: d.schedule }] : [],
                hospital: d.designation,
                image: d.image
              }))
            });
          }
          return acc;
        }, []);

        setDoctors(transformedDoctors);
        setServices(transformedDoctors); // Use same data for services

        // console.log('FormSubmit: Dynamic data loaded:', transformedDoctors);
      } catch (error) {
        console.log('FormSubmit: API not available, falling back to JSON');
        // Fallback to JSON files
        fetch("/services.json")
          .then(res => res.json())
          .then(data => setServices(data));

        fetch("/doctors.json")
          .then(res => res.json())
          .then(data => setDoctors(data));
      }
    };

    loadData();
  }, []);
  const initialFormData = {
    name: "",
    phone: "",
    email: "",
    doctor: "",
    department: "",
    service: "",
    message: ""
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        form_id: "19",
        form_data: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          doctor: formData.doctor,
          department: formData.department,
          service: formData.service,
          message: formData.message
        },
        status: "pending",
        submitted_at: new Date().toISOString()
      };
      const response = await axios.post(`${CMS_API_URL}/form-submission?form_id=${APPOINTMENT_FORM_ID}`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(CMS_SITE_KEY ? { "X-Headless-Site-Key": CMS_SITE_KEY } : {}),
        }
      });

      // console.log("Success:", response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setFormData(initialFormData);

      router.push('/submition')

    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      // console.error("Error submitting form:", error);
      if (error.response) {
        toast.error("Submission failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

      } else {
        // alert("Submission failed. Please try again.");
      }
    }
  };
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 4,
          color: "#2A6498",
          textAlign: "center",
        }}
      >
        {langu === "en" ? "Appointment Form" : "অ্যাপয়েন্টমেন্ট ফর্ম"}
      </Typography>

      <Grid container spacing={3}>
        {/* Name - Required */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Name" : "নাম"}{" "}
            <span style={{ color: "#EA0004" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            size="small"
            placeholder={langu === "en" ? "Enter your name" : "আপনার নাম লিখুন"}
            variant="outlined"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
              maxWidth: "556px",
            }}
          />
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Phone" : "ফোন"}{" "}
            <span style={{ color: "#EA0004" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            size="small"
            placeholder={
              langu === "en"
                ? "Enter your phone number"
                : "আপনার ফোন নম্বর লিখুন"
            }
            variant="outlined"
            type="tel"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
              maxWidth: "556px",
            }}
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Email" : "ইমেইল"}
          </Typography>
          <TextField
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={
              langu === "en" ? "Enter your email" : "আপনার ইমেইল লিখুন"
            }
            size="small"
            variant="outlined"
            type="email"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
              maxWidth: "556px",
            }}
          />
        </Grid>

        {/* Department */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Department" : "বিভাগ"}
          </Typography>
          <Select
            fullWidth
            displayEmpty
            size="small"
            variant="outlined"
            defaultValue=""
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            renderValue={(selected) =>
              selected || (langu === "en" ? "Select Department" : "বিভাগ নির্বাচন করুন")
            }
            sx={{
              borderRadius: "24px",
              maxWidth: "556px",
            }}
          >
            <MenuItem value="" disabled>
              {langu === "en" ? "Select Department" : "বিভাগ নির্বাচন করুন"}
            </MenuItem>
            {doctors?.map((item, index) => (
              <MenuItem key={index} value={item?.department}>
                {item?.department}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Doctor */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Doctor" : "ডাক্তার"}
          </Typography>
          <Select
            fullWidth
            size="small"
            displayEmpty
            variant="outlined"
            defaultValue=""
            value={formData.doctor}
            onChange={(e) =>
              setFormData({ ...formData, doctor: e.target.value })
            }
            renderValue={(selected) =>
              selected || (langu === "en" ? "Select Doctor" : "ডাক্তার নির্বাচন করুন")
            }
            sx={{
              borderRadius: "24px",
              maxWidth: "556px",
            }}
          >
            <MenuItem value="" disabled>
              {langu === "en" ? "Select Doctor" : "ডাক্তার নির্বাচন করুন"}
            </MenuItem>
            {department?.doctors?.map((item, index) => (
              <MenuItem key={index} value={item?.name}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Service */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Service" : "সেবা"}
          </Typography>
          <Select
            fullWidth
            displayEmpty
            size="small"
            variant="outlined"
            defaultValue=""
            value={formData.service}
            onChange={(e) =>
              setFormData({ ...formData, service: e.target.value })
            }
            renderValue={(selected) =>
              selected || (langu === "en" ? "Select Service" : "সেবা নির্বাচন করুন")
            }
            sx={{
              borderRadius: "24px",
              maxWidth: "556px",
            }}
          >
            <MenuItem value="" disabled>
              {langu === "en" ? "Select Service" : "সেবা নির্বাচন করুন"}
            </MenuItem>
            {[
              langu === "en"
                ? "Consultation / First Visit"
                : "পরামর্শ / প্রথম ভিজিট",
              langu === "en" ? "Follow-up Visit" : "ফলো-আপ ভিজিট",
              langu === "en" ? "Emergency Consultation" : "জরুরি পরামর্শ",
            ].map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {/* Message */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {langu === "en" ? "Message" : "বার্তা"}
          </Typography>
          <TextField
            placeholder={langu === "en" ? "Enter message" : "বার্তা লিখুন"}
            variant="outlined"
            multiline
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={8}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
              },
              width: "100%",
            }}
          />
        </Grid>

        {/* Submit Button */}
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#2A6498",
              color: "white",
              px: 8,
              py: 1.5,
              "&:hover": {
                bgcolor: "#2A6498",
              },
              maxwidth: 267,
              borderRadius: 100,
              textTransform: "capitalize",
            }}
            onClick={() => handleSubmit()}
          >
            {langu === "en" ? "Submit" : "সাবমিট"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormSubmit