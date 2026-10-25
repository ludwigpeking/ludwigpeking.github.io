# 作品集重组规划（2026-10-11）

依据：仓库现状（2026 版四类 33 个项目）、Desktop/IT 与 Desktop/ITP 全量调查、站内素材审计、两个 YouTube 频道的视频清单。

## 1. 分类结构

每个项目有一个**主分类**（决定它出现在哪个栏目）和若干**标签**（跨栏目检索）。Work 页按主分类分栏，并可按标签筛选。

| id | 栏目 | 收什么 |
|---|---|---|
| `web` | Websites & products 网站与产品 | 上线的产品和客户网站：ParcBalance、Decisive、Ariadne、Altrovia、Algorithms of the City、VorteGo（2026-10-15 从 games 移入）、The Pantheon（2026-10-15 从 interactive 移入）|
| `games` | Games & simulations 游戏与模拟 | 可玩的游戏、自组织模拟、生成代码：Clash of Iron、A Quiet Practice、Cathay Heroes、WFC 建筑、罗马 WFC、分形树、侵蚀…… |
| `interactive` | Interactive technology 互动技术 | 传感器、投影、XR、光学：沙盘、人脸投影、地铁立方体、砖墙幽灵、Ritual Forest、光学网络；2026-10-16 从 games 移入：贝多芬、手势管道、四边形化、Voronoi 地块。同日删除 Hormuz、Game of Boolean、中国城市地价；16,000 balls 与分形森林只留在 p5 速写本 |

背景板块（不进三大类，首页下方 "Also" 区）：

- **Architecture 建筑**：现有 `architecture.html` + `gallery.html` 存档，只修错不重做。
- **Writing & media 写作与自媒体**：《城市演化论》书（vercel）、《陈腐粉碎机》播客（喜马拉雅 + YouTube 全集）、城市演化论视频系列、讲座、进行中的《马斯克的祖先》《罗马演义》脚本。
- **CV**。

### 标签词表（第一版）

- 技术：`p5.js` `three.js` `Unity` `Godot` `Blender` `Python` `PyTorch` `Node` `WebSockets` `GLSL` `MediaPipe` `Kinect` `OpenCV` `SketchUp` `Ruby` `Next.js` `WebXR` `Gaussian splatting`
- 方法：`wave function collapse` `agent-based simulation` `pathfinding` `Voronoi` `machine learning` `GPGPU` `procedural` `projection mapping` `computer vision` `multiplayer`
- 主题：`urban` `history` `real estate` `architecture` `music` `optics` `naval` `Japan` `China`
- 形态：`product` `client work` `installation` `game` `film` `research` `exhibited` `open book`

## 2. 视频规则

- 网站不放本地视频文件。能在 YouTube 上找到的，用点击后才加载的 YouTube 嵌入（封面取 `img.youtube.com/vi/<id>/hqdefault.jpg`）。
- YouTube 上没有的，先**开天窗**：页面上放一个带虚线边框的占位块，写明"视频待上传"，数据里用 `videoPending: "说明"` 标记。
- 现有 `img/projects/*.mp4` 里大于 1 MB 的七个文件（decisive 15 MB、the-pantheon 5 MB、ghost-corridor 4 MB、becoming-city-film 3 MB、tube-shader 2 MB、nyc-subway-cube 1.2 MB）建议删除，改成占位块或 YouTube。小于 1 MB 的三段（sand-table 6 秒、algorithms 30 秒、game-of-boolean 5 秒）可留作静音循环的封面动图，也可以一并删掉，待定。

### 已在 YouTube（@RichardQianLi）可直接嵌入

| 项目 | 视频 id | 标题 |
|---|---|---|
| A Quiet Practice | `hMuYt7BOra8` | A Quiet Practice｜静かなひととき（1:09） |
| Shoin-zukuri WFC | `Lgg20hnOQvI` | Architecture in 24 Blocks（5:40） |
| WFC floor plans | `7-f_Z4S9-rE` | Floor Plan Generation from WFC（5:03） |
| Clash of Iron | `pwhKH2OnY-U` 英 / `4pmmt4Covas` 日 / `X7RVQkSnxWw` 西 | 对马海战 58 分钟全程 |
| Clash of Iron（黄海） | `xnsX_WNRLPc` 日 / `A_Acq_oTGgE` 中 | 黄海海战 1894 |
| Motion Projection | `-aCN75vNGhA` | How to Projection Map on a Moving Object?（9:21） |
| Beethoven Motif Lab | `-byFesduBOs` 英 / `p_z_A9FTAwU` 中 | How AI Music Actually Works（19:00） |
| NYC Subway Cube | `2Dt884pKMxk` | An NYC Metro Dream（2 分） |
| Algorithms of the City | `xrFgm3PKJoA` 主片 / `BnPAcg75PMg` 三次迭代 | |
| 教学 | `-YPr1r19YUM` | Create and deploy your first website |

