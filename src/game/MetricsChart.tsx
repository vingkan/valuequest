import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer, VictoryLegend } from 'victory';
import { Metric } from '../scenarios/scenario';
import { Variables } from '../simulation/variables';
import { DEFAULT_FORMATTER, FORMATTERS } from './MetricsBar';

export type FinalMetricsChartProps = {
    roundVars: Record<number, Variables>;
    metrics: Metric[];
};

const HUNDRED_SCALE = 100;
const DOLLARS_SCALE = 0.003;
const DEFAULT_SCALE = 1;
const SCALES = {
    'rate': HUNDRED_SCALE,
    'hundred_score': HUNDRED_SCALE,
    'percentage': HUNDRED_SCALE,
    'cents_to_dollars': DOLLARS_SCALE,
};

export const FinalMetricsChart: React.FC<FinalMetricsChartProps> = ({ roundVars, metrics }) => {
    // Function to transform the data for each metric
    const transformDataForMetric = (metric: Metric) => {
        const { name, variable, formatId } = metric
        const scale = SCALES?.[formatId] || DEFAULT_SCALE
        const format = FORMATTERS?.[formatId] || DEFAULT_FORMATTER
        return Object.entries(roundVars).map(([round, vars]) => {
            const x = parseInt(round) + 1
            const value = vars?.[variable] || 0
            const y = scale * value
            const label = `${name}: ${format(value)}`
            return { x, y, label };
        });
    };

    // Colors array to assign different colors for each metric line
    const colors = ['#057766', '#acd924', '#eb4f1f', '#05477d', '#09e0c0'];

    return (
        <VictoryChart
            height={200}
            containerComponent={
                <VictoryVoronoiContainer voronoiDimension="x" />
            }
        >
            <VictoryAxis
                label="Round"
                tickValues={[0, 1, 2, 3]}
                style={{
                    tickLabels: { fontSize: 6, },
                    axisLabel: { fontSize: 7.5, },
                }}
            />
            <VictoryAxis
                dependentAxis
                label="Metrics"
                domain={[40, 100]}
                tickFormat={(x) => ``}
                style={{
                    axisLabel: { fontSize: 7.5, },
                    grid: { stroke: 'none', } // Hide grid lines
                }}
            />

            {metrics.map((metric, idx) => (
                <VictoryLine
                    key={metric.name}
                    data={transformDataForMetric(metric)}
                    style={{
                        data: { stroke: colors[idx % colors.length] }
                    }}
                    labels={({ datum }) => `${datum.y}`}
                    labelComponent={<VictoryTooltip style={{ fontSize: 7.5 }}/>}
                />
            ))}

            <VictoryLegend
                title="Metrics"
                centerTitle
                orientation="horizontal"
                gutter={10}
                x={50}
                y={10}
                style={{
                    title: { fontSize: 10 },
                    labels: { fontSize: 7.5 },
                }}
                data={metrics.map((metric, idx) => ({
                    name: metric.name,
                    symbol: { fill: colors[idx % colors.length] },
                    style: { fontSize: 10 }
                }))}
            />
        </VictoryChart>
    );
};
