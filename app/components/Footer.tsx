import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Contact Form Section */}
      <div className="contact-form-section">
        <div className="contact-form-container">
          <h2 className="form-title">
            BUILD <span className="highlight">WITH A DIFFERENCE.</span>
          </h2>
          <p className="form-description">
            We're excited to hear about your project and explore how we can work together.<br />
            Let's start a conversation and turn your vision into reality.
          </p>
          <form className="form">
            <div className="form-row">
              <input type="text" placeholder="First Name" className="form-input" />
              <input type="text" placeholder="Last Name" className="form-input" />
              <input type="email" placeholder="Email" className="form-input" />
              <input type="tel" placeholder="Phone Number" className="form-input" />
            </div>
            <div className="form-row">
              <textarea placeholder="Write us a message" className="form-textarea"></textarea>
            </div>
            <button type="submit" className="form-submit-btn">SUBMIT</button>
          </form>
        </div>
        <div className="form-divider"></div>
      </div>

      {/* Footer Content */}
      <div className="footer-container">
        {/* Left Section - 60% */}
        <div className="footer-left">
          {/* Logo Section */}
          <div className="footer-logos">
            <div className="logo-item">
              <img src="/logowhite.png" alt="gibca-logo" className="logo-image" />
            </div>
            {/* <div className="logo-divider"></div> */}
            <div className="logo-item">
              <img src="/HUFCOR HIG RES.png" alt="hufcor-logo" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/crown-doors-logo 1 - WHITE.svg" alt="crown-logo" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/acristalialogo.png" alt="acristalia-logo" className="logo-image" style={{height:"50px"}}/>
            </div>
            
            {/* <div className="logo-divider"></div> */}
            {/* <div className="logo-item">
              <img src="/hufcor-logo.png" alt="HUFCOR" className="logo-image" />
            </div> */}
          </div>

          {/* Links Section */}
          <div className="footer-links">
            <div className="link-column">
              <h4>RESOURCES</h4>
              <ul>
                <li><a href="#">Case Studies</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Gallery</a></li>
                <li><a href="#">Downloads</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>COMPANY</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Downloads</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>SOCIALS</h4>
              <ul>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">YouTube</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h4>PRODUCTS</h4>
              <ul>
                {/* <li><a href="#">Office Partitions</a></li> */}
                <li><a href="/gibca-compact-laminate-solutions">Compact Laminate Solutions</a></li>
                <li><a href="#">Pivot Doors</a></li>
                <li><a href="#">Operable Walls</a></li>
                <li><a href="#">Glass Walls</a></li>
                <li><a href="#">Terrace Solutions</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="vertical-divider"></div>

        {/* Right Section - 40% */}
        <div className="footer-right">
          <div className="newsletter-section">
            <h2>HAVE A SPACE <span className="highlight">REVAMP</span></h2>
            <h2>IN MIND?</h2>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">SUBSCRIBE</button>
            </div>
            <div className="social-section">
              <h4>FOLLOW OUR SOCIALS!</h4>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <img src="/icon/facebook.png" alt="Facebook" className="social-icon-image" />
                </a>
                <a href="#" className="social-icon">
                  <img src="/icon/linkedin2.png" alt="Linkedin" className="social-icon-image" />
                </a>
                <a href="#" className="social-icon">
                  <img src="/icon/insta.png" alt="Instagram" className="social-icon-image" />
                </a>
                <a href="#" className="social-icon">
                  <img src="/icon/youtube.png" alt="YouTube" className="social-icon-image" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;