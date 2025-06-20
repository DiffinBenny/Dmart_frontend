import React, { useState } from "react";
import styled from "styled-components";

const Footer = () => {
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const openComplaintModal = () => {
    setIsComplaintModalOpen(true);
  };

  const closeComplaintModal = () => {
    setIsComplaintModalOpen(false);
  };

  return (
    <FooterWrapper>
      <div className="footer-content">
        {/* Section 1: Get to Know Us */}
        <div className="footer-section">
          <h3>Get to Know Us</h3>
          <ul>
            <li>About E-mart</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>E-Mart Science</li>
          </ul>
        </div>

        {/* Section 2: Connect with Us */}
        <div className="footer-section">
          <h3>Connect with Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>

        {/* Section 3: Make Money with Us */}
        <div className="footer-section">
          <h3>Make Money with Us</h3>
          <ul>
            <li>Sell on E-Mart</li>
            <li>Sell under E-mart Accelerator</li>
            <li>Protect and Build Your Brand</li>
            <li>E-mart Selling</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
          </ul>
        </div>

        {/* Section 4: Let Us Help You */}
        <div className="footer-section">
          <h3>Let Us Help You</h3>
          <ul>
            <li>Your Account</li>
            <li>Returns Center</li>
            <li>Recalls and Product Safety Alerts</li>
            <li>100% Purchase Protection</li>
            <li> Download Help</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      {/* <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} E-mart Clone. All rights reserved.</p>
        <button className="complaint-button" onClick={openComplaintModal}>
          File a Complaint
        </button>
      </div> */}

      {/* Complaint Modal */}
      {/* {isComplaintModalOpen && (
        <ComplaintModalWrapper>
          <div className="modal-content">
            <button className="close-button" onClick={closeComplaintModal}>
              &times;
            </button>
            <h2>File a Complaint</h2>
            <form>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        </ComplaintModalWrapper>
      )} */}
    </FooterWrapper>
  );
};

// Styled Components
const FooterWrapper = styled.footer`
  background-color: #2c3e50; /* Dark blue background */
  color: #ffffff; /* White text */
  padding: 3rem 2rem;
  margin-top: auto; /* Push footer to the bottom of the page */

  .footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 0;
  }

  .footer-section {
    flex: 1;
    min-width: 200px;

    h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: #f39c12; /* Orange accent color */
      font-weight: 600;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 0.75rem;
        font-size: 0.95rem;
        cursor: pointer;
        transition: color 0.3s ease;

        &:hover {
          color: #f39c12; /* Orange accent color on hover */
        }
      }
    }
  }

  .footer-bottom {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1); /* Subtle divider */

    p {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8); /* Light gray text */
      margin-bottom: 1rem;
    }

    .complaint-button {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: #f39c12; /* Orange accent color */
      color: #ffffff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        background-color: #e67e22; /* Darker orange on hover */
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
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
  background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background-color: #ffffff;
    padding: 2.5rem;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .close-button {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: none;
      border: none;
      font-size: 1.75rem;
      cursor: pointer;
      color: #2c3e50; /* Dark blue text */
      transition: color 0.3s ease;

      &:hover {
        color: #e74c3c; /* Red on hover */
      }
    }

    h2 {
      text-align: center;
      color: #2c3e50; /* Dark blue text */
      margin-bottom: 2rem;
      font-size: 1.75rem;
      font-weight: 600;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        label {
          font-size: 1rem;
          color: #2c3e50; /* Dark blue text */
          font-weight: 500;
        }

        input,
        textarea {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ced4da; /* Light gray border */
          border-radius: 8px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;

          &:focus {
            border-color: #f39c12; /* Orange accent color */
            box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.25); /* Orange shadow */
            outline: none;
          }
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }
      }

      .submit-button {
        background-color: #f39c12; /* Orange accent color */
        color: #ffffff;
        border: none;
        padding: 0.85rem;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 8px;
        font-weight: 500;
        transition: background-color 0.3s ease, transform 0.2s ease;

        &:hover {
          background-color: #e67e22; /* Darker orange on hover */
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
`;

export default Footer;