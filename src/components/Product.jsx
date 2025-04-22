import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductByIdAPI } from "../services/productServices";
import { useGlobalContext } from "../context/context";
import { cartaddAPI } from "../services/cartServices";
import { reviewgetAPI } from "../services/reviewServices";

const Product = () => {
  const { productId } = useParams();
  const { addToCart } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Fetch product data
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductByIdAPI(productId),
    // staleTime: 5 * 60 * 1000 // 5 minutes
  });
 console.log(product);
 
  const { data: review } = useQuery({
    queryKey: ['review', productId],
    queryFn: () => reviewgetAPI(productId)
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['add-cart'],
    mutationFn: cartaddAPI
  });

  const showAlert = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 3000);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      showAlert("Quantity cannot be less than 1");
      return;
    }
    if (newQuantity > product.stock) {
      showAlert(`Only ${product.stock} items available in stock`);
      return;
    }
    setQuantity(newQuantity);
  };
const queryClient=useQueryClient()
  const handleAddToCart = async() => {
    if (quantity > product.stock) {
      showAlert(`Only ${product.stock} items available in stock`);
      return;
    }

    if (quantity < product.minQuantity) {
      showAlert(`Minimum order quantity is ${product.minQuantity}`);
      return;
    }

    const cartItem = {
      productId: product._id,
      productName: product.name,
      productPrice: product.price,
      isOnSale: product.discount > 0,
      salePercent: (100 - product.discount) / 100,
      amount: quantity,
      images: product.images?.map(url => ({ url, alt: product.name })) || []
    };
    addToCart(cartItem);
     await mutateAsync(
      { id: product._id, quantity: quantity },
      {
        onSuccess: () => {
          // Invalidate and refetch any queries that might be affected
          queryClient.invalidateQueries('cart'); // Adjust query key as needed
        }
      }
    );
    showAlert("Item added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (quantity > product.stock) {
      showAlert(`Only ${product.stock} items available in stock`);
      return;
    }

    if (quantity < product.minQuantity) {
      showAlert(`Minimum order quantity is ${product.minQuantity}`);
      return;
    }

    // Create a direct checkout item
    const checkoutItem = {
      items: [{
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          images: product.images,
          size: product.size,
        },
        quantity: quantity
      }],
      totalAmount: product.price * quantity
    };

    // Store the checkout item in localStorage
    localStorage.setItem('directCheckout', JSON.stringify(checkoutItem));
    
    // Navigate to checkout
    navigate('/checkout');
  };

  if (isLoading) return <LoadingWrapper>Loading...</LoadingWrapper>;
  if (isError) return <ErrorWrapper>Error loading product</ErrorWrapper>;
  if (!product) return <ErrorWrapper>Product not found</ErrorWrapper>;

  return (
    <ProductWrapper>
      {showNotification && (
        <Notification>
          {notificationMessage}
        </Notification>
      )}

      <ImageSection>
        <MainImage>
          <img 
            src={product.images?.[selectedImage]} 
            alt={product.name} 
          />
        </MainImage>
        <ThumbnailGrid>
          {product.images?.map((image, index) => (
            <Thumbnail 
              key={index}
              isSelected={selectedImage === index}
              onClick={() => setSelectedImage(index)}
            >
              <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
            </Thumbnail>
          ))}
        </ThumbnailGrid>
      </ImageSection>

      <ProductInfo>
        <VendorName>{product.vendor?.name || 'Unknown Vendor'}</VendorName>
        <ProductName>{product.name}</ProductName>
        <CategoryTag>{product.category} - {product.subCategory}</CategoryTag>
        
        <Description>{product.description}</Description>

        <PriceSection>
          <CurrentPrice>
            Rs. {product.price?.toLocaleString()}
            {product.discount > 0 && (
              <DiscountBadge>{product.discount}% OFF</DiscountBadge>
            )}
          </CurrentPrice>
          {product.discount > 0 && (
            <OriginalPrice>
              Rs. {(product.price * (100 / (100 - product.discount))).toLocaleString()}
            </OriginalPrice>
          )}
        </PriceSection>

        <SpecsSection>
          {product.size && <Spec>Size: {product.size.join(', ')}</Spec>}
          {product.volume && <Spec>Volume: {product.volume}</Spec>}
          <Spec>Stock: {product.stock} units</Spec>
          <Spec>Minimum Order: {product.minQuantity} units</Spec>
        </SpecsSection>

        <QuantityControls>
          <QuantityButton 
            onClick={() => handleQuantityChange(quantity - 1)} 
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </QuantityButton>
          <QuantityDisplay>{quantity}</QuantityDisplay>
          <QuantityButton 
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            +
          </QuantityButton>
        </QuantityControls>

        <ButtonGroup>
          <AddToCartButton 
            onClick={handleAddToCart} 
            disabled={quantity > product.stock || quantity < product.minQuantity}
          >
            {quantity > product.stock ? 
              'Out of Stock' : 
              quantity < product.minQuantity ? 
                `Minimum ${product.minQuantity}` : 
                'Add to Cart'}
          </AddToCartButton>
          <BuyNowButton 
            onClick={handleBuyNow}
            disabled={quantity > product.stock || quantity < product.minQuantity}
            to="/checkout"
          >
            Buy Now
          </BuyNowButton>
        </ButtonGroup>
      </ProductInfo>

      <ReviewsSection>
        <h3>Customer Reviews</h3>
        {review?.length > 0 ? (
          review.map((item, index) => (
            <ReviewItem key={index}>
              <ReviewRating>Rating: {item.rating} / 5</ReviewRating>
              <ReviewComment>{item.comment || "No review provided"}</ReviewComment>
              <ReviewUser>Reviewed by: {item.user?.username || 'Anonymous'}</ReviewUser>
            </ReviewItem>
          ))
        ) : (
          <NoReviews>No reviews available yet.</NoReviews>
        )}
      </ReviewsSection>
    </ProductWrapper>
  );
};

