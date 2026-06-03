import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Atom,
  Banknote,
  Beaker,
  Brain,
  CheckCircle2,
  CircleDollarSign,
  Dna,
  ExternalLink,
  FlaskConical,
  Gauge,
  HeartPulse,
  Layers3,
  Lightbulb,
  Microscope,
  Moon,
  Orbit,
  Pill,
  Radiation,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TimerReset,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import "./App.css";

type PayloadKey = "pdt" | "auger" | "alpha" | "beta";
type MoleculeKey =
  | "2DG-PEG3-TPP-Ce6"
  | "Glucose-PEG3-TPP-Ce6"
  | "2DG-PEG3-TPP-BODIPY"
  | "2DG-PEG3-TPP-Auger"
  | "Glucose-NP-Alpha";

const LINKS = {
  aidea: "https://a-aidea.com",
  github: "https://github.com/mpetalcorin",
  pubmed: "https://pubmed.ncbi.nlm.nih.gov",
  cruk: "https://www.cancerresearchuk.org/for-researchers",
  ukri: "https://www.ukri.org/what-we-do/browse-our-areas-of-investment-and-support/biomedical-catalyst/",
  nihr: "https://www.nihr.ac.uk/funding",
};

const payloads: Record<
  PayloadKey,
  {
    name: string;
    icon: string;
    activation: string;
    strength: number;
    safety: number;
    maturity: number;
    cost: number;
    bestUse: string;
    limitation: string;
  }
> = {
  pdt: {
    name: "Photodynamic payload",
    icon: "Light",
    activation: "Red or near-infrared light",
    strength: 78,
    safety: 86,
    maturity: 74,
    cost: 48,
    bestUse: "FDG-avid tumours accessible by external, endoscopic, surgical, or fibre-optic light.",
    limitation: "Limited by oxygen availability and light penetration.",
  },
  auger: {
    name: "Auger-emitter payload",
    icon: "Short-range radiation",
    activation: "Radioactive decay near subcellular targets",
    strength: 82,
    safety: 58,
    maturity: 42,
    cost: 76,
    bestUse: "Future mitochondria-localised radiotherapeutic candidates.",
    limitation: "Requires precise subcellular localisation and specialised radiochemistry.",
  },
  alpha: {
    name: "Alpha-emitter payload",
    icon: "High-LET radiation",
    activation: "High-energy short-range alpha decay",
    strength: 96,
    safety: 44,
    maturity: 39,
    cost: 90,
    bestUse: "Later-stage high-potency radiotheranostic programme.",
    limitation: "Daughter recoil, isotope supply, chelation, dosimetry, and toxicity risks.",
  },
  beta: {
    name: "Beta-emitter payload",
    icon: "Cross-fire radiation",
    activation: "Medium-range radioactive decay",
    strength: 72,
    safety: 51,
    maturity: 63,
    cost: 70,
    bestUse: "Larger or heterogeneous lesions where cross-fire may be useful.",
    limitation: "Higher normal-tissue exposure risk than ultra-short-range strategies.",
  },
};

const molecules: Record<
  MoleculeKey,
  {
    className: string;
    glucoseHead: string;
    linker: string;
    mitoTarget: string;
    payload: PayloadKey;
    description: string;
    readiness: number;
    color: string;
  }
