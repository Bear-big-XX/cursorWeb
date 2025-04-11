import React from 'react';
import { Box, Typography, Paper, Grid, Chip, LinearProgress, Avatar, Divider, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Code as CodeIcon, 
  School as SchoolIcon, 
  Work as WorkIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

const About: React.FC = () => {
  const MotionPaper = motion(Paper);

  const skills = [
    { 
      name: 'Java', 
      level: 90,
      color: '#ff6b6b',
      description: '主要开发语言，擅长Spring全家桶、微服务架构'
    },
    { 
      name: 'MySQL', 
      level: 85,
      color: '#4ecdc4',
      description: '精通数据库设计、性能优化、分库分表'
    },
    { 
      name: 'Redis', 
      level: 88,
      color: '#45b7d1',
      description: '熟悉缓存架构、集群部署、性能调优'
    },
    { 
      name: 'RabbitMQ', 
      level: 82,
      color: '#96ceb4',
      description: '掌握消息队列原理、异步通信设计'
    },
    { 
      name: 'Docker', 
      level: 85,
      color: '#ffeead',
      description: '容器化部署、镜像构建、Docker Compose'
    },
    { 
      name: 'Kubernetes', 
      level: 80,
      color: '#ff9999',
      description: '集群管理、服务编排、自动化部署'
    },
  ];

  const experiences = [
    {
      title: '高级软件工程师',
      company: '某科技公司',
      period: '2020 - 至今',
      description: '负责核心业务系统的开发和维护，带领团队完成多个重要项目。主要成就：',
      achievements: [
        '设计并实现了基于微服务架构的电商平台，支持百万级用户访问',
        '优化系统性能，将接口响应时间降低50%，提升用户体验',
        '建立完整的CI/CD流程，实现自动化部署和测试',
      ]
    },
    {
      title: '软件工程师',
      company: '某互联网公司',
      period: '2018 - 2020',
      description: '参与企业级应用开发，负责核心功能实现。主要成就：',
      achievements: [
        '实现高性能缓存系统，解决了系统性能瓶颈',
        '设计消息队列架构，提升系统可用性和可扩展性',
        '推动团队采用容器化部署，提高了部署效率',
      ]
    },
  ];

  const interests = [
    '技术创新',
    '开源项目',
    '系统架构',
    '性能优化',
    '技术分享',
    '持续学习'
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* 个人简介部分 */}
        <Grid item xs={12}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={2}
            sx={{ p: 4, textAlign: 'center' }}
          >
            <Box
              component="img"
              src="/images/avatar/my-avatar.jpg"
              alt="个人头像"
              sx={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                margin: '0 auto 20px',
                objectFit: 'cover',
                boxShadow: 6,
                border: '4px solid',
                borderColor: 'primary.main',
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              软件开发工程师
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 800, margin: '0 auto' }}>
              热爱编程，专注于分布式系统和微服务架构设计。
              致力于创建高性能、可扩展的企业级解决方案，持续学习新技术，追求代码的优雅和系统的高可用性。
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Chip icon={<LocationIcon />} label="中国" color="primary" variant="outlined" />
              <Chip icon={<GitHubIcon />} 
                label="GitHub" 
                component={Link}
                href="https://github.com/Bear-big-XX"
                target="_blank"
                clickable
                color="primary" 
                variant="outlined" 
              />
              <Chip icon={<EmailIcon />} label="联系我" color="primary" variant="outlined" />
            </Box>
            <Divider sx={{ my: 2 }}>
              <Chip label="技术标签" color="primary" />
            </Divider>
            <Box sx={{ mt: 2, mb: 2 }}>
              {['Java', 'MySQL', 'Redis', 'RabbitMQ', 'Docker', 'K8s'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{ 
                    m: 0.5, 
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </MotionPaper>
        </Grid>

        {/* 技能部分 */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            elevation={2}
            sx={{ p: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CodeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>技术技能</Typography>
            </Box>
            {skills.map((skill) => (
              <Box key={skill.name} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{skill.name}</Typography>
                  <Typography variant="body2" sx={{ color: skill.color }}>
                    {skill.level}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={skill.level}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: `${skill.color}22`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: skill.color,
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                  {skill.description}
                </Typography>
              </Box>
            ))}
          </MotionPaper>
        </Grid>

        {/* 工作经验部分 */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            elevation={2}
            sx={{ p: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WorkIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>工作经验</Typography>
            </Box>
            {experiences.map((exp, index) => (
              <Box key={index} sx={{ 
                mb: 4, 
                '&:last-child': { mb: 0 },
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                boxShadow: 1,
              }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {exp.title}
                </Typography>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ opacity: 0.8 }}>
                  {exp.company} | {exp.period}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {exp.description}
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  {exp.achievements.map((achievement, i) => (
                    <Typography key={i} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {achievement}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </MotionPaper>
        </Grid>

        {/* 教育背景部分 */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            elevation={2}
            sx={{ p: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>教育背景</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                计算机科学与技术
              </Typography>
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ opacity: 0.8 }}>
                某知名大学
              </Typography>
              <Typography variant="body2" color="text.secondary">
                主修课程：数据结构、算法分析、操作系统、数据库系统、软件工程等
              </Typography>
            </Box>
          </MotionPaper>
        </Grid>

        {/* 兴趣爱好部分 */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            elevation={2}
            sx={{ p: 4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FavoriteIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>兴趣方向</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About; 