### 本地已有成片、YouTube 还没有（先开天窗，建议上传）

| 项目 | 本地文件 | 时长 |
|---|---|---|
| Optical network / OpticsBench | `ITP\DigitalFabrication\OpticsBench\film\Optical_Computing_Primer.mp4` | 9:22 |
| Decisive | `IT\2502_Decisive_Promotion\250320_Decisive.mp4` | 2:03 |
| Rome WFC | `IT\ZenGarden\romeWFC\film\Rome_Parameters_ZH.mp4`、`Rome_Real_Estate_ZH.mp4` | 5:11 / 3:11 |
| Hexagonal World 沙盘 | `IT\2511_Hexagonal_World\documentation\winterShowVideo\TerraReform.MOV`（2.6 GB 原片） | 4:52 |
| Spring Show 2026 | `ITP\contentCreator\Springshow2026\Springshow2026.mp4` | 7:46 |
| Brick ghosts（Jay Street） | `ITP\projectionMapping\WallOnJayStreet\exports\brick-ghosts-4k-landscape.mp4` | 1:37 |
| Ritual Forest | `ITP\newPortraits\IMG_1542.MOV` | 0:43 |
| Ghost corridor | `ITP\PComp\mid-term\documentation\5Y0A9710/9713/9714/9721/9722.MOV`（1080p 原片，0:52–6:20，共五条；`01.mp4`、`02.mp4`、`12月16日.mp4` 是另一个作业 "Poor Men's Air Defense"，`895A9693.MOV` 是布幕投影，都不是这个项目） | 需剪 1 分钟 |
| The Pantheon | `ITP\ml3D\4月20日\Richard_Savanna.mp4` | 0:34 |
| Ariadne | `Desktop\10月4日 (1)\team.mp4`（自我介绍 pitch） | 1:00 |
| Becoming City 短片 | `ITP\hyperCinema\becoming-city\city-being.mp4` | 0:55 |
| Malthusian World | `IT\MalthusianSimlulation.mp4` | 2:48 |
| Hand-tracked tube | `ITP\ItsShaderTime\w2\127.0.0.1_5500_index.html - ... .mp4` | 0:21 |

### 完全没有视频，开天窗

VorteGo、Hormuz Strait、Cathay Heroes、The Last Day of AIs、Doorman、ParcBalance、Altrovia（只有 26 秒录屏）、Erosion terrain、16,000 balls。

## 3. 项目清单

★ = 首页精选。"素材"只列最高质量的来源；普通截图不用。

### web · Websites & products

| id | 标题 | 来源 | 视频 | 素材 | 标签 |
|---|---|---|---|---|---|
| ★ `parcbalance` | ParcBalance: parking-space pricing simulator | IT\2409 / 2505 | 不要视频，只要文字说明（2026-10-11 决定） | 现有缩略图；`2409\outputs\240428-A13\A13-adjusted.png`（8000×2800）裁切做 hero；flyer PDF 可链接 | product, real estate, simulation, pathfinding, JavaScript |
| ★ `decisive` | Decisive 妙算: real-time finance inside SketchUp | IT\2502_Decisive_Promotion | 天窗（本地有 2:03 成片） | `250319_description-with-details.jpg`（8000×4500）、现金流曲线、logo.svg；链接 dcdecisive.com | product, SketchUp, Ruby, real estate, finance |
| `ariadne` | Ariadne Rare Disease Atlas | 线上 ariadne.dcdecisive.com | 天窗（本地有 1 分钟 pitch） | **需截图**（图谱界面） | product, graph, machine learning, node2vec, health |
| `altrovia` | Altrovia: branding and site | IT\2604_AltroviaBranding | 天窗 | logo.svg、`altrovia.gif`；**需截图** altrovia.ai | client work, branding, animation |
| ★ `algorithms-of-the-city` | The Algorithms of the City | IT\2603_AlgorithmsCity + 2605_SpringShow | `xrFgm3PKJoA`、`BnPAcg75PMg` | 现有 hero；`common\sketch.png`（7600×4800）；Spring Show 截图 1920×1080；`contentCreator\AlgorithmsOfTheCity_v3.png` 封面 | open book, urban, simulation, Godot, p5.js, exhibited |

