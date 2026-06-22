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

export default function MyCartPage({ session, setPage, showToast }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState({});
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  const loadTrips = useCallback(async (silent = false) => {
    try {
      const data = await api.get("/api/my_trips");
      setTrips(Array.isArray(data) ? data : []);
    } catch {
      if (!silent) showToast("Could not load trips", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!session?.user_email) { setPage("login"); return; }
    loadTrips();
  }, [session?.user_email, setPage, loadTrips]);

  useEffect(() => {
    if (!session?.user_email) return;
    const timer = setInterval(() => loadTrips(true), 5000);
    return () => clearInterval(timer);
  }, [session?.user_email, loadTrips]);

  const cancelTrip = async (tripId) => {
    const reason = (cancelReason[tripId] || "").trim();
    if (!reason) {
      showToast("Please enter cancel reason", "warning");
      return;
    }
    try {
      const res = await api.post(`/api/my_trips/${tripId}/cancel`, { reason });
      if (res.success) {
        showToast("Trip cancelled", "success");
        setTrips(prev => prev.map(t => t.id === tripId ? res.trip : t));
      } else {
        showToast(res.message || "Cancel failed", "error");
      }
    } catch {
      showToast("Cancel failed", "error");
    }
  };


  if (loading) return <div style={styles.loader}>Loading your trips...</div>;

  return (
    <div style={styles.pageBg}>
      <div style={styles.container}>
        <div style={styles.pageHeader} className="page-header">
          <h2 style={styles.pageTitle}>My Trips</h2>
          <button style={styles.heroCta} onClick={() => setPage("booknow")}>
            + Book New Trip
          </button>
        </div>
        {trips.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 64 }}>🚗</div>
            <h3 style={{ color: styles.textPrimary, marginTop: 16 }}>No trips yet!</h3>
            <p style={{ color: styles.textMuted }}>Book your first ride and it'll appear here.</p>
            <button style={{ ...styles.heroCta, marginTop: 16 }} onClick={() => setPage("booknow")}>
              Book Now
            </button>
          </div>
        ) : (
          <div style={styles.grid3}>
            {trips.map((trip) => {
              const statusColor = STATUS_COLOR[trip.status] || "#888";
              return (
                <div key={trip.id} style={{ ...styles.tripCard, position: "relative", overflow: "hidden" }} className="hover-card">
                  {/* Status badge */}
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    padding: "5px 14px", fontSize: 11, fontWeight: 700,
                    background: statusColor + "22", color: statusColor,
                    borderBottomLeftRadius: 10,
                    borderTop: `2px solid ${statusColor}44`,
                  }}>
                    {trip.status || "Pending"}
                  </div>

                  <div style={styles.tripHeader}>
                    <span style={styles.tripId}>Trip #{trip.id}</span>
                    <span style={styles.tripDate}>{trip.trip_date}</span>
                  </div>
                  <div style={styles.tripRoute}>
                    <div style={styles.tripLoc}>
                      <span style={styles.dot}>🟢</span>
                      <span>{trip.pickup_location}</span>
                    </div>
                    <div style={styles.tripLine} />
                    <div style={styles.tripLoc}>
                      <span style={styles.dot}>🔴</span>
                      <span>{trip.drop_location}</span>
                    </div>
                  </div>
                  <div style={styles.tripDetails}>
                    <div style={styles.tripDetail}>
                      <span style={styles.detailLabel}>Vehicle</span>
                      <span style={styles.detailVal}>{(trip.vehicle_category || "mini").replace(/_/g, " ").toUpperCase()}</span>
                    </div>
                    <div style={styles.tripDetail}>
                      <span style={styles.detailLabel}>Driver</span>
                      <span style={styles.detailVal}>{trip.driver_name || "Waiting"}</span>
                    </div>
                    {trip.driver_phone && ["Accepted", "Reached Pickup", "Trip Started"].includes(trip.status) && (
                      <div style={styles.tripDetail}>
                        <span style={styles.detailLabel}>Driver Phone</span>
                        <span style={styles.detailVal}>{trip.driver_phone}</span>
                      </div>
                    )}
                    <div style={styles.tripDetail}>
                      <span style={styles.detailLabel}>Trip Type</span>
                      <span style={styles.detailVal}>{(trip.trip_type || "one_way").replace(/_/g, " ")}</span>
                    </div>
                    <div style={styles.tripDetail}>
                      <span style={styles.detailLabel}>Drop Time</span>
                      <span style={styles.detailVal}>{trip.drop_time || "—"}</span>
                    </div>
                    <div style={styles.tripDetail}>
                      <span style={styles.detailLabel}>Distance</span>
                      <span style={styles.detailVal}>{trip.distance_km} km</span>
                    </div>
                    <div style={styles.tripDetail}>
                      <span style={styles.detailLabel}>Passengers</span>
                      <span style={styles.detailVal}>{trip.passengers_accompanying}</span>
                    </div>
                  </div>

                  {/* OTP Section - show when accepted/reached pickup */}
                  {trip.otp && ["Accepted", "Reached Pickup"].includes(trip.status) && (
                    <div style={{
                      margin: "12px 0 6px",
                      background: `linear-gradient(135deg, ${gold}18, ${goldLight}10)`,
                      border: `1px solid ${gold}44`,
                      borderRadius: 10, padding: "12px 14px", textAlign: "center"
                    }}>
                      <div style={{ color: isDark ? "#888" : "#666", fontSize: 11, marginBottom: 4 }}>
                        🔐 Your Trip OTP — Share with Driver
                      </div>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700,
                        color: gold, letterSpacing: 6
                      }}>
                        {trip.otp}
                      </div>
                      <div style={{ color: isDark ? "#666" : "#888", fontSize: 11, marginTop: 4 }}>
                        Give this OTP to the driver to start the trip
                      </div>
                    </div>
                  )}

                  {trip.cancel_reason && (
                    <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: "rgba(239,68,68,.10)", color: "#ef4444", fontSize: 12 }}>
                      Cancelled by {trip.cancelled_by}: {trip.cancel_reason}
                    </div>
                  )}

                  {! ["Trip Completed", "Cancelled", "Rejected"].includes(trip.status) && (
                    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                      <input
                        style={styles.input}
                        placeholder="Cancel reason"
                        value={cancelReason[trip.id] || ""}
                        onChange={(e) => setCancelReason(prev => ({ ...prev, [trip.id]: e.target.value }))}
                      />
                      <button style={styles.cancelBtn} onClick={() => cancelTrip(trip.id)}>Cancel Trip</button>
                    </div>
                  )}

                  <div style={styles.tripFare}>
                    Total: <strong>₹{trip.total_fare?.toFixed(2)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
