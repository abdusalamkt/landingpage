'use client';

import { useEffect, useState } from 'react';

export default function ContactUsClient({ data }: { data: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data?.slideshowImages?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === data.slideshowImages.length - 1 ? 0 : prev + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [data]);

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 dangerouslySetInnerHTML={{ __html: data.heading }} />
        <div className="contact-subtitle">
          <span>{data.subtitle}</span>
          <hr />
        </div>
      </div>

      <div className="contact-content">
        <div
          className="contact-image slideshow"
          style={{ backgroundImage: `url(${data.slideshowImages[currentIndex]?.sourceUrl})` }}
        />
        <div className="contact-form">
          <h2>{data.formHeading}</h2>
          <form>
            <input type="text" placeholder="Name" required />
            <div className="input-row">
              <input type="email" placeholder="Email ID" required />
              <input type="tel" placeholder="Mobile No." required />
            </div>
            <input type="text" placeholder="Project Name & Location" />
            <select required>
              <option value="">Products of Interest</option>
              {data.products?.map((product: any, i: number) => (
                <option key={i} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>
            <textarea placeholder="Message" rows={3}></textarea>
            <button className="cta-button" type="submit">
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      <div className="contact-footer">
        <div className="footer-column">
          <h2>ADDRESS</h2>
          <div dangerouslySetInnerHTML={{ __html: data.address.replace(/<br\s*\/?>/g, '<br />') }} />
        </div>
        <div className="footer-column">
          <h2>PHONE</h2>
          <div dangerouslySetInnerHTML={{ __html: data.phone.replace(/<br\s*\/?>/g, '<br />') }} />
        </div>
        <div className="footer-column">
          <h2>EMAIL</h2>
          <p>
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </p>
        </div>
      </div>
    </div>
  );
}