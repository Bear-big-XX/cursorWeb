import React, { useEffect, useRef } from 'react';

const TechStackCover: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置画布大小
    canvas.width = 800;
    canvas.height = 400;
    
    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f2027');
    gradient.addColorStop(0.5, '#203a43');
    gradient.addColorStop(1, '#2c5364');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格效果
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // 水平线
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // 垂直线
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // 绘制技术图标
    const techs = [
      { name: 'React', x: 100, y: 100, color: '#61DAFB' },
      { name: 'TypeScript', x: 300, y: 150, color: '#3178C6' },
      { name: 'Node.js', x: 500, y: 100, color: '#68A063' },
      { name: 'GraphQL', x: 200, y: 250, color: '#E535AB' },
      { name: 'Docker', x: 400, y: 300, color: '#2496ED' },
      { name: 'AWS', x: 600, y: 250, color: '#FF9900' },
    ];
    
    // 绘制连接线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < techs.length; i++) {
      for (let j = i + 1; j < techs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(techs[i].x, techs[i].y);
        ctx.lineTo(techs[j].x, techs[j].y);
        ctx.stroke();
      }
    }
    
    // 绘制技术节点
    techs.forEach(tech => {
      // 绘制圆圈
      ctx.beginPath();
      ctx.arc(tech.x, tech.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = tech.color;
      ctx.fill();
      
      // 绘制技术名称
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tech.name, tech.x, tech.y);
    });
    
    // 绘制标题
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('我的技术栈分享', canvas.width / 2, 30);
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />;
};

export default TechStackCover; 