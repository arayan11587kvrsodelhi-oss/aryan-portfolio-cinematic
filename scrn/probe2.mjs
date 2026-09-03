// Probe 2: why are pin spacers missing?
import { spawn } from 'node:child_process'
import path from 'node:path'
import http from 'node:http'

const CHROME = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1228', 'chrome-win64', 'chrome.exe')
const PORT = 9225
const BASE = 'http://localhost:5198'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let ws, msgId = 0
const pending = new Map()
const consoleMsgs = []
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
    return
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    consoleMsgs.push(msg.params.type + ': ' + msg.params.args?.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 300))
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleMsgs.push('exception: ' + (msg.params.exceptionDetails?.exception?.description ?? msg.params.exceptionDetails?.text ?? '').slice(0, 500))
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
  await sleep(5000)

  const info = await evalJs(`(() => {
    const stage = document.querySelector('#work .work-scroll-stage')
    const track = document.querySelector('#work .work-track')
    const cs = stage ? getComputedStyle(stage) : null
    const ct = track ? getComputedStyle(track) : null
    return JSON.stringify({
      innerW: window.innerWidth,
      innerH: window.innerHeight,
      mqDesktop: window.matchMedia('(min-width: 1024px)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      stageExists: !!stage,
      stageDisplay: cs?.display,
      stageW: stage?.offsetWidth,
      stageH: stage?.offsetHeight,
      trackExists: !!track,
      trackChildren: track?.children.length,
      trackScrollW: track?.scrollWidth,
      trackComputedWidth: ct?.width,
      trackComputedDisplay: ct?.display,
      slide0W: track?.children[0]?.offsetWidth,
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      docScrollH: document.documentElement.scrollHeight,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    })
  })()`, sessionId)
  console.log('DESKTOP INFO: ' + info)
  console.log('CONSOLE MSGS: ' + (consoleMsgs.length ? '\n  ' + consoleMsgs.join('\n  ') : 'NONE'))

  chrome.kill()
  process.exit(0)
}
main().catch((e) => { console.error('PROBE2 FAILED', e); process.exit(1) })
