import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportChart = ({ reportData }) => {
  // Prepare the data for the chart
  const chartData = {
    labels: reportData.orders.map((order) => new Date(order.date).toLocaleDateString()), // Assuming orders contain a date
    datasets: [
      {
        label: 'Total Amount',
        data: reportData.orders.map((order) => order.totalAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Total Amount Over Time',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ReportChart;
