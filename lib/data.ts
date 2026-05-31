export type Asset = { label: string; value: number; category: "Cash" | "Taxable" | "Qualified" | "Roth" | "Real Estate" | "Business"; source?: "Plaid" | "Manual" };
export type Liability = { label: string; balance: number; rate?: number; source?: "Plaid" | "Manual" };
export type ActionItem = { id: string; title: string; due?: string; status: "open" | "in_progress" | "done"; owner: "Karli" | "Client"; sourceMeeting?: string };
export type ProTeam = { role: string; name: string; firm?: string; email?: string; phone?: string };
export type MeetingNote = { date: string; title: string; summary: string; source?: "Calendly" | "Google Cal" | "Manual" };
export type DocItem = { name: string; tag: string; uploaded: string; source: "Client intake" | "Karli upload" | "Plaid statement" };
export type PlaidAccount = { institution: string; mask: string; type: "Checking" | "Savings" | "Brokerage" | "Retirement"; balance: number; lastSync: string };
export type IntakeResponse = { question: string; answer: string };
export type ContactSignal = { source: "Google Cal" | "Gmail" | "Calendly"; label: string; date: string };

export type Client = {
  id: string;
  name: string;
  plan: "Royal Oak" | "Sycamore" | "Mahogany" | "Intake";
  status: "Active" | "Onboarding" | "Review" | "Follow-Up";
  lastContact: string;
  nextMeeting?: string;
  goals: string[];
  assets: Asset[];
  liabilities: Liability[];
  income: { label: string; annual: number }[];
  expenses: { label: string; monthly: number }[];
  team: ProTeam[];
  actions: ActionItem[];
  meetings: MeetingNote[];
  documents: DocItem[];
  plaidAccounts?: PlaidAccount[];
  intakeResponses?: IntakeResponse[];
  lastContactSignal?: ContactSignal;
  family?: string;
  notes?: string;
};

