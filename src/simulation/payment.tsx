import { Variables } from './variables.tsx'

export type PaymentModelOutput = {
    paymentCents: number
}

export interface PaymentModel {
    run: (vars: Partial<Variables>) => PaymentModelOutput
}

export const EMPTY_PAYMENT_MODEL_OUTPUT: PaymentModelOutput = {
    paymentCents: 0,
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