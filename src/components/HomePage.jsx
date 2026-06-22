import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { gold } from "../utils/styles";
import heroVideo from "../video/dvideo.mp4";
import FixedTripsSection from "./FixedTripsSection";
import TourPackagesSection from "./TourPackagesSection";

const services = [
  { title: "Family Tours", desc: "Spacious, safe and comfortable rides for the whole family.", img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80", rate: "₹1,000" },
  { title: "Couples Tour", desc: "Romantic getaways with premium sedans and personalized service.", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80", rate: "₹1,000" },
  { title: "Bachelors Tour", desc: "Epic group adventures with spacious fleet options for the boys.", img: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600&q=80", rate: "₹1,000" },
  { title: "Office Meetings", desc: "Arrive in style and on time. Professional rides for professionals.", img: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=600&q=80", rate: "₹1,000" },
  { title: "Wedding Function", desc: "Make your special day unforgettable with luxury vehicles.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", rate: "₹1,200" },
  { title: "Airport Transfer", desc: "Punctual, comfortable transfers to and from the airport.", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80", rate: "₹800" },
];

const whyItems = [
  { icon: "shield-check", title: "Fully Insured", desc: "All vehicles carry comprehensive insurance for your peace of mind." },
  { icon: "clock", title: "24/7 Available", desc: "Round-the-clock service — whenever you need a ride, we're here." },
  { icon: "currency", title: "Best Pricing", desc: "Transparent fare calculation. No hidden fees, ever." },
  { icon: "user-check", title: "Expert Drivers", desc: "Licensed, verified, and experienced professionals." },
  { icon: "car", title: "Modern Fleet", desc: "AC and Non-AC options in pristine condition." },
  { icon: "mobile", title: "Easy Booking", desc: "Book online in minutes. Confirmation instantly." },
];

const SVG = {
  "shield-check": <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  "clock": <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  "currency": <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  "user-check": <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>,
  "car": <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
  "mobile": <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
};

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("revealed"); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealBox({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal-box" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

export default function HomePage({ setPage, onSelectTrip, session }) {
  const { isDark } = useTheme();
  const bg = isDark ? "#080b14" : "#ffffff";
  const bgAlt = isDark ? "#0d1020" : "#f8f8fc";
  const text = isDark ? "#f0f0f0" : "#0d0d0d";
  const muted = isDark ? "#7a8099" : "#666";
  const card = isDark ? "#111525" : "#ffffff";
  const border = isDark ? "#1e2438" : "#ebebeb";

  return (
    <div style={{ background: bg }}>
      <style>{`
        .reveal-box { opacity: 0; transform: translateY(36px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal-box.revealed { opacity: 1; transform: translateY(0); }
        .svc-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .svc-card:hover { transform: translateY(-10px); box-shadow: 0 32px 80px rgba(201,31,58,0.18) !important; }
        .why-card { transition: transform 0.3s ease, border-color 0.3s ease; }
        .why-card:hover { transform: translateY(-8px); border-color: ${gold} !important; }
        .why-card:hover .why-icon { background: ${gold}; color: #fff; }
        .why-icon { transition: background 0.3s, color 0.3s; }
        .cta-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(201,31,58,0.45) !important; }
        .outline-btn { transition: background 0.2s ease, color 0.2s ease; }
        .outline-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .stat-pill { transition: transform 0.2s; }
        .stat-pill:hover { transform: scale(1.04); }
        .floating-contact {
          position: fixed;
          right: 18px;
          top: 46%;
          z-index: 500;
          display: flex;
          align-items: center;
          gap: 0;
          cursor: pointer;
          filter: drop-shadow(0 10px 18px rgba(0,0,0,.22));
        }
        .floating-contact-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #c91f37;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #fff;
          font-size: 26px;
          transition: transform .2s ease;
        }
        .floating-contact-text {
          width: 0;
          overflow: hidden;
          white-space: nowrap;
          background: #fff;
          color: #333;
          border: 1px solid #eee;
          border-left: none;
          height: 42px;
          display: flex;
          align-items: center;
          padding: 0;
          font-weight: 600;
          transition: width .25s ease, padding .25s ease;
        }
        .floating-contact:hover .floating-contact-icon { transform: scale(1.04); }
        .floating-contact:hover .floating-contact-text { width: 132px; padding: 0 14px; }
        @keyframes heroFadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heroBadgePop { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @media (max-width: 768px) {
          .hero-h1 { font-size: 36px !important; }
          .hero-sub { font-size: 15px !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns button { width: 100% !important; }
          .stats-row { gap: 12px !important; flex-wrap: wrap !important; padding: 14px 18px !important; }
          .section-inner { padding: 60px 16px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 480px) {
          .stats-row { display: none !important; }
        }
      `}</style>
      <button className="floating-contact" onClick={() => setPage("contact")} aria-label="Contact us" style={{ background: "transparent", border: "none" }}>
        <span className="floating-contact-icon">✉</span>
        <span className="floating-contact-text">Let's Connect</span>
      </button>


      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.38) 60%, transparent 100%)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, padding: "100px 6vw 80px", maxWidth: 720 }}>
          <div style={{ animation: "heroBadgePop 0.6s ease 0.2s both", display: "inline-flex", alignItems: "center", gap: 8, background: `${gold}22`, border: `1px solid ${gold}60`, color: gold, padding: "6px 18px", borderRadius: 50, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, marginBottom: 24, textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: gold, display: "inline-block", animation: "floatY 2s ease infinite" }} />
            Premium Car Rental Service
          </div>
          <h1 className="hero-h1" style={{ animation: "heroFadeUp 0.75s ease 0.35s both", fontSize: "clamp(38px,7vw,88px)", fontFamily: "'Sora',sans-serif", fontWeight: 900, color: "#fff", lineHeight: 1.06, letterSpacing: -1, marginBottom: 22 }}>
            NAMMA TAXI<br />
            <span style={{ color: gold }}>AUTOMOTIVE</span>
          </h1>
          <p className="hero-sub" style={{ animation: "heroFadeUp 0.75s ease 0.5s both", fontSize: "clamp(15px,2vw,19px)", color: "rgba(255,255,255,0.72)", maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
            Luxury rides. Trusted drivers. Unforgettable journeys across Tamil Nadu.
          </p>
          <div className="hero-btns" style={{ animation: "heroFadeUp 0.75s ease 0.65s both", display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="cta-btn" style={{ background: `linear-gradient(135deg, ${gold}, #a90f28)`, border: "none", color: "#fff", padding: "15px 36px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: `0 8px 32px ${gold}55` }} onClick={() => setPage("booknow")}>
              Book Your Ride
            </button>
            {!session?.user_email && (
              <button className="outline-btn" style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.45)", color: "#fff", padding: "15px 36px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", backdropFilter: "blur(6px)" }} onClick={() => setPage("register")}>
                Create Account
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="stats-row" style={{ animation: "heroFadeUp 0.75s ease 0.8s both", display: "flex", gap: 20, marginTop: 48 }}>
            {[["5000+", "Happy Riders"], ["200+", "Destinations"], ["50+", "Fleet Cars"], ["4.9", "App Rating"]].map(([num, label]) => (
              <div key={label} className="stat-pill" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Sora',sans-serif" }}>{num}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────── */}
      <section style={{ background: bgAlt }}>
        <div className="section-inner" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 24px" }}>
          <RevealBox>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ color: gold, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>What We Offer</span>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: text, fontFamily: "'Sora',sans-serif", marginTop: 10, marginBottom: 12 }}>Our Services</h2>
              <p style={{ color: muted, fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>From family vacations to corporate travel — we have got you covered.</p>
            </div>
          </RevealBox>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 24 }}>
            {services.map((s, i) => (
              <RevealBox key={s.title} delay={i * 80}>
                <div className="svc-card" style={{ background: card, borderRadius: 20, overflow: "hidden", border: `1px solid ${border}`, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.06)" }}>
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.07)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 45%,rgba(0,0,0,0.75))" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 16, color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: "'Sora',sans-serif" }}>{s.title}</div>
                  </div>
                  <div style={{ padding: "18px 20px 20px" }}>
                    <p style={{ color: muted, fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>{s.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ color: muted, fontSize: 12 }}>From </span>
                        <span style={{ color: gold, fontSize: 20, fontWeight: 800 }}>{s.rate}</span>
                        <span style={{ color: muted, fontSize: 12 }}>/day</span>
                      </div>
                      <button className="cta-btn" style={{ background: `${gold}15`, border: `1px solid ${gold}40`, color: gold, padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer" }} onClick={() => setPage("booknow")}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIXED TRIPS ──────────────────────────────── */}
      <FixedTripsSection onSelectTrip={onSelectTrip} />

      {/* ── TOUR PACKAGES ────────────────────────────── */}
      <TourPackagesSection onSelectPackage={onSelectTrip} />

      {/* ── WHY US ───────────────────────────────────── */}
      <section style={{ background: bgAlt }}>
        <div className="section-inner" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 24px" }}>
          <RevealBox>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ color: gold, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Why Us</span>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: text, fontFamily: "'Sora',sans-serif", marginTop: 10, marginBottom: 12 }}>Why Choose Namma Taxi?</h2>
              <p style={{ color: muted, fontSize: 16, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>Everything you need for a perfect journey — in one place.</p>
            </div>
          </RevealBox>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {whyItems.map((item, i) => (
              <RevealBox key={item.title} delay={i * 70}>
                <div className="why-card" style={{ background: card, borderRadius: 18, padding: "28px 26px", border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="why-icon" style={{ width: 54, height: 54, borderRadius: 14, background: `${gold}15`, color: gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {SVG[item.icon]}
                  </div>
                  <div>
                    <h4 style={{ color: text, fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{item.title}</h4>
                    <p style={{ color: muted, fontSize: 14, lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                </div>
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <RevealBox>
        <section style={{ position: "relative", background: `url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80) center/cover`, padding: "90px 24px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, marginBottom: 14, fontFamily: "'Sora',sans-serif" }}>Ready to Roll?</h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>Book your ride today and experience the Namma Taxi difference.</p>
            <button className="cta-btn" style={{ background: `linear-gradient(135deg, ${gold}, #a90f28)`, border: "none", color: "#fff", padding: "16px 44px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: `0 8px 32px ${gold}55` }} onClick={() => setPage("booknow")}>
              Book Now — It's Quick
            </button>
          </div>
        </section>
      </RevealBox>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ background: isDark ? "#060810" : "#0d0d0d", borderTop: `1px solid ${isDark ? "#131826" : "#1a1a1a"}`, padding: "60px 0 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, paddingBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, background: `linear-gradient(135deg,${gold},#a90f28)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff" }}>NT</div>
                <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: 1 }}>NAMMA TAXI</span>
              </div>
              <p style={{ color: "#555", fontSize: 14, lineHeight: 1.75 }}>Premium automotive rental services across Tamil Nadu. Trusted by thousands of happy customers.</p>
            </div>
            <div>
              <h5 style={{ color: gold, fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>Contact</h5>
              {[["Tirunelveli, Tamil Nadu", "loc"], ["nammataxi@gmail.com", "mail"], ["+91 741 900 680", "phone"]].map(([val]) => (
                <p key={val} style={{ color: "#555", fontSize: 14, marginBottom: 10, lineHeight: 1.5 }}>{val}</p>
              ))}
            </div>
            <div>
              <h5 style={{ color: gold, fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 18, textTransform: "uppercase" }}>Services</h5>
              {["Family Tours", "Couples Tour", "Airport Transfer", "Wedding Function"].map((s) => (
                <p key={s} style={{ color: "#555", fontSize: 14, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }} onClick={() => setPage("booknow")}
                  onMouseOver={e => e.currentTarget.style.color = gold} onMouseOut={e => e.currentTarget.style.color = "#555"}>
                  {s}
                </p>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #141414", padding: "20px 0", textAlign: "center", color: "#333", fontSize: 13 }}>
            2025 Namma Taxi. All rights reserved. — Alpha X Software Company
          </div>
        </div>
      </footer>
    </div>
  );
}
