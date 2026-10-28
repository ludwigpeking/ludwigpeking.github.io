// Make local, recordable copies of the curated p5 sketches and (optionally)
// record their motion thumbnails.
//
//   node tools/build_sketch_motion_pages.mjs <pages dir> [--record] [--only=id,id] [--base=http://127.0.0.1:8849]
//
// For every sketch in data/sketches.js the script downloads the project from
// the p5 editor's public endpoint (editor.p5js.org/editor/ludwig.peking/
// projects/<id>), rebuilds its files and folders under <pages dir>/<id>/,
// fetches the sketch's images, and applies the small parameter changes below
// to the sketches that would otherwise sit still: the Voronoi colonies drift,
// the yosegi squares breathe, the superellipse morphs, the fractal trees sway
// with a fixed seed, the contour map draws itself level by level and the WFC
// roof turns. Everything else is recorded as it is.
//
// --record then plays each page from a static server (python -I -m http.server
// 8849 --directory <pages dir>) in the private headless Chrome on CDP port
// 9333 through tools/record_sketch_motion.mjs (on Chrome's virtual time, so
// slow sketches still come out smooth), with the recording settings in the
// table below.
import { mkdirSync, writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const pagesDirectory = process.argv[2] && process.argv[2].indexOf('--') !== 0 ? path.resolve(process.argv[2]) : null;
if (!pagesDirectory) {
  console.error('usage: node tools/build_sketch_motion_pages.mjs <pages dir> [--record] [--only=id,id] [--base=http://127.0.0.1:8849]');
  process.exit(1);
}
function option(name, fallback) {
  const match = process.argv.find(function (argument) { return argument.indexOf('--' + name + '=') === 0; });
  return match ? match.slice(name.length + 3) : fallback;
}
const shouldRecord = process.argv.indexOf('--record') !== -1;
const onlyIds = option('only', '') ? option('only', '').split(',') : null;
const baseUrl = option('base', 'http://127.0.0.1:8849');
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const editorUser = 'ludwig.peking';

/* A draw() for the fractal trees: on its first call it renders one cycle of
   the sway (the branch angle swinging by `swing` around `baseAngle`) into
   `steps` images through the sketch's own redrawTree(), then shows them in
   turn, each for `framesPerStep` frames. The sketch's draw() body follows. */
function swayPlayback(baseAngle, swing, steps, framesPerStep) {
  return 'let swayAngle = ' + baseAngle + ';\n' +
    'let swayFrames = [];\n' +
    'function draw() {\n' +
    '  if (swayFrames.length === 0) {\n' +
    '    for (let step = 0; step < ' + steps + '; step += 1) {\n' +
    '      swayAngle = ' + baseAngle + ' + ' + swing + ' * Math.sin(step / ' + steps + ' * 2 * Math.PI);\n' +
    '      redrawTree();\n' +
    '      swayFrames.push(offscreen.get());\n' +
    '    }\n' +
    '  }\n' +
    '  offscreen.clear();\n' +
    '  offscreen.noTint();\n' +
    '  offscreen.image(swayFrames[Math.floor(frameCount / ' + framesPerStep + ') % swayFrames.length], 0, 0);';
}

/* Text replacements per sketch file; each `find` must occur exactly once so a
   changed source is noticed instead of silently recorded unchanged. */
const tweaks = {
  // Three body: launched gently and kept on the canvas by soft edges, so the
  // bodies stay in view instead of flying off within a second.
  t_bPW1h8p: {
    'sketch.js': [
      { find: '    v.mult(8)\n', replace: '    v.mult(2.5)\n' }
    ],
    'mover.js': [
      { find: '    this.pos.add(this.vel)\n    this.acc.set(0,0)',
        replace: '    this.pos.add(this.vel)\n    if (this.pos.x < this.r || this.pos.x > width - this.r) {\n      this.vel.x *= -0.9;\n      this.pos.x = constrain(this.pos.x, this.r, width - this.r);\n    }\n    if (this.pos.y < this.r || this.pos.y > height - this.r) {\n      this.vel.y *= -0.9;\n      this.pos.y = constrain(this.pos.y, this.r, height - this.r);\n    }\n    this.acc.set(0,0)' }
    ]
  },
  // Solar system: the camera sits among the inner planets and circles slowly.
  EfaQRXFsw: { 'script.js': [
    { find: '    camera.position.set(0, 50, 100);', replace: '    camera.position.set(0, 7, 16);' },
    { find: '    const controls = new OrbitControls(camera, renderer.domElement);',
      replace: '    const controls = new OrbitControls(camera, renderer.domElement);\n    controls.autoRotate = true;\n    controls.autoRotateSpeed = 2.0;' }
  ] },
  // Colour composition: Voronoi. The colonies' points drift about their homes.
  T35Gm5KOq: { 'sketch.js': [
    { find: '  noLoop(); // We only need to draw it once\n', replace: '' },
    { find: '      points.push({\n        x: x,\n        y: y,\n        color: random(colors),\n      });',
      replace: '      points.push({\n        x: x,\n        y: y,\n        homeX: x,\n        homeY: y,\n        phase: random(TWO_PI),\n        color: random(colors),\n      });' },
    { find: '  const d3Points = points.map((p) => [p.x, p.y]);',
      replace: '  for (const p of points) {\n    p.x = p.homeX + 18 * sin(frameCount * 0.02 + p.phase);\n    p.y = p.homeY + 18 * cos(frameCount * 0.017 + p.phase * 1.3);\n  }\n  const d3Points = points.map((p) => [p.x, p.y]);' },
    { find: '  noLoop();\n}', replace: '}' }
  ] },
  // Colour composition: yosegi-zaiku. A new generation four times a second
  // from the same seed, with the rotation range and the edge jitter drifting
  // slowly, so the pattern keeps its layout while every square breathes.
  ZvP27kRL6: { 'sketch.js': [
    { find: '  noLoop(); // Draw once\n', replace: '  frameRate(4);\n' },
    { find: '  background(255); // White background\n',
      replace: '  background(255); // White background\n  randomSeed(5);\n  let rotationRange = 2.5 + 2 * sin(frameCount * 11);\n  let jitterRange = 3 + 2.5 * sin(frameCount * 7 + 40);\n' },
    { find: '      let rotationOffset = random(-2.5, 2.5); // Slight random rotation for each main square group',
      replace: '      let rotationOffset = random(-rotationRange, rotationRange); // Slight random rotation for each main square group' },
    { find: '        rect(0, 0, currentSize + random(-3,3), currentSize+ random(-3,3));',
      replace: '        rect(0, 0, currentSize + random(-jitterRange, jitterRange), currentSize + random(-jitterRange, jitterRange));' }
  ] },
  // D3 Voronoi: a square canvas, more seeds, and the seeds wander.
  '8mdWLLeki': { 'sketch.js': [
    { find: '  var width = 500,\n    height = 300;', replace: '  var width = 600,\n    height = 600;' },
    { find: '  var vertices = d3.range(100).map(function (d) {\n    return [Math.random() * width, Math.random() * height];\n  });',
      replace: '  if (!window.baseVertices) {\n    window.baseVertices = d3.range(220).map(function (d) {\n      return [Math.random() * width, Math.random() * height];\n    });\n  }\n  var vertices = window.baseVertices.map(function (v, i) {\n    return [v[0] + 14 * Math.sin(frameCount * 0.03 + i * 0.7), v[1] + 14 * Math.cos(frameCount * 0.024 + i * 1.3)];\n  });' },
    { find: '  createCanvas(width, height);', replace: '  if (frameCount === 0) {\n    createCanvas(width, height);\n  }' },
    { find: 'function setup() {', replace: 'function setup() {\n  frameRate(30);\n  drawVoronoi();\n}\n\nfunction draw() {\n  drawVoronoi();\n}\n\nfunction drawVoronoi() {' }
  ] },
  // Superellipse: the exponent and the axes keep changing.
  N9kk9Wq7S: { 'sketch.js': [
    { find: '  createCanvas(400, 400);', replace: '  createCanvas(400, 400);\n  pixelDensity(2);' },
    { find: '  background(220);\n  beginShape();', replace: '  background(220);\n  n = 0.6 + 2.6 * (1 + sin(frameCount * 0.03));\n  a = 1 + 0.25 * sin(frameCount * 0.017);\n  b = 1 + 0.25 * cos(frameCount * 0.013);\n  beginShape();' }
  ] },
  // Polar graph: the two lobed curves rotate against each other.
  SbaAloSrl: { 'sketch.js': [
    { find: '  createCanvas(400, 400);', replace: '  createCanvas(400, 400);\n  pixelDensity(2);' },
    { find: '    r1 = 100+ 40 * sin( 4 * (theta - PI*3/8));\n    r2 = 110+ 20 * sin( 4 * (theta - PI*1/8));',
      replace: '    r1 = 100 + 40 * sin(4 * (theta - PI * 3 / 8 + frameCount * 0.01));\n    r2 = 110 + 20 * sin(4 * (theta - PI * 1 / 8 - frameCount * 0.013));' }
  ] },
  // Fractal sakura: the branch angle sways. The seed is reset before every
  // redraw so the same tree bends instead of a new one growing, and since a
  // redraw takes long, one cycle of the sway is rendered up front and played
  // back.
  PHgkeZCIi: { 'sketch.js': [
    { find: 'function draw() {\n  image(offscreen, 0, 0); // Draw offscreen canvas to main canvas\n}',
      replace: swayPlayback('Math.PI / 7', 0.1, 24, 5) + '\n  image(offscreen, 0, 0);\n}' },
    { find: '  angle = slider.value();', replace: '  angle = swayAngle;\n  randomSeed(seed);' }
  ] },
  // Fractal forest: the same sway with a fixed seed (fewer steps: a redraw
  // of its sixty thousand leaves takes several seconds).
  wkZduz_Fj: { 'sketch.js': [
    { find: 'function draw() {\n  background(255);\n  image(offscreen, 0, 0);',
      replace: swayPlayback('Math.PI / 9', 0.07, 16, 8) + '\n  background(255);\n  image(offscreen, 0, 0);' },
    { find: '  angle = slider.value();\n', replace: '  angle = swayAngle;\n  randomSeed(3);\n' }
  ] },
  // Interpolated contour lines: the field is drawn once, then the contour
  // levels inside its range appear one every fifth frame, pause, and start over. The lines are
  // drawn two pixels wide, so they keep one pixel after the halving to 600.
  BD3zHhF9W: { 'sketch.js': [
    { find: 'function draw() {\n  noiseSeed(99)',
      replace: 'const firstLevel = 0.2;\nlet levelH = firstLevel;\nlet pauseFrames = 0;\nfunction draw() {\n  if (levelH > 0.86) {\n    pauseFrames += 1;\n    if (pauseFrames > 60) {\n      levelH = firstLevel;\n      pauseFrames = 0;\n    }\n    return;\n  }\n  if (levelH === firstLevel) {\n    drawField();\n  }\n  if (frameCount % 5 !== 0) {\n    return;\n  }\n  drawLevel(levelH);\n  levelH += 0.02;\n}\n\nfunction drawField() {\n  colorMode(RGB, 255);\n  noiseSeed(99)' },
    { find: '  for (let h = -1; h < 2; h += 0.02) {\n    colorMode(HSB, 100);\n    stroke(100 * h, 50, 50);\n    strokeWeight(1);', replace: '}\n\nfunction drawLevel(h) {\n  {\n    colorMode(HSB, 100);\n    stroke(100 * h, 50, 50);\n    strokeWeight(2);' },
    { find: '  }\n  noLoop();\n}', replace: '  }\n}' }
  ] },
  // 3D WFC roof: turns slowly about the middle of the grid.
  '2R5QuHH9E': { 'sketch.js': [
    { find: '  orbitControl(3,3,3);\n  rotateX(0.5);\n  translate(-width / 3 , -height/3);\n  fill(200,200,200)\n  tree(100,100)',
      replace: '  rotateX(0.5);\n  rotateZ(frameCount * 0.004);\n  translate(-cols * res / 2, -rows * res / 2);\n  fill(200,200,200)\n  randomSeed(11);\n  tree(100,100)' },
    { find: '  noLoop()\n}', replace: '}' }
  ] },
  // Pseudo-noise sine waves: the phase seed advances so the waves travel;
  // the sliders over the canvas are hidden for the recording.
  ZG4RgjJ5_: {
    'sketch.js': [
      { find: 'function draw() {\n  background(255);', replace: 'function draw() {\n  seed = 122 + frameCount * 0.02;\n  background(255);' }
    ],
    'index.html': [
      { find: '</head>', replace: '<style>p, span, input { display: none !important; }</style></head>' }
    ]
  }
};

/* Recording settings: seconds, warm-up, page size, square zoom and focus, pointer. */
const recordSettings = {
  YbSLl8Gr8: { seconds: 10, warmup: 4, zoom: 0.62, focus: '0.5,0.47' },
  oLlmrTQ5K: { seconds: 9, warmup: 1, mouse: 'circle' },
  nOFTa0BuI: { seconds: 9, warmup: 1 },
  EfaQRXFsw: { seconds: 10, warmup: 1, zoom: 1 },
  DUi3nw6T8: { seconds: 10, warmup: 2, mouse: 'circle' },
  '_h9U-w-bL': { seconds: 9, warmup: 2 },
  t_bPW1h8p: { seconds: 10, warmup: 0.3, zoom: 1 },
  T35Gm5KOq: { seconds: 9, warmup: 1 },
  ZvP27kRL6: { seconds: 9, warmup: 1 },
  kRTwNCidG: { seconds: 9, warmup: 1 },
  '8mdWLLeki': { seconds: 9, warmup: 1 },
  N9kk9Wq7S: { seconds: 9, warmup: 1, zoom: 0.75 },
  SbaAloSrl: { seconds: 9, warmup: 1, zoom: 0.8 },
  ZG4RgjJ5_: { seconds: 9, warmup: 1 },
  PHgkeZCIi: { seconds: 9, warmup: 0.5 },
  '8ZFqUc5KC': { seconds: 10, warmup: 2 },
  wkZduz_Fj: { seconds: 9, warmup: 0.5 },
  BD3zHhF9W: { seconds: 10, warmup: 0.2, zoom: 0.5, focus: '0.5,0.4', still: 3.5 },
  '2R5QuHH9E': { seconds: 10, warmup: 2 }
};

const catalogueText = readFileSync(path.join(repositoryRoot, 'data', 'sketches.js'), 'utf8');
const sketchIds = Array.from(catalogueText.matchAll(/\bid:\s*"([^"]+)"/g)).map(function (match) { return match[1]; })
  .filter(function (sketchId) { return !onlyIds || onlyIds.indexOf(sketchId) !== -1; });

function applyTweaks(sketchId, fileName, text) {
  const fileTweaks = tweaks[sketchId] && tweaks[sketchId][fileName];
  if (!fileTweaks) { return text; }
  let changed = text;
  for (const tweak of fileTweaks) {
    const occurrences = changed.split(tweak.find).length - 1;
    if (occurrences !== 1) {
      throw new Error(sketchId + '/' + fileName + ': expected one occurrence of ' + JSON.stringify(tweak.find.slice(0, 60)) + ', found ' + occurrences);
    }
    changed = changed.replace(tweak.find, function () { return tweak.replace; });
  }
  return changed;
}

async function buildPage(sketchId) {
  const response = await fetch('https://editor.p5js.org/editor/' + editorUser + '/projects/' + sketchId);
  if (!response.ok) { throw new Error(sketchId + ': editor answered ' + response.status); }
  const project = await response.json();
  const filesById = {};
  for (const file of project.files) { filesById[file.id] = file; }
  const rootFolder = project.files.find(function (file) { return file.name === 'root' && file.fileType === 'folder'; });
  const written = [];
  async function writeTree(folder, directory) {
    mkdirSync(directory, { recursive: true });
    for (const childId of folder.children || []) {
      const child = filesById[childId];
      if (!child) { continue; }
      if (child.fileType === 'folder') {
        await writeTree(child, path.join(directory, child.name));
      } else if (child.url && !child.content) {
        const asset = await fetch(child.url);
        writeFileSync(path.join(directory, child.name), Buffer.from(await asset.arrayBuffer()));
        written.push(child.name + ' (fetched)');
      } else {
        const relativeName = path.relative(path.join(pagesDirectory, sketchId), path.join(directory, child.name)).split(path.sep).join('/');
        writeFileSync(path.join(directory, child.name), applyTweaks(sketchId, relativeName, child.content || ''));
        written.push(relativeName + (tweaks[sketchId] && tweaks[sketchId][relativeName] ? ' (tweaked)' : ''));
      }
    }
  }
  await writeTree(rootFolder, path.join(pagesDirectory, sketchId));
  console.log('[pages] ' + sketchId + ' ' + project.name + ': ' + written.join(', '));
}

for (const sketchId of sketchIds) {
  await buildPage(sketchId);
}
for (const sketchId of Object.keys(tweaks)) {
  if (sketchIds.indexOf(sketchId) === -1 && !onlyIds) { console.log('[pages] note: tweak for ' + sketchId + ' matched no sketch in the catalogue'); }
}

if (shouldRecord) {
  const recorder = path.join(repositoryRoot, 'tools', 'record_sketch_motion.mjs');
  for (const sketchId of sketchIds) {
    const settings = recordSettings[sketchId] || { seconds: 9, warmup: 2 };
    const argumentList = [recorder, baseUrl + '/' + sketchId + '/index.html', sketchId, '--seconds=' + settings.seconds, '--warmup=' + settings.warmup];
    if (settings.viewport) { argumentList.push('--viewport=' + settings.viewport); }
    if (settings.zoom !== undefined) { argumentList.push('--zoom=' + settings.zoom); }
    if (settings.focus) { argumentList.push('--focus=' + settings.focus); }
    if (settings.mouse) { argumentList.push('--mouse=' + settings.mouse); }
    if (settings.still !== undefined) { argumentList.push('--still=' + settings.still); }
    console.log('[record] ' + sketchId);
    try {
      execFileSync(process.execPath, argumentList, { stdio: 'inherit' });
    } catch (error) {
      console.error('[record] ' + sketchId + ' failed: ' + error.message);
    }
  }
}
