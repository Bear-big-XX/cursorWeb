/**
 * 高德地图服务工具
 * 用于整合高德地图API相关功能，实现位置搜索、路线规划等
 */

// 基础接口定义
export interface Location {
  lng: string; // 经度
  lat: string; // 纬度
}

export interface GeocodingResult {
  location: Location;
  formattedAddress: string;
  province: string;
  city: string;
  district: string;
  adcode: string;
}

// 通用路线步骤接口
export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  road?: string;
}

// 驾车路线
export interface DrivingRoute {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  toll: string;
  gasoline: string;
  trafficLights: string;
  steps: RouteStep[];
  tips: string[];
  alternativeRoutes?: {
    name: string;
    distance: string;
    duration: string;
    description: string;
  }[];
}

// 步行路线
export interface WalkingRoute {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  calories: string;
  steps: RouteStep[];
  interestPoints: {
    name: string;
    type: string;
    distance: string;
    description: string;
    image: string;
  }[];
  tips: string[];
}

// 骑行路线
export interface BicyclingRoute {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  calories: string;
  elevation: string;
  steps: RouteStep[];
  restPoints: {
    name: string;
    type: string;
    distance: string;
    description: string;
    image: string;
  }[];
  tips: string[];
  roadCondition: string;
}

// 旅游攻略
export interface TravelGuide {
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
  images: string[];
}

/**
 * 地址转换为经纬度坐标
 * 
 * @param address 详细地址
 * @param city 城市（可选）
 * @returns 地理编码结果
 */
export const geocodeAddress = async (address: string, city?: string): Promise<GeocodingResult> => {
  try {
    // 使用window对象调用高德API
    // @ts-ignore
    const geoResult = await window.mcp_amap_amap_sse_maps_geo({
      address: address,
      city: city || ''
    });
    
    console.log("地理编码API返回:", geoResult);
    
    // 处理API返回的结果
    if (!geoResult.data || !geoResult.data.geocodes || geoResult.data.geocodes.length === 0) {
      throw new Error("无法解析地址，请输入更准确的地址");
    }
    
    const geocode = geoResult.data.geocodes[0];
    const location = geocode.location.split(',');
    
    return {
      location: { 
        lng: location[0], 
        lat: location[1] 
      },
      formattedAddress: geocode.formatted_address || `${city || ''}${address}`,
      province: geocode.province || '',
      city: geocode.city || city || '',
      district: geocode.district || '',
      adcode: geocode.adcode || ''
    };
  } catch (error) {
    console.error("地理编码错误:", error);
    throw new Error("地址转换失败，请检查输入的地址是否正确");
  }
};

/**
 * 获取驾车路线规划
 * 
 * @param originAddress 起点地址
 * @param destinationAddress 终点地址
 * @returns 驾车路线规划
 */
export const getDrivingRoute = async (originAddress: string, destinationAddress: string): Promise<DrivingRoute> => {
  try {
    // 1. 地理编码：将地址转换为经纬度
    const originGeocode = await geocodeAddress(originAddress);
    const destGeocode = await geocodeAddress(destinationAddress);
    
    // 2. 调用高德驾车路线规划API
    // 示例：使用mcp_amap_amap_sse_maps_direction_driving函数
    // const origin = `${originGeocode.location.lng},${originGeocode.location.lat}`;
    // const destination = `${destGeocode.location.lng},${destGeocode.location.lat}`;
    // const drivingResult = await mcp_amap_amap_sse_maps_direction_driving({ origin, destination });
    
    // 3. 处理API返回结果，转换为应用所需的格式
    
    // 示例数据（实际项目中应解析API返回数据）
    return {
      origin: originAddress,
      destination: destinationAddress,
      distance: "28.5公里",
      duration: "45分钟",
      toll: "约15元",
      gasoline: "约22元",
      trafficLights: "沿途约12个红绿灯",
      steps: [
        {
          instruction: "从起点出发",
          distance: "0.1公里",
          duration: "1分钟"
        },
        {
          instruction: "沿着中关村大街向南行驶",
          distance: "2.5公里",
          duration: "6分钟",
          road: "中关村大街"
        },
        {
          instruction: "右转进入西三环北路",
          distance: "4.3公里",
          duration: "8分钟",
          road: "西三环北路"
        },
        // 更多路线步骤...
        {
          instruction: "到达终点",
          distance: "0公里",
          duration: "0分钟"
        }
      ],
      tips: [
        "路线途经收费站，请准备好足够的现金或电子支付方式",
        "此路线在早晚高峰期可能拥堵，建议错峰出行",
        "部分路段可能有交通管制或施工，请关注路况信息"
      ]
    };
  } catch (error) {
    console.error("获取驾车路线错误:", error);
    throw new Error("获取驾车路线失败，请稍后重试");
  }
};

