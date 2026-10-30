/* ==========================================================================
   data/projects.js - the project catalogue.

   Each project:
     id, title, category, year, context, summary, tags, thumb
     optional: featured, thumbMotion (silent H.264 video, 800 x 450, shown on hover), youtube [{id, label, start (seconds, optional)}], videoPending (string),
               embed {url, label, note}, links [{label, url}], body (HTML),
               fragment (HTML file loaded into the body), gallery [{src, caption}],
               copyPending (true = body is placeholder text, still to be written)

   category is one of the three CATEGORIES ids. tags are free text and are
   filterable on the work page, so a project can belong to many threads.
   Order inside a category is the order shown on the work page.
   ========================================================================== */

window.CATEGORIES = [
  {
    id: "web",
    label: "Websites & products",
    navigationLabel: "Web & products",
    blurb: "Shipped tools and client sites",
    description:
      "Products that run in professional practice and sites built for clients: pricing simulators, a finance engine inside SketchUp, a rare-disease atlas, an open interactive book."
  },
  {
    id: "games",
    label: "Games & simulations",
    blurb: "Playable worlds, simulations, generative code",
    description:
      "Games on generated boards, naval battles rebuilt in 3D, a zen garden, simulations of how settlements, markets and populations organise themselves, and systems that grow their own outcomes: wave function collapse, fractals, erosion, GPU shaders, a transformer that composes like Beethoven."
  },
  {
    id: "interactive",
    label: "Interactive technology",
    navigationLabel: "Interactive",
    blurb: "Sensors, projection, XR, optics",
    description:
      "Physical and virtual spaces that respond to people: a projected sand table, projection onto a moving face, a subway inside a cube, ghosts on a brick wall, glass that computes."
  }
];

/* Placeholder copy for projects whose text has not been written yet.
   Rendered with a visible "copy pending" marker. */
