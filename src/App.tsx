import React, { useState } from 'react';
import { MetricsBar, Metric } from './game/MetricsBar.tsx';
import { IsometricGameMap } from './game/GameMap.tsx';
import { DecisionPresentation, Decision, Scenario } from './game/Decisions.tsx';
import './styles/Game.css'

// Define types for our game state

const initialMetrics: Metric[] = [
    {
        name: "Member Satisfaction",
        explanation: "Higher is better. Score from 0 to 100 capturing how happy members are with their healthcare.",
        value: "55",
    },
    {
        name: "Quality of Life",
        explanation: "Higher is better. Score from 0 (patient died) to 100 (patient has no health issues).",
        value: "67",
    },
    {
        name: "Cost PMPM",
        explanation: "Lower is better. Average cost of healthcare services provided per member per month.",
        value: "$254",
    },
    {
        name: "Provider Satisfaction",
        explanation: "Higher is better. Score from 0 to 100 capturing how happy providers are with their work and life.",
        value: "32",
    },
    {
        name: "Health Inequality",
        explanation: "Lower is better. Score from 0 (all patients have the same quality of life) to 1 (maximum inequality).",
        value: "0.17",
    },
];

const scenario: Scenario = {
    title: 'Round 1: Contract Year 2024',
    description: `
You lead the value-based care team at a health insurance plan.
Your job is to manage the pilot and make it a huge success.
Navigate these decisions to get ready for contract year 2024.
`.trim(),
};


const initialDecisions: Decision[] = [
    {
        id: 'incentives-negotiation',
        title: 'Offer More Contract Incentives',
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
        title: 'Require Care Coordination Plan',
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
