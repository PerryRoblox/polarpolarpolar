import React, { useState, useEffect, useRef } from "react";
import {
  Snowflake,
  ChevronDown,
  Monitor,
  Palette,
  Users,
  Calendar,
  Check,
  Mail,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";

// --- Global Styles for Animations ---
const GlobalStyles = () => (
  <style>{`
    @keyframes fall {
      0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
      100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
    }
    .snowflake {
      position: fixed;
      top: -10px;
      background: white;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      animation: fall linear infinite;
    }
    @keyframes revealIntro {
      0% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes slideUpOut {
      0% { transform: translateY(0); }
      100% { transform: translateY(-100vh); }
    }
    body {
      cursor: none; /* Hide default cursor to use custom one */
    }
    /* Fallback for devices without fine pointer */
    @media (pointer: coarse) {
      body { cursor: auto; }
      .custom-cursor { display: none; }
    }
  `}</style>
);

// --- Custom Cursor Component ---
const CustomCursor = ({ theme }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Immediate dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      // Delayed glowing trail (Liquid feel)
      if (cursorRef.current) {
        // using a slight timeout/requestAnimationFrame loop is smoother,
        // but css transition on transform handles basic smoothing well enough for a trail
        cursorRef.current.style.transform = `translate3d(${clientX - 16}px, ${
          clientY - 16
        }px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-colors duration-300
        ${
          theme === "dark"
            ? "bg-cyan-300 shadow-[0_0_10px_#67e8f9]"
            : "bg-cyan-600 shadow-[0_0_10px_#0891b2]"
        }`}
      />
      <div
        ref={cursorRef}
        className={`custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] transition-all duration-150 ease-out
        ${
          theme === "dark"
            ? "border border-cyan-400/50 bg-cyan-400/10 backdrop-blur-[2px]"
            : "border border-cyan-600/50 bg-cyan-600/10 backdrop-blur-[2px]"
        }`}
      />
    </>
  );
};

// --- Snow Particles Component ---
const Snow = ({ theme }) => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 4 + 2}px`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `-${Math.random() * 10}s`,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            opacity: flake.opacity,
            backgroundColor: theme === "dark" ? "white" : "#94a3b8", // Darker snow for light theme
          }}
        />
      ))}
    </div>
  );
};

// --- Reusable Liquid Glass Components ---
const GlassContainer = ({ children, className = "", theme }) => {
  const liquidDark =
    "bg-slate-900/40 backdrop-blur-2xl backdrop-saturate-150 border border-t-white/10 border-l-white/10 border-b-black/40 border-r-black/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] rounded-[2rem]";
  const liquidLight =
    "bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 shadow-[0_8px_32px_0_rgba(34,211,238,0.15),inset_0_0_20px_rgba(255,255,255,0.5)] rounded-[2rem]";

  return (
    <div
      className={`${
        theme === "dark" ? liquidDark : liquidLight
      } transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
};

