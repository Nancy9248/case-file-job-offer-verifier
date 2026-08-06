import { verifyCompany } from '../data/companies.js'

const RULES = [
  {
    id: 'upfront_fee',
    test: /(registration|processing|refundable|security)\s+fee|pay\s+(inr|rs\.?|₹)|deposit\s+(of|before)/i,
    label: "Requests an upfront payment or deposit before you're hired — legitimate employers never charge candidates to be hired.",
    weight: 30,
  },
  {
    id: 'urgency',
    test: /(act now|hurry|limited (time|slots|seats)|offer expires|within 24 hours|immediately transfer|urgent(ly)?)/i,
    label: 'Uses urgency language to rush a decision before you can verify the offer.',
    weight: 15,
  },
  {
    id: 'personal_info',
    test: /(aadhar|aadhaar|bank (details|account)|otp|debit card|credit card|cvv|pan card)/i,
    label: 'Asks for sensitive personal or financial details by email/message.',
    weight: 25,
  },
  {
    id: 'salary_anomaly',
    test: /(guaranteed|no experience needed|work from home).{0,40}(₹|rs\.?|inr)\s?\d{2,3},?\d{3}/i,
    label: 'Promises an unusually high salary for little or no experience.',
    weight: 20,
  },
  {
    id: 'free_email',
    test: /@(gmail|yahoo|outlook|hotmail)\.com/i,
    label: 'Recruiter is contacting from a free personal email, not a company domain.',
    weight: 15,
  },
  {
    id: 'link_pressure',
    test: /(congratulations|selected|shortlisted).{0,60}(click here|link below|verify your account)/i,
    label: "Combines a 'you've been selected' message with a link — check the destination before clicking.",
    weight: 10,
  },
  {
    id: 'vague_role',
    test: /(data entry|copy paste|form filling|typing job).{0,40}(₹|rs\.?|inr)/i,
    label: 'Advertises a vague, low-skill task with a disproportionately high payout — a common scam template.',
    weight: 15,
  },
]

export function analyzeOffer(company, text) {
  let score = 0
  const flags = []
  const clears = []

  RULES.forEach((r) => {
    if (r.test.test(text)) {
      score += r.weight
      flags.push({ id: r.id, label: r.label })
    }
  })

  const verification = verifyCompany(company, text)
  if (verification.status === 'mismatch') {
    score += 35
    flags.push({ id: 'domain_mismatch', label: verification.message })
  } else if (verification.status === 'unverified' && company.trim()) {
    score += 10
    flags.push({ id: 'unverified_company', label: verification.message })
  } else if (verification.status === 'verified') {
    clears.push(verification.message)
  }

  if (flags.length === 0) {
    clears.push('No known scam patterns detected in the message text.')
  }

  score = Math.min(score, 100)

  let verdict, verdictColor, verdictKey
  if (score >= 45) {
    verdict = 'Scam Alert'
    verdictColor = 'text-red-700 border-red-700'
    verdictKey = 'danger'
  } else if (score >= 20) {
    verdict = 'Caution'
    verdictColor = 'text-amber-600 border-amber-600'
    verdictKey = 'caution'
  } else {
    verdict = 'Looks Clear'
    verdictColor = 'text-emerald-700 border-emerald-700'
    verdictKey = 'clear'
  }

  return { score, verdict, verdictColor, verdictKey, flags, clears, verification }
}
