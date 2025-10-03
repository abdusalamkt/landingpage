"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import styles from "./Page.module.css";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const WORDPRESS_API_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT as string;
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

// GraphQL query
const GET_WASHROOM_CUBICLES = `
  query GetWashroomCubicle {
    page(id: "vogue", idType: URI) {
      washroomCubiclesField {
        heroImage {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        heading
        subheading
        specification {
          spec
          value
        }
        keyFeatures {
          features
        }
        choicesToAddHeading
        description
        finishes {
          title
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        customizedPatternImages {
          patterns {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        patternTitle
        patternDescription
        smartCubicleHeading
        items {
          image {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
          title
          description
        }
        downloadButtonLabel
        downloadButtonUrl
      }
    }
  }
`;

// Server-side data fetching function
async function getWashroomCubiclesData(): Promise<WashroomCubiclesField | null> {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_WASHROOM_CUBICLES }),
      cache: 'force-cache', // Use Next.js cache instead of revalidate
    });

    const json = await res.json();
    return json?.data?.page?.washroomCubiclesField || null;
  } catch (error) {
    console.error('Error fetching washroom cubicles data:', error);
    return null;
  }
}

// 3D Model component with improved loading and error handling
function WashroomCubicleModel({ objPath = "/models/model.obj", mtlPath = "/models/model.mtl" }) {
  const groupRef = useRef<THREE.Group>(null);
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [hasRotated, setHasRotated] = useState(false);

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
              // Create a default material creator if MTL fails
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
          objLoader.load(
            objPath,
            resolve,
            undefined,
            reject
          );
        });

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(loadedObj);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Auto scale to fit roughly in [-1,1] cube
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim; // Increased scale for zoomed-in effect

        loadedObj.scale.setScalar(scale);

        // Auto center
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

// Client component for interactive features
function VogueClientFeatures({ acfData }: { acfData: WashroomCubiclesField }) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const preventScroll = (e: React.WheelEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Ensure the zoom circle stays within bounds
    const zoomRadius = 75; // Half of zoom circle size
    const boundedX = Math.max(zoomRadius, Math.min(x, rect.width - zoomRadius));
    const boundedY = Math.max(zoomRadius, Math.min(y, rect.height - zoomRadius));
    
    setHoverPosition({ x: boundedX, y: boundedY });
  };

  const currentImage = acfData.customizedPatternImages?.[currentImageIndex];

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
          <h2 className={styles.title}>{acfData.heading || "VOGUE"}</h2>
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
              minDistance={1.5} // Closer zoom
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
          <h2>{acfData.choicesToAddHeading || "CHOICES TO ADD"}</h2>
          <p className={styles.choicesDescription}>
            {acfData.description || "Explore our wide range of premium finishes and customization options to create washroom cubicles that perfectly match your design vision and functional requirements."}
          </p>
        </div>
      </section>

      {/* Finishes Section */}
      <section className={styles.customizationOption}>
        <div className={styles.customizationHeader}>
          <h2>CHOOSE FROM OUR DIFFERENT FINISHES</h2>
        </div>
        <p className={styles.customDescription}>CUSTOM FINISHES AVAILABLE UPON REQUEST</p>
        <div className={styles.finishes}>
          {acfData.finishes && acfData.finishes.map((finish, index) => (
            <div key={index} className={styles.finishCard}>
              <p>{finish.title}</p>
              <div className={styles.finishImageContainer}>
                {finish.image && (
                  <Image 
                    src={finish.image.sourceUrl} 
                    alt={finish.image.altText || finish.title} 
                    width={finish.image.mediaDetails?.width || 200} 
                    height={finish.image.mediaDetails?.height || 350}
                    className={styles.finishImage}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customized Pattern Section */}
      {acfData.customizedPatternImages && acfData.customizedPatternImages.length > 0 && (
        <section className={styles.customPatternSection}>
          <div className={styles.customizationHeader}>
            <h2>CUSTOMIZED PATTERN</h2>
          </div>
          <p className={styles.customPatternDescription}>PATTERN CAN BE CUSTOMIZED UPON REQUEST</p>
          <div className={styles.customPatternContainer}>
            <div className={styles.sliderContainer}>
              <div 
                className={styles.customPatternImageWrapper}
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {currentImage && (
                  <>
                    <Image
                      src={currentImage.patterns.sourceUrl}
                      alt={currentImage.patterns.altText || "Pattern"}
                      className={styles.customPatternImage}
                      width={currentImage.patterns.mediaDetails?.width || 500}
                      height={currentImage.patterns.mediaDetails?.height || 400}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isHovering && (
                      <div 
                        className={styles.zoomCircle}
                        style={{
                          left: `${hoverPosition.x}px`,
                          top: `${hoverPosition.y}px`,
                          backgroundImage: `url(${currentImage.patterns.sourceUrl})`,
                          backgroundSize: `${500 * 2}px ${400 * 2}px`, // Fixed zoom scale
                          backgroundPositionX: `-${hoverPosition.x * 2 - 75}px`, // 75 is half of zoom circle size
                          backgroundPositionY: `-${hoverPosition.y * 2 - 75}px`,
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              <div className={styles.sliderControls}>
                <div className={styles.sliderDots}>
                  {acfData.customizedPatternImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${currentImageIndex === index ? styles.activeDot : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to pattern ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.customPatternText}>
              <h3>{acfData.patternTitle || "CUSTOM PATTERN"}</h3>
              <p>{acfData.patternDescription || "Each door leaf is a work of art. We offer a wide range of customization options."}</p>
            </div>
          </div>
        </section>
      )}

      {/* Smart Cubicle Section */}
      <section className={styles.customizationOption}>
        <div className={styles.customizationHeader}>
          <h2>{acfData.smartCubicleHeading || "SMART CUBICLE"}</h2>
        </div>
        <p className={styles.customDescription}>LEVEL UP YOUR CUBICLE WITH OUR SMART OPTIONS</p>
        <div className={styles.designOptions}>
          {acfData.items && acfData.items.map((item, index) => (
            <div key={index} className={styles.designOption}>
              <div className={styles.designOptionIcon}>
                {item.image && (
                  <Image 
                    src={item.image.sourceUrl} 
                    alt={item.image.altText || item.title} 
                    width={item.image.mediaDetails?.width || 300} 
                    height={item.image.mediaDetails?.height || 300} 
                  />
                )}
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        {acfData.downloadButtonLabel && acfData.downloadButtonUrl && (
          <div className="cta-button" style={{ width: "25%", margin: "0 auto", marginTop: "50px", padding: "5px" }}>
            <a href={acfData.downloadButtonUrl} target="_blank" rel="noopener noreferrer">
              {acfData.downloadButtonLabel}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

// Main component
export default function VoguePage() {
  const [acfData, setAcfData] = useState<WashroomCubiclesField | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getWashroomCubiclesData();
    setAcfData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div style={{ minHeight: '100vh' }} />;

  return (
    <>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        <button
          onClick={fetchData}
          style={{
            padding: '6px 12px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
      {acfData ? <VogueClientFeatures acfData={acfData} /> : <div>Failed to load content.</div>}
    </>
  );
}