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

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
    return (
        <div className="metrics-bar-container">
            {metrics.map((metric, index) => {
                const { formatId, name, value, explanation } = metric;
                const format = FORMATTERS?.[formatId] || DEFAULT_FORMATTER;
                const display = format(value);
                return (
                    <div className="metric" key={name}>
                        <div className="metric-name">{name}</div>
                        <div className="metric-value">{display}</div>
                        <span className="tooltip-text">{explanation}</span>
                    </div>
                )
            })}
        </div>
    );
};