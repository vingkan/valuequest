import { expect, test } from 'vitest'
import { ServiceCategory } from '../simulation/cost.tsx'
import { getSimpleFeeForServiceModel } from './fee_for_service.tsx'

test('fee for service model with full reimbursement', () => {
    const model = getSimpleFeeForServiceModel({
        name: 'ffs',
        reimbursementRate: 1,
        includedCategories: [ServiceCategory.Inpatient],
    })
    const actual = model.run({
        costCentsInpatient: 3000000,
    })
    expect(actual).toStrictEqual({ paymentCents: 3000000, name: 'ffs' })
})

test('fee for service model with partial reimbursement', () => {
    const model = getSimpleFeeForServiceModel({
        name: 'ffs',
        reimbursementRate: 0.7,
        includedCategories: [ServiceCategory.Inpatient],
    })
    const actual = model.run({
        costCentsInpatient: 1000000,
    })
    expect(actual).toStrictEqual({ paymentCents: 700000, name: 'ffs' })
})