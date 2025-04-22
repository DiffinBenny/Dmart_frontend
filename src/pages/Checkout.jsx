import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartgetAPI } from '../services/cartServices';
import { orderaddAPI } from '../services/orderServices';

const Checkout = () => {
  const { state } = useGlobalContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    city: '',
    pincode: '',
    paymentType: 'card'
  });
  const [errors, setErrors] = useState({});
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);

  // Fetch cart data
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartgetAPI,
    enabled: !directCheckoutItem, // Disable cart query if directCheckoutItem exists
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['add-order'],
    mutationFn: orderaddAPI,
  });

  useEffect(() => {
    // Retrieve direct checkout item from localStorage
    const storedCheckoutItem = localStorage.getItem('directCheckout');
    if (storedCheckoutItem) {
      try {
        setDirectCheckoutItem(JSON.parse(storedCheckoutItem));
      } catch (error) {
        console.error("Error parsing directCheckout from localStorage:", error);
        localStorage.removeItem('directCheckout'); // Remove invalid data
        setDirectCheckoutItem(null); // Reset to null
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!contactRegex.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN code is required';
    } else if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value, name } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value,
      ...(name === 'paymentType' ? { paymentType: value } : {}) // Update paymentType if radio button changes
    }));

    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(parseFloat(price))) return "Rs. 0.00";
    return `Rs. ${parseFloat(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  const queryClient=useQueryClient()
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // Log current state for debugging
    console.log("directCheckoutItem:", directCheckoutItem);
    console.log("cartData:", cartData);

    // Prepare order data
    let orderData;
    if (directCheckoutItem && directCheckoutItem.items) {
      orderData = {
        ...formData,
        items: directCheckoutItem.items,
        totalAmount: directCheckoutItem.totalAmount
      };
    } else if (cartData && cartData.items) {
      orderData = {
        ...formData,
        items: cartData.items,
        totalAmount: cartData.totalAmount
      };
    } else {
      alert('Your cart is empty. Please add items to place an order.');
      return;
    }

    console.log("Final Order Data:", orderData);

    try {
      const order = await mutateAsync(orderData);
      const orderId = order.order;
      console.log('order', orderId);
      
      // Clear direct checkout data after successful order
      if (directCheckoutItem) {
        localStorage.removeItem('directCheckout');
      }

      if (formData.paymentType === 'card' && orderId) {
        navigate(`/payment/${orderId}`);
      } else {
        alert('Order placed successfully! Your order will be delivered in 7 days.');
        navigate('/collections/collectionshome');
      }
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    }
  };

  const cartItems = directCheckoutItem ? directCheckoutItem.items : cartData?.items;
  const totalAmount = directCheckoutItem ? directCheckoutItem.totalAmount : cartData?.totalAmount;

  return (
    <CheckoutWrapper>
      <CheckoutContainer>
        <h1>Checkout</h1>
        
        <CheckoutGrid>
          <OrderSummary>
            <h2>Order Summary</h2>
            <CartItems>
              {cartItems?.map((item) => (
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
              <strong>{formatPrice(totalAmount)}</strong>
            </CartTotal>
          </OrderSummary>

          <CheckoutForm>
            <h2>Shipping Information</h2>
            <FormGrid>
              <FormGroup>
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <label htmlFor="contact">Contact Number *</label>
                <input 
                  type="tel" 
                  id="contact" 
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter your 10-digit contact number"
                  maxLength="10"
                  required
                />
                {errors.contact && <ErrorText>{errors.contact}</ErrorText>}
              </FormGroup>
              <FormGroup fullWidth>
                <label htmlFor="address">Address *</label>
                <textarea 
                  id="address" 
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address" 
                  rows="3"
                  required
                ></textarea>
                {errors.address && <ErrorText>{errors.address}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <label htmlFor="city">City *</label>
                <input 
                  type="text" 
                  id="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city" 
                  required
                />
                {errors.city && <ErrorText>{errors.city}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <label htmlFor="pincode">PIN Code *</label>
                <input 
                  type="text" 
                  id="pincode" 
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit PIN code"
                  maxLength="6"
                  required
                />
                {errors.pincode && <ErrorText>{errors.pincode}</ErrorText>}
              </FormGroup>
            </FormGrid>

            <PaymentSection>
              <h2>Payment Method</h2>
              <PaymentOptions>
                <PaymentOption>
                  <input
                    type="radio"
                    id="cod"
                    name="paymentType"
                    value="cod"
                    checked={formData.paymentType === 'cod'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </PaymentOption>
                <PaymentOption>
                  <input
                    type="radio"
                    id="card"
                    name="paymentType"
                    value="card"
                    checked={formData.paymentType === 'card'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="card">Card Payment</label>
                </PaymentOption>
              </PaymentOptions>
            </PaymentSection>

            <PlaceOrderButton onClick={handlePlaceOrder}>
              Place Order
            </PlaceOrderButton>
          </CheckoutForm>
        </CheckoutGrid>
      </CheckoutContainer>
    </CheckoutWrapper>
  );
};

const CheckoutWrapper = styled.div`
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 80px);
`;

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  h1 {
    margin-bottom: 2rem;
    color: #2d3436;
  }
`;

const CheckoutGrid = styled.div`
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
  position: relative;

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
  padding-right: 30px;
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
  font-weight: 600;
`;

const CheckoutForm = styled.div`
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #636e72;
    font-size: 14px;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${props => props.error ? '#ff6b6b' : '#dee2e6'};
    border-radius: 4px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #f57c00;
    }
  }

  textarea {
    resize: vertical;
  }
`;

const ErrorText = styled.span`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const PaymentSection = styled.div`
  margin-top: 2rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="radio"] {
    accent-color: #f57c00;
  }

  label {
    color: #636e72;
    font-size: 14px;
  }
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  margin-top: 2rem;
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

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

export default Checkout;