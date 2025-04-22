import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios"; // Ensure axios is imported
import { loginAPI } from "../services/userServices"; // Ensure this path is correct
import { loginUserAction } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
const dispatch=useDispatch()
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
        console.log("Submitting form data:", values); // Log form data
        const token = await mutateAsync(values);     
        if (token) {
            sessionStorage.setItem("userToken", token);
            const decodedData = jwtDecode(token);
            dispatch(loginUserAction(decodedData));
            // setSuccessMessage("Login Successful!");
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
        console.error("Login Error:", error.response ? error.response.data : error.message); // Log detailed error
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
  background-image: url("/src/assets/login2.jpg.webp"); // Add background image
  background-size: cover;
  background-position: center;

  .login-container {
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
        background-color: hsl(var(--orange), 0.5);
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: left;
`;

export default Login;