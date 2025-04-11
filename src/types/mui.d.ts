import { GridProps as MuiGridProps } from '@mui/material';

declare module '@mui/material/Grid' {
  interface GridProps extends MuiGridProps {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
  }
} 