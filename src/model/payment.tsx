import { Variables } from './variables'

export type PaymentModelOutput = {
    paymentCents: number
}

export interface PaymentModel {
    run: (vars: Partial<Variables>) => PaymentModelOutput
}

export function getPaymentModelOutputs(
    vars: Partial<Variables>,
    models: PaymentModel[]
): PaymentModelOutput[] {
    return models.map((model) => model.run(vars))
}

export function getActualReimbursementCents(
    outputs: PaymentModelOutput[]
): number {
    return outputs.reduce((total, output) => total + output.paymentCents, 0)
}