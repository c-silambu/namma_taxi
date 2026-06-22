import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { getStyles, gold } from "../utils/styles";

export const tourPackages = [
  {
    id: "trichy-ooty-tour",
    from: "Trichy",
    to: "Ooty",
    title: "Ooty Hill Station Package",
    distance: 530,
    duration: "3 Days / 2 Nights",
    selectedFare: 15999,
    image: "https://images.unsplash.com/photo-1609948543911-7f01ff385be5?auto=format&fit=crop&w=900&q=80",
    desc: "Queen of Hills trip with Botanical Garden, Ooty Lake, Doddabetta Peak and tea estate sightseeing.",
    places: ["Botanical Garden", "Ooty Lake", "Doddabetta", "Tea Estate"],
  },
  {
    id: "trichy-kodaikanal-tour",
    from: "Trichy",
    to: "Kodaikanal",
    title: "Kodaikanal Family Package",
    distance: 320,
    duration: "2 Days / 1 Night",
    selectedFare: 11999,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80",
    desc: "Peaceful family hill trip covering Kodai Lake, Coaker's Walk, Pine Forest and Pillar Rocks.",
    places: ["Kodai Lake", "Coaker's Walk", "Pine Forest", "Pillar Rocks"],
  },
  {
    id: "trichy-munnar-tour",
    from: "Trichy",
    to: "Munnar",
    title: "Munnar Tea Valley Package",
    distance: 470,
    duration: "3 Days / 2 Nights",
    selectedFare: 16999,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=80",
    desc: "Kerala tea garden tour with Mattupetty Dam, Echo Point, Top Station and green valley views.",
    places: ["Tea Gardens", "Mattupetty Dam", "Echo Point", "Top Station"],
  },
  {
    id: "trichy-vagamon-tour",
    from: "Trichy",
    to: "Vagamon",
    title: "Vagamon Meadows Package",
    distance: 430,
    duration: "3 Days / 2 Nights",
    selectedFare: 16499,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    desc: "Calm nature trip for friends and couples with meadows, pine valley and viewpoint rides.",
    places: ["Vagamon Meadows", "Pine Valley", "View Point", "Tea Hills"],
  },
  {
    id: "trichy-kochi-tour",
    from: "Trichy",
    to: "Kochi",
    title: "Kochi Heritage Package",
    distance: 520,
    duration: "3 Days / 2 Nights",
    selectedFare: 17499,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=900&q=80",
    desc: "City and backwater vibe with Fort Kochi, Marine Drive, Chinese Fishing Nets and shopping time.",
    places: ["Fort Kochi", "Marine Drive", "Chinese Nets", "Jew Town"],
  },
  {
    id: "trichy-valparai-tour",
    from: "Trichy",
    to: "Valparai",
    title: "Valparai Nature Package",
    distance: 380,
    duration: "2 Days / 1 Night",
    selectedFare: 13999,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
    desc: "Green forest route and tea estate journey with Aliyar Dam, Loam's View Point and Nallamudi views.",
    places: ["Aliyar Dam", "Tea Estate", "Loam's View", "Nallamudi"],
  },
  {
    id: "trichy-wayanad-tour",
    from: "Trichy",
    to: "Wayanad",
    title: "Wayanad Adventure Package",
    distance: 560,
    duration: "3 Days / 2 Nights",
    selectedFare: 18499,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    desc: "Adventure and nature trip with waterfalls, caves, lake view and forest side sightseeing.",
    places: ["Edakkal Caves", "Pookode Lake", "Soochipara", "View Points"],
  },
  {
    id: "trichy-yercaud-tour",
    from: "Trichy",
    to: "Yercaud",
    title: "Yercaud Weekend Package",
    distance: 260,
    duration: "2 Days / 1 Night",
    selectedFare: 9999,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
    desc: "Quick weekend hill trip with lake boating, viewpoints, coffee estate and family relaxation.",
    places: ["Yercaud Lake", "Lady's Seat", "Pagoda Point", "Coffee Estate"],
  },
  {
    id: "trichy-thekkady-tour",
    from: "Trichy",
    to: "Thekkady",
    title: "Thekkady Wildlife Package",
    distance: 360,
    duration: "2 Days / 1 Night",
    selectedFare: 13499,
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80",
    desc: "Forest and spice garden package with Periyar lake boating, elephant camp and local shopping.",
    places: ["Periyar Lake", "Spice Garden", "Elephant Camp", "Market"],
  },
];

