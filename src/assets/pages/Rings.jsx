
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Badge,
  Card,
} from "react-bootstrap";

import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const PRODUCTS = [
  {
    tag: "Bestseller",
    off: 53,
    name: "Zohra Emerald Cut Adjustable green crystal...",
    rating: 4.9,
    n: 128,
    price: 279,
    mrp: 699,
    g: ["#0f3d2e", "#1d6b4f"],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Waterproof",
    off: 58,
    name: "Aanya Sunburst Medallion 18-inch waterproof...",
    rating: 4.9,
    n: 74,
    price: 249,
    mrp: 599,
    g: ["#f3e3c3", "#d9b36c"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Heritage Craft",
    off: 56,
    name: "Padmavati Cocktail Temple Ring Royal filigree motif with...",
    rating: 4.8,
    n: 210,
    price: 349,
    mrp: 799,
    g: ["#5a0f1f", "#b8862b"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Top Rated",
    off: 54,
    name: "Tara Starburst Cubic Zirconia Ring Pavé diamond band with...",
    rating: 5.0,
    n: 188,
    price: 229,
    mrp: 499,
    g: ["#eef1f6", "#c9d3e3"],
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Everyday Luxe",
    off: 54,
    name: "Nitya Protective Talisman Mother-of-pearl disc an...",
    rating: 4.9,
    n: 77,
    price: 229,
    mrp: 499,
    g: ["#efe7dc", "#cdb89a"],
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Navratna Special",
    off: 55,
    name: "Jodha Navratna Nine-Gem Multicolored traditional...",
    rating: 4.7,
    n: 302,
    price: 449,
    mrp: 999,
    g: ["#d7a24a", "#7a1d2b"],
    image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Opens Inside",
    off: 57,
    name: "Meera Engraved... Dual-tone vintage finish...",
    rating: 4.8,
    n: 115,
    price: 299,
    mrp: 699,
    g: ["#8c6a3a", "#d8b878"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85",
  },
  {
    tag: "Architectural",
    off: 56,
    name: "Kashmiri Arch Pearl Drop... Intricate Mughal arch wit...",
    rating: 4.8,
    n: 163,
    price: 349,
    mrp: 799,
    g: ["#f6e9c7", "#c99a3d"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=85",
  },
];

const STACKS = [
  {
    t: "Base Collar Tier",
    s: "14-Inch Micro Choker",
    d: "Anchor the collarbone with a high-resting minimalist snake band or delicate bezel-set CZ strand. Prevents lower chains from twisting.",
    g: ["#e9d9c8", "#b99a7a"],
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
  },
  {
    t: "Central Luminary",
    s: "18-Inch Mid Pendant",
    d: "Introduce focal identity like the Aanya Sunburst or Nitya Talisman. Falls gracefully over high crewnecks and open plunging blouses.",
    g: ["#7a1d2b", "#c28a4a"],
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
  },
  {
    t: "Elongated Accent",
    s: "22-Inch Lariat / Drop",
    d: "Extend vertical silhouette with the Meera Keepsake Locket or elongated drop talisman. Creates an elongating V-line illusion for casual styling.",
    g: ["#d9c7ae", "#9b7b57"],
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85",
  },
];

const REVIEWS = [
  {
    i: "AM",
    n: "Ananya Mukherjee",
    c: "Kolkata",
    p: "Zohra Ring",
    t: "The adjustable band is a game changer! I bought this Zohra emerald cocktail ring because I normally have problems with sizing. The green crystal sparkles like real Zambian emerald.",
  },
  {
    i: "PS",
    n: "Pooja Sharma",
    c: "Bengaluru",
    p: "Sunburst Pendant",
    t: "Wore it during monsoon humidity - zero tarnish! The Aanya Sunburst Medallion has literally become my daily chain. I wear it to gym sessions and showers, and the micro-gold polish has stayed shimmering at 4 months straight. Highly recommend!",
  },
  {
    i: "DK",
    n: "Dr. Ritu Kapoor",
    c: "New Delhi",
    p: "Navratna Ring",
    t: "Looks exactly like heirloom Polki jewellery. Wore the Jodha Navratna Floral Ring to my cousin's sangeet. Everyone assumed it was real gold and gemstone from an old Jaipur family jeweller. Outstanding attention to detail.",
  },
];

const css = `
:root{
  --maroon:#5a0f1f;
  --maroon-d:#3f0a15;
  --gold:#c8962e;
  --cream:#faf6f0;
  --ink:#2a1a1a;
  --muted:#7a6a68;
  --line:#e6dccf
}

.zr{
  font-family:'Inter',system-ui,sans-serif;
  color:var(--ink);
  background:#fff;
  font-size:14px
}

.zr h1,
.zr h2,
.zr h3,
.zr .serif{
  font-family:'Playfair Display',Georgia,serif
}

.zr .hero{
  background:linear-gradient(120deg,#f5ede2,#e9d6bd);
  padding:56px 0
}

.zr .hero h1{
  font-size:34px;
  font-weight:600;
  margin:6px 0 10px
}

.zr .hero .eyebrow{
  font-size:11px;
  letter-spacing:1.5px;
  color:var(--gold)
}

.zr .pill{
  display:inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid var(--line);
  background:#fff;
  font-size:11px;
  padding:5px 10px;
  margin:4px 6px 0 0
}

.zr .hero-img{
  height:230px;
  background:linear-gradient(135deg,#0f3d2e,#b8862b);
  position:relative
}

.zr .hero-img img{
  width:100%;
  height:100%;
  object-fit:cover
}

.zr .hero-img .micro{
  position:absolute;
  left:14px;
  bottom:14px;
  background:#fff;
  font-size:10px;
  padding:6px 10px
}

.zr .crumb{
  font-size:11px;
  color:var(--muted);
  padding:14px 0
}

.zr .side h6{
  font-size:12px;
  letter-spacing:1px;
  margin:18px 0 10px
}

.zr .side .form-check-label{
  font-size:12px
}

.zr .form-check-input:checked{
  background-color:var(--maroon);
  border-color:var(--maroon)
}

.zr .sizer{
  background:var(--maroon);
  color:#fff;
  padding:14px;
  font-size:12px;
  margin-top:20px
}

.zr .gift{
  background:var(--cream);
  border:1px dashed var(--line);
  padding:14px;
  font-size:12px;
  margin-top:14px
}

.zr .pcard{
  border:1px solid var(--line);
  border-radius:0;
  height:100%
}

.zr .pimg{
  height:200px;
  position:relative
}

.zr .pimg img,
.zr .stack-img img{
  width:100%;
  height:100%;
  object-fit:cover
}

.zr .pimg img{
  position:absolute;
  inset:0
}

.zr .ptag{
  position:absolute;
  z-index:1;
  left:0;
  top:0;
  background:var(--maroon);
  color:#fff;
  font-size:10px;
  padding:3px 8px
}

.zr .poff{
  position:absolute;
  z-index:1;
  left:0;
  top:22px;
  background:var(--gold);
  color:#fff;
  font-size:10px;
  padding:2px 8px
}

.zr .pheart{
  position:absolute;
  right:8px;
  top:8px;
  background:#fff;
  border-radius:50%;
  width:24px;
  height:24px;
  display:grid;
  place-items:center
}

.zr .pname{
  font-size:12px;
  min-height:34px;
  margin:6px 0
}

.zr .btn-zr{
  background:var(--maroon);
  border-color:var(--maroon);
  color:#fff;
  border-radius:0;
  font-size:11px;
  letter-spacing:1px
}

.zr .btn-zr:hover{
  background:var(--maroon-d);
  border-color:var(--maroon-d);
  color:#fff
}

.zr .btn-out{
  border:1px solid var(--muted);
  border-radius:0;
  font-size:11px;
  letter-spacing:1px;
  background:#fff;
  color:var(--ink)
}

.zr .section-t{
  text-align:center;
  margin:56px 0 28px
}

.zr .section-t h2{
  font-size:28px
}

.zr .section-t p{
  color:var(--muted);
  max-width:560px;
  margin:8px auto 0;
  font-size:12px
}

.zr .stack-img{
  height:160px
}

.zr .stack-card{
  border:1px solid var(--line);
  border-radius:0;
  height:100%
}

.zr .tip{
  background:var(--cream);
  border:1px solid var(--line);
  padding:14px 18px;
  display:flex;
  gap:12px;
  align-items:center;
  justify-content:space-between;
  flex-wrap:wrap;
  font-size:12px
}

.zr .review{
  border:1px solid var(--line);
  padding:16px;
  height:100%;
  font-size:12px
}

.zr .avatar{
  width:30px;
  height:30px;
  border-radius:50%;
  background:var(--cream);
  display:grid;
  place-items:center;
  font-size:11px;
  border:1px solid var(--line)
}

.zr .trust{
  text-align:center;
  padding:32px 0;
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
  font-size:12px
}

.zr .trust h6{
  font-size:13px;
  margin:8px 0 4px
}

.zr .join{
  background:var(--cream);
  padding:34px 0
}
`;

const Stars = ({ n = 5 }) => (
  <span style={{ color: "#c8962e" }}>
    {[...Array(Math.round(n))].map((_, i) => (
      <StarIcon key={i} style={{ fontSize: 13 }} />
    ))}
  </span>
);

export default function ZinoraRingsPage() {
  const [cats, setCats] = useState({
    "Cocktail Rings": true,
    "Band Rings": false,
    "Chain Pendants": true,
    "Mangalsutra Modern": false,
  });

  const [tier, setTier] = useState("199-499");
  const [size, setSize] = useState(14);

  return (
    <div className="zr">
      <style>{css}</style>

      {/* HERO */}
      <section className="hero">
        <Container>
          <Row className="align-items-center g-4">
            <Col md={7}>
              <div className="eyebrow">
                CURATED CAPSULE ATELIER
              </div>

              <h1>
                Artisanal Cocktail Rings &amp; Dainty Pendants
              </h1>

              <p
                style={{
                  maxWidth: 520,
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                Adjustable royal rings with uncut stones and
                tarnish-free layered chain pendants crafted for modern
                everyday luxury. Designed to seamlessly blur between
                boardrooms, festive galas, and intimate soirees.
              </p>

              <span className="pill">
                Adjustable Bands (Sizes 10–22)
              </span>

              <span className="pill">
                <WaterDropOutlinedIcon style={{ fontSize: 14 }} />
                Waterproof Anti-Tarnish Chains
              </span>

              <span className="pill">
                <ShieldOutlinedIcon style={{ fontSize: 14 }} />
                Hypoallergenic Brass Core
              </span>
            </Col>

            <Col md={5}>
              <div className="hero-img">
                <img
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=90"
                  alt="Gold jewelry styled in a fine jewelry editorial"
                />
                <span className="micro">
                  MICRO-PLATED 18K Pure Dipped
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        <div className="crumb">
          Home / Fine Collections /{" "}
          <b>Rings &amp; Pendants</b>
        </div>

        <Row className="g-4">

          {/* SIDEBAR */}
          <Col lg={3} className="side">
            <div className="d-flex justify-content-between">
              <b style={{ fontSize: 12 }}>
                Filter Archive
              </b>

              <a
                href="#!"
                style={{
                  fontSize: 11,
                  color: "var(--maroon)",
                }}
              >
                RESET ALL
              </a>
            </div>

            <h6>PRODUCT CATEGORY</h6>

            {Object.keys(cats).map((c) => (
              <Form.Check
                key={c}
                id={c}
                label={c}
                checked={cats[c]}
                onChange={() =>
                  setCats({
                    ...cats,
                    [c]: !cats[c],
                  })
                }
                className="mb-1"
              />
            ))}

            <h6>RING FIT TYPE</h6>

            <Form.Check
              type="radio"
              name="fit"
              defaultChecked
              label="Free-Size Adjustable Flex"
            />

            <Form.Check
              type="radio"
              name="fit"
              label="Standard Fixed Sized Bands"
            />

            <h6>PLATING &amp; POLISH</h6>

            <div className="d-flex flex-wrap gap-2">
              {[
                "18K Gold Dip",
                "24K Antique",
                "Rhodium Silver",
                "Rose Gold",
              ].map((p) => (
                <span
                  key={p}
                  className="pill"
                  style={{ margin: 0 }}
                >
                  {p}
                </span>
              ))}
            </div>

            <h6>PRICE TIERS</h6>

            {[
              ["u199", "Under ₹199 (Daily Essentials)"],
              ["199-499", "₹199 to ₹499 (Festive Signature)"],
              ["500-999", "₹500 to ₹999 (Statement Royal)"],
              ["999+", "Above ₹1,000 (Bridal Trousseau)"],
            ].map(([v, l]) => (
              <Form.Check
                key={v}
                type="checkbox"
                id={v}
                label={l}
                checked={tier === v}
                onChange={() => setTier(v)}
                className="mb-1"
              />
            ))}

            <div className="sizer">
              <div className="mb-2">
                <b>Interactive Ring Sizer</b>
              </div>

              <div
                style={{
                  fontSize: 11,
                  opacity: 0.85,
                }}
              >
                Never worry about loose fit. Our flexible
                memory bands automatically contour, or match
                your finger diameter below:
              </div>

              <div className="mt-2">
                Size Guide Target:{" "}
                <b>
                  Size {size} ({(size * 1.2).toFixed(1)} mm)
                </b>
              </div>

              <Form.Range
                min={10}
                max={22}
                value={size}
                onChange={(e) =>
                  setSize(+e.target.value)
                }
              />
            </div>

            <div className="gift">
              <CardGiftcardIcon fontSize="small" />{" "}
              <b>Pre-Packaged Gift Box</b>
              <br />
              Every ring and pendant arrives in our plush
              royal maroon velvet keepsake case with
              anti-scratch pouches.
            </div>
          </Col>

          {/* PRODUCT GRID */}
          <Col lg={9}>
            <div
              className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3"
              style={{ fontSize: 12 }}
            >
              <div>
                <span className="text-muted">
                  Applied Filters:
                </span>{" "}

                <span className="pill">
                  Cocktail Rings &amp; Pendants ×
                </span>

                <span className="pill">
                  ₹199 – ₹499 ×
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                Sort By:

                <Form.Select
                  size="sm"
                  style={{
                    width: 170,
                    borderRadius: 0,
                  }}
                >
                  <option>
                    Featured &amp; Bestsellers
                  </option>

                  <option>
                    Price: Low to High
                  </option>

                  <option>
                    Price: High to Low
                  </option>
                </Form.Select>
              </div>
            </div>

            <Row xs={2} md={4} className="g-3">
              {PRODUCTS.map((p) => (
                <Col key={p.name}>
                  <Card className="pcard">
                    <div
                      className="pimg"
                      style={{
                        background: `linear-gradient(135deg, ${p.g[0]}, ${p.g[1]})`,
                      }}
                    >
                      <img src={p.image} alt={p.name} loading="lazy" />
                      <span className="ptag">
                        {p.tag}
                      </span>

                      <span className="poff">
                        {p.off}% OFF
                      </span>
                    </div>

                    <Card.Body className="p-2">
                      <div style={{ fontSize: 11 }}>
                        <StarIcon
                          style={{
                            fontSize: 12,
                            color: "#c8962e",
                          }}
                        />{" "}
                        {p.rating} ({p.n})
                      </div>

                      <div className="pname">
                        {p.name}
                      </div>

                      <div className="mb-2">
                        <b>₹{p.price}</b>{" "}
                        <s
                          className="text-muted"
                          style={{ fontSize: 11 }}
                        >
                          ₹{p.mrp}
                        </s>
                      </div>

                      <Button
                        className="btn-zr w-100"
                        size="sm"
                      >
                        ADD TO BAG
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div
              className="text-center mt-4 p-3"
              style={{
                border: "1px solid var(--line)",
                fontSize: 12,
              }}
            >
              Showing 8 of 72 pieces in Rings &amp; Pendants

              <div className="mt-2">
                <Button
                  className="btn-out"
                  size="sm"
                >
                  LOAD MORE ROYAL DESIGNS
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* STACKING */}
        <div className="section-t">
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              color: "var(--gold)",
            }}
          >
            ZINORA ATELIER MASTERCLASS
          </div>

          <h2>
            The Art of Everyday Stacking &amp; Layering
          </h2>

          <p>
            Elevate plain neckline cuts into high-fashion
            canvases. Our modular chains and adjustable bands
            are crafted specifically to pair together without
            tangling.
          </p>
        </div>

        <Row className="g-3">
          {STACKS.map((s) => (
            <Col md={4} key={s.t}>
              <Card className="stack-card">
                <div
                  className="stack-img"
                  style={{
                    background: `linear-gradient(135deg, ${s.g[0]}, ${s.g[1]})`,
                  }}
                >
                  <img src={s.image} alt={s.s} loading="lazy" />
                </div>

                <Card.Body className="text-center">
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: 1,
                      color: "var(--gold)",
                    }}
                  >
                    {s.t.toUpperCase()}
                  </div>

                  <h3 style={{ fontSize: 16 }}>
                    {s.s}
                  </h3>

                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    {s.d}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="tip mt-3">
          <span>
            <AutoAwesomeIcon fontSize="small" />{" "}
            <b>Pro-Tip for Cocktail Rings:</b> Wear bold
            cocktail solitaires on the index or middle
            finger, balanced by minimal pavé bands on your
            ring finger.
          </span>

          <Button className="btn-zr">
            EXPLORE LAYERING SETS
          </Button>
        </div>

        {/* REVIEWS */}
        <div
          className="section-t"
          style={{ marginBottom: 20 }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.5,
              color: "var(--gold)",
            }}
          >
            VERIFIED PATRON VERDICTS
          </div>

          <p>
            Cherished by Over 28,000 Women. Real
            testimonials from customers wearing our
            tarnish-resistant rings and daily pendants
            across India.
          </p>

          <div
            className="d-flex justify-content-center gap-4 mt-3"
            style={{ fontSize: 12 }}
          >
            <span>
              <Stars n={5} />{" "}
              <b>4.9</b> Over 3,420 Verified Reviews
            </span>

            <span>
              <VerifiedIcon fontSize="small" /> Zero Skin
              Greenness · 100% Skin-Safe Brass Core
            </span>
          </div>
        </div>

        <Row className="g-3">
          {REVIEWS.map((r) => (
            <Col md={4} key={r.n}>
              <div className="review">
                <div className="d-flex justify-content-between">
                  <Stars n={5} />

                  <small className="text-muted">
                    Verified Buyer
                  </small>
                </div>

                <p className="mt-2">
                  {r.t}
                </p>

                <div className="d-flex align-items-center gap-2">
                  <span className="avatar">
                    {r.i}
                  </span>

                  <small>
                    <b>{r.n}</b>
                    <br />
                    {r.c} · Purchased {r.p}
                  </small>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* TRUST */}
      <Container className="mt-5">
        <Row className="trust g-3">
          {[
            [
              DiamondOutlinedIcon,
              "100% Skin Safe Brass & Copper",
              "Hypoallergenic, nickel-free compositions crafted for sensitive skin.",
            ],
            [
              WorkspacePremiumOutlinedIcon,
              "1-Year Polish Warranty",
              "Guaranteed micro-gold and rhodium plating longevity with care.",
            ],
            [
              HandymanOutlinedIcon,
              "Handcrafted by Indian Karigars",
              "Sustaining generational craft and artisans across Jaipur, Rajkot, and Kolkata.",
            ],
          ].map(([Ic, t, d]) => (
            <Col md={4} key={t}>
              <Ic
                style={{
                  color: "var(--gold)",
                }}
              />

              <h6>{t}</h6>

              <div className="text-muted">
                {d}
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* JOIN */}
      <section className="join mt-4">
        <Container>
          <Row className="align-items-center g-3">
            <Col md={6}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: "var(--gold)",
                }}
              >
                EXCLUSIVE ROYAL PRIVILEGES
              </div>

              <h3>Join The Zinora Atelier</h3>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                Sign up to receive private festive
                collection previews and enjoy instant 15%
                off your maiden order.
              </div>
            </Col>

            <Col md={6}>
              <div className="d-flex gap-2">
                <Form.Control
                  placeholder="Enter your mobile number or email address"
                  style={{
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                />

                <Button className="btn-zr text-nowrap">
                  CLAIM 15% OFF
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}