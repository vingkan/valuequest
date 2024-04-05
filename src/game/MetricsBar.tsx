import React from 'react';
import { Metric, MetricGroup } from '../scenarios/scenario.tsx'
import '../styles/MetricsBar.css';

type MetricsBarProps = {
    metrics: Metric[];
};

type FocusMetricProps = {
    metric: Metric;
};

type FocusMetricGroupProps = {
    group: MetricGroup;
};

type FocusMetricsProps = {
    groups: MetricGroup[];
};

type Formatter = (value: any) => string;

enum FormatterId {
    CENTS_TO_DOLLARS = "cents_to_dollars",
    RATE = "rate",
    HUNDRED_SCORE = "hundred_score",
    NUMBER_COMMA = "number_comma",
    PERCENTAGE = "percentage"
};

const CENTS_PER_DOLLAR = 100;
const HUNDRED_SCORE = 100;
const FRACTION_TO_PERCENT = 100;
const SINGLE_PERCENT = 1;

const DOLLARS_FORMATTER = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

const COMMA_FORMATTER = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

const DEFAULT_FORMATTER: Formatter = (value: any) => `${value}`;

const FORMATTERS: Record<FormatterId, Formatter> = {
    cents_to_dollars: (value: number) => (
        DOLLARS_FORMATTER.format(value / CENTS_PER_DOLLAR)
    ),
    rate: (value: number) => value.toFixed(2),
    hundred_score: (value: number) => (HUNDRED_SCORE * value).toFixed(1),
    number_comma: (value: number) => COMMA_FORMATTER.format(value),
    percentage: (value: number) => (
        (FRACTION_TO_PERCENT * value).toFixed(1) + "%"
    ),
};

function getPercentageChange(current: number, prior: number): number | null {
    if (!prior) return null;

    const change = current - prior;
    const percentageChange = (change / prior) * FRACTION_TO_PERCENT;
    return percentageChange;
}

function getIsBetter(
    current: number,
    prior: number,
    higherIsBetter: boolean
): boolean | null {
    const percentageChange = getPercentageChange(current, prior);
    if (percentageChange === null) return null;
    if (percentageChange === 0) return null;

    const isHigher = percentageChange > 0;
    const isBetter = isHigher === higherIsBetter;

    const absChange = Math.abs(percentageChange);
    const isSmall = absChange < SINGLE_PERCENT;
    if (isSmall) return null;

    return isBetter;
}

function getTrend(
    current: number,
    prior: number,
    higherIsBetter: boolean
): string | null {
    const percentageChange = getPercentageChange(current, prior);
    if (percentageChange === null) return null;
    if (percentageChange === 0) return "no change";

    const absChange = Math.abs(percentageChange);
    const isHigher = percentageChange > 0;
    const isBetter = getIsBetter(current, prior, higherIsBetter);

    if (isBetter === null) {
        const isHigher = percentageChange > 0;
        const isImprovement = isHigher === higherIsBetter;
        const direction = isImprovement ? "better" : "worse";
        return `<${SINGLE_PERCENT}% ${direction}`
    }

    const amount = absChange.toFixed(0);
    const direction = isBetter ? "better" : "worse";
    const highEmoji = isHigher ? "📈" : "📉";
    const goodEmoji = isBetter ? "👍" : "👎";

    const trend = `${highEmoji}  ${amount}% ${direction}  ${goodEmoji}`;
    return trend;
}

const FocusMetricCard: React.FC<FocusMetricProps> = ({metric }) => {
    const { name, formatId, higherIsBetter, value, priorValue } = metric
    const format = FORMATTERS?.[formatId] || DEFAULT_FORMATTER;
    const display = format(value);

    const prior = priorValue !== undefined && format(priorValue);
    const trend = getTrend(value, priorValue, higherIsBetter);
    const isBetter = getIsBetter(value, priorValue, higherIsBetter);
    const hasComparatorClass = (
        priorValue !== undefined ? "has-comparator" : ""
    );
    const deltaClass = (
        isBetter !== null && (isBetter ? "better" : "worse")
    );

    return (
        <div className="focus-metric-card">
            <h4 className="focus-metric-name">{name}</h4>
            <p>{display}</p>
            {priorValue !== undefined && (
                <div className="comparator">
                    {trend && (
                        <div className={`delta ${deltaClass}`}>
                            {trend}
                        </div>
                    )}
                    <div className="prior">
                        vs {prior} last year
                    </div>
                </div>
            )}
        </div>
    )
};

const FocusMetricGroup: React.FC<FocusMetricGroupProps> = ({ group }) => {
    return (
        <div className="focus-metric-group">
            <h3 className="focus-metric-group-name">{group.name}</h3>
            {group.metrics.map((metric) => (
                <FocusMetricCard key={metric.variable} metric={metric} />
            ))}
        </div>
    )
};

export const FocusMetrics: React.FC<FocusMetricsProps> = ({ groups }) => {
    return (
        <div className="focus-metric-container">
            {groups.map((group) => (
                <FocusMetricGroup key={group.name} group={group} />
            ))}
        </div>
    )
};

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
    return (
        <div className="metrics-bar-container">
            {metrics.map((metric, index) => {
                const {
                    name,
                    higherIsBetter,
                    explanation,
                    formatId,
                    value,
                    priorValue,
                } = metric;
                const format = FORMATTERS?.[formatId] || DEFAULT_FORMATTER;
                const display = format(value);
                const prior = priorValue !== undefined && format(priorValue);
                const trend = getTrend(value, priorValue, higherIsBetter);
                const isBetter = getIsBetter(value, priorValue, higherIsBetter);
                const hasComparatorClass = (
                    priorValue !== undefined ? "has-comparator" : ""
                );
                const deltaClass = (
                    isBetter !== null && (isBetter ? "better" : "worse")
                );

                return (
                    <div className={`metric ${hasComparatorClass}`} key={name}>
                        <div className="metric-name">{name}</div>
                        <div className="metric-value">{display}</div>
                        <span className="tooltip-text">{explanation}</span>
                        {priorValue !== undefined && (
                            <div className="comparator">
                                {trend && (
                                    <div className={`delta ${deltaClass}`}>
                                        {trend}
                                    </div>
                                )}
                                <div className="prior">
                                    vs {prior} last year
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};