import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const windows: Array<{ x: number; y: number; lit: boolean }> = [];

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const green = 128 + Math.floor(Math.random() * 128);
        ctx.fillStyle = `rgba(0, ${green}, 0, 0.8)`;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 1,
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#00ff00',
            textShadow: '0 0 10px rgba(0, 255, 0, 0.7)',
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            fontWeight: 'bold',
          }}
        >
          Matrix Rain
        </Typography>
      </Box>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
};

export default MatrixRain; 