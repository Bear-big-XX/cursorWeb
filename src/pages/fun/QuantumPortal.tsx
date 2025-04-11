import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import * as THREE from 'three';

interface DraggableElement {
  id: string;
  content: string;
  x: number;
  y: number;
  isDragging: boolean;
  isTransporting: boolean;
}

const QuantumPortal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPortalRef = useRef<HTMLCanvasElement>(null);
  const rightPortalRef = useRef<HTMLCanvasElement>(null);
  const [draggableElements, setDraggableElements] = useState<DraggableElement[]>([
    { id: '1', content: '🚀', x: 100, y: 100, isDragging: false, isTransporting: false },
    { id: '2', content: '💻', x: 150, y: 150, isDragging: false, isTransporting: false },
    { id: '3', content: '⚡', x: 200, y: 200, isDragging: false, isTransporting: false },
    { id: '4', content: '🌟', x: 250, y: 250, isDragging: false, isTransporting: false },
  ]);

  // 创建量子传送门着色器
  const createPortalShader = () => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffcc) },
        resolution: { value: new THREE.Vector2() }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec2 resolution;
        varying vec2 vUv;
        
        #define PI 3.14159265359
        
        float rand(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          float d = length(uv);
          
          // 创建螺旋效果
          float angle = atan(uv.y, uv.x);
          float spiral = sin(d * 10.0 - angle * 2.0 + time * 3.0) * 0.5 + 0.5;
          
          // 添加量子涟漪
          float ripple = sin(d * 15.0 - time * 4.0) * 0.5 + 0.5;
          
          // 添加随机量子闪烁
          float flicker = rand(uv + time) * 0.15;
          
          // 混合所有效果
          float c = spiral * 0.6 + ripple * 0.3 + flicker;
          
          // 创建边缘发光效果
          float glow = smoothstep(1.0, 0.5, d) * smoothstep(0.0, 0.3, d);
          
          vec3 finalColor = mix(color * 1.5, vec3(1.0), c);
          float alpha = glow * (0.8 + sin(time) * 0.2);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  };

  // 初始化 Three.js 场景
  const initPortal = (canvas: HTMLCanvasElement, isLeft: boolean) => {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
      });
      
      renderer.setSize(canvas.width, canvas.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const portalGeometry = new THREE.CircleGeometry(1, 64);
      const portalMaterial = createPortalShader();
      const portal = new THREE.Mesh(portalGeometry, portalMaterial);
      scene.add(portal);

      camera.position.z = 2;

      const animate = (time: number) => {
        portalMaterial.uniforms.time.value = time * 0.001;
        portalMaterial.uniforms.color.value.set(isLeft ? 0x00ffcc : 0xff00cc);
        portalMaterial.uniforms.resolution.value.set(canvas.width, canvas.height);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate(0);

      return () => {
        renderer.dispose();
        portalGeometry.dispose();
        portalMaterial.dispose();
        scene.remove(portal);
      };
    } catch (error) {
      console.error('Failed to initialize portal:', error);
      return () => {};
    }
  };

  // 处理元素拖动
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    setDraggableElements(prev => prev.map(el => 
      el.id === id ? { ...el, isDragging: true } : el
    ));
  };

  const handleDragMove = (e: React.MouseEvent) => {
    setDraggableElements(prev => prev.map(el => 
      el.isDragging ? { 
        ...el, 
        x: e.clientX - containerRef.current!.offsetLeft, 
        y: e.clientY - containerRef.current!.offsetTop 
      } : el
    ));
  };

  const handleDragEnd = (id: string) => {
    const element = draggableElements.find(el => el.id === id);
    if (!element) return;

    const leftPortal = leftPortalRef.current?.getBoundingClientRect();
    const rightPortal = rightPortalRef.current?.getBoundingClientRect();
    if (!leftPortal || !rightPortal || !containerRef.current) return;

    // 检查是否进入左侧传送门
    if (
      element.x > leftPortal.left - containerRef.current.offsetLeft &&
      element.x < leftPortal.right - containerRef.current.offsetLeft &&
      element.y > leftPortal.top - containerRef.current.offsetTop &&
      element.y < leftPortal.bottom - containerRef.current.offsetTop
    ) {
      // 开始传送动画
      setDraggableElements(prev => prev.map(el => 
        el.id === id ? { ...el, isDragging: false, isTransporting: true } : el
      ));

      // 50% 概率触发彩蛋效果
      const isEasterEgg = Math.random() < 0.5;
      
      setTimeout(() => {
        let newX, newY, newContent;
        
        if (isEasterEgg) {
          // 彩蛋效果：在两个传送门中间出现
          const centerX = window.innerWidth / 2 - containerRef.current!.offsetLeft;
          const centerY = window.innerHeight / 2 - containerRef.current!.offsetTop;
          
          // 随机选择一个彩蛋表情
          const easterEggEmojis = ['🌈', '👽', '🎁', '🦄', '🔮', '👾', '🧙‍♂️', '🪄'];
          newContent = easterEggEmojis[Math.floor(Math.random() * easterEggEmojis.length)];
          newX = centerX;
          newY = centerY;
        } else {
          // 正常传送：在右侧传送门附近出现
          newContent = element.content;
          
          // 计算右侧传送门相对于容器的位置
          newX = rightPortal.left - containerRef.current!.offsetLeft + rightPortal.width / 2;
          newY = rightPortal.top - containerRef.current!.offsetTop + rightPortal.height / 2;
        }
        
        setDraggableElements(prev => prev.map(el => 
          el.id === id ? {
            ...el,
            content: newContent,
            x: newX,
            y: newY,
            isTransporting: false
          } : el
        ));
      }, 500);
    } else {
      setDraggableElements(prev => prev.map(el => 
        el.id === id ? { ...el, isDragging: false } : el
      ));
    }
  };

  useEffect(() => {
    if (!leftPortalRef.current || !rightPortalRef.current) return;

    const cleanupLeft = initPortal(leftPortalRef.current, true);
    const cleanupRight = initPortal(rightPortalRef.current, false);

    return () => {
      cleanupLeft();
      cleanupRight();
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#000033',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleDragMove}
    >
      <Typography
        variant="h4"
        sx={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ffcc',
          textShadow: '0 0 10px rgba(0, 255, 204, 0.7)',
          fontFamily: 'monospace',
          zIndex: 1,
        }}
      >
        Quantum Entanglement Portal
      </Typography>

      {/* 左侧传送门 */}
      <Box
        sx={{
          position: 'absolute',
          left: '20%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
        }}
      >
        <canvas
          ref={leftPortalRef}
          width={200}
          height={200}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      {/* 右侧传送门 */}
      <Box
        sx={{
          position: 'absolute',
          right: '20%',
          top: '50%',
          transform: 'translate(50%, -50%)',
          width: 200,
          height: 200,
        }}
      >
        <canvas
          ref={rightPortalRef}
          width={200}
          height={200}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      {/* 可拖拽元素 */}
      {draggableElements.map(element => (
        <Box
          key={element.id}
          sx={{
            position: 'absolute',
            left: element.x,
            top: element.y,
            fontSize: '2rem',
            cursor: element.isDragging ? 'grabbing' : 'grab',
            transform: `scale(${element.isTransporting ? 0 : 1})`,
            transition: 'transform 0.5s',
            animation: element.isTransporting ? 'spin 0.5s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': { transform: 'scale(1) rotate(0deg)' },
              '50%': { transform: 'scale(0.5) rotate(180deg)' },
              '100%': { transform: 'scale(0) rotate(360deg)' }
            },
            '&:hover': {
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 204, 0.7))'
            }
          }}
          onMouseDown={(e) => handleDragStart(element.id, e)}
          onMouseUp={() => handleDragEnd(element.id)}
        >
          {element.content}
        </Box>
      ))}
    </Box>
  );
};

export default QuantumPortal; 