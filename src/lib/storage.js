import { firebaseEnabled, saveScan, saveReport, subscribeToUserHistory, subscribeToReports } from './firebase.js'

const LOCAL_HISTORY_KEY = 'offerReviewHistory'
const LOCAL_REPORTS_KEY = 'communityReports'

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable — fail silently, app still works this session
  }
}

// --- Scan history -----------------------------------------------------

export async function recordScan(uid, entry) {
  if (firebaseEnabled && uid) {
    await saveScan({ uid, ...entry })
    return
  }
  const history = readLocal(LOCAL_HISTORY_KEY, [])
  const updated = [{ id: Date.now(), ...entry }, ...history].slice(0, 20)
  writeLocal(LOCAL_HISTORY_KEY, updated)
}

// Subscribes to history updates. Returns an unsubscribe function.
// In local mode, calls back once immediately (no live updates needed).
export function watchHistory(uid, callback) {
  if (firebaseEnabled && uid) {
    return subscribeToUserHistory(uid, callback)
  }
  callback(readLocal(LOCAL_HISTORY_KEY, []))
  return () => {}
}

// --- Community reports --------------------------------------------------

export async function recordReport(uid, report) {
  if (firebaseEnabled) {
    await saveReport({ uid, ...report })
    return
  }
  const reports = readLocal(LOCAL_REPORTS_KEY, [])
  const updated = [{ id: Date.now(), ...report }, ...reports].slice(0, 100)
  writeLocal(LOCAL_REPORTS_KEY, updated)
}

export function watchReports(callback) {
  if (firebaseEnabled) {
    return subscribeToReports(callback)
  }
  callback(readLocal(LOCAL_REPORTS_KEY, []))
  return () => {}
}

export function localReportCount() {
  const reports = readLocal(LOCAL_REPORTS_KEY, [])
  return reports.length
}
