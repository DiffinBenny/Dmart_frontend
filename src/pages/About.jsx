// import React from "react";
// import styled from "styled-components";

// const About = () => {
//   return (
//     <AboutWrapper>
//       <h2>About Us</h2>
//       <h3>A New Way For Working For Many Of Professionals.</h3>
//       <p>
//         Lorem Ipsum is simply dummy text of the printing and typesetting
//         industry. Lorem Ipsum has been the industry’s standard dummy text ever
//         since the 1500s, when an unknown printer took a galley of type and
//         scrambled it to make a type specimen book.
//       </p>
//       <p>
//         It has survived not only five centuries, but also the leap into
//         electronic typesetting, remaining essentially unchanged. It was
//         popularized in the 1960s with the release of Letraset sheets containing
//         Lorem Ipsum passages, and more recently with desktop publishing software
//         like Aldus PageMaker including versions of Lorem Ipsum.
//       </p>
//     </AboutWrapper>
//   );
// };

// const AboutWrapper = styled.section`
//   padding: 4rem 2rem;
//   background-color: hsl(var(--light-grayish-blue));
//   border-radius: 1rem;
//   text-align: center;

//   h2 {
//     font-size: 2rem;
//     color: hsl(var(--black));
//     margin-bottom: 1rem;
//   }

//   h3 {
//     font-size: 1.5rem;
//     color: hsl(var(--dark-grayish-blue));
//     margin-bottom: 1.5rem;
//   }

//   p {
//     font-size: 1rem;
//     color: hsl(var(--dark-grayish-blue));
//     line-height: 1.6;
//     margin-bottom: 1rem;
//     text-align: left;
//   }
// `;

// export default About;
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import mul9Image from "../assets/mul9.jpg"; // Import the image from src/assets

const About = () => {
  return (
    <AboutWrapper>
      {/* Navigation Bar */}
      {/* <NavBar>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </NavBar> */}

      {/* About Us Content */}
      <AboutContent>
        <AboutImage src={mul9Image} alt="About Us" />
        <AboutText>
          <AboutHeading>About Us</AboutHeading>
          <AboutDescription>
          Your Trusted Multi-Vendor Marketplace!
          Welcome to D-mart, a next-generation multi-vendor e-commerce platform that connects vendors with customers for a seamless shopping experience. Our platform enables businesses to list, manage, and sell their products effortlessly while providing customers with a diverse selection, secure payments, and real-time order tracking. With a user-friendly interface, vendor management tools, and trusted payment gateways, we ensure a smooth and secure online shopping journey. Join us today and explore a smarter way to shop and sell online!
          </AboutDescription>
        </AboutText>
      </AboutContent>

      {/* Four Horizontal Boxes */}
      <BoxContainer>
        <Box>
          <BoxIcon>🌟</BoxIcon>
          <BoxTitle>Who We Are</BoxTitle>
          <BoxText>
            Welcome to <Highlight>D-Mart</Highlight>, a cutting-edge multi-vendor
            e-commerce platform designed to bring together vendors and customers
            for a seamless online shopping experience. Our platform empowers
            businesses of all sizes to showcase their products while providing
            customers with an extensive selection of quality items—all in one
            place.
          </BoxText>
        </Box>

        <Box>
          <BoxIcon>🚀</BoxIcon>
          <BoxTitle>Our Mission</BoxTitle>
          <BoxText>
            Our mission is to create a dynamic and inclusive marketplace where
            vendors can thrive and customers can discover a wide range of
            products. We aim to simplify online shopping by offering a
            user-friendly platform that connects buyers and sellers seamlessly.
          </BoxText>
        </Box>

        <Box>
          <BoxIcon>🛍️</BoxIcon>
          <BoxTitle>What We Offer</BoxTitle>
          <BoxText>
            At <Highlight>D-Mart</Highlight>, we offer a diverse range of
            products from multiple vendors, ensuring that customers have access
            to the best selection. From electronics to fashion, home goods to
            groceries, we provide a one-stop solution for all your shopping
            needs.
          </BoxText>
        </Box>

        <Box>
          <BoxIcon>🏆</BoxIcon>
          <BoxTitle>Why Choose Us?</BoxTitle>
          <BoxText>
            We stand out because of our commitment to quality, customer
            satisfaction, and vendor empowerment. With secure transactions,
            reliable delivery, and exceptional customer support,{" "}
            <Highlight>D-Mart</Highlight> is your trusted partner in online
            shopping.
          </BoxText>
        </Box>
      </BoxContainer>
    </AboutWrapper>
  );
};

// Styled Components
const AboutWrapper = styled.div`
  padding: 2rem;
  font-family: "Kumbh Sans", sans-serif;
  background-color: hsl(var(--white));
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  background-color: hsl(var(--light-grayish-blue));
  border-bottom: 1px solid hsl(var(--divider));
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 1.2rem;
  color: hsl(var(--dark-grayish-blue));
  transition: color 0.3s ease;

  &:hover {
    color: hsl(var(--orange));
  }
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4rem;
  margin: 4rem auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  max-width: 400px; // Increased image size
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AboutText = styled.div`
  flex: 1;
`;

const AboutHeading = styled.h1`
  font-size: 2.5rem; // Increased heading size
  color: hsl(var(--black));
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const AboutDescription = styled.p`
  font-size: 2.2rem; // Increased text size
  color: hsl(var(--dark-grayish-blue));
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const Highlight = styled.span`
  color: hsl(var(--orange));
  font-weight: 700;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin: 4rem auto;
  max-width: 1200px;
`;

const Box = styled.div`
  background-color: hsl(var(--white));
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 280px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const BoxIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const BoxTitle = styled.h2`
  font-size: 1.5rem;
  color: hsl(var(--black));
  margin-bottom: 1rem;
  font-weight: 700;
`;

const BoxText = styled.p`
  font-size: 1rem;
  color: hsl(var(--dark-grayish-blue));
  line-height: 1.6;
`;

export default About;