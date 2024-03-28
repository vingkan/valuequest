import { Outputs, Variables } from './variables'

type CostByCategory = {
    costCentsInpatient: number
    costCentsOutpatient: number
    costCentsPrimary: number
    costCentsSpecialty: number
    costCentsDrugs: number
}

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

export function getCostCentsByCategory(
    vars: Partial<Variables>
): CostByCategory {
    const { memberCount } = vars
    let costCentsByCategory: CostByCategory = {
        costCentsInpatient: 0,
        costCentsOutpatient: 0,
        costCentsPrimary: 0,
        costCentsSpecialty: 0,
        costCentsDrugs: 0,
    }
    if (!memberCount) return costCentsByCategory

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

            const outputName = `costCents${category}`
            costCentsByCategory[outputName] += centsPerSegment
        }
    }
    return costCentsByCategory
}

export function getDesiredReimbursementCents(vars: Partial<Variables>): number {
    let totalCents = 0
    for (const category of SERVICE_CATEGORIES) {
        const outputName = `costCents${category}`
        const centsPerSegment = vars?.[outputName] || 0
        totalCents += centsPerSegment
    }
    return totalCents
}