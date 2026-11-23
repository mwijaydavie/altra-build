/**
 * ALTRA BUILD — single source of truth.
 * Every string rendered on the marketing site, portal teaser, estimator and
 * case studies lives here so the brand can be re-skinned without touching JSX.
 */

/* ------------------------------------------------------------------ */
/* Company                                                             */
/* ------------------------------------------------------------------ */
export interface Office {
  id: string;
  name: string;
  kind: "Headquarters" | "Regional yard" | "Site office" | "Liaison";
  city: string;
  address: string;
  coordinates: string;
  timezone: string;
  phone: string;
}

export interface Certification {
  code: string;
  name: string;
  issuer: string;
  since: string;
}

export const company = {
  name: "Altra Build",
  legalName: "Altra Build Limited",
  tagline: "Engineering tomorrow's horizons.",
  proposition:
    "Precision civil engineering, mega-structure delivery and heavy industrial infrastructure, built on uncompromised structural integrity.",
  shortBio:
    "Altra Build is a Tanzanian general contractor and civil engineering firm operating across East Africa. We build the bridges, towers, plants and ports that carry a growing region — on programme, on budget, and without compromise.",
  founded: 2009,
  registration: "BRELA Reg. 104-882-TZ",
  crb: "CRB Class One · Civil & Building",
  headcount: "1,480",
  hq: "Dar es Salaam, Tanzania",
  email: "tender@altrabuild.co.tz",
  phone: "+255 22 550 0148",
  emergency: "+255 754 000 911",
  coordinates: "6°46'58\"S 39°16'41\"E",
  wordmark: "/brand/altra-logo.svg",
  wordmarkInverse: "/brand/altra-logo-inverse.svg",
  emblem: "/brand/altra-mark.svg",
  emblemInverse: "/brand/altra-mark-inverse.svg",
  emblemMono: "/brand/altra-mark-mono-ink.svg",
  emblemMonoCream: "/brand/altra-mark-mono-cream.svg",
  lockupRatio: 6.12,
  emblemRatio: 1.06,
  trademark: "The rhinoceros is our standard.",
  story:
    "Kifaru — Swahili for rhinoceros — carries armour without aggression and weight with precision. It is how we build: heavily engineered, quietly executed, and impossible to move.",
} as const;

export type NavItem = {
  label: string;
  href: string;
  meta: string;
  group: "primary" | "utility";
  index: string;
};

/** Header + hinge-menu navigation. One page per idea — no anchor-only IA. */
export const navigation: NavItem[] = [
  { label: "Capabilities", href: "/capabilities", meta: "Four divisions", group: "primary", index: "01" },
  { label: "Projects", href: "/projects", meta: "214 commissions", group: "primary", index: "02" },
  { label: "Method & Safety", href: "/method", meta: "ISO 45001", group: "primary", index: "03" },
  { label: "Fleet & BIM", href: "/fleet", meta: "Level 3", group: "primary", index: "04" },
  { label: "About", href: "/about", meta: "Since 2009", group: "primary", index: "05" },
  { label: "Estimator", href: "/estimator", meta: "Budget in 60 seconds", group: "utility", index: "06" },
  { label: "Contact", href: "/contact", meta: "Tender desk · 2h SLA", group: "utility", index: "07" },
  { label: "Client Portal", href: "/portal", meta: "Sign in", group: "utility", index: "08" },
  { label: "Field App", href: "/field", meta: "Offline site log", group: "utility", index: "09" },
  { label: "Brand", href: "/brand", meta: "Standards & assets", group: "utility", index: "10" },
];

export const primaryNavigation = navigation.filter((item) => item.group === "primary");
export const utilityNavigation = navigation.filter((item) => item.group === "utility");

export const offices: Office[] = [
  {
    id: "hq",
    name: "Altra Build House",
    kind: "Headquarters",
    city: "Dar es Salaam",
    address: "Plot 1482, Msasani Peninsula, Dar es Salaam 14111",
    coordinates: "06°46'58\"S 39°16'41\"E",
    timezone: "Africa/Dar_es_Salaam",
    phone: "+255 22 550 0148",
  },
  {
    id: "ubungo",
    name: "Ubungo Plant & Regional Yard",
    kind: "Regional yard",
    city: "Dar es Salaam",
    address: "Nelson Mandela Road, Ubungo Industrial Area",
    coordinates: "06°47'22\"S 39°12'30\"E",
    timezone: "Africa/Dar_es_Salaam",
    phone: "+255 22 550 0162",
  },
  {
    id: "dodoma",
    name: "Capital Region Site Office",
    kind: "Site office",
    city: "Dodoma",
    address: "Nzuguni Industrial Park, Dodoma 41110",
    coordinates: "06°10'23\"S 35°44'31\"E",
    timezone: "Africa/Dar_es_Salaam",
    phone: "+255 26 232 0071",
  },
  {
    id: "zanzibar",
    name: "Indian Ocean Projects Desk",
    kind: "Liaison",
    city: "Zanzibar",
    address: "Malindi Road, Stone Town, Zanzibar 71100",
    coordinates: "06°09'44\"S 39°11'32\"E",
    timezone: "Africa/Dar_es_Salaam",
    phone: "+255 24 223 4410",
  },
];

export const certifications: Certification[] = [
  { code: "ISO 9001:2015", name: "Quality management", issuer: "SGS Tanzania", since: "2014" },
  { code: "ISO 45001:2018", name: "Occupational health & safety", issuer: "SGS Tanzania", since: "2018" },
  { code: "ISO 14001:2015", name: "Environmental management", issuer: "SGS Tanzania", since: "2016" },
  { code: "CRB Class 1", name: "Contractors Registration Board", issuer: "United Republic of Tanzania", since: "2011" },
  { code: "OSHA", name: "Workplace compliance · TZ", issuer: "OSHA Tanzania", since: "2010" },
];

/* ------------------------------------------------------------------ */
/* Metrics                                                             */
/* ------------------------------------------------------------------ */
export interface Metric {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  note: string;
}

