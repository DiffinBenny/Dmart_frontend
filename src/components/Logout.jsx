import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "../redux/userSlice";

const Logout = () => {
  const { logoutUser } = useGlobalContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutUser(); // Call the logout function from context
    sessionStorage.clear(); // Clear sessionStorage
    dispatch(logoutAction()); // Dispatch the logout action
    navigate("/login"); // Redirect to the login page
  };

  return (
    <LogoutWrapper>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </LogoutWrapper>
  );
};

const LogoutWrapper = styled.div`
  .logout-btn {
    background-color: hsl(var(--orange)); // Use your theme color
    color: hsl(var(--white)); // Use your theme color
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // Add a subtle shadow

    &:hover {
      background-color: hsl(var(--orange) / 0.9); // Slightly transparent on hover
    }

    &:active {
      transform: scale(0.98); // Add a slight press effect
    }
  }
`;

export default Logout;