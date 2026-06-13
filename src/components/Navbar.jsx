import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { gold } from "../utils/styles";

export default function Navbar({ page, setPage, session, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? "rgba(9,11,20,0.85)" : "rgba(255,255,255,0.82)";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#f0f0f0" : "#111";
  const sub = isDark ? "#666" : "#aaa";
  const drawerBg = isDark ? "#0d0f1c" : "#ffffff";

  const navItems = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "booknow", label: "Book Now", icon: "🚖" },
    session?.user_email ? { key: "mycart", label: "My Trips", icon: "🧾" } : null,
    session?.admin_logged_in ? { key: "dashboard", label: "Dashboard", icon: "📊" } : null,
  ].filter(Boolean);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: bg,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${border}`,
        height: 62,
      }}>
        <div style={{
          maxWidth: 1300, margin: "0 auto", padding: "0 24px",
          height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Brand */}
          <div onClick={() => { setPage("home"); close(); }} style={{
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36,
              background: `linear-gradient(135deg, ${gold} 0%, #a90f28 100%)`,
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 13, color: "#fff", letterSpacing: 0.5,
              boxShadow: `0 2px 12px ${gold}50`,
            }}>NT</div>
            <span style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 15,
              color: text, letterSpacing: 1,
            }}>NAMMA TAXI</span>
          </div>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 2 }}>

            {/* Pill nav group */}
            <div style={{
              display: "flex", alignItems: "center", gap: 2,
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              borderRadius: 12, padding: "4px",
              border: `1px solid ${border}`,
            }}>
              {navItems.map((item) => (
                <button key={item.key} onClick={() => setPage(item.key)} style={{
                  background: page === item.key
                    ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)")
                    : "transparent",
                  border: "none",
                  color: page === item.key ? gold : (isDark ? "#bbb" : "#444"),
                  padding: "7px 14px", borderRadius: 9,
                  cursor: "pointer", fontSize: 13, fontWeight: page === item.key ? 700 : 500,
                  fontFamily: "'Sora', sans-serif",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  boxShadow: page === item.key ? `0 0 0 1px ${gold}40` : "none",
                }}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div style={{ width: 1, height: 20, background: border, margin: "0 10px" }} />

            {/* Auth buttons */}
            {session?.user_email || session?.admin_logged_in ? (
              <button onClick={onLogout} style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444", padding: "7px 16px", borderRadius: 9,
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "'Sora', sans-serif", transition: "all 0.18s",
              }}>🚪 Logout</button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => setPage("login")} style={{
                  background: "transparent",
                  border: `1px solid ${border}`,
                  color: isDark ? "#ccc" : "#333", padding: "7px 14px", borderRadius: 9,
                  cursor: "pointer", fontSize: 13, fontWeight: 500,
                  fontFamily: "'Sora', sans-serif",
                }}>🔑 Login</button>
                <button onClick={() => setPage("driver-login")} style={{
                  background: "transparent",
                  border: `1px solid ${border}`,
                  color: isDark ? "#ccc" : "#333", padding: "7px 14px", borderRadius: 9,
                  cursor: "pointer", fontSize: 13, fontWeight: 500,
                  fontFamily: "'Sora', sans-serif",
                }}>🚖 Driver</button>
                <button onClick={() => setPage("register")} style={{
                  background: `linear-gradient(135deg, ${gold}, #a90f28)`,
                  border: "none", color: "#fff", padding: "7px 18px", borderRadius: 9,
                  cursor: "pointer", fontSize: 13, fontWeight: 700,
                  fontFamily: "'Sora', sans-serif",
                  boxShadow: `0 2px 14px ${gold}45`,
                }}>✨ Sign Up</button>
              </div>
            )}

            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{
              marginLeft: 8,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${border}`,
              color: isDark ? "#fff" : "#333",
              width: 34, height: 34, borderRadius: 9,
              cursor: "pointer", fontSize: 15, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.18s",
            }}>{isDark ? "☀️" : "🌙"}</button>
          </div>

          {/* Mobile right */}
          <div className="nav-mobile" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <button onClick={toggleTheme} style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${border}`,
              color: isDark ? "#fff" : "#333",
              width: 34, height: 34, borderRadius: 9,
              cursor: "pointer", fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{isDark ? "☀️" : "🌙"}</button>

            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: menuOpen
                ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)")
                : "transparent",
              border: `1px solid ${border}`,
              color: text, width: 34, height: 34, borderRadius: 9,
              cursor: "pointer", fontSize: 17,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.18s",
            }}>{menuOpen ? "✕" : "☰"}</button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div onClick={close} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 1100, backdropFilter: "blur(4px)",
        }} />
      )}

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 270,
        background: drawerBg,
        borderLeft: `1px solid ${border}`,
        zIndex: 1200, display: "flex", flexDirection: "column",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.26s cubic-bezier(.4,0,.2,1)",
        boxShadow: menuOpen ? "-12px 0 40px rgba(0,0,0,0.3)" : "none",
      }}>

        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 14px",
          borderBottom: `1px solid ${border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32,
              background: `linear-gradient(135deg, ${gold}, #a90f28)`,
              borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 11, color: "#fff",
            }}>NT</div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 14, color: text }}>
              NAMMA TAXI
            </span>
          </div>
          <button onClick={close} style={{
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${border}`,
            color: sub, width: 30, height: 30, borderRadius: 8,
            cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }}>
          {navItems.map((item) => (
            <button key={item.key} onClick={() => { setPage(item.key); close(); }} style={{
              background: page === item.key ? `${gold}15` : "transparent",
              border: "none",
              borderLeft: `3px solid ${page === item.key ? gold : "transparent"}`,
              color: page === item.key ? gold : text,
              padding: "12px 14px", borderRadius: 10,
              cursor: "pointer", fontSize: 14,
              fontWeight: page === item.key ? 700 : 500,
              textAlign: "left", fontFamily: "'Sora', sans-serif", width: "100%",
              transition: "all 0.15s",
            }}>
              {item.icon} {item.label}
            </button>
          ))}

          <div style={{ height: 1, background: border, margin: "8px 4px" }} />

          {session?.user_email || session?.admin_logged_in ? (
            <button onClick={() => { onLogout(); close(); }} style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444", padding: "12px 14px", borderRadius: 10,
              cursor: "pointer", fontSize: 14, fontWeight: 600,
              textAlign: "left", fontFamily: "'Sora', sans-serif",
            }}>🚪 Logout</button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={() => { setPage("login"); close(); }} style={{
                background: "transparent", border: `1px solid ${border}`,
                color: text, padding: "12px 14px", borderRadius: 10,
                cursor: "pointer", fontSize: 14, fontWeight: 500,
                textAlign: "left", fontFamily: "'Sora', sans-serif",
              }}>🔑 Login</button>
              <button onClick={() => { setPage("driver-login"); close(); }} style={{
                background: "transparent", border: `1px solid ${border}`,
                color: text, padding: "12px 14px", borderRadius: 10,
                cursor: "pointer", fontSize: 14, fontWeight: 500,
                textAlign: "left", fontFamily: "'Sora', sans-serif",
              }}>🚖 Driver Login</button>
              <button onClick={() => { setPage("register"); close(); }} style={{
                background: `linear-gradient(135deg, ${gold}, #a90f28)`,
                border: "none", color: "#fff", padding: "12px 14px", borderRadius: 10,
                cursor: "pointer", fontSize: 14, fontWeight: 700,
                textAlign: "left", fontFamily: "'Sora', sans-serif",
                boxShadow: `0 2px 12px ${gold}40`,
              }}>✨ Sign Up</button>
            </div>
          )}
        </div>

        {/* Theme bottom */}
        <div style={{ padding: "10px 10px 20px" }}>
          <button onClick={toggleTheme} style={{
            width: "100%", padding: "11px", borderRadius: 10,
            border: `1px solid ${border}`,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            color: isDark ? "#ccc" : "#444",
            fontSize: 13, cursor: "pointer", fontFamily: "'Sora', sans-serif",
            fontWeight: 500,
          }}>{isDark ? "☀️  Switch to Light Mode" : "🌙  Switch to Dark Mode"}</button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
