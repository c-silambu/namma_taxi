import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { getStyles } from "../utils/styles";
import { api } from "../utils/api";

const VEHICLE_OPTIONS = [
  { value: "mini", label: "Mini" },
  { value: "sedan", label: "Sedan" },
  { value: "6_seater", label: "6 Seater" },
  { value: "7_seater", label: "7 Seater" },
];

const TRIP_TYPES = [
  { value: "one_way", label: "One Way Trip" },
  { value: "return", label: "Return Trip" },
  { value: "hourly_rent", label: "Hourly Rent" },
];

function getVehicleCategory(car = {}) {
  const seats = Number(car.seating_capacity || 0);
  const text = `${car.make || ""} ${car.model || ""} ${car.notes || ""}`.toLowerCase();

  if (seats >= 7 || text.includes("7")) return "7_seater";
  if (seats >= 6 || text.includes("6") || text.includes("innova") || text.includes("ertiga")) return "6_seater";
  if (text.includes("sedan") || text.includes("swift dzire") || text.includes("dzire") || text.includes("aura")) return "sedan";

  return "mini";
}

function getVehicleLabel(value) {
  return VEHICLE_OPTIONS.find((v) => v.value === value)?.label || "Mini";
}

export default function BookNowPage({
  session,
  setPage,
  showToast,
  selectedTrip,
  clearSelectedTrip,
}) {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(null);

  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  const [form, setForm] = useState({
    driver_id: "",
    car_id: "",
    pickup_location: "",
    drop_location: "",
    trip_date: "",
    drop_time: "",
    distance_km: "",
    fare_type: "per_km",
    car_type: "ac",
    vehicle_category: "mini",
    trip_type: "one_way",
    customer_name: "",
    customer_email: session?.user_email || "",
    customer_phone: "",
    passengers_accompanying: "1",
    trip_notes: "",
  });

  useEffect(() => {
    api.get("/api/drivers").then(setDrivers).catch(() => {});
    api.get("/api/cars").then(setCars).catch(() => {});
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      customer_email: session?.user_email || prev.customer_email || "",
    }));
  }, [session?.user_email]);

  useEffect(() => {
    if (!selectedTrip) return;

    const selectedCategory = selectedTrip.selectedCar === "Mini" ? "mini" : "sedan";

    setForm((prev) => ({
      ...prev,
      pickup_location: selectedTrip.from,
      drop_location: selectedTrip.to,
      distance_km: String(selectedTrip.distance),
      fare_type: "fixed",
      car_type: selectedTrip.selectedCar === "Mini" ? "non_ac" : "ac",
      vehicle_category: selectedCategory,
      trip_notes:
        selectedTrip.trip_notes ||
        `${selectedTrip.packageType || "Fixed package"} selected: ${selectedTrip.from} to ${selectedTrip.to} - ${selectedTrip.selectedCar} - ₹${selectedTrip.selectedFare}`,
    }));

    setFare(Number(selectedTrip.selectedFare));
  }, [selectedTrip]);

  useEffect(() => {
    const selectedCar = cars.find((car) => String(car.id) === String(form.car_id));

    if (selectedCar) {
      setForm((prev) => ({
        ...prev,
        vehicle_category: getVehicleCategory(selectedCar),
      }));
    }
  }, [form.car_id, cars]);

  useEffect(() => {
    const km = parseFloat(form.distance_km);

    if (!km) {
      setFare(null);
      return;
    }

    if (selectedTrip && form.fare_type === "fixed") {
      setFare(Number(selectedTrip.selectedFare));
      return;
    }

    const driverCharge = 300;
    const padiCharge = 500;
    const vehicleExtra =
      form.vehicle_category === "6_seater"
        ? 2
        : form.vehicle_category === "7_seater"
        ? 3
        : 0;

    let total;

    if (form.fare_type === "per_km") {
      const rate = (form.car_type === "ac" ? 13 : 12) + vehicleExtra;
      total = km * rate + driverCharge + padiCharge;
    } else {
      const base = (form.car_type === "ac" ? 1200 : 1000) + vehicleExtra * 100;
      const extra =
        Math.max(0, km - 250) *
        ((form.car_type === "ac" ? 13 : 12) + vehicleExtra);

      total = base + extra + driverCharge + padiCharge;
    }

    setFare(total);
  }, [
    form.distance_km,
    form.fare_type,
    form.car_type,
    form.vehicle_category,
    selectedTrip,
  ]);

  const visibleCars = cars.filter(
    (car) => !form.vehicle_category || getVehicleCategory(car) === form.vehicle_category
  );

  const handleSubmit = async () => {
    if (!session?.user_email) {
      showToast("Please login to book a trip", "warning");
      setPage("login");
      return;
    }

    const required = [
      "customer_name",
      "customer_email",
      "customer_phone",
      "pickup_location",
      "drop_location",
      "trip_date",
      "drop_time",
      "distance_km",
      "trip_type",
      "vehicle_category",
      "car_id",
    ];

    for (const key of required) {
      if (!form[key]) {
        showToast(`Please fill: ${key.replace(/_/g, " ")}`, "warning");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await api.post("/api/booknow", {
        ...form,
        total_fare: fare,
      });

      if (res.success) {
        showToast("Booking confirmed!", "success");
        setPage("mycart");
      } else {
        showToast(res.message || "Booking failed", "error");
      }
    } catch (error) {
      showToast(error?.message || "Server error", "error");
    }

    setLoading(false);
  };

  const f = (key) => ({
    style: styles.input,
    value: form[key],
    onChange: (e) =>
      setForm({
        ...form,
        [key]: e.target.value,
      }),
  });

  return (
    <div style={styles.bookBg} className="book-bg">
      <div style={styles.bookContainer} className="book-container">
        <button style={styles.backBtn} onClick={() => setPage("home")}>
          ← Back to Home
        </button>

        <h2 style={styles.bookTitle}>Book a Trip</h2>
        <p style={styles.bookSub}>
          Enter customer details first, then select your ride.
        </p>

        {selectedTrip && (
          <div
            style={{
              background: styles.inputBg,
              border: `1px solid ${styles.border2}`,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong
                style={{
                  color: styles.textPrimary,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                {selectedTrip.packageType || "Fixed Trip"}: {selectedTrip.from} to{" "}
                {selectedTrip.to}
              </strong>

              <span style={{ color: styles.textMuted, fontSize: 13 }}>
                {selectedTrip.distance} Kms • {selectedTrip.duration} •{" "}
                {selectedTrip.selectedCar}
              </span>
            </div>

            <button
              style={{ ...styles.cancelBtn, padding: "8px 14px" }}
              onClick={() => {
                clearSelectedTrip?.();
                setFare(null);
                setForm((prev) => ({
                  ...prev,
                  pickup_location: "",
                  drop_location: "",
                  distance_km: "",
                  fare_type: "per_km",
                  trip_notes: "",
                }));
              }}
            >
              Clear Package
            </button>
          </div>
        )}

        {fare && (
          <div style={styles.fareCard}>
            <span style={styles.fareLabel}>Estimated Fare</span>
            <span style={styles.fareAmount}>₹{fare.toFixed(2)}</span>
            <span style={styles.fareNote}>
              {selectedTrip
                ? `${selectedTrip.packageType || "Fixed package"} fare selected`
                : "Approximate fare only. Extra charges may apply."}
            </span>
          </div>
        )}

        <h3 style={{ color: styles.textPrimary, margin: "18px 0 12px" }}>
          Customer Details
        </h3>

        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Customer Name</label>
            <input placeholder="Full name" {...f("customer_name")} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Mail ID</label>
            <input
              type="email"
              placeholder="email@example.com"
              {...f("customer_email")}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Phone Number</label>
            <input
              placeholder="10-digit number"
              maxLength={10}
              {...f("customer_phone")}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Passengers</label>
            <input
              type="number"
              min="1"
              placeholder="Number of passengers"
              {...f("passengers_accompanying")}
            />
          </div>
        </div>

        <h3 style={{ color: styles.textPrimary, margin: "18px 0 12px" }}>
          Trip Details
        </h3>

        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Pickup Location</label>
            <input placeholder="Enter pickup point" {...f("pickup_location")} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Drop Location</label>
            <input placeholder="Enter destination" {...f("drop_location")} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Trip Date</label>
            <input type="date" {...f("trip_date")} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Drop Time</label>
            <input type="time" {...f("drop_time")} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Trip Type</label>
            <select {...f("trip_type")}>
              {TRIP_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Distance (km)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 150"
              {...f("distance_km")}
            />
          </div>
        </div>

        <h3 style={{ color: styles.textPrimary, margin: "18px 0 12px" }}>
          Car Details
        </h3>

        <div style={styles.grid2}>
          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Vehicle Category</label>
            <select {...f("vehicle_category")}>
              {VEHICLE_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Select Vehicle</label>
            <select {...f("car_id")}>
              <option value="">Select {getVehicleLabel(form.vehicle_category)}</option>

              {visibleCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {getVehicleLabel(getVehicleCategory(car))} —{" "}
                  {car.license_plate || "No Plate"} — {car.status || "available"}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Driver</label>
            <select {...f("driver_id")}>
              <option value="">Admin will assign / Select Driver</option>

              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>AC Type</label>
            <select {...f("car_type")}>
              <option value="ac">AC</option>
              <option value="non_ac">Non-AC</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.labelDark}>Fare Type</label>
            <select {...f("fare_type")}>
              <option value="per_km">Per KM</option>
              <option value="fixed">Fixed Fare</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.labelDark}>Notes</label>
          <textarea
            style={{
              ...styles.input,
              minHeight: 80,
              resize: "vertical",
            }}
            placeholder="Any special instructions..."
            value={form.trip_notes}
            onChange={(e) =>
              setForm({
                ...form,
                trip_notes: e.target.value,
              })
            }
          />
        </div>

        <div
          style={{
            marginTop: 20,
            padding: "14px 16px",
            borderRadius: 12,
            background: isDark ? "#1f2937" : "#fff8e1",
            border: isDark ? "1px solid #374151" : "1px solid #f4c542",
            color: isDark ? "#f9fafb" : "#333",
            fontSize: 14,
            lineHeight: "1.8",
          }}
        >
          <strong>Terms & Conditions:</strong>

          <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
            <li>Waiting charges are applicable after the free waiting time.</li>
            <li>Toll charges are extra and must be paid by the customer.</li>
            <li>Parking charges are extra wherever applicable.</li>
            <li>Driver allowance may apply for long-distance or return trips.</li>
            <li>Final fare may vary based on route, waiting time, toll and parking.</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              flex: 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>

          <button style={styles.cancelBtn} onClick={() => setPage("home")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}