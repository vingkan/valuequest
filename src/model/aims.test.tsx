import { expect, test } from 'vitest'
import {
    getMemberSatisfaction,
    getProviderSatisfaction,
    getQualityOfLife,
    getQualityOfLifeGiniIndex,
    getCentsPerMemberPerMonth,
} from './aims'

test('calculate default perfect member satisfaction', () => {
    const actual = getMemberSatisfaction({})
    expect(actual).toBe(1)
})

test('calculate half possible member satisfaction', () => {
    const actual = getMemberSatisfaction({
        careAccessibilityFactor: 0.5,
        providerTrustFactor: 0.5,
        conditionsManagedRate: 0.5,
        wellManagedRate: 0.5,
        costAversionFactor: 0.5,
        readmissionRate: 0.5,
    })
    expect(actual).toBe(0.5)
})

test('calculate worst possible member satisfaction', () => {
    const actual = getMemberSatisfaction({
        careAccessibilityFactor: 0,
        providerTrustFactor: 0,
        conditionsManagedRate: 0,
        wellManagedRate: 0,
        costAversionFactor: 1,
        readmissionRate: 1,
    })
    expect(actual).toBe(0)
})

test('calculate provider satisfaction', () => {
    const actual = getProviderSatisfaction({})
    expect(actual).toBe(1)
})

test('calculate average quality of life', () => {
    const actual = getQualityOfLife({
        qualityOfLifeLowRisk: 1,
        qualityOfLifeMediumRisk: 1,
        qualityOfLifeHighRisk: 0.5,
        memberRateLowRisk: 0.25,
        memberRateMediumRisk: 0.25,
        memberRateHighRisk: 0.5,
    })
    expect(actual).toBe(0.75)
})

test('calculate gini index of quality of life for perfect equality', () => {
    const actual = getQualityOfLifeGiniIndex({
        qualityOfLifeLowRisk: 1,
        qualityOfLifeMediumRisk: 1,
        qualityOfLifeHighRisk: 1,
    })
    expect(actual).toBe(0)
})

test('calculate gini index of same, but low quality of life', () => {
    const actual = getQualityOfLifeGiniIndex({
        qualityOfLifeLowRisk: 0.2,
        qualityOfLifeMediumRisk: 0.2,
        qualityOfLifeHighRisk: 0.2,
    })
    expect(actual).toBe(0)
})

test('calculate gini index of quality of life for some inequality', () => {
    const actual = getQualityOfLifeGiniIndex({
        qualityOfLifeLowRisk: 0.8,
        qualityOfLifeMediumRisk: 0.6,
        qualityOfLifeHighRisk: 0.6,
    })
    expect(actual).toBeCloseTo(0.13333, 5)
})

test('calculate gini index of quality of life for perfect inequality', () => {
    const actual = getQualityOfLifeGiniIndex({
        qualityOfLifeLowRisk: 1,
        qualityOfLifeMediumRisk: 0,
        qualityOfLifeHighRisk: 0,
    })
    expect(actual).toBe(1)
})

test('calculate pmpm in cents', () => {
    const actual = getCentsPerMemberPerMonth({
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
    // $2150 / 100 = $21.50 / 12 = $1.79166667 = $1.79
    expect(actual).toBe(179)
})

test('no members, no pmpm', () => {
    const actual = getCentsPerMemberPerMonth({
        memberRateLowRisk: 0.25,
        memberRateMediumRisk: 0.25,
        memberRateHighRisk: 0.5,
        utilizationPerMemberPerYearInpatient: 1,
        utilizationFactorHighRisk: 1.5,
        providerDesiredCentsPerUtilizationInpatient: 400,
    })
    expect(actual).toBe(0)
})