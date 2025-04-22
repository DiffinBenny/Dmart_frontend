import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import backgroundImage from "../../assets/e1.jpg";
import { orderviewallAPI } from "../../services/orderServices";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [dateRange, setDateRange] = useState("week"); // week, month, year
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['vendorOrders'],
    queryFn: orderviewallAPI
  });

  // Process data for charts and stats
  const processedData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        productsSold: 0,
        salesData: { labels: [], datasets: [] },
        categoryData: { labels: [], datasets: [] },
        orderStatusData: { labels: [], datasets: [] },
        recentOrders: []
      };
    }

    // Calculate totals
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalSales / totalOrders;
    const productsSold = orders.reduce((sum, order) => sum + order.items.length, 0);

    // Group by day for sales chart
    const salesByDay = orders.reduce((acc, order) => {
      const date = new Date(order.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});

    const salesLabels = Object.keys(salesByDay).sort();
    const salesValues = salesLabels.map(date => salesByDay[date]);

    // Group by category (assuming items have category property)
    const categoryCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product?.category || 'Unknown';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    const categoryLabels = Object.keys(categoryCount);
    const categoryValues = Object.values(categoryCount);

    // Group by status
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const statusLabels = Object.keys(statusCount);
    const statusValues = Object.values(statusCount);

    // Get recent orders (last 5)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return {
      totalSales,
      totalOrders,
      avgOrderValue,
      productsSold,
      salesData: {
        labels: salesLabels,
        datasets: [
          {
            label: "Sales",
            data: salesValues,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      categoryData: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryValues,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ].slice(0, categoryLabels.length),
          },
        ],
      },
      orderStatusData: {
        labels: statusLabels,
        datasets: [
          {
            label: "Orders",
            data: statusValues,
            backgroundColor: [
              "#FFA500",
              "#00BFFF",
              "#32CD32",
              "#4169E1",
              "#DC143C",
            ].slice(0, statusLabels.length),
          },
        ],
      },
      recentOrders
    };
  }, [orders]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ReportContainer>
      <Header>
        <h1>Vendor Dashboard</h1>
        <DateFilter>
          <Button
            active={dateRange === "week"}
            onClick={() => setDateRange("week")}
          >
            Week
          </Button>
          <Button
            active={dateRange === "month"}
            onClick={() => setDateRange("month")}
          >
            Month
          </Button>
          <Button
            active={dateRange === "year"}
            onClick={() => setDateRange("year")}
          >
            Year
          </Button>
        </DateFilter>
      </Header>

      <StatsGrid>
        <StatCard>
          <h3>Total Sales</h3>
          <p>₹{processedData.totalSales.toLocaleString()}</p>
          <span className="trend positive">↑ 15%</span>
        </StatCard>
        <StatCard>
          <h3>Total Orders</h3>
          <p>{processedData.totalOrders}</p>
          <span className="trend positive">↑ 8%</span>
        </StatCard>
        <StatCard>
          <h3>Average Order Value</h3>
          <p>₹{processedData.avgOrderValue.toFixed(2)}</p>
          <span className="trend positive">↑ 5%</span>
        </StatCard>
        <StatCard>
          <h3>Products Sold</h3>
          <p>{processedData.productsSold}</p>
          <span className="trend negative">↓ 3%</span>
        </StatCard>
      </StatsGrid>

      <ChartGrid>
        <ChartCard>
          <h2>Sales Overview</h2>
          {processedData.salesData.labels.length > 0 ? (
            <Line data={processedData.salesData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Daily Sales'
                }
              }
            }} />
          ) : (
            <p>No sales data available</p>
          )}
        </ChartCard>

        <ChartCard>
          <h2>Category Distribution</h2>
          {processedData.categoryData.labels.length > 0 ? (
            <Doughnut data={processedData.categoryData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                }
              }
            }} />
          ) : (
            <p>No category data available</p>
          )}
        </ChartCard>

        <ChartCard wide>
          <h2>Order Status</h2>
          {processedData.orderStatusData.labels.length > 0 ? (
            <Bar data={processedData.orderStatusData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            }} />
          ) : (
            <p>No order status data available</p>
          )}
        </ChartCard>
      </ChartGrid>

      <Section>
        <h2>Recent Orders</h2>
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {processedData.recentOrders.length > 0 ? (
              processedData.recentOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.name}</td>
                  <td>{order.items.length} items</td>
                  <td>₹{order.totalAmount}</td>
                  <td><StatusBadge status={order.status.toLowerCase()}>{order.status}</StatusBadge></td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No recent orders</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </ReportContainer>
  );
};


const ReportContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    margin: 0;
  }
`;

const DateFilter = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: ${props => props.active ? '#007bff' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #007bff;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }

  p {
    margin: 0.5rem 0;
    font-size: 2rem;
    font-weight: bold;
  }

  .trend {
    font-size: 0.9rem;
    &.positive { color: #4caf50; }
    &.negative { color: #f44336; }
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  grid-column: ${props => props.wide ? 'span 2' : 'span 1'};

  h2 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.5rem;
  }

  @media (max-width: 900px) {
    grid-column: span 1;
  }
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    color: #333;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'delivered':
        return 'background: #e8f5e9; color: #2e7d32;';
      case 'processing':
        return 'background: #e3f2fd; color: #1565c0;';
      case 'pending':
        return 'background: #fff3e0; color: #ef6c00;';
      case 'cancelled':
        return 'background: #ffebee; color: #c62828;';
      default:
        return 'background: #f5f5f5; color: #616161;';
    }
  }}
`;

export default Report;