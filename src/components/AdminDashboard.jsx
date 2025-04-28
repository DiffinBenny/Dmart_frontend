import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import styled from "styled-components";
import { adminusersAPI, adminvendorAPI, adminviewallAPI } from "../services/adminServices";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { getAllComplaintsAPI } from "../services/complaintServices";
import { vendordeleteAPI } from "../services/VendorServices";
import { getPaymentsAPI } from "../services/paymentServices";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ReportChart Component (Nested)
const ReportChart = ({ reportData }) => {
  // Function to get the last 7 days' dates in YYYY-MM-DD format
  const getLast7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // e.g., "2025-04-23"
    }
    return dates;
  };

  // Aggregate orders by day
  const aggregateOrdersByDay = () => {
    const days = getLast7Days();
    const revenueByDay = days.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {});

    // Sum totalAmount for each day
    reportData?.orders?.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      if (revenueByDay.hasOwnProperty(orderDate)) {
        revenueByDay[orderDate] += order.totalAmount;
      }
    });

    return days.map((day) => revenueByDay[day] || 0);
  };

  // Chart data
  const chartData = {
    labels: getLast7Days().map((date) =>
      new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    ), // e.g., "Apr 23"
    datasets: [
      {
        label: "Daily Revenue",
        data: aggregateOrdersByDay(),
        backgroundColor: "#60a5fa",
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Daily Revenue (Last 7 Days)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (₹)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  // Handle empty or invalid data
  if (!reportData?.orders || reportData.orders.length === 0) {
    return <p>No order data available for the selected period.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.aside`
  width: 16rem;
  background-color: #1f2937;
  color: white;
  padding: 1.25rem;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const SidebarNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button {
    width: 100%;
    text-align: left;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;

    &:hover {
      color: #60a5fa;
    }

    &.active {
      color: #60a5fa;
    }
  }

  ul ul {
    margin-left: 1rem;
    margin-top: 0.5rem;

    button {
      color: #d1d5db;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1.5rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.875rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  div {
    display: flex;
    gap: 1rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;

      &:first-child {
        background-color: #d1d5db;
      }

      &:last-child {
        background-color: #ef4444;
        color: white;
      }
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    font-size: 2.25rem;
  }

  div {
    h2 {
      font-size: 1.125rem;
      font-weight: 600;
    }

    p {
      font-size: 1.25rem;
      font-weight: bold;
    }
  }
`;

const UserManagementContainer = styled.div`
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f9fafb;
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .completed {
    background-color: #dcfce7;
    color: #166534;
  }

  .pending {
    background-color: #fef9c3;
    color: #854d0e;
  }

  .failed {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .online {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .cod {
    background-color: #d1fae5;
    color: #065f46;
  }

  .user-avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background-color: #e5e7eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  button {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    cursor: pointer;
    border: none;
    font-weight: 500;
    font-size: 0.875rem;

    &.view-btn {
      background-color: #60a5fa;
      color: white;

      &:hover {
        background-color: #3b82f6;
      }
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch users data
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminusersAPI,
  });
console.log(users);

  const {
    data: complaints,
  } = useQuery({
    queryKey: ["feedback"],
    queryFn: getAllComplaintsAPI,
  });
console.log(complaints);

  // Fetch report data
  const {
    data: report,
    isLoading: isReportLoading,
    error: reportError,
  } = useQuery({
    queryKey: ["report"],
    queryFn: adminviewallAPI,
  });

  const sum = report?.orders?.reduce((accumulator, order) => accumulator + order.totalAmount, 0);

  // Mutation for verifying/rejecting users
  const { mutateAsync, isLoading: isMutationLoading } = useMutation({
    mutationKey: ["admin-users"],
    mutationFn: adminvendorAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
    },
  });

  const delMutation = useMutation({
    mutationKey: ["venor-del"],
    mutationFn: vendordeleteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      queryClient.invalidateQueries(["feedback"]);
    },
  });

  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payment-details"],
    queryFn: getPaymentsAPI,
  });

  // Dashboard stats
  const dashboardStats = [
    { title: "Total Revenue", count: sum, icon: "💳" },
    { title: "Total Customers", count: report?.users?.length, icon: "👥" },
    { title: "Total Transactions", count: report?.orders?.length, icon: "📈" },
  ];

  // Sidebar menu items
  const menuItems = [
    { title: "Dashboard" },
    { title: "Users Management" },
    { title: "Payment Management" },
    { title: "Feedback & Support" },
    { title: "Report" },
  ];

  // Handle user verification
  const handleVerify = async (email) => {
    try {
      const values = { email, accountStatus: "approved" };
      await mutateAsync(values);
      alert("User verified successfully!");
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("An error occurred during verification. Please try again.");
    }
  };

  // Handle user rejection
  const handleReject = async (email) => {
    try {
      const values = { email, accountStatus: "rejected" };
      await mutateAsync(values);
      alert("User rejected successfully!");
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("An error occurred during rejection. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await delMutation.mutateAsync(id);
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred during deletion. Please try again.");
    }
  };

  const handleViewDetails = (paymentId) => {
    console.log("View payment details:", paymentId);
    // navigate(`/payment/${paymentId}`);
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <SidebarTitle>E-mart</SidebarTitle>
        <SidebarNav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className={selectedMenu === item.title ? "active" : ""}
                  onClick={() => {
                    if (item.subItems) {
                      setOpenDropdown(openDropdown === index ? null : index);
                    } else {
                      setSelectedMenu(item.title);
                      setOpenDropdown(null);
                    }
                  }}
                >
                  {item.title}
                </button>
                {item.subItems && openDropdown === index && (
                  <ul>
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <button onClick={() => setSelectedMenu(subItem)}>{subItem}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </SidebarNav>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {/* Header */}
        <Header>
          <h1>{selectedMenu}</h1>
          <div>
            {/* <button>🔍 Search Reports</button> */}
            <Logout />
          </div>
        </Header>

        {/* Stats Cards */}
        {selectedMenu === "Dashboard" && (
          <StatsGrid>
            {dashboardStats.map((stat, index) => (
              <StatCard key={index}>
                <span>{stat.icon}</span>
                <div>
                  <h2>{stat.title}</h2>
                  <p>{stat.count}</p>
                </div>
              </StatCard>
            ))}
          </StatsGrid>
        )}

        {/* User Management */}
        {selectedMenu === "Users Management" && (
          <UserManagementContainer>
            <h2>User Management</h2>
            {isUsersLoading ? (
              <p>Loading users...</p>
            ) : usersError ? (
              <p>Error loading users: {usersError.message}</p>
            ) : (
              <UserTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>GST Number</th>
                    <th>Action</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user, index) => (
                    <tr key={index}>
                      <td>{user?.businessName}</td>
                      <td>{user?.user?.email}</td>
                      <td>{user.gstNumber || "N/A"}</td>
                      {/* <td>{user.subscribed ? "Yes" : "No"}</td> */}
                      <td>
                        {user?.user?.verified === true ? (
                          <button disabled style={{ backgroundColor: "#4CAF50", color: "white" }}>
                            Verified
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleVerify(user?.user?.email)}
                              disabled={isMutationLoading}
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleReject(user?.user?.email)}
                              disabled={isMutationLoading}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={isMutationLoading}
                          style={{ backgroundColor: "#ef4444", color: "white" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </UserTable>
            )}
          </UserManagementContainer>
        )}

        {/* Payment Management */}
        {selectedMenu === "Payment Management" && (
          <UserManagementContainer>
            <h2>Payment Transactions</h2>
            {isPaymentsLoading ? (
              <p>Loading payment data...</p>
            ) : (
              <UserTable>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments?.map((payment) => (
                    <tr key={payment._id}>
                      <td className="font-medium">{payment.order || "N/A"}</td>
                      <td>
                        <div className="user-avatar">
                          {payment.user?.name?.charAt(0) || "U"}
                        </div>
                        {payment.user?.username || "Unknown"}
                      </td>
                      <td>₹{payment.amount?.toLocaleString()}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            payment.paymentMethod === "online" ? "online" : "cod"
                          }`}
                        >
                          {payment.paymentMethod || "COD"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            payment.paymentStatus === "completed"
                              ? "completed"
                              : payment.paymentStatus === "failed"
                              ? "failed"
                              : "pending"
                          }`}
                        >
                          {payment.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </UserTable>
            )}
          </UserManagementContainer>
        )}

        {/* Feedback & Support */}
        {selectedMenu === "Feedback & Support" && (
          <UserManagementContainer>
            <h2>Complaints Management</h2>
            <UserTable>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>User </th>
                  <th>Created At</th>
                  <th>Business Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints?.map((complaint, index) => (
                  <tr key={index}>
                    <td>{complaint.subject}</td>
                    <td>{complaint.description}</td>
                    <td>{complaint?.user?.username}</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>{complaint?.vendor?.businessName}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(complaint?.vendor?._id)}
                        disabled={isMutationLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </UserTable>
          </UserManagementContainer>
        )}

        {/* Report Section */}
        {selectedMenu === "Report" && (
          <UserManagementContainer>
            <h2>Report</h2>
            {isReportLoading ? (
              <p>Loading report...</p>
            ) : reportError ? (
              <p>Error loading report: {reportError.message}</p>
            ) : (
              <div>
                <ReportChart reportData={report} />
              </div>
            )}
          </UserManagementContainer>
        )}
      </MainContent>
    </Container>
  );
};

export default AdminDashboard;