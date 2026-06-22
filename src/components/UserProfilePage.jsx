import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { getStyles, gold, goldLight } from "../utils/styles";
import { api } from "../utils/api";

const STATUS_COLOR = {
  "Pending": "#f59e0b",
  "Accepted": "#3b82f6",
  "Reached Pickup": "#8b5cf6",
  "Trip Started": "#10b981",
  "Trip Completed": "#22c55e",
  "Rejected": "#ef4444",
  "Cancelled": "#6b7280",
};

export default function UserProfilePage({ session, setPage, showToast, onLogout }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const { isDark } = useTheme();
  const s = getStyles(isDark);

  const border = isDark ? "#1e2235" : "#ececec";
  const cardBg = isDark ? "#13172a" : "#ffffff";
  const pageBg = isDark ? "#090b12" : "#f5f5f0";
  const textPrimary = isDark ? "#ffffff" : "#111";
  const textMuted = isDark ? "#6b7280" : "#888";

  const loadTrips = useCallback(async () => {
    try {
      const data = await api.get("/api/my_trips");
      setTrips(Array.isArray(data) ? data : []);
    } catch {
      showToast("Could not load trips", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!session?.user_email) { setPage("login"); return; }
    loadTrips();
  }, [session?.user_email, setPage, loadTrips]);

  const activeTrips = trips.filter(t => !["Trip Completed", "Cancelled", "Rejected"].includes(t.status));
  const historyTrips = trips.filter(t => ["Trip Completed", "Cancelled", "Rejected"].includes(t.status));

  const totalSpent = historyTrips
    .filter(t => t.status === "Trip Completed")
    .reduce((sum, t) => sum + (t.total_fare || 0), 0);

  const username = session?.user_email?.split("@")[0] || "User";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: pageBg, padding: "32px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Profile Card */}
        <div style={{
          background: cardBg, borderRadius: 20, border: `1px solid ${border}`,
          padding: "32px 28px", marginBottom: 24,
          boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.08)",
          display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
        }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${gold}, #a90f28)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0,
            boxShadow: `0 4px 20px ${gold}50`,
          }}>{initials}</div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ color: textPrimary, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {username}
            </h2>
            <p style={{ color: textMuted, fontSize: 14, marginBottom: 2 }}>✉️ {session?.user_email}</p>
            {session?.user_phone && (
              <p style={{ color: textMuted, fontSize: 14 }}>📞 {session.user_phone}</p>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Total Trips", val: trips.length },
              { label: "Completed", val: historyTrips.filter(t => t.status === "Trip Completed").length },
              { label: "Active", val: activeTrips.length },
              { label: "Total Spent", val: `₹${totalSpent.toFixed(0)}` },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: isDark ? "#0d0f1c" : "#f8f6f2",
                border: `1px solid ${border}`, borderRadius: 12,
                padding: "12px 18px", textAlign: "center", minWidth: 80,
              }}>
                <div style={{ color: gold, fontSize: 20, fontWeight: 800, fontFamily: "'Space Mono', monospace" }}>{val}</div>
                <div style={{ color: textMuted, fontSize: 11, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setPage("booknow")} style={{
              background: `linear-gradient(135deg, ${gold}, #a90f28)`,
              border: "none", color: "#fff", padding: "10px 20px",
              borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
            }}>+ Book Ride</button>
            <button onClick={onLogout} style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444", padding: "10px 20px", borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif",
            }}>🚪 Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: isDark ? "#0d0f1c" : "#ece9e3", borderRadius: 12, padding: 4 }}>
          {[
            { key: "active", label: `🚖 Active (${activeTrips.length})` },
            { key: "history", label: `📋 History (${historyTrips.length})` },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: "10px", borderRadius: 9, border: "none",
              background: tab === key ? (isDark ? "#1a1f35" : "#ffffff") : "transparent",
              color: tab === key ? gold : textMuted,
              fontWeight: tab === key ? 700 : 500,
              fontSize: 13, cursor: "pointer", fontFamily: "'Sora', sans-serif",
              boxShadow: tab === key ? (isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)") : "none",
              transition: "all 0.18s",
            }}>{label}</button>
          ))}
        </div>

        {/* Trip Cards */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: textMuted }}>Loading trips...</div>
        ) : (
          <TripList
            trips={tab === "active" ? activeTrips : historyTrips}
            isDark={isDark}
            s={s}
            border={border}
            cardBg={cardBg}
            textPrimary={textPrimary}
            textMuted={textMuted}
            setPage={setPage}
            tab={tab}
          />
        )}
      </div>
    </div>
  );
}

