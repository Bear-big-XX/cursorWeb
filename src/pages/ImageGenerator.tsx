import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ImageExporter from '../components/ImageExporter';
import TechStackCover from '../components/TechStackCover';
import ProjectCover from '../components/ProjectCover';

const ImageGenerator: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        封面图片生成器
      </Typography>
      <Typography variant="body1" paragraph>
        以下是为首页文章卡片生成的封面图片预览。点击"生成并下载"按钮将这些图片保存到您的计算机，然后将它们放入 public/images 目录中。
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
          const exporter = document.createElement('div');
          exporter.style.position = 'fixed';
          exporter.style.left = '-9999px';
          exporter.style.top = '-9999px';
          document.body.appendChild(exporter);
          
          // 渲染导出组件
          const root = document.createElement('div');
          exporter.appendChild(root);
          
          // 使用 ReactDOM.render 渲染 ImageExporter 组件
          // 注意: 在实际应用中应该使用 createRoot API
          const ReactDOM = require('react-dom');
          ReactDOM.render(<ImageExporter />, root);
          
          // 5秒后移除组件
          setTimeout(() => {
            document.body.removeChild(exporter);
          }, 5000);
        }}
        sx={{ mb: 4 }}
      >
        生成并下载图片
      </Button>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        技术栈封面预览
      </Typography>
      <Box sx={{ mb: 4, border: '1px solid #ddd', p: 2 }}>
        <TechStackCover />
      </Box>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        项目经验封面预览
      </Typography>
      <Box sx={{ mb: 4, border: '1px solid #ddd', p: 2 }}>
        <ProjectCover />
      </Box>
    </Box>
  );
};

export default ImageGenerator; 