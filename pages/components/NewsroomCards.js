import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { MyContext } from "@/utils/ContextApi";
import { buildCmsCollectionHref } from "@/lib/cms";

function NewsroomCards({ image, date, title, description, slug, path }) {
  const { langu } = useContext(MyContext);
  const href = useMemo(
    () => buildCmsCollectionHref(path || "", slug),
    [path, slug]
  );

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        maxWidth: 412,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        width: "100%",
        height: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ width: "100%", position: "relative" }}>
        <img
          src={image}
          alt={typeof title === "string" ? title.replace(/<[^>]+>/g, "") : "Story"}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            objectPosition: "top",
          }}
        />
      </Box>

      <Box px={2} py={2.5}>
        <Typography
          sx={{ color: "#2A6498", fontSize: 12, fontWeight: 600 }}
          dangerouslySetInnerHTML={{ __html: date || "" }}
        />

        <Typography
          sx={{ fontWeight: 600, my: 1, fontSize: 18 }}
          dangerouslySetInnerHTML={{ __html: title || "" }}
        />

        <Typography
          sx={{
            color: "#AAAAAA",
            fontSize: 16,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          dangerouslySetInnerHTML={{ __html: description || "" }}
        />

        <Box mt={2}>
          {href ? (
            <Link href={href} passHref legacyBehavior>
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
                {langu === "en" ? "Learn More" : "আরো জানুন"}
              </Button>
            </Link>
          ) : null}
        </Box>
      </Box>
    </Paper>
  );
}

export default NewsroomCards;
