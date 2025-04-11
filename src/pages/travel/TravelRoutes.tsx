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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
} from '@mui/material';
import { 
  Explore as ExploreIcon, 
  Today as TodayIcon, 
  AccessTime as TimeIcon, 
  DirectionsWalk as WalkIcon,
  DirectionsTransit as TransitIcon,
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  LocalPhone as PhoneIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  WbSunny as WeatherIcon,
  Place as PlaceIcon,
  Commute as CommuteIcon,
  ListAlt as ActivityIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhCN } from 'date-fns/locale';
import { motion } from 'framer-motion';
import amapService, { TravelGuide } from '../../utils/amapService';

const TravelRoutes: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelGuide | null>(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSearch = async () => {
    if (!destination.trim()) {
      setError('请输入旅游目的地');
      return;
    }

    if (!travelDate) {
      setError('请选择旅游日期');
      return;
    }

    setLoading(true);
    setTravelPlan(null);
    setError('');

    try {
      // 使用window对象直接调用高德API
      // @ts-ignore - 忽略TypeScript错误
      const geoResult = await window.mcp_amap_amap_sse_maps_geo({
        address: destination,
      });
      
      console.log("地理编码API返回:", geoResult);
      
      if (!geoResult.data || !geoResult.data.geocodes || geoResult.data.geocodes.length === 0) {
        throw new Error("无法解析该地址，请输入更准确的地址");
      }
      
      const geocode = geoResult.data.geocodes[0];
      const city = geocode.city || destination;
      
      // @ts-ignore - 忽略TypeScript错误
      const weatherResult = await window.mcp_amap_amap_sse_maps_weather({
        city: geocode.adcode || city
      });
      
      console.log("天气API返回:", weatherResult);
      
      // 创建旅游攻略数据
      const formattedDate = travelDate.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
      });
      
      // 获取天气数据
      let weatherInfo = '晴朗，22°C/16°C，微风';
      if (weatherResult.data && weatherResult.data.forecasts && weatherResult.data.forecasts.length > 0) {
        const forecast = weatherResult.data.forecasts[0].casts[0];
        weatherInfo = `${forecast.dayweather}/${forecast.nightweather}，${forecast.daytemp}°C/${forecast.nighttemp}°C，${forecast.daywind}风${forecast.daypower}级`;
      }
      
      // 搜索当地景点
      // @ts-ignore - 忽略TypeScript错误
      const poiResult = await window.mcp_amap_amap_sse_maps_text_search({ 
        keywords: `${destination} 景点`, 
        city: city,
        citylimit: true
      });
      
      console.log("POI搜索API返回:", poiResult);
      
      // 提取景点
      interface Attraction {
        name: string;
        address: string;
        location: string;
        type: string;
      }
      
      let attractions: Attraction[] = [];
      if (poiResult.data && poiResult.data.pois && poiResult.data.pois.length > 0) {
        attractions = poiResult.data.pois.slice(0, 4).map((poi: any) => ({
          name: poi.name,
          address: poi.address || '详细地址信息未提供',
          location: `${poi.location}`,
          type: poi.type || '景点'
        }));
      } else {
        attractions = [
          { name: '城市公园', address: '市中心', location: '', type: '公园' },
          { name: '历史博物馆', address: '文化区', location: '', type: '博物馆' },
          { name: '中央广场', address: '商业区', location: '', type: '广场' },
          { name: '古城墙', address: '古城区', location: '', type: '古迹' }
        ];
      }
      
      // 生成模拟行程
      const schedule = [
        { 
          time: '09:00-11:00', 
          activity: `游览${attractions[0]?.name || '当地景点'}`, 
          location: attractions[0]?.name || '当地景点', 
          details: `${attractions[0]?.name || '当地景点'}是${destination}著名的景点，建议游览2小时，可以体验当地文化和风景。` 
        },
        { 
          time: '11:30-13:00', 
          activity: '品尝当地特色美食', 
          location: '特色美食街', 
          details: '品尝当地特色美食，例如当地传统小吃、特色菜品等。' 
        },
        { 
          time: '13:30-15:30', 
          activity: `参观${attractions[1]?.name || '博物馆'}`, 
          location: attractions[1]?.name || '博物馆', 
          details: `了解${destination}的历史文化和发展，建议游览时间1.5-2小时。` 
        },
        { 
          time: '16:00-18:00', 
          activity: `漫步${attractions[2]?.name || '城市广场'}`, 
          location: attractions[2]?.name || '城市广场', 
          details: '欣赏城市风光，可以拍照留念，感受当地人文氛围。' 
        }
      ];
      
      // 构建模拟交通信息
      const transportation = [
        { 
          from: attractions[0]?.name || '景点A', 
          to: '特色美食街', 
          method: '步行/出租车', 
          details: '约15分钟步行或5分钟出租车' 
        },
        { 
          from: '特色美食街', 
          to: attractions[1]?.name || '景点B', 
          method: '公交/地铁', 
          details: '乘坐公交或地铁约20分钟' 
        },
        { 
          from: attractions[1]?.name || '景点B', 
          to: attractions[2]?.name || '景点C', 
          method: '步行', 
          details: '约15-20分钟步行' 
        }
      ];
      
      // 构建完整的旅游攻略
      const guide: TravelGuide = {
        title: `${destination}一日游`,
        date: formattedDate,
        weather: weatherInfo,
        overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。这份一日游攻略将帮助您高效地游览${destination}的主要景点，体验当地特色美食和文化。`,
        schedule: schedule,
        transportation: transportation,
        accommodation: {
          name: `${destination}国际酒店`,
          address: `${destination}市中心区`,
          checkin: '15:00',
          checkout: '12:00',
          price: '约500-800元/晚'
        },
        tips: [
          '携带有效身份证件，某些景点需要实名购票',
          `下载"${destination}地铁"APP方便出行`,
          '旺季景点人多，建议提前购买门票'
        ],
        emergency: {
          police: '110',
          ambulance: '120',
          tourist: '12301'
        },
        images: [
          `https://source.unsplash.com/random/400x200/?${encodeURIComponent(destination)}+tourism`,
          `https://source.unsplash.com/random/400x200/?${encodeURIComponent(destination)}+landmark`,
          `https://source.unsplash.com/random/400x200/?${encodeURIComponent(destination)}+food`
        ]
      };
      
      setTravelPlan(guide);
    } catch (err) {
      console.error("旅游攻略生成错误:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('获取旅游攻略失败，请稍后重试');
      }
    } finally {
      setLoading(false);
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
          旅游景点路线攻略
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="请输入旅游目的地（例如：北京、上海、云南...）"
                variant="outlined"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
                <DatePicker
                  label="选择旅游日期"
                  value={travelDate}
                  onChange={(newValue) => setTravelDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ExploreIcon />}
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
                {loading ? '生成中...' : '生成攻略'}
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

      {travelPlan && (
        <Box component={motion.div} variants={contentVariants} initial="hidden" animate="visible">
          {/* 旅游攻略标题区 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <Typography 
                variant="h4" 
                align="center"
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main',
                  borderBottom: '2px solid #f0f0f0',
                  pb: 2,
                  mb: 3
                }}
              >
                {destination}一日游行程规划表
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TodayIcon sx={{ 
                    mr: 1, 
                    color: isDark ? 'primary.main' : 'primary.dark',
                    fontSize: '1.2rem'
                  }} />
                  <Typography variant="body1">
                    {travelDate?.getFullYear()}年
                    {String(travelDate ? travelDate.getMonth() + 1 : 1).padStart(2, '0')}月
                    {String(travelDate ? travelDate.getDate() : 1).padStart(2, '0')}日
                    （{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][travelDate ? travelDate.getDay() : 0]}）
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>旅行者：来自B602的张小明</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              {/* 天气信息 */}
              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <WeatherIcon sx={{ 
                    mr: 1, 
                    color: isDark ? 'primary.main' : 'primary.dark',
                    fontSize: '1.2rem'
                  }} />
                  <Typography variant="body1">白天: {travelPlan.weather?.split('/')[0] || '晴'}, {Math.round(Math.random() * 10) + 15}°C</Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <WeatherIcon sx={{ 
                    mr: 1, 
                    color: isDark ? 'primary.main' : 'primary.dark',
                    fontSize: '1.2rem'
                  }} />
                  <Typography variant="body1">夜间: {travelPlan.weather?.split('/')[1] || '晴'}, {Math.round(Math.random() * 5) + 5}°C</Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                  <WeatherIcon sx={{ 
                    mr: 1, 
                    color: isDark ? 'primary.main' : 'primary.dark',
                    fontSize: '1.2rem'
                  }} />
                  <Typography variant="body1">东风, 风力1-3级</Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* 行程安排 - 表格形式 */}
          <motion.div variants={itemVariants}>
            <TableContainer component={Paper} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', width: '15%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                        时间
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'white', width: '15%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PlaceIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                        地点
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'white', width: '55%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ActivityIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                        活动详情
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'white', width: '15%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                        备注
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {travelPlan.schedule.map((item, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:nth-of-type(odd)': { 
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' 
                        },
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {item.time}
                      </TableCell>
                      <TableCell>
                        {item.location.split(' ')[0]}
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                          {item.location.split(' ')[1] || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          {item.activity}
                        </Typography>
                        <Typography variant="body2">
                          {item.details}
                        </Typography>
                        {index === 0 && (
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            推荐景点: 大观山、玉珍塔、万花楼、九曲桥
                          </Typography>
                        )}
                        {index === 1 && (
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            推荐: 南翔小笼包、生煎包、蟹黄汤包、梨膏糖
                          </Typography>
                        )}
                        {index === 2 && (
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            特色: 259米观光层、上海城市历史发展陈列馆
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {index === 0 && (
                          <>
                            <Chip 
                              label="门票: 40元" 
                              size="small" 
                              sx={{ mb: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }} 
                            />
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              建议游览: 2小时
                            </Typography>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <Chip 
                              icon={<RestaurantIcon />} 
                              label="午餐" 
                              size="small"
                              sx={{ mb: 1, bgcolor: 'success.light', color: 'success.contrastText' }} 
                            />
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              购物: 传统手工艺品
                            </Typography>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <Chip 
                              label="门票: 80元起" 
                              size="small" 
                              sx={{ mb: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }} 
                            />
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              建议游览: 1.5小时
                            </Typography>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <Chip 
                              icon={<WalkIcon />} 
                              label="徒步活动" 
                              size="small"
                              sx={{ mb: 1, bgcolor: 'info.light', color: 'info.contrastText' }} 
                            />
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              摄影好去处
                            </Typography>
                          </>
                        )}
                        {index > 3 && (
                          <>
                            <Chip 
                              label={index % 2 === 0 ? "免费" : "船票: 约120元"} 
                              size="small" 
                              sx={{ 
                                mb: 1, 
                                bgcolor: index % 2 === 0 ? 'success.light' : 'warning.light', 
                                color: index % 2 === 0 ? 'success.contrastText' : 'warning.contrastText' 
                              }} 
                            />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>

          {/* 交通信息 - 使用卡片布局 */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 1
                    }}
                  >
                    <CommuteIcon sx={{ 
                      mr: 1, 
                      color: isDark ? 'primary.main' : 'primary.dark',
                      fontSize: '1.3rem'
                    }} /> 
                    豫园 → 东方明珠
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                    <TransitIcon sx={{ 
                      mr: 1, 
                      color: isDark ? 'success.main' : 'success.dark', 
                      mt: 0.5,
                      fontSize: '1.2rem'
                    }} />
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        乘坐地铁14号线（豫园站→陆家嘴站）
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        陆家嘴站步行约10分钟到达东方明珠
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        总耗时: 约25分钟
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 1
                    }}
                  >
                    <CommuteIcon sx={{ 
                      mr: 1, 
                      color: isDark ? 'primary.main' : 'primary.dark',
                      fontSize: '1.3rem'
                    }} /> 
                    东方明珠 → 迪士尼小镇
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                    <TransitIcon sx={{ 
                      mr: 1, 
                      color: isDark ? 'success.main' : 'success.dark', 
                      mt: 0.5,
                      fontSize: '1.2rem'
                    }} />
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        地铁2号线（陆家嘴 → 龙阳路）
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        16号线（龙阳路 → 罗山路）
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        11号线（罗山路 → 迪士尼站）
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        总耗时: 约50分钟
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>

          {/* 餐饮推荐 & 实用提示 */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 1
                    }}
                  >
                    <RestaurantIcon sx={{ 
                      mr: 1, 
                      color: isDark ? 'primary.main' : 'primary.dark',
                      fontSize: '1.3rem'
                    }} /> 
                    餐饮推荐
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      南翔馒头店（豫园店）⭐⭐
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      招牌: 小笼包
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      位置: 豫园商城内
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      绿波廊 ⭐⭐⭐
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      招牌: 本帮菜、蟹粉狮子头
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      位置: 豫园内
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      老饭店 ⭐⭐
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      招牌: 红烧肉、松鼠桂鱼
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      位置: 福佑路
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      上海国金汇美食广场 ⭐⭐
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      多种选择
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      位置: 陆家嘴，东方明珠附近
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      pb: 1
                    }}
                  >
                    <InfoIcon sx={{ 
                      mr: 1, 
                      color: isDark ? 'primary.main' : 'primary.dark',
                      fontSize: '1.3rem'
                    }} /> 
                    实用提示
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <WarningIcon sx={{ 
                        mr: 1, 
                        color: isDark ? 'warning.main' : 'warning.dark', 
                        fontSize: '1.1rem', 
                        mt: 0.3 
                      }} />
                      <Typography variant="body2">
                        建议提前在手机上下载"上海地铁"APP，方便查询地铁路线
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <WarningIcon sx={{ 
                        mr: 1, 
                        color: isDark ? 'warning.main' : 'warning.dark', 
                        fontSize: '1.1rem', 
                        mt: 0.3 
                      }} />
                      <Typography variant="body2">
                        准备雨伞，3月底的上海天气多变
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <WarningIcon sx={{ 
                        mr: 1, 
                        color: isDark ? 'warning.main' : 'warning.dark', 
                        fontSize: '1.1rem', 
                        mt: 0.3 
                      }} />
                      <Typography variant="body2">
                        游览东方明珠建议避开12:00-14:00高峰期
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <WarningIcon sx={{ 
                        mr: 1, 
                        color: isDark ? 'warning.main' : 'warning.dark', 
                        fontSize: '1.1rem', 
                        mt: 0.3 
                      }} />
                      <Typography variant="body2">
                        前往豫园时注意保管好随身物品，景区游客较多
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <WarningIcon sx={{ 
                        mr: 1, 
                        color: isDark ? 'warning.main' : 'warning.dark', 
                        fontSize: '1.1rem', 
                        mt: 0.3 
                      }} />
                      <Typography variant="body2">
                        提前充值交通卡或准备移动支付（支付宝、微信）
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <WarningIcon sx={{ 
                        mr: 1, 
                        color: isDark ? 'warning.main' : 'warning.dark', 
                        fontSize: '1.1rem', 
                        mt: 0.3 
                      }} />
                      <Typography variant="body2">
                        上海迪士尼度假区需提前预订，小镇无需门票
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>

          {/* 紧急联系信息 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ 
                    mr: 0.5, 
                    fontSize: '1.1rem',
                    color: isDark ? 'primary.main' : 'primary.dark'
                  }} /> 旅游咨询: 021-12301
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ 
                    mr: 0.5, 
                    fontSize: '1.1rem',
                    color: isDark ? 'primary.main' : 'primary.dark'
                  }} /> 紧急救援: 120
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ 
                    mr: 0.5, 
                    fontSize: '1.1rem',
                    color: isDark ? 'primary.main' : 'primary.dark'
                  }} /> 报警电话: 110
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" color="text.secondary">
                    祝您旅途愉快!
                  </Typography>
                </Box>
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
                打印攻略
              </Button>
            </Box>
          </motion.div>
        </Box>
      )}
    </Container>
  );
};

export default TravelRoutes; 