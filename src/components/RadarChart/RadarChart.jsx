import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarChart = ({ data }) => {
    return (
        <div style={{ height: '100%', width: '600px' }}>
            <Radar
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12,
                                },
                            },
                        },
                    },
                    scales: {
                        r: {
                            ticks: {
                                display: true,
                                font: {
                                    size: 14,
                                },
                            },
                            pointLabels: {
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default RadarChart;
