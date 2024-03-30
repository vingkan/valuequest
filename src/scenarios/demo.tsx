import { Game } from '../scenarios/scenario.tsx'
import { ALL_SERVICE_CATEGORIES, ServiceCategory } from '../simulation/cost.tsx'
import { getSimpleFeeForServiceModel } from '../models/fee_for_service.tsx'
import { getCareCoordinationModel } from '../models/care_coordination.tsx'
import { getThresholdBonusModel, ThresholdConfig } from '../models/incentives.tsx'

const initialFeeForServiceModel = getSimpleFeeForServiceModel({
    name: "Fee For Service Reimbursement",
    reimbursementRate: 0.8,
    includedCategories: ALL_SERVICE_CATEGORIES,
})

const initialCareCoordinationModel = getCareCoordinationModel({
    name: "Care Coordination Fee",
    feePerMemberPerMonthCents: 306_00
})

const getAnnualWellnessVisitIncentive = (overrides: Partial<ThresholdConfig>) => (
    getThresholdBonusModel({
        name: "Annual Wellness Visit Bonus",
        measures: {
            primaryCareParticipationRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.90,
                bonusPerMemberPerMonthCents: 2_50,
                ...overrides,
            },
        }
    })
)

const getReadmissionRateIncentive = (overrides: Partial<ThresholdConfig>) => (
    getThresholdBonusModel({
        name: "Readmission Rate Bonus",
        measures: {
            readmissionRate: {
                isReverseMeasure: true,
                minimumThreshold: 0.25,
                bonusPerMemberPerMonthCents: 4_50,
                ...overrides,
            },
        }
    })
)

