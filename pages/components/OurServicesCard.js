import { Paper, Stack, Typography, Button } from '@mui/material'
import { useRouter } from 'next/router';
import React from 'react'

function OurServicesCard({ icons, title, description, buttonText, onClick }) {
    const router = useRouter();
    return (
        <Paper sx={{ p: 3 ,border: "1px solid #EAF0F5",borderRadius:"26px" }} elevation={0} >
            <Stack direction="column"  spacing={2}>
                <img src={icons} alt="service icon" width={55} />
                <Typography variant="body1" fontWeight={"bold"} fontSize={20} color="#2A6498" dangerouslySetInnerHTML={{ __html: title || "" }} />
                <Typography variant="body1" fontSize={16} color="#AAAAAA" dangerouslySetInnerHTML={{ __html: description || "" }} />
                <Button variant="text" color="primary" onClick={()=>router.push(`services/${onClick}`)} sx={{ textTransform: 'none', fontSize: '16px',textAlign: 'left', fontWeight: 500,display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} endIcon={
                    <img src="/assets/home/Vector.svg" alt="arrow icon" width={16} />}>
                    <span dangerouslySetInnerHTML={{ __html: buttonText || "" }} />

                </Button>
            </Stack>
        </Paper>
    )
}

export default OurServicesCard