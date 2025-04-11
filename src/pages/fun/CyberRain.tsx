import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  content: string;
  color: string;
  size: number;
  angle: number;
  type: 'qr' | 'ascii' | 'emoji';
  expanded: boolean;
}

interface CityBuilding {
  x: number;
  width: number;
  height: number;
  windows: Array<{ x: number; y: number; lit: boolean }>;
}

const CyberRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindropRef = useRef<Raindrop[]>([]);
  const buildingsRef = useRef<CityBuilding[]>([]);
  const gradientOffsetRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const isMatrixStorm = useRef(false);
  const isRainbowMode = useRef(false);

  // 生成随机霓虹色
  const generateNeonColor = () => {
    const neonColors = [
      '#FF00FF', // 紫红
      '#00FFFF', // 青色
      '#FF3366', // 粉红
      '#33FF33', // 荧光绿
      '#FF9933', // 橙色
      '#3366FF', // 蓝色
    ];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
  };

  // 生成随机内容
  const generateContent = () => {
    const contents = [
      '❤️', '☮️', '⚡️', '🌈', '🎮', '💻', '🎵', '🎨',
      '01', '10', '※', '◈', '◇', '♢', '△', '☆',
      'CYBER', 'PUNK', 'NEON', 'RAIN', 'HACK', 'CODE'
    ];
    return contents[Math.floor(Math.random() * contents.length)];
  };

  // 创建新雨滴
  const createRaindrop = () => {
    const types: ('qr' | 'ascii' | 'emoji')[] = ['qr', 'ascii', 'emoji'];
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      speed: Math.random() * 2 + 1,
      content: generateContent(),
      color: generateNeonColor(),
      size: Math.random() * 10 + 15,
      angle: 0,
      type: types[Math.floor(Math.random() * types.length)],
      expanded: false
    };
  };

  // 初始化城市建筑
  const initBuildings = useCallback(() => {
    const newBuildings: CityBuilding[] = [];
    let x = 0;
    while (x < window.innerWidth) {
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 200 + 100;
      const windows: Array<{ x: number; y: number; lit: boolean }> = [];
      
      for (let wx = 0; wx < width; wx += 20) {
        for (let wy = 0; wy < height; wy += 20) {
          windows.push({
            x: wx,
            y: wy,
            lit: Math.random() > 0.5
          });
        }
      }
      
      newBuildings.push({ x, width, height, windows });
      x += width + 20;
    }
    buildingsRef.current = newBuildings;
  }, []);

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    raindropRef.current = raindropRef.current.map(drop => {
      const distance = Math.sqrt(
        Math.pow(drop.x - x, 2) + Math.pow(drop.y - y, 2)
      );
      if (distance < 20) {
        return { ...drop, expanded: !drop.expanded };
      }
      return drop;
    });
  };

  // 触发矩阵风暴
  const triggerMatrixStorm = () => {
    isMatrixStorm.current = true;
    setTimeout(() => {
      isMatrixStorm.current = false;
    }, 5000);
  };

  // 触发数据彩虹
  const triggerRainbow = () => {
    isRainbowMode.current = true;
    setTimeout(() => {
      isRainbowMode.current = false;
    }, 8000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // 初始化雨滴和建筑物
    raindropRef.current = Array.from({ length: 50 }, () => createRaindrop());
    initBuildings();

    const animate = () => {
      if (!ctx || !canvas) return;

      // 清除画布
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制动态渐变背景
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#000033');
      gradient.addColorStop(0.5 + Math.sin(gradientOffsetRef.current) * 0.1, '#330066');
      gradient.addColorStop(1, '#660066');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制建筑物
      buildingsRef.current.forEach(building => {
        // 建筑物轮廓发光效果
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#000033';
        ctx.fillRect(building.x, canvas.height - building.height, building.width, building.height);
        ctx.shadowBlur = 0;
        
        building.windows.forEach(window => {
          // 随机更新窗户状态
          if (Math.random() < 0.01) {
            window.lit = !window.lit;
          }
          
          // 窗户发光效果
          if (window.lit) {
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 10;
          }
          ctx.fillStyle = window.lit ? 
            `rgba(255, 255, 0, ${0.3 + Math.random() * 0.2})` : 
            'rgba(0, 0, 33, 0.8)';
          ctx.fillRect(
            building.x + window.x, 
            canvas.height - building.height + window.y, 
            15, 15
          );
          ctx.shadowBlur = 0;
        });
      });

      // 更新雨滴
      raindropRef.current = raindropRef.current.map(drop => {
        if (isMatrixStorm.current) {
          drop.angle = 90;
        } else {
          drop.angle = Math.sin(Date.now() * 0.001 + drop.x) * 5;
        }
        
        const newX = drop.x + Math.sin(drop.angle * Math.PI / 180) * drop.speed;
        const newY = drop.y + Math.cos(drop.angle * Math.PI / 180) * drop.speed;

        if (newY > canvas.height || newX < 0 || newX > canvas.width) {
          return createRaindrop();
        }

        return { ...drop, x: newX, y: newY };
      });

      // 确保雨滴数量
      while (raindropRef.current.length < 50) {
        raindropRef.current.push(createRaindrop());
      }

      // 绘制雨滴
      raindropRef.current.forEach(drop => {
        ctx.save();
        ctx.translate(drop.x, drop.y);
        
        // 添加发光效果
        ctx.shadowColor = drop.color;
        ctx.shadowBlur = 10;
        
        if (drop.expanded) {
          ctx.font = `${drop.size * 2}px monospace`;
          ctx.fillStyle = drop.color;
          ctx.fillText(drop.content, 0, 0);
          
          // 绘制展开效果
          ctx.strokeStyle = drop.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, drop.size * 3, 0, Math.PI * 2);
          ctx.stroke();
          
          // 添加波纹效果
          ctx.beginPath();
          ctx.arc(0, 0, drop.size * 4, 0, Math.PI * 2);
          ctx.strokeStyle = `${drop.color}44`;
          ctx.stroke();
        } else {
          ctx.font = `${drop.size}px monospace`;
          ctx.fillStyle = isRainbowMode.current ? 
            `hsl(${(drop.y + gradientOffsetRef.current * 100) % 360}, 100%, 50%)` : 
            drop.color;
          ctx.fillText(drop.content, 0, 0);
          
          // 添加拖尾效果
          ctx.fillStyle = `${drop.color}22`;
          ctx.fillText(drop.content, 0, -5);
        }
        
        ctx.restore();
      });

      gradientOffsetRef.current += 0.01;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      updateCanvasSize();
      initBuildings();
    });

    // 随机触发特效
    const effectsInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        triggerMatrixStorm();
      } else if (Math.random() < 0.3) {
        triggerRainbow();
      }
    }, 15000);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
      clearInterval(effectsInterval);
    };
  }, [initBuildings]);

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
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 0, 255, 0.3)',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 0 20px rgba(255, 0, 255, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#ff00ff',
            textShadow: '0 0 10px rgba(255, 0, 255, 0.7)',
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            py: 1,
          }}
        >
          Cyberpunk Neon Rain
        </Typography>
      </Box>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'pointer',
        }}
      />
    </Box>
  );
};

export default CyberRain; 