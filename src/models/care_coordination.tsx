import {
    PaymentModel,
    PaymentModelParams,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'

const MONTHS_PER_YEAR = 12

type CareCoordinationParams = PaymentModelParams & {
    feePerMemberPerMonthCents: number
}

type CareCoordinationInputs = Partial<Variables> & {
    memberCount: number
}

export function getCareCoordinationModel({
    name,
    feePerMemberPerMonthCents
}: CareCoordinationParams): PaymentModel {

    function run(vars: CareCoordinationInputs): PaymentModelOutput {
        const { memberCount = 0 } = vars
        const pmpy = MONTHS_PER_YEAR * feePerMemberPerMonthCents
        const paymentCents = pmpy * memberCount
        return { paymentCents, name }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as CareCoordinationInputs)
    }
}