import React, { useEffect, useRef } from 'react';

const ProjectCover: React.FC = () => {
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
    gradient.addColorStop(0, '#360033');
    gradient.addColorStop(1, '#0b8793');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制模拟代码效果
    const codeLines = [
      'function ProjectExperience() {',
      '  const [skills, setSkills] = useState([]);',
      '  const [experience, setExperience] = useState(0);',
      '',
      '  useEffect(() => {',
      '    // 从实际项目中学习',
      '    const newSkills = learnFromProjects();',
      '    setSkills([...skills, ...newSkills]);',
      '    setExperience(prev => prev + 1);',
      '  }, []);',
      '',
      '  return (',
      '    <div className="professional-growth">',
      '      <h1>成长之路</h1>',
      '      <SkillChart data={skills} />',
      '      <ExperienceTimeline years={experience} />',
      '    </div>',
      '  );',
      '}',
    ];
    
    // 绘制半透明代码背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(50, 100, 500, 280);
    
    // 绘制代码
    ctx.font = '14px Consolas, monospace';
    ctx.fillStyle = '#e0e0e0';
    
    codeLines.forEach((line, index) => {
      // 高亮一些关键字
      if (line.includes('function') || line.includes('useEffect') || line.includes('return')) {
        ctx.fillStyle = '#ff79c6';
        ctx.fillText(line, 70, 120 + index * 14);
      } else if (line.includes('useState') || line.includes('setSkills') || line.includes('setExperience')) {
        ctx.fillStyle = '#8be9fd';
        ctx.fillText(line, 70, 120 + index * 14);
      } else if (line.includes('// 从实际项目中学习')) {
        ctx.fillStyle = '#6272a4'; // 注释颜色
        ctx.fillText(line, 70, 120 + index * 14);
      } else {
        ctx.fillStyle = '#f8f8f2';
        ctx.fillText(line, 70, 120 + index * 14);
      }
    });
    
    // 绘制项目图标
    // 绘制一个简化的项目图
    const drawProjectIcon = (x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      
      // 文件夹形状
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size * 0.3, y);
      ctx.lineTo(x + size * 0.4, y - size * 0.1);
      ctx.lineTo(x + size, y - size * 0.1);
      ctx.lineTo(x + size, y + size * 0.6);
      ctx.lineTo(x, y + size * 0.6);
      ctx.closePath();
      ctx.fill();
      
      // 文件图标装饰
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(x + size * 0.2, y + size * 0.15, size * 0.6, size * 0.08);
      ctx.fillRect(x + size * 0.2, y + size * 0.3, size * 0.6, size * 0.08);
      ctx.fillRect(x + size * 0.2, y + size * 0.45, size * 0.3, size * 0.08);
    };
    
    // 绘制3个项目图标
    drawProjectIcon(600, 150, 80, '#ff6b6b');
    drawProjectIcon(650, 230, 70, '#48dbfb');
    drawProjectIcon(620, 300, 90, '#1dd1a1');
    
    // 绘制标题
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('最新项目经验', canvas.width / 2, 30);
    
    // 添加一条装饰线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 90);
    ctx.lineTo(canvas.width - 50, 90);
    ctx.stroke();
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block' }} />;
};

export default ProjectCover; 