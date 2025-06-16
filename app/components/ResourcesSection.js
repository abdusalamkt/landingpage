// components/ResourcesSection.js
import React from 'react';
import './ResourcesSection.css';

const ResourcesSection = () => {
  return (
    <div className="resources-wrapper">
      <h2 className="resources-heading">RESOURCES</h2>
      <p className="resources-description">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
      </p>

      <div className="resources-section">
        <div className="resource-item">Case Study</div>
        <div className="divider" />
        <div className="resource-item">Downloads</div>
        <div className="divider" />
        <div className="resource-item">Blogs</div>
        <div className="divider" />
      </div>
    </div>
  );
};

export default ResourcesSection;
