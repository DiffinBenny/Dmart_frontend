import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaUser, FaComments, FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaSearch } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productviewallAPI, productviewAPI } from "../services/productServices";
import { wishlistviewAPI, wishlistsaveAPI, wishlistdeleteAPI } from "../services/wishlistServices";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const Beauty = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showVendorDetails, setShowVendorDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const userId = useSelector((state) => state.user.id);

  // Fetch products using React Query
  const { 
    data: beautyItems = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['beautyProducts'],
    queryFn: productviewallAPI,
    staleTime: 5 * 60 * 1000,
    retry: false,
    onError: (error) => {
      if (error.message.includes("Please log in")) {
        navigate('/login');
      }
    }
  });

  // Fetch wishlist
  const {
    data: wishlistData,
    isLoading: isLoadingWishlist,
    isError: isErrorWishlist,
    error: wishlistError
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistviewAPI,
    staleTime: 2 * 60 * 1000,
    retry: false,
    onError: (error) => {
      console.error("Wishlist fetch error:", error);
    }
  });

  // Update wishlist state when data is fetched
  useEffect(() => {
    if (wishlistData?.wishlist) {
      const productIds = wishlistData.wishlist.map(item => item._id);
      setWishlist(productIds);
    }
  }, [wishlistData]);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = searchQuery.trim().toLowerCase();
    
    const beautyOnly = beautyItems.filter(item =>
      item.category?.toLowerCase() === "beauty"
    );
  
    if (!searchTerm) {
      // Reset to selected category filter
      const filtered = selectedCategory === "All"
        ? beautyOnly
        : beautyOnly.filter(item => item.subCategory === selectedCategory);
      setFilteredItems(filtered);
      return;
    }
  
    const searchedItems = beautyOnly.filter(item =>
      item.name.toLowerCase().includes(searchTerm)
    );
  
    // Apply category filtering to search results
    const finalFiltered = selectedCategory === "All"
      ? searchedItems
      : searchedItems.filter(item => item.subCategory === selectedCategory);
  
    setFilteredItems(finalFiltered);
  };

  // Filter products whenever category changes, search query changes, or new data arrives
  useEffect(() => {
    if (beautyItems.length > 0) {
      const beautyOnly = beautyItems.filter(item => 
        item.category?.toLowerCase() === "beauty"
      );

      let filtered = beautyOnly;
      
      // Apply search filter if search query exists
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchTerm)
  )}
      
      // Apply category filter
      if (selectedCategory !== "All") {
        filtered = filtered.filter(item => 
          item.subCategory === selectedCategory
        );
      }
      
      setFilteredItems(filtered);
    }
  }, [selectedCategory, beautyItems, searchQuery]);

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: wishlistsaveAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error) => {
      console.error("Error adding to wishlist:", error);
    }
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: wishlistdeleteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error) => {
      console.error("Error removing from wishlist:", error);
    }
  });

  const handleVendorDetails = (vendor, e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowVendorDetails(vendor);
  };

  const handleCloseVendorDetails = () => {
    setShowVendorDetails(null);
  };

  const handleChatClick = (vendorId, e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/chat/${vendorId}/${userId}`);
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (wishlist.includes(productId)) {
      // Remove from wishlist
      removeFromWishlistMutation.mutate(productId);
      // Optimistic update
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      // Add to wishlist
      addToWishlistMutation.mutate(productId);
      // Optimistic update
      setWishlist(prev => [...prev, productId]);
    }
  };

  if (isLoading) return <LoadingWrapper>Loading beauty products...</LoadingWrapper>;
  if (isError) return <ErrorWrapper>Error: {error.message}</ErrorWrapper>;

  return (
    <BeautyWrapper>
      <PageHeader>
        <h1>Beauty Collection</h1>
        <Subtitle>Discover our curated collection of beauty products</Subtitle>
      </PageHeader>

      <SearchAndFilterContainer>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Search beauty products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            <FaSearch />
          </SearchButton>
        </SearchForm>

        <CategoryNav>
          {["All", "Moisturizer", "Serum", "Sunscreen", "Others"].map(category => (
            <CategoryButton 
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryNav>
      </SearchAndFilterContainer>

      {filteredItems.length === 0 ? (
        <NoProductsMessage>
          {searchQuery.trim() 
            ? `No beauty products found matching "${searchQuery}" in ${selectedCategory} category`
            : `No beauty products found in ${selectedCategory} category`}
        </NoProductsMessage>
      ) : (
        <ProductGrid>
          {filteredItems.map((item) => (
            <ProductCard key={item._id} to={`/collections/product/${item._id}`}>
              <ProductImageContainer>
                <img src={item.images[0]} alt={item.name} />
                <WishlistButton 
                  active={wishlist.includes(item._id)}
                  onClick={(e) => toggleWishlist(item._id, e)}
                  disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                >
                  <FaHeart />
                </WishlistButton>
              </ProductImageContainer>
              
              <ProductInfo>
                <h3>{item.name}</h3>
                <CategoryTag>{item.subCategory}</CategoryTag>
                
                <PriceInfo>
                  <CurrentPrice>Rs. {item.price?.toLocaleString()}</CurrentPrice>
                  {item.discount > 0 && (
                    <DiscountBadge>{item.discount}% OFF</DiscountBadge>
                  )}
                </PriceInfo>
                
                <VendorActions>
                  <VendorButton onClick={(e) => handleVendorDetails(item.vendor, e)}>
                    <FaUser /> Vendor
                  </VendorButton>
                  <ChatButton onClick={(e) => handleChatClick(item.vendor.user, e)}>
                    <FaComments /> Chat
                  </ChatButton>
                </VendorActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}

      {showVendorDetails && (
        <VendorModal onClick={handleCloseVendorDetails}>
          <VendorModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseVendorDetails}>×</CloseButton>
            <ModalHeader>
              <FaStore /> Vendor Details
            </ModalHeader>
            <VendorInfo>
              <p><FaUser /> <strong>Name:</strong> {showVendorDetails.name}</p>
              <p><FaEnvelope /> <strong>Email:</strong> {showVendorDetails.email}</p>
              <p><FaPhone /> <strong>Phone:</strong> {showVendorDetails.phone || 'Not provided'}</p>
              <p><FaMapMarkerAlt /> <strong>Address:</strong> {showVendorDetails.address || 'Not provided'}</p>
              <p><FaStar /> <strong>Rating:</strong> {showVendorDetails.rating || 'Not rated yet'}</p>
            </VendorInfo>
          </VendorModalContent>
        </VendorModal>
      )}
    </BeautyWrapper>
  );
};

// Styled Components (updated with search functionality)
const BeautyWrapper = styled.div`
  padding: 3rem 2rem;
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  
  h1 {
    font-size: 3rem;
    color: #2d3436;
    margin-bottom: 1rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(to right, #ff6b6b, #ff8e53);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #636e72;
  margin: 0;
  font-weight: 400;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SearchAndFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  padding-right: 3.5rem;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #636e72;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ff6b6b;
  }
`;

const CategoryNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button`
  padding: 0.8rem 2rem;
  border: 2px solid #ff6b6b;
  border-radius: 50px;
  background: ${({ active }) => active ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)' : 'white'};
  color: ${({ active }) => active ? 'white' : '#ff6b6b'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 100px;
  text-align: center;
  box-shadow: ${({ active }) => active ? '0 4px 15px rgba(255, 107, 107, 0.3)' : 'none'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.8rem;
  color: #2d3436;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  &:after {
    content: "";
    width: 50px;
    height: 50px;
    border: 5px solid #ff6b6b;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-top: 2rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorWrapper = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.8rem;
  color: #ff4444;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  &:before {
    content: "⚠️";
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const NoProductsMessage = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: #666;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  &:before {
    content: "😕";
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  padding: 1.5rem;
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.12);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 1.8rem;
`;

const CategoryTag = styled.span`
  display: inline-block;
  font-size: 0.9rem;
  color: #636e72;
  margin-bottom: 1rem;
  padding: 0.4rem 1rem;
  background: #f1f3f5;
  border-radius: 50px;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.5rem 0;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3436;
`;

const DiscountBadge = styled.span`
  font-size: 0.9rem;
  color: #ff6b6b;
  background: #ffebee;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-weight: 700;
`;

const VendorActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f3f5;
`;

const VendorButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  }
`;

const ChatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  flex: 1;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    background: linear-gradient(135deg, #ff5252 0%, #ff7e47 100%);
  }
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.95);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  z-index: 10;
  color: ${({ active }) => active ? '#ff4444' : '#aaa'};
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover {
    color: #ff4444;
    transform: ${props => props.disabled ? 'none' : 'scale(1.15)'};
  }

  svg {
    font-size: 1.4rem;
  }
`;

const VendorModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const VendorModalContent = styled.div`
  background-color: white;
  padding: 3rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModalHeader = styled.h3`
  font-size: 1.8rem;
  color: #2d3436;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  svg {
    color: #ff6b6b;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f8f9fa;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  color: #666;
  
  &:hover {
    background: #ff6b6b;
    color: white;
    transform: rotate(90deg);
  }
`;

const VendorInfo = styled.div`
  margin-top: 1rem;
  
  p {
    margin-bottom: 1.2rem;
    line-height: 1.6;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid #f1f3f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    strong {
      color: #2d3436;
      min-width: 100px;
      display: inline-block;
      font-weight: 600;
    }
    
    svg {
      color: #ff6b6b;
      font-size: 1.2rem;
      min-width: 20px;
    }
  }
`;

export default Beauty;