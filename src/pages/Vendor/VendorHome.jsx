import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Logout from "../../components/Logout"; // Fixed import path
import background1 from "../../assets/e2.jpg";
import background2 from "../../assets/e3.jpg";
import background3 from "../../assets/e4.jpg";

const VendorHome = () => {
  const navigate = useNavigate();

  const goToVendorDashboard = () => {
    navigate("/vendor-dashboard");
  };

  return (
    <VendorHomeWrapper>
      <section className="hero">
        <h1>Welcome to Vendor Home</h1>
        <p>Manage your products and grow your business with us.</p>
        <div className="logout-container">
        </div>
      </section>
    </VendorHomeWrapper>
  );
};

const backgroundAnimation = keyframes`
  0% {
    background-image: url(${background1});
  }
  33% {
    background-image: url(${background2});
  }
  66% {
    background-image: url(${background3});
  }
  100% {
    background-image: url(${background1});
  }
`;

const VendorHomeWrapper = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background-image: url(${background1});
  background-size: cover;
  background-position: center;
  animation: ${backgroundAnimation} 15s infinite;

  .hero {
    text-align: center;
    margin-bottom: 4rem;
    padding-top: 19rem;

    h1 {
      font-size: 7rem;
      color: hsl(var(--white));
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    p {
      font-size: 1.4rem;
      color: hsl(var(--white));
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .logout-container {
      position: absolute;
      top: 2rem;
      right: 2rem;
      z-index: 10; // Ensure it's above other elements
    }
  }
`;

export default VendorHome;