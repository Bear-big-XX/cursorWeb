import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const Matrix: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 字符集
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // 每一列的当前位置
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // 绘制数字雨
    function draw() {
      if (!ctx || !canvas) return;

      // 半透明的背景，形成渐隐效果
      ctx.fillStyle = 'rgba(245, 245, 245, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 设置文字样式
      ctx.fillStyle = '#1976d2';
      ctx.font = `${fontSize}px monospace`;

      // 逐列绘制字符
      for (let i = 0; i < drops.length; i++) {
        // 随机选择一个字符
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // 绘制字符
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(char, x, y);

        // 随机添加发光效果
        if (Math.random() < 0.05) {
          ctx.fillStyle = '#2196f3';
          ctx.fillText(char, x, y);
          ctx.fillStyle = '#1976d2';
        }

        // 当字符到达底部或随机重置时，重置到顶部
        if (y > canvas.height || Math.random() > 0.98) {
          drops[i] = 0;
        }

        // 更新位置
        drops[i]++;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
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

export default Matrix; 