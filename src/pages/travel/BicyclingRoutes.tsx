import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Divider, 
  Chip, 
  CircularProgress,
  Container,
  useTheme,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { 
  DirectionsBike as BikeIcon, 
  ArrowForward as ArrowIcon,
  AccessTime as TimeIcon,
  Timeline as RouteIcon,
  MyLocation as LocationIcon,
  LocationOn as DestinationIcon,
  Info as InfoIcon,
  LocalGasStation as EnergyIcon,
  Warning as WarningIcon,
  Terrain as TerrainIcon,
  Restaurant as FoodIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import amapService, { BicyclingRoute, RouteStep } from '../../utils/amapService';

// 接口定义
interface BikeStep {
  instruction: string;
  distance: string;
  duration: string;
  road?: string;
}

interface RestPoint {
  name: string;
  type: string;
  distance: string;
  description: string;
  image: string;
}

interface BikeRoute {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  calories: string;
  elevation: string;
  steps: BikeStep[];
  restPoints: RestPoint[];
  tips: string[];
  roadCondition: string;
}

const BicyclingRoutes: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<BicyclingRoute | null>(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleGetRoute = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError('请填写出发地和目的地');
      return;
    }

    setLoading(true);
    setRouteInfo(null);
    setError('');

    try {
      // 直接调用高德API获取骑行路线
      // @ts-ignore
      const bicycleRoute = await window.mcp_amap_amap_sse_maps_direction_bicycling({
        origin: origin,
        destination: destination
      });
      
      console.log("骑行路线规划结果:", bicycleRoute);
      
      // 如果API返回了有效数据
      if (bicycleRoute && bicycleRoute.data && bicycleRoute.data.paths && bicycleRoute.data.paths.length > 0) {
        // 解析路线数据
        const path = bicycleRoute.data.paths[0];
        
        // 计算相关数据
        const distanceInKm = path.distance / 1000;
        const durationInMin = Math.ceil(path.duration / 60);
        const caloriesBurned = Math.round(distanceInKm * 30); // 约30卡/公里
        
        // 构建路线步骤
        const routeSteps = path.steps.map((step: any, index: number) => ({
          instruction: step.instruction || `路段${index + 1}`,
          distance: `${(step.distance / 1000).toFixed(1)}公里`,
          duration: `${Math.ceil(step.duration / 60)}分钟`,
          road: step.road || ''
        }));
        
        // 构建路线信息
        const route: BicyclingRoute = {
          origin,
          destination,
          distance: `${distanceInKm.toFixed(1)}公里`,
          duration: `${durationInMin}分钟`,
          calories: `约${caloriesBurned}卡路里`,
          elevation: "根据实际路况计算",
          roadCondition: "大部分路段适合骑行，请注意交通安全",
          steps: routeSteps,
          restPoints: [
            {
              name: "建议休息点",
              type: "休息点",
              distance: `骑行${(distanceInKm / 3).toFixed(1)}公里处`,
              description: "建议每骑行1/3路程适当休息补充水分",
              image: "https://source.unsplash.com/random/400x200/?park+bench"
            },
            {
              name: "补给站",
              type: "补给点",
              distance: `骑行${(distanceInKm * 2 / 3).toFixed(1)}公里处`,
              description: "建议准备能量补充食品和足够的水",
              image: "https://source.unsplash.com/random/400x200/?bike+rest"
            }
          ],
          tips: [
            "骑行过程中请遵守交通规则，注意安全",
            "骑行前检查车辆状况，确保刹车、车胎等部件正常",
            "天气炎热时建议携带足够的水和防晒用品"
          ]
        };
        
        setRouteInfo(route);
      } else {
        throw new Error("未找到合适的骑行路线，请尝试不同的地点");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('获取骑行路线失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  // 动画变体
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
          骑行路线规划
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
                placeholder="例如：北京市西城区"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="目的地"
                variant="outlined"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="例如：北京市海淀区"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGetRoute}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BikeIcon />}
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
                骑行路线概览
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

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon sx={{ mr: 2, color: theme.palette.warning.main }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      道路状况: <span style={{ fontWeight: 400 }}>{routeInfo.roadCondition}</span>
                    </Typography>
                  </Box>
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
                      icon={<EnergyIcon />} 
                      label={`消耗热量: ${routeInfo.calories}`} 
                      sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                    />
                    <Chip 
                      icon={<TerrainIcon />} 
                      label={`海拔变化: ${routeInfo.elevation}`} 
                      sx={{ bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(33, 150, 243, 0.1)', px: 1 }} 
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* 骑行导航 */}
          <motion.div variants={itemVariants}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              骑行导航指引
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
                          <BikeIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {step.instruction}
                            {step.road && (
                              <Chip 
                                label={step.road} 
                                size="small" 
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                              />
                            )}
                          </Typography>
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

          {/* 休息补给点 */}
          {routeInfo.restPoints && routeInfo.restPoints.length > 0 && (
            <motion.div variants={itemVariants}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                休息补给点
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {routeInfo.restPoints.map((point, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="160"
                        image={point.image}
                        alt={point.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {point.name}
                        </Typography>
                        <Box sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
                          <Chip 
                            label={point.type} 
                            size="small" 
                            sx={{ 
                              fontSize: '0.7rem', 
                              bgcolor: point.type.includes('补给') 
                                ? 'rgba(76, 175, 80, 0.2)' 
                                : point.type.includes('休息') 
                                  ? 'rgba(33, 150, 243, 0.2)'
                                  : 'rgba(255, 152, 0, 0.2)',
                            }} 
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {point.distance}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {point.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* 骑行提示 */}
          <motion.div variants={itemVariants}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              骑行小贴士
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

export default BicyclingRoutes; 