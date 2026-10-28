// Record a running p5 sketch as the square motion thumbnail of a sketch card.
//
//   node tools/record_sketch_motion.mjs <url> <sketch id> [options]
//
// Opens the page in a private headless Chrome (CDP on port 9333 unless
// CDP_PORT says otherwise), waits for its canvas, then takes screenshots of a
// centred square of that canvas for the recording time. The page loads and
// warms up on the wall clock (images and fonts arrive as usual); for the
// frames themselves it is switched to Chrome's virtual time, which advances
// one thirtieth of a second per frame, so a sketch that renders slowly here
// (software WebGL, a fractal redrawn every frame) still comes out smooth at 30
// frames a second, and millis(), Date and requestAnimationFrame all agree with
// the clip. With --realtime the page stays on the wall clock and each frame is
// stamped with the moment it was taken. ffmpeg turns the frames into a silent 600 x 600 H.264
// clip (capped near 900 kbit/s, so about a megabyte for ten seconds) at
// img/sketches/motion/<id>.mp4 and writes the still the card shows
// before the clip plays to img/sketches/<id>.jpg (one frame, so the two
// match). Nothing else in the repository is touched.
//
// Options:
//   --seconds=<n>      recording length (default 9)
//   --warmup=<n>       seconds to let the sketch run before recording (default 2)
//   --viewport=<w>x<h> page size for sketches that fill the window (default 900x900)
//   --zoom=<0..1>      side of the square as a share of the shorter canvas side (default 1)
//   --focus=<x>,<y>    centre of the square as shares of the canvas width and height (default 0.5,0.5)
//   --still=<seconds>  moment in the recording used for the still (default 0.5)
//   --fps=<n>          frames per second of virtual time (default 30), or the target
//                      screenshot rate with --realtime (the sketch decides the real one)
//   --realtime         run on the wall clock instead of virtual time
//   --mouse=<kind>     'circle' moves the pointer round the canvas during the recording
//   --out=<dir>        repository root to write into (default: this repository)
//   --keep-frames      leave the frame folder behind
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const [targetUrl, sketchId] = process.argv.slice(2);
if (!targetUrl || !sketchId) {
  console.error('usage: node tools/record_sketch_motion.mjs <url> <sketch id> [--seconds=9] [--warmup=2] [--viewport=900x900] [--zoom=1] [--focus=0.5,0.5]');
  process.exit(1);
}
function option(name, fallback) {
  const match = process.argv.slice(4).find(function (argument) { return argument.indexOf('--' + name + '=') === 0; });
  return match ? match.slice(name.length + 3) : fallback;
}
const recordSeconds = Number(option('seconds', 9));
const warmupSeconds = Number(option('warmup', 2));
const viewportSize = option('viewport', '900x900').split('x').map(Number);
const zoom = Number(option('zoom', 1));
const focus = option('focus', '0.5,0.5').split(',').map(Number);
const stillSecond = Number(option('still', 0.5));
const realtime = process.argv.indexOf('--realtime') !== -1;
const targetFramesPerSecond = Number(option('fps', realtime ? 15 : 30));
const mouseKind = option('mouse', '');
const keepFrames = process.argv.indexOf('--keep-frames') !== -1;
const repositoryRoot = option('out', path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const OUTPUT_SIDE_PIXELS = 600;
const cdpPort = process.env.CDP_PORT || 9333;

const framesDirectory = path.join(repositoryRoot, 'tools', 'sketch-motion-frames', sketchId);
rmSync(framesDirectory, { recursive: true, force: true });
mkdirSync(framesDirectory, { recursive: true });
const motionDirectory = path.join(repositoryRoot, 'img', 'sketches', 'motion');
mkdirSync(motionDirectory, { recursive: true });

function delay(milliseconds) { return new Promise(function (resolve) { setTimeout(resolve, milliseconds); }); }

// --- one CDP session on a fresh tab ---
const browserInfo = await (await fetch('http://localhost:' + cdpPort + '/json/version')).json();
const browserSocket = new WebSocket(browserInfo.webSocketDebuggerUrl);
await new Promise(function (resolve) { browserSocket.addEventListener('open', resolve); });
let messageId = 0;
const pending = new Map();
const consoleErrors = [];
const eventWaiters = [];
browserSocket.addEventListener('message', function (event) {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
  if (message.method) {
    for (let index = eventWaiters.length - 1; index >= 0; index -= 1) {
      if (eventWaiters[index].method === message.method) { eventWaiters[index].resolve(message.params); eventWaiters.splice(index, 1); }
    }
  }
  if (message.method === 'Runtime.exceptionThrown') {
    const details = message.params.exceptionDetails;
    consoleErrors.push((details.exception && details.exception.description) || details.text);
  }
});
function send(method, params, sessionId) {
  messageId += 1;
  const id = messageId;
  const envelope = { id: id, method: method, params: params || {} };
  if (sessionId) { envelope.sessionId = sessionId; }
  browserSocket.send(JSON.stringify(envelope));
  return new Promise(function (resolve, reject) {
    pending.set(id, function (message) { if (message.error) { reject(new Error(method + ': ' + message.error.message)); } else { resolve(message.result); } });
  });
}
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId: targetId, flatten: true });
function page(method, params) { return send(method, params, sessionId); }
function nextEvent(method) { return new Promise(function (resolve) { eventWaiters.push({ method: method, resolve: resolve }); }); }

