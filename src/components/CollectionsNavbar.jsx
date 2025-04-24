import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Logo, Cart } from "../icons/index";
import { FaBell } from 'react-icons/fa';
import { avatar } from "../assets/imagedata";
import FloatingCart from "./FloatingCart";
import { useGlobalContext } from "../context/context";
import { removeToken } from "../utils/storageHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { viewAPI } from "../services/userServices";
import { deleteAllNotificationsAPI, getNotificationsAPI, markNotificationsAsReadAPI } from "../services/notificationServices";

// Styled Components
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

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 2rem;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: hsl(var(--orange));
    transform: scale(1.05);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff3f6c;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(25%, -25%);
`;

const NotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 20px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  width: 400px;
  max-height: 480px;
  overflow-y: auto;
  z-index: 1000;

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 25px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    border-left: 1px solid #e9e9e9;
    border-top: 1px solid #e9e9e9;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const NotificationHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #282c3f;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e9e9e9;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f6;
  }

  &:last-child {
    border-bottom: none;
  }

  p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #282c3f;
    line-height: 1.4;
  }

  small {
    color: #94969f;
    font-size: 12px;
  }
`;

const NoNotifications = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: #94969f;
  font-size: 14px;
`;

const MarkAllReadButton = styled.button`
  padding: 8px 16px;
  background-color: hsl(var(--orange));
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
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
`;

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

const CollectionsNavbar = () => {
  const { showCart, hideCart, state } = useGlobalContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();

  // Fetch user profile data
  const { data: profileData } = useQuery({
    queryKey: ['viewAPI'],
    queryFn: viewAPI,
    retry: 1,
  });

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsAPI,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mutation for marking notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationsAsReadAPI,
    mutationKey: ['markNotificationsAsRead'],
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => {
      console.error('Failed to mark notifications as read:', error);
    },
  });

  const unreadNotifications = notifications.filter(notification => !notification.read);

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

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
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
          <NotificationButton onClick={handleNotificationClick}>
            <FaBell />
            {unreadNotifications.length > 0 && (
              <NotificationBadge>{unreadNotifications.length}</NotificationBadge>
            )}
          </NotificationButton>
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

      {showNotifications && (
        <NotificationDropdown>
          <NotificationHeader>
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <MarkAllReadButton
                onClick={() => markAsReadMutation.mutate()}
              >
                Mark All as Read
              </MarkAllReadButton>
            )}
          </NotificationHeader>
          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  className={!notification.read ? 'unread' : ''}
                >
                  <p>{notification.message}</p>
                  <small>
                    {new Date(notification.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </NotificationItem>
              ))
            ) : (
              <NoNotifications>No notifications</NoNotifications>
            )}
          </NotificationList>
        </NotificationDropdown>
      )}
    </CollectionsNavbarWrapper>
  );
};

export default CollectionsNavbar;