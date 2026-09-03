// CDP interaction verifier for the cinematic portfolio
// Usage: node scrn/verify.mjs   (expects dev server on :5198)
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'

const CHROME = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1228', 'chrome-win64', 'chrome.exe')
const PORT = 9223
const BASE = 'http://localhost:5198'
const OUT = path.join(import.meta.dirname, 'shots')
fs.mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const report = []
const log = (s) => { report.push(s); console.log(s) }
const consoleMsgs = []

let ws, msgId = 0
const pending = new Map()
const eventWaiters = []

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++msgId
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); reject(new Error('CDP timeout: ' + method)) }
    }, 30000)
  })
}

function onMessage(raw) {
  const msg = JSON.parse(raw)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    if (msg.error) reject(new Error(msg.error.message))
    else resolve(msg.result)
    return
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const entry = { type: msg.params.type, text: msg.params.args?.map(a => a.value ?? a.description ?? '').join(' ') }
    if (entry.type === 'error' || entry.type === 'warning' || entry.type === 'assert') consoleMsgs.push(entry)
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleMsgs.push({ type: 'exception', text: msg.params.exceptionDetails?.text + ' ' + (msg.params.exceptionDetails?.exception?.description ?? '') })
  }
  for (let i = eventWaiters.length - 1; i >= 0; i--) {
    const w = eventWaiters[i]
    if (w.method === msg.method) { eventWaiters.splice(i, 1); w.resolve(msg) }
  }
}

function waitForEvent(method, timeout = 20000) {
  return new Promise((resolve, reject) => {
    eventWaiters.push({ method, resolve })
    setTimeout(() => reject(new Error('event timeout: ' + method)), timeout)
  })
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => { try { resolve(JSON.parse(data)) } catch (e) { reject(e) } })
    }).on('error', reject)
  })
}

async function evalJs(expression, sessionId) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId)
  if (r.exceptionDetails) throw new Error('eval failed: ' + JSON.stringify(r.exceptionDetails).slice(0, 400))
  return r.result?.value
}

async function shot(sessionId, name) {
  const r = await send('Page.captureScreenshot', { format: 'png' }, sessionId)
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.data, 'base64'))
  log(`[shot] ${name}.png`)
}

async function scrollStep(sessionId, px) {
  await evalJs(`window.scrollBy(0, ${px})`, sessionId)
  await sleep(1200) // let ScrollTrigger scrub (1s) settle
}

