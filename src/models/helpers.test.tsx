import { expect, test } from 'vitest'
import { ServiceCategory } from '../simulation/cost.tsx'
import { getActualSpend } from './helpers.tsx'

test('calculate actual spend for given categories', () => {
    const actual = getActualSpend(
        {
            costCentsInpatient: 100,
            costCentsOutpatient: 200,
            costCentsPrimary: 300,
            costCentsSpecialty: 400,
            costCentsDrugs: 500,
        },
        [ServiceCategory.Outpatient, ServiceCategory.Drugs]
    )
    expect(actual).toBe(700)
})

test('no categories, no spend', () => {
    const actual = getActualSpend(
        {
            costCentsInpatient: 100,
            costCentsOutpatient: 200,
            costCentsPrimary: 300,
            costCentsSpecialty: 400,
            costCentsDrugs: 500,
        },
        []
    )
    expect(actual).toBe(0)
})