import { motion } from "framer-motion";
import SectionReveal from "../SectionReveal";

const githubUrl = "https://github.com/SamXop123/Paraline";

export default function CTASection({ downloadUrl, isHostedInstaller, onDownloadClick }) {
  return (
    <section id="download" className="px-6 pb-24 pt-8 sm:px-8 sm:pb-28">
      <SectionReveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,28,0.96),rgba(5,8,18,0.98))] px-6 py-12 shadow-aura sm:px-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(96,165,250,0.12),transparent_28%)]" />
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Download</p>
              <h2 className="mt-4 font-display text-4xl leading-none text-white sm:text-5xl">Bring your desktop edges to life.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                Install Paraline for Windows and turn the desktop into a softer, <br></br>more reactive space.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
                <a
                  href={downloadUrl}
                  download={isHostedInstaller ? undefined : "Paraline-Setup.exe"}
                  onClick={onDownloadClick}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-100"
                >
                  Download Installer
                </a>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs uppercase tracking-[0.26em] text-white/62 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  View GitHub
                </a>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/42">Windows 10 / 11</p>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
