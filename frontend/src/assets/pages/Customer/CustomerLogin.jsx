import React, { useState } from "react";

import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
} from "@mui/material";

import {
  LockOutlined,
  BoltOutlined,
  CardGiftcardOutlined,
  DiamondOutlined,
  Google,
  WhatsApp,
  VerifiedOutlined,
  ChatOutlined,
} from "@mui/icons-material";


const CustomerLogin = () => {
  const [loginMethod, setLoginMethod] = useState("otp");

  const [mobile, setMobile] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);


  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);
  };


  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#f5f2ee",
        padding: {
          xs: "10px",
          md: "18px",
        },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      {/* MAIN LOGIN CONTAINER */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1350px",
          minHeight: {
            xs: "auto",
            md: "650px",
          },

          backgroundColor: "#ffffff",

          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          borderRadius: "10px",

          overflow: "hidden",

          boxShadow: "0 8px 35px rgba(0,0,0,0.12)",
        }}
      >


        {/* ===================================================== */}
        {/* LEFT SIDE - ROYAL ACCESS */}
        {/* ===================================================== */}

        <Box
          sx={{
            width: {
              xs: "100%",
              md: "40%",
            },

            minHeight: {
              xs: "400px",
              md: "650px",
            },

            background:
              "linear-gradient(rgba(67,0,10,0.92), rgba(67,0,10,0.96)), url('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80')",

            backgroundSize: "cover",

            backgroundPosition: "center",

            color: "#ffffff",

            padding: {
              xs: "35px 25px",
              md: "55px 45px",
            },

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",
          }}
        >

          {/* LABEL */}

          <Typography
            sx={{
              display: "inline-block",

              width: "fit-content",

              backgroundColor: "#6b1420",

              color: "#d9b66d",

              padding: "6px 12px",

              borderRadius: "20px",

              fontSize: "9px",

              fontWeight: 700,

              letterSpacing: "1.5px",

              marginBottom: "22px",
            }}
          >
            ATELIER ROYAL ACCESS
          </Typography>


          {/* HEADING */}

          <Typography
            sx={{
              fontFamily: "Georgia, 'Times New Roman', serif",

              fontSize: {
                xs: "32px",
                md: "42px",
              },

              lineHeight: 1.1,

              fontWeight: 500,

              marginBottom: "18px",
            }}
          >
            Step Into Royal
            <br />
            Grandeur
          </Typography>


          {/* DESCRIPTION */}

          <Typography
            sx={{
              color: "#e4d6d6",

              fontSize: "12px",

              lineHeight: 1.7,

              maxWidth: "430px",

              marginBottom: "30px",
            }}
          >
            Exclusive access to bespoke jewellery, private festive
            previews, personal bridal concierge & express parcel tracking.
          </Typography>


          {/* BENEFIT 1 */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: "12px",

              backgroundColor: "rgba(255,255,255,0.10)",

              padding: "12px",

              marginBottom: "8px",

              borderRadius: "2px",
            }}
          >

            <Box
              sx={{
                width: "32px",
                height: "32px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#9a6d25",

                borderRadius: "5px",
              }}
            >
              <BoltOutlined sx={{ fontSize: "18px" }} />
            </Box>


            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Instant 1-Click Access
              </Typography>

              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#d8caca",
                  marginTop: "3px",
                }}
              >
                Frictionless Mobile & OTP validation
              </Typography>
            </Box>

          </Box>


          {/* BENEFIT 2 */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: "12px",

              backgroundColor: "rgba(255,255,255,0.10)",

              padding: "12px",

              marginBottom: "8px",

              borderRadius: "2px",
            }}
          >

            <Box
              sx={{
                width: "32px",
                height: "32px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#9a6d25",

                borderRadius: "5px",
              }}
            >
              <CardGiftcardOutlined sx={{ fontSize: "18px" }} />
            </Box>


            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                ₹150 + 10% Welcome Reward
              </Typography>

              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#d8caca",
                  marginTop: "3px",
                }}
              >
                Auto-credited for loyal picks & radiant heirlooms
              </Typography>
            </Box>

          </Box>


          {/* BENEFIT 3 */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: "12px",

              backgroundColor: "rgba(255,255,255,0.10)",

              padding: "12px",

              borderRadius: "2px",
            }}
          >

            <Box
              sx={{
                width: "32px",
                height: "32px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#9a6d25",

                borderRadius: "5px",
              }}
            >
              <DiamondOutlined sx={{ fontSize: "18px" }} />
            </Box>


            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Unified Vault Sync
              </Typography>

              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#d8caca",
                  marginTop: "3px",
                }}
              >
                Synchronise saved bridal assets across all devices
              </Typography>
            </Box>

          </Box>

        </Box>


        {/* ===================================================== */}
        {/* RIGHT SIDE - CUSTOMER LOGIN */}
        {/* ===================================================== */}

        <Box
          sx={{
            width: {
              xs: "100%",
              md: "60%",
            },

            padding: {
              xs: "30px 22px",
              sm: "40px",
              md: "55px",
            },

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",
          }}
        >


          {/* TOP ACCOUNT TABS */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: "8px",

              marginBottom: "35px",

              flexWrap: "wrap",
            }}
          >

            <Button
              sx={{
                backgroundColor: "#f5f2ee",

                color: "#4d000d",

                fontSize: "9px",

                fontWeight: 700,

                padding: "7px 14px",

                borderRadius: "20px",

                minWidth: "auto",

                "&:hover": {
                  backgroundColor: "#eee8e1",
                },
              }}
            >
              CUSTOMER ACCOUNT
            </Button>


            <Button
              sx={{
                color: "#777",

                fontSize: "9px",

                padding: "7px 14px",

                minWidth: "auto",
              }}
            >
              <ChatOutlined
                sx={{
                  fontSize: "12px",
                  marginRight: "5px",
                }}
              />

              CONCIERGE / STAFF
            </Button>


            <Box
              sx={{
                marginLeft: {
                  xs: 0,
                  md: "auto",
                },

                display: "flex",

                alignItems: "center",

                gap: "4px",
              }}
            >

              <LockOutlined
                sx={{
                  fontSize: "11px",
                  color: "#80652d",
                }}
              />

              <Typography
                sx={{
                  fontSize: "8px",
                  color: "#666",
                }}
              >
                RBI LEVEL SECURITY
              </Typography>

            </Box>

          </Box>


          {/* HEADING */}

          <Typography
            sx={{
              fontFamily: "Georgia, 'Times New Roman', serif",

              color: "#52000d",

              fontSize: {
                xs: "25px",
                md: "30px",
              },

              marginBottom: "8px",
            }}
          >
            Welcome to ZINORA
          </Typography>


          <Typography
            sx={{
              color: "#777",

              fontSize: "11px",

              lineHeight: 1.6,

              marginBottom: "28px",

              maxWidth: "550px",
            }}
          >
            Sign in to manage bridals, consignment, view VIP collections,
            and claim vault tokens.
          </Typography>


          {/* LOGIN METHOD TABS */}

          <Box
            sx={{
              display: "flex",

              gap: "25px",

              marginBottom: "20px",

              borderBottom: "1px solid #eeeeee",
            }}
          >

            <Button
              onClick={() => setLoginMethod("otp")}
              sx={{
                color:
                  loginMethod === "otp"
                    ? "#52000d"
                    : "#777",

                fontSize: "10px",

                fontWeight:
                  loginMethod === "otp"
                    ? 700
                    : 400,

                padding: "0 0 10px 0",

                minWidth: "auto",

                borderRadius: 0,

                borderBottom:
                  loginMethod === "otp"
                    ? "2px solid #52000d"
                    : "2px solid transparent",
              }}
            >
              Mobile Number OTP
            </Button>


            <Button
              onClick={() => setLoginMethod("email")}
              sx={{
                color:
                  loginMethod === "email"
                    ? "#52000d"
                    : "#777",

                fontSize: "10px",

                fontWeight:
                  loginMethod === "email"
                    ? 700
                    : 400,

                padding: "0 0 10px 0",

                minWidth: "auto",

                borderRadius: 0,

                borderBottom:
                  loginMethod === "email"
                    ? "2px solid #52000d"
                    : "2px solid transparent",
              }}
            >
              Email & Password
            </Button>

          </Box>


          {/* ================================================= */}
          {/* OTP LOGIN */}
          {/* ================================================= */}

          {loginMethod === "otp" && (
            <>

              {/* MOBILE NUMBER LABEL */}

              <Typography
                sx={{
                  fontSize: "8px",

                  color: "#777",

                  fontWeight: 600,

                  letterSpacing: "0.5px",

                  marginBottom: "7px",
                }}
              >
                INDIAN REGISTERED MOBILE NUMBER
              </Typography>


              {/* MOBILE INPUT */}

              <Box
                sx={{
                  display: "flex",

                  gap: "8px",

                  marginBottom: "5px",
                }}
              >

                <TextField
                  value="+91"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    width: "75px",

                    "& .MuiInputBase-input": {
                      fontSize: "11px",
                      fontWeight: 600,
                    },
                  }}
                />


                <TextField
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98320 41180"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "11px",
                    },
                  }}
                />

              </Box>


              {/* VERIFIED TEXT */}

              <Box
                sx={{
                  display: "flex",

                  alignItems: "center",

                  gap: "5px",

                  marginBottom: "20px",
                }}
              >

                <VerifiedOutlined
                  sx={{
                    fontSize: "12px",
                    color: "#3c9b65",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "8px",
                    color: "#777",
                  }}
                >
                  Standard operator SMS and WhatsApp OTP enabled
                </Typography>

              </Box>


              {/* OTP LABEL */}

              <Box
                sx={{
                  display: "flex",

                  justifyContent: "space-between",

                  alignItems: "center",

                  marginBottom: "10px",
                }}
              >

                <Typography
                  sx={{
                    fontSize: "9px",

                    color: "#555",

                    fontWeight: 600,
                  }}
                >
                  ✉ ENTER 6-DIGIT VERIFICATION CODE
                </Typography>


                <Button
                  sx={{
                    fontSize: "7px",

                    color: "#52000d",

                    padding: 0,

                    minWidth: "auto",
                  }}
                >
                  CHANGE NUMBER
                </Button>

              </Box>


              {/* OTP BOXES */}

              <Box
                sx={{
                  display: "flex",

                  gap: "8px",

                  marginBottom: "12px",
                }}
              >

                {otp.map((value, index) => (
                  <TextField
                    key={index}
                    value={value}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value
                      )
                    }
                    size="small"

                    inputProps={{
                      maxLength: 1,

                      style: {
                        textAlign: "center",

                        fontWeight: 700,

                        fontSize: "15px",
                      },
                    }}

                    sx={{
                      width: {
                        xs: "38px",
                        sm: "48px",
                      },

                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                      },
                    }}
                  />
                ))}

              </Box>


              {/* RESEND */}

              <Box
                sx={{
                  display: "flex",

                  justifyContent: "space-between",

                  marginBottom: "22px",
                }}
              >

                <Typography
                  sx={{
                    fontSize: "8px",
                    color: "#777",
                  }}
                >
                  ⟳ Resend code in <b>00:24</b>
                </Typography>


                <Button
                  sx={{
                    fontSize: "8px",

                    color: "#80652d",

                    padding: 0,

                    minWidth: "auto",
                  }}
                >
                  💬 Send via WhatsApp
                </Button>

              </Box>


              {/* VERIFY BUTTON */}

              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#52000d",

                  color: "#ffffff",

                  fontSize: "10px",

                  fontWeight: 700,

                  padding: "12px",

                  borderRadius: "3px",

                  "&:hover": {
                    backgroundColor: "#3d0009",
                  },
                }}
              >
                VERIFY & ENTER LOUNGE&nbsp; →
              </Button>

            </>
          )}


          {/* ================================================= */}
          {/* EMAIL LOGIN */}
          {/* ================================================= */}

          {loginMethod === "email" && (
            <Box>

              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#777",
                  marginBottom: "6px",
                }}
              >
                EMAIL ADDRESS
              </Typography>


              <TextField
                fullWidth
                size="small"
                placeholder="Enter your email"
                sx={{
                  marginBottom: "18px",

                  "& .MuiInputBase-input": {
                    fontSize: "11px",
                  },
                }}
              />


              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#777",
                  marginBottom: "6px",
                }}
              >
                PASSWORD
              </Typography>


              <TextField
                fullWidth
                size="small"
                type="password"
                placeholder="Enter your password"
                sx={{
                  marginBottom: "22px",

                  "& .MuiInputBase-input": {
                    fontSize: "11px",
                  },
                }}
              />


              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#52000d",

                  fontSize: "10px",

                  padding: "12px",

                  "&:hover": {
                    backgroundColor: "#3d0009",
                  },
                }}
              >
                SIGN IN →
              </Button>

            </Box>
          )}


          {/* ================================================= */}
          {/* SOCIAL LOGIN */}
          {/* ================================================= */}

          <Divider
            sx={{
              margin: "25px 0 18px",
            }}
          >
            <Typography
              sx={{
                fontSize: "7px",
                color: "#999",

                letterSpacing: "0.5px",
              }}
            >
              EXPRESS SOCIAL ACCESS
            </Typography>
          </Divider>


          <Box
            sx={{
              display: "flex",

              gap: "8px",

              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >

            <Button
              fullWidth
              startIcon={
                <Google
                  sx={{
                    fontSize: "14px !important",
                  }}
                />
              }
              sx={{
                backgroundColor: "#f5f3f0",

                color: "#555",

                fontSize: "9px",

                padding: "10px",

                "&:hover": {
                  backgroundColor: "#eeeae5",
                },
              }}
            >
              GOOGLE ACCESS
            </Button>


            <Button
              fullWidth
              startIcon={
                <WhatsApp
                  sx={{
                    fontSize: "14px !important",
                  }}
                />
              }
              sx={{
                backgroundColor: "#f5f3f0",

                color: "#555",

                fontSize: "9px",

                padding: "10px",

                "&:hover": {
                  backgroundColor: "#eeeae5",
                },
              }}
            >
              WHATSAPP 1-CLICK
            </Button>

          </Box>


          {/* ================================================= */}
          {/* CREATE ACCOUNT */}
          {/* ================================================= */}

          <Box
            sx={{
              backgroundColor: "#f5f3f0",

              marginTop: "15px",

              padding: "13px",

              textAlign: "center",
            }}
          >

            <Typography
              sx={{
                fontSize: "9px",

                color: "#666",
              }}
            >
              First time exploring ZINORA's Royal Vault?
            </Typography>


            <Button
              sx={{
                color: "#80652d",

                fontSize: "8px",

                fontWeight: 700,

                padding: "4px 0 0",

                minWidth: "auto",
              }}
            >
              ✨ CREATE ATELIER ACCOUNT
            </Button>

          </Box>

        </Box>

      </Box>

    </Box>
  );
};


export default CustomerLogin;