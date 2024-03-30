import { Variables } from './variables.tsx'

const MONTHS_PER_YEAR = 12

export type PaymentModelParams = {
    name?: string
}

export type PaymentModelOutput = {
    paymentCents: number
    name?: string
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

export type PaymentBreakdown = {
    totalPaymentCents: number
    averagePaymentPerMemberPerYearCents: number
    averagePaymentPerMemberPerMonthCents: number
    memberCount: number,
    models: {
        [name: string]: {
            totalPaymentCents: number
            averagePaymentPerMemberPerYearCents: number
            averagePaymentPerMemberPerMonthCents: number
        }
    }
}

export function getPaymentBreakdown(
    outputs: PaymentModelOutput[],
    memberCount: number
): PaymentBreakdown {
    let totalCents = 0
    let centsByModel = {}
    outputs.forEach(({ paymentCents, name}) => {
        const modelName = name || 'unknown'
        const pmpy = memberCount ? paymentCents / memberCount : 0
        centsByModel[modelName] = {
            totalPaymentCents: paymentCents,
            averagePaymentPerMemberPerYearCents: pmpy,
            averagePaymentPerMemberPerMonthCents: pmpy / MONTHS_PER_YEAR,
        }
        totalCents += paymentCents
    })
    const totalPmpy = memberCount ? totalCents / memberCount : 0
    return {
        totalPaymentCents: totalCents,
        averagePaymentPerMemberPerYearCents: totalPmpy,
        averagePaymentPerMemberPerMonthCents: totalPmpy / MONTHS_PER_YEAR,
        memberCount,
        models: centsByModel,
    }
}

export function getActualReimbursementCents(
    outputs: PaymentModelOutput[]
): number {
    return outputs.reduce((total, output) => total + output.paymentCents, 0)
}