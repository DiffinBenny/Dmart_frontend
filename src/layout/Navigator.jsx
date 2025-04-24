import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Logo, Menu } from "../icons/index"; // Removed Cart import
import { useGlobalContext } from "../context/context";

const navLinks = [
  { name: "home", path: "/" },
  { name: "login", path: "/login" },
  // { name: "register", path: "/register", subItems: [
    { name: "register",  subItems: [
    { name: "Vendor Register", path: "/vendor-register" },
    { name: "User Register", path: "/register" },
  ] },
];

const Navigator = () => {
  const { showSidebar } = useGlobalContext(); // Removed showCart, hideCart, state
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false); // State for register dropdown
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <NavigatorWrapper>
      <nav>
        <div className="nav-left">
          <button onClick={showSidebar} className="menu-btn">
            <Menu />
          </button>
          <div className="logo">
            <Logo />
          </div>
          <ul className="nav-links">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                {link.subItems ? (
                  <div
                    className="dropdown"
                    onMouseEnter={() => setShowRegisterDropdown(true)}
                    onMouseLeave={() => setShowRegisterDropdown(false)}
                  >
                    <Link to={link.path}>{link.name}</Link>
                    {showRegisterDropdown && (
                      <ul className="dropdown-menu">
                        {link.subItems.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link to={subItem.path}>{subItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link to={link.path}>{link.name}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-right">
          <AboutButton onClick={handleAboutClick}>
            About Us
          </AboutButton>
        </div>
      </nav>
    </NavigatorWrapper>
  );
};

// Styled Components
const NavigatorWrapper = styled.header`
  position: relative;
  padding: 2.4rem;
  border-bottom: 1px solid hsl(var(--divider));
  background-color: hsl(var(--white));
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Added shadow for depth */

  img,
  svg {
    display: block;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 2rem; /* Increased gap for better spacing */

    .menu-btn {
      display: block;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1); /* Slight hover effect */
      }

      @media only screen and (min-width: 768px) {
        display: none;
      }
    }

    .logo {
      margin-right: 3.2rem;
      svg {
        width: 120px; /* Larger logo */
        height: auto;
      }
    }

    .nav-links {
      display: none;

      @media only screen and (min-width: 768px) {
        display: flex;
        gap: 3.2rem;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          position: relative;

          a {
            text-decoration: none;
            font-size: 1.5rem; /* Larger font size */
            text-transform: capitalize;
            color: hsl(var(--dark-grayish-blue));
            transition: color 0.3s ease;

            &:hover {
              color: hsl(var(--black));
            }
          }

          .dropdown {
            position: relative;

            .dropdown-menu {
              position: absolute;
              top: 100%;
              left: 0;
              background-color: hsl(var(--white));
              border: 1px solid hsl(var(--divider));
              border-radius: 0.75rem; /* More rounded corners */
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              z-index: 10;
              list-style: none;
              margin: 0;
              padding: 0;
              width: 220px; /* Slightly wider dropdown */

              li {
                padding: 0.75rem 1rem; /* Larger padding */

                a {
                  font-size: 1.25rem; /* Larger font size */
                  color: hsl(var(--dark-grayish-blue));
                  text-decoration: none;

                  &:hover {
                    color: hsl(var(--orange));
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 2rem; /* Increased gap */

    /* Placeholder for future elements */
  }

  @media only screen and (min-width: 768px) {
    padding-bottom: 4rem;

    .nav-right {
      gap: 2.4rem;
    }
  }

  @media only screen and (min-width: 1000px) {
    padding: 4rem 0;
    max-width: 90%; /* Slightly wider container */
    margin: 0 auto;

    .nav-right {
      gap: 4.7rem;
    }
  }
`;

const AboutButton = styled.button`
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

export default Navigator;