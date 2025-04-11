import React, { useState } from 'react';
import { 
  Box, 
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { 
  Explore as ExploreIcon, 
  Today as TodayIcon, 
  WbSunny as WeatherIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhCN } from 'date-fns/locale';
import { motion } from 'framer-motion';

// Interface for travel plan data
interface TravelPlan {
  title: string;
  date: string;
  weather: string;
  overview: string;
  schedule: {
    time: string;
    activity: string;
    location: string;
    details: string;
  }[];
  transportation: {
    from: string;
    to: string;
    method: string;
    details: string;
  }[];
  accommodation: {
    name: string;
    address: string;
    checkin: string;
    checkout: string;
    price: string;
  };
  tips: string[];
  emergency: {
    police: string;
    ambulance: string;
    tourist: string;
  };
}

const TravelGuide: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)); // Default to 3 days later
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleGeneratePlan = async () => {
    if (!destination.trim()) {
      setError('请输入旅游目的地');
      return;
    }

    if (!startDate || !endDate) {
      setError('请选择旅游日期');
      return;
    }

    if (endDate < startDate) {
      setError('结束日期必须晚于开始日期');
      return;
    }

    setLoading(true);
    setTravelPlan(null);
    setError('');

    try {
      // Check if the APIs are available
      // @ts-ignore
      const isGeoAPIAvailable = typeof window.mcp_amap_amap_sse_maps_geo === 'function';
      // @ts-ignore
      const isWeatherAPIAvailable = typeof window.mcp_amap_amap_sse_maps_weather === 'function';
      // @ts-ignore
      const isPOIAPIAvailable = typeof window.mcp_amap_amap_sse_maps_text_search === 'function';
      
      console.log("API可用性检查:", { isGeoAPIAvailable, isWeatherAPIAvailable, isPOIAPIAvailable });
      
      // Default city info
      let cityInfo = {
        city: destination,
        adcode: '',
        location: '116.397428,39.90923' // Default Beijing coordinates
      };
      
      // Get geo information if API is available
      if (isGeoAPIAvailable) {
        try {
          // @ts-ignore
          const geoResult = await window.mcp_amap_amap_sse_maps_geo({
            address: destination,
          });
          
          console.log("地理编码API返回:", geoResult);
          
          if (geoResult.data && geoResult.data.geocodes && geoResult.data.geocodes.length > 0) {
            const geocode = geoResult.data.geocodes[0];
            cityInfo = {
              city: geocode.city || destination,
              adcode: geocode.adcode || '',
              location: geocode.location || cityInfo.location
            };
          }
        } catch (error) {
          console.error("地理编码API调用失败:", error);
        }
      }
      
      // Get weather information
      let weatherInfo = '晴朗，23°C/12°C，北风1-3级';
      
      if (isWeatherAPIAvailable) {
        try {
          // @ts-ignore
          const weatherResult = await window.mcp_amap_amap_sse_maps_weather({
            city: cityInfo.adcode || cityInfo.city
          });
          
          console.log("天气API返回:", weatherResult);
          
          if (weatherResult.data && weatherResult.data.forecasts && weatherResult.data.forecasts.length > 0) {
            const forecast = weatherResult.data.forecasts[0].casts[0];
            weatherInfo = `${forecast.dayweather}/${forecast.nightweather}，${forecast.daytemp}°C/${forecast.nighttemp}°C，${forecast.daywind}风${forecast.daypower}级`;
          }
        } catch (error) {
          console.error("天气API调用失败:", error);
        }
      }
      
      // Get POI (Points of Interest) information
      interface Attraction {
        name: string;
        address: string;
        location: string;
        type: string;
      }
      
      // Default attractions for popular destinations
      const defaultAttractions: { [key: string]: Attraction[] } = {
        '北京': [
          { name: '故宫博物院', address: '北京市东城区景山前街4号', location: '116.397026,39.918058', type: '博物馆' },
          { name: '天安门广场', address: '北京市东城区东长安街', location: '116.397389,39.908857', type: '广场' },
          { name: '颐和园', address: '北京市海淀区新建宫门路19号', location: '116.2755,40.0027', type: '公园' },
          { name: '八达岭长城', address: '北京市延庆区G6京藏高速58号出口', location: '116.024067,40.354188', type: '古迹' }
        ],
        '上海': [
          { name: '外滩', address: '上海市黄浦区中山东一路', location: '121.490317,31.236831', type: '景区' },
          { name: '东方明珠', address: '上海市浦东新区世纪大道1号', location: '121.499705,31.239673', type: '塔台' },
          { name: '豫园', address: '上海市黄浦区安仁街218号', location: '121.492289,31.227401', type: '园林' },
          { name: '上海迪士尼乐园', address: '上海市浦东新区川沙新镇黄赵路310号', location: '121.674272,31.146907', type: '主题乐园' }
        ],
        '广州': [
          { name: '广州塔', address: '广州市海珠区阅江西路222号', location: '113.330804,23.113051', type: '塔台' },
          { name: '白云山风景区', address: '广州市白云区广园中路', location: '113.308035,23.184204', type: '风景区' },
          { name: '陈家祠', address: '广州市荔湾区中山七路恩龙里34号', location: '113.260669,23.134718', type: '古迹' },
          { name: '长隆欢乐世界', address: '广州市番禺区迎宾路', location: '113.329018,22.998496', type: '主题乐园' }
        ],
        '云南': [
          { name: '昆明石林世界地质公园', address: '昆明市石林县', location: '103.2906,24.7736', type: '地质公园' },
          { name: '九乡风景区', address: '昆明市宜良县', location: '103.3312,24.9128', type: '风景区' },
          { name: '抚仙湖', address: '玉溪市澄江市', location: '102.8984,24.5331', type: '湖泊' },
          { name: '大理古城', address: '大理白族自治州大理市', location: '100.1607,25.6936', type: '古城' }
        ]
      };
      
      let attractions: Attraction[] = [];
      
      if (isPOIAPIAvailable) {
        try {
          // @ts-ignore
          const poiResult = await window.mcp_amap_amap_sse_maps_text_search({ 
            keywords: `${destination} 景点`, 
            city: cityInfo.city,
            citylimit: true
          });
          
          console.log("POI搜索API返回:", poiResult);
          
          if (poiResult.data && poiResult.data.pois && poiResult.data.pois.length > 0) {
            attractions = poiResult.data.pois.slice(0, 4).map((poi: any) => ({
              name: poi.name,
              address: poi.address || '详细地址信息未提供',
              location: `${poi.location}`,
              type: poi.type || '景点'
            }));
          }
        } catch (error) {
          console.error("POI搜索API调用失败:", error);
        }
      }
      
      // If API doesn't return data, use default attractions
      if (attractions.length === 0) {
        attractions = defaultAttractions[destination] || [
          { name: `${destination}博物馆`, address: `${destination}市中心区`, location: '', type: '博物馆' },
          { name: `${destination}中心广场`, address: `${destination}市中心区`, location: '', type: '广场' },
          { name: `${destination}公园`, address: `${destination}市郊区`, location: '', type: '公园' },
          { name: `${destination}古迹`, address: `${destination}市历史区`, location: '', type: '古迹' }
        ];
      }
      
      // Generate schedule based on number of days
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const periodNames = ['上午', '中午', '下午', '晚上'];
      const schedule: {
        time: string;
        activity: string;
        location: string;
        details: string;
      }[] = [];
      
      // If we have enough attractions, spread them across days
      let attractionIndex = 0;
      for (let day = 0; day < Math.min(days, 5); day++) {
        // For each day, create 4 time periods (morning, noon, afternoon, evening)
        for (let period = 0; period < 4; period++) {
          const attraction = attractions[attractionIndex % attractions.length];
          attractionIndex++;
          
          let activity = '';
          let details = '';
          
          if (period === 0) {
            activity = `游览${attraction.name}`;
            details = `${attraction.name}是${destination}著名的景点，建议游览2小时，可以体验当地文化和风景。`;
          } else if (period === 1) {
            activity = '品尝当地特色美食';
            details = '品尝当地特色美食，例如当地传统小吃、特色菜品等。';
          } else if (period === 2) {
            activity = `参观${attraction.name}`;
            details = `了解${destination}的历史文化和发展，建议游览时间1.5-2小时。`;
          } else {
            activity = `${day < days - 1 ? '夜游' : '返程前游览'}${attraction.name}`;
            details = `${day < days - 1 ? '欣赏夜景，感受当地夜生活氛围' : '最后一天，收拾行李准备返程，临行前再次感受当地风光'}。`;
          }
          
          schedule.push({
            time: periodNames[period],
            activity: activity,
            location: period === 1 ? '特色美食街' : attraction.name,
            details: details
          });
        }
      }
      
      // Generate transportation information
      const transportation: {
        from: string;
        to: string;
        method: string;
        details: string;
      }[] = [];
      for (let i = 0; i < attractions.length - 1; i++) {
        const from = attractions[i].name;
        const to = attractions[i + 1].name;
        
        // Calculate rough distance if locations are available
        let distance = '约50公里';
        let duration = '约1小时';
        
        if (attractions[i].location && attractions[i + 1].location) {
          const [fromLng, fromLat] = attractions[i].location.split(',');
          const [toLng, toLat] = attractions[i + 1].location.split(',');
          
          // Simple distance calculation (very rough)
          const distanceKm = Math.round(
            Math.sqrt(
              Math.pow((parseFloat(fromLng) - parseFloat(toLng)) * 111, 2) + 
              Math.pow((parseFloat(fromLat) - parseFloat(toLat)) * 111, 2)
            )
          );
          
          distance = `约${distanceKm}公里`;
          duration = `约${Math.ceil(distanceKm / 60)}小时${distanceKm % 60}分钟`;
        }
        
        transportation.push({
          from: from,
          to: to,
          method: '汽车',
          details: `${distance}|${duration}`
        });
      }
      
      // Format date string
      const formatDate = (date: Date) => {
        return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
      };
      
      // Create travel plan
      const travelPlan: TravelPlan = {
        title: `${destination}精华游`,
        date: `${formatDate(startDate)} 至 ${formatDate(endDate)}`,
        weather: weatherInfo,
        overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。这份${days}日游攻略将帮助您高效地游览${destination}的主要景点，体验当地特色美食和文化。`,
        schedule: schedule,
        transportation: transportation,
        accommodation: {
          name: `${destination}国际酒店`,
          address: `${destination}市中心区`,
          checkin: '14:00后',
          checkout: '次日12:00前',
          price: '388-688元/晚'
        },
        tips: [
          '携带有效身份证件，某些景点需要实名购票',
          `下载"${destination}地铁"APP方便出行`,
          '旺季景点人多，建议提前购买门票',
          `行程总预算：约${days * 1000}-${days * 1500}元/人（不含住宿）`,
          '注意天气变化，带好防晒或雨具'
        ],
        emergency: {
          police: '110',
          ambulance: '120',
          tourist: '12301'
        }
      };
      
      setTravelPlan(travelPlan);
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

  // Animation variants
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
          旅游攻略
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
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
                <DatePicker
                  label="开始日期"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
                <DatePicker
                  label="结束日期"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleGeneratePlan}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ExploreIcon />}
                sx={{ 
                  py: 1.5,
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
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 2, 
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main',
                  mb: 2
                }}
              >
                {travelPlan.title}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TodayIcon sx={{ 
                    mr: 1, 
                    color: isDark ? 'primary.main' : 'primary.dark',
                    fontSize: '1.2rem'
                  }} />
                  <Typography variant="body1">
                    日期: {travelPlan.date}（{startDate && endDate ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}天行程` : ''}）
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              {/* 天气信息 */}
              <Box sx={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <WeatherIcon color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>天气: 晴朗</Typography>
                <Typography variant="body2">温度: 23°C/12°C</Typography>
                <Typography variant="body2">风向: 北风1-3级</Typography>
              </Box>
            </Paper>
          </motion.div>

          {/* 行程概览 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  mb: 3
                }}
              >
                行程概览
              </Typography>

              <Box sx={{ ml: 2 }}>
                {travelPlan.schedule.map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: index === 0 ? 'warning.main' : 
                                 index === 1 ? 'error.main' : 
                                 index === 2 ? 'success.main' : 'info.main',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mr: 2,
                        mt: 0.5
                      }}
                    >
                      •
                    </Box>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: index === 0 ? 'warning.main' : 
                                  index === 1 ? 'error.main' : 
                                  index === 2 ? 'success.main' : 'info.main',
                        }}
                      >
                        {item.time}: {item.activity}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>

          {/* 详细时间表 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, overflow: 'hidden' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  mb: 3
                }}
              >
                详细时间表
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <Box 
                  component="table" 
                  sx={{ 
                    width: '100%', 
                    borderCollapse: 'collapse', 
                    '& th, & td': { 
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      textAlign: 'left'
                    },
                    '& th': {
                      bgcolor: 'primary.main',
                      color: 'white'
                    },
                    '& tr:nth-of-type(even)': {
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <Box component="thead">
                    <Box component="tr">
                      <Box component="th" sx={{ width: '10%' }}>时间</Box>
                      <Box component="th" sx={{ width: '20%' }}>活动</Box>
                      <Box component="th" sx={{ width: '20%' }}>地点</Box>
                      <Box component="th" sx={{ width: '50%' }}>详情</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {travelPlan.schedule.map((item, index) => (
                      <Box component="tr" key={index}>
                        <Box component="td">
                          {index === 0 && <Box sx={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', bgcolor: 'warning.main', mr: 1 }}></Box>}
                          {index === 1 && <Box sx={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }}></Box>}
                          {index === 2 && <Box sx={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }}></Box>}
                          {index === 3 && <Box sx={{ display: 'inline-block', width: 20, height: 20, borderRadius: '50%', bgcolor: 'info.main', mr: 1 }}></Box>}
                          {item.time}
                        </Box>
                        <Box component="td">{item.activity}</Box>
                        <Box component="td">{item.location}</Box>
                        <Box component="td">
                          <Typography variant="body2">{item.details}</Typography>
                          {index === 0 && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                              门票: 130元
                              <br />
                              推荐: 阿诗玛景区、石林
                            </Typography>
                          )}
                          {index === 1 && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                              门票: 90元
                              <br />
                              推荐: 溶洞游览、地下河漂流
                            </Typography>
                          )}
                          {index === 2 && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                              门票: 免费
                              <br />
                              推荐: 湖边漫步、日落景观
                            </Typography>
                          )}
                          {index === 3 && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                              门票: 免费
                              <br />
                              推荐: 洋人街、五华楼、夜市
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* 交通信息 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  mb: 3
                }}
              >
                交通信息
              </Typography>

              <Box sx={{ ml: 2 }}>
                {travelPlan.transportation.map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      mb: 2,
                      pb: 2,
                      borderBottom: index < travelPlan.transportation.length - 1 ? '1px dashed' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 10,
                          height: 10,
                          mr: 1
                        }}
                      ></Box>
                      <Typography variant="body1">{item.from}</Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        mx: 2, 
                        color: 'warning.main',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      →
                      <Chip 
                        label={item.details} 
                        size="small" 
                        sx={{ mx: 1, bgcolor: 'warning.light', color: 'warning.contrastText' }} 
                      />
                      →
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'error.main', 
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 10,
                          height: 10,
                          mr: 1
                        }}
                      ></Box>
                      <Typography variant="body1">{item.to}</Typography>
                    </Box>
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                  交通方式: 推荐包车自驾出行，各景点间距离较远。
                </Typography>
              </Box>
            </Paper>
          </motion.div>

          {/* 住宿信息和特色美食 */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      pl: 2,
                      py: 1,
                      mb: 3
                    }}
                  >
                    住宿信息
                  </Typography>

                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      <span role="img" aria-label="hotel">🏨</span> {travelPlan.accommodation.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {travelPlan.accommodation.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      电话: 0872-2677888
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <span role="img" aria-label="check-in">🔑</span> 入住: {travelPlan.accommodation.checkin} | 退房: {travelPlan.accommodation.checkout}
                    </Typography>
                    <Typography variant="body2">
                      <span role="img" aria-label="price">💰</span> 价格区间: {travelPlan.accommodation.price}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      pl: 2,
                      py: 1,
                      mb: 3
                    }}
                  >
                    特色美食
                  </Typography>

                  <Box sx={{ ml: 2 }}>
                    {destination === '云南' && (
                      <>
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍽️</span> 
                          石林: 小鹏味道
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          彝族烤肉，石林酸鱼
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍲</span> 
                          抚仙湖: 湖滨钓鱼鱼
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          抚仙湖特色鱼料理
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🥂</span> 
                          大理: 段公子餐厅
                        </Typography>
                        <Typography variant="body2">
                          白族三道茶，砂锅鱼，乳扇
                        </Typography>
                      </>
                    )}
                    
                    {destination === '北京' && (
                      <>
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍽️</span> 
                          前门: 全聚德烤鸭
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          北京烤鸭，配以甜面酱、葱丝和黄瓜丝
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍲</span> 
                          王府井: 东来顺涮羊肉
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          老北京铜锅涮羊肉，配以麻酱蘸料
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🥂</span> 
                          什刹海: 老北京小吃街
                        </Typography>
                        <Typography variant="body2">
                          豆汁、炒肝、爆肚、酱牛肉、驴打滚
                        </Typography>
                      </>
                    )}
                    
                    {destination === '上海' && (
                      <>
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍽️</span> 
                          南京路: 绿波廊
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          蟹粉小笼包，本帮红烧肉
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍲</span> 
                          城隍庙: 南翔馒头店
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          上海小笼包，蟹壳黄
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🥂</span> 
                          豫园: 老饭店
                        </Typography>
                        <Typography variant="body2">
                          葱烧海参，红烧划水
                        </Typography>
                      </>
                    )}
                    
                    {destination === '广州' && (
                      <>
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍽️</span> 
                          沙面: 陶陶居
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          广式点心，虾饺皇，叉烧包
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍲</span> 
                          荔湾区: 浩记
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          广州艇仔粥，濑粉
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🥂</span> 
                          北京路: 莲香楼
                        </Typography>
                        <Typography variant="body2">
                          广式早茶，老火靓汤
                        </Typography>
                      </>
                    )}
                    
                    {!['云南', '北京', '上海', '广州'].includes(destination) && (
                      <>
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍽️</span> 
                          {destination}市中心: 当地特色餐厅
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          品尝{destination}当地特色美食
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🍲</span> 
                          {destination}老街: 传统小吃
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          体验当地传统小吃文化
                        </Typography>
    
                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <span role="img" aria-label="food" style={{ marginRight: '8px' }}>🥂</span> 
                          {destination}夜市: 美食广场
                        </Typography>
                        <Typography variant="body2">
                          夜市小吃，海鲜烧烤
                        </Typography>
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>

          {/* 实用提示 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  mb: 3
                }}
              >
                实用提示
              </Typography>

              <Box sx={{ ml: 2 }}>
                {travelPlan.tips.map((tip, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box 
                      component="span" 
                      role="img" 
                      aria-label="tip" 
                      sx={{ 
                        mr: 2,
                        color: index % 2 === 0 ? 'primary.main' : 'warning.main'
                      }}
                    >
                      {index === 0 ? '☂️' : 
                       index === 1 ? '💧' : 
                       index === 2 ? '💊' :
                       index === 3 ? '💰' : '⚠️'}
                    </Box>
                    <Typography variant="body2">{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>

          {/* 重要联系方式 */}
          <motion.div variants={itemVariants}>
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  mb: 3
                }}
              >
                重要联系方式
              </Typography>

              <Box sx={{ ml: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <span role="img" aria-label="ambulance" style={{ marginRight: '8px' }}>🚑</span>
                      急救中心: {travelPlan.emergency.ambulance}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <span role="img" aria-label="police" style={{ marginRight: '8px' }}>🚓</span>
                      报警中心: {travelPlan.emergency.police}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <span role="img" aria-label="info" style={{ marginRight: '8px' }}>ℹ️</span>
                      旅游咨询: {
                        destination === '云南' ? '0871-65394849 (云南旅游热线)' :
                        destination === '北京' ? '010-12301 (北京旅游热线)' :
                        destination === '上海' ? '021-12301 (上海旅游热线)' :
                        destination === '广州' ? '020-12301 (广州旅游热线)' :
                        '12301 (全国旅游服务热线)'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <span role="img" aria-label="road" style={{ marginRight: '8px' }}>🛣️</span>
                      道路救援: 122
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </motion.div>

          {/* 页脚 */}
          <motion.div variants={itemVariants}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                color: 'text.secondary', 
                fontSize: '0.8rem',
                mb: 4
              }}
            >
              © {new Date().getFullYear()} {destination}精华游行程规划表 | 打印日期: {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/')}
            </Box>
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

export default TravelGuide;