### games · Games & simulations

| id | 标题 | 来源 | 视频 | 素材 | 标签 |
|---|---|---|---|---|---|
| ★ `vortego` | VorteGo: Go on generated boards | IT\2602_VorteGoWebsite，线上 https://vortego.itp.io/ | 天窗（待录对弈） | 封面图 `images/coverImage.png` 做缩略图，大厅截图做 hero，幽玄预设棋盘截图进画廊（2026-10-11） | game, multiplayer, MCTS, Node, WebSockets, p5.js |
| ★ `clash-of-iron` | Clash of Iron 大艦巨砲: naval battles in 3D | IT\2607_battleships | `pwhKH2OnY-U` + 中/日版 | `tsushima_en_youtube_cover_reconstruction_3d.png`、`uss-iowa-bb-61\three_quarter_bow.png`（2560×1280）、`charts\relief_north_sea.png`；现有两张 Yalu 图 | history, naval, Blender, Godot, film, Next.js |
| ★ `a-quiet-practice` | A Quiet Practice 静かなひととき | IT\2610_Ryoanji | `hMuYt7BOra8` | `releases\itch\cover-landscape.png`、itch 四张截图、`contact-sheet.jpg`；链接 itch.io + 在线版 | game, three.js, Japan, published |
| `hormuz-strait` | The Battle of Hormuz Strait | ITP\liveWeb\week9_Dual | 天窗 | 现有；**需截图** | game, multiplayer, three.js, WebSockets |
| `cathay-heroes` | Cathay Heroes 諸夏英豪傳 | IT\2607_CathayHeros | 天窗 | `city-440300.png`（2064×1376）、`bust_qc.png`；现有两张 | game, China, GIS, generative art |
| `last-day-of-ais` | The Last Day of AIs | IT\2603_theLastDayOfAIs | 天窗 | 现有；**需截图** | game, strategy, three.js, AGI |
| `rome-wfc` | Rome WFC: a Roman town that pays rent | IT\ZenGarden\romeWFC | 天窗（本地两部中文片） | `film\devlog\sample_beauty.jpg`、`rent_replay_final.png`、contact sheet | wave function collapse, simulation, real estate, three.js, history |
| `malthusian-world` | Malthusian World | IT\2506 | 在线嵌入 + 天窗 | 现有 | agent-based simulation, p5.js, music |
| `becoming-city` | becomingCity | IT\2508 | 在线嵌入 | 现有 | urban, pathfinding, Voronoi, p5.js |
| `grid-erosion` | Grids: traffic patterns and erosion | repo coding/ | 在线嵌入 | 现有 | urban, simulation, p5.js |
| `doorman` | Doorman: a 2D narrative game | IT\2602_2DGame | 天窗 | `Assets\Resources\Ending\*.png`（3840×2160）挑 2–3 张 | game, Unity, C# |
| `game-of-boolean` | Game of Boolean | ITP\ICM\03 | 天窗 | `cover.png` 1280×720 | game, p5.js, puzzle |

### interactive · Interactive technology

