import {
    getMemberSatisfaction,
    getQualityOfLife,
    getCentsPerMemberPerMonth,
    getProviderSatisfaction,
    getQualityOfLifeGiniIndex,
} from './aims'

export function simulate(vars: Variables): Variables {
    const memberSatisfaction = getMemberSatisfaction(vars)
    const qualityOfLife = getQualityOfLife(vars)
    const centsPerMemberPerMonth = getCentsPerMemberPerMonth(vars)
    const providerSatisfaction = getProviderSatisfaction(vars)
    const qualityOfLifeGiniIndex = getQualityOfLifeGiniIndex(vars)
    const output = {
        ...vars,
        memberSatisfaction,
        qualityOfLife,
        centsPerMemberPerMonth,
        providerSatisfaction,
        qualityOfLifeGiniIndex,
    }
    return output
}