/**
 * 获取步行路线规划
 * 
 * @param originAddress 起点地址
 * @param destinationAddress 终点地址
 * @returns 步行路线规划
 */
export const getWalkingRoute = async (originAddress: string, destinationAddress: string): Promise<WalkingRoute> => {
  try {
    // 1. 地理编码：将地址转换为经纬度
    const originGeocode = await geocodeAddress(originAddress);
    const destGeocode = await geocodeAddress(destinationAddress);
    
    // 2. 调用高德步行路线规划API
    // 示例：使用mcp_amap_amap_sse_maps_direction_walking函数
    // const origin = `${originGeocode.location.lng},${originGeocode.location.lat}`;
    // const destination = `${destGeocode.location.lng},${destGeocode.location.lat}`;
    // const walkingResult = await mcp_amap_amap_sse_maps_direction_walking({ origin, destination });
    
    // 3. 处理API返回结果，转换为应用所需的格式
    
    // 4. 根据路线附近搜索兴趣点
    // 示例：沿路线搜索餐厅、公园等POI
    
    // 示例数据（实际项目中应解析API返回数据）
    const caloriesPerKm = 65; // 每公里消耗的大约卡路里
    const distanceInKm = 3.2;
    const estimatedCalories = Math.round(distanceInKm * caloriesPerKm);
    
    return {
      origin: originAddress,
      destination: destinationAddress,
      distance: `${distanceInKm}公里`,
      duration: "40分钟",
      calories: `约${estimatedCalories}卡路里`,
      steps: [
        {
          instruction: "从起点出发",
          distance: "0.1公里",
          duration: "1分钟"
        },
        {
          instruction: "沿着人民路向东步行",
          distance: "0.6公里",
          duration: "8分钟",
          road: "人民路"
        },
        // 更多步行路线步骤...
        {
          instruction: "到达终点",
          distance: "0公里",
          duration: "0分钟"
        }
      ],
      interestPoints: [
        {
          name: "城市公园",
          type: "休闲地点",
          distance: "步行路线起点300米处",
          description: "城市最大的公园，有湖泊和步行道，适合休息和拍照",
          image: "https://source.unsplash.com/random/400x200/?city+park"
        },
        // 更多兴趣点...
      ],
      tips: [
        "全程为平坦路面，适合各年龄段人群步行",
        "路线中段有公共卫生间和饮水点",
        "全程有遮阳树木，夏季步行也较为舒适"
      ]
    };
  } catch (error) {
    console.error("获取步行路线错误:", error);
    throw new Error("获取步行路线失败，请稍后重试");
  }
};

/**
 * 获取骑行路线规划
 * 
 * @param originAddress 起点地址
 * @param destinationAddress 终点地址
 * @returns 骑行路线规划
 */
