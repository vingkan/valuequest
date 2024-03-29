import { ServiceCategory } from '../simulation/cost'
import {
    PaymentModel,
    PaymentModelOutput,
} from '../simulation/payment'
import { Variables } from '../simulation/variables'

type SharedSavingsParams = {
    targetSpendCentsPerMemberPerYear: number
    providerSavingsRate: number
    providerLossRate: number
    providerStopLossCapCents?: number
    includedCategories: ServiceCategory[]
}

type SharedSavingsInputs = Partial<Variables> & {
    memberCount: number
    costCentsInpatient: number
    costCentsOutpatient: number
    costCentsPrimary: number
    costCentsSpecialty: number
    costCentsDrugs: number
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
        const actualSpendCents = includedCategories.reduce((sum, category) => {
            const costName = `costCents${category}`
            const costCents = vars?.[costName] || 0
            return sum + costCents
        }, 0)

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