'use client';
import React from 'react';
import './WhatSetsUsApart.css';

interface Feature {
  featureTitle: string;
  featureContent: string;
}

type BrandColor = 'red' | 'brown' | 'green' | 'blue';

interface WhatSetsUsApartProps {
  features?: Feature[];
  brand?: BrandColor;
  description?: string;
}

const WhatSetsUsApart = ({ features = [], brand = 'red', description }: WhatSetsUsApartProps) => {
  // Color mapping for different brands
  const colorMap = {
    red: {
      primary: '#D72027',
      secondary: '#8e1217',
      gradient: 'linear-gradient(269.42deg, #d72027 0.16%, #8e1217 99.84%)'
    },
    brown: {
      primary: '#77471C',
      secondary: '#5a3a22',
      gradient: 'linear-gradient(269.42deg, #6C421D 0.16%, #7C5F45 99.84%)'
    },
    green: {
      primary: '#2e8b57',
      secondary: '#1f5c3a',
      gradient: 'linear-gradient(269.42deg, #2e8b57 0.16%, #1f5c3a 99.84%)'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#0066cc',
      gradient: 'linear-gradient(269.42deg, #1e90ff 0.16%, #0066cc 99.84%)'
    }
  };

  const colors = colorMap[brand];

  // Hardcoded fallback description
  const defaultDescription =
    "Experience unmatched quality and innovation with our advanced operable wall solutions. Our commitment to excellence ensures superior performance in every installation.";

  // Use features from props, or fallback to default features if none provided
  const displayFeatures =
    features.length > 0
      ? features
      : [
          {
            featureTitle: "ACOUSTIC PERFORMANCE",
            featureContent:
              "Deep nesting, interlocking edges, and integrated seals deliver superior acoustic performance up to 56 STC (ASTM E-90)."
          },
          {
            featureTitle: "FINISHES AND COLORS",
            featureContent:
              "Standard trim colors include lamb wool, brown, and gray, with custom metal trim colors available."
          },
          {
            featureTitle: "QUICK-SET FEATURES",
            featureContent: "Mechanical bottom seals for reliable and fast field operation."
          },
          {
            featureTitle: "ADDITIONAL OPTIONS & WARRANTY",
            featureContent:
              "Deep tongue-and-groove design with dual vinyl gaskets ensures stable interlock, precise alignment, and superior sound sealing."
          }
        ];

  return (
    <section className="apart-section">
      <div className="apart-left">
        <div className="apart-bg-number">?</div>
        <h2 className="apart-heading">
          WHAT SETS US{" "}
          <span className="apart-highlight" style={{ color: colors.primary }}>
            APART?
          </span>
        </h2>
        <p className="apart-desc">{description || defaultDescription}</p>
      </div>

      <div className="apart-right">
        <h3 className="features-title" style={{ background: colors.gradient }}>
          <span className="features-bar" style={{ backgroundColor: colors.primary }} />
          KEY FEATURES
        </h3>
        <div className="features-grid">
          {displayFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <h4 style={{ color: colors.primary }}>{feature.featureTitle}</h4>

              {/* ✅ If brand is Acristalia (blue), render as HTML, else plain text */}
              {brand === "blue" ? (
                <div
                  className="wysiwyg"
                  dangerouslySetInnerHTML={{ __html: feature.featureContent }}
                />
              ) : (
                <p>{feature.featureContent}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatSetsUsApart;
