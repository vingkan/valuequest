import { getGiniIndex } from './gini'
import { Variables } from './variables'

const MONTHS_PER_YEAR = 12
const RISK_LEVELS = [
    'LowRisk',
    'MediumRisk',
    'HighRisk',
]
const SERVICE_CATEGORIES = [
    'Inpatient',
    'Outpatient',
    'Primary',
    'Specialty',
    'Drugs',
]

type MemberSatisfactionFactors = {
    careAccessibilityFactor: number
    providerTrustFactor: number
    conditionsManagedRate: number
    wellManagedRate: number
    costAversionFactor: number
    readmissionRate: number
}

type LowerIsBetterFactors = {
    costAversionFactor: number
    readmissionRate: number
}

const MEMBER_SATISFACTION_WEIGHTS: MemberSatisfactionFactors = {
    careAccessibilityFactor: 1.0,
    costAversionFactor: 1.0,
    providerTrustFactor: 1.0,
    conditionsManagedRate: 1.0,
    wellManagedRate: 1.0,
    readmissionRate: 1.0,
}
const TOTAL_MEMBER_SATISFACTION_WEIGHT: number = (
    Object
        .values(MEMBER_SATISFACTION_WEIGHTS)
        .reduce((sum, value) => sum + value, 0)
)

function orFallback(value: number | undefined, fallback: number): number {
    return value === undefined ? fallback : value
}

export function getMemberSatisfaction(vars: Partial<Variables>): number {
    const careAccessibilityFactor = orFallback(vars?.careAccessibilityFactor, 1)
    const providerTrustFactor = orFallback(vars?.providerTrustFactor, 1)
    const conditionsManagedRate = orFallback(vars?.conditionsManagedRate, 1)
    const wellManagedRate = orFallback(vars?.wellManagedRate, 1)
    const costAversionFactor = orFallback(vars?.costAversionFactor, 0)
    const readmissionRate = orFallback(vars?.readmissionRate, 0)

    const lowerIsBetterFactors: LowerIsBetterFactors = {
        costAversionFactor,
        readmissionRate,
    }
    let reversedFactors: LowerIsBetterFactors = { ...lowerIsBetterFactors }
    Object.entries(lowerIsBetterFactors).forEach(([key, value]) => {
        const reversedValue = 1.0 - value
        reversedFactors[key] = reversedValue
    })

    const allFactors: MemberSatisfactionFactors = {
        careAccessibilityFactor,
        providerTrustFactor,
        conditionsManagedRate,
        wellManagedRate,
        ...reversedFactors,
    }
    let weightedSum = 0
    Object.entries(allFactors).forEach(([key, value]) => {
        const weight = MEMBER_SATISFACTION_WEIGHTS[key]
        const weighted = weight * value
        weightedSum += weighted
    })
    const satisfaction = weightedSum / TOTAL_MEMBER_SATISFACTION_WEIGHT
    return satisfaction
}

export function getProviderSatisfaction(vars: Partial<Variables>): number {
    return 1.0
}

export function getQualityOfLife(vars: Partial<Variables>): number {
    const {
        qualityOfLifeLowRisk = 0,
        qualityOfLifeMediumRisk = 0,
        qualityOfLifeHighRisk = 0,
        memberRateLowRisk = 0,
        memberRateMediumRisk = 0,
        memberRateHighRisk = 0,
    } = vars
    return (
        (qualityOfLifeLowRisk * memberRateLowRisk)
        + (qualityOfLifeMediumRisk * memberRateMediumRisk)
        + (qualityOfLifeHighRisk * memberRateHighRisk)
    )
}

export function getQualityOfLifeGiniIndex(vars: Partial<Variables>): number {
    const {
        qualityOfLifeLowRisk = 0,
        qualityOfLifeMediumRisk = 0,
        qualityOfLifeHighRisk = 0,
    } = vars
    return getGiniIndex([
        qualityOfLifeLowRisk,
        qualityOfLifeMediumRisk,
        qualityOfLifeHighRisk,
    ])
}

export function getCentsPerMemberPerMonth(vars: Partial<Variables>): number {
    const { memberCount } = vars
    if (!memberCount) return 0

    let totalCents = 0
    for (const category of SERVICE_CATEGORIES) {
        for (const level of RISK_LEVELS) {
            const rateName = `memberRate${level}`
            const utilBaseName = `utilizationPerMemberPerYear${category}`
            const utilFactorName = `utilizationFactor${level}`
            const costName = `providerDesiredCentsPerUtilization${category}`
            const rate = vars?.[rateName] || 0
            const utilBase = vars?.[utilBaseName] || 0
            const utilFactor = vars?.[utilFactorName] || 0
            const cost = vars?.[costName] || 0
            const members = memberCount * rate
            const util = utilBase * utilFactor
            const centsPerSegment = cost * util * members
            totalCents += centsPerSegment
        }
    }

    const centsPerMemberPerYear = totalCents / memberCount
    const centsPerMemberPerMonth = centsPerMemberPerYear / MONTHS_PER_YEAR
    return Math.floor(centsPerMemberPerMonth)
}