import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Container,
} from '@mui/material';
import { GitHub as GitHubIcon, Launch as LaunchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: '分布式电商系统',
      description: '基于Spring Cloud的微服务架构电商平台，实现了用户管理、商品管理、订单处理、支付集成等核心功能。采用Redis进行缓存优化，RabbitMQ处理异步消息。',
      image: '/images/projects/ecommerce.jpg',
      technologies: ['Java', 'Spring Cloud', 'MySQL', 'Redis', 'RabbitMQ'],
      githubUrl: 'https://github.com/yourusername/ecommerce-platform',
      demoUrl: 'https://demo.example.com/ecommerce'
    },
    {
      id: 2,
      title: '容器化部署平台',
      description: '基于Kubernetes的容器化部署平台，支持应用的自动化部署、扩展和管理。整合了CI/CD流程，实现了自动化构建和部署。',
      image: '/images/projects/container-platform.jpg',
      technologies: ['Kubernetes', 'Docker', 'Jenkins', 'Helm'],
      githubUrl: 'https://github.com/yourusername/container-platform'
    },
    {
      id: 3,
      title: '高性能缓存系统',
      description: '基于Redis集群的分布式缓存系统，实现了数据分片、主从复制、故障转移等功能。显著提升了系统性能和可用性。',
      image: '/images/projects/cache-system.jpg',
      technologies: ['Redis', 'Java', 'Spring Boot'],
      githubUrl: 'https://github.com/yourusername/cache-system'
    },
    {
      id: 4,
      title: '消息队列中间件',
      description: '基于RabbitMQ的消息中间件系统，实现了消息的可靠投递、死信队列、延迟队列等功能。支持多种消息模式和场景。',
      image: '/images/projects/message-queue.jpg',
      technologies: ['RabbitMQ', 'Java', 'Spring AMQP'],
      githubUrl: 'https://github.com/yourusername/message-queue-system'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        项目展示
      </Typography>

      <Grid container spacing={4}>
        {projects.map((project, index) => (
          <Grid key={project.id} item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {project.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  {project.githubUrl && (
                    <Button
                      size="small"
                      startIcon={<GitHubIcon />}
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      源代码
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button
                      size="small"
                      startIcon={<LaunchIcon />}
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      在线演示
                    </Button>
                  )}
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects; 