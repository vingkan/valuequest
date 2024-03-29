import React from 'react';

// Define the props the MetricsBar component expects
export type Metric = {
    name: string;
    value: string;
};

type MetricsBarProps = {
    metrics: Metric[];
};

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
    return (
        <div className="metrics-bar-container">
            {metrics.map((metric, index) => (
                <div key={index} className="metric">
                    <div className="metric-name">{metric.name}</div>
                    <div className="metric-value">{metric.value}</div>
                </div>
            ))}
        </div>
    );
};