import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import styled from "styled-components";
import collectionsBackground from "../assets/collections-background.jpg"; // Import the background image

const Collections = () => {
  const location = useLocation();

  // Check if the current route is the base "/collections" route
  const isBaseRoute = location.pathname === "/collections";

  return (
    <CollectionsWrapper>
      {/* Conditionally render the background image */}
      {isBaseRoute && (
        <BackgroundImage>
          <h1>Explore Our Collections</h1>
          <p>Discover the latest trends and styles.</p>
        </BackgroundImage>
      )}

      {/* Nested Routes */}
      <Outlet />
    </CollectionsWrapper>
  );
};

// Styled Components
const CollectionsWrapper = styled.div`
  padding: 0; /* Remove padding to ensure full width */
  width: 100%; /* Ensure the wrapper takes full width */
`;

const BackgroundImage = styled.div`
  background-image: url(${collectionsBackground});
  background-size: cover; /* Ensures the image covers the entire container */
  background-position: center; /* Centers the image */
  min-height: 400px; /* Adjust the height as needed */
  width: 100%; /* Ensures the image covers the full width */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: hsl(var(--white));
  text-align: center;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

export default Collections;