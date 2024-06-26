import { ServiceCategory } from '../simulation/cost.tsx'
import {
    PaymentModel,
    PaymentModelParams,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'
import { CategoryCostVariables, getActualSpend } from './helpers.tsx'

type SharedSavingsParams = PaymentModelParams & {
    targetSpendCentsPerMemberPerYear: number
    providerSavingsRate: number
    providerLossRate: number
    providerStopLossCapCents?: number
    fractionOfPopulationCovered?: number
    fractionOfCostCovered?: number
    includedCategories: ServiceCategory[]
}

type SharedSavingsInputs = Partial<Variables> & CategoryCostVariables & {
    memberCount: number
}

export function getSimpleSharedSavingsModel({
    name,
    targetSpendCentsPerMemberPerYear,
    providerSavingsRate,
    providerLossRate,
    providerStopLossCapCents,
    fractionOfPopulationCovered,
    fractionOfCostCovered,
    includedCategories
}: SharedSavingsParams): PaymentModel {

    const stopLossCapCents = (
        providerStopLossCapCents === undefined
            ? -Infinity
            : providerStopLossCapCents
    )

    function run(vars: SharedSavingsInputs): PaymentModelOutput {
        const { memberCount } = vars

        // Calculate actual spend
        const spendCents = getActualSpend(vars, includedCategories)
        const costFraction = fractionOfCostCovered || 1
        const actualSpendCents = costFraction * spendCents

        // Calculate target spend
        const populationFraction = fractionOfPopulationCovered || 1
        const members = populationFraction * memberCount
        const targetSpendCents = targetSpendCentsPerMemberPerYear * members

        // Calculated savings or losses
        // If positive, savings; if negative, loss
        const netCents = targetSpendCents - actualSpendCents
        const isSavings = netCents > 0

        // Apply shared savings or losses to payment amount
        let paymentCents = actualSpendCents
        if (isSavings) {
            const sharedSavingsCents = netCents * providerSavingsRate
            paymentCents += sharedSavingsCents
        } else {
            const sharedLossCents = netCents * providerLossRate
            // Both values are negative, so use max to get the lower loss
            const cappedLossCents = Math.max(sharedLossCents, stopLossCapCents)
            paymentCents += cappedLossCents
        }

        return { paymentCents, name }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as SharedSavingsInputs)
    }
}