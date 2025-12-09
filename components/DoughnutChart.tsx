
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  className?: string;
  title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options, className = '', title }) => {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#9CA3AF', // Gray-400
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20,
          boxWidth: 8
        }
      },
      title: {
        display: !!title,
        text: title,
        color: '#FFFFFF',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        },
        align: 'start',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#FFFFFF',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true
      }
    },
    cutout: '75%', // Thinner ring for modern look
    elements: {
        arc: {
            borderWidth: 0,
        }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={`w-full h-full relative ${className}`}>
      <Doughnut data={data} options={mergedOptions} />
      {/* Center Text Overlay (Optional visual flair) */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-[calc(100%-120px)] flex flex-col items-center justify-center pointer-events-none">
         {/* We assume the legend is on the right, so we offset the center calculation slightly or assume the chart area is the left part */}
      </div>
    </div>
  );
};

export default DoughnutChart;
