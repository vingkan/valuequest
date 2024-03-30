import { PaymentModel } from '../simulation/payment.tsx'
import { Inputs } from '../simulation/variables.tsx'

export type Scenario = {
    title: string;
    description: string;
};

// Keys are model IDs and values are the new model to use
// If the model ID existed before, the new model will replace the old
// If the model ID is new, the new model will be added
// If the model value is null, any old model with that ID will be removed
// If a model ID existed before and there are no new changes, it will remain
export type PaymentModelMap = Record<string, PaymentModel | null>;

// Each value represents the percentage change to be added to the input.
// All changes are additive. For example, if the round provides a change of 0.01
// and the decision option provides a change of -0.05, the result will be -0.04
// for a negative 4% change in the input variable value after all modifiers.
export type InputModifiers = Partial<Inputs>;

export type DecisionOption = {
    character: string;
    description: string;
    imageUrl: string;
    modelChanges: PaymentModelMap;
    inputModifiers: InputModifiers;
};

export type Decision = {
    id: string;
    title: string;
    description: string;
    options: [DecisionOption, DecisionOption];
    selectedOptionIndex?: number;
};

export type Metric = {
    name: string;
    variable: string;
    higherIsBetter: boolean;
    explanation: string;
    formatId: string;
    value: any;
    priorValue?: any;
};

export type Round = {
    scenario: Scenario;
    decisions: Decision[];
    modelChanges: PaymentModelMap;
    inputModifiers: InputModifiers;
};

export type Game = {
    metrics: Metric[];
    initialInputs: Inputs;
    initialModels: Record<string, PaymentModel>;
    rounds: Round[];
};