const getBrandToGenericBonus = (overrides: Partial<ThresholdConfig>) => (
    getThresholdBonusModel({
        name: "Brand to Generic Bonus",
        measures: {
            genericPrescriptionRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.65,
                bonusPerMemberPerMonthCents: 2_65,
                ...overrides,
            },
        }
    })
)

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
            name: "Spend PMPM",
            variable: "paidCentsPerMemberPerMonth",
            higherIsBetter: false,
            explanation: "Lower is better. Average payer spend on covered services per member per month. Inflation-adjusted.",
            formatId: "cents_to_dollars",
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
            name: "Health Equity",
            variable: "qualityOfLifePalmaFraction",
            higherIsBetter: true,
            explanation: "Higher is better. 0.5 = the sickest 40% have half as good health as top 10%, 1 = equivalent health.",
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
        utilizationPerMemberPerYearInpatient: 0.42,
        utilizationPerMemberPerYearOutpatient: 0.3,
        utilizationPerMemberPerYearPrimary: 0.8,
        utilizationPerMemberPerYearSpecialty: 0.6,
        utilizationPerMemberPerYearDrugs: 12,
        utilizationFactorLowRisk: 1,
        utilizationFactorMediumRisk: 1.5,
        utilizationFactorHighRisk: 2,
        providerDesiredCentsPerUtilizationInpatient: 5_000_00,
        providerDesiredCentsPerUtilizationOutpatient: 200_00,
        providerDesiredCentsPerUtilizationPrimary: 100_00,
        providerDesiredCentsPerUtilizationSpecialty: 1_000_00,
        providerDesiredCentsPerUtilizationDrugs: 50_00,
        genericDrugCostDiscountFactor: 0.5,
        // Quality Factors
        // Higher is Better
        careAccessibilityFactor: 0.75,
        providerTrustFactor: 0.75,
        primaryCareParticipationRate: 0.83,
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
        // Quality Improvement Factors
        primaryCareQualityImprovementFactor: 1.01,
        readmissionReductionQualityImprovementFactor: 1.05,
        genericDrugPerceptionFactor: 0.8,
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
            modelChanges: {
                ffs: null,
                ccf: initialCareCoordinationModel,
                // Need +0.1 modifier to hit this target
                wellness: getAnnualWellnessVisitIncentive({}),
                // Need -0.2 modifier to hit this target
                readmission: getReadmissionRateIncentive({}),
                // Need +2.25 modifier to hit this target
                generic: getBrandToGenericBonus({}),
            },
            inputModifiers: {},
            decisions: [
                {
                    id: 'offer-more-contract-incentives',
                    title: 'Offer More Contract Incentives',
                    description: 'One of our providers wants a revised contract with more performance incentive bonus money if they hit their targets. Should we agree to this deal?',
                    options: [
                        {
                            character: 'Contract Manager',
                            description: 'Approve the deal. More incentives will get them focused on quality.',
                            imageUrl: 'assets/characters/character-2.png',
                            modelChanges: {
                                wellness: getAnnualWellnessVisitIncentive({
                                    bonusPerMemberPerMonthCents: 3_00
                                }),
                                readmission: getReadmissionRateIncentive({
                                    bonusPerMemberPerMonthCents: 5_75
                                }),
                                generic: getBrandToGenericBonus({
                                    bonusPerMemberPerMonthCents: 3_50
                                }),
                            },
                            inputModifiers: {
                                primaryCareParticipationRate: 0.1,
                                readmissionRate: -0.2,
                                genericPrescriptionRate: 2.25,
                            }
                        },
                        {
                            character: 'Plan Actuary',
                            description: 'Are you crazy? They already have enough upside! Reject the deal.',
                            imageUrl: 'assets/characters/character-1.png',
                            modelChanges: {},
                            inputModifiers: {
                                primaryCareParticipationRate: 0.08,
                                readmissionRate: -0.02,
                                genericPrescriptionRate: 1,
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
                            inputModifiers: {
                                providerAutonomyFactor: -0.1,
                                providerReportingBurden: 0.2,
                            }
                        },
                        {
                            character: 'Medical Director',
                            description: 'This imposes unnecessary burden on providers. They will just see it as more red tape blocking their reimbursement.',
                            imageUrl: 'assets/characters/character-11.png',
                            modelChanges: {},
                            inputModifiers: {
                                primaryCareParticipationRate: 0.02,
                                providerAutonomyFactor: 0.02,
                                providerReportingBurden: -0.06,
                            }
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
            inputModifiers: {},
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
                            inputModifiers: {
                                memberCount: 1,
                                primaryCareParticipationRate: -0.4,
                                // Low risk fraction increases (0.8 to 0.9)
                                memberRateLowRisk: 0.125,
                                // Medium risk fraction decreases (0.1 to 0.05)
                                memberRateMediumRisk: -0.5,
                                // High risk fraction decreases (0.1 to 0.05)
                                memberRateHighRisk: -0.5,
                            }
                        },
                        {
                            character: 'Member Services Coordinator',
                            description: 'Just because a member lives near a doctor doesn\'t mean they\'ll go see them. I am skeptical that this will actually move the needle.',
                            imageUrl: 'assets/characters/character-6.png',
                            modelChanges: {},
                            inputModifiers: {
                                memberCount: 0.2,
                                primaryCareParticipationRate: 0.01,
                            }
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
                            modelChanges: {
                                wellness: getAnnualWellnessVisitIncentive({
                                    minimumThreshold: 0.90,
                                }),
                                readmission: getReadmissionRateIncentive({
                                    minimumThreshold: 0.3,
                                }),
                                generic: getBrandToGenericBonus({
                                    minimumThreshold: 0.5,
                                }),
                            },
                            inputModifiers: {
                                primaryCareParticipationRate: 0.01,
                                readmissionRate: -0.03,
                                genericPrescriptionRate: 0.05,
                            }
                        },
                        {
                            character: 'Health Economist',
                            description: 'We can adjust the regional benchmarks to consider only "peer" providers who are similar in size. But, adjusting for year-over-year changes could expose us to much more risk.',
                            imageUrl: 'assets/characters/character-10.png',
                            modelChanges: {},
                            inputModifiers: {
                                primaryCareParticipationRate: 0.05,
                                readmissionRate: 0,
                                genericPrescriptionRate: 0,
                            }
                        }
                    ],
                },
            ],
        },
    ]
}