const main = async () => {
  log('== launching headless chrome ==')
  const chrome = spawn(CHROME, [
    '--headless=new', '--remote-debugging-port=' + PORT,
    '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' })

  let version
  for (let i = 0; i < 40; i++) {
    try { version = await getJson(`http://127.0.0.1:${PORT}/json/version`); break } catch { await sleep(500) }
  }
  if (!version) throw new Error('chrome devtools never came up')

  ws = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
  ws.onmessage = (e) => onMessage(e.data)

  const { targetId } = await send('Target.createTarget', { url: BASE })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  await send('Runtime.enable', {}, sessionId)
  await send('Page.enable', {}, sessionId)
  // this headless environment reports prefers-reduced-motion: reduce by default
  // (OS-level setting); emulate no-preference so the real desktop experience runs
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] }, sessionId)
  await send('Page.reload', {}, sessionId)
  await sleep(1500)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId)
  await sleep(4500) // initial load + fonts + images
  log('== page loaded, desktop 1440x900 ==')

  /* ---------------- PROJECTS: scroll-driven slider ---------------- */
  await evalJs(`window.scrollTo(0, 0)`, sessionId)
  await sleep(400)
  const workTop = await evalJs(
    `Math.round(document.querySelector('#work .work-scroll-stage').getBoundingClientRect().top + window.scrollY)`,
    sessionId
  )
  log(`[work] pin starts at scrollY=${workTop}`)
  await evalJs(`window.scrollTo(0, ${workTop + 2})`, sessionId)
  await sleep(2500) // let pin engage + scrub settle

  const readWork = () => evalJs(`(() => {
    const t = document.querySelector('#work .work-track')
    const m = new DOMMatrixReadOnly(getComputedStyle(t).transform === 'none' ? 'matrix(1,0,0,1,0,0)' : getComputedStyle(t).transform)
    const c = document.querySelector('#work .work-chrome-count')?.textContent?.trim() ?? ''
    return JSON.stringify({ x: Math.round(m.e), counter: c, y: Math.round(window.scrollY) })
  })()`, sessionId)

  let first = JSON.parse(await readWork())
  log(`[work] start -> ${JSON.stringify(first)}`)
  await shot(sessionId, 'work-01')

  // scroll through the whole pinned range in batches
  const seenCounters = new Set()
  let last = first
  for (let batch = 0; batch < 24; batch++) {
    await scrollStep(sessionId, 2200)
    const s = JSON.parse(await readWork())
    if (!seenCounters.has(s.counter)) {
      seenCounters.add(s.counter)
      log(`[work] new counter -> x=${s.x} counter=${s.counter}`)
      if (s.counter.startsWith('05')) await shot(sessionId, 'work-05')
      if (s.counter.startsWith('08')) await shot(sessionId, 'work-08')
      if (s.counter.startsWith('12')) await shot(sessionId, 'work-12')
    }
    last = s
    if (s.counter.includes('15 / 15')) break
  }
  await sleep(1200)
  last = JSON.parse(await readWork())
  log(`[work] final -> ${JSON.stringify(last)}`)
  await shot(sessionId, 'work-end')

  // release check: after 15/15 the section must let the page scroll on
  const yBeforeRelease = await evalJs('window.scrollY', sessionId)
  await scrollStep(sessionId, 1500)
  const yAfterRelease = await evalJs('window.scrollY', sessionId)
  const workReleased = yAfterRelease > yBeforeRelease + 1000
  log(`[work] release: y ${yBeforeRelease} -> ${yAfterRelease} RELEASED=${workReleased}`)

  const workXMoved = last.x < first.x - 1000
  const workReached15 = last.counter.includes('15 / 15')
  log(`[work] MOVED=${workXMoved} REACHED_15_15=${workReached15}`)

  /* ---------------- CERTIFICATES: scroll-driven slider ---------------- */
  // continue scrolling; the certificates stage pins after the projects stage
  const certSeen = new Set()
  let certCounter = '01 / 07'
  for (let b = 0; b < 20; b++) {
    await scrollStep(sessionId, 2200)
    certCounter = await evalJs(
      `document.querySelector('#certifications .work-chrome-count')?.textContent?.trim() ?? ''`,
      sessionId
    )
    if (!certSeen.has(certCounter)) {
      certSeen.add(certCounter)
      log(`[cert] new counter -> ${certCounter}`)
      if (certCounter.startsWith('04')) await shot(sessionId, 'cert-04')
    }
    if (certCounter.includes('07 / 07')) break
  }
  await sleep(1200)
  const certFinal = await evalJs(`(() => {
    const t = document.querySelector('#certifications .cert-track')
    const m = new DOMMatrixReadOnly(getComputedStyle(t).transform === 'none' ? 'matrix(1,0,0,1,0,0)' : getComputedStyle(t).transform)
    const c = document.querySelector('#certifications .work-chrome-count')?.textContent?.trim() ?? ''
    return JSON.stringify({ x: Math.round(m.e), counter: c })
  })()`, sessionId)
  log(`[cert] final -> ${certFinal}`)
  await shot(sessionId, 'cert-end')

  // release check for certificates
  const cyBefore = await evalJs('window.scrollY', sessionId)
  await scrollStep(sessionId, 1500)
  const cyAfter = await evalJs('window.scrollY', sessionId)
  const certReleased = cyAfter > cyBefore + 1000
  log(`[cert] release: y ${cyBefore} -> ${cyAfter} RELEASED=${certReleased}`)


  /* ---------------- SKILLS + EDUCATION screenshots ---------------- */
  await evalJs(`document.querySelector('#skills')?.scrollIntoView()`, sessionId)
  await sleep(1800)
  await shot(sessionId, 'skills')

  await evalJs(`document.querySelector('#experience')?.scrollIntoView()`, sessionId)
  await sleep(1800)
  await shot(sessionId, 'experience')

  /* ---------------- MOBILE 390x844 ---------------- */
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sessionId)
  await sleep(2500)
  // force ScrollTrigger to recalc after resize
  await evalJs(`window.ScrollTrigger?.refresh?.(); window.scrollTo(0,0)`, sessionId)
  await sleep(1500)

  const mobileChecks = JSON.parse(await evalJs(`(() => {
    const doc = document.documentElement
    const overflowX = doc.scrollWidth - window.innerWidth
    const mobileWork = !!document.querySelector('#work .work-stage') && getComputedStyle(document.querySelector('#work .work-stage')).display !== 'none'
    const thumbs = document.querySelectorAll('#work .work-thumb').length
    const certTrack = document.querySelector('#certifications .cert-mobile-track')
    const certScrollable = certTrack ? certTrack.scrollWidth > certTrack.clientWidth : false
    const certPanels = document.querySelectorAll('#certifications .cert-mobile-panel').length
    const workCounter = document.querySelector('#work')?.querySelector('.font-mono')?.textContent?.trim() ?? ''
    return JSON.stringify({ overflowX, mobileWork, thumbs, certScrollable, certPanels, workCounter })
  })()`, sessionId))
  log('[mobile] ' + JSON.stringify(mobileChecks))
  await shot(sessionId, 'mobile-hero')

  // mobile certificate next/prev nav
  await evalJs(`document.querySelector('#certifications')?.scrollIntoView()`, sessionId)
  await sleep(1500)
  await shot(sessionId, 'mobile-certs')
  await evalJs(`document.querySelectorAll('#certifications .cert-nav-btn')[1]?.click()`, sessionId)
  await sleep(1200)
  const mCounter = await evalJs(
    `Array.from(document.querySelectorAll('#certifications .font-mono')).map(e => e.textContent.trim()).find(t => /\\d\\d \\/ 07/.test(t)) ?? 'NOT_FOUND'`,
    sessionId
  )
  log(`[mobile] cert counter after next -> ${mCounter}`)
  await evalJs(`document.querySelector('#work')?.scrollIntoView()`, sessionId)
  await sleep(1500)
  await shot(sessionId, 'mobile-work')

  /* ---------------- REDUCED-MOTION FALLBACK (desktop viewport) ---------------- */
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId)
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId)
  await send('Page.reload', {}, sessionId)
  await sleep(4500)
  const rm = JSON.parse(await evalJs(`(() => {
    const stage = document.querySelector('#work .work-scroll-stage')
    const mobile = document.querySelector('#work .work-stage')
    const certStage = document.querySelector('#certifications .cert-stage')
    return JSON.stringify({
      stageDisplay: stage ? getComputedStyle(stage).display : 'missing',
      mobileVisible: mobile ? getComputedStyle(mobile).display !== 'none' : false,
      certStageDisplay: certStage ? getComputedStyle(certStage).display : 'missing',
      pins: document.querySelectorAll('.pin-spacer').length,
    })
  })()`, sessionId))
  log('[reduced] ' + JSON.stringify(rm))
  const reducedOk = rm.stageDisplay === 'none' && rm.mobileVisible && rm.certStageDisplay === 'none' && rm.pins === 0
  log(`REDUCED_FALLBACK_OK=${reducedOk}`)
  await shot(sessionId, 'reduced-desktop')

  /* ---------------- CONSOLE REPORT ---------------- */
  log('== console messages (error/warning/exception) ==')
  if (consoleMsgs.length === 0) log('NONE')
  for (const m of consoleMsgs) log(`  [${m.type}] ${String(m.text).slice(0, 220)}`)

  log('== SUMMARY ==')
  log(`PROJECTS_MOVED=${workXMoved}`)
  log(`PROJECTS_15_15=${workReached15}`)
  log(`PROJECTS_RELEASED=${workReleased}`)
  log(`CERTS_FINAL=${certFinal}`)
  log(`CERTS_RELEASED=${certReleased}`)
  log(`MOBILE_OVERFLOW_X=${mobileChecks.overflowX}`)
  log(`MOBILE_WORK_OK=${mobileChecks.mobileWork && mobileChecks.thumbs === 15}`)
  log(`MOBILE_CERTS_OK=${mobileChecks.certScrollable && mobileChecks.certPanels === 7}`)
  log(`MOBILE_CERT_NEXT=${mCounter}`)
  log(`CONSOLE_ISSUES=${consoleMsgs.length}`)

  fs.writeFileSync(path.join(OUT, 'verify-report.txt'), report.join('\n'))
  chrome.kill()
  process.exit(0)
}

main().catch((e) => {
  console.error('VERIFY FAILED:', e)
  try { fs.writeFileSync(path.join(OUT, 'verify-report.txt'), report.join('\n') + '\nFAILED: ' + e.message) } catch {}
  process.exit(1)
})

