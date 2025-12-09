
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
  ChartOptions,
  ChartData,
  ScriptableContext
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  className?: string;
  title?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, options, className = '', title }) => {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF', // Gray-400
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          usePointStyle: true,
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
        usePointStyle: true,
        callbacks: {
          labelColor: function(context) {
            return {
              borderColor: context.dataset.borderColor as string,
              backgroundColor: context.dataset.backgroundColor as string,
              borderWidth: 2,
              borderDash: [],
              borderRadius: 2,
            };
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151', // Gray-700
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            family: "'Inter', sans-serif"
          }
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          color: '#374151', // Gray-700
          // borderDash: [5, 5]
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            family: "'Inter', sans-serif"
          },
          padding: 10
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4 // Smooth curves
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={`w-full h-full ${className}`}>
      <Line data={data} options={mergedOptions} />
    </div>
  );
};

export default LineChart;