export const metrics: Metric[] = [
  {
    id: "area",
    label: "Built area delivered",
    value: 1.42,
    suffix: "M m²",
    decimals: 2,
    note: "Across 214 completed commissions since 2009",
  },
  {
    id: "ontime",
    label: "On-time completion",
    value: 99.8,
    suffix: "%",
    decimals: 1,
    note: "Measured against contract programme, 2019–2026",
  },
  {
    id: "safety",
    label: "Safe man-hours",
    value: 4.26,
    suffix: "M",
    decimals: 2,
    note: "Zero lost-time injuries across active sites",
  },
  {
    id: "portfolio",
    label: "Portfolio value",
    value: 1.1,
    prefix: "TZS ",
    suffix: "T",
    decimals: 2,
    note: "Contracted work in hand and delivered to date",
  },
];

export const heroRibbon: Metric[] = [
  metrics[0]!,
  metrics[1]!,
  metrics[2]!,
  metrics[3]!,
];

/* ------------------------------------------------------------------ */
/* Divisions                                                           */
/* ------------------------------------------------------------------ */
export type DivisionId = "civil" | "commercial" | "industrial" | "retrofit";

export interface Division {
  id: DivisionId;
  index: string;
  name: string;
  shortName: string;
  ref: string;
  kicker: string;
  summary: string;
  body: string;
  image: string;
  alt: string;
  capabilities: string[];
  specs: { label: string; value: string }[];
}

