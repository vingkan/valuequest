import { Game } from '../scenarios/scenario.tsx'
import { ALL_SERVICE_CATEGORIES, ServiceCategory } from '../simulation/cost.tsx'
import { getSimpleFeeForServiceModel } from '../models/fee_for_service.tsx'
import { getCareCoordinationModel } from '../models/care_coordination.tsx'
import { getThresholdBonusModel, ThresholdConfig } from '../models/incentives.tsx'
import { getSimpleSharedSavingsModel } from '../models/shared_savings.tsx'

const initialFeeForServiceModel = getSimpleFeeForServiceModel({
    name: "Fee For Service Reimbursement",
    reimbursementRate: 0.8,
    includedCategories: ALL_SERVICE_CATEGORIES,
})

const inpatientCarveOutFeeForServiceModel = getSimpleFeeForServiceModel({
    name: "Inpatient Carve-Out Fee For Service Reimbursement",
    reimbursementRate: 0.4,
    includedCategories: [ServiceCategory.Inpatient],
})

const specialtyOnlyFeeForServiceModel = getSimpleFeeForServiceModel({
    name: "Specialty Fee For Service Reimbursement",
    reimbursementRate: 0.8,
    includedCategories: [ServiceCategory.Specialty],
})

const diabetesExcludedSpecialtyFeeForServiceModel = getSimpleFeeForServiceModel({
    name: "Diabetes-Excluded Specialty Fee For Service Reimbursement",
    reimbursementRate: 0.25,
    includedCategories: [ServiceCategory.Specialty],
})

const copdExcludedSpecialtyFeeForServiceModel = getSimpleFeeForServiceModel({
    name: "COPD-Excluded Specialty Fee For Service Reimbursement",
    reimbursementRate: 0.7,
    includedCategories: [ServiceCategory.Specialty],
})

const diabetesEpisodesModel = getSimpleSharedSavingsModel({
    name: "Diabetes Shared Savings",
    targetSpendCentsPerMemberPerYear: 16_000_00,
    providerSavingsRate: 0.5,
    providerLossRate: 0.5,
    providerStopLossCapCents: 2_000_00,
    fractionOfPopulationCovered: 0.105,
    fractionOfCostCovered: 0.43,
    includedCategories: [ServiceCategory.Inpatient, ServiceCategory.Specialty],
})

const copdEpisodesModel = getSimpleSharedSavingsModel({
    name: "COPD Shared Savings",
    targetSpendCentsPerMemberPerYear: 21_000_00,
    providerSavingsRate: 0.5,
    providerLossRate: 0.5,
    providerStopLossCapCents: 2_000_00,
    fractionOfPopulationCovered: 0.062,
    fractionOfCostCovered: 0.36,
    includedCategories: [ServiceCategory.Inpatient, ServiceCategory.Specialty],
})

const rewardsAppCareCoordinationModel = getCareCoordinationModel({
    name: "Diabetes Rewards App Fee",
    feePerMemberPerMonthCents: 10_00,
    fractionOfPopulation: 0.0525
})

