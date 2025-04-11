import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface LorenzPoint {
  x: number;
  y: number;
  z: number;
}

const ChaosLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const [isDrawing, setIsDrawing] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const pointsRef = useRef<Point[]>([]);
  const lastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lorenzRef = useRef<LorenzPoint>({ x: 0.1, y: 0, z: 0 });

  // 洛伦兹吸引子参数
  const SIGMA = 10;
  const RHO = 28;
  const BETA = 8/3;
  const DT = 0.01;

  // 分形树参数
  const drawFractalTree = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    len: number,
    angle: number,
    depth: number,
    speed: number
  ) => {
    if (depth === 0) return;

    const endX = startX + len * Math.cos(angle);
    const endY = startY - len * Math.sin(angle);

    // 根据速度计算分支角度和颜色
    const branchAngle = Math.PI / 4 + (speed * 0.01);
    const hue = (speed * 5) % 360;
    const saturation = 70 + (depth * 3);
    const lightness = 40 + (depth * 2);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.lineWidth = depth * 0.5;
    ctx.stroke();

    // 递归绘制分支
    const newLen = len * 0.7;
    drawFractalTree(ctx, endX, endY, newLen, angle - branchAngle, depth - 1, speed);
    drawFractalTree(ctx, endX, endY, newLen, angle + branchAngle, depth - 1, speed);
  };

  // 绘制洛伦兹吸引子
  const drawLorenzAttractor = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    pressure: number
  ) => {
    const points: LorenzPoint[] = [];
    let point = { ...lorenzRef.current };

    // 计算轨迹点
    for (let i = 0; i < 100; i++) {
      const dx = SIGMA * (point.y - point.x) * DT;
      const dy = (point.x * (RHO - point.z) - point.y) * DT;
      const dz = (point.x * point.y - BETA * point.z) * DT;

      point.x += dx * pressure;
      point.y += dy * pressure;
      point.z += dz * pressure;

      points.push({ ...point });
    }

    // 绘制轨迹
    ctx.beginPath();
    ctx.moveTo(startX + points[0].x, startY + points[0].y);
    
    points.forEach((p, i) => {
      const x = startX + p.x * 5;
      const y = startY + p.y * 5;
      ctx.lineTo(x, y);

      // 添加蝴蝶翅膀效果
      const hue = (i * 2) % 360;
      ctx.strokeStyle = `hsla(${hue}, 80%, 50%, 0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    lorenzRef.current = point;
  };

  // 绘制随机几何图形
  const drawRandomGeometry = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    speed: number
  ) => {
    const sides = Math.floor(3 + (speed * 0.1)) % 12 + 3; // 3-15边形
    const radius = 20 + speed * 2;
    const starFactor = Math.sin(speed * 0.1) * 0.5 + 0.5; // 0-1之间变化

    ctx.beginPath();
    for (let i = 0; i <= sides * 2; i++) {
      const angle = (i * Math.PI * 2) / (sides * 2);
      const currentRadius = i % 2 === 0 ? radius : radius * starFactor;
      const x = centerX + currentRadius * Math.cos(angle);
      const y = centerY + currentRadius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // 使用混沌算法设置颜色
    const chaosValue = Math.sin(speed * 0.05) * Math.cos(centerX * 0.01) * Math.sin(centerY * 0.01);
    const hue = (chaosValue * 360 + 360) % 360;
    ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
    ctx.strokeStyle = `hsla(${hue}, 80%, 40%, 0.8)`;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  };

  // 宇宙大爆炸效果
  const createBigBang = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      life: number;
    }> = [];

    // 创建粒子
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5;
      const hue = Math.random() * 360;
      
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1,
        color: `hsl(${hue}, 80%, 50%)`,
        life: 1
      });
    }

    // 动画函数
    const animate = () => {
      ctx.fillStyle = theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.1)' 
        : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      let isAlive = false;
      particles.forEach(particle => {
        if (particle.life > 0) {
          isAlive = true;
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.1; // 重力
          particle.life -= 0.01;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, ${particle.life})`);
          ctx.fill();
        }
      });

      if (isAlive) {
        requestAnimationFrame(animate);
      } else {
        // 重置画布
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        setShowReset(false);
      }
    };

    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) { // 右键点击
        e.preventDefault();
        createBigBang(ctx, e.clientX, e.clientY);
        setShowReset(true);
        return;
      }

      setIsDrawing(true);
      lastPointRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      pointsRef.current = [];
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing || !lastPointRef.current) return;

      const currentPoint = { x: e.clientX, y: e.clientY, time: Date.now() };
      const timeDiff = currentPoint.time - lastPointRef.current.time;
      const distance = Math.sqrt(
        Math.pow(currentPoint.x - lastPointRef.current.x, 2) +
        Math.pow(currentPoint.y - lastPointRef.current.y, 2)
      );
      const speed = distance / timeDiff * 10;

      // 绘制分形树
      drawFractalTree(
        ctx,
        lastPointRef.current.x,
        lastPointRef.current.y,
        30,
        -Math.PI / 2,
        Math.floor(speed * 0.5) + 3,
        speed
      );

      // 绘制洛伦兹吸引子
      drawLorenzAttractor(ctx, currentPoint.x, currentPoint.y, speed * 0.1);

      // 绘制随机几何图形
      drawRandomGeometry(ctx, currentPoint.x, currentPoint.y, speed);

      lastPointRef.current = currentPoint;
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      lastPointRef.current = null;
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isDrawing, theme.palette.mode]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        bgcolor: theme.palette.mode === 'light' ? 'background.default' : 'transparent',
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
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: 'text.primary',
          zIndex: 1,
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
          opacity: 0.95,
        }}
      >
        <Typography variant="h6" gutterBottom>
          混沌绘图实验室
        </Typography>
        <Typography variant="body2" color="text.secondary">
          用鼠标绘制 | 右键重置 | 速度影响分形
        </Typography>
      </Box>
      <Fade in={showReset}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: 'text.primary',
            zIndex: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            宇宙正在重组...
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default ChaosLab; 