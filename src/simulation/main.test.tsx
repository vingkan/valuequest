import { expect, test } from 'vitest'
import { simulate } from './main.tsx'

test('run simulation with no payment models', () => {
    const inputs = {
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
        patientsPerProvider: 0,
        providerAutonomyFactor: 1,
        providerReportingBurden: 0,
    }
    const actual = simulate(inputs, [])
    expect(actual).toStrictEqual({
        ...inputs,
        // 2 high risk members * 1 IP util * $1200 cost per util = $2400
        costCentsInpatient: 240000,
        costCentsOutpatient: 0,
        costCentsPrimary: 0,
        costCentsSpecialty: 0,
        costCentsDrugs: 0,
        desiredReimbursementCents: 240000,
        actualReimbursementCents: 0,
        // Three of the six factors are 0.5, the other three are 1.0 -> 0.75 overall
        memberSatisfaction: 0.75,
        // Zero reimbursement, but other factors are perfect -> 0.5 overall
        providerSatisfaction: 0.5,
        // $2400 / 10 members = $240 / 12 months = $20 pmpm
        centsPerMemberPerMonth: 2000,
        // All groups have the best quality of life
        qualityOfLife: 1,
        // All groups have the same quality of life, so we have perfect equality
        qualityOfLifeGiniIndex: 0,
    })
})

test('run simulation with one simple payment model', () => {
    const inputs = {
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
        patientsPerProvider: 0,
        providerAutonomyFactor: 1,
        providerReportingBurden: 0,
    }
    const models = [
        { run: () => ({ paymentCents: 120000 }) }
    ]
    const actual = simulate(inputs, models)
    expect(actual).toStrictEqual({
        ...inputs,
        // 2 high risk members * 1 IP util * $1200 cost per util = $2400
        costCentsInpatient: 240000,
        costCentsOutpatient: 0,
        costCentsPrimary: 0,
        costCentsSpecialty: 0,
        costCentsDrugs: 0,
        desiredReimbursementCents: 240000,
        actualReimbursementCents: 120000,
        // Three of the six factors are 0.5, the other three are 1.0 -> 0.75 overall
        memberSatisfaction: 0.75,
        // Half reimbursement and other factors are perfect -> 0.75 overall
        providerSatisfaction: 0.75,
        // $2400 / 10 members = $240 / 12 months = $20 pmpm
        centsPerMemberPerMonth: 2000,
        // All groups have the best quality of life
        qualityOfLife: 1,
        // All groups have the same quality of life, so we have perfect equality
        qualityOfLifeGiniIndex: 0,
    })
})