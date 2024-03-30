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
    getActualReimbursementCents,
    getPaymentBreakdown,
    getPaymentModelOutputs,
} from './payment.tsx'
import { Inputs, Outputs, Variables } from './variables.tsx'

export function simulate(
    inputs: Inputs,
    models: PaymentModel[],
    debug: boolean = false
): Variables {
    const { memberCount = 0 } = inputs

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
    const breakdown = getPaymentBreakdown(payments, memberCount)
    if (debug) console.log(breakdown)

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