import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: 'Sales and Order Data',
        },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: false,
            },
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Sales',
            data: [12, 34, 56, 87, 23, 45],
            borderColor: '#198753',
            backgroundColor: 'rgba(42,11,7,83,0.5)',
            yAxisID: 'y',
        },
        {
            label: 'Orders',
            data: [34, 67, 54, 32, 98, 56, 35],
            borderColor: 'rgb(220,52,69 )',
            backgroundColor: 'rgba(201,68,82,0.5)',
            yAxisID: 'y1',
        },
    ],
};

export default function SalesCharts() {
    return <Line options={options} data={data} />;
}
