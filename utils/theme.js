import { createTheme } from "@mui/material/styles";
import { Jost } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  // weight: ['400', '500', '600', '700'],
});
const primary = "#2A6498";
const secondary = "#FBB03B";
const background = "#ffffff";
const background2 = "#073064";
const background3 = "#fae62d";
const background4 = "#585864";
const error = "#9A0E20";
const success = "#12A551";
const black = "#00000";
const ash = "#E9E9E9";
const bandColor = "#006FEE"

const breakpoints = {
  // for responsiveness
  values: {
    xs: 0,
    xms: 380,
    sm: 600, // Phone
    md: 900, // Tablet/Laptop
    lg: 1200, // Desktop
    xl: 1920,
  },
};

const theme = createTheme({
  breakpoints: breakpoints,
  palette: {
    primary: {
      main: primary,
      contrastText: background,
    },
    secondary: {
      main: secondary,
      contrastText: background,
    },
    ash: {
      main: ash,
      dark: "#00000089",
      contrastText: primary,
    },
    white: {
      main: background,
      contrastText: primary,
    },
    background: {
      default: background,
    },
    background3: {
      main: background3,
      contrastText: background,
    },
    bandColor: {
      main: bandColor,
      contrastText: background,
    },
    background4: {
      main: background4,
      contrastText: background,
    },
    background2: {
      main: background2,
      contrastText: background,
    },
    error: {
      main: error,
      contrastText: background,
    },
    badge1: {
      main: background,
      contrastText: success,
    },
    black: {
      main: black,
      contrastText: background,
    },
  },
  components: {
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: "4px",
          // padding: "5px 10px",
          // color: error,
          fontWeight: "bold",
          // background: background,
        },
      },
    },
     
    MuiDialogActions: {
      styleOverrides: {
        root: {
          marginLeft: "0px",
        },
      },
    },
  },
  typography: {
     fontFamily: jost.style.fontFamily,
  },
   MuiButton: {
      styleOverrides: {
        root: {
           fontFamily: jost.style.fontFamily,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: jost.style.fontFamily,
        },
      },
    },
  
});

theme.typography.header1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: black,
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
  },
};

theme.typography.login1 = {
  fontSize: "60px",
  // fontWeight: "bold",
  color: primary,
  [theme.breakpoints.down("md")]: {
    fontSize: "40px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
  },
};
theme.typography.productName = {
  fontSize: "35px",
  // fontWeight: "bold",
  color: primary,
  [theme.breakpoints.down("md")]: {
    fontSize: "24px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
  },
};
theme.typography.login2 = {
  fontSize: "48px",
  fontWeight: "500",
  color: primary,
  // [theme.breakpoints.down("md")]: {
  //   fontSize: "24px",
  // },
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px",
    fontWeight: "700",
  },
};
theme.typography.legend = {
  fontSize: "16px",
  fontWeight: "500",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.tileTime = {
  fontSize: "0.7rem",
  fontWeight: "lighter",
  lineHeight: "0.7rem",
};

theme.typography.normal = {
  fontSize: "16px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};

theme.typography.pre = {
  fontSize: "16px",

  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};

theme.typography.cardHeader = {
  fontSize: "14px",
  fontWeight: "500",

  color: black,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.cardHeader2 = {
  fontSize: "14px",
  fontWeight: "400",

  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.cardHeader3 = {
  fontSize: "14px",
  fontWeight: "400",
  color: "#3A3A3A",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.cardHeader1 = {
  fontSize: "16px",
  fontWeight: "bold",
  // fontWeight:"400",
  color: black,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.homeFlash = {
  fontSize: "16px",
  fontWeight: "400",
  // fontWeight:"400",
  color: black,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.cardHeader12 = {
  fontSize: "14px",
  fontWeight: "bold",
  // fontWeight:"400",
  color: black,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};

theme.typography.cardLocation = {
  fontSize: "12px",
  fontWeight: "400",
  // color: ,
  [theme.breakpoints.down("sm")]: {
    fontSize: "8px",
  },
};
theme.typography.cardLocation1 = {
  fontSize: "12px",
  // color: ,
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
  },
};
theme.typography.cardLocation123 = {
  fontSize: "10px",
  // color: ,
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
  },
};

theme.typography.tabText = {
  fontSize: "18px",
  fontWeight: "400",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
};
theme.typography.tabText1 = {
  fontSize: "18px",
  fontWeight: "700",
};

export default theme;
