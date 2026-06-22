import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { gold } from "../utils/styles";

export default function Navbar({ page, setPage, session, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? "rgba(8,10,20,0.88)" : "rgba(255,255,255,0.88)";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const text = isDark ? "#f0f0f0" : "#111";
  const drawerBg = isDark ? "#080b18" : "#ffffff";
  const mutedText = isDark ? "#888" : "#999";

  const goTo = (key) => {
    if (key === "tour-packages" || key === "taxi-packages") {
      setPage("home");
      const id = key === "tour-packages" ? "tour-packages" : "taxi-packages";
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      return;
    }
    setPage(key);
  };

  const navItems = [
    { key: "home", label: "Home" },
    { key: "tour-packages", label: "Tour Packages" },
    { key: "taxi-packages", label: "Taxi Packages" },
    { key: "booknow", label: "Book Trip" },
    { key: "contact", label: "Contact" },
    session?.user_email ? { key: "mycart", label: "My Trips" } : null,
    session?.admin_logged_in ? { key: "dashboard", label: "Dashboard" } : null,
  ].filter(Boolean);

  const close = () => setMenuOpen(false);

  return (
    <>
      <style>{`
        .nb-link {
          position: relative;
          background: transparent;
          border: none;
          color: ${isDark ? "#aaa" : "#555"};
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          font-family: 'Sora', sans-serif;
          transition: color 0.2s ease;
          white-space: nowrap;
          letter-spacing: 0.2px;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 50%; right: 50%;
          height: 2px;
          background: ${gold};
          border-radius: 2px;
          transition: left 0.25s ease, right 0.25s ease;
        }
        .nb-link:hover { color: ${text}; }
        .nb-link:hover::after { left: 14px; right: 14px; }
        .nb-link.active { color: ${gold}; font-weight: 700; }
        .nb-link.active::after { left: 14px; right: 14px; }

        .nb-login-btn {
          background: transparent;
          border: 1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"};
          color: ${isDark ? "#ccc" : "#333"};
          padding: 7px 18px;
          border-radius: 99px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
          letter-spacing: 0.2px;
        }
        .nb-login-btn:hover {
          border-color: ${gold};
          color: ${gold};
          background: ${gold}10;
        }

        .nb-signup-btn {
          background: linear-gradient(135deg, ${gold} 0%, #a90f28 100%);
          border: none;
          color: #fff;
          padding: 8px 20px;
          border-radius: 99px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 18px ${gold}45;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          letter-spacing: 0.3px;
        }
        .nb-signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px ${gold}60;
        }

        .nb-logout-btn {
          background: rgba(239,68,68,0.06);
          border: 1.5px solid rgba(239,68,68,0.2);
          color: #ef4444;
          padding: 7px 18px;
          border-radius: 99px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .nb-logout-btn:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.4);
        }

        .nb-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${gold}, #a90f28);
          border: none;
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 2px 14px ${gold}55;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nb-avatar:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 20px ${gold}70;
        }

        .nb-theme-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"};
          border: 1.5px solid ${border};
          color: ${isDark ? "#fff" : "#333"};
          cursor: pointer;
          font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease, transform 0.3s ease, border-color 0.2s ease;
          flex-shrink: 0;
        }
        .nb-theme-btn:hover {
          background: ${isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.09)"};
          border-color: ${gold};
          transform: rotate(20deg) scale(1.08);
        }

        .nb-ham {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"};
          border: 1.5px solid ${border};
          color: ${text};
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .nb-ham:hover { border-color: ${gold}; background: ${gold}12; }

        .drawer-link {
          background: transparent;
          border: none;
          border-left: 3px solid transparent;
          color: ${isDark ? "#aaa" : "#555"};
          padding: 13px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          font-family: 'Sora', sans-serif;
          width: 100%;
          transition: background 0.18s, color 0.18s, border-color 0.18s, padding-left 0.18s;
          letter-spacing: 0.2px;
        }
        .drawer-link:hover {
          background: ${gold}10;
          color: ${gold};
          border-left-color: ${gold};
          padding-left: 20px;
        }
        .drawer-link.active {
          background: ${gold}15;
          color: ${gold};
          border-left-color: ${gold};
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: bg,
        backdropFilter: "blur(24px) saturate(200%)",
        WebkitBackdropFilter: "blur(24px) saturate(200%)",
        borderBottom: `1px solid ${border}`,
        height: 64,
        transition: "background 0.3s ease",
      }}>
        <div style={{
          maxWidth: 1300, margin: "0 auto", padding: "0 28px",
          height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Brand */}
          <div onClick={() => { goTo("home"); close(); }} style={{
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0,
          }}>
            <div style={{
              width: 38, height: 38,
              background: `linear-gradient(135deg, ${gold} 0%, #a90f28 100%)`,
              borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 13, color: "#fff", letterSpacing: 0.5,
              boxShadow: `0 4px 16px ${gold}50`,
            }}>NT</div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: 14, color: text, letterSpacing: 1.5, lineHeight: 1.1 }}>NAMMA TAXI</div>
              <div style={{ fontSize: 9.5, color: mutedText, letterSpacing: 1.5, fontWeight: 500 }}>AUTOMOTIVE</div>
            </div>
          </div>

          {/* Desktop */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`nb-link${page === item.key ? " active" : ""}`}
                onClick={() => goTo(item.key)}
              >
                {item.label}
              </button>
            ))}

            <div style={{ width: 1, height: 22, background: border, margin: "0 12px" }} />

            {session?.user_email || session?.admin_logged_in ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {session?.user_email && !session?.admin_logged_in && (
                  <button className="nb-avatar" onClick={() => setPage("profile")} title={session.user_email}>
                    {session.user_email.slice(0, 2).toUpperCase()}
                  </button>
                )}
                <button className="nb-logout-btn" onClick={onLogout}>Logout</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className="nb-login-btn" onClick={() => setPage("login")}>Login</button>
                <button className="nb-signup-btn" onClick={() => setPage("register")}>Sign Up</button>
              </div>
            )}

            <button className="nb-theme-btn" onClick={toggleTheme} style={{ marginLeft: 8 }}>
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile right */}
          <div className="nav-mobile" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <button className="nb-theme-btn" onClick={toggleTheme}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <button className="nb-ham" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div onClick={close} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 1100, backdropFilter: "blur(6px)",
        }} />
      )}

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 280,
        background: drawerBg,
        borderLeft: `1px solid ${border}`,
        zIndex: 1200, display: "flex", flexDirection: "column",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(.4,0,.2,1)",
        boxShadow: menuOpen ? "-16px 0 48px rgba(0,0,0,0.35)" : "none",
      }}>

        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 18px 14px",
          borderBottom: `1px solid ${border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 34, height: 34,
              background: `linear-gradient(135deg, ${gold}, #a90f28)`,
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 12, color: "#fff",
              boxShadow: `0 4px 14px ${gold}50`,
            }}>NT</div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 900, fontSize: 13, color: text, letterSpacing: 1 }}>NAMMA TAXI</div>
              <div style={{ fontSize: 9, color: mutedText, letterSpacing: 1 }}>AUTOMOTIVE</div>
            </div>
          </div>
          <button onClick={close} style={{
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${border}`,
            color: mutedText, width: 30, height: 30, borderRadius: 8,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`drawer-link${page === item.key ? " active" : ""}`}
              onClick={() => { goTo(item.key); close(); }}
            >
              {item.label}
            </button>
          ))}

          {session?.user_email && !session?.admin_logged_in && (
            <button className="drawer-link" onClick={() => { setPage("profile"); close(); }}
              style={{ color: gold, borderLeftColor: `${gold}60`, fontWeight: 700 }}>
              My Profile
            </button>
          )}

          <div style={{ height: 1, background: border, margin: "10px 4px" }} />

          {session?.user_email || session?.admin_logged_in ? (
            <button onClick={() => { onLogout(); close(); }} style={{
              background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.18)",
              color: "#ef4444", padding: "12px 16px", borderRadius: 10,
              cursor: "pointer", fontSize: 14, fontWeight: 600,
              textAlign: "left", fontFamily: "'Sora', sans-serif", width: "100%",
            }}>Logout</button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button onClick={() => { setPage("login"); close(); }} className="nb-login-btn" style={{ width: "100%", textAlign: "center", padding: "12px" }}>
                Login
              </button>
              <button onClick={() => { setPage("register"); close(); }} className="nb-signup-btn" style={{ width: "100%", textAlign: "center", padding: "12px" }}>
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Theme toggle bottom */}
        <div style={{ padding: "12px 10px 24px" }}>
          <button onClick={toggleTheme} style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            border: `1.5px solid ${border}`,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            color: isDark ? "#ccc" : "#555",
            fontSize: 13, cursor: "pointer", fontFamily: "'Sora', sans-serif",
            fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "border-color 0.2s, background 0.2s",
          }}>
            {isDark ? "☀️" : "🌙"}
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </div>
    </>
  );
}
