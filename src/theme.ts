"use client";
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A', // Navy/Dark Slate for primary buttons and text
      light: '#334155',
    },
    secondary: {
      main: '#3B82F6', // The bright "Action Blue" seen in modern SaaS tools
    },
    background: {
      default: '#F8FAFC', // Very light grey background
      paper: '#FFFFFF',  // Pure white cards
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  shape: {
    borderRadius: 8, // Softer, more modern corners than the default 4px
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.25rem', color: '#0F172A' },
    h2: { fontWeight: 700, fontSize: '1.875rem', color: '#0F172A' },
    h6: { fontWeight: 600, fontSize: '1.125rem' },
    button: {
      textTransform: 'none', // Critical for the modern look
      fontWeight: 600,
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0', // Matches your divider color
          borderRadius: '8px',          // Matches your shape.borderRadius
          backgroundColor: '#FFFFFF',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#F8FAFC', // Matches background.default
            borderBottom: '1px solid #E2E8F0',
            fontWeight: 700,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #E2E8F0',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #E2E8F0',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
        },
      },
    },
  },
});

export default theme;