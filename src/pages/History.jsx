import { useEffect, useState } from 'react'
import { watchHistory } from '../lib/storage.js'

export default function History({ uid }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const unsub = watchHistory(uid, setHistory)
    return unsub
  }, [uid])

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-lg font-bold text-slate-900 mb-1">My Case History</h2>
      <p className="text-sm text-slate-600 mb-6">Every offer you've submitted for review.</p>

      {history.length === 0 ? (
        <div className="border border-amber-300 bg-amber-100 p-6 text-sm text-slate-600">
          No cases reviewed yet — head to "Scan an Offer" to check your first one.
        </div>
      ) : (
        <div className="border border-amber-300 bg-amber-100 divide-y divide-dashed divide-amber-300">
          {history.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 text-sm">
              <span className="text-slate-700 truncate max-w-[60%]">{item.label}</span>
              <span className={`text-xs uppercase tracking-wider font-semibold ${item.verdictColor}`}>
                {item.verdict}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
