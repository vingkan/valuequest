import {
    getMemberSatisfaction,
    getQualityOfLife,
    getCentsPerMemberPerMonth,
    getProviderSatisfaction,
    getQualityOfLifeGiniIndex,
} from './aims'
import { getDesiredReimbursementCents } from './cost'

export function simulate(vars: Variables): Variables {
    const desiredReimbursementCents = getDesiredReimbursementCents(vars)

    const memberSatisfaction = getMemberSatisfaction(vars)
    const qualityOfLife = getQualityOfLife(vars)
    const centsPerMemberPerMonth = getCentsPerMemberPerMonth({
        ...vars,
        desiredReimbursementCents,
    })
    const providerSatisfaction = getProviderSatisfaction({
        ...vars,
        desiredReimbursementCents,
    })
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