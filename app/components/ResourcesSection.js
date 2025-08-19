'use client';

import React from 'react';
import Link from 'next/link';
import './ResourcesSection.css';

const ResourcesSection = () => {
  return (
    <div className="resources-wrapper">
      <h2 className="resources-heading">RESOURCES</h2>
      <p className="resources-description">
A lot happens at Gibca Furniture, and you would not want to miss out! Be up to date with the latest trends, our current projects and get your hands on the latest technical information on our products - all under the resources section!       </p>

      <div className="resources-section">
        <Link href="/case-study" className="resource-item">Case Study</Link>
        <div className="divider" />
        <Link href="/downloads" className="resource-item">Downloads</Link>
        <div className="divider" />
        <Link href="/blogs" className="resource-item">Blogs</Link>
        <div className="divider" />
      </div>
    </div>
  );
};

export default ResourcesSection;
