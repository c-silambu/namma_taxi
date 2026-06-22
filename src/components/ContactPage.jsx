import { useTheme } from "../context/ThemeContext";
import { getStyles, gold } from "../utils/styles";

const contactCards = [
  {
    icon: "📞",
    title: "We'd love to hear from you",
    text: "Please make a call to this number",
    value: "0422 4567890",
  },
  {
    icon: "✉️",
    title: "Please send us an e-mail",
    text: "we will quickly get back to you",
    value: "info@nammataxi.co.in",
  },
  {
    icon: "📩",
    title: "To address your complaint/grievance",
    text: "mail us at",
    value: "customersupport@nammataxi.co.in",
  },
];

export default function ContactPage() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const bg = isDark ? "#0d0d0d" : "#ffffff";
  const cardBg = isDark ? "#161616" : "#f4f4f4";
  const text = isDark ? "#ffffff" : "#050505";
  const sub = isDark ? "#b8b8b8" : "#333333";

  return (
    <main style={{ background: bg, minHeight: "100vh" }}>
      <section style={{
        height: 190,
        backgroundImage: "linear-gradient(90deg, rgba(169,15,40,.88), rgba(169,15,40,.25)), url('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=85')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      <section style={{ ...styles.container, padding: "28px 20px 70px" }}>
        <div style={{ color: sub, fontSize: 14, marginBottom: 58 }}>
          <span style={{ color: text }}>Home</span> / Contact Us
        </div>

        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h4 style={{ color: text, fontSize: 20, marginBottom: 14 }}>Contact Us</h4>
          <h1 style={{ color: text, fontSize: "clamp(30px, 5vw, 44px)", lineHeight: 1.2, fontWeight: 900, marginBottom: 26 }}>
            <span style={{ color: gold }}>Reach Us,</span> We are here<br />to help you
          </h1>
          <p style={{ color: sub, fontSize: 16 }}>
            Hassle-Free Bookings on-time Pick-up. Your Reliable Ride for Every Business Need.
          </p>
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {contactCards.map((card) => (
            <article key={card.value} style={{
              background: cardBg,
              borderRadius: 28,
              padding: "54px 28px",
              minHeight: 250,
              textAlign: "center",
              border: `1px solid ${isDark ? "#242424" : "#eeeeee"}`,
            }}>
              <div style={{ fontSize: 44, color: gold, marginBottom: 30 }}>{card.icon}</div>
              <h3 style={{ color: text, fontSize: 23, lineHeight: 1.25, fontWeight: 800, marginBottom: 24 }}>{card.title}</h3>
              <p style={{ color: sub, fontSize: 14, marginBottom: 22 }}>{card.text}</p>
              <p style={{ color: gold, fontSize: 22, fontWeight: 800, wordBreak: "break-word" }}>{card.value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
