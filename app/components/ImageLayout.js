import React from 'react';
import './ImageLayout.css';

const Section = ({ 
  title, 
  description, 
  buttonLabel, 
  buttonLink, 
  mainImg, 
  topRightImg, 
  bottomLeftImg, 
  reverse 
}) => {
  const renderTitle = () => {
    if (!title) return null;

    const words = title.split(' ');
    const firstWord = words[0];
    const remainingWords = words.slice(1).join(' ');

    return (
      <h2 className="title">
        <span className="first-word">{firstWord}</span>
        {remainingWords && ` ${remainingWords}`}
      </h2>
    );
  };

  return (
    <div className={reverse ? "second-container" : "main-container"}>
      <div className="image-layout">
        <div className={reverse ? "second-border" : "main-border"}>
          <div className="border-gap top-right-gap"></div>
          <div className="border-gap bottom-left-gap"></div>
        </div>

        <div className={`image ${reverse ? "second-image" : "main-image"}`}>
          <img src={mainImg} alt="Main Image" />
        </div>

        <div className="image top-right-image">
          <img src={topRightImg} alt="Top Right Image" />
        </div>

        <div className="image bottom-left-image">
          <img src={bottomLeftImg} alt="Bottom Left Image" />
        </div>
      </div>

      <div className="content-side">
        {renderTitle()}
        <p className="description">{description}</p>
        {buttonLink && buttonLabel && (
          <a href={buttonLink} className="cta-button">{buttonLabel}</a>
        )}
      </div>
    </div>
  );
};

const ImageLayout = ({ data }) => {
  const fields = data?.page?.landingPageFields || {};

  const commonBgImage = fields.section1Bg?.sourceUrl;

  return (
    <div
  className="shared-bg-wrapper"
  style={{
    backgroundImage: commonBgImage ? `url(${commonBgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="content-wrapper">
    <Section
      title={fields.section1Title}
      description={fields.section1Description}
      buttonLabel={fields.section1ButtonLabel}
      buttonLink={fields.section1ButtonLink}
      mainImg={fields.section1ImageMain?.sourceUrl}
      topRightImg={fields.section1ImageTopRight?.sourceUrl}
      bottomLeftImg={fields.section1ImageBottomLeft?.sourceUrl}
      reverse={false}
    />
    <Section
      title={fields.section2Title}
      description={fields.section2Description}
      buttonLabel={fields.section2ButtonLabel}
      buttonLink={fields.section2ButtonLink}
      mainImg={fields.section2ImageMain?.sourceUrl}
      topRightImg={fields.section2ImageTopRight?.sourceUrl}
      bottomLeftImg={fields.section2ImageBottomLeft?.sourceUrl}
      reverse={true}
    />
  </div>
</div>

  );
};

export default ImageLayout;
