import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../icons";
import { FaBell } from 'react-icons/fa';
import { avatar } from "../assets/imagedata";
import { removeToken } from "../utils/storageHandler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVendorProfileAPI } from "../services/VendorServices";
import { deleteAllNotificationsAPI, getNotificationsAPI, markNotificationsAsReadAPI } from "../services/notificationServices";

// Styled Components
const NavigatorWrapper = styled.header`
  position: relative;
  padding: 2.4rem;
  border-bottom: 1px solid hsl(var(--divider));

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
    gap: 1.6rem;

    .menu-btn {
      display: block;
      background: none;
      border: none;
      cursor: pointer;

      @media only screen and (min-width: 768px) {
        display: none;
      }
    }

    .logo {
      margin-right: 3.2rem;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        padding: 0.5rem;
        border: 1px solid hsl(var(--divider));
        border-radius: 0.5rem;
        font-size: 1rem;
        width: 200px;

        &:focus {
          outline: none;
          border-color: hsl(var(--orange));
        }
      }

      button {
        padding: 0.5rem 1rem;
        background-color: hsl(var(--orange));
        color: hsl(var(--white));
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;

        &:hover {
          opacity: 0.9;
        }
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
          a {
            text-decoration: none;
            font-size: 1.5rem;
            text-transform: capitalize;
            color: hsl(var(--dark-grayish-blue));
            transition: color 0.3s ease;

            &:hover {
              color: hsl(var(--black));
            }
          }
        }
      }
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1.6rem;

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
        top: -1rem;
        right: -1rem;
        background-color: hsl(var(--orange));
        font-weight: 700;
        color: hsl(var(--white));
        border-radius: 50%;
        padding: 0.3rem 0.8rem;
        font-size: 1.1rem;
      }
    }

    .avatar-btn {
      height: 2.4rem;
      width: 2.4rem;
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

  @media only screen and (min-width: 768px) {
    padding-bottom: 4rem;

    .nav-right {
      gap: 2.4rem;

      .avatar-btn {
        height: 3.5rem;
        width: 3.5rem;
      }
    }
  }

  @media only screen and (min-width: 1000px) {
    padding: 4rem 0;
    max-width: 80%;
    margin: 0 auto;

    .nav-right {
      gap: 4.7rem;

      .avatar-btn {
        height: 5rem;
        width: 5rem;
      }
    }
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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    background-color: hsl(var(--orange-hover));
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const DeleteAllButton = styled.button`
  padding: 8px 16px;
  background-color: #ff3f6c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    background-color: #e0355e;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
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
  margin-left: 1rem;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);

  &:hover {
    transform: translateY(-2px);
    background-color: #e04b2f;
    box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.6rem 1.2rem;
  }
`;

const VendorNavbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();

  // Fetch vendor profile data
  const { data: profileData } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: getVendorProfileAPI,
    retry: 1
  });

  // Fetch notifications
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsAPI,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Mark notifications as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationsAsReadAPI,
    mutationKey: ['markNotificationsAsRead'],
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => {
      console.error('Failed to mark notifications as read:', error);
    }
  });

  // Delete all notifications mutation
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotificationsAPI,
    mutationKey: ['del-notifications'],
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      refetchNotifications();
    },
    onError: (error) => {
      console.error('Failed to delete notifications:', error);
    }
  });

  const unreadNotifications = notifications.filter(notification => !notification.read);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAvatarClick = () => {
    navigate("/vendor/profile");
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <NavigatorWrapper>
      <nav>
        <div className="nav-left">
          {/* Logo */}
          <div className="logo">
            <Logo />
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <Link to="/vendorhome">Home</Link>
            </li>
            <li>
              <Link to="/vendor/add-product">Add Product</Link>
            </li>
            <li>
              <Link to="/vendor/edit-product">View Product</Link>
            </li>
            <li>
              <Link to="/vendor/order-list">Order List</Link>
            </li>
            <li>
              <Link to="/vendor/report">Report</Link>
            </li>
            <li>
              <Link to="/vendor/vendorchat">Chat</Link>
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
          
          <button className="avatar-btn" onClick={handleAvatarClick}>
            <img src={profileData?.profilePic || avatar} alt="avatar" />
          </button>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </div>
      </nav>

      {showNotifications && (
        <NotificationDropdown>
          <NotificationHeader>
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <MarkAllReadButton
                  onClick={() => markAsReadMutation.mutate()}
                  disabled={markAsReadMutation.isPending}
                >
                  {markAsReadMutation.isPending ? 'Marking...' : 'Mark All as Read'}
                </MarkAllReadButton>
               
              </div>
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
                      minute: '2-digit'
                    })}
                  </small>
                </NotificationItem>
              ))
            ) : (
              <NoNotifications>
                No notifications
              </NoNotifications>
            )}
          </NotificationList>
        </NotificationDropdown>
      )}
    </NavigatorWrapper>
  );
};

export default VendorNavbar;