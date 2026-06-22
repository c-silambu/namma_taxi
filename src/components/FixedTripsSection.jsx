import { useTheme } from "../context/ThemeContext";
import { getStyles, gold } from "../utils/styles";

export const fixedTrips = [
  { id: "trichy-tanjore", from: "Trichy", to: "Tanjore", distance: 114, duration: "1 Hrs", sedanFare: 1575, miniFare: 1485 },
  { id: "trichy-kumbakonam", from: "Trichy", to: "Kumbakonam", distance: 196, duration: "2 Hrs", sedanFare: 2465, miniFare: 2375 },
  { id: "trichy-rameshwaram", from: "Trichy", to: "Rameshwaram", distance: 462, duration: "4.5 Hrs", sedanFare: 5745, miniFare: 5315 },
  { id: "trichy-velankanni", from: "Trichy", to: "Velankanni", distance: 306, duration: "3 Hrs", sedanFare: 3755, miniFare: 3595 },
  { id: "trichy-madurai", from: "Trichy", to: "Madurai", distance: 270, duration: "3 Hrs", sedanFare: 3345, miniFare: 3255 },
  { id: "trichy-palani", from: "Trichy", to: "Palani", distance: 316, duration: "3 Hrs", sedanFare: 3835, miniFare: 3735 },
  { id: "trichy-mayiladuthurai", from: "Trichy", to: "Mayiladuthurai", distance: 244, duration: "2.5 Hrs", sedanFare: 3025, miniFare: 2925 },
  { id: "trichy-chidambaram", from: "Trichy", to: "Chidambaram", distance: 344, duration: "3 Hrs", sedanFare: 4045, miniFare: 3935 },
  { id: "trichy-chennai", from: "Trichy", to: "Chennai", distance: 660, duration: "6.5 Hrs", sedanFare: 8115, miniFare: 7455 },
  { id: "trichy-coimbatore", from: "Trichy", to: "Coimbatore", distance: 434, duration: "4 Hrs", sedanFare: 5405, miniFare: 4995 },
  { id: "trichy-pudukkottai", from: "Trichy", to: "Pudukkottai", distance: 108, duration: "1 Hrs", sedanFare: 1495, miniFare: 1455 },
  { id: "trichy-karaikal", from: "Trichy", to: "Karaikal", distance: 308, duration: "3 Hrs", sedanFare: 3785, miniFare: 3655 },
  { id: "trichy-pondicherry", from: "Trichy", to: "Pondicherry", distance: 400, duration: "4 Hrs", sedanFare: 4995, miniFare: 4595 },
  { id: "trichy-ariyalur", from: "Trichy", to: "Ariyalur", distance: 166, duration: "1.5 Hrs", sedanFare: 2195, miniFare: 2025 },
  { id: "trichy-perambalur", from: "Trichy", to: "Perambalur", distance: 108, duration: "1 Hrs", sedanFare: 1495, miniFare: 1455 },
];

