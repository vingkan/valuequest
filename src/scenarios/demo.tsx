import { Game } from '../scenarios/scenario.tsx'
import { PaymentModel } from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'

const initialFeeForServiceModel: PaymentModel = {
    run: (vars: Partial<Variables>) => {
        const { desiredReimbursementCents = 0 } = vars
        const reimbursementRate = 0.8
        const paymentCents = reimbursementRate * desiredReimbursementCents
        return { paymentCents }
    },
}

export const DEMO_GAME: Game = {
    metrics: [
        {
            name: "Member Satisfaction",
            variable: "memberSatisfaction",
            higherIsBetter: true,
            explanation: "Higher is better. Score from 0 to 100 capturing how happy members are with their healthcare.",
            formatId: "hundred_score",
            value: 0,
        },
        {
            name: "Quality of Life",
            variable: "qualityOfLife",
            higherIsBetter: true,
            explanation: "Higher is better. Score from 0 (patient died) to 100 (patient has no health issues).",
            formatId: "hundred_score",
            value: 0,
        },
        {
            name: "Cost PMPM",
            variable: "centsPerMemberPerMonth",
            higherIsBetter: false,
            explanation: "Lower is better. Average cost of healthcare services provided per member per month.",
            formatId: "dollars",
            value: 0,
        },
        {
            name: "Provider Satisfaction",
            variable: "providerSatisfaction",
            higherIsBetter: true,
            explanation: "Higher is better. Score from 0 to 100 capturing how happy providers are with their work and life.",
            formatId: "hundred_score",
            value: 0,
        },
        {
            name: "Health Inequity",
            variable: "qualityOfLifeGiniIndex",
            higherIsBetter: false,
            explanation: "Lower is better. Gini index from 0 (all patients have the same quality of life) to 1 (maximum inequality).",
            formatId: "rate",
            value: 0,
        },
    ],
    initialInputs: {
        // Cost and Utilization Factors
        memberCount: 500_000,
        memberRateLowRisk: 0.8,
        memberRateMediumRisk: 0.1,
        memberRateHighRisk: 0.1,
        qualityOfLifeLowRisk: 0.8,
        qualityOfLifeMediumRisk: 0.55,
        qualityOfLifeHighRisk: 0.4,
        utilizationPerMemberPerYearInpatient: 0.005,
        utilizationPerMemberPerYearOutpatient: 0.02,
        utilizationPerMemberPerYearPrimary: 0.5,
        utilizationPerMemberPerYearSpecialty: 0.01,
        utilizationPerMemberPerYearDrugs: 0.5,
        utilizationFactorLowRisk: 0.5,
        utilizationFactorMediumRisk: 1.5,
        utilizationFactorHighRisk: 2,
        providerDesiredCentsPerUtilizationInpatient: 3_000_00,
        providerDesiredCentsPerUtilizationOutpatient: 150_00,
        providerDesiredCentsPerUtilizationPrimary: 50_00,
        providerDesiredCentsPerUtilizationSpecialty: 1_000_00,
        providerDesiredCentsPerUtilizationDrugs: 10_00,
        // Quality Factors
        // Higher is Better
        careAccessibilityFactor: 0.75,
        providerTrustFactor: 0.75,
        primaryCareParticipationRate: 0.3,
        preventionRate: 0.15,
        conditionsManagedRate: 0.65,
        wellManagedRate: 0.25,
        careGapClosureRate: 0.35,
        medicationAdheranceRate: 0.35,
        genericPrescriptionRate: 0.2,
        providerEfficiencyFactor: 0.5,
        // Lower is Better
        costAversionFactor: 0.75,
        lengthOfStay: 1,
        readmissionRate: 0.3,
        // Provider Factors
        patientsPerProvider: 10,
        providerAutonomyFactor: 0.6,
        providerReportingBurden: 0.8,
    },
    initialModels: {
        ffs: initialFeeForServiceModel,
    },
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
            modelChanges: {},
            inputMultipliers: {},
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
                            modelChanges: {},
                            inputMultipliers: {
                                utilizationPerMemberPerYearPrimary: 1.05,
                                primaryCareParticipationRate: 1.05,
                                careGapClosureRate: 1.02,
                                providerAutonomyFactor: 1.1,
                            }
                        },
                        {
                            character: 'Plan Actuary',
                            description: 'Are you crazy? They already have enough upside! Reject the deal.',
                            imageUrl: 'assets/characters/character-1.png',
                            modelChanges: {},
                            inputMultipliers: {
                                utilizationPerMemberPerYearInpatient: 1.03,
                                utilizationPerMemberPerYearSpecialty: 1.03,
                                providerReportingBurden: 1.2,
                            }
                        }
                    ]
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
                            modelChanges: {},
                            inputMultipliers: {}
                        },
                        {
                            character: 'Medical Director',
                            description: 'This imposes unnecessary burden on providers. They will just see it as more red tape blocking their reimbursement.',
                            imageUrl: 'assets/characters/character-11.png',
                            modelChanges: {},
                            inputMultipliers: {}
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
            modelChanges: {},
            inputMultipliers: {},
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
                            modelChanges: {},
                            inputMultipliers: {}
                        },
                        {
                            character: 'Member Services Coordinator',
                            description: 'Just because a member lives near a doctor doesn\'t mean they\'ll go see them. I am skeptical that this will actually move the needle.',
                            imageUrl: 'assets/characters/character-6.png',
                            modelChanges: {},
                            inputMultipliers: {}
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
                            modelChanges: {},
                            inputMultipliers: {}
                        },
                        {
                            character: 'Health Economist',
                            description: 'We can adjust the regional benchmarks to consider only "peer" providers who are similar in size. But, adjusting for year-over-year changes could expose us to much more risk.',
                            imageUrl: 'assets/characters/character-10.png',
                            modelChanges: {},
                            inputMultipliers: {}
                        }
                    ],
                },
            ],
        },
    ]
}