import React from 'react';
import whatsappQR from '../assets/pages/Admin/whatsapp-qr.jpeg';
import {
Box,
Typography,
Grid,
Stack,
IconButton,
Divider,
Container,
useMediaQuery,
useTheme,
Accordion,
AccordionSummary,
AccordionDetails,
Tooltip,
} from '@mui/material';

import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const WHATSAPP_NUMBER = '919545576919';
const PHONE_NUMBER = '+919545576919';

const footerLinks = {
shop: [
'Kundan & Polki Chokers',
'Temple & Chandbali Jhumkas',
'Antique Gold Bangles & Kadas',
'Royal Bridal Trousseau',
'Modern CZ Everyday Luxe',
],

care: [
'Track Consignment',
'1-Year Polish Claim',
'Bangle & Ring Sizing Guide',
'Jewellery Care Regimen',
'WhatsApp Direct Support',
],

policies: [
'Shipping & COD Terms',
'48-Hour Return & Exchange',
'Privacy & Secure Gateway',
'Terms of Service',
'Karigar Sustenance Initiative',
],
};

const FooterColumn = ({ title, links, isMobile }) => {
const content = ( <Stack spacing={1.2}>
{links.map((link) => (
<Typography
key={link}
sx={{
fontSize: '13px',
color: '#444',
cursor: 'pointer',
lineHeight: 1.5,
transition: 'color 0.2s ease',
'&:hover': {
color: '#4a2028',
textDecoration: 'underline',
},
}}
>
{link} </Typography>
))} </Stack>
);

if (isMobile) {
return (
<Accordion
elevation={0}
sx={{
bgcolor: 'transparent',
'&:before': { display: 'none' },
borderBottom: '1px solid #e8e0dc',
}}
>
<AccordionSummary
expandIcon={<ExpandMoreIcon />}
sx={{ px: 0 }}
>
<Typography
sx={{
fontWeight: 700,
fontSize: '14px',
color: '#4a2028',
}}
>
{title} </Typography> </AccordionSummary>

    <AccordionDetails sx={{ px: 0, pt: 0 }}>
      {content}
    </AccordionDetails>
  </Accordion>
);


}

return ( <Box>
<Typography
sx={{
fontWeight: 700,
fontSize: '14px',
mb: 2,
color: '#4a2028',
}}
>
{title} </Typography>


  {content}
</Box>


);
};

export default function Footer() {
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

const openWhatsApp = () => {
window.open(
`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hello Zinora! I would like to enquire about your jewellery collection.'
      )}`,
'_blank',
'noopener,noreferrer'
);
};

return (
<Box
component="footer"
sx={{
bgcolor: '#f9f3f0',
color: '#2b2b2b',
mt: 5,
}}
>
{/* MAIN FOOTER */}
<Container
maxWidth="lg"
sx={{ py: { xs: 3, md: 5 } }}
> <Grid container spacing={4}>


      {/* BRAND AND CONTACT */}
      <Grid item xs={12} md={4}>
        <Typography
          sx={{
            fontFamily: 'serif',
            fontWeight: 800,
            fontSize: '25px',
            letterSpacing: '2px',
            mb: 1.5,
            color: '#4a2028',
          }}
        >
          ZINORA
        </Typography>

        <Typography
          sx={{
            fontSize: '12.5px',
            color: '#555',
            lineHeight: 1.8,
            maxWidth: '320px',
            mb: 2.5,
          }}
        >
          Contemporary Indian heritage meets uncompromising
          craftsmanship. Discover elegant imitation jewellery
          designed to make every occasion special.
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#4a2028',
            mb: 1.5,
            letterSpacing: '0.5px',
          }}
        >
          CONTACT OUR TEAM
        </Typography>

        <Stack direction="row" spacing={1.5}>

          {/* CALL BUTTON */}
          <Tooltip title="Call Zinora">
            <IconButton
              component="a"
              href={`tel:${PHONE_NUMBER}`}
              aria-label="Call Zinora"
              sx={{
                bgcolor: '#4a2028',
                color: '#fff',
                width: 44,
                height: 44,
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

          {/* WHATSAPP MESSAGE BUTTON */}
          <Tooltip title="Message us on WhatsApp">
            <IconButton
              component="a"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Zinora! I would like to enquire about your jewellery collection.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Zinora on WhatsApp"
              sx={{
                bgcolor: '#25D366',
                color: '#fff',
                width: 44,
                height: 44,
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

        </Stack>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#555',
            mt: 1.5,
          }}
        >
          +91 95455 76919
        </Typography>
      </Grid>

      {/* FOOTER LINKS */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>

          <Grid item xs={12} sm={4}>
            <FooterColumn
              title="Shop Collections"
              links={footerLinks.shop}
              isMobile={isMobile}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FooterColumn
              title="Customer Care"
              links={footerLinks.care}
              isMobile={isMobile}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FooterColumn
              title="Policies & Trust"
              links={footerLinks.policies}
              isMobile={isMobile}
            />
          </Grid>

        </Grid>
      </Grid>

    </Grid>

    {/* WHATSAPP QR CODE SECTION */}
    <Divider
      sx={{
        my: { xs: 3, md: 4 },
        borderColor: '#e8e0dc',
      }}
    />

    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: { xs: 'center', sm: 'left' },
        p: { xs: 2, sm: 3 },
        border: '1px solid #e8e0dc',
        borderRadius: 2,
        bgcolor: '#fffaf8',
      }}
    >
      {/* QR IMAGE PLACEHOLDER */}
      {/* WHATSAPP QR CODE */}
<Box
  sx={{
    width: 150,
    height: 150,
    minWidth: 150,
    border: '1px solid #e8e0dc',
    borderRadius: 2,
    overflow: 'hidden',
    bgcolor: '#fff',
  }}
>
  <Box
    component="img"
    src={whatsappQR}
    alt="Zinora WhatsApp QR Code"
    onError={(event) => {
      console.error('QR image failed to load:', event.currentTarget.src);
    }}
    sx={{
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block',
    }}
  />
</Box>

      <Box sx={{ maxWidth: 420 }}>
        <Typography
          sx={{
            fontFamily: 'serif',
            fontSize: { xs: '20px', md: '23px' },
            fontWeight: 600,
            color: '#4a2028',
            mb: 1,
          }}
        >
          Order on WhatsApp
        </Typography>

        <Typography
          sx={{
            fontSize: '13px',
            color: '#555',
            lineHeight: 1.8,
            mb: 1.5,
          }}
        >
          Scan our official WhatsApp QR code to connect
          with the Zinora team, enquire about jewellery,
          and discuss your order directly.
        </Typography>

        <Box
          component="button"
          onClick={openWhatsApp}
          sx={{
            border: 'none',
            borderRadius: 1,
            bgcolor: '#4a2028',
            color: '#fff',
            px: 2.5,
            py: 1.2,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#35171d',
            },
          }}
        >
          CHAT WITH US
        </Box>
      </Box>
    </Box>
  </Container>

  {/* COPYRIGHT BAR ONLY */}
  <Box
    sx={{
      bgcolor: '#efe9e6',
      py: 2,
      px: 2,
    }}
  >
    <Container maxWidth="lg">
      <Typography
        sx={{
          fontSize: '11px',
          color: '#666',
          textAlign: 'center',
        }}
      >
        © {new Date().getFullYear()} ZINORA Luxury Imitation Jewels.
        All Rights Reserved.
      </Typography>
    </Container>
  </Box>
</Box>


);
}
