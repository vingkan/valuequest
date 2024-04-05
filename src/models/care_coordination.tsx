import {
    PaymentModel,
    PaymentModelParams,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'

const MONTHS_PER_YEAR = 12

type CareCoordinationParams = PaymentModelParams & {
    feePerMemberPerMonthCents: number
    fractionOfPopulation?: number
}

type CareCoordinationInputs = Partial<Variables> & {
    memberCount: number
}

export function getCareCoordinationModel({
    name,
    feePerMemberPerMonthCents,
    fractionOfPopulation,
}: CareCoordinationParams): PaymentModel {

    function run(vars: CareCoordinationInputs): PaymentModelOutput {
        const { memberCount = 0 } = vars
        const pmpy = MONTHS_PER_YEAR * feePerMemberPerMonthCents
        const populationFraction = fractionOfPopulation || 1
        const members = populationFraction * memberCount
        const paymentCents = pmpy * members
        return { paymentCents, name }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as CareCoordinationInputs)
    }
}