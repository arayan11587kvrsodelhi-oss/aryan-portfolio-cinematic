// Probe: which scroll mechanism actually moves the page under Lenis?
import { spawn } from 'node:child_process'
import path from 'node:path'
import http from 'node:http'

const CHROME = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1228', 'chrome-win64', 'chrome.exe')
const PORT = 9224
const BASE = 'http://localhost:5198'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let ws, msgId = 0
const pending = new Map()
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++msgId
  pending.set(id, { resolve, reject })
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  setTimeout(() => { if (pending.has(id)) { pending.delete(id); reject(new Error('timeout ' + method)) } }, 20000)
})
const onMessage = (raw) => {
  const msg = JSON.parse(raw)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
  }
}
const getJson = (url) => new Promise((res, rej) => http.get(url, (r) => { let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d))) }).on('error', rej))
const evalJs = async (expression, sessionId) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId)).result?.value

const main = async () => {
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--disable-gpu', '--no-first-run', 'about:blank'], { stdio: 'ignore' })
  let version
  for (let i = 0; i < 40; i++) { try { version = await getJson(`http://127.0.0.1:${PORT}/json/version`); break } catch { await sleep(500) } }
  ws = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  ws.onmessage = (e) => onMessage(e.data)
  const { targetId } = await send('Target.createTarget', { url: BASE })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  await send('Runtime.enable', {}, sessionId)
  await send('Page.enable', {}, sessionId)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId)
  await sleep(4500)

  const sy = () => evalJs('window.scrollY', sessionId)

  console.log('y0 =', await sy())

  // (a) direct scrollTo
  await evalJs('window.scrollTo(0, 3000)', sessionId)
  await sleep(100)
  console.log('after scrollTo(0,3000) +100ms y =', await sy())
  await sleep(900)
  console.log('after scrollTo(0,3000) +1000ms y =', await sy())

  // (b) lenis scrollTo via module singleton exposure? not exposed. Try native scrollBy repeatedly
  await evalJs('for(let i=0;i<20;i++) window.scrollBy(0, 500)', sessionId)
  await sleep(100)
  console.log('after scrollBy x20 y =', await sy())

  // (c) CDP wheel
  for (let i = 0; i < 8; i++) {
    await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 720, y: 450, deltaX: 0, deltaY: 1000 }, sessionId)
    await sleep(80)
  }
  await sleep(1200)
  console.log('after CDP wheel x8 (8000px) y =', await sy())

  // (d) synthesizeScrollGesture
  await send('Input.synthesizeScrollGesture', { x: 720, y: 450, xDistance: 0, yDistance: -3000, speed: 2000 }, sessionId)
  await sleep(2000)
  console.log('after synthesizeScrollGesture(-3000) y =', await sy())

  chrome.kill()
  process.exit(0)
}
main().catch((e) => { console.error('PROBE FAILED', e); process.exit(1) })
