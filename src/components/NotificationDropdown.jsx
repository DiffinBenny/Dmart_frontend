import React from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBell, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { getNotificationsAPI, markNotificationsAsReadAPI, deleteAllNotificationsAPI, deleteReadNotificationsAPI } from '../services/notificationServices';

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

const DropdownContainer = styled.div`
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

const Header = styled.div`
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

  .notification-count {
    font-size: 12px;
    color: #94969f;
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
  background-color: ${props => props.isUnread ? '#f5f8ff' : 'white'};

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

const MarkAllButton = styled.button`
  background-color: transparent;
  color: #ff3f6c;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    color: #ff2c54;
    text-decoration: underline;
  }

  &:disabled {
    color: #94969f;
    cursor: not-allowed;
    &:hover {
      text-decoration: none;
    }
  }
`;

const UnreadButton = styled.button`
  background-color: ${props => props.variant === 'primary' ? '#4a90e2' : '#2ecc71'};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsAPI,
    refetchInterval: 30000
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationsAsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotificationsAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      setShowNotifications(false);
    }
  });

  const deleteReadMutation = useMutation({
    mutationFn: deleteReadNotificationsAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const readNotifications = notifications.filter(notification => notification.read);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllReadAndRemove = () => {
    if (notifications.length > 0) {
      markAsReadMutation.mutate(undefined, {
        onSuccess: () => {
          deleteAllMutation.mutate();
        }
      });
    }
  };

  const handleRemoveRead = () => {
    if (readNotifications.length > 0 && window.confirm('Are you sure you want to remove all read notifications?')) {
      deleteReadMutation.mutate();
    }
  };

  return (
    <>
      <NotificationButton onClick={handleNotificationClick}>
        <FaBell />
        {unreadNotifications.length > 0 && (
          <NotificationBadge>{unreadNotifications.length}</NotificationBadge>
        )}
      </NotificationButton>

      {showNotifications && (
        <DropdownContainer>
          <Header>
            <h3>Notifications</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UnreadButton
                onClick={handleMarkAllReadAndRemove}
                disabled={notifications.length === 0}
              >
                <FaTrash /> Make All Read
              </UnreadButton>
            </div>
          </Header>
          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  isUnread={!notification.read}
                >
                  <p>{notification.message}</p>
                  <small>{new Date(notification.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</small>
                </NotificationItem>
              ))
            ) : (
              <NoNotifications>
                No notifications
              </NoNotifications>
            )}
          </NotificationList>
        </DropdownContainer>
      )}
    </>
  );
};

export default NotificationDropdown;