| id | 标题 | 来源 | 视频 | 素材 | 标签 |
|---|---|---|---|---|---|
| ★ `sand-table` | Hexagonal World: projected sand-table city | IT\2511 + 2605 + ITP\PComp\final | `BnPAcg75PMg`；展览原片待传 | `documentation\demo.png`（5712×4284）、现有六张、Spring Show 截图 | installation, Kinect, projection mapping, urban, exhibited, p5.js, three.js |
| ★ `motion-projection` | Motion Projection: projection on a moving face | ITP\projectionMapping\feedback | `-aCN75vNGhA` | `Cover - English - horizontal.jpg`、`result_lit` 帧、现有 UV 图 | projection mapping, computer vision, MediaPipe, OpenCV, Kinect, Python |
| ★ `nyc-subway-cube` | NYC Subway Cube | ITP\projectionMapping\NYCBox | `2Dt884pKMxk` | `viewcam_f2130.png`（3840×2160）、现有 hero | projection mapping, Blender, data, generated audio |
| `brick-ghosts` | Brick ghosts: relief projection on Jay Street | ITP\projectionMapping\WallOnJayStreet | 天窗（4K 成片待传） | `landscape-frame-0264.jpg`（3840×2160）、`preview-native-brick-relief.jpg` | projection mapping, WebGL, generated audio, Brooklyn |
| ★ `optical-network` | Free-form optical network & OpticsBench | ITP\DigitalFabrication | 天窗（9:22 科普片待传） | `cover_bench.png`、`demo_creations.png`、`flag_3d.png`、现有三张 | optics, 3D printing, Godot, JAX, research |
| `ritual-forest` | Ritual Forest | ITP\newPortraits | 天窗 | 现有 hero、`camView1/2.png` | Unity, Gaussian splatting, installation |
| `the-pantheon` | The Pantheon | IT\2607 + ITP\ml3D | 天窗 | `design\design_vignette.png`（7600×4361）、现有 | Gaussian splatting, Blender, multiplayer, three.js |
| `ghost-corridor` | Ghost corridor | ITP\PComp\mid-term | 天窗（原片待剪） | 从 `5Y0A9713.MOV`、`5Y0A9722.MOV` 抽帧：缩略图、hero、三张画廊（2026-10-11） | installation, Kinect, p5.js, Web Audio |
| `playful-nyc-xr` | Playful NYC (team) | IT\2604_AwesomeRoommates | 无 | 现有 | WebXR, three.js, multiplayer |

### games（续）· 原 Creative code，2026-10-15 并入 games

| id | 标题 | 来源 | 视频 | 素材 | 标签 |
|---|---|---|---|---|---|
| ★ `shoin-zukuri` | Shoin-zukuri: WFC Japanese architecture | IT\ZenGarden\Shoin-zakuri | `Lgg20hnOQvI` + 在线嵌入 | `cover_en_1920x1080.png`、`sketch.jpg`（5306×3569）、`roof_tiles_square_and_hex.png` | wave function collapse, three.js, Blender, Japan, architecture, film |
| ★ `beethoven-motif-lab` | Beethoven Motif Lab | IT\2508_Beethoven | `-byFesduBOs` / `p_z_A9FTAwU` | `cover_1920x1080.png`、`tokens_piano_roll.png` | machine learning, PyTorch, music, film, research |
| `wfc-floorplan` | Floor plans by wave function collapse | IT\2211 | `7-f_Z4S9-rE` | `film\cover\cover_en_1920x1080.png`、`renders\grid.png`、现有 | wave function collapse, Python, architecture, film |
| `erosion-terrain` | Hydraulic erosion in real time | IT\2605_ErosionTerrain | 天窗 | **需截图** | three.js, GLSL, simulation, terrain |
| `gpgpu-balls` | 16,000 balls spell ITP | ITP\ItsShaderTime\w6 | 天窗 | 现有 | GPGPU, GLSL, three.js |
| `tube-shader` | Hand-tracked tube | ITP\ItsShaderTime\w2 | 天窗 | 现有 | GLSL, MediaPipe, p5.js, interactive |
| `fractal-tree` | Fractal tree class for three.js | IT\2308 | 在线嵌入 | 现有 | procedural, three.js |
| `fractal-forest` | Fractal forest | p5 | 在线嵌入 | 现有 | procedural, p5.js |
| `quadrangulation` | Quadrangulating the hexagon | IT\2403 | 无 | 现有 + `results\motion` 帧 | computational geometry, p5.js |
| `voronoi-parcels` | Rectangular parcels from Voronoi claiming | p5 | 在线嵌入 | 现有 | Voronoi, urban, p5.js |
| `becoming-city-film` | Becoming City, a short film | ITP\hyperCinema | 天窗 | 现有 | film, generative video |
| `land-price-ml` | What drives land prices in Chinese cities | ITP\machineLearningForCities | 无 | `figures\top_features.png`、现有三张；Report.pdf 可链接 | machine learning, data, urban, research, Python |
| （页面） `sketches.html` | p5.js sketchbook | 现有 20 个 | 在线嵌入 | 现有 | p5.js |

