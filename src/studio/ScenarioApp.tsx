import React from 'react'
import { DecisionChartProps, DecisionChart } from './Charts'
import { simulateRound } from '../App.tsx'
import { DEMO_GAME } from '../scenarios/demo.tsx'
import { simulate } from '../simulation/main.tsx'
import { Decision, Game, Round } from '../scenarios/scenario.tsx'
import { FinalMetricsChart, FinalMetricsChartProps } from '../game/MetricsChart.tsx'

type PathwayStep = {
    round: Round
    decisions: [Decision, Decision]
}
type Pathway = PathwayStep[]

function getDecisionScenarios(pathways: Pathway[], round: Round, decisions: Decision[]): Pathway[] {
    const steps: PathwayStep[] = [
        {
            round,
            decisions: [
                { ...decisions[0], selectedOptionIndex: 0, },
                { ...decisions[1], selectedOptionIndex: 0, },
            ],
        },
        {
            round,
            decisions: [
                { ...decisions[0], selectedOptionIndex: 1, },
                { ...decisions[1], selectedOptionIndex: 0, },
            ],
        },
        {
            round,
            decisions: [
                { ...decisions[0], selectedOptionIndex: 0, },
                { ...decisions[1], selectedOptionIndex: 1, },
            ],
        },
        {
            round,
            decisions: [
                { ...decisions[0], selectedOptionIndex: 1, },
                { ...decisions[1], selectedOptionIndex: 1, },
            ],
        },
    ]
    if (pathways.length === 0) {
        return [steps]
    }
    let newPathways: Pathway[] = []
    for (const pathway of pathways) {
        for (const step of steps) {
            const newPathway = [...pathway, step]
            newPathways.push(newPathway)
        }
    }
    return newPathways
}

function generateScenarios(game: Game): DecisionChartProps {
    const optionPathways = game.rounds.reduce((currentPathways, round) => {
        currentPathways = getDecisionScenarios(currentPathways, round, round.decisions)
        return currentPathways
    }, [] as Pathway[])
    console.log({ optionPathways })
    const scenarios = optionPathways.map((pathway) => {
        const initialResults = simulate(
            game.initialInputs,
            Object.values(game.initialModels),
            false
        )
        let inputs = { ...initialResults }
        let models = { ...game.initialModels }
        let roundVars = { [-1]: initialResults }
        pathway.forEach((step, i) => {
            const { results, newModels } = simulateRound({
                inputs,
                previousModels: models,
                round: step.round,
                decisions: step.decisions,
                debug: false,
            })
            inputs = { ...inputs, ...results, }
            const updatedModels = { ...models, ...newModels }
            const nonNullModels = Object.entries(updatedModels).filter(([key, val]) => val !== null).reduce((agg, [key, val]) => ({ ...agg, [key]: val }), {})
            models = nonNullModels
            const data = game.metrics.reduce((agg, m) => ({ ...agg, [m.variable]: inputs?.[m.variable], }), {})
            roundVars[i] = data
        })
        return { roundVars }
    })
    const metricVariables = game.metrics.map(m => m.variable)
    return { scenarios, metricVariables }
}

const exampleProps: DecisionChartProps = {
    metricVariables: ["a", "b"],
    scenarios: [
        {
            roundVars: {
                0: { "a": 2, "b": 3, },
                1: { "a": 3, "b": 2, },
                2: { "a": 5, "b": 7, },
            },
        },
        {
            roundVars: {
                0: { "a": 1, "b": 8, },
                1: { "a": 4, "b": 3, },
                2: { "a": 2, "b": 4, },
            },
        },
    ],
}

// const realProps = generateScenarios(DEMO_GAME)
// console.log({realProps})

