import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Facebook from "@/public/svg/Facebook.svg";
import Instgram from "@/public/svg/Instgram.svg";
import X from "@/public/svg/X.svg";
import LinkedIn from "@/public/svg/Linkedin.svg";

const styles = {
  container: {
    padding: "24px 40px",
    backgroundColor: "#212121",
    color: "white",
    textAlign: "left",
  },
  column: {
    marginTop: 5,
  },
  footerText: {
    variant: "subtitle1",
  },
  copyright: {
    variant: "subtitle1",
    mt: 5,
  },
  accountLinks: {
    variant: "h6",
  },
};

const Footer = () => {
  return (
    <Grid container justifyContent="space-between" sx={styles.container}>
      {/** Column 1 */}
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Typography sx={styles.footerText}>
          XFluencer: Where influencers monetize tweets, likes, and retweets, and
          businesses effortlessly discover and purchase impactful social media
          services on Twitter. Bridging the gap for seamless collaborations.
          Elevate your Twitter presence with XFluencer.
        </Typography>
        <Typography sx={styles.copyright}>
          © 2020, All Rights Reserved
        </Typography>
      </Grid>

      {/** Column 2 */}
      <Grid item xs={12} sm={6} md={2} lg={2}>
        <Typography sx={styles.accountLinks}>My Account</Typography>
        {[
          "Profile",
          "Favourites",
          "Watchlist",
          "Studio",
          "XFluencer Pro",
          "Settings",
        ].map((link) => (
          <Typography key={link}>{link}</Typography>
        ))}
      </Grid>

      {/** Column 3 */}
      <Grid item xs={12} sm={6} md={2} lg={2}>
        <Typography sx={styles.accountLinks}>Resources</Typography>
        {[
          "Blog",
          "Learn",
          "Help center",
          "Community standards",
          "Taxes",
          "Developer platform",
          "Platform status",
        ].map((link) => (
          <Typography key={link}>{link}</Typography>
        ))}
      </Grid>

      {/** Column 4 */}
      <Grid item xs={12} sm={6} md={2} lg={2}>
        <Typography sx={styles.accountLinks}>Contact</Typography>

        <Typography sx={{ mt: 2 }}>Follow us on social media</Typography>

        <Box sx={{ mb: 2, display: "flex", columnGap: "4px" }}>
          {[X, Facebook, Instgram, LinkedIn].map((icon, index) => (
            <Image
              key={index}
              src={icon}
              height={30}
              width={30}
              alt={`Social Icon ${index + 1}`}
            />
          ))}
        </Box>

        {["Careers", "Need Help?", "help@xfluencer.io"].map((link) => (
          <Typography key={link}>{link}</Typography>
        ))}
      </Grid>
    </Grid>
  );
};

export default Footer;
