import React from "react";
import styled from "styled-components";
import logoImage from "../assets/logo.png"; // Corrected import path

const LogoWrapper = styled.h1`
  font-family: "Kumbh Sans", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: hsl(var(--black));
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem; // Adds spacing between the image and text
`;

const LogoImage = styled.img`
  height: 4rem; // Adjust the height as needed
  width: auto; // Maintains the aspect ratio
`;

const Logo = () => {
  return (
    <LogoWrapper>
      <LogoImage src={logoImage} alt="B-Mart Logo" />
      E-Mart
    </LogoWrapper>
  );
};

export default Logo;