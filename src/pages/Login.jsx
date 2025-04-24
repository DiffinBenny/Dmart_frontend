import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { loginAPI } from "../services/userServices";
import { loginUserAction } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Mutation for logging in a user
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: loginAPI,
    mutationKey: ["login-user"],
  });

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitting form data:", values);
        const token = await mutateAsync(values);     
        if (token) {
            sessionStorage.setItem("userToken", token);
            const decodedData = jwtDecode(token);
            dispatch(loginUserAction(decodedData));
            resetForm();
            if(decodedData.role==="vendor"){
              navigate("/vendorhome")
            }
            else if(decodedData.role==="customer"){
            navigate("/collections/collectionshome");
            }
            else if(decodedData.role==="admin"){
              navigate("/admin/dashboard")
            }
        } else {
            setSuccessMessage("Invalid response from server");
        }
      } catch (error) {
        console.error("Login Error:", error.response ? error.response.data : error.message);
        alert("An error occurred during login. Please try again.");
      }
    },
  });

  return (
    <LoginWrapper>
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <ErrorMessage>{formik.errors.email}</ErrorMessage>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <ErrorMessage>{formik.errors.password}</ErrorMessage>
            )}
          </div>

          {/* Display Mutation Error */}
          {isError && <ErrorMessage>{error.message}</ErrorMessage>}

          <button type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </LoginWrapper>
  );
};

// Styled Components
const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url("/src/assets/A.jpg");
  background-size: cover;
  background-position: center;

  .login-container {
    background: rgba(255, 255, 255, 0.2); // More transparent background
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3); // Light border for definition
    max-width: 400px;
    width: 100%;
    text-align: center;

    h1 {
      font-size: 2rem;
      color: white; // Changed to white for better contrast
      margin-bottom: 1.5rem;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .form-group {
      margin-bottom: 1rem;
      text-align: left;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: white; // Changed to white
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      input {
        width: 100%;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.8); // Slightly opaque input fields
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 0.5rem;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: hsl(var(--orange));
          background: rgba(255, 255, 255, 0.9); // Slightly more opaque when focused
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
      transition: all 0.3s ease;
      margin-top: 1rem;

      &:hover {
        background-color: hsl(var(--orange), 0.8);
        transform: translateY(-1px);
      }

      &:disabled {
        background-color: hsl(var(--orange), 0.5);
        cursor: not-allowed;
        transform: none;
      }
    }

    p {
      margin-top: 1rem;
      font-size: 1rem;
      color: white; // Changed to white
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

      a {
        color: hsl(var(--orange));
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ffcccc; // Lighter red for better visibility
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

export default Login;