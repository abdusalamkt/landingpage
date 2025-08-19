"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import styles from "./NaturellePage.module.css";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://test.shopgfiuae.com/graphql';

// Types for ACF data structure
interface MediaDetails { width: number; height: number; }
interface ImageField { sourceUrl: string; altText: string; mediaDetails: MediaDetails; }
interface Specification { spec: string; value: string; }
interface KeyFeature { features: string; }
interface Finish { title: string; image: ImageField; }
interface CustomizedPatternImage { patterns: ImageField; }
interface SmartCubicleItem { image: ImageField; title: string; description: string; }

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
    page(id: "naturelle", idType: URI) {
      washroomCubiclesField {
        heroImage { sourceUrl altText mediaDetails { width height } }
        heading
        subheading
        specification { spec value }
        keyFeatures { features }
        choicesToAddHeading
        description
        finishes {
          title
          image { sourceUrl altText mediaDetails { width height } }
        }
        customizedPatternImages { patterns { sourceUrl altText mediaDetails { width height } } }
        patternTitle
        patternDescription
        smartCubicleHeading
        items { image { sourceUrl altText mediaDetails { width height } } title description }
        downloadButtonLabel
        downloadButtonUrl
      }
    }
  }
`;

// Fetch ACF data
async function getWashroomCubiclesData(): Promise<WashroomCubiclesField | null> {
  try {
    const res = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_WASHROOM_CUBICLES }),
      cache: 'force-cache',
    });
    const json = await res.json();
    return json?.data?.page?.washroomCubiclesField || null;
  } catch (error) {
    console.error('Error fetching washroom cubicles data:', error);
    return null;
  }
}

// 3D Model component using GLB
function WashroomCubicleModel({ glbPath = "/Cubicle.glb" }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(glbPath) as { scene: THREE.Group };

  useEffect(() => {
    if (!scene) return;
    // Center & scale model
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  return <primitive ref={groupRef} object={scene} />;
}

// Client component
function NaturelleClientFeatures({ acfData }: { acfData: WashroomCubiclesField }) {
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
    const zoomRadius = 75;
    const boundedX = Math.max(zoomRadius, Math.min(x, rect.width - zoomRadius));
    const boundedY = Math.max(zoomRadius, Math.min(y, rect.height - zoomRadius));
    setHoverPosition({ x: boundedX, y: boundedY });
  };

  const currentImage = acfData.customizedPatternImages?.[currentImageIndex];

  return (
    <div className={styles.pageWrapper}>
      {/* Top Section */}
      <div className={styles.topSection}>
        {acfData.heroImage && (
          <div className={styles.imageWrapper}>
            <Image
              src={acfData.heroImage.sourceUrl}
              alt={acfData.heroImage.altText || "Washroom Cubicles"}
              width={acfData.heroImage.mediaDetails?.width || 1200}
              height={acfData.heroImage.mediaDetails?.height || 1200}
              className={styles.image}
              priority
            />
          </div>
        )}

        <div className={styles.specsWrapper}>
          <h2 className={styles.title}>{acfData.heading || "NATURELLE"}</h2>
          <p className={styles.subtitle}>{acfData.subheading || "SPECIFICATIONS"}</p>
          <table className={styles.specsTable}>
            <tbody>
              {acfData.specification?.map((spec, i) => (
                <tr key={i}>
                  <td>{spec.spec.trim()}</td>
                  <td style={{ textAlign: 'end' }}>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features + 3D Model */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresLeft}>
          <h3>KEY FEATURES</h3>
          <ul className={styles.featureList}>
            {acfData.keyFeatures?.map((feature, i) => (
              <li key={i} className={styles.featureItem}>
                <span>{feature.features.trim()}</span>
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
          style={{ width: "100%", height: "500px" }}
        >
          <Canvas camera={{ position: [3, 3, 6], fov: 40 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#cccccc" /></mesh>}>
              <WashroomCubicleModel glbPath="/Cubicle.glb" />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls enablePan enableZoom enableRotate target={[0, 0, 0]} maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={10} />
          </Canvas>
        </div>
      </div>

      {/* Choices */}
      <section className={styles.choicesSection}>
        <h2>{acfData.choicesToAddHeading || "CHOICES TO ADD"}</h2>
        <p>{acfData.description}</p>
      </section>

      {/* Finishes */}
      <section className={styles.customizationOption}>
        <h2>CHOOSE FROM OUR DIFFERENT FINISHES</h2>
        <p>CUSTOM FINISHES AVAILABLE UPON REQUEST</p>
        <div className={styles.finishes}>
          {acfData.finishes?.map((finish, i) => (
            <div key={i} className={styles.finishCard}>
              <p>{finish.title}</p>
              {finish.image && <Image src={finish.image.sourceUrl} alt={finish.image.altText || finish.title} width={finish.image.mediaDetails?.width || 200} height={finish.image.mediaDetails?.height || 350} />}
            </div>
          ))}
        </div>
      </section>

      {/* Customized Patterns */}
      {acfData.customizedPatternImages?.length > 0 && (
        <section className={styles.customPatternSection}>
          <h2>{acfData.patternTitle || "CUSTOMIZED PATTERN"}</h2>
          <p>{acfData.patternDescription}</p>
          <div ref={imageRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            {currentImage && (
              <>
                <Image src={currentImage.patterns.sourceUrl} alt={currentImage.patterns.altText || "Pattern"} width={500} height={400} />
                {isHovering && (
                  <div style={{
                    position: "absolute",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    border: "2px solid #000",
                    left: hoverPosition.x - 75,
                    top: hoverPosition.y - 75,
                    backgroundImage: `url(${currentImage.patterns.sourceUrl})`,
                    backgroundSize: `1000px 800px`,
                    pointerEvents: "none"
                  }} />
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Smart Cubicles */}
      <section className={styles.customizationOption}>
        <h2>{acfData.smartCubicleHeading || "SMART CUBICLE"}</h2>
        <div className={styles.designOptions}>
          {acfData.items?.map((item, i) => (
            <div key={i} className={styles.designOption}>
              {item.image && <Image src={item.image.sourceUrl} alt={item.image.altText || item.title} width={300} height={300} />}
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        {acfData.downloadButtonLabel && acfData.downloadButtonUrl && (
          <div style={{ width: "25%", margin: "50px auto" }}>
            <a href={acfData.downloadButtonUrl} target="_blank" rel="noopener noreferrer">{acfData.downloadButtonLabel}</a>
          </div>
        )}
      </section>
    </div>
  );
}

// Main page
export default function NaturellePage() {
  const [acfData, setAcfData] = useState<WashroomCubiclesField | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    (async () => {
      const data = await getWashroomCubiclesData();
      setAcfData(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', display:'flex', justifyContent:'center', alignItems:'center' }}>Loading...</div>;

  return (
    <>
      {acfData ? <NaturelleClientFeatures acfData={acfData} /> : <div>Failed to load content.</div>}
    </>
  );
}
