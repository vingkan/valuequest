import { expect, test } from 'vitest'
import { ServiceCategory } from '../simulation/cost.tsx'
import { getSimpleSharedSavingsModel } from './shared_savings.tsx'

test('shared savings model where spend exactly matches target', () => {
    const model = getSimpleSharedSavingsModel({
        targetSpendCentsPerMemberPerYear: 24000,
        providerSavingsRate: 1,
        providerLossRate: 1,
        includedCategories: [ServiceCategory.Inpatient],
    })
    const actual = model.run({
        memberCount: 100,
        costCentsInpatient: 2400000,
    })
    expect(actual).toStrictEqual({ paymentCents: 2400000 })
})

test('shared savings model where provider keeps half of the savings', () => {
    const model = getSimpleSharedSavingsModel({
        targetSpendCentsPerMemberPerYear: 30000,
        providerSavingsRate: 0.5,
        providerLossRate: 1,
        includedCategories: [ServiceCategory.Inpatient],
    })
    const actual = model.run({
        memberCount: 100,
        costCentsInpatient: 2400000,
    })
    expect(actual).toStrictEqual({ paymentCents: 2400000 + 300000 })
})

test('shared savings model where provider pays half of the losses', () => {
    const model = getSimpleSharedSavingsModel({
        targetSpendCentsPerMemberPerYear: 20000,
        providerSavingsRate: 1,
        providerLossRate: 0.5,
        includedCategories: [ServiceCategory.Inpatient],
    })
    const actual = model.run({
        memberCount: 100,
        costCentsInpatient: 2400000,
    })
    expect(actual).toStrictEqual({ paymentCents: 2400000 - 200000 })
})

test('shared savings model where provider has a cap on their losses', () => {
    const model = getSimpleSharedSavingsModel({
        targetSpendCentsPerMemberPerYear: 20000,
        providerSavingsRate: 1,
        providerLossRate: 0.5,
        providerStopLossCapCents: -100000,
        includedCategories: [ServiceCategory.Inpatient],
    })
    const actual = model.run({
        memberCount: 100,
        costCentsInpatient: 2400000,
    })
    expect(actual).toStrictEqual({ paymentCents: 2400000 - 100000 })
})