// Styled Components
const ProductWrapper = styled.article`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => props.error ? '#ff4444' : '#4CAF50'};
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

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

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #636e72;
`;

const ErrorWrapper = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #ff6b6b;
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const MainImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 1rem;
  overflow: hidden;
  background: #f8f9fa;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 1rem;
`;

const Thumbnail = styled.div`
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? '#ff6b6b' : 'transparent'};
  transition: all 0.3s ease;
  background: #f8f9fa;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const VendorName = styled.p`
  font-size: 1rem;
  color: #ff6b6b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #e9ecef;
  color: #495057;
  border-radius: 2rem;
  font-size: 0.9rem;
  margin-right: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #636e72;
  line-height: 1.6;
  margin: 0.5rem 0;
`;

const PriceSection = styled.div`
  margin: 1rem 0;
`;

const CurrentPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3436;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DiscountBadge = styled.span`
  font-size: 1rem;
  background: #ffebee;
  color: #ff4444;
  padding: 0.4rem 1rem;
  border-radius: 1rem;
`;

const OriginalPrice = styled.div`
  font-size: 1.2rem;
  color: #b2bec3;
  text-decoration: line-through;
  margin-top: 0.5rem;
`;

const SpecsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
`;

const Spec = styled.p`
  font-size: 1rem;
  color: #636e72;
  margin: 0;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const QuantityButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d4d5d9;
  background: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  width: 4rem;
  height: 2.5rem;
  border: 1px solid #d4d5d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.disabled ? '#f5f5f5' : '#ff6b6b'};
  color: ${props => props.disabled ? '#999' : 'white'};
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  }
`;

const BuyNowButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.disabled ? '#f5f5f5' : '#4CAF50'};
  color: ${props => props.disabled ? '#999' : 'white'};
  border: none;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #3e8e41;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  }
`;

const ReviewsSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;

  h3 {
    font-size: 1.5rem;
    color: #2d3436;
    margin-bottom: 1.5rem;
  }
`;

const ReviewItem = styled.div`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  div {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2d3436;

  &::before {
    content: '★';
    color: #ffc107;
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const ReviewComment = styled.div`
  font-size: 1rem;
  color: #495057;
  padding: 0.5rem 0;
`;

const ReviewUser = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
`;

const NoReviews = styled.p`
  color: #636e72;
  font-style: italic;
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
`;

export default Product;