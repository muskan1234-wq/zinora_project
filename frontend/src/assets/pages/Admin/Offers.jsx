/*
  ShopEase Admin – Coupons & Offers page
  Place at: src/pages/admin/CouponsOffers.jsx
  Route:    <Route path="/admin/coupons" element={<CouponsOffers />} />

  Needs (already in your stack except MUI icons):
    npm i @mui/icons-material @mui/material @emotion/react @emotion/styled

  Backend endpoints expected (Express):
    GET    /api/coupons
    POST   /api/coupons
    PUT    /api/coupons/:id        (also used for enable/disable)
    DELETE /api/coupons/:id
  If the API is unreachable, the page falls back to demo data so you can see the UI.
*/
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Container, Row, Col, Card, Table, Button, Form, Modal, Badge,
  InputGroup, ProgressBar, Alert, Spinner,
} from "react-bootstrap";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const day = (offset) => new Date(Date.now() + offset * 864e5).toISOString().slice(0, 10);
const DEMO = [
  { _id: "1", code: "WELCOME10", description: "10% off for first-time customers", discountType: "percentage", discountValue: 10, minOrderAmount: 499, maxDiscount: 150, usageLimit: 500, usedCount: 212, startDate: day(-20), endDate: day(40), isActive: true },
  { _id: "2", code: "FLAT200", description: "Flat ₹200 off on orders above ₹1999", discountType: "flat", discountValue: 200, minOrderAmount: 1999, maxDiscount: 0, usageLimit: 200, usedCount: 198, startDate: day(-10), endDate: day(5), isActive: true },
  { _id: "3", code: "DIWALI25", description: "Festive sale – 25% off", discountType: "percentage", discountValue: 25, minOrderAmount: 999, maxDiscount: 500, usageLimit: 1000, usedCount: 0, startDate: day(12), endDate: day(30), isActive: true },
  { _id: "4", code: "SUMMER15", description: "Summer clearance", discountType: "percentage", discountValue: 15, minOrderAmount: 0, maxDiscount: 300, usageLimit: 300, usedCount: 287, startDate: day(-90), endDate: day(-30), isActive: true },
  { _id: "5", code: "VIP50", description: "Loyal customer reward", discountType: "flat", discountValue: 50, minOrderAmount: 299, maxDiscount: 0, usageLimit: 100, usedCount: 41, startDate: day(-5), endDate: day(60), isActive: false },
];

const EMPTY = {
  code: "", description: "", discountType: "percentage", discountValue: "",
  minOrderAmount: 0, maxDiscount: 0, usageLimit: 100, startDate: day(0), endDate: day(30), isActive: true,
};