> = {
  "2DG-PEG3-TPP-Ce6": {
    className: "MitoKill-PDT-A",
    glucoseHead: "2-deoxyglucose-inspired head",
    linker: "PEG3 spacer",
    mitoTarget: "TPP⁺ mitochondrial targeting",
    payload: "pdt",
    readiness: 78,
    color: "#2563eb",
    description:
      "First lead candidate, designed to combine glucose-inspired tumour association, mitochondrial enrichment, and Ce6-mediated PDT.",
  },
  "Glucose-PEG3-TPP-Ce6": {
    className: "MitoKill-PDT-B",
    glucoseHead: "D-glucose-inspired head",
    linker: "PEG3 spacer",
    mitoTarget: "TPP⁺ mitochondrial targeting",
    payload: "pdt",
    readiness: 70,
    color: "#16a34a",
    description:
      "Comparator lead candidate testing natural glucose-inspired recognition against 2DG-inspired design.",
  },
  "2DG-PEG3-TPP-BODIPY": {
    className: "MitoKill-PDT-C",
    glucoseHead: "2-deoxyglucose-inspired head",
    linker: "PEG3 spacer",
    mitoTarget: "TPP⁺ mitochondrial targeting",
    payload: "pdt",
    readiness: 66,
    color: "#9333ea",
    description:
      "Tunable photophysical candidate using a BODIPY photosensitiser for imaging and light-triggered tumour killing.",
  },
  "2DG-PEG3-TPP-Auger": {
    className: "MitoKill-Auger",
    glucoseHead: "2DG-inspired tumour association",
    linker: "PEG or chelator-compatible linker",
    mitoTarget: "TPP⁺ mitochondrial targeting",
    payload: "auger",
    readiness: 42,
    color: "#ea580c",
    description:
      "Second-generation concept using short-range Auger radiation near mitochondrial targets.",
  },
  "Glucose-NP-Alpha": {
    className: "MitoKill-Alpha",
    glucoseHead: "Glucose-decorated carrier",
    linker: "Nanocarrier or chelator system",
    mitoTarget: "Mitochondria-biased carrier chemistry",
    payload: "alpha",
    readiness: 34,
    color: "#dc2626",
    description:
      "High-risk, high-potency future programme using glucose-decorated carrier systems for alpha-emitting payloads.",
  },
};

const milestones = [
  { phase: "0", title: "Concept package", status: "Now", progress: 100 },
  { phase: "1", title: "White paper and NDA concept note", status: "Now", progress: 95 },
  { phase: "2", title: "Discovery Studio prototype", status: "Build", progress: 80 },
  { phase: "3", title: "Advisor and collaborator network", status: "Next", progress: 35 },
  { phase: "4", title: "Seed proof-of-concept funding", status: "Next", progress: 22 },
  { phase: "5", title: "In vitro mitochondrial PDT assays", status: "Planned", progress: 10 },
  { phase: "6", title: "3D spheroids and organoids", status: "Planned", progress: 5 },
  { phase: "7", title: "FDG-PET-guided animal proof", status: "Future", progress: 2 },
  { phase: "8", title: "Preclinical candidate and IP", status: "Future", progress: 1 },
  { phase: "9", title: "Regulatory and clinical pathway", status: "Future", progress: 1 },
];

const fundingPlan = [
  { name: "Digital demo", value: 0, label: "Sweat equity" },
  { name: "Seed POC", value: 50, label: "£50k" },
  { name: "Translational", value: 250, label: "£250k" },
  { name: "Preclinical", value: 1500, label: "£1.5M" },
  { name: "IND/CTA path", value: 5000, label: "£5M" },
];

const tissueRisk = [
  { tissue: "Brain", glucose: 95, mito: 85, activation: 20 },
  { tissue: "Heart", glucose: 82, mito: 90, activation: 30 },
  { tissue: "Kidney", glucose: 55, mito: 70, activation: 45 },
  { tissue: "Liver", glucose: 45, mito: 65, activation: 50 },
  { tissue: "Muscle", glucose: 50, mito: 60, activation: 35 },
  { tissue: "Inflammation", glucose: 78, mito: 55, activation: 55 },
  { tissue: "Tumour", glucose: 90, mito: 88, activation: 95 },
];

