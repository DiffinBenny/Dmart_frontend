import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
import { productviewAPI, stockviewAPI } from "../../services/productServices";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);


const Report = () => {
  const [dateRange, setDateRange] = useState("week"); // week, month, year

  // Fetch orders
  const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders, error: ordersError } = useQuery({
    queryKey: ['vendorOrders'],
    queryFn: orderviewallAPI
  });

  const { data: stockData } = useQuery({
    queryKey: ['vendorstock'],
    queryFn: stockviewAPI 
  });

  // Fetch products
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: productviewAPI
  });

  // Filter orders based on date range
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate;
    });
  }, [orders, dateRange]);

  // Process data for charts and stats
  const processedData = useMemo(() => {
    if (!filteredOrders || filteredOrders.length === 0) {
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
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalSales / totalOrders;
    const productsSold = filteredOrders.reduce((sum, order) => sum + order.items.length, 0);

    // Group by day/week/month for sales chart based on date range
    const salesByDate = filteredOrders.reduce((acc, order) => {
      let dateKey;
      const orderDate = new Date(order.date);
      
      if (dateRange === "week") {
        // Group by day
        dateKey = orderDate.toLocaleDateString();
      } else if (dateRange === "month") {
        // Group by week
        const weekNum = Math.floor(orderDate.getDate() / 7) + 1;
        dateKey = `Week ${weekNum}`;
      } else {
        // Group by month for year
        dateKey = orderDate.toLocaleString('default', { month: 'short' });
      }
      
      acc[dateKey] = (acc[dateKey] || 0) + order.totalAmount;
      return acc;
    }, {});

    const salesLabels = Object.keys(salesByDate).sort((a, b) => {
      if (dateRange === "week") {
        return new Date(a) - new Date(b);
      } else if (dateRange === "month") {
        return parseInt(a.replace('Week ', '')) - parseInt(b.replace('Week ', ''));
      } else {
        // For year, sort by month index
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a) - months.indexOf(b);
      }
    });
    
    const salesValues = salesLabels.map(date => salesByDate[date]);

    // Group by category
    const categoryCount = {};
    filteredOrders.forEach(order => {
      order?.items?.forEach(item => {
        const category = item.product?.category || 'Unknown';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    const categoryLabels = Object.keys(categoryCount);
    const categoryValues = Object.values(categoryCount);

    // Group by status
    const statusCount = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const statusLabels = Object.keys(statusCount);
    const statusValues = Object.values(statusCount);

    // Get recent orders (last 5)
    const recentOrders = [...filteredOrders]
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
  }, [filteredOrders, dateRange]);

  if (isLoadingOrders || isLoadingProducts) return <div>Loading...</div>;
  if (isErrorOrders) return <div>Error: {ordersError.message}</div>;
  if (isErrorProducts) return <div>Error: {productsError.message}</div>;

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
          <TrendText>
            {dateRange === "week" ? "vs last week" : 
             dateRange === "month" ? "vs last month" : "vs last year"}
          </TrendText>
        </StatCard>
        <StatCard>
          <h3>Total Orders</h3>
          <p>{processedData.totalOrders}</p>
          <TrendText>
            {dateRange === "week" ? "vs last week" : 
             dateRange === "month" ? "vs last month" : "vs last year"}
          </TrendText>
        </StatCard>
        <StatCard>
          <h3>Average Order Value</h3>
          <p>₹{processedData.avgOrderValue.toFixed(2)}</p>
          <TrendText>
            {dateRange === "week" ? "vs last week" : 
             dateRange === "month" ? "vs last month" : "vs last year"}
          </TrendText>
        </StatCard>
        <StatCard>
          <h3>Products Sold</h3>
          <p>{processedData.productsSold}</p>
          <TrendText>
            {dateRange === "week" ? "vs last week" : 
             dateRange === "month" ? "vs last month" : "vs last year"}
          </TrendText>
        </StatCard>
      </StatsGrid>

      <ChartGrid>
        <ChartCard>
          <h2>Sales Overview</h2>
          {processedData.salesData.labels.length > 0 ? (
            <Line 
              data={processedData.salesData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: dateRange === "week" ? 'Daily Sales' : 
                          dateRange === "month" ? 'Weekly Sales' : 'Monthly Sales'
                  }
                }
              }} 
            />
          ) : (
            <p>No sales data available</p>
          )}
        </ChartCard>

        <ChartCard>
          <h2>Category Distribution</h2>
          {processedData.categoryData.labels.length > 0 ? (
            <Doughnut 
              data={processedData.categoryData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `Status for ${dateRange}ly orders`,
                  },
                  datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value, context) => {
                      const dataset = context.dataset.data;
                      const total = dataset.reduce((sum, val) => sum + val, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `${percentage}%`;
                    },
                    font: {
                      weight: 'bold',
                    },
                  },
                },
              }}
            />
          ) : (
            <p>No category data available</p>
          )}
        </ChartCard>

        <ChartCard wide>
  <h2>Order Status</h2>
  {processedData.orderStatusData.labels.length > 0 ? (
    <Bar
    data={processedData.orderStatusData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `Status for ${dateRange}ly orders`
                  }
                }
              }}
    />
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

      <Section>
        <h2>Stock Management</h2>
        <Table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Stock Added</th>
              <th>Total Stock</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stockData && stockData.length > 0 ? (
              stockData.map(product => (
                <tr key={product.productId}>
                  <td>#{product.productId.slice(-6)}</td>
                  <td>{product.productName}</td>
                  <td>{product.currentStock}</td>
                  <td>{product.stockAdded}</td>
                  <td>{product.totalStock}</td>
                  <td>{product.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No stock data available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>
    </ReportContainer>
  );
};

// Styled Components
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
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const DateFilter = styled.div`
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  backdrop-filter: blur(5px);
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: ${props => props.active ? '#4a6bff' : 'transparent'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? 'bold' : 'normal'};

  &:hover {
    background-color: ${props => props.active ? '#4a6bff' : 'rgba(255, 255, 255, 0.1)'};
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
  border: 1px solid rgba(255, 255, 255, 0.2);

  h3 {
    margin: 0;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }

  p {
    margin: 0.5rem 0;
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }
`;

const TrendText = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
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
  border: 1px solid rgba(255, 255, 255, 0.2);

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    color: white;
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