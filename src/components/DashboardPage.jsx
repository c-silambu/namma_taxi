import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { getStyles, gold } from "../utils/styles";
import { api } from "../utils/api";
import AdminTable from "./AdminTable";
import DriverForm from "./DriverForm";
import CarForm from "./CarForm";

export default function DashboardPage({ session, setPage, showToast }) {
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({ drivers: [], cars: [], trips: [] });
  const [loading, setLoading] = useState(true);
  const [driverForm, setDriverForm] = useState(null);
  const [carForm, setCarForm] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const styles = getStyles(isDark);

  const sidebarBg = isDark ? "#0b0e17" : "#ffffff";
  const border = isDark ? "#1a1f2e" : "#e5e2d9";
  const text = isDark ? "#fff" : "#111";
  const sub = isDark ? "#888" : "#666";

  const loadData = useCallback(async () => {
    try {
      const [drivers, cars, trips] = await Promise.all([
        api.get("/api/drivers"),
        api.get("/api/cars"),
        api.get("/api/trips"),
      ]);
      setData({ drivers, cars, trips });
    } catch {
      showToast("Could not load data", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!session?.admin_logged_in) { setPage("login"); return; }
    loadData();
  }, []);

  const deleteDriver = async (id) => {
    if (!confirm("Delete this driver?")) return;
    await api.del(`/api/drivers/${id}`);
    showToast("Driver deleted", "success");
    loadData();
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car?")) return;
    await api.del(`/api/cars/${id}`);
    showToast("Car deleted", "success");
    loadData();
  };

  const saveDriver = async () => {
    const res = driverForm.id
      ? await api.put(`/api/drivers/${driverForm.id}`, driverForm)
      : await api.post("/api/drivers", driverForm);
    if (res.success) {
      showToast("Driver saved!", "success");
      setDriverForm(null);
      loadData();
    } else showToast(res.message || "Failed", "error");
  };

  const saveCar = async () => {
    const res = carForm.id
      ? await api.put(`/api/cars/${carForm.id}`, carForm)
      : await api.post("/api/cars", carForm);
    if (res.success) {
      showToast("Car saved!", "success");
      setCarForm(null);
      loadData();
    } else showToast(res.message || "Failed", "error");
  };

  if (!session?.admin_logged_in) return null;
  if (loading) return <div style={styles.loader}>Loading dashboard...</div>;

  const totalFare = data.trips.reduce((s, t) => s + (t.total_fare || 0), 0);

  const tabs = [
    { key: "overview", icon: "📊", label: "Overview" },
    { key: "drivers", icon: "👤", label: `Drivers (${data.drivers.length})` },
    { key: "cars", icon: "🚗", label: `Cars (${data.cars.length})` },
    { key: "trips", icon: "🛣️", label: `Trips (${data.trips.length})` },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.navLogo}>NT</div>
          <div style={{ color: text, fontWeight: 700, fontSize: 13 }}>Admin Panel</div>
        </div>
        <button onClick={() => setSideOpen(false)} className="sidebar-close-btn" style={{
          background: "none", border: "none", color: sub, fontSize: 20, cursor: "pointer"
        }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: "12px 10px" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              background: tab === t.key ? `${gold}18` : "none",
              color: tab === t.key ? gold : sub,
              fontWeight: tab === t.key ? 700 : 500,
              fontSize: 14, textAlign: "left", marginBottom: 4,
              fontFamily: "'Sora', sans-serif",
              borderLeft: tab === t.key ? `3px solid ${gold}` : "3px solid transparent",
            }}
            onClick={() => { setTab(t.key); setSideOpen(false); }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 10px", borderTop: `1px solid ${border}` }}>
        <button style={{ ...styles.sideBtn, display: "flex", alignItems: "center", gap: 8 }} onClick={toggleTheme}>
          {isDark ? "☀️" : "🌙"} {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button style={styles.sideBtn} onClick={() => setPage("home")}>🏠 Home</button>
        <button style={styles.sideBtnLogout} onClick={() => setPage("login")}>🚪 Logout</button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: isDark ? "#090b12" : "#fff8f5", fontFamily: "'Sora', sans-serif" }}>

      {/* Mobile overlay */}
      {sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 200, backdropFilter: "blur(2px)"
        }} />
      )}

      {/* Sidebar */}
      <div style={{
        width: 240, background: sidebarBg, borderRight: `1px solid ${border}`,
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 300,
        transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
        overflowY: "auto",
      }} className={`admin-sidebar${sideOpen ? " open" : ""}`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240, minHeight: "100vh", minWidth: 0 }} className="dash-content">

        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: sidebarBg, borderBottom: `1px solid ${border}`,
          padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="admin-ham" onClick={() => setSideOpen(true)} style={{
              background: "none", border: "none",
              color: text, fontSize: 22, cursor: "pointer", padding: 0,
            }}>☰</button>
            <div style={{ color: text, fontWeight: 700, fontSize: 16 }}>
              {tabs.find(t => t.key === tab)?.icon} {tabs.find(t => t.key === tab)?.label}
            </div>
          </div>
          <span style={{ color: sub, fontSize: 12 }}>Admin</span>
        </div>

        <div style={{ padding: "24px 20px" }}>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <h2 style={{ ...styles.dashTitle, fontSize: "clamp(16px, 4vw, 24px)", marginBottom: 16 }}>Dashboard Overview</h2>
              <div className="overview-stats-grid">
                {[
                  { label: "Total Drivers", value: data.drivers.length, icon: "👤", color: "#6366f1" },
                  { label: "Total Cars", value: data.cars.length, icon: "🚗", color: "#f59e0b" },
                  { label: "Total Trips", value: data.trips.length, icon: "🛣️", color: "#22c55e" },
                  { label: "Total Revenue", value: `₹${totalFare.toFixed(0)}`, icon: "💰", color: "#ef4444" },
                ].map((s) => (
                  <div key={s.label} style={{ ...styles.statCard, borderLeft: `4px solid ${s.color}`, padding: "14px 16px", gap: 12, minWidth: 0, overflow: "hidden" }}>
                    <div style={{ fontSize: 26, flexShrink: 0 }}>{s.icon}</div>
                    <div style={{ minWidth: 0, overflow: "hidden" }}>
                      <div style={{ ...styles.statCardNum, fontSize: "clamp(15px, 3.5vw, 26px)", overflowWrap: "break-word", wordBreak: "break-all" }}>{s.value}</div>
                      <div style={{ ...styles.statCardLabel, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <h3 style={{ ...styles.dashSubtitle, fontSize: "clamp(14px, 3.5vw, 18px)", marginBottom: 12 }}>Recent Trips</h3>
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <AdminTable
                    cols={["Customer", "Driver", "Car", "Date", "Fare"]}
                    rows={data.trips.slice(-5).reverse().map((t) => [
                      t.customer_name, t.driver_name || "—",
                      `${t.car_make || ""} ${t.car_model || ""}`,
                      t.trip_date, `₹${t.total_fare?.toFixed(0)}`,
                    ])}
                  />
                </div>
              </div>
            </>
          )}

          {/* DRIVERS */}
          {tab === "drivers" && (
            <>
              <div className="dash-tab-header">
                <h2 style={styles.dashTitle}>Drivers</h2>
                <button style={styles.heroCta} className="dash-add-btn" onClick={() => setDriverForm({
                  name: "", age: "", phone: "", email: "", license: "", expiry: "", address: "", notes: ""
                })}>+ Add Driver</button>
              </div>
              {driverForm && (
                <DriverForm form={driverForm} setForm={setDriverForm} onSave={saveDriver} onCancel={() => setDriverForm(null)} />
              )}
              <div className="dash-mobile-cards">
                {data.drivers.map((d) => (
                  <div key={d.id} style={{ background: styles.darkCard, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>{d.name}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={styles.editBtn} onClick={() => setDriverForm({ ...d })}>Edit</button>
                        <button style={styles.delBtn} onClick={() => deleteDriver(d.id)}>Delete</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 13, color: sub }}>
                      <span>📞 {d.phone}</span>
                      <span>🎂 Age: {d.age}</span>
                      <span style={{ gridColumn: "1/-1" }}>✉️ {d.email}</span>
                      <span style={{ gridColumn: "1/-1" }}>🪪 {d.license}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dash-desktop-table" style={{ overflowX: "auto" }}>
                <AdminTable
                  cols={["Name", "Age", "Phone", "Email", "License", "Actions"]}
                  rows={data.drivers.map((d) => [
                    d.name, d.age, d.phone, d.email, d.license,
                    <div key={d.id} style={{ display: "flex", gap: 8 }}>
                      <button style={styles.editBtn} onClick={() => setDriverForm({ ...d })}>Edit</button>
                      <button style={styles.delBtn} onClick={() => deleteDriver(d.id)}>Delete</button>
                    </div>,
                  ])}
                />
              </div>
            </>
          )}

          {/* CARS */}
          {tab === "cars" && (
            <>
              <div className="dash-tab-header">
                <h2 style={styles.dashTitle}>Cars</h2>
                <button style={styles.heroCta} className="dash-add-btn" onClick={() => setCarForm({
                  make: "", model: "", year: "", license_plate: "", insurance_no: "",
                  color: "", seating_capacity: "", notes: "", status: "available",
                  emi_date: "", service_date: ""
                })}>+ Add Car</button>
              </div>
              {carForm && (
                <CarForm form={carForm} setForm={setCarForm} onSave={saveCar} onCancel={() => setCarForm(null)} />
              )}
              <div className="dash-mobile-cards">
                {data.cars.map((c) => (
                  <div key={c.id} style={{ background: styles.darkCard, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ color: text, fontWeight: 700, fontSize: 15 }}>{c.make} {c.model}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={styles.editBtn} onClick={() => setCarForm({ ...c })}>Edit</button>
                        <button style={styles.delBtn} onClick={() => deleteCar(c.id)}>Delete</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 13, color: sub }}>
                      <span>📅 {c.year}</span>
                      <span>🔖 {c.license_plate}</span>
                      <span style={{ gridColumn: "1/-1" }}>
                        <span style={{
                          background: c.status === "available" ? "#22c55e20" : "#ef444420",
                          color: c.status === "available" ? "#22c55e" : "#ef4444",
                          padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600
                        }}>{c.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dash-desktop-table" style={{ overflowX: "auto" }}>
                <AdminTable
                  cols={["Make", "Model", "Year", "Plate", "Status", "Actions"]}
                  rows={data.cars.map((c) => [
                    c.make, c.model, c.year, c.license_plate,
                    <span key={c.id} style={{
                      background: c.status === "available" ? "#22c55e20" : "#ef444420",
                      color: c.status === "available" ? "#22c55e" : "#ef4444",
                      padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600
                    }}>{c.status}</span>,
                    <div key={c.id} style={{ display: "flex", gap: 8 }}>
                      <button style={styles.editBtn} onClick={() => setCarForm({ ...c })}>Edit</button>
                      <button style={styles.delBtn} onClick={() => deleteCar(c.id)}>Delete</button>
                    </div>,
                  ])}
                />
              </div>
            </>
          )}

          {/* TRIPS */}
          {tab === "trips" && (
            <>
              <h2 style={styles.dashTitle}>All Trips</h2>
              <div className="dash-mobile-cards">
                {data.trips.map((t) => (
                  <div key={t.id} style={{ background: styles.darkCard, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: gold, fontWeight: 700, fontSize: 13 }}>#{t.id}</span>
                      <span style={{ color: sub, fontSize: 12 }}>{t.trip_date}</span>
                    </div>
                    <div style={{ color: text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.customer_name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: 13, color: sub }}>
                      <span>👤 {t.driver_name || "—"}</span>
                      <span>🚗 {t.car_make} {t.car_model}</span>
                      <span style={{ gridColumn: "1/-1" }}>📍 {t.pickup_location} → {t.drop_location}</span>
                      <span style={{ color: gold, fontWeight: 700 }}>₹{t.total_fare?.toFixed(0)}</span>
                      <span>{t.status || "Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dash-desktop-table" style={{ overflowX: "auto" }}>
                <AdminTable
                  cols={["#", "Customer", "Driver", "Car", "Pickup", "Drop", "Date", "Fare", "Status", "OTP"]}
                  rows={data.trips.map((t) => [
                    t.id, t.customer_name, t.driver_name || "—",
                    `${t.car_make || ""} ${t.car_model || ""}`,
                    t.pickup_location, t.drop_location, t.trip_date,
                    `₹${t.total_fare?.toFixed(0)}`,
                    t.status || "Pending", t.otp || "—",
                  ])}
                />
              </div>
            </>
          )}

        </div>
      </div>

      <style>{`
        .sidebar-close-btn { display: none; }
        .admin-ham { display: none; }
        .overview-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        .dash-tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dash-mobile-cards { display: none; }
        .dash-desktop-table { display: block; }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0) !important; }
          .dash-content { margin-left: 0 !important; }
          .admin-ham { display: flex !important; }
          .sidebar-close-btn { display: flex !important; }
          .overview-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .dash-content > div { padding: 14px 12px !important; }
          .dash-mobile-cards { display: block !important; }
          .dash-desktop-table { display: none !important; }
          .dash-add-btn { width: 100%; }
          .dash-tab-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
