import { expect, test } from 'vitest'
import { getGiniIndex, getPalmaFraction } from './inequity.tsx'

test('calculate perfectly equal gini index', () => {
    const actual = getGiniIndex([10, 10])
    expect(actual).toBe(0)
})

test('calculate perfectly equal gini index with more groups', () => {
    const actual = getGiniIndex([20, 20, 20])
    expect(actual).toBe(0)
})

test('calculate perfectly inequal gini index', () => {
    const actual = getGiniIndex([0, 20])
    expect(actual).toBe(1)
})

test('calculate perfectly inequal gini index with more groups', () => {
    const actual = getGiniIndex([0, 0, 20])
    expect(actual).toBe(1)
})

test('calculate somewhat inequal gini index', () => {
    const actual = getGiniIndex([25, 75])
    expect(actual).toBe(0.5)
})

test('calculate gini index ignoring zero-value groups', () => {
    const actual = getGiniIndex([0, 0, 10, 10])
    expect(actual).toBe(0)
})

test('calculate palma fraction with no fractional steps', () => {
    const actual = getPalmaFraction({
        memberRateLowRisk: 0.1,
        memberRateMediumRisk: 0.5,
        memberRateHighRisk: 0.4,
        qualityOfLifeLowRisk: 1,
        qualityOfLifeMediumRisk: 0.8,
        qualityOfLifeHighRisk: 0.4,
        minQualityOfLife: 0,
        maxQualityOfLife: 1,
    })
    // Explanation
    // Need to combine high and med to get 90th percentile
    // 40th percentile = high risk = 0.4
    // 90th percentile = med risk = 0.8
    // ratio = 0.4 / 0.8 = 0.5
    expect(actual).toBe(0.5)
})

test('calculate palma fraction with fractional steps', () => {
    const actual = getPalmaFraction({
        memberRateLowRisk: 0.2,
        memberRateMediumRisk: 0.4,
        memberRateHighRisk: 0.4,
        qualityOfLifeLowRisk: 0.88,
        qualityOfLifeMediumRisk: 0.8,
        qualityOfLifeHighRisk: 0.14,
        minQualityOfLife: 0,
        maxQualityOfLife: 1,
    })
    // Explanation
    // Need half of low to get 90th percentile
    // 40th percentile = high risk = 0.14
    // 90th percentile = 0.8 + (0.5 * 0.8) = 0.84
    // ratio = 0.14 / 0.84 = 0.166...
    expect(actual).toBeCloseTo(0.166666, 5)
})

test('calculate palma fraction with unordered bins', () => {
    const actual = getPalmaFraction({
        memberRateLowRisk: 0.5,
        memberRateMediumRisk: 0.1,
        memberRateHighRisk: 0.4,
        qualityOfLifeLowRisk: 0.9,
        qualityOfLifeMediumRisk: 1,
        qualityOfLifeHighRisk: 0.4,
        minQualityOfLife: 0,
        maxQualityOfLife: 1,
    })
    // Explanation
    // Medium risk actually has higher quality of life than low risk, so they
    // become the new highest bin
    // 40th percentile = high risk = 0.4
    // 90th percentile = low risk = 0.9
    // ratio = 0.4 / 0.9 = 0.444...
    expect(actual).toBeCloseTo(0.444444, 5)
})

test('calculate palma fraction with perfect equality', () => {
    const actual = getPalmaFraction({
        memberRateLowRisk: 0.1,
        memberRateMediumRisk: 0.5,
        memberRateHighRisk: 0.4,
        qualityOfLifeLowRisk: 7,
        qualityOfLifeMediumRisk: 0.7,
        qualityOfLifeHighRisk: 0.7,
        minQualityOfLife: 0,
        maxQualityOfLife: 1,
    })
    // Explanation
    // The top and bottom have the same quality of life -> perfect equality
    // 40th percentile = high risk = 0.7
    // 90th percentile = med risk = 0.7
    // ratio = 0.7 / 0.7 = 1
    expect(actual).toBe(1)
})