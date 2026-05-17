const footerLinks = [
  { label: "Contact", href: "https://github.com/SamXop123/Paraline/issues" },
  { label: "Terms", href: "https://github.com/SamXop123/Paraline/blob/main/README.md" },
  { label: "Privacy", href: "https://github.com/SamXop123/Paraline/blob/main/README.md" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">
          © {new Date().getFullYear()} Paraline
        </p>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-[11px] uppercase tracking-[0.28em] text-white/52 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