export const getBicyclingRoute = async (originAddress: string, destinationAddress: string): Promise<BicyclingRoute> => {
  try {
    // 直接用参数调用API，不进行地理编码转换
    // @ts-ignore
    const bicyclingResult = await window.mcp_amap_amap_sse_maps_direction_bicycling({ 
      origin: originAddress, 
      destination: destinationAddress
    });
    
    console.log("高德骑行路线API返回:", bicyclingResult);
    
    // 处理API返回结果，转换为应用所需的格式
    const routeData = bicyclingResult.data;
    
    if (!routeData || !routeData.paths || routeData.paths.length === 0) {
      throw new Error("未找到合适的骑行路线");
    }
    
    // 获取第一条路线信息
    const path = routeData.paths[0];
    
    // 处理路线步骤
    const steps = path.steps.map((step: any, index: number) => {
      return {
        instruction: step.instruction || `路段${index + 1}`,
        distance: `${(step.distance / 1000).toFixed(1)}公里`,
        duration: `${Math.ceil(step.duration / 60)}分钟`,
        road: step.road || ''
      };
    });
    
    // 计算消耗的卡路里 (约30卡/公里)
    const distanceInKm = path.distance / 1000;
    const caloriesPerKm = 30;
    const estimatedCalories = Math.round(distanceInKm * caloriesPerKm);
    
    // 构建路线信息
    return {
      origin: originAddress,
      destination: destinationAddress,
      distance: `${distanceInKm.toFixed(1)}公里`,
      duration: `${Math.ceil(path.duration / 60)}分钟`,
      calories: `约${estimatedCalories}卡路里`,
      elevation: path.elevation ? `累计爬升${path.elevation}米` : "暂无海拔数据",
      roadCondition: "大部分路段适合骑行，请注意交通安全",
      steps: steps,
      restPoints: [
        {
          name: "沿途休息点",
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
  } catch (error) {
    console.error("获取骑行路线错误:", error);
    throw new Error("获取骑行路线失败，请稍后重试");
  }
};

/**
 * 获取旅游攻略
 * 
 * @param destination 目的地
 * @param travelDate 旅行日期
 * @returns 旅游攻略
 */
export const getTravelGuide = async (destination: string, travelDate: Date): Promise<TravelGuide> => {
  try {
    // 1. 地理编码：将目的地转换为地理位置
    const destGeocode = await geocodeAddress(destination);
    
    // 2. 获取目的地天气信息
    // 示例：使用mcp_amap_amap_sse_maps_weather函数
    // const weatherResult = await mcp_amap_amap_sse_maps_weather({ city: destGeocode.adcode });
    
    // 3. 获取目的地的景点POI
    // 示例：使用mcp_amap_amap_sse_maps_text_search函数搜索景点
    // const poiResult = await mcp_amap_amap_sse_maps_text_search({ 
    //   keywords: `${destination} 景点`, 
    //   city: destGeocode.city,
    //   citylimit: true
    // });
    
    // 4. 组织景点为合理的行程安排
    
    // 示例数据（实际项目中应根据API返回数据生成）
    const formattedDate = travelDate.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
    
    // 模拟天气数据
    const mockWeather = ['晴朗，22°C/16°C，微风', '多云，24°C/18°C，东南风3级', '小雨，20°C/15°C，南风2级'];
    const randomWeather = mockWeather[Math.floor(Math.random() * mockWeather.length)];
    
    return {
      title: `${destination}一日游`,
      date: formattedDate,
      weather: randomWeather,
      overview: `${destination}是一个充满魅力的旅游目的地，拥有丰富的历史文化和自然景观。这份一日游攻略将帮助您高效地游览${destination}的主要景点，体验当地特色美食和文化。`,
      schedule: [
        { 
          time: '09:00-11:00', 
          activity: '游览故宫', 
          location: '故宫博物院', 
          details: '门票：60元/人，建议提前网上预订' 
        },
        // 更多行程安排...
      ],
      transportation: [
        { 
          from: '故宫', 
          to: '簋街', 
          method: '地铁', 
          details: '乘坐地铁1号线从天安门东站到东单站，换乘5号线到东四站，步行10分钟' 
        },
        // 更多交通信息...
      ],
      accommodation: {
        name: '北京国际酒店',
        address: '北京市东城区东长安街9号',
        checkin: '15:00',
        checkout: '12:00',
        price: '约600-800元/晚'
      },
      tips: [
        '携带有效身份证件，某些景点需要实名购票',
        '下载"北京地铁"APP方便出行',
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
  } catch (error) {
    console.error("获取旅游攻略错误:", error);
    throw new Error("获取旅游攻略失败，请稍后重试");
  }
};

// 示例：如何调用高德地图API

// 示例1：地址转换为经纬度
// export const geoCodeExample = async () => {
//   try {
//     const result = await mcp_amap_amap_sse_maps_geo({
//       address: "北京市朝阳区阜通东大街6号",
//       city: "北京"
//     });
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw new Error("地理编码失败");
//   }
// };

// 示例2：驾车路线规划
// export const drivingRouteExample = async () => {
//   try {
//     const result = await mcp_amap_amap_sse_maps_direction_driving({
//       origin: "116.481028,39.989643",
//       destination: "116.434446,39.90816"
//     });
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw new Error("获取驾车路线失败");
//   }
// };

// 示例3：步行路线规划
// export const walkingRouteExample = async () => {
//   try {
//     const result = await mcp_amap_amap_sse_maps_direction_walking({
//       origin: "116.481028,39.989643",
//       destination: "116.434446,39.90816"
//     });
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw new Error("获取步行路线失败");
//   }
// };

// 示例4：骑行路线规划
// export const bicyclingRouteExample = async () => {
//   try {
//     const result = await mcp_amap_amap_sse_maps_direction_bicycling({
//       origin: "116.481028,39.989643",
//       destination: "116.434446,39.90816"
//     });
//     return result;
//   } catch (error) {
//     console.error(error);
//     throw new Error("获取骑行路线失败");
//   }
// };

export default {
  geocodeAddress,
  getDrivingRoute,
  getWalkingRoute,
  getBicyclingRoute,
  getTravelGuide
}; 