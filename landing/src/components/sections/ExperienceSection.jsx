import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionIntro from "../SectionIntro";
import SectionReveal from "../SectionReveal";

const pillars = [
  {
    title: "Not another player window",
    copy: "Paraline stays in the periphery and turns the whole desktop into the stage.",
  },
  {
    title: "Soft by default",
    copy: "Glow, pressure, drift, and light that stays atmospheric even during long sessions.",
  },
  {
    title: "Reactive without shouting",
    copy: "Designed for focus setups, music nights, and ambient desktops that still feel alive.",
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const stageY = useTransform(scrollYProgress, [0, 1], [80, -50]);
  const stageRotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section ref={sectionRef} className="relative px-6 py-28 sm:px-8">
      <SectionReveal className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionIntro
            eyebrow="Visual Experience"
            title="Light, pressure, motion."
            body="A restrained visual language built to feel ambient, architectural, and quietly alive."
          />

          <div className="mt-10 grid gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-5">
                <h3 className="font-display text-2xl text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{pillar.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div style={{ y: stageY, rotate: stageRotate }} className="relative">
          <div className="absolute -left-10 top-12 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -right-6 bottom-12 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,10,22,0.96),rgba(7,10,18,0.84))] p-6 shadow-aura md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.12),transparent_38%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_24%)]" />

            <div className="relative h-[28rem] rounded-[1.8rem] border border-white/8 bg-slate-950/80 p-6">
              <div className="absolute left-6 right-6 top-6 h-px bg-gradient-to-r from-transparent via-cyan-200/85 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent" />
              <div className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-transparent via-cyan-200/42 to-transparent" />
              <div className="absolute bottom-6 right-6 top-6 w-px bg-gradient-to-b from-transparent via-fuchsia-200/28 to-transparent" />

              <motion.div
                className="absolute inset-x-12 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent blur-[1px]"
                animate={{
                  scaleX: [0.78, 1.05, 0.86, 1],
                  opacity: [0.4, 1, 0.58, 0.4],
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="absolute inset-x-14 top-[38%] h-12 rounded-full bg-cyan-300/12 blur-3xl"
                animate={{ opacity: [0.15, 0.42, 0.18], y: [-12, 10, -12] }}
                transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="max-w-xs">
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/68">Screen Edge Presence</p>
                  <h3 className="mt-4 font-display text-4xl leading-none text-white">Designed to disappear until the beat lands.</h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-white/44">Motion</p>
                    <p className="mt-3 text-sm leading-7 text-white/70">Parallax layers and edge traces keep the page calm but active.</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-white/44">Performance</p>
                    <p className="mt-3 text-sm leading-7 text-white/70">CSS gradients, transforms, and a few motion loops. No heavy scene rendering.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionReveal>
    </section>
  );
}
