import { motion } from "framer-motion";

export default function PreviewStage({ theme }) {
  return (
    <motion.div
      className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(12,18,34,0.92),rgba(6,10,22,0.92))] p-3 shadow-soft"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-10 top-3 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-20 w-28 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[1.3rem]"
        initial={{ opacity: 0.82, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={theme.preview}
          alt={`${theme.name} preview`}
          className="preview-image block h-full w-full rounded-[1.3rem] object-cover"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 rounded-[1.3rem] border border-white/6" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.3rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_78%,rgba(255,255,255,0.04))]" />
      </motion.div>
    </motion.div>
  );
}
