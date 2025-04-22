import React, { createContext, useReducer, useContext } from "react";

// Define the initial state
const initialState = {
  user: null, // User data
  isAuthenticated: false, // Authentication status
  cart: [], // Cart items
  totalCartSize: 0, // Total items in the cart
  showingCart: false, // Whether the cart is visible
  showSidebar: false, // Whether the sidebar is visible
};

// Create the context
const GlobalContext = createContext(initialState);

// Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
        totalCartSize: state.totalCartSize + 1,
      };
    case "SHOW_CART":
      return {
        ...state,
        showingCart: true,
      };
    case "HIDE_CART":
      return {
        ...state,
        showingCart: false,
      };
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        showSidebar: !state.showSidebar,
      };
    default:
      return state;
  }
};

// Create the provider component
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Define the logout function
  const logoutUser = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Define the show/hide cart functions
  const showCart = () => {
    dispatch({ type: "SHOW_CART" });
  };

  const hideCart = () => {
    dispatch({ type: "HIDE_CART" });
  };

  // Define the add to cart function
  const addToCart = (amount, product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: amount },
    });
  };

  // Define the toggle sidebar function
  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  return (
    <GlobalContext.Provider
      value={{
        state,
        logoutUser,
        showCart,
        hideCart,
        addToCart,
        toggleSidebar,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to use the global context
const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export { GlobalContext, AppProvider, useGlobalContext }; // Export AppProvider