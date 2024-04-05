import React, { useState } from 'react';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';

type Variables = Record<string, number>;

type ScenarioDecisions = {
  roundVars: Record<number, Variables>;
};

export type DecisionChartProps = {
  scenarios: ScenarioDecisions[];
  metricVariables: string[];
};

export const DecisionChart: React.FC<DecisionChartProps> = ({ scenarios, metricVariables }) => {
  // State for selected metric variable
  const [selectedMetric, setSelectedMetric] = useState(metricVariables[0]);

  // Function to transform scenario data into Victory's expected data format
  const transformData = (metric: string) => {
    return scenarios.map((scenario) => {
      return {
        data: Object.entries(scenario.roundVars).map(([round, vars]) => ({
          x: parseInt(round) + 1,
          y: vars[metric] ?? 0, // Default to 0 if metric is not found
        })),
      };
    });
  };

  const data = transformData(selectedMetric);

  return (
    <div>
      <label htmlFor="metric-select">Select Metric: </label>
      <select
        id="metric-select"
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value)}
      >
        {metricVariables.map((metric) => (
          <option key={metric} value={metric}>
            {metric}
          </option>
        ))}
      </select>

      <VictoryChart domainPadding={20}>
        <VictoryAxis label="Round" />
        <VictoryAxis dependentAxis label={selectedMetric} />
        {data.map((scenario, idx) => (
          <VictoryLine
            key={idx}
            data={scenario.data}
            style={{
              data: { stroke: `#${Math.floor(Math.random()*16777215).toString(16)}` }, // Random color for each line
            }}
          />
        ))}
      </VictoryChart>
    </div>
  );
};
