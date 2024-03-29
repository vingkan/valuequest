import { expect, test } from 'vitest'
import {
    getPaymentModelOutputs,
    getActualReimbursementCents,
} from './payment.tsx'

test('calculate total reimbursement in cents', () => {
    const actual = getActualReimbursementCents([
        { paymentCents: 0 },
        { paymentCents: 10000 },
        { paymentCents: 50000 },
    ])
    expect(actual).toBe(60000)
})

test('run payment models', () => {
    const actual = getPaymentModelOutputs({}, [
        { run: () => ({ paymentCents: 0 }) },
        { run: () => ({ paymentCents: 10000 }) },
        { run: () => ({ paymentCents: 50000 }) },
    ])
    expect(actual).toStrictEqual([
        { paymentCents: 0 },
        { paymentCents: 10000 },
        { paymentCents: 50000 },
    ])
})