function TripList({ trips, isDark, s, border, cardBg, textPrimary, textMuted, setPage, tab }) {
  if (trips.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "60px 24px",
        background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
      }}>
        <div style={{ fontSize: 52 }}>{tab === "active" ? "🚖" : "📋"}</div>
        <p style={{ color: textMuted, marginTop: 12, fontSize: 15 }}>
          {tab === "active" ? "No active trips right now." : "No past trips yet."}
        </p>
        {tab === "active" && (
          <button onClick={() => setPage("booknow")} style={{
            marginTop: 16, background: `linear-gradient(135deg, ${gold}, #a90f28)`,
            border: "none", color: "#fff", padding: "10px 24px",
            borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>Book Now</button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {trips.map((trip) => {
        const statusColor = STATUS_COLOR[trip.status] || "#888";
        return (
          <div key={trip.id} style={{
            background: cardBg, borderRadius: 16,
            border: `1px solid ${border}`,
            overflow: "hidden", position: "relative",
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            {/* Status strip */}
            <div style={{
              background: statusColor + "18", borderBottom: `1px solid ${statusColor}30`,
              padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ color: textMuted, fontSize: 12, fontFamily: "'Space Mono', monospace" }}>
                Trip #{trip.id}
              </span>
              <span style={{
                color: statusColor, fontSize: 11, fontWeight: 700,
                background: statusColor + "22", padding: "3px 10px", borderRadius: 50,
              }}>{trip.status}</span>
            </div>

            <div style={{ padding: "14px 16px" }}>
              {/* Route */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span>🟢</span>
                  <span style={{ color: textPrimary, fontSize: 13, fontWeight: 500 }}>{trip.pickup_location}</span>
                </div>
                <div style={{ width: 2, height: 10, background: border, marginLeft: 9, marginBottom: 4 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>🔴</span>
                  <span style={{ color: textPrimary, fontSize: 13, fontWeight: 500 }}>{trip.drop_location}</span>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[
                  ["Date", trip.trip_date],
                  ["Car", `${trip.car_make || ""} ${trip.car_model || ""}`.trim() || "—"],
                  ["Driver", trip.driver_name || "Waiting"],
                  ["Distance", `${trip.distance_km} km`],
                  ["Passengers", trip.passengers_accompanying],
                  trip.driver_phone && ["Accepted", "Reached Pickup", "Trip Started"].includes(trip.status)
                    ? ["Driver Ph.", trip.driver_phone] : null,
                ].filter(Boolean).map(([label, val]) => (
                  <div key={label}>
                    <div style={{ color: textMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                    <div style={{ color: textPrimary, fontSize: 13, fontWeight: 500, marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* OTP */}
              {trip.otp && ["Accepted", "Reached Pickup"].includes(trip.status) && (
                <div style={{
                  background: `linear-gradient(135deg, ${gold}18, ${goldLight}10)`,
                  border: `1px solid ${gold}44`, borderRadius: 10,
                  padding: "10px", textAlign: "center", marginBottom: 10,
                }}>
                  <div style={{ color: textMuted, fontSize: 10, marginBottom: 4 }}>🔐 OTP — Share with Driver</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: gold, letterSpacing: 6 }}>
                    {trip.otp}
                  </div>
                </div>
              )}

              {/* Cancel reason */}
              {trip.cancel_reason && (
                <div style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(239,68,68,.10)", color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
                  Cancelled by {trip.cancelled_by}: {trip.cancel_reason}
                </div>
              )}

              {/* Fare */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: 10, borderTop: `1px solid ${border}`,
              }}>
                <span style={{ color: textMuted, fontSize: 12 }}>Total Fare</span>
                <span style={{ color: gold, fontSize: 18, fontWeight: 800, fontFamily: "'Space Mono', monospace" }}>
                  ₹{trip.total_fare?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