export default function TourPackagesSection({ onSelectPackage }) {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const text = isDark ? "#ffffff" : "#080808";
  const muted = isDark ? "#a9afbd" : "#5c5c5c";
  const cardBg = isDark ? "#141824" : "#ffffff";
  const scrollRef = useRef(null);
  const scroll = (dir) => { scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" }); };

  const handleBook = (pkg) => {
    onSelectPackage({
      ...pkg,
      selectedCar: "AC Package Cab",
      miniFare: pkg.selectedFare,
      sedanFare: pkg.selectedFare,
      packageType: "Tour Package",
      trip_notes: `${pkg.title} includes cab, food, home stay, local guide and sightseeing support. Places: ${pkg.places.join(", ")}`,
    });
  };

  return (
    <section id="tour-packages" style={{ ...styles.section, paddingTop: 72 }}>
      <style>{`.tour-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div style={{ ...styles.container, maxWidth: 1280 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ color: gold, fontWeight: 900, fontSize: 13, letterSpacing: 0.5, marginBottom: 8 }}>
            Full Tour Packages From Trichy
          </p>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 10 }}>Tour Package Trips</h2>
          <p style={{ ...styles.sectionSub, maxWidth: 760, margin: "0 auto" }}>
            Long trip packages with cab, food, home stay, tourist guide and sightseeing plan included.
          </p>
        </div>

        <div style={{ position: "relative" }}>
        <button onClick={() => scroll(-1)} style={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: isDark ? "#1e2535" : "#fff", border: `1.5px solid ${styles.border}`, borderRadius: "50%", width: 42, height: 42, fontSize: 20, cursor: "pointer", color: text, boxShadow: "0 4px 16px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>&#8592;</button>
        <button onClick={() => scroll(1)} style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: isDark ? "#1e2535" : "#fff", border: `1.5px solid ${styles.border}`, borderRadius: "50%", width: 42, height: 42, fontSize: 20, cursor: "pointer", color: text, boxShadow: "0 4px 16px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>&#8594;</button>
        <div
          ref={scrollRef}
          style={{ display: "flex", flexDirection: "row", gap: 22, overflowX: "auto", paddingBottom: 12, scrollSnapType: "x mandatory", msOverflowStyle: "none", scrollbarWidth: "none" }}
          className="tour-scroll"
        >
          {tourPackages.map((pkg) => (
            <article
              key={pkg.id}
              className="hover-card"
              style={{
                background: cardBg,
                border: `1px solid ${styles.border}`,
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: isDark ? "0 18px 45px rgba(0,0,0,.35)" : "0 18px 45px rgba(201,31,58,.09)",
                minWidth: 290,
                maxWidth: 290,
                flex: "0 0 290px",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ height: 190, overflow: "hidden", position: "relative" }}>
                <img src={pkg.image} alt={pkg.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", left: 14, top: 14, background: "rgba(0,0,0,.68)", color: "#fff", padding: "7px 11px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>
                  {pkg.duration}
                </div>
              </div>

              <div style={{ padding: 22, display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ color: text, fontSize: 22, fontWeight: 900, marginBottom: 10 }}>{pkg.title}</h3>
                <p style={{ color: muted, lineHeight: 1.65, fontSize: 14, marginBottom: 14 }}>{pkg.desc}</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                  {pkg.places.map((place) => (
                    <span key={place} style={{ background: isDark ? "#202636" : "#fff3f5", color: isDark ? "#f1f1f1" : "#c91f3a", padding: "7px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>
                      {place}
                    </span>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 8, color: muted, fontSize: 13, marginBottom: 18 }}>
                  <span>🛣️ Around {pkg.distance} Kms from Trichy</span>
                  <span>✅ Food + Home Stay + Guide Included</span>
                  <span>🚕 AC cab with driver support</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginTop: "auto" }}>
                  <div>
                    <span style={{ color: muted, fontSize: 12, fontWeight: 700 }}>Package From</span>
                    <div style={{ color: gold, fontSize: 22, fontWeight: 900 }}>₹{pkg.selectedFare.toLocaleString("en-IN")}/-</div>
                  </div>
                  <button style={{ ...styles.submitBtn, width: "auto", padding: "11px 20px" }} onClick={() => handleBook(pkg)}>
                    Book Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>

        <p style={{ color: muted, fontSize: 12, marginTop: 16, textAlign: "center" }}>
          *Package price can change based on room type, food plan, season, toll, parking and extra sightseeing.
        </p>
      </div>
    </section>
  );
}
