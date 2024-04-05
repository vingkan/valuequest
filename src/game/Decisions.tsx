import React, { useState, useEffect } from 'react';
import { Scenario, DecisionOption, Decision } from '../scenarios/scenario.tsx'
import '../styles/Decisions.css';

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
    roundIndex: number;
    totalRounds: number;
    scenario: Scenario;
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
                <button onClick={onChoose}>Choose {option?.label || optionLabel} {option?.labelSuffix}</button>
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

export const DecisionPresentation: React.FC<DecisionPresentationProps> = ({
    roundIndex,
    totalRounds,
    scenario,
    decisions,
    onMakeDecision,
    onLockDecisions,
}) => {
    const [currentStep, setCurrentStep] = useState(0); // 0 for introduction, decisions.length + 1 for summary

    useEffect(() => {
        setCurrentStep(0);
    }, [roundIndex]);

    const handleNext = () => {
        if (currentStep <= decisions.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentDecision = decisions[currentStep - 1];

    // Check if all decisions have a selected option
    const allDecisionsMade = decisions.every(decision => decision.selectedOptionIndex !== undefined);

    return (
        <div className="decision-presentation">
            {currentStep === 0 ? (
                <div className="introduction">
                    <h3>Round {roundIndex + 1} of {totalRounds}</h3>
                    <h2>{scenario.title}</h2>
                    <div className="introduction-content">
                        {scenario.description.trim().split('\n').map((line) => (
                            <p key={line}>{line.trim()}</p>
                        ))}
                    </div>
                    <div className="decision-navigation">
                        <button onClick={handleNext} className="button-start">Start</button>
                    </div>
                </div>
            ) : currentStep > decisions.length ? (
                <div className="summary">
                    <h3>Decisions Summary</h3>
                    <div className="selected-choices">
                        {decisions.map((decision, index) => {
                            const hasSelection = decision.selectedOptionIndex !== undefined
                            const isYes = decision.selectedOptionIndex === 0
                            const selection = (
                                hasSelection
                                    ? (isYes ? 'Yes' : 'No')
                                    : 'No Decision'
                            )
                            const emoji = (
                                hasSelection ? (isYes ? '👍' : '👎') : '🤔'
                            )
                            const option = decision.options?.[decision?.selectedOptionIndex || 0] || {}
                            const selected = (
                                option?.label
                                    ? `✅ ${option.label}`
                                    : `${emoji} ${selection}`
                            )
                            return (
                                <p key={index}>{decision.title}: {selected}</p>
                            )
                        })}
                    </div>
                    <div className="decision-navigation">
                        <button onClick={() => setCurrentStep(decisions.length)}>Back</button>
                        {allDecisionsMade && (
                            <button onClick={onLockDecisions} className="button-lock-in">
                                Lock in Decisions
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="decision">
                    <DecisionComponent
                        key={currentDecision.id}
                        decision={currentDecision}
                        onMakeDecision={
                            (optionIndex) => onMakeDecision(currentDecision.id, optionIndex)
                        }
                    />
                    <div className="decision-navigation">
                        <button onClick={handlePrevious}>Previous</button>
                        <button onClick={handleNext} className="button-next">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};