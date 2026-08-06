const TIPS = [
  { title: 'Upfront payment', body: "Any request to pay before you're hired — registration, training, or \"refundable\" deposits." },
  { title: 'Too good to be true', body: 'Offers that arrive with no interview, or salary far above market rate for the role.' },
  { title: 'Unofficial email domains', body: 'Recruiter emailing from a personal Gmail/Yahoo address instead of a company domain.' },
  { title: 'Urgency & pressure', body: 'Pressure to decide or pay within hours, "before the slot is gone."' },
  { title: 'Personal info requests', body: "Requests for Aadhaar, bank details, or OTPs before any formal onboarding paperwork." },
  { title: 'Off-platform communication', body: 'Scammers move you off official channels (e.g. straight to WhatsApp) to avoid detection.' },
]

export default function Awareness() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Know the Red Flags</h2>
      <p className="text-sm text-slate-600 mb-6">
        Learning to spot these yourself is the best long-term protection — the scanner is a backup, not a
        substitute.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TIPS.map((t) => (
          <div key={t.title} className="border border-amber-300 bg-amber-100 p-4">
            <div className="flex gap-2 mb-1">
              <span className="text-red-700 font-semibold">✕</span>
              <span className="font-semibold text-sm text-slate-900">{t.title}</span>
            </div>
            <p className="text-sm text-slate-600">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
