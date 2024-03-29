export type Scenario = {
    title: string;
    description: string;
};

export type DecisionOption = {
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

export type Metric = {
    name: string;
    value: string;
    explanation: string;
};