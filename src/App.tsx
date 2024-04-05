import React, { useState, useEffect } from 'react';

import { MetricsBar, FocusMetrics } from './game/MetricsBar.tsx';
import { IsometricGameMap } from './game/GameMap.tsx';
import { DecisionPresentation } from './game/Decisions.tsx';
import { SlidingPane } from './game/SlidingPane.tsx'
import {
    Game,
    Round,
    Metric,
    Decision,
    PaymentModelMap,
    MetricGroup,
} from './scenarios/scenario.tsx'
import { Inputs, Variables } from './simulation/variables.tsx'
import { simulate } from './simulation/main.tsx'
import { PaymentModel } from './simulation/payment.tsx';
import { FinalMetricsChart, FinalMetricsChartProps } from './game/MetricsChart.tsx';

type AppProps = {
    game: Game
};

const FINAL_ROUND: Round = {
    scenario: {
        title: '',
        description: '',
    },
    modelChanges: {},
    inputModifiers: {},
    decisions: [],
};

type SimulateRoundProps = {
    inputs: Inputs;
    previousModels: PaymentModelMap;
    round: Round;
    decisions: Decision[];
    debug: boolean;
};

export function simulateRound({
    inputs,
    previousModels,
    round,
    decisions,
    debug,
}: SimulateRoundProps) {
    const selectedOptions = decisions.map((decision) => (
        decision.options?.[decision.selectedOptionIndex!]
    ));

    const allModelChanges = [
        previousModels,
        round.modelChanges,
        ...selectedOptions.map(d => d.modelChanges),
    ];
    const combinedModelChanges = allModelChanges.reduce((agg, modelChanges) => {
        return { ...agg, ...modelChanges };
    }, {});
    const modifiedModels = (
        Object
            .values(combinedModelChanges)
            .filter(d => d !== null)
    ) as PaymentModel[];

    const allModifiers = [
        round.inputModifiers,
        ...selectedOptions.map(d => d.inputModifiers),
    ];
    const combinedModifiers = allModifiers.reduce((agg, modifiers) => {
        let product = { ...agg };
        Object.entries(modifiers).forEach(([key, value]) => {
            if (!(key in product)) {
                product[key] = value
            } else {
                product[key] = product[key] + value
            }
        });
        return product;
    }, {});
    let modifiedInputs = { ...inputs };
    Object.entries(combinedModifiers).forEach(([key, modifier]) => {
        const factor = 1 + modifier
        modifiedInputs[key] = modifiedInputs[key] * factor
    });

    const results = simulate(modifiedInputs, modifiedModels, debug);
    return { results, newModels: combinedModelChanges };
}

const App: React.FC<AppProps> = ({ game }) => {
    const [metrics, setMetrics] = useState<Metric[]>(game.metrics);
    const [focusMetrics, setFocusMetrics] = useState<MetricGroup[]>(game.focusMetrics);
    const [inputs, setInputs] = useState<Inputs>(game.initialInputs);
    const [models, setModels] = useState<PaymentModelMap>(game.initialModels);
    const [roundVars, setRoundVars] = useState<Record<number, Variables>>({});

    const finalChartProps: FinalMetricsChartProps = { roundVars, metrics };

    function updateRoundResults(roundIndex: number, results: Variables, newModels: PaymentModelMap) {
        setModels(newModels);
        setInputs((previousInputs) => {
            const newInputs = (
                Object
                    .keys(previousInputs)
                    .reduce((agg, key) => ({
                        ...agg,
                        [key]: results?.[key],
                    }), {})
            );
            return newInputs as Inputs;
        });
        setMetrics((previousMetrics) => (
            previousMetrics.map((metric) => {
                const priorRound = roundIndex - 1;
                const value = results?.[metric.variable];
                const priorValue = roundVars?.[priorRound]?.[metric.variable];
                return {
                    ...metric,
                    value,
                    priorValue,
                };
            })
        ));
        setFocusMetrics((previousFocusMetrics) => (
            previousFocusMetrics.map((metricGroup) => {
                const { name, metrics} = metricGroup 
                const updated = metrics.map((metric) => {
                    const priorRound = roundIndex - 1;
                    const value = results?.[metric.variable];
                    const priorValue = roundVars?.[priorRound]?.[metric.variable];
                    return {
                        ...metric,
                        value,
                        priorValue,
                    };
                })
                return { name, metrics: updated }
            })
        ))
        setRoundVars((prev) => ({ ...prev, [roundIndex]: results }));
    }

    // Run the initial model at the start of the game
    useEffect(() => {
        console.log(`Simulate Before Game`);
        const results = simulate(
            game.initialInputs,
            Object.values(game.initialModels),
            true
        );
        console.log(results);
        updateRoundResults(-1, results, game.initialModels);
    }, [game]);

    // Additional state for managing decisions might be needed
    const [roundIndex, setRoundIndex] = useState<number>(0);

    const round = game.rounds?.[roundIndex] || FINAL_ROUND
    const totalRounds = game.rounds.length;

    const [decisions, setDecisions] = useState<Decision[]>(round.decisions);
    useEffect(() => {
        setDecisions(round.decisions);
    }, [round]);

    // Handler for making a decision
    const handleMakeDecision = (decisionId: string, optionIndex: number) => {
        setDecisions(currentDecisions =>
            currentDecisions.map(decision =>
                decision.id === decisionId ? { ...decision, selectedOptionIndex: optionIndex } : decision
            )
        );
    };

    const handleLockDecisions = () => {
        console.log(`Simulate Round ${roundIndex + 1}`);
        const { results, newModels } = simulateRound({
            inputs,
            previousModels: models,
            round,
            decisions,
            debug: true,
        })
        console.log(results);
        updateRoundResults(roundIndex, results, newModels);
        setRoundIndex(roundIndex + 1);
    };

    return (
        <div className="game-container">
            <div className="metrics-bar">
                <MetricsBar metrics={metrics} />
            </div>
            <div className="game-map">
                <IsometricGameMap />
            </div>
            <div className="decision-section">
                {roundIndex < totalRounds && (
                    <DecisionPresentation
                        roundIndex={roundIndex}
                        totalRounds={totalRounds}
                        scenario={round.scenario}
                        decisions={decisions}
                        onMakeDecision={handleMakeDecision}
                        onLockDecisions={handleLockDecisions}
                    />
                )}
                {roundIndex >= totalRounds && (
                    <div className="decision-presentation">
                        <div className="decision">
                            <h3>Final Scores</h3>
                            <p>Take a screenshot and post your scores!</p>
                            <FinalMetricsChart {...finalChartProps} />
                        </div>
                    </div>
                )}
            </div>
            <SlidingPane>
                <FocusMetrics groups={focusMetrics} />
            </SlidingPane>
        </div>
    );
};

export default App;
