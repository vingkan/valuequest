import { Game } from '../scenarios/scenario.tsx'

export const DEMO_GAME: Game = {
    metrics: [
        {
            name: "Member Satisfaction",
            explanation: "Higher is better. Score from 0 to 100 capturing how happy members are with their healthcare.",
            value: "55",
        },
        {
            name: "Quality of Life",
            explanation: "Higher is better. Score from 0 (patient died) to 100 (patient has no health issues).",
            value: "67",
        },
        {
            name: "Cost PMPM",
            explanation: "Lower is better. Average cost of healthcare services provided per member per month.",
            value: "$254",
        },
        {
            name: "Provider Satisfaction",
            explanation: "Higher is better. Score from 0 to 100 capturing how happy providers are with their work and life.",
            value: "32",
        },
        {
            name: "Health Inequality",
            explanation: "Lower is better. Score from 0 (all patients have the same quality of life) to 1 (maximum inequality).",
            value: "0.17",
        },
    ],
    rounds: [
        {
            scenario: {
                title: 'Round 1: Contract Year 2024',
                description: `
You lead the value-based care team at a health insurance plan.
Your job is to manage the pilot and make it a huge success.
Navigate these decisions to get ready for contract year 2024.
            `,
            },
            decisions: [
                {
                    id: 'incentives-negotiation',
                    title: 'Offer More Contract Incentives',
                    description: 'One of our providers wants a revised contract with more performance incentive bonus money. Should we agree to this deal?',
                    options: [
                        {
                            character: 'Contract Manager',
                            description: 'Approve the deal. More incentives will get them focused on quality.',
                            imageUrl: 'assets/characters/character-2.png',
                        },
                        {
                            character: 'Plan Actuary',
                            description: 'Are you crazy? They already have enough upside! Reject the deal.',
                            imageUrl: 'assets/characters/character-1.png',
                        }
                    ],
                },
                {
                    id: 'written-care-coordination-plan',
                    title: 'Require Care Coordination Plan',
                    description: 'Should we require providers to submit a written plan explaining how they will use care coordination fees as a requirement to receive the payments?',
                    options: [
                        {
                            character: 'Compliance Officer',
                            description: 'Without this documentation, we could be opening up both ourselves and the provider to fraud allegations.',
                            imageUrl: 'assets/characters/character-16.png',
                        },
                        {
                            character: 'Medical Director',
                            description: 'This imposes unnecessary burden on providers. They will just see it as more red tape blocking their reimbursement.',
                            imageUrl: 'assets/characters/character-11.png',
                        }
                    ],
                },
            ],
        }
    ]
}