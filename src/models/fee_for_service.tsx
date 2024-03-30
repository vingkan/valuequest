import { ServiceCategory } from '../simulation/cost.tsx'
import {
    PaymentModel,
    PaymentModelParams,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'
import { CategoryCostVariables, getActualSpend } from './helpers.tsx'

type FeeForServiceParams = PaymentModelParams & {
    reimbursementRate: number
    includedCategories: ServiceCategory[]
}

type FeeForServiceInputs = Partial<Variables> & CategoryCostVariables

export function getSimpleFeeForServiceModel({
    name,
    reimbursementRate,
    includedCategories
}: FeeForServiceParams): PaymentModel {

    function run(vars: FeeForServiceInputs): PaymentModelOutput {
        const actualSpendCents = getActualSpend(vars, includedCategories)
        const paymentCents = reimbursementRate * actualSpendCents
        return { paymentCents, name }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as FeeForServiceInputs)
    }
}