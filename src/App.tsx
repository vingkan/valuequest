import React, { useState } from 'react';

import { MetricsBar } from './game/MetricsBar.tsx';
import { IsometricGameMap } from './game/GameMap.tsx';
import { DecisionPresentation } from './game/Decisions.tsx';
import { Metric, Decision } from './scenarios/scenario.tsx'
import {
    initialMetrics,
    scenario,
    initialDecisions,
} from './scenarios/demo.tsx';

const App: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
    const [currentTurn, setCurrentTurn] = useState(1);
    // Placeholder for game map state, details depend on Three.js objects
    const [gameMap, setGameMap] = useState({});

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
    const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);

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
                    scenario={scenario}
                    decisions={decisions}
                    onMakeDecision={handleMakeDecision}
                    onLockDecisions={handleLockDecisions}
                />
            </div>
        </div>
    );
};

export default App;
