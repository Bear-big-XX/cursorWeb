import React, { useEffect, useRef, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TimeVortex: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const [showDialog, setShowDialog] = useState(false);
  const [isReverseTime, setIsReverseTime] = useState(false);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
  }>>([]);
  const requestRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  // 初始化粒子
  const initParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles: typeof particlesRef.current = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    // 根据主题模式选择不同的颜色方案
    const colors = theme.palette.mode === 'light' 
      ? [
          '#FF69B4',  // 粉红色
          '#4CAF50',  // 绿色
          '#FF9800',  // 橙色
          '#2196F3',  // 蓝色
          '#E91E63',  // 玫红色
          '#9C27B0',  // 紫色
          '#00BCD4',  // 青色
          '#FFEB3B',  // 黄色
        ]
      : [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.primary.light,
          theme.palette.secondary.light,
        ];

    for (let i = 0; i < 300; i++) {
      const angle = (Math.PI * 2 * i) / 300;
      const randomRadius = radius * (0.8 + Math.random() * 0.4);
      particles.push({
        x: centerX + Math.cos(angle) * randomRadius,
        y: centerY + Math.sin(angle) * randomRadius,
        targetX: centerX + Math.cos(angle) * randomRadius,
        targetY: centerY + Math.sin(angle) * randomRadius,
        vx: 0,
        vy: 0,
        radius: 1.2 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: theme.palette.mode === 'light' ? 0.3 + Math.random() * 0.3 : 0.6 + Math.random() * 0.4,
      });
    }
    particlesRef.current = particles;
  };

  // 更新粒子位置
  const updateParticles = (mouseX: number, mouseY: number, isReverse: boolean) => {
    const particles = particlesRef.current;
    const distanceThreshold = 200;
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particles.forEach((particle) => {
      // 计算粒子到鼠标的距离
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 计算粒子到中心的距离
      const dxCenter = centerX - particle.x;
      const dyCenter = centerY - particle.y;
      const distanceToCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

      // 根据距离计算引力效果
      if (distance < distanceThreshold) {
        const force = (1 - distance / distanceThreshold) * 0.08;
        particle.vx += dx * force;
        particle.vy += dy * force;
      }

      // 时间流动效果
      const baseAngle = Math.atan2(particle.y - centerY, particle.x - centerX);
      const timeFlow = isReverse ? -1 : 1;
      const rotationSpeed = 0.5 + (distanceToCenter * 0.001);
      
      particle.vx += Math.cos(baseAngle + seconds * rotationSpeed) * 0.2 * timeFlow;
      particle.vy += Math.sin(baseAngle + seconds * rotationSpeed) * 0.2 * timeFlow;

      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 阻尼
      particle.vx *= 0.92;
      particle.vy *= 0.92;

      // 边界检查和回弹
      const margin = 50;
      if (particle.x < margin) {
        particle.vx += (margin - particle.x) * 0.05;
      } else if (particle.x > canvas.width - margin) {
        particle.vx += (canvas.width - margin - particle.x) * 0.05;
      }
      if (particle.y < margin) {
        particle.vy += (margin - particle.y) * 0.05;
      } else if (particle.y > canvas.height - margin) {
        particle.vy += (canvas.height - margin - particle.y) * 0.05;
      }
    });
  };

  // 绘制时钟
  const drawClock = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    // 根据主题模式调整背景透明度
    ctx.fillStyle = theme.palette.mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.1)' 
      : 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, 0, width, height);

    // 绘制粒子和轨迹
    particlesRef.current.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      
      // 调整发光效果
      const glowIntensity = theme.palette.mode === 'light' ? 8 : 15;
      ctx.shadowBlur = glowIntensity;
      ctx.shadowColor = particle.color;
      
      // 设置填充颜色
      ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 创建时钟背景
    const clockBgRadius = Math.min(width, height) * 0.12;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, clockBgRadius, 0, Math.PI * 2);
    ctx.fillStyle = theme.palette.mode === 'light'
      ? 'rgba(255, 255, 255, 0.85)'
      : 'rgba(18, 18, 18, 0.85)';
    ctx.fill();

    // 绘制时间文本
    const fontSize = Math.min(width, height) * 0.08;
    ctx.font = `bold ${fontSize}px 'SF Pro Display', Arial, sans-serif`;
    
    // 根据主题模式调整文字颜色和发光效果
    if (theme.palette.mode === 'light') {
      const gradient = ctx.createLinearGradient(
        width / 2 - clockBgRadius,
        height / 2 - clockBgRadius,
        width / 2 + clockBgRadius,
        height / 2 + clockBgRadius
      );
      gradient.addColorStop(0, '#2196F3');
      gradient.addColorStop(0.5, '#E91E63');
      gradient.addColorStop(1, '#FF9800');
      
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    } else {
      ctx.fillStyle = theme.palette.text.primary;
      ctx.shadowBlur = 15;
      ctx.shadowColor = theme.palette.primary.main;
    }
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(timeString, width / 2, height / 2);
    ctx.shadowBlur = 0;

    // 检查是否需要显示程序员关爱提示
    if (now.getHours() === 22 && now.getMinutes() === 22 && !showDialog) {
      setShowDialog(true);
    }
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    updateParticles(mouseRef.current.x, mouseRef.current.y, isReverseTime);
    drawClock(ctx, canvas.width, canvas.height);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 设置画布尺寸
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles(ctx, window.innerWidth, window.innerHeight);
    };

    // 鼠标事件处理
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleDoubleClick = () => {
      setIsReverseTime(!isReverseTime);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('dblclick', handleDoubleClick);
    handleResize();

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('dblclick', handleDoubleClick);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isReverseTime]);

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
          时间漩涡时钟
        </Typography>
        <Typography variant="body2" color="text.secondary">
          移动鼠标扭曲时空 | 双击切换时间流向
        </Typography>
      </Box>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"程序员关爱提示"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            亲爱的程序员，现在是晚上 22:22，是时候休息了！
            记得保护眼睛，注意身体健康。
            明天继续加油！💪
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} autoFocus>
            好的，我知道了
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeVortex; 