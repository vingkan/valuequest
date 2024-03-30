import { expect, test } from 'vitest'
import { getThresholdBonusModel } from './incentives'

test('calculate bonus payment for one passing measure', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            medicationAdheranceRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.7,
                bonusPerMemberPerYearCents: 1700,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        medicationAdheranceRate: 0.8,
    })
    expect(actual).toStrictEqual({ paymentCents: 17000, name: 'bonus' })
})

test('calculate bonus payment for one barely passing measure', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            medicationAdheranceRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.7,
                bonusPerMemberPerYearCents: 1700,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        medicationAdheranceRate: 0.7,
    })
    expect(actual).toStrictEqual({ paymentCents: 17000, name: 'bonus' })
})

test('calculate bonus payment for one failing measure', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            medicationAdheranceRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.7,
                bonusPerMemberPerYearCents: 1700,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        medicationAdheranceRate: 0.69,
    })
    expect(actual).toStrictEqual({ paymentCents: 0, name: 'bonus' })
})

test('calculate bonus payment for one passing reverse measure', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            readmissionRate: {
                isReverseMeasure: true,
                minimumThreshold: 0.25,
                bonusPerMemberPerYearCents: 3400,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        readmissionRate: 0.1,
    })
    expect(actual).toStrictEqual({ paymentCents: 34000, name: 'bonus' })
})

test('calculate bonus payment for one barely passing reverse measure', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            readmissionRate: {
                isReverseMeasure: true,
                minimumThreshold: 0.25,
                bonusPerMemberPerYearCents: 3400,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        readmissionRate: 0.25,
    })
    expect(actual).toStrictEqual({ paymentCents: 34000, name: 'bonus' })
})

test('calculate bonus payment for one failing reverse measure', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            readmissionRate: {
                isReverseMeasure: true,
                minimumThreshold: 0.25,
                bonusPerMemberPerYearCents: 3400,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        readmissionRate: 0.26,
    })
    expect(actual).toStrictEqual({ paymentCents: 0, name: 'bonus' })
})

test('calculate bonus payment for multiple passing measures', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            medicationAdheranceRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.7,
                bonusPerMemberPerYearCents: 1700,
            },
            readmissionRate: {
                isReverseMeasure: true,
                minimumThreshold: 0.25,
                bonusPerMemberPerYearCents: 3400,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        medicationAdheranceRate: 0.9,
        readmissionRate: 0.15,
    })
    expect(actual).toStrictEqual({ paymentCents: 51000, name: 'bonus' })
})

test('calculate bonus payment for some passing measures', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            medicationAdheranceRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.7,
                bonusPerMemberPerYearCents: 1700,
            },
            readmissionRate: {
                isReverseMeasure: true,
                minimumThreshold: 0.25,
                bonusPerMemberPerYearCents: 3400,
            }
        }
    })
    const actual = model.run({
        memberCount: 10,
        medicationAdheranceRate: 0.4,
        readmissionRate: 0.15,
    })
    expect(actual).toStrictEqual({ paymentCents: 34000, name: 'bonus' })
})

test('no members, no payment', () => {
    const model = getThresholdBonusModel({
        name: 'bonus',
        measures: {
            medicationAdheranceRate: {
                isReverseMeasure: false,
                minimumThreshold: 0.7,
                bonusPerMemberPerYearCents: 1700,
            }
        }
    })
    const actual = model.run({
        memberCount: 0,
        medicationAdheranceRate: 0.8,
    })
    expect(actual).toStrictEqual({ paymentCents: 0, name: 'bonus' })
})