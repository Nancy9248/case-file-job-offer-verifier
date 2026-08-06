import { useState } from 'react'
import { verifyCompany, VERIFIED_COMPANIES } from '../data/companies.js'

export default function Verify() {
  const [name, setName] = useState('')
  const [contactText, setContactText] = useState('')
  const [result, setResult] = useState(null)

  function handleCheck() {
    setResult(verifyCompany(name, contactText))
  }

  const statusStyles = {
    verified: 'text-emerald-700 border-emerald-700 bg-emerald-50',
    mismatch: 'text-red-700 border-red-700 bg-red-50',
    unverified: 'text-amber-600 border-amber-600 bg-amber-50',
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Company Verification Lookup</h2>
      <p className="text-sm text-slate-600 mb-6">
        Check a company name against our verified-employer reference list, and cross-check any recruiter
        email domain against that company's official domain.
      </p>

      <div className="bg-amber-100 border border-amber-300 p-6">
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Company name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Infosys"
            className="w-full border border-amber-300 bg-amber-50 px-3 py-2"
          />
        </div>
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
            Recruiter's email address or contact text (optional)
          </label>
          <input
            type="text"
            value={contactText}
            onChange={(e) => setContactText(e.target.value)}
            placeholder="e.g. hr@infosys-careers-team.com"
            className="w-full border border-amber-300 bg-amber-50 px-3 py-2"
          />
        </div>
        <button
          onClick={handleCheck}
          className="bg-slate-900 text-amber-50 text-xs uppercase tracking-wider px-6 py-3"
        >
          Check company
        </button>
      </div>

      {result && (
        <div className={`mt-6 border-2 p-5 ${statusStyles[result.status]}`}>
          <div className="text-xs uppercase tracking-wider font-bold mb-1">
            {result.status === 'verified' && 'Verified Match'}
            {result.status === 'mismatch' && 'Domain Mismatch — High Risk'}
            {result.status === 'unverified' && 'Not Found In Reference List'}
          </div>
          <div className="text-sm">{result.message}</div>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-xs uppercase tracking-wider text-slate-500 border-b border-amber-300 pb-2 mb-3">
          Reference list ({VERIFIED_COMPANIES.length} companies)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-slate-700">
          {VERIFIED_COMPANIES.map((c) => (
            <div key={c.name}>{c.name}</div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Production roadmap: replace this static list with live MCA/GST registry lookups for full national
          coverage.
        </p>
      </div>
    </div>
  )
}
