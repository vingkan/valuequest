import { ServiceCategory } from '../simulation/cost'

export type CategoryCostVariables = {
    costCentsInpatient: number
    costCentsOutpatient: number
    costCentsPrimary: number
    costCentsSpecialty: number
    costCentsDrugs: number
}

export function getActualSpend(
    vars: CategoryCostVariables,
    includedCategories: ServiceCategory[]
): number {
    const actualSpendCents = includedCategories.reduce((sum, category) => {
        const costName = `costCents${category}`
        const costCents = vars?.[costName] || 0
        return sum + costCents
    }, 0)
    return actualSpendCents
}