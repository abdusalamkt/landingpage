'use client';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import './Products.css';

export type ProductImage = {
  sourceUrl: string;
  altText: string;
};

export type Product = {
  title: string;
  image: ProductImage;
  link: string;
};

type ProductsProps = {
  description?: string;
  products: Product[];
};

export default function Products({ description, products = [] }: ProductsProps) {
  const ref = useRef(null);

  const cardVariants = {
    offscreen: {
      y: 300,
      rotateX: -90,
      scale: 0.5,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 1.2,
      },
    },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.section
      className="products-section"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={container}
      ref={ref}
    >
      <motion.h1
        className="products-heading"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        OUR<span className="Highlight_Header"> PRODUCTS</span>
      </motion.h1>

      {description && (
        <motion.div
          className="products-description"
          dangerouslySetInnerHTML={{ __html: description }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      )}

      <motion.div className="products-grid">
        {products.map((product, i) => {
          const [pos, setPos] = useState({ x: 50, y: 50 });
          const [hovered, setHovered] = useState(false);

          const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 50;
            const y = ((e.clientY - rect.top) / rect.height) * 50;
            setPos({ x, y });
          };

          return (
            <motion.div
              key={i}
              className="product-card"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.1 }}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="product-image-container">
                <motion.img
                  src={product.image.sourceUrl}
                  alt={product.image.altText}
                  className="product-image grayscale"
                  style={{
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                    transform: hovered ? `scale(1.05)` : `scale(1)`,
                    transition: 'transform 0.4s ease-out, filter 1.5s ease',
                    filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)',
                  }}
                />
                <div className="product-overlay">
                  <div className="product-title-container">
                    <h3 className="product-title">{product.title}</h3>
                  </div>
                  {/* <motion.span
                    className="product-arrow"
                    whileHover={{ scale: 1.1, color: '#109C5D' }}
                    transition={{ duration: 0.3 }}
                    onClick={() => window.location.href = product.link}
                  >
                    →
                  </motion.span> */}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
