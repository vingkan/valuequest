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
                title: 'Contract Year 2024',
                description: `
You lead the value-based care team at a health insurance plan.
Your job is to manage the pilot and make it a huge success.
Navigate these decisions to get ready for contract year 2024.
                `,
            },
            decisions: [
                {
                    id: 'offer-more-contract-incentives',
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
                    id: 'require-care-coordination-plan',
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
        },
        {
            scenario: {
                title: 'Contract Year 2025',
                description: `
You made it through your first year!
Some of the data was delayed, but you got through it.
Now it's time to prepare for contract year 2025.
                `,
            },
            decisions: [
                {
                    id: 'expand-geo-attribution',
                    title: 'Expand Geo Attribution',
                    description: 'Geo (geographic) attribution assigns patients to a nearby doctor. We currently attribute very few patients this way. Should we expand our use of this method?',
                    options: [
                        {
                            character: 'Data Scientist',
                            description: 'Geo would double the number of lives our value-based contracts cover. More revenue for providers, better outcomes for patients, and more growth for our program.',
                            imageUrl: 'assets/characters/character-9.png',
                        },
                        {
                            character: 'Member Services Coordinator',
                            description: 'Just because a member lives near a doctor doesn\'t mean they\'ll go see them. I am skeptical that this will actually move the needle.',
                            imageUrl: 'assets/characters/character-6.png',
                        }
                    ],
                },
                {
                    id: 'use-prior-year-benchmarks',
                    title: 'Use Prior Year Benchmarks',
                    description: 'Currently, providers have to do better than the regional average to get their performance bonuses. Providers complain about that, so we are considering benchmarking against their previous year\'s performance instead. They don\'t love that either.',
                    options: [
                        {
                            character: 'Medical Director',
                            description: 'Regional benchmarks feel unfair because you are going up against providers with much more resources. Competing with yourself from last year will be an easier sell.',
                            imageUrl: 'assets/characters/character-11.png',
                        },
                        {
                            character: 'Health Economist',
                            description: 'We can adjust the regional benchmarks to consider only "peer" providers who are similar in size. But, adjusting for year-over-year changes could expose us to much more risk.',
                            imageUrl: 'assets/characters/character-10.png',
                        }
                    ],
                },
            ],
        },
    ]
}