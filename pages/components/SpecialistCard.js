import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { MyContext } from "../../utils/ContextApi";

function SpecialistCard({ cardImg, title, des, dig, btn, slug, path, department, view, stop, doctorId }) {
  const router = useRouter()
  const { langu } = useContext(MyContext);

  // Create a safe view function that handles cases where view is not provided
  const safeView = (value) => {
    if (typeof view === 'function') {
      view(value);
    }
  };

  // Function to truncate text to 6 words and add ellipsis
  const truncateText = (text, maxWords = 6) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <>
      <Paper
        sx={{ borderRadius: 3, width: "100%", border: "1px solid #EAF0F5", boxShadow: '0px 2px 4px rgba(18, 165, 81, 0.05)', }}
      >
        <Stack alignItems={"center"}>
          <img src={cardImg} width={200} />
        </Stack>
        <Box px={3} mt={3}>
          <Typography
            sx={{
              fontSize: 20,
              color: "#2A6498",
              fontWeight: "bold",
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            dangerouslySetInnerHTML={{ __html: truncateText(title) || "" }}
          />
          <Typography
            sx={{
              fontSize: 16,
              color: "#12A551",
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mt: 1
            }}
            dangerouslySetInnerHTML={{ __html: truncateText(des && dig ? `${des}, ${Array.isArray(dig) ? dig.join(", ") : dig}` : des || dig) || "" }}
          />
        </Box>

        <Stack alignItems={"center"} py={2} spacing={2} direction={"row"} justifyContent={"center"}>
          <Button
            variant="contained"
            size="small"
            onClick={() => { safeView(false); router.push("/appointment"); }}
            sx={{
              bgcolor: "#2A6498",
              color: "white",
              px: 3,
              py: 0.5,
              maxWidth: 180,
              borderRadius: 100,
              textTransform: "capitalize",
            }}
          >
            {langu === 'bn' ? 'অ্যাপয়েন্টমেন্ট' : 'Appointment'}
          </Button>

          <Link href={{
            pathname: `/specialists/${slug}`,
            query: {
              department: department,
              doctorId: doctorId,
              name: title
            },

          }} passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: "#12A551",
                color: "white",
                px: 3,
                py: 0.5,
                maxWidth: 180,
                borderRadius: 100,
                textTransform: "capitalize",
              }}
              onClick={() => safeView(false)}
            >
              <span dangerouslySetInnerHTML={{ __html: btn || "" }} />
            </Button>
          </Link>
        </Stack>

      </Paper>
    </>
  );
}

export default SpecialistCard;
