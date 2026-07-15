'use client'

import { CardSwap, Card } from './CardSwap'

const cards = [
  {
    label: 'Estate Readiness',
    tag: 'In Progress',
    tagColor: 'text-[#2f7d4f]',
    items: [
      { name: 'Will (updated 2024)', done: true },
      { name: 'Healthcare directive', done: true },
      { name: 'Trust funding confirmation', done: false },
      { name: 'POA — signed & notarised', done: false },
    ],
    footer: '2 of 4 items complete',
  },
  {
    label: 'Professional Team',
    tag: 'Coordinated',
    tagColor: 'text-[#c9a46a]',
    items: [
      { name: 'Estate Attorney — J. Hartwell', done: true },
      { name: 'CPA — Morales & Associates', done: true },
      { name: 'Financial Planner — R. Kim', done: true },
      { name: 'Insurance Broker — TBD', done: false },
    ],
    footer: '3 professionals active',
  },
  {
    label: 'Insurance Review',
    tag: 'Needs Attention',
    tagColor: 'text-[#b45309]',
    items: [
      { name: 'Life — $1.2M Northwestern', done: true },
      { name: 'Long-term care — lapsed', done: false },
      { name: 'Disability coverage', done: false },
      { name: 'Supplemental Medicare', done: true },
    ],
    footer: '2 gaps flagged',
  },
  {
    label: 'Financial Accounts',
    tag: 'Organised',
    tagColor: 'text-[#2f7d4f]',
    items: [
      { name: 'Checking & savings — Chase', done: true },
      { name: 'Brokerage — Schwab', done: true },
      { name: 'IRA (beneficiary outdated)', done: false },
      { name: '401(k) — Fidelity', done: true },
    ],
    footer: '1 beneficiary update needed',
  },
]

export default function HeroCards() {
  return (
    <div className="flex items-center justify-center py-4 lg:py-8">
      <CardSwap
        width={360}
        height={280}
        cardDistance={35}
        verticalDistance={28}
        delay={4000}
        pauseOnHover
        skewAmount={4}
        easing="elastic"
      >
        {cards.map((card) => (
          <Card key={card.label} customClass="overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4">
              <span className="font-serif text-sm text-espresso-deep">{card.label}</span>
              <span className={`text-[10px] font-medium uppercase tracking-[0.16em] ${card.tagColor}`}>
                {card.tag}
              </span>
            </div>

            {/* Items */}
            <ul className="divide-y divide-charcoal/8 px-6 py-1">
              {card.items.map((item) => (
                <li key={item.name} className="flex items-center gap-3 py-2.5">
                  <span className={`flex h-4 w-4 flex-none items-center justify-center rounded-sm border ${
                    item.done ? 'border-[#c9a46a] bg-[#c9a46a]/15' : 'border-charcoal/25'
                  }`}>
                    {item.done && (
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                        <path d="M2 6.5 5 9.5 10 3" stroke="#c9a46a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[13px] leading-snug ${item.done ? 'text-charcoal/70' : 'text-charcoal/40 line-through'}`}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-charcoal/10 px-6 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/40">{card.footer}</p>
            </div>
          </Card>
        ))}
      </CardSwap>
    </div>
  )
}
