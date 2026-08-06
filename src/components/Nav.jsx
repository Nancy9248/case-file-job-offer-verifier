import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Scan an Offer', end: true },
  { to: '/verify', label: 'Company Lookup' },
  { to: '/community', label: 'Community Reports' },
  { to: '/awareness', label: 'Red Flags' },
  { to: '/history', label: 'My History' },
]

export default function Nav() {
  return (
    <header className="border-b-2 border-slate-900 bg-amber-50">
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-3">
        <div className="flex justify-between items-baseline mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Case File</h1>
          <span className="text-xs uppercase tracking-widest text-slate-500">Offer Verification Desk</span>
        </div>
        <nav className="flex flex-wrap gap-1 -mb-px">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider px-3 py-2 border-b-2 ${
                  isActive
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
