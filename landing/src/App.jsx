import { motion } from "framer-motion";
import HeroSection from "./components/sections/HeroSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import ThemeShowcaseSection from "./components/sections/ThemeShowcaseSection";
import CTASection from "./components/sections/CTASection";

const downloadUrl = import.meta.env.VITE_DOWNLOAD_URL || "/downloads/Paraline-Setup.exe";
const isHostedInstaller = /^https?:\/\//.test(downloadUrl);

export default function App() {
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

      <div className="relative z-10">
        <header className="fixed inset-x-0 top-0 z-40">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
            <a href="#hero" className="text-xs uppercase tracking-[0.45em] text-white/70 transition hover:text-white">
              Paraline
            </a>
            <a
              href={downloadUrl}
              download={isHostedInstaller ? undefined : "Paraline-Setup.exe"}
              className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/82 backdrop-blur transition hover:border-cyan-300/35 hover:bg-white/10 hover:text-white"
            >
              Windows Installer
            </a>
          </div>
        </header>

        <main>
          <HeroSection downloadUrl={downloadUrl} isHostedInstaller={isHostedInstaller} />
          <ExperienceSection />
          <ThemeShowcaseSection />
          <CTASection downloadUrl={downloadUrl} isHostedInstaller={isHostedInstaller} />
        </main>
      </div>
    </div>
  );
}