### 建议不收（素材不够或只是练习）

voronoi-claim、procedural cathedrals、ML maze、shader 自学课、music conduction、Box of Mirrors / MirrorArrayMagic、Focus Trainer、MediaPipe mustache、CitiesRoutes、FloorPlanGenetics、2507 四个小模拟器、CustomerModel、BetterBeijing、Kimoji 等课堂练习。这些以后可以作为 sketches 或 tag 追加，不占作品位。

## 4. 背景板块内容

**Writing & media**
- 书：《An Evolutionary History of the City》38 章，vercel。
- 播客：《陈腐粉碎机》喜马拉雅专辑 + YouTube 全集（01–118 期，含《城市演化论》1–38）。
- 视频系列：《城市演化论》YouTube 79–118 期；《陈腐粉碎机 Remake》字幕版进行中（31 期已做封面）。
- 讲座：负典城市学《雅典宪章》1–4、公园的五个维度、万科培训。
- 进行中：《马斯克的祖先》24 集双语脚本、《罗马演义》60 集策划。

**Architecture**：保持现有 9 个项目和手绘画廊。顺手修三个错：gallery 的 places 数量 103→102；`light-of-the-west.html` 标题写成了 Mansion Oriental；青岛 AIA 奖年份 2011/2013 不一致（以 CV 的 2013 为准）。

## 5. 代码改动

1. `data/projects.js`：`CATEGORIES` 改为四个新 id；每个项目加 `youtube: [{id, label}]`、`videoPending: "..."`、更完整的 `tags`；删掉 `video` 字段。
2. `site.js`：新增 YouTube 点击加载组件、天窗占位组件、Work 页标签筛选（`?tag=`）、项目页"相关项目"（按共同标签）。
3. `styles.css`：占位块、标签筛选行、YouTube 封面样式。
4. `img/projects/`：按上表导入新素材，统一尺寸（缩略图 1200×900，hero 1600×900，图集最长边 1600），删除大 mp4。
5. `writing.html`：加 YouTube 播放列表和视频系列链接。
6. 新项目页需要截图：Ariadne、Altrovia、Hormuz、Last Day of AIs、Erosion、VorteGo（待地址）。

## 6. 需要你决定的事

1. ~~VorteGo 的线上地址是什么？~~ 已答：https://vortego.itp.io/
2. 七个大于 1 MB 的本地 mp4 是否删除？三个小于 1 MB 的是否保留做静音封面动图？
3. 新加入的项目（Ariadne、Altrovia、Rome WFC、Brick ghosts、Clash of Iron、A Quiet Practice、Doorman）和"建议不收"清单是否同意？
4. Algorithms of the City 放 web 还是 games？我放了 web（它是一个开放的网络书），并打 simulation 标签。

## 7. p5.js 速写本：线上 202 个 sketch 的候选

完整清单（更新日期、创建日期、id、名称）存在 `data/p5-sketches-all.tsv`，来自 editor.p5js.org 的公开接口。现有 `data/sketches.js` 只收了 20 个。下面是按名称初筛的候选，最终要逐个打开渲染缩略图后再定（只留画面好的）。

**2025–2026 新作（现有 20 个里没有的）**

| id | 名称 | 日期 |
|---|---|---|
| `_w8MgiERV` | BeethovenMarkov | 2026-09 |
| `_EtGd3zwO` | TerribleVerse（A2Z 作业，文字生成） | 2026-09 |
| `yZl2Nyb0I` | Peaceful shape | 2026-09 |
| `-qyNEWHMX` | NewYorkGeoShader | 2026-02 |
| `NqolOlefE` | WebcamShader（= Hand-tracked tube） | 2026-02 |
| `ug59CiXGW` | fourierTransformation | 2025-12 |
| `SRQilVh4j` | noiseSea | 2025-12 |
| `AwGcEWdpW` | pedalFall2 | 2025-12 |
| `j8cZl7Hg3` | Conducting（ml5 指挥节拍） | 2025-11 |
| `lpYlyuE4g` | Pinching Your Shards | 2025-11 |
| `4xb2VN5eg` | Facing_the_Sound_Raval_walks_away | 2025-11 |
| `0iWetphFX` | ml5 HandPose Pinch and Release | 2025-11 |
| `CNgbWvPEl` | captureVoronoirized | 2025-11 |
| `sU95JqKAh` | mosaicCapture | 2025-11 |
| `00EUGlXS5` | colour composition: mandala | 2025-09 |
| `U4MozZYJC` | Goddess_Mandala | 2025-09 |
| `XOWIEkJyo` | Draw_A_Mandala_with_P5_ML5 | 2025-09 |
| `qVcD2m5aV` | DuotoneFilter | 2025-09 |
| `b0uujm-J9` | Cuboid river | 2025-09 |
| `k59TcabWr` | Wave Field CPU version | 2025-08 |
| `VGORjX8IX` | FM Synth_0 | 2025-06 |

