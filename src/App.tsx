import React, { useState } from 'react';

import { MetricsBar } from './game/MetricsBar.tsx';
import { IsometricGameMap } from './game/GameMap.tsx';
import { DecisionPresentation } from './game/Decisions.tsx';
import { Game, Metric, Decision } from './scenarios/scenario.tsx'

type AppProps = {
    game: Game
}

const App: React.FC<AppProps> = ({ game }) => {
    const [metrics, setMetrics] = useState<Metric[]>(game.metrics);
    const [currentTurn, setCurrentTurn] = useState(1);

    // Function to apply a decision's impact to the metrics
    const applyDecision = (decision: Decision) => {
        setMetrics(currentMetrics =>
            currentMetrics.map(metric => ({
                ...metric,
                value: metric.value,
            }))
        );
        if (currentTurn < 5) {
            setCurrentTurn(currentTurn + 1);
        } else {
            // Game Over or Reset Game Logic here
        }
    };

    // Additional state for managing decisions might be needed
    const [roundIndex, setRoundIndex] = useState<number>(0);
    const round = game.rounds?.[roundIndex]!

    const [decisions, setDecisions] = useState<Decision[]>(round.decisions);

    // Handler for making a decision
    const handleMakeDecision = (decisionId: string, optionIndex: number) => {
        setDecisions(currentDecisions =>
            currentDecisions.map(decision =>
                decision.id === decisionId ? { ...decision, selectedOptionIndex: optionIndex } : decision
            )
        );
    };

    // Handler for locking in decisions
    const handleLockDecisions = () => {
        // Logic to lock in decisions and possibly advance the game state
        console.log('Decisions locked in, advance to next round');
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
                <DecisionPresentation
                    scenario={round.scenario}
                    decisions={decisions}
                    onMakeDecision={handleMakeDecision}
                    onLockDecisions={handleLockDecisions}
                />
            </div>
        </div>
    );
};

export default App;
