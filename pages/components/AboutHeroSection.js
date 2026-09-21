import { Button, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function AboutHeroSection({
  image1,
  image2,
  title1,
  title2,
  subtitle1,
  subtitle2,
  description,
  image3,
  image4,
  title3,
  title4,
  des1,
  des2,
  button1,
  disable,
}) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // show-on-scroll only on mobile: keep unchanged behavior on larger screens
  const rootRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsMobile(window.innerWidth < 960);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // desktop: always visible
    if (!isMobile) {
      setIsVisible(true);
      return;
    }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    setIsVisible(false);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isMobile]);

  // Track scroll position
  useEffect(() => {
    const updateScrollState = () => {
      const currentScrollY = scrollY.get();
      setIsScrolled(currentScrollY > 100); // Trigger animation after 100px scroll
    };

    const unsubscribe = scrollY.on("change", updateScrollState);
    return () => unsubscribe();
  }, [scrollY]);

  // if on mobile and not yet visible, render placeholder div (no layout change)
  if (isMobile && !isVisible) return <div ref={rootRef} />;

  return (
    <div ref={rootRef}>
      <Grid container spacing={8} mt={6}>
        {/* LEFT images motion wrapper */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.img
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{
                  opacity: isScrolled ? 1 : 0,
                  x: isScrolled ? 0 : -100,
                  scale: isScrolled ? 1 : 0.8,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                src={image1}
                style={{ width: "100%", maxWidth: 422, borderRadius: 16 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} mt={{ lg: 4, xl: 5 }}>
              <motion.img
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{
                  opacity: isScrolled ? 1 : 0,
                  x: isScrolled ? 0 : -100,
                  scale: isScrolled ? 1 : 0.8,
                }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                src={image2}
                style={{ width: "100%", maxWidth: 421, borderRadius: 16 }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT content motion wrapper */}
        <Grid size={{ xs: 12, md: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{
              opacity: isScrolled ? 1 : 0,
              x: isScrolled ? 0 : 100,
              scale: isScrolled ? 1 : 0.8,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Typography
              sx={{
                fontSize: 36,
                fontWeight: 700,
                color: "#0D5EAE",
                pt: 4,
                textTransform: "capitalize",
              }}
              dangerouslySetInnerHTML={{
                __html: `${title2 || ""} <span style="color:#12A551;text-transform:capitalize">${title1 || ""}</span>`,
              }}
            />

            <Typography dangerouslySetInnerHTML={{ __html: subtitle1 }} />

            <Stack
              mt={4}
              spacing={6}
              direction={{ xs: "column", md: "row" }}
              alignItems="flex-start"   // উপরের দিক থেকে সমানভাবে শুরু হবে
              justifyContent="space-between"
              width="100%"
            >
              {/* Left Column - Mission */}
              <Stack
                direction="column"
                width={{ lg: "50%", md: "50%", xs: "100%" }}
                spacing={2}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <img src={image3} width={50} alt="Mission" />
                  <Typography sx={{ fontSize: { lg: 22, xl: 28 }, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: title3 }} />
                </Stack>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: "#555",
                    // textAlign: "justify",
                    lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{ __html: des1 }}
                />
              </Stack>

              {/* Right Column - Vision */}
              <Stack
                direction="column"
                width={{ lg: "50%", md: "50%", xs: "100%" }}
                spacing={2}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <img src={image4} width={40} alt="Vision" />
                  <Typography sx={{ fontSize: { lg: 22, xl: 28 }, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: title4 }} />
                </Stack>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: "#555",
                    // textAlign: "justify",
                    lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{ __html: des2 }}
                />
              </Stack>
            </Stack>


            {router?.pathname === "/about" ? null : (
              <Button
                onClick={() => router.push("/about")}
                variant="outlined"
                color="primary"
                sx={{
                  width: 192.72,
                  height: 57,
                  fontWeight: 500,
                  borderRadius: 100,
                  fontSize: 16,
                  marginTop: 4,
                  textTransform: "capitalize",
                  p: 1,
                  backgroundColor: "#FFF",
                  color: "#2A6498",
                  "&:hover": {
                    backgroundColor: "#2A6498",
                    boxShadow: "none",
                    color: "#fff",
                  },
                }}
              >
                {button1}
              </Button>
            )}
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AboutHeroSection;
