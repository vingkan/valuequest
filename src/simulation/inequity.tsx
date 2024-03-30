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

type PalmaFractionInputs = {
    memberRateLowRisk: number
    memberRateMediumRisk: number
    memberRateHighRisk: number
    qualityOfLifeLowRisk: number
    qualityOfLifeMediumRisk: number
    qualityOfLifeHighRisk: number
    minQualityOfLife: number
    maxQualityOfLife: number
}

type HistogramStep = {
    rate: number
    value: number
}

type HistogramBin = {
    rateStart: number
    rateEnd: number
    valueStart: number
    valueEnd: number
}

function getPercentile(values: PalmaFractionInputs, percentile: number): number {
    const {
        memberRateLowRisk,
        memberRateMediumRisk,
        memberRateHighRisk,
        qualityOfLifeLowRisk,
        qualityOfLifeMediumRisk,
        qualityOfLifeHighRisk,
        minQualityOfLife,
        maxQualityOfLife,
    } = values
    // Create histogram steps from the input data
    const steps: HistogramStep[] = [
        { rate: 0, value: minQualityOfLife },
        { rate: memberRateHighRisk, value: qualityOfLifeHighRisk },
        { rate: memberRateMediumRisk, value: qualityOfLifeMediumRisk },
        { rate: memberRateLowRisk, value: qualityOfLifeLowRisk },
        { rate: 1, value: maxQualityOfLife },
    ]
    // Order from lowest quality of life to highest
    const [s0, s1, s2, s3, s4] = steps.sort((a, b) => a.value - b.value)
    // Convert steps to bins
    let bins: HistogramBin[] = [
        {
            rateStart: s0.rate,
            rateEnd: s1.rate,
            valueStart: s0.value,
            valueEnd: s1.value,
        },
        {
            rateStart: s1.rate,
            rateEnd: s0.rate + s1.rate + s2.rate,
            valueStart: s1.value,
            valueEnd: s2.value,
        },
        {
            rateStart: s0.rate + s1.rate + s2.rate,
            rateEnd: s0.rate + s1.rate + s2.rate + s3.rate,
            valueStart: s2.value,
            valueEnd: s3.value,
        }
    ]

    // Traverse the histogram to estimate the value at the desired percentile
    let accumulatedRate = 0
    let estimatedValue = 0
    bins.forEach(({ rateStart, rateEnd, valueStart, valueEnd }) => {
        // Stop accumulating when we have amassed our desired percentile
        if (accumulatedRate >= percentile) return

        // If this step gets us closer to the remaining rate, then take it all
        const binRate = rateEnd - rateStart
        const remainingRate = percentile - accumulatedRate
        if (binRate <= remainingRate) {
            accumulatedRate += binRate
            estimatedValue = valueEnd
            return
        }
        // Otherwise, this step would put us over the desired percentile, so we
        // must calculate what fraction of the step to take
        const fractionOfRate = remainingRate / binRate
        const binHeight = valueEnd - valueStart
        const fractionalHeight = fractionOfRate * binHeight
        const fractionalValue = valueStart + fractionalHeight
        accumulatedRate += remainingRate
        estimatedValue = fractionalValue
        return
    })

    return estimatedValue
}

/*
 * Calculates the level of inequality in the input.
 * Defined as the fraction of the bottom 40% and top 10%, which is equivalent
 * to the fraction of the 40th percentile and 90th percentile values.
 * A value of 1 means the sickest people have the same quality of life as the
 * healthiest people. A value of 0.5 means the sickest people have half the
 * quality of life of the healthiest people.
 * https://uncounted.org/palma/
 */
export function getPalmaFraction(values: PalmaFractionInputs): number {
    const topValue90th = getPercentile(values, 0.9)
    const bottomValue40th = getPercentile(values, 0.4)

    const ratio = bottomValue40th / topValue90th
    return ratio
}