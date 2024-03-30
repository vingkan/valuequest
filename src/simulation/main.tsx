import {
    getMemberSatisfaction,
    getQualityOfLife,
    getCentsPerMemberPerMonth,
    getProviderSatisfaction,
    getQualityOfLifeGiniIndex,
    getQualityOfLifePalmaFraction,
} from './aims.tsx'
import {
    getCostCentsByCategory,
    getDesiredReimbursementCents,
} from './cost.tsx'
import {
    PaymentModel,
    getActualReimbursementCents,
    getPaymentBreakdown,
    getPaymentModelOutputs,
} from './payment.tsx'
import { Inputs, Outputs, Variables } from './variables.tsx'

export function simulate(
    inputs: Inputs,
    models: PaymentModel[],
    debug: boolean = false
): Variables {
    const {
        memberCount = 0,
        primaryCareQualityImprovementFactor = 0,
        primaryCareParticipationRate = 0,
        readmissionReductionQualityImprovementFactor = 0,
        readmissionRate = 0,
        genericDrugCostDiscountFactor = 0,
        genericDrugPerceptionFactor = 0,
        genericPrescriptionRate = 0,
    } = inputs

    // Calculate factors that affect quality
    // TODO: Right now, none of these effects persist from year to year, which
    // could be a fair assumption, but consider whether they should persist
    // Increased primary care helps low risk patients stay healthy
    const primaryCareQualityImprovementFactorAchieved = (
        primaryCareParticipationRate * primaryCareQualityImprovementFactor
    )
    const qualityOfLifeLowRisk = (
        primaryCareQualityImprovementFactorAchieved
            * inputs.qualityOfLifeLowRisk
    )

    // Increased primary care increases member trust in providers
    const providerTrustFactor = (
        primaryCareQualityImprovementFactorAchieved * inputs.providerTrustFactor
    )
    // Increased primary care increases how well-managed members feel
    const wellManagedRate = (
        primaryCareQualityImprovementFactorAchieved * inputs.wellManagedRate
    )

    // Reduced readmission rate helps high risk patients stay healthy
    const reverseReadmissionRate = 1 - readmissionRate
    // TODO: This might be incorrect, it seems that reducing readmission rate
    // actually results in worse quality of life for high risk members
    const readmissionReductionQualityImprovementFactorAchieved = (
        reverseReadmissionRate * readmissionReductionQualityImprovementFactor
    )
    const qualityOfLifeHighRisk = (
        readmissionReductionQualityImprovementFactorAchieved
            * inputs.qualityOfLifeHighRisk
    )

    // Calculate factors that affect cost and utilization
    // Not all members who need primary care actually participate, increasing
    // participation increases primary care utilization
    const utilizationPerMemberPerYearPrimary = (
        primaryCareParticipationRate * inputs.utilizationPerMemberPerYearPrimary
    )

    // More readmissions increases inpatient utilization
    const readmissionUtilizationFactor = 1 + readmissionRate
    const utilizationPerMemberPerYearInpatient = (
        readmissionUtilizationFactor
            * inputs.utilizationPerMemberPerYearInpatient
    )

    // Prescribing more generic drugs unlocks more potential cost savings
    // because providers do not expect to be reimbursed as much for generics
    const genericDrugCostDiscountFactorAchieved = (
        genericPrescriptionRate * genericDrugCostDiscountFactor
    )
    const drugCostModifier = 1 - genericDrugCostDiscountFactorAchieved
    const providerDesiredCentsPerUtilizationDrugs = (
        drugCostModifier * inputs.providerDesiredCentsPerUtilizationDrugs
    )

    // Prescribing more genericf drugs reduces members' cost aversion because
    // they experience getting the drugs they need at a more affordable price
    const genericDrugPerceptionFactorAchieved = (
        genericPrescriptionRate * genericDrugPerceptionFactor
    )
    const genericDrugCostAversionModifier = (
        1 - genericDrugPerceptionFactorAchieved
    )
    const costAversionFactor = (
        genericDrugCostAversionModifier * inputs.costAversionFactor
    )

    // Calculate costs
    const costCentsByCategory = getCostCentsByCategory({
        ...inputs,
        utilizationPerMemberPerYearPrimary,
        utilizationPerMemberPerYearInpatient,
        providerDesiredCentsPerUtilizationDrugs,
    })
    const desiredReimbursementCents = getDesiredReimbursementCents({
        ...inputs,
        ...costCentsByCategory,
    })

    // Run payment models
    const payments = getPaymentModelOutputs(
        {
            ...inputs,
            ...costCentsByCategory,
            desiredReimbursementCents,
        },
        models,
    )
    const actualReimbursementCents = getActualReimbursementCents(payments)
    const breakdown = getPaymentBreakdown(payments, memberCount)
    if (debug) console.log(breakdown)

    // Calculate quintuple aim outputs
    const memberSatisfaction = getMemberSatisfaction({
        ...inputs,
        providerTrustFactor,
        wellManagedRate,
        costAversionFactor,
    })
    const qualityOfLife = getQualityOfLife({
        ...inputs,
        qualityOfLifeLowRisk,
        qualityOfLifeHighRisk,
    })
    const incurredCentsPerMemberPerMonth = getCentsPerMemberPerMonth(
        desiredReimbursementCents,
        memberCount
    )
    const paidCentsPerMemberPerMonth = getCentsPerMemberPerMonth(
        actualReimbursementCents,
        memberCount
    )
    const providerSatisfaction = getProviderSatisfaction({
        ...inputs,
        desiredReimbursementCents,
        actualReimbursementCents,
    })
    const qualityOfLifeGiniIndex = getQualityOfLifeGiniIndex({
        ...inputs,
        qualityOfLifeLowRisk,
        qualityOfLifeHighRisk,
    })
    const qualityOfLifePalmaFraction = getQualityOfLifePalmaFraction({
        ...inputs,
        qualityOfLifeLowRisk,
        qualityOfLifeHighRisk,
    })
    const outputs: Outputs = {
        ...costCentsByCategory,
        desiredReimbursementCents,
        actualReimbursementCents,
        memberSatisfaction,
        qualityOfLife,
        incurredCentsPerMemberPerMonth,
        paidCentsPerMemberPerMonth,
        providerSatisfaction,
        qualityOfLifeGiniIndex,
        qualityOfLifePalmaFraction,
    }
    const results =  {...inputs, ...outputs }
    return results
}