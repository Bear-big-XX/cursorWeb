import React, { createContext, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhCN } from 'date-fns/locale';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import QuantumPortal from './pages/fun/QuantumPortal';
import HeartAnimation from './pages/fun/HeartAnimation';
import MatrixRain from './pages/fun/MatrixRain';
import ParticleText from './pages/fun/ParticleText';
import TimeVortex from './pages/fun/TimeVortex';
import ChaosLab from './pages/fun/ChaosLab';
import CyberRain from './pages/fun/CyberRain';
import ImageGenerator from './pages/ImageGenerator';
import TravelGuide from './pages/travel/TravelGuide';

// 创建主题上下文
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#dc004e' : '#f48fb1',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="projects" element={<Projects />} />
                <Route path="travel" element={<TravelGuide />} />
                <Route path="fun">
                  <Route path="quantum-portal" element={<QuantumPortal />} />
                  <Route path="time-vortex" element={<TimeVortex />} />
                  <Route path="chaos-lab" element={<ChaosLab />} />
                  <Route path="heart" element={<HeartAnimation />} />
                  <Route path="matrix" element={<MatrixRain />} />
                  <Route path="cyber-rain" element={<CyberRain />} />
                  <Route path="particle" element={<ParticleText />} />
                  <Route path="tools/image-generator" element={<ImageGenerator />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
