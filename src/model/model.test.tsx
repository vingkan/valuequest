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
        utilizationPerMemberPerYearInpatientLowRisk: 0,
        utilizationPerMemberPerYearOutpatientLowRisk: 0,
        utilizationPerMemberPerYearPrimaryLowRisk: 0,
        utilizationPerMemberPerYearSpecialtyLowRisk: 0,
        utilizationPerMemberPerYearDrugsLowRisk: 0,
        utilizationPerMemberPerYearInpatientMediumRisk: 0,
        utilizationPerMemberPerYearOutpatientMediumRisk: 0,
        utilizationPerMemberPerYearPrimaryMediumRisk: 0,
        utilizationPerMemberPerYearSpecialtyMediumRisk: 0,
        utilizationPerMemberPerYearDrugsMediumRisk: 0,
        utilizationPerMemberPerYearInpatientHighRisk: 1,
        utilizationPerMemberPerYearOutpatientHighRisk: 0,
        utilizationPerMemberPerYearPrimaryHighRisk: 0,
        utilizationPerMemberPerYearSpecialtyHighRisk: 0,
        utilizationPerMemberPerYearDrugsHighRisk: 0,
        providerDesiredCentsPerUtilizationInpatient: 120000,
        providerDesiredCentsPerUtilizationOutpatient: 0,
        providerDesiredCentsPerUtilizationPrimary: 0,
        providerDesiredCentsPerUtilizationSpecialty: 0,
        providerDesiredCentsPerUtilizationDrugs: 0,
        memberSatisfaction: 0,
        qualityOfLife: 0,
        centsPerMemberPerMonth: 0,
        providerSatisfaction: 0,
        qualityOfLifeGiniIndex: 0,
    })
    expect(actual.memberSatisfaction).toBe(1)
    expect(actual.providerSatisfaction).toBe(1)
    // 2 high risk members * 1 IP util * $1200 cost per util = $2400
    // $2400 / 10 members = $240 / 12 months = $20 pmpm
    expect(actual.centsPerMemberPerMonth).toBe(2000)
    // All groups have the best quality of life
    expect(actual.qualityOfLife).toBe(1)
    // All groups have the same quality of life, so we have perfect equality
    expect(actual.qualityOfLifeGiniIndex).toBe(0)
})