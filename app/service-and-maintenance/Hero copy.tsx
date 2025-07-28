// app/service-maintenance/Hero.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import './hero.css';

// Import local images
import tool1 from '@/public/wrench.png';
import tool2 from '@/public/screwdriver.png';
import tool3 from '@/public/gear.png';
import gear from '@/public/gear.png';

interface Tool {
  x: number;
  y: number;
  type: string;
  rotation: number;
  scale: number;
  speed: number;
  targetX: number;
  targetY: number;
  image: HTMLImageElement | null;
  draw: (ctx: CanvasRenderingContext2D, time: number) => void;
}

export default function Hero({ 
  title = "Professional", 
  highlight = "Maintenance Services", 
  description = "24/7 expert technical support and equipment maintenance solutions",
}: {
  title?: string;
  highlight?: string;
  description?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const toolImageRefs = useRef<HTMLImageElement[]>([]);
  const gearImageRef = useRef<HTMLImageElement | null>(null);
  const mouseFollowerRef = useRef<Tool | null>(null);

  // Load images when component mounts
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Local tool images
        const toolImages = [tool1, tool2, tool3];
        
        // Load tool images
        const toolPromises = toolImages.map((src, index) => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              toolImageRefs.current[index] = img;
              resolve();
            };
            img.onerror = reject;
            img.src = src.src;
          });
        });

        // Load gear image
        const gearPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            gearImageRef.current = img;
            resolve();
          };
          img.onerror = reject;
          img.src = gear.src;
        });

        await Promise.all([...toolPromises, gearPromise]);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full width/height of container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    // Tools data
    const tools: Tool[] = [];
    const sparks: Array<{
      x: number; y: number; size: number; life: number; color: string
    }> = [];

    // Create tools with images - modified for 5px size
    const createTool = (x: number, y: number, type: string): Tool => {
      const toolIndex = Math.floor(Math.random() * toolImageRefs.current.length);
      const img = toolImageRefs.current[toolIndex] || null;
      
      return {
        x, y,
        type,
        rotation: 0,
        scale: 0.04, // Fixed small size (~5px)
        speed: 0.3 + Math.random() * 0.5,
        targetX: x,
        targetY: y,
        image: img,
        draw(ctx: CanvasRenderingContext2D, time: number) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.scale(this.scale, this.scale);

          if (this.image) {
            ctx.drawImage(
              this.image, 
              -this.image.width / 2, 
              -this.image.height / 2,
              this.image.width,
              this.image.height
            );
          } else {
            ctx.fillStyle = '#109C5D';
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Enhanced spark effect - more particles
          if (Math.abs(this.rotation) > 0.1) {
            // Create more sparks when rotating
            for (let i = 0; i < 3; i++) { // Create 3 sparks per frame
              if (Math.random() > 0.3) { // 70% chance per spark
                sparks.push({
                  x: this.x + Math.cos(this.rotation) * 15,
                  y: this.y + Math.sin(this.rotation) * 15,
                  size: Math.random() * 2 + 1.5, // Larger sparks
                  life: 40, // Longer life
                  color: `hsl(${40 + Math.random() * 30}, 100%, ${60 + Math.random() * 30}%)`
                });
              }
            }
          }

          ctx.restore();
        }
      };
    };

    // Initialize tools
    const initTools = () => {
      const toolCount = 12; // More tools for better effect
      
      for (let i = 0; i < toolCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const type = `tool-${i % toolImageRefs.current.length}`;
        const tool = createTool(x, y, type);
        tools.push(tool);
        
        // Designate the first tool as the mouse follower
        if (i === 0) {
          mouseFollowerRef.current = tool;
        }
      }

      // Add gear
      const gearTool = {
        x: canvas.width * 0.8,
        y: canvas.height * 0.2,
        type: 'gear',
        rotation: 0,
        scale: 0.04,
        speed: 0.2,
        targetX: canvas.width * 0.8,
        targetY: canvas.height * 0.2,
        image: gearImageRef.current,
        draw(ctx, time) {
          ctx.save();
          ctx.translate(this.x, this.y);
          this.rotation += 0.01 * this.speed * 60;
          ctx.rotate(this.rotation);
          ctx.scale(this.scale, this.scale);
          
          if (this.image) {
            ctx.drawImage(
              this.image, 
              -this.image.width / 2, 
              -this.image.height / 2,
              this.image.width,
              this.image.height
            );
          }
          
          // Add extra sparks for gear
          if (Math.random() > 0.7) {
            sparks.push({
              x: this.x + (Math.random() - 0.5) * 20,
              y: this.y + (Math.random() - 0.5) * 20,
              size: Math.random() * 3 + 2,
              life: 50,
              color: `hsl(${50 + Math.random() * 20}, 100%, 70%)`
            });
          }
          
          ctx.restore();
        }
      };
      tools.push(gearTool);
    };

    // Animation loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      if (!ctx) return;

      // Clear canvas with semi-transparent for motion blur effect
      ctx.fillStyle = 'rgba(20, 25, 30, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      ctx.strokeStyle = 'rgba(16, 156, 93, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update time
      time += 0.016;

      // Update tools
      tools.forEach(tool => {
        // Move toward target
        tool.x += (tool.targetX - tool.x) * 0.05;
        tool.y += (tool.targetY - tool.y) * 0.05;
        
        // Rotate when moving
        if (Math.abs(tool.targetX - tool.x) > 2 || Math.abs(tool.targetY - tool.y) > 2) {
          tool.rotation = Math.sin(time * tool.speed) * 0.2;
        } else {
          tool.rotation = Math.sin(time * tool.speed * 3) * 0.5;
          
          // Change target occasionally (except for mouse follower)
          if (tool !== mouseFollowerRef.current && Math.random() > 0.995) {
            tool.targetX = Math.random() * canvas.width;
            tool.targetY = Math.random() * canvas.height;
          }
        }
        
        tool.draw(ctx, time);
      });

      // Update and draw enhanced sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.life--;
        spark.x += (Math.random() - 0.5) * 2;
        spark.y += (Math.random() - 0.5) * 2;
        
        // Spark fade effect
        const alpha = spark.life / 40;
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = alpha > 0 ? alpha : 0;
        
        // Draw spark with glow effect
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Additional glow for larger sparks
        if (spark.size > 2) {
          ctx.globalAlpha = alpha * 0.5;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        if (spark.life <= 0) {
          sparks.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle mouse movement - only update the follower tool
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseFollowerRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      mouseFollowerRef.current.targetX = mouseX;
      mouseFollowerRef.current.targetY = mouseY;
    };

    // Initialize and start animation
    initTools();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [imagesLoaded]);

  return (
    <section className="hero-container">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">
            {title} <span className="highlight-heading">{highlight}</span>
          </h1>
          <p className="hero-description">{description}</p>
        </div>
      </div>
    </section>
  );
}