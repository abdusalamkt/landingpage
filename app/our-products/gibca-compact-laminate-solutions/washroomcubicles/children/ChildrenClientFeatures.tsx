"use client";

import React, { Suspense, useRef, useState } from "react";
import styles from "./Page.module.css";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import { useEffect } from "react";

// Types
interface MediaDetails {
  width: number;
  height: number;
}

interface ImageField {
  sourceUrl: string;
  altText: string;
  mediaDetails: MediaDetails;
}

interface Specification {
  spec: string;
  value: string;
}

interface KeyFeature {
  features: string;
}

interface Finish {
  title: string;
  image: ImageField;
}

interface CustomizedPatternImage {
  patterns: ImageField;
}

interface SmartCubicleItem {
  image: ImageField;
  title: string;
  description: string;
}

interface WashroomCubiclesField {
  heroImage: ImageField;
  heading: string;
  subheading: string;
  specification: Specification[];
  keyFeatures: KeyFeature[];
  choicesToAddHeading: string;
  description: string;
  finishes: Finish[];
  customizedPatternImages: CustomizedPatternImage[];
  patternTitle: string;
  patternDescription: string;
  smartCubicleHeading: string;
  items: SmartCubicleItem[];
  downloadButtonLabel: string;
  downloadButtonUrl: string;
}

// 3D Model component
function WashroomCubicleModel({ objPath = "/models/model.obj", mtlPath = "/models/model.mtl" }) {
  const groupRef = useRef<THREE.Group>(null);
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoadingError(null);
        
        // Load materials first
        const mtlLoader = new MTLLoader();
        const materials = await new Promise<MTLLoader.MaterialCreator>((resolve, reject) => {
          mtlLoader.load(
            mtlPath,
            resolve,
            undefined,
            (error) => {
              console.warn("MTL loading failed, proceeding without materials:", error);
              const defaultMaterials = new MTLLoader.MaterialCreator("");
              resolve(defaultMaterials);
            }
          );
        });

        materials.preload();

        // Load OBJ with materials
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        
        const loadedObj = await new Promise<THREE.Group>((resolve, reject) => {
          objLoader.load(objPath, resolve, undefined, reject);
        });

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(loadedObj);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Auto scale to fit
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;

        loadedObj.scale.setScalar(scale);
        loadedObj.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        setObj(loadedObj);
      } catch (error) {
        console.error("Error loading 3D model:", error);
        setLoadingError("Failed to load 3D model");
      }
    };

    loadModel();
  }, [objPath, mtlPath]);

  if (loadingError) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    );
  }

  return obj ? <primitive ref={groupRef} object={obj} /> : null;
}

// Client component
export default function ChildrenClientFeatures({ acfData }: { acfData: WashroomCubiclesField }) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const preventScroll = (e: React.WheelEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Section */}
      <div className={styles.topSection}>
        <div className={styles.imageWrapper}>
          {acfData.heroImage && (
            <Image
              src={acfData.heroImage.sourceUrl}
              alt={acfData.heroImage.altText || "Washroom Cubicles"}
              className={styles.image}
              width={acfData.heroImage.mediaDetails?.width || 1200}
              height={acfData.heroImage.mediaDetails?.height || 1200}
              priority
              quality={100}
            />
          )}
        </div>

        <div className={styles.specsWrapper}>
          <h2 className={styles.title}>{acfData.heading || "CHILDREN"}</h2>
          <p className={styles.subtitle}>{acfData.subheading || "SPECIFICATIONS"}</p>

          <table className={styles.specsTable}>
            <tbody>
              {acfData.specification && acfData.specification.map((spec, index) => (
                <tr key={index} className={styles.specRow}>
                  <td>{spec.spec.trim()}</td>
                  <td style={{textAlign:'end'}}>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Features + 3D Model */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresLeft}>
          <h3 className={styles.featuresTitle}>KEY FEATURES</h3>
          <ul className={styles.featureList}>
            {acfData.keyFeatures && acfData.keyFeatures.map((feature, index) => (
              <li 
                key={index}
                className={styles.featureItem}
                style={{ '--i': index } as React.CSSProperties}
              >
                <div className={styles.featureContent}>
                  <div className={styles.featureIcon}>
                    <svg viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                  <span>{feature.features.trim()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={styles.featuresRight}
          ref={canvasContainerRef}
          onWheel={preventScroll}
          onTouchMove={preventScroll}
          tabIndex={0}
        >
          <Canvas camera={{ position: [1.5, 1.5, 3], fov: 50 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[50, 0, 50]} intensity={1} />
            <directionalLight position={[-5, -5, -5]} intensity={0.3} />
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#cccccc" />
              </mesh>
            }>
              <WashroomCubicleModel />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls 
              enablePan 
              enableZoom 
              enableRotate 
              target={[0, 0, 0]}
              maxPolarAngle={Math.PI / 2}
              minDistance={1.5}
              maxDistance={6}
            />
          </Canvas>
          
          {/* 360 Degree Indicator */}
          <div className={styles.rotationIndicator}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="#333"/>
            </svg>
            <span>360°</span>
          </div>
        </div>
      </div>

      {/* Choices Header Section */}
      <section className={styles.choicesSection}>
        <div className={styles.choicesHeader}>
          <h2>Endless Customization Options</h2>
          <p className={styles.choicesDescription}>
            From design to functionality — we offer a wide range of custom solutions tailored to your needs. Get in touch with our team to discuss your perfect fit.
          </p>
          <a href="/contact-us" className={styles.contactButton}>
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
}