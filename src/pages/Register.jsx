import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../services/userServices";
import { loginUserAction } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Mutation for registering a user
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register-user"],
  });

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, "Username must be at least 5 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .test(
        "is-gmail",
        "Only Gmail addresses are allowed (@gmail.com)",
        (value) => {
          if (!value) return false;
          return value.endsWith("@gmail.com");
        }
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitting form data:", values); // Log form data
        const token = await mutateAsync(values);
        setErrorMessage(null);
        if (token) {
          console.log(token);
          
          sessionStorage.setItem("userToken", token);
          const decodedData = jwtDecode(token);
          dispatch(loginUserAction(decodedData)); // Dispatch token and role
          resetForm();
          navigate("/collections/collectionshome");
        } else {
          alert("Invalid response from server");
        }
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Something went wrong!");
        setSuccessMessage(null);
      }
    },
  });

  return (
    <PageWrapper>
      <RegisterWrapper>
        <h1>Register</h1>
        <form onSubmit={formik.handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.username && formik.errors.username && (
              <ErrorMessage>{formik.errors.username}</ErrorMessage>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>Email (Gmail only)</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              placeholder="example@gmail.com"
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

          {/* Confirm Password Field */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <ErrorMessage>{formik.errors.confirmPassword}</ErrorMessage>
            )}
          </div>

          {/* Display Mutation Error */}
          {isError && <ErrorMessage>{error.message}</ErrorMessage>}

          <button type="submit" disabled={isPending}>
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </RegisterWrapper>
    </PageWrapper>
  );
};

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("/src/assets/login2.jpg.webp") no-repeat center center fixed;
  background-size: cover;
`;

const RegisterWrapper = styled.div`
  max-width: 600px;
  width: 90%;
  margin: 2rem;
  padding: 3rem;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: #333;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 2rem;

    label {
      display: block;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
      color: #444;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;

      &:focus {
        border-color: #ff6b35;
        box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
      }

      &::placeholder {
        color: #aaa;
      }
    }
  }

  button {
    width: 100%;
    padding: 1rem;
    background-color: #ff6b35;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 1rem;

    &:hover {
      background-color: #f45d2a;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background-color: #ff9d7d;
      cursor: not-allowed;
      transform: none;
    }
  }

  p {
    text-align: center;
    margin-top: 2rem;
    font-size: 1.1rem;
    color: #555;

    a {
      color: #ff6b35;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        text-decoration: underline;
        color: #f45d2a;
      }
    }
  }

  .error-message {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #ffebee;
    color: #d32f2f;
    border-radius: 0.5rem;
    text-align: center;
    font-size: 1rem;
    border-left: 4px solid #d32f2f;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: left;
`;

export default Register;