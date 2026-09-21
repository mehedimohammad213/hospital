import { cmsMediaUrl } from "@/lib/cms";
import { Drawer, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function ManagementTeam({ open, setOpen, data }) {
  return (
    <Drawer
      anchor="left"
      variant="temporary"
      PaperProps={{
        sx: {
          width: "100%",
          overflow: "hidden",
          height: "100vh", // Drawer full viewport height
          bgcolor: "#2A6498",
        },
      }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Grid
        container
        sx={{
          width: "100vw",
          height: "100vh", // Grid full viewport height
          overflow: "auto",
        }}
      >
        {/* Image Section */}
        <Grid
          item
          size={{ md: 6 }}
          sx={{
            position: "relative",
            height: "100vh", // image column vh height
          }}
        >
          {/* Close icon on mobile */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              display: { xs: "flex", md: "none" },
              position: "absolute",
              top: 10,
              right: 10,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              color: "#000",
              bgcolor: "#fff",
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          <img
            src={cmsMediaUrl(data?.media_files?.file_path)}
            alt={data?.title_en}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top"
            }}
          />
        </Grid>

        {/* Text Section */}
        <Grid
          item
          size={{ md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh", // text column vh height
          }}
        >
          {/* Close icon on desktop */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              display: { xs: "none", md: "flex" },
              alignSelf: "flex-end",
              m: 2,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              color: "#000",
              bgcolor: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            sx={{
              fontSize: { md: 60, xs: 30 },
              fontWeight: 600,
              color: "#fff",
              mx: 2.5,
              mt: { xs: 3 },
            }}
            dangerouslySetInnerHTML={{ __html: data?.title_en || "" }}
          />

          <Typography
            sx={{
              fontSize: { md: 18, xs: 16 },
              color: "#fff",
              lineHeight: 2,
              textAlign: "justify",
              mx: 2.5,
              mb: 3,
              overflowY: "auto",
            }}
            dangerouslySetInnerHTML={{
              __html: data?.description_en
            }}
          />


        </Grid>
      </Grid>
    </Drawer>
  );
}

export default ManagementTeam;
