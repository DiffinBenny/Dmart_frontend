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

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register-user"],
  });

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
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

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
        console.log("Submitting form data:", values);
        const token = await mutateAsync(values);
        setErrorMessage(null);
        if (token) {
          console.log(token);
          sessionStorage.setItem("userToken", token);
          const decodedData = jwtDecode(token);
          dispatch(loginUserAction(decodedData));
          resetForm();
          navigate("/login");
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
      <GlassFormWrapper>
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
      </GlassFormWrapper>
    </PageWrapper>
  );
};

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("/src/assets/A.jpg") no-repeat center center fixed;
  background-size: cover;
`;

const GlassFormWrapper = styled.div`
  max-width: 600px;
  width: 90%;
  margin: 2rem;
  padding: 3rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  color: #fff;

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    input {
      width: 100%;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.75rem;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
      color: #333;

      &:focus {
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(255, 107, 53, 0.6);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
      }

      &::placeholder {
        color: #666;
      }
    }
  }

  button {
    width: 100%;
    padding: 1rem;
    background: rgba(255, 107, 53, 0.8);
    color: white;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-top: 1rem;
    backdrop-filter: blur(4px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

    &:hover {
      background: rgba(244, 93, 42, 0.9);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: rgba(255, 157, 125, 0.7);
      cursor: not-allowed;
      transform: none;
    }
  }

  p {
    text-align: center;
    margin-top: 2rem;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);

    a {
      color: #ffd700;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        text-decoration: underline;
        color: #ffeb3b;
      }
    }
  }

  .error-message {
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(211, 47, 47, 0.7);
    color: #fff;
    border-radius: 0.75rem;
    text-align: center;
    font-size: 1rem;
    border-left: 4px solid rgba(255, 255, 255, 0.3);
  }
`;

const ErrorMessage = styled.p`
  color: #ffeb3b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export default Register;