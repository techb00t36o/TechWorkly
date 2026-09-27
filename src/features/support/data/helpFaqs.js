// FAQ seed content for the Help/Support Center (Help_Support_Center.docx §3).
export const faqCategories = [
  { slug: 'getting-started', label: 'Getting Started' },
  { slug: 'workers', label: 'For Workers' },
  { slug: 'companies', label: 'For Companies' },
  { slug: 'payments', label: 'Payments & Escrow' },
  { slug: 'teams', label: 'Team-Based Hiring' },
  { slug: 'trust', label: 'Trust & Safety' },
  { slug: 'account', label: 'Account & Settings' },
]

export const popularTopics = [
  { slug: 'how-escrow-works', title: 'How does escrow work?' },
  { slug: 'withdraw-funds', title: 'How do I withdraw funds?' },
  { slug: 'become-verified', title: 'How do I become verified?' },
  { slug: 'raise-dispute', title: 'How do I raise a dispute?' },
]

export const articles = [
  {
    slug: 'how-escrow-works',
    title: 'How does escrow work?',
    category: 'payments',
    body: 'When a company funds a contract, payment is held in escrow until milestones are approved. Workers submit work; companies approve and release funds per milestone. If there is a disagreement, either party can open a dispute from the contract page.',
    related: ['withdraw-funds', 'raise-dispute'],
  },
  {
    slug: 'withdraw-funds',
    title: 'How do I withdraw funds?',
    category: 'payments',
    body: 'Open Earnings in your worker dashboard, review your available balance, and choose Withdraw. Payouts typically settle in 1–3 business days depending on your payout method. Pending releases from escrow appear under Transactions.',
    related: ['how-escrow-works', 'become-verified'],
  },
  {
    slug: 'become-verified',
    title: 'How do I become verified?',
    category: 'trust',
    body: 'Complete identity verification (government ID), skill verification (tests or portfolio review), and for companies, funds verification. Submissions enter a review queue; you will be notified when approved or if more information is needed.',
    related: ['account-security', 'raise-dispute'],
  },
  {
    slug: 'raise-dispute',
    title: 'How do I raise a dispute?',
    category: 'trust',
    body: 'From the contract page, choose Open Dispute. Select a category, describe the issue, attach evidence, and reference milestones if relevant. The other party has a window to respond. If you cannot agree, either side can escalate to admin review.',
    related: ['how-escrow-works', 'report-problem'],
  },
  {
    slug: 'post-first-job',
    title: 'How do I post my first job?',
    category: 'companies',
    body: 'From the company dashboard, select Post a Job. Fill in the title, description, budget, and skills. After publishing, applicants appear under My Jobs → Applicants. Accepting an offer creates a unified contract with escrow.',
    related: ['fund-escrow', 'hire-team'],
  },
  {
    slug: 'fund-escrow',
    title: 'How do I fund escrow for a contract?',
    category: 'companies',
    body: 'After accepting an offer, open the contract and fund escrow from the Escrow panel. Funds must be available in your company wallet. Work submission and milestone releases only proceed after escrow is funded.',
    related: ['how-escrow-works', 'post-first-job'],
  },
  {
    slug: 'hire-team',
    title: 'How does team-based hiring work?',
    category: 'teams',
    body: 'Create a team, define roles, and publish a team listing. Applicants review per role. When roles are filled, escrow funds the team engagement. Milestones and reviews work the same as individual contracts.',
    related: ['post-first-job', 'how-escrow-works'],
  },
  {
    slug: 'apply-jobs',
    title: 'How do I apply to jobs?',
    category: 'workers',
    body: 'Browse jobs, open a listing, and submit a proposal with your rate and message. You can track applications in your dashboard. If hired, you will receive an offer to accept on the contract page.',
    related: ['withdraw-funds', 'become-verified'],
  },
  {
    slug: 'account-security',
    title: 'How do I secure my account?',
    category: 'account',
    body: 'Use a unique password, complete verification, and never share passwords or one-time codes. Enable login alerts if available. Report suspicious messages immediately from the conversation or Trust & Safety page.',
    related: ['become-verified', 'report-problem'],
  },
  {
    slug: 'report-problem',
    title: 'How do I report a platform problem?',
    category: 'trust',
    body: 'Use Report a problem on the Safety page for bugs, abuse, or policy concerns unrelated to a contract dispute. For contract disagreements, use Open Dispute on the contract instead.',
    related: ['raise-dispute', 'account-security'],
  },
  {
    slug: 'onboarding-steps',
    title: 'What are the onboarding steps?',
    category: 'getting-started',
    body: 'Choose worker or company, add profile details, skills or company info, and verification preferences. You can complete optional verification later; some features may be limited until verified.',
    related: ['become-verified', 'apply-jobs'],
  },
  {
    slug: 'messages-rules',
    title: 'Why must chat stay on-platform?',
    category: 'trust',
    body: 'On-platform messaging protects both parties for payments, disputes, and safety. Attempts to move contact off-platform may be flagged for review under our community guidelines.',
    related: ['account-security', 'report-problem'],
  },
]

export function findArticle(slug) {
  return articles.find((a) => a.slug === slug)
}

export function searchArticles(query) {
  const q = (query || '').toLowerCase().trim()
  if (!q) return []
  return articles.filter(
    (a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
  )
}
