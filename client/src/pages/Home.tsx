import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clipboard,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Navigation,
  Route as RouteIcon,
  Send,
  Sun,
  X,
} from "lucide-react";

type Project = {
  number: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  href?: string;
  status: "completed" | "in progress" | "archived";
  defense: string;
  accent: string;
};

const projects: Project[] = [
  {
    number: "01",
    name: "Rydora",
    category: "web platform",
    description: "A smart shuttle coordination platform for the 42 Irbid community.",
    stack: ["React", "Firebase", "Firestore", "Leaflet"],
    status: "completed",
    defense: "Draft — The central challenge was bringing authentication, cloud data, and a map-based shuttle workflow into one usable product. I chose React with Firebase services and Leaflet so the interface could stay focused on the real coordination problem. Replace this with the hardest decision you personally faced, the alternatives you considered, and why you chose this path.",
    accent: "orange",
    href: "https://github.com/qusai-r03/42-smart-shuttle",
  },
  {
    number: "02",
    name: "Pac-Man",
    category: "game systems",
    description: "A Pygame implementation of movement, scoring, game rules, and ghost behavior.",
    stack: ["Python", "Pygame"],
    status: "completed",
    defense: "Draft — The difficult part was keeping several systems consistent at once: player movement, collision rules, scoring, and ghost behavior. I treated each rule as a separate piece of game state so that fixing one mechanic would not quietly break another. Replace this draft with the exact bug or mechanic I personally solved.",
    accent: "teal",
  },
  {
    number: "03",
    name: "push_swap",
    category: "algorithm design",
    description: "Sorting data efficiently under a strict set of stack operations.",
    stack: ["C", "Stacks", "Complexity"],
    status: "completed",
    defense: "Draft — I approached push_swap as a constrained pathfinding problem: the goal was not only to sort, but to reach the sorted state with a limited vocabulary of operations. I used a strategy that separates the decision of what to move from the execution of stack operations. Replace this with the exact algorithm you used, plus a real move count if you have one.",
    accent: "amber",
    href: "https://github.com/qusai-r03",
  },
  {
    number: "04",
    name: "Inception",
    category: "infrastructure",
    description: "A multi-service environment built around Linux, Docker, and container boundaries.",
    stack: ["Linux", "Docker", "Containers"],
    status: "completed",
    defense: "Draft — The hardest part was understanding how the services depend on each other and how container boundaries change the way you debug. I learned to treat configuration, networking, volumes, and startup order as one system rather than isolated files. Replace this with the specific service or setup issue you solved.",
    accent: "orange",
  },
  {
    number: "05",
    name: "A-Maze-ing",
    category: "problem solving",
    description: "An algorithmic project focused on representing, solving, and reasoning about mazes.",
    stack: ["Algorithms", "Graphs", "Python"],
    status: "completed",
    defense: "Draft — The challenge was translating a maze from a visual problem into a representation that an algorithm could inspect and solve. I focused on making the representation explicit first, then separating generation, validation, and solving so each part could be reasoned about. Replace this with the concrete algorithm or edge case you handled.",
    accent: "teal",
  },
];

