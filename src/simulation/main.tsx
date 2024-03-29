import {
    getMemberSatisfaction,
    getQualityOfLife,
    getCentsPerMemberPerMonth,
    getProviderSatisfaction,
    getQualityOfLifeGiniIndex,
} from './aims.tsx'
import {
    getCostCentsByCategory,
    getDesiredReimbursementCents,
} from './cost.tsx'
import {
    PaymentModel,
    getPaymentModelOutputs,
    getActualReimbursementCents
} from './payment.tsx'
import { Inputs, Outputs, Variables } from './variables.tsx'

export function simulate(inputs: Inputs, models: PaymentModel[]): Variables {
    // Calculate costs
    const costCentsByCategory = getCostCentsByCategory(inputs)
    const desiredReimbursementCents = getDesiredReimbursementCents({
        ...inputs,
        ...costCentsByCategory,
    })

    // Run payment models
    const payments = getPaymentModelOutputs(
        {
            ...inputs,
            ...costCentsByCategory,
            desiredReimbursementCents,
        },
        models,
    )
    const actualReimbursementCents = getActualReimbursementCents(payments)

    // Calculate quintuple aim outputs
    const memberSatisfaction = getMemberSatisfaction(inputs)
    const qualityOfLife = getQualityOfLife(inputs)
    const centsPerMemberPerMonth = getCentsPerMemberPerMonth({
        ...inputs,
        desiredReimbursementCents,
    })
    const providerSatisfaction = getProviderSatisfaction({
        ...inputs,
        desiredReimbursementCents,
        actualReimbursementCents,
    })
    const qualityOfLifeGiniIndex = getQualityOfLifeGiniIndex(inputs)
    const outputs: Outputs = {
        ...costCentsByCategory,
        desiredReimbursementCents,
        actualReimbursementCents,
        memberSatisfaction,
        qualityOfLife,
        centsPerMemberPerMonth,
        providerSatisfaction,
        qualityOfLifeGiniIndex,
    }
    const results =  {...inputs, ...outputs }
    return results
}