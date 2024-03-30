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

export type DecisionOption = {
    character: string;
    description: string;
    imageUrl: string;
    modelChanges: PaymentModelMap;
    inputMultipliers: Partial<Inputs>;
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
    inputMultipliers: Partial<Inputs>;
};

export type Game = {
    metrics: Metric[];
    initialInputs: Inputs;
    initialModels: Record<string, PaymentModel>;
    rounds: Round[];
};