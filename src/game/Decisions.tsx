import React, { useState } from 'react';

// Types for the decision options and decisions
type DecisionOption = {
    character: string;
    description: string;
    imageUrl: string;
};

export type Decision = {
    id: string;
    title: string;
    description: string;
    options: [DecisionOption, DecisionOption];
    selectedOptionIndex?: number;
};

// Props for the individual components
type DecisionOptionProps = {
    option: DecisionOption;
    onChoose: () => void;
    isSelected: boolean;
    position: 'left' | 'right';
};

type DecisionProps = {
    decision: Decision;
    onMakeDecision: (optionIndex: number) => void;
};

type DecisionPresentationProps = {
    decisions: Decision[];
    onMakeDecision: (decisionId: string, optionIndex: number) => void;
    onLockDecisions: () => void;
};

// Component for a single decision option
const DecisionOptionComponent: React.FC<DecisionOptionProps> = ({ option, onChoose, isSelected, position }) => {
    const bubbleClass = `speech-bubble ${position} ${isSelected ? 'selected' : ''}`;
    const optionClass = `option ${position} ${isSelected ? 'selected' : ''}`;
    const optionLabel = position === 'left' ? 'Yes' : 'No';

    return (
        <div className={optionClass}>
            <div className="profile-image-container">
                <img src={option.imageUrl} alt="Character profile" className="profile-image" />
            </div>
            <div className={bubbleClass}>
                <h4>{option.character}</h4>
                <p>{option.description}</p>
                <button onClick={onChoose}>Choose {optionLabel}</button>
            </div>
        </div>
    );
};

// Component for a single decision
const DecisionComponent: React.FC<DecisionProps> = ({ decision, onMakeDecision }) => {
    return (
        <div className="decision">
            <h3>{decision.title}</h3>
            <p>{decision.description}</p>
            <div className="options">
                {decision.options.map((option, index) => (
                    <DecisionOptionComponent
                        key={index}
                        option={option}
                        onChoose={() => onMakeDecision(index)}
                        isSelected={decision.selectedOptionIndex === index}
                        position={index === 0 ? 'left' : 'right'}
                    />
                ))}
            </div>
        </div>
    );
};

// Main component for decision presentation
export const DecisionPresentation: React.FC<DecisionPresentationProps> = ({
    decisions,
    onMakeDecision,
    onLockDecisions,
}) => {
    const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);

    const currentDecision = decisions[currentDecisionIndex];

    // Check if all decisions have a selected option
    const allDecisionsMade = decisions.every(decision => decision.selectedOptionIndex !== undefined);

    const handleDecisionNavigation = (direction: 'next' | 'previous') => {
        setCurrentDecisionIndex(prevIndex => {
            let newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;
            // Boundary conditions
            newIndex = Math.max(0, Math.min(newIndex, decisions.length - 1));
            return newIndex;
        });
    };

    const handleMakeDecision = (optionIndex: number) => {
        onMakeDecision(currentDecision.id, optionIndex);
    };

    return (
        <div className="decision-presentation">
            <DecisionComponent
                key={currentDecision.id}
                decision={currentDecision}
                onMakeDecision={handleMakeDecision}
            />
            <div className="decision-navigation">
                {currentDecisionIndex > 0 && (
                    <button onClick={() => handleDecisionNavigation('previous')}>
                        Previous
                    </button>
                )}
                {currentDecisionIndex < decisions.length - 1 && (
                    <button onClick={() => handleDecisionNavigation('next')} className="button-next">
                        Next
                    </button>
                )}
            </div>
            {currentDecisionIndex === decisions.length - 1 && allDecisionsMade && (
                <div className="lock-in-section">
                    <button onClick={onLockDecisions} className="lock-in">
                        Lock in Decisions
                    </button>
                </div>
            )}
        </div>
    );
};