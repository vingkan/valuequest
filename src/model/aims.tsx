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

export function getMemberSatisfaction(vars: Partial<Variables>): number {
    return 1.0
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