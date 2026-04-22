import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const HexagonGrid: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000 };

    const hexRadius = 35;
    const hexHeight = Math.sqrt(3) * hexRadius;
    const hexWidth = 2 * hexRadius;

    const resize = () => {
      // Use clientWidth/Height to get the actual CSS-rendered size (including the 160% height)
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const drawHexagon = (x: number, y: number, radius: number, opacity: number, isHigh: boolean) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        // Use 0 as start angle for pointed-top hexagons
        const angle = (Math.PI / 3) * i + Math.PI / 2;
        const xPos = x + radius * Math.cos(angle);
        const yPos = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
      
      if (isHigh) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 2;
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 1;
      }
      
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Pointed top spacing
      const xSpacing = hexHeight; 
      const ySpacing = hexRadius * 1.5;

      const cols = Math.ceil(width / xSpacing) + 1;
      const rows = Math.ceil(height / ySpacing) + 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * xSpacing + (r % 2 === 0 ? 0 : xSpacing / 2);
          const y = r * ySpacing;

          const dist = Math.sqrt((x - mouse.x) ** 2 + (y - mouse.y) ** 2);
          const maxDist = 250;
          let opacity = 0.08;
          let isHigh = false;

          if (dist < maxDist) {
            const factor = 1 - dist / maxDist;
            opacity = 0.08 + factor * 0.5;
            if (factor > 0.6) isHigh = true;
          }

          drawHexagon(x, y, hexRadius - 4, opacity, isHigh);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial delay to ensure parent dimensions are ready
    setTimeout(() => {
        resize();
        render();
    }, 100);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={clsx(styles.hexCanvas, className)} />;
};

export default HexagonGrid;
