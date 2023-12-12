import React from "react";
import { Grid, Typography } from "@mui/material";

const styles = {
  container: {
    padding: "24px 40px",
    backgroundColor: "#212121",
    color: "white",
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

const HomePageFooter = () => {
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
        {[
          "Follow us on social media",
          "Careers",
          "Need Help?",
          "help@xfluencer.io",
        ].map((link) => (
          <Typography key={link}>{link}</Typography>
        ))}
      </Grid>
    </Grid>
  );
};

export default HomePageFooter;