const finalProps: FinalMetricsChartProps = {
    metrics: DEMO_GAME.metrics,
    roundVars: {
        "0": {
            "memberCount": 500000,
            "memberRateLowRisk": 0.8,
            "memberRateMediumRisk": 0.1,
            "memberRateHighRisk": 0.1,
            "qualityOfLifeLowRisk": 0.8,
            "qualityOfLifeMediumRisk": 0.55,
            "qualityOfLifeHighRisk": 0.4,
            "utilizationPerMemberPerYearInpatient": 0.42,
            "utilizationPerMemberPerYearOutpatient": 0.3,
            "utilizationPerMemberPerYearPrimary": 0.8,
            "utilizationPerMemberPerYearSpecialty": 0.6,
            "utilizationPerMemberPerYearDrugs": 12,
            "utilizationFactorLowRisk": 1,
            "utilizationFactorMediumRisk": 1.5,
            "utilizationFactorHighRisk": 2,
            "providerDesiredCentsPerUtilizationInpatient": 500000,
            "providerDesiredCentsPerUtilizationOutpatient": 20000,
            "providerDesiredCentsPerUtilizationPrimary": 10000,
            "providerDesiredCentsPerUtilizationSpecialty": 100000,
            "providerDesiredCentsPerUtilizationDrugs": 5000,
            "genericDrugCostDiscountFactor": 0.5,
            "careAccessibilityFactor": 0.5,
            "providerTrustFactor": 0.5,
            "primaryCareParticipationRate": 0.9296000000000001,
            "preventionRate": 0.15,
            "conditionsManagedRate": 0.65,
            "wellManagedRate": 0.25,
            "careGapClosureRate": 0.35,
            "medicationAdheranceRate": 0.35,
            "genericPrescriptionRate": 0.65,
            "providerEfficiencyFactor": 0.5,
            "costAversionFactor": 0.75,
            "lengthOfStay": 1,
            "readmissionRate": 0.24,
            "primaryCareQualityImprovementFactor": 1.01,
            "readmissionReductionQualityImprovementFactor": 1.05,
            "genericDrugPerceptionFactor": 0.8,
            "patientsPerProvider": 10,
            "providerAutonomyFactor": 0.612,
            "providerReportingBurden": 0.752,
            "costCentsInpatient": 149729999999.99997,
            "costCentsOutpatient": 3450000000,
            "costCentsPrimary": 4276160000.0000005,
            "costCentsSpecialty": 34500000000,
            "costCentsDrugs": 23287500000,
            "desiredReimbursementCents": 215243659999.99997,
            "actualReimbursementCents": 184842000000,
            "desiredReimbursementRatio": 0.858757001251512,
            "memberSatisfaction": 0.5423620000000001,
            "qualityOfLife": 0.6878134400000002,
            "incurredPrimaryPmpm": 712,
            "incurredInpatientPmpm": 24954,
            "incurredOutpatientPmpm": 575,
            "incurredSpecialtyPmpm": 5750,
            "incurredDrugsPmpm": 3881,
            "incurredCentsPerMemberPerMonth": 35873,
            "paidCentsPerMemberPerMonth": 30807,
            "providerSatisfaction": 0.6443785006257561,
            "qualityOfLifeGiniIndex": 0.3554175743081024,
            "qualityOfLifePalmaFraction": 0.8268568213987988
        },
        "1": {
            "memberCount": 600000,
            "memberRateLowRisk": 0.8,
            "memberRateMediumRisk": 0.1,
            "memberRateHighRisk": 0.1,
            "qualityOfLifeLowRisk": 0.8,
            "qualityOfLifeMediumRisk": 0.55,
            "qualityOfLifeHighRisk": 0.4,
            "utilizationPerMemberPerYearInpatient": 0.42,
            "utilizationPerMemberPerYearOutpatient": 0.3,
            "utilizationPerMemberPerYearPrimary": 0.8,
            "utilizationPerMemberPerYearSpecialty": 0.6,
            "utilizationPerMemberPerYearDrugs": 12,
            "utilizationFactorLowRisk": 1,
            "utilizationFactorMediumRisk": 1.5,
            "utilizationFactorHighRisk": 2,
            "providerDesiredCentsPerUtilizationInpatient": 500000,
            "providerDesiredCentsPerUtilizationOutpatient": 20000,
            "providerDesiredCentsPerUtilizationPrimary": 10000,
            "providerDesiredCentsPerUtilizationSpecialty": 100000,
            "providerDesiredCentsPerUtilizationDrugs": 5000,
            "genericDrugCostDiscountFactor": 0.5,
            "careAccessibilityFactor": 0.5,
            "providerTrustFactor": 0.5,
            "primaryCareParticipationRate": 0.9481920000000001,
            "preventionRate": 0.15,
            "conditionsManagedRate": 0.65,
            "wellManagedRate": 0.25,
            "careGapClosureRate": 0.35,
            "medicationAdheranceRate": 0.35,
            "genericPrescriptionRate": 0.6825000000000001,
            "providerEfficiencyFactor": 0.5,
            "costAversionFactor": 0.75,
            "lengthOfStay": 1,
            "readmissionRate": 0.23279999999999998,
            "primaryCareQualityImprovementFactor": 1.01,
            "readmissionReductionQualityImprovementFactor": 1.05,
            "genericDrugPerceptionFactor": 0.8,
            "patientsPerProvider": 10,
            "providerAutonomyFactor": 0.612,
            "providerReportingBurden": 0.752,
            "costCentsInpatient": 178632719999.99997,
            "costCentsOutpatient": 4140000000,
            "costCentsPrimary": 5234019840.000001,
            "costCentsSpecialty": 41400000000,
            "costCentsDrugs": 27272249999.999996,
            "desiredReimbursementCents": 256678989839.99997,
            "actualReimbursementCents": 219521088000,
            "desiredReimbursementRatio": 0.8552359043365324,
            "memberSatisfaction": 0.54915924,
            "qualityOfLife": 0.7001337088000003,
            "incurredPrimaryPmpm": 726,
            "incurredInpatientPmpm": 24810,
            "incurredOutpatientPmpm": 575,
            "incurredSpecialtyPmpm": 5750,
            "incurredDrugsPmpm": 3787,
            "incurredCentsPerMemberPerMonth": 35649,
            "paidCentsPerMemberPerMonth": 30489,
            "providerSatisfaction": 0.6426179521682662,
            "qualityOfLifeGiniIndex": 0.36126719101179783,
            "qualityOfLifePalmaFraction": 0.8172331404175277
        },
        "2": {
            "memberCount": 600000,
            "memberRateLowRisk": 0.8,
            "memberRateMediumRisk": 0.1,
            "memberRateHighRisk": 0.1,
            "qualityOfLifeLowRisk": 0.8,
            "qualityOfLifeMediumRisk": 0.6347,
            "qualityOfLifeHighRisk": 0.4,
            "utilizationPerMemberPerYearInpatient": 0.4179,
            "utilizationPerMemberPerYearOutpatient": 0.3,
            "utilizationPerMemberPerYearPrimary": 0.8160000000000001,
            "utilizationPerMemberPerYearSpecialty": 0.588,
            "utilizationPerMemberPerYearDrugs": 13.200000000000001,
            "utilizationFactorLowRisk": 1,
            "utilizationFactorMediumRisk": 1.5,
            "utilizationFactorHighRisk": 2,
            "providerDesiredCentsPerUtilizationInpatient": 500000,
            "providerDesiredCentsPerUtilizationOutpatient": 20000,
            "providerDesiredCentsPerUtilizationPrimary": 10000,
            "providerDesiredCentsPerUtilizationSpecialty": 95000,
            "providerDesiredCentsPerUtilizationDrugs": 5000,
            "genericDrugCostDiscountFactor": 0.5,
            "careAccessibilityFactor": 0.5,
            "providerTrustFactor": 0.515,
            "primaryCareParticipationRate": 0.951036576,
            "preventionRate": 0.15,
            "conditionsManagedRate": 0.65,
            "wellManagedRate": 0.2625,
            "careGapClosureRate": 0.35,
            "medicationAdheranceRate": 0.35,
            "genericPrescriptionRate": 0.6825000000000001,
            "providerEfficiencyFactor": 0.5,
            "costAversionFactor": 0.75,
            "lengthOfStay": 1,
            "readmissionRate": 0.22581599999999996,
            "primaryCareQualityImprovementFactor": 1.01,
            "readmissionReductionQualityImprovementFactor": 1.05,
            "genericDrugPerceptionFactor": 0.8,
            "patientsPerProvider": 10,
            "providerAutonomyFactor": 0.5508,
            "providerReportingBurden": 0.8196800000000001,
            "costCentsInpatient": 176732634708,
            "costCentsOutpatient": 4140000000,
            "costCentsPrimary": 5354716337.510401,
            "costCentsSpecialty": 38543400000,
            "costCentsDrugs": 29999475000,
            "desiredReimbursementCents": 254770226045.5104,
            "actualReimbursementCents": 220116066247.44,
            "desiredReimbursementRatio": 0.8639787688853405,
            "memberSatisfaction": 0.5550848745364,
            "qualityOfLife": 0.7107357707264002,
            "incurredPrimaryPmpm": 743,
            "incurredInpatientPmpm": 24546,
            "incurredOutpatientPmpm": 575,
            "incurredSpecialtyPmpm": 5353,
            "incurredDrugsPmpm": 4166,
            "incurredCentsPerMemberPerMonth": 35384,
            "paidCentsPerMemberPerMonth": 30571,
            "providerSatisfaction": 0.6147693844426703,
            "qualityOfLifeGiniIndex": 0.3419788991549179,
            "qualityOfLifePalmaFraction": 0.8888070944820543
        },
        "-1": {
            "memberCount": 500000,
            "memberRateLowRisk": 0.8,
            "memberRateMediumRisk": 0.1,
            "memberRateHighRisk": 0.1,
            "qualityOfLifeLowRisk": 0.8,
            "qualityOfLifeMediumRisk": 0.55,
            "qualityOfLifeHighRisk": 0.4,
            "utilizationPerMemberPerYearInpatient": 0.42,
            "utilizationPerMemberPerYearOutpatient": 0.3,
            "utilizationPerMemberPerYearPrimary": 0.8,
            "utilizationPerMemberPerYearSpecialty": 0.6,
            "utilizationPerMemberPerYearDrugs": 12,
            "utilizationFactorLowRisk": 1,
            "utilizationFactorMediumRisk": 1.5,
            "utilizationFactorHighRisk": 2,
            "providerDesiredCentsPerUtilizationInpatient": 500000,
            "providerDesiredCentsPerUtilizationOutpatient": 20000,
            "providerDesiredCentsPerUtilizationPrimary": 10000,
            "providerDesiredCentsPerUtilizationSpecialty": 100000,
            "providerDesiredCentsPerUtilizationDrugs": 5000,
            "genericDrugCostDiscountFactor": 0.5,
            "careAccessibilityFactor": 0.5,
            "providerTrustFactor": 0.5,
            "primaryCareParticipationRate": 0.83,
            "preventionRate": 0.15,
            "conditionsManagedRate": 0.65,
            "wellManagedRate": 0.25,
            "careGapClosureRate": 0.35,
            "medicationAdheranceRate": 0.35,
            "genericPrescriptionRate": 0.2,
            "providerEfficiencyFactor": 0.5,
            "costAversionFactor": 0.75,
            "lengthOfStay": 1,
            "readmissionRate": 0.3,
            "primaryCareQualityImprovementFactor": 1.01,
            "readmissionReductionQualityImprovementFactor": 1.05,
            "genericDrugPerceptionFactor": 0.8,
            "patientsPerProvider": 10,
            "providerAutonomyFactor": 0.6,
            "providerReportingBurden": 0.8,
            "costCentsInpatient": 156975000000,
            "costCentsOutpatient": 3450000000,
            "costCentsPrimary": 3818000000,
            "costCentsSpecialty": 34500000000,
            "costCentsDrugs": 31050000000,
            "desiredReimbursementCents": 229793000000,
            "actualReimbursementCents": 183834400000,
            "desiredReimbursementRatio": 0.8,
            "memberSatisfaction": 0.4747875,
            "qualityOfLife": 0.620912,
            "incurredPrimaryPmpm": 636,
            "incurredInpatientPmpm": 26162,
            "incurredOutpatientPmpm": 575,
            "incurredSpecialtyPmpm": 5750,
            "incurredDrugsPmpm": 5175,
            "incurredCentsPerMemberPerMonth": 38298,
            "paidCentsPerMemberPerMonth": 30639,
            "providerSatisfaction": 0.6000000000000001,
            "qualityOfLifeGiniIndex": 0.3315551330129052,
            "qualityOfLifePalmaFraction": 0.8849838306180975
        }
    }
}

export function ScenarioApp() {
    return (
        <div>
            <h1>Scenario Studio</h1>
            {/* <DecisionChart {...realProps} /> */}
            <FinalMetricsChart {...finalProps} />
        </div>
    )
}