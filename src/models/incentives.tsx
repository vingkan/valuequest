import {
    PaymentModel,
    PaymentModelParams,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'

export type ThresholdConfig = {
    // Normally, the actual value must be greater than or equal to the threshold
    // to earn the bonus. For reverse measure values, the actual value must be
    // less than or equal to the threshold to earn the bonus.
    isReverseMeasure: boolean
    minimumThreshold: number
    bonusPerMemberPerYearCents: number
}

type ThresholdBonusParams = PaymentModelParams & {
    measures: Partial<Record<keyof Variables, ThresholdConfig>>
}

type ThresholdBonusInputs = Partial<Variables> & {
    memberCount: number
}

export function getThresholdBonusModel({
    name,
    measures
}: ThresholdBonusParams): PaymentModel {

    function run(vars: ThresholdBonusInputs): PaymentModelOutput {
        const { memberCount = 0 } = vars

        const bonuses = Object.entries(measures).map(([variableId, config]) => {
            const value = vars?.[variableId] || 0
            const metThreshold = (
                config.isReverseMeasure
                    ? value <= config.minimumThreshold
                    : value >= config.minimumThreshold
            )
            const bonus = metThreshold ? config.bonusPerMemberPerYearCents : 0
            const paymentCents = bonus * memberCount
            return paymentCents
        })

        const paymentCents = bonuses.reduce((sum, cents) => sum + cents, 0)
        return { paymentCents, name }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as ThresholdBonusInputs)
    }
}