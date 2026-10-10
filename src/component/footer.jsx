import React from 'react';
import {
  Box, Typography, TextField, Button, Grid, Stack,
  IconButton, Divider, Container, useMediaQuery, useTheme,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const footerLinks = {
  shop: ["Kundan & Polki Chokers", "Temple & Chandbali Jhumkas", "Antique Gold Bangles & Kadas", "Royal Bridal Trousseau", "Modern Cz Everyday Luxe"],
  care: ["Track Consignment", "1-Year Polish Claim", "Bangle & Ring Sizing Guide", "Jewellery Care Regimen", "WhatsApp Direct Support"],
  policies: ["Shipping & COD Terms", "48-Hour Return & Exchange", "Privacy & Secure Gateway", "Terms of Service", "Karigar Sustenance Initiative"]
};

const FooterColumn = ({ title, links, isMobile }) => {
  const content = (
    <Stack spacing={1.2}>
      {links.map((link) => (
        <Typography key={link} sx={{ fontSize: '13.5px', color: '#333', cursor: 'pointer', lineHeight: 1.4, '&:hover': { color: '#4a2028', textDecoration: 'underline' } }}>
          {link}
        </Typography>
      ))}
    </Stack>
  );

  if (isMobile) {
    return (
      <Accordion elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' }, borderBottom: '1px solid #e8e0dc' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>{content}</AccordionDetails>
      </Accordion>
    );
  }
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: '14px', mb: 2 }}>{title}</Typography>
      {content}
    </Box>
  );
};

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: '#f9f3f0', color: '#2b2b2b', mt: 5 }}>
      {/* TOP NEWSLETTER SECTION */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography sx={{ color: '#8a7a3a', fontSize: '11px', letterSpacing: '1.5px', fontWeight: 600, mb: 0.5 }}>
              EXCLUSIVE ROYAL PRIVILEGES
            </Typography>
            <Typography sx={{ fontFamily: 'serif', fontSize: { xs: '20px', md: '22px' }, fontWeight: 500, lineHeight: 1.2, mb: 1 }}>
              Join The Zinora Atelier
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#666', maxWidth: '400px', lineHeight: 1.5 }}>
              Sign up to receive private festive collection previews and enjoy an exclusive 15% off your maiden order.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{
              display: 'flex', alignItems: 'center', bgcolor: 'white',
              borderRadius: '6px', p: 0.6, boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 }
            }}>
              <TextField
                placeholder="Enter your mobile number or email address"
                variant="standard"
                fullWidth
                InputProps={{ disableUnderline: true, sx: { fontSize: '13px', px: 2 } }}
              />
              <Button
                sx={{
                  bgcolor: '#4a2028', color: 'white', textTransform: 'none',
                  borderRadius: '4px', px: 3, py: 1.2, fontSize: '12px',
                  fontWeight: 600, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' },
                  '&:hover': { bgcolor: '#3a1a20' }
                }}
              >
                CLAIM 15% OFF →
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: '#e8e0dc' }} />

      {/* MIDDLE FOOTER LINKS */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontFamily: 'serif', fontWeight: 800, fontSize: '20px', mb: 1.5 }}>ZINORA</Typography>
            <Typography sx={{ fontSize: '12px', color: '#555', lineHeight: 1.6, maxWidth: '320px', mb: 2.5 }}>
              Contemporary Indian heritage meets uncompromising craftsmanship. Zinora crafts bespoke heirloom-grade imitation jewellery with micro-micron gold plating and hand-set uncut stones.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ bgcolor: 'white', width: 32, height: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><PhoneIcon sx={{ fontSize: 16 }} /></IconButton>
              <IconButton sx={{ bgcolor: 'white', width: 32, height: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><EmailIcon sx={{ fontSize: 16 }} /></IconButton>
              <IconButton sx={{ bgcolor: 'white', width: 32, height: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><ChatBubbleIcon sx={{ fontSize: 16 }} /></IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}><FooterColumn title="Shop Collections" links={footerLinks.shop} isMobile={isMobile} /></Grid>
              <Grid item xs={12} md={4}><FooterColumn title="Customer Care" links={footerLinks.care} isMobile={isMobile} /></Grid>
              <Grid item xs={12} md={4}><FooterColumn title="Policies & Trust" links={footerLinks.policies} isMobile={isMobile} /></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* BOTTOM BAR */}
      <Box sx={{ bgcolor: '#efe9e6', py: 1.5, px: { xs: 2, md: 0 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '11px', color: '#666', textAlign: { xs: 'center', md: 'left' } }}>
              © 2025 ZINORA Luxury Imitation Jewels. All Rights Reserved.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              {['UPI', 'RuPay', 'Visa', 'Mastercard', 'Cash on Delivery', 'Razorpay Verified'].map((pay) => (
                <Box key={pay} sx={{ bgcolor: 'white', px: 1, py: 0.5, borderRadius: '3px', border: '1px solid #e0d6d1', fontSize: '10px', fontWeight: 600, color: '#444' }}>
                  {pay}
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}