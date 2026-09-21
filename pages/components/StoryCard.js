import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";

function StoryCard({ image, date, title, description, slug }) {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        maxWidth: 412,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        width: "100%",
      }}
    >
      {/* Image */}
      <Box sx={{ width: "100%", position: "relative" }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",

            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
      </Box>

      {/* Content */}
      <Box px={2} py={2.5}>
        <Typography sx={{ color: "#2A6498", fontSize: 12, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: date || "" }} />

        <Typography sx={{ fontWeight: 600, my: 1, fontSize: 18 }} dangerouslySetInnerHTML={{ __html: title || "" }} />

        <Typography
          sx={{ color: "#AAAAAA", fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: description || "" }}
        />

        <Box mt={2}>
          <Link href={`/stories/${slug}`} passHref legacyBehavior>
            <Button
              sx={{
                p: 0,
                textTransform: "none",
                fontWeight: 600,
                color: "#12A551",
              }}
              endIcon={
                <span style={{ fontSize: "16px", marginLeft: 4 }}>→</span>
              }
            >
              Learn More
            </Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}

export default StoryCard;
