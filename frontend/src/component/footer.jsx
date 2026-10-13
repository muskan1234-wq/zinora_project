import React from 'react';
import whatsappQR from '../assets/pages/Admin/whatsapp-qr.jpeg';

import {
  Box,
  Typography,
  Stack,
  IconButton,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';

import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WHATSAPP_NUMBER = '919545576919';
const PHONE_NUMBER = '+919545576919';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const whatsappMessage =
    'Hello Zinora! I would like to enquire about your jewellery collection.';

  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f9f3f0',
        color: '#2b2b2b',
        mt: 5,
        width: '100%',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 3, md: 5 },
        }}
      >
        {/* BRAND AND CONTACT SECTION */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 4, md: 5 },
            mb: 4,
            width: '100%',
          }}
        >
          {/* LEFT SIDE: ZINORA BRAND */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              width: { xs: '100%', md: 'auto' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'serif',
                fontWeight: 800,
                fontSize: { xs: '27px', md: '32px' },
                letterSpacing: '3px',
                mb: 1.5,
                color: '#4a2028',
              }}
            >
              ZINORA
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                color: '#555',
                lineHeight: 1.9,
                maxWidth: '430px',
                mx: { xs: 'auto', md: 0 },
              }}
            >
              Contemporary Indian heritage meets
              uncompromising craftsmanship. Discover elegant
              imitation jewellery designed to make every
              occasion special.
            </Typography>
          </Box>

          {/* RIGHT SIDE: CONTACT US */}
          <Box
            sx={{
              width: { xs: '100%', md: '220px' },
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* CONTACT US HEADING */}
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#4a2028',
                mb: 2,
                letterSpacing: '1px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              CONTACT US
            </Typography>

            {/* CALL AND WHATSAPP ICONS */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{
                width: '100%',
                mb: 1.5,
              }}
            >
              
{/* CALL AND WHATSAPP BUTTONS - RIGHT SIDE */}
<Box
  sx={{
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 1.5,
    width: '100%',
    pr: 7, // Icons ko right edge se thoda left lane ke liye
  }}
>
  {/* CALL BUTTON */}
  <Tooltip title="Call Zinora">
    <IconButton
      component="a"
      href={`tel:${PHONE_NUMBER}`}
      aria-label="Call Zinora"
      sx={{
        bgcolor: '#4a2028',
        color: '#fff',
        width: 46,
        height: 46,
        flexShrink: 0,
        '&:hover': {
          bgcolor: '#35171d',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <PhoneIcon />
    </IconButton>
  </Tooltip>

  {/* WHATSAPP BUTTON */}
  <Tooltip title="Chat with Zinora on WhatsApp">
    <IconButton
      component="a"
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zinora on WhatsApp"
      sx={{
        bgcolor: '#25D366',
        color: '#fff',
        width: 46,
        height: 46,
        flexShrink: 0,
        '&:hover': {
          bgcolor: '#1eae54',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <WhatsAppIcon />
    </IconButton>
  </Tooltip>
</Box>


            </Stack>

            {/* CONTACT NUMBER */}
            <Typography
              component="a"
              href={`tel:${PHONE_NUMBER}`}
              sx={{
                fontSize: '12px',
                color: '#555',
                width: '100%',
                textAlign: 'center',
                textDecoration: 'none',
                mt: 0.5,
                '&:hover': {
                  color: '#4a2028',
                },
              }}
            >
              +91 95455 76919
            </Typography>
          </Box>
        </Box>

        {/* DIVIDER */}
        <Divider
          sx={{
            my: { xs: 3, md: 4 },
            borderColor: '#e8e0dc',
          }}
        />

        {/* WHATSAPP QR CODE SECTION */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2.5, sm: 4 },
            textAlign: {
              xs: 'center',
              sm: 'left',
            },
            p: { xs: 2, sm: 3, md: 4 },
            border: '1px solid #e8e0dc',
            borderRadius: 3,
            bgcolor: '#fffaf8',
            boxShadow: '0 4px 18px rgba(74, 32, 40, 0.05)',
          }}
        >
          {/* QR CODE IMAGE */}
          <Box
            sx={{
              width: { xs: 145, sm: 155 },
              height: { xs: 145, sm: 155 },
              minWidth: { xs: 145, sm: 155 },
              border: '1px solid #e8e0dc',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#fff',
              p: 1,
              boxSizing: 'border-box',
            }}
          >
            <Box
              component="img"
              src={whatsappQR}
              alt="Zinora WhatsApp QR Code"
              onError={(event) => {
                console.error(
                  'QR image failed to load:',
                  event.currentTarget.src
                );
              }}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Box>

          {/* ORDER ON WHATSAPP CONTENT */}
          <Box
            sx={{
              maxWidth: 430,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'serif',
                fontSize: {
                  xs: '23px',
                  md: '28px',
                },
                fontWeight: 600,
                color: '#4a2028',
                mb: 1.5,
              }}
            >
              Order on WhatsApp
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                color: '#555',
                lineHeight: 1.9,
                mb: 2.5,
              }}
            >
              Scan our official WhatsApp QR code to connect
              with the Zinora team, explore our jewellery
              collection, enquire about products, and discuss
              your order directly with us.
            </Typography>

            {/* CHAT WITH US BUTTON */}
            <Box
              component="a"
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                border: 'none',
                borderRadius: 1,
                bgcolor: '#4a2028',
                color: '#fff',
                px: 3,
                py: 1.4,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.7px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#35171d',
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 4px 12px rgba(74, 32, 40, 0.2)',
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 18 }} />
              CHAT WITH US
            </Box>

            <Typography
              sx={{
                fontSize: '11px',
                color: '#888',
                mt: 1.5,
              }}
            >
              {isMobile
                ? 'Tap the button to start a conversation.'
                : 'Scan the QR code or click the button to connect with us.'}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* COPYRIGHT BAR */}
      <Box
        sx={{
          bgcolor: '#efe9e6',
          py: 2,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          
        </Container>
      </Box>
    </Box>
  );
}