const getStatus = (c) => {
  const now = Date.now();
  if (!c.isActive) return "Disabled";
  if (new Date(c.endDate).getTime() + 864e5 < now || c.usedCount >= c.usageLimit) return "Expired";
  if (new Date(c.startDate).getTime() > now) return "Scheduled";
  return "Active";
};
const STATUS_BG = { Active: "success", Scheduled: "info", Expired: "secondary", Disabled: "warning" };
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtValue = (c) => (c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`);

export default function CouponsOffers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const [alert, setAlert] = useState(null);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [typeF, setTypeF] = useState("All");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [copied, setCopied] = useState("");

  const notify = (variant, msg) => {
    setAlert({ variant, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupons");
      setCoupons(Array.isArray(data) ? data : data.coupons || []);
      setDemo(false);
    } catch {
      setCoupons(DEMO);
      setDemo(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const s = { total: coupons.length, active: 0, expired: 0, redeemed: 0 };
    coupons.forEach((c) => {
      const st = getStatus(c);
      if (st === "Active") s.active++;
      if (st === "Expired") s.expired++;
      s.redeemed += c.usedCount || 0;
    });
    return s;
  }, [coupons]);

  const rows = useMemo(
    () =>
      coupons.filter((c) => {
        const text = `${c.code} ${c.description}`.toLowerCase();
        return (
          text.includes(q.toLowerCase()) &&
          (statusF === "All" || getStatus(c) === statusF) &&
          (typeF === "All" || c.discountType === typeF)
        );
      }),
    [coupons, q, statusF, typeF]
  );

  const openCreate = () => { setForm(EMPTY); setEditId(null); setErrors({}); setShow(true); };
  const openEdit = (c) => {
    setForm({ ...c, startDate: c.startDate.slice(0, 10), endDate: c.endDate.slice(0, 10) });
    setEditId(c._id); setErrors({}); setShow(true);
  };
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    setField("code", Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };

  const validate = () => {
    const e = {};
    if (!/^[A-Z0-9]{4,16}$/.test(form.code)) e.code = "4–16 characters, capital letters and numbers only";
    const v = Number(form.discountValue);
    if (!v || v <= 0) e.discountValue = "Enter a value greater than 0";
    if (form.discountType === "percentage" && v > 100) e.discountValue = "Percentage cannot exceed 100";
    if (Number(form.usageLimit) < 1) e.usageLimit = "Must be at least 1";
    if (new Date(form.endDate) < new Date(form.startDate)) e.endDate = "End date must be after start date";
    const dup = coupons.some((c) => c.code === form.code && c._id !== editId);
    if (dup) e.code = "This code already exists";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      usageLimit: Number(form.usageLimit),
    };
    try {
      if (demo) {
        setCoupons((list) =>
          editId
            ? list.map((c) => (c._id === editId ? { ...c, ...payload } : c))
            : [{ ...payload, _id: String(Date.now()), usedCount: 0 }, ...list]
        );
      } else if (editId) {
        const { data } = await api.put(`/coupons/${editId}`, payload);
        setCoupons((list) => list.map((c) => (c._id === editId ? data.coupon || data : c)));
      } else {
        const { data } = await api.post("/coupons", payload);
        setCoupons((list) => [data.coupon || data, ...list]);
      }
      notify("success", editId ? "Coupon updated" : "Coupon created");
      setShow(false);
    } catch (err) {
      notify("danger", err.response?.data?.message || "Could not save coupon");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c) => {
    const next = { ...c, isActive: !c.isActive };
    setCoupons((list) => list.map((x) => (x._id === c._id ? next : x)));
    if (demo) return;
    try {
      await api.put(`/coupons/${c._id}`, { isActive: next.isActive });
    } catch {
      setCoupons((list) => list.map((x) => (x._id === c._id ? c : x)));
      notify("danger", "Could not update status");
    }
  };

  const confirmDelete = async () => {
    const id = delTarget._id;
    try {
      if (!demo) await api.delete(`/coupons/${id}`);
      setCoupons((list) => list.filter((c) => c._id !== id));
      notify("success", "Coupon deleted");
    } catch {
      notify("danger", "Could not delete coupon");
    }
    setDelTarget(null);
  };

  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 1500);
  };

  const StatCard = ({ icon, label, value, tone }) => (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className={`rounded-3 p-3 bg-${tone} bg-opacity-10 text-${tone} d-flex`}>{icon}</div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-semibold">{value}</div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4 px-md-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h4 className="mb-1 d-flex align-items-center gap-2">
            <LocalOfferOutlinedIcon /> Coupons &amp; Offers
          </h4>
          <div className="text-muted small">Create and manage discount codes for your store.</div>
        </div>
        <Button variant="primary" onClick={openCreate} className="d-flex align-items-center gap-1">
          <AddIcon fontSize="small" /> New coupon
        </Button>
      </div>

      {alert && <Alert variant={alert.variant} className="py-2">{alert.msg}</Alert>}
      {demo && (
        <Alert variant="warning" className="py-2 small">
          Could not reach the API, so demo data is shown. Changes here won't be saved.
        </Alert>
      )}

      {/* Stats */}
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}><StatCard tone="primary" icon={<ConfirmationNumberOutlinedIcon />} label="Total coupons" value={stats.total} /></Col>
        <Col sm={6} xl={3}><StatCard tone="success" icon={<CheckCircleOutlineIcon />} label="Active now" value={stats.active} /></Col>
        <Col sm={6} xl={3}><StatCard tone="secondary" icon={<EventBusyOutlinedIcon />} label="Expired / used up" value={stats.expired} /></Col>
        <Col sm={6} xl={3}><StatCard tone="info" icon={<TrendingUpIcon />} label="Total redemptions" value={stats.redeemed} /></Col>
      </Row>

      {/* Filters + table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-white"><SearchIcon fontSize="small" /></InputGroup.Text>
                <Form.Control placeholder="Search by code or description" value={q} onChange={(e) => setQ(e.target.value)} />
              </InputGroup>
            </Col>
            <Col xs={6} md={3}>
              <Form.Select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
                {["All", "Active", "Scheduled", "Expired", "Disabled"].map((s) => <option key={s}>{s}</option>)}
              </Form.Select>
            </Col>
            <Col xs={6} md={3}>
              <Form.Select value={typeF} onChange={(e) => setTypeF(e.target.value)}>
                <option value="All">All types</option>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat amount</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" size="sm" /> Loading coupons…</div>
          ) : rows.length === 0 ? (
            <div className="text-center text-muted py-5">
              No coupons match your filters. <Button variant="link" onClick={openCreate}>Create one</Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Code</th><th>Discount</th><th>Min. order</th><th style={{ minWidth: 150 }}>Usage</th>
                    <th>Validity</th><th>Status</th><th>Enabled</th><th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => {
                    const st = getStatus(c);
                    const pct = Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100));
                    return (
                      <tr key={c._id}>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <code className="fw-semibold fs-6">{c.code}</code>
                            <Button variant="link" size="sm" className="p-0 text-muted" onClick={() => copy(c.code)} title="Copy code">
                              {copied === c.code ? <CheckCircleOutlineIcon fontSize="inherit" color="success" /> : <ContentCopyIcon fontSize="inherit" />}
                            </Button>
                          </div>
                          <div className="text-muted small">{c.description}</div>
                        </td>
                        <td>
                          <b>{fmtValue(c)}</b>
                          {c.discountType === "percentage" && c.maxDiscount > 0 && <div className="text-muted small">up to ₹{c.maxDiscount}</div>}
                        </td>
                        <td>{c.minOrderAmount ? `₹${c.minOrderAmount}` : "None"}</td>
                        <td>
                          <div className="small mb-1">{c.usedCount} / {c.usageLimit}</div>
                          <ProgressBar now={pct} variant={pct >= 90 ? "danger" : "primary"} style={{ height: 6 }} />
                        </td>
                        <td className="small">{fmtDate(c.startDate)}<br />to {fmtDate(c.endDate)}</td>
                        <td><Badge bg={STATUS_BG[st]}>{st}</Badge></td>
                        <td>
                          <Form.Check type="switch" id={`sw-${c._id}`} checked={c.isActive} onChange={() => toggle(c)} />
                        </td>
                        <td className="text-end text-nowrap">
                          <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => openEdit(c)} title="Edit"><EditOutlinedIcon fontSize="small" /></Button>
                          <Button variant="outline-danger" size="sm" onClick={() => setDelTarget(c)} title="Delete"><DeleteOutlineIcon fontSize="small" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create / edit modal */}
      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">{editId ? "Edit coupon" : "New coupon"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>Coupon code</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  value={form.code}
                  onChange={(e) => setField("code", e.target.value.toUpperCase().replace(/\s/g, ""))}
                  isInvalid={!!errors.code} placeholder="e.g. SAVE20" maxLength={16}
                />
                <Button variant="outline-secondary" onClick={generateCode} title="Generate"><AutorenewIcon fontSize="small" /></Button>
                <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Label>Description</Form.Label>
              <Form.Control value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Shown to admins only" />
            </Col>

            <Col md={4}>
              <Form.Label>Discount type</Form.Label>
              <Form.Select value={form.discountType} onChange={(e) => setField("discountType", e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat amount (₹)</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Discount value</Form.Label>
              <Form.Control type="number" min={0} value={form.discountValue} onChange={(e) => setField("discountValue", e.target.value)} isInvalid={!!errors.discountValue} />
              <Form.Control.Feedback type="invalid">{errors.discountValue}</Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Max discount (₹)</Form.Label>
              <Form.Control type="number" min={0} disabled={form.discountType === "flat"} value={form.discountType === "flat" ? 0 : form.maxDiscount} onChange={(e) => setField("maxDiscount", e.target.value)} />
              <Form.Text>0 means no cap</Form.Text>
            </Col>

            <Col md={4}>
              <Form.Label>Minimum order (₹)</Form.Label>
              <Form.Control type="number" min={0} value={form.minOrderAmount} onChange={(e) => setField("minOrderAmount", e.target.value)} />
            </Col>
            <Col md={4}>
              <Form.Label>Total usage limit</Form.Label>
              <Form.Control type="number" min={1} value={form.usageLimit} onChange={(e) => setField("usageLimit", e.target.value)} isInvalid={!!errors.usageLimit} />
              <Form.Control.Feedback type="invalid">{errors.usageLimit}</Form.Control.Feedback>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Form.Check type="switch" id="isActive" label="Enabled" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} />
            </Col>

            <Col md={6}>
              <Form.Label>Start date</Form.Label>
              <Form.Control type="date" value={form.startDate} onChange={(e) => setField("startDate", e.target.value)} />
            </Col>
            <Col md={6}>
              <Form.Label>End date</Form.Label>
              <Form.Control type="date" value={form.endDate} onChange={(e) => setField("endDate", e.target.value)} isInvalid={!!errors.endDate} />
              <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : editId ? "Save changes" : "Create coupon"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirmation */}
      <Modal show={!!delTarget} onHide={() => setDelTarget(null)} centered size="sm">
        <Modal.Header closeButton><Modal.Title className="fs-6">Delete coupon</Modal.Title></Modal.Header>
        <Modal.Body>Delete <b>{delTarget?.code}</b>? This cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setDelTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
