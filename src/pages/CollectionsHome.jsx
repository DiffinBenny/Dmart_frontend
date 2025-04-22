import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { fileComplaintAPI } from "../services/complaintServices";

// Import background images
import background1 from "../assets/e1.jpg";
import background2 from "../assets/e5.jpg";
import background3 from "../assets/background3.jpg";

const CollectionsHome = () => {
  const navigate = useNavigate();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    name:''
  });

  const complaintMutation = useMutation({
    mutationFn: fileComplaintAPI,
    onSuccess: () => {
      alert("Complaint submitted successfully!");
      closeComplaintModal();
    },
    onError: (error) => {
      alert(`Error submitting complaint: ${error.message}`);
    }
  });

  const goToAboutPage = () => {
    navigate("/about");
  };

  const openComplaintModal = () => {
    setIsComplaintModalOpen(true);
  };

  const closeComplaintModal = () => {
    setIsComplaintModalOpen(false);
    setFormData({ subject: '', description: '',name:'' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    complaintMutation.mutate(formData);
  };

  return (
    <HomeWrapper>
      <section className="hero">
        <h1>Welcome to Collections</h1>
        <p>Explore our latest products and collections.</p>
        <div className="button-group">
          <button onClick={goToAboutPage} className="about-button">
            Learn More About Us
          </button>
          <button onClick={openComplaintModal} className="complaint-button">
            File a Complaint
          </button>
        </div>
      </section>

      {/* Complaint Modal */}
      {isComplaintModalOpen && (
        <ComplaintModalWrapper>
          <div className="modal-content">
            <button className="close-button" onClick={closeComplaintModal}>
              &times;
            </button>
            <h2>File a Complaint</h2>
            <form onSubmit={handleComplaintSubmit}>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Bussiness Name</label>
                <textarea
                  id="name"
                  name="name"
                  rows="5"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={complaintMutation.isPending}
              >
                {complaintMutation.isPending ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </ComplaintModalWrapper>
      )}
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
  width: 100%;
  background-image: url(${background1});
  background-size: cover;
  background-position: center;
  animation: ${backgroundAnimation} 15s infinite;

  .hero {
    text-align: center;
    margin-bottom: 4rem;
    padding-top: 19rem;

    h1 {
      font-size: 7rem;
      color: hsl(var(--white));
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    p {
      font-size: 1.4rem;
      color: hsl(var(--white));
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 1rem;
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

    .complaint-button {
      padding: 0.75rem 1.5rem;
      background-color: hsl(var(--white));
      color: hsl(var(--dark));
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

const ComplaintModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    background-color: hsl(var(--white));
    padding: 2rem;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 500px;
    position: relative;

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: hsl(var(--dark));
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: hsl(var(--dark));
      }

      input,
      textarea {
        width: 100%;
        color: black
        padding: 0.5rem;
        border: 1px solid hsl(var(--gray));
        border-radius: 0.25rem;
      }
    }

    .submit-button {
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

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
`;

export default CollectionsHome;