import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const HeartAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [petalCount, setPetalCount] = useState(200);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to container size
    const resize = () => {
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Calculate heart shape points
    const generateHeartPoints = (scale: number = 1, offsetX: number = 0, offsetY: number = 0): Array<[number, number]> => {
      const points: Array<[number, number]> = [];
      const numberOfPoints = 100;
      for (let i = 0; i < numberOfPoints; i++) {
        const t = (i / numberOfPoints) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        points.push([
          x * scale + offsetX,
          -y * scale + offsetY
        ]);
      }
      return points;
    };

    // Petal class
    class Petal {
      x: number = 0;
      y: number = 0;
      targetX: number;
      targetY: number;
      size: number = 2;
      angle: number = 0;
      rotationSpeed: number = 0;
      color: string = 'pink';
      opacity: number = 1;
      speed: number = 1;

      constructor(targetX: number, targetY: number) {
        this.targetX = targetX;
        this.targetY = targetY;
        if (!canvas) return;
        
        // Start from random position around the edges
        const side = Math.floor(Math.random() * 4);
        switch(side) {
          case 0: // top
            this.x = Math.random() * canvas.width;
            this.y = -20;
            break;
          case 1: // right
            this.x = canvas.width + 20;
            this.y = Math.random() * canvas.height;
            break;
          case 2: // bottom
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            break;
          default: // left
            this.x = -20;
            this.y = Math.random() * canvas.height;
        }
        this.size = Math.random() * 2 + 3;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = `hsl(${Math.random() * 30 + 350}, 100%, ${Math.random() * 20 + 70}%)`;
        this.opacity = Math.random() * 0.3 + 0.7;
        this.speed = Math.random() * 0.5 + 0.3;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        
        // Draw petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          this.size * 1.5, -this.size * 2,
          this.size * 3, -this.size,
          this.size * 3, 0
        );
        ctx.bezierCurveTo(
          this.size * 3, this.size,
          this.size * 1.5, this.size * 2,
          0, 0
        );
        
        ctx.fill();
        ctx.restore();
      }

      update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0.5) {
          const easing = 0.03;
          this.x += dx * easing;
          this.y += dy * easing;
        }
        
        this.angle += this.rotationSpeed;
      }
    }

    // Generate heart points
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 40;
    const heartPoints = generateHeartPoints(scale, centerX, centerY);

    // Create petals
    const petals: Petal[] = [];
    for (let i = 0; i < petalCount; i++) {
      const targetPoint = heartPoints[Math.floor(Math.random() * heartPoints.length)];
      petals.push(new Petal(targetPoint[0], targetPoint[1]));
    }

    // Animation loop
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach(petal => {
        petal.update();
        petal.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    // Handle click to add new petals
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add new petals
      for (let i = 0; i < 5; i++) {
        const targetPoint = heartPoints[Math.floor(Math.random() * heartPoints.length)];
        petals.push(new Petal(targetPoint[0], targetPoint[1]));
      }
    };

    canvas.addEventListener('click', handleClick);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [petalCount]);

  const handleAddPetals = () => {
    setPetalCount(prev => prev + 50);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff5f5',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(8px)',
          maxWidth: '90%',
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#d32f2f',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          Petals of Love
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            mb: 1,
          }}
        >
          Click anywhere to add more petals! 🌸
        </Typography>
        <IconButton
          onClick={handleAddPetals}
          color="error"
          size="medium"
          sx={{ 
            bgcolor: 'rgba(211, 47, 47, 0.1)',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s',
              bgcolor: 'rgba(211, 47, 47, 0.2)',
            }
          }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Box>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
    </Box>
  );
};

export default HeartAnimation; 