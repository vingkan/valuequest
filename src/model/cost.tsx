import { Variables } from './variables'

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

export function getDesiredReimbursementCents(vars: Partial<Variables>): number {
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
    return totalCents
}