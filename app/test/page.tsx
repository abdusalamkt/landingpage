'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function PanoramaPage() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('panorama-container')?.appendChild(renderer.domElement);

    // Sphere geometry with inverted scale
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // invert the sphere
    const texture = new THREE.TextureLoader().load('/360.jpg'); // <-- replace with your image
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.set(0, 0, 0.1); // small offset to avoid z-fighting

    // OrbitControls for rotation & zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // smooth movement
    controls.enableZoom = true; // enable zoom
    controls.zoomSpeed = 1.0;
    controls.enablePan = false; // disable panning
    controls.rotateSpeed = 0.3; // rotation speed
    controls.minPolarAngle = 0; // look straight up
    controls.maxPolarAngle = Math.PI; // look straight down

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // required for damping
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div
      id="panorama-container"
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}
    />
  );
}
