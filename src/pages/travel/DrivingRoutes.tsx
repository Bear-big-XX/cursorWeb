import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  Chip, 
  CircularProgress,
  Container,
  useTheme,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  DirectionsCar as CarIcon, 
  ArrowForward as ArrowIcon,
  AccessTime as TimeIcon,
  LocalGasStation as GasIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
  Timeline as RouteIcon,
  MyLocation as LocationIcon,
  LocationOn as DestinationIcon,
  Info as InfoIcon,
  Traffic as TrafficIcon,
  Navigation as NavigationIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import amapService, { DrivingRoute, RouteStep } from '../../utils/amapService';

const DrivingRoutes: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<DrivingRoute | null>(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSearch = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError('请填写出发地和目的地');
      return;
    }

    setLoading(true);
    setRouteInfo(null);
    setError('');

    try {
      // 调用高德地图服务获取驾车路线
      const route = await amapService.getDrivingRoute(origin, destination);
      setRouteInfo(route);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('获取驾车路线失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTrafficStatusColor = (status?: string) => {
    if (!status) return theme.palette.info.main;
    
    switch(status) {
      case '畅通':
        return theme.palette.success.main;
      case '缓行':
        return theme.palette.warning.light;
      case '拥堵':
        return theme.palette.warning.main;
      case '严重拥堵':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3,
        duration: 0.6 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Container maxWidth="lg">
      <Box component={motion.div} variants={headerVariants} initial="hidden" animate="visible">
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            background: isDark 
              ? 'linear-gradient(90deg, #90caf9 30%, #64b5f6 90%)' 
              : 'linear-gradient(90deg, #1976d2 30%, #2196f3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          驾车出行路线规划
        </Typography>

        <Paper
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 2,
            background: isDark 
              ? 'linear-gradient(45deg, rgba(26, 32, 46, 0.8), rgba(28, 41, 56, 0.8))' 
              : 'linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(240, 245, 250, 0.9))',
            backdropFilter: 'blur(10px)',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="出发地"
                variant="outlined"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="例如：北京市海淀区"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="目的地"
                variant="outlined"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="例如：天津市南开区"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CarIcon />}
                sx={{ 
                  py: 1.75, 
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                {loading ? '规划中' : '规划路线'}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {routeInfo && (
        <Box component={motion.div} variants={contentVariants} initial="hidden" animate="visible">
          {/* 路线概览 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                路线概览
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 2, color: theme.palette.success.main }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      出发地: <span style={{ fontWeight: 400 }}>{routeInfo.origin}</span>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DestinationIcon sx={{ mr: 2, color: theme.palette.error.main }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      目的地: <span style={{ fontWeight: 400 }}>{routeInfo.destination}</span>
                    </Typography>
                  </Box>

                  {routeInfo.trafficLights && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrafficIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        信号灯: <span style={{ fontWeight: 400 }}>{routeInfo.trafficLights}</span>
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                      icon={<RouteIcon />} 
                      label={`总距离: ${routeInfo.distance}`} 
                      sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                    />
                    <Chip 
                      icon={<TimeIcon />} 
                      label={`预计用时: ${routeInfo.duration}`} 
                      sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                    />
                    <Chip 
                      icon={<MoneyIcon />} 
                      label={`过路费: ${routeInfo.toll}`} 
                      sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                    />
                    <Chip 
                      icon={<GasIcon />} 
                      label={`油费: ${routeInfo.gasoline}`} 
                      sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* 驾驶导航 */}
          <motion.div variants={itemVariants}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              驾驶导航
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <List>
                {routeInfo.steps.map((step: RouteStep, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        borderLeft: index > 0 && index < routeInfo.steps.length - 1 
                          ? `2px dashed ${theme.palette.divider}` 
                          : 'none',
                        ml: 2,
                        pl: 2
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          minWidth: 40,
                          color: index === 0 
                            ? theme.palette.success.main 
                            : index === routeInfo.steps.length - 1 
                              ? theme.palette.error.main 
                              : theme.palette.primary.main
                        }}
                      >
                        {index === 0 ? (
                          <LocationIcon />
                        ) : index === routeInfo.steps.length - 1 ? (
                          <DestinationIcon />
                        ) : (
                          <ArrowIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {step.instruction}
                            </Typography>
                            {step.road && (
                              <Chip 
                                label={step.road} 
                                size="small" 
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                              />
                            )}
                            {/* @ts-ignore - trafficStatus is a custom property not in the interface */}
                            {step.trafficStatus && (
                              <Chip 
                                /* @ts-ignore - trafficStatus is a custom property not in the interface */
                                label={step.trafficStatus} 
                                size="small" 
                                sx={{ 
                                  ml: 1, 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  /* @ts-ignore - trafficStatus is a custom property not in the interface */
                                  bgcolor: `${getTrafficStatusColor(step.trafficStatus)}22`,
                                  /* @ts-ignore - trafficStatus is a custom property not in the interface */
                                  color: getTrafficStatusColor(step.trafficStatus)
                                }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', mt: 0.5, gap: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              <RouteIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              {step.distance}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              {step.duration}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < routeInfo.steps.length - 1 && (
                      <Divider component="li" variant="inset" sx={{ ml: 7 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </motion.div>

          {/* 替代路线 */}
          {routeInfo.alternativeRoutes && routeInfo.alternativeRoutes.length > 0 && (
            <motion.div variants={itemVariants}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                替代路线
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {routeInfo.alternativeRoutes.map((route, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 3, 
                        height: '100%', 
                        borderRadius: 2,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <NavigationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {route.name}
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip 
                          icon={<RouteIcon />} 
                          label={`距离: ${route.distance}`} 
                          size="small"
                          sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                        />
                        <Chip 
                          icon={<TimeIcon />} 
                          label={`用时: ${route.duration}`} 
                          size="small"
                          sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                        />
                      </Box>
                      <Typography variant="body2">
                        {route.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* 驾驶提示 */}
          <motion.div variants={itemVariants}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              驾驶提示
            </Typography>
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box component="ul" sx={{ pl: 1, listStyleType: 'none' }}>
                {routeInfo.tips.map((tip, index) => (
                  <Box component="li" key={index} sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}>
                    <InfoIcon sx={{ mr: 2, color: 'primary.main', fontSize: 20, mt: 0.3 }} />
                    <Typography variant="body2">{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>

          {/* 打印按钮 */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.print()}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  borderRadius: 2,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                打印路线
              </Button>
            </Box>
          </motion.div>
        </Box>
      )}
    </Container>
  );
};

export default DrivingRoutes; 