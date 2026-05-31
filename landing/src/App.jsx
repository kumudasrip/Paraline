import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import HeroSection from "./components/sections/HeroSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import ThemeShowcaseSection from "./components/sections/ThemeShowcaseSection";
import CTASection from "./components/sections/CTASection";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import InstallationGuide from "./components/pages/InstallationGuide";
import TermsPage from "./components/pages/TermsPage";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import FAQPage from "./components/pages/FAQPage";
import SystemRequirements from "./components/pages/SystemRequirements"; // ← NEW

const downloadUrl = import.meta.env.VITE_DOWNLOAD_URL || "https://github.com/SamXop123/Paraline/releases/download/v1.2.0/Paraline-Setup-1.2.0.exe";
const isHostedInstaller = /^https?:\/\//.test(downloadUrl);
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
const githubUrl = "https://github.com/SamXop123/Paraline";

export default function App() {
  useEffect(() => {
    if (!gaMeasurementId) {
      return undefined;
    }

    if (document.querySelector('script[data-paraline-ga="true"]')) {
      return undefined;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtagProxy() {
        window.dataLayer.push(arguments);
      };

    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId);

    const script = document.createElement("script");
    script.defer = true;
    script.async = true;
    script.dataset.paralineGa = "true";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const trackDownloadClick = (location) => {
    if (typeof window.gtag !== "function" || !gaMeasurementId) {
      return;
    }

    window.gtag("event", "download_click", {
      location,
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log(isSidebarOpen);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-midnight text-white">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.06),transparent_24%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_28%)]" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ scale: [1, 1.18, 0.96, 1], opacity: [0.35, 0.55, 0.28, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="relative z-10">
        <header className="fixed inset-x-0 top-0 z-40 border border-gray-700 bg-[#02040c]/10 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
            <button
              onClick={toggleSidebar}
              className="absolute top-5 left-5">
                <img src='./sidebar-icons/menu.svg' className="h-8 w-10 object-contain"/>
            </button>

            <a 
              href="#hero" 
              onClick={() => setCurrentPage("home")}
              className="text-xs uppercase tracking-[0.45em] text-white/70 transition hover:text-white"
            >
              Paraline
            </a>

            <div className="flex items-center gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] uppercase tracking-[0.28em] text-white/52 transition hover:text-white"
              >
                GitHub
              </a>
              <a
                href={downloadUrl}
                download={isHostedInstaller ? undefined : "Paraline-Setup.exe"}
                onClick={() => trackDownloadClick("navbar")}
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/82 backdrop-blur transition hover:border-cyan-300/35 hover:bg-white/10 hover:text-white"
              >
                Windows Installer
              </a>
            </div>
          </div>
        </header>

        <main>
          {currentPage === "home" ? (
            <>
              <section id="hero" className="scroll-mt-28">
                <HeroSection
                  downloadUrl={downloadUrl}
                  isHostedInstaller={isHostedInstaller}
                  onDownloadClick={() => trackDownloadClick("hero")}
                  setCurrentPage={setCurrentPage}
              />
              </section>
              <section id="experience" className="scroll-mt-28">
                <ExperienceSection />
              </section>
              <section id="themes" className="scroll-mt-28">
                <ThemeShowcaseSection />
              </section>
              <section id="settings" className="scroll-mt-28">
                <CTASection
                  downloadUrl={downloadUrl}
                  isHostedInstaller={isHostedInstaller}
                  onDownloadClick={() => trackDownloadClick("cta")}
                  setCurrentPage={setCurrentPage}
                />
              </section>
            </>
          ) : currentPage === "installation" ? (
            <InstallationGuide setCurrentPage={setCurrentPage} />
          ) : currentPage === "terms" ? (
            <TermsPage setCurrentPage={setCurrentPage} />
          ) : currentPage === "privacy" ? (
            <PrivacyPolicy setCurrentPage={setCurrentPage} />
          ) : currentPage === "faq" ? (
            <FAQPage setCurrentPage={setCurrentPage} />
          ) : currentPage === "system-requirements" ? ( // ← NEW
            <SystemRequirements setCurrentPage={setCurrentPage} />
          ) : null}
        </main>
        <Footer setCurrentPage={setCurrentPage} />
      </div>

      <Analytics />
    </div>
  );
}
