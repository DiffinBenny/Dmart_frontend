import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Logo, Cart } from "../icons/index";
import { avatar } from "../assets/imagedata";
import FloatingCart from "./FloatingCart";
import { useGlobalContext } from "../context/context";
import { removeToken } from "../utils/storageHandler";
import { useQuery } from "@tanstack/react-query";
import { viewAPI } from "../services/userServices";

// Define SearchForm before it's used in other styled components
const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
  max-width: 400px;

  input {
    flex: 1;
    padding: 0.8rem 1.2rem;
    border: 1px solid hsl(var(--divider));
    border-radius: 2.5rem;
    font-size: 1.4rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: hsl(var(--orange));
      box-shadow: 0 0 0 2px hsla(var(--orange), 0.1);
    }
  }

  button {
    padding: 0.8rem 1.6rem;
    background-color: hsl(var(--orange));
    color: hsl(var(--white));
    border: none;
    border-radius: 2.5rem;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: hsl(var(--orange-hover));
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media only screen and (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 1rem;
    background-color: hsl(var(--white));
    border-top: 1px solid hsl(var(--divider));
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: none;
  }
`;

const CollectionsNavbar = () => {
  const { showCart, hideCart, state } = useGlobalContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profileData } = useQuery({
    queryKey: ['viewAPI'],
    queryFn: viewAPI,
    retry: 1
  });

  const handleUserLogoClick = () => {
    navigate("/profile");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <CollectionsNavbarWrapper>
      <nav>
        <div className="nav-left">
          <div className="logo">
            <Logo />
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/collections/collectionshome">Home</Link>
            </li>
            <li>
              <Link to="/collections/fashion">Fashion</Link>
            </li>
            <li>
              <Link to="/collections/accessories">Accessories</Link>
            </li>
            <li>
              <Link to="/collections/beauty">Beauty</Link>
            </li>
            <li>
              <Link to="/collections/order">Order</Link>
            </li>
            <li>
              <Link to="/collections/wishlist">Wishlist</Link>
            </li>
          </ul>
        </div>
        
       

        <div className="nav-right">
          <button
            onClick={() => (state.showingCart ? hideCart() : showCart())}
            className="cart-btn"
          >
            <Cart />
            {state.totalCartSize > 0 && <span>{state.totalCartSize}</span>}
          </button>
          <button className="avatar-btn" onClick={handleUserLogoClick}>
            <img src={profileData?.user?.profilePic || avatar} alt="avatar" />
          </button>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
          <FloatingCart className={`${state.showingCart ? "active" : ""}`} />
        </div>
      </nav>
    </CollectionsNavbarWrapper>
  );
};

const CollectionsNavbarWrapper = styled.header`
  position: relative;
  padding: 2.4rem;
  border-bottom: 1px solid hsl(var(--divider));
  background-color: hsl(var(--white));

  img,
  svg {
    display: block;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    gap: 2rem;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 3rem;

    .logo {
      margin-right: 2rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        a {
          text-decoration: none;
          font-size: 1.4rem;
          text-transform: capitalize;
          color: hsl(var(--dark-grayish-blue));
          transition: color 0.3s ease;

          &:hover {
            color: hsl(var(--orange));
          }
        }
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 2rem;

    .cart-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;

      svg,
      path {
        fill: hsl(var(--black));
      }

      span {
        user-select: none;
        position: absolute;
        top: -0.8rem;
        right: -0.8rem;
        background-color: hsl(var(--orange));
        font-weight: 700;
        color: hsl(var(--white));
        border-radius: 50%;
        padding: 0.2rem 0.6rem;
        font-size: 1rem;
      }
    }

    .avatar-btn {
      height: 3.5rem;
      width: 3.5rem;
      border-radius: 50%;
      border: 2px solid transparent;
      background: none;
      cursor: pointer;
      transition: border-color 0.3s ease;

      img {
        width: 100%;
        border-radius: 50%;
      }

      &:hover {
        border-color: hsl(var(--orange));
      }
    }
  }

  @media only screen and (max-width: 1200px) {
    nav {
      max-width: 95%;
    }

    .nav-left .nav-links {
      gap: 1.5rem;
    }
  }

  @media only screen and (max-width: 768px) {
    padding: 1.5rem;

    nav {
      flex-wrap: wrap;
    }

    .nav-left {
      order: 1;
      width: 100%;
      justify-content: space-between;

      .nav-links {
        display: none;
      }
    }

    .nav-right {
      order: 2;
    }

    ${SearchForm} {
      order: 3;
      width: 100%;
      margin-top: 1rem;
    }
  }
`;

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

export default CollectionsNavbar;