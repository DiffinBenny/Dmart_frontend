import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistviewAPI, wishlistdeleteAPI } from '../services/wishlistServices';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRemoving, setIsRemoving] = useState(false);

  // Fetch wishlist data
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistviewAPI,
    staleTime: 2 * 60 * 1000,
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: wishlistdeleteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setIsRemoving(false);
    },
    onError: (error) => {
      console.error("Error removing from wishlist:", error);
      setIsRemoving(false);
    }
  });

  const handleRemoveItem = (productId) => {
    setIsRemoving(true);
    removeFromWishlist.mutate(productId);
  };

  const handleViewProduct = (productId) => {
    navigate(`/collections/product/${productId}`);
  };

  if (isLoading) return <LoadingMessage>Loading your wishlist...</LoadingMessage>;
  if (isError) return <ErrorMessage>Error loading wishlist: {error.message}</ErrorMessage>;

  const wishlistItems = data?.wishlist || [];

  return (
    <WishlistContainer>
      <WishlistHeader>
        <FaHeart size={24} color="#ff6b6b" />
        <h1>My Wishlist</h1>
      </WishlistHeader>

      {wishlistItems.length === 0 ? (
        <EmptyWishlist>
          <p>Your wishlist is empty</p>
          <ShopButton onClick={() => navigate('/collections/collectionshome')}>
            Browse Collections
          </ShopButton>
        </EmptyWishlist>
      ) : (
        <>
          <ItemCount>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</ItemCount>
          <WishlistGrid>
            {wishlistItems.map((item) => (
              <WishlistCard key={item._id}>
                <ProductImage onClick={() => handleViewProduct(item._id)}>
                  <img src={item.images?.[0]} alt={item.name} />
                </ProductImage>
                <ProductInfo>
                  <ProductName onClick={() => handleViewProduct(item._id)}>
                    {item.name}
                  </ProductName>
                  <ProductCategory>{item.category} - {item.subCategory}</ProductCategory>
                  
                  <PriceContainer>
                    <CurrentPrice>Rs. {item.price?.toLocaleString()}</CurrentPrice>
                    {item.discount > 0 && (
                      <>
                        <DiscountLabel>{item.discount}% OFF</DiscountLabel>
                        <OriginalPrice>
                          Rs. {((item.price * 100) / (100 - item.discount)).toFixed(0)}
                        </OriginalPrice>
                      </>
                    )}
                  </PriceContainer>
                  
                  <ButtonGroup>
                    <ViewButton onClick={() => handleViewProduct(item._id)}>
                      <FaShoppingCart /> View Product
                    </ViewButton>
                    <RemoveButton 
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isRemoving}
                    >
                      <FaTrash /> Remove
                    </RemoveButton>
                  </ButtonGroup>
                </ProductInfo>
              </WishlistCard>
            ))}
          </WishlistGrid>
        </>
      )}
    </WishlistContainer>
  );
};

// Styled Components
const WishlistContainer = styled.div`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const WishlistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  
  h1 {
    font-size: 2.4rem;
    color: #333;
    margin: 0;
  }
`;

const ItemCount = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const EmptyWishlist = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  p {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 2rem;
  }
`;

const ShopButton = styled.button`
  background: linear-gradient(to right, #ff6b6b, #ff8e53);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(255, 107, 107, 0.25);
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WishlistCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const ProductImage = styled.div`
  flex: 0 0 40%;
  cursor: pointer;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 0.5rem;
  cursor: pointer;
  
  &:hover {
    color: #ff6b6b;
  }
`;

const ProductCategory = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1.5rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountLabel = styled.span`
  font-size: 0.9rem;
  background-color: #ffebee;
  color: #ff6b6b;
  padding: 0.2rem 0.8rem;
  border-radius: 50px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
  padding: 0.8rem 1rem;
  background: #4a69bd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover {
    background: #1e3799;
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
  padding: 0.8rem 1rem;
  background: ${props => props.disabled ? '#f5f5f5' : '#fff'};
  color: ${props => props.disabled ? '#aaa' : '#ff6b6b'};
  border: 1px solid ${props => props.disabled ? '#eee' : '#ff6b6b'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: #ffebee;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.3rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.3rem;
  color: #ff4444;
`;

export default Wishlist;