const navItems = [
  { id: "training", label: "Projects" },
  { id: "about", label: "About" },
  { id: "instruments", label: "Instruments" },
  { id: "destination", label: "Contact" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function matchesProjectFilter(project: Project, filter: string) {
  if (filter === "all") return true;
  if (filter === "web") return project.category.includes("web") || project.stack.some((item) => ["react", "firebase", "leaflet"].includes(item.toLowerCase()));
  if (filter === "systems") return project.category.includes("infrastructure") || project.stack.some((item) => ["linux", "docker", "containers", "c"].includes(item.toLowerCase()));
  if (filter === "algorithms") return project.category.includes("algorithm") || project.category.includes("problem") || project.stack.some((item) => ["stacks", "complexity", "graphs"].includes(item.toLowerCase()));
  if (filter === "games") return project.category.includes("game");
  return true;
}

function RouteLine({ active }: { active: string }) {
  const markers = ["origin", "about", "training", "instruments", "checkpoint", "destination"];
  const progress = `${Math.max(0, markers.indexOf(active)) / (markers.length - 1) * 100}%`;
  return (
    <aside className="route-rail" aria-label="Route progress">
      <div className="route-line"><span className="route-line-progress" style={{ height: progress }} /></div>
      {markers.map((marker, index) => {
        const isActive = markers.indexOf(active) >= index;
        return (
          <span
            key={marker}
            className={`route-marker route-marker--${marker} ${isActive ? "is-active" : ""}`}
            aria-hidden="true"
          >
            <span>{String(index).padStart(2, "0")}</span>
          </span>
        );
      })}
    </aside>
  );
}

function MapPanel() {
  return (
    <div className="map-panel" aria-label="Illustrated Rydora shuttle route map">
      <div className="map-grid" />
      <div className="map-copy map-copy--top">IRBID / 32.55° N</div>
      <div className="map-copy map-copy--bottom">ROUTE TRACE / 01</div>
      <svg className="route-map" viewBox="0 0 520 360" role="img" aria-label="A route connecting three shuttle stops">
        <path className="map-road" d="M20 280 C90 245 92 175 160 170 S245 228 300 175 S382 75 488 98" />
        <path className="map-road map-road--thin" d="M15 98 C86 125 114 72 186 82 S278 134 346 130 S411 198 505 188" />
        <path className="map-route" d="M43 264 C100 236 111 169 165 170 S249 219 299 174 S389 90 472 101" />
        <circle className="map-stop" cx="43" cy="264" r="7" />
        <circle className="map-stop" cx="165" cy="170" r="7" />
        <circle className="map-stop map-stop--active" cx="299" cy="174" r="9" />
        <circle className="map-stop" cx="472" cy="101" r="7" />
        <g className="map-label map-label--one"><rect x="19" y="288" width="88" height="25" /><text x="32" y="305">NORTH GATE</text></g>
        <g className="map-label map-label--two"><rect x="130" y="128" width="91" height="25" /><text x="143" y="145">UNIVERSITY</text></g>
        <g className="map-label map-label--three"><rect x="270" y="200" width="104" height="25" /><text x="283" y="217">42 IRBID / LIVE</text></g>
        <g className="map-label map-label--four"><rect x="413" y="60" width="86" height="25" /><text x="426" y="77">EAST LOOP</text></g>
      </svg>
      <div className="map-legend"><span className="legend-dot" /> active route <span className="legend-line" /> shuttle corridor</div>
    </div>
  );
}

function ProjectVisualization({ name }: { name: string }) {
  if (name === "push_swap") return <div className="project-visual project-visual--stack" aria-label="Animated push_swap stack visualization"><span className="visual-caption">operations / ra · pb</span><div className="stack-visual"><div><b>stack a</b><i>3</i><i>5</i><i>1</i></div><span className="stack-operation">pb →</span><div><b>stack b</b><i>1</i><i>2</i><i>4</i></div></div></div>;
  if (name === "Pac-Man") return <div className="project-visual project-visual--pacman" aria-label="Pac-Man maze and ghost path visualization"><span className="visual-caption">player / ghost logic</span><div className="pac-grid">{Array.from({ length: 28 }, (_, index) => <i key={index} className={index === 7 ? "pac-player" : index === 20 ? "pac-ghost" : index % 5 === 0 ? "pac-wall" : "pac-dot"} />)}</div><span className="pac-path" /></div>;
  if (name === "Inception") return <div className="project-visual project-visual--inception" aria-label="Inception service diagram"><span className="visual-caption">service topology</span><div className="service-diagram"><b>internet</b><span>│</span><b>nginx</b><span>│</span><div><b>wordpress</b><em>mariadb</em></div></div></div>;
  if (name === "A-Maze-ing") return <div className="project-visual project-visual--maze" aria-label="A-Maze-ing maze visualization"><span className="visual-caption">solve / trace</span><div className="maze-visual">{Array.from({ length: 35 }, (_, index) => <i key={index} className={[1, 2, 8, 9, 15, 16, 22, 23, 29, 30].includes(index) ? "maze-wall" : "maze-path"} />)}<span className="maze-trace" /></div></div>;
  return <div className="project-visual project-visual--rydora" aria-label="Rydora route visualization"><span className="visual-caption">shuttle / live route</span><svg viewBox="0 0 150 65" role="img"><path d="M8 52 C35 47 23 16 55 22 S84 58 111 29 S127 12 145 15" /><circle cx="8" cy="52" r="3" /><circle cx="55" cy="22" r="3" /><circle cx="111" cy="29" r="4" /><circle cx="145" cy="15" r="3" /></svg></div>;
}

function ProjectRow({ project, open, onToggle }: { project: Project; open: boolean; onToggle: () => void }) {
  return (
    <article className={`project-row project-row--${project.accent} ${open ? "is-open" : ""}`}>
      <span className="project-stamp" aria-hidden="true"><strong>Qusai_R03</strong><small>v{project.number} · 2026</small></span>
      <button className="project-trigger" onClick={onToggle} aria-expanded={open}>
        <span className="project-number">{project.number}</span>
        <span className="project-main">
          <span className="project-name-line"><strong>{project.name}</strong><span className="project-category">{project.category}</span><span className={`project-status project-status--${project.status.replace(" ", "-")}`}>{project.status}</span></span>
          <span className="project-description">{project.description}</span>
          <span className="project-view-details">{open ? "Close details" : "View details"} <ArrowUpRight size={12} /></span>
        </span>
        <ProjectVisualization name={project.name} />
        <span className="project-toggle"><ChevronDown size={18} /></span>
      </button>
      <div className="project-details">
        <div className="details-inner">
          <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="defense-note"><span className="defense-label">The defense</span><p>{project.defense}</p></div>
          {project.href && <a className="text-link" href={project.href} target="_blank" rel="noreferrer">Explore repository <ArrowUpRight size={15} /></a>}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("origin");
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("qusai-theme") === "dark");
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    localStorage.setItem("qusai-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    const onScroll = () => setShowBackToTop(window.scrollY > 620);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    const sections = ["origin", "about", "training", "instruments", "checkpoint", "destination"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-22% 0px -56% 0px", threshold: [0, 0.3, 0.7] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText("qusaiq891@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <div className={`site-loader ${isLoading ? "is-visible" : "is-done"}`} aria-hidden={!isLoading}><div className="loader-mark"><span /><span /><span /></div><span className="loader-label">finding the route</span></div>
    <div className={`site-shell ${darkMode ? "theme-night" : ""}`}>
      <header className="site-header">
        <button className="brand" onClick={() => scrollToId("origin")} aria-label="Back to origin">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>QUSAI ALRAWABDAH <i>/ ENGINEERING PORTFOLIO</i></span>
        </button>
        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
          {navItems.map((item) => <button key={item.id} className={activeSection === item.id ? "is-current" : ""} onClick={() => { scrollToId(item.id); setMenuOpen(false); }}>{item.label}</button>)}
          <a className="header-github" href="https://github.com/qusai-r03" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
        </nav>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}<span>{darkMode ? "light" : "dark"}</span></button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </header>

      <RouteLine active={activeSection} />
      <main>
        <section id="origin" className="section origin-section">
          <div className="origin-grid">
            <div className="eyebrow"><span className="eyebrow-rule" /> origin / irbid, jordan</div>
            <div className="origin-copy">
              <p className="coordinate">32.55° N&nbsp;&nbsp;35.85° E <span>—</span> 2026 route brief</p>
              <div className="title-kicker"><span className="title-kicker-line" /> personal route / qsa-001</div>
              <h1 className="name-title"><span className="name-first">Qusai</span><span className="name-last">Alrawabdah</span><span className="name-underline" /></h1>
              <div className="title-subline"><span className="title-subline-mark">↳</span><em>finds better paths.</em><span className="title-subline-rule" /></div>
              <p className="hero-tagline">Through complex systems.</p>
              <p className="lede">I’m a Computer Science student building practical systems, algorithms, and interfaces at the intersection of a problem and its shortest correct path.</p>
              <div className="origin-meta"><span>CS @ Yarmouk University</span><span>Software Engineering @ 42 Irbid</span><span>Graduating January 2027</span></div>
              <div className="origin-actions"><button className="primary-action" onClick={() => scrollToId("rydora")}>View the route <ArrowDownRight size={17} /></button><a className="secondary-action" href="/manus-storage/qusai-alrawabdah-cv_2ea5410f.pdf" download>Download résumé <ArrowDownRight size={16} /></a><a className="secondary-action" href="mailto:qusaiq891@gmail.com">Get in touch <Mail size={16} /></a></div>
            </div>
            <div className="origin-stamp"><span>Qusai_R03</span><small>FIELD NOTES<br />/ 001</small></div>
            <div className="hero-instrument" aria-label="Route instrument showing Qusai's current direction">
              <div className="instrument-header"><span>route instrument</span><strong>QSA / 001</strong></div>
              <svg className="hero-route-svg" viewBox="0 0 330 300" role="img" aria-label="A route passing through systems, algorithms, and interfaces">
                <path className="hero-contour hero-contour--one" d="M8 214 C70 185 41 120 102 105 S151 170 190 142 S211 46 318 68" />
                <path className="hero-contour hero-contour--two" d="M2 258 C67 250 71 214 119 223 S175 278 220 233 S270 190 330 202" />
                <path className="hero-route-path" d="M22 210 C74 184 52 124 105 110 S154 169 188 143 S214 60 305 73" />
                <circle className="hero-node" cx="22" cy="210" r="5" /><circle className="hero-node" cx="105" cy="110" r="5" /><circle className="hero-node hero-node--active" cx="188" cy="143" r="7" /><circle className="hero-node" cx="305" cy="73" r="5" />
                <text x="3" y="237">ORIGIN</text><text x="85" y="91">SYSTEMS</text><text x="164" y="173">NOW</text><text x="276" y="54">NEXT</text>
              </svg>
              <div className="instrument-readout"><span><small>heading</small><strong>better paths</strong></span><span><small>status</small><strong className="readout-live"><i /> moving</strong></span></div>
              <div className="instrument-coords">32.55° N&nbsp;&nbsp;35.85° E <span>//</span> IRBID</div>
            </div>
            <div className="profile-card">
              <div className="profile-photo-wrap"><img src="/manus-storage/qusai-profile_490fb725.jpeg" alt="Portrait of Qusai Alrawabdah" /></div>
              <div className="profile-card-meta"><span>field portrait</span><strong>Qusai_R03 / IRBID</strong></div>
              <button className="profile-about-link" onClick={() => scrollToId("about")}>About Qusai <ArrowDownRight size={10} /></button>
            </div>
          </div>
          <div className="route-brief"><span>route brief</span><strong>A portfolio as a map of decisions, not a list of claims.</strong><Navigation size={17} /></div>
        </section>

        <section id="about" className="section about-section">
          <div className="about-layout"><div><span className="section-kicker">about the route / working profile</span><h2>Build it. Defend it.<br /><em>Keep moving.</em></h2><a className="cv-download" href="/manus-storage/qusai-alrawabdah-cv_2ea5410f.pdf" download><Download size={15} /> Download CV <ArrowDownRight size={14} /></a></div><div className="about-copy"><span className="section-stamp" aria-hidden="true"><strong>Qusai_R03</strong><small>profile / 2026</small></span><p>I’m a final-semester Computer Science student at Yarmouk University and a Software Engineering student at 42 Irbid. I learn by building under constraints, explaining decisions to other people, and iterating until the system is clearer than when I found it.</p><p className="about-open"><span className="status-pulse" /> Open to software engineering internships and entry-level opportunities.</p><div className="about-facts"><span><small>education</small><strong>Yarmouk University · CS</strong></span><span><small>community</small><strong>42 Irbid · Software Engineering</strong></span><span><small>graduation</small><strong>January 2027</strong></span><span><small>location</small><strong>Irbid, Jordan</strong></span></div></div></div>
        </section>

        <section id="training" className="section waypoint-section training-section">
          <div className="section-heading"><div><span className="section-kicker">waypoints 01—05 / project route</span><h2>Learning by defending the path.</h2></div><span className="section-index">01 — 05</span></div>
          <div className="training-intro"><p>42’s project-based model turns implementation into a checkpoint: make a choice, explain it to a peer, and keep moving. These are the systems and algorithms that shaped the route.</p><span className="pass-stamp">peer<br />evaluated</span></div>
          <div className="project-list">{projects.map((project) => <ProjectRow key={project.name} project={project} open={openProject === project.name} onToggle={() => setOpenProject(openProject === project.name ? null : project.name)} />)}</div>
        </section>

        <section id="instruments" className="section waypoint-section instruments-section">
          <div className="section-heading"><div><span className="section-kicker">instruments / current loadout</span><h2>Tools for finding the route.</h2></div><span className="section-index">06 — 06</span></div>
          <div className="instrument-grid">
            <div className="instrument-group"><span className="instrument-code">SYS / 01</span><h3>Systems</h3><p>Closer to the machine, where constraints become useful.</p><div className="instrument-tags"><span>C</span><span>Linux</span><span>Docker</span><span>Git</span><span>Memory management</span></div></div>
            <div className="instrument-group"><span className="instrument-code">WEB / 02</span><h3>Web</h3><p>Interfaces and services that make a system usable.</p><div className="instrument-tags"><span>React</span><span>Vite</span><span>JavaScript</span><span>Tailwind</span><span>Firebase</span><span>Leaflet</span></div></div>
            <div className="instrument-group"><span className="instrument-code">MOB / 03</span><h3>Mobile & data</h3><p>Practical applications with a place for every piece of state.</p><div className="instrument-tags"><span>Java</span><span>Android</span><span>SQLite</span><span>Firestore</span><span>Firebase Auth</span></div></div>
          </div>
        </section>

        <section id="checkpoint" className="section checkpoint-section">
          <div className="checkpoint-mark"><Check size={18} /></div><div><span className="section-kicker">checkpoint / certification</span><h2>Fundamentals of Deep Learning</h2><p>NVIDIA certification — a deliberate stop to understand the foundations before taking the next route.</p></div><span className="checkpoint-code">NVIDIA / DL-FOUNDATIONS</span>
        </section>

        <section id="destination" className="section destination-section">
          <div className="destination-top"><div><span className="section-kicker">destination / open to the next system</span><h2>Where the next system<br /><em>needs building.</em></h2></div><div className="contact-stamp section-stamp" aria-hidden="true"><strong>Qusai_R03</strong><small>contact / 2026</small></div><RouteIcon size={38} strokeWidth={1.2} /></div>
          <p className="destination-copy">I’m looking for internship and entry-level opportunities in software engineering, computer science, and the wider 42 ecosystem.</p>
          <div className="contact-actions"><a className="contact-card" href="mailto:qusaiq891@gmail.com"><span className="contact-icon"><Mail size={19} /></span><span><small>write to me</small><strong>qusaiq891@gmail.com</strong></span><ArrowUpRight size={18} /></a><a className="contact-card" href="https://github.com/qusai-r03" target="_blank" rel="noreferrer"><span className="contact-icon"><Github size={19} /></span><span><small>code archive</small><strong>github.com/qusai-r03</strong></span><ArrowUpRight size={18} /></a><a className="contact-card" href="https://www.linkedin.com/in/qusai-alrawabdeh-50183830a/" target="_blank" rel="noreferrer"><span className="contact-icon"><Linkedin size={19} /></span><span><small>professional route</small><strong>LinkedIn / Qusai Alrawabdeh</strong></span><ArrowUpRight size={18} /></a></div>
          <button className="copy-email" onClick={copyEmail}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? "email copied" : "copy email"}</button>
        </section>
      </main>
      <footer className="site-footer"><span>WAYPOINTS / QUSAI ALRAWABDAH</span><span>made in Irbid · 2026</span><button onClick={() => scrollToId("origin")}>return to origin ↑</button></footer>
      <button className={`back-to-top ${showBackToTop ? "is-visible" : ""}`} onClick={() => scrollToId("origin")} aria-label="Back to top"><ArrowUpRight size={16} /> <span>top</span></button>
    </div>
    </>
  );
}
