import React, { useState } from 'react';
import { MetricsBar, Metric } from './game/MetricsBar';
import { IsometricGameMap } from './game/GameMap';
import { DecisionPresentation, Decision } from './game/Decisions';
import './styles/Game.css'

// Define types for our game state

enum Metrics {
    MemberSatisfaction = "Member Satisfaction",
    QualityOfLife = "Quality of Life",
    CostPerMemberPerMonth = "Cost per Member per Month",
    ProviderSatisfaction = "Provider Satisfaction",
    HealthInequality = "Health Inequality",
}

const initialMetrics: Metric[] = [
    { name: Metrics.MemberSatisfaction, value: "55" },
    { name: Metrics.QualityOfLife, value: "67" },
    { name: Metrics.CostPerMemberPerMonth, value: "$254" },
    { name: Metrics.ProviderSatisfaction, value: "32" },
    { name: Metrics.HealthInequality, value: "0.17" },
];

const initialDecisions: Decision[] = [
    {
        id: 'incentives-negotiation',
        title: 'Contract Negotiation',
        description: 'One of our providers wants a revised contract with more performance incentive bonus money. Should we agree to this deal?',
        options: [
            {
                character: 'Contract Manager',
                description: 'Approve the deal. More incentives will get them focused on quality.',
                imageUrl: 'assets/characters/character-2.png',
            },
            {
                character: 'Plan Actuary',
                description: 'Are you crazy? They already have enough upside! Reject the deal.',
                imageUrl: 'assets/characters/character-1.png',
            }
        ],
    },
    {
        id: 'written-care-coordination-plan',
        title: 'Care Coordination Plan',
        description: 'Should we require providers to submit a written plan explaining how they will use care coordination fees as a requirement to receive the payments?',
        options: [
            {
                character: 'Compliance Officer',
                description: 'Without this documentation, we could be opening up both ourselves and the provider to fraud allegations.',
                imageUrl: 'assets/characters/character-16.png',
            },
            {
                character: 'Medical Director',
                description: 'This imposes unnecessary burden on providers. They will just see it as more red tape blocking their reimbursement.',
                imageUrl: 'assets/characters/character-11.png',
            }
        ],
    },
];

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
            <IsometricGameMap />
            <div className="decision-section">
                <DecisionPresentation
                    decisions={decisions}
                    onMakeDecision={handleMakeDecision}
                    onLockDecisions={handleLockDecisions}
                />
            </div>
        </div>
    );
};

export default App;
