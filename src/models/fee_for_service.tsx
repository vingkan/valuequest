import { ServiceCategory } from '../simulation/cost.tsx'
import {
    PaymentModel,
    PaymentModelOutput,
} from '../simulation/payment.tsx'
import { Variables } from '../simulation/variables.tsx'
import { CategoryCostVariables, getActualSpend } from './helpers.tsx'

type FeeForServiceParams = {
    reimbursementRate: number
    includedCategories: ServiceCategory[]
}

type FeeForServiceInputs = Partial<Variables> & CategoryCostVariables

export function getSimpleFeeForServiceModel({
    reimbursementRate,
    includedCategories
}: FeeForServiceParams): PaymentModel {

    function run(vars: FeeForServiceInputs): PaymentModelOutput {
        const actualSpendCents = getActualSpend(vars, includedCategories)
        const paymentCents = reimbursementRate * actualSpendCents
        return { paymentCents }
    }

    return {
        run: (vars: Partial<Variables>) => run(vars as FeeForServiceInputs)
    }
}