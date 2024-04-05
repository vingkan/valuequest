export type Inputs = {
    // Cost and Utilization Factors
    memberCount: number
    memberRateLowRisk: number
    memberRateMediumRisk: number
    memberRateHighRisk: number
    qualityOfLifeLowRisk: number
    qualityOfLifeMediumRisk: number
    qualityOfLifeHighRisk: number
    utilizationPerMemberPerYearInpatient: number
    utilizationPerMemberPerYearOutpatient: number
    utilizationPerMemberPerYearPrimary: number
    utilizationPerMemberPerYearSpecialty: number
    utilizationPerMemberPerYearDrugs: number
    utilizationFactorLowRisk: number
    utilizationFactorMediumRisk: number
    utilizationFactorHighRisk: number
    providerDesiredCentsPerUtilizationInpatient: number
    providerDesiredCentsPerUtilizationOutpatient: number
    providerDesiredCentsPerUtilizationPrimary: number
    providerDesiredCentsPerUtilizationSpecialty: number
    providerDesiredCentsPerUtilizationDrugs: number
    genericDrugCostDiscountFactor: number
    // Quality Factors
    // Higher is Better
    careAccessibilityFactor: number
    providerTrustFactor: number
    primaryCareParticipationRate: number
    preventionRate: number
    conditionsManagedRate: number
    wellManagedRate: number
    careGapClosureRate: number
    medicationAdheranceRate: number
    genericPrescriptionRate: number
    providerEfficiencyFactor: number
    // Lower is Better
    costAversionFactor: number
    lengthOfStay: number
    readmissionRate: number
    // Quality Improvement Factors
    primaryCareQualityImprovementFactor: number
    readmissionReductionQualityImprovementFactor: number
    genericDrugPerceptionFactor: number
    // Provider Factors
    patientsPerProvider: number
    providerAutonomyFactor: number
    providerReportingBurden: number
}

export type Outputs = {
    // Costs
    costCentsInpatient: number
    costCentsOutpatient: number
    costCentsPrimary: number
    costCentsSpecialty: number
    costCentsDrugs: number
    // Cost PMPMs
    incurredPrimaryPmpm: number
    incurredInpatientPmpm: number
    incurredOutpatientPmpm: number
    incurredSpecialtyPmpm: number
    incurredDrugsPmpm: number
    // Payment Model Factors
    desiredReimbursementCents: number
    actualReimbursementCents: number
    // Quintuple Aim Outputs
    // Member Experience = Member Satisfaction Score (0-1)
    memberSatisfaction: number
    // Health Outcomes = Quality of Life Score (0-1)
    qualityOfLife: number
    // Cost of Healthcare = Average Cost Per Member Per Month ($)
    incurredCentsPerMemberPerMonth: number
    // Cost of Healthcare = Average Spend Per Member Per Month ($)
    paidCentsPerMemberPerMonth: number
    // Provider Experience = Provider Satisfaction Score (0-1)
    providerSatisfaction: number
    // Health Equity = Gini Index of Quality of Life Score (0-1)
    qualityOfLifeGiniIndex: number
    // Health Equity = Palma Ratio of Quality of Life Score (0-1)
    qualityOfLifePalmaFraction: number
}

export type Variables = Inputs & Outputs