const initialCareCoordinationModel = getCareCoordinationModel({
    name: "Care Coordination Fee",
    feePerMemberPerMonthCents: 150_00,
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
    focusMetrics: [
        {
            name: "Member Population",
            metrics: [
                {
                    name: "Total Members",
                    variable: "memberCount",
                    higherIsBetter: true,
                    formatId: "number_comma",
                    value: 0,
                },
                {
                    name: "% of Population Low Risk",
                    variable: "memberRateLowRisk",
                    higherIsBetter: true,
                    formatId: "percentage",
                    value: 0,
                },
                {
                    name: "% of Population Med Risk",
                    variable: "memberRateMediumRisk",
                    higherIsBetter: false,
                    formatId: "percentage",
                    value: 0,
                },
                {
                    name: "% of Population High Risk",
                    variable: "memberRateHighRisk",
                    higherIsBetter: false,
                    formatId: "percentage",
                    value: 0,
                },
                {
                    name: "Avg. Quality of Life Low Risk",
                    variable: "qualityOfLifeLowRisk",
                    higherIsBetter: true,
                    formatId: "hundred_score",
                    value: 0,
                },
                {
                    name: "Avg. Quality of Life Med Risk",
                    variable: "qualityOfLifeMediumRisk",
                    higherIsBetter: true,
                    formatId: "hundred_score",
                    value: 0,
                },
                {
                    name: "Avg. Quality of Life High Risk",
                    variable: "qualityOfLifeHighRisk",
                    higherIsBetter: true,
                    formatId: "hundred_score",
                    value: 0,
                },
            ],
        },
        {
            name: "Cost and Utilization",
            metrics: [
                {
                    name: "Total Incurred PMPM",
                    variable: "incurredCentsPerMemberPerMonth",
                    higherIsBetter: false,
                    formatId: "cents_to_dollars",
                    value: 0,
                },
                {
                    name: "Primary Care PMPM",
                    variable: "incurredPrimaryPmpm",
                    higherIsBetter: false,
                    formatId: "cents_to_dollars",
                    value: 0,
                },
                {
                    name: "Inpatient PMPM",
                    variable: "incurredInpatientPmpm",
                    higherIsBetter: false,
                    formatId: "cents_to_dollars",
                    value: 0,
                },
                {
                    name: "Outpatient PMPM",
                    variable: "incurredOutpatientPmpm",
                    higherIsBetter: false,
                    formatId: "cents_to_dollars",
                    value: 0,
                },
                {
                    name: "Specialty PMPM",
                    variable: "incurredSpecialtyPmpm",
                    higherIsBetter: false,
                    formatId: "cents_to_dollars",
                    value: 0,
                },
                {
                    name: "Pharmacy PMPM",
                    variable: "incurredDrugsPmpm",
                    higherIsBetter: false,
                    formatId: "cents_to_dollars",
                    value: 0,
                },
            ],
        },
        {
            name: "Quality Performance",
            metrics: [
                {
                    name: "Primary Care Participation Rate",
                    variable: "primaryCareParticipationRate",
                    higherIsBetter: true,
                    formatId: "percentage",
                    value: 0,
                },
                {
                    name: "Readmission Rate",
                    variable: "readmissionRate",
                    higherIsBetter: false,
                    formatId: "percentage",
                    value: 0,
                },
                {
                    name: "Generic Drug Prescription Rate",
                    variable: "genericDrugPerceptionFactor",
                    higherIsBetter: true,
                    formatId: "percentage",
                    value: 0,
                },
            ],
        },
        {
            name: "Member Experience",
            metrics: [
                {
                    name: "Trust in Providers",
                    variable: "providerTrustFactor",
                    higherIsBetter: true,
                    formatId: "hundred_score",
                    value: 0,
                },
                {
                    name: "Concerns about Affordability",
                    variable: "costAversionFactor",
                    higherIsBetter: false,
                    formatId: "hundred_score",
                    value: 0,
                },
                {
                    name: "Well-Managed Rate",
                    variable: "wellManagedRate",
                    higherIsBetter: true,
                    formatId: "percentage",
                    value: 0,
                },
            ],
        },
        {
            name: "Provider Experience",
            metrics: [
                {
                    name: "Level of Autonomy",
                    variable: "providerAutonomyFactor",
                    higherIsBetter: true,
                    formatId: "hundred_score",
                    value: 0,
                },
                {
                    name: "Reporting Burden",
                    variable: "providerReportingBurden",
                    higherIsBetter: false,
                    formatId: "hundred_score",
                    value: 0,
                },
                {
                    name: "Reimbursement Ratio",
                    variable: "desiredReimbursementRatio",
                    higherIsBetter: true,
                    formatId: "rate",
                    value: 0,
                },
            ],
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
        careAccessibilityFactor: 0.5,
        providerTrustFactor: 0.5,
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
                ffsSpecialty: specialtyOnlyFeeForServiceModel,
                ffsInpatient: inpatientCarveOutFeeForServiceModel,
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
Check the metrics at the top and right side for the impact of your decisions.
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
                    id: 'choose-benchmarks',
                    title: 'Choose Benchmarks',
                    description: 'Currently, providers have to do better than the regional average to get their performance bonuses. Providers complain about that, so we are considering benchmarking against their previous year\'s performance instead. They don\'t love that either.',
                    options: [
                        {
                            character: 'Medical Director',
                            description: 'Regional benchmarks feel unfair because you are going up against providers with much more resources. Competing with yourself from last year will be an easier sell.',
                            imageUrl: 'assets/characters/character-11.png',
                            label: 'Prior Year',
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
                            label: 'Regional Peers',
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
        {
            scenario: {
                title: 'Contract Year 2026',
                description: `
We have a high spend rate in specialty care such as knee surgery, chronic lung problems, or diabetes management.
Our goal is to launch an episodes of care model this year.
We will set a quality bar for the patient's health outcomes. The provider must pass the quality bar to earn payments.
If they spend less than our target, they keep some of the savings.
If they go over the target, they split the losses with the plan.
                `,
            },
            modelChanges: {},
            inputModifiers: {},
            decisions: [
                {
                    id: 'choose-episodes-model-condition',
                    title: 'Choose an Episode Condition',
                    description: 'We can only focus on one condition for our pilot. Should we pick Chronic Obstructed Pulmonary Disease (COPD) or Diabetes Management? Unfortunately, the expert on each condition says we should pick the other.',
                    options: [
                        {
                            character: 'Endocrinologist (Diabetes)',
                            description: 'While care for diabetes patients can exceed $16,000 per year, only roughly $9,600 can be attributed to the condition itself. This model could really shortchange providers.',
                            imageUrl: 'assets/characters/character-15.png',
                            label: 'COPD',
                            labelSuffix: 'Instead',
                            modelChanges: {
                                eoc: copdEpisodesModel,
                                ffsSpecialty: copdExcludedSpecialtyFeeForServiceModel,
                                ffsInpatient: null,
                            },
                            inputModifiers: {
                                primaryCareParticipationRate: 0.003,
                                utilizationPerMemberPerYearPrimary: 0.02,
                                utilizationPerMemberPerYearSpecialty: -0.02,
                                utilizationPerMemberPerYearInpatient: -0.005,
                                utilizationPerMemberPerYearDrugs: 0.05,
                                providerDesiredCentsPerUtilizationSpecialty: -0.05,
                                providerAutonomyFactor: -0.1,
                                providerReportingBurden: 0.1,
                                qualityOfLifeMediumRisk: 0.15,
                                readmissionRate: -0.03,
                            }
                        },
                        {
                            character: 'Pulmonologist (COPD)',
                            description: 'Treating COPD is extremely case-by-case. Choosing one set of quality measures and one cost target for all patients will inhibit providing the best care.',
                            imageUrl: 'assets/characters/character-12.png',
                            label: 'Diabetes',
                            labelSuffix: 'Instead',
                            modelChanges: {
                                eoc: diabetesEpisodesModel,
                                ffsSpecialty: diabetesExcludedSpecialtyFeeForServiceModel,
                                ffsInpatient: null,
                            },
                            inputModifiers: {
                                utilizationPerMemberPerYearPrimary: 0.01,
                                utilizationPerMemberPerYearSpecialty: -0.01,
                                utilizationPerMemberPerYearInpatient: -0.008,
                                utilizationPerMemberPerYearDrugs: 0.07,
                                providerDesiredCentsPerUtilizationSpecialty: 0.03,
                                providerAutonomyFactor: -0.1,
                                providerReportingBurden: 0.2,
                                qualityOfLifeHighRisk: 0.25,
                                readmissionRate: -0.05,
                            }
                        }
                    ],
                },
                {
                    id: 'launch-rewards-app',
                    title: 'Launch Diabetes Management App',
                    description: 'Our vendor offers a mobile app that rewards diabetes patients for keeping up with their medications, physical activity, and blood sugar checks. Should we roll it out to our members?',
                    options: [
                        {
                            character: 'Quality Improvement Manager',
                            description: 'This could be a great way to engage, educate, and empower patients to keep up with their care plan. The data from the app could also drive new care improvements.',
                            imageUrl: 'assets/characters/character-4.png',
                            modelChanges: {
                                rewards: rewardsAppCareCoordinationModel,
                            },
                            inputModifiers: {
                                qualityOfLifeMediumRisk: 0.004,
                                providerReportingBurden: -0.01,
                                providerTrustFactor: 0.03,
                                wellManagedRate: 0.05,
                                utilizationPerMemberPerYearDrugs: 0.05,
                            }
                        },
                        {
                            character: 'Social Worker',
                            description: 'I worry that people will find the app confusing, record inaccurate measurements, or become demotivated in the future if rewards are no longer offered.',
                            imageUrl: 'assets/characters/character-5.png',
                            modelChanges: {},
                            inputModifiers: {}
                        }
                    ],
                },
            ],
        },
    ]
}