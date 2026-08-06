import { useEffect, useState } from 'react'
import { analyzeOffer } from '../lib/scoring.js'
import { recordScan, recordReport, watchReports, localReportCount } from '../lib/storage.js'
import { firebaseEnabled } from '../lib/firebase.js'
import ResultPanel from '../components/ResultPanel.jsx'

export default function Scan({ uid }) {
  const [company, setCompany] = useState('')
  const [offerText, setOfferText] = useState('')
  const [result, setResult] = useState(null)
  const [reported, setReported] = useState(false)
  const [reportCount, setReportCount] = useState(firebaseEnabled ? 0 : localReportCount() + 47)

  useEffect(() => {
    const unsub = watchReports((reports) => {
      if (firebaseEnabled) setReportCount(reports.length + 47) // +47 simulated baseline for demo
    })
    return unsub
  }, [])

  async function handleSubmit() {
    if (!offerText.trim()) return
    const analysis = analyzeOffer(company, offerText)
    setResult(analysis)
    setReported(false)

    await recordScan(uid, {
      company: company.trim() || null,
      label: (company.trim() || offerText.slice(0, 40)).slice(0, 40),
      snippet: offerText.slice(0, 160),
      score: analysis.score,
      verdict: analysis.verdict,
      verdictColor: analysis.verdictColor,
    })
  }

  async function handleReport() {
    if (reported || !result) return
    setReported(true)
    setReportCount((c) => c + 1)
    await recordReport(uid, {
      company: company.trim() || 'Unknown',
      snippet: offerText.slice(0, 200),
      score: result.score,
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {!firebaseEnabled && (
        <div className="mb-6 text-xs bg-amber-200 border border-amber-400 text-amber-900 px-4 py-2">
          Running in local mode — Firebase isn't configured yet, so history and reports are saved to this
          browser only. See FIREBASE_SETUP.md to enable shared, cross-device data.
        </div>
      )}

      <div className="bg-amber-100 border border-amber-300 p-6">
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
            Company / recruiter name (optional)
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Bright Path Solutions"
            className="w-full border border-amber-300 bg-amber-50 px-3 py-2"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
            Job offer, email, or message text
          </label>
          <textarea
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
            placeholder="Paste the full message here..."
            rows={6}
            className="w-full border border-amber-300 bg-amber-50 px-3 py-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-slate-900 text-amber-50 text-xs uppercase tracking-wider px-6 py-3"
        >
          Submit for review
        </button>
      </div>

      <ResultPanel
        result={result}
        onReport={handleReport}
        reported={reported}
        reportCount={reportCount}
      />
    </div>
  )
}