const indications = [
  { name: "Oral cavity / head and neck", fdg: 88, access: 92, unmet: 82 },
  { name: "Oesophageal lesions", fdg: 80, access: 78, unmet: 86 },
  { name: "Bladder lesions", fdg: 62, access: 88, unmet: 76 },
  { name: "Cervical lesions", fdg: 70, access: 82, unmet: 72 },
  { name: "Skin / superficial tumours", fdg: 58, access: 98, unmet: 60 },
  { name: "Peritoneal surface disease", fdg: 74, access: 67, unmet: 89 },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("mitokill-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("mitokill-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [suvMax, setSuvMax] = useState(12);
  const [mtv, setMtv] = useState(35);
  const [tlg, setTlg] = useState(420);
  const [glut1, setGlut1] = useState(75);
  const [hk2, setHk2] = useState(70);
  const [ldha, setLdha] = useState(80);
  const [mitoStress, setMitoStress] = useState(72);
  const [lightAccess, setLightAccess] = useState(85);
  const [normalRisk, setNormalRisk] = useState(28);
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeKey>("2DG-PEG3-TPP-Ce6");

  const molecule = molecules[selectedMolecule];
  const payload = payloads[molecule.payload];

  const suitability = useMemo(() => {
    const petScore = clamp((suvMax / 20) * 35 + (mtv / 100) * 25 + (tlg / 1000) * 40);
    const biologyScore = (glut1 + hk2 + ldha + mitoStress) / 4;
    const feasibilityScore = lightAccess;
    const safetyScore = 100 - normalRisk;
    return clamp(
      petScore * 0.25 +
        biologyScore * 0.3 +
        feasibilityScore * 0.2 +
        safetyScore * 0.25
    );
  }, [suvMax, mtv, tlg, glut1, hk2, ldha, mitoStress, lightAccess, normalRisk]);

  const recommendation = useMemo(() => {
    if (suitability >= 80) return "Strong research candidate for MitoKill-PDT proof-of-concept";
    if (suitability >= 65) return "Promising candidate, requires additional molecular profiling";
    if (suitability >= 45) return "Borderline candidate, optimise safety gates before progression";
    return "Low suitability, not recommended for this platform at present";
  }, [suitability]);

  const radarData = [
    { subject: "FDG avidity", value: clamp((suvMax / 20) * 100) },
    { subject: "Tumour burden", value: clamp((mtv / 100) * 100) },
    { subject: "Glycolysis", value: (glut1 + hk2 + ldha) / 3 },
    { subject: "Mito stress", value: mitoStress },
    { subject: "Light access", value: lightAccess },
    { subject: "Safety", value: 100 - normalRisk },
  ];

  const payloadData = Object.values(payloads).map((p) => ({
    name: p.name.replace(" payload", ""),
    Strength: p.strength,
    Safety: p.safety,
    Maturity: p.maturity,
    Cost: p.cost,
  }));

  const scoreTrend = [
    { step: "PET", score: clamp((suvMax / 20) * 100) },
    { step: "Biology", score: (glut1 + hk2 + ldha) / 3 },
    { step: "Mito", score: mitoStress },
    { step: "Access", score: lightAccess },
    { step: "Safety", score: 100 - normalRisk },
    { step: "Final", score: suitability },
  ];

  const indicationScores = indications.map((i) => ({
    ...i,
    total: Math.round(i.fdg * 0.35 + i.access * 0.35 + i.unmet * 0.3),
  }));

  const pieData = [
    { name: "Imaging selection", value: 22 },
    { name: "Chemistry", value: 25 },
    { name: "Biology assays", value: 24 },
    { name: "Safety gates", value: 18 },
    { name: "AI scoring", value: 11 },
  ];

  const moleculeNetwork = [
    { label: molecule.glucoseHead, icon: <Pill /> },
    { label: molecule.linker, icon: <Layers3 /> },
    { label: molecule.mitoTarget, icon: <Orbit /> },
    { label: payload.name, icon: molecule.payload === "pdt" ? <Lightbulb /> : <Radiation /> },
  ];

  return (
    <main className="app">
      <nav className="topnav">
        <a href="#top" className="brand">
          <Sparkles size={20} /> aAidea MitoKill
        </a>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode((value) => !value)}
          aria-label="Toggle dark mode"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          {darkMode ? "Light mode" : "Dark mode"}
        </button>

        <div>
          <a href="#studio">Studio</a>
          <a href="#molecules">Molecules</a>
          <a href="#safety">Safety</a>
          <a href="#funding">Funding</a>
          <a href={LINKS.aidea} target="_blank" rel="noreferrer" className="nav-cta">
            aAidea <ExternalLink size={14} />
          </a>
        </div>
      </nav>

      <section id="top" className="hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-copy"
        >
          <div className="eyebrow">
            <Atom size={18} /> aAidea Ltd flagship oncology concept
          </div>
          <h1>aAidea MitoKill Discovery Studio</h1>
          <p>
            A public-facing research demo for FDG-PET-guided, mitochondria-targeted
            tumour-killing therapy. Model patient selection, PET-derived metrics,
            molecule design, payload choice, safety gates, funding milestones, and
            translational strategy.
          </p>
          <div className="hero-actions">
            <a href="#studio" className="button primary">Launch demo <ArrowRight size={18} /></a>
            <a href="#roadmap" className="button secondary">View roadmap</a>
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="button ghost">
              GitHub <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="hero-card"
        >
          <div className="orbital">
            <div className="nucleus"><Zap size={42} /></div>
            <span className="orbit orbit1">FDG-PET</span>
            <span className="orbit orbit2">Mitochondria</span>
            <span className="orbit orbit3">PDT</span>
            <span className="orbit orbit4">Safety gates</span>
          </div>
        </motion.div>
      </section>

      <section className="cards three">
        <InfoCard
          icon={<Target />}
          title="Find the tumour by its hunger"
          text="Use FDG-PET metrics, including SUVmax, metabolic tumour volume, and total lesion glycolysis, to identify metabolically active lesions."
        />
        <InfoCard
          icon={<HeartPulse />}
          title="Strike through mitochondria"
          text="Model glucose-inspired therapeutic conjugates designed to enrich damage near tumour mitochondria and trigger cell-death signalling."
        />
        <InfoCard
          icon={<ShieldCheck />}
          title="Protect normal cells"
          text="Combine PET selection, molecular profiling, mitochondrial targeting, local activation, and continuous monitoring as safety gates."
        />
      </section>

      <section className="animated-strip">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
          <span>FDG-PET selection</span>
          <span>GLUT1/HK2/LDHA profiling</span>
          <span>2DG-PEG3-TPP-Ce6</span>
          <span>Mitochondrial ROS</span>
          <span>Safety gate scoring</span>
          <span>Investor-ready milestones</span>
          <span>FDG-PET selection</span>
          <span>GLUT1/HK2/LDHA profiling</span>
          <span>2DG-PEG3-TPP-Ce6</span>
          <span>Mitochondrial ROS</span>
        </motion.div>
      </section>

      <section id="studio" className="studio-grid">
        <div className="panel controls">
          <h2>Patient and tumour selection simulator</h2>
          <p className="muted">
            Adjust research-stage inputs to model whether a tumour is suitable for
            MitoKill-PDT or later radiotheranostic development.
          </p>

          <Slider label="SUVmax" value={suvMax} min={1} max={25} step={0.5} onChange={setSuvMax} />
          <Slider label="Metabolic tumour volume, mL" value={mtv} min={1} max={150} step={1} onChange={setMtv} />
          <Slider label="Total lesion glycolysis" value={tlg} min={10} max={1500} step={10} onChange={setTlg} />
          <Slider label="GLUT1 expression score" value={glut1} min={0} max={100} step={1} onChange={setGlut1} />
          <Slider label="HK2 expression score" value={hk2} min={0} max={100} step={1} onChange={setHk2} />
          <Slider label="LDHA expression score" value={ldha} min={0} max={100} step={1} onChange={setLdha} />
          <Slider label="Mitochondrial stress score" value={mitoStress} min={0} max={100} step={1} onChange={setMitoStress} />
          <Slider label="Light-access feasibility" value={lightAccess} min={0} max={100} step={1} onChange={setLightAccess} />
          <Slider label="Normal tissue risk" value={normalRisk} min={0} max={100} step={1} onChange={setNormalRisk} />
        </div>

        <div className="panel score-panel gradient-panel">
          <h2>MitoKill Suitability Score</h2>
          <div className="score-ring" style={{ ["--score" as string]: `${suitability * 3.6}deg` }}>
            <div>
              <span>{Math.round(suitability)}</span>
              <small>/100</small>
            </div>
          </div>
          <h3>{recommendation}</h3>
          <p className="muted">
            Research-stage score only. This is not a clinical decision tool.
          </p>

          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "currentColor" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="science-module">
        <div className="section-head">
          <h2>Closed-loop treatment concept</h2>
          <p>
            The public demo presents the therapeutic logic as a repeatable closed loop,
            from imaging selection to response-guided adaptation.
          </p>
        </div>

        <div className="loop-grid">
          {[
            ["Scan", "FDG-PET maps glucose-avid tumour burden.", <Activity />],
            ["Score", "AI-assisted suitability model integrates imaging and biology.", <Gauge />],
            ["Design", "Select glucose-inspired mitochondrial payload architecture.", <Beaker />],
            ["Activate", "Use local light or short-range radiation as a controlled gate.", <Zap />],
            ["Kill", "Induce mitochondrial collapse, ROS injury, and tumour cell death.", <Target />],
            ["Re-scan", "Repeat FDG-PET to evaluate metabolic response.", <TimerReset />],
          ].map(([title, text, icon], index) => (
            <motion.div
              key={String(title)}
              className="loop-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="loop-number">{index + 1}</div>
              <div className="icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="molecules" className="molecule-section">
        <div className="section-head">
          <h2>Molecule design choices</h2>
          <p>
            Select a candidate class to explore the modular design logic: glucose-recognition
            head, linker, mitochondria-targeting module, and payload.
          </p>
        </div>

        <div className="molecule-layout">
          <div className="molecule-buttons">
            {(Object.keys(molecules) as MoleculeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedMolecule(key)}
                className={selectedMolecule === key ? "selected" : ""}
              >
                {key}
              </button>
            ))}
          </div>

          <motion.div
            key={selectedMolecule}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel molecule-card"
          >
            <div className="badge">{molecule.className}</div>
            <h3>{selectedMolecule}</h3>
            <p>{molecule.description}</p>

            <div className="molecule-network">
              {moleculeNetwork.map((node, index) => (
                <div className="network-node" key={node.label}>
                  <div className="node-icon" style={{ background: molecule.color }}>{node.icon}</div>
                  <strong>{node.label}</strong>
                  {index < moleculeNetwork.length - 1 && <span className="network-arrow">→</span>}
                </div>
              ))}
            </div>

            <div className="metric-row">
              <Metric label="Candidate readiness" value={molecule.readiness} />
              <Metric label="Payload strength" value={payload.strength} />
              <Metric label="Safety logic" value={payload.safety} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="payload-section">
        <div className="panel">
          <h2>Payload comparison</h2>
          <p className="muted">
            PDT is the recommended first programme because activation can be locally
            controlled. Auger and alpha programmes are higher-risk future expansions.
          </p>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={payloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="Strength" fill="#2563eb" />
              <Bar dataKey="Safety" fill="#16a34a" />
              <Bar dataKey="Maturity" fill="#f59e0b" />
              <Bar dataKey="Cost" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h2>Current payload: {payload.name}</h2>
          <div className="payload-icon">
            {molecule.payload === "pdt" ? <Lightbulb /> : <Radiation />}
          </div>
          <p><strong>Activation:</strong> {payload.activation}</p>
          <p><strong>Best use:</strong> {payload.bestUse}</p>
          <p><strong>Main limitation:</strong> {payload.limitation}</p>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" tick={{ fontSize: 11, fill: "currentColor" }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="safety" className="safety-section">
        <div className="section-head">
          <h2>Six safety gates</h2>
          <p>
            The platform does not rely on glucose targeting alone. Selectivity is modelled
            as a multi-gate system.
          </p>
        </div>

        <div className="cards six">
          <Gate icon={<Activity />} title="1. FDG-PET selection" text="Select glucose-avid lesions and quantify metabolic burden." />
          <Gate icon={<Dna />} title="2. Molecular profiling" text="Assess GLUT1, HK2, LDHA, hypoxia, and mitochondrial vulnerability." />
          <Gate icon={<Target />} title="3. Tumour association" text="Use glucose-inspired motifs to bias uptake or retention." />
          <Gate icon={<Zap />} title="4. Mitochondrial targeting" text="Concentrate damage near apoptosis and bioenergetic machinery." />
          <Gate icon={<Lightbulb />} title="5. Controlled activation" text="Use local light or short-range radiation to restrict damage." />
          <Gate icon={<ShieldCheck />} title="6. Monitoring" text="Track response by repeat FDG-PET, CT/MRI, biomarkers, and safety labs." />
        </div>
      </section>

      <section className="heatmap-section">
        <div className="section-head">
          <h2>Normal-cell protection dashboard</h2>
          <p>
            This module visualises why safety must come from several gates, not glucose
            targeting alone.
          </p>
        </div>

        <div className="panel heatmap-panel">
          <div className="heatmap">
            <div className="heat-header"></div>
            <div className="heat-header">Glucose use</div>
            <div className="heat-header">Mito density</div>
            <div className="heat-header">Activation exposure</div>
            {tissueRisk.map((row) => (
              <>
                <div className="heat-label" key={`${row.tissue}-label`}>{row.tissue}</div>
                <HeatCell value={row.glucose} key={`${row.tissue}-g`} />
                <HeatCell value={row.mito} key={`${row.tissue}-m`} />
                <HeatCell value={row.activation} key={`${row.tissue}-a`} />
              </>
            ))}
          </div>
        </div>
      </section>

      <section className="indication-section">
        <div className="section-head">
          <h2>First indication prioritisation</h2>
          <p>
            The first programme should start with FDG-avid, light-accessible tumours where
            local control remains clinically meaningful.
          </p>
        </div>

        <div className="panel">
          <ResponsiveContainer width="100%" height={370}>
            <ComposedChart data={indicationScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor" }} interval={0} height={80} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="fdg" fill="#2563eb" name="FDG avidity" />
              <Bar dataKey="access" fill="#16a34a" name="Light access" />
              <Line type="monotone" dataKey="total" stroke="#dc2626" strokeWidth={3} name="Priority score" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="funding" className="funding-section">
        <div className="section-head">
          <h2>Funding and philanthropy module</h2>
          <p>
            Show potential supporters exactly what each level of funding unlocks.
          </p>
        </div>

        <div className="funding-grid">
          <div className="panel">
            <h3>Funding ladder</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={fundingPlan}>
                <defs>
                  <linearGradient id="fundingGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "currentColor" }} />
                <YAxis />
                <Tooltip />
                <Area dataKey="value" stroke="#7c3aed" fill="url(#fundingGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="panel">
            <h3>What the first £50k unlocks</h3>
            <div className="unlock-list">
              <Unlock text="Custom synthesis or sourcing of initial candidate compounds" />
              <Unlock text="Photophysical testing, absorbance, fluorescence, ROS output" />
              <Unlock text="Tumour versus normal cell uptake comparison" />
              <Unlock text="Mitochondrial localisation microscopy" />
              <Unlock text="Dark toxicity versus light-triggered tumour killing" />
              <Unlock text="Seed data package for grant and investor follow-on" />
            </div>
          </div>
        </div>

        <div className="cta-grid">
          <ExternalCard title="aAidea website" text="Company platform and portfolio." href={LINKS.aidea} icon={<Rocket />} />
          <ExternalCard title="PubMed evidence" text="Explore peer-reviewed literature." href={LINKS.pubmed} icon={<Microscope />} />
          <ExternalCard title="UKRI Biomedical Catalyst" text="Potential translational funding route." href={LINKS.ukri} icon={<Banknote />} />
          <ExternalCard title="CRUK researchers" text="Cancer research funding landscape." href={LINKS.cruk} icon={<Users />} />
        </div>
      </section>

      <section className="pie-section">
        <div className="panel">
          <h2>Seed proof-of-concept workshare</h2>
          <p className="muted">
            A visual estimate of how the first proof-of-concept package could be distributed.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={["#2563eb", "#16a34a", "#9333ea", "#f59e0b", "#dc2626"][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel narrative">
          <h2>Investor-ready story</h2>
          <p>
            Cancer already reveals one weakness when it lights up on FDG-PET. aAidea
            MitoKill asks whether that diagnostic signal can guide a therapy that strikes
            tumour mitochondria, activates locally, and is monitored by metabolic response.
          </p>
          <a href="#roadmap" className="button primary">See milestones <ArrowRight size={18} /></a>
        </div>
      </section>

      <section id="roadmap" className="roadmap">
        <div className="section-head">
          <h2>Development roadmap</h2>
          <p>
            A staged, fundable pathway from software prototype to experimental validation,
            preclinical candidate selection, and eventual clinical translation.
          </p>
        </div>

        <div className="milestones">
          {milestones.map((m) => (
            <div className="milestone" key={m.phase}>
              <div className="phase">{m.phase}</div>
              <div className="milestone-body">
                <h3>{m.title}</h3>
                <span>{m.status}</span>
                <div className="progress">
                  <div style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="investor">
        <div>
          <h2>Flagship message</h2>
          <p>
            Finding cancer by its hunger, killing it through mitochondrial vulnerability,
            and monitoring success by a fading metabolic signal.
          </p>
          <div className="hero-actions">
            <a href={LINKS.aidea} target="_blank" rel="noreferrer" className="button primary">Partner with aAidea <ExternalLink size={16} /></a>
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="button secondary">View portfolio <ExternalLink size={16} /></a>
          </div>
        </div>
        <div className="ask-card">
          <h3>First fundable milestone</h3>
          <p>
            Demonstrate that a glucose-inspired, mitochondria-targeted photosensitiser
            shows low dark toxicity, mitochondrial localisation, and strong light-triggered
            killing in FDG-avid or GLUT1-high tumour cells compared with normal-cell controls.
          </p>
        </div>
      </section>

      <footer>
        <div>
          <strong>aAidea Ltd</strong>
          <p>Research-stage software demo. Not a clinical product. Not medical advice.</p>
        </div>
        <div className="footer-icons">
          <Microscope />
          <FlaskConical />
          <Brain />
          <CircleDollarSign />
        </div>
      </footer>
    </main>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="info-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{Math.round(value)}</strong>
      <div className="progress small">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Gate({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="gate">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}

function HeatCell({ value }: { value: number }) {
  return (
    <div
      className="heat-cell"
      style={{
        background: `linear-gradient(135deg, rgba(37,99,235,${value / 120}), rgba(220,38,38,${value / 120}))`,
      }}
    >
      {value}
    </div>
  );
}

function Unlock({ text }: { text: string }) {
  return (
    <div className="unlock">
      <CheckCircle2 size={18} />
      <span>{text}</span>
    </div>
  );
}

function ExternalCard({
  title,
  text,
  href,
  icon,
}: {
  title: string;
  text: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <motion.a whileHover={{ y: -5 }} href={href} target="_blank" rel="noreferrer" className="external-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span>Open link <ExternalLink size={14} /></span>
    </motion.a>
  );
}
