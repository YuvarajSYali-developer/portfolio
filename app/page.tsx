import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Research from "@/components/sections/Research";
import Metrics from "@/components/sections/Metrics";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import Interlude from "@/components/sections/Interlude";
import Highlights from "@/components/sections/Highlights";

export default function Home() {
  return (
    <>
      <main id="main" className="relative z-10 bg-transparent">
        <Hero />
        <div className="relative">
          <Highlights />
          <About />
          <Experience />
          <Interlude
            startAt={3}
            poster="/images/interlude-neural.webp"
            caption="Nature · Networks"
            lines={["Patterns in nature.", "Intelligence in systems."]}
          />
          <Projects />
          <Research />
          <Interlude
            startAt={10}
            poster="/images/interlude-signal.webp"
            caption="Neural signals"
            lines={["From neural signals", "to working software."]}
          />
          <Metrics />
          <Skills />
          <Education />
          <Certifications />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