const GlassButton = ({ children, onClick, primary, className = "", theme }) => {
  const isDark = theme === "dark";

  const darkPrimary =
    "bg-cyan-500/80 hover:bg-cyan-400/90 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] backdrop-blur-md";
  const lightPrimary =
    "bg-cyan-500/90 hover:bg-cyan-400 text-white shadow-[0_5px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.5)] backdrop-blur-md";

  const darkSecondary =
    "bg-white/5 hover:bg-white/10 text-cyan-50 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-md";
  const lightSecondary =
    "bg-white/40 hover:bg-white/60 text-slate-800 border border-cyan-200 hover:border-cyan-400 backdrop-blur-md shadow-sm";

  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2
        ${
          primary
            ? isDark
              ? darkPrimary
              : lightPrimary
            : isDark
            ? darkSecondary
            : lightSecondary
        } 
        ${className}`}
    >
      {children}
    </button>
  );
};

// --- Custom Ice Bear SVG Logo ---
const IceBearLogo = ({ className = "w-48 h-48", theme }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div
      className={`absolute inset-0 blur-[50px] rounded-full transition-colors duration-500 ${
        theme === "dark" ? "bg-cyan-500/20" : "bg-cyan-300/40"
      }`}
    ></div>
    <svg
      viewBox="0 0 200 200"
      className={`relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="60" r="25" fill="#f1f5f9" />
      <circle cx="150" cy="60" r="25" fill="#f1f5f9" />
      <circle cx="50" cy="60" r="15" fill="#e2e8f0" />
      <circle cx="150" cy="60" r="15" fill="#e2e8f0" />
      <ellipse cx="100" cy="110" rx="75" ry="65" fill="#f1f5f9" />
      <circle cx="70" cy="100" r="5" fill="#0f172a" />
      <circle cx="130" cy="100" r="5" fill="#0f172a" />
      <ellipse cx="100" cy="125" rx="20" ry="15" fill="#e2e8f0" opacity="0.5" />
      <ellipse cx="100" cy="120" rx="8" ry="5" fill="#0f172a" />
      <path
        d="M 90 130 Q 100 135 110 130"
        stroke="#0f172a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// --- Intro Splash Screen ---
const IntroScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setFading(true), 500); // Wait briefly at 100%
          setTimeout(onComplete, 1300); // Wait for slide up animation
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5; // Random jumps for realistic loading
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        fading ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div
        style={{ animation: "revealIntro 1s ease-out forwards" }}
        className="flex flex-col items-center"
      >
        <IceBearLogo theme="dark" className="w-32 h-32 mb-8 animate-pulse" />
        <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 mb-8">
          POLARUI
        </h1>
        {/* Loading Bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 text-cyan-500 font-mono text-sm">{progress}%</div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Stud Style");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [introComplete, setIntroComplete] = useState(false);

  // Handle navbar glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const workCategories = ["Stud Style", "Cartoony", "Anime", "Unique Styles"];

  const portfolioWorks = [
    { id: 1, category: "Stud Style", title: "Classic Stud Menu" },
    { id: 2, category: "Stud Style", title: "Blocky Inventory" },
    { id: 3, category: "Cartoony", title: "Bubbly Shop UI" },
    { id: 4, category: "Cartoony", title: "Toon HUD" },
    { id: 5, category: "Anime", title: "RPG Stat Screen" },
    { id: 6, category: "Anime", title: "Gacha Pull UI" },
    { id: 7, category: "Unique Styles", title: "Sci-Fi Glass Terminal" },
    { id: 8, category: "Unique Styles", title: "Minimalist Frost" },
  ];

  // Colors based on theme
  const bgClass =
    theme === "dark"
      ? "bg-slate-950 text-slate-200"
      : "bg-slate-50 text-slate-800";
  const headingClass = theme === "dark" ? "text-white" : "text-slate-900";
  const textMutedClass = theme === "dark" ? "text-slate-400" : "text-slate-600";

  if (!introComplete) {
    return (
      <>
        <GlobalStyles />
        <IntroScreen onComplete={() => setIntroComplete(true)} />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-500 ${bgClass}`}
    >
      <GlobalStyles />
      <CustomCursor theme={theme} />
      <Snow theme={theme} />

      {/* --- Ambient Background Effects --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full mix-blend-screen transition-colors duration-500 ${
            theme === "dark" ? "bg-cyan-600/20" : "bg-cyan-300/40"
          }`}
        ></div>
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[150px] rounded-full mix-blend-screen transition-colors duration-500 ${
            theme === "dark" ? "bg-blue-600/10" : "bg-blue-300/30"
          }`}
        ></div>
        <div
          className={`absolute top-[40%] left-[30%] w-[30%] h-[30%] blur-[100px] rounded-full mix-blend-screen transition-colors duration-500 ${
            theme === "dark" ? "bg-cyan-400/5" : "bg-white/60"
          }`}
        ></div>
        <div
          className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${
            theme === "dark" ? "opacity-[0.03]" : "opacity-[0.05] invert"
          }`}
        ></div>
      </div>

      {/* --- Navigation --- */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? (theme === "dark"
                ? "bg-slate-950/70 border-white/5"
                : "bg-white/70 border-slate-200/50") +
              " backdrop-blur-xl border-b py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => scrollTo("home")}
          >
            <Snowflake className="text-cyan-500 w-6 h-6 animate-pulse group-hover:rotate-180 transition-transform duration-700" />
            <span
              className={`font-black text-xl tracking-widest text-transparent bg-clip-text ${
                theme === "dark"
                  ? "bg-gradient-to-r from-white to-cyan-200"
                  : "bg-gradient-to-r from-slate-900 to-cyan-600"
              }`}
            >
              POLARUI{" "}
              <span className="font-light text-cyan-500 opacity-70">|</span>{" "}
              <span className="text-sm font-medium tracking-normal text-cyan-600">
                GRAPHICS DESIGNER
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6 md:gap-8 text-sm font-semibold tracking-wide">
            <button
              onClick={() => scrollTo("about")}
              className="hidden md:block hover:text-cyan-400 transition-colors"
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollTo("works")}
              className="hidden md:block hover:text-cyan-400 transition-colors"
            >
              WORKS
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="hidden md:block text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              PRICING
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110
                ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700 text-yellow-300"
                    : "bg-white/50 border-slate-200 text-slate-800 shadow-sm"
                }`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="relative z-10">
        {/* --- Hero Section --- */}
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center items-center pt-20 px-6 relative"
        >
          <div className="max-w-5xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-md
                ${
                  theme === "dark"
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                    : "bg-cyan-100/50 border-cyan-300 text-cyan-700"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                Currently accepting commissions
              </div>
              <h1
                className={`text-5xl md:text-7xl font-black leading-tight text-transparent bg-clip-text 
                ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-white via-cyan-100 to-cyan-600"
                    : "bg-gradient-to-br from-slate-900 via-cyan-700 to-cyan-400"
                }`}
              >
                Liquid.
                <br />
                Crisp.
                <br />
                Pixel Perfect.
              </h1>
              <p
                className={`text-lg md:text-xl max-w-md font-light leading-relaxed ${textMutedClass}`}
              >
                Specializing in high-quality, liquid glass user interfaces. I
                turn your ideas into freezing cold realities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <GlassButton
                  primary
                  theme={theme}
                  onClick={() => scrollTo("works")}
                >
                  View My Works <ExternalLink size={18} />
                </GlassButton>
                <GlassButton theme={theme} onClick={() => scrollTo("pricing")}>
                  Contact Me
                </GlassButton>
              </div>
            </div>
            <div
              className="order-1 md:order-2 flex justify-center animate-bounce"
              style={{ animationDuration: "4s" }}
            >
              <IceBearLogo theme={theme} />
            </div>
          </div>
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-cyan-500/50 hover:text-cyan-500 transition-colors"
            onClick={() => scrollTo("about")}
          >
            <ChevronDown size={32} />
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="about" className="py-24 px-6 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <h2 className={`text-4xl font-black ${headingClass}`}>
                About <span className="text-cyan-500">Me</span>
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Left Side: About Text */}
              <GlassContainer
                theme={theme}
                className="lg:col-span-7 p-8 md:p-10"
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    theme === "dark" ? "text-cyan-100" : "text-cyan-800"
                  }`}
                >
                  The Bear Behind the Screen 🐻‍❄️
                </h3>
                <div
                  className={`space-y-4 leading-relaxed font-light text-lg ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <p>
                    Hey there! I am{" "}
                    <strong className="text-cyan-500 font-bold">PolarUI</strong>
                    , a dedicated graphics designer with a passion for creating
                    sleek, icy, and highly functional user interfaces.
                  </p>
                  <p>
                    Inspired by the cool and collected nature of a certain polar
                    bear, my design philosophy revolves around clean layouts,
                    liquid glassmorphism, and maintaining a "cool" aesthetic no
                    matter the project theme.
                  </p>
                  <p>
                    Whether you need something blocky and studded, colorful and
                    cartoony, or a unique glass terminal, I've got the tools and
                    the chill factor to bring it to life.
                  </p>
                </div>
              </GlassContainer>

              {/* Right Side: Stats */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <GlassContainer
                  theme={theme}
                  className={`p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-cyan-500/20`}
                >
                  <Calendar className="w-8 h-8 text-cyan-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className={`text-3xl font-black mb-1 ${headingClass}`}>
                    1+
                  </span>
                  <span
                    className={`text-sm font-medium tracking-wide uppercase ${
                      theme === "dark" ? "text-cyan-200/70" : "text-cyan-700/70"
                    }`}
                  >
                    Years Active
                  </span>
                </GlassContainer>

                <GlassContainer
                  theme={theme}
                  className={`p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-blue-500/20`}
                >
                  <Monitor className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className={`text-3xl font-black mb-1 ${headingClass}`}>
                    50+
                  </span>
                  <span
                    className={`text-sm font-medium tracking-wide uppercase ${
                      theme === "dark" ? "text-cyan-200/70" : "text-cyan-700/70"
                    }`}
                  >
                    Projects Done
                  </span>
                </GlassContainer>

                <GlassContainer
                  theme={theme}
                  className={`p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-teal-500/20`}
                >
                  <Users className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className={`text-3xl font-black mb-1 ${headingClass}`}>
                    30+
                  </span>
                  <span
                    className={`text-sm font-medium tracking-wide uppercase ${
                      theme === "dark" ? "text-cyan-200/70" : "text-cyan-700/70"
                    }`}
                  >
                    Happy Clients
                  </span>
                </GlassContainer>

                <GlassContainer
                  theme={theme}
                  className={`p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-cyan-400/20`}
                >
                  <Palette className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className={`text-3xl font-black mb-1 ${headingClass}`}>
                    4
                  </span>
                  <span
                    className={`text-sm font-medium tracking-wide uppercase ${
                      theme === "dark" ? "text-cyan-200/70" : "text-cyan-700/70"
                    }`}
                  >
                    Style Ranges
                  </span>
                </GlassContainer>
              </div>
            </div>
          </div>
        </section>

        {/* --- Works Section --- */}
        <section id="works" className="py-24 px-6 scroll-mt-20 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className={`text-4xl font-black mb-4 ${headingClass}`}>
                My <span className="text-cyan-500">Works</span>
              </h2>
              <p className={`max-w-xl ${textMutedClass}`}>
                A collection of my finest icy creations across different themes.
              </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {workCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border backdrop-blur-md
                    ${
                      activeTab === cat
                        ? theme === "dark"
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          : "bg-cyan-500 text-white border-cyan-500 shadow-[0_5px_15px_rgba(34,211,238,0.3)]"
                        : theme === "dark"
                        ? "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        : "bg-white/40 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white/60 shadow-sm"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Works Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {portfolioWorks
                .filter((work) => work.category === activeTab)
                .map((work) => (
                  <GlassContainer
                    key={work.id}
                    theme={theme}
                    className="group overflow-hidden cursor-pointer hover:border-cyan-500/50 transition-all duration-500"
                  >
                    <div className={`aspect-video relative overflow-hidden rounded-t-[2rem] flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-200/50'}`}>
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-500
                        ${
                          theme === "dark"
                            ? "from-cyan-900/40 to-blue-900/40"
                            : "from-cyan-200/40 to-blue-200/40"
                        }`}
                      ></div>

                      {/* Inner liquid glass layer for image placeholder */}
                      <div className="absolute inset-4 backdrop-blur-md rounded-xl border border-white/20 bg-white/5 flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-105">
                        <Snowflake className="w-12 h-12 text-cyan-500/50 group-hover:text-cyan-500 transition-colors duration-500" />
                      </div>
                    </div>
                    <div className="p-6 relative z-10">
                      <div className="text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                        {work.category}
                      </div>
                      <h4
                        className={`text-xl font-bold transition-colors ${
                          theme === "dark"
                            ? "text-white group-hover:text-cyan-300"
                            : "text-slate-900 group-hover:text-cyan-600"
                        }`}
                      >
                        {work.title}
                      </h4>
                    </div>
                  </GlassContainer>
                ))}
            </div>

            {portfolioWorks.filter((work) => work.category === activeTab)
              .length === 0 && (
              <div className={`text-center py-12 ${textMutedClass}`}>
                More works coming soon to this category!
              </div>
            )}
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section id="pricing" className="py-24 px-6 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-black mb-4 ${headingClass}`}>
                Commission <span className="text-cyan-500">Prices</span>
              </h2>
              <p className={textMutedClass}>
                Simple, transparent, and cold-hard pricing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Pricing Tier 1 */}
              <GlassContainer
                theme={theme}
                className="p-8 relative flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${headingClass}`}>
                    Standard UI
                  </h3>
                  <div className="text-4xl font-black text-cyan-500 flex items-baseline gap-1">
                    $13{" "}
                    <span className={`text-lg font-medium ${textMutedClass}`}>
                      /pf
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  <li
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Price Depends on the theme too.</span>
                  </li>
                  <li
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>3-4 revisions only</span>
                  </li>
                  <li
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Reference / Optional</span>
                  </li>
                  <li
                    className={`flex items-start gap-3 opacity-70 ${textMutedClass}`}
                  >
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    </div>
                    <span>Not imported into studio</span>
                  </li>
                </ul>

                <GlassButton
                  theme={theme}
                  className="w-full mt-auto"
                  onClick={() => (window.location.href = "")}
                >
                  <Mail size={18} /> Contact Me
                </GlassButton>
              </GlassContainer>

              {/* Pricing Tier 2 */}
              <GlassContainer
                theme={theme}
                className={`p-8 relative flex flex-col h-full hover:-translate-y-2 transition-transform duration-300 ${
                  theme === "dark"
                    ? "border-cyan-400/40"
                    : "border-cyan-500 shadow-[0_10px_40px_rgba(6,182,212,0.2)]"
                }`}
              >
                {/* Highlight Badge */}
                <div className="absolute -top-4 right-8 bg-cyan-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  Premium
                </div>

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${headingClass}`}>
                    Advanced UI
                  </h3>
                  <div className="text-4xl font-black text-cyan-500 flex items-baseline gap-1">
                    $15-18{" "}
                    <span className={`text-lg font-medium ${textMutedClass}`}>
                      /pf
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  <li
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Price Depends on the theme too.</span>
                  </li>
                  <li
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>3-4 revisions only</span>
                  </li>
                  <li
                    className={`flex items-start gap-3 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Reference / Optional</span>
                  </li>
                  <li className="flex items-start gap-3 font-bold text-cyan-600 dark:text-cyan-300">
                    <Check className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    <span>Imported + Scaled</span>
                  </li>
                </ul>
                <GlassButton
                  theme={theme}
                  className="w-full mt-auto"
                  onClick={() =>
                    window.open("https://discord.gg/3axPzJNk7", "_blank")
                  }
                >
                  <Mail size={18} /> Contact Me{" "}
                </GlassButton>
              </GlassContainer>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer
        className={`border-t py-8 text-center relative z-10 transition-colors duration-500 
        ${
          theme === "dark"
            ? "border-white/10 bg-slate-950/50"
            : "border-slate-200 bg-white/50"
        } backdrop-blur-md`}
      >
        <div
          className={`flex items-center justify-center gap-2 mb-4 opacity-50 ${headingClass}`}
        >
          <Snowflake size={16} />
          <span className="font-bold tracking-widest text-sm">POLARUI</span>
        </div>
        <p className={`text-sm font-light ${textMutedClass}`}>
          © {new Date().getFullYear()} PolarUI Graphics. Stay frosty. 🐻‍❄️
        </p>
      </footer>
    </div>
  );
}
