import SectionIntro from "../SectionIntro";
import ThemeCard from "../previews/ThemeCard";
import { themes } from "../../data/themes";

export default function ThemeShowcaseSection() {
  return (
    <section id="themes" className="px-6 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Theme Showcase"
          title="Eleven themes. One edge."
          body="Every mode currently in Paraline, translated into lightweight interactive previews."
          align="center"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {themes.map((theme, index) => (
            <ThemeCard key={theme.key} theme={theme} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
