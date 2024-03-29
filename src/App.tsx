import React, { useState, useEffect } from 'react';

import { MetricsBar } from './game/MetricsBar.tsx';
import { IsometricGameMap } from './game/GameMap.tsx';
import { DecisionPresentation } from './game/Decisions.tsx';
import { Game, Round, Metric, Decision } from './scenarios/scenario.tsx'

type AppProps = {
    game: Game
};

const FINAL_ROUND: Round = {
    scenario: {
        title: '',
        description: '',
    },
    decisions: [],
};

const App: React.FC<AppProps> = ({ game }) => {
    const [metrics, setMetrics] = useState<Metric[]>(game.metrics);

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
