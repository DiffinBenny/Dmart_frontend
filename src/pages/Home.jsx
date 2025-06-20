import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Import background images
import background1 from "../assets/background1.jpg";
import background2 from "../assets/background2.jpg";
import background3 from "../assets/background3.jpg";

const Home = () => {
  const navigate = useNavigate();

  const goToAboutPage = () => {
    navigate("/about");
  };

  return (
    <HomeWrapper>
      <section className="hero">
        <h1>Welcome to D-Mart</h1>
        <p>Explore our latest products and collections.</p>
        <button onClick={goToAboutPage} className="about-button">
          Learn More About Us
        </button>
      </section>

      
    </HomeWrapper>
  );
};

// Keyframes for background animation
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

const HomeWrapper = styled.div`
  padding: 2rem;
  min-height: 100vh;
  width:100%;
  background-image: url(${background1});
  background-size: cover;
  background-position: center;
  animation: ${backgroundAnimation} 15s infinite; // Apply the animation

  .hero {
    text-align: center;
    margin-bottom: 4rem;
    padding-top: 19rem; // Add padding to center the hero section

    h1 {
      font-size: 7rem;
      color: hsl(var(--white));
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // Add text shadow for better visibility
    }

    p {
      font-size: 1.75rem;
      color: hsl(var(--white));
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // Add text shadow for better visibility
    }

    .about-button {
      padding: 0.75rem 1.5rem;
      background-color: hsl(var(--orange));
      color: hsl(var(--white));
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;

export default Home;