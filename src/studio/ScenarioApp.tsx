import React from 'react'
import { DecisionChartProps, DecisionChart } from './Charts'
import { simulateRound } from '../App.tsx'
import { DEMO_GAME } from '../scenarios/demo.tsx'
import { simulate } from '../simulation/main.tsx'
import { Decision, Game, Round } from '../scenarios/scenario.tsx'

type PathwayStep =  {
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

const realProps = generateScenarios(DEMO_GAME)
console.log({realProps})

export function ScenarioApp() {
    return (
        <div>
            <h1>Scenario Studio</h1>
            <DecisionChart {...realProps} />
        </div>
    )
}