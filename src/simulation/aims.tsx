import { getGiniIndex } from './gini.tsx'
import { Variables } from './variables.tsx'

const MONTHS_PER_YEAR = 12

type MemberSatisfactionFactors = {
    careAccessibilityFactor: number
    providerTrustFactor: number
    conditionsManagedRate: number
    wellManagedRate: number
    costAversionFactor: number
    readmissionRate: number
}

const MEMBER_SATISFACTION_WEIGHTS: MemberSatisfactionFactors = {
    careAccessibilityFactor: 1.0,
    costAversionFactor: 1.0,
    providerTrustFactor: 1.0,
    conditionsManagedRate: 1.0,
    wellManagedRate: 1.0,
    readmissionRate: 1.0,
}

function orFallback(value: number | undefined, fallback: number): number {
    return value === undefined ? fallback : value
}

type FactorMap = {[key: string]: number}

function getWeightedSum<T extends FactorMap>(factors: T, weights: T): number {
    let sum = 0
    Object.entries(factors).forEach(([key, value]) => {
        const weight = weights[key]
        const weighted = weight * value
        sum += weighted
    })
    const totalWeights = (
        Object
            .values(weights)
            .reduce((sum, value) => sum + value, 0)
    )
    const weightedSum = sum / totalWeights
    return weightedSum
}

export function getMemberSatisfaction(vars: Partial<Variables>): number {
    const careAccessibilityFactor = orFallback(vars?.careAccessibilityFactor, 1)
    const providerTrustFactor = orFallback(vars?.providerTrustFactor, 1)
    const conditionsManagedRate = orFallback(vars?.conditionsManagedRate, 1)
    const wellManagedRate = orFallback(vars?.wellManagedRate, 1)
    const costAversionFactor = orFallback(vars?.costAversionFactor, 0)
    const readmissionRate = orFallback(vars?.readmissionRate, 0)

    const factors: MemberSatisfactionFactors = {
        careAccessibilityFactor,
        providerTrustFactor,
        conditionsManagedRate,
        wellManagedRate,
        // Reversed Factors
        costAversionFactor: 1 - costAversionFactor,
        readmissionRate: 1 - readmissionRate,
    }
    const satisfaction = getWeightedSum(factors, MEMBER_SATISFACTION_WEIGHTS)
    return satisfaction
}

type ProviderSatisfactionFactors = {
    providerAutonomyFactor: number
    paymentRatio: number
    providerReportingBurden: number
}

const PROVIDER_SATISFACTION_WEIGHTS: ProviderSatisfactionFactors = {
    providerAutonomyFactor: 0.25,
    paymentRatio: 0.5,
    providerReportingBurden: 0.25,
}

export function getProviderSatisfaction(vars: Partial<Variables>): number {
    const {
        providerAutonomyFactor,
        providerReportingBurden,
        desiredReimbursementCents,
        actualReimbursementCents,
    } = vars
    if (
        providerAutonomyFactor === undefined
        || providerReportingBurden === undefined
        || desiredReimbursementCents === 0
        || desiredReimbursementCents === undefined
        || actualReimbursementCents === undefined
    ) return 0

    const paymentRatio = actualReimbursementCents / desiredReimbursementCents
    const factors: ProviderSatisfactionFactors = {
        providerAutonomyFactor,
        paymentRatio,
        // Reverse Factors
        providerReportingBurden: 1 - providerReportingBurden,
    }
    const satisfaction = getWeightedSum(factors, PROVIDER_SATISFACTION_WEIGHTS)
    return satisfaction
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
    const {
        memberCount,
        desiredReimbursementCents
    } = vars
    if (!memberCount || !desiredReimbursementCents) return 0

    const centsPerMemberPerYear = desiredReimbursementCents / memberCount
    const centsPerMemberPerMonth = centsPerMemberPerYear / MONTHS_PER_YEAR
    return Math.floor(centsPerMemberPerMonth)
}