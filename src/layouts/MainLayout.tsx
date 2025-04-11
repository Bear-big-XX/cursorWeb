import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, useTheme, useMediaQuery, Tooltip, Collapse } from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  Person as PersonIcon, 
  Article as ArticleIcon, 
  Code as CodeIcon, 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon, 
  GitHub as GitHubIcon,
  Celebration as CelebrationIcon,
  Favorite as FavoriteIcon,
  TextFields as TextIcon,
  ExpandLess,
  ExpandMore,
  WatchLater as ClockIcon,
  Brush as BrushIcon,
  CloudQueue as CloudQueueIcon,
  Hub as PortalIcon,
  Explore as ExploreIcon,
  Map as MapIcon,
  DirectionsCar as CarIcon,
  DirectionsWalk as WalkIcon,
  DirectionsBike as BikeIcon
} from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../App';
import ParticlesBackground from '../components/ParticlesBackground';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  items?: {
    text: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const colorMode = React.useContext(ColorModeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      text: '首页',
      path: '/',
      icon: <HomeIcon />,
    },
    {
      text: '关于我',
      path: '/about',
      icon: <PersonIcon />,
    },
    {
      text: '博客文章',
      path: '/blog',
      icon: <ArticleIcon />,
    },
    {
      text: '项目展示',
      path: '/projects',
      icon: <CodeIcon />,
    },
    {
      text: '旅游攻略',
      path: '/travel',
      icon: <ExploreIcon />,
    },
    {
      text: '整活',
      path: '/fun',
      icon: <CloudQueueIcon />,
      items: [
        { text: '心形动画', path: '/fun/heart', icon: <FavoriteIcon /> },
        { text: '黑客帝国', path: '/fun/matrix', icon: <CodeIcon /> },
        { text: '赛博朋克', path: '/fun/cyber-rain', icon: <CloudQueueIcon /> },
        { text: '量子传送', path: '/fun/quantum-portal', icon: <PortalIcon /> },
        { text: '时间漩涡', path: '/fun/time-vortex', icon: <ClockIcon /> },
        { text: '混沌实验室', path: '/fun/chaos-lab', icon: <BrushIcon /> },
      ],
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string, hasSubItems?: boolean) => {
    if (hasSubItems) {
      setExpandedMenu(expandedMenu === path ? null : path);
    } else {
      navigate(path);
      setMobileOpen(false);
    }
  };

  // 检查当前路径是否是菜单项或其子项
  const isMenuActive = (item: MenuItem) => {
    if (location.pathname === item.path) return true;
    if (item.items && item.items.some(sub => location.pathname === sub.path)) return true;
    return false;
  };

  // 检查当前路径是否是子菜单项
  const isSubMenuActive = (path: string) => location.pathname === path;

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const isActive = isMenuActive(item);
          
          return (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleMenuClick(item.path, !!item.items)}
                  selected={isActive}
                  sx={{
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    bgcolor: expandedMenu === item.path ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(144, 202, 249, 0.16)' 
                        : 'rgba(25, 118, 210, 0.16)',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(144, 202, 249, 0.24)' 
                          : 'rgba(25, 118, 210, 0.24)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '4px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '0 4px 4px 0',
                      },
                    },
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? theme.palette.primary.main : 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'regular',
                    }}
                  />
                  {item.items && (expandedMenu === item.path ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.items && expandedMenu === item.path && (
                <List component="div" disablePadding>
                  {item.items.map((subItem) => {
                    const isSubActive = isSubMenuActive(subItem.path);
                    
                    return (
                      <ListItemButton
                        key={subItem.text}
                        sx={{ 
                          pl: 4,
                          py: 1.2,
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          ml: 1,
                          borderRadius: '0 8px 8px 0',
                          '&.Mui-selected': {
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(144, 202, 249, 0.16)' 
                              : 'rgba(25, 118, 210, 0.16)',
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' 
                                ? 'rgba(144, 202, 249, 0.24)' 
                                : 'rgba(25, 118, 210, 0.24)',
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: '10%',
                              height: '80%',
                              width: '3px',
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: '0 4px 4px 0',
                            },
                          },
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.08)' 
                              : 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                        selected={isSubActive}
                        onClick={() => handleMenuClick(subItem.path)}
                      >
                        <ListItemIcon 
                          sx={{ 
                            color: isSubActive ? theme.palette.primary.main : 'inherit',
                            minWidth: 36,
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{
                            fontWeight: isSubActive ? 'bold' : 'regular',
                            fontSize: '0.95rem',
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ParticlesBackground />
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(10, 25, 41, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #90caf9 0%, #64b5f6 100%)'
                : 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            个人博客
          </Typography>
          <Tooltip title="访问我的 GitHub">
            <IconButton
              color="inherit"
              href="https://github.com/Bear-big-XX"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                mr: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <GitHubIcon sx={{ 
                fontSize: '1.4rem',
                color: theme.palette.mode === 'dark' 
                  ? 'white' 
                  : theme.palette.grey[800],
                filter: theme.palette.mode === 'light' 
                  ? 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))' 
                  : 'none'
              }} />
            </IconButton>
          </Tooltip>
          <IconButton
            sx={{ 
              ml: 1,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'rotate(30deg)',
              }
            }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === 'dark' 
              ? <LightModeIcon sx={{ fontSize: '1.4rem' }} /> 
              : <DarkModeIcon sx={{ 
                  fontSize: '1.4rem', 
                  color: theme.palette.grey[800],
                  filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))'
                }} />
            }
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                width: drawerWidth,
                bgcolor: 'background.default',
                borderRight: 'none',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '2px 0 10px rgba(0,0,0,0.3)' 
                  : '2px 0 10px rgba(0,0,0,0.1)',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                bgcolor: 'background.default',
                borderRight: 'none',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '2px 0 10px rgba(0,0,0,0.3)' 
                  : '2px 0 10px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.3s ease',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.03) 0%, transparent 70%)',
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 