**2022–2024 旧作里可能值得补的**

| id | 名称 | 日期 |
|---|---|---|
| `f_cAL6y0g` | Endurable ocean | 2024-03 |
| `pL8CdGF_z` | Tile221121（WFC 瓦片系列最终版） | 2023-11 |
| `TSEAgnSQm` | 202307_delaunator | 2023-07 |
| `EzcsI9QmT_` | Canyon position | 2023-07 |
| `wpG4rwvwL` | Snowy podium | 2023-06 |
| `ER3i5o84K` | SoftBody Learning | 2023-04 |
| `ZAteIF29a` | realEstateSalesOptimizationGeneticAlgorithm（20230405） | 2023-04 |
| `sAMTq__j8` | urbanErosion | 2023-02 |
| `vf0gdpmWB` | geoTiff | 2023-01 |
| `dIbOqhUGo` | KnightMovePathFinding | 2023-01 |
| `zRQNpz0k0` | distance claim Voronoi | 2023-01 |
| `PjUcGnEqX` | abitrary claim Voronoi | 2023-01 |
| `-r1SeIysc` | topoDiscretization | 2022-10 |
| `01mstSMdJ` | A* +++ | 2022-10 |
| `RC5qtYudA` | ginkgoBiloba | 2022-09 |
| `O5G-pQNNP` | 3dTree | 2022-09 |
| `JDoUcryC0` | wavyGrid | 2022-09 |
| `emYBVQQ0t` | landValue | 2022-08 |
| `GuYUOsXau` | TerrainNoiseLayers | 2022-08 |
| `t1IpjzQFS` | RainErosion | 2022-08 |
| `TcCyhiB-o` | campVoronoi | 2022-08 |
| `zcDye4LCP` | A*PlainsWatersComplex | 2022-08 |
| `vL6SrWe2x` | VectorField | 2022-07 |
| `kSd77A6t2` | Pie satellite | 2022-07 |

**不收**：所有带 "copy" 的、ICM worksheet / week 作业、Coding Train 跟练（flappyBird、Quadtree、Chaos Game、Nature of Code 等）、早期向量/摩擦球练习、同一主题的中间版本（Tile 系列只留最后一个，ManhattanStreets 只留 20230411，voronoFence 系列只留 PCsBXbjDi）。

**实施方式**：在浏览器里逐个打开 `editor.p5js.org/ludwig.peking/full/<id>` 截图做 600×600 缩略图，画面空白或报错的直接剔除，然后把入选的追加到 `data/sketches.js`。

### 7.1 署名判断（扫描每个 sketch 源码里的注释）

逐行结果在 `data/p5-sketches-attribution.tsv`（日期、id、名称、代码行数、是否出现本人署名、命中的出处关键词）。结论：

**纯跟练或他人代码，剔除**
Quadtree Collisions copy、Chaos Game 2 copy、Gift Wrapping Convex Hull copy ×2、Convex Hull copy、Nature of Code 2 Mutual Attraction copy、Flowfield_capture copy、Flappy Bird copy、Simulate: penrose tiles copy、Interaction: Follow2（p5 官方示例改了几行）、W03_Escape copy（课堂示例）、`z034PG_BH` voronoi（Francisco Moreira 的库演示）、Canyon position / Snowy podium / Endurable ocean（无署名的小练习，待看画面再定）。

