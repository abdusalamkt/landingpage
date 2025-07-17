'use client';

import React from 'react';
import Link from 'next/link';
import './ResourcesSection.css';

const ResourcesSection = () => {
  return (
    <div className="resources-wrapper">
      <h2 className="resources-heading">RESOURCES</h2>
      <p className="resources-description">
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
      </p>

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
