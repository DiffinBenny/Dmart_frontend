import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotAPI } from "../services/userServices";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: forgotAPI,
    mutationKey: ["forgot-password"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutateAsync({ email });
      setMessage(`If an account with ${email} exists, a reset link has been sent.`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <ForgotPasswordWrapper>
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>
        {message ? (
          <div className="message">
            {message}
            <p className="back-to-login">
              Remember your password? <Link to="/login">Login here</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Reset Password"}
            </button>
            <p>
              Remember your password? <Link to="/login">Login here</Link>
            </p>
          </form>
        )}
      </div>
    </ForgotPasswordWrapper>
  );
};

const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("/src/assets/A.jpg");
  background-size: cover;
  background-position: center;

  .forgot-password-container {
    background: rgba(255, 255, 255, 0.77);
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;

    h1 {
      font-size: 2rem;
      color: hsl(var(--black));
      margin-bottom: 1.5rem;
    }

    .message {
      padding: 1rem;
      background: hsl(var(--light-gray));
      border-radius: 0.5rem;
      margin-bottom: 1rem;

      .back-to-login {
        margin-top: 1rem;
      }
    }

    .form-group {
      margin-bottom: 1rem;
      text-align: left;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: hsl(var(--dark-grayish-blue));
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid hsl(var(--divider));
        border-radius: 0.5rem;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: hsl(var(--orange));
        }
      }
    }

    button {
      width: 100%;
      padding: 0.75rem;
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

    p {
      margin-top: 1rem;
      font-size: 1rem;
      color: hsl(var(--dark-grayish-blue));

      a {
        color: hsl(var(--orange));
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export default ForgotPassword;