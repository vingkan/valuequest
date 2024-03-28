export type Variables = {
    // Model Factors
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
    // Quintuple Aim Outputs
    // Member Experience = Member Satisfaction Score (0-1)
    memberSatisfaction: number
    // Health Outcomes = Quality of Life Score (0-1)
    qualityOfLife: number
    // Cost of Healthcare = Average Cost Per Member Per Month ($)
    centsPerMemberPerMonth: number
    // Provider Experience = Provider Satisfaction Score (0-1)
    providerSatisfaction: number
    // Health Equity = Gini Index of Quality of Life Score (0-1)
    qualityOfLifeGiniIndex: number
}