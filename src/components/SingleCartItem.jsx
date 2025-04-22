import React from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getProductByIdAPI } from "../services/productServices"
import { useGlobalContext } from "../context/context"
import { cartaddAPI } from "../services/cartServices"

const SingleCartItem = () => {
  const { productId } = useParams()
  const { addToCart } = useGlobalContext()

  // Fetch product details
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductByIdAPI(productId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const mutation = useMutation({
    mutationKey:['add-cart'],
    mutationFn:cartaddAPI
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading product</div>
  if (!product) return <div>Product not found</div>

  const handleAddToCart = () => {
    const cartItem = {
      id: product._id,
      quantity:product.quantity
    }
    mutation.mutate(cartItem)
    addToCart(cartItem)
  }

  return (
    <ProductDetailsWrapper>
      <ProductImages>
        {product.images?.map((image, index) => (
          <img key={index} src={image} alt={`${product.name} view ${index + 1}`} />
        ))}
      </ProductImages>

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
          {product.color && <Spec>Color: {product.color.join(', ')}</Spec>}
          {product.volume && <Spec>Volume: {product.volume}</Spec>}
          <Spec>Stock: {product.stock} units</Spec>
          <Spec>Minimum Order: {product.minQuantity} units</Spec>
        </SpecsSection>

        <AddToCartButton onClick={handleAddToCart}>
          Add to Cart
        </AddToCartButton>
      </ProductInfo>
    </ProductDetailsWrapper>
  )
}

const ProductDetailsWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

const ProductImages = styled.div`
  display: grid;
  gap: 1rem;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    object-fit: cover;
  }
`

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const VendorName = styled.p`
  font-size: 1rem;
  color: #ff6b6b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`

const ProductName = styled.h1`
  font-size: 2.5rem;
  color: #2d3436;
  margin: 0;
`

const CategoryTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #e9ecef;
  color: #495057;
  border-radius: 2rem;
  font-size: 0.9rem;
`

const Description = styled.p`
  font-size: 1.1rem;
  color: #636e72;
  line-height: 1.6;
`

const PriceSection = styled.div`
  margin: 1rem 0;
`

const CurrentPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3436;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const DiscountBadge = styled.span`
  font-size: 1rem;
  background: #ffebee;
  color: #ff4444;
  padding: 0.4rem 1rem;
  border-radius: 1rem;
`

const OriginalPrice = styled.div`
  font-size: 1.2rem;
  color: #b2bec3;
  text-decoration: line-through;
  margin-top: 0.5rem;
`

const SpecsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 1rem 0;
`

const Spec = styled.p`
  font-size: 1rem;
  color: #636e72;
`

const AddToCartButton = styled.button`
  padding: 1rem 2rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`

export default SingleCartItem
