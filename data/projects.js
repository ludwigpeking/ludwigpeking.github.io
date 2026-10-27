/* ==========================================================================
   data/projects.js - the project catalogue.

   Each project:
     id, title, category, year, context, summary, tags, thumb
     optional: featured, hero, thumbMotion (silent H.264 video, 800 x 450, shown on hover), youtube [{id, label}], videoPending (string),
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
var LOREM_PARAGRAPH =
  "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>" +
  "<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>";

window.PROJECTS = [
  /* ================================================================ web */
  {
    id: "parcbalance",
    featured: true,
    title: "ParcBalance: parking-space pricing simulator",
    category: "web",
    year: "2023 – 2025",
    context: "Product, used on projects in Jinan, Panjin and Qingdao",
    summary:
      "Prices thousands of parking spaces at once by modelling the buildings around them, the walking routes, and the customers who will choose between them.",
    tags: ["product", "real estate", "simulation", "pathfinding", "JavaScript", "urban"],
    thumb: "img/projects/parcbalance.jpg",
    thumbMotion: "img/projects/motion/parcbalance.mp4",
    hero: "img/projects/parcbalance-hero.jpg",
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/ParcBalance_2505" }],
    body:
      "<p>A developer selling a thousand underground parking spaces needs a price for each one, and a flat price leaves the good spaces gone in a day and the bad ones unsold for years. ParcBalance reads the parking plan and the residential towers above it, computes walking distances from every space to every entrance, and simulates households with different incomes and cars choosing where they would buy. Prices are then adjusted until demand spreads evenly across the lot: balanced and profitable.</p>" +
      "<p>The input is the parking plan itself, rasterised at half a metre per pixel: spaces, cores and walls each in their own colour, with the unit mix of the towers above. Every simulated household has an income drawn from the distribution of its unit type, a tolerance for walking, and the option of a cheaper space outside the project. Because the buyers are random, a run is repeated many times, and a floor on the sell-through rate (80 percent, say) keeps the optimiser from chasing revenue with a half-empty lot. The output is a price per space and a demand map before and after adjustment.</p>" +
      "<p>The tool has gone through five versions since 2023 and has been used on real sales campaigns in second- and third-tier Chinese cities. It is the most direct bridge between my years in real estate and the simulations on this site.</p>",
    gallery: [
      { src: "img/projects/parcbalance-g3.jpg", caption: "Adjusted prices across a full Jinan parking plan" },
      { src: "img/projects/parcbalance-g1.jpg", caption: "Adjusted prices, detail" },
      { src: "img/projects/parcbalance-g2.jpg", caption: "Demand distribution before adjustment" }
    ]
  },
  {
    id: "decisive",
    featured: true,
    title: "Decisive 妙算: real-time finance inside SketchUp",
    category: "web",
    year: "2024 – 2026",
    context: "Product, dcdecisive.com",
    summary:
      "Move a building in the model and the cash flow updates. A Ruby extension that couples the design of a development to its financial outcome as you draw.",
    tags: ["product", "SketchUp", "Ruby", "real estate", "finance", "Vue"],
    thumb: "img/projects/decisive.jpg",
    thumbMotion: "img/projects/motion/decisive.mp4",
    hero: "img/projects/decisive-hero.jpg",
    videoPending: "Promo film exists locally (2:03, March 2025, Chinese narration and burned-in Chinese subtitles). Add English subtitles, upload to YouTube and embed.",
    links: [
      { label: "Live", url: "https://dcdecisive.com/" },
      { label: "Code", url: "https://github.com/ludwigpeking/rubySketchupPlanningUtil" }
    ],
    body:
      "<p>In a development company the design team and the finance team talk through spreadsheets, days apart. Decisive puts the spreadsheet inside the model. Every building in the SketchUp scene carries its floor area, unit mix, cost and sales assumptions; a Ruby extension with a web panel recomputes areas, revenue, cost and a cash-flow curve every time the geometry changes. Planners can test a scheme against its numbers in the same minute.</p>" +
      "<p>The product models China-specific finance: supervision-fund pacing, tax, land-payment schedules. Partners include Vanke, BBMG and DTree.</p>",
    gallery: [
      { src: "img/projects/decisive-g3.jpg", caption: "From the promo film" },
      { src: "img/projects/decisive-g4.jpg", caption: "From the promo film" },
      { src: "img/projects/decisive-g5.jpg", caption: "From the promo film" }
    ]
  },
  {
    id: "algorithms-of-the-city",
    featured: true,
    title: "The Algorithms of the City",
    category: "web",
    year: "2026 –",
    context: "Open interactive book and lecture",
    summary:
      "An interactive book of urban self-organisation: chapters on resources, pathfinding, spatial syntax and spatial optimisation, each with a simulation you can run.",
    tags: ["open book", "urban", "simulation", "p5.js", "three.js", "Godot", "teaching", "exhibited"],
    thumb: "img/projects/algorithms-of-the-city.jpg",
    thumbMotion: "img/projects/motion/algorithms-of-the-city.mp4",
    hero: "img/projects/algorithms-of-the-city-hero.jpg",
    youtube: [
      { id: "xrFgm3PKJoA", label: "Algorithms of the City" },
      { id: "BnPAcg75PMg", label: "Intelligent simulations: the three iterations" }
    ],
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/2603_theAlgorithmsOfTheCity" }],
    body:
      "<p>Where my written book argues in prose, this one argues in code. Each chapter states a mechanism, such as how hunters and farmers choose where to settle, how routes wear into roads, how a shopping street finds its length, and then lets the reader run it. Terrain viewers for Rome and New York bring real ground into the models, and a shopping-street optimiser built in Godot demonstrates spatial optimisation with agents.</p>" +
      "<p>A ten-minute lecture, in English and Chinese with slides and voice-over, introduces the project, and a video essay presents the drawings.</p>",
    gallery: [
      { src: "img/projects/algorithms-of-the-city-g4.jpg", caption: "Drawing: the city as process" },
      { src: "img/projects/algorithms-of-the-city-g5.jpg", caption: "Spring Show 2026: a city growing on the terrain of Rome" },
      { src: "img/projects/algorithms-of-the-city-g3.jpg", caption: "Cover of the video essay" },
      { src: "img/projects/algorithms-of-the-city-g1.jpg", caption: "Lecture slide: the city as process" },
      { src: "img/projects/algorithms-of-the-city-g2.jpg", caption: "Lecture slide: hazards, yields and site selection" }
    ]
  },
  {
    id: "ariadne",
    title: "Ariadne Rare Disease Atlas",
    category: "web",
    year: "2026",
    context: "Product, ariadne.dcdecisive.com",
    summary:
      "An interactive map of rare diseases: a weighted evidence graph with sourced edges, node2vec similarity and random-walk ranking, in three languages.",
    tags: ["product", "graph", "machine learning", "node2vec", "health", "web app"],
    thumb: "img/projects/ariadne.jpg",
    thumbMotion: "img/projects/motion/ariadne.mp4",
    videoPending: "One-minute pitch film exists locally; upload to YouTube and embed.",
    links: [{ label: "Live", url: "https://ariadne.dcdecisive.com/" }],
    copyPending: true,
    body: LOREM_PARAGRAPH
  },
  {
    id: "altrovia",
    title: "Altrovia: branding and website",
    category: "web",
    year: "2026",
    context: "Client work, altrovia.ai",
    summary:
      "Identity and site for a clinical-trial design company: logo, logo animation and a text-driven landing page.",
    tags: ["client work", "branding", "animation", "web"],
    thumb: "img/projects/altrovia.jpg",
    thumbMotion: "img/projects/motion/altrovia.mp4",
    hero: "img/projects/altrovia-hero.jpg",
    links: [
      { label: "Live", url: "https://www.altrovia.ai/" },
      { label: "Code", url: "https://github.com/ludwigpeking/2604_Altrovia_Website" }
    ],
    copyPending: true,
    body: LOREM_PARAGRAPH
  },
  {
    id: "vortego",
    featured: true,
    title: "VorteGo: Go on generated boards",
    category: "web",
    year: "2026",
    context: "Independent project, online",
    summary:
      "Go played on procedurally generated, non-rectangular boards. Board editor, Monte Carlo tree search opponent, online multiplayer and printable boards.",
    tags: ["game", "multiplayer", "MCTS", "p5.js", "Node", "WebSockets", "PyTorch", "computational geometry"],
    thumb: "img/projects/vortego.jpg",
    thumbMotion: "img/projects/motion/vortego.mp4",
    hero: "img/projects/vortego-hero.jpg",
    videoPending: "No gameplay video yet. Record a two-minute game on a preset board at vortego.itp.io.",
    links: [
      { label: "Play", url: "https://vortego.itp.io/" },
      { label: "Code", url: "https://github.com/ludwigpeking/VorteGoWebsite" },
      { label: "HexGoban", url: "https://github.com/ludwigpeking/HexGoban" }
    ],
    body:
      "<p>Go is usually played on a 19 by 19 grid. VorteGo asks what the game becomes when the board is an irregular quad mesh: triangulated, quadrangulated and relaxed so that every intersection still has three or four neighbours but no two boards are alike. Liberties, captures and territory follow the same rules; strategy does not.</p>" +
      "<p>The site has a library of named preset boards, an editor for drawing new ones, an AI opponent driven by Monte Carlo tree search, online play through socket.io, and a print mode for making physical boards. A graph neural network trained by self-play in PyTorch Geometric is in progress. A spherical board exists as a test.</p>",
    gallery: [
      { src: "img/projects/vortego-g3.jpg", caption: "A game room on the Yugen preset: a relaxed quad mesh on a hexagonal board" },
      { src: "img/projects/vortego-g2.jpg", caption: "The online lobby: chat, players and game rooms" },
      { src: "img/projects/vortego-g1.jpg", caption: "Rendered hexagonal goban" }
    ]
  },
  {
    id: "the-pantheon",
    title: "The Pantheon",
    category: "web",
    year: "2026",
    context: "NYU ITP, ML for 3D",
    summary:
      "A world of portals linking a savanna, a temple precinct, a sanctuary and a cave, built from generated 3D characters and Gaussian splats, and a multiplayer web version of the same idea.",
    tags: ["Gaussian splatting", "Blender", "generative AI", "three.js", "socket.io", "multiplayer"],
    thumb: "img/projects/the-pantheon.jpg",
    thumbMotion: "img/projects/motion/the-pantheon.mp4",
    hero: "img/projects/the-pantheon-hero.jpg",
    videoPending: "Savanna flythrough (0:34) exists locally; upload and embed.",
    body:
      "<p>The Pantheon is a memorial for people who changed how we think, built as places rather than plaques. A savanna holds Darwin, Lucy and Shaka; a step pyramid and a marketplace hold the founders of cities; a sanctuary and a cave hold the rest. Characters and buildings were generated with Meshy, the terrain came from Gaussian splats, panoramas and video were generated, and the whole was assembled in Blender. I also wrote a custom Gaussian-splat viewer in three.js, with a PLY parser, instanced quads and a radix depth sort, to handle scenes of a million splats.</p>" +
      "<p>A second version moves the idea to the web: five procedural low-poly scenes served by Express and socket.io, with shared and private spaces so that visitors can meet.</p>",
    gallery: [
      { src: "img/projects/the-pantheon-g2.jpg", caption: "Design sketch of the portal world" },
      { src: "img/projects/the-pantheon-g1.jpg", caption: "Plan of the web version" }
    ]
  },

  /* ============================================================== games */
  {
    id: "clash-of-iron",
    title: "Clash of Iron 大艦巨砲: naval battles in 3D",
    category: "games",
    year: "2026",
    context: "Independent project, film series and Godot scenes",
    summary:
      "The battles of the Yalu, Tsushima, Jutland and Guadalcanal reconstructed ship by ship: hour-long 3D films in six languages, playable Godot scenes with ocean and light-shaft shaders, and a procedural ship foundry.",
    tags: ["history", "naval", "Blender", "Godot", "film", "Next.js", "three.js", "shaders"],
    thumb: "img/projects/clash-of-iron.jpg",
    thumbMotion: "img/projects/motion/clash-of-iron.mp4",
    hero: "img/projects/clash-of-iron-hero.jpg",
    embed: {
      url: "https://www.rattenstadt.com/ClashOfIronMaps/?lang=en",
      label: "Open the battle maps"
    },
    links: [{ label: "Battle maps", url: "https://www.rattenstadt.com/ClashOfIronMaps/?lang=en" }],
    youtubeAtEnd: true,
    youtube: [
      { id: "pwhKH2OnY-U", label: "The Battle of Tsushima in 3D (58 min)" },
      { id: "A_Acq_oTGgE", label: "黄海海战 1894 开发日志 (Chinese)" },
      { id: "xnsX_WNRLPc", label: "黄海海戦 1894 (Japanese)" }
    ],
    body:
      "<p>A media pipeline around the history of the armoured warship. Open-source ship models are rendered with headless Blender into covers and story videos, narrated in several languages. The battles are playable scenes in Godot with custom ocean, sky and light-shaft shaders. Ironclad Foundry, a Next.js and three.js app, lets you compose your own ship from hulls, turrets and superstructures.</p>"
  },
  {
    id: "a-quiet-practice",
    title: "A Quiet Practice 静かなひととき",
    category: "games",
    year: "2026",
    context: "Published on itch.io",
    summary:
      "A dry-landscape garden you tend at your own pace: rake the gravel, shape the sand, place four stones. No score, no timer. Four seasons, three lights, wind and cicadas.",
    tags: ["game", "three.js", "Japan", "published", "procedural", "Unreal"],
    thumb: "img/projects/a-quiet-practice.jpg",
    thumbMotion: "img/projects/motion/a-quiet-practice.mp4",
    hero: "img/projects/a-quiet-practice-hero.jpg",
    youtube: [{ id: "hMuYt7BOra8", label: "A Quiet Practice (film)" }],
    links: [
      { label: "itch.io", url: "https://ludwigpeking.itch.io/a-quiet-practice" },
      { label: "Play online", url: "https://ryoanji-still-garden.ludwig-peking.chatgpt.site/" }
    ],
    body:
      "<p>A few stones. Pale gravel. Space to breathe. A Quiet Practice is a dry-landscape garden in the browser, modelled on the kind of walled garden you look at from a veranda rather than walk through. Pull the rake and a line finds its own rhythm across the sand. Place a stone, shape the ground around it, leave a little room. There is no score and no finish line; the garden only asks for attention.</p>" +
      "<p>The garden lives through the year. Fresh spring greens turn to deep summer shade, then autumn colour and bare winter branches, with a winter shower running from the eaves. Three lights, wind in the trees and cicadas in summer change the mood without changing the task. When the tools are put away you can simply stay beneath the eaves and watch.</p>" +
      "<p>Built with three.js and published on itch.io, where it also runs as a Windows desktop wallpaper through Lively Wallpaper. The arrangements range from a single first stone to a fifteen-stone garden and a seventy-six-stone composition with large sentinels at the edges. The film above was cut from the app's own footage.</p>",
    gallery: [
      { src: "img/projects/a-quiet-practice-g1.jpg", caption: "Raking: each line finds its own rhythm" },
      { src: "img/projects/a-quiet-practice-g2.jpg", caption: "A first stone, with room left around it" },
      { src: "img/projects/a-quiet-practice-g3.jpg", caption: "Shaping the sand around a stone group" },
      { src: "img/projects/a-quiet-practice-g4.jpg", caption: "The seventy-six-stone arrangement under summer trees" }
    ]
  },
  {
    id: "rome-wfc",
    featured: true,
    title: "Rome WFC: a Roman town that pays rent",
    category: "games",
    year: "2026",
    context: "Independent study",
    summary:
      "A Townscaper-style Roman town grown from a 3D volume grid, with classical, vernacular and temporary building tiers and an economy that sets the rents.",
    tags: ["wave function collapse", "simulation", "real estate", "three.js", "history", "procedural", "film"],
    thumb: "img/projects/rome-wfc.jpg",
    thumbMotion: "img/projects/motion/rome-wfc.mp4",
    hero: "img/projects/rome-wfc-hero.jpg",
    videoPending: "Two Chinese films exist locally (Parameters 5:11, Real Estate 3:11); upload and embed.",
    copyPending: true,
    body: LOREM_PARAGRAPH,
    gallery: [
      { src: "img/projects/rome-wfc-g1.jpg", caption: "Rent replay" },
      { src: "img/projects/rome-wfc-g2.jpg", caption: "Contact sheet of economy runs" }
    ]
  },
  {
    id: "cathay-heroes",
    title: "Cathay Heroes 諸夏英豪傳",
    category: "games",
    year: "2026",
    context: "Independent project",
    summary:
      "A 2D life simulation on a to-scale map of China built from real elevation and river data. Rise from gig worker to tycoon or politician, with karma keeping score.",
    tags: ["game", "China", "GIS", "generative art direction", "JavaScript", "simulation"],
    thumb: "img/projects/cathay-heroes.jpg",
    thumbMotion: "img/projects/motion/cathay-heroes.mp4",
    videoPending: "No gameplay video yet.",
    body:
      "<p>The map is real: a digital elevation model, Natural Earth coastlines and river data, projected to scale, so that travel between cities costs what it should. On top of it runs a life simulation with jobs, housing, businesses, institutions and a karma system that remembers how you got rich. The art, several hundred scenes, cards and characters, is generated from a prompt manifest in a Hiroshige woodblock style, so every region has its own look while the whole stays consistent. A designer tool edits the world data in place.</p>",
    gallery: [
      { src: "img/projects/cathay-heroes-g3.jpg", caption: "Shenzhen" },
      { src: "img/projects/cathay-heroes-g1.jpg", caption: "Northern industrial city" },
      { src: "img/projects/cathay-heroes-g2.jpg", caption: "Home interior" },
      { src: "img/projects/cathay-heroes-g4.jpg", caption: "Character bust sheet" }
    ]
  },
  {
    id: "last-day-of-ais",
    title: "The Last Day of AIs",
    category: "games",
    year: "2026",
    context: "Independent project",
    summary:
      "A geopolitical strategy game about the AGI transition. Play a head of state, a Big Tech CEO or a non-state actor over a three-globe Earth with thirty modelled countries.",
    tags: ["game", "strategy", "three.js", "AGI", "systems modelling"],
    thumb: "img/projects/last-day-of-ais.jpg",
    thumbMotion: "img/projects/motion/last-day-of-ais.mp4",
    hero: "img/projects/last-day-of-ais-hero.jpg",
    videoPending: "No gameplay video yet.",
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/theLastDayOfAIs" }],
    body:
      "<p>The game state tracks economy, technology, soft power and ideology for thirty countries and a set of companies, with editors for each system and a tech tree that ends, one way or another, in artificial general intelligence. The three globes show the same world through different lenses. A long essay in the repository sets out the theory the game is testing: that the transition is a coordination problem before it is a technical one.</p>",
    gallery: [{ src: "img/projects/last-day-of-ais-g1.jpg", caption: "Opening screen" }]
  },
  {
    id: "malthusian-world",
    title: "Malthusian World",
    category: "games",
    year: "2022 – 2025",
    context: "Independent study",
    summary:
      "Bands of people grow, move and split on a resource grid, passing through ages of Eden and Collapse and sometimes a long metastable calm. The 2025 version plays its own music.",
    tags: ["agent-based simulation", "p5.js", "music", "urban"],
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
    gallery: [{ src: "img/projects/malthusian-world-g1.jpg", caption: "The Death Match age" }]
  },
  {
    id: "becoming-city",
    title: "becomingCity: a value-grid city generator",
    category: "games",
    year: "2022 – 2025",
    context: "Independent study",
    summary:
      "Settlers with different professions weigh the same landscape differently, and a town emerges from where each of them chooses to build.",
    tags: ["urban", "pathfinding", "Voronoi", "p5.js", "agent-based simulation"],
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
      "Traffic emerges in New York, Portland and Roman-camp grids; then the grid erodes under crisis and informal occupation reshapes the streets.",
    tags: ["urban", "simulation", "p5.js"],
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
    tags: ["installation", "Kinect", "projection mapping", "urban", "simulation", "p5.js", "three.js", "GeoTIFF", "exhibited"],
    thumb: "img/projects/sand-table.jpg",
    thumbMotion: "img/projects/motion/sand-table.mp4",
    hero: "img/projects/sand-table-hero.jpg",
    youtube: [{ id: "BnPAcg75PMg", label: "Intelligent simulations: the three iterations" }],
    videoPending: "Winter Show footage (4:52) exists as a 2.6 GB original; cut and upload.",
    links: [
      { label: "Code (Winter Show)", url: "https://github.com/ludwigpeking/2511_Hexaganal_World" },
      { label: "Code (Spring Show)", url: "https://github.com/ludwigpeking/Springshow2026" }
    ],
    body:
      "<p>A hexagonal sandbox about a metre across sits under a projector and a Kinect depth camera. Visitors push the sand into valleys and ridges; the depth image becomes a height field, the height field becomes a relaxed hexagonal-and-quad mesh with marching-squares contours, and a settlement simulation runs on that mesh. Villages appear where water, flat land and defensibility coincide, roads are found by pathfinding across the slopes, and land use spreads along them. Everything is projected back onto the sand, so the city literally grows on the landscape you just made.</p>" +
      "<p>The piece is the physical version of the argument in my book <a href='writing.html'>An Evolutionary History of the City</a>: cities are not designed so much as grown by many small decisions under geographic constraint. Real terrain can be loaded as well; GeoTIFF elevation of Rome and New York has been mapped onto the table.</p>" +
      "<p>The Winter Show version (December 2025) was written in p5.js with a custom C# calibration app for the Kinect v2. The Spring Show version (May 2026) was rebuilt in three.js with a 3D tile atlas, post-processing and a Python geo toolchain.</p>",
    gallery: [
      { src: "img/projects/sand-table-g6.jpg", caption: "At the ITP Winter Show 2025" },
      { src: "img/projects/sand-table-g7.jpg", caption: "Spring Show 2026 version" },
      { src: "img/projects/sand-table-g1.jpg", caption: "Concept sketch: projector, depth camera and sandbox" },
      { src: "img/projects/sand-table-g2.jpg", caption: "Generated map on the hexagonal domain" },
      { src: "img/projects/sand-table-g4.jpg", caption: "Relaxed hexagonal and quad mesh" },
      { src: "img/projects/sand-table-g3.jpg", caption: "Projector calibration grid" },
      { src: "img/projects/sand-table-g5.jpg", caption: "Building the table" }
    ]
  },
  {
    id: "motion-projection",
    title: "Motion Projection: projection mapping on a moving face",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, projection mapping",
    summary:
      "A projector that finds its own way onto a face. A Gray-code scan calibrates projector to camera; MediaPipe landmarks and Kinect depth then keep a painted mask locked to the face in closed loop.",
    tags: ["projection mapping", "computer vision", "MediaPipe", "OpenCV", "Kinect", "Python", "film"],
    thumb: "img/projects/motion-projection.jpg",
    thumbMotion: "img/projects/motion/motion-projection.mp4",
    hero: "img/projects/motion-projection-hero.jpg",
    youtube: [{ id: "-aCN75vNGhA", label: "How to projection map on a moving object? (9:21)" }],
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/MotionProjection" }],
    body:
      "<p>Projection onto a moving face usually needs a painstaking manual calibration. This system removes it. On start-up the projector scans a Gray-code pattern into the scene, the camera identifies it, and the projector is modelled as an inverse camera. From then on a MediaPipe face mesh with 468 landmarks, lifted to 3D with Kinect depth, drives a texture painted in Blender, and the fit is corrected continuously from what the camera sees.</p>" +
      "<p>The interesting part is the loop: the projector is both display and measuring instrument. A narrated explainer film, in English and Chinese, walks through the maths.</p>",
    gallery: [
      { src: "img/projects/motion-projection-g2.jpg", caption: "Result: the mask locked to the face" },
      { src: "img/projects/motion-projection-g1.jpg", caption: "UV layout of the face mesh used for the projected texture" }
    ]
  },
  {
    id: "nyc-subway-cube",
    title: "NYC Subway Cube",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, projection mapping",
    summary:
      "The whole subway network laid out procedurally inside a cube, animated in Blender for projection onto a physical box. Each of the 158 stations has its own jingle and announcement.",
    tags: ["projection mapping", "Blender", "bpy", "data", "generated audio"],
    thumb: "img/projects/nyc-subway-cube.jpg",
    thumbMotion: "img/projects/motion/nyc-subway-cube.mp4",
    hero: "img/projects/nyc-subway-cube-hero.jpg",
    youtube: [{ id: "2Dt884pKMxk", label: "An NYC Metro Dream" }],
    body:
      "<p>The New York subway as a three-dimensional object. A Blender Python script reads the network data, routes every line through the volume of a cube in its official MTA colour, and places the 158 stations as nodes. The animation is rendered from the viewpoint of a person standing in front of a physical box, so that when it is projected onto that box the lines appear to run inside it.</p>" +
      "<p>The sound design is generated too. Each station gets a short jingle in one of seven musical styles matched to its neighbourhood, and a synthetic voice announcement, so a trip through the cube is also a trip through the city's soundscape.</p>",
    gallery: [
      { src: "img/projects/nyc-subway-cube-g2.jpg", caption: "Render from the viewer's position" },
      { src: "img/projects/nyc-subway-cube-g1.jpg", caption: "Render test on the box geometry" }
    ]
  },
  {
    id: "optical-network",
    title: "Free-form optical network & OpticsBench",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, digital fabrication",
    summary:
      "Four stacked free-form glass layers, trained with the adjoint method so that white light passing through them comes out as an image. Plus an optical bench app for designing printable lenses, and a nine-minute primer on optical computing.",
    tags: ["optics", "3D printing", "Python", "JAX", "Godot", "research", "film", "wave optics"],
    thumb: "img/projects/optical-network.jpg",
    hero: "img/projects/optical-network-hero.jpg",
    videoPending: "Optical Computing Primer (9:22, English and Chinese) exists locally; upload and embed.",
    body:
      "<p>A diffractive optical network is a neural network made of glass: each layer is a surface whose height profile bends light, and the layers are trained like weights. This one uses a wave-optics forward model with the dispersion of BK7 glass, so it must work across the visible spectrum at once, and is optimised with the adjoint method and Adam until a flag appears on the output plane.</p>" +
      "<p>OpticsBench, built in Godot, is the design side: a lens designer for convex and concave units and arrays, a dispersive ray tracer, a stochastic trainer that pushes a stack toward a target image, printability limits for resin printers, and STL export. A set of numerical studies asks what optical elements can and cannot compute.</p>",
    gallery: [
      { src: "img/projects/optical-network-g5.jpg", caption: "Target flag, four trained surfaces, simulated output" },
      { src: "img/projects/optical-network-g4.jpg", caption: "Lens stacks designed in OpticsBench" },
      { src: "img/projects/optical-network-g1.jpg", caption: "Target and simulated output" },
      { src: "img/projects/optical-network-g2.jpg", caption: "The four trained surfaces" },
      { src: "img/projects/optical-network-g3.jpg", caption: "OpticsBench render" }
    ]
  },
  {
    id: "brick-ghosts",
    title: "Brick ghosts: relief projection on Jay Street",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, projection mapping",
    summary:
      "Ghost faces, a flock and a line of dancers rendered as per-brick displacement relief for an 8 by 12 metre brick wall in downtown Brooklyn, with three synthesised soundtracks.",
    tags: ["projection mapping", "WebGL", "generated audio", "installation", "Brooklyn"],
    thumb: "img/projects/brick-ghosts.jpg",
    thumbMotion: "img/projects/motion/brick-ghosts.mp4",
    hero: "img/projects/brick-ghosts-hero.jpg",
    videoPending: "4K landscape and portrait exports (1:37) exist locally; upload and embed.",
    copyPending: true,
    body: LOREM_PARAGRAPH,
    gallery: [
      { src: "img/projects/brick-ghosts-g1.jpg", caption: "Native brick relief preview" },
      { src: "img/projects/brick-ghosts-g2.jpg", caption: "Portrait export" }
    ]
  },
  {
    id: "ghost-corridor",
    title: "Ghost corridor",
    category: "interactive",
    year: "2025",
    context: "NYU ITP, physical computing",
    summary:
      "A Halloween installation. Flocking ghosts react to how far people stand from an Azure Kinect, with spatial audio and a 3D-printed mask on the sensor.",
    tags: ["installation", "Azure Kinect", "p5.js", "Web Audio", "Python", "3D printing"],
    thumb: "img/projects/ghost-corridor.jpg",
    thumbMotion: "img/projects/motion/ghost-corridor.mp4",
    hero: "img/projects/ghost-corridor-hero.jpg",
    videoPending: "Raw 1080p documentation clips exist locally (five takes, 1 to 6 minutes each); cut a one-minute edit, upload and embed.",
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/2025-holloween" }],
    body:
      "<p>A Python server reads depth from an Azure Kinect and streams the positions of people over a websocket to a p5.js scene. A flock of ghosts is drawn to whoever comes closest, bumps and whistles are placed in space with the Web Audio API, and the sensor itself wears a 3D-printed mask so the hardware is part of the character.</p>",
    gallery: [
      { src: "img/projects/ghost-corridor-g2.jpg", caption: "A visitor approaches the mask with a torch; the flock turns toward them" },
      { src: "img/projects/ghost-corridor-g3.jpg", caption: "The masked Kinect and the screen" },
      { src: "img/projects/ghost-corridor-g4.jpg", caption: "The 3D-printed mask over the sensor" }
    ]
  },
  {
    id: "playful-nyc-xr",
    title: "Playful NYC (team)",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, team project",
    summary:
      "A multiplayer WebXR scene of a New York fire escape at night, shared over a local network, with AR occlusion tests and a day-night cycle.",
    tags: ["WebXR", "three.js", "Blender", "WebSockets", "multiplayer"],
    thumb: "img/projects/playful-nyc-xr.jpg",
    thumbMotion: "img/projects/motion/playful-nyc-xr.mp4",
    body:
      "<p>A team project with three classmates. I modelled the fire-escape facade and its night lighting in Blender and worked on the shared scene, which is synchronised between headsets over a LAN websocket so that several players see the same objects move.</p>",
    gallery: [{ src: "img/projects/playful-nyc-xr-g1.jpg", caption: "In-game screen" }]
  },
  {
    id: "beethoven-motif-lab",
    title: "Beethoven Motif Lab",
    category: "interactive",
    year: "2025 – 2026",
    context: "Independent research and documentary",
    summary:
      "A custom PyTorch transformer trained on the 32 piano sonatas, with pitch-aware rotary attention, chord and cadence models, fitness critics and a blind listening test. And a nineteen-minute film on how AI learned music.",
    tags: ["machine learning", "PyTorch", "transformer", "music", "MIDI", "film", "research"],
    thumb: "img/projects/beethoven-motif-lab.jpg",
    hero: "img/projects/beethoven-motif-lab-hero.jpg",
    youtube: [
      { id: "-byFesduBOs", label: "How AI music actually works (19:00)" },
      { id: "p_z_A9FTAwU", label: "AI 是怎么学会作曲的 (Chinese)" }
    ],
    body:
      "<p>Can a small model learn how Beethoven develops a motif rather than just imitate his surface? The lab trains a transformer from scratch on the 32 piano sonatas in Humdrum kern encoding, with a tokeniser built around musical events and an attention variant that knows the distance between pitches. Separate models detect chords and cadences so that generated passages can be judged for harmonic sense, and a set of fitness critics scores them for motif economy, voice leading and closure.</p>" +
      "<p>Outputs go to MIDI and ABC notation, and a web lab plays generated excerpts against real ones in blind tests. The documentary traces seventy years from Markov chains to Suno and Gemini, with the lab as its worked example.</p>",
    gallery: [{ src: "img/projects/beethoven-motif-lab-g1.jpg", caption: "Tokens on the piano roll" }]
  },
  {
    id: "tube-shader",
    title: "Hand-tracked tube",
    category: "interactive",
    year: "2026",
    context: "NYU ITP, shader programming",
    summary:
      "A three-dimensional ribbon drawn in the air with a webcam. Palm width and camera field of view give the depth; a custom shader lofts the path into a tube.",
    tags: ["GLSL", "p5.js", "ml5", "MediaPipe", "interactive", "computer vision"],
    thumb: "img/projects/tube-shader.jpg",
    thumbMotion: "img/projects/motion/tube-shader.mp4",
    videoPending: "Screen capture (0:21) exists locally; upload and embed.",
    embed: {
      url: "https://editor.p5js.org/ludwig.peking/full/NqolOlefE",
      label: "Run it (needs a webcam)"
    },
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/2602_WebcamShader" }],
    body:
      "<p>ml5's hand model gives the position of the palm in the image; the apparent width of the palm and the camera's field of view give a distance estimate, so the hand becomes a 3D cursor. Its path is lofted into a tube in a vertex shader and shaded in a fragment shader, all inside p5.js WEBGL mode.</p>"
  },
  {
    id: "quadrangulation",
    title: "Quadrangulating the hexagon",
    category: "interactive",
    year: "2024",
    context: "Independent study",
    summary:
      "A Townscaper-style irregular grid: a hexagonal domain is triangulated, the triangles are merged into quads, and the mesh is relaxed until every cell is almost square.",
    tags: ["computational geometry", "p5.js", "mesh", "procedural"],
    thumb: "img/projects/quadrangulation.jpg",
    thumbMotion: "img/projects/motion/quadrangulation.mp4",
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/quadrangulation" }],
    body:
      "<p>Regular grids make regular cities, and regular cities are rare. This study builds the irregular-but-orderly grid that Oskar Stålberg used in Townscaper: triangulate a hexagon, pair triangles into quads, then relax the vertices so the quads become as square as they can. The result is the substrate for the <a href='project.html?id=sand-table'>sand-table simulator</a>, the boards of <a href='project.html?id=vortego'>VorteGo</a> and the ground of <a href='project.html?id=rome-wfc'>Rome WFC</a>.</p>",
    gallery: [{ src: "img/projects/quadrangulation-g1.jpg", caption: "Before relaxation" }]
  },

  /* ================================== games: generative (was creative) */
  {
    id: "shoin-zukuri",
    featured: true,
    title: "Shoin-zukuri: an infinite generator of Japanese architecture",
    category: "games",
    year: "2022 – 2026",
    context: "Independent study",
    summary:
      "Wave function collapse over tectonic building blocks produces endless, surprising Japanese residential complexes on a bent quad grid with terrain and shore, rendered live in three.js.",
    tags: ["wave function collapse", "three.js", "Blender", "procedural", "architecture", "Japan", "film"],
    thumb: "img/projects/shoin-zukuri.jpg",
    thumbMotion: "img/projects/motion/shoin-zukuri.mp4",
    hero: "img/projects/shoin-zukuri-hero.jpg",
    youtube: [{ id: "Lgg20hnOQvI", label: "Architecture in 24 blocks: wave function collapse (5:40)" }],
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
    gallery: [
      { src: "img/projects/shoin-zukuri-g1.jpg", caption: "Sketch of the block vocabulary" },
      { src: "img/projects/shoin-zukuri-g2.jpg", caption: "Roof tiles on square and hexagonal cells" }
    ]
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
    tags: ["wave function collapse", "Python", "architecture", "generative design", "DXF", "film", "real estate"],
    thumb: "img/projects/wfc-floorplan.jpg",
    thumbMotion: "img/projects/motion/wfc-floorplan.mp4",
    hero: "img/projects/wfc-floorplan-hero.jpg",
    youtube: [{ id: "7-f_Z4S9-rE", label: "Floor plan generation from wave function collapse (5:03)" }],
    links: [{ label: "Code", url: "https://github.com/ludwigpeking/WFC_floorPlan_Generation" }],
    fragment: "coding/wfc-floorplan.html",
    gallery: [
      { src: "img/projects/wfc-floorplan-g3.jpg", caption: "A grid of generated plans" },
      { src: "img/projects/wfc-floorplan-g1.jpg", caption: "A generated plan on the pixel grid" },
      { src: "img/projects/wfc-floorplan-g2.jpg", caption: "The adjacency library" }
    ]
  },
  {
    id: "erosion-terrain",
    title: "Hydraulic erosion in real time",
    category: "games",
    year: "2026",
    context: "Independent study",
    summary:
      "Tens of thousands of droplets per frame carve rivers and lakes into a procedural terrain of a million cells, in the browser.",
    tags: ["three.js", "GLSL", "simulation", "terrain", "procedural"],
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
    body:
      "<p>A droplet model of hydraulic erosion running live on a 1000 by 1000 procedural terrain. Each droplet picks up sediment where it moves fast and deposits it where it slows, and a separate water-volume field lets rivers and lakes appear. The erode and deposit rates, sediment capacity, inertia, evaporation and gravity are all live sliders, so the landscape can be pushed from young and jagged to old and rounded in seconds.</p>" +
      "<p>The terrain is one of the inputs to the city simulations elsewhere on this site: where water goes decides where people go.</p>"
  },
];
