import React from 'react';
import { Metric } from '../scenarios/scenario.tsx'
import '../styles/MetricsBar.css';

type MetricsBarProps = {
    metrics: Metric[];
};

type Formatter = (value: any) => string;

enum FormatterId {
    DOLLARS = "dollars",
    RATE = "rate",
    HUNDRED_SCORE = "hundred_score"
};

const HUNDRED_SCORE = 100;
const FRACTION_TO_PERCENT = 100;
const SINGLE_PERCENT = 1;

const DOLLARS_FORMATTER = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

const DEFAULT_FORMATTER: Formatter = (value: any) => `${value}`;

const FORMATTERS: Record<FormatterId, Formatter> = {
    dollars: (value: number) => DOLLARS_FORMATTER.format(value),
    rate: (value: number) => value.toFixed(2),
    hundred_score: (value: number) => (HUNDRED_SCORE * value).toFixed(0),
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
    const change = current - prior;
    if (change === null) return null;
    if (change === 0) return null;

    const isHigher = change > 0;
    const isBetter = isHigher === higherIsBetter;

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
    const amount = absChange < SINGLE_PERCENT ? "<1" : absChange.toFixed(0);
    const direction = isBetter ? "better" : "worse";
    const highEmoji = isHigher ? "📈" : "📉";
    const goodEmoji = isBetter ? "👍" : "👎";

    const trend = `${highEmoji}  ${amount}% ${direction}  ${goodEmoji}`;
    return trend;
}

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