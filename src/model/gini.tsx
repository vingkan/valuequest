/*
 * Calculates the level of inequality in the input.
 * An output of 0 is perfectly equal and 1 is perfectly inequal.
 * https://www.statsdirect.com/help/nonparametric_methods/gini_coefficient.htm
 */
export function getGiniIndex(values: number[]): number {
    // Methodology does not support negative values
    const valid = values.filter((value) => value > 0)
    const n = valid.length
    const ordered = valid.sort((a, b) => a - b)

    // If there is only one non-zero value, there is perfect inequality
    if (n === 1) return 1

    let weightedSum = 0
    let totalSum = 0
    ordered.forEach((x, j) => {
        const i = j + 1
        const partialSum = ((2 * i) - n - 1) * x
        totalSum += x
        weightedSum += partialSum
    })

    const gini = (2 * weightedSum) / (n * totalSum)
    return gini
}