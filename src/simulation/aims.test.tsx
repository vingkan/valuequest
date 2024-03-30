import { expect, test } from 'vitest'
import {
    getMemberSatisfaction,
    getProviderSatisfaction,
    getQualityOfLife,
    getQualityOfLifeGiniIndex,
    getCentsPerMemberPerMonth,
} from './aims.tsx'

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

test('member satisfaction cannot be greater than one', () => {
    const actual = getMemberSatisfaction({
        careAccessibilityFactor: 3,
        providerTrustFactor: 1,
        conditionsManagedRate: 1,
        wellManagedRate: 1,
        costAversionFactor: 0,
        readmissionRate: 0,
    })
    expect(actual).toBe(1)
})

test('member satisfaction cannot be less than zero', () => {
    const actual = getMemberSatisfaction({
        careAccessibilityFactor: -30,
        providerTrustFactor: 1,
        conditionsManagedRate: 1,
        wellManagedRate: 1,
        costAversionFactor: 0,
        readmissionRate: 0,
    })
    expect(actual).toBe(0)
})

test('calculate default worst possible provider satisfaction', () => {
    const actual = getProviderSatisfaction({})
    expect(actual).toBe(0)
})

test('calculate best possible provider satisfaction', () => {
    const actual = getProviderSatisfaction({
        providerAutonomyFactor: 1,
        providerReportingBurden: 0,
        desiredReimbursementCents: 100000,
        actualReimbursementCents: 100000,
    })
    expect(actual).toBe(1)
})

test('calculate worst possible provider satisfaction', () => {
    const actual = getProviderSatisfaction({
        providerAutonomyFactor: 0,
        providerReportingBurden: 1,
        desiredReimbursementCents: 100000,
        actualReimbursementCents: 0,
    })
    expect(actual).toBe(0)
})

test('calculate underpaid provider satisfaction', () => {
    const actual = getProviderSatisfaction({
        providerAutonomyFactor: 1,
        providerReportingBurden: 0,
        desiredReimbursementCents: 100000,
        actualReimbursementCents: 0,
    })
    // Payment ratio is weighted to half of overall satisfaction, so being
    // perfect on the other factors, but having a payment ratio of zero leads to
    // an overall half satisfaction score
    expect(actual).toBe(0.5)
})

test('possible provider satisfaction cannot be greater than one', () => {
    const actual = getProviderSatisfaction({
        providerAutonomyFactor: 3,
        providerReportingBurden: 0,
        desiredReimbursementCents: 100000,
        actualReimbursementCents: 100000,
    })
    expect(actual).toBe(1)
})

test('possible provider satisfaction cannot be lower than zero', () => {
    const actual = getProviderSatisfaction({
        providerAutonomyFactor: -4,
        providerReportingBurden: 4,
        desiredReimbursementCents: 100000,
        actualReimbursementCents: 0,
    })
    expect(actual).toBe(0)
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

test('calculate average quality of life with mostly low risk members', () => {
    const actual = getQualityOfLife({
        qualityOfLifeLowRisk: 0.8,
        qualityOfLifeMediumRisk: 0.55,
        qualityOfLifeHighRisk: 0.4,
        memberRateLowRisk: 0.9,
        memberRateMediumRisk: 0.05,
        memberRateHighRisk: 0.05,
    })
    expect(actual).toBeCloseTo(0.7675, 5)
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
        memberCount: 10,
        desiredReimbursementCents: 2400,
    })
    // 2400 / 10 = 240 / 12 = 20
    expect(actual).toBe(20)
})

test('no members, no pmpm', () => {
    const actual = getCentsPerMemberPerMonth({
        desiredReimbursementCents: 2400,
    })
    expect(actual).toBe(0)
})

test('no cost, no pmpm', () => {
    const actual = getCentsPerMemberPerMonth({
        memberCount: 10,
    })
    expect(actual).toBe(0)
})