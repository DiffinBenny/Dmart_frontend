import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import AddProduct from "./AddProduct";
import { productviewAPI, productdeleteAPI, producteditAPI } from "../../services/productServices";
import { reviewgetAPI } from "../../services/reviewServices";

const EditProduct = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productviewAPI,
  });

  // Fetch reviews for the selected product
  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: reviewsError,
  } = useQuery({
    queryKey: ["reviews", selectedProduct?._id],
    queryFn: () => reviewgetAPI(selectedProduct?._id),
    enabled: !!selectedProduct?._id && showReviews, // Only fetch when there's a selected product and reviews are shown
  });

  const deleteProductMutation = useMutation({
    mutationFn: productdeleteAPI,
    onSuccess: () => {
      setSuccessMessage("Product deleted successfully!");
      queryClient.invalidateQueries(["products"]);
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Error deleting product");
      setTimeout(() => setError(null), 3000);
    },
  });

  const editProductMutation = useMutation({
    mutationFn: producteditAPI,
    onSuccess: () => {
      setSuccessMessage("Product updated successfully!");
      queryClient.invalidateQueries(["products"]);
      setShowEditForm(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Error updating product");
      setTimeout(() => setError(null), 3000);
    },
  });

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const id = productId;
        await deleteProductMutation.mutateAsync(id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleViewMore = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
    setShowEditForm(false);
    setShowReviews(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditForm(true);
    setShowDetails(false);
    setShowReviews(false);
  };

  const handleReview = (product) => {
    setSelectedProduct(product);
    setShowReviews(true);
    setShowDetails(false);
    setShowEditForm(false);
  };

  if (isLoading) return <LoadingMessage>Loading products...</LoadingMessage>;
  if (isError) return <ErrorMessage>Error: {fetchError.message}</ErrorMessage>;

  return (
    <EditProductContainer>
      {showEditForm ? (
        <div>
          <BackButton onClick={() => setShowEditForm(false)}>← Back to Products</BackButton>
          <AddProduct initialData={selectedProduct} />
        </div>
      ) : (
        <>
          {/* Notification Messages */}
          {error && <ErrorNotification>{error}</ErrorNotification>}
          {successMessage && <SuccessNotification>{successMessage}</SuccessNotification>}

          <ProductGrid>
            {products?.map((product) => (
              <ProductCard key={product._id}>
                {product.images && product.images[0] && product.images[0] !== "0" ? (
                  <ProductImage src={product.images[0]} alt={product.name} />
                ) : (
                  <PlaceholderImage>No Image</PlaceholderImage>
                )}
                <ProductName>{product.name}</ProductName>
                <ProductPrice>${product.price}</ProductPrice>
                <ButtonGroup>
                  <Button onClick={() => handleViewMore(product)}>View More</Button>
                  <Button onClick={() => handleEdit(product)}>Edit</Button>
                  <Button onClick={() => handleReview(product)}>Review</Button>
                  <DeleteButton onClick={() => handleDelete(product._id)}>Delete</DeleteButton>
                </ButtonGroup>
              </ProductCard>
            ))}
          </ProductGrid>

          {showDetails && selectedProduct && (
            <ProductDetails>
              {selectedProduct.images && selectedProduct.images[0] && selectedProduct.images[0] !== "0" ? (
                <ProductImage 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name} 
                  style={{ width: "200px", height: "auto" }}
                />
              ) : (
                <PlaceholderImage>No Image Available</PlaceholderImage>
              )}
              <h2>{selectedProduct.name}</h2>
              <p>Category: {selectedProduct.category}</p>
              <p>Description: {selectedProduct.description}</p>
              <p>Price: ${selectedProduct.price}</p>
              <p>Discount: {selectedProduct.discount}%</p>
              <Button onClick={() => setShowDetails(false)}>Close</Button>
            </ProductDetails>
          )}

          {showReviews && selectedProduct && (
            <ReviewContainer>
              <h2>Reviews for {selectedProduct.name}</h2>
              {isLoadingReviews ? (
                <p>Loading reviews...</p>
              ) : isErrorReviews ? (
                <p>Error loading reviews: {reviewsError.message}</p>
              ) : reviews?.length > 0 ? (
                reviews.map((review) => (
                  <Review key={review._id}>
                    <p>
                      <strong>{review.user?.username || 'Anonymous'}</strong> - {review.comment} (Rating:{" "}
                      {review.rating}/5)
                    </p>
                  </Review>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
              <Button onClick={() => setShowReviews(false)}>Close</Button>
            </ReviewContainer>
          )}
        </>
      )}
    </EditProductContainer>
  );
};

// ... (styled components remain the same)

const PlaceholderImage = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 8px;
`;

const EditProductContainer = styled.div`
  padding: 2rem;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.div`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#007bff" : "#f8f9fa")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#0056b3" : "#e9ecef")};
    transform: translateY(-2px);
  }
`;

const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled.div`
  width: 250px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  text-align: center;
  background-color: white;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductName = styled.h3`
  font-size: 1.75rem;
  margin: 1rem 0;
`;

const ProductPrice = styled.p`
  font-size: 1.5rem;
  color: #007bff;
  margin: 1rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.secondary ? "#6c757d" : "#007bff")};
  color: #fff;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.secondary ? "#5a6268" : "#0056b3")};
    transform: translateY(-2px);
  }
`;

const ProductDetails = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: white;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EditFormContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: white;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ReviewContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: white;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Review = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #333;
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: red;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 4px;
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

const SuccessNotification = styled(Notification)`
  background-color: #28a745;
  color: white;
`;

const ErrorNotification = styled(Notification)`
  background-color: #dc3545;
  color: white;
`;

const BackButton = styled.button`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default EditProduct;