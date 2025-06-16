import React from "react";
import "./GetInTouchSection.css";

const GetInTouchSection = () => {
  return (
    <section className="get-in-touch-section">
      <div className="overlay" />
      <div className="content-wrapper">
        <div className="left-title">
          <h2> <span className="highlight">CAN’T FIND</span>  WHAT <br></br>
YOU’RE LOOKING FOR?</h2>
        </div>
        <div className="right-form">
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="email-input"
            />
            <button type="submit" className="cta-button">
              Get in Touch
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
