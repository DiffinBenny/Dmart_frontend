import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { registerAPI } from "../services/userServices";
import { loginUserAction } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";

const VendorRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: registerAPI,
    mutationKey: ["register-vendor"],
  });

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
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
    gstNumber: Yup.string()
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number")
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gstNumber: "",
      role: "vendor",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {console.log(values);
      
        const token = await mutateAsync(values);     
        // if (token) {
            sessionStorage.setItem("userToken", token);
            const decodedData = jwtDecode(token);
            dispatch(loginUserAction(decodedData));
            // setSuccessMessage("Login Successful!");
        // } else {
        //     setSuccessMessage("Invalid response from server");
        // }
          resetForm();
          navigate("/login");
      } catch (error) {
        console.error("Signup Error:", error.response ? error.response.data : error.message);
        alert(error.response?.data?.message || "An error occurred during registration. Please try again.");
      }
    },
  });

  return (
    <PageWrapper>
      <RegisterWrapper>
        <h1>Register</h1>
        <form onSubmit={formik.handleSubmit}>
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

          <div className="form-group">
            <label>GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formik.values.gstNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter GST Number (Optional)"
            />
            {formik.touched.gstNumber && formik.errors.gstNumber && (
              <ErrorMessage>{formik.errors.gstNumber}</ErrorMessage>
            )}
          </div>

          {isError && <ErrorMessage>{error.response?.data?.message || error.message}</ErrorMessage>}

          <button type="submit" disabled={isPending}>
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </RegisterWrapper>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("/src/assets/A.jpg") no-repeat center center fixed;
  background-size: cover;
`;
const RegisterWrapper = styled.div`
  max-width: 600px;
  margin: 2rem;
  padding: 3rem;
  border: 1px solid hsla(0, 0%, 100%, 0.3);
  border-radius: 1rem;
  background: hsla(0, 0%, 100%, 0.2); /* More transparent background */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px); /* Adds a blur effect to the background */
  color: #fff; /* White text for better contrast */

  h1 {
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 3rem;
    color: #fff; /* White text */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Text shadow for readability */
  }

  .form-group {
    margin-bottom: 2.5rem;

    label {
      display: block;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: #fff; /* White text */
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Text shadow for readability */
    }

    input {
      width: 100%;
      padding: 1.25rem;
      border: 1px solid hsla(0, 0%, 100%, 0.3);
      border-radius: 0.5rem;
      font-size: 1.5rem;
      outline: none;
      background: hsla(0, 0%, 100%, 0.2); /* Transparent input background */
      color: #fff; /* White text */

      &::placeholder {
        color: hsla(0, 0%, 100%, 0.7); /* Semi-transparent placeholder */
      }

      &:focus {
        border-color: hsl(var(--orange));
        background: hsla(0, 0%, 100%, 0.3); /* Slightly less transparent when focused */
      }
    }
  }

  button {
    width: 100%;
    padding: 1.25rem;
    background-color: hsl(var(--orange));
    color: hsl(var(--white));
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      background-color: hsl(var(--orange), 0.5);
      cursor: not-allowed;
    }
  }

  p {
    text-align: center;
    margin-top: 2.5rem;
    font-size: 1.5rem;
    color: #fff; /* White text */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Text shadow for readability */

    a {
      color: hsl(var(--orange));
      text-decoration: none;
      text-shadow: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b; /* Brighter red for better visibility */
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Text shadow for readability */
`;
export default VendorRegister;