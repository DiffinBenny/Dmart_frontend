import React from "react";
import styled from "styled-components";

const ProductCarousel = ({ products }) => {
  return (
    <CarouselWrapper>
      {products.map((product) => (
        <ProductCard key={product.id}>
          <ProductImage src={product.image} alt={product.name} />
          <ProductName>{product.name}</ProductName>
          <ProductDiscount>{product.discount}</ProductDiscount>
        </ProductCard>
      ))}
    </CarouselWrapper>
  );
};

// Styled Components
const CarouselWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: hsl(var(--orange));
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: hsl(var(--light-grayish-blue));
  }
`;

const ProductCard = styled.div`
  flex: 0 0 auto;
  width: 200px;
  text-align: center;
  background-color: hsl(var(--white));
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  color: hsl(var(--black));
  margin-bottom: 0.5rem;
`;

const ProductDiscount = styled.p`
  font-size: 1rem;
  color: hsl(var(--orange));
  font-weight: 700;
`;

export default ProductCarousel;