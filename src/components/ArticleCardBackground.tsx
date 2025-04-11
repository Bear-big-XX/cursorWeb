import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ArticleCardBackgroundProps {
  type: 'tech-stack' | 'project';
  children?: React.ReactNode;
}

const ArticleCardBackground: React.FC<ArticleCardBackgroundProps> = ({ type, children }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const techStackGradient = isDarkMode 
    ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
    : 'linear-gradient(135deg, #2c5364 0%, #203a43 50%, #0f2027 100%)';
    
  const projectGradient = isDarkMode
    ? 'linear-gradient(135deg, #360033 0%, #0b8793 100%)'
    : 'linear-gradient(135deg, #0b8793 0%, #360033 100%)';
    
  const techStackPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
    
  const projectPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  // 技术栈图标元素，只有在技术栈类型时添加
  const TechIcons = () => {
    if (type !== 'tech-stack') return null;
    
    return (
      <>
        <Box
          sx={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#61DAFB',
            top: '30px',
            left: '30px',
            opacity: 0.8,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#000',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid #61DAFB',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.3)',
              opacity: 0.5,
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '30px',
            height: '30px',
            borderRadius: '4px',
            backgroundColor: '#3178C6',
            bottom: '40px',
            right: '40px',
            opacity: 0.8,
            '&::before': {
              content: '"TS"',
              position: 'absolute',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }
          }}
        />
      </>
    );
  };

  // 项目图标元素，只有在项目类型时添加
  const ProjectIcons = () => {
    if (type !== 'project') return null;
    
    return (
      <>
        <Box
          sx={{
            position: 'absolute',
            width: '50px',
            height: '40px',
            bottom: '30px',
            right: '30px',
            opacity: 0.8,
            backgroundColor: '#ff6b6b',
            clipPath: 'polygon(0% 0%, 30% 0%, 40% 20%, 100% 20%, 100% 100%, 0% 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '60%',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              top: '50%',
              left: '20%',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '40%',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              top: '70%',
              left: '20%',
            }
          }}
        />
      </>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: type === 'tech-stack' ? techStackGradient : projectGradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '200px',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: type === 'tech-stack' ? techStackPattern : projectPattern,
          opacity: 0.6,
        }
      }}
    >
      {type === 'tech-stack' ? <TechIcons /> : <ProjectIcons />}
      {children}
    </Box>
  );
};

export default ArticleCardBackground; 