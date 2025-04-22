import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  return (
    <SearchResultsWrapper>
      <h1>Search Results for "{query}"</h1>
      {/* Display search results here */}
    </SearchResultsWrapper>
  );
};

const SearchResultsWrapper = styled.div`
  padding: 2rem;

  h1 {
    font-size: 2rem;
    color: hsl(var(--black));
    margin-bottom: 1rem;
  }
`;

export default SearchResults;