export default function FixedTripsSection({ onSelectTrip }) {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const rowBorder = isDark ? "#262b38" : "#d8d8d8";
  const text = isDark ? "#f5f5f5" : "#111";
  const muted = isDark ? "#9da3b2" : "#565656";

  return (
    <section id="taxi-packages" style={{ ...styles.section, paddingTop: 72 }}>
      <style>{`
        .fixed-trips-head { display: grid; }
        .fixed-trip-row { display: grid; grid-template-columns: 1fr 160px 160px 150px; }

        @media (max-width: 640px) {
          .fixed-trips-head { display: none !important; }
          .fixed-trip-row {
            display: grid !important;
            grid-template-columns: 1fr auto auto !important;
            grid-template-rows: auto auto !important;
            gap: 0 8px !important;
            padding: 10px 12px !important;
            align-items: center !important;
          }
          .trip-route { grid-column: 1 / 2; grid-row: 1 / 2; min-width: 0; }
          .trip-route h3 { font-size: 12px !important; margin-bottom: 0 !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .trip-meta { font-size: 10px !important; margin-top: 1px; }
          .trip-sedan { grid-column: 2 / 3; grid-row: 1 / 2; }
          .trip-mini { grid-column: 2 / 3; grid-row: 2 / 3; }
          .trip-book { grid-column: 3 / 4; grid-row: 1 / 3; display: flex; align-items: center; }
          .trip-sedan button,
          .trip-mini button { font-size: 10px !important; padding: 2px 4px !important; }
          .trip-book button { font-size: 10px !important; padding: 6px 8px !important; white-space: nowrap; }
        }
      `}</style>

      <div style={{ ...styles.container, maxWidth: 1280 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ color: gold, fontWeight: 800, fontSize: 13, letterSpacing: 0.4, marginBottom: 8 }}>
            Trichy Fixed Taxi Packages
          </p>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 10 }}>Fares & Tourist Spots</h2>
          <p style={{ ...styles.sectionSub, marginBottom: 0, maxWidth: 680 }}>
            Common trips from Tiruchirapalli with fixed fares. Select any route to auto-fill your booking details.
          </p>
        </div>

        <div
          style={{
            background: styles.darkCard,
            border: `1px solid ${styles.border}`,
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: isDark ? "0 18px 50px rgba(0,0,0,.32)" : "0 18px 50px rgba(201,31,58,.08)",
          }}
        >
          <div
            className="fixed-trips-head"
            style={{
              gridTemplateColumns: "1fr 160px 160px 150px",
              gap: 16,
              alignItems: "center",
              padding: "18px 22px",
              color: muted,
              fontSize: 12,
              fontWeight: 800,
              borderBottom: `1px solid ${rowBorder}`,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            <span>Route</span>
            <span style={{ textAlign: "center" }}>Sedan</span>
            <span style={{ textAlign: "center" }}>Mini</span>
            <span style={{ textAlign: "right" }}>Action</span>
          </div>

          {fixedTrips.map((trip) => (
            <div
              key={trip.id}
              className="fixed-trip-row"
              style={{
                gap: 16,
                alignItems: "center",
                padding: "18px 22px",
                borderBottom: `1px solid ${rowBorder}`,
              }}
            >
              <div className="trip-route">
                <h3 style={{ color: text, fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
                  {trip.from} → {trip.to}
                </h3>
                <div className="trip-meta" style={{ display: "flex", gap: 10, color: muted, fontSize: 12 }}>
                  <span>🛣️ {trip.distance} km</span>
                  <span>🕒 {trip.duration}</span>
                </div>
              </div>

              <div className="trip-sedan" style={{ textAlign: "center" }}>
                <button
                  style={fareButtonStyle(isDark)}
                  onClick={() =>
                    onSelectTrip({ ...trip, selectedCar: "Sedan", selectedFare: trip.sedanFare })
                  }
                >
                  ₹{trip.sedanFare}/-
                </button>
              </div>

              <div className="trip-mini" style={{ textAlign: "center" }}>
                <button
                  style={fareButtonStyle(isDark)}
                  onClick={() =>
                    onSelectTrip({ ...trip, selectedCar: "Mini", selectedFare: trip.miniFare })
                  }
                >
                  ₹{trip.miniFare}/-
                </button>
              </div>

              <div className="trip-book" style={{ textAlign: "right" }}>
                <button
                  style={{ ...styles.submitBtn, padding: "10px 18px", width: "auto" }}
                  onClick={() =>
                    onSelectTrip({ ...trip, selectedCar: "Sedan", selectedFare: trip.sedanFare })
                  }
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: muted, fontSize: 12, marginTop: 14, textAlign: "center" }}>
          *Final fare may change based on toll, parking, waiting time, and pickup/drop changes.
        </p>
      </div>
    </section>
  );
}

function fareButtonStyle(isDark) {
  return {
    background: "transparent",
    border: "none",
    color: gold,
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: 10,
    textAlign: "center",
    fontFamily: "'Sora', sans-serif",
  };
}