import { motion } from "framer-motion";

const edgeConfig = [
  { className: "left-8 right-8 top-6 h-px", delay: 0 },
  { className: "bottom-6 left-8 right-8 h-px", delay: 0.8 },
  { className: "bottom-10 left-6 top-10 w-px", delay: 1.4 },
  { className: "bottom-10 right-6 top-10 w-px", delay: 2 },
];

export default function EdgePulseFrame() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {edgeConfig.map((edge) => (
        <motion.div
          key={edge.className}
          className={`absolute overflow-hidden rounded-full bg-white/6 ${edge.className}`}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.18, 0.65, 0.2] }}
          transition={{ duration: 6.5, repeat: Infinity, delay: edge.delay, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.85),transparent)]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4.4, repeat: Infinity, delay: edge.delay, ease: "linear" }}
          />
        </motion.div>
      ))}

      <div className="absolute left-16 top-16 h-20 w-20 rounded-full border border-cyan-300/20 blur-[2px]" />
      <div className="absolute bottom-16 right-16 h-24 w-24 rounded-full border border-fuchsia-300/16 blur-[2px]" />
    </div>
  );
}
