import { expect, test } from 'vitest'
import { getGiniIndex } from './gini'

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