**在 Coding Train 基础上重构、代码里明确写了 "refactored / re-modeled by Qian Li" 和原出处，保留并在卡片备注 "after Shiffman"**
- WFC 屋顶系列（`2R5QuHH9E` 等 5 个，只留带树的那个）
- Tile 瓦片系列（`pL8CdGF_z` Tile221121 最终版，1,885 行）
- Interpolated Contour Lines `BD3zHhF9W`（marching squares 重构，3,838 行）
- fractalForest / oliver `wkZduz_Fj`、fractalSakura `PHgkeZCIi`、ginkgoBiloba `RC5qtYudA`
- Class Based Ghostoid `_h9U-w-bL`（注明 Reynolds 1986 / Shiffman flocking）
- convexHullGraham `Gk-EAXJy9`
- A* Pathfinding Terrain `fOC_JA36G`（引用 Coding Train 的 A* 讲解）

**代码里有本人署名的原创**
landValue、TerrainNoiseLayers、RainErosion、A*PlainsWatersComplex、camp / campVoronoi、donkeyPath 系列、HunterGathererVedio、voronoFence+Pathfinding（`PCsBXbjDi`）、ml5 HandPose Pinch and Release、DuotoneFilter、realEstateSalesOptimizationGeneticAlgorithm、3D WFC ROOF Remodel。

**没有任何出处注释、按本人原创处理（2025–2026 新作全部在此列）**
BeethovenMarkov、TerribleVerse、Peaceful shape、NewYorkGeoShader、noiseSea、fourierTransformation、Conducting、Pinching Your Shards、Facing_the_Sound、captureVoronoirized、mosaicCapture、Goddess_Mandala、Draw_A_Mandala、Cuboid river、Wave Field、FM Synth、SuperEllipse 系列、PolarGraph、solarSystem、threeBody、kimoji、ITP Gas、colour composition 四件、urbanErosion、geoTiff、KnightMovePathFinding、distance claim Voronoi、topoDiscretization、wavyGrid、VectorField、Pie satellite、202307_delaunator（内嵌 Raymond Hill 的 Voronoi 库，外层是本人代码）。

现有 `data/sketches.js` 里的 20 个全部通过（其中 WFC roof、Contour lines、fractalSakura、Ghostoid 四个要加 "after Shiffman" 备注）。


## 8. 进度（2026-10-11）与素材缺口

**已完成的架子**
- `data/projects.js`：四个新分类，38 个项目，每个带标签；YouTube 用 `youtube: [{id, label}]`，没有视频的用 `videoPending`，未写文案的用 `copyPending: true` + lorem ipsum。
- `site.js`：YouTube 点击加载（youtube-nocookie，封面取 YouTube 缩略图，多部影片时第一部大、其余两列）；天窗占位块；文案占位提示；Work 页标签筛选 `?tag=`；项目页标签可点；按共同标签推荐相关项目；缩略图加载失败时显示 "image pending"。
- 素材：导入 57 张高清图（见第 3 节来源），9 个本地 mp4 和 4 张低质图移到仓库外的 `_unused-media`。Ariadne 截了图谱界面做缩略图。
- 校验：本地跑过首页、Work 页（含标签筛选）、Rome WFC 和 Clash of Iron 项目页，无图片损坏，12 个 YouTube 封面全部可加载。

**素材缺口（按价值排序）**

| 优先 | 项目 | 缺什么 | 怎么补 |
|---|---|---|---|
| 高 | VorteGo | 玩法视频（地址和截图已补） | 录一局两分钟对弈，上传后填 id |
| 高 | ParcBalance | 不做视频，文字说明已扩写，待你审 | 产品本身待打磨：界面里显示 CAD 图，计算仍用栅格数据 |
| 高 | Decisive | 2:03 宣传片是中文旁白加中文硬字幕，面向中国市场 | 先配英文字幕（YouTube 字幕轨或重新压制），再上传并填 id；本地没有脚本文件，字幕需从片子听写 |
| 高 | Optical network | 9:22 科普片未上传 | 同上 |
| 高 | 沙盘 | 展览原片（2.6 GB）未剪未传；现在用"三次迭代"视频顶着 | 剪 1–2 分钟上传 |
| 中 | Rome WFC、Brick ghosts、Ritual Forest、Pantheon、Becoming City 短片、Hand-tracked tube | 本地成片未上传 | 批量上传后填 id |
| 中 | Ghost corridor | 只有五条 1080p 原片（最长 6 分钟），没有成片；图已从原片抽帧补齐 | 剪一分钟上传后填 id |
| 中 | Erosion | 缩略图弱，无视频 | 本地起服务截图 + 录屏（Hormuz、Last Day 已于 10-11 本地截图换封面） |
| 中 | Altrovia | 缩略图来自 26 秒录屏；官网动画太重，Chrome 截图卡死 | 换一张设计稿或手动截图 |
| 中 | Cathay Heroes | 无视频 | 录屏 |
| 低 | Motion projection 图集第二张只有 640×360 | 源片分辨率低 | 从 Kinect 录像另抽帧 |
| 低 | Clash of Iron 封面是 1280×720 上采样 | 成片抽帧带字幕且船太小 | 从 Blender 另渲一张 |

