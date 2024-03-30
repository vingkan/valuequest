import { ServiceCategory } from '../simulation/cost.tsx'
import {
    PaymentModel,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'
import { CategoryCostVariables, getActualSpend } from './helpers.tsx'

type SharedSavingsParams = {
    targetSpendCentsPerMemberPerYear: number
    providerSavingsRate: number
    providerLossRate: number
    providerStopLossCapCents?: number
    includedCategories: ServiceCategory[]
}

type SharedSavingsInputs = Partial<Variables> & CategoryCostVariables & {
    memberCount: number
}

export function getSimpleSharedSavingsModel({
    targetSpendCentsPerMemberPerYear,
    providerSavingsRate,
    providerLossRate,
    providerStopLossCapCents,
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
        const actualSpendCents = getActualSpend(vars, includedCategories)

        // Calculate target spend
        const targetSpendCents = targetSpendCentsPerMemberPerYear * memberCount

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

        return { paymentCents }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as SharedSavingsInputs)
    }
}