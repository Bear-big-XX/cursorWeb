import React, { useEffect } from 'react';
import TechStackCover from './TechStackCover';
import ProjectCover from './ProjectCover';

const ImageExporter: React.FC = () => {
  useEffect(() => {
    // 延迟执行，确保 Canvas 已完成渲染
    const timer = setTimeout(() => {
      // 获取所有 canvas 元素
      const canvases = document.querySelectorAll('canvas');
      
      if (canvases.length === 2) {
        // 导出技术栈封面
        const techStackCanvas = canvases[0];
        const techStackDataUrl = techStackCanvas.toDataURL('image/jpeg', 0.9);
        
        // 创建下载链接
        const techStackLink = document.createElement('a');
        techStackLink.href = techStackDataUrl;
        techStackLink.download = 'tech-stack-cover.jpg';
        techStackLink.style.display = 'none';
        document.body.appendChild(techStackLink);
        techStackLink.click();
        document.body.removeChild(techStackLink);
        
        // 导出项目经验封面
        const projectCanvas = canvases[1];
        const projectDataUrl = projectCanvas.toDataURL('image/jpeg', 0.9);
        
        // 创建下载链接
        const projectLink = document.createElement('a');
        projectLink.href = projectDataUrl;
        projectLink.download = 'project-experience-cover.jpg';
        projectLink.style.display = 'none';
        document.body.appendChild(projectLink);
        projectLink.click();
        document.body.removeChild(projectLink);
        
        console.log('封面图片已生成！请将它们放到 public/images 目录下');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
      <TechStackCover />
      <ProjectCover />
    </div>
  );
};

export default ImageExporter; 