import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/router';
import { MyContext } from '@/utils/ContextApi';

function Submission() {
  const router = useRouter();
  const { langu } = useContext(MyContext);

  return (
    <Box sx={{
      width: "90%",
      maxWidth: "800px",
      margin: "0 auto",
      my: { xs: 4, md: 8 },
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, width: '100%' }}>
        <Stack spacing={3} alignItems="center">
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
          <Typography variant="h4" component="h1" fontWeight={600} color="primary.main">
            {langu === 'en' ? 'Thank You!' : 'ধন্যবাদ!'}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {langu === 'en'
              ? 'Your form has been submitted successfully.'
              : 'আপনার ফর্মটি সফলভাবে জমা দেওয়া হয়েছে।'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {langu === 'en'
              ? 'We have received your request and will get back to you shortly.'
              : 'আমরা আপনার অনুরোধ পেয়েছি এবং শীঘ্রই আপনার সাথে যোগাযোগ করব।'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/')}
            sx={{
              mt: 2,
              bgcolor: "#12A551",
              color: "white",
              borderRadius: 100,
              px: 5,
              py: 1.5,
              textTransform: "capitalize",
              '&:hover': {
                bgcolor: '#0E8C42'
              }
            }}
          >
            {langu === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Submission;