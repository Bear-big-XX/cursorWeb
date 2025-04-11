import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ArticleCardBackground from '../components/ArticleCardBackground';

const Home: React.FC = () => {
  const MotionBox = motion(Box);
  const MotionTypography = motion(Typography);

  const recentPosts = [
    {
      title: '我的技术栈分享',
      description: '分享我作为软件工程师使用的主要技术栈和工具...',
      type: 'tech-stack',
    },
    {
      title: '最新项目经验',
      description: '记录我最近参与的一个有趣项目的经验和收获...',
      type: 'project',
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'background.default' }}>
          <MotionTypography
            variant="h2"
            gutterBottom
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            你好，我是一名软件工程师
          </MotionTypography>
          <Typography variant="h5" color="text.secondary" paragraph>
            欢迎来到我的个人博客，这里记录着我的技术成长之路
          </Typography>
          <Button variant="contained" color="primary" size="large">
            了解更多
          </Button>
        </Paper>
      </MotionBox>

      <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 4 }}>
        最新文章
      </Typography>

      <Grid container spacing={4}>
        {recentPosts.map((post, index) => (
          <Grid key={index} item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card sx={{ height: '100%' }}>
                <ArticleCardBackground type={post.type as 'tech-stack' | 'project'}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '60px 20px 20px 20px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                    }}
                  >
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {post.title}
                    </Typography>
                  </Box>
                </ArticleCardBackground>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.description}
                  </Typography>
                  <Button size="small" color="primary" sx={{ mt: 2 }}>
                    阅读更多
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 