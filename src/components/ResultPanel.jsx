export default function ResultPanel({ result, onReport, reported, reportCount }) {
  if (!result) return null
  return (
    <div className="mt-8 border border-amber-300 bg-amber-100">
      <div className="p-6 flex flex-col items-center">
        <div
          className={`inline-block border-4 border-double px-6 py-3 font-bold text-2xl uppercase ${result.verdictColor}`}
        >
          {result.verdict}
        </div>
        <div className="text-xs text-slate-500 mt-3 tracking-wider uppercase">
          Risk score: {result.score} / 100
        </div>

        {onReport && (
          <>
            <button
              onClick={onReport}
              disabled={reported}
              className={`mt-4 text-xs uppercase tracking-wider px-4 py-2 border ${
                reported
                  ? 'border-slate-300 text-slate-400'
                  : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-amber-50'
              }`}
            >
              {reported ? 'Reported — thank you' : 'Report this as a scam'}
            </button>
            <div className="text-xs text-slate-500 mt-2">
              {reportCount} community reports so far
            </div>
          </>
        )}
      </div>

      <div className="px-6 pb-6">
        {result.flags.length > 0 && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2 mt-4">Flags raised</h3>
            {result.flags.map((f) => (
              <div key={f.id} className="flex gap-2 py-2 border-b border-dashed border-amber-300 text-sm">
                <span className="text-red-700 font-semibold">✕</span>
                <span>{f.label}</span>
              </div>
            ))}
          </>
        )}
        {result.clears.length > 0 && (
          <>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2 mt-4">Checks passed</h3>
            {result.clears.map((c, i) => (
              <div key={i} className="flex gap-2 py-2 border-b border-dashed border-amber-300 text-sm">
                <span className="text-emerald-700 font-semibold">✓</span>
                <span>{c}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
