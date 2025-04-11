import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Container,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  tags: string[];
  readTime: string;
}

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Java微服务架构实践',
      description: '探讨如何使用Spring Cloud构建可扩展的微服务架构，包括服务注册、发现、配置管理等核心概念。',
      date: '2024-03-15',
      image: '/images/blog/microservices.jpg',
      tags: ['Java', 'Spring Cloud', 'Microservices'],
      readTime: '10分钟',
    },
    {
      id: 2,
      title: 'Docker容器化部署指南',
      description: '详细介绍如何使用Docker容器化你的Java应用，包括最佳实践和常见问题解决方案。',
      date: '2024-03-10',
      image: '/images/blog/docker.jpg',
      tags: ['Docker', 'DevOps', 'Container'],
      readTime: '8分钟',
    },
    {
      id: 3,
      title: 'Redis高可用方案设计',
      description: '深入探讨Redis集群搭建、主从复制、哨兵模式等高可用方案的实现。',
      date: '2024-03-05',
      image: '/images/blog/redis.jpg',
      tags: ['Redis', 'Cache', 'High Availability'],
      readTime: '12分钟',
    },
    {
      id: 4,
      title: 'K8s集群管理实战',
      description: '分享在生产环境中使用Kubernetes管理容器集群的经验和最佳实践。',
      date: '2024-02-28',
      image: '/images/blog/kubernetes.jpg',
      tags: ['Kubernetes', 'Container Orchestration', 'DevOps'],
      readTime: '15分钟',
    }
  ];

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 搜索框 */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 文章列表 */}
      <Grid container spacing={4}>
        {filteredPosts.map((post, index) => (
          <Grid key={post.id} item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                      {post.date}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      阅读时间：{post.readTime}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        onClick={() => setSearchTerm(tag)}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 无搜索结果提示 */}
      {filteredPosts.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            没有找到相关文章
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Blog; 