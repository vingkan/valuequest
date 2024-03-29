import React from 'react';
import { Metric } from '../scenarios/scenario.tsx'
import '../styles/MetricsBar.css';

type MetricsBarProps = {
    metrics: Metric[];
};

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
    return (
        <div className="metrics-bar-container">
            {metrics.map((metric, index) => (
                <div className="metric" key={metric.name}>
                    <div className="metric-name">{metric.name}</div>
                    <div className="metric-value">{metric.value}</div>
                    <span className="tooltip-text">{metric.explanation}</span>
                </div>
            ))}
        </div>
    );
};