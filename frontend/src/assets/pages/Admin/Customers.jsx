
import React, { useState } from "react";

const initialCustomers = [
  {
    id: "CUS001",
    name: "Priya Patil",
    email: "priya@example.com",
    phone: "9876543210",
    joined: "12 Oct 2026",
    orders: 5,
    spent: 2450,
    status: "Active",
  },
  {
    id: "CUS002",
    name: "Sneha Sharma",
    email: "sneha@example.com",
    phone: "9876501234",
    joined: "10 Oct 2026",
    orders: 3,
    spent: 1599,
    status: "Active",
  },
  {
    id: "CUS003",
    name: "Neha Jadhav",
    email: "neha@example.com",
    phone: "9876512345",
    joined: "08 Oct 2026",
    orders: 0,
    spent: 0,
    status: "Active",
  },
  {
    id: "CUS004",
    name: "Aditi Kulkarni",
    email: "aditi@example.com",
    phone: "9876523456",
    joined: "05 Oct 2026",
    orders: 2,
    spent: 1199,
    status: "Blocked",
  },
];

const styles = `
.customers-page {
  padding: 28px;
  background: #faf9f7;
  min-height: 100%;
  color: #342020;
  font-family: inherit;
  box-sizing: border-box;
}
.customers-page * { box-sizing: border-box; }

.customers-page .heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.customers-page h1 {
  margin: 0;
  font-size: 30px;
  color: #651f2b;
  font-weight: 700;
}
.customers-page .subtitle {
  margin: 8px 0 0;
  color: #827775;
  font-size: 13px;
}
.customers-page .eyebrow {
  color: #8a3542;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin: 0 0 8px;
}
.customers-page button,
.customers-page input,
.customers-page select {
  font: inherit;
}
.customers-page button { cursor: pointer; }

.customers-page .export-btn {
  background: #681f2c;
  color: white;
  border: none;
  padding: 11px 17px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
}
.customers-page .export-btn:hover { background: #4e1721; }

.customers-page .stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 25px;
}
.customers-page .stat-card {
  background: white;
  border: 1px solid #eee6e4;
  border-radius: 11px;
  padding: 19px;
  display: flex;
  align-items: center;
  gap: 13px;
  box-shadow: 0 3px 12px #48182008;
}
.customers-page .stat-icon {
  width: 43px;
  height: 43px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
  background: #f5e9eb;
  color: #762735;
}
.customers-page .stat-icon.green {
  color: #278054;
  background: #e7f5ec;
}
.customers-page .stat-icon.gold {
  color: #98702b;
  background: #faf1df;
}
.customers-page .stat-label {
  margin: 0 0 8px;
  color: #827775;
  font-size: 12px;
}
.customers-page .stat-number {
  margin: 0;
  font-size: 23px;
  font-weight: 700;
  color: #651f2b;
  overflow-wrap: anywhere;
}
.customers-page .stat-note {
  display: block;
  margin-top: 5px;
  font-size: 10px;
  color: #99908c;
}

.customers-page .panel {
  background: white;
  border: 1px solid #eee6e4;
  border-radius: 11px;
  overflow: hidden;
}
.customers-page .panel-heading {
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.customers-page .panel-heading h2 {
  color: #651f2b;
  font-size: 19px;
  margin: 0;
}
.customers-page .panel-heading p {
  color: #8b817f;
  font-size: 12px;
  margin: 7px 0 0;
}
.customers-page .count {
  padding: 7px 11px;
  background: #f5e9eb;
  color: #702532;
  border-radius: 20px;
  font-size: 11px;
  white-space: nowrap;
}
.customers-page .toolbar {
  padding: 0 22px 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.customers-page .search {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: 1;
  min-width: 180px;
  border: 1px solid #e9e1df;
  border-radius: 7px;
  padding: 0 12px;
}
.customers-page .search span {
  color: #8a3542;
  font-size: 19px;
}
.customers-page .search input {
  height: 40px;
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  color: #342020;
  background: transparent;
  font-size: 12px;
}
.customers-page .filter,
.customers-page .reset-btn {
  border: 1px solid #e9e1df;
  border-radius: 7px;
  background: white;
  color: #5d4848;
  padding: 0 12px;
  min-height: 40px;
  font-size: 12px;
}
.customers-page .reset-btn:hover { background: #f8f1f1; }

.customers-page .table-wrap { overflow-x: auto; }
.customers-page table {
  border-collapse: collapse;
  width: 100%;
  text-align: left;
  white-space: nowrap;
}
.customers-page thead { background: #f8f3f2; }
.customers-page th {
  padding: 14px;
  color: #796665;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .4px;
  border-top: 1px solid #eee6e4;
  border-bottom: 1px solid #eee6e4;
}
.customers-page td {
  padding: 14px;
  color: #665654;
  font-size: 11px;
  border-bottom: 1px solid #f0eae8;
}
.customers-page tbody tr:hover { background: #fdfafa; }
.customers-page .person {
  display: flex;
  align-items: center;
  gap: 10px;
}
.customers-page .avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 37px;
  height: 37px;
  border-radius: 50%;
  background: #f4e5e8;
  color: #742633;
  font-weight: 700;
  font-size: 14px;
}
.customers-page .person-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.customers-page .person-info strong {
  color: #392728;
  font-size: 12px;
}
.customers-page .person-info span {
  color: #958886;
  font-size: 10px;
}
.customers-page .purchase {
  color: #651f2b;
  font-weight: 700;
}
.customers-page .status {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}
.customers-page .active {
  background: #e6f5eb;
  color: #24794a;
}
.customers-page .blocked {
  background: #f9e8e8;
  color: #b13d46;
}
.customers-page .actions {
  display: flex;
  gap: 7px;
  align-items: center;
}
.customers-page .view-btn {
  background: white;
  border: 1px solid #d9b8be;
  color: #702532;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 11px;
}
.customers-page .view-btn:hover { background: #f8eeee; }
.customers-page .status-btn {
  border: 1px solid #e9e1df;
  background: white;
  border-radius: 6px;
  padding: 6px 9px;
  color: #702532;
}
.customers-page .empty {
  text-align: center;
  padding: 35px;
  white-space: normal;
}
.customers-page .empty h3 { color: #651f2b; }
.customers-page .empty p { color: #887c7a; font-size: 12px; }

.customers-page .pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 22px;
  color: #887c7a;
  font-size: 11px;
}
.customers-page .page-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.customers-page .page-controls button {
  border: 1px solid #e9e1df;
  background: white;
  color: #651f2b;
  border-radius: 6px;
  padding: 8px 11px;
  font-size: 11px;
}
.customers-page .page-controls button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.customers-page .overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  padding: 20px;
  background: #21131680;
  display: flex;
  align-items: center;
  justify-content: center;
}
.customers-page .modal {
  background: white;
  width: 100%;
  max-width: 570px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 13px;
  padding: 25px;
  box-shadow: 0 20px 60px #0002;
}
.customers-page .modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.customers-page .modal-head h2 {
  color: #651f2b;
  font-size: 21px;
  margin: 0;
}
.customers-page .close-btn {
  background: white;
  border: 1px solid #eee2e2;
  border-radius: 7px;
  color: #651f2b;
  font-size: 23px;
  width: 33px;
  height: 33px;
}
.customers-page .profile {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px;
  background: #faf4f4;
  border-radius: 9px;
  margin: 22px 0;
}
.customers-page .profile .avatar {
  width: 51px;
  height: 51px;
  font-size: 19px;
}
.customers-page .profile h3 {
  margin: 0 0 5px;
  color: #392728;
  font-size: 16px;
}
.customers-page .profile p {
  margin: 0 0 8px;
  font-size: 11px;
  color: #897b79;
}
.customers-page .details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.customers-page .detail {
  min-width: 0;
  border: 1px solid #eee6e4;
  padding: 12px;
  border-radius: 7px;
}
.customers-page .detail span {
  display: block;
  color: #897b79;
  font-size: 10px;
  margin-bottom: 7px;
}
.customers-page .detail strong {
  display: block;
  color: #493536;
  font-size: 12px;
  overflow-wrap: anywhere;
}
.customers-page .history-title {
  margin: 24px 0 12px;
  font-size: 15px;
  color: #651f2b;
}
.customers-page .order-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0eae8;
}
.customers-page .order-row strong {
  color: #493536;
  font-size: 12px;
}
.customers-page .order-row span {
  display: block;
  margin-top: 5px;
  color: #897b79;
  font-size: 11px;
}
.customers-page .order-right { text-align: right; }
.customers-page .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
  padding-top: 17px;
  border-top: 1px solid #eee6e4;
}
.customers-page .block-btn,
.customers-page .unblock-btn {
  border: none;
  color: white;
  border-radius: 7px;
  padding: 10px 13px;
  font-size: 12px;
}
.customers-page .block-btn { background: #b53e49; }
.customers-page .unblock-btn { background: #278054; }

@media (max-width: 1100px) {
  .customers-page .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 650px) {
  .customers-page { padding: 15px; }
  .customers-page .heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .customers-page .stats { gap: 10px; }
  .customers-page .stat-card { padding: 12px; gap: 9px; }
  .customers-page .stat-icon { width: 34px; height: 34px; }
  .customers-page .stat-number { font-size: 18px; }
  .customers-page .toolbar { padding: 0 13px 15px; }
  .customers-page .search { flex-basis: 100%; }
  .customers-page .panel-heading { padding: 17px 13px; }
  .customers-page .pagination {
    align-items: flex-start;
    flex-direction: column;
    padding: 15px;
  }
  .customers-page .page-controls { width: 100%; justify-content: space-between; }
  .customers-page .details-grid { grid-template-columns: 1fr; }
  .customers-page .modal { padding: 17px; }
}
@media (max-width: 370px) {
  .customers-page .stats { grid-template-columns: 1fr; }
}
`;

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    const matches =
      [c.id, c.name, c.email, c.phone].some((v) =>
        v.toLowerCase().includes(q)
      );
    return matches && (filter === "All" || c.status === filter);
  });

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const active = customers.filter((c) => c.status === "Active").length;
  const blocked = customers.filter((c) => c.status === "Blocked").length;
  const spent = customers.reduce((sum, c) => sum + c.spent, 0);

  const money = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const toggleStatus = (customer) => {
    const next = customer.status === "Active" ? "Blocked" : "Active";
    if (!window.confirm(`${next} status set for ${customer.name}?`)) return;

    setCustomers((old) =>
      old.map((c) => c.id === customer.id ? { ...c, status: next } : c)
    );
    setSelected((old) =>
      old?.id === customer.id ? { ...old, status: next } : old
    );
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Name", "Email", "Phone", "Joined", "Orders", "Purchase", "Status"],
      ...filtered.map((c) => [
        c.id, c.name, c.email, c.phone, c.joined, c.orders, c.spent, c.status
      ])
    ];
    const csv = rows.map((r) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "zinora-customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="customers-page">
      <style>{styles}</style>

      <div className="heading">
        <div>
          <h1>Customers Management</h1>
          <p className="subtitle">
            Manage customer profiles, accounts and purchase activity.
          </p>
        </div>
        <button className="export-btn" onClick={exportCSV}>
          ↓ &nbsp; Export CSV
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-icon">♙</div>
          <div>
            <p className="stat-label">Total Customers</p>
            <h2 className="stat-number">{customers.length}</h2>
            <span className="stat-note">Registered accounts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✓</div>
          <div>
            <p className="stat-label">Active Customers</p>
            <h2 className="stat-number">{active}</h2>
            <span className="stat-note">Active accounts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon gold">⊘</div>
          <div>
            <p className="stat-label">Blocked Customers</p>
            <h2 className="stat-number">{blocked}</h2>
            <span className="stat-note">Restricted accounts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">₹</div>
          <div>
            <p className="stat-label">Total Purchases</p>
            <h2 className="stat-number">{money(spent)}</h2>
            <span className="stat-note">Across listed customers</span>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>All Customers</h2>
            <p>Customer accounts and shopping activity</p>
          </div>
          <span className="count">{filtered.length} customer</span>
        </div>

        <div className="toolbar">
          <div className="search">
            <span>⌕</span>
            <input
              value={search}
              placeholder="Search name, email, phone or ID..."
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
          <button
            className="reset-btn"
            onClick={() => {
              setSearch("");
              setFilter("All");
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>ID</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Purchase</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="person">
                      <div className="avatar">{c.name.charAt(0)}</div>
                      <div className="person-info">
                        <strong>{c.name}</strong>
                        <span>{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{c.id}</td>
                  <td>{c.phone}</td>
                  <td>{c.joined}</td>
                  <td>{c.orders}</td>
                  <td className="purchase">{money(c.spent)}</td>
                  <td>
                    <span className={`status ${c.status === "Active" ? "active" : "blocked"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="view-btn" onClick={() => setSelected(c)}>
                        View
                      </button>
                      <button className="status-btn" onClick={() => toggleStatus(c)}>
                        {c.status === "Active" ? "⊘" : "✓"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan="8">
                    <div className="empty">
                      <h3>No customers found</h3>
                      <p>Try another search or status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="page-controls">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>{page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}>
          <section className="modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <div>
                <p className="eyebrow">CUSTOMER PROFILE</p>
                <h2>Customer Details</h2>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="profile">
              <div className="avatar">{selected.name.charAt(0)}</div>
              <div>
                <h3>{selected.name}</h3>
                <p>{selected.id}</p>
                <span className={`status ${selected.status === "Active" ? "active" : "blocked"}`}>
                  {selected.status}
                </span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail"><span>Email</span><strong>{selected.email}</strong></div>
              <div className="detail"><span>Mobile</span><strong>{selected.phone}</strong></div>
              <div className="detail"><span>Joined Date</span><strong>{selected.joined}</strong></div>
              <div className="detail"><span>Total Orders</span><strong>{selected.orders}</strong></div>
              <div className="detail"><span>Total Purchase</span><strong>{money(selected.spent)}</strong></div>
              <div className="detail"><span>Account Status</span><strong>{selected.status}</strong></div>
            </div>

            <h3 className="history-title">Order Summary</h3>
            <div className="order-row">
              <div>
                <strong>Total Orders</strong>
                <span>Orders placed by customer</span>
              </div>
              <div className="order-right">
                <strong>{selected.orders}</strong>
                <span>{money(selected.spent)} total</span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="reset-btn" onClick={() => setSelected(null)}>
                Close
              </button>
              <button
                className={selected.status === "Active" ? "block-btn" : "unblock-btn"}
                onClick={() => toggleStatus(selected)}
              >
                {selected.status === "Active" ? "Block Customer" : "Unblock Customer"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}