**文案待写（5 个）**：Ariadne、Altrovia、A Quiet Practice、Rome WFC、Brick ghosts。（Doorman 已按你的意见撤下，图移到 `_unused-media/doorman`。）

**下一轮**：p5 速写本扩充（第 7 节候选逐个渲染缩略图）、写作页加 YouTube 播放列表、建筑页三处小错、Hormuz / Last Day / Erosion 本地截图。

## 9. 封面与版式（2026-10-11 下午）

**精选项目**（首页 Selected work）按你的清单改为 8 个：Algorithms of the City（含 Spring Show）、Rome WFC、Shoin-zukuri、沙盘（Winter Show）、WFC floor plans、Decisive、ParcBalance、VorteGo。

**封面原则**：每个项目用最打眼的一张图，不用带字幕的影片封面卡；有动态素材的项目再加一段 6 秒动图。

换掉的封面（旧图在 `_unused-media/old-covers`）：

| 项目 | 新封面 | 来源 |
|---|---|---|
| Decisive | SketchUp 里的红色体量 | 宣传片抽帧裁切 |
| Algorithms of the City | 网站首页（罗马 / 香港 / 京都三张卡） | 现有画廊图 |
| Clash of Iron | 黄海海战燃烧的来远舰 | 现有画廊图 |
| A Quiet Practice | 枯山水石组特写 | itch 截图 |
| NYC Subway Cube | 等轴测彩色线路 | 现有画廊图 |
| Beethoven Motif Lab | 自动钢琴纸卷 | 影片抽帧 |
| 沙盘 | 观众围着沙盘指点（Winter Show 现场照） | `documentation\Weixin Image_..._47_2.jpg`，同时换了 hero |
| Motion Projection | 投影人脸特写 | 影片封面右半 |
| Ariadne | 图谱居中放大 | 原截图 |
| Shoin-zukuri | 线上生成器实时渲染（寝殿 + 金阁） | Chrome 截图 shoin-zukuri-wfc.vercel.app，同时换了 hero |
| Hormuz Strait | 双翼机座舱视角 | 本地起 node 服务截图，新加 hero |
| Last Day of AIs | 选角色界面 | 本地起静态服务截图，新加 hero |
| ParcBalance | 价格图局部放大 | 8000 宽总图裁切；**仍然不够打眼**，素材里只有 CAD 风格的图，建议补一张示意图或界面图 |

**动图**（`img/projects/motion/*.webp`，600×450、12 fps、6 秒，75 KB–1.6 MB；用 animated WebP 而不是 GIF，同样内容 GIF 要大 5–10 倍）：沙盘（展览原片 1:46–1:52）、Rome WFC（Real Estate 片 2:40–2:46，裁掉字幕）、Decisive（宣传片 1:30–1:36，裁掉人像和字幕）、Algorithms（手绘动画）、Game of Boolean、Hand-tracked tube、Pantheon、Becoming City 短片、NYC Subway Cube、Brick ghosts、Ritual Forest、Malthusian World。卡片上有橙点的就是有动图的；鼠标悬停播放，触屏设备卡片进入视野时播放。VorteGo、ParcBalance、WFC floor plans 没有本地素材，暂无动图。

**版式**：按"字再小、图更重"的意见，所有字号整体缩小（正文 17→14 px，标题缩到原来约 3/4，卡片标题 0.85 rem，标签 0.58 rem），页头 46 px，首屏留白减半。还可以再压：如果觉得还是太"平衡"，下一步可以把卡片下的摘要去掉只留标题，或改成更密的四列网格。

**撤下**：Doorman（你说不算作品）。