export const divisions: Division[] = [
  {
    id: "civil",
    index: "01",
    name: "Heavy Civil & Infrastructure",
    shortName: "Heavy Civil",
    ref: "AB/CIV",
    kicker: "Bridges · Highways · Marine",
    summary:
      "Long-span bridges, coastal marine works, highways and deep earthworks engineered for monsoon loads and 120-year design life.",
    body:
      "Our civil division runs its own piling rigs, batching plants and geotechnical lab. From cable-stayed crossings over tidal estuaries to 40 km of trunk road, we take ground risk head-on with instrumented monitoring and independent third-party verification.",
    image: "/images/division-civil.jpg",
    alt: "Cable-stayed bridge under construction across an estuary at golden hour",
    capabilities: [
      "Cable-stayed and segmental bridges",
      "Marine piling, quay walls and caissons",
      "Trunk roads, interchanges and drainage",
      "Deep cut-and-fill earthworks",
      "Geotechnical instrumentation",
    ],
    specs: [
      { label: "Max span delivered", value: "640 m" },
      { label: "Marine piles driven", value: "1,860" },
      { label: "Design life", value: "120 yrs" },
    ],
  },
  {
    id: "commercial",
    index: "02",
    name: "Commercial & High-Rise Structures",
    shortName: "High-Rise",
    ref: "AB/COM",
    kicker: "Towers · Mixed-use · Hospitality",
    summary:
      "Tier-1 office towers, mixed-use developments and hospitality assets delivered to institutional specification.",
    body:
      "Post-tensioned slabs, jump-form cores and unitised façades — sequenced floor-by-floor so the building is weather-tight earlier. We coordinate the full consultant team in a federated BIM model, with 4D programme simulation reviewed weekly.",
    image: "/images/division-commercial.jpg",
    alt: "Premium mixed-use tower with board-formed concrete and bronze glazing",
    capabilities: [
      "Jump-form and slip-form cores",
      "Post-tensioned floor plates",
      "Unitised curtain wall installation",
      "Fit-out and base-build integration",
      "Hotel and hospitality delivery",
    ],
    specs: [
      { label: "Tallest structure", value: "38 floors" },
      { label: "Floor cycle achieved", value: "5 days" },
      { label: "Façade area", value: "62,000 m²" },
    ],
  },
  {
    id: "industrial",
    index: "03",
    name: "Industrial & Pre-Engineered Facilities",
    shortName: "Industrial",
    ref: "AB/IND",
    kicker: "Logistics · Energy · Data",
    summary:
      "Warehouses, energy plants, cleanrooms and data campuses — fast-track steel structures with mission-critical MEP.",
    body:
      "Industrial work rewards tolerance discipline. Our pre-engineered division fabricates in a controlled yard, erects with certified rigging crews, and hands over with commissioning-grade documentation rather than a folder of as-builts.",
    image: "/images/division-industrial.jpg",
    alt: "Steel-framed warehouse interior under construction with dusty light",
    capabilities: [
      "Pre-engineered steel structures",
      "Cold-chain and cleanroom envelopes",
      "Data centre white space and plant",
      "Solar and captive power integration",
      "Heavy industrial floors and trenches",
    ],
    specs: [
      { label: "Clear-span achieved", value: "48 m" },
      { label: "Fast-track record", value: "7 months" },
      { label: "Uptime at handover", value: "99.99%" },
    ],
  },
  {
    id: "retrofit",
    index: "04",
    name: "Specialised Renovation & Retrofitting",
    shortName: "Retrofit",
    ref: "AB/RET",
    kicker: "Adaptive reuse · Seismic",
    summary:
      "Structural strengthening, seismic upgrades and adaptive reuse of buildings that must stay occupied while we work.",
    body:
      "We survey with LiDAR, model what is actually there, then design the intervention around the operation. Carbon-fibre wrapping, steel bracing and base isolation are installed in staged night shifts with vibration and dust limits agreed in the contract.",
    image: "/images/division-retrofit.jpg",
    alt: "Steel bracing installed inside an existing concrete building during retrofit",
    capabilities: [
      "Seismic and wind strengthening",
      "Carbon-fibre and steel plate wrapping",
      "Heritage and adaptive reuse",
      "Occupied-building staged works",
      "Façade and envelope remediation",
    ],
    specs: [
      { label: "Columns strengthened", value: "1,240" },
      { label: "Occupied works", value: "34 sites" },
      { label: "Load uplift", value: "up to 65%" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */
export type ProjectStatus = "Completed" | "In progress" | "Handover";
export type PhaseState = "complete" | "active" | "upcoming";

export interface ProjectPhase {
  id: string;
  name: string;
  window: string;
  state: PhaseState;
  progress: number;
}

export interface ProjectSpec {
  label: string;
  value: string;
  unit?: string;
}

export interface Project {
  slug: string;
  code: string;
  name: string;
  division: DivisionId;
  sector: string;
  location: string;
  coordinates: string;
  year: number;
  status: ProjectStatus;
  progress: number;
  cover: string;
  coverAlt: string;
  summary: string;
  intro: string;
  brief: string;
  response: string;
  outcomes: string[];
  specs: ProjectSpec[];
  phases: ProjectPhase[];
  gallery: { src: string; alt: string; caption: string }[];
  quote: { text: string; author: string; role: string };
  awards: string[];
}

export const projects: Project[] = [
  {
    slug: "mtoni-delta-crossing",
    code: "AB/CIV/2026-047",
    name: "Mtoni Delta Crossing",
    division: "civil",
    sector: "Marine Civil",
    location: "Kigamboni, Dar es Salaam",
    coordinates: "06°49'12\"S 39°18'04\"E",
    year: 2024,
    status: "Completed",
    progress: 100,
    cover: "/images/division-civil.jpg",
    coverAlt: "Cable-stayed bridge spanning a river delta at sunset",
    summary:
      "A 640 m cable-stayed crossing over the Mtoni estuary, founded on 2.4 m marine piles driven through coral limestone.",
    intro:
      "The Mtoni Delta Crossing replaces a single-lane ferry that carried 14,000 vehicles a day. The commission required a 120-year design life in a tidal, chloride-rich environment — and a construction method that kept the channel open to fishing traffic throughout.",
    brief:
      "Deliver a four-lane crossing with a 320 m main span, navigational clearance for coastal shipping, and a programme that did not interrupt the ferry service until deck closure.",
    response:
      "We designed a temporary works island for pier construction, drove instrumented marine piles from a jack-up barge, and cast the deck in 4.2 m segments with a launching gantry. Stay cables were stressed in three passes with continuous monitoring of tower drift. A 4D model drove the marine logistics plan, including tide-window lifting.",
    outcomes: [
      "Deck closed 41 days ahead of programme",
      "Zero lost-time injuries across 612,000 man-hours",
      "2.4 m marine piles driven to 38 m depth in coral",
      "Channel navigation maintained throughout construction",
    ],
    specs: [
      { label: "Total length", value: "640", unit: "m" },
      { label: "Main span", value: "320", unit: "m" },
      { label: "Concrete", value: "38,400", unit: "m³" },
      { label: "Structural steel", value: "4,120", unit: "t" },
      { label: "Marine piles", value: "96", unit: "nr" },
      { label: "Contract value", value: "TZS 214B" },
      { label: "Duration", value: "31 months" },
      { label: "Client", value: "Zawadi Ports Authority" },
    ],
    phases: [
      { id: "p1", name: "Geotech & marine survey", window: "Q1 2022", state: "complete", progress: 100 },
      { id: "p2", name: "Piling & pier construction", window: "Q2–Q4 2022", state: "complete", progress: 100 },
      { id: "p3", name: "Deck erection & stays", window: "Q1–Q3 2023", state: "complete", progress: 100 },
      { id: "p4", name: "Surfacing, lighting & load test", window: "Q4 2023", state: "complete", progress: 100 },
      { id: "p5", name: "Handover", window: "Q1 2024", state: "complete", progress: 100 },
    ],
    gallery: [
      { src: "/images/division-civil.jpg", alt: "Bridge deck and stay cables at dusk", caption: "Main span during cable stressing, third pass" },
      { src: "/images/machinery-fleet.jpg", alt: "Marine plant and equipment staged at the yard", caption: "Marine plant mobilisation, Ubungo yard" },
    ],
    quote: {
      text: "Altra Build treated the tide table as a design constraint, not an excuse. The bridge opened early and the ferry never stopped running until the day it did.",
      author: "Eng. Neema Mwakalinga",
      role: "Project Director, Zawadi Ports Authority",
    },
    awards: ["Tanzania Engineering Excellence Award 2024", "AFCOR Infrastructure Project of the Year"],
  },
  {
    slug: "msasani-peninsula-tower",
    code: "AB/COM/2025-112",
    name: "Msasani Peninsula Tower",
    division: "commercial",
    sector: "Mixed-use High-Rise",
    location: "Msasani, Dar es Salaam",
    coordinates: "06°44'31\"S 39°16'52\"E",
    year: 2025,
    status: "Handover",
    progress: 96,
    cover: "/images/division-commercial.jpg",
    coverAlt: "Glass and concrete mixed-use tower seen from street level",
    summary:
      "A 38-storey mixed-use tower of board-formed concrete and bronze glass, with a five-day-per-floor structural cycle.",
    intro:
      "Msasani Peninsula Tower combines 22,400 m² of Grade-A office, a 140-key hotel and a public ground plane. The client asked for a landmark that could hold its own against the Indian Ocean light without turning into a mirrored box.",
    brief:
      "Deliver 38 floors on a constrained peninsula site with a five-day floor cycle, a unitised façade, and public realm that remains open during construction.",
    response:
      "A jump-form core led the structure, with post-tensioned slabs following three floors behind. Façade units were manufactured in Mombasa and installed from a twin-hoist mast climber, so the building was watertight 11 floors below the pour line. The public colonnade opened nine months before practical completion.",
    outcomes: [
      "5-day structural floor cycle maintained for 31 floors",
      "98.6% façade installation first-time-fix rate",
      "11 floors of weather-tight buffer ahead of fit-out",
      "Public colonnade open 9 months pre-completion",
    ],
    specs: [
      { label: "Floors", value: "38", unit: "nr" },
      { label: "Gross area", value: "58,900", unit: "m²" },
      { label: "Concrete", value: "42,700", unit: "m³" },
      { label: "Reinforcement", value: "6,850", unit: "t" },
      { label: "Façade", value: "62,000", unit: "m²" },
      { label: "Contract value", value: "TZS 268B" },
      { label: "Duration", value: "34 months" },
      { label: "Client", value: "Tumaini Estates" },
    ],
    phases: [
      { id: "p1", name: "Piling & basement", window: "Q2 2022", state: "complete", progress: 100 },
      { id: "p2", name: "Core & frame to L14", window: "Q4 2022", state: "complete", progress: 100 },
      { id: "p3", name: "Frame to L38", window: "Q3 2023", state: "complete", progress: 100 },
      { id: "p4", name: "Façade & fit-out", window: "Q1–Q4 2024", state: "complete", progress: 100 },
      { id: "p5", name: "Commissioning & handover", window: "Q1 2025", state: "active", progress: 86 },
    ],
    gallery: [
      { src: "/images/division-commercial.jpg", alt: "Completed tower facade", caption: "Bronze glazing and board-formed concrete bands" },
      { src: "/images/hero-construction.jpg", alt: "Tower under construction at dusk", caption: "Core and frame at level 26, dusk pour" },
    ],
    quote: {
      text: "They gave us a building that looks inevitable. The floor cycle discipline saved us an entire quarter of financing cost.",
      author: "Zahara Kimaro",
      role: "Development Director, Tumaini Estates",
    },
    awards: ["East Africa Property Awards — Commercial Development 2025"],
  },
  {
    slug: "kariakoo-heritage-quarter",
    code: "AB/RET/2024-088",
    name: "Kariakoo Heritage Quarter",
    division: "retrofit",
    sector: "Structural Retrofit",
    location: "Kariakoo, Dar es Salaam",
    coordinates: "06°49'08\"S 39°16'26\"E",
    year: 2024,
    status: "Completed",
    progress: 100,
    cover: "/images/division-retrofit.jpg",
    coverAlt: "Steel bracing being installed inside a concrete building",
    summary:
      "Seismic and gravity strengthening of a 1974 market block — 1,240 columns upgraded while 400 traders kept working.",
    intro:
      "Kariakoo is the densest trading district in East Africa. The 1974 market block had carbonated concrete, corroded reinforcement and a structural assessment that recommended demolition. The traders, and the city, wanted it kept.",
    brief:
      "Raise the structure to current seismic and gravity codes without closing the market, losing heritage fabric, or breaching noise and vibration limits agreed with the traders' association.",
    response:
      "We laser-scanned every bay, built an as-found model, and designed a hybrid intervention: carbon-fibre wrapping to columns, external steel bracing in service cores, and a new lightweight roof. Work ran in 6-hour night windows, bay by bay, with real-time vibration monitoring and a trader liaison on every shift.",
    outcomes: [
      "400 traders remained open throughout the works",
      "Vibration held below 5 mm/s peak particle velocity",
      "Column capacity increased by up to 65%",
      "Original 1974 façade and mural retained",
    ],
    specs: [
      { label: "Gross area", value: "18,400", unit: "m²" },
      { label: "Columns strengthened", value: "1,240", unit: "nr" },
      { label: "Carbon fibre", value: "9,700", unit: "m²" },
      { label: "Structural steel", value: "480", unit: "t" },
      { label: "Contract value", value: "TZS 62B" },
      { label: "Duration", value: "23 months" },
      { label: "Client", value: "Kariakoo Traders Association" },
      { label: "Heritage status", value: "Grade II" },
    ],
    phases: [
      { id: "p1", name: "LiDAR survey & testing", window: "Q1 2022", state: "complete", progress: 100 },
      { id: "p2", name: "Temporary works & propping", window: "Q2 2022", state: "complete", progress: 100 },
      { id: "p3", name: "Column & beam strengthening", window: "Q3 2022–Q2 2023", state: "complete", progress: 100 },
      { id: "p4", name: "Roof replacement", window: "Q3 2023", state: "complete", progress: 100 },
      { id: "p5", name: "Reinstatement & handover", window: "Q4 2023–Q1 2024", state: "complete", progress: 100 },
    ],
    gallery: [
      { src: "/images/division-retrofit.jpg", alt: "Steel X-bracing in a concrete frame", caption: "Service-core bracing installed during night shift" },
      { src: "/images/division-industrial.jpg", alt: "Interior of the market hall after works", caption: "Reinstated trading hall, original roof lights retained" },
    ],
    quote: {
      text: "Nobody has ever strengthened a building around a working market like this. Our traders never lost a day of business.",
      author: "Mussa Hamisi",
      role: "Chairman, Kariakoo Traders Association",
    },
    awards: ["Africalia Heritage & Adaptive Reuse Prize 2024"],
  },
  {
    slug: "dodoma-hyperscale-campus",
    code: "AB/IND/2025-134",
    name: "Dodoma Hyperscale Campus",
    division: "industrial",
    sector: "Mission-critical",
    location: "Nzuguni, Dodoma",
    coordinates: "06°10'23\"S 35°44'31\"E",
    year: 2025,
    status: "Completed",
    progress: 100,
    cover: "/images/project-datacentre.jpg",
    coverAlt: "Low-rise data centre campus with solar array and mountains behind",
    summary:
      "A 22 MW campus delivered fast-track in seven months, with a solar array and water-recycling plant on the same contract.",
    intro:
      "Cloud demand in Tanzania is growing faster than the grid can serve it. This campus was procured on a design-build basis with a fixed energisation date — and a requirement that the site run on solar for at least six hours a day from day one.",
    brief:
      "Deliver 22 MW of white space and plant, 9,600 m² of technical buildings, and on-site generation, without a single day of slip to the energisation date.",
    response:
      "We prefabricated the steel frames and plant skids off-site, ran 4D simulation for the commissioning sequence, and procured long-lead chillers against a letter of intent before financial close. The solar array and water treatment plant were commissioned in parallel with the white space.",
    outcomes: [
      "Energised two weeks ahead of the fixed date",
      "14,400 m² solar array, 6.2 MWp",
      "PUE of 1.24 at handover testing",
      "72% construction water recycled on site",
    ],
    specs: [
      { label: "IT load", value: "22", unit: "MW" },
      { label: "Built area", value: "9,600", unit: "m²" },
      { label: "Solar", value: "6.2", unit: "MWp" },
      { label: "Structural steel", value: "2,300", unit: "t" },
      { label: "Contract value", value: "TZS 186B" },
      { label: "Duration", value: "7 months" },
      { label: "Client", value: "Serengeti Energy" },
      { label: "PUE", value: "1.24" },
    ],
    phases: [
      { id: "p1", name: "Enabling & earthworks", window: "Q1 2024", state: "complete", progress: 100 },
      { id: "p2", name: "Steel erection", window: "Q2 2024", state: "complete", progress: 100 },
      { id: "p3", name: "MEP & plant", window: "Q2–Q3 2024", state: "complete", progress: 100 },
      { id: "p4", name: "Solar & water plant", window: "Q3 2024", state: "complete", progress: 100 },
      { id: "p5", name: "Integrated systems test", window: "Q4 2024", state: "complete", progress: 100 },
    ],
    gallery: [
      { src: "/images/project-datacentre.jpg", alt: "Data centre campus aerial view", caption: "Completed campus with 6.2 MWp solar array" },
      { src: "/images/machinery-fleet.jpg", alt: "Plant at dawn", caption: "Earthworks fleet, first week on site" },
    ],
    quote: {
      text: "Seven months for 22 MW in Dodoma. We did not believe the programme until we saw the commissioning certificates.",
      author: "Dr. Emmanuel Lyimo",
      role: "Chief Infrastructure Officer, Serengeti Energy",
    },
    awards: ["Africa Data Centre Award — Fast-track Delivery 2025"],
  },
  {
    slug: "kigamboni-deepwater-terminal",
    code: "AB/CIV/2023-019",
    name: "Kigamboni Deepwater Terminal",
    division: "civil",
    sector: "Port & Marine",
    location: "Kigamboni, Dar es Salaam",
    coordinates: "06°49'44\"S 39°19'12\"E",
    year: 2023,
    status: "Completed",
    progress: 100,
    cover: "/images/project-port.jpg",
    coverAlt: "Aerial view of a new port terminal with gold gantry cranes",
    summary:
      "A 480 m quay wall, 18 ha of paved yard and four ship-to-shore cranes, delivered inside a live harbour.",
    intro:
      "The terminal had to be built without closing the existing berths, in a harbour carrying 90% of the country's container traffic. Dredging, quay construction and yard paving were sequenced around shipping windows agreed weekly with the port authority.",
    brief:
      "480 m of deepwater quay, 18 ha of container yard, crane rail foundations and marine works — inside a live operating harbour.",
    response:
      "We cast the quay wall using 42 m steel combi-piles from a floating template, then capped with a 2.4 m concrete beam cast in tidal windows. Yard paving used a slip-form paver on a 600 mm cement-stabilised base, with crane rails set to ±3 mm tolerance over 480 m.",
    outcomes: [
      "Crane rail tolerance ±3 mm over 480 m",
      "Terminal handed over while harbour stayed live",
      "18 ha yard paved in 14 weeks",
      "16.2 m dredged draft achieved",
    ],
    specs: [
      { label: "Quay length", value: "480", unit: "m" },
      { label: "Yard area", value: "180,000", unit: "m²" },
      { label: "Dredged draft", value: "16.2", unit: "m" },
      { label: "Combi-piles", value: "1,240", unit: "nr" },
      { label: "Contract value", value: "TZS 342B" },
      { label: "Duration", value: "38 months" },
      { label: "Client", value: "Zawadi Ports Authority" },
      { label: "Cranes", value: "4", unit: "STS" },
    ],
    phases: [
      { id: "p1", name: "Dredging & reclamation", window: "Q2 2020", state: "complete", progress: 100 },
      { id: "p2", name: "Quay piling", window: "Q4 2020–Q3 2021", state: "complete", progress: 100 },
      { id: "p3", name: "Quay cap & crane rails", window: "Q4 2021", state: "complete", progress: 100 },
      { id: "p4", name: "Yard paving & services", window: "Q1–Q3 2022", state: "complete", progress: 100 },
      { id: "p5", name: "Crane erection & handover", window: "Q4 2022–Q1 2023", state: "complete", progress: 100 },
    ],
    gallery: [
      { src: "/images/project-port.jpg", alt: "Completed terminal from the air", caption: "Quay, yard and STS cranes at handover" },
      { src: "/images/division-civil.jpg", alt: "Marine construction plant", caption: "Marine plant on the estuary crossing programme" },
    ],
    quote: {
      text: "Altra Build worked around our berth windows as if the harbour were the client. That discipline is why the terminal opened on schedule.",
      author: "Capt. Salim Rashid",
      role: "Harbour Master, Zawadi Ports Authority",
    },
    awards: ["East Africa Port Infrastructure Award 2023"],
  },
  {
    slug: "ubungo-intermodal-depot",
    code: "AB/IND/2023-071",
    name: "Ubungo Intermodal Depot",
    division: "industrial",
    sector: "Logistics",
    location: "Ubungo, Dar es Salaam",
    coordinates: "06°47'02\"S 39°12'44\"E",
    year: 2023,
    status: "Completed",
    progress: 100,
    cover: "/images/division-industrial.jpg",
    coverAlt: "Long-span warehouse interior with steel roof trusses",
    summary:
      "48 m clear-span warehousing, a rail spur and 6.4 ha of yard — Tanzania's first EDGE-certified logistics hub.",
    intro:
      "Imported cargo used to clear Dar es Salaam and then sit in the city. The Ubungo depot moves consolidation, cold chain and rail transfer outside the centre, cutting truck kilometres by a third.",
    brief:
      "Four warehouses with 48 m clear spans, a 1.2 km rail spur, cold-chain capability and EDGE certification — on a 12-hectare brownfield site.",
    response:
      "We remediated the brownfield, erected pre-engineered frames from our own yard, and built the cold rooms as independent insulated boxes inside the shell. Rail sidings were laid while the warehouses rose, with a shared drainage strategy that avoided a second excavation phase.",
    outcomes: [
      "48 m clear span, column-free warehousing",
      "EDGE Advanced certification achieved",
      "1.2 km rail spur delivered and commissioned",
      "34% reduction in customer truck kilometres",
    ],
    specs: [
      { label: "Warehouses", value: "4", unit: "nr" },
      { label: "Clear span", value: "48", unit: "m" },
      { label: "Built area", value: "36,800", unit: "m²" },
      { label: "Rail spur", value: "1.2", unit: "km" },
      { label: "Contract value", value: "TZS 94B" },
      { label: "Duration", value: "18 months" },
      { label: "Client", value: "Ubungo Freight Holdings" },
      { label: "Certification", value: "EDGE Advanced" },
    ],
    phases: [
      { id: "p1", name: "Brownfield remediation", window: "Q1 2022", state: "complete", progress: 100 },
      { id: "p2", name: "Foundations & slab", window: "Q2 2022", state: "complete", progress: 100 },
      { id: "p3", name: "Steel erection & roof", window: "Q3 2022", state: "complete", progress: 100 },
      { id: "p4", name: "Rail spur & yard", window: "Q4 2022", state: "complete", progress: 100 },
      { id: "p5", name: "Cold rooms & handover", window: "Q1 2023", state: "complete", progress: 100 },
    ],
    gallery: [
      { src: "/images/division-industrial.jpg", alt: "Warehouse interior at handover", caption: "48 m clear-span warehouse at handover" },
      { src: "/images/project-port.jpg", alt: "Port and logistics operation", caption: "Cargo consolidation into the depot" },
    ],
    quote: {
      text: "They delivered rail and warehousing on the same programme. Most contractors would have insisted on two phases and two years.",
      author: "Fatma Suleiman",
      role: "Managing Director, Ubungo Freight Holdings",
    },
    awards: ["EDGE Advanced — Green Building Council 2023"],
  },
];

export const projectFilters = ["All", "Civil", "Commercial", "Industrial", "Retrofit"] as const;

/* ------------------------------------------------------------------ */
/* Method, safety & ESG                                                */
/* ------------------------------------------------------------------ */
export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  detail: string;
  outputs: string[];
}

export const processSteps: ProcessStep[] = [
  {
    id: "survey",
    index: "01",
    title: "Survey & ground truth",
    detail:
      "LiDAR, drone photogrammetry and a minimum of six boreholes per 1,000 m². We price the ground we have actually measured, not the ground in the tender drawing.",
    outputs: ["Point cloud model", "Geotechnical report", "Risk register"],
  },
  {
    id: "design",
    index: "02",
    title: "Design & BIM coordination",
    detail:
      "Federated Revit model at LOD 400, clash detection in Navisworks, and a 4D programme linked to the construction sequence before mobilisation.",
    outputs: ["Federated model", "Clash report", "4D programme"],
  },
  {
    id: "mobilise",
    index: "03",
    title: "Mobilisation & earthworks",
    detail:
      "GPS grade-controlled plant, instrumented excavations and a site-specific safety plan signed off by the client and the regulator before first cut.",
    outputs: ["Site safety plan", "Grade control model", "Monitoring baseline"],
  },
  {
    id: "structure",
    index: "04",
    title: "Structure & envelope",
    detail:
      "Weekly look-ahead, daily concrete records, independent cube testing and a weather-tight envelope as early as the sequence allows.",
    outputs: ["Weekly dashboards", "Test certificates", "Progress survey"],
  },
  {
    id: "handover",
    index: "05",
    title: "Commissioning & handover",
    detail:
      "Integrated systems testing, O&M training, digital as-builts and a 24-month defects liability desk staffed by the same engineers who built it.",
    outputs: ["Commissioning plan", "Digital as-builts", "24-month warranty"],
  },
];

export const safety = {
  headline: "Zero is a number we maintain, not a slogan.",
  intro:
    "Every Altra Build site runs the Kifaru Standard: a 12-point daily verification regime, independent audits and a stop-work authority held by every worker on the payroll — including subcontractors.",
  stats: [
    { label: "Subcontractor compliance", value: "100%", note: "Passports renewed 2025" },
    { label: "TRIR", value: "0.00", note: "Recordable incident rate" },
    { label: "Independent audits", value: "46", note: "2025 calendar year" },
    { label: "Safety observations", value: "18,420", note: "Logged and closed 2025" },
  ],
  esg: [
    { label: "Waste diverted from landfill", value: "72%", note: "Across active sites" },
    { label: "Construction water recycled", value: "61%", note: "Batching & curing" },
    { label: "EDGE / LEED projects", value: "9", note: "Certified or in certification" },
    { label: "Local subcontract spend", value: "84%", note: "Tanzanian registered firms" },
  ],
  kifaruPoints: [
    "Stop-work authority for every worker on site",
    "Daily 12-point verification before first shift",
    "Independent monthly audit by SGS",
    "Fatigue and heat-stress monitoring in coastal works",
    "Subcontractor safety passports renewed annually",
  ],
};

/* ------------------------------------------------------------------ */
/* Fleet & digital delivery                                            */
/* ------------------------------------------------------------------ */
export interface Machine {
  id: string;
  tag: string;
  name: string;
  capability: string;
  units: number;
  status: "Active" | "Standby" | "Yard";
  telemetry: { label: string; value: string }[];
}

export const fleet: Machine[] = [
  {
    id: "tc",
    tag: "TC-09",
    name: "Tower cranes",
    capability: "Liebherr 250 EC-B · 70 m jib · 12 t max",
    units: 6,
    status: "Active",
    telemetry: [
      { label: "Max reach", value: "70 m" },
      { label: "Capacity", value: "12 t" },
      { label: "Wind cut-off", value: "20 m/s" },
    ],
  },
  {
    id: "ex",
    tag: "EX-021",
    name: "Tracked excavators",
    capability: "36 t class with Trimble Earthworks GPS",
    units: 14,
    status: "Active",
    telemetry: [
      { label: "Operating mass", value: "36 t" },
      { label: "Grade tolerance", value: "±10 mm" },
      { label: "Fleet hours", value: "41,200" },
    ],
  },
  {
    id: "cp",
    tag: "CP-04",
    name: "Concrete pumps",
    capability: "62 m boom · 180 m³/h · truck-mounted",
    units: 5,
    status: "Active",
    telemetry: [
      { label: "Vertical reach", value: "62 m" },
      { label: "Output", value: "180 m³/h" },
      { label: "Pour record", value: "2,140 m³" },
    ],
  },
  {
    id: "pl",
    tag: "PL-02",
    name: "Marine piling rigs",
    capability: "Jack-up barge · 2.6 m Ø · 45 m depth",
    units: 2,
    status: "Standby",
    telemetry: [
      { label: "Pile diameter", value: "2.6 m" },
      { label: "Max depth", value: "45 m" },
      { label: "Barge draft", value: "2.1 m" },
    ],
  },
  {
    id: "bp",
    tag: "BP-01",
    name: "Batching plants",
    capability: "Twin-shaft · 90 m³/h · ice plant for mass pours",
    units: 3,
    status: "Yard",
    telemetry: [
      { label: "Output", value: "90 m³/h" },
      { label: "Mix designs", value: "68" },
      { label: "Cube tests 2025", value: "9,140" },
    ],
  },
  {
    id: "dr",
    tag: "SV-03",
    name: "Survey & LiDAR",
    capability: "DJI Matrice 350 · Leica RTC360 · Trimble total stations",
    units: 8,
    status: "Active",
    telemetry: [
      { label: "Scan accuracy", value: "±1 mm" },
      { label: "Coverage", value: "18 ha/day" },
      { label: "Point clouds", value: "214" },
    ],
  },
];

export interface TechItem {
  id: string;
  name: string;
  detail: string;
  tag: string;
}

export const bimStack: TechItem[] = [
  {
    id: "bim",
    name: "BIM Level 3",
    detail: "Federated models shared with client and consultants in a common data environment, ISO 19650 aligned.",
    tag: "ISO 19650",
  },
  {
    id: "revit",
    name: "Revit · LOD 400",
    detail: "Every structural element modelled to fabrication level, with rebar and embed coordination.",
    tag: "LOD 400",
  },
  {
    id: "4d",
    name: "Synchro 4D",
    detail: "Programme simulation linked to the model, reviewed weekly against actual progress captured on site.",
    tag: "4D",
  },
  {
    id: "lidar",
    name: "LiDAR & photogrammetry",
    detail: "Weekly drone flights produce cut/fill volumes and as-built surfaces within 24 hours.",
    tag: "±1 mm",
  },
  {
    id: "clash",
    name: "Navisworks clash",
    detail: "Services coordination resolved before fabrication. Zero unresolved hard clashes at mobilisation.",
    tag: "0 hard clashes",
  },
  {
    id: "portal",
    name: "Altra Portal",
    detail: "Clients track progress, RFIs, invoices and safety statistics in real time — the same data our site teams use.",
    tag: "Live",
  },
];

/* ------------------------------------------------------------------ */
/* Estimator                                                           */
/* ------------------------------------------------------------------ */
export interface EstimatorOption {
  id: string;
  label: string;
  detail?: string;
  multiplier: number;
  ratePerSqm: number;
  weeksPer1000Sqm: number;
  baseWeeks: number;
}

export const estimatorTypes: EstimatorOption[] = [
  { id: "civil", label: "Heavy civil", detail: "Bridges, marine, roads", multiplier: 1, ratePerSqm: 1_950_000, weeksPer1000Sqm: 3.4, baseWeeks: 26 },
  { id: "commercial", label: "Commercial", detail: "Towers, offices, hotels", multiplier: 1, ratePerSqm: 1_480_000, weeksPer1000Sqm: 2.2, baseWeeks: 22 },
  { id: "industrial", label: "Industrial", detail: "Warehouses, plants, data", multiplier: 1, ratePerSqm: 1_120_000, weeksPer1000Sqm: 1.5, baseWeeks: 16 },
  { id: "retrofit", label: "Retrofit", detail: "Strengthening, reuse", multiplier: 1, ratePerSqm: 980_000, weeksPer1000Sqm: 2.8, baseWeeks: 20 },
];

export const estimatorLocations: EstimatorOption[] = [
  { id: "dar", label: "Dar es Salaam", detail: "Coastal · established supply chain", multiplier: 1.06, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "dodoma", label: "Dodoma", detail: "Capital region · rail-linked", multiplier: 1.0, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "mwanza", label: "Mwanza", detail: "Lake zone · barge logistics", multiplier: 1.04, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "zanzibar", label: "Zanzibar", detail: "Island · ferry freight", multiplier: 1.12, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "arusha", label: "Arusha", detail: "Northern corridor", multiplier: 1.02, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "other", label: "Other region", detail: "Remote mobilisation", multiplier: 1.09, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
];

export const estimatorGround: EstimatorOption[] = [
  { id: "sand", label: "Clean sand / gravel", detail: "Standard spread footing", multiplier: 1, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "coral", label: "Coral limestone", detail: "Rock probing required", multiplier: 1.03, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "clay", label: "Expansive clay", detail: "Under-ream or raft", multiplier: 1.08, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "rock", label: "Hard rock", detail: "Pre-split or hoe ram", multiplier: 1.12, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "waterfront", label: "Reclaimed / waterfront", detail: "Marine piling likely", multiplier: 1.17, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
];

export const estimatorFinish: EstimatorOption[] = [
  { id: "shell", label: "Shell & core", detail: "Structure and envelope", multiplier: 1, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "standard", label: "Standard finish", detail: "Let-ready commercial", multiplier: 1.14, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "premium", label: "Premium", detail: "Hospitality-grade", multiplier: 1.32, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
  { id: "critical", label: "Mission-critical", detail: "Data / cold chain", multiplier: 1.47, ratePerSqm: 0, weeksPer1000Sqm: 0, baseWeeks: 0 },
];

export const estimatorConfig = {
  minArea: 250,
  maxArea: 60000,
  defaultArea: 8500,
  contingency: 0.08,
  rangeSpread: 0.12,
  usdRate: 2650,
  disclaimer:
    "Indicative order-of-cost only, derived from Altra Build's 2025 delivered rates. Excludes land, finance and professional fees. A formal tender requires a site inspection and geotechnical investigation.",
};

/* ------------------------------------------------------------------ */
/* Social proof                                                        */
/* ------------------------------------------------------------------ */
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  project: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "We have worked with international contractors. Altra Build documents better, escalates faster, and finishes earlier than any of them.",
    author: "Zahara Kimaro",
    role: "Development Director, Tumaini Estates",
    project: "Msasani Peninsula Tower",
  },
  {
    id: "t2",
    quote:
      "Their site manager knew our harbour rules better than our own operations team. That is why the terminal opened on schedule.",
    author: "Capt. Salim Rashid",
    role: "Harbour Master, Zawadi Ports Authority",
    project: "Kigamboni Deepwater Terminal",
  },
  {
    id: "t3",
    quote:
      "Seven months, 22 MW, zero lost-time injuries. We now use Altra Build as the benchmark in our investment papers.",
    author: "Dr. Emmanuel Lyimo",
    role: "Chief Infrastructure Officer, Serengeti Energy",
    project: "Dodoma Hyperscale Campus",
  },
];

export const clients = [
  "Tumaini Estates",
  "Zawadi Ports Authority",
  "Serengeti Energy",
  "Ubungo Freight",
  "Kariakoo Traders",
  "Kilimanjaro Hospitality",
  "Pwani Water Board",
  "Tanzania Rail Assets",
];

/* ------------------------------------------------------------------ */
/* Client portal (demo data)                                           */
/* ------------------------------------------------------------------ */
export interface PortalProject {
  id: string;
  code: string;
  name: string;
  phase: string;
  progress: number;
  nextMilestone: string;
  nextMilestoneDate: string;
  contractValue: string;
  status: "On programme" | "At risk" | "Complete";
  documents: { name: string; updated: string; type: string }[];
  invoices: { ref: string; amount: string; status: "Paid" | "Due" | "Submitted" }[];
  rfis: { ref: string; subject: string; status: "Open" | "Answered" }[];
}

export const portalProjects: PortalProject[] = [
  {
    id: "pp1",
    code: "AB/COM/2025-112",
    name: "Msasani Peninsula Tower",
    phase: "Commissioning & handover",
    progress: 96,
    nextMilestone: "Practical completion certificate",
    nextMilestoneDate: "2026-01-16",
    contractValue: "TZS 268B",
    status: "On programme",
    documents: [
      { name: "Façade test report — Rev C", updated: "2026-11-14", type: "PDF" },
      { name: "Commissioning plan", updated: "2026-11-09", type: "PDF" },
      { name: "As-built model (federated)", updated: "2026-11-02", type: "IFC" },
    ],
    invoices: [
      { ref: "INV-2214", amount: "TZS 8.2B", status: "Paid" },
      { ref: "INV-2261", amount: "TZS 6.4B", status: "Submitted" },
      { ref: "INV-2288", amount: "TZS 4.1B", status: "Due" },
    ],
    rfis: [
      { ref: "RFI-410", subject: "Lift lobby stone tolerance", status: "Answered" },
      { ref: "RFI-417", subject: "Chiller acoustic enclosure", status: "Open" },
    ],
  },
  {
    id: "pp2",
    code: "AB/IND/2025-134",
    name: "Dodoma Hyperscale Campus",
    phase: "Defects liability",
    progress: 100,
    nextMilestone: "12-month defects review",
    nextMilestoneDate: "2026-03-04",
    contractValue: "TZS 186B",
    status: "Complete",
    documents: [
      { name: "IST close-out report", updated: "2025-12-18", type: "PDF" },
      { name: "O&M manuals", updated: "2025-12-10", type: "ZIP" },
    ],
    invoices: [{ ref: "INV-1980", amount: "TZS 12.0B", status: "Paid" }],
    rfis: [{ ref: "RFI-339", subject: "Solar inverter clearance", status: "Answered" }],
  },
  {
    id: "pp3",
    code: "AB/CIV/2026-051",
    name: "Mwanza Bay Link",
    phase: "Piling & pier works",
    progress: 34,
    nextMilestone: "Pier 4 pile cap completion",
    nextMilestoneDate: "2026-12-19",
    contractValue: "TZS 198B",
    status: "At risk",
    documents: [
      { name: "Marine method statement", updated: "2026-11-18", type: "PDF" },
      { name: "Pile load test results", updated: "2026-11-11", type: "PDF" },
    ],
    invoices: [{ ref: "INV-2340", amount: "TZS 5.6B", status: "Due" }],
    rfis: [{ ref: "RFI-512", subject: "Barge mooring during high water", status: "Open" }],
  },
];

export const portalActivity = [
  { time: "07:42", text: "Concrete cube results uploaded — Msasani L31–L33", tag: "QA" },
  { time: "09:15", text: "RFI-512 raised: barge mooring during high water", tag: "RFI" },
  { time: "11:03", text: "Weekly safety observation summary closed — 0 open", tag: "HSE" },
  { time: "14:26", text: "Progress survey synced from Leica RTC360", tag: "SURVEY" },
  { time: "16:50", text: "Interim certificate 14 issued to client", tag: "COMM" },
];

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */
export const brandAssets = {
  palette: [
    { name: "Obsidian", hex: "#0F1117", role: "Primary ink · dark surfaces" },
    { name: "Ink", hex: "#1C1C26", role: "Wordmark · body copy" },
    { name: "Signal Gold", hex: "#F7BC32", role: "Emblem · primary accent" },
    { name: "Alabaster", hex: "#F7F2E7", role: "Primary surface" },
    { name: "Cream", hex: "#FFF3E7", role: "Logo clear space" },
    { name: "Hazard", hex: "#E05A1B", role: "Safety · alerts" },
    { name: "Steel", hex: "#47566B", role: "Secondary text" },
    { name: "Concrete", hex: "#8C8577", role: "Technical metadata" },
  ],
  variants: [
    { name: "Primary lockup", src: "/brand/altra-logo.svg", surface: "light", ratio: 6.12 },
    { name: "Inverse lockup", src: "/brand/altra-logo-inverse.svg", surface: "dark", ratio: 6.12 },
    { name: "Emblem", src: "/brand/altra-mark.svg", surface: "light", ratio: 1.06 },
    { name: "Emblem inverse", src: "/brand/altra-mark-inverse.svg", surface: "dark", ratio: 1.06 },
    { name: "Mono ink", src: "/brand/altra-logo-mono-ink.svg", surface: "light", ratio: 6.12 },
    { name: "Mono cream", src: "/brand/altra-logo-mono-cream.svg", surface: "dark", ratio: 6.12 },
  ],
  rules: {
    do: [
      "Use the approved SVG lockup, unmodified in proportion.",
      "Keep clear space of at least half the emblem diameter on all sides.",
      "Place the primary lockup on alabaster, cream or white.",
      "Use the inverse lockup on obsidian and photography.",
    ],
    dont: [
      "Do not stretch, rotate, outline or re-colour the rhino.",
      "Do not place the primary lockup on gold or busy imagery.",
      "Do not recreate the wordmark in another typeface.",
      "Do not crop the emblem to a sliver below 28 px.",
    ],
  },
  type: [
    { name: "Space Grotesk", role: "Display · headings", sample: "Engineering tomorrow's horizons" },
    { name: "Inter", role: "Body · interface", sample: "Precision civil engineering since 2009." },
    { name: "JetBrains Mono", role: "Metadata · metrics", sample: "REF: AB/CIV/2026-047 · 06°46'58\"S" },
  ],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getDivision(id: DivisionId): Division {
  const found = divisions.find((d) => d.id === id);
  return found ?? divisions[0]!;
}

export function adjacentProjects(slug: string): { prev: Project; next: Project } {
  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;
  return { prev, next };
}
