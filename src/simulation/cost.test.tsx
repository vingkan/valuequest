import { expect, test } from 'vitest'
import {
    getCostCentsByCategory,
    getDesiredReimbursementCents,
} from './cost.tsx'

test('calculate cost by category in cents', () => {
    const actual = getCostCentsByCategory({
        memberCount: 100,
        memberRateLowRisk: 0.25,
        memberRateMediumRisk: 0.25,
        memberRateHighRisk: 0.5,
        utilizationPerMemberPerYearInpatient: 1,
        utilizationFactorLowRisk: 0,
        utilizationFactorMediumRisk: 1.5,
        utilizationFactorHighRisk: 10,
        providerDesiredCentsPerUtilizationInpatient: 400,
    })
    // 50 high risk members * 10 IP utils * $4 per util = $2000
    // 25 medium risk members * 1.5 IP utils * $4 per util = $150
    // 25 low risk members * 0 IP utils * $4 per util = $0
    expect(actual).toStrictEqual({
        costCentsInpatient: 215000,
        costCentsOutpatient: 0,
        costCentsPrimary: 0,
        costCentsSpecialty: 0,
        costCentsDrugs: 0,
    })
})

test('calculate total desired cost in cents', () => {
    const actual = getDesiredReimbursementCents({
        costCentsInpatient: 200000,
        costCentsOutpatient: 0,
        costCentsPrimary: 0,
        costCentsSpecialty: 0,
        costCentsDrugs: 10000,
    })
    expect(actual).toBe(210000)
})