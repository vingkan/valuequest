import React, { useState, useEffect } from 'react';

import { MetricsBar } from './game/MetricsBar.tsx';
import { IsometricGameMap } from './game/GameMap.tsx';
import { DecisionPresentation } from './game/Decisions.tsx';
import {
    Game,
    Round,
    Metric,
    Decision,
    PaymentModelMap,
} from './scenarios/scenario.tsx'
import { Inputs, Variables } from './simulation/variables.tsx'
import { simulate } from './simulation/main.tsx'
import { PaymentModel } from './simulation/payment.tsx';

type AppProps = {
    game: Game
};

const FINAL_ROUND: Round = {
    scenario: {
        title: '',
        description: '',
    },
    modelChanges: {},
    inputMultipliers: {},
    decisions: [],
};

type SimulateRoundProps = {
    inputs: Inputs;
    previousModels: PaymentModelMap;
    round: Round;
    decisions: Decision[];
};

function simulateRound({
    inputs,
    previousModels,
    round,
    decisions,
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

    const allMultipliers = [
        round.inputMultipliers,
        ...selectedOptions.map(d => d.inputMultipliers),
    ];
    const combinedMultipliers = allMultipliers.reduce((agg, modifiers) => {
        let product = { ...agg };
        Object.entries(modifiers).forEach(([key, value]) => {
            if (!(key in product)) {
                product[key] = value
            } else {
                product[key] = product[key] * value
            }
        });
        return product;
    }, {});
    let modifiedInputs = { ...inputs };
    Object.entries(combinedMultipliers).forEach(([key, value]) => {
        modifiedInputs[key] = modifiedInputs[key] * value
    });

    const results = simulate(modifiedInputs, modifiedModels);
    return results;
}

const App: React.FC<AppProps> = ({ game }) => {
    const [metrics, setMetrics] = useState<Metric[]>(game.metrics);
    const [inputs, setInputs] = useState<Inputs>(game.initialInputs);
    const [models, setModels] = useState<PaymentModelMap>(game.initialModels);
    const [roundVars, setRoundVars] = useState<Record<number, Variables>>({});

    function updateRoundResults(roundIndex: number, results: Variables) {
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
        setRoundVars((prev) => ({ ...prev, [roundIndex]: results }));
    }

    // Run the initial model at the start of the game
    useEffect(() => {
        const results = simulate(
            game.initialInputs,
            Object.values(game.initialModels)
        );
        updateRoundResults(-1, results);
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
        const results = simulateRound({
            inputs,
            previousModels: models,
            round,
            decisions,
        })
        updateRoundResults(roundIndex, results);
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
                            <h3>The End</h3>
                            <p>Leaderboard coming soon...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
