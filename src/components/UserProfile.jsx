import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { avatar } from "../assets/imagedata";
import { editAPI, passwordAPI, viewAPI, uploadProfilePicAPI } from "../services/userServices";
import { useMutation, useQuery } from "@tanstack/react-query";

const UserProfile = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ['viewAPI'],
    queryFn: viewAPI,
    retry: 1
  });

  const profileMutation = useMutation({
    mutationKey: ['editAPI'],
    mutationFn: editAPI,
  });

  const passwordMutation = useMutation({
    mutationKey: ['passwordAPI'],
    mutationFn: passwordAPI,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadProfilePicAPI,
    onSuccess: (data) => {
      refetchProfile(); // Refresh profile data after successful upload
      setPreviewUrl(null); // Clear preview
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      alert('Failed to upload profile picture. Please try again.');
    }
  });

  useEffect(() => {
    if (profileData) {
      setVendorData({
        username: profileData.user.username || "",
        email: profileData.user.email || "",
        phone: profileData.user.phone || "",
        address: profileData.user.address || "",
      });
      setLoading(false);
    }
  }, [profileData]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the image
      const formData = new FormData();
      formData.append('profilePic', file);
      uploadMutation.mutate(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await profileMutation.mutate(vendorData);
    setIsEditMode(false);
  };

  const handlePasswordSubmit = async(e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    await passwordMutation.mutate({
      newPassword:passwordData.newPassword,
      oldPassword:passwordData.currentPassword
    });
    alert("Password changed successfully!");
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  return (
    <ProfileWrapper>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-pic-container" onClick={handleImageClick}>
            <img 
              src={previewUrl || profileData?.user?.profilePic || avatar} 
              alt="User Profile" 
              className="user-logo" 
            />
            <div className="overlay">
              <span>Change Photo</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {isEditMode ? (
            <input
              type="text"
              name="username"
              value={vendorData?.username}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <h2>{vendorData?.username}</h2>
          )}
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit}>
            <div className="profile-details">
              <div className="detail-item">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={vendorData.email}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={vendorData.phone}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              <div className="detail-item">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={vendorData.address}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              </div>
              
            </div>
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsEditMode(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="profile-details">
              <div className="detail-item">
                <label>Email</label>
                <p>{vendorData?.email}</p>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <p>{vendorData?.phone}</p>
              </div>
              <div className="detail-item">
                <label>Address</label>
                <p>{vendorData?.address}</p>
              </div>
              
            </div>
            <button
              className="edit-button"
              onClick={() => setIsEditMode(true)}
            >
              Edit Profile
            </button>
            <button
              className="change-password-button"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              Change Password
            </button>
          </>
        )}

        {showChangePassword && (
          <div className="change-password-form">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="detail-item">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="detail-item">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="detail-item">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                  required
                />
              </div>
              <button type="submit" className="save-button">
                Change Password
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;

  .profile-container {
    background-color: #ffffff;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
    text-align: center;

    .profile-header {
      margin-bottom: 2.5rem;

      .profile-pic-container {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        cursor: pointer;
        margin-bottom: 1.5rem;
        
        &:hover .overlay {
          opacity: 1;
        }

        .user-logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e9ecef;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;

          span {
            color: white;
            font-size: 14px;
            text-align: center;
          }
        }
      }

      h2 {
        font-size: 2rem;
        color: #343a40;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .edit-input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border: 1px solid #ced4da;
        border-radius: 6px;
        margin-bottom: 1rem;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;

        &:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
          outline: none;
        }
      }
    }

    .profile-details {
      text-align: left;

      .detail-item {
        margin-bottom: 1.75rem;

        label {
          display: block;
          font-size: 0.95rem;
          color: #495057;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        p {
          font-size: 1rem;
          color: #212529;
          margin: 0;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .edit-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ced4da;
          border-radius: 6px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;

          &:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
            outline: none;
          }
        }

        textarea.edit-input {
          resize: vertical;
          min-height: 100px;
        }
      }
    }

    .edit-button,
    .change-password-button,
    .save-button,
    .cancel-button {
      width: 100%;
      padding: 0.85rem;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-bottom: 0.75rem;
      font-weight: 500;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .edit-button {
      background-color: #007bff;
      color: #fff;

      &:hover {
        background-color: #0056b3;
      }
    }

    .change-password-button {
      background-color: #28a745;
      color: #fff;

      &:hover {
        background-color: #218838;
      }
    }

    .save-button {
      background-color: #17a2b8;
      color: #fff;

      &:hover {
        background-color: #138496;
      }
    }

    .cancel-button {
      background-color: #dc3545;
      color: #fff;

      &:hover {
        background-color: #c82333;
      }
    }

    .change-password-form {
      margin-top: 2.5rem;
      text-align: left;
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e9ecef;

      h3 {
        font-size: 1.5rem;
        color: #343a40;
        margin-bottom: 1.5rem;
        font-weight: 600;
        text-align: center;
      }

      .detail-item {
        margin-bottom: 1.5rem;

        label {
          display: block;
          font-size: 0.95rem;
          color: #495057;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ced4da;
          border-radius: 6px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;

          &:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
            outline: none;
          }
        }
      }

      .save-button,
      .cancel-button {
        width: 100%;
        padding: 0.85rem;
        font-size: 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin-bottom: 0.75rem;
        font-weight: 500;

        &:hover {
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      .save-button {
        background-color: #17a2b8;
        color: #fff;

        &:hover {
          background-color: #138496;
        }
      }

      .cancel-button {
        background-color: #6c757d;
        color: #fff;

        &:hover {
          background-color: #5a6268;
        }
      }
    }
  }
`;

export default UserProfile;