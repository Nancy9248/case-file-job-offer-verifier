// Reference dataset of verified employers with their official domains.
// In production this would be backed by a live MCA/GST registry API;
// for the prototype, this curated list lets us demonstrate real
// domain cross-verification instead of a plain name match.

export const VERIFIED_COMPANIES = [
  { name: 'Google', aliases: ['google', 'google india'], domain: 'google.com' },
  { name: 'Microsoft', aliases: ['microsoft'], domain: 'microsoft.com' },
  { name: 'Infosys', aliases: ['infosys'], domain: 'infosys.com' },
  { name: 'Tata Consultancy Services', aliases: ['tcs', 'tata consultancy'], domain: 'tcs.com' },
  { name: 'Wipro', aliases: ['wipro'], domain: 'wipro.com' },
  { name: 'Accenture', aliases: ['accenture'], domain: 'accenture.com' },
  { name: 'Amazon', aliases: ['amazon'], domain: 'amazon.com' },
  { name: 'HCLTech', aliases: ['hcl', 'hcltech'], domain: 'hcltech.com' },
  { name: 'Cognizant', aliases: ['cognizant'], domain: 'cognizant.com' },
  { name: 'IBM', aliases: ['ibm'], domain: 'ibm.com' },
  { name: 'Capgemini', aliases: ['capgemini'], domain: 'capgemini.com' },
  { name: 'Tech Mahindra', aliases: ['tech mahindra'], domain: 'techmahindra.com' },
  { name: 'Deloitte', aliases: ['deloitte'], domain: 'deloitte.com' },
  { name: 'EY', aliases: ['ey', 'ernst & young'], domain: 'ey.com' },
  { name: 'KPMG', aliases: ['kpmg'], domain: 'kpmg.com' },
  { name: 'PwC', aliases: ['pwc', 'pricewaterhousecoopers'], domain: 'pwc.com' },
  { name: 'Flipkart', aliases: ['flipkart'], domain: 'flipkart.com' },
  { name: 'Zomato', aliases: ['zomato'], domain: 'zomato.com' },
  { name: 'Swiggy', aliases: ['swiggy'], domain: 'swiggy.com' },
  { name: 'Paytm', aliases: ['paytm'], domain: 'paytm.com' },
  { name: 'JSW Group', aliases: ['jsw'], domain: 'jsw.in' },
  { name: 'Reliance Industries', aliases: ['reliance'], domain: 'ril.com' },
  { name: 'Larsen & Toubro', aliases: ['l&t', 'larsen and toubro'], domain: 'larsentoubro.com' },
  { name: 'Adobe', aliases: ['adobe'], domain: 'adobe.com' },
  { name: 'Oracle', aliases: ['oracle'], domain: 'oracle.com' },
  { name: 'SAP', aliases: ['sap'], domain: 'sap.com' },
  { name: 'Salesforce', aliases: ['salesforce'], domain: 'salesforce.com' },
  { name: 'Meta', aliases: ['meta', 'facebook'], domain: 'meta.com' },
  { name: 'Netflix', aliases: ['netflix'], domain: 'netflix.com' },
  { name: 'Zoho', aliases: ['zoho'], domain: 'zoho.com' },
]

// Given free-text (offer body) and an optional declared company name,
// try to identify a verified match and check whether any email/domain
// mentioned in the text actually belongs to that company.
export function verifyCompany(declaredName, text) {
  const nameLower = (declaredName || '').toLowerCase().trim()
  const textLower = (text || '').toLowerCase()

  const match = VERIFIED_COMPANIES.find((c) =>
    c.aliases.some((a) => nameLower.includes(a) || textLower.includes(a))
  )

  if (!match) {
    return {
      status: 'unverified',
      message: declaredName
        ? "Company name isn't in our verified-employer reference list — treat as unverified until independently checked."
        : 'No company name provided to verify.',
    }
  }

  // Look for any email domain mentioned in the text
  const emailMatch = textLower.match(/@([a-z0-9.-]+\.[a-z]{2,})/)
  const mentionedDomain = emailMatch ? emailMatch[1] : null

  if (mentionedDomain && !mentionedDomain.endsWith(match.domain)) {
    return {
      status: 'mismatch',
      company: match.name,
      message: `Recruiter is using "${match.name}" as the company name, but the contact email domain (${mentionedDomain}) does not match ${match.name}'s official domain (${match.domain}). This is a strong impersonation signal.`,
    }
  }

  return {
    status: 'verified',
    company: match.name,
    message: `Company name matches a known, verifiable employer (${match.name}, official domain: ${match.domain}).`,
  }
}
