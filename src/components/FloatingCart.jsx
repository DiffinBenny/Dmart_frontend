import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartgetAPI, cartdeleteAPI } from "../services/cartServices";

const FloatingCart = ({ className }) => {
  const { state, removeFromCart } = useGlobalContext();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cartData, refetch: refetchCart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartgetAPI,
  });

  // Delete mutation
  const deleteItemMutation = useMutation({
    mutationFn: (productId) => cartdeleteAPI({ id: productId }),
    onSuccess: (data) => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries(['cart']);
      showNotificationMessage("Item removed from cart successfully", false);
      refetchCart(); // Explicitly refetch cart data
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
      showNotificationMessage(error.response?.data?.message || "Error removing item from cart", true);
    }
  });

  const handleDeleteItem = (productId) => {
    if (!productId) {
      showNotificationMessage("Invalid product ID", true);
      return;
    }
    
    try {
      deleteItemMutation.mutate(productId);
    } catch (error) {
      console.error("Error in handleDeleteItem:", error);
      showNotificationMessage("Failed to remove item from cart", true);
    }
  };

  const showNotificationMessage = (message, error = false) => {
    setNotificationMessage(message);
    setIsError(error);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  const formatPrice = (price) => {
    if (!price || isNaN(parseFloat(price))) return "Rs. 0.00";
    return `Rs. ${parseFloat(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      const price = parseFloat(item.productPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  return (
    <FloatingCartWrapper className={className}>
      <CartHeader>
        <h3>Cart ({cartData?.items?.length || 0})</h3>
      </CartHeader>

      <CartContent>
        {!cartData?.items || cartData.items.length === 0 ? (
          <EmptyCart>Your cart is empty</EmptyCart>
        ) : (
          <>
            {cartData.items.map((item) => (
              <CartItem key={item.product?._id}>
                <ItemImage>
                  <img 
                    src={item.product?.images?.[0]} 
                    alt={item.product?.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </ItemImage>
                <ItemInfo>
                  <ItemName>{item.product?.name}</ItemName>
                  <ItemDetails>
                    {item.product?.category && (
                      <CategoryTag>{item.product?.category}</CategoryTag>
                    )}
                    {item.product?.size && (
                      <DetailTag>Size: {item.product?.size}</DetailTag>
                    )}
                    {item.product?.color && (
                      <DetailTag>Color: {item.product?.color}</DetailTag>
                    )}
                  </ItemDetails>
                  <ItemPrice>
                    {formatPrice(item.product?.price)} × {item?.quantity}
                  </ItemPrice>
                  <ItemTotal>
                    {formatPrice(item.product?.price * item?.quantity)}
                  </ItemTotal>
                </ItemInfo>
                <DeleteButton 
                  onClick={() => handleDeleteItem(item.product?._id)}
                  disabled={deleteItemMutation.isPending}
                  aria-label="Remove item"
                >
                  ×
                </DeleteButton>
              </CartItem>
            ))}
            <CartTotal>
              <span>Total:</span>
              <strong>{formatPrice(cartData.totalAmount)}</strong>
            </CartTotal>
            <CheckoutButton to="/checkout">
              Proceed to Checkout
            </CheckoutButton>
          </>
        )}
      </CartContent>
      {showNotification && (
        <Notification $isError={isError}>
          {notificationMessage}
        </Notification>
      )}
    </FloatingCartWrapper>
  );
};

const FloatingCartWrapper = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 360px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  display: none;

  &.active {
    display: block;
  }
`;

const CartHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }
`;

const CartContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
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

const DeleteButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #ff5252;
  color: white;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #ff1744;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }
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

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 12px;
  background: #f57c00;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  margin-top: 15px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #ef6c00;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => props.$isError ? '#f44336' : '#4caf50'};
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1100;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default FloatingCart;