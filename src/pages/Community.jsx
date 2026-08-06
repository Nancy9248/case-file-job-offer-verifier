import { useEffect, useState } from 'react'
import { watchReports } from '../lib/storage.js'
import { firebaseEnabled } from '../lib/firebase.js'

export default function Community() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    const unsub = watchReports(setReports)
    return unsub
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Community Reports</h2>
      <p className="text-sm text-slate-600 mb-6">
        Offers other job seekers have flagged as scams
        {firebaseEnabled ? ' — shared live across everyone using this app.' : ' (local mode: only this browser\'s reports shown).'}
      </p>

      {reports.length === 0 ? (
        <div className="border border-amber-300 bg-amber-100 p-6 text-sm text-slate-600">
          No reports yet. Once someone reports a scam from the scan page, it'll show up here.
        </div>
      ) : (
        <div className="border border-amber-300 bg-amber-100 divide-y divide-dashed divide-amber-300">
          {reports.map((r) => (
            <div key={r.id} className="p-4">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm text-slate-900">{r.company || 'Unknown company'}</span>
                <span className="text-xs text-red-700 uppercase tracking-wider">Risk {r.score}/100</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{r.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
