import { expect, test } from 'vitest'
import { getCareCoordinationModel } from './care_coordination.tsx'

test('calculate care coordination fees', () => {
    const model = getCareCoordinationModel({
        name: 'ccf',
        feePerMemberPerMonthCents: 200
    })
    const actual = model.run({
        memberCount: 100
    })
    expect(actual).toStrictEqual({ paymentCents: 240000, name: 'ccf' })
})

test('no members, no payment', () => {
    const model = getCareCoordinationModel({
        name: 'ccf',
        feePerMemberPerMonthCents: 200
    })
    const actual = model.run({
        memberCount: 0
    })
    expect(actual).toStrictEqual({ paymentCents: 0, name: 'ccf' })
})