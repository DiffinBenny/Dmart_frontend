import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Banner = styled.div`
  background-color: #2d3748;
  color: white;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    img {
      width: 4rem;
      height: auto;
      margin-right: 0.5rem;
    }
    span {
      color: #4299e1;
    }
  }
`;

const TopDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  p {
    color: #cbd5e0;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
  input {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid #cbd5e0;
  }
  button {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #4299e1;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

const Navbar = styled.nav`
  margin-top: 1.5rem;
  ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
    li a {
      color: white;
      text-decoration: none;
      &:hover {
        color: #4299e1;
      }
    }
  }
`;

const ContactSection = styled.section`
  padding: 4rem 0;
  background-color: #f7fafc;
`;

const ContactTop = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  h2 {
    font-size: 2rem;
    font-weight: 600;
  }
  .breadcrumb {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    a {
      color: #4299e1;
    }
  }
`;

const ContactBottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 600px;
  iframe {
    width: 100%;
    height: 16rem;
    border: none;
  }
`;

const ContactText = styled.div`
  width: 100%;
  max-width: 600px;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  input,
  textarea {
    padding: 0.5rem;
    border: 2px solid #cbd5e0;
    border-radius: 0.5rem;
    width: 100%;
  }
  button {
    padding: 0.75rem;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
`;

const Footer = styled.footer`
  background-color: #2d3748;
  color: white;
  padding: 2rem 0;
`;

const FooterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  width: 100%;
  max-width: 300px;
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li a {
      color: white;
      text-decoration: none;
      &:hover {
        color: #ecc94b;
      }
    }
  }
`;

const SocialIcons = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  a {
    color: #4299e1;
    text-decoration: none;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  color: #cbd5e0;
  margin-top: 2rem;
  a {
    color: #4299e1;
    text-decoration: none;
  }
`;

const Contact = () => {
  return (
    <div>
      {/* Contact Section */}
      <ContactSection>
        <Container>
          <ContactTop>
            <h2>Contact</h2>
            <div className="breadcrumb">
              <li><a href="index.html">Home</a></li>
              <li>Contact</li>
            </div>
          </ContactTop>
          <ContactBottom>
            <MapContainer>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6632.248000703498!2d151.265683!3d-33.7832959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12abc7edcbeb07%3A0x5017d681632bfc0!2sManly+Vale+NSW+2093%2C+Australia!5e0!3m2!1sen!2sin!4v1433329298259"
                allowFullScreen
              ></iframe>
            </MapContainer>
            <ContactText>
              <div className="contact-right">
                <div className="address">
                  <h5>Address</h5>
                  <p>The company name, <span>Glasglow Dr 40 Fe 72</span></p>
                </div>
                <div className="address">
                  <h5>Contact Info</h5>
                  <p>
                    Tel: 1115550001 <span>Fax: 190-4509-494</span>
                    Email: <a href="mailto:contact@example.com">contact@example.com</a>
                  </p>
                </div>
              </div>
              <ContactForm>
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="text" placeholder="Phone" />
                <textarea placeholder="Message" />
                <button type="submit">Submit</button>
              </ContactForm>
            </ContactText>
          </ContactBottom>
        </Container>
      </ContactSection>

      {/* Footer Section */}
      <Footer>
        <Container>
          <FooterGrid>
            <FooterSection>
              <h3>About Us</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/About">About</Link></li>
                <li><Link to="/Services">Services</Link></li>
                <li><Link to="/Blog">Blog</Link></li>
                <li><Link to="/Gallery">Gallery</Link></li>
                <li><Link to="/Contact">Contact Us</Link></li>
              </ul>
            </FooterSection>
            <FooterSection>
              <h3>Latest Tweets</h3>
              <div>
                <p>It is a long established fact that a reader will be distracted by the content...</p>
                <a href="#">1 Hour ago</a>
              </div>
              <div>
                <p>It is a long established fact that a reader will be distracted by the content...</p>
                <a href="#">3 Hours ago</a>
              </div>
            </FooterSection>
            <FooterSection>
              <h3>Get in Touch</h3>
              <form>
                <input type="text" placeholder="Enter Email" />
                <input type="submit" value="Subscribe" />
              </form>
              <SocialIcons>
                <li><a href="#"><i className="facebook"></i></a></li>
                <li><a href="#"><i className="twitter"></i></a></li>
                <li><a href="#"><i className="dribble"></i></a></li>
                <li><a href="#"><i className="google"></i></a></li>
              </SocialIcons>
            </FooterSection>
          </FooterGrid>
          <FooterBottom>
            <p>&copy; 2015 Auto Cars. All rights reserved | Design by <a href="http://w3layouts.com">W3layouts</a></p>
          </FooterBottom>
        </Container>
      </Footer>
    </div>
  );
};

export default Contact;