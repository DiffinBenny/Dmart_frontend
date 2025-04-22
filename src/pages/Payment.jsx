import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useGlobalContext } from "../context/context";
import { cartgetAPI } from "../services/cartServices";
import { createPaymentAPI } from "../services/paymentServices";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useGlobalContext();
  const params = useParams();
console.log(params); // Log all parameters
const orderId= params.id;
console.log(orderId);
  
  const [cardDetails, setCardDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Get shipping details from localStorage
  const shippingDetails = JSON.parse(localStorage.getItem("shippingDetails") || "{}");

  // Fetch cart data
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartgetAPI,
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: createPaymentAPI ,
    onSuccess: () => {
      // Show success message
      alert("Payment successfully completed! Order will be placed in 7 days");
      // Clear localStorage
      localStorage.removeItem("shippingDetails");
      // Redirect to home page
      navigate("/");
    },
    onError: (error) => {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Error processing payment. Please try again.");
    }
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const formatPrice = (price) => {
    if (!price || isNaN(parseFloat(price))) return "Rs. 0.00";
    return `Rs. ${parseFloat(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handlePayNow = async () => {
    // Validate shipping details
    // if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address || 
    //     !shippingDetails.city || !shippingDetails.pincode || !shippingDetails.phone || 
    //     !shippingDetails.email) {
    //   alert("Missing shipping details. Please complete checkout first.");
    //   navigate('/checkout');
    //   return;
    // }

    // Validate cart
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      alert("Your cart is empty");
      navigate('/cart');
      return;
    }

    // Validate card details
    if (!cardDetails.cardName || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      alert("Please fill in all card details");
      return;
    }

    // Basic validation for card number (16 digits)
    if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    // Basic validation for CVV (3 or 4 digits)
    if (!/^\d{3}$/.test(cardDetails.cvv)) {
      alert("Please enter a valid CVV");
      return;
    }

    // Basic validation for expiry date (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      alert("Please enter expiry date in MM/YY format");
      return;
    }

    try {
      // Calculate total amount from cart items
      // const totalAmount = cartData.items.reduce((sum, item) => 
      //   sum + (parseFloat(item.product.price) * parseInt(item.quantity)), 0);

      // // Create payment data object
      // const paymentData = {
      //   amount: totalAmount,
      //   paymentMethod: 'credit_card',
      //   cardDetails: {
      //     cardName: cardDetails.cardName,
      //     cardNumber: cardDetails.cardNumber.slice(-4), // Only store last 4 digits
      //     expiryDate: cardDetails.expiryDate
      //   },
      //   shippingDetails: {
      //     fullName: shippingDetails.fullName,
      //     address: shippingDetails.address,
      //     city: shippingDetails.city,
      //     pincode: shippingDetails.pincode,
      //     phone: shippingDetails.contact,
      //     email: shippingDetails.email
      //   }
      // };

      // Process payment
      await paymentMutation.mutate({id:orderId});
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Error processing payment. Please try again.");
    }
  };

  // if (!shippingDetails.fullName) {
  //   navigate('/checkout');
  //   return null;
  // }

  return (
    <PaymentWrapper>
      <PaymentContainer>
        <h1>Payment</h1>
        
        <PaymentGrid>
          <OrderSummary>
            <h2>Order Summary</h2>
            <CartItems>
              {cartData?.items?.map((item) => (
                <CartItem key={item.product._id}>
                  <ItemImage>
                    <img 
                      src={item.product.images?.[0]} 
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </ItemImage>
                  <ItemInfo>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemDetails>
                      {item.product.category && (
                        <CategoryTag>{item.product.category}</CategoryTag>
                      )}
                      {item.product.size && (
                        <DetailTag>Size: {item.product.size}</DetailTag>
                      )}
                      {item.product.color && (
                        <DetailTag>Color: {item.product.color}</DetailTag>
                      )}
                    </ItemDetails>
                    <ItemPrice>
                      {formatPrice(item.product.price)} × {item.quantity}
                    </ItemPrice>
                    <ItemTotal>
                      {formatPrice(item.product.price * item.quantity)}
                    </ItemTotal>
                  </ItemInfo>
                </CartItem>
              ))}
            </CartItems>

            <CartTotal>
              <span>Total:</span>
              <strong>{formatPrice(cartData?.totalAmount)}</strong>
            </CartTotal>
          </OrderSummary>

          <PaymentForm>
            <h2>Card Details</h2>
            <CardFormGroup>
              <label htmlFor="cardName">Name on Card</label>
              <input
                type="text"
                id="cardName"
                value={cardDetails.cardName}
                onChange={handleInputChange}
                placeholder="Enter name as on card"
              />
            </CardFormGroup>

            <CardFormGroup>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
              />
            </CardFormGroup>

            <CardFormRow>
              <CardFormGroup>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </CardFormGroup>

              <CardFormGroup>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                />
              </CardFormGroup>
            </CardFormRow>

            <ShippingDetails>
              <h3>Shipping To:</h3>
              <p>{shippingDetails.fullName}</p>
              <p>{shippingDetails.address}</p>
              <p>{shippingDetails.city}, {shippingDetails.pincode}</p>
              <p>Phone: {shippingDetails.contact}</p>
              <p>Email: {shippingDetails.email}</p>
            </ShippingDetails>

            <PayButton 
              onClick={handlePayNow}
              disabled={paymentMutation.isPending}
            >
              {paymentMutation.isPending ? "Processing..." : "Pay Now"}
            </PayButton>
          </PaymentForm>
        </PaymentGrid>
      </PaymentContainer>
    </PaymentWrapper>
  );
};

const PaymentWrapper = styled.div`
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 80px);
`;

const PaymentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  h1 {
    margin-bottom: 2rem;
    color: #2d3436;
  }
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: #2d3436;
    font-size: 18px;
  }
`;

const CartItems = styled.div`
  margin-bottom: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const CategoryTag = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const DetailTag = styled.span`
  background: #f5f5f5;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  color: #666;
`;

const ItemTotal = styled.div`
  margin-top: 4px;
  font-weight: 600;
  color: #333;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 2px solid #eee;
  margin-top: 15px;
  font-size: 16px;
`;

const PaymentForm = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 1.5rem;
    color: #2d3436;
    font-size: 18px;
  }
`;

const CardFormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 14px;
    color: #636e72;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #f57c00;
    }
  }
`;

const CardFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ShippingDetails = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  h3 {
    margin-bottom: 1rem;
    font-size: 16px;
    color: #2d3436;
  }

  p {
    margin: 0.5rem 0;
    font-size: 14px;
    color: #636e72;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f57c00;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #ef6c00;
  }
`;

export default Payment;