export const clients: Client[] = [
  {
    id: "anita",
    name: "Anita Reyes",
    plan: "Royal Oak",
    status: "Active",
    lastContact: "Jan 21, 2025",
    nextMeeting: "Feb 18, 2025",
    family: "Widowed, 2 adult children",
    goals: [
      "Preserve net worth through retirement",
      "Sell Cocoa Beach timeshare",
      "Decide on Marianna land disposition",
    ],
    assets: [
      { label: "USAA Checking", value: 44000, category: "Cash" },
      { label: "Flagstar Savings", value: 218000, category: "Cash" },
      { label: "Abbvie Stock Account", value: 41782, category: "Taxable" },
      { label: "Brokerage Account", value: 60694, category: "Taxable" },
      { label: "Anita IRA", value: 496938, category: "Qualified" },
      { label: "Anita Roth IRA", value: 5888, category: "Roth" },
      { label: "Chokoloskee Property", value: 65000, category: "Real Estate" },
      { label: "Cocoa Beach Timeshare", value: 2100, category: "Real Estate" },
      { label: "Marianna (Tallahassee Land)", value: 20000, category: "Real Estate" },
    ],
    liabilities: [],
    income: [
      { label: "Social Security", annual: 32400 },
      { label: "IRA Distribution", annual: 24000 },
    ],
    expenses: [
      { label: "Housing", monthly: 1850 },
      { label: "Healthcare", monthly: 620 },
      { label: "Food & Living", monthly: 1100 },
      { label: "Travel", monthly: 400 },
    ],
    team: [
      { role: "CPA", name: "Eduardo Marin", firm: "Marin & Co.", email: "em@marincpa.com" },
      { role: "Estate Attorney", name: "—", firm: "Needs referral" },
      { role: "Insurance Agent", name: "Linda Park", firm: "AAA" },
      { role: "Primary Care", name: "Dr. Ortega" },
    ],
    actions: [
      { id: "a1", title: "List Cocoa Beach timeshare for sale", status: "in_progress", owner: "Client", due: "2025-02-28" },
      { id: "a2", title: "Open Roth conversion ladder analysis", status: "open", owner: "Karli", due: "2025-02-15" },
      { id: "a3", title: "Refer Anita to estate attorney for will update", status: "open", owner: "Karli", due: "2025-02-10" },
      { id: "a4", title: "Confirm beneficiaries on IRA + Roth", status: "done", owner: "Client" },
    ],
    meetings: [
      { date: "Jan 21, 2025", title: "Plan Review", summary: "Walked through balance sheet. Confirmed conservative risk tolerance. Flagged timeshare and Marianna land as illiquid." },
      { date: "Dec 12, 2024", title: "Intake", summary: "Initial 2-hour intake. Collected account statements and most recent tax return." },
    ],
    documents: [
      { name: "2023 Tax Return.pdf", tag: "Tax", uploaded: "Dec 12, 2024", source: "Client intake" },
      { name: "IRA Statement Q4.pdf", tag: "Statements", uploaded: "Dec 12, 2024", source: "Plaid statement" },
      { name: "Will (2018).pdf", tag: "Estate", uploaded: "Dec 14, 2024", source: "Client intake" },
    ],
    plaidAccounts: [
      { institution: "USAA", mask: "··4421", type: "Checking", balance: 44000, lastSync: "2 hours ago" },
      { institution: "Flagstar", mask: "··8810", type: "Savings", balance: 218000, lastSync: "2 hours ago" },
      { institution: "Fidelity", mask: "··2204", type: "Brokerage", balance: 102476, lastSync: "today" },
      { institution: "Fidelity", mask: "··9911", type: "Retirement", balance: 502826, lastSync: "today" },
    ],
    intakeResponses: [
      { question: "Marital status", answer: "Widowed" },
      { question: "Dependents", answer: "2 adult children (no financial dependence)" },
      { question: "US Citizen", answer: "Yes" },
      { question: "Risk tolerance", answer: "Conservative" },
      { question: "Achieved financial security through retirement?", answer: "Mostly yes — concerned about long-term care" },
      { question: "Existing estate plan", answer: "Simple will (2018), no trust" },
      { question: "Largest obstacle to goals", answer: "Illiquid real estate (Marianna land, Cocoa timeshare)" },
      { question: "Plans for estate taxes", answer: "None set up" },
      { question: "Annual income", answer: "$56,400 (Social Security + IRA distribution)" },
      { question: "Estimated monthly expenses", answer: "$3,970" },
    ],
    lastContactSignal: { source: "Google Cal", label: "Plan Review meeting", date: "Jan 21, 2025" },
  },
  {
    id: "dayanara",
    name: "Dayanara Diaz",
    plan: "Mahogany",
    status: "Review",
    lastContact: "Feb 4, 2025",
    nextMeeting: "Feb 24, 2025",
    family: "Married (separated, Chris), daughter Jazz, son Joshua, 1 grandson",
    goals: [
      "Rent or buy new primary home",
      "Complete renovations on investment property",
      "Expand Fleet Pros into Orlando market",
      "Set up retirement & education funds",
    ],
    assets: [
      { label: "Primary Home (Lighthouse Point)", value: 3000000, category: "Real Estate" },
      { label: "Investment Property", value: 850000, category: "Real Estate" },
      { label: "Fleet Pros LLC", value: 1200000, category: "Business" },
      { label: "Operating Checking", value: 142000, category: "Cash" },
      { label: "Brokerage", value: 310000, category: "Taxable" },
      { label: "SEP IRA (underfunded)", value: 38000, category: "Qualified" },
    ],
    liabilities: [
      { label: "Primary Mortgage", balance: 1300000, rate: 4.25 },
      { label: "HELOC (preapproved $400k)", balance: 0, rate: 4.99 },
    ],
    income: [
      { label: "Fleet Pros Distributions", annual: 420000 },
      { label: "Rental Income", annual: 36000 },
    ],
    expenses: [
      { label: "Housing", monthly: 9800 },
      { label: "Business reinvestment", monthly: 12000 },
      { label: "Family support (Jazz)", monthly: 3500 },
      { label: "Lifestyle", monthly: 6500 },
    ],
    team: [
      { role: "CPA", name: "—", firm: "Needs introduction" },
      { role: "Estate Attorney", name: "Goldstein PLLC" },
      { role: "Business Attorney", name: "Rivera Law" },
      { role: "Insurance Agent", name: "Tom Halpert", firm: "Northwestern Mutual" },
      { role: "Banker (Karli)", name: "Karli Vazquez-Mendez" },
    ],
    actions: [
      { id: "d1", title: "Complete 2024 taxes", status: "in_progress", owner: "Client", due: "2025-03-15", sourceMeeting: "Feb 4, 2025 · Proposal Review" },
      { id: "d2", title: "Sell boat", status: "open", owner: "Client", sourceMeeting: "Feb 4, 2025 · Proposal Review" },
      { id: "d3", title: "Set up SEP / 401k decision with CPA", status: "open", owner: "Karli", due: "2025-02-28", sourceMeeting: "Feb 4, 2025 · Proposal Review" },
      { id: "d4", title: "Open 529 for grandson", status: "open", owner: "Karli", due: "2025-03-31", sourceMeeting: "Feb 4, 2025 · Proposal Review" },
      { id: "d5", title: "Verify life term policy is convertible", status: "open", owner: "Karli", sourceMeeting: "Feb 4, 2025 · Proposal Review" },
      { id: "d6", title: "Move bank accounts into trust", status: "open", owner: "Client", sourceMeeting: "Jan 14, 2025 · Intake" },
      { id: "d7", title: "Confirm Orlando warehouse LLC structure", status: "in_progress", owner: "Karli", sourceMeeting: "Jan 14, 2025 · Intake" },
    ],
    meetings: [
      { date: "Feb 4, 2025", title: "Proposal Review", summary: "Walked through HELOC scenarios, $200k reno + $200k Orlando expansion. Discussed sale-of-home math: $3MM sale → $850k to Chris → $450k to new home." },
      { date: "Jan 14, 2025", title: "Intake", summary: "Collected business financials, P&L, balance sheet. High complexity — Mahogany tier." },
    ],
    documents: [
      { name: "Fleet Pros P&L 2024.xlsx", tag: "Business", uploaded: "Jan 14, 2025", source: "Client intake" },
      { name: "HELOC Preapproval.pdf", tag: "Lending", uploaded: "Jan 22, 2025", source: "Karli upload" },
      { name: "Trust Agreement.pdf", tag: "Estate", uploaded: "Jan 14, 2025", source: "Client intake" },
      { name: "Term Life Policy.pdf", tag: "Insurance", uploaded: "Jan 28, 2025", source: "Client intake" },
    ],
    plaidAccounts: [
      { institution: "Wells Fargo", mask: "··3322", type: "Checking", balance: 142000, lastSync: "1 hour ago" },
      { institution: "Charles Schwab", mask: "··0911", type: "Brokerage", balance: 310000, lastSync: "today" },
      { institution: "Vanguard", mask: "··7745", type: "Retirement", balance: 38000, lastSync: "today" },
    ],
    intakeResponses: [
      { question: "Marital status", answer: "Married, separated (Chris)" },
      { question: "Dependents", answer: "Daughter Jazz (in school), son Joshua, 1 grandson" },
      { question: "Risk tolerance", answer: "Moderate" },
      { question: "Existing estate plan", answer: "Trust exists but bank accounts + beneficiaries not retitled" },
      { question: "Existing insurance", answer: "Term life (convertible TBD), health, auto, P&C" },
      { question: "Annual income", answer: "$456,000 (Fleet Pros + rental)" },
      { question: "Estimated monthly expenses", answer: "$31,800" },
      { question: "Largest obstacle to goals", answer: "Cash flow timing for Orlando expansion + home purchase" },
      { question: "Goals (free text)", answer: "Buy/rent new home, expand Fleet Pros to Orlando, retirement contributions, 529 for grandson, set up retirement for Jazz & Joshua" },
      { question: "Working with insurance agent?", answer: "Yes — Tom Halpert (Northwestern Mutual)" },
    ],
    lastContactSignal: { source: "Gmail", label: "Reply: HELOC scenarios", date: "Feb 4, 2025" },
  },
  {
    id: "ryan",
    name: "Dr. Ryan & Chere Smith",
    plan: "Sycamore",
    status: "Follow-Up",
    lastContact: "Nov 8, 2024",
    nextMeeting: "Mar 3, 2025",
    family: "Married, 3 children (12, 9, 6)",
    goals: ["College planning for 3 kids", "Practice succession in 15 years", "Tax efficiency"],
    assets: [
      { label: "Joint Brokerage", value: 412000, category: "Taxable" },
      { label: "Ryan 401(k)", value: 685000, category: "Qualified" },
      { label: "Chere IRA", value: 220000, category: "Qualified" },
      { label: "Primary Home", value: 1100000, category: "Real Estate" },
      { label: "Practice Equity", value: 950000, category: "Business" },
    ],
    liabilities: [{ label: "Mortgage", balance: 480000, rate: 3.25 }],
    income: [{ label: "Practice Income", annual: 540000 }],
    expenses: [{ label: "All-in lifestyle", monthly: 22000 }],
    team: [
      { role: "CPA", name: "Helen Wu" },
      { role: "Estate Attorney", name: "Park & Associates" },
    ],
    actions: [
      { id: "r1", title: "Schedule 6-month review", status: "open", owner: "Karli", due: "2025-02-08" },
      { id: "r2", title: "529 contribution review", status: "open", owner: "Karli" },
    ],
    meetings: [
      { date: "Nov 8, 2024", title: "Plan Delivery", summary: "Delivered initial plan. Sycamore tier engaged for estate review." },
    ],
    documents: [{ name: "Plan v1.pdf", tag: "Plan", uploaded: "Nov 8, 2024", source: "Karli upload" }],
    lastContactSignal: { source: "Google Cal", label: "Plan Delivery meeting", date: "Nov 8, 2024" },
  },
  {
    id: "rachel",
    name: "Rachel Stevens",
    plan: "Royal Oak",
    status: "Active",
    lastContact: "Jan 30, 2025",
    family: "Single, no children",
    goals: ["Retire by 55", "Buy a vacation home", "Charitable giving plan"],
    assets: [
      { label: "Brokerage", value: 280000, category: "Taxable" },
      { label: "401(k)", value: 540000, category: "Qualified" },
      { label: "Roth IRA", value: 92000, category: "Roth" },
      { label: "Condo", value: 620000, category: "Real Estate" },
    ],
    liabilities: [{ label: "Condo Mortgage", balance: 310000, rate: 5.1 }],
    income: [{ label: "W-2", annual: 215000 }],
    expenses: [{ label: "Lifestyle", monthly: 8200 }],
    team: [{ role: "CPA", name: "Mark Levine" }],
    actions: [
      { id: "ra1", title: "Backdoor Roth conversion this year", status: "in_progress", owner: "Client" },
      { id: "ra2", title: "Charitable trust strategy memo", status: "open", owner: "Karli", due: "2025-03-15" },
    ],
    meetings: [{ date: "Jan 30, 2025", title: "Quarterly Check-in", summary: "On track for FIRE goal. Discussed DAF vs CRT." }],
    documents: [{ name: "401k Statement.pdf", tag: "Statements", uploaded: "Jan 5, 2025", source: "Plaid statement" }],
    lastContactSignal: { source: "Gmail", label: "Email: Q1 check-in notes", date: "Jan 30, 2025" },
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    plan: "Intake",
    status: "Onboarding",
    lastContact: "Feb 6, 2025",
    family: "Married, 1 newborn",
    goals: ["First-time home purchase", "Set up estate basics", "Maximize new-parent benefits"],
    assets: [
      { label: "Joint Checking", value: 28000, category: "Cash" },
      { label: "Joint Savings", value: 65000, category: "Cash" },
      { label: "Marcus 401(k)", value: 142000, category: "Qualified" },
    ],
    liabilities: [{ label: "Student Loans", balance: 48000, rate: 6.25 }],
    income: [
      { label: "Marcus W-2", annual: 165000 },
      { label: "Spouse W-2", annual: 95000 },
    ],
    expenses: [{ label: "Lifestyle", monthly: 6800 }],
    team: [],
    actions: [
      { id: "m1", title: "Send intake link", status: "done", owner: "Karli" },
      { id: "m2", title: "Receive completed intake", status: "in_progress", owner: "Client" },
      { id: "m3", title: "Schedule plan review", status: "open", owner: "Karli", due: "2025-02-20" },
    ],
    meetings: [{ date: "Feb 6, 2025", title: "Free Intro Call", summary: "1-hour intro. Engaged for Royal Oak. Sent intake link." }],
    documents: [],
    lastContactSignal: { source: "Calendly", label: "Booked: Free Intro Call", date: "Feb 6, 2025" },
  },
];

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function netWorth(c: Client) {
  const a = c.assets.reduce((s, x) => s + x.value, 0);
  const l = c.liabilities.reduce((s, x) => s + x.balance, 0);
  return { assets: a, liabilities: l, net: a - l };
}

export function assetsByCategory(c: Client) {
  const map = new Map<string, number>();
  c.assets.forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + a.value));
  const total = Array.from(map.values()).reduce((s, x) => s + x, 0);
  return Array.from(map.entries()).map(([category, value]) => ({
    category,
    value,
    pct: total ? (value / total) * 100 : 0,
  }));
}
