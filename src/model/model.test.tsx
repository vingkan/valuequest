import { expect, test } from 'vitest'
import { simulate } from './model'

test('simulate model', () => {
    const actual = simulate({
        memberCount: 10,
        memberRateLowRisk: 0.8,
        memberRateMediumRisk: 0,
        memberRateHighRisk: 0.2,
        qualityOfLifeLowRisk: 1,
        qualityOfLifeMediumRisk: 1,
        qualityOfLifeHighRisk: 1,
        utilizationPerMemberPerYearInpatient: 1,
        utilizationPerMemberPerYearOutpatient: 0,
        utilizationPerMemberPerYearPrimary: 0,
        utilizationPerMemberPerYearSpecialty: 0,
        utilizationPerMemberPerYearDrugs: 0,
        utilizationFactorLowRisk: 0,
        utilizationFactorMediumRisk: 0,
        utilizationFactorHighRisk: 1,
        providerDesiredCentsPerUtilizationInpatient: 120000,
        providerDesiredCentsPerUtilizationOutpatient: 0,
        providerDesiredCentsPerUtilizationPrimary: 0,
        providerDesiredCentsPerUtilizationSpecialty: 0,
        providerDesiredCentsPerUtilizationDrugs: 0,
        careAccessibilityFactor: 0.5,
        providerTrustFactor: 0.5,
        primaryCareParticipationRate: 1,
        preventionRate: 1,
        conditionsManagedRate: 0.5,
        wellManagedRate: 1,
        careGapClosureRate: 1,
        medicationAdheranceRate: 1,
        genericPrescriptionRate: 1,
        providerEfficiencyFactor: 1,
        costAversionFactor: 0,
        lengthOfStay: 1,
        readmissionRate: 0,
        memberSatisfaction: 0,
        qualityOfLife: 0,
        centsPerMemberPerMonth: 0,
        providerSatisfaction: 0,
        qualityOfLifeGiniIndex: 0,
    })
    // Three of the six factors are 0.5, the other three are 1.0 -> 0.75 overall
    expect(actual.memberSatisfaction).toBe(0.75)
    expect(actual.providerSatisfaction).toBe(1)
    // 2 high risk members * 1 IP util * $1200 cost per util = $2400
    // $2400 / 10 members = $240 / 12 months = $20 pmpm
    expect(actual.centsPerMemberPerMonth).toBe(2000)
    // All groups have the best quality of life
    expect(actual.qualityOfLife).toBe(1)
    // All groups have the same quality of life, so we have perfect equality
    expect(actual.qualityOfLifeGiniIndex).toBe(0)
})