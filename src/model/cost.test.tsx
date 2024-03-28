import { expect, test } from 'vitest'
import { getDesiredReimbursementCents } from './cost'

test('calculate total desired cost in cents', () => {
    const actual = getDesiredReimbursementCents({
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
    expect(actual).toBe(215000)
})

test('no members, no cost', () => {
    const actual = getDesiredReimbursementCents({
        memberRateLowRisk: 0.25,
        memberRateMediumRisk: 0.25,
        memberRateHighRisk: 0.5,
        utilizationPerMemberPerYearInpatient: 1,
        utilizationFactorHighRisk: 1.5,
        providerDesiredCentsPerUtilizationInpatient: 400,
    })
    expect(actual).toBe(0)
})