import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import * as THREE from 'three';

// 使用 require 导入 Vanta.js
const DOTS = require('vanta/dist/vanta.dots.min');

// Vanta.js effect 类型定义
interface VantaEffect {
  destroy: () => void;
}

interface VantaOptions {
  el: HTMLElement | null;
  THREE: typeof THREE;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  scale: number;
  scaleMobile: number;
  color: string;
  color2: string;
  backgroundColor: string;
  size: number;
  spacing: number;
  showLines: boolean;
}

const AnimatedBackground: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const [error, setError] = useState<string | null>(null);
  const myRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    // 如果已经有效果实例，先销毁它
    if (vantaEffect) {
      vantaEffect.destroy();
      setVantaEffect(null);
    }

    // 确保 DOM 元素已经准备好
    if (!myRef.current) return;

    try {
      const options: VantaOptions = {
        el: myRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: theme.palette.primary.main,
        color2: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.default,
        size: 3,
        spacing: 30,
        showLines: true,
      };

      const effect = DOTS(options);
      setVantaEffect(effect);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize Vanta effect:', err);
      setError('Failed to initialize background animation');
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [theme.palette]); // 只在主题改变时重新创建效果

  if (error) {
    // 如果初始化失败，返回静态背景
    return <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      backgroundColor: theme.palette.background.default,
    }} />;
  }

  return <div ref={myRef} style={{ 
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  }} />;
};

export default AnimatedBackground; 