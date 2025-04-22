import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../icons";
import { removeToken } from "../utils/storageHandler";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <NavigatorWrapper>
      <nav>
        <div className="nav-left">
          <Link to="/admin" className="logo">
            <Logo />
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/admin/view-vendor">View Vendor</Link>
            </li>
            <li>
              <Link to="/admin/view-user">View User</Link>
            </li>
            <li>
              <Link to="/admin/order">Order</Link>
            </li>
            <li>
              <Link to="/admin/complaint">Complaint</Link>
            </li>
            <li>
              <Link to="/admin/adminchat">Chat</Link>
            </li>
            <li>
              <Link to="/admin/report">Report</Link>
            </li>
          </ul>
        </div>

        <div className="nav-right">
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </div>
      </nav>
    </NavigatorWrapper>
  );
};

// Existing styled components...

const LogoutButton = styled.button`
  padding: 0.8rem 1.6rem;
  background-color: hsl(var(--orange));
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);

  &:hover {
    transform: translateY(-2px);
    background-color: hsl(var(--orange-hover));
    box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;