import {
    getMemberSatisfaction,
    getQualityOfLife,
    getCentsPerMemberPerMonth,
    getProviderSatisfaction,
    getQualityOfLifeGiniIndex,
} from './aims'
import {
    getCostCentsByCategory,
    getDesiredReimbursementCents,
} from './cost'
import { Inputs, Outputs, Variables } from './variables'

export function simulate(inputs: Inputs): Variables {
    const costCentsByCategory = getCostCentsByCategory(inputs)
    const desiredReimbursementCents = getDesiredReimbursementCents({
        ...inputs,
        ...costCentsByCategory,
    })

    const memberSatisfaction = getMemberSatisfaction(inputs)
    const qualityOfLife = getQualityOfLife(inputs)
    const centsPerMemberPerMonth = getCentsPerMemberPerMonth({
        ...inputs,
        desiredReimbursementCents,
    })
    const providerSatisfaction = getProviderSatisfaction({
        ...inputs,
        desiredReimbursementCents,
    })
    const qualityOfLifeGiniIndex = getQualityOfLifeGiniIndex(inputs)
    const outputs: Outputs = {
        ...costCentsByCategory,
        desiredReimbursementCents,
        memberSatisfaction,
        qualityOfLife,
        centsPerMemberPerMonth,
        providerSatisfaction,
        qualityOfLifeGiniIndex,
    }
    const results =  {...inputs, ...outputs }
    return results
}