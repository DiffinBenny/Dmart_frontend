import React from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../utils/url";
import backgroundImage from "../../assets/e1.jpg";
import { orderupdateAPI } from "../../services/orderServices";

const OrderList = () => {
  const queryClient = useQueryClient();
  const updateOrderMutation = useMutation({
    mutationFn: orderupdateAPI,
    mutationKey: ["update"],
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorOrders']);
    },
  });

  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['vendorOrders'],
    queryFn: async () => {
      const token = sessionStorage.getItem('userToken');
      const response = await axios.get(`${BASE_URL}/vendor/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    select: (data) => {
      return data.map(order => ({
        id: order._id,
        orderNumber: `#${order._id.toString().slice(-4)}`,
        date: new Date(order.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        customer: order.user?.username || 'Unknown Customer',
        payment: order.paymentStatus || 'Pending',
        total: `${order.totalAmount?.toFixed(2) || '0.00'}`,
        cancellationReason: order.cancellationReason || '',
        items: `${order.items?.length || 0} items`,
        fulfillment: order.status || 'Pending',
        products: order.items?.map(item => ({
          name: item.product?.name,
          quantity: item.quantity
        })) || []
      }));
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderMutation.mutate({ orderId, status: newStatus });
  };

  const statusHierarchy = [
    "Pending",
    "Accepted",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const getDisabledStatus = (currentStatus, optionStatus) => {
    const currentIndex = statusHierarchy.indexOf(currentStatus);
    const optionIndex = statusHierarchy.indexOf(optionStatus);
    
    // Allow current status and all statuses after it, except Cancelled has special rules
    if (optionStatus === "Cancelled") {
      return currentStatus === "Delivered" || currentStatus === "Cancelled";
    }
    return optionIndex < currentIndex;
  };

  const totalOrders = orders?.length || 0;
  const fulfilledOrders = orders?.filter(o => o.fulfillment === 'Delivered').length || 0;
  const returnOrders = orders?.filter(o => o.fulfillment === 'Returned').length || 0;
  const totalItems = orders?.reduce((sum, order) => sum + (order.items?.length || 0), 0) || 0;
  const cancelltions= orders?.filter(o => o.fulfillment === 'Cancelled').length || 0;
  if (isLoading) {
    return (
      <OrderListContainer>
        <h1>Orders</h1>
        <LoadingMessage>Loading orders...</LoadingMessage>
      </OrderListContainer>
    );
  }

  if (isError) {
    return (
      <OrderListContainer>
        <h1>Orders</h1>
        <ErrorMessage>Error loading orders: {error.message}</ErrorMessage>
      </OrderListContainer>
    );
  }

  return (
    <OrderListContainer>
      <h1>Orders</h1>

      <Statistics>
        <Statistic>
          <h2>Total Orders</h2>
          <p>{totalOrders}</p>
        </Statistic>
        <Statistic>
          <h2>Order items</h2>
          <p>{totalItems}</p>
        </Statistic>
        <Statistic>
          <h2>Cancellations</h2>
          <p>{cancelltions}</p>
        </Statistic>
        <Statistic>
          <h2>Fulfilled</h2>
          <p>{fulfilledOrders}</p>
        </Statistic>
      </Statistics>

      <Table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Items</th>
            <th>Fulfilment</th>
            <th>Cancellation Reason</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td>{order.payment}</td>
              <td>{order.total}</td>
              <td>{order.items}</td>
             
              
              <td> 
                <StatusSelect
                  value={order.fulfillment}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updateOrderMutation.isLoading}
                >
                  {statusHierarchy.map((status) => (
                    <option
                      key={status}
                      value={status}
                      disabled={getDisabledStatus(order.fulfillment, status)}
                    >
                      {status}
                    </option>
                  ))}
                </StatusSelect>
              </td>
              <td>{order.cancellationReason}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </OrderListContainer>
  );
};

export default OrderList;

const OrderListContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  width: 100vw;
  // background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
`;

const Statistics = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Statistic = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.75rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.75rem;
    color: #333;
    margin: 0.5rem 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 1.5rem;
    border: 1px solid #ddd;
    text-align: left;
    color: #333;
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
    font-size: 1.5rem;
  }

  td {
    font-size: 1.25rem;
  }
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  width: 100%;
  background-color: white;
  color: #333;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  option:disabled {
    color: #999;
    background-color: #f5f5f5;
  }
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  color: #333;
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1.5rem;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 12px;
  color: #ff3333;
`;