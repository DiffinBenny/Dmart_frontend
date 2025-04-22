import React, { useState } from 'react';
import styled from 'styled-components';
import orderImage from '../assets/order.jpg';
import { ordercancelAPI, orderviewAPI } from '../services/orderServices';
import { useMutation, useQuery } from '@tanstack/react-query';
import { reviewaddAPI } from '../services/reviewServices';
import axios from 'axios';

const Order = () => {
  const { data: orderData, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: orderviewAPI
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['review'],
    mutationFn: reviewaddAPI
  });

  // State for reviews (rating and text) for each product, ensuring defaults
  const [productReviews, setProductReviews] = useState({});

  // State for cancellation form
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  
  const cancelMutation= useMutation({
    mutationKey: ['cancel'],
    mutationFn: ordercancelAPI
  });
  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelForm(true);
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      // Call the API to cancel the order
      // Replace with your actual API call
      // await cancelOrderAPI(selectedOrderId, cancelReason);
      alert(`Order ${selectedOrderId} cancelled successfully. Reason: ${cancelReason}`);
      await cancelMutation.mutate({orderId:selectedOrderId,reason:cancelReason})
      setCancelledOrders((prev) => [...prev, selectedOrderId]);
      setShowCancelForm(false);
      setCancelReason('');
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error loading orders</div>;

  const handleRatingClick = (productId, rate) => {
    setProductReviews((prevReviews) => ({
      ...prevReviews,
      [productId]: { 
        ...prevReviews[productId], 
        rating: rate 
      }
    }));
  };
  
  const handleReviewTextChange = (productId, event) => {
    setProductReviews((prevReviews) => ({
      ...prevReviews,
      [productId]: { 
        ...prevReviews[productId], 
        reviewText: event.target.value 
      }
    }));
  };
  
  const handleSubmitReview = async (productId) => {
    const review = productReviews[productId] || {};  // Fallback to empty object if undefined
    const reviewData = {
      id: productId,
      comment: review.reviewText || 'Nil',  // Default to empty string if reviewText is undefined
      rating: review.rating || 0,  // Default to 0 if rating is undefined
    };
  
    try {
      // Call the mutation to add the review
      await mutateAsync(reviewData);
      
      alert(`Review Submitted! Product: ${productId}, Rating: ${review.rating}, Review: ${review.reviewText}`);
      
      // Optionally clear the review state after submitting
      setProductReviews((prevReviews) => ({
        ...prevReviews,
        [productId]: { rating: 0, reviewText: '' },  // Reset the review for this product
      }));
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Failed to submit review. Please try again later.');
    }
  };

  return (
    <div className="order-container">
      <h2 className="order-title">Order Details</h2>

      {orderData?.orders?.map((order) => (
        <div
          key={order?._id}
          className={`order-summary ${cancelledOrders.includes(order?._id) ? 'cancelled' : ''}`}
        >
          <p>
            <strong>Order ID:</strong> {order?._id}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order?.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {order?.status}
          </p>
          {(order.cancellationReason)&&( <p> <strong>Cancellation Reason:</strong> {order?.cancellationReason}</p>)}
          <p>
            <strong>Total Amount:</strong> ₹{order?.totalAmount?.toLocaleString()}
          </p>

          <div className="order-items">
            <h3>Items</h3>
            {order?.items?.map((item) => (
              <div key={item?._id} className="order-item">
                <img src={item?.product?.images[0]} alt={item.name} className="item-image" />
                <div className="item-details">
                  <p>
                    <strong>{item?.product?.name}</strong>
                  </p>
                  {item?.product?.size[0] && (
                    <p>Size: {item?.product?.size[0]}</p>
                  )}
                  {item?.product?.volume[0] && (
                    <p>Volume: {item?.product?.volume}</p>
                  )}
                  <p>Price: ₹{item?.product?.price}</p>
                  <p>Quantity: {item?.quantity}</p>
                </div>

                {/* Review Section for each product */}
                <div className="review-section">
                  <h4>Write a Review for {item?.product?.name}</h4>

                  {/* Star Rating for this product */}
                  <div className="rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${productReviews[item?.product?._id]?.rating >= star ? 'filled' : ''}`}
                        onClick={() => handleRatingClick(item?.product?._id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Textbox for Review */}
                  <textarea
                    className="review-text"
                    placeholder="Write your review here..."
                    value={productReviews[item?.product?._id]?.reviewText || ''}
                    onChange={(e) => handleReviewTextChange(item?.product?._id, e)}
                  ></textarea>

                  <button
                    className="btn submit-btn"
                    onClick={() => handleSubmitReview(item?.product?._id)}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cancel Button */}
          {!cancelledOrders.includes(order?._id) && (
            <button
              className="cancel-button"
              onClick={() => handleCancelClick(order?._id)}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}

      {/* Cancellation Form */}
      {showCancelForm && (
        <CancelForm>
          <h3>Cancel Order</h3>
          <textarea
            placeholder="Enter reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          ></textarea>
          <button onClick={handleCancelSubmit}>Submit</button>
          <button onClick={() => setShowCancelForm(false)}>Close</button>
        </CancelForm>
      )}

      {/* CSS Styles for the Order Page */}
      <style jsx>{`
        .order-container {
          padding: 20px;
          background-image: url(${orderImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
        }

        .order-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .order-summary {
          background-color: rgba(255, 255, 255, 0.9);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .order-summary p {
          font-size: 16px;
          margin: 5px 0;
          color: #333;
        }

        .order-items {
          width: 100%;
          margin-top: 15px;
        }

        .order-items h3 {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 15px;
          color: #333;
        }

        .order-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .order-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 15px;
        }

        .item-details p {
          margin: 5px 0;
          color: #333;
        }

        .review-section {
          margin-top: 30px;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .review-section h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }

        .rating-container {
          font-size: 24px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }

        .star {
          color: #ddd;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .star.filled {
          color: #ff5733;
        }

        .star:hover {
          color: #ff5733;
        }

        .review-text {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 20px;
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          padding: 10px 20px;
          border: none;
          background-color: #ff5733;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s ease;
        }

        .submit-btn:hover {
          background-color: #e04b2f;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          background-color: #ff5733;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s ease;
        }

        .btn:hover {
          background-color: #e04b2f;
        }

        .cancel-button {
          padding: 10px 20px;
          border: none;
          background-color: #ff5733;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s ease;
          margin-top: 10px;
        }

        .cancel-button:hover {
          background-color: #e04b2f;
        }

        .order-summary.cancelled {
          background: #f0f0f0;
          color: #888;
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

// Styled Components
const CancelForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export default Order;
