"use client";
import { useRef, useEffect } from "react";
// Clase Particle fuera del componente para evitar warning de React
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    const opacity = Math.random() / 1;
    this.color = `rgba(0,128,0, ${opacity})`;
  }
  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
import { useThemeToggler } from "../themeToggler";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { theme } = useThemeToggler();
  console.log("Canvas theme value:", theme); // <-- ¿Esto cambia?

  // Mantener referencias fuera del useEffect para evitar reinicios
  const animationFrameIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const widthRef = useRef<number>(0);
  const heightRef = useRef<number>(0);
  const strokeColorRef = useRef<string>("64, 64, 64,");
  const particleCount = 100;
  const maxDistance = 100;

  // Inicializa canvas y particles solo una vez
  useEffect(() => {
    // Solo ejecutar en cliente
    if (!canvasRef.current) return;
    widthRef.current = canvasRef.current.width = window.innerWidth;
    heightRef.current = canvasRef.current.height = window.innerHeight;
    ctxRef.current = canvasRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    // Inicializa particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(
        new Particle(widthRef.current, heightRef.current)
      );
    }
    // Animación
    function animate() {
      if (ctxRef.current) {
        ctxRef.current.clearRect(0, 0, widthRef.current, heightRef.current);
        particlesRef.current.forEach((particle) => {
          particle.update(widthRef.current, heightRef.current);
          particle.draw(ctxRef.current!);
          particlesRef.current.forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxDistance) {
              ctxRef.current!.beginPath();
              ctxRef.current!.moveTo(particle.x, particle.y);
              ctxRef.current!.lineTo(otherParticle.x, otherParticle.y);
              ctxRef.current!.strokeStyle = `rgba(${strokeColorRef.current} ${
                1 - distance / maxDistance
              })`;
              ctxRef.current!.stroke();
            }
          });
        });
      }
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }
    // Resize
    function handleResize() {
      if (!canvasRef.current) return;
      widthRef.current = canvasRef.current.width = window.innerWidth;
      heightRef.current = canvasRef.current.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      if (ctxRef.current)
        ctxRef.current.clearRect(0, 0, widthRef.current, heightRef.current);
    };
  }, []); // Solo una vez

  // Actualiza el color de las líneas cuando cambia el theme
  useEffect(() => {
    console.log("Updating stroke color for theme:", theme);
    let strokeColor = "64, 64, 64,";
    if (theme === "dark") {
      strokeColor = "64, 64, 64,";
    } else if (theme === "light") {
      strokeColor = "168, 168, 168,";
    } else if (theme === "low-contrast") {
      strokeColor = "168, 168, 168,";
    } else if (theme === "high-contrast") {
      strokeColor = "64, 64, 64,";
    }
    strokeColorRef.current = strokeColor;
  }, [theme]);

  return (
    <canvas
      id="animationCanvas"
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
}