/* Let the page's virtual clock run for a budget of milliseconds and wait until
   it has been used up (pending network fetches hold the clock). */
async function advanceVirtualTime(milliseconds, extra) {
  const expired = nextEvent('Emulation.virtualTimeBudgetExpired');
  await page('Emulation.setVirtualTimePolicy', Object.assign({ policy: 'pauseIfNetworkFetchesPending', budget: milliseconds, maxVirtualTimeTaskStarvationCount: 100000 }, extra || {}));
  await expired;
}
async function evaluate(expression) {
  const reply = await page('Runtime.evaluate', { expression: expression, returnByValue: true, awaitPromise: true });
  return reply.result ? reply.result.value : undefined;
}

try {
  await page('Page.enable');
  await page('Runtime.enable');
  await page('Network.enable');
  await page('Network.setCacheDisabled', { cacheDisabled: true });
  await page('Emulation.setDeviceMetricsOverride', { width: viewportSize[0], height: viewportSize[1], deviceScaleFactor: 1, mobile: false });
  await page('Page.navigate', { url: targetUrl });

  // Wait for a canvas with a size, then let the sketch settle.
  let canvasRect = null;
  let waitedMilliseconds = 0;
  while (waitedMilliseconds < 30000) {
    canvasRect = await evaluate("(function(){ const list = Array.from(document.querySelectorAll('canvas')); const big = list.sort(function(a, b){ return b.width * b.height - a.width * a.height; })[0]; if (!big) { return null; } const r = big.getBoundingClientRect(); return r.width > 10 && r.height > 10 ? { x: r.left, y: r.top, width: r.width, height: r.height } : null; })()");
    if (canvasRect) { break; }
    await delay(250);
    waitedMilliseconds += 250;
  }
  if (!canvasRect) { throw new Error('no canvas appeared on ' + targetUrl + (consoleErrors.length ? '\n' + consoleErrors.join('\n') : '')); }

  // A canvas larger than the page: grow the page to the canvas so every part
  // of it is painted, then measure again (window-sized sketches stay put).
  const neededWidth = Math.ceil(canvasRect.x + canvasRect.width);
  const neededHeight = Math.ceil(canvasRect.y + canvasRect.height);
  if (neededWidth > viewportSize[0] || neededHeight > viewportSize[1]) {
    await page('Emulation.setDeviceMetricsOverride', { width: Math.max(viewportSize[0], neededWidth), height: Math.max(viewportSize[1], neededHeight), deviceScaleFactor: 1, mobile: false });
    await delay(300);
    canvasRect = await evaluate("(function(){ const list = Array.from(document.querySelectorAll('canvas')); const big = list.sort(function(a, b){ return b.width * b.height - a.width * a.height; })[0]; const r = big.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; })()");
  }
  const side = Math.min(canvasRect.width, canvasRect.height) * zoom;
  const clip = {
    x: canvasRect.x + Math.min(Math.max(canvasRect.width * focus[0] - side / 2, 0), canvasRect.width - side),
    y: canvasRect.y + Math.min(Math.max(canvasRect.height * focus[1] - side / 2, 0), canvasRect.height - side),
    width: side,
    height: side,
    scale: OUTPUT_SIDE_PIXELS / side
  };
  console.log('[record] canvas ' + Math.round(canvasRect.width) + 'x' + Math.round(canvasRect.height) + ' at ' + Math.round(canvasRect.x) + ',' + Math.round(canvasRect.y) + '; square ' + Math.round(side) + ' from ' + Math.round(clip.x) + ',' + Math.round(clip.y));

  await delay(warmupSeconds * 1000);
  if (!realtime) { await page('Emulation.setVirtualTimePolicy', { policy: 'pause' }); }

  // --- frames, each stamped with its moment on the page's clock ---
  const frameTimes = [];
  const recordingStarted = Date.now();
  const frameInterval = 1000 / targetFramesPerSecond;
  let frameIndex = 0;
  let nextMouseAt = 0;
  function elapsedMilliseconds() { return realtime ? Date.now() - recordingStarted : frameIndex * frameInterval; }
  while (elapsedMilliseconds() < recordSeconds * 1000) {
    const frameStarted = Date.now();
    const elapsed = elapsedMilliseconds();
    if (mouseKind === 'circle' && elapsed >= nextMouseAt) {
      const phase = (elapsed / 1000) * 0.8;
      await page('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: canvasRect.x + canvasRect.width * (0.5 + 0.35 * Math.cos(phase)),
        y: canvasRect.y + canvasRect.height * (0.5 + 0.35 * Math.sin(phase))
      });
      nextMouseAt = elapsed + 40;
    }
    if (!realtime) { await advanceVirtualTime(frameInterval); }
    const shot = await page('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: clip, captureBeyondViewport: true });
    frameTimes.push(elapsedMilliseconds() / 1000);
    writeFileSync(path.join(framesDirectory, 'f' + String(frameIndex).padStart(4, '0') + '.jpg'), Buffer.from(shot.data, 'base64'));
    frameIndex += 1;
    if (realtime) {
      const spent = Date.now() - frameStarted;
      if (spent < frameInterval) { await delay(frameInterval - spent); }
    }
  }
  const achievedFramesPerSecond = frameTimes.length / recordSeconds;
  console.log('[record] ' + frameTimes.length + ' frames in ' + recordSeconds + ' s of ' + (realtime ? 'wall' : 'virtual') + ' time (' + achievedFramesPerSecond.toFixed(1) + ' per second' + (realtime ? '' : ', took ' + Math.round((Date.now() - recordingStarted) / 1000) + ' s') + ')');

  // --- ffmpeg: real durations through the concat demuxer, resampled to 30 fps ---
  const listLines = [];
  for (let index = 0; index < frameTimes.length; index += 1) {
    const nextTime = index + 1 < frameTimes.length ? frameTimes[index + 1] : recordSeconds;
    const duration = Math.max(0.01, nextTime - frameTimes[index]);
    listLines.push("file 'f" + String(index).padStart(4, '0') + ".jpg'");
    listLines.push('duration ' + duration.toFixed(4));
  }
  listLines.push("file 'f" + String(frameTimes.length - 1).padStart(4, '0') + ".jpg'");
  writeFileSync(path.join(framesDirectory, 'frames.txt'), listLines.join('\n') + '\n');
  const outputPath = path.join(motionDirectory, sketchId + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(framesDirectory, 'frames.txt'),
    '-vf', 'scale=' + OUTPUT_SIDE_PIXELS + ':' + OUTPUT_SIDE_PIXELS + ':flags=lanczos,fps=30,format=yuv420p',
    '-c:v', 'libx264', '-crf', '28', '-maxrate', '900k', '-bufsize', '1800k', '-preset', 'slow', '-movflags', '+faststart', '-an', outputPath], { stdio: 'inherit' });

  // --- the still: the frame nearest the asked moment ---
  let stillIndex = 0;
  for (let index = 0; index < frameTimes.length; index += 1) { if (frameTimes[index] <= stillSecond) { stillIndex = index; } }
  const stillPath = path.join(repositoryRoot, 'img', 'sketches', sketchId + '.jpg');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(framesDirectory, 'f' + String(stillIndex).padStart(4, '0') + '.jpg'),
    '-vf', 'scale=' + OUTPUT_SIDE_PIXELS + ':' + OUTPUT_SIDE_PIXELS + ':flags=lanczos', '-q:v', '4', stillPath], { stdio: 'inherit' });
  console.log('[record] wrote ' + path.relative(repositoryRoot, outputPath) + ' and ' + path.relative(repositoryRoot, stillPath));
  if (consoleErrors.length) { console.log('[record] page errors:\n' + consoleErrors.slice(0, 5).join('\n')); }
} finally {
  await send('Target.closeTarget', { targetId: targetId }).catch(function () {});
  browserSocket.close();
  if (!keepFrames) { rmSync(framesDirectory, { recursive: true, force: true }); }
  if (existsSync(path.join(repositoryRoot, 'tools', 'sketch-motion-frames')) && !keepFrames) {
    rmSync(path.join(repositoryRoot, 'tools', 'sketch-motion-frames'), { recursive: true, force: true });
  }
}