window.PROJECTS = [
  /* ================================================================ web */
  {
    id: "parcbalance",
    featured: true,
    title: "ParcBalance: a behavior-model driven parking-space pricing simulator",
    category: "web",
    year: "2023 – 2025",
    context: "Product, used on projects in Jinan, Panjin and Qingdao",
    summary:
      "How do customers choose parking lots? At what price? This tool answers these questions by modeling customers and the spatial arrangment, simulates their decision making behaviors, and give you the developer a fully optimized price scheme.",
    tags: ["product", "real estate", "simulation", "architecture + urbanism", "ML+AI", "systems modelling", "finance", "web app", "research"],
    thumb: "img/projects/parcbalance.jpg",
    thumbMotion: "img/projects/motion/parcbalance.mp4",
    links: [
      { label: "Live", url: "https://parking-lot-pricing.vercel.app/" },
      { label: "Code", url: "https://github.com/ludwigpeking/ParcBalance_2505" }
    ],
  },
  {
    id: "decisive",
    featured: true,
    title: "Decisive 妙算: financial model while designing.",
    category: "web",
    year: "2024 – 2026",
    context: "Product, dcdecisive.com",
    summary:
      "Change a unit or move a building in the model and the cash flow updates. A Ruby extension that couples the design of a development to its financial outcome as you draw.",
    tags: ["product", "Ruby", "real estate", "finance", "simulation", "architecture + urbanism", "ML+AI", "systems modelling"],
    thumb: "img/projects/decisive.jpg",
    thumbMotion: "img/projects/motion/decisive.mp4",
    links: [
      { label: "Live", url: "https://dcdecisive.com/" },
      { label: "Code", url: "https://github.com/ludwigpeking/rubySketchupPlanningUtil" }
    ],
  },
  {
    id: "algorithms-of-the-city",
    featured: true,
    title: "The Algorithms of the City",
    category: "web",
    year: "2026 –",
    context: "Open interactive book and lecture",
    summary:
      "An interactive book of urban self-organisation: on resources, pathfinding, spatial syntax and spatial optimisation, each with a simulation you can run.",
    tags: ["open book", "architecture + urbanism", "simulation", "webGL + three.js", "exhibited + award", "real estate", "game", "procedural", "history", "ML+AI", "systems modelling", "finance", "web app", "shaders"],
    thumb: "img/projects/algorithms-of-the-city.jpg",
    thumbMotion: "img/projects/motion/algorithms-of-the-city.mp4",
    youtube: [
      { id: "BnPAcg75PMg", start: 242, label: "Intelligent simulations: the three iterations" },
      { id: "xrFgm3PKJoA", label: "Algorithms of the City" }
    ],
    links: [
      { label: "Live", url: "https://www.rattenstadt.com/Springshow2026/" },
      { label: "Vercel version", url: "https://2603-the-algorithms-of-the-city.vercel.app/" },
      { label: "Code", url: "https://github.com/ludwigpeking/2603_theAlgorithmsOfTheCity" }
    ],
  },
  {
    id: "ariadne",
    title: "Ariadne Rare Disease Atlas",
    category: "web",
    year: "2026",
    context: "Product, ariadne.dcdecisive.com",
    summary:
      "An interactive map of rare diseases: a weighted evidence graph with sourced edges, node2vec similarity ranking. A practitioner, researcher, or patient can search along the tree, fulling informed by the context.",
    tags: ["product", "ML+AI", "web app", "UI + UX"],
    thumb: "img/projects/ariadne.jpg",
    thumbMotion: "img/projects/motion/ariadne.mp4",
    links: [
      { label: "Live", url: "https://ariadne.dcdecisive.com/" },
      { label: "Code", url: "https://github.com/ludwigpeking/Ariadne-rare-disease-atlas" }
    ],
  },
  {
    id: "altrovia",
    title: "Altrovia: branding and website (team)",
    category: "web",
    year: "2026",
    context: "Client work, altrovia.ai",
    summary:
      "This project won the Adobe x NYU competition 2026, for Best Branding - Identity and site design for a clinical-trial design company:  logo, animation and a landing page. Teammates: Minglu Zhong, Tiffany Ziyi Yuan, Kurt Mu Qian.",
    tags: ["UI + UX", "animation", "web app", "product", "exhibited + award"],
    thumb: "img/projects/altrovia.jpg",
    thumbMotion: "img/projects/motion/altrovia.mp4",
    links: [
      { label: "Live", url: "https://www.altrovia.ai/" },
      { label: "Code", url: "https://github.com/ludwigpeking/2604_Altrovia_Website" }
    ],
  },
  {
    id: "vortego",
    featured: true,
    title: "VorteGo: a superset of Go, with GNN AI player training",
    category: "web",
    year: "2026",
    context: "Independent project, online",
    summary:
      "A superset of the game Go played on a graph rather than a grid. A GNN model trained for it and can be generalized to other Go boards. A website for online multiplayer. A tournament of VorteGo is running in NYC.",
    tags: ["game", "p5.js", "computational geometry", "webGL + three.js", "product", "ML+AI", "web app"],
    thumb: "img/projects/vortego.jpg",
    thumbMotion: "img/projects/motion/vortego.mp4",
    youtube: [{ id: "JJR4gnOrZX0", start: 143, label: "VorteGo: what if you play Go on Lost Temple?" }],
    links: [
      { label: "Play", url: "https://vortego.itp.io/" },
      { label: "Code", url: "https://github.com/ludwigpeking/VorteGoWebsite" },
      { label: "HexGoban", url: "https://github.com/ludwigpeking/HexGoban" }
    ],
  },
  {
    id: "the-pantheon",
    title: "The Pantheon",
    category: "web",
    year: "2026",
    context: "NYU ITP, ML for 3D",
    summary:
      "An online memorial to remember the lost, and maintain the community and bond could be lost with them too.",
    tags: ["Gaussian splatting", "webGL + three.js", "architecture + urbanism", "product", "web app"],
    links: [{ label: "Live", url: "https://www.rattenstadt.com/2604_thePantheonTemplePrecinct/" }, { label: "Code", url: "https://github.com/ludwigpeking/2604_thePantheonTemplePrecinct" }],
    thumb: "img/projects/the-pantheon.jpg",
    thumbMotion: "img/projects/motion/the-pantheon.mp4",
  },

  /* ============================================================== games */
  {
    id: "clash-of-iron",
    title: "Clash of Iron 大艦巨砲: restoration of the historical naval battles",
    category: "games",
    year: "2026",
    context: "Independent project, film series and Godot scenes",
    summary:
      "Uses historical records to reconstruct and reconciliate the tracks of the ships in the historical naval battles at the accuracy without precedence. using procedural generation of ships.",
    tags: ["history", "video", "shaders", "simulation", "procedural", "game", "VR + WebXR", "research", "published"],
    thumb: "img/projects/clash-of-iron.jpg",
    thumbMotion: "img/projects/motion/clash-of-iron.mp4",
    embed: {
      url: "https://www.rattenstadt.com/ClashOfIronMaps/?lang=en",
      label: "Open the battle maps"
    },
    links: [
      { label: "Battle maps", url: "https://www.rattenstadt.com/ClashOfIronMaps/?lang=en" },
      { label: "Code", url: "https://github.com/ludwigpeking/NavalBattles" }
    ],
    youtubeAtEnd: true,
    youtube: [
      { id: "92UMnXJkuR4", start: 1645, label: "Clash of Iron: the battles in 3DCG" },
      { id: "pwhKH2OnY-U", label: "The Battle of Tsushima in 3D (58 min)" },
      { id: "A_Acq_oTGgE", label: "黄海海战 1894 开发日志 (Chinese)" },
      { id: "xnsX_WNRLPc", label: "黄海海戦 1894 (Japanese)" }
    ],
  },
  {
    id: "a-quiet-practice",
    title: "A Quiet Practice 静かなひととき",
    category: "games",
    year: "2026",
    context: "Published on itch.io",
    summary:
      "A dry-landscape garden you tend at your own pace: rake the gravel, shape the sand, place four stones. No score, no timer. Four seasons, wind and cicadas.",
    tags: ["game", "webGL + three.js", "published", "procedural", "simulation", "architecture + urbanism", "generative art"],
    thumb: "img/projects/a-quiet-practice.jpg",
    thumbMotion: "img/projects/motion/a-quiet-practice.mp4",
    youtube: [{ id: "hMuYt7BOra8", label: "A Quiet Practice (film)" }],
    links: [
      { label: "Live", url: "https://www.rattenstadt.com/a-quiet-practice-ryoanji/" },
      { label: "itch.io", url: "https://ludwigpeking.itch.io/a-quiet-practice" },
      { label: "Play online", url: "https://ryoanji-still-garden.ludwig-peking.chatgpt.site/" }
    ],
  },
  {
    id: "rome-wfc",
    featured: true,
    title: "A Town in a Simulation of Real Estate Market",
    category: "games",
    year: "2026",
    context: "Independent study",
    summary:
      "It simulates the traffic, taxation and the real estate market, transaction and development in a growing town. The town takes form by the accumulated little decisions made by habitants.",
    tags: ["simulation", "webGL + three.js", "history", "procedural", "video", "architecture + urbanism", "real estate", "systems modelling", "generative art"],
    thumb: "img/projects/rome-wfc.jpg",
    thumbMotion: "img/projects/motion/rome-wfc.mp4",
    youtube: [{ id: "bvacpcuEwmA", label: "Rebuild Rome: algorithmic generation" }],
  },
  {
    id: "cathay-heroes",
    title: "Cathay Heroes 諸夏英豪傳",
    category: "games",
    year: "2026",
    context: "Independent project",
    summary:
      "Rise from gig worker to tycoon or warlord, in the vibrant land of China.",
    tags: ["game", "GIS", "generative art", "simulation", "procedural", "systems modelling"],
    links: [{ label: "Live", url: "https://cathay-heroes.vercel.app/" }],
    thumb: "img/projects/cathay-heroes.jpg",
    thumbMotion: "img/projects/motion/cathay-heroes.mp4",
  },
  {
    id: "last-day-of-ais",
    title: "The Last Day of AIs",
    category: "games",
    year: "2026",
    context: "Independent project",
    summary:
      "Test the future of humanity - where the attitude to AI may matter more than the ideologies. A geopolitical strategy game about the AGI transition. Play a head of state, a Big Tech CEO or a non-state actor.",
    tags: ["game", "webGL + three.js", "systems modelling", "research", "simulation", "ML+AI"],
    thumb: "img/projects/last-day-of-ais.jpg",
    thumbMotion: "img/projects/motion/last-day-of-ais.mp4",
    links: [{ label: "Live", url: "https://the-last-day-of-ais.vercel.app/" }, { label: "Code", url: "https://github.com/ludwigpeking/theLastDayOfAIs" }],
  },
  {
    id: "malthusian-world",
    title: "Malthusian World",
    category: "games",
    year: "2022 – 2025",
    context: "Independent study",
    summary:
      "Bands of people grow, move and split on a resource grid, passing through ages of Eden and Collapse and sometimes a long metastable calm.",
    tags: ["p5.js", "music", "simulation", "history", "systems modelling"],
    thumb: "img/projects/malthusian-world.jpg",
    thumbMotion: "img/projects/motion/malthusian-world.mp4",
    embed: {
      url: "https://malthusian-world.vercel.app/",
      label: "Run the world"
    },
    links: [
      { label: "Code", url: "https://github.com/ludwigpeking/MalthusianWorld" },
      { label: "Live", url: "https://malthusian-world.vercel.app/" }
    ],
    fragment: "coding/malthusian.html",
  },
  {
    id: "becoming-city",
    title: "becomingCity: a value-grid city generator",
    category: "games",
    year: "2022 – 2025",
    context: "Independent study",
    summary:
      "Settlers with different professions weigh the same landscape differently, and a town emerges from where each of them chooses to build.",
    tags: ["architecture + urbanism", "p5.js", "simulation", "procedural", "history", "systems modelling"],
    thumb: "img/projects/becoming-city.jpg",
    thumbMotion: "img/projects/motion/becoming-city.mp4",
    embed: {
      url: "https://becoming-city.vercel.app/",
      label: "Grow a town"
    },
    links: [
      { label: "Code", url: "https://github.com/ludwigpeking/becomingCity" },
      { label: "Live", url: "https://becoming-city.vercel.app/" }
    ],
    fragment: "coding/city-values.html"
  },
  {
    id: "grid-erosion",
    title: "Grids: their traffic patterns and erosion",
    category: "games",
    year: "2023",
    context: "Independent study",
    summary:
      "Imagine there's fall of our civilization: The mighty dominating city street grids erode under crisis and informal occupation, reshaping the city.",
    tags: ["architecture + urbanism", "simulation", "p5.js", "history", "systems modelling"],
    thumb: "img/projects/grid-erosion.jpg",
    thumbMotion: "img/projects/motion/grid-erosion.mp4",
    embed: {
      url: "https://grid-erosion.vercel.app/",
      label: "Run the grid"
    },
    links: [
      { label: "Code", url: "https://github.com/ludwigpeking/grid-erosion" },
      { label: "Live", url: "https://grid-erosion.vercel.app/" }
    ],
    fragment: "coding/grid-erosion.html"
  },

  /* ======================================================== interactive */
  {
    id: "sand-table",
    featured: true,
    title: "Hexagonal World: a projected sand-table city simulator",
    category: "interactive",
    year: "2025 – 2026",
    context: "NYU ITP, Winter Show 2025 and Spring Show 2026",
    summary:
      "Shape the sand with your hands and a city grows on it. A Kinect reads the terrain, a projector paints settlements, roads and land use back onto the sand in real time.",
    tags: ["installation", "projection mapping", "architecture + urbanism", "simulation", "p5.js", "webGL + three.js", "GIS", "exhibited + award", "game", "digital fabrication", "history", "systems modelling"],
    thumb: "img/projects/sand-table.jpg",
    thumbMotion: "img/projects/motion/sand-table.mp4",
    youtube: [{ id: "BnPAcg75PMg", label: "Intelligent simulations: the three iterations" }],
    links: [
      { label: "Live", url: "https://world-seven-gray.vercel.app/" },
      { label: "Code (Winter Show)", url: "https://github.com/ludwigpeking/2511_Hexaganal_World" },
      { label: "Code (Spring Show)", url: "https://github.com/ludwigpeking/Springshow2026" }
    ],
  },
  {
    id: "motion-projection",
    title: "Motion Projection: projection mapping on a moving face",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, projection mapping",
    summary:
      "A projector that finds its own way onto a face. A Gray-code scan calibrates projector to camera; MediaPipe landmarks and Kinect depth then keep a painted mask locked to the face in closed loop.",
    tags: ["projection mapping", "computer vision", "Python", "video", "computational geometry"],
    thumb: "img/projects/motion-projection.jpg",
    thumbMotion: "img/projects/motion/motion-projection.mp4",
    youtube: [{ id: "-aCN75vNGhA", start: 4, label: "How to projection map on a moving object? (9:21)" }],
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/MotionProjection" }],
  },
  {
    id: "nyc-subway-cube",
    title: "NYC Subway in Unkown Dimension",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, projection mapping",
    summary:
      "The whole subway network laid out procedurally inside a cube, animated in Blender for projection onto a physical box. Each of the 158 stations has its own jingle and announcement.",
    tags: ["projection mapping", "data visualization", "video", "procedural", "installation"],
    thumb: "img/projects/nyc-subway-cube.jpg",
    thumbMotion: "img/projects/motion/nyc-subway-cube.mp4",
    youtube: [
      { id: "2Dt884pKMxk", label: "An NYC Metro Dream" },
      { id: "gMmwr8R3CEA", label: "NYC metro with Yamanote styles (short)" }
    ],
  },
  {
    id: "optical-network",
    title: "Free-form optical network & OpticsBench",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, digital fabrication",
    summary:
      "Four stacked free-form glass layers, trained with the adjoint method so that white light passing through them comes out as an image. Plus an optical bench app for designing printable lenses, and a nine-minute primer on optical computing.",
    tags: ["digital fabrication", "Python", "research", "video", "simulation", "installation"],
    thumb: "img/projects/optical-network.jpg",
  },
  {
    id: "brick-ghosts",
    title: "Projection on Pearl Street, Brooklyn",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, projection mapping",
    summary:
      "Ghost faces, a flock and a line of dancers rendered as per-brick displacement relief for an 8 by 12 metre brick wall in downtown Brooklyn, with three synthesised soundtracks.",
    tags: ["projection mapping", "installation", "video", "procedural", "computer vision"],
    thumb: "img/projects/brick-ghosts.jpg",
    thumbMotion: "img/projects/motion/brick-ghosts.mp4",
    links: [
      { label: "Live", url: "https://www.rattenstadt.com/projection-on-brick-wall/" },
      { label: "Code", url: "https://github.com/ludwigpeking/projection-on-brick-wall" }
    ],
  },
  {
    id: "ghost-corridor",
    title: "Tracking",
    category: "interactive",
    year: "2025",
    context: "NYU ITP, physical computing",
    summary:
      "A Halloween installation. Flocking ghosts react to how far people stand from an Azure Kinect, with spatial audio and a 3D-printed mask on the sensor.",
    tags: ["installation", "p5.js", "Python", "digital fabrication", "exhibited + award"],
    thumb: "img/projects/ghost-corridor.jpg",
    thumbMotion: "img/projects/motion/ghost-corridor.mp4",
    youtube: [{ id: "eSlbDPIE7yQ", label: "Poor men's air defense (short)" }],
    links: [
      { label: "Live", url: "https://2025-halloween-eta.vercel.app/" },
      { label: "Code", url: "https://github.com/ludwigpeking/2025-holloween" }
    ],
  },
  {
    id: "playful-nyc-xr",
    title: "WebXR Playful NYC (team)",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, team project",
    summary:
      "Won Parsons New School Creative Center Award. A multiplayer WebXR scene of a New York fire escape at night, shared over a local network, with AR occlusion tests and a day-night cycle. Teammates: Aditya De, Elisabeth Kezia, Eros",
    tags: ["VR + WebXR", "webGL + three.js", "simulation", "procedural", "game", "exhibited + award", "installation"],
    thumb: "img/projects/playful-nyc-xr.jpg",
    thumbMotion: "img/projects/motion/playful-nyc-xr.mp4",
  },
  {
    id: "beethoven-motif-lab",
    title: "Beethoven Motif Lab",
    category: "interactive",
    year: "2025 – 2026",
    context: "Independent research and documentary",
    summary:
      "A custom PyTorch transformer trained on the 32 piano sonatas, with pitch-aware rotary attention, chord and cadence models, fitness critics and a blind listening test. And a nineteen-minute film on how AI learned music.",
    tags: ["ML+AI", "music", "research"],
    thumb: "img/projects/beethoven-motif-lab.jpg",
    youtube: [
      { id: "-byFesduBOs", start: 694, label: "How AI music actually works (19:00)" },
      { id: "p_z_A9FTAwU", label: "AI 是怎么学会作曲的 (Chinese)" }
    ],
  },
  {
    id: "tube-shader",
    title: "Hand Pose Controlled Shader",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, shader programming",
    summary:
      "A three-dimensional ribbon drawn in the air with a webcam. Palm width and camera field of view give the depth; a custom shader lofts the path into a tube.",
    tags: ["p5.js", "computer vision", "webGL + three.js", "ML+AI", "shaders"],
    thumb: "img/projects/tube-shader.jpg",
    thumbMotion: "img/projects/motion/tube-shader.mp4",
    embed: {
      url: "https://editor.p5js.org/ludwig.peking/full/NqolOlefE",
      label: "Run it (needs a webcam)"
    },
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/2602_WebcamShader" }],
  },
  {
    id: "p5-sketches",
    title: "p5.js sketches",
    category: "interactive",
    year: "2024 – 2026",
    context: "Ongoing practice",
    summary:
      "A running collection of small p5.js programs: shaders, physics, generative drawing, a Markov chain that composes like Beethoven, a class that draws floor plans. Each runs in the browser.",
    tags: ["p5.js", "shaders", "procedural", "generative art", "music"],
    thumb: "img/projects/p5-sketches.jpg",
    thumbMotion: "img/projects/motion/p5-sketches.mp4",
    links: [{ label: "Live", url: "sketches.html" }],
  },
  {
    id: "quadrangulation",
    title: "Quadrangulating the hexagon",
    category: "interactive",
    year: "2024",
    context: "Independent study",
    summary:
      "A research on Oskar Stalberg's method of quadrangulaiton.  First triangulated, the triangles are then merged into quads, and the mesh is relaxed until every cell is close to square.",
    tags: ["computational geometry", "p5.js", "procedural", "game"],
    thumb: "img/projects/quadrangulation.jpg",
    thumbMotion: "img/projects/motion/quadrangulation.mp4",
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/quadrangulation" }],
  },

  /* ================================== games: generative (was creative) */
  {
    id: "shoin-zukuri",
    featured: true,
    title: "WFC Shoin-zukuri: an infinite generator of classical architecture",
    category: "games",
    year: "2022 – 2026",
    context: "Independent study",
    summary:
      "Wave function collapse algorithm over tectonic building blocks produces endless, surprising classical building complex on a",
    tags: ["webGL + three.js", "procedural", "video", "architecture + urbanism", "ML+AI", "generative art", "shaders"],
    thumb: "img/projects/shoin-zukuri.jpg",
    thumbMotion: "img/projects/motion/shoin-zukuri.mp4",
    youtube: [
      { id: "cQL4t5zoCNk", start: 429, label: "A walkthrough of Shoin-zukuri WFC" },
      { id: "Lgg20hnOQvI", label: "Architecture in 24 blocks: wave function collapse (5:40)" }
    ],
    embed: {
      url: "https://shoin-zukuri-wfc.vercel.app/",
      label: "Generate a building",
      note: "Runs in the page. Drag to orbit, scroll to zoom, change the seed to get a new complex."
    },
    links: [
      { label: "Code", url: "https://github.com/ludwigpeking/Shoin_zukuri_WFC" },
      { label: "Live", url: "https://shoin-zukuri-wfc.vercel.app/" }
    ],
    fragment: "coding/shoin-zukuri.html",
  },
  {
    id: "wfc-floorplan",
    featured: true,
    title: "Floor plans by wave function collapse",
    category: "games",
    year: "2022 – 2026",
    context: "R&D for a developer, then independent study",
    summary:
      "Apartment plans generated from tectonic rules rather than precedent. Valid adjacencies are learned from sample plans, then rooms collapse one by one into a complete layout. Now with a web studio and a film.",
    tags: ["Python", "video", "real estate", "architecture + urbanism", "ML+AI", "research"],
    thumb: "img/projects/wfc-floorplan.jpg",
    thumbMotion: "img/projects/motion/wfc-floorplan.mp4",
    youtube: [{ id: "7-f_Z4S9-rE", label: "Floor plan generation from wave function collapse (5:03)" }],
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/WFC_floorPlan_Generation" }],
    fragment: "coding/wfc-floorplan.html",
  },
  {
    id: "erosion-terrain",
    title: "Hydraulic erosion in real time",
    category: "games",
    year: "2026",
    context: "Independent study",
    summary:
      "Tens of thousands of droplets per frame carve rivers and lakes into a procedural terrain of a million cells, in the browser.",
    tags: ["webGL + three.js", "simulation", "procedural", "shaders"],
    thumb: "img/projects/erosion-terrain.jpg",
    thumbMotion: "img/projects/motion/erosion-terrain.mp4",
    embed: {
      url: "https://www.rattenstadt.com/2606_Erosion/",
      label: "Erode the terrain"
    },
    links: [
      { label: "Live", url: "https://www.rattenstadt.com/2606_Erosion/" },
      { label: "Code", url: "https://github.com/ludwigpeking/2606_Erosion" }
    ],
  },
];
